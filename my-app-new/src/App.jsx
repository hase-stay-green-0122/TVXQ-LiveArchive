import { useState, useMemo, useEffect } from "react";
import { isOwnerEmail, normalizeEmail, watchAuth } from "./lib/firebase.js";
import { subscribeMembers, subscribeArchive, migrateLegacyIfNeeded, createTour, updateTour, deleteTour, deleteLive } from "./lib/store.js";
import { AddMenu, AddForm } from "./components/AddForms.jsx";
import { LoadingScreen, MessageScreen, LoginScreen, NotInvitedScreen, UserBar, MembersDialog } from "./components/Auth.jsx";
import { Silhouette } from "./components/Common.jsx";
import { LiveModal } from "./components/LiveDetail.jsx";
import { TourCard } from "./components/TourCard.jsx";
import { AddTourForm } from "./components/TourForms.jsx";
import { T_DOTS } from "./constants.js";
import { buildInitialAllLives } from "./data/initialData.js";
import { CSS } from "./styles.js";

// ─────────────────────────────────────────────
//  メインアプリ
// ─────────────────────────────────────────────

// 全画面で共通のスタイルを読み込む
const Shell = ({ children }) => <><style>{CSS}</style>{children}</>;

// 公演の並び順：日付順（未設定は最後）→ 登録順
const liveSortKey = (l) => (/^\d{4}\.\d{2}\.\d{2}$/.test(l.date || "") ? l.date : "9999");

const compareLives = (a, b) =>
  liveSortKey(a).localeCompare(liveSortKey(b)) || (a.order ?? 0) - (b.order ?? 0);

const entryTime = (e) => e.updatedAt?.toMillis?.() ?? 0;

export default function App() {
  const [authState, setAuthState] = useState({ loading: true, user: null });
  useEffect(() => watchAuth(user => setAuthState({ loading: false, user })), []);

  if (authState.loading) return <Shell><LoadingScreen/></Shell>;
  if (!authState.user)   return <Shell><LoginScreen/></Shell>;
  return <Shell><MemberGate key={authState.user.uid} user={authState.user}/></Shell>;
}

// 招待メンバーかどうかを確認する（招待されていない人は config/members を読めない）
function MemberGate({ user }) {
  const isOwner = isOwnerEmail(user.email);
  const [members, setMembers] = useState({ status: "loading", emails: [] });

  useEffect(() => subscribeMembers(
    emails => setMembers({ status: "ok", emails }),
    err => {
      console.error("メンバー情報の取得に失敗:", err);
      setMembers({ status: err.code === "permission-denied" ? "denied" : "error", emails: [] });
    },
  ), []);

  if (members.status === "loading") return <LoadingScreen message="メンバーを確認しています…"/>;
  if (members.status === "denied")  return <NotInvitedScreen user={user}/>;
  if (members.status === "error")   return <MessageScreen message={"データの読み込みに失敗しました。\n接続を確認してください。"}/>;
  // 一覧から外されたメンバーは、ルール上データを読めなくなる
  if (!isOwner && !members.emails.includes(normalizeEmail(user.email))) return <NotInvitedScreen user={user}/>;
  return <Archive user={user} isOwner={isOwner} members={members.emails}/>;
}

function Archive({ user, isOwner, members }) {
  const [tours,   setTours]   = useState(null);
  const [lives,   setLives]   = useState(null);
  const [entries, setEntries] = useState(null);
  const [error,   setError]   = useState(null);
  const [migrating, setMigrating] = useState(isOwner);

  const [selectedId,  setSelectedId]  = useState(null);
  const [showMenu,    setShowMenu]    = useState(false);
  const [showAdd,     setShowAdd]     = useState(false);
  const [showAddTour, setShowAddTour] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  // オーナーの初回ログイン時に、旧データ(archive/allLives)を新しい構造へ移行
  useEffect(() => {
    if (!isOwner) return;
    let alive = true;
    migrateLegacyIfNeeded(user, buildInitialAllLives)
      .catch(err => {
        console.error("データ移行に失敗:", err);
        if (alive) setError("データの移行に失敗しました。ページを再読み込みしてください。");
      })
      .finally(() => { if (alive) setMigrating(false); });
    return () => { alive = false; };
  }, [isOwner, user]);

  // リアルタイム購読：他のメンバーの変更もすぐに画面へ反映される
  useEffect(() => subscribeArchive({
    onTours: setTours, onLives: setLives, onEntries: setEntries,
    onError: err => {
      console.error("データの購読に失敗:", err);
      setError("データの読み込みに失敗しました。接続を確認してください。");
    },
  }), []);

  const allTours = useMemo(() => {
    if (!tours || !lives) return [];
    const byTour = new Map(tours.map(t => [t.id, { ...t, lives: [] }]));
    [...lives].sort(compareLives).forEach(l => byTour.get(l.tourId)?.lives.push(l));
    return [...byTour.values()].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [tours, lives]);

  // 公演ごとの記録（自分の記録が先頭、あとは更新が新しい順）
  const entriesByLive = useMemo(() => {
    const map = new Map();
    (entries || []).forEach(e => {
      if (!map.has(e.liveId)) map.set(e.liveId, []);
      map.get(e.liveId).push(e);
    });
    map.forEach(list => list.sort((a, b) =>
      (b.uid === user.uid) - (a.uid === user.uid) || entryTime(b) - entryTime(a)));
    return map;
  }, [entries, user.uid]);

  if (error) return <MessageScreen message={error}/>;
  if (migrating || !tours || !lives || !entries) return <LoadingScreen/>;

  const selectedTour = selectedId && allTours.find(t => t.lives.some(l => l.id === selectedId));
  const selectedLive = selectedTour && selectedTour.lives.find(l => l.id === selectedId);

  const totalLives = lives.length;
  const totalSongs = lives.reduce((s, l) => s + (l.songs || []).length, 0);

  const run = async (fn, message) => {
    try { await fn(); }
    catch (err) {
      console.error(message, err);
      alert(`${message}通信状況を確認して、もう一度お試しください。`);
    }
  };

  const handleLiveDelete = (liveId) =>
    run(() => deleteLive(liveId, entries), "削除に失敗しました。");
  const handleTourDelete = (tourId) =>
    run(() => deleteTour(tourId, lives, entries), "削除に失敗しました。");
  const handleTourUpdate = (tourId, changes) =>
    run(() => updateTour(user, tourId, changes), "保存に失敗しました。");
  const handleTourSave = (tourMeta) => {
    run(() => createTour(user, tourMeta), "保存に失敗しました。");
    setShowAddTour(false);
  };

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-vis">
          <div className="hdr-aktf"><span>Always Keep the Faith</span></div>
          <div className="hdr-tdots">
            {T_DOTS.map(({key,lit,color}) => (
              <div key={key} className="hdr-dot" style={{background:lit?color:"rgba(255,255,255,.04)",opacity:lit?.8:1}}/>
            ))}
          </div>
          <Silhouette/>
        </div>
        <div className="hdr-body">
          <div className="hdr-sub">東方神起 - TVXQ! LIVE ARCHIVE</div>
          <UserBar user={user} isOwner={isOwner} onOpenMembers={() => setShowMembers(true)}/>
          <div className="hdr-row">
            <div className="stats">
              <div><div className="stat-n">{totalLives}</div><div className="stat-l">LIVES</div></div>
              <div><div className="stat-n">{totalSongs}</div><div className="stat-l">SONGS</div></div>
              <div><div className="stat-n">{allTours.length}</div><div className="stat-l">TOURS</div></div>
              <div><div className="stat-n">{members.length + 1}</div><div className="stat-l">MEMBERS</div></div>
            </div>
            <button className="add-btn" onClick={() => { setShowMenu(true); setSelectedId(null); }}>＋</button>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="sec-lbl">ツアー</div>
        {allTours.length === 0 && (
          <div className="empty" style={{fontSize:13,padding:"8px 2px"}}>まだツアーがありません。右上の「＋」から追加できます。</div>
        )}
        {allTours.map(tour => (
          <TourCard key={tour.id} tour={tour}
            isOwner={isOwner}
            myUid={user.uid}
            entriesByLive={entriesByLive}
            onLiveSelect={(live) => { setSelectedId(live.id); setShowMenu(false); }}
            onLiveDelete={handleLiveDelete}
            onTourDelete={handleTourDelete}
            onTourUpdate={handleTourUpdate}
          />
        ))}
      </div>
      {selectedLive && (
        <LiveModal
          key={selectedLive.id}
          live={selectedLive}
          tour={selectedTour}
          entries={entriesByLive.get(selectedLive.id) || []}
          user={user}
          onClose={() => setSelectedId(null)}
        />
      )}
      {showMenu && (
        <AddMenu
          onClose={() => setShowMenu(false)}
          onSelectLive={() => { setShowMenu(false); setShowAdd(true); }}
          onSelectTour={() => { setShowMenu(false); setShowAddTour(true); }}
        />
      )}
      {showAdd && (
        <AddForm
          user={user}
          onClose={() => setShowAdd(false)}
          allTours={allTours}
        />
      )}
      {showAddTour && (
        <AddTourForm
          onClose={() => setShowAddTour(false)}
          onSaveTour={handleTourSave}
        />
      )}
      {showMembers && isOwner && (
        <MembersDialog members={members} onClose={() => setShowMembers(false)}/>
      )}
    </div>
  );
}

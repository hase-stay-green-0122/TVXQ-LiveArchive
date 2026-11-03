// 公演詳細：セットリスト・座席マップ・みんなの記録
import { useState } from "react";
import { EMPTY_MEMORY } from "../lib/store.js";
import { MEM_FIELDS } from "../constants.js";
import { EditForm } from "./EditForm.jsx";
import { MemorySection, TipsSection } from "./MemoryTips.jsx";
import { PhotoImg } from "./Photos.jsx";

export function Setlist({ songs }) {
  const firstEncore = songs.findIndex(s => s.e);
  return (
    <ul className="setlist">
      {songs.map((s, i) => {
        const enc = !!s.e;
        let div = null;
        if (i === firstEncore) {
          div = <li key="enc"><div className="enc-div"><div className="enc-line"/><span className="enc-lbl">― アンコール ―</span><div className="enc-line"/></div></li>;
        }
        return [div, <li key={s.n} className="sl-item"><span className="sl-num">{s.n}</span><div className="sl-name">{s.t}</div>{enc&&<span className="sl-enc">ENCORE</span>}</li>];
      })}
    </ul>
  );
}

export function StadiumMap({ highlight, seat }) {
  const RED="#e8112d", S1="#2a1010", S2="#3a1515", AR="#1a2a1a", ST="#c9a84c";
  const hl = id => highlight===id ? RED : undefined;
  const PX = {W1F:65,W2F:39,E1F:255,E2F:281,N1F:160,N2F:160,S1F:160,S2F:160,arena:160};
  const PY = {W1F:148,W2F:148,E1F:148,E2F:148,N1F:56,N2F:31,S1F:240,S2F:265,arena:148};
  const LB = [
    {x:160,y:14,lbl:"N 2F",id:"N2F"},{x:160,y:38,lbl:"N 1F",id:"N1F"},
    {x:160,y:284,lbl:"S 2F",id:"S2F"},{x:160,y:260,lbl:"S 1F",id:"S1F"},
    {x:19,y:150,lbl:"W",id:"W2F",rot:-90},{x:38,y:150,lbl:"W",id:"W1F",rot:-90},
    {x:301,y:150,lbl:"E",id:"E2F",rot:90},{x:282,y:150,lbl:"E",id:"E1F",rot:90},
  ];
  return (
    <div className="seat-map">
      <svg viewBox="0 0 320 300" width="100%" style={{display:"block", maxWidth:"240px", margin:"0 auto"}}>
        <ellipse cx="160" cy="148" rx="148" ry="132" fill="#0d0404" stroke="#3a1515" strokeWidth="2"/>
        <path d="M26 100 Q12 148 26 196 L52 186 Q40 148 52 110Z" fill={hl("W2F")||S2}/>
        <path d="M294 100 Q308 148 294 196 L268 186 Q280 148 268 110Z" fill={hl("E2F")||S2}/>
        <path d="M80 18 Q160 4 240 18 L228 44 Q160 30 92 44Z" fill={hl("N2F")||S2}/>
        <path d="M80 278 Q160 292 240 278 L228 252 Q160 266 92 252Z" fill={hl("S2F")||S2}/>
        <path d="M52 110 Q40 148 52 186 L78 174 Q66 148 78 122Z" fill={hl("W1F")||S1}/>
        <path d="M268 110 Q280 148 268 186 L242 174 Q254 148 242 122Z" fill={hl("E1F")||S1}/>
        <path d="M92 44 Q160 30 228 44 L218 68 Q160 56 102 68Z" fill={hl("N1F")||S1}/>
        <path d="M92 252 Q160 266 228 252 L218 228 Q160 240 102 228Z" fill={hl("S1F")||S1}/>
        <ellipse cx="160" cy="148" rx="80" ry="80" fill={hl("arena")||AR} stroke="#1a2a1a" strokeWidth="1"/>
        <rect x="118" y="208" width="84" height="22" rx="4" fill={ST} opacity=".9"/>
        <text x="160" y="223" textAnchor="middle" fontSize="9" fill="#1c0a0c" fontFamily="sans-serif" fontWeight="bold" letterSpacing="2">STAGE</text>
        {LB.map(s => (
          <text key={s.id} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontFamily="sans-serif"
            fill={highlight===s.id?"#fff":"rgba(255,255,255,0.4)"} fontWeight={highlight===s.id?"bold":"normal"}
            transform={s.rot?`rotate(${s.rot},${s.x},${s.y})`:undefined}>{s.lbl}</text>
        ))}
        <text x="160" y="130" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">ARENA</text>
        {highlight && PX[highlight] && <>
          <circle cx={PX[highlight]} cy={PY[highlight]} r="7" fill={RED} opacity=".9"/>
          <text x={PX[highlight]} y={PY[highlight]} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#fff" fontWeight="bold" fontFamily="sans-serif">★</text>
        </>}
      </svg>
      <div className="seat-info">{seat ? <strong>{seat}</strong> : <span>座席情報は未設定です</span>}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  モーダル群（全て同じセクション順で統一）
//  順番：①セットリスト ②座席 ③写真 ④思い出メモ ⑤Tips
// ─────────────────────────────────────────────

// 一人分の記録（座席・写真・思い出・Tips）
export function EntryCard({ entry, isMine, isFeatured, onEdit }) {
  const memory    = entry.memory || EMPTY_MEMORY;
  const hasMemory = MEM_FIELDS.some(f => (memory[f.key] || "").trim());
  const photos    = entry.photos || [];
  const tips      = entry.tips || [];
  return (
    <div className={"entry-card" + (isMine ? " mine" : "")}>
      <div className="entry-hdr">
        {entry.photoURL
          ? <img className="entry-avatar" src={entry.photoURL} alt="" referrerPolicy="no-referrer"/>
          : <span className="entry-avatar entry-avatar-ph">👤</span>}
        <span className="entry-name">{entry.name}</span>
        {isMine && <span className="entry-me">あなた</span>}
        {isMine && <button className="entry-edit" onClick={onEdit}>✏️ 編集</button>}
      </div>
      <div className="entry-sub">座席位置</div>
      {isFeatured && (entry.seat || entry.highlight)
        ? <StadiumMap highlight={entry.highlight} seat={entry.seat}/>
        : <div className="entry-seat">{entry.seat || "座席情報は未設定です"}</div>}
      {photos.length > 0 && <>
        <div className="entry-sub">フォト</div>
        <div className="photos">
          {photos.map((p,i) => <div key={p+i} className="photo"><PhotoImg src={p}/></div>)}
        </div>
      </>}
      <div className="entry-sub">思い出メモ</div>
      {hasMemory
        ? <MemorySection memory={memory} hideEmpty/>
        : <div className="empty" style={{fontSize:13}}>まだ記録されていません…</div>}
      {tips.length > 0 && <>
        <div className="entry-sub">Live を楽しむための Tips</div>
        <TipsSection tips={tips}/>
      </>}
    </div>
  );
}

// ── 公演詳細モーダル ──
// live・entries は App のリアルタイム購読から渡されるので、他の人の更新も即座に反映される
export function LiveModal({ live, tour, entries, user, onClose }) {
  const isFeatured = !!tour.featured;
  const [editing, setEditing] = useState(false);
  const myEntry = entries.find(e => e.uid === user.uid) || null;
  const others  = entries.filter(e => e.uid !== user.uid);

  if (editing) return (
    <EditForm
      live={live}
      myEntry={myEntry}
      user={user}
      onClose={() => setEditing(false)}
      onGoHome={onClose}
    />
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>ホームに戻る</button>
            <div className="nav-right">
              <button className="edit-btn" onClick={() => setEditing(true)}>✏️ 編集</button>
            </div>
          </div>
        </div>
        <div className={"mhero "+(isFeatured?"red":"dark")}>
          <div>
            <div className="mdate">{live.dateLabel||live.date}</div>
            <div className="mtitle">{tour.name}</div>
            {tour.sub && <div className="msub">{tour.sub}</div>}
            <div className="mvenue">📍 {live.venue}</div>
            {(live.open || live.start) && (
              <div className="mtime-row">
                {live.open  && <div className="mtime">開場 <b>{live.open}</b></div>}
                {live.start && <div className="mtime">開演 <b>{live.start}</b></div>}
              </div>
            )}
          </div>
          <div className="mhero-wm">{tour.name}</div>
        </div>
        {/* ①セットリスト（みんなで共有） */}
        <div className="msec">
          <div className="msec-ttl">セットリスト<span style={{fontSize:10,color:"rgba(28,10,12,0.3)",fontWeight:"normal",marginLeft:"auto",paddingLeft:8}}>全{(live.songs||[]).length}曲</span></div>
          {(live.songs||[]).length > 0
            ? <Setlist songs={live.songs}/>
            : <div className="empty" style={{fontSize:13}}>セットリストは未登録です</div>}
        </div>
        {/* ②〜⑤ 一人ひとりの記録 */}
        <div className="msec">
          <div className="msec-ttl">みんなの記録<span style={{fontSize:10,color:"rgba(28,10,12,0.3)",fontWeight:"normal",marginLeft:"auto",paddingLeft:8}}>{entries.length}人</span></div>
          {myEntry
            ? <EntryCard entry={myEntry} isMine isFeatured={isFeatured} onEdit={() => setEditing(true)}/>
            : (
              <div className="entry-card mine entry-empty">
                <div style={{fontSize:13,color:"rgba(28,10,12,.55)",marginBottom:10}}>あなたの記録はまだありません</div>
                <button className="edit-btn" onClick={() => setEditing(true)}>✏️ 自分の記録を書く</button>
              </div>
            )}
          {others.map(e => <EntryCard key={e.id} entry={e} isFeatured={isFeatured}/>)}
        </div>
      </div>
    </div>
  );
}

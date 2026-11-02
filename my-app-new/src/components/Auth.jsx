import { useState } from "react";
import { signIn, signOut, normalizeEmail, OWNER_EMAIL } from "../lib/firebase.js";
import { addMember, removeMember } from "../lib/store.js";

const screenStyle = {
  display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
  minHeight:"100vh", padding:24, gap:16, background:"var(--paper)", textAlign:"center",
  fontFamily:'"Noto Serif JP",serif',
};
const titleStyle = { fontSize:18, color:"var(--ink)", letterSpacing:".08em", lineHeight:1.6 };
const noteStyle  = { fontSize:12, color:"rgba(28,10,12,.5)", lineHeight:1.9, maxWidth:320 };
const btnStyle   = {
  background:"var(--red)", color:"#fff", border:"none", borderRadius:12, padding:"14px 28px",
  fontSize:15, fontFamily:'"Noto Serif JP",serif', cursor:"pointer", letterSpacing:".08em",
};
const subBtnStyle = {
  background:"transparent", border:"1.5px solid rgba(28,10,12,.2)", color:"rgba(28,10,12,.6)",
  borderRadius:10, padding:"10px 20px", fontSize:13, cursor:"pointer", fontFamily:'"Noto Serif JP",serif',
};

// LINE・Instagram などのアプリ内ブラウザは Google ログインを拒否される
const isInAppBrowser = () => /Line\/|FBAN|FBAV|Instagram|Twitter/i.test(navigator.userAgent || "");

export function LoadingScreen({ message = "読み込み中…" }) {
  return (
    <div style={screenStyle}>
      <div style={{color:"var(--red)",fontSize:28}}>♪</div>
      <div style={{fontSize:14,color:"rgba(28,10,12,.5)",letterSpacing:".12em"}}>{message}</div>
    </div>
  );
}

export function MessageScreen({ message, children }) {
  return (
    <div style={screenStyle}>
      <div style={{color:"var(--red)",fontSize:14,lineHeight:1.8,whiteSpace:"pre-line"}}>{message}</div>
      {children}
    </div>
  );
}

export function LoginScreen() {
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setBusy(true); setError(null);
    try { await signIn(); }
    catch (err) {
      console.error("ログインに失敗:", err);
      setError("ログインに失敗しました。もう一度お試しください。");
    } finally { setBusy(false); }
  };

  return (
    <div style={screenStyle}>
      <div style={{color:"var(--red)",fontSize:32}}>♪</div>
      <div style={titleStyle}>東方神起 - TVXQ! LIVE ARCHIVE</div>
      <div style={noteStyle}>招待されたメンバー専用のアーカイブです。<br/>Googleアカウントでログインしてください。</div>
      <button style={{...btnStyle, opacity:busy?.6:1}} disabled={busy} onClick={handleLogin}>
        {busy ? "ログイン中…" : "Googleでログイン"}
      </button>
      {error && <div style={{color:"var(--red)",fontSize:12}}>{error}</div>}
      {isInAppBrowser() && (
        <div style={{...noteStyle, color:"var(--red)"}}>
          LINEなどのアプリ内ブラウザではGoogleログインができません。<br/>
          右上のメニューから「Safariで開く」「ブラウザで開く」を選んでください。
        </div>
      )}
    </div>
  );
}

export function NotInvitedScreen({ user }) {
  return (
    <div style={screenStyle}>
      <div style={{fontSize:28}}>🔒</div>
      <div style={titleStyle}>このアカウントは招待されていません</div>
      <div style={noteStyle}>
        <strong style={{color:"var(--ink)"}}>{user.email}</strong><br/>
        でログインしています。<br/>
        アーカイブのオーナーにこのメールアドレスを伝えて、招待してもらってください。
      </div>
      <button style={subBtnStyle} onClick={signOut}>別のアカウントでログイン</button>
    </div>
  );
}

// ヘッダーに置くログイン中ユーザー表示
export function UserBar({ user, isOwner, onOpenMembers }) {
  const chip = {
    background:"rgba(255,255,255,.14)", border:"1px solid rgba(255,255,255,.25)", color:"#fff",
    borderRadius:14, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:'"Noto Serif JP",serif',
  };
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
      {user.photoURL
        ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{width:22,height:22,borderRadius:"50%"}}/>
        : <span style={{fontSize:16}}>👤</span>}
      <span style={{fontSize:12,color:"rgba(255,255,255,.85)",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
        {user.displayName || user.email}
      </span>
      {isOwner && <button style={chip} onClick={onOpenMembers}>👥 メンバー</button>}
      <button style={chip} onClick={signOut}>ログアウト</button>
    </div>
  );
}

// オーナー用：招待メンバーの管理
export function MembersDialog({ members, onClose }) {
  const [email, setEmail] = useState("");
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    const e = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setError("メールアドレスの形式が正しくありません"); return; }
    if (e === OWNER_EMAIL || members.includes(e)) { setError("すでにメンバーです"); return; }
    setBusy(true); setError(null);
    try { await addMember(e); setEmail(""); }
    catch (err) { console.error(err); setError("追加に失敗しました"); }
    finally { setBusy(false); }
  };

  const handleRemove = async (e) => {
    if (!confirm(`${e} をメンバーから外しますか？\n（この人がこれまでに書いた記録は残ります）`)) return;
    try { await removeMember(e); }
    catch (err) { console.error(err); alert("削除に失敗しました"); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>ホームに戻る</button>
          </div>
        </div>
        <div className="mhero red">
          <div className="mdate">MEMBERS</div>
          <div className="mtitle">メンバー管理</div>
          <div className="mvenue" style={{fontSize:12,lineHeight:1.8}}>
            ここに登録したGoogleアカウントの人だけが、アーカイブを見たり書き込んだりできます。
          </div>
        </div>
        <div className="fsec">
          <label className="flbl">招待するメールアドレス（Googleアカウント）</label>
          <div className="frow">
            <input className="finp" type="email" placeholder="friend@gmail.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}/>
            <button className="edit-btn" disabled={busy} onClick={handleAdd}>追加</button>
          </div>
          {error && <div style={{color:"var(--red)",fontSize:12,marginTop:6}}>{error}</div>}
        </div>
        <div className="fdivider">メンバー一覧</div>
        <div className="fsec">
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(192,21,42,.08)"}}>
            <span style={{flex:1,fontSize:14,wordBreak:"break-all",textAlign:"left"}}>{OWNER_EMAIL}</span>
            <span style={{fontSize:10,background:"var(--gold)",color:"#fff",padding:"2px 8px",borderRadius:4}}>オーナー</span>
          </div>
          {members.length === 0 && (
            <div className="empty" style={{fontSize:13,padding:"12px 0"}}>まだ誰も招待していません</div>
          )}
          {members.map(m => (
            <div key={m} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid rgba(192,21,42,.08)"}}>
              <span style={{flex:1,fontSize:14,wordBreak:"break-all",textAlign:"left"}}>{m}</span>
              <button className="live-del" style={{background:"rgba(192,21,42,.1)",color:"var(--red)"}} onClick={() => handleRemove(m)}>×</button>
            </div>
          ))}
        </div>
        <div className="fsec" style={{fontSize:11,color:"rgba(28,10,12,.45)",lineHeight:1.8}}>
          招待した人には、このアプリのURLを伝えて「Googleでログイン」してもらってください。
        </div>
      </div>
    </div>
  );
}

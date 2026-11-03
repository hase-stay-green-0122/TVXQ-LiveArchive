// 「＋」メニューと、ライブの追加フォーム
import { useState } from "react";
import { createLive } from "../lib/store.js";
import { parseTips, parseSetlist } from "../lib/text.js";
import { usePhotoUpload } from "../hooks/usePhotoUpload.js";
import { SaveHomeButton } from "./Common.jsx";
import { MemInputs, TipsInput } from "./MemoryTips.jsx";
import { PhotoEditor } from "./Photos.jsx";

// 2択メニュー
export function AddMenu({ onClose, onSelectLive, onSelectTour }) {
  return (
    <div className="add-menu-overlay">
      <div className="add-menu-bg" onClick={onClose}/>
      <div className="add-menu">
        <div className="add-menu-handle"/>
        <div className="add-menu-ttl">追加する内容を選択</div>
        <button className="add-menu-btn" onClick={onSelectLive}>
          <span className="add-menu-icon">🎵</span>
          <div>
            <div className="add-menu-label">ライブを追加</div>
            <div className="add-menu-desc">既存ツアーにライブ公演を追加します</div>
          </div>
        </button>
        <button className="add-menu-btn" onClick={onSelectTour}>
          <span className="add-menu-icon">📋</span>
          <div>
            <div className="add-menu-label">ツアーを追加</div>
            <div className="add-menu-desc">新しいツアーを作成してライブを管理します</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// 新規追加用・保存してホームに戻るボタン（フィードバック付き）
export function AddForm({ user, onClose, allTours }) {
  const [step,      setStep]      = useState("select"); // "select" | "input"
  const [selTour,   setSelTour]   = useState(null);     // 選択されたツアーentry
  const [date,      setDate]      = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [venue,     setVenue]     = useState("");
  const [setlist,   setSetlist]   = useState("");
  const [block,     setBlock]     = useState("");
  const [seatNo,    setSeatNo]    = useState("");
  const [mem,       setMem]       = useState({before:"",after:"",highlight:"",other:""});
  const [tipsText,  setTipsText]  = useState("");
  const { photos, handleAdd, handleRemove, uploading, commit } = usePhotoUpload([], user.uid);

  // 公演情報（共有）と自分の記録を同時に作成
  const doSave = async () => {
    const [y,m,d] = date ? date.split("-") : ["","",""];
    const live = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tourId: selTour.id,
      date:      date ? `${y}.${m}.${d}` : "日付未設定",
      dateLabel: date ? `${y}年${parseInt(m)}月${parseInt(d)}日` : "日付未設定",
      start: startTime, venue: venue.trim() || "会場未設定",
      tag: (venue.trim() || "未設定").slice(0,3), emoji: "🎤",
      songs: parseSetlist(setlist),
    };
    const myEntry = {
      seat: [block.trim(), seatNo.trim()].filter(Boolean).join(" / 座席"),
      highlight: null,
      photos,
      memory: { before:mem.before.trim(), after:mem.after.trim(), highlight:mem.highlight.trim(), other:mem.other.trim() },
      tips: parseTips(tipsText),
    };
    await createLive(user, live, myEntry);
    commit(photos);
    return true;
  };

  // ── ステップ1：ツアー選択 ──
  if (step === "select") return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>ホームに戻る</button>
          </div>
        </div>
        <div className="mhero red"><div className="mdate">STEP 1 / 2</div><div className="mtitle">追加先のツアーを選択</div></div>
        <div style={{padding:"16px 18px 32px",display:"flex",flexDirection:"column",gap:10}}>
          {allTours.map(tour => (
            <button key={tour.id}
              style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--offwhite)",border:`1.5px solid ${tour.color}44`,borderRadius:12,cursor:"pointer",textAlign:"left",width:"100%"}}
              onClick={() => { setSelTour(tour); setStep("input"); }}>
              <div style={{width:10,height:10,borderRadius:"50%",background:tour.color,flexShrink:0}}/>
              <div>
                <div style={{fontFamily:"Noto Serif JP,serif",fontSize:14,fontWeight:600,color:"var(--ink)"}}>{tour.name}</div>
                <div style={{fontSize:11,color:"rgba(28,10,12,.4)",marginTop:2}}>{tour.lives.length}公演</div>
              </div>
              <div style={{marginLeft:"auto",color:"rgba(28,10,12,.25)",fontSize:18}}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── ステップ2：ライブ情報入力 ──
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={() => setStep("select")}>ツアー選択に戻る</button>
          </div>
        </div>
        <div className="mhero red">
          <div className="mdate">STEP 2 / 2 · {selTour?.name}</div>
          <div className="mtitle">ライブを記録する</div>
        </div>
        <div className="fsec">
          <div className="frow">
            <div className="fgrp"><label className="flbl">開催日</label><input className="finp" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
            <div className="fgrp"><label className="flbl">開演時刻</label><input className="finp" type="time" value={startTime} onChange={e=>setStartTime(e.target.value)}/></div>
          </div>
        </div>
        <div className="fsec">
          <label className="flbl">会場</label>
          <input className="finp" placeholder="例: 東京ドーム" value={venue} onChange={e=>setVenue(e.target.value)}/>
        </div>
        <div className="fdivider">セットリスト<span className="fscope">みんなで共有</span></div>
        <div className="fsec">
          <textarea className="finp" rows={5} placeholder={"1. Mirotic\n2. Rising Sun\n3. Before U Go  [アンコール]"} style={{resize:"none",lineHeight:1.8}} value={setlist} onChange={e=>setSetlist(e.target.value)}/>
        </div>
        <div className="fdivider">座席<span className="fscope mine">あなたの記録</span></div>
        <div className="fsec">
          <div className="frow">
            <div className="fgrp"><label className="flbl">ブロック / 列</label><input className="finp" placeholder="C列 12番" value={block} onChange={e=>setBlock(e.target.value)}/></div>
            <div className="fgrp"><label className="flbl">座席番号</label><input className="finp" placeholder="34" value={seatNo} onChange={e=>setSeatNo(e.target.value)}/></div>
          </div>
        </div>
        <div className="fdivider">写真<span className="fscope mine">あなたの記録</span></div>
        <PhotoEditor photos={photos} onAdd={handleAdd} onRemove={handleRemove} uploading={uploading}/>
        <div className="fdivider">思い出メモ<span className="fscope mine">あなたの記録</span></div>
        <MemInputs mem={mem} setMem={setMem}/>
        <div className="fdivider">Live を楽しむための Tips<span className="fscope mine">あなたの記録</span></div>
        <TipsInput value={tipsText} onChange={e=>setTipsText(e.target.value)}/>
        <SaveHomeButton doSave={doSave} onGoHome={onClose} disabled={uploading}/>
      </div>
    </div>
  );
}

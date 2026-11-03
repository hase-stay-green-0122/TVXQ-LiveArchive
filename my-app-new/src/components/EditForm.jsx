// 公演の編集フォーム（セトリは共有、それ以外は自分の記録）
import { useState } from "react";
import { EMPTY_MEMORY, updateLive, saveMyEntry } from "../lib/store.js";
import { parseTips, tipsToText, parseSetlist, setlistToText, sameSongs } from "../lib/text.js";
import { usePhotoUpload } from "../hooks/usePhotoUpload.js";
import { SaveHomeButton } from "./Common.jsx";
import { MemInputs, TipsInput } from "./MemoryTips.jsx";
import { PhotoEditor } from "./Photos.jsx";

export function EditForm({ live, myEntry, user, onClose, onGoHome }) {
  const [seat, setSeat]         = useState(myEntry?.seat || "");
  const [setlist, setSetlist]   = useState(setlistToText(live.songs));
  const [mem, setMem]           = useState({ ...EMPTY_MEMORY, ...(myEntry?.memory || {}) });
  const [tipsText, setTipsText] = useState(tipsToText(myEntry?.tips));
  const { photos, handleAdd, handleRemove, uploading, commit } = usePhotoUpload(myEntry?.photos || [], user.uid);
  // フォームを開いた時点のセットリスト（他のメンバーの同時編集を検知するため）
  const [songsAtOpen] = useState(live.songs || []);

  const doSave = async () => {
    const songs = parseSetlist(setlist);
    if (!sameSongs(songs, songsAtOpen)) {
      // 編集中に他のメンバーがセットリストを変えていたら確認する
      if (!sameSongs(live.songs, songsAtOpen) &&
          !confirm("編集中に他のメンバーがセットリストを更新しました。\nあなたの内容で上書きしますか？\n（キャンセルすると保存を中止します）")) {
        return false;
      }
      await updateLive(user, live.id, { songs });
    }
    await saveMyEntry(user, live.id, {
      seat: seat.trim(),
      highlight: myEntry?.highlight ?? null,
      photos,
      memory: mem,
      tips: parseTips(tipsText),
    }, myEntry?.photos || []);
    commit(photos);
    return true;
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>詳細に戻る</button>
          </div>
        </div>
        <div className="mhero dark">
          <div className="mdate">EDIT</div>
          <div className="mtitle">{live.dateLabel||live.date}</div>
          <div className="mvenue">📍 {live.venue}</div>
        </div>
        {/* ①セットリスト（共有） */}
        <div className="fdivider">セットリスト<span className="fscope">みんなで共有</span></div>
        <div className="fsec">
          <textarea className="finp" rows={5} placeholder={"1. Mirotic\n2. Rising Sun\n3. Before U Go  [アンコール]"} style={{resize:"none",lineHeight:1.8}} value={setlist} onChange={e=>setSetlist(e.target.value)}/>
        </div>
        {/* ②〜⑤ 自分の記録 */}
        <div className="fdivider">座席<span className="fscope mine">あなたの記録</span></div>
        <div className="fsec">
          <label className="flbl">座席情報</label>
          <input className="finp" placeholder="例: W1F / 入口W13 / 列8 / 座席245" value={seat} onChange={e=>setSeat(e.target.value)}/>
        </div>
        <div className="fdivider">写真<span className="fscope mine">あなたの記録</span></div>
        <PhotoEditor photos={photos} onAdd={handleAdd} onRemove={handleRemove} uploading={uploading}/>
        <div className="fdivider">思い出メモ<span className="fscope mine">あなたの記録</span></div>
        <MemInputs mem={mem} setMem={setMem}/>
        <div className="fdivider">Tips<span className="fscope mine">あなたの記録</span></div>
        <TipsInput value={tipsText} onChange={e=>setTipsText(e.target.value)}/>
        <SaveHomeButton doSave={doSave} onGoHome={onGoHome} disabled={uploading}/>
      </div>
    </div>
  );
}

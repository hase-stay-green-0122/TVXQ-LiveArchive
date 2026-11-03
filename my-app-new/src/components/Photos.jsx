// 写真の表示と、編集フォームの写真欄
import { useState, useEffect } from "react";
import { isStoredPhoto, isDirectPhoto, storedPhotoId, loadPhoto } from "../lib/photos.js";

// ─────────────────────────────────────────────
//  共通サブコンポーネント
// ─────────────────────────────────────────────

export function PhotoImg({ src, size }) {
  const [loaded, setLoaded] = useState({ src: null, url: null });
  useEffect(() => {
    if (!isStoredPhoto(src)) return;
    let alive = true;
    loadPhoto(storedPhotoId(src)).then(url => { if (alive) setLoaded({ src, url }); });
    return () => { alive = false; };
  }, [src]);

  if (isDirectPhoto(src)) return <img src={src} alt=""/>;
  const box = { width:size||"100%", height:size||"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size?24:13, color:"rgba(28,10,12,.35)" };
  if (isStoredPhoto(src)) {
    if (loaded.src !== src) return <div style={box}>…</div>;
    return loaded.url ? <img src={loaded.url} alt=""/> : <div style={box}>⚠️</div>;
  }
  return <div style={{...box, background:size?"var(--mist)":undefined, borderRadius:size?8:undefined}}>{src}</div>;
}

export function PhotoEditor({ photos, onAdd, onRemove, uploading }) {
  return (
    <div className="fsec">
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:8 }}>
        {photos.map((p, i) => (
          <div key={i} className="photo-thumb">
            <PhotoImg src={p} size={80}/>
            <button className="photo-del" onClick={() => onRemove(i)}>×</button>
          </div>
        ))}
        {uploading && (
          <div style={{width:80,height:80,borderRadius:8,background:"var(--mist)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
            <div style={{width:24,height:24,border:"3px solid var(--red)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            <div style={{fontSize:9,color:"var(--red)"}}>送信中</div>
          </div>
        )}
      </div>
      {!uploading && photos.length < 6 && (
        <input type="file" accept="image/*" multiple style={{fontSize:13,color:"var(--ink)"}} onChange={onAdd}/>
      )}
      <div style={{fontSize:10,color:"rgba(28,10,12,.3)",marginTop:6}}>最大6枚まで追加できます</div>
    </div>
  );
}

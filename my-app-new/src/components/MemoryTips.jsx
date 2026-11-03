// 思い出メモ・Tips の表示と入力欄
import { useState } from "react";
import { MEM_FIELDS } from "../constants.js";

// セクション順統一コンポーネント群
// 順番：①セットリスト ②座席 ③写真 ④思い出メモ ⑤Tips

export function MemorySection({ memory, hideEmpty = false }) {
  const fields = hideEmpty ? MEM_FIELDS.filter(f => (memory?.[f.key] || "").trim()) : MEM_FIELDS;
  return (
    <div className="mem-list">
      {fields.map(({ key, icon, label }) => (
        <div key={key} className="mem-card">
          <div className="mem-hdr"><span className="mem-icon">{icon}</span><span className="mem-lbl">{label}</span></div>
          <div className="mem-text">
            {memory?.[key]
              ? memory[key]
              : <span className="empty">まだ記録されていません…</span>
            }
          </div>
        </div>
      ))}
    </div>
  );
}

export function TipItem({ tip }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="tip-item">
      <span className="tip-cat">{tip.cat}</span>
      <div style={{flex:1}}>
        <div className="tip-text" dangerouslySetInnerHTML={{__html:tip.text}}/>
        {tip.url && (
          <div className="tip-url">
            <span className="tip-url-text">{tip.url}</span>
            <button className={"tip-copy"+(copied?" copied":"")}
              onClick={() => navigator.clipboard.writeText(tip.url).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); })}>
              {copied ? "✓ コピー済" : "📋 コピー"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TipsSection({ tips }) {
  return (
    <div className="tips-box">
      <div className="tips-hdr"><span className="tips-hdr-ic">📌</span><span className="tips-hdr-tt">Live を楽しむための Tips</span><span className="tips-badge">TIPS</span></div>
      {(!tips || tips.length === 0)
        ? <div className="tip-item"><div className="tip-text" style={{color:"rgba(255,255,255,.28)",fontStyle:"italic"}}>まだ Tips が記録されていません…</div></div>
        : tips.map((tip, i) => <TipItem key={i} tip={tip}/>)
      }
    </div>
  );
}

// 思い出メモ入力フィールド群
export function MemInputs({ mem, setMem }) {
  return (
    <>
      {MEM_FIELDS.map(({ key, icon, label }) => (
        <div key={key} className="fsec">
          <label className="flbl"><span>{icon}</span>{label}</label>
          <textarea className="finp" rows={3} style={{resize:"none",lineHeight:1.8}}
            value={mem[key]||""}
            onChange={e => setMem(prev => ({...prev, [key]: e.target.value}))}
            placeholder={
              key==="before" ? "ライブ前の気持ち、期待していたこと…" :
              key==="after"  ? "終わった後の感情、余韻…" :
              key==="highlight" ? "特に印象に残った曲・瞬間・演出…" :
              "その他なんでも…"
            }
          />
        </div>
      ))}
    </>
  );
}

// Tips入力フィールド
export function TipsInput({ value, onChange }) {
  return (
    <div className="fsec">
      <label className="flbl">Tips（1行1項目）</label>
      <textarea className="finp" rows={4} style={{resize:"none",lineHeight:1.8}}
        placeholder={"コクーンのフードコートが穴場\n開演1時間前に並ぶとトイレも余裕\n2階スタンドは段差があって見やすい"}
        value={value} onChange={onChange}
      />
    </div>
  );
}

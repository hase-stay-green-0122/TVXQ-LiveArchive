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

// Tips の本文を安全に表示する。メンバーが書いた文字を HTML として解釈すると、
// 細工した文字で他の人のブラウザ上でプログラムが動いてしまう（XSS）ため、
// 初期データで使っている <strong>…</strong> だけを太字にして、それ以外はすべて文字として表示する。
function TipText({ text }) {
  const parts = String(text ?? "").split(/(<strong>[\s\S]*?<\/strong>)/g);
  return (
    <div className="tip-text">
      {parts.map((part, i) => {
        const m = part.match(/^<strong>([\s\S]*?)<\/strong>$/);
        return m ? <strong key={i}>{m[1]}</strong> : <span key={i}>{part}</span>;
      })}
    </div>
  );
}

// 入力フォームから書いた Tips には、すべて同じ分類「📌 Tips」が付く。
// 毎行に同じラベルを出すとくどいので、独自の分類（例：🍜 ライブ前グルメ）があるときだけ表示する
const DEFAULT_TIP_CAT = "📌 Tips";

export function TipItem({ tip }) {
  const [copied, setCopied] = useState(false);
  const hasOwnCat = tip.cat && tip.cat !== DEFAULT_TIP_CAT;
  return (
    <div className="tip-item">
      {hasOwnCat ? <span className="tip-cat">{tip.cat}</span> : <span className="tip-dot">•</span>}
      <div style={{flex:1}}>
        <TipText text={tip.text}/>
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

// 見出しは呼び出し側（記録カードの「Tips」）に任せ、ここでは中身だけを表示する
export function TipsSection({ tips }) {
  return (
    <div className="tips-box">
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
      <label className="flbl">1行に1つずつ書いてください</label>
      <textarea className="finp" rows={4} style={{resize:"none",lineHeight:1.8}}
        placeholder={"コクーンのフードコートが穴場\n開演1時間前に並ぶとトイレも余裕\n2階スタンドは段差があって見やすい"}
        value={value} onChange={onChange}
      />
    </div>
  );
}

// 複数の画面で使う小さな部品
import { useState } from "react";
import { SILHOUETTE_IMG } from "../data/images.js";

// ─────────────────────────────────────────────
//  コンポーネント
// ─────────────────────────────────────────────

export function Silhouette() {
  return <img className="hdr-silhouette" src={SILHOUETTE_IMG} alt="" style={{height:"95px",width:"auto",objectFit:"contain"}}/>;
}

export function DeleteDialog({ live, title = "ライブを削除しますか？", onCancel, onConfirm }) {
  return (
    <div className="del-dialog-overlay" onClick={onCancel}>
      <div className="del-dialog" onClick={e => e.stopPropagation()}>
        <div className="del-dialog-ttl">{title}</div>
        <div className="del-dialog-body">
          <strong>{live.date} {live.venue}</strong> の記録を削除します。<br/>この操作は元に戻せません。
        </div>
        <div className="del-dialog-btns">
          <button className="del-dialog-cancel" onClick={onCancel}>キャンセル</button>
          <button className="del-dialog-confirm" onClick={onConfirm}>削除する</button>
        </div>
      </div>
    </div>
  );
}

// ── 編集フォーム ──
// 保存してホームに戻るボタン（押下フィードバック付き）
// doSave は Promise を返す。false を返したら保存を中止（ボタンを元に戻す）
export function SaveHomeButton({ doSave, onGoHome, disabled }) {
  const [state, setState] = useState("idle"); // idle | saving | done

  const handleClick = async () => {
    if (state !== "idle" || disabled) return;
    setState("saving");
    let ok = false;
    try {
      ok = (await doSave()) !== false;
    } catch (err) {
      console.error("保存に失敗:", err);
      alert("保存に失敗しました。通信状況を確認して、もう一度お試しください。");
    }
    if (!ok) { setState("idle"); return; }
    setState("done");
    setTimeout(() => onGoHome(), 600);
  };

  const label = state === "saving" ? "保存中…"
              : state === "done"   ? "✓ 保存しました！"
              : disabled           ? "写真をアップロード中…"
              : "🏠 保存してホームに戻る";

  return (
    <button
      className={"save-btn" + (state !== "idle" ? " saving" : "")}
      style={{marginBottom:24, ...(disabled ? {opacity:.5} : {}), ...(state === "done" ? {background:"linear-gradient(135deg,#2a8a3e,#1a6b2e)"} : {})}}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

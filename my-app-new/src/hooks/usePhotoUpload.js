// 写真の追加・削除フォーム用のフック
import { useState, useEffect, useRef } from "react";
import { uploadPhoto, deletePhotos } from "../lib/photos.js";

// ─────────────────────────────────────────────
//  ユーティリティ
// ─────────────────────────────────────────────

// 写真の追加・削除を管理。保存せずにフォームを閉じた場合は、
// そのフォームで新しくアップロードした写真をFirestoreから片付ける。
export function usePhotoUpload(initial = [], uid) {
  const [photos,    setPhotos]    = useState(initial);
  const [uploading, setUploading] = useState(false);
  const pending = useRef({ uploaded: [], committed: false });

  useEffect(() => {
    const state = pending.current;
    return () => { if (!state.committed) deletePhotos(state.uploaded); };
  }, []);

  // 保存が成功したら呼ぶ。保存に含まれなかった新規アップロードだけを片付ける
  const commit = (finalPhotos) => {
    const kept = new Set(finalPhotos);
    deletePhotos(pending.current.uploaded.filter(p => !kept.has(p)));
    // アンマウント時のクリーンアップは同じオブジェクトを参照しているので、置き換えずに書き換える
    pending.current.uploaded  = [];
    pending.current.committed = true;
  };

  const handleAdd = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      const room = Math.max(0, 6 - photos.length);
      const results = await Promise.allSettled(files.slice(0, room).map(f => uploadPhoto(f, uid)));
      const refs = results.filter(r => r.status === "fulfilled").map(r => r.value);
      const failed = results.filter(r => r.status === "rejected");
      // 成功した分は（一部が失敗していても）フォームに追加し、保存されなければ後で片付ける
      pending.current.uploaded.push(...refs);
      setPhotos(prev => [...prev, ...refs].slice(0, 6));
      if (failed.length) {
        failed.forEach(r => console.error("写真のアップロードに失敗:", r.reason));
        alert(`写真${failed.length}枚のアップロードに失敗しました。もう一度お試しください。`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (i) => setPhotos(prev => prev.filter((_,idx) => idx !== i));

  return { photos, handleAdd, handleRemove, uploading, commit };
}

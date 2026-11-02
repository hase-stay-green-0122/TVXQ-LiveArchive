// ─────────────────────────────────────────────
//  写真（Firestoreに1枚1ドキュメントで保存）
//  Firebase Storageは有料プラン必須のため、ブラウザで圧縮して
//  photos/{id} に base64 で保存し、記録側には "fsphoto:{id}" だけを持たせる
// ─────────────────────────────────────────────
import { doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase.js";

const PHOTO_COL       = "photos";
const PHOTO_PREFIX    = "fsphoto:";
const PHOTO_MAX_SIDE  = 1280;
const PHOTO_MAX_CHARS = 900_000; // Firestoreの1ドキュメント上限(1MiB)に余裕を持たせる

export const isStoredPhoto = (p) => typeof p === "string" && p.startsWith(PHOTO_PREFIX);
export const isDirectPhoto = (p) => typeof p === "string" && (p.startsWith("data:") || p.startsWith("http"));
export const storedPhotoId = (p) => p.slice(PHOTO_PREFIX.length);

const photoCache = new Map(); // id -> Promise<string|null>

export const loadPhoto = (id) => {
  if (!photoCache.has(id)) {
    photoCache.set(id, getDoc(doc(db, PHOTO_COL, id))
      .then(snap => (snap.exists() ? snap.data().data : null))
      .catch(err => { console.error("写真の読み込みに失敗:", err); photoCache.delete(id); return null; }));
  }
  return photoCache.get(id);
};

const loadImageElement = (file) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload  = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("画像を読み込めませんでした")); };
  img.src = url;
});

// 長辺を縮小しつつ、JPEG品質を下げてサイズ上限に収める
const compressImage = async (file) => {
  const img = await loadImageElement(file);
  let side = PHOTO_MAX_SIDE;
  for (let attempt = 0; attempt < 4; attempt++) {
    const scale  = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width  = Math.max(1, Math.round(img.naturalWidth  * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // 透過PNG対策
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const q of [0.82, 0.7, 0.55]) {
      const dataUrl = canvas.toDataURL("image/jpeg", q);
      if (dataUrl.length <= PHOTO_MAX_CHARS) return dataUrl;
    }
    side = Math.round(side * 0.7);
  }
  throw new Error("画像が大きすぎて圧縮できませんでした");
};

export const uploadPhoto = async (file, uid) => {
  const data = await compressImage(file);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await setDoc(doc(db, PHOTO_COL, id), { data, uid, createdAt: Date.now() });
  photoCache.set(id, Promise.resolve(data));
  return PHOTO_PREFIX + id;
};

// 失敗しても記録の保存自体は止めない（孤立した写真が残るだけ）
export const deletePhotos = async (refs) => {
  const ids = (refs || []).filter(isStoredPhoto).map(storedPhotoId);
  await Promise.all(ids.map(async (id) => {
    photoCache.delete(id);
    try { await deleteDoc(doc(db, PHOTO_COL, id)); }
    catch (err) { console.error("写真の削除に失敗:", err); }
  }));
};

// ─────────────────────────────────────────────
//  データ層
//
//  tours/{tourId}            ツアー情報（メンバー共有）
//  lives/{liveId}            公演情報：日付・会場・セットリスト（メンバー共有）
//  entries/{liveId}_{uid}    一人ひとりの記録：座席・写真・思い出・Tips（本人のみ編集可）
//  config/members            招待メンバーのメールアドレス（オーナーのみ編集可）
//  config/migration          旧データ(archive/allLives)からの移行済みフラグ
//
//  旧構造では全データを1ドキュメントに丸ごと上書き保存していたため、
//  複数人・複数端末で使うと他の人の変更を消してしまっていた。
//  新構造では「変更した項目だけ」を「その人のドキュメントにだけ」書き込み、
//  画面はリアルタイム購読で常に最新を表示する。
// ─────────────────────────────────────────────
import {
  collection, doc, onSnapshot, getDoc, setDoc, updateDoc, writeBatch,
  serverTimestamp, arrayUnion, arrayRemove,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db, normalizeEmail } from "./firebase.js";
import { deletePhotos } from "./photos.js";

const MEMBERS_REF   = doc(db, "config", "members");
const MIGRATION_REF = doc(db, "config", "migration");
const LEGACY_REF    = doc(db, "archive", "allLives");

export const entryDocId = (liveId, uid) => `${liveId}_${uid}`;

export const EMPTY_MEMORY = { before:"", after:"", highlight:"", other:"" };

const LIVE_FIELDS  = ["tourId", "date", "dateLabel", "open", "start", "venue", "tag", "emoji", "songs"];
const pick = (obj, keys) => Object.fromEntries(keys.filter(k => obj[k] !== undefined).map(k => [k, obj[k]]));

const authorFields = (user) => ({
  uid:      user.uid,
  name:     user.displayName || user.email || "メンバー",
  photoURL: user.photoURL || null,
});

// ── 購読 ──────────────────────────────────────

export const subscribeMembers = (onData, onError) =>
  onSnapshot(MEMBERS_REF,
    snap => onData(snap.exists() ? (snap.data().emails || []) : []),
    onError);

const subscribeCollection = (name, onData, onError) =>
  onSnapshot(collection(db, name),
    snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    onError);

export const subscribeArchive = ({ onTours, onLives, onEntries, onError }) => {
  const unsubs = [
    subscribeCollection("tours",   onTours,   onError),
    subscribeCollection("lives",   onLives,   onError),
    subscribeCollection("entries", onEntries, onError),
  ];
  return () => unsubs.forEach(u => u());
};

// ── メンバー管理（オーナーのみ） ─────────────────

export const addMember = (email) =>
  setDoc(MEMBERS_REF, { emails: arrayUnion(normalizeEmail(email)) }, { merge: true });

export const removeMember = (email) =>
  setDoc(MEMBERS_REF, { emails: arrayRemove(normalizeEmail(email)) }, { merge: true });

// ── ツアー ────────────────────────────────────

export const createTour = (user, { tourId, tourName, tourSub, tourColor, featured, svgCode }) =>
  setDoc(doc(db, "tours", tourId), {
    name: tourName, sub: tourSub || null, color: tourColor,
    featured: !!featured, svgCode: svgCode || null,
    order: Date.now(),
    createdBy: user.uid, createdAt: serverTimestamp(),
    updatedBy: user.uid, updatedAt: serverTimestamp(),
  });

export const updateTour = (user, tourId, changes) => {
  const data = {};
  if (changes.tourName  !== undefined) data.name    = changes.tourName;
  if (changes.tourSub   !== undefined) data.sub     = changes.tourSub;
  if (changes.tourColor !== undefined) data.color   = changes.tourColor;
  if (changes.svgCode   !== undefined) data.svgCode = changes.svgCode;
  return updateDoc(doc(db, "tours", tourId), { ...data, updatedBy: user.uid, updatedAt: serverTimestamp() });
};

// ツアーと、その中の公演・全員の記録・写真をまとめて削除（オーナーのみ）
export const deleteTour = async (tourId, lives, entries) => {
  const liveIds = new Set(lives.filter(l => l.tourId === tourId).map(l => l.id));
  const targetEntries = entries.filter(e => liveIds.has(e.liveId));
  const batch = writeBatch(db);
  batch.delete(doc(db, "tours", tourId));
  liveIds.forEach(id => batch.delete(doc(db, "lives", id)));
  targetEntries.forEach(e => batch.delete(doc(db, "entries", e.id)));
  await batch.commit();
  await deletePhotos(targetEntries.flatMap(e => e.photos || []));
};

// ── 公演 ──────────────────────────────────────

// 公演と自分の記録を同時に作成
export const createLive = async (user, live, myEntry) => {
  const batch = writeBatch(db);
  batch.set(doc(db, "lives", live.id), {
    ...pick(live, LIVE_FIELDS),
    order: Date.now(),
    createdBy: user.uid, createdAt: serverTimestamp(),
    updatedBy: user.uid, updatedAt: serverTimestamp(),
  });
  batch.set(doc(db, "entries", entryDocId(live.id, user.uid)), {
    ...myEntry, liveId: live.id, ...authorFields(user), updatedAt: serverTimestamp(),
  });
  await batch.commit();
};

// 変更したフィールドだけを書き換える（他の項目を他の人が同時に編集しても消えない）
export const updateLive = (user, liveId, changes) =>
  updateDoc(doc(db, "lives", liveId), {
    ...pick(changes, LIVE_FIELDS), updatedBy: user.uid, updatedAt: serverTimestamp(),
  });

export const deleteLive = async (liveId, entries) => {
  const targetEntries = entries.filter(e => e.liveId === liveId);
  const batch = writeBatch(db);
  batch.delete(doc(db, "lives", liveId));
  targetEntries.forEach(e => batch.delete(doc(db, "entries", e.id)));
  await batch.commit();
  await deletePhotos(targetEntries.flatMap(e => e.photos || []));
};

// ── 自分の記録 ────────────────────────────────

export const saveMyEntry = async (user, liveId, data, previousPhotos = []) => {
  await setDoc(doc(db, "entries", entryDocId(liveId, user.uid)), {
    seat:      data.seat ?? "",
    highlight: data.highlight ?? null,
    photos:    data.photos ?? [],
    memory:    data.memory ?? EMPTY_MEMORY,
    tips:      data.tips ?? [],
    liveId, ...authorFields(user), updatedAt: serverTimestamp(),
  });
  // 外した写真のデータを削除（保存が成功してから）
  const kept = new Set(data.photos || []);
  await deletePhotos(previousPhotos.filter(p => !kept.has(p)));
};

// ── 旧データからの移行（オーナーが初回ログインした時に1回だけ） ──

const hasPersonalContent = (live) =>
  (live.seat && live.seat !== "未設定") ||
  !!live.highlight ||
  (live.photos || []).length > 0 ||
  (live.tips || []).length > 0 ||
  Object.values(live.memory || {}).some(v => (v || "").trim());

export const migrateLegacyIfNeeded = async (user, buildInitialAllLives) => {
  const done = await getDoc(MIGRATION_REF);
  if (done.exists()) return false;

  const legacy = await getDoc(LEGACY_REF);
  const source = legacy.exists() ? (legacy.data().lives || []) : buildInitialAllLives();

  const batch = writeBatch(db);
  const seenTours = new Map();
  let liveOrder = 0;
  source.forEach(entry => {
    if (!seenTours.has(entry.tourId)) {
      seenTours.set(entry.tourId, true);
      batch.set(doc(db, "tours", entry.tourId), {
        name: entry.tourName, sub: entry.tourSub || null, color: entry.tourColor,
        featured: !!entry.featured, svgCode: entry.svgCode || null,
        order: seenTours.size,
        createdBy: user.uid, createdAt: serverTimestamp(),
        updatedBy: user.uid, updatedAt: serverTimestamp(),
      });
    }
    const live = entry.live;
    // 旧構造で「空のツアー」を成立させるためのダミー公演は移行しない
    if (!live || live.id.startsWith("live-placeholder-")) return;
    batch.set(doc(db, "lives", live.id), {
      ...pick(live, LIVE_FIELDS), tourId: entry.tourId,
      order: ++liveOrder,
      createdBy: user.uid, createdAt: serverTimestamp(),
      updatedBy: user.uid, updatedAt: serverTimestamp(),
    });
    // 旧データの座席・写真・思い出・Tipsはオーナー本人の記録として移す
    if (hasPersonalContent(live)) {
      batch.set(doc(db, "entries", entryDocId(live.id, user.uid)), {
        seat: live.seat && live.seat !== "未設定" ? live.seat : "",
        highlight: live.highlight || null,
        photos: live.photos || [],
        memory: { ...EMPTY_MEMORY, ...(live.memory || {}) },
        tips: live.tips || [],
        liveId: live.id, ...authorFields(user), updatedAt: serverTimestamp(),
      });
    }
  });
  batch.set(MIGRATION_REF, {
    done: true, by: user.uid, at: serverTimestamp(),
    from: legacy.exists() ? "archive/allLives" : "initial-data",
  });
  await batch.commit();
  return true;
};

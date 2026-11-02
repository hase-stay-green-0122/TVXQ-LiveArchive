// ─────────────────────────────────────────────
//  Firebase 初期化・認証
// ─────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  onAuthStateChanged, signOut as fbSignOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9AckvcNLR4TWFXMqtI0uaSIZEF1wXhoU",
  authDomain: "tvxq-live-archive.firebaseapp.com",
  projectId: "tvxq-live-archive",
  storageBucket: "tvxq-live-archive.firebasestorage.app",
  messagingSenderId: "687624555209",
  appId: "1:687624555209:web:0575b35d00ea4984139b18",
};

const firebaseApp = initializeApp(firebaseConfig);
export const db   = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// オーナー（メンバー管理・削除・データ移行ができる人）。
// firestore.rules の OWNER_EMAIL と必ず同じ値にすること。
export const OWNER_EMAIL = "hase.stay.green.0122@gmail.com";

export const normalizeEmail = (email) => (email || "").trim().toLowerCase();
export const isOwnerEmail   = (email) => normalizeEmail(email) === OWNER_EMAIL;

export const watchAuth = (cb) => onAuthStateChanged(auth, cb);

export const signIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    // ポップアップが使えない環境ではリダイレクト方式にフォールバック
    if (err.code === "auth/popup-blocked" || err.code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return;
    }
    // ユーザーが自分で閉じた場合はエラー扱いしない
    if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") return;
    throw err;
  }
};

export const signOut = () => fbSignOut(auth);

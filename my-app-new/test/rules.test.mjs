// Firestore セキュリティルール（../firestore.rules）のテスト。
// 実行: npm test（Firestore エミュレータ上で実行される）
import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const RULES = fileURLToPath(new URL("../firestore.rules", import.meta.url));

const OWNER  = { uid: "owner-uid",  email: "hase.stay.green.0122@gmail.com", email_verified: true };
const FRIEND = { uid: "friend-uid", email: "friend@gmail.com", email_verified: true };
const OTHER  = { uid: "other-uid",  email: "stranger@gmail.com", email_verified: true };
const UNVERIFIED = { uid: "unv-uid", email: "friend@gmail.com", email_verified: false };

const env = await initializeTestEnvironment({
  projectId: "tvxq-live-archive",
  firestore: { rules: fs.readFileSync(RULES, "utf8"), host: "127.0.0.1", port: 8080 },
});

const db = (u) => u ? env.authenticatedContext(u.uid, { email: u.email, email_verified: u.email_verified }).firestore()
                    : env.unauthenticatedContext().firestore();

let pass = 0, fail = 0;
const t = async (name, fn) => {
  try { await fn(); pass++; console.log("  ✓", name); }
  catch (e) { fail++; console.log("  ✗", name, "\n     ", e.message.split("\n")[0]); }
};

await env.clearFirestore();
await env.withSecurityRulesDisabled(async (ctx) => {
  const d = ctx.firestore();
  await setDoc(doc(d, "config/members"), { emails: ["friend@gmail.com"] });
  await setDoc(doc(d, "archive/allLives"), { lives: [] });
  await setDoc(doc(d, "tours/t1"), { name: "T" });
  await setDoc(doc(d, "lives/l1"), { tourId: "t1", songs: [] });
  await setDoc(doc(d, "entries/l1_owner-uid"), { liveId: "l1", uid: "owner-uid" });
  await setDoc(doc(d, "photos/legacy"), { data: "x" });
  await setDoc(doc(d, "photos/ownerphoto"), { data: "x", uid: "owner-uid" });
});

console.log("閲覧");
await t("未ログインは読めない", () => assertFails(getDoc(doc(db(null), "lives/l1"))));
await t("招待されていない人は読めない", () => assertFails(getDocs(collection(db(OTHER), "lives"))));
await t("招待されていない人はメンバー一覧も読めない", () => assertFails(getDoc(doc(db(OTHER), "config/members"))));
await t("メール未確認のアカウントは読めない", () => assertFails(getDocs(collection(db(UNVERIFIED), "lives"))));
await t("メンバーは読める", () => assertSucceeds(getDocs(collection(db(FRIEND), "lives"))));
await t("メンバーは全員の記録を読める", () => assertSucceeds(getDocs(collection(db(FRIEND), "entries"))));
await t("オーナーは読める", () => assertSucceeds(getDocs(collection(db(OWNER), "tours"))));

console.log("メンバー管理");
await t("メンバーはメンバー一覧を変更できない", () => assertFails(setDoc(doc(db(FRIEND), "config/members"), { emails: ["a@b.c"] })));
await t("オーナーはメンバー一覧を変更できる", () => assertSucceeds(setDoc(doc(db(OWNER), "config/members"), { emails: ["friend@gmail.com", "new@gmail.com"] })));
await t("招待されていない人は書き込めない", () => assertFails(setDoc(doc(db(OTHER), "lives/x"), { tourId: "t1" })));

console.log("公演（共有）");
await t("メンバーは公演を追加できる", () => assertSucceeds(setDoc(doc(db(FRIEND), "lives/l2"), { tourId: "t1", songs: [] })));
await t("メンバーはセットリストを編集できる", () => assertSucceeds(updateDoc(doc(db(FRIEND), "lives/l1"), { songs: [{ n: 1, t: "Rising Sun" }] })));
await t("メンバーはツアーを編集できる", () => assertSucceeds(updateDoc(doc(db(FRIEND), "tours/t1"), { name: "T2" })));
await t("メンバーは公演を削除できない", () => assertFails(deleteDoc(doc(db(FRIEND), "lives/l1"))));
await t("メンバーはツアーを削除できない", () => assertFails(deleteDoc(doc(db(FRIEND), "tours/t1"))));
await t("オーナーは公演を削除できる", () => assertSucceeds(deleteDoc(doc(db(OWNER), "lives/l2"))));

console.log("一人ひとりの記録");
await t("自分の記録を作れる", () => assertSucceeds(setDoc(doc(db(FRIEND), "entries/l1_friend-uid"), { liveId: "l1", uid: "friend-uid", seat: "A" })));
await t("自分の記録を更新できる", () => assertSucceeds(setDoc(doc(db(FRIEND), "entries/l1_friend-uid"), { liveId: "l1", uid: "friend-uid", seat: "B" })));
await t("他人の記録は書き換えられない", () => assertFails(setDoc(doc(db(FRIEND), "entries/l1_owner-uid"), { liveId: "l1", uid: "owner-uid", seat: "X" })));
await t("他人になりすまして記録を作れない", () => assertFails(setDoc(doc(db(FRIEND), "entries/l1_owner-uid"), { liveId: "l1", uid: "friend-uid" })));
await t("ID と中身が食い違う記録は作れない", () => assertFails(setDoc(doc(db(FRIEND), "entries/l9_friend-uid"), { liveId: "l1", uid: "friend-uid" })));
await t("他人の記録は削除できない", () => assertFails(deleteDoc(doc(db(FRIEND), "entries/l1_owner-uid"))));
await t("オーナーは他人の記録を削除できる", () => assertSucceeds(deleteDoc(doc(db(OWNER), "entries/l1_friend-uid"))));

console.log("写真");
await t("自分の写真を保存できる", () => assertSucceeds(setDoc(doc(db(FRIEND), "photos/fp"), { data: "abc", uid: "friend-uid", createdAt: 1 })));
await t("他人名義の写真は保存できない", () => assertFails(setDoc(doc(db(FRIEND), "photos/fp2"), { data: "abc", uid: "owner-uid" })));
await t("1MB近い写真は拒否", () => assertFails(setDoc(doc(db(FRIEND), "photos/big"), { data: "x".repeat(1000001), uid: "friend-uid" })));
await t("写真は書き換えられない", () => assertFails(setDoc(doc(db(FRIEND), "photos/fp"), { data: "zzz", uid: "friend-uid" })));
await t("他人の写真は削除できない", () => assertFails(deleteDoc(doc(db(FRIEND), "photos/ownerphoto"))));
await t("自分の写真は削除できる", () => assertSucceeds(deleteDoc(doc(db(FRIEND), "photos/fp"))));
await t("旧データの写真(uidなし)はメンバーは削除できない", () => assertFails(deleteDoc(doc(db(FRIEND), "photos/legacy"))));
await t("旧データの写真はオーナーが削除できる", () => assertSucceeds(deleteDoc(doc(db(OWNER), "photos/legacy"))));

console.log("旧データ（バックアップ）");
await t("オーナーは旧データを読める", () => assertSucceeds(getDoc(doc(db(OWNER), "archive/allLives"))));
await t("メンバーは旧データを読めない", () => assertFails(getDoc(doc(db(FRIEND), "archive/allLives"))));
await t("オーナーでも旧データは書き換えられない", () => assertFails(setDoc(doc(db(OWNER), "archive/allLives"), { lives: [] })));

console.log("メンバーから外された人");
await env.withSecurityRulesDisabled(ctx => setDoc(doc(ctx.firestore(), "config/members"), { emails: [] }));
await t("外された人は読めなくなる", () => assertFails(getDocs(collection(db(FRIEND), "lives"))));

console.log(`\n${pass} passed, ${fail} failed`);
await env.cleanup();
process.exit(fail ? 1 : 0);

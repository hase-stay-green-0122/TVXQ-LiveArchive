// 実アプリ（ビルド済みの ../dist）を、Firestore/Auth エミュレータ＋本番と同じルールで動かす E2E テスト。
// オーナーと友人が同時に使う流れを再現する。
// 実行: npm test（先に親フォルダで npm run build しておくこと）
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const FB  = path.dirname(require.resolve("firebase/package.json"));
const OUT = path.join(__dirname, "shots"); fs.mkdirSync(OUT, { recursive: true });
const APP_DIR = path.join(__dirname, "..");
const APP = "http://localhost:4174";
const PROJECT = "tvxq-live-archive";

const OWNER    = { sub: "owner-uid",    email: "hase.stay.green.0122@gmail.com", email_verified: true, name: "はせ" };
const FRIEND   = { sub: "friend-uid",   email: "friend@gmail.com",               email_verified: true, name: "ともだち" };
const STRANGER = { sub: "stranger-uid", email: "stranger@gmail.com",             email_verified: true, name: "しらない人" };

// gstatic の 10.12.0 を、ローカルの 10.14.1 CDN ビルド＋エミュレータ接続ラッパーに差し替える
const V = "https://www.gstatic.com/firebasejs/10.14.1/";
const wrappers = {
  "firebase-app.js": `export * from "${V}firebase-app.js";`,
  "firebase-firestore.js": `
    export * from "${V}firebase-firestore.js";
    import { getFirestore as g, connectFirestoreEmulator } from "${V}firebase-firestore.js";
    let db; export function getFirestore(app) { if (!db) { db = g(app); connectFirestoreEmulator(db, "127.0.0.1", 8080); } return db; }`,
  "firebase-auth.js": `
    export * from "${V}firebase-auth.js";
    import { getAuth as g, connectAuthEmulator, signInWithCredential, GoogleAuthProvider } from "${V}firebase-auth.js";
    let a; export function getAuth(app) { if (!a) { a = g(app); connectAuthEmulator(a, "http://127.0.0.1:9099", { disableWarnings: true }); } return a; }
    export function signInWithPopup(auth) { return signInWithCredential(auth, GoogleAuthProvider.credential(JSON.stringify(window.__ID))); }`,
};

let pass = 0, fail = 0;
const check = (name, cond, extra = "") => { cond ? pass++ : fail++; console.log(`  ${cond ? "✓" : "✗"} ${name}${!cond && extra ? "  → " + extra : ""}`); };

// 管理用 REST（ルール無視の Bearer owner）
const admin = async (method, docPath, body) => {
  const r = await fetch(`http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents/${docPath}`,
    { method, headers: { Authorization: "Bearer owner", "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  return r.json();
};
const listDocs = async (col) => ((await admin("GET", col)).documents || []);

async function newPage(browser, identity, name) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(id => { window.__ID = id; }, identity);
  page.on("dialog", d => console.log(`  [${name}] dialog:`, d.message().slice(0,80)));
  page.on("pageerror", e => console.log(`  [${name}] PAGEERROR`, e.message));
  page.on("console", m => { if (m.type() === "error" && !/PERMISSION_DENIED|permission/i.test(m.text())) console.log(`  [${name}] console.error`, m.text().slice(0, 200)); });
  await page.route("https://www.gstatic.com/firebasejs/**", route => {
    const url = route.request().url();
    const file = url.split("/").pop();
    if (url.includes("/10.12.0/")) return route.fulfill({ contentType: "application/javascript", body: wrappers[file] });
    return route.fulfill({ contentType: "application/javascript", body: fs.readFileSync(path.join(FB, file)) });
  });
  await page.route("https://fonts.googleapis.com/**", r => r.fulfill({ contentType: "text/css", body: "" }));
  await page.goto(APP);
  return page;
}
const login = async (page) => { await page.click("text=Googleでログイン"); };
const openTour = (page, name) => page.click(`text=${name}`, { force: true });
const ensureTourOpen = async (page, tour) => {
  if (await page.locator(".live-item").count() === 0) { await openTour(page, tour); await page.waitForTimeout(300); }
};
const openLive = async (page, tour, idx) => {
  await ensureTourOpen(page, tour);
  await page.locator(".live-item").nth(idx).click({ force: true });
  await page.waitForSelector(".mhero");
};
const shot = (page, n) => page.screenshot({ path: path.join(OUT, n + ".png"), fullPage: false });

// ビルド済みのアプリを配信（vite preview）
async function startPreview() {
  if (!fs.existsSync(path.join(APP_DIR, "dist/index.html"))) throw new Error("../dist がありません。先に npm run build してください");
  const proc = spawn("npx", ["vite", "preview", "--port", "4174", "--strictPort"], { cwd: APP_DIR, stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(APP)).ok) return proc; } catch { /* 起動待ち */ }
    await new Promise(r => setTimeout(r, 500));
  }
  proc.kill(); throw new Error("vite preview が起動しませんでした");
}

let preview;
(async () => {
  preview = await startPreview();
  // ── 旧データ（本番の archive/allLives を模したもの）を投入 ──
  const legacyLives = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/legacy.json"), "utf8"));
  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
  await fetch(`http://127.0.0.1:8080/v1/projects/${PROJECT}/databases/(default)/documents/archive/allLives`, {
    method: "PATCH", headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { lives: toFs(legacyLives) } }),
  });
  await admin("PATCH", "photos/legacyphoto", { fields: { data: { stringValue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" }, createdAt: { integerValue: "1" } } });

  const browser = await chromium.launch();

  console.log("1. ログインしていない人");
  const anon = await newPage(browser, null, "anon");
  await anon.waitForSelector("text=Googleでログイン");
  check("ログイン画面が出る", await anon.isVisible("text=招待されたメンバー専用"));
  await shot(anon, "01-login");

  console.log("2. オーナーが初回ログイン → 旧データを移行");
  const owner = await newPage(browser, OWNER, "owner");
  await login(owner);
  await owner.waitForSelector(".tour-card", { timeout: 20000 });
  await owner.waitForTimeout(800);
  const tourNames = await owner.locator(".tour-card").allInnerTexts();
  check("ツアーが3つ表示（空ツアー含む）", tourNames.length === 3, tourNames.length);
  check("統計: 公演数=2（ダミー公演は移行しない）", (await owner.locator(".stat-n").nth(0).innerText()) === "2");
  check("旧データはバックアップとして残っている", !!(await admin("GET", "archive/allLives")).fields);
  check("移行済みフラグ", (await admin("GET", "config/migration")).fields?.done?.booleanValue === true);
  const ents = await listDocs("entries");
  check("旧データの個人記録がオーナーの記録として移行された", ents.length === 1 && ents[0].name.split("/").pop().startsWith("nissan-0426_") && ents[0].fields.name.stringValue === "はせ", ents.map(e => e.name.split("/").pop()));
  await shot(owner, "02-owner-home");

  await openLive(owner, "RED OCEAN", 1);
  check("オーナーの記録が表示される", await owner.isVisible(".entry-card.mine .entry-me"));
  check("旧データの思い出が表示される", await owner.isVisible("text=全身が震えた", { exact: false }));
  await owner.waitForSelector(".entry-card.mine .photo img", { timeout: 5000 }).catch(() => {});
  check("旧データの写真が表示される", await owner.locator(".entry-card.mine .photo img").count() === 1);
  await shot(owner, "03-owner-live");

  // iPhone の Safari では、ツールバーが出ているとき「見えている高さ」が 100vh より短い。
  // その状態を再現して、詳細画面の「ホームに戻る」が画面外に押し出されないことを確認する。
  const toolbar = await owner.addStyleTag({ content: ".overlay { top:auto !important; height:calc(100vh - 140px) !important; }" });
  const navGap = await owner.evaluate(() => {
    const ov = document.querySelector(".overlay").getBoundingClientRect();
    const nav = document.querySelector(".modal .nav-back").getBoundingClientRect();
    return Math.round(nav.top - ov.top);
  });
  check("Safari のツールバー表示中も「ホームに戻る」が見える", navGap >= 0, `ボタンが ${-navGap}px 画面外`);
  await shot(owner, "03b-safari-toolbar");
  await toolbar.evaluate(el => el.remove());
  await owner.click("text=ホームに戻る");

  console.log("3. 招待されていない人");
  const stranger = await newPage(browser, STRANGER, "stranger");
  await login(stranger);
  await stranger.waitForSelector("text=このアカウントは招待されていません", { timeout: 15000 });
  check("「招待されていません」画面が出る", true);
  await shot(stranger, "04-not-invited");

  console.log("4. オーナーが友人を招待");
  await owner.click("text=👥 メンバー");
  await owner.fill("input[type=email]", "Friend@Gmail.com");
  await owner.click("button:has-text('追加')");
  await owner.waitForSelector("text=friend@gmail.com");
  check("メンバー一覧に追加（小文字に正規化）", true);
  await shot(owner, "05-members");
  await owner.click("text=ホームに戻る");

  console.log("5. 友人がログインして自分の記録を書く");
  const friend = await newPage(browser, FRIEND, "friend");
  await login(friend);
  await friend.waitForSelector(".tour-card", { timeout: 15000 });
  check("友人にはツアー削除ボタンが出ない", await friend.locator(".tour-del").count() === 0);
  await openLive(friend, "RED OCEAN", 1);
  check("友人からオーナーの記録が見える", await friend.isVisible("text=はせ"));
  check("友人の記録はまだない", await friend.isVisible("text=あなたの記録はまだありません"));
  // オーナーも同じ公演を開いておく（リアルタイム反映の確認用）
  await openLive(owner, "RED OCEAN", 1);

  await friend.click("text=✏️ 自分の記録を書く");
  await friend.fill("input[placeholder^='例: W1F']", "S2F / 列3");
  await friend.locator("textarea").nth(2).fill("ともだちの感想：最高だった！");
  // 細工した Tips（HTML として解釈されるとスクリプトが動く）
  await friend.locator("textarea").nth(5).fill('<img src=x onerror="window.__xss=1">駅は混む <strong>早めに</strong>');
  const png = path.join(OUT, "photo.png");
  if (!fs.existsSync(png)) fs.writeFileSync(png, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64"));
  await friend.setInputFiles("input[type=file]", [png]);
  await friend.waitForSelector(".photo-thumb img");
  await friend.click("text=保存してホームに戻る");
  await friend.waitForSelector(".tour-card");
  await friend.waitForTimeout(800);

  console.log("6. オーナーの画面に、リロードせず友人の記録が出る");
  await owner.waitForSelector("text=ともだちの感想", { timeout: 10000 }).catch(() => {});
  check("友人の記録がリアルタイムで表示", await owner.isVisible("text=ともだちの感想"));
  check("記録が2人分", (await owner.locator(".entry-card").count()) === 2);
  check("細工した Tips のスクリプトが動かない（XSS 対策）", !(await owner.evaluate(() => window.__xss)));
  check("細工した Tips は文字としてそのまま表示される", await owner.isVisible("text=<img src=x"));
  check("<strong> は太字として表示される", (await owner.locator(".tip-text strong", { hasText: "早めに" }).count()) === 1);
  await shot(owner, "06-owner-sees-friend");

  console.log("7. 元の不具合の再現テスト：古い画面から保存しても他人の記録は消えない");
  // オーナーは友人が書く前から開いていた画面のまま、自分の記録を編集して保存
  await owner.click(".entry-card.mine .entry-edit");
  await owner.locator("textarea").nth(2).fill("オーナーの追記");
  await owner.click("text=保存してホームに戻る");
  await owner.waitForSelector(".tour-card"); await owner.waitForTimeout(800);
  const entryOf = async (who) => (await listDocs("entries")).find(e => e.fields.name.stringValue === who) || {};
  const friendEntry = await entryOf("ともだち");
  check("友人の記録が残っている", (friendEntry.fields?.memory?.mapValue?.fields?.after?.stringValue || "").includes("ともだちの感想"));
  const ownerEntry = await entryOf("はせ");
  check("オーナーの旧データの思い出も残っている", JSON.stringify(ownerEntry.fields).includes("全身が震えた"));
  check("オーナーの追記が保存された", JSON.stringify(ownerEntry.fields).includes("オーナーの追記"));

  console.log("8. セットリストの同時編集");
  await openLive(friend, "RED OCEAN", 1);
  await friend.click(".entry-card.mine .entry-edit");      // 友人が編集を開く
  await openLive(owner, "RED OCEAN", 1);
  await owner.click(".entry-card.mine .entry-edit");
  await owner.locator("textarea").first().fill("1. オーナーが直したセトリ");
  await owner.click("text=保存してホームに戻る");
  await owner.waitForSelector(".tour-card"); await owner.waitForTimeout(800);
  let dialogMsg = "";
  friend.once("dialog", d => { dialogMsg = d.message(); d.dismiss(); });
  await friend.locator("textarea").first().fill("1. 友人が直したセトリ");
  await friend.click("text=保存してホームに戻る");
  await friend.waitForTimeout(1200);
  check("上書き前に確認ダイアログが出る", dialogMsg.includes("他のメンバーがセットリストを更新"), dialogMsg);
  const live = await admin("GET", "lives/nissan-0426");
  check("キャンセルしたのでオーナーのセトリが残る", JSON.stringify(live.fields.songs).includes("オーナーが直したセトリ"));
  check("キャンセル後はフォームに留まる", await friend.isVisible("text=詳細に戻る"));
  await friend.click("text=詳細に戻る"); await friend.click("text=ホームに戻る");

  console.log("9. 写真の後片付け");
  const before = (await listDocs("photos")).length;
  await openLive(friend, "RED OCEAN", 1);
  await friend.click(".entry-card.mine .entry-edit");
  await friend.setInputFiles("input[type=file]", [png]);
  await friend.waitForTimeout(1500);
  check("保存済みの写真が消えていない（表示される）", await friend.locator(".photo-thumb img").count() === 2);
  await friend.waitForFunction(() => document.querySelectorAll(".photo-thumb img").length === 2);
  check("アップロード直後は写真が増える", (await listDocs("photos")).length === before + 1);
  await friend.click("text=詳細に戻る");            // 保存せずに閉じる
  await friend.waitForTimeout(800);
  check("保存せずに閉じたら写真が片付けられる", (await listDocs("photos")).length === before);
  await friend.click("text=ホームに戻る");

  console.log("10. オーナーが公演を削除 → 友人の画面からも消える");
  await ensureTourOpen(friend, "RED OCEAN");
  const friendLivesBefore = await friend.locator(".live-item").count();
  await ensureTourOpen(owner, "RED OCEAN");
  await owner.locator(".live-del").nth(1).click({ force: true });
  await owner.click(".del-dialog-confirm");
  await friend.waitForTimeout(1500);
  check("友人の画面でも公演が消える", (await friend.locator(".live-item").count()) === friendLivesBefore - 1);
  check("公演の記録も削除", (await listDocs("entries")).filter(e => e.name.includes("nissan-0426")).length === 0);
  check("記録の写真も削除（旧データの写真含む）", (await listDocs("photos")).length === 0, (await listDocs("photos")).map(p => p.name.split("/").pop()));

  console.log("10b. 削除ダイアログの見出し");
  await owner.locator(".tour-card").first().locator(".tour-del").click({ force: true });
  check("ツアー削除では「ツアーを削除しますか？」と出る", await owner.isVisible("text=ツアーを削除しますか？"));
  await owner.click(".del-dialog-cancel");

  console.log("10c. ライブを追加（開場なし・開演あり）");
  await owner.click(".add-btn");
  await owner.click("text=ライブを追加");
  await owner.locator(".modal button", { hasText: "RED OCEAN" }).click();
  await owner.fill("input[type=date]", "2026-12-24");
  await owner.fill("input[type=time]", "18:30");
  await owner.fill("input[placeholder='例: 東京ドーム']", "東京ドーム");
  await owner.locator("textarea").first().fill("1. Mirotic\n2. 呪文 [アンコール]");
  await owner.click("text=保存してホームに戻る");
  await owner.waitForSelector(".tour-card"); await owner.waitForTimeout(1000);
  await ensureTourOpen(owner, "RED OCEAN");
  await owner.locator(".live-item", { hasText: "東京ドーム" }).click({ force: true });
  await owner.waitForSelector(".mhero");
  check("追加したライブの開演時刻が表示される", await owner.isVisible("text=18:30"));
  check("追加したライブのアンコールが区切られる", await owner.locator(".enc-lbl").count() === 1);
  check("追加したライブに自分の記録が作られる", await owner.locator(".entry-card.mine .entry-me").count() === 1);
  await owner.click("text=ホームに戻る");

  console.log("11. メンバーから外すと、開いている画面でも見られなくなる");
  owner.once("dialog", d => d.accept());
  await owner.click("text=👥 メンバー");
  await owner.locator(".live-del").last().click();
  await friend.waitForSelector("text=このアカウントは招待されていません", { timeout: 10000 }).catch(() => {});
  check("友人の画面が「招待されていません」に切り替わる", await friend.isVisible("text=このアカウントは招待されていません"));

  console.log(`\n${pass} passed, ${fail} failed`);
  await browser.close();
  preview.kill();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); preview?.kill(); process.exit(1); });

// JSON → Firestore REST Value
function toFs(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFs) } };
  if (typeof v === "object") return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toFs(x)])) } };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  return { stringValue: v };
}

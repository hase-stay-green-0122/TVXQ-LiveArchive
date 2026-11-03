# TVXQ! LIVE ARCHIVE

東方神起のライブ参戦記録を、招待した仲間と共有するアーカイブアプリ。
目的は「ファンの思い出をリアルにアーカイブし、想いを分かち合い、もっとアツくする」こと。
オーナー（このリポジトリの持ち主）は日本語話者で、エンジニアではない。説明・UI 文言・コードのコメントは日本語で書く。

## 構成

- `my-app-new/`：アプリ本体（React 19 + Vite 8、TypeScript なし）
  - `src/App.jsx`：ログイン → メンバー確認 → アーカイブ画面（`App` / `MemberGate` / `Archive`）。データの購読と、ホーム画面の組み立て
  - `src/components/`：画面の部品
    - `TourCard.jsx`（ホームのツアーカード）、`LiveDetail.jsx`（公演詳細・みんなの記録・座席マップ）、`EditForm.jsx`（公演の編集）
    - `AddForms.jsx`（＋メニュー・ライブ追加）、`TourForms.jsx`（ツアーの追加・編集）
    - `Photos.jsx`、`MemoryTips.jsx`、`Common.jsx`（共通の小さな部品）、`Auth.jsx`（ログイン・招待・メンバー管理）
  - `src/lib/`：画面を持たない処理
    - `firebase.js`（初期化・Google ログイン・`OWNER_EMAIL`）、`store.js`（Firestore の読み書き・購読・旧データ移行）、`photos.js`（写真の圧縮・保存・削除）
    - `text.js`（セトリ・Tips の文字列変換）、`tourVisual.js`（ツアーのビジュアル SVG 生成）
  - `src/hooks/usePhotoUpload.js`：編集フォームの写真欄の状態管理
  - `src/styles.js`（CSS 文字列）、`src/constants.js`、`src/data/`（初期データ・画像）
  - `firestore.rules`：セキュリティルール（本番に自動で反映される。後述）
  - `test/`：テスト用の別パッケージ（Vercel のビルドには含まれない）
  - `FIREBASE_SETUP.md`：Firebase コンソールで行う設定の手順（オーナー向け）
- `.github/workflows/ci.yml`：CI とルールの自動反映

ログインは、本番（`tvxq-live-archive.vercel.app`）では `authDomain` をアプリ自身のドメインにしている。`vercel.json` で `/__/auth/*` と `/__/firebase/*` を `tvxq-live-archive.firebaseapp.com` に中継し、iPhone の Safari で起きる `missing initial state` エラーを避けている。Google Cloud の OAuth クライアントに、リダイレクト URI `https://tvxq-live-archive.vercel.app/__/auth/handler` の登録が必要。

Firebase の SDK は npm ではなく、gstatic の CDN（`https://www.gstatic.com/firebasejs/10.12.0/...`）から直接 import している。バージョンを上げるときは、すべての import を同時に変えること。

## データ構造（Firestore、プロジェクト `tvxq-live-archive`）

| パス | 中身 | 書ける人 |
|---|---|---|
| `tours/{tourId}` | ツアー名・サブタイトル・色・ビジュアル SVG・`order` | メンバー（削除はオーナーのみ） |
| `lives/{liveId}` | 日付・会場・時刻・セットリスト `songs`・`tourId`・`order` | メンバー（削除はオーナーのみ） |
| `entries/{liveId}_{uid}` | **一人ひとりの記録**：座席・`highlight`・写真・思い出 `memory`・Tips | 本人のみ |
| `photos/{id}` | 圧縮済み JPEG の base64（1 MB 未満）と `uid` | 本人のみ（書き換え不可） |
| `config/members` | 招待メンバーのメールアドレス `emails`（小文字） | オーナーのみ |
| `config/migration` | 旧データの移行済みフラグ | オーナーのみ |
| `archive/allLives` | 旧構造のデータ。**読み取り専用のバックアップ**として保持 | 誰も書けない |

設計の原則（過去の不具合の再発防止）：
- **全体を丸ごと上書きする保存は禁止。** 以前は全データを 1 つのドキュメントに丸ごと保存していたため、複数の人や端末で使うと他人の変更を消していた。今は「変えたフィールドだけを `updateDoc`」「自分の記録は自分の `entries` ドキュメントにだけ書く」。
- 画面は `onSnapshot` でリアルタイムに購読している。読み込み時点のコピーをもとに書き戻さない。
- 写真の参照は `"fsphoto:{id}"` という文字列。古い `data:` や `http` の URL もそのまま表示できるようにしている。
- Firebase Storage は有料プランが必須なので使わない。

`OWNER_EMAIL`（`hase.stay.green.0122@gmail.com`）は `src/lib/firebase.js` と `firestore.rules` の `ownerEmail()` の 2 か所にある。**変えるときは必ず両方を変える。**

## コマンド

```bash
cd my-app-new
npm ci && npm run lint && npm run build   # lint とビルド
npm run dev                               # 開発サーバー

cd my-app-new/test
npm ci
npm test            # ルールのテスト + E2E（Firestore/Auth エミュレータ上。先に親フォルダで build しておく）
npm run test:rules  # ルールのテストだけ
npm run test:e2e    # E2E だけ
```

- `test/rules.test.mjs`：`firestore.rules` のテスト。権限を変えたら、ここにテストを足す。
- `test/e2e.test.cjs`：ビルド済みのアプリを Playwright で操作する。gstatic の Firebase をローカルのエミュレータ向けに差し替え、ログインは偽の ID トークンで行う。オーナー・友人・招待されていない人が同時に使う流れを再現する。
- エミュレータには Java が必要。初回の実行時にエミュレータの jar（約 60 MB）をダウンロードする。

**変更したら、コミットする前に lint・build・`npm test` をすべて通すこと。** UI を変えたときは E2E のセレクタも確認する。

## 公開の流れ

- `main` に push すると、**Vercel が本番（https://tvxq-live-archive.vercel.app）に自動でデプロイ**する。ほかのブランチはプレビュー版としてデプロイされる。
- `main` に push すると、GitHub Actions がテストを通したうえで、**`firestore.rules` を本番に自動で反映**する（シークレット `FIREBASE_SERVICE_ACCOUNT` が必要）。
- そのため、**`main` に入れたものはすぐ本番に出る。** 作業はブランチで行い、オーナーの了承を得てから `main` に入れる。
- アプリとルールの両方を変えるときは、新旧の組み合わせ（新しいアプリ＋古いルール、古いアプリ＋新しいルール）でも壊れないか考える。

## Firebase コンソールでしかできない操作

Authentication の設定や承認済みドメインなどは、コンソールで操作するしかない。オーナーはスマホ（iPhone の Safari）で操作することが多いので、案内するときはメニュー名と順番を具体的に書く。新しいコンソールでは、Authentication は「セキュリティ」、Firestore は「Database と Storage」の中にある。

## クラウドのセッションで作業するときの注意

- この環境から `*.firebaseapp.com`、`*.vercel.app`、`www.gstatic.com` には接続できない。アプリの動作はエミュレータ上の E2E で確認する。
- Firestore の REST API（`firestore.googleapis.com`）には接続できる。ただし本番のルールでは、ログインしていない読み取りはすべて 403 になる（それで正常）。
- Playwright と Chromium はあらかじめ入っている（`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`）。`playwright install` はしない。`test/package.json` の playwright のバージョンは、入っているものと揃えている。

## コミット

- コミットメッセージは内容がわかるように書く（「update」だけのメッセージにしない）。
- 1 つのコミットには、1 つの目的の変更だけを入れる。

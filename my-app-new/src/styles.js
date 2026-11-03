// アプリ全体のスタイル（<style> に流し込む CSS 文字列）

// ─────────────────────────────────────────────
//  スタイル
// ─────────────────────────────────────────────

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600;700&display=swap');
  :root { --red:#c0152a; --red-deep:#8b0d1c; --ink:#1c0a0c; --paper:#fdf6f6; --offwhite:#fff8f8; --gold:#d4a843; --gold-lt:#edd98a; --mist:#f5e8e8; --shadow:rgba(140,10,30,0.13); }
  * { box-sizing:border-box; margin:0; padding:0; }

  /* ベースレイアウト */
  body { background:var(--paper); }
  .app { font-family:"Noto Serif JP",serif; background:var(--paper); min-height:100vh; color:var(--ink); width:100%; max-width:430px; margin:0 auto; }

  /* タブレット（601px〜1024px）：中央寄せ・最大600px */
  @media (min-width:601px) and (max-width:1024px) {
    .app { max-width:600px; }
    .hdr-vis { height:160px; }
    .content { padding:24px 28px 60px; }
    .tour-card { border-radius:16px; margin-bottom:14px; }
    .modal { max-height:88vh; max-height:min(88dvh, calc(100% - 24px)); }
  }

  /* PC（1025px〜）：2カラム */
  @media (min-width:1025px) {
    body { background:#1a0608; }
    .app { max-width:100%; display:grid; grid-template-columns:380px 1fr; grid-template-rows:auto 1fr; min-height:100vh; }
    .hdr { grid-column:1; grid-row:1 / 3; position:sticky; top:0; height:100vh; overflow-y:auto; display:flex; flex-direction:column; }
    .hdr-vis { height:220px; flex-shrink:0; }
    .hdr-body { flex:1; padding:20px 32px 32px; }
    .hdr-sub { font-size:18px; }
    .stat-n { font-size:28px; }
    .stats { gap:28px; }
    .content { grid-column:2; grid-row:1 / 3; padding:32px 40px 60px; max-width:760px; overflow-y:auto; }
    .sec-lbl { font-size:11px; margin-bottom:16px; }
    .tour-card { border-radius:18px; margin-bottom:16px; }

    .live-item { padding:14px 20px; }
    .live-item-venue { font-size:14px; }
    .overlay { position:fixed; }
    .modal { max-width:560px; margin:0 auto; border-radius:20px 20px 0 0; }
    .add-btn { width:52px; height:52px; font-size:26px; }
    .del-dialog { max-width:400px; }
  }

  /* PCサイドバー内のスクロール対応 */
  @media (min-width:1025px) {
    .hdr-row { margin-top:24px; }
    .hdr-body { display:flex; flex-direction:column; gap:0; }
  }

  /* Header */
  .hdr { background:linear-gradient(160deg,var(--red-deep),var(--red) 60%,#d42035); position:relative; overflow:hidden; }
  .hdr-vis { position:relative; height:130px; overflow:hidden; background:linear-gradient(180deg,#0d0204 0%,#1a0306 40%,#2d0508 100%); }
  .hdr-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 180px 60px at 50% 100%,rgba(192,21,42,.4),transparent 70%),radial-gradient(ellipse 80px 120px at 35% 100%,rgba(220,30,50,.2),transparent 65%),radial-gradient(ellipse 80px 120px at 65% 100%,rgba(220,30,50,.2),transparent 65%); }
  .hdr-aktf { position:absolute; top:16px; left:0; right:0; display:flex; justify-content:center; pointer-events:none; z-index:10; }
  .hdr-aktf span { font-family:"Noto Serif JP",serif; font-size:16px; font-style:italic; font-weight:400; letter-spacing:.38em; color:#fff; white-space:nowrap; text-shadow:0 0 24px rgba(232,17,45,.9),0 0 8px rgba(232,17,45,.6),0 1px 4px rgba(0,0,0,.9); }
  .hdr-tdots { position:absolute; bottom:13px; left:50%; transform:translateX(-50%); display:grid; grid-template-columns:repeat(9,7px); grid-template-rows:repeat(7,7px); gap:2px; z-index:2; }
  .hdr-dot { width:4px; height:6px; border-radius:50% 50% 30% 30%; align-self:end; }
  .hdr-silhouette { position:absolute; bottom:0; left:50%; transform:translateX(calc(-50% + 80px)); z-index:6; opacity:.92; mix-blend-mode:screen; }
  .hdr-body { padding:14px 24px 16px; }
  .hdr-sub { font-family:"Noto Serif JP",serif; font-weight:300; font-size:16px; letter-spacing:.1em; color:#fff; }
  .hdr-row { display:flex; align-items:center; justify-content:space-between; margin-top:14px; }
  .stats { display:flex; gap:22px; }
  .stat-n { font-family:"Noto Serif JP",serif; font-size:24px; color:var(--gold-lt); line-height:1; }
  .stat-l { font-size:9px; color:rgba(255,255,255,.45); letter-spacing:.14em; margin-top:2px; }
  .add-btn { background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.35); color:#fff; border-radius:50%; width:44px; height:44px; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  /* Content */
  .content { padding:20px 18px 40px; }
  .sec-lbl { font-size:10px; letter-spacing:.22em; color:rgba(28,10,12,.35); text-transform:uppercase; margin-bottom:12px; padding-left:2px; }

  /* Tour card */
  .tour-card { background:var(--ink); border-radius:14px; margin-bottom:12px; overflow:hidden; box-shadow:0 2px 10px var(--shadow); border:1px solid rgba(192,21,42,.2); }
  .tour-card-arrow { font-size:18px; color:rgba(255,255,255,.6); transition:transform .2s; flex-shrink:0; }
  .tour-card-arrow.open { transform:rotate(90deg); }

  /* RED OCEAN visual */
  .red-vis { background:linear-gradient(180deg,#0a0204,#1a0208 50%,#2a0510); }
  .red-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 300px 30px at 50% 85%,rgba(232,17,45,.35),transparent 70%),radial-gradient(ellipse 200px 20px at 30% 70%,rgba(192,21,42,.2),transparent 70%),radial-gradient(ellipse 200px 20px at 70% 60%,rgba(192,21,42,.2),transparent 70%); }
  .red-wm { display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:2; }
  .red-wm span { font-family:"Noto Serif JP",serif; font-size:44px; font-weight:300; letter-spacing:.2em; color:rgba(255,255,255,.75); white-space:nowrap; }
  .red-waves { position:absolute; bottom:0; left:0; right:0; z-index:3; }
  .red-wave { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(232,17,45,.3) 25%,rgba(255,80,100,.5) 50%,rgba(232,17,45,.3) 75%,transparent); }
  .red-wave:nth-child(1){bottom:8px} .red-wave:nth-child(2){bottom:16px;opacity:.6} .red-wave:nth-child(3){bottom:24px;opacity:.3}
  .red-ocean-dots { position:absolute; bottom:50px; left:0; right:0; display:flex; justify-content:center; flex-wrap:wrap; gap:3px; padding:0 12px; z-index:3; }
  .rod { width:3px; height:8px; border-radius:2px 2px 0 0; }
  .red-badge { position:absolute; top:12px; right:12px; background:var(--gold); color:#fff; font-size:8px; font-weight:700; letter-spacing:.15em; padding:3px 9px; border-radius:3px; z-index:5; }

  /* ZONE visual */
  .zone-vis { background:linear-gradient(160deg,#060e1c,#0d1e38 45%,#091628); }
  .zone-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 160px 90px at 15% 20%,rgba(80,160,255,.14),transparent 65%),radial-gradient(ellipse 120px 70px at 85% 75%,rgba(60,130,220,.12),transparent 65%),radial-gradient(ellipse 200px 40px at 50% 100%,rgba(40,100,180,.18),transparent 70%); }
  .zone-wm { display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:2; }
  .zone-wm span { font-family:"Noto Serif JP",serif; font-size:44px; font-weight:300; letter-spacing:.32em; color:rgba(255,255,255,.75); white-space:nowrap; }
  .zone-badge { position:absolute; top:12px; right:12px; background:rgba(80,150,255,.2); border:1px solid rgba(100,170,255,.35); color:rgba(160,210,255,.9); font-size:8px; font-weight:700; letter-spacing:.15em; padding:3px 9px; border-radius:3px; z-index:5; }

  /* Lives list */
  .lives-list { border-top:1px solid rgba(255,255,255,.06); }
  .live-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,.04); cursor:pointer; position:relative; }
  .live-item:last-child { border-bottom:none; }
  .live-item:active { background:rgba(255,255,255,.05); }
  .live-del-wrap { position:relative; flex-shrink:0; }
  .live-del { background:rgba(192,21,42,.15); border:1px solid rgba(192,21,42,.3); color:rgba(255,100,100,.8); border-radius:50%; width:28px; height:28px; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .15s; }
  .live-del:hover { background:rgba(192,21,42,.45); color:#fff; }
  .live-del-tip { position:absolute; right:36px; top:50%; transform:translateY(-50%); background:rgba(28,10,12,.92); color:#fff; font-size:11px; padding:4px 10px; border-radius:6px; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .15s; }
  .live-del-wrap:hover .live-del-tip { opacity:1; }
  .del-dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:200; display:flex; align-items:center; justify-content:center; padding:24px; }
  .del-dialog { background:var(--paper); border-radius:16px; padding:24px 22px; width:100%; max-width:320px; box-shadow:0 8px 32px rgba(0,0,0,.3); }
  .del-dialog-ttl { font-family:"Noto Serif JP",serif; font-size:16px; font-weight:600; color:var(--ink); margin-bottom:8px; }
  .del-dialog-body { font-size:13px; color:rgba(28,10,12,.6); line-height:1.7; margin-bottom:20px; }
  .del-dialog-body strong { color:var(--ink); }
  .del-dialog-btns { display:flex; gap:10px; }
  .del-dialog-cancel { flex:1; background:transparent; border:1.5px solid rgba(28,10,12,.2); color:rgba(28,10,12,.6); border-radius:10px; padding:12px; font-size:14px; cursor:pointer; font-family:"Noto Serif JP",serif; }
  .del-dialog-confirm { flex:1; background:var(--red); border:none; color:#fff; border-radius:10px; padding:12px; font-size:14px; cursor:pointer; font-family:"Noto Serif JP",serif; font-weight:600; }
  .live-item-emoji { font-size:22px; flex-shrink:0; }
  .live-item-info { flex:1; min-width:0; }
  .live-item-date { font-family:"Noto Serif JP",serif; font-size:11px; color:rgba(232,17,45,.8); letter-spacing:.12em; margin-bottom:2px; }
  .live-item-venue { font-size:13px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .live-item-seat { font-size:10px; color:rgba(255,255,255,.35); margin-top:2px; }

  /* Modal */
  .overlay { position:fixed; inset:0; background:rgba(28,10,12,.78); z-index:100; display:flex; align-items:flex-end; backdrop-filter:blur(5px); }
  /* iPhone の Safari では 100vh が「ツールバーを隠したときの高さ」になり、モーダルの上端（ホームに戻る）が画面外に出てしまう。
     実際に見えている高さ（dvh、またはオーバーレイの高さ＝100%）を上限にする。未対応のブラウザは 92vh のまま */
  .modal { background:var(--paper); border-radius:24px 24px 0 0; width:100%; max-height:92vh; max-height:min(92dvh, calc(100% - 24px)); overflow-y:auto; padding:0 0 44px; }
  .modal-handle { width:36px; height:4px; background:rgba(192,21,42,.18); border-radius:2px; margin:0 auto 12px; display:block; }
  .modal-nav { position:sticky; top:0; z-index:10; display:flex; flex-direction:column; background:var(--paper); border-bottom:1px solid rgba(192,21,42,.08); box-shadow:0 2px 8px rgba(28,10,12,.06); padding:12px 18px 14px; }
  .modal-nav-btns { display:flex; align-items:center; justify-content:space-between; }
  .nav-back { display:flex; align-items:center; gap:4px; background:rgba(192,21,42,.08); border:1.5px solid rgba(192,21,42,.2); color:var(--red); font-size:15px; font-family:"Noto Serif JP",serif; cursor:pointer; padding:11px 18px; border-radius:10px; font-weight:500; }
  .nav-back::before { content:"‹"; font-size:22px; line-height:1; margin-right:2px; }
  .nav-right { display:flex; gap:8px; align-items:center; }
  .mhero { padding:24px 24px 20px; margin-bottom:20px; position:relative; overflow:hidden; }
  .mhero.red { background:linear-gradient(140deg,var(--red-deep),var(--red)); }
  .mhero.dark { background:linear-gradient(140deg,var(--red-deep),var(--ink)); }
  .mhero-wm { position:absolute; bottom:-16px; right:-8px; font-family:"Noto Serif JP",serif; font-size:56px; font-weight:300; color:rgba(255,255,255,.05); white-space:nowrap; pointer-events:none; }
  .mdate { font-family:"Noto Serif JP",serif; font-style:italic; font-size:12px; color:rgba(255,255,255,.6); letter-spacing:.18em; margin-bottom:6px; }
  .mtitle { font-family:"Noto Serif JP",serif; font-size:17px; font-weight:600; color:#fff; line-height:1.5; }
  .msub { font-family:"Noto Serif JP",serif; font-style:italic; font-size:13px; color:var(--gold-lt); letter-spacing:.1em; margin-top:4px; }
  .mvenue { margin-top:9px; font-size:14px; color:rgba(255,255,255,.6); }
  .mtime-row { display:flex; gap:16px; margin-top:8px; }
  .mtime { display:flex; gap:5px; font-size:13px; color:rgba(255,255,255,.5); align-items:center; }
  .mtime b { color:rgba(255,255,255,.9); }
  .edit-btn { background:var(--red); border:none; color:#fff; border-radius:10px; padding:11px 22px; font-size:15px; font-weight:500; cursor:pointer; white-space:nowrap; font-family:"Noto Serif JP",serif; }
  .msec { padding:0 20px; margin-bottom:20px; }
  .msec-ttl { font-size:13px; letter-spacing:.15em; color:rgba(28,10,12,.5); text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:8px; font-weight:600; }
  .msec-ttl::after { content:""; flex:1; height:1px; background:rgba(192,21,42,.12); }

  /* Setlist */
  .setlist { list-style:none; }
  .enc-div { display:flex; align-items:center; gap:10px; margin:12px 0 6px; }
  .enc-line { flex:1; height:1px; background:rgba(192,21,42,.15); }
  .enc-lbl { font-size:11px; letter-spacing:.2em; color:var(--red); text-transform:uppercase; white-space:nowrap; }
  .sl-item { display:flex; align-items:center; padding:10px 0; border-bottom:1px solid rgba(192,21,42,.06); gap:12px; }
  .sl-num { font-family:"Noto Serif JP",serif; font-size:17px; color:rgba(192,21,42,.4); width:24px; text-align:right; flex-shrink:0; }
  .sl-name { font-size:16px; color:var(--ink); line-height:1.4; flex:1; text-align:left; }
  .sl-enc { margin-left:auto; background:rgba(192,21,42,.1); color:var(--red); font-size:8px; padding:2px 8px; border-radius:10px; flex-shrink:0; }

  /* Seat map */
  .seat-map { background:#1c0a0c; border-radius:12px; padding:10px; }
  .seat-info { text-align:center; margin-top:8px; font-size:11px; color:rgba(255,255,255,.45); }
  .seat-info strong { color:var(--gold-lt); font-family:"Noto Serif JP",serif; font-size:14px; }

  /* Photos */
  .photos { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
  .photos::-webkit-scrollbar { display:none; }
  .photo { width:90px; height:90px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:28px; overflow:hidden; }
  .photo img { width:100%; height:100%; object-fit:cover; }
  .photo-thumb { position:relative; width:80px; height:80px; flex-shrink:0; }
  .photo-thumb img { width:80px; height:80px; border-radius:8px; object-fit:cover; }
  .photo-del { position:absolute; top:-6px; right:-6px; background:var(--red); color:#fff; border:none; border-radius:50%; width:20px; height:20px; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Memory */
  .mem-list { display:flex; flex-direction:column; gap:10px; }
  .mem-card { background:var(--offwhite); border-radius:12px; border:1px solid rgba(192,21,42,.08); overflow:hidden; }
  .mem-hdr { display:flex; align-items:center; gap:8px; padding:9px 14px; background:rgba(192,21,42,.04); border-bottom:1px solid rgba(192,21,42,.07); }
  .mem-icon { font-size:14px; }
  .mem-lbl { font-size:11px; letter-spacing:.15em; text-transform:uppercase; color:rgba(28,10,12,.45); }
  .mem-text { padding:12px 14px; font-size:14.5px; color:rgba(28,10,12,.72); line-height:1.85; font-family:"Noto Serif JP",serif; white-space:pre-line; text-align:left; }
  .empty { color:rgba(28,10,12,.28); font-style:italic; }

  /* Tips */
  .tips-box { background:linear-gradient(135deg,#1c0a0c,#2a0d10); border-radius:12px; overflow:hidden; }
  .tips-hdr { display:flex; align-items:center; gap:8px; padding:12px 16px 10px; border-bottom:1px solid rgba(255,255,255,.07); }
  .tips-hdr-ic { font-size:16px; }
  .tips-hdr-tt { font-size:13px; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.6); font-weight:600; }
  .tips-badge { margin-left:auto; background:var(--gold); color:var(--ink); font-size:8px; font-weight:700; padding:2px 7px; border-radius:3px; }
  .tip-item { display:flex; align-items:flex-start; gap:10px; padding:9px 16px; border-bottom:1px solid rgba(255,255,255,.04); }
  .tip-item:last-child { border-bottom:none; }
  .tip-cat { flex-shrink:0; background:rgba(192,21,42,.25); border-radius:6px; padding:4px 10px; font-size:11px; color:rgba(255,255,255,.8); margin-top:1px; white-space:nowrap; }
  .tip-text { font-size:15px; color:rgba(255,255,255,.85); line-height:1.75; text-align:left; }
  .tip-text strong { color:var(--gold-lt); font-weight:600; }
  .tip-url { display:flex; align-items:center; gap:6px; margin-top:6px; }
  .tip-url-text { font-size:10px; color:rgba(100,160,255,.7); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
  .tip-copy { flex-shrink:0; background:rgba(80,140,255,.2); border:1px solid rgba(100,160,255,.35); color:rgba(140,190,255,.9); font-size:9px; padding:3px 9px; border-radius:4px; cursor:pointer; white-space:nowrap; }
  .tip-copy.copied { background:rgba(50,180,100,.25); border-color:rgba(80,200,120,.4); color:rgba(120,220,150,.9); }

  /* Form */
  .fsec { padding:0 20px; margin-bottom:14px; }
  .flbl { font-size:12px; letter-spacing:.12em; color:rgba(28,10,12,.45); text-transform:uppercase; margin-bottom:7px; display:flex; align-items:center; gap:5px; }
  .finp { width:100%; background:var(--offwhite); border:1px solid rgba(192,21,42,.14); border-radius:10px; padding:12px 14px; font-size:14px; font-family:"Noto Serif JP",serif; color:var(--ink); outline:none; transition:border .2s; }
  .finp:focus { border-color:var(--red); }
  .frow { display:flex; gap:10px; }
  .fgrp { flex:1; }
  .fdivider { margin:4px 20px 14px; font-size:12px; letter-spacing:.15em; color:rgba(192,21,42,.65); text-transform:uppercase; padding-top:14px; border-top:1px solid rgba(192,21,42,.1); font-weight:600; }
  .save-btn { width:calc(100% - 40px); margin:10px 20px 0; background:linear-gradient(135deg,var(--red),var(--red-deep)); color:#fff; border:none; border-radius:12px; padding:16px; font-family:"Noto Serif JP",serif; font-size:15px; letter-spacing:.1em; cursor:pointer; transition:transform .1s, box-shadow .1s, background .2s; }
  .save-btn:active { transform:scale(.97); }
  .outline-btn { background:transparent; border:1.5px solid rgba(192,21,42,.35); color:var(--red); border-radius:12px; padding:12px; font-family:"Noto Serif JP",serif; font-size:14px; letter-spacing:.06em; cursor:pointer; }
  .outline-btn:active { background:rgba(192,21,42,.06); }
  .save-btn.saving { background:linear-gradient(135deg,#2a8a3e,#1a6b2e); box-shadow:0 0 0 3px rgba(42,138,62,.3); pointer-events:none; }

  /* 2択メニュー */
  .add-menu-overlay { position:fixed; inset:0; z-index:100; display:flex; align-items:flex-end; }
  .add-menu-bg { position:absolute; inset:0; background:rgba(28,10,12,.5); backdrop-filter:blur(4px); }
  .add-menu { position:relative; width:100%; background:var(--paper); border-radius:24px 24px 0 0; padding:16px 20px 40px; z-index:1; }
  .add-menu-handle { width:36px; height:4px; background:rgba(192,21,42,.18); border-radius:2px; margin:0 auto 20px; }
  .add-menu-ttl { font-size:11px; letter-spacing:.2em; color:rgba(28,10,12,.35); text-transform:uppercase; margin-bottom:14px; }
  .add-menu-btn { display:flex; align-items:center; gap:14px; padding:16px 18px; background:var(--offwhite); border:1.5px solid rgba(192,21,42,.1); border-radius:14px; cursor:pointer; margin-bottom:10px; width:100%; text-align:left; transition:border-color .15s, background .15s; }
  .add-menu-btn:hover { border-color:rgba(192,21,42,.35); background:var(--mist); }
  .add-menu-icon { font-size:26px; flex-shrink:0; }
  .add-menu-label { font-family:"Noto Serif JP",serif; font-size:15px; font-weight:600; color:var(--ink); }
  .add-menu-desc { font-size:11px; color:rgba(28,10,12,.4); margin-top:2px; }

  /* カラープリセット */
  .color-presets { display:grid; grid-template-columns:repeat(10,1fr); gap:8px; }
  .color-preset { width:100%; aspect-ratio:1; border-radius:50%; cursor:pointer; border:3px solid transparent; transition:transform .15s, border-color .15s; }
  .color-preset.selected { border-color:#fff; transform:scale(1.15); }

  /* ビジュアルタイプ選択 */

  /* プレビューダイアログ */
  .preview-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(6px); }
  .preview-dialog { background:var(--paper); border-radius:20px; width:100%; max-width:360px; overflow:hidden; box-shadow:0 16px 48px rgba(0,0,0,.4); }
  .preview-vis-wrap { width:100%; height:140px; overflow:hidden; position:relative; }
  .preview-body { padding:20px 22px 24px; }
  .preview-ttl { font-family:"Noto Serif JP",serif; font-size:15px; font-weight:600; color:var(--ink); margin-bottom:6px; }
  .preview-btns { display:flex; gap:10px; }
  .preview-retry { flex:1; background:transparent; border:1.5px solid rgba(28,10,12,.2); color:rgba(28,10,12,.6); border-radius:10px; padding:12px; font-size:13px; cursor:pointer; }
  .preview-confirm { flex:1; background:var(--red); border:none; color:#fff; border-radius:10px; padding:12px; font-size:13px; cursor:pointer; font-weight:600; }

  /* ツアー削除・編集ボタン */
  .tour-del-wrap { position:relative; flex-shrink:0; margin-left:4px; }
  .tour-del { background:rgba(192,21,42,.12); border:1px solid rgba(192,21,42,.25); color:rgba(255,100,100,.7); border-radius:50%; width:26px; height:26px; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
  .tour-del:hover { background:rgba(192,21,42,.4); color:#fff; }
  .tour-del-tip { position:absolute; right:32px; top:50%; transform:translateY(-50%); background:rgba(28,10,12,.92); color:#fff; font-size:11px; padding:4px 10px; border-radius:6px; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .15s; }
  .tour-del-wrap:hover .tour-del-tip { opacity:1; }
  .tour-edit-wrap { position:relative; flex-shrink:0; margin-left:4px; }
  .tour-edit { background:rgba(100,160,255,.12); border:1px solid rgba(100,160,255,.25); color:rgba(140,190,255,.8); border-radius:50%; width:26px; height:26px; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
  .tour-edit:hover { background:rgba(100,160,255,.35); color:#fff; }
  .tour-edit-tip { position:absolute; right:32px; top:50%; transform:translateY(-50%); background:rgba(28,10,12,.92); color:#fff; font-size:11px; padding:4px 10px; border-radius:6px; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .15s; }
  .tour-edit-wrap:hover .tour-edit-tip { opacity:1; }

  /* みんなの記録 */
  .entry-card { background:var(--offwhite); border:1px solid rgba(192,21,42,.1); border-radius:14px; padding:14px 14px 16px; margin-bottom:14px; }
  .entry-card.mine { border-color:rgba(192,21,42,.3); box-shadow:0 2px 10px var(--shadow); }
  .entry-empty { text-align:center; padding:20px 14px; }
  .entry-hdr { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .entry-avatar { width:28px; height:28px; border-radius:50%; flex-shrink:0; object-fit:cover; }
  .entry-avatar-ph { display:flex; align-items:center; justify-content:center; background:var(--mist); font-size:15px; }
  .entry-name { font-size:15px; font-weight:600; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .entry-me { background:var(--red); color:#fff; font-size:9px; padding:2px 8px; border-radius:10px; flex-shrink:0; letter-spacing:.1em; }
  .entry-edit { margin-left:auto; background:transparent; border:1px solid rgba(192,21,42,.3); color:var(--red); border-radius:8px; padding:5px 10px; font-size:12px; cursor:pointer; font-family:"Noto Serif JP",serif; flex-shrink:0; }
  .entry-sub { font-size:11px; letter-spacing:.15em; color:rgba(28,10,12,.45); margin:14px 0 8px; font-weight:600; }
  .entry-seat { background:#1c0a0c; border-radius:12px; padding:12px; text-align:center; color:rgba(255,255,255,.6); font-size:13px; }
  .fscope { margin-left:8px; font-size:9px; letter-spacing:.08em; font-weight:normal; padding:2px 8px; border-radius:10px; background:rgba(28,10,12,.06); color:rgba(28,10,12,.5); vertical-align:middle; }
  .fscope.mine { background:rgba(192,21,42,.1); color:var(--red); }
  .live-item-meta { font-size:10px; color:rgba(255,255,255,.35); margin-top:2px; display:flex; gap:10px; }
`;

import { useState, useMemo } from "react";

const PHOTO_NISSAN = "data:image/jpeg;base64,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";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Noto+Sans+JP:wght@300;400&display=swap');
  :root {
    --red:#c0152a; --red-deep:#8b0d1c; --red-bright:#e8112d;
    --ink:#1c0a0c; --paper:#fdf6f6; --offwhite:#fff8f8;
    --gold:#d4a843; --gold-light:#edd98a;
    --mist:#f5e8e8; --shadow:rgba(140,10,30,0.13);
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  .app { font-family:"Noto Sans JP",sans-serif; background:var(--paper); min-height:100vh; max-width:430px; margin:0 auto; color:var(--ink); }

  .hdr { background:linear-gradient(160deg,var(--red-deep),var(--red) 60%,#d42035); padding:24px 24px 18px; position:relative; overflow:hidden; }
  .hdr::before { content:""; position:absolute; top:-50px; right:-50px; width:200px; height:200px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,.08),transparent 70%); }
  .hdr::after { content:"TVXQ"; position:absolute; bottom:-18px; right:12px; font-family:"Cormorant Garamond",serif; font-size:72px; font-weight:300; color:rgba(255,255,255,.05); pointer-events:none; }
  .hdr-sub { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:11px; letter-spacing:.28em; color:rgba(255,255,255,.65); text-transform:uppercase; margin-bottom:5px; }
  .hdr-title { font-family:"Noto Serif JP",serif; font-weight:300; font-size:23px; color:#fff; letter-spacing:.08em; line-height:1.35; }
  .hdr-title span { color:var(--gold-light); font-weight:600; }
  .hdr-row { display:flex; align-items:center; justify-content:space-between; margin-top:18px; }
  .stats { display:flex; gap:22px; }
  .stat-n { font-family:"Cormorant Garamond",serif; font-size:24px; color:var(--gold-light); line-height:1; }
  .stat-l { font-size:9px; color:rgba(255,255,255,.45); letter-spacing:.14em; margin-top:2px; }
  .add-btn { background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.35); color:#fff; border-radius:50%; width:44px; height:44px; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .tabs { background:var(--red-deep); display:flex; padding:0 24px; border-bottom:1px solid rgba(255,255,255,.08); }
  .tab { background:none; border:none; color:rgba(255,255,255,.38); font-family:"Noto Sans JP",sans-serif; font-size:11px; letter-spacing:.12em; padding:11px 0 13px; margin-right:22px; cursor:pointer; position:relative; white-space:nowrap; }
  .tab.on { color:#fff; }
  .tab.on::after { content:""; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--gold-light); border-radius:1px; }

  .content { padding:20px 18px 100px; }
  .sec-lbl { font-size:10px; letter-spacing:.22em; color:rgba(28,10,12,.35); text-transform:uppercase; margin-bottom:12px; padding-left:2px; }

  .feat { border-radius:16px; margin-bottom:16px; overflow:hidden; box-shadow:0 8px 36px rgba(140,10,30,.42); cursor:pointer; transition:transform .15s; position:relative; background:var(--ink); }
  .feat:active { transform:scale(.98); }
  .feat-vis { position:relative; height:130px; overflow:hidden; background:linear-gradient(180deg,#0a0204,#1c0408 40%,#2a0510); }
  .feat-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 60px 100px at 20% 0%,rgba(232,17,45,.55),transparent 70%),radial-gradient(ellipse 60px 100px at 50% 0%,rgba(255,200,50,.3),transparent 70%),radial-gradient(ellipse 60px 100px at 80% 0%,rgba(232,17,45,.55),transparent 70%); }
  .feat-wm { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; }
  .feat-wm span { font-family:"Cormorant Garamond",serif; font-size:42px; font-weight:300; letter-spacing:.18em; color:rgba(192,21,42,.18); white-space:nowrap; }
  .st-sil { position:absolute; bottom:0; left:0; right:0; height:70px; }
  .st-pitch { position:absolute; bottom:0; left:10%; right:10%; height:28px; background:linear-gradient(180deg,#0d2e0d,#0a200a); border-radius:50% 50% 0 0/40% 40% 0 0; }
  .st-pitch::before { content:"STAGE"; position:absolute; top:7px; left:50%; transform:translateX(-50%); font-size:8px; letter-spacing:.3em; color:rgba(255,255,255,.25); font-family:"Cormorant Garamond",serif; }
  .st-l { position:absolute; bottom:26px; left:0; width:42%; height:36px; background:linear-gradient(170deg,#2a0510,#1a0308); clip-path:polygon(0% 100%,0% 30%,15% 0%,100% 0%,100% 100%); }
  .st-r { position:absolute; bottom:26px; right:0; width:42%; height:36px; background:linear-gradient(190deg,#2a0510,#1a0308); clip-path:polygon(100% 100%,100% 30%,85% 0%,0% 0%,0% 100%); }
  .t-grid { position:absolute; bottom:30px; left:50%; transform:translateX(-50%); display:grid; grid-template-columns:repeat(11,8px); grid-template-rows:repeat(5,8px); gap:3px; }
  .td { width:5px; height:7px; border-radius:50% 50% 35% 35%; align-self:end; }
  .td.on { animation:flicker 1.5s ease-in-out infinite; }
  .td.off { background:rgba(255,255,255,.04) !important; box-shadow:none !important; }
  @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:.35} }
  .star { position:absolute; width:2px; height:2px; border-radius:50%; background:#fff; animation:twinkle 2s ease-in-out infinite; }
  @keyframes twinkle { 0%,100%{opacity:.8} 50%{opacity:.15} }
  .feat-badge { position:absolute; top:14px; right:14px; z-index:3; background:var(--gold); color:#fff; font-size:8px; font-weight:700; letter-spacing:.15em; padding:3px 9px; border-radius:3px; }
  .feat-body { padding:16px 20px 18px; }
  .feat-sub { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:11px; color:rgba(255,255,255,.45); letter-spacing:.18em; margin-bottom:5px; }
  .feat-title { font-family:"Noto Serif JP",serif; font-size:15px; font-weight:600; color:#fff; line-height:1.55; margin-bottom:10px; }
  .feat-title em { display:block; font-style:normal; color:var(--gold-light); font-size:13px; margin-top:3px; font-family:"Cormorant Garamond",serif; letter-spacing:.1em; }
  .feat-chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
  .feat-chip { background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.15); border-radius:20px; padding:4px 12px; font-size:10px; color:rgba(255,255,255,.8); }
  .feat-foot { display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.08); padding-top:10px; }
  .feat-songs { font-size:11px; color:rgba(255,255,255,.45); }
  .feat-songs strong { color:var(--gold-light); font-family:"Cormorant Garamond",serif; font-size:17px; }

  .card { background:var(--offwhite); border-radius:12px; margin-bottom:12px; overflow:hidden; box-shadow:0 2px 10px var(--shadow); display:flex; cursor:pointer; transition:transform .15s; border:1px solid rgba(192,21,42,.07); }
  .card:active { transform:scale(.98); }
  .card-bar { width:4px; background:linear-gradient(to bottom,var(--red),var(--red-deep)); flex-shrink:0; }
  .card-body { padding:13px 15px; flex:1; min-width:0; }
  .card-date { font-family:"Cormorant Garamond",serif; font-size:11px; color:var(--red); letter-spacing:.15em; margin-bottom:4px; }
  .card-title { font-family:"Noto Serif JP",serif; font-size:13px; font-weight:600; color:var(--ink); line-height:1.4; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .card-meta { display:flex; gap:7px; flex-wrap:wrap; }
  .chip { background:var(--mist); border-radius:20px; padding:3px 9px; font-size:10px; color:rgba(28,10,12,.55); white-space:nowrap; }
  .card-thumb { width:70px; flex-shrink:0; background:linear-gradient(135deg,var(--red-deep),#a01020); display:flex; align-items:center; justify-content:center; font-size:26px; position:relative; overflow:hidden; }
  .card-thumb::after { content:""; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.06),transparent 60%); }
  .card-tag { position:absolute; top:8px; right:8px; background:rgba(255,255,255,.18); color:#fff; font-size:8px; padding:2px 6px; border-radius:3px; }

  .overlay { position:fixed; inset:0; background:rgba(28,10,12,.78); z-index:100; display:flex; align-items:flex-end; backdrop-filter:blur(5px); }
  .modal { background:var(--paper); border-radius:24px 24px 0 0; width:100%; max-height:92vh; overflow-y:auto; padding:0 0 44px; }
  .modal-handle { width:36px; height:4px; background:rgba(192,21,42,.18); border-radius:2px; margin:14px auto 0; }
  .mhero { padding:24px 24px 20px; margin-bottom:20px; position:relative; overflow:hidden; }
  .mhero.red { background:linear-gradient(140deg,var(--red-deep),var(--red)); }
  .mhero.red::after { content:"RED OCEAN"; position:absolute; bottom:-14px; right:-4px; font-family:"Cormorant Garamond",serif; font-size:50px; font-weight:300; color:rgba(255,255,255,.05); white-space:nowrap; pointer-events:none; }
  .mhero.dark { background:linear-gradient(140deg,var(--red-deep),var(--ink)); }
  .mhero.dark::after { content:"東方神起"; position:absolute; bottom:-16px; right:-8px; font-family:"Noto Serif JP",serif; font-size:62px; font-weight:300; color:rgba(255,255,255,.04); white-space:nowrap; pointer-events:none; }
  .mdate { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:12px; color:rgba(255,255,255,.6); letter-spacing:.18em; margin-bottom:6px; }
  .mtitle { font-family:"Noto Serif JP",serif; font-size:17px; font-weight:600; color:#fff; line-height:1.5; }
  .msub { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:13px; color:var(--gold-light); letter-spacing:.1em; margin-top:4px; }
  .mvenue { margin-top:9px; font-size:12px; color:rgba(255,255,255,.5); }
  .mtime-row { display:flex; gap:16px; margin-top:8px; }
  .mtime { display:flex; gap:5px; font-size:11px; color:rgba(255,255,255,.45); align-items:center; }
  .mtime b { color:rgba(255,255,255,.85); }
  .msec { padding:0 20px; margin-bottom:20px; }
  .msec-ttl { font-size:10px; letter-spacing:.2em; color:rgba(28,10,12,.38); text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
  .msec-ttl::after { content:""; flex:1; height:1px; background:rgba(192,21,42,.12); }

  .setlist { list-style:none; }
  .enc-div { display:flex; align-items:center; gap:10px; margin:12px 0 6px; }
  .enc-line { flex:1; height:1px; background:rgba(192,21,42,.15); }
  .enc-lbl { font-size:9px; letter-spacing:.2em; color:var(--red); text-transform:uppercase; white-space:nowrap; }
  .sl-item { display:flex; align-items:center; padding:8px 0; border-bottom:1px solid rgba(192,21,42,.06); gap:12px; }
  .sl-num { font-family:"Cormorant Garamond",serif; font-size:15px; color:rgba(192,21,42,.35); width:22px; text-align:right; flex-shrink:0; }
  .sl-name { font-size:13px; color:var(--ink); line-height:1.3; flex:1; }
  .sl-enc { margin-left:auto; background:rgba(192,21,42,.1); color:var(--red); font-size:8px; padding:2px 8px; border-radius:10px; flex-shrink:0; }

  .seat-map { background:#1c0a0c; border-radius:12px; padding:16px; }
  .seat-info { text-align:center; margin-top:8px; font-size:11px; color:rgba(255,255,255,.45); }
  .seat-info strong { color:var(--gold-light); font-family:"Cormorant Garamond",serif; font-size:14px; }

  .photos { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none; }
  .photos::-webkit-scrollbar { display:none; }
  .photo { width:90px; height:90px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:28px; overflow:hidden; }
  .photo img { width:100%; height:100%; object-fit:cover; }
  .photo.add { background:var(--mist); border:2px dashed rgba(192,21,42,.2); color:rgba(192,21,42,.25); font-size:22px; }

  .mem-list { display:flex; flex-direction:column; gap:10px; }
  .mem-card { background:var(--offwhite); border-radius:12px; border:1px solid rgba(192,21,42,.08); overflow:hidden; }
  .mem-hdr { display:flex; align-items:center; gap:8px; padding:9px 14px; background:rgba(192,21,42,.04); border-bottom:1px solid rgba(192,21,42,.07); }
  .mem-icon { font-size:14px; }
  .mem-lbl { font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:rgba(28,10,12,.4); }
  .mem-text { padding:12px 14px; font-size:13px; color:rgba(28,10,12,.72); line-height:1.85; font-family:"Noto Serif JP",serif; white-space:pre-line; }

  .comment { background:var(--offwhite); border-radius:10px; padding:14px; border:1px solid rgba(192,21,42,.08); font-size:13px; color:rgba(28,10,12,.68); line-height:1.85; font-family:"Noto Serif JP",serif; white-space:pre-line; }

  .tips-box { background:linear-gradient(135deg,#1c0a0c,#2a0d10); border-radius:12px; overflow:hidden; }
  .tips-header { display:flex; align-items:center; gap:8px; padding:12px 16px 10px; border-bottom:1px solid rgba(255,255,255,.07); }
  .tips-header-icon { font-size:16px; }
  .tips-header-title { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.5); }
  .tips-header-badge { margin-left:auto; background:var(--gold); color:var(--ink); font-size:8px; font-weight:700; padding:2px 7px; border-radius:3px; letter-spacing:.1em; }
  .tips-list { padding:10px 0 4px; }
  .tip-item { display:flex; align-items:flex-start; gap:10px; padding:9px 16px; border-bottom:1px solid rgba(255,255,255,.04); }
  .tip-item:last-child { border-bottom:none; }
  .tip-cat { flex-shrink:0; background:rgba(192,21,42,.25); border-radius:6px; padding:3px 8px; font-size:8px; letter-spacing:.1em; color:rgba(255,255,255,.7); text-transform:uppercase; margin-top:1px; white-space:nowrap; }
  .tip-text { font-size:12px; color:rgba(255,255,255,.75); line-height:1.7; font-family:"Noto Sans JP",sans-serif; }
  .tip-text strong { color:var(--gold-light); font-weight:600; }

  .fsec { padding:0 20px; margin-bottom:14px; }
  .flbl { font-size:10px; letter-spacing:.15em; color:rgba(28,10,12,.4); text-transform:uppercase; margin-bottom:7px; display:flex; align-items:center; gap:5px; }
  .finp { width:100%; background:var(--offwhite); border:1px solid rgba(192,21,42,.14); border-radius:10px; padding:12px 14px; font-size:14px; font-family:"Noto Sans JP",sans-serif; color:var(--ink); outline:none; transition:border .2s; }
  .finp:focus { border-color:var(--red); }
  .frow { display:flex; gap:10px; }
  .frow .fgrp { flex:1; }
  .save-btn { width:calc(100% - 40px); margin:10px 20px 0; background:linear-gradient(135deg,var(--red),var(--red-deep)); color:#fff; border:none; border-radius:12px; padding:16px; font-family:"Noto Serif JP",serif; font-size:15px; letter-spacing:.1em; cursor:pointer; box-shadow:0 4px 20px rgba(192,21,42,.35); }
  .form-divider { margin:4px 20px 14px; font-size:10px; letter-spacing:.2em; color:rgba(192,21,42,.5); text-transform:uppercase; padding-top:14px; border-top:1px solid rgba(192,21,42,.1); }

  .bnav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; background:var(--ink); display:flex; padding:10px 0 24px; border-top:1px solid rgba(192,21,42,.25); z-index:50; }
  .nitem { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; background:none; border:none; cursor:pointer; }
  .nicon { font-size:20px; }
  .nlbl { font-size:9px; letter-spacing:.1em; color:rgba(255,255,255,.3); }
  .nitem.on .nlbl { color:var(--red-bright); }
  .nitem.on .nicon { filter:drop-shadow(0 0 5px rgba(232,17,45,.55)); }
`;

const COLS=11, ROWS=5;
const DOT_COLORS=["#e8112d","#c0152a","#ff3355","#d42035","#ff1a40","#b00d22","#ff6680","#cc1030"];
const STAR_DATA=Array.from({length:18},(_,i)=>({left:`${8+(i*37+13)%84}%`,top:`${5+(i*29+7)%50}%`,delay:`${(i*.3)%2}s`,opacity:.4+(i%5)*.1}));
function isLit(row,col){return row<=1||(col>=4&&col<=6);}

const NISSAN_SONGS=[
  {n:1,t:"small talk"},{n:2,t:"Reboot"},{n:3,t:"Why? (Keep Your Head Down)"},
  {n:4,t:"Choosey Lover"},{n:5,t:"Special One"},{n:6,t:"Jungle"},
  {n:7,t:"Champion"},{n:8,t:"Spinning"},{n:9,t:"信じるまま"},
  {n:10,t:"One and Only One"},{n:11,t:"Time Works Wonders"},{n:12,t:"明日は来るから"},
  {n:13,t:"IDENTITY"},{n:14,t:"Road"},{n:15,t:"どうして君を好きになってしまったんだろう"},
  {n:16,t:"Survivor"},{n:17,t:"High time"},{n:18,t:"Hot Hot Hot"},
  {n:19,t:"大好きだった"},{n:20,t:"It's true It's Here"},{n:21,t:"Rising Sun"},
  {n:22,t:'"O"-正・反・合'},{n:23,t:"PROUD"},
  {n:24,t:"MAXIMUM",e:true},{n:25,t:"月の裏で会いましょう",e:true},
  {n:26,t:"Share the World",e:true},{n:27,t:"ウィーアー！",e:true},
  {n:28,t:"OCEAN",e:true},{n:29,t:"Somebody To Love",e:true},
  {n:30,t:"Weep",e:true},{n:31,t:"時ヲ止メテ",e:true},
];

const LIVES=[
  {
    id:0,featured:true,
    tour:"東方神起 20th Anniversary LIVE IN NISSAN STADIUM",
    sub:"〜RED OCEAN〜",
    date:"2026.04.26",dateLabel:"2026年4月26日（日）",
    open:"15:00",start:"17:00",
    venue:"日産スタジアム",seat:"W1F / 入口W13 / 列8 / 座席245",
    highlight:"W1F",tag:"横浜",emoji:"🌊",
    songs:NISSAN_SONGS,
    memory:{
      before:"20周年のスタジアムライブ。何ヶ月も前からチケットを握りしめて待ってた。前日は緊張と興奮で眠れなかった。友達と「絶対泣く」って言い合ってた。",
      after:"終わった後、しばらく動けなかった。7万人の「RED OCEAN」が波みたいに揺れて、ユノとチャンミンが笑顔でその海を見渡してた。この景色を一生忘れないと思う。",
      highlight:"「Rising Sun」のイントロが流れた瞬間、全身が震えた。20年分の記憶が一気によみがえって、気づいたら泣いてた。会場全体が一つになった感覚がした。",
      other:"Happy 20th birthday!!\n一生ついていきます❤️",
    },
    photos:[PHOTO_NISSAN],
    tips:[
      {cat:"🍜 グルメ", text:"事前ごはんは改札出て右の<strong>コクーン フードコート</strong>が穴場。ユッケジャンクッパ定食がおすすめ。"},
      {cat:"⏰ タイミング", text:"金曜公演はカフェが早めに閉まる。蕎麦・中華は比較的空いてる。"},
      {cat:"🚻 トイレ", text:"5階は個室が少なめ。<strong>2階がおすすめ</strong>。"},
      {cat:"🏃 入場", text:"開演<strong>30分前</strong>に並べばギリギリ間に合う。"},
      {cat:"💺 見え方", text:"席の段差がしっかりあるので、前の人が極端に背が高くなければ割と見やすい。"},
    ],
  },
  {
    id:1,
    tour:"TVXQ! WORLD TOUR — CIRCLE",
    date:"2024.03.15",venue:"東京ドーム",
    seat:"1塁側 / ブロックC / 列12 / 座席34",
    tag:"東京",emoji:"🌸",
    songs:[{n:1,t:"Mirotic"},{n:2,t:"Rising Sun"},{n:3,t:"Before U Go",e:true},{n:4,t:"Catch Me"},{n:5,t:"Maximum",e:true}],
    comment:"初めての東京ドーム公演。ユノとチャンミンの声量が会場全体に響き渡り、本当に鳥肌が立ちました。「Before U Go」では涙が止まらなかった…",
    photos:["🎤","🌟","📸"],
  },
  {
    id:2,
    tour:"TVXQ! 20&2 CONCERT",
    date:"2023.11.04",venue:"大阪城ホール",
    seat:"アリーナ / ブロックA / 列5 / 座席11",
    tag:"大阪",emoji:"🏯",
    songs:[{n:1,t:"Hey! (Don't Bring Me Down)"},{n:2,t:"Somebody to Love"},{n:3,t:"Love Line",e:true}],
    comment:"20周年記念コンサート。デビュー曲から最新曲まで、全ての楽曲が特別な意味を持っていて、感動の連続でした。",
    photos:["🎵","💛"],
  },
];

const MEM_FIELDS=[
  {key:"before", icon:"🌟", label:"ライブ前の期待"},
  {key:"after",  icon:"✨", label:"ライブ後の感想"},
  {key:"highlight", icon:"💥", label:"特筆すべきこと"},
  {key:"other",  icon:"❤️", label:"その他"},
];

function TLights(){
  const cells=useMemo(()=>{
    const r=[];
    for(let row=0;row<ROWS;row++) for(let col=0;col<COLS;col++) r.push({i:row*COLS+col,col,lit:isLit(row,col)});
    return r;
  },[]);
  return (
    <div className="t-grid">
      {cells.map(({i,col,lit})=>(
        <div key={i} className={"td "+(lit?"on":"off")}
          style={lit?{background:DOT_COLORS[i%DOT_COLORS.length],boxShadow:`0 0 5px ${DOT_COLORS[i%DOT_COLORS.length]}`,animationDelay:`${(col*.12+i*.05)%1.4}s`}:{}}
        />
      ))}
    </div>
  );
}

function FeaturedCard({onClick}){
  return (
    <div className="feat" onClick={onClick}>
      <div className="feat-badge">最新 · 20TH ANNIVERSARY</div>
      <div className="feat-vis">
        {STAR_DATA.map((s,i)=>(
          <div key={i} className="star" style={{left:s.left,top:s.top,animationDelay:s.delay,opacity:s.opacity}}/>
        ))}
        <div className="feat-wm"><span>RED OCEAN</span></div>
        <div className="st-sil"><div className="st-l"/><div className="st-r"/><div className="st-pitch"/></div>
        <TLights/>
      </div>
      <div className="feat-body">
        <div className="feat-sub">2026.04.26 — 横浜 日産スタジアム</div>
        <div className="feat-title">東方神起 20th Anniversary<br/>LIVE IN NISSAN STADIUM<em>〜 RED OCEAN 〜</em></div>
        <div className="feat-chips">
          <span className="feat-chip">📍 日産スタジアム</span>
          <span className="feat-chip">🕓 開演 17:00</span>
          <span className="feat-chip">🌊 横浜</span>
        </div>
        <div className="feat-foot">
          <div className="feat-songs">セットリスト <strong>31</strong> 曲（アンコール8曲含む）</div>
          <span style={{color:"rgba(255,255,255,.28)",fontSize:18}}>›</span>
        </div>
      </div>
    </div>
  );
}

function Setlist({songs}){
  let shown=false;
  return (
    <ul className="setlist">
      {songs.map(s=>{
        const enc=!!s.e;
        const div=enc&&!shown?(shown=true,
          <li key="ed"><div className="enc-div"><div className="enc-line"/><span className="enc-lbl">― アンコール ―</span><div className="enc-line"/></div></li>
        ):null;
        return [div,<li key={s.n} className="sl-item"><span className="sl-num">{s.n}</span><div className="sl-name">{s.t}</div>{enc&&<span className="sl-enc">ENCORE</span>}</li>];
      })}
    </ul>
  );
}

function StadiumMap({highlight,seat}){
  const R="#e8112d",S1="#2a1010",S2="#3a1515",AR="#1a2a1a",ST="#c9a84c";
  const hl=id=>highlight===id?R:undefined;
  const PX={W1F:65,W2F:39,E1F:255,E2F:281,N1F:160,N2F:160,S1F:160,S2F:160,arena:160};
  const PY={W1F:148,W2F:148,E1F:148,E2F:148,N1F:56,N2F:31,S1F:240,S2F:265,arena:148};
  return (
    <div className="seat-map">
      <svg viewBox="0 0 320 300" width="100%" style={{display:"block"}}>
        <ellipse cx="160" cy="148" rx="148" ry="132" fill="#0d0404" stroke="#3a1515" strokeWidth="2"/>
        <path d="M26 100 Q12 148 26 196 L52 186 Q40 148 52 110Z" fill={hl("W2F")||S2}/>
        <path d="M294 100 Q308 148 294 196 L268 186 Q280 148 268 110Z" fill={hl("E2F")||S2}/>
        <path d="M80 18 Q160 4 240 18 L228 44 Q160 30 92 44Z" fill={hl("N2F")||S2}/>
        <path d="M80 278 Q160 292 240 278 L228 252 Q160 266 92 252Z" fill={hl("S2F")||S2}/>
        <path d="M52 110 Q40 148 52 186 L78 174 Q66 148 78 122Z" fill={hl("W1F")||S1}/>
        <path d="M268 110 Q280 148 268 186 L242 174 Q254 148 242 122Z" fill={hl("E1F")||S1}/>
        <path d="M92 44 Q160 30 228 44 L218 68 Q160 56 102 68Z" fill={hl("N1F")||S1}/>
        <path d="M92 252 Q160 266 228 252 L218 228 Q160 240 102 228Z" fill={hl("S1F")||S1}/>
        <ellipse cx="160" cy="148" rx="80" ry="80" fill={hl("arena")||AR} stroke="#1a2a1a" strokeWidth="1"/>
        <rect x="118" y="208" width="84" height="22" rx="4" fill={ST} opacity=".9"/>
        <text x="160" y="223" textAnchor="middle" fontSize="9" fill="#1c0a0c" fontFamily="sans-serif" fontWeight="bold" letterSpacing="2">STAGE</text>
        {[
          {x:160,y:14,lbl:"N 2F",id:"N2F"},{x:160,y:38,lbl:"N 1F",id:"N1F"},
          {x:160,y:284,lbl:"S 2F",id:"S2F"},{x:160,y:260,lbl:"S 1F",id:"S1F"},
          {x:19,y:150,lbl:"W",id:"W2F",rot:-90},{x:38,y:150,lbl:"W",id:"W1F",rot:-90},
          {x:301,y:150,lbl:"E",id:"E2F",rot:90},{x:282,y:150,lbl:"E",id:"E1F",rot:90},
        ].map(s=>(
          <text key={s.id} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="7" fill={highlight===s.id?"#fff":"rgba(255,255,255,0.4)"}
            fontFamily="sans-serif" fontWeight={highlight===s.id?"bold":"normal"}
            transform={s.rot?`rotate(${s.rot},${s.x},${s.y})`:undefined}>{s.lbl}</text>
        ))}
        <text x="160" y="130" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">ARENA</text>
        {highlight&&PX[highlight]&&(
          <>
            <circle cx={PX[highlight]} cy={PY[highlight]} r="7" fill={R} opacity=".9"/>
            <text x={PX[highlight]} y={PY[highlight]} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#fff" fontWeight="bold" fontFamily="sans-serif">★</text>
          </>
        )}
      </svg>
      <div className="seat-info">{seat?<strong>{seat}</strong>:<span>座席情報は未設定です</span>}</div>
    </div>
  );
}

function MemoryView({memory,comment}){
  if(memory){
    const filled=MEM_FIELDS.filter(f=>memory[f.key]);
    if(filled.length===0) return <div className="comment" style={{color:"rgba(28,10,12,.28)",fontStyle:"italic"}}>まだ感想が記録されていません…</div>;
    return (
      <div className="mem-list">
        {filled.map(({key,icon,label})=>(
          <div key={key} className="mem-card">
            <div className="mem-hdr"><span className="mem-icon">{icon}</span><span className="mem-lbl">{label}</span></div>
            <div className="mem-text">{memory[key]}</div>
          </div>
        ))}
      </div>
    );
  }
  if(comment) return <div className="comment">{comment}</div>;
  return <div className="comment" style={{color:"rgba(28,10,12,.28)",fontStyle:"italic"}}>まだ感想が記録されていません…</div>;
}

function TipsView({tips}){
  if(!tips||tips.length===0) return null;
  return (
    <div className="tips-box">
      <div className="tips-header">
        <span className="tips-header-icon">📌</span>
        <span className="tips-header-title">現地お役立ち情報</span>
        <span className="tips-header-badge">TIPS</span>
      </div>
      <div className="tips-list">
        {tips.map((tip,i)=>(
          <div key={i} className="tip-item">
            <span className="tip-cat">{tip.cat}</span>
            <span className="tip-text" dangerouslySetInnerHTML={{__html:tip.text}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({live,onClose}){
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className={"mhero "+(live.featured?"red":"dark")}>
          <div className="mdate">{live.dateLabel||live.date}</div>
          <div className="mtitle">{live.tour}</div>
          {live.sub&&<div className="msub">{live.sub}</div>}
          <div className="mvenue">📍 {live.venue}</div>
          {live.open&&<div className="mtime-row"><div className="mtime">開場 <b>{live.open}</b></div><div className="mtime">開演 <b>{live.start}</b></div></div>}
        </div>
        <div className="msec">
          <div className="msec-ttl">セットリスト<span style={{fontSize:10,color:"rgba(28,10,12,0.3)",fontWeight:"normal",marginLeft:"auto",paddingLeft:8}}>全{live.songs.length}曲</span></div>
          <Setlist songs={live.songs}/>
        </div>
        <div className="msec">
          <div className="msec-ttl">座席位置</div>
          {live.featured
            ?<StadiumMap highlight={live.highlight} seat={live.seat}/>
            :<div style={{background:"#1c0a0c",borderRadius:12,padding:"14px",textAlign:"center",color:"rgba(255,255,255,.28)",fontSize:12}}>{live.seat||"座席情報は未設定です"}</div>
          }
        </div>
        <div className="msec">
          <div className="msec-ttl">フォト</div>
          <div className="photos">
            {live.photos.map((p,i)=>(
              <div key={i} className="photo">
                {(p.startsWith("data:")||p.startsWith("http"))?<img src={p} alt=""/>:p}
              </div>
            ))}
            <div className="photo add">＋</div>
          </div>
        </div>
        {live.tips&&live.tips.length>0&&(
          <div className="msec">
            <div className="msec-ttl">現地お役立ち情報</div>
            <TipsView tips={live.tips}/>
          </div>
        )}
        <div className="msec">
          <div className="msec-ttl">思い出メモ</div>
          <MemoryView memory={live.memory} comment={live.comment}/>
        </div>
      </div>
    </div>
  );
}

function AddForm({onClose}){
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="mhero red"><div className="mdate">NEW ENTRY</div><div className="mtitle">ライブを記録する</div></div>
        <div className="fsec"><label className="flbl">ツアー・公演名</label><input className="finp" placeholder="例: TVXQ! WORLD TOUR — CIRCLE"/></div>
        <div className="fsec"><div className="frow"><div className="fgrp"><label className="flbl">開催日</label><input className="finp" type="date"/></div><div className="fgrp"><label className="flbl">開演時刻</label><input className="finp" type="time" defaultValue="18:00"/></div></div></div>
        <div className="fsec"><label className="flbl">会場</label><input className="finp" placeholder="例: 東京ドーム"/></div>
        <div className="fsec"><div className="frow"><div className="fgrp"><label className="flbl">ブロック / 列</label><input className="finp" placeholder="C列 12番"/></div><div className="fgrp"><label className="flbl">座席番号</label><input className="finp" placeholder="34"/></div></div></div>
        <div className="fsec"><label className="flbl">セットリスト（1曲ずつ改行）</label><textarea className="finp" rows={5} placeholder={"1. Mirotic\n2. Rising Sun"} style={{resize:"none",lineHeight:1.8}}/></div>
        <div className="form-divider">思い出メモ</div>
        {MEM_FIELDS.map(({key,icon,label})=>(
          <div key={key} className="fsec">
            <label className="flbl"><span>{icon}</span>{label}</label>
            <textarea className="finp" rows={3} placeholder={
              key==="before"?"ライブ前の気持ち、期待していたこと…":
              key==="after"?"終わった後の感情、余韻…":
              key==="highlight"?"特に印象に残った曲・瞬間・演出…":
              "その他なんでも…"
            } style={{resize:"none",lineHeight:1.8}}/>
          </div>
        ))}
        <div className="fsec"><label className="flbl">写真をアップロード</label><div style={{display:"flex",gap:10}}>{[0,1,2].map(i=><div key={i} className="photo add" style={{width:80,height:80}}>＋</div>)}</div></div>
        <button className="save-btn">記録を保存する</button>
      </div>
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState("archive");
  const [selected,setSelected]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [nav,setNav]=useState("home");
  const feat=LIVES[0];
  const others=LIVES.slice(1);
  return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-sub">Live Archive</div>
          <div className="hdr-title">東方神起<br/><span>TVXQ!</span> メモリアル</div>
          <div className="hdr-row">
            <div className="stats">
              {[["25","LIVES"],["340","SONGS"],["19","VENUES"]].map(([n,l])=>(
                <div key={l}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
              ))}
            </div>
            <button className="add-btn" onClick={()=>{setShowAdd(true);setSelected(null);}}>＋</button>
          </div>
        </div>
        <div className="tabs">
          {[["archive","アーカイブ"],["setlist","セットリスト"],["photos","フォト"],["members","メンバー"]].map(([id,lbl])=>(
            <button key={id} className={"tab "+(tab===id?"on":"")} onClick={()=>setTab(id)}>{lbl}</button>
          ))}
        </div>
        <div className="content">
          <div className="sec-lbl">最新公演</div>
          <FeaturedCard onClick={()=>{setSelected(feat);setShowAdd(false);}}/>
          <div className="sec-lbl" style={{marginTop:8}}>過去の参戦</div>
          {others.map(live=>(
            <div key={live.id} className="card" onClick={()=>{setSelected(live);setShowAdd(false);}}>
              <div className="card-bar"/>
              <div className="card-body">
                <div className="card-date">{live.date}</div>
                <div className="card-title">{live.tour}</div>
                <div className="card-meta"><span className="chip">📍 {live.venue}</span><span className="chip">💺 {live.seat.split(" / ")[0]}</span></div>
              </div>
              <div className="card-thumb"><span>{live.emoji}</span><div className="card-tag">{live.tag}</div></div>
            </div>
          ))}
        </div>
        {selected&&<Modal live={selected} onClose={()=>setSelected(null)}/>}
        {showAdd&&<AddForm onClose={()=>setShowAdd(false)}/>}
        <div className="bnav">
          {[["home","🏠","ホーム"],["calendar","📅","カレンダー"],["stats","📊","統計"],["members","👥","仲間"],["profile","👤","マイページ"]].map(([id,ic,lbl])=>(
            <button key={id} className={"nitem "+(nav===id?"on":"")} onClick={()=>setNav(id)}>
              <span className="nicon">{ic}</span><span className="nlbl">{lbl}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

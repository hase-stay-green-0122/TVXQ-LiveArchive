import { useState, useMemo, useEffect } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ─────────────────────────────────────────────
//  Firebase 初期化
// ─────────────────────────────────────────────

const firebaseConfig = {
  apiKey: "AIzaSyB9AckvcNLR4TWFXMqtI0uaSIZEF1wXhoU",
  authDomain: "tvxq-live-archive.firebaseapp.com",
  projectId: "tvxq-live-archive",
  storageBucket: "tvxq-live-archive.firebasestorage.app",
  messagingSenderId: "687624555209",
  appId: "1:687624555209:web:0575b35d00ea4984139b18",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const DOC_REF = doc(db, "archive", "allLives");

const loadFromFirestore = async () => {
  const snap = await getDoc(DOC_REF);
  if (snap.exists()) return snap.data().lives;
  return null;
};

const saveToFirestore = async (lives) => {
  await setDoc(DOC_REF, { lives });
};

// ─────────────────────────────────────────────
//  定数・データ
// ─────────────────────────────────────────────

const PHOTO_NISSAN   = "data:image/jpeg;base64,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";
const SILHOUETTE_IMG = "data:image/png;base64,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";

const MEM_FIELDS = [
  { key: "before",    icon: "🌟", label: "ライブ前の期待"  },
  { key: "after",     icon: "✨", label: "ライブ後の感想"  },
  { key: "highlight", icon: "💥", label: "特筆すべきこと"  },
  { key: "other",     icon: "❤️", label: "その他"         },
];

// T字ドット事前計算（9列×7行）
const T_DOTS = (() => {
  const C = ["#e8112d","#c0152a","#ff3355","#d42035"];
  const d = [];
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 9; c++)
      d.push({ key:r*9+c, lit:r<=1||(c>=3&&c<=5), color:C[(r*9+c)%4] });
  return d;
})();

// ZONE収束ドット事前計算
const ZONE_DOTS = (() => {
  const dots = [];
  const cx = 50, cy = 50;
  for (let i = 0; i < 40; i++) {
    const angle = (i/40)*Math.PI*2;
    const dist  = 25 + (i%4)*10;
    dots.push({ key:i, x:cx+Math.cos(angle)*dist, y:cy+Math.sin(angle)*dist,
      opacity:0.15+(1-dist/65)*0.7, size:2+(1-dist/65)*4 });
  }
  return dots;
})();

const TOURS = [
  {
    id: "tour-20th",
    name: "東方神起 20th Anniversary LIVE IN NISSAN STADIUM",
    sub:  "〜RED OCEAN〜",
    color: "#c0152a",
    featured: true,
    lives: [
      {
        id: "nissan-0425",
        date: "2026.04.25",
        dateLabel: "2026年4月25日（土）",
        open: "15:00",
        start: "17:00",
        venue: "日産スタジアム",
        seat: "未設定",
        highlight: null,
        tag: "横浜",
        emoji: "🎡",
        songs: [
          { n:1,  t:"small talk"                         },
          { n:2,  t:"Reboot"                             },
          { n:3,  t:"Why? (Keep Your Head Down)"         },
          { n:4,  t:"Choosey Lover"                      },
          { n:5,  t:"Special One"                        },
          { n:6,  t:"Jungle"                             },
          { n:7,  t:"Champion"                           },
          { n:8,  t:"Spinning"                           },
          { n:9,  t:"信じるまま"                           },
          { n:10, t:"One and Only One"                   },
          { n:11, t:"Time Works Wonders"                 },
          { n:12, t:"明日は来るから"                        },
          { n:13, t:"IDENTITY"                           },
          { n:14, t:"Road"                               },
          { n:15, t:"どうして君を好きになってしまったんだろう" },
          { n:16, t:"Survivor"                           },
          { n:17, t:"High time"                          },
          { n:18, t:"Hot Hot Hot"                        },
          { n:19, t:"大好きだった"                          },
          { n:20, t:"It's true It's Here"                },
          { n:21, t:"Rising Sun"                         },
          { n:22, t:'"O"-正・反・合'                        },
          { n:23, t:"PROUD"                              },
          { n:24, t:"MAXIMUM",          e: true          },
          { n:25, t:"月の裏で会いましょう",  e: true          },
          { n:26, t:"Share the World",   e: true          },
          { n:27, t:"ウィーアー！",         e: true          },
          { n:28, t:"OCEAN",             e: true          },
          { n:29, t:"Somebody To Love", e: true          },
          { n:30, t:"Weep",             e: true          },
          { n:31, t:"時ヲ止メテ",          e: true          },
        ],
        memory: {
          before:    "",
          after:     "",
          highlight: "",
          other:     "",
        },
        tips:   [],
        photos: [],
      },
      {
        id: "nissan-0426",
        date: "2026.04.26",
        dateLabel: "2026年4月26日（日）",
        open: "15:00",
        start: "17:00",
        venue: "日産スタジアム",
        seat: "W1F / 入口W13 / 列8 / 座席245",
        highlight: "W1F",
        tag: "横浜",
        emoji: "🎡",
        songs: [
          { n:1,  t:"small talk"                         },
          { n:2,  t:"Reboot"                             },
          { n:3,  t:"Why? (Keep Your Head Down)"         },
          { n:4,  t:"Choosey Lover"                      },
          { n:5,  t:"Special One"                        },
          { n:6,  t:"Jungle"                             },
          { n:7,  t:"Champion"                           },
          { n:8,  t:"Spinning"                           },
          { n:9,  t:"信じるまま"                           },
          { n:10, t:"One and Only One"                   },
          { n:11, t:"Time Works Wonders"                 },
          { n:12, t:"明日は来るから"                        },
          { n:13, t:"IDENTITY"                           },
          { n:14, t:"Road"                               },
          { n:15, t:"どうして君を好きになってしまったんだろう" },
          { n:16, t:"Survivor"                           },
          { n:17, t:"High time"                          },
          { n:18, t:"Hot Hot Hot"                        },
          { n:19, t:"大好きだった"                          },
          { n:20, t:"It's true It's Here"              },
          { n:21, t:"Rising Sun"                         },
          { n:22, t:'"O"-正・反・合'                     },
          { n:23, t:"PROUD"                              },
          { n:24, t:"MAXIMUM",          e: true          },
          { n:25, t:"月の裏で会いましょう",  e: true          },
          { n:26, t:"Share the World",   e: true          },
          { n:27, t:"ウィーアー！",         e: true          },
          { n:28, t:"OCEAN",             e: true          },
          { n:29, t:"Somebody To Love", e: true          },
          { n:30, t:"Weep",             e: true          },
          { n:31, t:"時ヲ止メテ",          e: true          },
        ],
        memory: {
          before:    "20周年のスタジアムライブ。何ヶ月も前からチケットを握りしめて待ってた。前日は緊張と興奮で眠れなかった。友達と「絶対泣く」って言い合ってた。",
          after:     "終わった後、しばらく動けなかった。7万人の「RED OCEAN」が波みたいに揺れて、ユノとチャンミンが笑顔でその海を見渡してた。この景色を一生忘れないと思う。",
          highlight: "「Rising Sun」のイントロが流れた瞬間、全身が震えた。20年分の記憶が一気によみがえって、気づいたら泣いてた。会場全体が一つになった感覚がした。",
          other:     "Happy 20th birthday!!\n一生ついていきます❤️",
        },
        tips: [
          { cat: "🍜 ライブ前グルメ", text: "三代目茂蔵 日産スタジアム店がおすすめ。どれ食べても美味しい。要予約。", url: "https://s.tabelog.com/kanagawa/A1401/A140206/14090986/" },
          { cat: "🍺 ライブ後グルメ", text: "鳥良商店 新横浜店へ。いずれも要予約。", url: "https://a119825.gorp.jp/" },
          { cat: "⏰ タイミング",     text: "<strong>開演 17:00・終演 約 20:30。</strong>規制退場を待たずに退場すれば21:00過ぎに周辺店着。規制退場は席によって終演後30分以上待つ場合あり。" },
          { cat: "🚻 トイレ",         text: "<strong>6階</strong>に並んだ。個室12個は少ない。男性用が女性用になっているところで5個ほど増えるが、<strong>24〜25個のトイレ</strong>を探して並ぶのがベスト。" },
          { cat: "🏃 入場",           text: "<strong>開演1時間前</strong>到着でトイレに並ぶとちょうどいい。30分前では間に合わない。" },
          { cat: "💺 見え方",         text: "1階・2階スタンド席は段差があるので見やすい。" },
        ],
        photos: [PHOTO_NISSAN],
      },
    ],
  },
  {
    id: "tour-zone",
    name: "東方神起 20th Anniversary LIVE TOUR ～ZONE～",
    color: "#1a4a6b",
    lives: [
      {
        id: "zone-saitama",
        date: "2024.11.29",
        dateLabel: "2024年11月29日（金）",
        open: "17:00", start: "18:00",
        venue: "さいたまスーパーアリーナ",
        seat: "未設定", highlight: null,
        tag: "埼玉", emoji: "🍡",
        songs: [
          { n:1,  t:"TRHM"                },
          { n:2,  t:"Android"             },
          { n:3,  t:"It's true It's Here" },
          { n:4,  t:"Fresh"               },
          { n:5,  t:"Dirt"                },
          { n:6,  t:"Spellbound"          },
          { n:7,  t:"Sweet surrender"     },
          { n:8,  t:"Down"                },
          { n:9,  t:"Before U Go"         },
          { n:10, t:"Dearest"             },
          { n:11, t:"Forever Love"        },
          { n:12, t:"Stand by U"          },
          { n:13, t:"Live your Life"      },
          { n:14, t:"Easy Mind"           },
          { n:15, t:"Ark"                 },
          { n:16, t:"On Your Radar"       },
          { n:17, t:"Party Like Madonna"  },
          { n:18, t:"Damn Good"           },
          { n:19, t:"Whyi"                },
          { n:20, t:"Love in the Ice"     },
          { n:21, t:"Catch Me", e: true   },
        ],
        memory: { before:"", after:"", highlight:"", other:"" },
        tips:   [],
        photos: [],
      },
      {
        id: "zone-osaka",
        date: "2025.01.18",
        dateLabel: "2025年1月18日（土）",
        open: "16:00", start: "17:00",
        venue: "大阪城ホール",
        seat: "未設定", highlight: null,
        tag: "大阪", emoji: "🐙",
        songs: [
          { n:1,  t:"TRHM"                },
          { n:2,  t:"Android"             },
          { n:3,  t:"It's true It's Here" },
          { n:4,  t:"Fresh"               },
          { n:5,  t:"Dirt"                },
          { n:6,  t:"Spellbound"          },
          { n:7,  t:"Sweet surrender"     },
          { n:8,  t:"Down"                },
          { n:9,  t:"Before U Go"         },
          { n:10, t:"Dearest"             },
          { n:11, t:"Forever Love"        },
          { n:12, t:"Stand by U"          },
          { n:13, t:"Live your Life"      },
          { n:14, t:"Easy Mind"           },
          { n:15, t:"Ark"                 },
          { n:16, t:"On Your Radar"       },
          { n:17, t:"Party Like Madonna"  },
          { n:18, t:"Damn Good"           },
          { n:19, t:"Whyi"                },
          { n:20, t:"Love in the Ice"     },
          { n:21, t:"Catch Me", e: true   },
        ],
        memory: { before:"", after:"", highlight:"", other:"" },
        tips:   [],
        photos: [],
      },
      {
        id: "zone-tokyo",
        date: "2025.04.19",
        dateLabel: "2025年4月19日（土）",
        open: "16:00", start: "17:00",
        venue: "東京ドーム",
        seat: "未設定", highlight: null,
        tag: "東京", emoji: "🗼",
        songs: [
          { n:1,  t:"TRHM"                },
          { n:2,  t:"Android"             },
          { n:3,  t:"It's true It's Here" },
          { n:4,  t:"Fresh"               },
          { n:5,  t:"Dirt"                },
          { n:6,  t:"Spellbound"          },
          { n:7,  t:"Sweet surrender"     },
          { n:8,  t:"Down"                },
          { n:9,  t:"Before U Go"         },
          { n:10, t:"Dearest"             },
          { n:11, t:"Forever Love"        },
          { n:12, t:"Stand by U"          },
          { n:13, t:"Live your Life"      },
          { n:14, t:"Easy Mind"           },
          { n:15, t:"Ark"                 },
          { n:16, t:"On Your Radar"       },
          { n:17, t:"Party Like Madonna"  },
          { n:18, t:"Damn Good"           },
          { n:19, t:"Whyi"                },
          { n:20, t:"Love in the Ice"     },
          { n:21, t:"Catch Me", e: true   },
        ],
        memory: { before:"", after:"", highlight:"", other:"" },
        tips:   [],
        photos: [],
      },
    ],
  },
];

// ─────────────────────────────────────────────
//  初期データ構築
// ─────────────────────────────────────────────

const buildInitialAllLives = () =>
  TOURS.flatMap(t => t.lives.map(l => ({
    tourId:    t.id,
    tourName:  t.name,
    tourSub:   t.sub || null,
    tourColor: t.color,
    featured:  !!t.featured,
    live:      l,
  })));

// ─────────────────────────────────────────────
//  スタイル
// ─────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Noto+Sans+JP:wght@300;400&display=swap');
  :root { --red:#c0152a; --red-deep:#8b0d1c; --ink:#1c0a0c; --paper:#fdf6f6; --offwhite:#fff8f8; --gold:#d4a843; --gold-lt:#edd98a; --mist:#f5e8e8; --shadow:rgba(140,10,30,0.13); }
  * { box-sizing:border-box; margin:0; padding:0; }
  .app { font-family:"Noto Sans JP",sans-serif; background:var(--paper); min-height:100vh; max-width:430px; margin:0 auto; color:var(--ink); }

  /* Header */
  .hdr { background:linear-gradient(160deg,var(--red-deep),var(--red) 60%,#d42035); position:relative; overflow:hidden; }
  .hdr-vis { position:relative; height:130px; overflow:hidden; background:linear-gradient(180deg,#0d0204 0%,#1a0306 40%,#2d0508 100%); }
  .hdr-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 180px 60px at 50% 100%,rgba(192,21,42,.4),transparent 70%),radial-gradient(ellipse 80px 120px at 35% 100%,rgba(220,30,50,.2),transparent 65%),radial-gradient(ellipse 80px 120px at 65% 100%,rgba(220,30,50,.2),transparent 65%); }
  .hdr-aktf { position:absolute; top:16px; left:0; right:0; display:flex; justify-content:center; pointer-events:none; z-index:10; }
  .hdr-aktf span { font-family:"Cormorant Garamond",serif; font-size:16px; font-style:italic; font-weight:400; letter-spacing:.38em; color:#fff; white-space:nowrap; text-shadow:0 0 24px rgba(232,17,45,.9),0 0 8px rgba(232,17,45,.6),0 1px 4px rgba(0,0,0,.9); }
  .hdr-tdots { position:absolute; bottom:28px; left:50%; transform:translateX(-50%); display:grid; grid-template-columns:repeat(9,7px); grid-template-rows:repeat(7,7px); gap:2px; z-index:2; }
  .hdr-dot { width:4px; height:6px; border-radius:50% 50% 30% 30%; align-self:end; }
  .hdr-silhouette { position:absolute; bottom:0; left:50%; transform:translateX(calc(-50% + 80px)); z-index:6; opacity:.92; mix-blend-mode:screen; }
  .hdr-sil { position:absolute; bottom:0; left:0; right:0; height:60px; z-index:1; }
  .hdr-pitch { position:absolute; bottom:0; left:8%; right:8%; height:20px; background:linear-gradient(180deg,#0d2e0d,#0a200a); border-radius:50% 50% 0 0/40% 40% 0 0; }
  .hdr-pitch::before { content:"STAGE"; position:absolute; top:5px; left:50%; transform:translateX(-50%); font-size:7px; letter-spacing:.3em; color:rgba(255,255,255,.18); font-family:"Cormorant Garamond",serif; }
  .hdr-body { padding:14px 24px 16px; }
  .hdr-sub { font-family:"Noto Serif JP",serif; font-weight:300; font-size:16px; letter-spacing:.1em; color:#fff; }
  .hdr-row { display:flex; align-items:center; justify-content:space-between; margin-top:14px; }
  .stats { display:flex; gap:22px; }
  .stat-n { font-family:"Cormorant Garamond",serif; font-size:24px; color:var(--gold-lt); line-height:1; }
  .stat-l { font-size:9px; color:rgba(255,255,255,.45); letter-spacing:.14em; margin-top:2px; }
  .add-btn { background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.35); color:#fff; border-radius:50%; width:44px; height:44px; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  /* Content */
  .content { padding:20px 18px 40px; }
  .sec-lbl { font-size:10px; letter-spacing:.22em; color:rgba(28,10,12,.35); text-transform:uppercase; margin-bottom:12px; padding-left:2px; }

  /* Tour card */
  .tour-card { background:var(--ink); border-radius:14px; margin-bottom:12px; overflow:hidden; box-shadow:0 2px 10px var(--shadow); border:1px solid rgba(192,21,42,.2); }
  .tour-card-hdr { display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; }
  .tour-card-bar { width:3px; height:36px; border-radius:2px; flex-shrink:0; }
  .tour-card-info { flex:1; min-width:0; }
  .tour-card-name { font-family:"Noto Serif JP",serif; font-size:11px; font-weight:600; color:#fff; line-height:1.4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tour-card-count { font-size:10px; color:rgba(255,255,255,.5); margin-top:3px; }
  .tour-card-arrow { font-size:18px; color:rgba(255,255,255,.3); transition:transform .2s; flex-shrink:0; }
  .tour-card-arrow.open { transform:rotate(90deg); }

  /* RED OCEAN visual */
  .red-vis { height:110px; background:linear-gradient(180deg,#0a0204,#1a0208 50%,#2a0510); position:relative; overflow:hidden; cursor:pointer; }
  .red-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 300px 30px at 50% 85%,rgba(232,17,45,.35),transparent 70%),radial-gradient(ellipse 200px 20px at 30% 70%,rgba(192,21,42,.2),transparent 70%),radial-gradient(ellipse 200px 20px at 70% 60%,rgba(192,21,42,.2),transparent 70%); }
  .red-wm { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:1; }
  .red-wm span { font-family:"Cormorant Garamond",serif; font-size:48px; font-weight:300; letter-spacing:.2em; color:rgba(255,255,255,.75); white-space:nowrap; }
  .red-waves { position:absolute; bottom:0; left:0; right:0; }
  .red-wave { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(232,17,45,.3) 25%,rgba(255,80,100,.5) 50%,rgba(232,17,45,.3) 75%,transparent); }
  .red-wave:nth-child(1){bottom:8px} .red-wave:nth-child(2){bottom:16px;opacity:.6} .red-wave:nth-child(3){bottom:24px;opacity:.3}
  .red-ocean-dots { position:absolute; bottom:30px; left:0; right:0; display:flex; justify-content:center; flex-wrap:wrap; gap:3px; padding:0 12px; z-index:2; }
  .rod { width:3px; height:8px; border-radius:2px 2px 0 0; }
  .red-badge { position:absolute; top:12px; right:12px; background:var(--gold); color:#fff; font-size:8px; font-weight:700; letter-spacing:.15em; padding:3px 9px; border-radius:3px; z-index:3; }
  .red-label { position:absolute; bottom:10px; left:16px; font-family:"Noto Sans JP",sans-serif; font-size:10px; color:var(--gold-lt); z-index:3; }
  .red-arrow { position:absolute; bottom:10px; right:16px; color:rgba(255,255,255,.3); font-size:16px; z-index:3; }

  /* ZONE visual */
  .zone-vis { height:110px; background:linear-gradient(160deg,#060e1c,#0d1e38 45%,#091628); position:relative; overflow:hidden; cursor:pointer; }
  .zone-vis::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse 160px 90px at 15% 20%,rgba(80,160,255,.14),transparent 65%),radial-gradient(ellipse 120px 70px at 85% 75%,rgba(60,130,220,.12),transparent 65%),radial-gradient(ellipse 200px 40px at 50% 100%,rgba(40,100,180,.18),transparent 70%); }
  .zone-vis::after { content:""; position:absolute; bottom:28px; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(100,170,255,.25) 30%,rgba(140,200,255,.45) 50%,rgba(100,170,255,.25) 70%,transparent); }
  .zone-wm { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; }
  .zone-wm span { font-family:"Cormorant Garamond",serif; font-size:52px; font-weight:300; letter-spacing:.32em; color:rgba(255,255,255,.75); white-space:nowrap; }
  .zone-dots-svg { position:absolute; inset:0; width:100%; height:100%; }
  .zone-badge { position:absolute; top:12px; right:12px; background:rgba(80,150,255,.2); border:1px solid rgba(100,170,255,.35); color:rgba(160,210,255,.9); font-size:8px; font-weight:700; letter-spacing:.15em; padding:3px 9px; border-radius:3px; }
  .zone-label { position:absolute; bottom:10px; left:16px; font-family:"Noto Sans JP",sans-serif; font-size:10px; color:var(--gold-lt); }
  .zone-arrow { position:absolute; bottom:10px; right:16px; color:rgba(100,160,255,.45); font-size:16px; }

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
  .del-dialog-cancel { flex:1; background:transparent; border:1.5px solid rgba(28,10,12,.2); color:rgba(28,10,12,.6); border-radius:10px; padding:12px; font-size:14px; cursor:pointer; font-family:"Noto Sans JP",sans-serif; }
  .del-dialog-confirm { flex:1; background:var(--red); border:none; color:#fff; border-radius:10px; padding:12px; font-size:14px; cursor:pointer; font-family:"Noto Sans JP",sans-serif; font-weight:600; }
  .live-item-emoji { font-size:22px; flex-shrink:0; }
  .live-item-info { flex:1; min-width:0; }
  .live-item-date { font-family:"Cormorant Garamond",serif; font-size:11px; color:rgba(232,17,45,.8); letter-spacing:.12em; margin-bottom:2px; }
  .live-item-venue { font-size:13px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .live-item-seat { font-size:10px; color:rgba(255,255,255,.35); margin-top:2px; }

  /* Modal */
  .overlay { position:fixed; inset:0; background:rgba(28,10,12,.78); z-index:100; display:flex; align-items:flex-end; backdrop-filter:blur(5px); }
  .modal { background:var(--paper); border-radius:24px 24px 0 0; width:100%; max-height:92vh; overflow-y:auto; padding:0 0 44px; }
  .modal-handle { width:36px; height:4px; background:rgba(192,21,42,.18); border-radius:2px; margin:0 auto 12px; display:block; }
  .modal-nav { position:sticky; top:0; z-index:10; display:flex; flex-direction:column; background:var(--paper); border-bottom:1px solid rgba(192,21,42,.08); box-shadow:0 2px 8px rgba(28,10,12,.06); padding:12px 18px 14px; }
  .modal-nav-btns { display:flex; align-items:center; justify-content:space-between; }
  .nav-back { display:flex; align-items:center; gap:4px; background:rgba(192,21,42,.08); border:1.5px solid rgba(192,21,42,.2); color:var(--red); font-size:15px; font-family:"Noto Sans JP",sans-serif; cursor:pointer; padding:11px 18px; border-radius:10px; font-weight:500; }
  .nav-back::before { content:"‹"; font-size:22px; line-height:1; margin-right:2px; }
  .nav-right { display:flex; gap:8px; align-items:center; }
  .mhero { padding:24px 24px 20px; margin-bottom:20px; position:relative; overflow:hidden; }
  .mhero.red { background:linear-gradient(140deg,var(--red-deep),var(--red)); }
  .mhero.red::after { content:"RED OCEAN"; position:absolute; bottom:-14px; right:-4px; font-family:"Cormorant Garamond",serif; font-size:50px; font-weight:300; color:rgba(255,255,255,.05); white-space:nowrap; pointer-events:none; }
  .mhero.dark { background:linear-gradient(140deg,var(--red-deep),var(--ink)); }
  .mhero.dark::after { content:"東方神起"; position:absolute; bottom:-16px; right:-8px; font-family:"Noto Serif JP",serif; font-size:62px; font-weight:300; color:rgba(255,255,255,.04); white-space:nowrap; pointer-events:none; }
  .mdate { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:12px; color:rgba(255,255,255,.6); letter-spacing:.18em; margin-bottom:6px; }
  .mtitle { font-family:"Noto Serif JP",serif; font-size:17px; font-weight:600; color:#fff; line-height:1.5; }
  .msub { font-family:"Cormorant Garamond",serif; font-style:italic; font-size:13px; color:var(--gold-lt); letter-spacing:.1em; margin-top:4px; }
  .mvenue { margin-top:9px; font-size:14px; color:rgba(255,255,255,.6); }
  .mtime-row { display:flex; gap:16px; margin-top:8px; }
  .mtime { display:flex; gap:5px; font-size:13px; color:rgba(255,255,255,.5); align-items:center; }
  .mtime b { color:rgba(255,255,255,.9); }
  .edit-btn { background:var(--red); border:none; color:#fff; border-radius:10px; padding:11px 22px; font-size:15px; font-weight:500; cursor:pointer; white-space:nowrap; font-family:"Noto Sans JP",sans-serif; }
  .msec { padding:0 20px; margin-bottom:20px; }
  .msec-ttl { font-size:13px; letter-spacing:.15em; color:rgba(28,10,12,.5); text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:8px; font-weight:600; }
  .msec-ttl::after { content:""; flex:1; height:1px; background:rgba(192,21,42,.12); }

  /* Setlist */
  .setlist { list-style:none; }
  .enc-div { display:flex; align-items:center; gap:10px; margin:12px 0 6px; }
  .enc-line { flex:1; height:1px; background:rgba(192,21,42,.15); }
  .enc-lbl { font-size:11px; letter-spacing:.2em; color:var(--red); text-transform:uppercase; white-space:nowrap; }
  .sl-item { display:flex; align-items:center; padding:10px 0; border-bottom:1px solid rgba(192,21,42,.06); gap:12px; }
  .sl-num { font-family:"Cormorant Garamond",serif; font-size:17px; color:rgba(192,21,42,.4); width:24px; text-align:right; flex-shrink:0; }
  .sl-name { font-size:16px; color:var(--ink); line-height:1.4; flex:1; text-align:left; }
  .sl-enc { margin-left:auto; background:rgba(192,21,42,.1); color:var(--red); font-size:8px; padding:2px 8px; border-radius:10px; flex-shrink:0; }

  /* Seat map */
  .seat-map { background:#1c0a0c; border-radius:12px; padding:10px; }
  .seat-info { text-align:center; margin-top:8px; font-size:11px; color:rgba(255,255,255,.45); }
  .seat-info strong { color:var(--gold-lt); font-family:"Cormorant Garamond",serif; font-size:14px; }

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
  .finp { width:100%; background:var(--offwhite); border:1px solid rgba(192,21,42,.14); border-radius:10px; padding:12px 14px; font-size:14px; font-family:"Noto Sans JP",sans-serif; color:var(--ink); outline:none; transition:border .2s; }
  .finp:focus { border-color:var(--red); }
  .frow { display:flex; gap:10px; }
  .fgrp { flex:1; }
  .fdivider { margin:4px 20px 14px; font-size:12px; letter-spacing:.15em; color:rgba(192,21,42,.65); text-transform:uppercase; padding-top:14px; border-top:1px solid rgba(192,21,42,.1); font-weight:600; }
  .save-btn { width:calc(100% - 40px); margin:10px 20px 0; background:linear-gradient(135deg,var(--red),var(--red-deep)); color:#fff; border:none; border-radius:12px; padding:16px; font-family:"Noto Serif JP",serif; font-size:15px; letter-spacing:.1em; cursor:pointer; transition:transform .1s, box-shadow .1s, background .2s; }
  .save-btn:active { transform:scale(.97); }
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
  .color-presets { display:flex; gap:10px; flex-wrap:wrap; }
  .color-preset { width:38px; height:38px; border-radius:50%; cursor:pointer; border:3px solid transparent; transition:transform .15s, border-color .15s; flex-shrink:0; }
  .color-preset.selected { border-color:var(--ink); transform:scale(1.15); }

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
  .preview-loading { display:flex; align-items:center; justify-content:center; flex-direction:column; gap:10px; height:140px; background:var(--ink); }

  /* ツアー削除ボタン */
  .tour-del-wrap { position:relative; flex-shrink:0; margin-left:4px; }
  .tour-del { background:rgba(192,21,42,.12); border:1px solid rgba(192,21,42,.25); color:rgba(255,100,100,.7); border-radius:50%; width:26px; height:26px; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
  .tour-del:hover { background:rgba(192,21,42,.4); color:#fff; }
  .tour-del-tip { position:absolute; right:32px; top:50%; transform:translateY(-50%); background:rgba(28,10,12,.92); color:#fff; font-size:11px; padding:4px 10px; border-radius:6px; white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .15s; }
  .tour-del-wrap:hover .tour-del-tip { opacity:1; }
`;

// ─────────────────────────────────────────────
//  ユーティリティ
// ─────────────────────────────────────────────

function usePhotoUpload(initial = [], liveId = "unknown") {
  const [photos,    setPhotos]    = useState(initial);
  const [uploading, setUploading] = useState(false);

  const handleAdd = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const path = `photos/${liveId}/${Date.now()}_${file.name}`;
        const ref = storageRef(storage, path);
        await uploadBytes(ref, file);
        return await getDownloadURL(ref);
      }));
      setPhotos(prev => [...prev, ...urls].slice(0, 6));
    } catch (err) {
      alert("写真のアップロードに失敗しました。もう一度お試しください。");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (i) => setPhotos(prev => prev.filter((_,idx) => idx !== i));

  return { photos, handleAdd, handleRemove, uploading };
}

const parseTips = (text) =>
  text.split("\n").map(l => l.trim()).filter(Boolean).map(t => ({ cat:"📌 Tips", text:t }));

const tipsToText = (tips) =>
  (tips || []).map(t => t.text.replace(/<[^>]+>/g, "")).join("\n");

// ─────────────────────────────────────────────
//  共通サブコンポーネント
// ─────────────────────────────────────────────

function PhotoEditor({ photos, onAdd, onRemove, uploading }) {
  return (
    <div className="fsec">
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:8 }}>
        {photos.map((p, i) => (
          <div key={i} className="photo-thumb">
            {(p.startsWith("data:") || p.startsWith("http"))
              ? <img src={p} alt=""/>
              : <div style={{width:80,height:80,borderRadius:8,background:"var(--mist)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{p}</div>
            }
            <button className="photo-del" onClick={() => onRemove(i)}>×</button>
          </div>
        ))}
        {uploading && (
          <div style={{width:80,height:80,borderRadius:8,background:"var(--mist)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
            <div style={{width:24,height:24,border:"3px solid var(--red)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            <div style={{fontSize:9,color:"var(--red)"}}>送信中</div>
          </div>
        )}
      </div>
      {!uploading && photos.length < 6 && (
        <input type="file" accept="image/*" multiple style={{fontSize:13,color:"var(--ink)"}} onChange={onAdd}/>
      )}
      <div style={{fontSize:10,color:"rgba(28,10,12,.3)",marginTop:6}}>最大6枚まで追加できます</div>
    </div>
  );
}

// セクション順統一コンポーネント群
// 順番：①セットリスト ②座席 ③写真 ④思い出メモ ⑤Tips

function MemorySection({ memory }) {
  return (
    <div className="mem-list">
      {MEM_FIELDS.map(({ key, icon, label }) => (
        <div key={key} className="mem-card">
          <div className="mem-hdr"><span className="mem-icon">{icon}</span><span className="mem-lbl">{label}</span></div>
          <div className="mem-text">
            {memory?.[key]
              ? memory[key]
              : <span className="empty">まだ記録されていません…</span>
            }
          </div>
        </div>
      ))}
    </div>
  );
}

function TipItem({ tip }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="tip-item">
      <span className="tip-cat">{tip.cat}</span>
      <div style={{flex:1}}>
        <div className="tip-text" dangerouslySetInnerHTML={{__html:tip.text}}/>
        {tip.url && (
          <div className="tip-url">
            <span className="tip-url-text">{tip.url}</span>
            <button className={"tip-copy"+(copied?" copied":"")}
              onClick={() => navigator.clipboard.writeText(tip.url).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); })}>
              {copied ? "✓ コピー済" : "📋 コピー"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TipsSection({ tips }) {
  return (
    <div className="tips-box">
      <div className="tips-hdr"><span className="tips-hdr-ic">📌</span><span className="tips-hdr-tt">Live を楽しむための Tips</span><span className="tips-badge">TIPS</span></div>
      {(!tips || tips.length === 0)
        ? <div className="tip-item"><div className="tip-text" style={{color:"rgba(255,255,255,.28)",fontStyle:"italic"}}>まだ Tips が記録されていません…</div></div>
        : tips.map((tip, i) => <TipItem key={i} tip={tip}/>)
      }
    </div>
  );
}

// 思い出メモ入力フィールド群
function MemInputs({ mem, setMem }) {
  return (
    <>
      {MEM_FIELDS.map(({ key, icon, label }) => (
        <div key={key} className="fsec">
          <label className="flbl"><span>{icon}</span>{label}</label>
          <textarea className="finp" rows={3} style={{resize:"none",lineHeight:1.8}}
            value={mem[key]||""}
            onChange={e => setMem(prev => ({...prev, [key]: e.target.value}))}
            placeholder={
              key==="before" ? "ライブ前の気持ち、期待していたこと…" :
              key==="after"  ? "終わった後の感情、余韻…" :
              key==="highlight" ? "特に印象に残った曲・瞬間・演出…" :
              "その他なんでも…"
            }
          />
        </div>
      ))}
    </>
  );
}

// Tips入力フィールド
function TipsInput({ value, onChange }) {
  return (
    <div className="fsec">
      <label className="flbl">Tips（1行1項目）</label>
      <textarea className="finp" rows={4} style={{resize:"none",lineHeight:1.8}}
        placeholder={"コクーンのフードコートが穴場\n開演1時間前に並ぶとトイレも余裕\n2階スタンドは段差があって見やすい"}
        value={value} onChange={onChange}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  コンポーネント
// ─────────────────────────────────────────────

function Silhouette() {
  return <img className="hdr-silhouette" src={SILHOUETTE_IMG} alt="" style={{height:"95px",width:"auto",objectFit:"contain"}}/>;
}

function DeleteDialog({ live, onCancel, onConfirm }) {
  return (
    <div className="del-dialog-overlay" onClick={onCancel}>
      <div className="del-dialog" onClick={e => e.stopPropagation()}>
        <div className="del-dialog-ttl">ライブを削除しますか？</div>
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

function TourCard({ tour, onLiveSelect, onLiveDelete, onTourDelete }) {
  const [open, setOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [delTour, setDelTour] = useState(false);
  const totalSongs = tour.lives.reduce((s,l) => s+l.songs.length, 0);
  const ROD = ["#e8112d","#c0152a","#ff3355","#d42035","#ff1a40","#b00d22"];
  return (
    <div className="tour-card">
      {delTour && (
        <DeleteDialog
          live={{date: tour.name, venue:`全${tour.lives.length}公演が削除されます`}}
          onCancel={() => setDelTour(false)}
          onConfirm={() => { onTourDelete(tour.id); setDelTour(false); }}
        />
      )}
      {delTarget && (
        <DeleteDialog
          live={delTarget}
          onCancel={() => setDelTarget(null)}
          onConfirm={() => { onLiveDelete(delTarget.id); setDelTarget(null); }}
        />
      )}
      {tour.id === "tour-20th" && (
        <div className="red-vis" onClick={() => setOpen(o=>!o)}>
          <div className="red-wm"><span>RED OCEAN</span></div>
          <div className="red-ocean-dots">
            {Array.from({length:60}).map((_,i) => (
              <div key={i} className="rod" style={{background:ROD[i%ROD.length],height:6+(i%5)*3,opacity:0.4+(i%4)*0.15,boxShadow:`0 0 3px ${ROD[i%ROD.length]}`}}/>
            ))}
          </div>
          <div className="red-waves"><div className="red-wave"/><div className="red-wave"/><div className="red-wave"/></div>
          <div className="red-badge">20TH ANNIVERSARY</div>
          <div className="red-label">2026.04.25–2026.04.26 · 日産スタジアム · 全2公演</div>
          <div className="red-arrow">›</div>
        </div>
      )}
      {tour.id === "tour-zone" && (
        <div className="zone-vis" onClick={() => setOpen(o=>!o)}>
          <div className="zone-wm"><span>ZONE</span></div>
          <svg className="zone-dots-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="50" r="4" fill="rgba(180,220,255,0.9)"/>
            <circle cx="50" cy="50" r="8" fill="rgba(120,180,255,0.2)"/>
            <circle cx="50" cy="50" r="14" fill="rgba(80,140,255,0.08)"/>
            {ZONE_DOTS.map(({key,x,y,opacity,size}) => (
              <circle key={key} cx={x} cy={y} r={size/2} fill={`rgba(140,200,255,${opacity})`}/>
            ))}
          </svg>
          <div className="zone-badge">20TH ANNIVERSARY</div>
          <div className="zone-label">2024.11.29–2025.04.19 · アリーナツアー &amp; 東京ドーム追加公演 全22公演</div>
          <div className="zone-arrow">›</div>
        </div>
      )}
      {tour.svgCode && tour.id !== "tour-20th" && tour.id !== "tour-zone" && (
        <div style={{height:110,overflow:"hidden",cursor:"pointer"}} onClick={() => setOpen(o=>!o)}
          dangerouslySetInnerHTML={{__html:tour.svgCode}}/>
      )}
      {!tour.svgCode && tour.id !== "tour-20th" && tour.id !== "tour-zone" && (
        <div style={{height:60,background:`linear-gradient(135deg,${tour.color}cc,${tour.color}66)`,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 16px"}}
          onClick={() => setOpen(o=>!o)}>
          <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,color:"rgba(255,255,255,.8)",fontStyle:"italic"}}>{tour.name}</span>
        </div>
      )}
      <div className="tour-card-hdr" onClick={() => setOpen(o=>!o)}>
        <div className="tour-card-bar" style={{background:tour.color}}/>
        <div className="tour-card-info">
          <div className="tour-card-name">{tour.name}</div>
          <div className="tour-card-count">{tour.lives.length}公演 · {totalSongs}曲</div>
        </div>
        <div className={"tour-card-arrow "+(open?"open":"")}>›</div>
        <div className="tour-del-wrap" onClick={e => { e.stopPropagation(); setDelTour(true); }}>
          <div className="tour-del-tip">ツアーを削除</div>
          <button className="tour-del">×</button>
        </div>
      </div>
      {open && (
        <div className="lives-list">
          {tour.lives.map(live => (
            <div key={live.id} className="live-item" onClick={() => onLiveSelect(live, tour)}>
              <div className="live-item-emoji">{live.emoji}</div>
              <div className="live-item-info">
                <div className="live-item-date">{live.date}</div>
                <div className="live-item-venue">{live.venue}</div>
                <div className="live-item-seat">{live.seat.split(" / ")[0]}</div>
              </div>
              <div className="live-del-wrap" onClick={e => { e.stopPropagation(); setDelTarget(live); }}>
                <div className="live-del-tip">削除する</div>
                <button className="live-del">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Setlist({ songs }) {
  let shown = false;
  return (
    <ul className="setlist">
      {songs.map(s => {
        const enc = !!s.e;
        let div = null;
        if (enc && !shown) {
          shown = true;
          div = <li key="enc"><div className="enc-div"><div className="enc-line"/><span className="enc-lbl">― アンコール ―</span><div className="enc-line"/></div></li>;
        }
        return [div, <li key={s.n} className="sl-item"><span className="sl-num">{s.n}</span><div className="sl-name">{s.t}</div>{enc&&<span className="sl-enc">ENCORE</span>}</li>];
      })}
    </ul>
  );
}

function StadiumMap({ highlight, seat }) {
  const RED="#e8112d", S1="#2a1010", S2="#3a1515", AR="#1a2a1a", ST="#c9a84c";
  const hl = id => highlight===id ? RED : undefined;
  const PX = {W1F:65,W2F:39,E1F:255,E2F:281,N1F:160,N2F:160,S1F:160,S2F:160,arena:160};
  const PY = {W1F:148,W2F:148,E1F:148,E2F:148,N1F:56,N2F:31,S1F:240,S2F:265,arena:148};
  const LB = [
    {x:160,y:14,lbl:"N 2F",id:"N2F"},{x:160,y:38,lbl:"N 1F",id:"N1F"},
    {x:160,y:284,lbl:"S 2F",id:"S2F"},{x:160,y:260,lbl:"S 1F",id:"S1F"},
    {x:19,y:150,lbl:"W",id:"W2F",rot:-90},{x:38,y:150,lbl:"W",id:"W1F",rot:-90},
    {x:301,y:150,lbl:"E",id:"E2F",rot:90},{x:282,y:150,lbl:"E",id:"E1F",rot:90},
  ];
  return (
    <div className="seat-map">
      <svg viewBox="0 0 320 300" width="100%" style={{display:"block", maxWidth:"240px", margin:"0 auto"}}>
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
        {LB.map(s => (
          <text key={s.id} x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontFamily="sans-serif"
            fill={highlight===s.id?"#fff":"rgba(255,255,255,0.4)"} fontWeight={highlight===s.id?"bold":"normal"}
            transform={s.rot?`rotate(${s.rot},${s.x},${s.y})`:undefined}>{s.lbl}</text>
        ))}
        <text x="160" y="130" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif">ARENA</text>
        {highlight && PX[highlight] && <>
          <circle cx={PX[highlight]} cy={PY[highlight]} r="7" fill={RED} opacity=".9"/>
          <text x={PX[highlight]} y={PY[highlight]} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#fff" fontWeight="bold" fontFamily="sans-serif">★</text>
        </>}
      </svg>
      <div className="seat-info">{seat ? <strong>{seat}</strong> : <span>座席情報は未設定です</span>}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  モーダル群（全て同じセクション順で統一）
//  順番：①セットリスト ②座席 ③写真 ④思い出メモ ⑤Tips
// ─────────────────────────────────────────────

// ── 公演詳細モーダル ──
function LiveModal({ live:liveProp, tour, onClose, onUpdate }) {
  const isFeatured = !!tour.featured;
  const [editing, setEditing] = useState(false);
  const [live, setLive] = useState(liveProp);

  const handleUpdate = (id, changes) => {
    const merged = { ...live, ...changes };
    setLive(merged);       // モーダル内の表示を即時更新
    onUpdate(id, changes); // 親(App)のallLivesとFirestoreに保存
  };

  if (editing) return (
    <EditForm
      live={live}
      onClose={() => setEditing(false)}
      onGoHome={onClose}
      onUpdate={handleUpdate}
    />
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>ホームに戻る</button>
            <div className="nav-right">
              <button className="edit-btn" onClick={() => setEditing(true)}>✏️ 編集</button>
            </div>
          </div>
        </div>
        <div className={"mhero "+(isFeatured?"red":"dark")}>
          <div>
            <div className="mdate">{live.dateLabel||live.date}</div>
            <div className="mtitle">{tour.name}</div>
            {tour.sub && <div className="msub">{tour.sub}</div>}
            <div className="mvenue">📍 {live.venue}</div>
            {live.open && <div className="mtime-row"><div className="mtime">開場 <b>{live.open}</b></div><div className="mtime">開演 <b>{live.start}</b></div></div>}
          </div>
        </div>
        {/* ①セットリスト */}
        <div className="msec">
          <div className="msec-ttl">セットリスト<span style={{fontSize:10,color:"rgba(28,10,12,0.3)",fontWeight:"normal",marginLeft:"auto",paddingLeft:8}}>全{live.songs.length}曲</span></div>
          <Setlist songs={live.songs}/>
        </div>
        {/* ②座席 */}
        <div className="msec">
          <div className="msec-ttl">座席位置</div>
          {isFeatured
            ? <StadiumMap highlight={live.highlight} seat={live.seat}/>
            : <div style={{background:"#1c0a0c",borderRadius:12,padding:14,textAlign:"center",color:"rgba(255,255,255,.28)",fontSize:12}}>{live.seat||"座席情報は未設定です"}</div>
          }
        </div>
        {/* ③写真 */}
        <div className="msec">
          <div className="msec-ttl">フォト</div>
          <div className="photos">
            {(live.photos||[]).map((p,i) => (
              <div key={i} className="photo">
                {(p.startsWith("data:")||p.startsWith("http")) ? <img src={p} alt=""/> : p}
              </div>
            ))}
          </div>
        </div>
        {/* ④思い出メモ */}
        <div className="msec">
          <div className="msec-ttl">思い出メモ</div>
          <MemorySection memory={live.memory}/>
        </div>
        {/* ⑤Tips */}
        <div className="msec">
          <div className="msec-ttl">Live を楽しむための Tips</div>
          <TipsSection tips={live.tips}/>
        </div>
      </div>
    </div>
  );
}

// ── 編集フォーム ──
// 保存してホームに戻るボタン（押下フィードバック付き）
function SaveHomeButton({ doSave, onGoHome }) {
  const [state, setState] = useState("idle"); // idle | saving | done

  const handleClick = () => {
    if (state !== "idle") return;
    setState("saving");
    doSave();
    setTimeout(() => {
      setState("done");
      setTimeout(() => onGoHome(), 600);
    }, 400);
  };

  const label = state === "saving" ? "保存中…"
              : state === "done"   ? "✓ 保存しました！"
              : "🏠 保存してホームに戻る";

  return (
    <button
      className={"save-btn" + (state !== "idle" ? " saving" : "")}
      style={{marginBottom:24, ...(state === "done" ? {background:"linear-gradient(135deg,#2a8a3e,#1a6b2e)"} : {})}}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

function EditForm({ live, onClose, onGoHome, onUpdate }) {
  const [seat, setSeat]         = useState(live.seat||"");
  const [setlist, setSetlist]   = useState((live.songs||[]).map((s,i) => `${i+1}. ${s.t}${s.e?" [アンコール]":""}`).join("\n"));
  const [mem, setMem]           = useState(live.memory||{before:"",after:"",highlight:"",other:""});
  const [tipsText, setTipsText] = useState(tipsToText(live.tips));
  const { photos, handleAdd, handleRemove, uploading } = usePhotoUpload(live.photos||[], live.id);

  const doSave = () => {
    const songs = setlist.split("\n").map(l=>l.trim()).filter(Boolean).map((line,i) => {
      const e = /アンコール/i.test(line);
      const t = line.replace(/^\d+\.\s*/,"").replace(/\s*[\[［]アンコール[\]］]/i,"");
      return { n:i+1, t, ...(e?{e:true}:{}) };
    });
    onUpdate(live.id, { seat, songs, photos, memory:mem, tips:parseTips(tipsText) });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>詳細に戻る</button>
          </div>
        </div>
        <div className="mhero dark">
          <div className="mdate">EDIT</div>
          <div className="mtitle">{live.dateLabel||live.date}</div>
          <div className="mvenue">📍 {live.venue}</div>
        </div>
        {/* ①セットリスト */}
        <div className="fdivider">セットリスト</div>
        <div className="fsec">
          <textarea className="finp" rows={5} placeholder={"1. Mirotic\n2. Rising Sun\n3. Before U Go  [アンコール]"} style={{resize:"none",lineHeight:1.8}} value={setlist} onChange={e=>setSetlist(e.target.value)}/>
        </div>
        {/* ②座席 */}
        <div className="fdivider">座席</div>
        <div className="fsec">
          <label className="flbl">座席情報</label>
          <input className="finp" placeholder="例: W1F / 入口W13 / 列8 / 座席245" value={seat} onChange={e=>setSeat(e.target.value)}/>
        </div>
        {/* ③写真 */}
        <div className="fdivider">写真</div>
        <PhotoEditor photos={photos} onAdd={handleAdd} onRemove={handleRemove} uploading={uploading}/>
        {/* ④思い出メモ */}
        <div className="fdivider">思い出メモ</div>
        <MemInputs mem={mem} setMem={setMem}/>
        {/* ⑤Tips */}
        <div className="fdivider">Live を楽しむための Tips</div>
        <TipsInput value={tipsText} onChange={e=>setTipsText(e.target.value)}/>
        <SaveHomeButton doSave={doSave} onGoHome={onGoHome}/>
      </div>
    </div>
  );
}

// ── 新規追加フォーム ──
// ─────────────────────────────────────────────
//  ツアー追加関連
// ─────────────────────────────────────────────

const TOUR_COLOR_PRESETS = [
  { label:"レッド",    value:"#c0152a" },
  { label:"ネイビー",  value:"#1a3a6b" },
  { label:"パープル",  value:"#5a1a7a" },
  { label:"ブラック",  value:"#1a1a1a" },
  { label:"ゴールド",  value:"#8a6a10" },
  { label:"ティール",  value:"#0a5a5a" },
];

// ─────────────────────────────────────────────
//  ビジュアルパターン定義（10種）
// ─────────────────────────────────────────────

const VIS_PATTERNS = [
  {
    keys: ["波","海","ocean","wave","うねり","水面"],
    label: "波", emoji: "🌊",
    render: (color, name) => {
      const bg = colorToBg(color);
      const c = lighten(color, 0.6);
      const paths = [0,1,2].map(i => {
        const y = 55 + i*16;
        const amp = 12 - i*3;
        return `<path d="M0 ${y} Q50 ${y-amp} 100 ${y} Q150 ${y+amp} 200 ${y} Q250 ${y-amp} 300 ${y} Q350 ${y+amp} 400 ${y}" fill="none" stroke="${c}" stroke-width="${2.5-i*0.6}" opacity="${0.5-i*0.1}"/>`;
      }).join('');
      return baseSvg(bg, paths + centerText(name, '#fff'));
    }
  },
  {
    keys: ["星","スター","star","night","夜空","銀河","galaxy"],
    label: "星空", emoji: "✨",
    render: (color, name) => {
      const bg = colorToBg(color);
      const stars = Array.from({length:28}, (_,i) => {
        const x = (i*137.5)%400; const y = (i*97.3)%90;
        const r = i%5===0?2.5:i%3===0?1.8:1.2;
        const op = 0.4+((i*31)%60)/100;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#fff" opacity="${op.toFixed(2)}"/>`;
      }).join('');
      const shine = `<circle cx="320" cy="22" r="14" fill="${lighten(color,0.8)}" opacity="0.18"/><circle cx="320" cy="22" r="6" fill="#fff" opacity="0.35"/>`;
      return baseSvg(bg, stars + shine + centerText(name, '#fff'));
    }
  },
  {
    keys: ["渦","spiral","螺旋","swirl","回転","vortex"],
    label: "渦", emoji: "🌀",
    render: (color, name) => {
      const bg = colorToBg(color);
      const c = lighten(color, 0.7);
      const dots = Array.from({length:36}, (_,i) => {
        const angle = (i/36)*Math.PI*2*3;
        const dist = 8 + i*1.6;
        const cx = 200 + Math.cos(angle)*dist;
        const cy = 55 + Math.sin(angle)*dist*0.55;
        const r = 1.2 + (1-i/36)*2;
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${c}" opacity="${(0.2+i/36*0.7).toFixed(2)}"/>`;
      }).join('');
      return baseSvg(bg, dots + centerText(name, '#fff'));
    }
  },
  {
    keys: ["雨","rain","しずく","drop","rainfall"],
    label: "雨", emoji: "🌧",
    render: (color, name) => {
      const bg = colorToBg(color);
      const c = lighten(color, 0.7);
      const lines = Array.from({length:22}, (_,i) => {
        const x = (i*19+5)%410; const y = (i*31)%60;
        return `<line x1="${x}" y1="${y}" x2="${x-6}" y2="${y+22}" stroke="${c}" stroke-width="1.2" opacity="${0.25+((i*7)%40)/100}"/>`;
      }).join('');
      return baseSvg(bg, lines + centerText(name, '#fff'));
    }
  },
  {
    keys: ["炎","fire","flame","情熱","burn","熱"],
    label: "炎", emoji: "🔥",
    render: (color, name) => {
      const bg = colorToBg(color);
      const flames = Array.from({length:10}, (_,i) => {
        const x = 30 + i*38; const h = 20 + (i%3)*18;
        const w = 10 + (i%4)*5;
        return `<path d="M${x} 110 Q${x-w} ${110-h*0.6} ${x} ${110-h} Q${x+w} ${110-h*0.6} ${x} 110" fill="${lighten(color,0.5)}" opacity="${0.15+((i*13)%30)/100}"/>`;
      }).join('');
      return baseSvg(bg, flames + centerText(name, '#fff'));
    }
  },
  {
    keys: ["格子","grid","幾何学","geometric","lattice","mesh"],
    label: "格子", emoji: "⬛",
    render: (color, name) => {
      const bg = colorToBg(color);
      const c = lighten(color, 0.5);
      const hlines = Array.from({length:6}, (_,i) =>
        `<line x1="0" y1="${i*22}" x2="400" y2="${i*22}" stroke="${c}" stroke-width="0.8" opacity="0.25"/>`).join('');
      const vlines = Array.from({length:14}, (_,i) =>
        `<line x1="${i*30}" y1="0" x2="${i*30}" y2="110" stroke="${c}" stroke-width="0.8" opacity="0.25"/>`).join('');
      const dots = Array.from({length:42}, (_,i) => {
        const x = (i%14)*30; const y = Math.floor(i/14)*22;
        return `<circle cx="${x}" cy="${y}" r="1.5" fill="${c}" opacity="0.4"/>`;
      }).join('');
      return baseSvg(bg, hlines+vlines+dots + centerText(name, '#fff'));
    }
  },
  {
    keys: ["爆発","burst","放射","radiation","explosion","エネルギー"],
    label: "爆発", emoji: "💥",
    render: (color, name) => {
      const bg = colorToBg(color);
      const c = lighten(color, 0.7);
      const rays = Array.from({length:18}, (_,i) => {
        const angle = (i/18)*Math.PI*2;
        const x1 = 200 + Math.cos(angle)*15;
        const y1 = 55 + Math.sin(angle)*10;
        const x2 = 200 + Math.cos(angle)*(60+(i%3)*25);
        const y2 = 55 + Math.sin(angle)*(40+(i%3)*15);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="${1.5-(i%3)*0.3}" opacity="${0.25+((i*11)%40)/100}"/>`;
      }).join('');
      const core = `<circle cx="200" cy="55" r="8" fill="${c}" opacity="0.35"/><circle cx="200" cy="55" r="3" fill="#fff" opacity="0.6"/>`;
      return baseSvg(bg, rays + core + centerText(name, '#fff'));
    }
  },
  {
    keys: ["粒子","particle","浮遊","float","bubble","泡"],
    label: "粒子", emoji: "🫧",
    render: (color, name) => {
      const bg = colorToBg(color);
      const c = lighten(color, 0.75);
      const particles = Array.from({length:32}, (_,i) => {
        const x = (i*127.3)%390+5; const y = (i*83.7)%100+5;
        const r = 1+(i%5)*0.8;
        const op = 0.15+((i*17)%55)/100;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${c}" opacity="${op.toFixed(2)}"/>`;
      }).join('');
      return baseSvg(bg, particles + centerText(name, '#fff'));
    }
  },
  {
    keys: ["桜","花","bloom","flower","petal","spring","春"],
    label: "桜", emoji: "🌸",
    render: (color, name) => {
      const bg = colorToBg(color);
      const petals = Array.from({length:16}, (_,i) => {
        const x = (i*113.7+20)%380; const y = (i*67.3+10)%90;
        const angle = (i*47)%360;
        const size = 4+(i%4)*2;
        return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${size}" ry="${(size*0.6).toFixed(1)}" fill="${lighten(color,0.65)}" opacity="${(0.2+((i*13)%40)/100).toFixed(2)}" transform="rotate(${angle} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }).join('');
      return baseSvg(bg, petals + centerText(name, '#fff'));
    }
  },
  {
    keys: ["光","光線","beam","ray","shine","輝き","glow"],
    label: "光線", emoji: "✴️",
    render: (color, name) => {
      const bg = colorToBg(color);
      const beams = Array.from({length:5}, (_,i) => {
        const x = 60 + i*70;
        return `<line x1="${x}" y1="0" x2="${x+40}" y2="110" stroke="${lighten(color,0.8)}" stroke-width="${6-i*0.5}" opacity="${0.08+i*0.02}"/>`;
      }).join('');
      const glow = `<ellipse cx="200" cy="0" rx="180" ry="40" fill="${lighten(color,0.6)}" opacity="0.12"/>`;
      return baseSvg(bg, glow + beams + centerText(name, '#fff'));
    }
  },
];

// ユーティリティ
function colorToBg(color) {
  return `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${darken(color,0.4)}"/><stop offset="100%" stop-color="${darken(color,0.15)}"/></linearGradient></defs><rect width="400" height="110" fill="url(#bg)"/>`;
}
function darken(hex, amt) {
  const r = Math.max(0, parseInt(hex.slice(1,3),16) - Math.round(amt*160));
  const g = Math.max(0, parseInt(hex.slice(3,5),16) - Math.round(amt*160));
  const b = Math.max(0, parseInt(hex.slice(5,7),16) - Math.round(amt*160));
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function lighten(hex, amt) {
  const r = Math.min(255, parseInt(hex.slice(1,3),16) + Math.round(amt*220));
  const g = Math.min(255, parseInt(hex.slice(3,5),16) + Math.round(amt*220));
  const b = Math.min(255, parseInt(hex.slice(5,7),16) + Math.round(amt*220));
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function centerText(name, color) {
  const display = name || "NEW TOUR";
  const fontSize = display.length > 20 ? 16 : display.length > 12 ? 20 : 26;
  return `<text x="200" y="62" text-anchor="middle" dominant-baseline="middle" font-family="Cormorant Garamond,serif" font-size="${fontSize}" font-style="italic" fill="${color}" opacity="0.92" letter-spacing="3">${display}</text>`;
}
function baseSvg(bg, content) {
  return `<svg viewBox="0 0 400 110" xmlns="http://www.w3.org/2000/svg">${bg}${content}</svg>`;
}

// キーワード解析して即時SVG生成（API不要）
function generateTourVisualSync(tourName, color, userPrompt) {
  const text = (userPrompt || tourName || "").toLowerCase();
  // キーワードマッチング（複数マッチは最初を優先）
  const matched = VIS_PATTERNS.find(p => p.keys.some(k => text.includes(k)));
  const pattern = matched || VIS_PATTERNS[7]; // デフォルト：粒子
  return pattern.render(color, tourName);
}

function TourVisPreviewDialog({ tourName, color, svgCode, onRetry, onConfirm }) {
  return (
    <div className="preview-overlay" onClick={e => e.stopPropagation()}>
      <div className="preview-dialog">
        <div className="preview-vis-wrap">
          {svgCode
            ? <div dangerouslySetInnerHTML={{__html:svgCode}} style={{width:"100%",height:"100%"}}/>
            : <div className="preview-loading"><div style={{color:"rgba(255,255,255,.4)",fontSize:12}}>生成中…</div></div>
          }
        </div>
        <div className="preview-body">
          <div className="preview-ttl">{tourName||"ツアー名未設定"}</div>
          <div className="preview-btns">
            <button className="preview-retry" onClick={onRetry}>🔄 別パターン</button>
            <button className="preview-confirm" onClick={onConfirm}>✓ これで追加する</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddTourForm({ onClose, onSaveTour }) {
  const [tourName,   setTourName]   = useState("");
  const [tourSub,    setTourSub]    = useState("");
  const [color,      setColor]      = useState("#c0152a");
  const [userPrompt, setUserPrompt] = useState("");
  const [preview,    setPreview]    = useState(false);
  const [svgCode,    setSvgCode]    = useState(null);
  const [state,      setState]      = useState("idle");

  const handleGenerate = () => {
    const svg = generateTourVisualSync(tourName, color, userPrompt);
    setSvgCode(svg);
    setPreview(true);
  };

  // 別パターン：マッチしなかった他のパターンをランダムに試す
  const handleRetry = () => {
    const text = (userPrompt || tourName || "").toLowerCase();
    const matched = VIS_PATTERNS.findIndex(p => p.keys.some(k => text.includes(k)));
    const others = VIS_PATTERNS.filter((_, i) => i !== matched);
    const pick = others[Math.floor(Math.random() * others.length)];
    setSvgCode(pick.render(color, tourName));
  };

  const handleConfirm = () => {
    if (state !== "idle") return;
    setState("saving");
    onSaveTour({
      tourId:    `tour-user-${Date.now()}`,
      tourName:  tourName.trim() || "新しいツアー",
      tourSub:   tourSub.trim() || null,
      tourColor: color,
      featured:  false,
      svgCode:   svgCode,
    });
    setTimeout(() => { setState("done"); setTimeout(onClose, 600); }, 400);
  };

  return (
    <>
      {preview && svgCode && (
        <TourVisPreviewDialog
          tourName={tourName} color={color} svgCode={svgCode}
          onRetry={handleRetry}
          onConfirm={handleConfirm}
        />
      )}
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-nav">
            <div className="modal-handle"/>
            <div className="modal-nav-btns">
              <button className="nav-back" onClick={onClose}>ホームに戻る</button>
            </div>
          </div>
          <div className="mhero dark"><div className="mdate">NEW TOUR</div><div className="mtitle">ツアーを追加する</div></div>

          <div className="fsec">
            <label className="flbl">ツアー名</label>
            <input className="finp" placeholder="例: 東方神起 LIVE TOUR 2027" value={tourName} onChange={e=>setTourName(e.target.value)}/>
          </div>
          <div className="fsec">
            <label className="flbl">サブタイトル（任意）</label>
            <input className="finp" placeholder="例: 〜ANOTHER WORLD〜" value={tourSub} onChange={e=>setTourSub(e.target.value)}/>
          </div>

          <div className="fdivider">テーマカラー</div>
          <div className="fsec">
            <div className="color-presets">
              {TOUR_COLOR_PRESETS.map(p => (
                <div key={p.value} className={"color-preset"+(color===p.value?" selected":"")}
                  style={{background:p.value}} title={p.label}
                  onClick={() => setColor(p.value)}/>
              ))}
            </div>
          </div>

          <div className="fdivider">ビジュアルイメージ</div>
          <div className="fsec">
            <label className="flbl" style={{marginBottom:8}}>
              イメージを自由に記述してください
            </label>
            <div style={{fontSize:11,color:"rgba(28,10,12,.38)",marginBottom:10,lineHeight:1.7}}>
              波・星・渦・雨・炎・格子・爆発・粒子・桜・光… などのキーワードを含めると、そのパターンが適用されます。複数のキーワードも使えます。
            </div>
            <textarea className="finp" rows={3} style={{resize:"none",lineHeight:1.8}}
              placeholder={"例：夜の海に波が広がるような幻想的な雰囲気\n例：無数の星が輝く銀河をイメージ\n例：爆発するエネルギーと光の放射"}
              value={userPrompt} onChange={e=>setUserPrompt(e.target.value)}/>
          </div>

          <div style={{padding:"0 20px 8px",fontSize:11,color:"rgba(28,10,12,.35)",lineHeight:1.7}}>
            💡 記述なしでもツアー名からパターンを自動選択します
          </div>

          <button className="save-btn" style={{marginBottom:24}} onClick={handleGenerate}>
            ✨ プレビューを生成する
          </button>
        </div>
      </div>
    </>
  );
}

// 2択メニュー
function AddMenu({ onClose, onSelectLive, onSelectTour }) {
  return (
    <div className="add-menu-overlay">
      <div className="add-menu-bg" onClick={onClose}/>
      <div className="add-menu">
        <div className="add-menu-handle"/>
        <div className="add-menu-ttl">追加する内容を選択</div>
        <button className="add-menu-btn" onClick={onSelectLive}>
          <span className="add-menu-icon">🎵</span>
          <div>
            <div className="add-menu-label">ライブを追加</div>
            <div className="add-menu-desc">既存ツアーにライブ公演を追加します</div>
          </div>
        </button>
        <button className="add-menu-btn" onClick={onSelectTour}>
          <span className="add-menu-icon">📋</span>
          <div>
            <div className="add-menu-label">ツアーを追加</div>
            <div className="add-menu-desc">新しいツアーを作成してライブを管理します</div>
          </div>
        </button>
      </div>
    </div>
  );
}

// 新規追加用・保存してホームに戻るボタン（フィードバック付き）
function AddSaveButton({ buildLive, onSaveAndClose }) {
  const [state, setState] = useState("idle");

  const handleClick = () => {
    if (state !== "idle") return;
    const l = buildLive();
    setState("saving");
    onSaveAndClose(null, l);
    setTimeout(() => setState("done"), 400);
  };

  const label = state === "saving" ? "保存中…"
              : state === "done"   ? "✓ 保存しました！"
              : "🏠 保存してホームに戻る";

  return (
    <button
      className={"save-btn" + (state !== "idle" ? " saving" : "")}
      style={{marginBottom:24, ...(state === "done" ? {background:"linear-gradient(135deg,#2a8a3e,#1a6b2e)"} : {})}}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

function AddForm({ onClose, onSaveAndClose, allTours }) {
  const [step,      setStep]      = useState("select"); // "select" | "input"
  const [selTour,   setSelTour]   = useState(null);     // 選択されたツアーentry
  const [date,      setDate]      = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [venue,     setVenue]     = useState("");
  const [setlist,   setSetlist]   = useState("");
  const [block,     setBlock]     = useState("");
  const [seatNo,    setSeatNo]    = useState("");
  const [mem,       setMem]       = useState({before:"",after:"",highlight:"",other:""});
  const [tipsText,  setTipsText]  = useState("");
  const { photos, handleAdd, handleRemove, uploading } = usePhotoUpload([], `new-${Date.now()}`);

  const buildLive = () => {
    const songs = setlist.split("\n").map(l=>l.trim()).filter(Boolean).map((line,i) => {
      const e = /アンコール/i.test(line);
      const t = line.replace(/^\d+\.\s*/,"").replace(/\s*[\[［]アンコール[\]］]/i,"");
      return { n:i+1, t, ...(e?{e:true}:{}) };
    });
    const dateParts = date ? date.split("-") : ["","",""];
    const [y,m,d] = dateParts;
    const dateStr = date ? `${y}.${m}.${d}` : "日付未設定";
    const dateLabelStr = date ? `${y}年${parseInt(m)}月${parseInt(d)}日` : "日付未設定";
    return {
      id:`user-${Date.now()}`, date:dateStr, dateLabel:dateLabelStr,
      start:startTime, venue:venue.trim()||"会場未設定",
      seat:[block,seatNo].filter(Boolean).join(" / 座席")||"未設定",
      highlight:null, tag:(venue.trim()||"未設定").slice(0,3), emoji:"🎤",
      songs, photos,
      memory:{ before:mem.before.trim(), after:mem.after.trim(), highlight:mem.highlight.trim(), other:mem.other.trim() },
      tips:parseTips(tipsText),
    };
  };

  // ── ステップ1：ツアー選択 ──
  if (step === "select") return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={onClose}>ホームに戻る</button>
          </div>
        </div>
        <div className="mhero red"><div className="mdate">STEP 1 / 2</div><div className="mtitle">追加先のツアーを選択</div></div>
        <div style={{padding:"16px 18px 32px",display:"flex",flexDirection:"column",gap:10}}>
          {allTours.map(tour => (
            <button key={tour.id}
              style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--offwhite)",border:`1.5px solid ${tour.color}44`,borderRadius:12,cursor:"pointer",textAlign:"left",width:"100%"}}
              onClick={() => { setSelTour(tour); setStep("input"); }}>
              <div style={{width:10,height:10,borderRadius:"50%",background:tour.color,flexShrink:0}}/>
              <div>
                <div style={{fontFamily:"Noto Serif JP,serif",fontSize:14,fontWeight:600,color:"var(--ink)"}}>{tour.name}</div>
                <div style={{fontSize:11,color:"rgba(28,10,12,.4)",marginTop:2}}>{tour.lives.length}公演</div>
              </div>
              <div style={{marginLeft:"auto",color:"rgba(28,10,12,.25)",fontSize:18}}>›</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── ステップ2：ライブ情報入力 ──
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-nav">
          <div className="modal-handle"/>
          <div className="modal-nav-btns">
            <button className="nav-back" onClick={() => setStep("select")}>ツアー選択に戻る</button>
          </div>
        </div>
        <div className="mhero red">
          <div className="mdate">STEP 2 / 2 · {selTour?.name}</div>
          <div className="mtitle">ライブを記録する</div>
        </div>
        <div className="fsec">
          <div className="frow">
            <div className="fgrp"><label className="flbl">開催日</label><input className="finp" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
            <div className="fgrp"><label className="flbl">開演時刻</label><input className="finp" type="time" value={startTime} onChange={e=>setStartTime(e.target.value)}/></div>
          </div>
        </div>
        <div className="fsec">
          <label className="flbl">会場</label>
          <input className="finp" placeholder="例: 東京ドーム" value={venue} onChange={e=>setVenue(e.target.value)}/>
        </div>
        <div className="fdivider">セットリスト</div>
        <div className="fsec">
          <textarea className="finp" rows={5} placeholder={"1. Mirotic\n2. Rising Sun\n3. Before U Go  [アンコール]"} style={{resize:"none",lineHeight:1.8}} value={setlist} onChange={e=>setSetlist(e.target.value)}/>
        </div>
        <div className="fdivider">座席</div>
        <div className="fsec">
          <div className="frow">
            <div className="fgrp"><label className="flbl">ブロック / 列</label><input className="finp" placeholder="C列 12番" value={block} onChange={e=>setBlock(e.target.value)}/></div>
            <div className="fgrp"><label className="flbl">座席番号</label><input className="finp" placeholder="34" value={seatNo} onChange={e=>setSeatNo(e.target.value)}/></div>
          </div>
        </div>
        <div className="fdivider">写真</div>
        <PhotoEditor photos={photos} onAdd={handleAdd} onRemove={handleRemove} uploading={uploading}/>
        <div className="fdivider">思い出メモ</div>
        <MemInputs mem={mem} setMem={setMem}/>
        <div className="fdivider">Live を楽しむための Tips</div>
        <TipsInput value={tipsText} onChange={e=>setTipsText(e.target.value)}/>
        <AddSaveButton
          buildLive={buildLive}
          onSaveAndClose={(_, live) => onSaveAndClose(selTour, live)}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  メインアプリ
// ─────────────────────────────────────────────

export default function App() {
  const [selected,    setSelected]    = useState(null);
  const [showMenu,    setShowMenu]    = useState(false);
  const [showAdd,     setShowAdd]     = useState(false);
  const [showAddTour, setShowAddTour] = useState(false);
  const [allLives,    setAllLives]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // 起動時にFirestoreからデータを取得
  useEffect(() => {
    (async () => {
      try {
        const lives = await loadFromFirestore();
        if (lives) {
          setAllLives(lives);
        } else {
          // 初回：初期データをFirestoreに書き込む
          const initial = buildInitialAllLives();
          await saveToFirestore(initial);
          setAllLives(initial);
        }
      } catch (e) {
        setError("データの読み込みに失敗しました。接続を確認してください。");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // allLivesからツアーカード用の構造を組み立てる
  const allTours = useMemo(() => {
    const map = new Map();
    allLives.forEach(entry => {
      if (!map.has(entry.tourId)) {
        map.set(entry.tourId, {
          id:       entry.tourId,
          name:     entry.tourName,
          sub:      entry.tourSub,
          color:    entry.tourColor,
          featured: entry.featured,
          svgCode:  entry.svgCode || null,
          lives:    [],
        });
      }
      map.get(entry.tourId).lives.push(entry.live);
    });
    return Array.from(map.values());
  }, [allLives]);

  const totalLives = allTours.reduce((s,t) => s + t.lives.length, 0);
  const totalSongs = allTours.reduce((s,t) => s + t.lives.reduce((ss,l) => ss + l.songs.length, 0), 0);

  // Firestoreに保存してstateも更新
  const persist = async (updated) => {
    setAllLives(updated);
    try { await saveToFirestore(updated); } catch {}
  };

  // 新規ライブ追加（selTourはallToursのtourオブジェクト）
  const handleSave = (selTour, newLive) => {
    const entry = {
      tourId:    selTour.id,
      tourName:  selTour.name,
      tourSub:   selTour.sub   || null,
      tourColor: selTour.color,
      featured:  selTour.featured || false,
      svgCode:   selTour.svgCode  || null,
      live:      newLive,
    };
    persist([...allLives, entry]);
  };

  // ライブ削除
  const handleLiveDelete = (liveId) => {
    const updated = allLives.filter(entry => entry.live.id !== liveId);
    persist(updated);
  };

  // ツアー削除（ツアー内の全ライブも削除）
  const handleTourDelete = (tourId) => {
    const updated = allLives.filter(entry => entry.tourId !== tourId);
    persist(updated);
  };

  // ツアー新規追加（ライブ0件で作成）
  const handleTourSave = (tourMeta) => {
    // ダミーライブ1件を入れてツアーを成立させる（ライブ0件だとallToursに表示されない）
    const dummyLive = {
      id: `live-placeholder-${Date.now()}`,
      date: "未設定", dateLabel: "未設定",
      open: "", start: "", venue: "未設定",
      seat: "未設定", highlight: null,
      tag: "未", emoji: "🎤",
      songs: [], photos: [],
      memory: { before:"", after:"", highlight:"", other:"" },
      tips: [],
    };
    const entry = { ...tourMeta, live: dummyLive };
    persist([...allLives, entry]);
    setShowAddTour(false);
  };
  const handleUpdate = (liveId, changes) => {
    const updated = allLives.map(entry =>
      entry.live.id === liveId
        ? { ...entry, live: { ...entry.live, ...changes } }
        : entry
    );
    persist(updated);
    if (selected && selected.live.id === liveId) {
      setSelected(prev => ({ ...prev, live: { ...prev.live, ...changes } }));
    }
  };

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:16}}>
        <div style={{color:"var(--red)",fontSize:28}}>♪</div>
        <div style={{fontFamily:"Noto Serif JP,serif",fontSize:14,color:"rgba(28,10,12,.5)",letterSpacing:".12em"}}>読み込み中…</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{CSS}</style>
      <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:12,padding:24}}>
        <div style={{color:"var(--red)",fontSize:14,textAlign:"center",lineHeight:1.8}}>{error}</div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-vis">
            <div className="hdr-aktf"><span>Always Keep the Faith</span></div>
            <div className="hdr-tdots">
              {T_DOTS.map(({key,lit,color}) => (
                <div key={key} className="hdr-dot" style={{background:lit?color:"rgba(255,255,255,.04)",opacity:lit?.8:1}}/>
              ))}
            </div>
            <Silhouette/>
            <div className="hdr-sil"><div className="hdr-pitch"/></div>
          </div>
          <div className="hdr-body">
            <div className="hdr-sub">東方神起 - TVXQ! LIVE ARCHIVE</div>
            <div className="hdr-row">
              <div className="stats">
                <div><div className="stat-n">{totalLives}</div><div className="stat-l">LIVES</div></div>
                <div><div className="stat-n">{totalSongs}</div><div className="stat-l">SONGS</div></div>
                <div><div className="stat-n">{allTours.length}</div><div className="stat-l">TOURS</div></div>
              </div>
              <button className="add-btn" onClick={() => { setShowMenu(true); setSelected(null); }}>＋</button>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="sec-lbl">ツアー</div>
          {allTours.map(tour => (
            <TourCard key={tour.id} tour={tour}
              onLiveSelect={(live, tour) => { setSelected({ live, tour }); setShowMenu(false); }}
              onLiveDelete={handleLiveDelete}
              onTourDelete={handleTourDelete}
            />
          ))}
        </div>
        {selected && (
          <LiveModal
            live={selected.live}
            tour={selected.tour}
            onClose={() => setSelected(null)}
            onUpdate={handleUpdate}
          />
        )}
        {showMenu && (
          <AddMenu
            onClose={() => setShowMenu(false)}
            onSelectLive={() => { setShowMenu(false); setShowAdd(true); }}
            onSelectTour={() => { setShowMenu(false); setShowAddTour(true); }}
          />
        )}
        {showAdd && (
          <AddForm
            onClose={() => setShowAdd(false)}
            onSaveAndClose={(selTour, newLive) => { handleSave(selTour, newLive); setShowAdd(false); }}
            allTours={allTours}
          />
        )}
        {showAddTour && (
          <AddTourForm
            onClose={() => setShowAddTour(false)}
            onSaveTour={handleTourSave}
          />
        )}
      </div>
    </>
  );
}

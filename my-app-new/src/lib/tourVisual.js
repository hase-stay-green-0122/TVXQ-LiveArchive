// ツアーカードのビジュアル（SVG）生成

// ── 新規追加フォーム ──
// ─────────────────────────────────────────────
//  ツアー追加関連
// ─────────────────────────────────────────────

export const TOUR_COLOR_PRESETS = [
  { label:"クリムゾン",  value:"#c0152a" },
  { label:"スカーレット", value:"#e8112d" },
  { label:"バーガンディ", value:"#7a0d1c" },
  { label:"コーラル",    value:"#d94f3a" },
  { label:"ネイビー",    value:"#1a3a6b" },
  { label:"ロイヤルブルー",value:"#1a4aaa" },
  { label:"スカイ",      value:"#1a6aaa" },
  { label:"ティール",    value:"#0a5a5a" },
  { label:"エメラルド",  value:"#0a6a3a" },
  { label:"フォレスト",  value:"#1a4a1a" },
  { label:"パープル",    value:"#5a1a7a" },
  { label:"バイオレット", value:"#3a1a8a" },
  { label:"ラベンダー",  value:"#6a3a9a" },
  { label:"ローズ",      value:"#8a1a5a" },
  { label:"マゼンタ",    value:"#9a0a6a" },
  { label:"ゴールド",    value:"#8a6a10" },
  { label:"アンバー",    value:"#8a4a0a" },
  { label:"ブラック",    value:"#1a1a1a" },
  { label:"チャコール",  value:"#2a2a3a" },
  { label:"スレート",    value:"#2a3a4a" },
];

// ─────────────────────────────────────────────
//  ビジュアルパターン定義（30種・ライブ特化）
// ─────────────────────────────────────────────

export const VIS_PATTERNS = [
  // ── ステージ・照明系 ──
  {
    id:"spotlight", label:"スポットライト", emoji:"🔦", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.6);
      const beams=Array.from({length:5},(_,i)=>{const x=60+i*70,w=30+i%2*20,op=(.05+i%3*.02).toFixed(2);return`<polygon points="${x},0 ${x+w},0 ${x+w*2},110 ${x-20},110" fill="${cl}" opacity="${op}"/>`;}).join('');
      const src=`<ellipse cx="200" cy="-5" rx="260" ry="40" fill="${cl}" opacity="0.12"/>`;
      const glow=`<ellipse cx="200" cy="30" rx="160" ry="25" fill="${cl}" opacity="0.07"/>`;
      return baseSvg(c1,c2,src+beams+glow);
    }
  },
  {
    id:"laser", label:"レーザービーム", emoji:"⚡", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.65),c2=darken(color,.3),cl=lighten(color,.7);
      const lines=Array.from({length:10},(_,i)=>{const y1=i%2===0?0:110,y2=i%2===0?110:0,x1=(i*43)%400,x2=(x1+80+i*20)%400,op=(.12+i%4*.04).toFixed(2);return`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${cl}" stroke-width="${.8+i%3*.4}" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="55" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+lines);
    }
  },
  {
    id:"stagefloor", label:"ステージフロア", emoji:"🎭", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.55);
      const floor=`<rect x="0" y="85" width="400" height="25" fill="${cl}" opacity="0.08"/>`;
      const lines=Array.from({length:8},(_,i)=>{const x=i*55,op=(.1+i%3*.04).toFixed(2);return`<line x1="${x}" y1="0" x2="${x+30}" y2="110" stroke="${cl}" stroke-width=".6" opacity="${op}"/>`;}).join('');
      const reflect=Array.from({length:6},(_,i)=>{const x=30+i*60;return`<ellipse cx="${x}" cy="95" rx="${15+i%3*8}" ry="3" fill="${cl}" opacity="0.1"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="85" rx="220" ry="20" fill="${cl}" opacity="0.08"/>`;
      return baseSvg(c1,c2,glow+lines+floor+reflect);
    }
  },
  {
    id:"backlight", label:"バックライト", emoji:"🌅", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.7),c2=darken(color,.35),cl=lighten(color,.65);
      const halo=`<ellipse cx="200" cy="110" rx="180" ry="60" fill="${cl}" opacity="0.18"/>`;
      const rays=Array.from({length:12},(_,i)=>{const a=(i/12)*Math.PI,x=200+Math.cos(a)*180,y=110-Math.sin(a)*100,op=(.06+i%4*.02).toFixed(2);return`<line x1="200" y1="110" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${cl}" stroke-width="${1+i%3*.5}" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="110" rx="80" ry="30" fill="${cl}" opacity="0.2"/>`;
      return baseSvg(c1,c2,rays+halo+glow);
    }
  },
  {
    id:"mirrorball", label:"ミラーボール", emoji:"🪩", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.7);
      const dots=Array.from({length:60},(_,i)=>{const x=(i*137.5+i*i*.1)%398+1,y=(i*83.7+i*2)%105+2,r=i%5===0?2.5:i%3===0?1.5:.8,op=(.15+(i*31%60)/100).toFixed(2);return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#fff" opacity="${op}"/>`;}).join('');
      const ball=`<circle cx="200" cy="18" r="14" fill="${cl}" opacity="0.2"/><circle cx="200" cy="18" r="9" fill="#fff" opacity="0.15"/>`;
      const glow=`<ellipse cx="200" cy="18" rx="40" ry="20" fill="${cl}" opacity="0.08"/>`;
      return baseSvg(c1,c2,glow+dots+ball);
    }
  },
  // ── 音・音楽系 ──
  {
    id:"soundwave", label:"音波", emoji:"〰️", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.6);
      const waves=[0,1,2,3].map(i=>{const y=40+i*18,amp=22-i*4,op=(.6-i*.1).toFixed(2);return`<path d="M0 ${y} C50 ${y-amp} 100 ${y+amp} 150 ${y} S250 ${y-amp} 300 ${y} S400 ${y+amp} 400 ${y}" fill="none" stroke="${cl}" stroke-width="${2.5-i*.4}" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="220" ry="40" fill="${cl}" opacity="0.05"/>`;
      return baseSvg(c1,c2,glow+waves);
    }
  },
  {
    id:"beat", label:"ビート", emoji:"🥁", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.6);
      const bars=Array.from({length:22},(_,i)=>{const x=8+i*18,h=15+(Math.sin(i*.8)*25+Math.sin(i*1.3)*15+25),op=(.35+(i%4)*.1).toFixed(2);return`<rect x="${x}" y="${110-h}" width="10" height="${h}" rx="3" fill="${cl}" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="100" rx="200" ry="20" fill="${cl}" opacity="0.07"/>`;
      return baseSvg(c1,c2,glow+bars);
    }
  },
  {
    id:"echo", label:"エコー", emoji:"📡", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.65);
      const rings=[20,38,56,74,92].map((r,i)=>`<ellipse cx="200" cy="55" rx="${r*2}" ry="${r}" fill="none" stroke="${cl}" stroke-width="${1.5-i*.2}" opacity="${(.45-i*.07).toFixed(2)}"/>`).join('');
      const core=`<circle cx="200" cy="55" r="6" fill="${cl}" opacity="0.5"/><circle cx="200" cy="55" r="2.5" fill="#fff" opacity="0.8"/>`;
      return baseSvg(c1,c2,rings+core);
    }
  },
  {
    id:"record", label:"レコード", emoji:"💿", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.55);
      const grooves=Array.from({length:10},(_,i)=>{const r=22+i*7;return`<circle cx="200" cy="55" r="${r}" fill="none" stroke="${cl}" stroke-width=".6" opacity="${(.18-i*.01).toFixed(2)}"/>`;}).join('');
      const disc=`<circle cx="200" cy="55" r="18" fill="${cl}" opacity="0.12"/><circle cx="200" cy="55" r="6" fill="${cl}" opacity="0.3"/><circle cx="200" cy="55" r="2" fill="#fff" opacity="0.6"/>`;
      const glow=`<ellipse cx="200" cy="55" rx="90" ry="55" fill="${cl}" opacity="0.06"/>`;
      return baseSvg(c1,c2,glow+grooves+disc);
    }
  },
  {
    id:"mic", label:"マイク", emoji:"🎤", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.65);
      const waves=Array.from({length:5},(_,i)=>{const r=20+i*18,op=(.4-i*.06).toFixed(2);return`<path d="M${200-r} 55 Q${200} ${55-r*.4} ${200+r} 55" fill="none" stroke="${cl}" stroke-width="${2-i*.25}" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="45" rx="100" ry="40" fill="${cl}" opacity="0.06"/>`;
      const center=`<circle cx="200" cy="55" r="8" fill="${cl}" opacity="0.3"/><circle cx="200" cy="55" r="3" fill="#fff" opacity="0.6"/>`;
      return baseSvg(c1,c2,glow+waves+center);
    }
  },
  // ── パフォーマンス系 ──
  {
    id:"shout", label:"シャウト", emoji:"📢", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.2),cl=lighten(color,.7);
      const blasts=Array.from({length:16},(_,i)=>{const a=(i/16)*Math.PI*2,len=35+(i%4)*20,x1=200+Math.cos(a)*10,y1=55+Math.sin(a)*7,x2=200+Math.cos(a)*len,y2=55+Math.sin(a)*len*.6,op=(.2+(i%5)*.06).toFixed(2);return`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${cl}" stroke-width="${2.5-i%3*.5}" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      const core=`<circle cx="200" cy="55" r="10" fill="${cl}" opacity="0.2"/><circle cx="200" cy="55" r="4" fill="#fff" opacity="0.7"/>`;
      const glow=`<ellipse cx="200" cy="55" rx="80" ry="50" fill="${cl}" opacity="0.07"/>`;
      return baseSvg(c1,c2,glow+blasts+core);
    }
  },
  {
    id:"jump", label:"ジャンプ", emoji:"🦘", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.65);
      const arcs=Array.from({length:6},(_,i)=>{const x=30+i*68,h=25+i%3*20,w=40+i%2*15,op=(.25+i%4*.07).toFixed(2);return`<path d="M${x} 95 Q${x+w/2} ${95-h} ${x+w} 95" fill="none" stroke="${cl}" stroke-width="${1.8-i%3*.3}" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      const ground=`<line x1="0" y1="97" x2="400" y2="97" stroke="${cl}" stroke-width=".8" opacity="0.15"/>`;
      const glow=`<ellipse cx="200" cy="97" rx="200" ry="15" fill="${cl}" opacity="0.05"/>`;
      return baseSvg(c1,c2,glow+ground+arcs);
    }
  },
  {
    id:"dance", label:"ダンス", emoji:"💃", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.65);
      const ribbons=Array.from({length:4},(_,i)=>{const yOff=20+i*22,amp=18+i*6,op=(.45-i*.06).toFixed(2);const pts=Array.from({length:20},(_,j)=>{const x=j*22,y=yOff+Math.sin(j*.5+i)*amp;return`${x},${y.toFixed(1)}`;}).join(' ');return`<polyline points="${pts}" fill="none" stroke="${cl}" stroke-width="${2.2-i*.3}" opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="50" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+ribbons);
    }
  },
  {
    id:"spin", label:"スピン", emoji:"🌀", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.65);
      const spirals=[1,2,3].map(ring=>{const pts=Array.from({length:60},(_,i)=>{const a=(i/60)*Math.PI*2*ring*1.5,d=5+i*(ring*.85),x=200+Math.cos(a)*d,y=55+Math.sin(a)*d*.55;return`${x.toFixed(1)},${y.toFixed(1)}`;}).join(' ');return`<polyline points="${pts}" fill="none" stroke="${cl}" stroke-width="${1.4-ring*.2}" opacity="${(.5-ring*.1).toFixed(2)}"/>`;}).join('');
      const core=`<circle cx="200" cy="55" r="5" fill="${cl}" opacity="0.4"/><circle cx="200" cy="55" r="2" fill="#fff" opacity="0.7"/>`;
      return baseSvg(c1,c2,spirals+core);
    }
  },
  {
    id:"snap", label:"フィンガースナップ", emoji:"👌", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.7);
      const sparks=Array.from({length:20},(_,i)=>{const x=(i*97.3+30)%360+20,y=(i*67.1)%90+10,a=(i*37)%360,len=4+i%5*3,op=(.2+(i%4)*.08).toFixed(2);return`<line x1="${x}" y1="${y}" x2="${(x+Math.cos(a*Math.PI/180)*len).toFixed(1)}" y2="${(y+Math.sin(a*Math.PI/180)*len).toFixed(1)}" stroke="${cl}" stroke-width="1.2" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="180" ry="50" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+sparks);
    }
  },
  // ── 楽器系 ──
  {
    id:"guitar", label:"ギター弦", emoji:"🎸", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.6);
      const strings=Array.from({length:6},(_,i)=>{const y=20+i*16,amp=8+i*3,op=(.5-i*.04).toFixed(2);return`<path d="M0 ${y} C80 ${y-amp} 160 ${y+amp} 240 ${y} S340 ${y-amp} 400 ${y}" fill="none" stroke="${cl}" stroke-width="${1.8-i*.2}" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="45" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+strings);
    }
  },
  {
    id:"drum", label:"ドラム", emoji:"🥁", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.65);
      const rings=[15,30,48,66,84].map((r,i)=>`<ellipse cx="200" cy="55" rx="${r*2.2}" ry="${r*.7}" fill="none" stroke="${cl}" stroke-width="${2-i*.25}" opacity="${(.5-i*.07).toFixed(2)}"/>`).join('');
      const impact=`<circle cx="200" cy="55" r="8" fill="${cl}" opacity="0.25"/><circle cx="200" cy="55" r="3" fill="#fff" opacity="0.6"/>`;
      const glow=`<ellipse cx="200" cy="55" rx="120" ry="40" fill="${cl}" opacity="0.06"/>`;
      return baseSvg(c1,c2,glow+rings+impact);
    }
  },
  {
    id:"piano", label:"ピアノ鍵盤", emoji:"🎹", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.55);
      const whites=Array.from({length:14},(_,i)=>`<rect x="${i*29+1}" y="55" width="27" height="50" rx="2" fill="${cl}" opacity="${(.12+(i%3)*.03).toFixed(2)}"/>`).join('');
      const blacks=Array.from({length:10},(_,i)=>{const positions=[0,1,3,4,5,7,8,10,11,12];const x=positions[i]*29+18;return`<rect x="${x}" y="55" width="17" height="32" rx="2" fill="${cl}" opacity="${(.22+(i%3)*.04).toFixed(2)}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="80" rx="200" ry="30" fill="${cl}" opacity="0.05"/>`;
      return baseSvg(c1,c2,glow+whites+blacks);
    }
  },
  {
    id:"bass", label:"ベースライン", emoji:"🎵", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.15),cl=lighten(color,.6);
      const waves=[0,1].map(i=>{const y=60+i*20,amp=30-i*8,op=(.55-i*.15).toFixed(2);return`<path d="M-20 ${y} C60 ${y-amp} 120 ${y+amp} 200 ${y} S320 ${y-amp} 420 ${y}" fill="none" stroke="${cl}" stroke-width="${3.5-i*.8}" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="65" rx="220" ry="35" fill="${cl}" opacity="0.07"/>`;
      return baseSvg(c1,c2,glow+waves);
    }
  },
  {
    id:"synth", label:"シンセサイザー", emoji:"🎛️", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.65),c2=darken(color,.3),cl=lighten(color,.6);
      const hlines=Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*15}" x2="400" y2="${i*15}" stroke="${cl}" stroke-width=".5" opacity="0.18"/>`).join('');
      const vlines=Array.from({length:20},(_,i)=>`<line x1="${i*21}" y1="0" x2="${i*21}" y2="110" stroke="${cl}" stroke-width=".5" opacity="0.18"/>`).join('');
      const pulses=Array.from({length:8},(_,i)=>{const x=20+i*50,h=10+i%4*15,op=(.2+i%3*.07).toFixed(2);return`<rect x="${x}" y="${55-h/2}" width="8" height="${h}" fill="${cl}" opacity="${op}" rx="1"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="150" ry="40" fill="${cl}" opacity="0.05"/>`;
      return baseSvg(c1,c2,glow+hlines+vlines+pulses);
    }
  },
  // ── 観客・一体感系 ──
  {
    id:"penlight", label:"ペンライト", emoji:"🕯️", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.65),c2=darken(color,.3),cl=lighten(color,.7);
      const lights=Array.from({length:30},(_,i)=>{const x=(i*43.7+10)%390+5,y=40+(i*29.3)%55,r=1.5+i%4*.8,op=(.2+(i*17%55)/100).toFixed(2);return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${cl}" opacity="${op}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r*2.5).toFixed(1)}" fill="${cl}" opacity="${(parseFloat(op)*.3).toFixed(2)}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="55" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+lights);
    }
  },
  {
    id:"redocean", label:"RED OCEAN", emoji:"🌊", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.65),c2=darken(color,.3),cl=lighten(color,.55);
      const waves=[0,1,2,3].map(i=>{const y=50+i*16,amp=16-i*3,op=(.6-i*.1).toFixed(2);return`<path d="M-10 ${y} C40 ${y-amp} 90 ${y+amp} 140 ${y} S240 ${y-amp} 290 ${y} S390 ${y+amp} 420 ${y}" fill="${cl}" opacity="${(.08-i*.015).toFixed(3)}"/><path d="M-10 ${y} C40 ${y-amp} 90 ${y+amp} 140 ${y} S240 ${y-amp} 290 ${y} S390 ${y+amp} 420 ${y}" fill="none" stroke="${cl}" stroke-width="${2-i*.3}" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="90" rx="220" ry="30" fill="${cl}" opacity="0.1"/>`;
      return baseSvg(c1,c2,glow+waves);
    }
  },
  {
    id:"callresponse", label:"コール＆レスポンス", emoji:"📣", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.65);
      const left=[20,40,60].map((r,i)=>`<path d="M10 55 Q${10+r} ${55-r*.5} ${10+r*2} 55" fill="none" stroke="${cl}" stroke-width="${2-i*.3}" opacity="${(.5-i*.1).toFixed(2)}" stroke-linecap="round"/>`).join('');
      const right=[20,40,60].map((r,i)=>`<path d="M390 55 Q${390-r} ${55-r*.5} ${390-r*2} 55" fill="none" stroke="${cl}" stroke-width="${2-i*.3}" opacity="${(.5-i*.1).toFixed(2)}" stroke-linecap="round"/>`).join('');
      const center=`<circle cx="200" cy="55" r="5" fill="${cl}" opacity="0.4"/><circle cx="200" cy="55" r="2" fill="#fff" opacity="0.7"/>`;
      const glow=`<ellipse cx="200" cy="55" rx="180" ry="45" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+left+right+center);
    }
  },
  {
    id:"circlepit", label:"サークルピット", emoji:"🔄", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.65);
      const arcs=Array.from({length:3},(_,i)=>{const r=25+i*20,dash=`${8+i*4},${4+i*2}`;return`<circle cx="200" cy="55" r="${r}" fill="none" stroke="${cl}" stroke-width="${2-i*.3}" opacity="${(.5-i*.1).toFixed(2)}" stroke-dasharray="${dash}"/>`;}).join('');
      const arrows=Array.from({length:8},(_,i)=>{const a=(i/8)*Math.PI*2,r=45,x=200+Math.cos(a)*r,y=55+Math.sin(a)*r*.6,ax=200+Math.cos(a+.3)*r,ay=55+Math.sin(a+.3)*r*.6,op=(.2+i%3*.06).toFixed(2);return`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}" stroke="${cl}" stroke-width="1.5" opacity="${op}" stroke-linecap="round"/>`;}).join('');
      return baseSvg(c1,c2,arcs+arrows);
    }
  },
  {
    id:"towel", label:"タオル回し", emoji:"🏳️", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.55),c2=darken(color,.2),cl=lighten(color,.65);
      const trails=Array.from({length:5},(_,i)=>{const yBase=25+i*18,pts=Array.from({length:16},(_,j)=>{const x=j*27,y=yBase+Math.sin(j*.6+i*1.2)*15;return`${x},${y.toFixed(1)}`;}).join(' ');const op=(.45-i*.06).toFixed(2);return`<polyline points="${pts}" fill="none" stroke="${cl}" stroke-width="${2.2-i*.3}" opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="45" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+trails);
    }
  },
  // ── 感情・雰囲気系 ──
  {
    id:"goosebumps", label:"鳥肌", emoji:"✨", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.7);
      const particles=Array.from({length:55},(_,i)=>{const x=(i*97.3+i*.5)%396+2,y=(i*67.1+i*.3)%106+2,r=.6+i%4*.5,op=(.1+(i*23%60)/100).toFixed(2);return`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${cl}" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="55" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+particles);
    }
  },
  {
    id:"tears", label:"涙", emoji:"💧", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.3),cl=lighten(color,.65);
      const drops=Array.from({length:14},(_,i)=>{const x=(i*71.3+15)%380+10,y=(i*53.7)%70+5,op=(.2+(i%5)*.06).toFixed(2);return`<ellipse cx="${x.toFixed(1)}" cy="${(y+8).toFixed(1)}" rx="3.5" ry="5" fill="${cl}" opacity="${op}"/><ellipse cx="${x.toFixed(1)}" cy="${(y+15).toFixed(1)}" rx="${4+i%3}" ry="1.5" fill="${cl}" opacity="${(parseFloat(op)*.4).toFixed(2)}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="200" ry="50" fill="${cl}" opacity="0.04"/>`;
      return baseSvg(c1,c2,glow+drops);
    }
  },
  {
    id:"scream", label:"叫び", emoji:"😱", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.2),cl=lighten(color,.7);
      const rings=[8,20,35,52,70,88].map((r,i)=>`<ellipse cx="200" cy="55" rx="${r*2.8}" ry="${r}" fill="none" stroke="${cl}" stroke-width="${2.2-i*.25}" opacity="${(.55-i*.07).toFixed(2)}"/>`).join('');
      const core=`<circle cx="200" cy="55" r="7" fill="${cl}" opacity="0.3"/><circle cx="200" cy="55" r="3" fill="#fff" opacity="0.7"/>`;
      const glow=`<ellipse cx="200" cy="55" rx="120" ry="55" fill="${cl}" opacity="0.06"/>`;
      return baseSvg(c1,c2,glow+rings+core);
    }
  },
  {
    id:"afterglow", label:"余韻", emoji:"🌙", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.7),c2=darken(color,.4),cl=lighten(color,.6);
      const bands=Array.from({length:6},(_,i)=>{const y=i*20,op=(.12-i*.015).toFixed(3);return`<rect x="0" y="${y}" width="400" height="22" fill="${cl}" opacity="${op}"/>`;}).join('');
      const shine=`<ellipse cx="200" cy="0" rx="200" ry="35" fill="${cl}" opacity="0.12"/>`;
      const glow=`<ellipse cx="200" cy="55" rx="180" ry="50" fill="${cl}" opacity="0.05"/>`;
      return baseSvg(c1,c2,shine+bands+glow);
    }
  },
  {
    id:"emotion", label:"感動", emoji:"💫", layer:"bg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.65);
      const aurora=Array.from({length:5},(_,i)=>{const y=10+i*20,op=(.1-i*.015).toFixed(3),h=25-i*3;return`<path d="M0 ${y} Q100 ${y-h} 200 ${y} T400 ${y}" fill="${cl}" opacity="${op}"/>`;}).join('');
      const rays=Array.from({length:10},(_,i)=>{const a=(i/10)*Math.PI*2,x=200+Math.cos(a)*150,y=55+Math.sin(a)*80,op=(.06+i%3*.02).toFixed(2);return`<line x1="200" y1="55" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${cl}" stroke-width=".8" opacity="${op}"/>`;}).join('');
      const glow=`<ellipse cx="200" cy="55" rx="100" ry="55" fill="${cl}" opacity="0.08"/>`;
      return baseSvg(c1,c2,aurora+rays+glow);
    }
  },
  {
    id:"fireworks", label:"花火", emoji:"🎆", layer:"fg",
    render:(color)=>{
      const c1=darken(color,.6),c2=darken(color,.25),cl=lighten(color,.7);
      const bursts=[[100,30],[200,20],[310,35]].map(([cx,cy],bi)=>{const rays=Array.from({length:16},(_,i)=>{const a=(i/16)*Math.PI*2,len=20+i%4*10,x2=cx+Math.cos(a)*len,y2=cy+Math.sin(a)*len,op=(.2+bi*.08+i%3*.04).toFixed(2);return`<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${cl}" stroke-width="${1.2-bi*.1}" opacity="${op}" stroke-linecap="round"/>`;}).join('');const glow=`<circle cx="${cx}" cy="${cy}" r="6" fill="${cl}" opacity="${.15+bi*.05}"/>`;return rays+glow;}).join('');
      const bg=`<ellipse cx="200" cy="30" rx="200" ry="40" fill="${cl}" opacity="0.03"/>`;
      return baseSvg(c1,c2,bg+bursts);
    }
  },
];

// ユーティリティ
export function darken(hex, amt) {
  const r=Math.max(0,parseInt(hex.slice(1,3),16)-Math.round(amt*180));
  const g=Math.max(0,parseInt(hex.slice(3,5),16)-Math.round(amt*180));
  const b=Math.max(0,parseInt(hex.slice(5,7),16)-Math.round(amt*180));
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}

export function lighten(hex, amt) {
  const r=Math.min(255,parseInt(hex.slice(1,3),16)+Math.round(amt*220));
  const g=Math.min(255,parseInt(hex.slice(3,5),16)+Math.round(amt*220));
  const b=Math.min(255,parseInt(hex.slice(5,7),16)+Math.round(amt*220));
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}

export function baseSvg(c1, c2, content) {
  const grad = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient><radialGradient id="vglow" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="${c2}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="110" fill="url(#bg)"/><rect width="400" height="110" fill="url(#vglow)"/>`;
  return `<svg viewBox="0 0 400 110" width="100%" height="110" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${grad}${content}</svg>`;
}

// 既存svgCodeに含まれるテキスト要素を除去（旧データ互換）
export const stripSvgText = (svg) => svg ? svg.replace(/<text[\s\S]*?<\/text>/gi, '') : svg;

// 2パターンのSVGコンテンツを合成（背景を先に描画、前景を上に重ねる）
export function combineTwoPatterns(p1, p2, color) {
  const c1 = darken(color, .6), c2 = darken(color, .25);
  const grad = `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient><radialGradient id="vglow" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="${c2}" stop-opacity="0.3"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></radialGradient></defs><rect width="400" height="110" fill="url(#bg)"/><rect width="400" height="110" fill="url(#vglow)"/>`;
  // 各パターンのSVGからコンテンツ部分だけ抽出して合成
  const extract = (svg) => {
    const m = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    if (!m) return '';
    // defs と rect（背景）を除いた純粋なコンテンツのみ抽出
    return m[1].replace(/<defs>[\s\S]*?<\/defs>/g,'').replace(/<rect[^/]*(fill="url\(#bg\)"|fill="url\(#vglow\)")[^/]*\/>/g,'');
  };
  const svg1 = p1.render(color);
  const svg2 = p2.render(color);
  const content = `<g opacity="0.85">${extract(svg1)}</g><g opacity="0.75">${extract(svg2)}</g>`;
  return `<svg viewBox="0 0 400 110" width="100%" height="110" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${grad}${content}</svg>`;
}

export function generateTourVisual(pat1id, pat2id, color) {
  const p1 = VIS_PATTERNS.find(p => p.id === pat1id) || VIS_PATTERNS[0];
  const p2 = VIS_PATTERNS.find(p => p.id === pat2id);
  if (!p2 || p1.id === p2.id) return p1.render(color);
  return combineTwoPatterns(p1, p2, color);
}

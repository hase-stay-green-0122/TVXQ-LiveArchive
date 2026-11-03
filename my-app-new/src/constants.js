// 画面全体で使う定数

export const MEM_FIELDS = [
  { key: "before",    icon: "🌟", label: "ライブ前の期待"  },
  { key: "after",     icon: "✨", label: "ライブ後の感想"  },
  { key: "highlight", icon: "💥", label: "特筆すべきこと"  },
  { key: "other",     icon: "❤️", label: "その他"         },
];

// T字ドット事前計算（9列×7行）
export const T_DOTS = (() => {
  const C = ["#e8112d","#c0152a","#ff3355","#d42035"];
  const d = [];
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 9; c++)
      d.push({ key:r*9+c, lit:r<=1||(c>=3&&c<=5), color:C[(r*9+c)%4] });
  return d;
})();

// ZONE収束ドット事前計算
export const ZONE_DOTS = (() => {
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

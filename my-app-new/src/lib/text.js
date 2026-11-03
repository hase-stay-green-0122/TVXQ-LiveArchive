// セットリスト・Tips・ツアー期間など、文字列の変換

export const parseTips = (text) =>
  text.split("\n").map(l => l.trim()).filter(Boolean).map(t => ({ cat:"📌 Tips", text:t }));

export const tipsToText = (tips) =>
  (tips || []).map(t => t.text.replace(/<[^>]+>/g, "")).join("\n");

// ツアー期間を計算（ライブのdateから自動算出）
export const getTourPeriod = (lives) => {
  const dates = (lives || [])
    .map(l => l.date)
    .filter(d => d && d !== "日付未設定" && /^\d{4}\.\d{2}\.\d{2}$/.test(d))
    .sort();
  if (dates.length === 0) return "yyyy.mm.dd";
  if (dates.length === 1) return dates[0];
  return `${dates[0]} – ${dates[dates.length - 1]}`;
};

export const parseSetlist = (text) =>
  text.split("\n").map(l=>l.trim()).filter(Boolean).map((line,i) => {
    const e = /アンコール/i.test(line);
    const t = line.replace(/^\d+\.\s*/,"").replace(/\s*[[［]アンコール[\]］]/i,"");
    return { n:i+1, t, ...(e?{e:true}:{}) };
  });

export const setlistToText = (songs) =>
  (songs||[]).map((s,i) => `${i+1}. ${s.t}${s.e?" [アンコール]":""}`).join("\n");

export const sameSongs = (a, b) => JSON.stringify(a || []) === JSON.stringify(b || []);

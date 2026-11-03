// ツアーの追加・編集フォーム
import { useState } from "react";
import { TOUR_COLOR_PRESETS, VIS_PATTERNS, generateTourVisual } from "../lib/tourVisual.js";

export function TourVisPreviewDialog({ tourSub, svgCode, onRetry, onConfirm }) {
  return (
    <div className="preview-overlay" onClick={e => e.stopPropagation()}>
      <div className="preview-dialog">
        <div className="preview-vis-wrap">
          <div dangerouslySetInnerHTML={{__html:svgCode}} style={{width:"100%",height:"100%"}}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:20,display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 12px 9px",background:"linear-gradient(0deg,rgba(0,0,0,.65) 0%,transparent 100%)",gap:2}}>
            {tourSub && <div style={{fontSize:10,color:"var(--gold-lt)",letterSpacing:".08em",whiteSpace:"nowrap",textAlign:"center"}}>{tourSub}</div>}
            <div style={{fontSize:11,color:"#fff",letterSpacing:".06em",whiteSpace:"nowrap",textAlign:"center"}}>yyyy.mm.dd</div>
          </div>
        </div>
        <div className="preview-body">
          <div className="preview-btns">
            <button className="preview-retry" onClick={onRetry}>🔄 別パターン</button>
            <button className="preview-confirm" onClick={onConfirm}>✓ これで追加する</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditTourForm({ tour, onClose, onSaveTour }) {
  const [tourName, setTourName] = useState(tour.name  || "");
  const [tourSub,  setTourSub]  = useState(tour.sub   || "");
  const [color,    setColor]    = useState(tour.color || "#c0152a");
  const [pat1,     setPat1]     = useState(null);
  const [pat2,     setPat2]     = useState(null);
  const [preview,  setPreview]  = useState(false);
  const [svgCode,  setSvgCode]  = useState(tour.svgCode || null);

  // ビジュアル変更した場合のみプレビューを経由
  const handleGenerate = () => {
    if (!pat1) { alert("パターンを1つ以上選んでください"); return; }
    const svg = generateTourVisual(pat1, pat2, color);
    setSvgCode(svg);
    setPreview(true);
  };

  const handleRetry = () => {
    setSvgCode(generateTourVisual(pat1, pat2, color));
  };

  const handleConfirmPreview = () => {
    setPreview(false);
  };

  const handleSave = () => {
    onSaveTour({
      tourName: tourName.trim() || tour.name,
      tourSub:  tourSub.trim()  || null,
      tourColor: color,
      svgCode:  svgCode,
    });
  };

  const togglePat = (id) => {
    if (pat1 === id) { setPat1(pat2); setPat2(null); return; }
    if (pat2 === id) { setPat2(null); return; }
    if (!pat1) { setPat1(id); return; }
    if (!pat2) { setPat2(id); return; }
    setPat1(pat2); setPat2(id);
  };

  const getPatLabel = (id) => {
    if (!id) return null;
    const p = VIS_PATTERNS.find(x => x.id === id);
    return p ? `${p.emoji} ${p.label}` : null;
  };

  return (
    <>
      {preview && svgCode && (
        <TourVisPreviewDialog
          tourName={tourName} tourSub={tourSub} svgCode={svgCode}
          onRetry={handleRetry}
          onConfirm={handleConfirmPreview}
        />
      )}
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-nav">
            <div className="modal-handle"/>
            <div className="modal-nav-btns">
              <button className="nav-back" onClick={onClose}>キャンセル</button>
            </div>
          </div>
          <div className="mhero dark"><div className="mdate">EDIT TOUR</div><div className="mtitle">ツアーを編集する</div></div>

          <div className="fsec">
            <label className="flbl">ツアータイトル</label>
            <input className="finp" value={tourName} onChange={e=>setTourName(e.target.value)}/>
          </div>
          <div className="fsec">
            <label className="flbl">サブタイトル（任意）</label>
            <input className="finp" value={tourSub} onChange={e=>setTourSub(e.target.value)}/>
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

          <div className="fdivider">ビジュアルパターン変更（任意）</div>
          <div style={{padding:"0 20px 8px"}}>
            <div style={{fontSize:11,color:"rgba(28,10,12,.4)",marginBottom:10,lineHeight:1.6}}>
              変更しない場合はそのまま保存できます。
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12,minHeight:28}}>
              {pat1 && <div style={{background:"var(--red)",color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12}}>{getPatLabel(pat1)}</div>}
              {pat2 && <div style={{background:"var(--red-deep)",color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12}}>{getPatLabel(pat2)}</div>}
              {!pat1 && <div style={{color:"rgba(28,10,12,.28)",fontSize:11,paddingTop:4}}>パターン未変更</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {VIS_PATTERNS.map(p => {
                const sel1=pat1===p.id, sel2=pat2===p.id, sel=sel1||sel2;
                return (
                  <div key={p.id} onClick={() => togglePat(p.id)}
                    style={{background:sel?(sel1?"var(--red)":"var(--red-deep)"):"var(--offwhite)",border:sel?"2px solid rgba(255,255,255,.4)":"1.5px solid rgba(192,21,42,.12)",borderRadius:10,padding:"8px 4px",textAlign:"center",cursor:"pointer",transition:"background .15s"}}>
                    <div style={{fontSize:20}}>{p.emoji}</div>
                    <div style={{fontSize:9,marginTop:3,color:sel?"#fff":"rgba(28,10,12,.55)",lineHeight:1.2,letterSpacing:".03em"}}>{p.label}</div>
                    {sel && <div style={{fontSize:9,color:"rgba(255,255,255,.7)",marginTop:2}}>{sel1?"①":"②"}</div>}
                  </div>
                );
              })}
            </div>
            {pat1 && (
              <button className="outline-btn" style={{marginTop:12,width:"100%"}} onClick={handleGenerate}>
                🎨 ビジュアルをプレビュー
              </button>
            )}
          </div>

          <button className="save-btn" style={{marginBottom:24,marginTop:8}} onClick={handleSave}>
            変更を保存する
          </button>
        </div>
      </div>
    </>
  );
}

export function AddTourForm({ onClose, onSaveTour }) {
  const [tourName, setTourName] = useState("");
  const [tourSub,  setTourSub]  = useState("");
  const [color,    setColor]    = useState("#c0152a");
  const [pat1,     setPat1]     = useState(null); // 1つ目のパターンid
  const [pat2,     setPat2]     = useState(null); // 2つ目のパターンid（任意）
  const [preview,  setPreview]  = useState(false);
  const [svgCode,  setSvgCode]  = useState(null);
  const [state,    setState]    = useState("idle");

  const handleGenerate = () => {
    if (!pat1) { alert("パターンを1つ以上選んでください"); return; }
    const svg = generateTourVisual(pat1, pat2, color);
    setSvgCode(svg);
    setPreview(true);
  };

  const handleRetry = () => {
    const svg = generateTourVisual(pat1, pat2, color);
    setSvgCode(svg);
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

  const togglePat = (id) => {
    if (pat1 === id) { setPat1(pat2); setPat2(null); return; }
    if (pat2 === id) { setPat2(null); return; }
    if (!pat1) { setPat1(id); return; }
    if (!pat2) { setPat2(id); return; }
    // 2つ選択済みの場合は古い方を置き換え
    setPat1(pat2); setPat2(id);
  };

  const getPatLabel = (id) => {
    if (!id) return null;
    const p = VIS_PATTERNS.find(x => x.id === id);
    return p ? `${p.emoji} ${p.label}` : null;
  };

  return (
    <>
      {preview && svgCode && (
        <TourVisPreviewDialog
          tourName={tourName} tourSub={tourSub} svgCode={svgCode}
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
            <label className="flbl">ツアータイトル（ビジュアルに大きく表示）</label>
            <input className="finp" placeholder="例: CIRCLE" value={tourName} onChange={e=>setTourName(e.target.value)}/>
          </div>
          <div className="fsec">
            <label className="flbl">サブタイトル（任意・下部に小さく表示）</label>
            <input className="finp" placeholder="例: 東方神起 LIVE TOUR 2027" value={tourSub} onChange={e=>setTourSub(e.target.value)}/>
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

          <div className="fdivider">ビジュアルパターン（最大2つ選択）</div>
          <div style={{padding:"0 20px 8px"}}>
            <div style={{fontSize:11,color:"rgba(28,10,12,.4)",marginBottom:10,lineHeight:1.6}}>
              タップして選択。2つ選ぶと合成されます。
            </div>
            {/* 選択中バッジ */}
            <div style={{display:"flex",gap:8,marginBottom:12,minHeight:28}}>
              {pat1 && <div style={{background:"var(--red)",color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12}}>{getPatLabel(pat1)}</div>}
              {pat2 && <div style={{background:"var(--red-deep)",color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:12}}>{getPatLabel(pat2)}</div>}
              {!pat1 && <div style={{color:"rgba(28,10,12,.28)",fontSize:11,paddingTop:4}}>まだ選択されていません</div>}
            </div>
            {/* パターングリッド */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
              {VIS_PATTERNS.map(p => {
                const sel1 = pat1 === p.id, sel2 = pat2 === p.id;
                const sel = sel1 || sel2;
                return (
                  <div key={p.id}
                    onClick={() => togglePat(p.id)}
                    style={{
                      background: sel ? (sel1 ? "var(--red)" : "var(--red-deep)") : "var(--offwhite)",
                      border: sel ? "2px solid rgba(255,255,255,.4)" : "1.5px solid rgba(192,21,42,.12)",
                      borderRadius:10, padding:"8px 4px", textAlign:"center", cursor:"pointer",
                      transition:"background .15s",
                    }}>
                    <div style={{fontSize:20}}>{p.emoji}</div>
                    <div style={{fontSize:9,marginTop:3,color:sel?"#fff":"rgba(28,10,12,.55)",lineHeight:1.2,letterSpacing:".03em"}}>{p.label}</div>
                    {sel && <div style={{fontSize:9,color:"rgba(255,255,255,.7)",marginTop:2}}>{sel1?"①":"②"}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="save-btn" style={{marginBottom:24,marginTop:8}} onClick={handleGenerate}>
            ✨ プレビューを生成する
          </button>
        </div>
      </div>
    </>
  );
}

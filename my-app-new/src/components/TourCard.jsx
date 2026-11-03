// ホーム画面のツアーカード（公演一覧つき）
import { useState } from "react";
import { getTourPeriod } from "../lib/text.js";
import { darken, baseSvg, stripSvgText } from "../lib/tourVisual.js";
import { ZONE_DOTS } from "../constants.js";
import { DeleteDialog } from "./Common.jsx";
import { EditTourForm } from "./TourForms.jsx";

export function TourCard({ tour, isOwner, myUid, entriesByLive, onLiveSelect, onLiveDelete, onTourDelete, onTourUpdate }) {
  const [open, setOpen] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [delTour, setDelTour] = useState(false);
  const [editTour, setEditTour] = useState(false);
  const period = getTourPeriod(tour.lives);
  const ROD = ["#e8112d","#c0152a","#ff3355","#d42035","#ff1a40","#b00d22"];


  // ── ツアービジュアル ──
  // 構造: outerDiv(position:relative, height:160px) > bgDiv(絶対配置・全面) + overlayDiv(絶対配置・全面) + footerDiv(絶対配置・bottom:0)
  const VIS_H = 160;
  const footerStyle = {
    position:"absolute", bottom:0, left:0, right:0, zIndex:10,
    display:"flex", flexDirection:"column", alignItems:"center",
    padding:"16px 12px 10px",
    background:"linear-gradient(0deg,rgba(0,0,0,.7) 0%,transparent 100%)",
    gap:0,
  };
  const actionsStyle = {
    position:"absolute", bottom:10, right:12, zIndex:11,
    display:"flex", alignItems:"center", gap:6,
  };
  const subStyle  = { fontSize:11, color:"var(--gold-lt)", letterSpacing:".08em", whiteSpace:"nowrap", textAlign:"center", marginBottom:3 };
  const periStyle = { fontSize:12, color:"#fff", letterSpacing:".06em", whiteSpace:"nowrap", textAlign:"center" };

  const footer = (
    <>
      <div style={footerStyle}>
        {tour.sub && <div style={subStyle}>{tour.sub}</div>}
        <div style={periStyle}>{period}</div>
      </div>
      <div style={actionsStyle}>
        <div className="tour-edit-wrap" onClick={e => { e.stopPropagation(); setEditTour(true); }}>
          <div className="tour-edit-tip">ツアーを編集</div>
          <button className="tour-edit">✏️</button>
        </div>
        {isOwner && (
          <div className="tour-del-wrap" onClick={e => { e.stopPropagation(); setDelTour(true); }}>
            <div className="tour-del-tip">ツアーを削除</div>
            <button className="tour-del">×</button>
          </div>
        )}
        <div className={"tour-card-arrow "+(open?"open":"")} style={{pointerEvents:"none"}}>›</div>
      </div>
    </>
  );

  const outerStyle = { position:"relative", height:VIS_H, overflow:"hidden", cursor:"pointer", width:"100%" };
  const bgFull     = { position:"absolute", inset:0, width:"100%", height:"100%" };

  const renderVis = () => {
    if (tour.id === "tour-20th") return (
      <div style={outerStyle} onClick={() => setOpen(o=>!o)}>
        <div className="red-vis" style={bgFull}/>
        <div className="red-wm" style={bgFull}><span>{tour.name}</span></div>
        <div className="red-ocean-dots">
          {Array.from({length:60}).map((_,i) => (
            <div key={i} className="rod" style={{background:ROD[i%ROD.length],height:6+(i%5)*3,opacity:0.4+(i%4)*0.15,boxShadow:`0 0 3px ${ROD[i%ROD.length]}`}}/>
          ))}
        </div>
        <div className="red-waves"><div className="red-wave"/><div className="red-wave"/><div className="red-wave"/></div>
        <div className="red-badge">20TH ANNIVERSARY</div>
        {footer}
      </div>
    );
    if (tour.id === "tour-zone") return (
      <div style={outerStyle} onClick={() => setOpen(o=>!o)}>
        <div className="zone-vis" style={bgFull}/>
        <div className="zone-wm" style={bgFull}><span>{tour.name}</span></div>
        <svg style={{...bgFull, zIndex:1}} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <circle cx="50" cy="50" r="4" fill="rgba(180,220,255,0.9)"/>
          <circle cx="50" cy="50" r="8" fill="rgba(120,180,255,0.2)"/>
          <circle cx="50" cy="50" r="14" fill="rgba(80,140,255,0.08)"/>
          {ZONE_DOTS.map(({key,x,y,opacity,size}) => (
            <circle key={key} cx={x} cy={y} r={size/2} fill={`rgba(140,200,255,${opacity})`}/>
          ))}
        </svg>
        <div className="zone-badge">20TH ANNIVERSARY</div>
        {footer}
      </div>
    );
    const toImgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(stripSvgText(svg))}`;
    const c1 = darken(tour.color, 0.55), c2 = darken(tour.color, 0.2);
    const svgUrl = toImgUrl(tour.svgCode || baseSvg(c1, c2, ''));
    return (
      <div style={outerStyle} onClick={() => setOpen(o=>!o)}>
        <img src={svgUrl} style={{...bgFull, objectFit:"cover"}} alt=""/>
        <div style={{...bgFull, zIndex:2, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none"}}>
          <span style={{fontFamily:'"Noto Serif JP",serif', fontSize:44, fontWeight:300, letterSpacing:".2em", color:"rgba(255,255,255,.75)", whiteSpace:"nowrap"}}>{tour.name}</span>
        </div>
        {footer}
      </div>
    );
  };

  return (
    <div className="tour-card">
      {delTour && (
        <DeleteDialog
          title="ツアーを削除しますか？"
          live={{date: tour.name, venue:`全${tour.lives.length}公演と、メンバー全員の記録・写真が削除されます`}}
          onCancel={() => setDelTour(false)}
          onConfirm={() => { onTourDelete(tour.id); setDelTour(false); }}
        />
      )}
      {delTarget && (
        <DeleteDialog
          live={{...delTarget, venue:`${delTarget.venue}（メンバー全員の記録・写真も削除されます）`}}
          onCancel={() => setDelTarget(null)}
          onConfirm={() => { onLiveDelete(delTarget.id); setDelTarget(null); }}
        />
      )}
      {editTour && (
        <EditTourForm
          tour={tour}
          onClose={() => setEditTour(false)}
          onSaveTour={(changes) => { onTourUpdate(tour.id, changes); setEditTour(false); }}
        />
      )}
      {renderVis()}
      {open && tour.lives.length === 0 && (
        <div className="lives-list">
          <div className="live-item" style={{cursor:"default",color:"rgba(255,255,255,.4)",fontSize:12}}>
            まだ公演がありません。「＋」→「ライブを追加」から記録できます。
          </div>
        </div>
      )}
      {open && tour.lives.length > 0 && (
        <div className="lives-list">
          {tour.lives.map(live => {
            const liveEntries = entriesByLive.get(live.id) || [];
            const mine = liveEntries.find(e => e.uid === myUid);
            return (
              <div key={live.id} className="live-item" onClick={() => onLiveSelect(live)}>
                <div className="live-item-emoji">{live.emoji}</div>
                <div className="live-item-info">
                  <div className="live-item-date">{live.date}</div>
                  <div className="live-item-venue">{live.venue}</div>
                  <div className="live-item-meta">
                    {mine?.seat && <span>{mine.seat.split(" / ")[0]}</span>}
                    <span>👥 {liveEntries.length}人の記録</span>
                  </div>
                </div>
                {isOwner && (
                  <div className="live-del-wrap" onClick={e => { e.stopPropagation(); setDelTarget(live); }}>
                    <div className="live-del-tip">削除する</div>
                    <button className="live-del">×</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

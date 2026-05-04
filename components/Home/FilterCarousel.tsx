"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id: "zona",
    index: "01",
    category: "ZONA",
    question: "Where do you want\nto live?",
    accent: "#c9a96e",
    accentRgb: "201,169,110",
    bg: "#050300",
    visual: "geo",
    options: [
      { value:"marbella",   label:"Marbella",   sub:"36°30'N 4°53'W", detail:"Golden Mile · Puerto Banús · Sierra Blanca", badge:"★★★★★" },
      { value:"estepona",   label:"Estepona",   sub:"36°25'N 5°08'W", detail:"New Golden Mile · Selwo · Marina",           badge:"★★★★☆" },
      { value:"mijas",      label:"Mijas",      sub:"36°35'N 4°38'W", detail:"La Cala · El Chaparral · Calanova",          badge:"★★★★☆" },
      { value:"benahavis",  label:"Benahavís",  sub:"36°31'N 5°02'W", detail:"La Zagaleta · Monte Mayor",                  badge:"★★★★★" },
      { value:"sotogrande", label:"Sotogrande", sub:"36°17'N 5°23'W", detail:"La Reserva · Valderrama",                    badge:"★★★★★" },
    ],
  },
  {
    id: "tipo",
    index: "02",
    category: "TIPO",
    question: "What defines\nyour vision?",
    accent: "#a8c4d4",
    accentRgb: "168,196,212",
    bg: "#000810",
    visual: "arch",
    options: [
      { value:"villa",     label:"Villa",     sub:"THE ESTATE",  detail:"Privacy · Architecture · Infinity", badge:"ICON" },
      { value:"apartment", label:"Apartment", sub:"THE SKY",     detail:"Views · Altitude · Prestige",       badge:"APEX" },
      { value:"townhouse", label:"Townhouse", sub:"THE ADDRESS", detail:"Community · Security · Elegance",   badge:"RARE" },
      { value:"plot",      label:"Plot",      sub:"THE CANVAS",  detail:"Raw Land · Your Vision · Limits",   badge:"PURE" },
    ],
  },
  {
    id: "precio",
    index: "03",
    category: "INVERSIÓN",
    question: "Define the scale\nof your ambition.",
    accent: "#e8a87c",
    accentRgb: "232,168,124",
    bg: "#080200",
    visual: "scale",
    options: [
      { value:"500k-1m", label:"€500K", sub:"– 1M",    detail:"Entry to Luxury",  badge:"I" },
      { value:"1m-2m",   label:"€1M",   sub:"– 2M",    detail:"Prime Collection", badge:"II" },
      { value:"2m-5m",   label:"€2M",   sub:"– 5M",    detail:"Ultra Premium",    badge:"III" },
      { value:"5m+",     label:"€5M",   sub:"& above", detail:"No Limits",        badge:"∞" },
    ],
  },
];

interface Props {
  locale: string;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  onPanelChange: (i: number) => void;
}

export default function FilterCarousel({ locale, panelRefs, onPanelChange }: Props) {
  const [activePanel, setActivePanel] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (filterId: string, value: string) => {
    if (transitioning) return;
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (activePanel < FILTERS.length - 1) {
      setTransitioning(true);
      const next = activePanel + 1;
      setTimeout(() => {
        setActivePanel(next);
        onPanelChange(next);
        setTransitioning(false);
      }, 100);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        @keyframes radarPulse {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
        }
        .filter-option {
          transition: background 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .filter-option:hover {
          background: rgba(255,255,255,0.02) !important;
        }
      `}</style>

      {/* Contenedor perspective — necesario para el Z-Axis real */}
      <div style={{
        position: "absolute",
        inset: 0,
        perspective: "1200px",
        perspectiveOrigin: "50% 40%",
        overflow: "visible",
      }}>
        {/* preserve-3d — sin esto el browser aplana el Z y no se ve la profundidad */}
        <div style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          overflow: "visible",
        }}>
          {FILTERS.map((filter, fi) => (
            <div
              key={filter.id}
              ref={el => { panelRefs.current[fi] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                background: filter.bg,
                willChange: "transform, opacity, filter",
                transformStyle: "preserve-3d",
                // Estado inicial: panel 0 activo, resto en profundidad Z negativa
                transform: fi === 0 ? "translate3d(0,0,0px) scale(1)" : "translate3d(0,0,-2000px) scale(0.4)",
                opacity: fi === 0 ? 1 : 0,
              }}
            >
              {/* ── VISUAL DE FONDO ────────────────────────────────────── */}

              {filter.visual === "geo" && (
                <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                  {/* Cuadricula cartografica */}
                  {[20,35,50,65,80].map(y => (
                    <div key={y} style={{ position:"absolute", top:`${y}%`, left:0, right:0, height:"1px", background:`rgba(${filter.accentRgb},0.05)` }} />
                  ))}
                  {[15,30,45,60,75,90].map(x => (
                    <div key={x} style={{ position:"absolute", left:`${x}%`, top:0, bottom:0, width:"1px", background:`rgba(${filter.accentRgb},0.03)` }} />
                  ))}
                  {/* Punto radar — Costa del Sol */}
                  <div style={{ position:"absolute", bottom:"22%", left:"50%", transform:"translateX(-50%)" }}>
                    <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:filter.accent, boxShadow:`0 0 20px ${filter.accent}` }} />
                    <div style={{ position:"absolute", top:"50%", left:"50%", width:"50px", height:"50px", borderRadius:"50%", border:`1px solid ${filter.accent}40`, animation:"radarPulse 3s ease-out infinite", transform:"translate(-50%,-50%)" }} />
                    <div style={{ position:"absolute", top:"50%", left:"50%", width:"100px", height:"100px", borderRadius:"50%", border:`1px solid ${filter.accent}20`, animation:"radarPulse 3s ease-out 1s infinite", transform:"translate(-50%,-50%)" }} />
                  </div>
                  {/* Coordenadas fantasma */}
                  <div style={{ position:"absolute", top:"8%", right:"4%", color:`rgba(${filter.accentRgb},0.06)`, fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(4rem,9vw,8rem)", fontWeight:100, letterSpacing:"0.05em", lineHeight:1.1, userSelect:"none" }}>
                    36°N<br/>5°W
                  </div>
                </div>
              )}

              {filter.visual === "arch" && (
                <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                  {/* Siluetas arquitectonicas SVG */}
                  <svg style={{ position:"absolute", bottom:0, width:"100%", height:"55%", opacity:0.04 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax meet">
                    <polygon points="80,400 80,180 180,120 280,180 280,400" fill="white" />
                    <rect x="380" y="100" width="80" height="300" fill="white" />
                    <rect x="360" y="60" width="120" height="50" fill="white" />
                    <rect x="560" y="260" width="320" height="140" fill="white" />
                    <rect x="520" y="300" width="400" height="100" fill="white" />
                    <rect x="980" y="180" width="60" height="220" fill="white" />
                    <rect x="1040" y="220" width="60" height="180" fill="white" />
                    <rect x="1100" y="200" width="60" height="200" fill="white" />
                  </svg>
                  <div style={{ position:"absolute", bottom:"35%", left:0, right:0, height:"1px", background:`rgba(${filter.accentRgb},0.07)` }} />
                  <div style={{ position:"absolute", top:"5%", right:"2%", color:`rgba(${filter.accentRgb},0.04)`, fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(4rem,10vw,9rem)", fontWeight:100, letterSpacing:"-0.05em", lineHeight:1, userSelect:"none" }}>
                    ARCH<br/>ITEC<br/>TURE
                  </div>
                </div>
              )}

              {filter.visual === "scale" && (
                <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                  {/* Barras de escala financiera */}
                  {[15,28,41,54,67,80].map((x, i) => (
                    <div key={x} style={{ position:"absolute", bottom:0, left:`${x}%`, width:"1px", height:`${20 + i * 12}%`, background:`rgba(${filter.accentRgb},${0.03 + i * 0.01})` }} />
                  ))}
                  {[25,50,75].map(y => (
                    <div key={y} style={{ position:"absolute", top:`${y}%`, left:0, right:0, height:"1px", background:`rgba(${filter.accentRgb},0.04)` }} />
                  ))}
                  <div style={{ position:"absolute", top:"5%", right:"1%", color:`rgba(${filter.accentRgb},0.04)`, fontFamily:"Georgia,serif", fontSize:"clamp(8rem,20vw,18rem)", fontWeight:300, lineHeight:1, userSelect:"none" }}>
                    €
                  </div>
                </div>
              )}

              {/* ── HEADER DEL PANEL ───────────────────────────────────── */}
              <div style={{ position:"absolute", top:0, left:0, right:0, padding:"2.5rem 3rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", zIndex:10 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:"1.5rem" }}>
                  <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(3rem,5vw,4.5rem)", fontWeight:100, color:"transparent", WebkitTextStroke:`1px rgba(${filter.accentRgb},0.2)`, lineHeight:1 }}>
                    {filter.index}
                  </span>
                  <div>
                    <div style={{ height:"1px", width:"2.5rem", background:filter.accent, marginBottom:"0.5rem" }} />
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", fontWeight:300, color:`rgba(${filter.accentRgb},0.7)`, letterSpacing:"0.5em", textTransform:"uppercase" }}>
                      {filter.category}
                    </span>
                  </div>
                </div>
                {/* Breadcrumb — selecciones anteriores */}
                <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                  {FILTERS.slice(0, fi).map(f => (
                    <span key={f.id} style={{ color:"rgba(255,255,255,0.2)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", letterSpacing:"0.3em", textTransform:"uppercase", fontStyle:"italic" }}>
                      {selected[f.id]}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── PREGUNTA ───────────────────────────────────────────── */}
              <div style={{ position:"absolute", top:"50%", transform:"translateY(-70%)", left:0, right:0, padding:"0 6vw", zIndex:10 }}>
                <h2 style={{ fontFamily:"'Helvetica Neue','Inter',sans-serif", fontSize:"clamp(2rem,4.5vw,4rem)", fontWeight:100, color:"white", letterSpacing:"-0.02em", lineHeight:1.15, margin:0, whiteSpace:"pre-line" }}>
                  {filter.question}
                </h2>
                <div style={{ height:"1px", width:"5rem", background:`rgba(${filter.accentRgb},0.4)`, marginTop:"1.5rem" }} />
              </div>

              {/* ── OPCIONES ───────────────────────────────────────────── */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                display:"grid",
                gridTemplateColumns: filter.options.length === 5 ? "repeat(5,1fr)" : "repeat(4,1fr)",
                borderTop:`1px solid rgba(${filter.accentRgb},0.08)`,
              }}>
                {filter.options.map((opt, oi) => {
                  const isSel = selected[filter.id] === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className="filter-option"
                      onClick={() => handleSelect(filter.id, opt.value)}
                      onMouseEnter={() => setHoveredOption(opt.value)}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        padding:"2.5rem 2rem 3rem",
                        borderRight:`1px solid rgba(${filter.accentRgb},0.07)`,
                        background: isSel
                          ? `linear-gradient(135deg,rgba(${filter.accentRgb},0.1) 0%,transparent 100%)`
                          : "transparent",
                        boxShadow: isSel
                          ? `inset 0 0 0 1px ${filter.accent}, inset 0 0 60px rgba(${filter.accentRgb},0.08)`
                          : "none",
                        transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                        position:"relative",
                        
                      }}
                    >
                      {/* Numero opcion */}
                      <div style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", color:`rgba(${filter.accentRgb},${isSel?0.7:0.2})`, letterSpacing:"0.4em", marginBottom:"1.8rem", transition:"color 0.4s" }}>
                        {String(oi+1).padStart(2,"0")}
                      </div>

                      {/* Label */}
                      <span style={{
                        fontFamily: filter.id === "tipo" ? "'Playfair Display','Didot',serif" : "'Helvetica Neue',sans-serif",
                        fontSize:"clamp(1.5rem,2.5vw,2.2rem)",
                        fontWeight: filter.id === "tipo" ? 400 : 200,
                        fontStyle: filter.id === "tipo" ? "italic" : "normal",
                        color: isSel ? "white" : "rgba(255,255,255,0.5)",
                        letterSpacing: filter.id === "precio" ? "-0.01em" : "0.01em",
                        lineHeight:1, display:"block", marginBottom:"0.4rem",
                        transition:"color 0.4s",
                      }}>
                        {opt.label}
                      </span>

                      {/* Sub */}
                      <div style={{ fontFamily:"monospace", fontSize:"0.45rem", color:`rgba(${filter.accentRgb},${isSel?0.6:0.25})`, letterSpacing:"0.2em", marginBottom:"1.5rem", transition:"color 0.4s" }}>
                        {opt.sub}
                      </div>

                      {/* Linea expansible */}
                      <div style={{ height:"1px", background:`rgba(${filter.accentRgb},${isSel?0.5:0.1})`, width:isSel?"100%":"30%", marginBottom:"1.2rem", transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)" }} />

                      {/* Detail */}
                      <div style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:`rgba(255,255,255,${isSel?0.45:0.15})`, letterSpacing:"0.18em", textTransform:"uppercase", lineHeight:1.9, transition:"color 0.4s" }}>
                        {opt.detail.split(" · ").map((d,di) => <div key={di}>{d}</div>)}
                      </div>

                      {/* Badge esquina */}
                      <div style={{ position:"absolute", top:"1.5rem", right:"1.5rem", fontFamily: filter.id==="tipo" ? "'Helvetica Neue',sans-serif" : "Georgia,serif", fontSize:"0.5rem", color:`rgba(${filter.accentRgb},${isSel?0.7:0.12})`, letterSpacing: filter.id==="tipo"?"0.3em":"0.1em", transition:"color 0.4s" }}>
                        {opt.badge}
                      </div>

                      {/* Barra inferior seleccionado */}
                      {isSel && (
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,${filter.accent},transparent)` }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── FOOTER ─────────────────────────────────────────────── */}
              <div style={{ position:"absolute", bottom:"calc(33vh + 1rem)", left:"3rem", right:"3rem", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
                <div style={{ display:"flex", gap:"0.8rem", alignItems:"center" }}>
                  {FILTERS.map((_,i) => (
                    <div key={i} style={{
                      width: i===fi ? "3rem" : "0.4rem",
                      height:"1px",
                      background: i<fi ? `rgba(${filter.accentRgb},0.4)` : i===fi ? filter.accent : "rgba(255,255,255,0.12)",
                      transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }} />
                  ))}
                  <span style={{ color:"rgba(255,255,255,0.15)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", letterSpacing:"0.3em", marginLeft:"0.5rem" }}>
                    {fi+1} / {FILTERS.length}
                  </span>
                </div>

                {allSelected && fi === FILTERS.length - 1 && (
                  <button
                    onClick={() => router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                    onMouseEnter={e => { e.currentTarget.style.background = filter.accent; e.currentTarget.style.color = "#000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = filter.accent; }}
                    style={{ background:"none", border:`1px solid ${filter.accent}`, color:filter.accent, fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.55rem", letterSpacing:"0.5em", textTransform:"uppercase", padding:"1rem 2.5rem", cursor:"pointer", transition:"all 0.4s ease" }}
                  >
                    Discover Properties →
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
}

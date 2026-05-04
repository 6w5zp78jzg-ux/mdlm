"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ── DATOS ────────────────────────────────────────────────────────────────────
const FILTERS = [
  {
    id: "zona",
    index: "01",
    category: "ZONA",
    question: "Where do you want\nto live?",
    accent: "#c9a96e",
    accentRgb: "201,169,110",
    bg: "#050300",
    // Identidad visual: Mapa minimalista / coordenadas geograficas
    visual: "geo",
    options: [
      { value:"marbella",   label:"Marbella",   sub:"36°30'N 4°53'W",  detail:"Golden Mile · Puerto Banús · Sierra Blanca", seats: "★★★★★" },
      { value:"estepona",   label:"Estepona",   sub:"36°25'N 5°08'W",  detail:"New Golden Mile · Selwo · Marina",           seats: "★★★★☆" },
      { value:"mijas",      label:"Mijas",      sub:"36°35'N 4°38'W",  detail:"La Cala · El Chaparral · Calanova",          seats: "★★★★☆" },
      { value:"benahavis",  label:"Benahavís",  sub:"36°31'N 5°02'W",  detail:"La Zagaleta · Monte Mayor",                  seats: "★★★★★" },
      { value:"sotogrande", label:"Sotogrande", sub:"36°17'N 5°23'W",  detail:"La Reserva · Valderrama",                    seats: "★★★★★" },
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
    // Identidad visual: Siluetas arquitectonicas
    visual: "arch",
    options: [
      { value:"villa",     label:"Villa",     sub:"THE ESTATE",    detail:"Privacy · Architecture · Infinity",  seats: "ICON" },
      { value:"apartment", label:"Apartment", sub:"THE SKY",       detail:"Views · Altitude · Prestige",        seats: "APEX" },
      { value:"townhouse", label:"Townhouse", sub:"THE ADDRESS",   detail:"Community · Security · Elegance",    seats: "RARE" },
      { value:"plot",      label:"Plot",      sub:"THE CANVAS",    detail:"Raw Land · Your Vision · No Limits", seats: "PURE" },
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
    // Identidad visual: Barras de riqueza / escala
    visual: "scale",
    options: [
      { value:"500k-1m", label:"€500K",  sub:"– 1M",    detail:"Entry to Luxury",        seats: "I" },
      { value:"1m-2m",   label:"€1M",    sub:"– 2M",    detail:"Prime Collection",       seats: "II" },
      { value:"2m-5m",   label:"€2M",    sub:"– 5M",    detail:"Ultra Premium",          seats: "III" },
      { value:"5m+",     label:"€5M",    sub:"& above", detail:"Beyond Boundaries",      seats: "∞" },
    ],
  },
];

// ── VISUALES ARQUITECTONICOS POR PANEL ───────────────────────────────────────

function GeoVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {/* Lineas de latitud */}
      {[20,35,50,65,80].map(y => (
        <div key={y} style={{ position:"absolute", top:`${y}%`, left:0, right:0, height:"1px", background:`rgba(${201},${169},${110},0.06)` }} />
      ))}
      {/* Lineas de longitud */}
      {[15,30,45,60,75,90].map(x => (
        <div key={x} style={{ position:"absolute", left:`${x}%`, top:0, bottom:0, width:"1px", background:`rgba(201,169,110,0.04)` }} />
      ))}
      {/* Punto de origen — costa del sol */}
      <div style={{ position:"absolute", bottom:"20%", left:"50%", transform:"translateX(-50%)" }}>
        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:accent, boxShadow:`0 0 20px ${accent}, 0 0 40px ${accent}40` }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"40px", height:"40px", borderRadius:"50%", border:`1px solid ${accent}30`, animation:"radarPulse 3s ease-out infinite" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"80px", height:"80px", borderRadius:"50%", border:`1px solid ${accent}15`, animation:"radarPulse 3s ease-out 1s infinite" }} />
      </div>
      {/* Texto coordenadas fondo */}
      <div style={{ position:"absolute", top:"8%", right:"5%", color:`rgba(201,169,110,0.08)`, fontFamily:"'Helvetica Neue',monospace", fontSize:"clamp(3rem,8vw,7rem)", fontWeight:100, letterSpacing:"0.1em", lineHeight:1.2, userSelect:"none" }}>
        36°N<br/>5°W
      </div>
    </div>
  );
}

function ArchVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {/* Silueta arquitectonica minimalista */}
      <svg style={{ position:"absolute", bottom:0, left:0, right:0, width:"100%", height:"60%", opacity:0.04 }} viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax meet">
        {/* Villa */}
        <polygon points="100,400 100,200 180,150 260,200 260,400" fill="white" />
        <rect x="140" y="240" width="40" height="60" fill="#000" />
        {/* Torre */}
        <rect x="400" y="400" width="80" height="300" fill="white" transform="translate(0,-300)" />
        <rect x="380" y="400" width="120" height="40" fill="white" transform="translate(0,-340)" />
        {/* Horizontal luxury */}
        <rect x="600" y="280" width="300" height="120" fill="white" />
        <rect x="560" y="320" width="380" height="80" fill="white" />
        {/* Otro edificio */}
        <rect x="1000" y="200" width="60" height="200" fill="white" />
        <rect x="1060" y="250" width="60" height="150" fill="white" />
        <rect x="1120" y="220" width="60" height="180" fill="white" />
      </svg>
      {/* Linea de horizonte */}
      <div style={{ position:"absolute", bottom:"35%", left:0, right:0, height:"1px", background:`rgba(168,196,212,0.08)` }} />
      {/* Texto arquitectura fondo */}
      <div style={{ position:"absolute", top:"8%", right:"3%", color:`rgba(168,196,212,0.05)`, fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(4rem,10vw,9rem)", fontWeight:100, letterSpacing:"-0.05em", lineHeight:1, userSelect:"none" }}>
        ARCH<br/>ITECTU<br/>RE
      </div>
    </div>
  );
}

function ScaleVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {/* Barras de escala de riqueza — verticales */}
      {[
        { h:20, x:15 }, { h:40, x:25 }, { h:65, x:35 },
        { h:90, x:45 }, { h:75, x:55 }, { h:50, x:65 },
        { h:30, x:75 }, { h:85, x:85 },
      ].map((b, i) => (
        <div key={i} style={{ position:"absolute", bottom:0, left:`${b.x}%`, width:"1px", height:`${b.h}%`, background:`rgba(232,168,124,${0.02 + i * 0.01})` }} />
      ))}
      {/* Grid financiero */}
      {[25,50,75].map(y => (
        <div key={y} style={{ position:"absolute", top:`${y}%`, left:0, right:0, height:"1px", background:"rgba(232,168,124,0.04)" }}>
          <span style={{ position:"absolute", left:"2%", top:"-10px", color:"rgba(232,168,124,0.12)", fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.2em" }}>
            {y === 25 ? "€5M+" : y === 50 ? "€2M" : "€500K"}
          </span>
        </div>
      ))}
      {/* Simbolo infinito / euro fondo */}
      <div style={{ position:"absolute", top:"5%", right:"2%", color:"rgba(232,168,124,0.04)", fontFamily:"Georgia,serif", fontSize:"clamp(8rem,20vw,18rem)", fontWeight:300, lineHeight:1, userSelect:"none" }}>
        €
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

interface Props { locale: string; }

export default function FilterCarousel({ locale }: Props) {
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
      setTimeout(() => { setActivePanel(p => p + 1); setTransitioning(false); }, 700);
    }
  };

  const filter = FILTERS[activePanel];
  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        @keyframes radarPulse { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.6;} 100%{transform:translate(-50%,-50%) scale(2.5);opacity:0;} }
        @keyframes zAxisEnter {
          0%   { opacity:0; transform:perspective(1200px) translate3d(0,0,-600px) rotateX(4deg) scale(0.88); filter:blur(30px) brightness(0.3); }
          60%  { opacity:1; filter:blur(2px) brightness(0.9); }
          100% { opacity:1; transform:perspective(1200px) translate3d(0,0,0) rotateX(0deg) scale(1); filter:blur(0px) brightness(1); }
        }
        @keyframes optionReveal {
          0%   { opacity:0; transform:translateY(40px) translateZ(-80px); filter:blur(12px); }
          100% { opacity:1; transform:translateY(0) translateZ(0); filter:blur(0px); }
        }
        @keyframes lineExpand { 0%{transform:scaleX(0);} 100%{transform:scaleX(1);} }
        @keyframes indexReveal { 0%{opacity:0;transform:translateX(-30px);} 100%{opacity:1;transform:translateX(0);} }
        @keyframes questionReveal {
          0%   { opacity:0; transform:translateY(20px); filter:blur(10px); }
          100% { opacity:1; transform:translateY(0); filter:blur(0px); }
        }
        @keyframes selectedPulse {
          0%,100% { box-shadow: 0 0 0 1px var(--accent), 0 0 30px rgba(var(--accent-rgb),0.15); }
          50%     { box-shadow: 0 0 0 1px var(--accent), 0 0 60px rgba(var(--accent-rgb),0.35); }
        }
        @keyframes breadcrumbIn { 0%{opacity:0;transform:translateX(-10px);} 100%{opacity:1;transform:translateX(0);} }

        .panel-zaxis    { animation: zAxisEnter 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .option-reveal  { animation: optionReveal 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .line-expand    { animation: lineExpand 0.8s cubic-bezier(0.16,1,0.3,1) both; transform-origin:left; }
        .index-reveal   { animation: indexReveal 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .q-reveal       { animation: questionReveal 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .breadcrumb-in  { animation: breadcrumbIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }

        .filter-option {
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .filter-option::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .filter-option:hover { transform: translateY(-8px); }
        .filter-option.selected { animation: selectedPulse 3s ease-in-out infinite; }
      `}</style>

      <div style={{ position:"absolute", inset:0, perspective:"1400px", perspectiveOrigin:"50% 40%" }}>
        <div key={activePanel} className="panel-zaxis" style={{
          width:"100%", height:"100%",
          background: filter.bg,
          position:"relative", overflow:"hidden",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
        }}>

          {/* VISUAL ARQUITECTONICO DE FONDO */}
          {filter.visual === "geo"   && <GeoVisual accent={filter.accent} />}
          {filter.visual === "arch"  && <ArchVisual accent={filter.accent} />}
          {filter.visual === "scale" && <ScaleVisual accent={filter.accent} />}

          {/* HEADER DEL PANEL */}
          <div style={{ position:"absolute", top:0, left:0, right:0, padding:"2.5rem 3rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", zIndex:10 }}>

            {/* INDEX + CATEGORIA */}
            <div style={{ display:"flex", alignItems:"baseline", gap:"1.5rem" }}>
              <span className="index-reveal" style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(3rem,5vw,4.5rem)", fontWeight:100, color:"transparent", WebkitTextStroke:`1px rgba(${filter.accentRgb},0.25)`, lineHeight:1 }}>
                {filter.index}
              </span>
              <div>
                <div className="line-expand" style={{ height:"1px", width:"3rem", background:filter.accent, marginBottom:"0.5rem", animationDelay:"0.2s" }} />
                <span className="index-reveal" style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.55rem", fontWeight:300, color:`rgba(${filter.accentRgb},0.7)`, letterSpacing:"0.5em", textTransform:"uppercase", animationDelay:"0.1s" }}>
                  {filter.category}
                </span>
              </div>
            </div>

            {/* BREADCRUMB — selecciones anteriores */}
            <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
              {FILTERS.slice(0, activePanel).map((f, i) => (
                <span key={f.id} className="breadcrumb-in" style={{ color:"rgba(255,255,255,0.25)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", letterSpacing:"0.35em", textTransform:"uppercase", fontStyle:"italic", animationDelay:`${i*0.1}s` }}>
                  {selected[f.id]} {i < activePanel - 1 && <span style={{ opacity:0.3, marginLeft:"1rem" }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* PREGUNTA PRINCIPAL */}
          <div style={{ position:"relative", zIndex:10, width:"100%", padding:"0 6vw", marginBottom:"4rem" }}>
            <h2 className="q-reveal" style={{
              fontFamily:"'Helvetica Neue','Inter',sans-serif",
              fontSize:"clamp(2rem,4.5vw,4rem)",
              fontWeight:100,
              color:"white",
              letterSpacing:"-0.02em",
              lineHeight:1.15,
              margin:0,
              whiteSpace:"pre-line",
              animationDelay:"0.15s",
            }}>
              {filter.question}
            </h2>
            <div className="line-expand" style={{ height:"1px", width:"6rem", background:`rgba(${filter.accentRgb},0.4)`, marginTop:"1.5rem", animationDelay:"0.3s" }} />
          </div>

          {/* OPCIONES */}
          <div style={{
            position:"relative", zIndex:10,
            display:"grid",
            gridTemplateColumns: filter.options.length === 5
              ? "repeat(5,1fr)"
              : "repeat(4,1fr)",
            gap:"1px",
            width:"100%",
            borderTop:`1px solid rgba(${filter.accentRgb},0.08)`,
          }}>
            {filter.options.map((opt, oi) => {
              const isSelected = selected[filter.id] === opt.value;
              const isHovered = hoveredOption === opt.value;

              return (
                <div
                  key={opt.value}
                  className={`filter-option option-reveal ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(filter.id, opt.value)}
                  onMouseEnter={() => setHoveredOption(opt.value)}
                  onMouseLeave={() => setHoveredOption(null)}
                  style={{
                    "--accent": filter.accent,
                    "--accent-rgb": filter.accentRgb,
                    padding:"3rem 2.5rem",
                    borderRight:`1px solid rgba(${filter.accentRgb},0.08)`,
                    borderBottom:"none",
                    background: isSelected
                      ? `linear-gradient(135deg, rgba(${filter.accentRgb},0.08) 0%, transparent 100%)`
                      : isHovered
                        ? `rgba(255,255,255,0.02)`
                        : "transparent",
                    boxShadow: isSelected
                      ? `0 0 0 1px ${filter.accent}, inset 0 0 60px rgba(${filter.accentRgb},0.06)`
                      : "none",
                    animationDelay:`${oi * 0.07 + 0.25}s`,
                  } as React.CSSProperties}
                >
                  {/* Numero de opcion */}
                  <div style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", fontWeight:300, color:`rgba(${filter.accentRgb},${isSelected ? 0.8 : 0.2})`, letterSpacing:"0.4em", marginBottom:"2rem", transition:"color 0.4s ease" }}>
                    {String(oi+1).padStart(2,"0")}
                  </div>

                  {/* Label principal — tipografia de alto impacto */}
                  <div style={{ marginBottom:"0.3rem" }}>
                    <span style={{
                      fontFamily: filter.id === "precio" ? "'Helvetica Neue',sans-serif" : "'Playfair Display','Didot',serif",
                      fontSize: filter.id === "precio" ? "clamp(2rem,3.5vw,3rem)" : "clamp(1.8rem,3vw,2.8rem)",
                      fontWeight: filter.id === "precio" ? 200 : 400,
                      fontStyle: filter.id !== "precio" ? "italic" : "normal",
                      color: isSelected ? "white" : `rgba(255,255,255,${isHovered ? 0.8 : 0.5})`,
                      letterSpacing: filter.id === "precio" ? "-0.02em" : "0.01em",
                      lineHeight:1,
                      transition:"color 0.4s ease",
                      display:"block",
                    }}>
                      {opt.label}
                    </span>
                    {filter.id === "precio" && (
                      <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(1rem,1.8vw,1.5rem)", fontWeight:100, color:`rgba(${filter.accentRgb},${isSelected ? 0.9 : 0.4})`, letterSpacing:"0.05em", transition:"color 0.4s ease" }}>
                        {opt.sub}
                      </span>
                    )}
                  </div>

                  {/* Sub label */}
                  {filter.id !== "precio" && (
                    <div style={{ fontFamily:"'Helvetica Neue',monospace", fontSize:"0.5rem", fontWeight:300, color:`rgba(${filter.accentRgb},${isSelected ? 0.7 : 0.3})`, letterSpacing:"0.25em", marginBottom:"1.5rem", transition:"color 0.4s ease" }}>
                      {opt.sub}
                    </div>
                  )}

                  {/* Linea separadora */}
                  <div style={{ height:"1px", background:`rgba(${filter.accentRgb},${isSelected ? 0.5 : 0.1})`, margin:"1.5rem 0", transition:"all 0.4s ease", width: isSelected ? "100%" : "40%" }} />

                  {/* Detail */}
                  <div style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", fontWeight:300, color:`rgba(255,255,255,${isSelected ? 0.5 : 0.2})`, letterSpacing:"0.2em", textTransform:"uppercase", lineHeight:1.8, transition:"color 0.4s ease" }}>
                    {opt.detail.split(" · ").map((d, di) => (
                      <div key={di}>{d}</div>
                    ))}
                  </div>

                  {/* Badge esquina superior derecha */}
                  <div style={{ position:"absolute", top:"1.5rem", right:"1.5rem", fontFamily: filter.id === "tipo" ? "'Helvetica Neue',sans-serif" : "Georgia,serif", fontSize:"0.55rem", fontWeight: filter.id === "tipo" ? 400 : 300, color:`rgba(${filter.accentRgb},${isSelected ? 0.8 : 0.15})`, letterSpacing: filter.id === "tipo" ? "0.3em" : "0.1em", transition:"color 0.4s ease" }}>
                    {opt.seats}
                  </div>

                  {/* Indicador seleccionado */}
                  {isSelected && (
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg, ${filter.accent}, transparent)` }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div style={{ position:"absolute", bottom:"2rem", left:"3rem", right:"3rem", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>

            {/* Progress dots */}
            <div style={{ display:"flex", gap:"0.8rem", alignItems:"center" }}>
              {FILTERS.map((_, i) => (
                <div key={i} style={{
                  width: i === activePanel ? "3rem" : "0.4rem",
                  height:"1px",
                  background: i < activePanel ? `rgba(${filter.accentRgb},0.5)` : i === activePanel ? filter.accent : "rgba(255,255,255,0.15)",
                  transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                }} />
              ))}
              <span style={{ color:"rgba(255,255,255,0.2)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", letterSpacing:"0.3em", marginLeft:"0.5rem" }}>
                {activePanel + 1} / {FILTERS.length}
              </span>
            </div>

            {/* CTA final */}
            {allSelected ? (
              <button
                onClick={() => router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                style={{ background:"none", border:`1px solid ${filter.accent}`, color:filter.accent, fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.55rem", letterSpacing:"0.5em", textTransform:"uppercase", padding:"1rem 2.5rem", cursor:"pointer", transition:"all 0.4s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = filter.accent; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = filter.accent; }}
              >
                Discover Properties →
              </button>
            ) : (
              <span style={{ color:"rgba(255,255,255,0.15)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", letterSpacing:"0.4em", textTransform:"uppercase" }}>
                {selected[filter.id] ? "→ next" : "select to continue"}
              </span>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

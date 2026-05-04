"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  locale: string;
}

// ── PANELES DE FILTRO (sustituyen a las propiedades) ──────────────────────
const FILTERS = [
  {
    id: "zona",
    index: "01",
    category: "ZONA",
    accent: "#c9a96e",
    accentRgb: "201,169,110",
    options: [
      { value:"marbella",   label:"Marbella",   sub:"36°30'N 4°53'W", detail:"Golden Mile · Puerto Banús · Sierra Blanca" },
      { value:"estepona",   label:"Estepona",   sub:"36°25'N 5°08'W", detail:"New Golden Mile · Selwo · Marina" },
      { value:"mijas",      label:"Mijas",      sub:"36°35'N 4°38'W", detail:"La Cala · El Chaparral · Calanova" },
      { value:"benahavis",  label:"Benahavís",  sub:"36°31'N 5°02'W", detail:"La Zagaleta · Monte Mayor" },
      { value:"sotogrande", label:"Sotogrande", sub:"36°17'N 5°23'W", detail:"La Reserva · Valderrama" },
    ],
  },
  {
    id: "tipo",
    index: "02",
    category: "TIPO DE INMUEBLE",
    accent: "#a8c4d4",
    accentRgb: "168,196,212",
    options: [
      { value:"villa",     label:"Villa",     sub:"THE ESTATE",  detail:"Privacy · Architecture · Infinity" },
      { value:"apartment", label:"Apartment", sub:"THE SKY",     detail:"Views · Altitude · Prestige" },
      { value:"townhouse", label:"Townhouse", sub:"THE ADDRESS", detail:"Community · Security · Elegance" },
      { value:"plot",      label:"Plot",      sub:"THE CANVAS",  detail:"Raw Land · Your Vision · No Limits" },
    ],
  },
  {
    id: "precio",
    index: "03",
    category: "INVERSIÓN",
    accent: "#e8a87c",
    accentRgb: "232,168,124",
    options: [
      { value:"500k-1m", label:"€500K – 1M", sub:"I",   detail:"Entry to Luxury" },
      { value:"1m-2m",   label:"€1M – 2M",   sub:"II",  detail:"Prime Collection" },
      { value:"2m-5m",   label:"€2M – 5M",   sub:"III", detail:"Ultra Premium" },
      { value:"5m+",     label:"€5M & above", sub:"∞",   detail:"No Limits" },
    ],
  },
];

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skyRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"header" | "filters">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const router = useRouter();
  const SECTION_LENGTH = 1.0;

  const [selected, setSelected] = useState<Record<string, string>>({});

  // --- MOTOR TIPOGRÁFICO ROTATIVO AVANZADO ---
  const [titleIdx, setTitleIdx] = useState(0);

  const dynamicPhrases = [
    { top: "THE APEX OF",     mainLeft: "MEDITERRANEAN", mainRight: "LIVING",  bottom: "ULTRA LUXURY ESTATES" },
    { top: "CURATED FOR",     mainLeft: "UNCOMPROMISING", mainRight: "VISION", bottom: "ARCHITECTURAL POETRY" },
    { top: "WHERE ETERNITY",  mainLeft: "MEETS",         mainRight: "THE SEA", bottom: "COASTAL MASTERPIECES" },
    { top: "REDEFINING",      mainLeft: "MODERN",        mainRight: "OPULENCE",bottom: "EXCLUSIVE SANCTUARIES" },
  ];

  useEffect(() => {
    const titleInterval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % dynamicPhrases.length);
    }, 7000);
    return () => clearInterval(titleInterval);
  }, [dynamicPhrases.length]);

  // ── CLICK = avanzar panel (en lugar de scroll) ──────────────────────────
  const handleSelect = (filterId: string, value: string, currentIdx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (currentIdx < FILTERS.length - 1) {
      // Avanza al siguiente panel — incrementa el progress que controla el Z-Axis
      setTimeout(() => {
        targetProgressRef.current = currentIdx + 1;
      }, 400);
    }
  };

  const handleSearch = () => {
    router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    let cycleTime = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cycleTime += 1 / 60 / 90;
      cycleTime = cycleTime % 1;
      const t = cycleTime;
      const angle = t * 360 - 90;
      const lightFocusX = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const lightFocusY = 50 + Math.sin(angle * Math.PI / 180) * 80;

      const lerpColor = (a: number[], b: number[], k: number) =>
        `rgb(${Math.round(a[0]+(b[0]-a[0])*k)},${Math.round(a[1]+(b[1]-a[1])*k)},${Math.round(a[2]+(b[2]-a[2])*k)})`;

      const palettes = [
        [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
        [[255,245,184],[255,213,79],[79,195,247],[25,118,210],[6,26,58]],
        [[255,167,38],[216,67,21],[106,27,154],[26,18,69],[6,8,24]],
        [[80,40,120],[40,30,80],[26,18,69],[10,10,42],[0,0,0]],
        [[10,10,58],[5,5,36],[2,2,26],[0,0,0],[0,0,0]],
        [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
      ];

      const phaseFloat = t * 5;
      const phaseIdx = Math.floor(phaseFloat) % 5;
      const k = phaseFloat - Math.floor(phaseFloat);
      const pA = palettes[phaseIdx];
      const pB = palettes[phaseIdx + 1];

      const skyGradient = `radial-gradient(ellipse 130% 90% at ${lightFocusX}% ${lightFocusY}%,
        ${lerpColor(pA[0],pB[0],k)} 0%, ${lerpColor(pA[1],pB[1],k)} 12%,
        ${lerpColor(pA[2],pB[2],k)} 30%, ${lerpColor(pA[3],pB[3],k)} 60%,
        ${lerpColor(pA[4],pB[4],k)} 100%)`;
      if (skyRef.current) skyRef.current.style.background = skyGradient;

      if (starsRef.current) {
        let starOp = 0;
        if (t > 0.5 && t < 0.95) starOp = Math.sin(((t - 0.5) / 0.45) * Math.PI);
        starsRef.current.style.opacity = String(starOp);
      }

      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0, ${-smoothHeader * 80}px, 0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }
      if (filtersContainerRef.current) {
        const pOp = Math.max(0, (smoothHeader - 0.4) / 0.6);
        filtersContainerRef.current.style.opacity = String(pOp);
        filtersContainerRef.current.style.pointerEvents = pOp > 0.3 ? "auto" : "none";
      }

      // ── Z-AXIS — IDÉNTICO AL DE TUS PROPIEDADES ──────────────────────
      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.06);
      FILTERS.forEach((_, i) => {
        const el = panelRefs.current[i];
        if (!el) return;
        const dist = progressRef.current - i * SECTION_LENGTH;
        let opacity = 0, scale = 0.4, zPos = -2000, blur = 30;
        if (dist >= -SECTION_LENGTH && dist < -SECTION_LENGTH * 0.3) {
          const tt = (dist + SECTION_LENGTH) / (SECTION_LENGTH * 0.7);
          opacity = tt * tt; scale = 0.4 + tt * 0.6; zPos = -2000 + tt * 2000; blur = 30 - tt * 30;
        } else if (dist >= -SECTION_LENGTH * 0.3 && dist < SECTION_LENGTH * 0.3) {
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else if (dist >= SECTION_LENGTH * 0.3 && dist < SECTION_LENGTH) {
          const tt = (dist - SECTION_LENGTH * 0.3) / (SECTION_LENGTH * 0.7);
          opacity = 1 - tt; scale = 1 + tt * 0.5; zPos = tt * 800; blur = tt * 20;
        } else if (dist >= SECTION_LENGTH) {
          opacity = 0; scale = 1.5; zPos = 800; blur = 20;
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0,0,${zPos}px) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.pointerEvents = opacity > 0.7 ? "auto" : "none";
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── SCROLL solo controla la salida del header — los paneles NO scrollean ─
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      processScroll(delta);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * 1.5;
      touchStartY = e.touches[0].clientY;
      processScroll(delta);
    };

    const processScroll = (delta: number) => {
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current + delta * 0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) phaseRef.current = "filters";
      } else {
        // Solo permite volver al header desde el primer panel
        if (targetProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
        // El scroll NO avanza paneles — el click lo hace
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const stars = Array.from({ length: 80 }, (_, i) => ({
    left: ((i * 37) % 100),
    top: ((i * 71) % 70),
    size: (i % 3 === 0) ? 2 : 1,
    delay: (i * 0.13) % 4,
    bright: i % 5 === 0,
  }));

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}>

      <style>{`
        .stage-perspective { perspective: 1000px; transform-style: preserve-3d; }
        @keyframes revealTopText {
          0% { opacity: 0; transform: translateY(20px); letter-spacing: 0.1em; filter: blur(8px); }
          15% { opacity: 1; transform: translateY(0); letter-spacing: 0.5em; filter: blur(0px); }
          85% { opacity: 1; transform: translateY(0); letter-spacing: 0.6em; filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-20px); letter-spacing: 0.8em; filter: blur(12px); }
        }
        @keyframes slideImpactLeft {
          0% { opacity: 0; transform: translate3d(-100px, 0, -100px) rotateY(15deg); filter: blur(20px); clip-path: inset(0 100% 0 0); }
          15% { opacity: 1; transform: translate3d(0, 0, 0) rotateY(0deg); filter: blur(0px); clip-path: inset(0 0% 0 0); }
          85% { opacity: 1; transform: translate3d(0, 0, 0) rotateY(0deg); filter: blur(0px); clip-path: inset(0 0% 0 0); }
          100% { opacity: 0; transform: translate3d(100px, 0, 100px) rotateY(-15deg); filter: blur(20px); clip-path: inset(0 0 0 100%); }
        }
        @keyframes slideImpactRight {
          0% { opacity: 0; transform: translate3d(100px, 0, 100px) rotateY(-15deg); filter: blur(20px); clip-path: inset(0 0 0 100%); }
          15% { opacity: 1; transform: translate3d(0, 0, 0) rotateY(0deg); filter: blur(0px); clip-path: inset(0 0% 0 0); }
          85% { opacity: 1; transform: translate3d(0, 0, 0) rotateY(0deg); filter: blur(0px); clip-path: inset(0 0% 0 0); }
          100% { opacity: 0; transform: translate3d(-100px, 0, -100px) rotateY(15deg); filter: blur(20px); clip-path: inset(0 100% 0 0); }
        }
        @keyframes revealBottomText {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); filter: blur(10px); }
          20% { opacity: 1; transform: translateY(0) scale(1); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: blur(0px); }
          80% { opacity: 1; transform: translateY(0) scale(1); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-30px) scale(1.05); clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); filter: blur(10px); }
        }
        .anim-top-text { animation: revealTopText 7s cubic-bezier(0.19, 1, 0.22, 1) both; will-change: transform, opacity, filter, letter-spacing; }
        .anim-left-text { animation: slideImpactLeft 7s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity, filter, clip-path; }
        .anim-right-text { animation: slideImpactRight 7s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity, filter, clip-path; }
        .anim-bottom-text { animation: revealBottomText 7s cubic-bezier(0.25, 1, 0.5, 1) both; will-change: transform, opacity, filter, clip-path; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.4s; }
        @keyframes masterBloom {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 50px rgba(201, 169, 110, 0.1)); }
          50% { filter: drop-shadow(0 0 35px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 80px rgba(201, 169, 110, 0.25)); }
        }
        .master-glow { animation: masterBloom 8s ease-in-out infinite; mix-blend-mode: screen; }
        @keyframes uiFadeIn {
          0% { opacity: 0; filter: blur(10px); transform: translateY(15px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        .ui-enter { animation: uiFadeIn 2.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.5); }
        }
        .star { animation: starTwinkle ease-in-out infinite; }
        .filter-opt { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
        .filter-opt:hover { background: rgba(255,255,255,0.04) !important; transform: translateY(-4px); }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div ref={headerRef} style={{
        position: "absolute", inset: 0, zIndex: 20,
        willChange: "opacity, transform",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>

        <div ref={skyRef} style={{ position: "absolute", inset: 0, transition: "background 0.1s linear" }} />

        <div ref={starsRef} style={{ position: "absolute", inset: 0, opacity: 0, pointerEvents: "none", transition: "opacity 0.5s ease" }}>
          {stars.map((s, i) => (
            <div key={i} className="star" style={{
              position: "absolute", left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`,
              borderRadius: "50%", background: s.bright ? "rgba(255,255,255,1)" : "rgba(220,230,255,0.7)",
              boxShadow: s.bright ? "0 0 4px rgba(255,255,255,0.8)" : "none",
              animationDuration: `${2 + s.delay}s`, animationDelay: `${s.delay}s`,
            }} />
          ))}
        </div>

        <div className="stage-perspective master-glow" style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", padding: "0 2rem",
          userSelect: "none", width: "100%",
        }}>
          <div key={titleIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="anim-top-text" style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontSize: "clamp(0.6rem, 1vw, 0.9rem)",
              fontWeight: 300, color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase", margin: "0 0 1.5rem 0", textAlign: "center"
            }}>
              {dynamicPhrases[titleIdx].top}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "wrap", lineHeight: 0.85, padding: "10px 0", gap: "0.15em" }}>
              <span className="anim-left-text delay-1" style={{
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "clamp(3rem, 9vw, 9rem)", fontWeight: 100,
                color: "transparent", WebkitTextStroke: "1px rgba(255, 255, 255, 0.95)",
                letterSpacing: "-0.01em", transformOrigin: "right center"
              }}>{dynamicPhrases[titleIdx].mainLeft}</span>
              <span className="anim-right-text delay-2" style={{
                fontFamily: "'Playfair Display', 'Didot', 'Bodoni MT', serif",
                fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 700,
                fontStyle: "italic", color: "#ffffff",
                letterSpacing: "-0.04em", transformOrigin: "left center"
              }}>{dynamicPhrases[titleIdx].mainRight}</span>
            </div>
            <p className="anim-bottom-text delay-3" style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 400, fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
              textTransform: "uppercase", color: "#c9a96e",
              margin: "2.5rem 0 0 0", textAlign: "center", letterSpacing: "0.4em"
            }}>{dynamicPhrases[titleIdx].bottom}</p>
          </div>

          <div className="ui-enter" style={{ width: "1px", height: "4rem", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)", margin: "3rem 0 2rem", animationDelay: "1.5s" }} />

          <div className="ui-enter" style={{
            display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontSize: "clamp(0.45rem, 0.65vw, 0.6rem)", fontWeight: 400,
            letterSpacing: "0.35em", textTransform: "uppercase", animationDelay: "1.7s"
          }}>
            {["Golden Mile", "Puerto Banús", "Nueva Andalucía", "Sierra Blanca"].map((loc, i, arr) => (
              <span key={loc} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                {loc}
                {i < arr.length - 1 && <span style={{ fontFamily: "'Playfair Display', serif", color: "rgba(201, 169, 110, 0.6)", fontSize: "1.2em" }}>✦</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="ui-enter" style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", pointerEvents: "none", zIndex: 20, animationDelay: "2s" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.45rem", letterSpacing: "0.6em", fontFamily: "'Helvetica Neue', 'Inter', sans-serif", fontWeight: 300, textTransform: "uppercase" }}>DISCOVER</span>
        </div>
      </div>

      {/* ── PANELES DE FILTRO Z-AXIS — sustituyen las propiedades ──────── */}
      <div ref={filtersContainerRef} style={{
        position: "absolute", inset: 0, opacity: 0, pointerEvents: "none",
        perspective: "1200px", perspectiveOrigin: "center center",
        background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
      }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          {FILTERS.map((filter, i) => (
            <div
              key={filter.id}
              ref={(el) => { panelRefs.current[i] = el; }}
              style={{
                position: "absolute", top: "50%", left: "50%",
                width: "85vw", height: "80vh",
                marginLeft: "-42.5vw", marginTop: "-40vh",
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
                background: `linear-gradient(135deg, rgba(${filter.accentRgb},0.04) 0%, rgba(0,0,0,0.95) 100%)`,
                border: `1px solid rgba(${filter.accentRgb},0.15)`,
                boxShadow: `inset 0 0 100px rgba(${filter.accentRgb},0.05), 0 0 80px rgba(${filter.accentRgb},0.08)`,
              }}
            >
              {/* Cuadricula arquitectonica */}
              <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.04 }}>
                {[...Array(8)].map((_, k) => <div key={k} style={{ position:"absolute", left:`${k*14.28}%`, top:0, bottom:0, width:"1px", background:"white" }} />)}
                {[...Array(6)].map((_, k) => <div key={k} style={{ position:"absolute", top:`${k*20}%`, left:0, right:0, height:"1px", background:"white" }} />)}
              </div>

              {/* Numero gigante de fondo */}
              <div style={{
                position: "absolute", top: "-5%", left: "-3%",
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "clamp(8rem, 20vw, 16rem)", fontWeight: 100,
                color: "transparent",
                WebkitTextStroke: `1px rgba(${filter.accentRgb}, 0.2)`,
                letterSpacing: "-0.05em", lineHeight: 1,
                pointerEvents: "none", userSelect: "none"
              }}>
                {filter.index}
              </div>

              {/* Volumen esquina superior derecha */}
              <div style={{
                position: "absolute", top: "2.5rem", right: "2.5rem",
                color: `rgba(${filter.accentRgb}, 0.7)`,
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "0.55rem", fontWeight: 300, letterSpacing: "0.5em",
              }}>
                VOL. {filter.index}
              </div>

              {/* Categoria */}
              <div style={{ position:"absolute", top:"3rem", left:"3rem" }}>
                <p style={{
                  fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                  fontSize: "0.55rem", fontWeight: 300, letterSpacing: "0.5em",
                  color: filter.accent, textTransform: "uppercase", margin: 0
                }}>
                  {filter.category}
                </p>
                <div style={{ height:"1px", width:"3rem", background:filter.accent, marginTop:"0.6rem" }} />
              </div>

              {/* OPCIONES */}
              <div style={{
                position:"absolute", bottom:"3rem", left:"3rem", right:"3rem",
                display: "grid",
                gridTemplateColumns: filter.options.length === 5 ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
                gap: "1px",
                borderTop: `1px solid rgba(${filter.accentRgb},0.15)`,
              }}>
                {filter.options.map((opt) => {
                  const isSel = selected[filter.id] === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className="filter-opt"
                      onClick={() => handleSelect(filter.id, opt.value, i)}
                      style={{
                        padding: "2.5rem 1.8rem",
                        borderRight: `1px solid rgba(${filter.accentRgb},0.1)`,
                        background: isSel ? `rgba(${filter.accentRgb},0.08)` : "transparent",
                        boxShadow: isSel ? `inset 0 0 40px rgba(${filter.accentRgb},0.1)` : "none",
                        position: "relative",
                      }}
                    >
                      {/* Sub */}
                      <div style={{
                        fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                        fontSize: "0.45rem", fontWeight: 300,
                        color: `rgba(${filter.accentRgb},${isSel?0.9:0.4})`,
                        letterSpacing: "0.4em", marginBottom: "1.2rem",
                      }}>
                        {opt.sub}
                      </div>

                      {/* Label */}
                      <h3 style={{
                        fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                        fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                        fontWeight: 200,
                        textTransform: "uppercase",
                        color: isSel ? "#ffffff" : "rgba(255,255,255,0.6)",
                        letterSpacing: "0.02em",
                        lineHeight: 1.1,
                        margin: "0 0 1rem"
                      }}>
                        {opt.label}
                      </h3>

                      {/* Linea */}
                      <div style={{
                        height:"1px",
                        width: isSel ? "100%" : "30%",
                        background: isSel ? filter.accent : `rgba(${filter.accentRgb},0.2)`,
                        marginBottom:"1rem",
                        transition: "all 0.4s ease"
                      }} />

                      {/* Detail */}
                      <p style={{
                        fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                        fontSize: "0.45rem", fontWeight: 300,
                        color: isSel ? `rgba(${filter.accentRgb},0.9)` : "rgba(255,255,255,0.3)",
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        lineHeight: 1.7, margin: 0,
                      }}>
                        {opt.detail}
                      </p>

                      {isSel && (
                        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg, ${filter.accent}, transparent)` }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA final solo en el último panel */}
              {i === FILTERS.length - 1 && allSelected && (
                <button
                  onClick={handleSearch}
                  style={{
                    position:"absolute", bottom:"3rem", right:"3rem",
                    background:"none",
                    border:`1px solid ${filter.accent}`,
                    color:filter.accent,
                    fontFamily:"'Helvetica Neue', 'Inter', sans-serif",
                    fontSize:"0.55rem", letterSpacing:"0.5em",
                    textTransform:"uppercase", padding:"1rem 2.5rem",
                    cursor:"pointer", transition:"all 0.4s ease",
                    zIndex: 20,
                  }}
                >
                  Discover Properties →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

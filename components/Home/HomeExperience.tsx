"use client";
import { useEffect, useRef, useState } from "react";
import { Property } from "@/types/property";
import { useRouter } from "next/navigation";

interface Props {
  properties: Property[];
  locale: string;
}

export default function HomeExperience({ properties, locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const propertyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skyRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"header" | "properties">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const router = useRouter();
  const lang = locale as "es" | "en" | "fr" | "ru";
  const SECTION_LENGTH = 1.0;
  
  const [skyTime, setSkyTime] = useState(0); 

  // --- MOTOR TIPOGRÁFICO ROTATIVO AVANZADO ---
  const [titleIdx, setTitleIdx] = useState(0);
  
  const dynamicPhrases = [
    { 
      top: "THE APEX OF", 
      mainLeft: "MEDITERRANEAN", 
      mainRight: "LIVING", 
      bottom: "ULTRA LUXURY ESTATES" 
    },
    { 
      top: "CURATED FOR", 
      mainLeft: "UNCOMPROMISING", 
      mainRight: "VISION", 
      bottom: "ARCHITECTURAL POETRY" 
    },
    { 
      top: "WHERE ETERNITY", 
      mainLeft: "MEETS", 
      mainRight: "THE SEA", 
      bottom: "COASTAL MASTERPIECES" 
    },
    { 
      top: "REDEFINING", 
      mainLeft: "MODERN", 
      mainRight: "OPULENCE", 
      bottom: "EXCLUSIVE SANCTUARIES" 
    }
  ];

  useEffect(() => {
    const titleInterval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % dynamicPhrases.length);
    }, 7000);
    return () => clearInterval(titleInterval);
  }, [dynamicPhrases.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    let cycleTime = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // CICLO ATMOSFÉRICO 360
      cycleTime += 1 / 60 / 90; 
      cycleTime = cycleTime % 1;

      const t = cycleTime;
      // Mantenemos el cálculo del ángulo para el punto focal de luz (sin renderizar el orbe)
      const angle = t * 360 - 90; 
      const lightFocusX = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const lightFocusY = 50 + Math.sin(angle * Math.PI / 180) * 80;

      const lerpColor = (a: number[], b: number[], k: number) =>
        `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)}, ${Math.round(a[1] + (b[1] - a[1]) * k)}, ${Math.round(a[2] + (b[2] - a[2]) * k)})`;

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

      const c0 = lerpColor(pA[0], pB[0], k);
      const c1 = lerpColor(pA[1], pB[1], k);
      const c2 = lerpColor(pA[2], pB[2], k);
      const c3 = lerpColor(pA[3], pB[3], k);
      const c4 = lerpColor(pA[4], pB[4], k);

      const skyGradient = `radial-gradient(ellipse 130% 90% at ${lightFocusX}% ${lightFocusY}%,
        ${c0} 0%, ${c1} 12%, ${c2} 30%, ${c3} 60%, ${c4} 100%)`;

      if (skyRef.current) skyRef.current.style.background = skyGradient;

      // ESTRELLAS (Aparición profunda en la noche)
      if (starsRef.current) {
        let starOp = 0;
        if (t > 0.5 && t < 0.95) {
          const nightT = (t - 0.5) / 0.45;
          starOp = Math.sin(nightT * Math.PI);
        }
        starsRef.current.style.opacity = String(starOp);
      }

      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0, ${-smoothHeader * 80}px, 0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }
      if (propertiesRef.current) {
        const pOp = Math.max(0, (smoothHeader - 0.4) / 0.6);
        propertiesRef.current.style.opacity = String(pOp);
        propertiesRef.current.style.pointerEvents = pOp > 0.3 ? "auto" : "none";
      }

      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.06);
      properties.forEach((_, i) => {
        const el = propertyRefs.current[i];
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

    // --- LÓGICA DE SCROLL (DESKTOP) ---
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      processScroll(delta);
    };

    // --- LÓGICA DE SCROLL (MÓVIL / TÁCTIL) ---
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const delta = (touchStartY - touchY) * 1.5; 
      touchStartY = touchY; 
      processScroll(delta);
    };

    const processScroll = (delta: number) => {
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current + delta * 0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) phaseRef.current = "properties";
      } else {
        if (targetProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
        targetProgressRef.current = Math.max(0, Math.min(
          (properties.length - 1) * SECTION_LENGTH,
          targetProgressRef.current + delta * 0.0008
        ));
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
  }, [properties.length]);

  const stars = Array.from({ length: 80 }, (_, i) => ({
    left: ((i * 37) % 100),
    top: ((i * 71) % 70),
    size: (i % 3 === 0) ? 2 : 1,
    delay: (i * 0.13) % 4,
    bright: i % 5 === 0,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}>

      <style>{`
        /* --- ORQUESTACIÓN CINEMÁTICA Y REFRACCIÓN TIPOGRÁFICA --- */
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

        {/* CONTENIDO TIPOGRÁFICO DE ALTO IMPACTO (COREOGRAFÍA) */}
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
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              margin: "0 0 1.5rem 0",
              textAlign: "center"
            }}>
              {dynamicPhrases[titleIdx].top}
            </p>

            <div style={{ 
              display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "wrap",
              lineHeight: 0.85, padding: "10px 0", gap: "0.15em"
            }}>
              <span className="anim-left-text delay-1" style={{
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "clamp(3rem, 9vw, 9rem)",
                fontWeight: 100,
                color: "transparent",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.95)",
                letterSpacing: "-0.01em",
                transformOrigin: "right center"
              }}>
                {dynamicPhrases[titleIdx].mainLeft}
              </span>
              
              <span className="anim-right-text delay-2" style={{
                fontFamily: "'Playfair Display', 'Didot', 'Bodoni MT', serif",
                fontSize: "clamp(3.5rem, 10vw, 10rem)", 
                fontWeight: 700,
                fontStyle: "italic",
                color: "#ffffff",
                letterSpacing: "-0.04em",
                transformOrigin: "left center"
              }}>
                {dynamicPhrases[titleIdx].mainRight}
              </span>
            </div>

            {/* TEXTO INFERIOR: Estructura limpia (Sin cursiva, Sans-Serif) */}
            <p className="anim-bottom-text delay-3" style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.65rem, 1vw, 0.85rem)",
              textTransform: "uppercase",
              color: "#c9a96e", 
              margin: "2.5rem 0 0 0",
              textAlign: "center",
              letterSpacing: "0.4em"
            }}>
              {dynamicPhrases[titleIdx].bottom}
            </p>
          </div>

          <div className="ui-enter" style={{
            width: "1px", height: "4rem",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
            margin: "3rem 0 2rem",
            animationDelay: "1.5s"
          }} />

          <div className="ui-enter" style={{
            display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontSize: "clamp(0.45rem, 0.65vw, 0.6rem)",
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            animationDelay: "1.7s"
          }}>
            {["Golden Mile", "Puerto Banús", "Nueva Andalucía", "Sierra Blanca"].map((loc, i, arr) => (
              <span key={loc} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                {loc}
                {i < arr.length - 1 && (
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "rgba(201, 169, 110, 0.6)", 
                    fontSize: "1.2em",
                  }}>✦</span>
                )}
              </span>
            ))}
          </div>

        </div>

        <div className="ui-enter" style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem",
          pointerEvents: "none", zIndex: 20,
          animationDelay: "2s"
        }}>
          <span style={{
            color: "rgba(255,255,255,0.4)", fontSize: "0.45rem",
            letterSpacing: "0.6em", fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 300, textTransform: "uppercase",
          }}>DISCOVER</span>
        </div>
      </div>

      {/* ── PROPIEDADES Z-AXIS (CATÁLOGO ARQUITECTÓNICO PURO) ──────── */}
      <div ref={propertiesRef} style={{
        position: "absolute", inset: 0, opacity: 0, pointerEvents: "none",
        perspective: "1200px", perspectiveOrigin: "center center",
        background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
      }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          {properties.map((property, i) => (
            <div
              key={property.id}
              ref={(el) => { propertyRefs.current[i] = el; }}
              onClick={() => router.push(`/${locale}/propiedades/${property.slug}`)}
              style={{
                position: "absolute", top: "50%", left: "50%",
                width: "70vw", height: "75vh",
                marginLeft: "-35vw", marginTop: "-37.5vh",
                transformStyle: "preserve-3d", cursor: "pointer",
                willChange: "transform, opacity, filter",
              }}
            >
              <video
                src={property.video_url} muted playsInline autoPlay loop
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2px" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.95) 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
                pointerEvents: "none",
              }} />
              
              {/* NÚMERO BRUTALISTA DE FONDO */}
              <div style={{
                position: "absolute", top: "-5%", left: "-3%",
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "clamp(8rem, 20vw, 16rem)", 
                fontWeight: 100, 
                color: "transparent",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)",
                letterSpacing: "-0.05em", 
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none"
              }}>
                0{i + 1}
              </div>

              <div style={{
                position: "absolute", top: "2.5rem", right: "2.5rem",
                color: "rgba(255,255,255,0.6)", fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "0.55rem", fontWeight: 300, letterSpacing: "0.5em",
              }}>
                VOL. 0{i + 1}
              </div>

              <div style={{
                position: "absolute", bottom: "3rem",
                left: "3rem", right: "3rem",
                display: "flex", flexDirection: "column"
              }}>
                <p style={{ 
                  fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                  fontSize: "0.55rem", fontWeight: 300, letterSpacing: "0.4em", 
                  color: "#c9a96e", textTransform: "uppercase", margin: "0 0 1.2rem" 
                }}>
                  {property.ubicacion}
                </p>
                
                {/* TÍTULO LIMPIO: Sin cursivas, Sans-Serif moderna y mayúsculas */}
                <h2 style={{ 
                  fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)", 
                  fontWeight: 300, 
                  textTransform: "uppercase",
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                  lineHeight: 1.1, margin: "0 0 2rem" 
                }}>
                  {property.titulo[lang]}
                </h2>
                
                <div style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.5rem"
                }}>
                  
                  {/* PRECIO LIMPIO: Todo en Sans-Serif */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                    <span style={{ 
                      fontFamily: "'Helvetica Neue', 'Inter', sans-serif", 
                      fontWeight: 300, fontSize: "1.2rem", color: "#c9a96e" 
                    }}>€</span>
                    <p style={{ 
                      fontFamily: "'Helvetica Neue', 'Inter', sans-serif", 
                      color: "white", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", 
                      fontWeight: 200, letterSpacing: "0.05em", margin: 0 
                    }}>
                      {(property.precio / 1000000).toFixed(1)}
                      <span style={{ 
                        color: "#c9a96e", fontSize: "0.7em", fontWeight: 300, marginLeft: "0.2rem" 
                      }}>M</span>
                    </p>
                  </div>
                  
                  {/* EXPLORE LINK: Flecha limpia */}
                  <span style={{ 
                    fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                    fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.4em", 
                    color: "#ffffff", textTransform: "uppercase",
                    display: "flex", alignItems: "center", gap: "0.8rem",
                  }}>
                    DISCOVER 
                    <span style={{ color: "#c9a96e", fontSize: "1.5em", fontWeight: 300 }}>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

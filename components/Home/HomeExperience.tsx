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
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"header" | "properties">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const router = useRouter();
  const lang = locale as "es" | "en" | "fr" | "ru";
  const SECTION_LENGTH = 1.0;
  const [skyTime, setSkyTime] = useState(0); // 0 a 1 = ciclo completo

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    let cycleTime = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // CICLO SOLAR 360 — duracion 60 segundos
      cycleTime += 1 / 60 / 90; // 1 frame / 60fps / 90s
      cycleTime = cycleTime % 1;

      // Calcular el cielo segun la fase del ciclo
      // 0.0 = amanecer | 0.25 = mediodia | 0.5 = atardecer | 0.75 = medianoche | 1.0 = amanecer
      const t = cycleTime;
      const angle = t * 360 - 90; // sol arranca abajo izquierda
      const sunX = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const sunY = 50 + Math.sin(angle * Math.PI / 180) * 80;

      // Determinar si es de dia o de noche
      const isNight = t > 0.5;
      const nightProgress = isNight ? (t - 0.5) * 2 : 0; // 0 a 1 durante la noche

      // Interpolacion suave entre 6 fases del ciclo solar
      // Definimos paletas como puntos clave y blendeamos
      const lerpColor = (a: number[], b: number[], k: number) =>
        `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)}, ${Math.round(a[1] + (b[1] - a[1]) * k)}, ${Math.round(a[2] + (b[2] - a[2]) * k)})`;

      // 6 fases con 5 colores cada una (de cerca al sol al fondo)
      const palettes = [
        // 0.0 AMANECER
        [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
        // 0.2 MEDIODIA TEMPRANO
        [[255,245,184],[255,213,79],[79,195,247],[25,118,210],[6,26,58]],
        // 0.4 ATARDECER
        [[255,167,38],[216,67,21],[106,27,154],[26,18,69],[6,8,24]],
        // 0.6 CREPUSCULO
        [[80,40,120],[40,30,80],[26,18,69],[10,10,42],[0,0,0]],
        // 0.8 NOCHE PROFUNDA
        [[10,10,58],[5,5,36],[2,2,26],[0,0,0],[0,0,0]],
        // 1.0 = vuelta a 0.0 (amanecer)
        [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
      ];

      // Calcular fase actual y k de interpolacion
      const phaseFloat = t * 5; // 0-5 (5 transiciones, vuelve al inicio)
      const phaseIdx = Math.floor(phaseFloat) % 5;
      const k = phaseFloat - Math.floor(phaseFloat);
      const pA = palettes[phaseIdx];
      const pB = palettes[phaseIdx + 1];

      const c0 = lerpColor(pA[0], pB[0], k);
      const c1 = lerpColor(pA[1], pB[1], k);
      const c2 = lerpColor(pA[2], pB[2], k);
      const c3 = lerpColor(pA[3], pB[3], k);
      const c4 = lerpColor(pA[4], pB[4], k);

      const skyGradient = `radial-gradient(ellipse 130% 90% at ${sunX}% ${sunY}%,
        ${c0} 0%,
        ${c1} 12%,
        ${c2} 30%,
        ${c3} 60%,
        ${c4} 100%)`;

      if (skyRef.current) skyRef.current.style.background = skyGradient;

      // SOL — visible solo durante el dia con fade suave
      if (sunRef.current) {
        let sunVisible = 0;
        if (t < 0.45) sunVisible = 1;
        else if (t < 0.55) sunVisible = 1 - (t - 0.45) / 0.10;
        else if (t > 0.95) sunVisible = (t - 0.95) / 0.05;
        sunRef.current.style.opacity = String(sunVisible);
        sunRef.current.style.left = `${sunX}%`;
        sunRef.current.style.top = `${sunY}%`;
      }

      // LUNA — fade suave en transiciones
      if (moonRef.current) {
        let moonVisible = 0;
        if (t > 0.55 && t < 0.95) {
          if (t < 0.65) moonVisible = (t - 0.55) / 0.10;
          else if (t > 0.85) moonVisible = 1 - (t - 0.85) / 0.10;
          else moonVisible = 1;
        }
        // Luna recorre el cielo en sentido opuesto
        const moonAngle = (t - 0.5) * 2 * 180 - 90;
        const moonX = 50 + Math.cos(moonAngle * Math.PI / 180) * 35;
        const moonY = 30 + Math.sin(moonAngle * Math.PI / 180) * 20;
        moonRef.current.style.opacity = String(moonVisible);
        moonRef.current.style.left = `${moonX}%`;
        moonRef.current.style.top = `${moonY}%`;
      }

      // ESTRELLAS — opacidad segun la profundidad de la noche
      if (starsRef.current) {
        let starOp = 0;
        if (t > 0.5 && t < 0.95) {
          // Pico de visibilidad en medianoche
          const nightT = (t - 0.5) / 0.45;
          starOp = Math.sin(nightT * Math.PI);
        }
        starsRef.current.style.opacity = String(starOp);
      }

      // ── HEADER FADE OUT al hacer scroll ──────────────────────────────────
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

      // ── PROPIEDADES Z-AXIS ───────────────────────────────────────────────
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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
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
    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [properties.length]);

  // Generar 80 estrellas con posiciones aleatorias estables
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
        /* --- HIGH-END TYPOGRAPHY ANIMATIONS --- */
        @keyframes cinematicBlurIn {
          0% { filter: blur(20px); opacity: 0; transform: scale(1.05) translateY(15px); }
          100% { filter: blur(0px); opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes letterSpacingBreathe {
          0% { letter-spacing: 0.8em; opacity: 0; }
          10% { opacity: 1; }
          100% { letter-spacing: 0.4em; opacity: 0.8; }
        }
        @keyframes liquidMaskReveal {
          0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); transform: translateY(30px); }
          100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateY(0); }
        }
        @keyframes elegantGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(201, 169, 110, 0.2), 0 0 60px rgba(201, 169, 110, 0.05); }
          50% { text-shadow: 0 0 50px rgba(201, 169, 110, 0.5), 0 0 90px rgba(201, 169, 110, 0.2); }
        }
        @keyframes lineGrowCenter {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes subtleFade { 0%,100% { opacity: 0.2; } 50% { opacity: 0.7; } }
        
        .typo-cinematic { animation: cinematicBlurIn 2s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .typo-breathe { animation: letterSpacingBreathe 3s cubic-bezier(0.215, 0.61, 0.355, 1) both; }
        .typo-liquid { animation: liquidMaskReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .typo-glow { animation: elegantGlow 5s ease-in-out infinite; }
        .line-elegant { animation: lineGrowCenter 1.5s cubic-bezier(0.85, 0, 0.15, 1) both; transform-origin: center; }
        .scroll-pulse { animation: subtleFade 3s ease-in-out infinite; }
        
        /* Delays */
        .del-1 { animation-delay: 0.2s; }
        .del-2 { animation-delay: 0.6s; }
        .del-3 { animation-delay: 1.0s; }
        .del-4 { animation-delay: 1.4s; }

        /* Original Environment Animations */
        @keyframes sunGlow {
          0%, 100% { box-shadow: 0 0 30px 8px rgba(255,200,100,0.5), 0 0 60px 18px rgba(255,140,40,0.2); }
          50%       { box-shadow: 0 0 45px 12px rgba(255,220,140,0.7), 0 0 80px 25px rgba(255,160,60,0.3); }
        }
        @keyframes moonGlow {
          0%, 100% { box-shadow: 0 0 40px 10px rgba(220,230,255,0.4), 0 0 80px 20px rgba(180,200,255,0.2); }
          50%       { box-shadow: 0 0 60px 15px rgba(240,245,255,0.6), 0 0 120px 30px rgba(200,220,255,0.3); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.5); }
        }
        .sun-orb { animation: sunGlow 4s ease-in-out infinite; }
        .moon-orb { animation: moonGlow 5s ease-in-out infinite; }
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

        {/* CIELO DINAMICO */}
        <div ref={skyRef} style={{
          position: "absolute", inset: 0,
          transition: "background 0.1s linear",
        }} />

        {/* ESTRELLAS */}
        <div ref={starsRef} style={{
          position: "absolute", inset: 0,
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.5s ease",
        }}>
          {stars.map((s, i) => (
            <div key={i} className="star" style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "50%",
              background: s.bright ? "rgba(255,255,255,1)" : "rgba(220,230,255,0.7)",
              boxShadow: s.bright ? "0 0 4px rgba(255,255,255,0.8)" : "none",
              animationDuration: `${2 + s.delay}s`,
              animationDelay: `${s.delay}s`,
            }} />
          ))}
        </div>

        {/* SOL */}
        <div ref={sunRef} className="sun-orb" style={{
          position: "absolute", width: "80px", height: "80px", borderRadius: "50%",
          background: "radial-gradient(circle, #fff5b8 0%, #ffd54f 40%, #ff8c00 80%, transparent 100%)",
          transform: "translate(-50%, -50%)", pointerEvents: "none", transition: "opacity 1s ease",
        }} />

        {/* LUNA */}
        <div ref={moonRef} className="moon-orb" style={{
          position: "absolute", width: "100px", height: "100px", borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f4ff 40%, #c8d4f0 70%, #8090b0 100%)",
          transform: "translate(-50%, -50%)", pointerEvents: "none", opacity: 0, transition: "opacity 1s ease",
        }}>
          <div style={{ position: "absolute", top: "30%", left: "25%", width: "12px", height: "12px", borderRadius: "50%", background: "rgba(120,140,170,0.4)" }} />
          <div style={{ position: "absolute", top: "55%", left: "55%", width: "8px", height: "8px", borderRadius: "50%", background: "rgba(120,140,170,0.3)" }} />
          <div style={{ position: "absolute", top: "20%", left: "60%", width: "6px", height: "6px", borderRadius: "50%", background: "rgba(120,140,170,0.35)" }} />
          <div style={{ position: "absolute", top: "65%", left: "20%", width: "10px", height: "10px", borderRadius: "50%", background: "rgba(120,140,170,0.3)" }} />
        </div>

        {/* CONTENIDO TIPOGRAFICO DE ALTO IMPACTO (BRUTALISMO EDITORIAL) */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", padding: "0 2rem",
          userSelect: "none"
        }}>
          <div className="line-elegant del-1" style={{
            width: "1px", height: "4rem",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
            marginBottom: "2rem",
          }} />

          <p className="typo-breathe del-1" style={{
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontSize: "clamp(0.5rem, 0.8vw, 0.75rem)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            margin: "0 0 1rem",
          }}>
            The Apex Of Mediterranean Living
          </p>

          <div style={{ overflow: "hidden", padding: "10px 0" }}>
            <div className="typo-liquid del-2 typo-glow" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.15em",
              lineHeight: 0.8,
            }}>
              {/* Tensión tipográfica: Outline Sans vs Solid Serif Italic */}
              <span style={{
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "clamp(4.5rem, 12vw, 11rem)",
                fontWeight: 200,
                color: "transparent",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.9)",
                letterSpacing: "0.02em"
              }}>MAR</span>
              <span style={{
                fontFamily: "'Playfair Display', 'Didot', 'Bodoni MT', serif",
                fontSize: "clamp(5rem, 13vw, 12rem)",
                fontWeight: 700,
                fontStyle: "italic",
                color: "#ffffff",
                letterSpacing: "-0.04em",
                paddingRight: "0.1em"
              }}>BELLA</span>
            </div>
          </div>

          <p className="typo-cinematic del-3" style={{
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontSize: "clamp(0.65rem, 1vw, 0.9rem)",
            fontWeight: 300, letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.5)",
            margin: "2rem 0 3rem",
            textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <span style={{ 
              fontFamily: "'Playfair Display', 'Didot', serif", 
              fontStyle: "italic", 
              color: "#c9a96e", 
              fontSize: "1.2em",
              textTransform: "lowercase",
              letterSpacing: "0.05em"
            }}>curated</span> 
            Estates Of Uncompromising Vision
          </p>

          <div className="typo-cinematic del-4" style={{
            display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "center",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontSize: "clamp(0.4rem, 0.6vw, 0.55rem)",
            fontWeight: 400,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}>
            {["Golden Mile", "Puerto Banús", "Nueva Andalucía", "Sierra Blanca"].map((loc, i, arr) => (
              <span key={loc} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {loc}
                {i < arr.length - 1 && (
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#c9a96e",
                    fontSize: "1.2em",
                    opacity: 0.6
                  }}>✦</span>
                )}
              </span>
            ))}
          </div>

          <div className="line-elegant del-4" style={{
            width: "1px", height: "4rem",
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
            marginTop: "2rem",
          }} />
        </div>

        <div style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "1rem",
          pointerEvents: "none", zIndex: 20,
        }}>
          <span className="scroll-pulse" style={{
            color: "rgba(255,255,255,0.6)", fontSize: "0.45rem",
            letterSpacing: "0.6em", fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 300, textTransform: "uppercase",
          }}>DISCOVER</span>
        </div>
      </div>

      {/* ── PROPIEDADES Z-AXIS ───────────────────────────────────────── */}
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
              
              {/* Numeración Brutalista/Editorial */}
              <div style={{
                position: "absolute", top: "-2rem", left: "-1rem",
                color: "rgba(255,255,255,0.08)", 
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontSize: "clamp(6rem, 15vw, 12rem)", 
                fontWeight: 100, 
                letterSpacing: "-0.05em", 
                lineHeight: 1,
                pointerEvents: "none"
              }}>
                0{i + 1}
              </div>

              <div style={{
                position: "absolute", top: "2.5rem", right: "2.5rem",
                color: "#c9a96e", fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: "0.55rem", fontWeight: 300, letterSpacing: "0.4em", opacity: 0.8,
              }}>
                VOL. 0{i + 1}
              </div>

              {/* Info de Propiedad */}
              <div style={{
                position: "absolute", bottom: "3rem",
                left: "3rem", right: "3rem",
                color: "white", 
                display: "flex", flexDirection: "column"
              }}>
                <p style={{ 
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontSize: "0.55rem", fontWeight: 400, letterSpacing: "0.5em", 
                  opacity: 0.6, textTransform: "uppercase", margin: "0 0 1rem" 
                }}>
                  {property.ubicacion}
                </p>
                <h2 style={{ 
                  fontFamily: "'Playfair Display', 'Didot', serif",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)", 
                  fontWeight: 400, fontStyle: "italic", 
                  lineHeight: 1.05, margin: "0 0 1.5rem" 
                }}>
                  {property.titulo[lang]}
                </h2>
                
                <div style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem"
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                    <span style={{ fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 200, fontSize: "1rem", color: "#c9a96e" }}>€</span>
                    <p style={{ 
                      fontFamily: "'Helvetica Neue', sans-serif", 
                      color: "white", fontSize: "clamp(1.2rem, 2vw, 1.6rem)", 
                      fontWeight: 200, letterSpacing: "0.05em", margin: 0 
                    }}>
                      {(property.precio / 1000000).toFixed(1)}<span style={{ color: "#c9a96e", fontSize: "0.8em" }}>M</span>
                    </p>
                  </div>
                  <span style={{ 
                    fontFamily: "'Helvetica Neue', sans-serif",
                    fontSize: "0.55rem", fontWeight: 500, letterSpacing: "0.3em", 
                    color: "#c9a96e", textTransform: "uppercase",
                    display: "flex", alignItems: "center", gap: "0.5rem"
                  }}>
                    Explore <span style={{ fontSize: "1.2em" }}>→</span>
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

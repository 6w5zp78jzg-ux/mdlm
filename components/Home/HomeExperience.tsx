"use client";
import { useEffect, useRef } from "react";
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
  const phaseRef = useRef<"header" | "properties">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const router = useRouter();
  const lang = locale as "es" | "en" | "fr" | "ru";
  const SECTION_LENGTH = 1.0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
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
          const t = (dist + SECTION_LENGTH) / (SECTION_LENGTH * 0.7);
          opacity = t * t; scale = 0.4 + t * 0.6; zPos = -2000 + t * 2000; blur = 30 - t * 30;
        } else if (dist >= -SECTION_LENGTH * 0.3 && dist < SECTION_LENGTH * 0.3) {
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else if (dist >= SECTION_LENGTH * 0.3 && dist < SECTION_LENGTH) {
          const t = (dist - SECTION_LENGTH * 0.3) / (SECTION_LENGTH * 0.7);
          opacity = 1 - t; scale = 1 + t * 0.5; zPos = t * 800; blur = t * 20;
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

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}>

      <style>{`
        @keyframes sunriseShift {
          0%   { background-position: 0% 100%; }
          50%  { background-position: 100% 0%; }
          100% { background-position: 0% 100%; }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(-120vh) translateX(40px); opacity: 0; }
        }
        @keyframes lineGrow {
          0%   { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes wordReveal {
          0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
          100% { clip-path: inset(0 0% 0 0); opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 40px rgba(255,160,50,0.2), 0 0 80px rgba(255,100,20,0.1); }
          50%       { text-shadow: 0 0 60px rgba(255,180,80,0.5), 0 0 120px rgba(255,120,30,0.3); }
        }
        @keyframes neonBreath {
          0%,100% { height:1.5rem; opacity:0.3; box-shadow:0 0 4px 1px rgba(255,255,255,0.3); }
          50%     { height:3.5rem; opacity:1;   box-shadow:0 0 12px 3px rgba(255,255,255,0.9); }
        }
        @keyframes subtleFade {
          0%,100% { opacity: 0.3; }
          50%     { opacity: 0.8; }
        }
        .neon-home { animation: neonBreath 2.4s ease-in-out infinite; }
        .scroll-fade { animation: subtleFade 2.4s ease-in-out infinite; }
        .mar-glow { animation: glowPulse 4s ease-in-out infinite; }
        .reveal-1 { animation: wordReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .reveal-2 { animation: wordReveal 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
        .reveal-3 { animation: wordReveal 1s cubic-bezier(0.16,1,0.3,1) 1.4s both; }
        .reveal-4 { animation: wordReveal 0.8s cubic-bezier(0.16,1,0.3,1) 1.8s both; }
        .line-grow { animation: lineGrow 1s ease-out 0.1s both; transform-origin: top; }
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: particleDrift linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div ref={headerRef} style={{
        position: "absolute", inset: 0, zIndex: 20,
        willChange: "opacity, transform",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>

        {/* FONDO — orbita solar: amanecer/anochecer mediterraneo */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 120% 60% at 50% 110%,
              #ff6b1a 0%,
              #ff3d00 8%,
              #c2185b 20%,
              #7b1fa2 35%,
              #1a237e 55%,
              #0a0a1a 75%,
              #000000 100%
            )
          `,
          backgroundSize: "200% 200%",
          animation: "sunriseShift 12s ease-in-out infinite",
        }} />

        {/* Capa de niebla costera */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 80% 40% at 50% 100%,
              rgba(255,120,50,0.15) 0%,
              transparent 70%
            ),
            radial-gradient(ellipse 60% 30% at 30% 80%,
              rgba(255,60,20,0.08) 0%,
              transparent 60%
            )
          `,
          pointerEvents: "none",
        }} />

        {/* Particulas de luz — polvo dorado mediterraneo */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" style={{
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            background: i % 2 === 0 ? "rgba(255,200,100,0.8)" : "rgba(255,255,255,0.6)",
            left: `${8 + i * 7.5}%`,
            bottom: `${10 + (i % 4) * 8}%`,
            animationDuration: `${6 + i * 1.3}s`,
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}

        {/* CONTENIDO TIPOGRAFICO */}
        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          padding: "0 2rem",
        }}>

          {/* Linea vertical superior */}
          <div className="line-grow" style={{
            width: "1px", height: "5rem",
            background: "linear-gradient(to bottom, transparent, rgba(255,180,80,0.5))",
            marginBottom: "2.5rem",
          }} />

          {/* Tagline — ultra tracking */}
          <p className="reveal-1" style={{
            color: "rgba(255,180,80,0.8)",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.45rem, 0.9vw, 0.7rem)",
            letterSpacing: "0.7em",
            textTransform: "uppercase",
            margin: "0 0 2rem",
            fontWeight: 300,
            fontStyle: "italic",
          }}>
            WHERE THE MEDITERRANEAN BECOMES EPIC
          </p>

          {/* MARBELLA — monumental con mix tipografico */}
          <div className="reveal-2 mar-glow" style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0.02em",
            lineHeight: 0.85,
            marginBottom: "0.5rem",
          }}>
            {/* MAR — serif light, enorme */}
            <span style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(5rem, 14vw, 13rem)",
              fontWeight: 300,
              color: "white",
              letterSpacing: "-0.02em",
            }}>
              MAR
            </span>
            {/* BELLA — condensed, dorado, rotado ligeramente */}
            <span style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(5rem, 14vw, 13rem)",
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffd700 0%, #ff8c00 40%, #ff4500 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.04em",
            }}>
              BELLA
            </span>
          </div>

          {/* Ultra Luxury — italic, espaciado, blanco translucido */}
          <p className="reveal-3" style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.8rem, 2vw, 1.5rem)",
            fontWeight: 300,
            letterSpacing: "0.5em",
            fontStyle: "italic",
            margin: "1.5rem 0 2.5rem",
            textTransform: "uppercase",
          }}>
            Ultra · Luxury · Real Estate
          </p>

          {/* Ubicaciones — separadas por destellos */}
          <div className="reveal-4" style={{
            display: "flex", alignItems: "center", gap: "0.8rem",
            color: "rgba(255,180,80,0.55)",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.35rem, 0.65vw, 0.55rem)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
          }}>
            {["Golden Mile", "Puerto Banús", "Nueva Andalucía", "Sierra Blanca"].map((loc, i, arr) => (
              <span key={loc} style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                {loc}
                {i < arr.length - 1 && (
                  <span style={{
                    width: "3px", height: "3px",
                    borderRadius: "50%",
                    background: "rgba(255,180,80,0.4)",
                    display: "inline-block",
                  }} />
                )}
              </span>
            ))}
          </div>

          {/* Linea vertical inferior */}
          <div className="line-grow" style={{
            width: "1px", height: "5rem",
            background: "linear-gradient(to bottom, rgba(255,180,80,0.4), transparent)",
            marginTop: "2.5rem",
          }} />
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "0.7rem",
          pointerEvents: "none", zIndex: 20,
        }}>
          <span className="scroll-fade" style={{
            color: "rgba(255,255,255,0.5)", fontSize: "0.4rem",
            letterSpacing: "0.5em", fontFamily: "Georgia, serif",
            textTransform: "uppercase",
          }}>SCROLL</span>
          <div className="neon-home" style={{ width: "1px", background: "rgba(255,200,100,0.8)" }} />
        </div>
      </div>

      {/* ── PROPIEDADES Z-AXIS ───────────────────────────────────────────── */}
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
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                border: "1px solid rgba(201,169,110,0.3)",
                boxShadow: "0 0 80px rgba(201,169,110,0.15), inset 0 0 40px rgba(201,169,110,0.05)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", top: "2rem", left: "2rem",
                color: "#c9a96e", fontFamily: "Georgia, serif",
                fontSize: "0.55rem", letterSpacing: "0.5em", opacity: 0.7,
              }}>
                0{i + 1} / 0{properties.length}
              </div>
              <div style={{
                position: "absolute", bottom: "2.5rem",
                left: "2.5rem", right: "2.5rem",
                color: "white", fontFamily: "Georgia, serif",
              }}>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.45em", opacity: 0.6, textTransform: "uppercase", margin: "0 0 0.8rem" }}>
                  {property.ubicacion}
                </p>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.8rem)", fontWeight: 300, lineHeight: 1.1, margin: "0 0 1rem" }}>
                  {property.titulo[lang]}
                </h2>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ color: "#c9a96e", fontSize: "clamp(0.9rem, 1.4vw, 1.2rem)", letterSpacing: "0.1em", margin: 0 }}>
                    €{(property.precio / 1000000).toFixed(1)}M
                  </p>
                  <span style={{ fontSize: "0.5rem", letterSpacing: "0.4em", opacity: 0.5, textTransform: "uppercase" }}>
                    Explorar →
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

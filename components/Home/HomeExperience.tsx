"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Property } from "@/types/property";
import { useRouter } from "next/navigation";

interface Props {
  properties: Property[];
  locale: string;
}

export default function HomeExperience({ properties, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const propertyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const phaseRef = useRef<"header" | "properties">("header");
  const headerProgressRef = useRef(0);
  const router = useRouter();
  const lang = locale as "es" | "en" | "fr" | "ru";
  const SECTION_LENGTH = 1.0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let smoothHeader = 0;
    let targetHeader = 0;

    const tick = () => {
      // Header fade out suavizado
      smoothHeader = lerp(smoothHeader, targetHeader, 0.06);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0, ${-smoothHeader * 60}px, 0)`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.8 ? "none" : "auto";
      }
      if (propertiesRef.current) {
        propertiesRef.current.style.opacity = String(smoothHeader);
        propertiesRef.current.style.pointerEvents = smoothHeader > 0.2 ? "auto" : "none";
      }

      // Propiedades Z-Axis
      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.06);
      properties.forEach((_, i) => {
        const el = propertyRefs.current[i];
        if (!el) return;
        const center = i * SECTION_LENGTH;
        const dist = progressRef.current - center;
        let opacity = 0;
        let scale = 0.4;
        let zPos = 0;
        let blur = 0;

        if (dist < -SECTION_LENGTH) {
          opacity = 0; scale = 0.4; zPos = -2000; blur = 30;
        } else if (dist < -SECTION_LENGTH * 0.3) {
          const t = (dist + SECTION_LENGTH) / (SECTION_LENGTH * 0.7);
          opacity = t * t; scale = 0.4 + t * 0.6; zPos = -2000 + t * 2000; blur = 30 - t * 30;
        } else if (dist < SECTION_LENGTH * 0.3) {
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else if (dist < SECTION_LENGTH) {
          const t = (dist - SECTION_LENGTH * 0.3) / (SECTION_LENGTH * 0.7);
          opacity = 1 - t; scale = 1 + t * 0.5; zPos = t * 800; blur = t * 20;
        } else {
          opacity = 0; scale = 1.5; zPos = 800; blur = 20;
        }

        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, 0, ${zPos}px) scale(${scale})`;
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
        headerProgressRef.current = Math.max(0, Math.min(1,
          headerProgressRef.current + delta * 0.003
        ));
        targetHeader = headerProgressRef.current;

        if (headerProgressRef.current >= 1) {
          phaseRef.current = "properties";
        }
        if (headerProgressRef.current <= 0 && delta < 0) {
          headerProgressRef.current = 0;
        }
      } else {
        // Retroceder al header
        if (targetProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
        const max = (properties.length - 1) * SECTION_LENGTH;
        targetProgressRef.current = Math.max(0, Math.min(max,
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
    <div ref={containerRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100vh",
      overflow: "hidden", background: "#000000",
    }}>

      {/* ── HEADER EDITORIAL ─────────────────────────────────────────────── */}
      <div ref={headerRef} style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 20, willChange: "opacity, transform",
        background: "radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%)",
      }}>

        {/* Linea decorativa superior */}
        <div style={{
          width: "1px", height: "4rem",
          background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.4))",
          marginBottom: "2rem",
        }} />

        {/* Linea 1 — pequeña, tracking amplio */}
        <p style={{
          color: "rgba(201,169,110,0.7)",
          fontFamily: "Georgia, serif",
          fontSize: "clamp(0.5rem, 1vw, 0.75rem)",
          letterSpacing: "0.6em",
          textTransform: "uppercase",
          margin: "0 0 1.5rem",
          fontWeight: 300,
        }}>
          WHERE THE MEDITERRANEAN BECOMES EPIC
        </p>

        {/* Linea 2 — monumental */}
        <h1 style={{
          color: "white",
          fontFamily: "Georgia, serif",
          fontSize: "clamp(4rem, 12vw, 11rem)",
          fontWeight: 300,
          letterSpacing: "0.08em",
          margin: "0 0 0.5rem",
          lineHeight: 0.9,
          textAlign: "center",
        }}>
          MARBELLA
        </h1>

        {/* Linea 3 — subtitulo elegante */}
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Georgia, serif",
          fontSize: "clamp(0.8rem, 1.8vw, 1.4rem)",
          fontWeight: 300,
          letterSpacing: "0.3em",
          margin: "1.5rem 0 2.5rem",
          fontStyle: "italic",
        }}>
          Ultra-Luxury Real Estate
        </p>

        {/* Linea 4 — ubicaciones */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          color: "rgba(201,169,110,0.5)",
          fontFamily: "Georgia, serif",
          fontSize: "clamp(0.4rem, 0.7vw, 0.6rem)",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
        }}>
          {["Golden Mile", "Puerto Banús", "Nueva Andalucía", "Sierra Blanca"].map((loc, i, arr) => (
            <span key={loc} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {loc}
              {i < arr.length - 1 && (
                <span style={{ opacity: 0.3, fontSize: "0.4rem" }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Linea decorativa inferior */}
        <div style={{
          width: "1px", height: "4rem",
          background: "linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)",
          marginTop: "2rem",
        }} />

        {/* Scroll indicator */}
        <style>{`
          @keyframes neonBreath {
            0%   { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
            50%  { height: 3.5rem; opacity: 1;   box-shadow: 0 0 12px 3px rgba(255,255,255,0.9); }
            100% { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
          }
          @keyframes textPulse { 0%,100%{opacity:0.2} 50%{opacity:0.7} }
          .neon-line-home { animation: neonBreath 2.4s ease-in-out infinite; }
          .scroll-txt { animation: textPulse 2.4s ease-in-out infinite; }
        `}</style>

        <div style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "0.7rem",
          pointerEvents: "none",
        }}>
          <span className="scroll-txt" style={{
            color: "white", fontSize: "0.4rem",
            letterSpacing: "0.5em", fontFamily: "Georgia, serif",
            textTransform: "uppercase",
          }}>SCROLL</span>
          <div className="neon-line-home" style={{ width: "1px", background: "white" }} />
        </div>
      </div>

      {/* ── PROPIEDADES Z-AXIS ───────────────────────────────────────────── */}
      <div ref={propertiesRef} style={{
        position: "absolute", inset: 0,
        opacity: 0, pointerEvents: "none",
        perspective: "1200px",
        perspectiveOrigin: "center center",
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
                transformStyle: "preserve-3d",
                cursor: "pointer", willChange: "transform, opacity, filter",
              }}
            >
              <video
                src={property.video_url} muted playsInline autoPlay loop
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "2px" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                border: "1px solid rgba(201,169,110,0.3)",
                boxShadow: "0 0 80px rgba(201,169,110,0.15), inset 0 0 40px rgba(201,169,110,0.05)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "absolute", top: "2rem", left: "2rem", color: "#c9a96e", fontFamily: "Georgia, serif", fontSize: "0.55rem", letterSpacing: "0.5em", opacity: 0.7 }}>
                0{i + 1} / 0{properties.length}
              </div>
              <div style={{ position: "absolute", bottom: "2.5rem", left: "2.5rem", right: "2.5rem", color: "white", fontFamily: "Georgia, serif" }}>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.45em", opacity: 0.6, textTransform: "uppercase", margin: "0 0 0.8rem" }}>
                  {property.ubicacion}
                </p>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.8rem)", fontWeight: 300, lineHeight: 1.1, margin: "0 0 1rem", letterSpacing: "0.02em" }}>
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

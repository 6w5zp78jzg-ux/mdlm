"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Property } from "@/types/property";
import { useRouter } from "next/navigation";

interface Props {
  properties: Property[];
  locale: string;
}

// Z-AXIS CHRONO-SCROLL
// Cada propiedad es un monolito flotante en el espacio infinito
// El scroll mueve la camara virtual hacia adelante en Z
// Las propiedades emergen de la niebla, llenan la pantalla, se desvanecen
export default function HomeExperience({ properties, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propertyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const router = useRouter();
  const lang = locale as "es" | "en" | "fr" | "ru";

  // Cada propiedad ocupa este "espacio" de scroll en el viaje
  const SECTION_LENGTH = 1.0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.06);

      properties.forEach((_, i) => {
        const el = propertyRefs.current[i];
        if (!el) return;

        // Cada propiedad tiene su centro de aparicion en el viaje
        const center = i * SECTION_LENGTH;
        const dist = progressRef.current - center;

        let zPos = 0;
        let opacity = 0;
        let scale = 0.4;
        let blur = 0;

        if (dist < -SECTION_LENGTH) {
          // Aun no se aproxima — invisible al fondo
          opacity = 0;
          scale = 0.4;
          zPos = -2000;
          blur = 30;
        } else if (dist < -SECTION_LENGTH * 0.3) {
          // APROXIMACION — emerge del vacio
          const t = (dist + SECTION_LENGTH) / (SECTION_LENGTH * 0.7);
          opacity = t * t;
          scale = 0.4 + t * 0.6;
          zPos = -2000 + t * 2000;
          blur = 30 - t * 30;
        } else if (dist < SECTION_LENGTH * 0.3) {
          // CENTRO — protagonismo total
          opacity = 1;
          scale = 1;
          zPos = 0;
          blur = 0;
        } else if (dist < SECTION_LENGTH) {
          // ALEJAMIENTO — se desvanece hacia adelante
          const t = (dist - SECTION_LENGTH * 0.3) / (SECTION_LENGTH * 0.7);
          opacity = 1 - t;
          scale = 1 + t * 0.5;
          zPos = t * 800;
          blur = t * 20;
        } else {
          opacity = 0;
          scale = 1.5;
          zPos = 800;
          blur = 20;
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
      const max = (properties.length - 1) * SECTION_LENGTH;
      targetProgressRef.current = Math.max(0, Math.min(max,
        targetProgressRef.current + e.deltaY * 0.0008
      ));
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
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
        perspective: "1200px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* PARTICULAS DE POLVO — atmosfera del vacio */}
      <div className="dust-particles" style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(1px 1px at 20% 30%, rgba(201,169,110,0.3), transparent),
          radial-gradient(1px 1px at 60% 70%, rgba(201,169,110,0.2), transparent),
          radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.15), transparent),
          radial-gradient(1px 1px at 30% 80%, rgba(201,169,110,0.25), transparent),
          radial-gradient(2px 2px at 50% 50%, rgba(255,255,255,0.1), transparent)
        `,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* PROPIEDADES — cada una un portal en el espacio */}
      <div style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        zIndex: 5,
      }}>
        {properties.map((property, i) => (
          <div
            key={property.id}
            ref={(el) => { propertyRefs.current[i] = el; }}
            onClick={() => router.push(`/${locale}/propiedades/${property.slug}`)}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "70vw",
              height: "75vh",
              marginLeft: "-35vw",
              marginTop: "-37.5vh",
              transformStyle: "preserve-3d",
              cursor: "pointer",
              willChange: "transform, opacity, filter",
            }}
          >
            {/* Video/imagen de fondo */}
            <video
              src={property.video_url}
              muted
              playsInline
              autoPlay
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "2px",
              }}
            />

            {/* Overlay degradado */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)",
              pointerEvents: "none",
            }} />

            {/* Borde con glow dorado */}
            <div style={{
              position: "absolute",
              inset: 0,
              border: "1px solid rgba(201,169,110,0.3)",
              boxShadow: "0 0 80px rgba(201,169,110,0.15), inset 0 0 40px rgba(201,169,110,0.05)",
              pointerEvents: "none",
            }} />

            {/* Numero de propiedad — esquina superior */}
            <div style={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              color: "#c9a96e",
              fontFamily: "Georgia, serif",
              fontSize: "0.55rem",
              letterSpacing: "0.5em",
              opacity: 0.7,
            }}>
              0{i + 1} / 0{properties.length}
            </div>

            {/* Info principal — parte inferior */}
            <div style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "2.5rem",
              right: "2.5rem",
              color: "white",
              fontFamily: "Georgia, serif",
            }}>
              <p style={{
                fontSize: "0.55rem",
                letterSpacing: "0.45em",
                opacity: 0.6,
                textTransform: "uppercase",
                margin: "0 0 0.8rem",
              }}>
                {property.ubicacion}
              </p>
              <h2 style={{
                fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
                fontWeight: 300,
                lineHeight: 1.1,
                margin: "0 0 1rem",
                letterSpacing: "0.02em",
              }}>
                {property.titulo[lang]}
              </h2>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <p style={{
                  color: "#c9a96e",
                  fontSize: "clamp(0.9rem, 1.4vw, 1.2rem)",
                  letterSpacing: "0.1em",
                  margin: 0,
                }}>
                  €{(property.precio / 1000000).toFixed(1)}M
                </p>
                <span style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.4em",
                  opacity: 0.5,
                  textTransform: "uppercase",
                }}>
                  Explorar →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SCROLL INDICATOR */}
      <style>{`
        @keyframes neonBreath {
          0%   { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
          50%  { height: 3.5rem; opacity: 1;   box-shadow: 0 0 12px 3px rgba(255,255,255,0.9), 0 0 24px 6px rgba(255,255,255,0.3); }
          100% { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
        }
        .home-neon { animation: neonBreath 2.4s ease-in-out infinite; }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.7rem",
        zIndex: 200,
        pointerEvents: "none",
      }}>
        <span style={{
          color: "white",
          fontSize: "0.4rem",
          letterSpacing: "0.5em",
          fontFamily: "Georgia, serif",
          textTransform: "uppercase",
          opacity: 0.5,
        }}>SCROLL</span>
        <div className="home-neon" style={{ width: "1px", background: "white" }} />
      </div>
    </div>
  );
}

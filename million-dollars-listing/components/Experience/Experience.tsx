"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const GALLERY_IMAGES = [
  "/gallery/228e370e-3d41-406d-a6aa-d72bc8cc2772.jpeg",
  "/gallery/a741c346-7225-4ccb-81fb-13b02e7f5573.jpeg",
  "/gallery/a8c5ab21-42e6-4e78-8613-43737facb1d8.jpeg",
];

type Phase = "video" | "transition" | "gallery";

export default function Experience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("video");
  const videoProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const targetVideoTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const galleryTrack = galleryTrackRef.current;
    const gallerySection = document.getElementById("gallery-section");
    if (!video || !galleryTrack || !gallerySection) return;

    // Bloquear scroll nativo completamente
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Posicion inicial galeria — completamente fuera de pantalla abajo
    gsap.set(gallerySection, { y: "100vh", opacity: 0 });

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const speed = 0.0006;

      // ── FASE 1: VIDEO ──────────────────────────────────────────────────
      if (phaseRef.current === "video") {
        videoProgressRef.current = Math.max(0, Math.min(1,
          videoProgressRef.current + delta * speed
        ));

        if (video.duration) {
          targetVideoTimeRef.current = videoProgressRef.current * video.duration;
          video.currentTime = targetVideoTimeRef.current;
        }

        // Solo avanza a transicion si el video llego al final
        if (videoProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 0;
        }
      }

      // ── FASE 2: TRANSICION ─────────────────────────────────────────────
      else if (phaseRef.current === "transition") {
        transitionProgressRef.current = Math.max(0, Math.min(1,
          transitionProgressRef.current + delta * 0.005
        ));

        // Galeria sube desde abajo — destino: top 67vh (1/3 inferior)
        const yPercent = 100 - (transitionProgressRef.current * 100);
        gsap.set(gallerySection, {
          y: yPercent + "vh",
          opacity: transitionProgressRef.current,
        });

        if (transitionProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "gallery";
          galleryProgressRef.current = 0;
        }
        if (transitionProgressRef.current <= 0.001 && delta < 0) {
          phaseRef.current = "video";
          videoProgressRef.current = 1;
          gsap.set(gallerySection, { y: "100vh", opacity: 0 });
        }
      }

      // ── FASE 3: GALERIA HORIZONTAL ─────────────────────────────────────
      else if (phaseRef.current === "gallery") {
        const maxX = galleryTrack.scrollWidth - window.innerWidth;
        galleryProgressRef.current = Math.max(0, Math.min(1,
          galleryProgressRef.current + delta * speed
        ));

        gsap.to(galleryTrack, {
          x: -galleryProgressRef.current * maxX,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });

        if (galleryProgressRef.current <= 0.001 && delta < 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 1;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      background: "#0a0a0a",
    }}>

      {/* ── VIDEO FULLSCREEN ────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* ── TITULO ──────────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: "5rem",
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}>
        <h1 style={{
          color: "#c9a96e",
          fontFamily: "Georgia, serif",
          fontSize: "clamp(1rem, 4.5vw, 3.5rem)",
          letterSpacing: "0.5em",
          fontWeight: 300,
          textAlign: "center",
          margin: 0,
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}>
          MILLION DOLLARS LISTING
        </h1>
        <p style={{
          color: "#c9a96e",
          opacity: 0.5,
          letterSpacing: "0.7em",
          fontSize: "0.6rem",
          marginTop: "0.5rem",
          textShadow: "0 2px 10px rgba(0,0,0,0.8)",
        }}>
          MARBELLA
        </p>
        <div style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: 0.35,
        }}>
          <span style={{ color: "white", fontSize: "0.5rem", letterSpacing: "0.4em" }}>SCROLL</span>
          <div style={{ width: "1px", height: "2rem", background: "white" }} />
        </div>
      </div>

      {/* ── GALERIA: ocupa el tercio inferior (33vh) ─────────────────────── */}
      {/* Posicion fija: top 67vh — se desliza desde abajo durante transicion */}
      <div
        id="gallery-section"
        style={{
          position: "absolute",
          top: "67vh",
          left: 0,
          width: "100%",
          height: "33vh",
          overflow: "hidden",
          zIndex: 20,
          background: "linear-gradient(to right, #0a0a0a 0%, #111111 100%)",
          borderTop: "1px solid rgba(201,169,110,0.15)",
        }}
      >
        <div
          ref={galleryTrackRef}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            width: "max-content",
            gap: "1.5rem",
            paddingLeft: "4rem",
            paddingRight: "4rem",
            willChange: "transform",
          }}
        >
          {/* Label lateral */}
          <div style={{
            flexShrink: 0,
            width: "16vw",
            color: "#c9a96e",
            fontFamily: "Georgia, serif",
          }}>
            <p style={{
              fontSize: "0.45rem",
              letterSpacing: "0.45em",
              opacity: 0.4,
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}>
              Seleccion
            </p>
            <h2 style={{
              fontSize: "clamp(0.9rem, 1.5vw, 1.3rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              margin: "0 0 0.8rem",
            }}>
              Propiedades<br />Exclusivas
            </h2>
            <div style={{
              width: "1.5rem",
              height: "1px",
              background: "#c9a96e",
              opacity: 0.25,
              marginBottom: "0.8rem",
            }} />
            <p style={{
              fontSize: "0.4rem",
              letterSpacing: "0.2em",
              opacity: 0.3,
              lineHeight: 1.8,
              margin: 0,
            }}>
              MARBELLA<br />COSTA DEL SOL
            </p>
          </div>

          {/* Separador */}
          <div style={{
            flexShrink: 0,
            width: "1px",
            height: "60%",
            background: "rgba(201,169,110,0.2)",
          }} />

          {/* Imagenes — altura 28vh para respirar dentro del 33vh */}
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: "38vw",
              height: "28vh",
              overflow: "hidden",
              position: "relative",
            }}>
              <img
                src={src}
                alt={"Propiedad " + (i + 1)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* Label numero */}
              <div style={{
                position: "absolute",
                bottom: "0.8rem",
                left: "0.8rem",
                background: "rgba(0,0,0,0.4)",
                padding: "0.3rem 0.6rem",
              }}>
                <p style={{
                  color: "#c9a96e",
                  fontSize: "0.4rem",
                  letterSpacing: "0.4em",
                  margin: 0,
                  opacity: 0.8,
                }}>
                  0{i + 1}
                </p>
              </div>
            </div>
          ))}

          <div style={{ flexShrink: 0, width: "8vw" }} />
        </div>
      </div>

    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_IMAGES = [
  "/gallery/228e370e-3d41-406d-a6aa-d72bc8cc2772.jpeg",
  "/gallery/a741c346-7225-4ccb-81fb-13b02e7f5573.jpeg",
  "/gallery/a8c5ab21-42e6-4e78-8613-43737facb1d8.jpeg",
];

export default function Experience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const phasRef = useRef<"video" | "transition" | "gallery">("video");
  const isScrollingRef = useRef(false);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !galleryTrack) return;

    let galleryWidth = 0;

    // Bloquear scroll nativo del browser completamente
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrollingRef.current) return;

      const delta = e.deltaY;

      // ── FASE 1: VIDEO SCRUBBING ──────────────────────────────────────────
      if (phasRef.current === "video") {
        progressRef.current = Math.max(0, Math.min(1, progressRef.current + delta * 0.001));

        if (video.duration) {
          video.currentTime = progressRef.current * video.duration;
        }

        // Fin del video — pasar a transicion
        if (progressRef.current >= 1 && delta > 0) {
          phasRef.current = "transition";
          transitionProgressRef.current = 0;
        }
        // No retroceder mas alla del inicio
        if (progressRef.current <= 0 && delta < 0) {
          progressRef.current = 0;
        }
      }

      // ── FASE 2: TRANSICION 1/3 PANTALLA ─────────────────────────────────
      else if (phasRef.current === "transition") {
        transitionProgressRef.current = Math.max(0, Math.min(1, transitionProgressRef.current + delta * 0.003));

        // Mover el contenedor de galeria hacia arriba suavemente
        const galleryEl = document.getElementById("gallery-section");
        if (galleryEl) {
          const offset = (1 - transitionProgressRef.current) * 33;
          galleryEl.style.transform = `translateY(${offset}vh)`;
          galleryEl.style.opacity = String(transitionProgressRef.current);
        }

        // Fin transicion — activar galeria
        if (transitionProgressRef.current >= 1 && delta > 0) {
          phasRef.current = "gallery";
          galleryProgressRef.current = 0;
        }
        // Retroceder a video
        if (transitionProgressRef.current <= 0 && delta < 0) {
          phasRef.current = "video";
          progressRef.current = 1;
        }
      }

      // ── FASE 3: GALERIA HORIZONTAL ───────────────────────────────────────
      else if (phasRef.current === "gallery") {
        galleryWidth = galleryTrack.scrollWidth - window.innerWidth;
        galleryProgressRef.current = Math.max(0, Math.min(1, galleryProgressRef.current + delta * 0.001));

        gsap.to(galleryTrack, {
          x: -galleryProgressRef.current * galleryWidth,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });

        // Retroceder a transicion
        if (galleryProgressRef.current <= 0 && delta < 0) {
          phasRef.current = "transition";
          transitionProgressRef.current = 1;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>

      {/* ── FASE 1: VIDEO ─────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* Overlay titulo */}
      <div style={{
        position: "absolute",
        bottom: "4rem", left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}>
        <h1 style={{
          color: "#c9a96e",
          fontFamily: "serif",
          fontSize: "clamp(1.5rem, 4vw, 3.5rem)",
          letterSpacing: "0.4em",
          fontWeight: 300,
          textAlign: "center",
        }}>
          MILLION DOLLARS LISTING
        </h1>
        <p style={{
          color: "#c9a96e",
          opacity: 0.5,
          letterSpacing: "0.6em",
          fontSize: "0.65rem",
          marginTop: "0.5rem",
        }}>
          MARBELLA
        </p>
        <div style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: 0.4,
        }}>
          <span style={{ color: "white", fontSize: "0.55rem", letterSpacing: "0.3em" }}>SCROLL</span>
          <div style={{ width: "1px", height: "2.5rem", background: "white" }} />
        </div>
      </div>

      {/* ── FASE 2+3: GALERIA ────────────────────────────────────────────── */}
      <div
        id="gallery-section"
        style={{
          position: "absolute",
          top: "67vh",        // empieza 1/3 por debajo
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          zIndex: 5,
          opacity: 0,
          transform: "translateY(33vh)",
          transition: "none",
          background: "#0a0a0a",
        }}
      >
        <div
          ref={galleryTrackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            paddingLeft: "6rem",
            paddingRight: "4rem",
            width: "max-content",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* Label */}
          <div style={{
            flexShrink: 0,
            width: "22vw",
            color: "#c9a96e",
            fontFamily: "serif",
          }}>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.5em", opacity: 0.4, marginBottom: "1rem", textTransform: "uppercase" }}>
              Propiedades
            </p>
            <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 2rem)", fontWeight: 300, lineHeight: 1.2 }}>
              Seleccion<br />Exclusiva
            </h2>
            <div style={{ width: "2rem", height: "1px", background: "#c9a96e", opacity: 0.3, margin: "1.5rem 0" }} />
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", opacity: 0.4, lineHeight: 2 }}>
              MARBELLA · COSTA DEL SOL
            </p>
          </div>

          {/* Imagenes */}
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: "45vw",
              height: "70vh",
              overflow: "hidden",
              position: "relative",
            }}>
              <img
                src={src}
                alt={"Propiedad " + (i + 1)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <p style={{ color: "white", fontSize: "0.55rem", letterSpacing: "0.4em", opacity: 0.5 }}>
                  PROPIEDAD 0{i + 1}
                </p>
              </div>
            </div>
          ))}

          <div style={{ flexShrink: 0, width: "15vw" }} />
        </div>
      </div>

    </div>
  );
}

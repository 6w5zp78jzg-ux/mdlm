"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const GALLERY_IMAGES = [
  "/gallery/228e370e-3d41-406d-a6aa-d72bc8cc2772.jpeg",
  "/gallery/a741c346-7225-4ccb-81fb-13b02e7f5573.jpeg",
  "/gallery/a8c5ab21-42e6-4e78-8613-43737facb1d8.jpeg",
];

export default function Experience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"video" | "transition" | "gallery">("video");
  const videoProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const galleryTrack = galleryTrackRef.current;
    const gallerySection = document.getElementById("gallery-section");
    if (!video || !galleryTrack || !gallerySection) return;

    // Bloquear scroll nativo
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;

      // ── FASE 1: VIDEO SCRUBBING ──────────────────────────────────────────
      if (phaseRef.current === "video") {
        videoProgressRef.current = Math.max(0, Math.min(1, videoProgressRef.current + delta * 0.0008));
        if (video.duration) {
          video.currentTime = videoProgressRef.current * video.duration;
        }
        if (videoProgressRef.current >= 1 && delta > 0) {
          phaseRef.current = "transition";
        }
      }

      // ── FASE 2: TRANSICION 1/3 PANTALLA ─────────────────────────────────
      else if (phaseRef.current === "transition") {
        transitionProgressRef.current = Math.max(0, Math.min(1, transitionProgressRef.current + delta * 0.004));

        // La galeria sube desde abajo hasta quedar en el 1/3 inferior
        const yOffset = (1 - transitionProgressRef.current) * 100;
        gsap.set(gallerySection, {
          y: yOffset + "vh",
          opacity: transitionProgressRef.current,
        });

        if (transitionProgressRef.current >= 1 && delta > 0) {
          phaseRef.current = "gallery";
        }
        if (transitionProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "video";
          videoProgressRef.current = 1;
        }
      }

      // ── FASE 3: GALERIA HORIZONTAL ───────────────────────────────────────
      else if (phaseRef.current === "gallery") {
        const galleryWidth = galleryTrack.scrollWidth - window.innerWidth;
        galleryProgressRef.current = Math.max(0, Math.min(1, galleryProgressRef.current + delta * 0.0008));

        gsap.to(galleryTrack, {
          x: -galleryProgressRef.current * galleryWidth,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });

        if (galleryProgressRef.current <= 0 && delta < 0) {
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
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>

      {/* ── VIDEO ─────────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* ── TITULO HERO ───────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: "3rem", left: 0,
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
          fontSize: "clamp(1.2rem, 5vw, 3.5rem)",
          letterSpacing: "0.4em",
          fontWeight: 300,
          textAlign: "center",
          margin: 0,
        }}>
          MILLION DOLLARS LISTING
        </h1>
        <p style={{
          color: "#c9a96e",
          opacity: 0.5,
          letterSpacing: "0.6em",
          fontSize: "0.6rem",
          marginTop: "0.4rem",
        }}>
          MARBELLA
        </p>
        <div style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          opacity: 0.35,
        }}>
          <span style={{ color: "white", fontSize: "0.5rem", letterSpacing: "0.3em" }}>SCROLL</span>
          <div style={{ width: "1px", height: "2rem", background: "white" }} />
        </div>
      </div>

      {/* ── GALERIA: empieza en 67vh (ocupa el 33vh inferior) ─────────────── */}
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
          opacity: 0,
          transform: "translateY(100vh)",
          background: "#0a0a0a",
        }}
      >
        <div
          ref={galleryTrackRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingLeft: "3rem",
            paddingRight: "2rem",
            width: "max-content",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* Label */}
          <div style={{
            flexShrink: 0,
            width: "18vw",
            color: "#c9a96e",
            fontFamily: "serif",
            paddingRight: "1rem",
          }}>
            <p style={{
              fontSize: "0.45rem",
              letterSpacing: "0.4em",
              opacity: 0.4,
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}>
              Seleccion Exclusiva
            </p>
            <h2 style={{
              fontSize: "clamp(0.8rem, 1.8vw, 1.4rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              margin: 0,
            }}>
              Propiedades<br />Marbella
            </h2>
            <div style={{
              width: "1.5rem",
              height: "1px",
              background: "#c9a96e",
              opacity: 0.3,
              margin: "0.8rem 0",
            }} />
            <p style={{
              fontSize: "0.45rem",
              letterSpacing: "0.2em",
              opacity: 0.35,
              lineHeight: 1.8,
            }}>
              COSTA DEL SOL
            </p>
          </div>

          {/* Imagenes — altura adaptada al 33vh */}
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} style={{
              flexShrink: 0,
              width: "40vw",
              height: "26vh",
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
              <div style={{
                position: "absolute",
                bottom: "0.8rem",
                left: "0.8rem",
              }}>
                <p style={{
                  color: "white",
                  fontSize: "0.45rem",
                  letterSpacing: "0.35em",
                  opacity: 0.5,
                  margin: 0,
                }}>
                  PROPIEDAD 0{i + 1}
                </p>
              </div>
            </div>
          ))}

          <div style={{ flexShrink: 0, width: "10vw" }} />
        </div>
      </div>

    </div>
  );
}

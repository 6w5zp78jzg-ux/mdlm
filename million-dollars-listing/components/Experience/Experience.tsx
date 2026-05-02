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
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("video");
  const videoProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !stage || !galleryTrack) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Estado inicial: stage = 100vh (solo video visible)
    gsap.set(stage, { height: "100vh" });

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;

      // ── FASE 1: VIDEO SCRUBBING ──────────────────────────────────────
      if (phaseRef.current === "video") {
        videoProgressRef.current = Math.max(0, Math.min(1,
          videoProgressRef.current + delta * 0.0006
        ));

        if (video.duration) {
          video.currentTime = videoProgressRef.current * video.duration;
        }

        if (videoProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 0;
        }
      }

      // ── FASE 2: PANTALLA SE ALARGA 33VH HACIA ABAJO ─────────────────
      // El stage crece de 100vh a 133vh, revelando el espacio para galeria
      else if (phaseRef.current === "transition") {
        transitionProgressRef.current = Math.max(0, Math.min(1,
          transitionProgressRef.current + delta * 0.005
        ));

        // Stage crece: 100vh -> 133vh
        const newHeight = 100 + transitionProgressRef.current * 50;
        gsap.set(stage, { height: newHeight + "vh" });

        // Y el viewport sube para mostrar el espacio nuevo
        const scrollY = transitionProgressRef.current * 50;
        gsap.set(stage, {
          y: -scrollY + "vh",
          height: newHeight + "vh",
        });

        if (transitionProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "gallery";
          galleryProgressRef.current = 0;
        }
        if (transitionProgressRef.current <= 0.001 && delta < 0) {
          phaseRef.current = "video";
          videoProgressRef.current = 1;
        }
      }

      // ── FASE 3: GALERIA HORIZONTAL ───────────────────────────────────
      else if (phaseRef.current === "gallery") {
        const maxX = galleryTrack.scrollWidth - window.innerWidth;
        galleryProgressRef.current = Math.max(0, Math.min(1,
          galleryProgressRef.current + delta * 0.0006
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

      {/* ── STAGE: contenedor que crece de 100vh a 133vh ─────────────── */}
      <div
        ref={stageRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          willChange: "height, transform",
        }}
      >

        {/* ── VIDEO: ocupa el 100vh superior siempre ─────────────────── */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}>
          <video
            ref={videoRef}
            src="/videos/hero.mp4"
            muted
            playsInline
            preload="auto"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Titulo hero — sobre el video */}
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
              fontSize: "clamp(1.2rem, 4.5vw, 3.5rem)",
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
        </div>

        {/* ── GALERIA: ubicada en el 33vh inferior (que se revela) ──── */}
        <div
          style={{
            position: "absolute",
            top: "100vh",
            left: 0,
            width: "100%",
            height: "33vh",
            overflow: "hidden",
            background: "linear-gradient(to bottom, #050505 0%, #0a0a0a 100%)",
            borderTop: "1px solid rgba(201,169,110,0.2)",
          }}
        >
          <div
            ref={galleryTrackRef}
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "max-content",
              gap: "1.5rem",
              paddingLeft: "4rem",
              paddingRight: "4rem",
              willChange: "transform",
            }}
          >
            {/* Label */}
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

            <div style={{
              flexShrink: 0,
              width: "1px",
              height: "60%",
              background: "rgba(201,169,110,0.2)",
            }} />

            {/* Imagenes */}
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} style={{
                flexShrink: 0,
                width: "38vw",
                height: "40vh",
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
    </div>
  );
}

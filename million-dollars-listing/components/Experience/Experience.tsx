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
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const gallery = galleryRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !gallery || !galleryTrack) return;

    // Esperar a que el video tenga metadata
    const init = () => {
      const duration = video.duration;

      // ── FASE 1: Video scrubbing ──────────────────────────────────────────
      // El scroll de la primera seccion controla currentTime del video
      ScrollTrigger.create({
        trigger: "#video-section",
        start: "top top",
        end: "bottom top",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          video.currentTime = self.progress * duration;
        },
      });

      // ── FASE 2 + 3: Galeria horizontal ───────────────────────────────────
      // La galeria se desplaza horizontalmente con el scroll vertical
      const galleryWidth = galleryTrack.scrollWidth - window.innerWidth;

      gsap.to(galleryTrack, {
        x: -galleryWidth,
        ease: "none",
        scrollTrigger: {
          trigger: "#gallery-section",
          start: "top top",
          end: () => "+=" + galleryWidth,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    };

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener("loadedmetadata", init);
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef}>

      {/* ── FASE 1: VIDEO SCRUBBING ─────────────────────────────── */}
      <div id="video-section" style={{ height: "300vh", position: "relative" }}>
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            objectFit: "cover",
          }}
        />
        {/* Overlay texto hero */}
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "4rem",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          <h1 style={{
            color: "#c9a96e",
            fontFamily: "serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            letterSpacing: "0.4em",
            fontWeight: 300,
            textAlign: "center",
          }}>
            MILLION DOLLARS LISTING
          </h1>
          <p style={{
            color: "#c9a96e",
            opacity: 0.6,
            letterSpacing: "0.6em",
            fontSize: "0.7rem",
            marginTop: "0.5rem",
          }}>
            MARBELLA
          </p>
          {/* Scroll indicator */}
          <div style={{
            position: "absolute",
            bottom: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            opacity: 0.5,
          }}>
            <span style={{ color: "white", fontSize: "0.6rem", letterSpacing: "0.3em" }}>SCROLL</span>
            <div style={{ width: "1px", height: "3rem", background: "white" }} />
          </div>
        </div>
      </div>

      {/* ── FASE 2 + 3: GALERIA HORIZONTAL ─────────────────────── */}
      <div id="gallery-section" style={{ position: "relative", background: "#0a0a0a" }}>
        <div ref={galleryRef} style={{ overflow: "hidden" }}>
          <div
            ref={galleryTrackRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              padding: "0 4rem",
              width: "max-content",
              height: "100vh",
            }}
          >
            {/* Titulo galeria */}
            <div style={{
              flexShrink: 0,
              width: "30vw",
              color: "#c9a96e",
              fontFamily: "serif",
              paddingRight: "4rem",
            }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.5em", opacity: 0.5, marginBottom: "1rem" }}>
                COLECCION EXCLUSIVA
              </p>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1 }}>
                Propiedades<br />Seleccionadas
              </h2>
              <div style={{ width: "3rem", height: "1px", background: "#c9a96e", opacity: 0.4, margin: "2rem 0" }} />
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", opacity: 0.6, lineHeight: 2 }}>
                MARBELLA · COSTA DEL SOL
              </p>
            </div>

            {/* Imagenes */}
            {GALLERY_IMAGES.map((src, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: "65vw",
                  height: "75vh",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
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
                  bottom: "2rem",
                  left: "2rem",
                  color: "white",
                }}>
                  <p style={{ fontSize: "0.6rem", letterSpacing: "0.4em", opacity: 0.6 }}>
                    PROPIEDAD 0{i + 1}
                  </p>
                </div>
              </div>
            ))}

            {/* Espacio final */}
            <div style={{ flexShrink: 0, width: "20vw" }} />
          </div>
        </div>
      </div>

    </div>
  );
}

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

  useEffect(() => {
    const video = videoRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !galleryTrack) return;

    const init = () => {
      // ── FASE 1: Video scrubbing pinned ──────────────────────────────────
      // 300vh de scroll controlan el currentTime del video
      ScrollTrigger.create({
        trigger: "#video-section",
        start: "top top",
        end: "+=300vh",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });

      // ── FASE 2: Galeria horizontal ───────────────────────────────────────
      // Se activa despues del espacio de transicion de 1/3 pantalla
      const galleryWidth = galleryTrack.scrollWidth - window.innerWidth;

      gsap.fromTo(galleryTrack,
        { x: galleryWidth },
        {
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#gallery-section",
            start: "top top",
            end: () => "+=" + galleryWidth,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        }
      );
    };

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener("loadedmetadata", init);
      return () => video.removeEventListener("loadedmetadata", init);
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div style={{ background: "#0a0a0a" }}>

      {/* ── FASE 1: VIDEO SCRUBBING ─────────────────────────────────────── */}
      <div id="video-section" style={{ height: "100vh", position: "relative" }}>
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
          }}
        />

        {/* Titulo hero */}
        <div style={{
          position: "absolute",
          bottom: "4rem", left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 10,
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
      </div>

      {/* ── TRANSICION: 1/3 de pantalla de scroll natural ───────────────── */}
      {/* Este espacio crea la separacion fluida entre video y galeria      */}
      <div style={{
        height: "33vh",
        background: "linear-gradient(to bottom, #000000, #0a0a0a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          textAlign: "center",
          opacity: 0.3,
        }}>
          <p style={{
            color: "#c9a96e",
            fontSize: "0.6rem",
            letterSpacing: "0.5em",
          }}>
            COLECCION EXCLUSIVA
          </p>
        </div>
      </div>

      {/* ── FASE 2: GALERIA HORIZONTAL ──────────────────────────────────── */}
      <div
        id="gallery-section"
        style={{ height: "100vh", overflow: "hidden", position: "relative" }}
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
          {/* Label inicial */}
          <div style={{
            flexShrink: 0,
            width: "25vw",
            color: "#c9a96e",
            fontFamily: "serif",
          }}>
            <p style={{
              fontSize: "0.55rem",
              letterSpacing: "0.5em",
              opacity: 0.4,
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}>
              Propiedades
            </p>
            <h2 style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: 300,
              lineHeight: 1.2,
            }}>
              Seleccion<br />Exclusiva
            </h2>
            <div style={{
              width: "2rem",
              height: "1px",
              background: "#c9a96e",
              opacity: 0.3,
              margin: "1.5rem 0",
            }} />
            <p style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              opacity: 0.4,
              lineHeight: 2,
            }}>
              MARBELLA · COSTA DEL SOL
            </p>
          </div>

          {/* Imagenes */}
          {GALLERY_IMAGES.map((src, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "45vw",
                height: "70vh",
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
                bottom: "1.5rem",
                left: "1.5rem",
              }}>
                <p style={{
                  color: "white",
                  fontSize: "0.55rem",
                  letterSpacing: "0.4em",
                  opacity: 0.5,
                }}>
                  PROPIEDAD 0{i + 1}
                </p>
              </div>
            </div>
          ))}

          {/* Espacio final */}
          <div style={{ flexShrink: 0, width: "15vw" }} />
        </div>
      </div>

    </div>
  );
}

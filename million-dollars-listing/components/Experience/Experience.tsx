"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const GALLERY_IMAGES = [
  "/gallery/228e370e-3d41-406d-a6aa-d72bc8cc2772.jpeg",
  "/gallery/a741c346-7225-4ccb-81fb-13b02e7f5573.jpeg",
  "/gallery/a8c5ab21-42e6-4e78-8613-43737facb1d8.jpeg",
];

const LOCALES = ["EN", "ES", "FR", "RU"];
type Phase = "video" | "transition" | "gallery";

export default function Experience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("video");
  const videoProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);
  const [activeLang, setActiveLang] = useState("ES");

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !stage || !galleryTrack) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    gsap.set(stage, { height: "100vh" });

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;

      if (phaseRef.current === "video") {
        videoProgressRef.current = Math.max(0, Math.min(1, videoProgressRef.current + delta * 0.0006));
        if (video.duration) video.currentTime = videoProgressRef.current * video.duration;
        if (videoProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 0;
        }
      }

      else if (phaseRef.current === "transition") {
        transitionProgressRef.current = Math.max(0, Math.min(1, transitionProgressRef.current + delta * 0.005));
        const newHeight = 100 + transitionProgressRef.current * 50;
        const scrollY = transitionProgressRef.current * 50;
        gsap.set(stage, { y: -scrollY + "vh", height: newHeight + "vh" });
        if (transitionProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "gallery";
          galleryProgressRef.current = 0;
        }
        if (transitionProgressRef.current <= 0.001 && delta < 0) {
          phaseRef.current = "video";
          videoProgressRef.current = 1;
        }
      }

      else if (phaseRef.current === "gallery") {
        const maxX = galleryTrack.scrollWidth - window.innerWidth;
        galleryProgressRef.current = Math.max(0, Math.min(1, galleryProgressRef.current + delta * 0.0006));
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
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        zIndex: 100,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
      }}>
        {/* LOGO */}
        <div>
          <p style={{ color: "#c9a96e", fontFamily: "Georgia, serif", fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)", letterSpacing: "0.25em", fontWeight: 400, margin: 0, lineHeight: 1.3 }}>
            MILLION DOLLARS
          </p>
          <p style={{ color: "#c9a96e", fontFamily: "Georgia, serif", fontSize: "clamp(0.5rem, 0.9vw, 0.65rem)", letterSpacing: "0.5em", fontWeight: 300, margin: 0, opacity: 0.6 }}>
            LISTING MARBELLA
          </p>
        </div>

        {/* IDIOMAS */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}>
          {LOCALES.map((lang, i) => (
            <div key={lang} style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => setActiveLang(lang)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: activeLang === lang ? "#c9a96e" : "rgba(255,255,255,0.35)",
                  fontFamily: "Georgia, serif", fontSize: "0.55rem",
                  letterSpacing: "0.2em", padding: "0.3rem 0.5rem",
                  transition: "color 0.3s ease", textTransform: "uppercase",
                }}
              >
                {lang}
              </button>
              {i < LOCALES.length - 1 && (
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.4rem" }}>|</span>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* STAGE */}
      <div ref={stageRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", willChange: "height, transform" }}>

        {/* VIDEO */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}>
          <video
            ref={videoRef}
            src="/videos/hero.mp4"
            muted playsInline preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

        </div>

        {/* GALERIA */}
        <div style={{
          position: "absolute", top: "100vh", left: 0,
          width: "100%", height: "50vh", overflow: "hidden",
          background: "linear-gradient(to bottom, #050505, #0a0a0a)",
          borderTop: "1px solid rgba(201,169,110,0.15)",
        }}>
          <div ref={galleryTrackRef} style={{
            display: "flex", alignItems: "center",
            height: "100%", width: "max-content",
            gap: "1.5rem", paddingLeft: "4rem", paddingRight: "4rem",
            willChange: "transform",
          }}>

            {/* Label */}
            <div style={{ flexShrink: 0, width: "16vw", color: "#c9a96e", fontFamily: "Georgia, serif" }}>
              <p style={{ fontSize: "0.5rem", letterSpacing: "0.45em", opacity: 0.4, textTransform: "uppercase", margin: "0 0 0.8rem" }}>Seleccion</p>
              <h2 style={{ fontSize: "clamp(1rem, 1.8vw, 1.5rem)", fontWeight: 300, lineHeight: 1.3, margin: "0 0 1rem" }}>
                Propiedades<br />Exclusivas
              </h2>
              <div style={{ width: "2rem", height: "1px", background: "#c9a96e", opacity: 0.25, marginBottom: "1rem" }} />
              <p style={{ fontSize: "0.45rem", letterSpacing: "0.2em", opacity: 0.3, lineHeight: 1.8, margin: 0 }}>
                MARBELLA<br />COSTA DEL SOL
              </p>
            </div>

            <div style={{ flexShrink: 0, width: "1px", height: "60%", background: "rgba(201,169,110,0.2)" }} />

            {/* Imagenes */}
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} style={{ flexShrink: 0, width: "38vw", height: "40vh", overflow: "hidden", position: "relative" }}>
                <img src={src} alt={"Propiedad " + (i + 1)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: "0.8rem", left: "0.8rem", background: "rgba(0,0,0,0.4)", padding: "0.3rem 0.6rem" }}>
                  <p style={{ color: "#c9a96e", fontSize: "0.45rem", letterSpacing: "0.4em", margin: 0, opacity: 0.8 }}>0{i + 1}</p>
                </div>
              </div>
            ))}

            <div style={{ flexShrink: 0, width: "8vw" }} />
          </div>
        </div>

      </div>
      {/* SCROLL INDICATOR — linea neon con crecimiento organico */}
      <style>{`
        @keyframes neonBreath {
          0%   { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
          50%  { height: 3.5rem; opacity: 1;   box-shadow: 0 0 12px 3px rgba(255,255,255,0.9), 0 0 24px 6px rgba(255,255,255,0.3); }
          100% { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
        }
        @keyframes textFade {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.7; }
        }
        .neon-line {
          animation: neonBreath 2.4s ease-in-out infinite;
        }
        .scroll-label {
          animation: textFade 2.4s ease-in-out infinite;
        }
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
        <span className="scroll-label" style={{
          color: "white",
          fontSize: "0.4rem",
          letterSpacing: "0.5em",
          fontFamily: "Georgia, serif",
          textTransform: "uppercase",
        }}>
          SCROLL
        </span>
        <div className="neon-line" style={{
          width: "1px",
          background: "white",
          borderRadius: "1px",
        }} />
      </div>

    </div>
  );
}

"use client";
import { useRef } from "react";
import { infographicOpacity } from "./useScrollEngine";

interface VideoSectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  infographic1Ref: React.RefObject<HTMLDivElement | null>;
  infographic2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function VideoSection({ videoRef, infographic1Ref, infographic2Ref }: VideoSectionProps) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        muted playsInline preload="auto"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* INFOGRAFICO 1 — izquierda */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "0 8vw", pointerEvents: "none" }}>
        <div ref={infographic1Ref} style={{
          opacity: 0, transform: "perspective(1200px) rotateY(-90deg)", transition: "none", transformStyle: "preserve-3d",
          background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,255,255,0.15)",
          padding: "3rem 4rem", maxWidth: "36rem", borderRadius: "2px",
        }}>
          <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5em", fontSize: "0.55rem", display: "block", marginBottom: "1.2rem", fontStyle: "italic" }}>
            Especificaciones
          </span>
          <h2 style={{ fontFamily: "Georgia, serif", color: "white", fontSize: "clamp(2.2rem, 4.5vw, 4rem)", fontWeight: 300, letterSpacing: "0.05em", lineHeight: 1.2, margin: "0 0 1.2rem" }}>
            12.000 m² <br />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75em", fontFamily: "sans-serif", fontWeight: 100, letterSpacing: "-0.02em" }}>Parcela Privada</span>
          </h2>
          <div style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,0.4)", marginBottom: "1.2rem" }} />
          <p style={{ color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem", lineHeight: 2, margin: 0 }}>
            Arquitectura brutalista fundida<br />con el paisaje mediterraneo.
          </p>
        </div>
      </div>

      {/* INFOGRAFICO 2 — derecha */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 8vw", pointerEvents: "none" }}>
        <div ref={infographic2Ref} style={{
          opacity: 0, transform: "perspective(1200px) rotateY(90deg)", transition: "none", transformStyle: "preserve-3d",
          background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,255,255,0.15)",
          padding: "3rem 4rem", maxWidth: "36rem", borderRadius: "2px", textAlign: "right",
        }}>
          <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5em", fontSize: "0.55rem", display: "block", marginBottom: "1.2rem", fontStyle: "italic" }}>
            Perspectiva
          </span>
          <h2 style={{ fontFamily: "Georgia, serif", color: "white", fontSize: "clamp(2.2rem, 4.5vw, 4rem)", fontWeight: 300, letterSpacing: "0.05em", lineHeight: 1.2, margin: "0 0 1.2rem" }}>
            Horizonte <br />
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75em", fontFamily: "sans-serif", fontWeight: 100, letterSpacing: "-0.02em" }}>Sin Limites</span>
          </h2>
          <div style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,0.4)", marginBottom: "1.2rem", marginLeft: "auto" }} />
          <p style={{ color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem", lineHeight: 2, margin: 0 }}>
            Piscina panoramica<br />con reflejos de titanio.
          </p>
        </div>
      </div>
    </div>
  );
}

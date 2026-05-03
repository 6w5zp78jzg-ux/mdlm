"use client";
import { useRef } from "react";
import { Property } from "@/types/property";
import { useScrollEngine } from "./useScrollEngine";
import Navbar from "./Navbar";
import ScrollIndicator from "./ScrollIndicator";
import GallerySection from "./GallerySection";

interface Props {
  property: Property;
  locale: string;
}

export default function PropertyExperience({ property, locale }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const infographic1Ref = useRef<HTMLDivElement>(null);
  const infographic2Ref = useRef<HTMLDivElement>(null);

  const lang = locale as "es" | "en" | "fr" | "ru";
  const inf1 = property.infografias[0];
  const inf2 = property.infografias[1];

  useScrollEngine({ videoRef, stageRef, galleryTrackRef, infographic1Ref, infographic2Ref });

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
      <Navbar />
      <ScrollIndicator />
      <div ref={stageRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", willChange: "height, transform" }}>

        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}>
          <video ref={videoRef} src={property.video_url} muted playsInline preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />

          {inf1 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "0 8vw", pointerEvents: "none" }}>
              <div ref={infographic1Ref} style={{ opacity: 0, transform: "translate3d(-50px, 60px, 0)", transition: "none", background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,255,255,0.15)", padding: "3rem 4rem", maxWidth: "36rem", borderRadius: "2px" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5em", fontSize: "0.55rem", display: "block", marginBottom: "1.2rem", fontStyle: "italic" }}>{inf1.label}</span>
                <h2 style={{ fontFamily: "Georgia, serif", color: "white", fontSize: "clamp(2.2rem, 4.5vw, 4rem)", fontWeight: 300, lineHeight: 1.2, margin: "0 0 1.2rem" }}>
                  {inf1.titulo}<br />
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75em", fontFamily: "sans-serif", fontWeight: 100 }}>{inf1.subtitulo}</span>
                </h2>
                <div style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,0.4)", marginBottom: "1.2rem" }} />
                <p style={{ color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem", lineHeight: 2, margin: 0 }}>{inf1.texto}</p>
              </div>
            </div>
          )}

          {inf2 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 8vw", pointerEvents: "none" }}>
              <div ref={infographic2Ref} style={{ opacity: 0, transform: "translate3d(50px, 60px, 0)", transition: "none", background: "rgba(0,0,0,0.09)", border: "1px solid rgba(255,255,255,0.15)", padding: "3rem 4rem", maxWidth: "36rem", borderRadius: "2px", textAlign: "right" }}>
                <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.5em", fontSize: "0.55rem", display: "block", marginBottom: "1.2rem", fontStyle: "italic" }}>{inf2.label}</span>
                <h2 style={{ fontFamily: "Georgia, serif", color: "white", fontSize: "clamp(2.2rem, 4.5vw, 4rem)", fontWeight: 300, lineHeight: 1.2, margin: "0 0 1.2rem" }}>
                  {inf2.titulo}<br />
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75em", fontFamily: "sans-serif", fontWeight: 100 }}>{inf2.subtitulo}</span>
                </h2>
                <div style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,0.4)", marginBottom: "1.2rem", marginLeft: "auto" }} />
                <p style={{ color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem", lineHeight: 2, margin: 0 }}>{inf2.texto}</p>
              </div>
            </div>
          )}
        </div>

        <GallerySection galleryTrackRef={galleryTrackRef} images={property.galeria_urls} titulo={property.titulo[lang]} ubicacion={property.ubicacion} />
      </div>
    </div>
  );
}

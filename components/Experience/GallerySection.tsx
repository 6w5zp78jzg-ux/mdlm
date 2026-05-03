"use client";

interface GallerySectionProps {
  galleryTrackRef: React.RefObject<HTMLDivElement | null>;
  images: string[];
  titulo?: string;
  ubicacion?: string;
}

export default function GallerySection({ galleryTrackRef, images, titulo, ubicacion }: GallerySectionProps) {
  return (
    <div style={{ position: "absolute", top: "100vh", left: 0, width: "100%", height: "50vh", overflow: "hidden", background: "linear-gradient(to bottom, #050505, #0a0a0a)", borderTop: "1px solid rgba(201,169,110,0.15)" }}>
      <div ref={galleryTrackRef} style={{ display: "flex", alignItems: "center", height: "100%", width: "max-content", gap: "1.5rem", paddingLeft: "4rem", paddingRight: "4rem", willChange: "transform" }}>
        <div style={{ flexShrink: 0, width: "16vw", color: "#c9a96e", fontFamily: "Georgia, serif" }}>
          <p style={{ fontSize: "0.5rem", letterSpacing: "0.45em", opacity: 0.4, textTransform: "uppercase", margin: "0 0 0.8rem" }}>Seleccion</p>
          <h2 style={{ fontSize: "clamp(1rem, 1.8vw, 1.5rem)", fontWeight: 300, lineHeight: 1.3, margin: "0 0 1rem" }}>{titulo || "Propiedades Exclusivas"}</h2>
          <div style={{ width: "2rem", height: "1px", background: "#c9a96e", opacity: 0.25, marginBottom: "1rem" }} />
          <p style={{ fontSize: "0.45rem", letterSpacing: "0.2em", opacity: 0.3, lineHeight: 1.8, margin: 0 }}>{ubicacion || "MARBELLA"}<br />COSTA DEL SOL</p>
        </div>
        <div style={{ flexShrink: 0, width: "1px", height: "60%", background: "rgba(201,169,110,0.2)" }} />
        {images.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, width: "38vw", height: "40vh", overflow: "hidden", position: "relative" }}>
            <img src={src} alt={"Imagen " + (i + 1)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", bottom: "0.8rem", left: "0.8rem", background: "rgba(0,0,0,0.4)", padding: "0.3rem 0.6rem" }}>
              <p style={{ color: "#c9a96e", fontSize: "0.45rem", letterSpacing: "0.4em", margin: 0, opacity: 0.8 }}>0{i + 1}</p>
            </div>
          </div>
        ))}
        <div style={{ flexShrink: 0, width: "8vw" }} />
      </div>
    </div>
  );
}

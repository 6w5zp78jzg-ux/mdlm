"use client";
import { useState } from "react";

interface GallerySectionProps {
  galleryTrackRef: React.RefObject<HTMLDivElement | null>;
  galeriaUrls: string[];
}

export default function GallerySection({ galleryTrackRef, galeriaUrls }: GallerySectionProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:"fixed", inset:0, zIndex:1000,
            background:"rgba(0,0,0,0.92)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"zoom-out",
            backdropFilter:"blur(8px)",
            animation:"fadeInLB 0.3s ease both",
          }}
        >
          <style>{`
            @keyframes fadeInLB{0%{opacity:0;}100%{opacity:1;}}
            @keyframes scaleInLB{0%{opacity:0;transform:scale(0.92);}100%{opacity:1;transform:scale(1);}}
          `}</style>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width:"80vw", height:"80vh",
              position:"relative",
              animation:"scaleInLB 0.35s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <img
              src={lightbox}
              alt=""
              style={{
                width:"100%", height:"100%",
                objectFit:"contain",
              }}
            />
            {/* Botón cerrar */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position:"absolute", top:"-2.5rem", right:0,
                background:"none", border:"none",
                color:"rgba(255,255,255,0.5)",
                fontFamily:"'Helvetica Neue',sans-serif",
                fontSize:"0.5rem", letterSpacing:"0.4em",
                textTransform:"uppercase", cursor:"pointer",
              }}
            >
              CLOSE ✕
            </button>
            {/* Navegación */}
            {galeriaUrls.length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const i = galeriaUrls.indexOf(lightbox);
                    setLightbox(galeriaUrls[(i - 1 + galeriaUrls.length) % galeriaUrls.length]);
                  }}
                  style={{
                    position:"absolute", left:"-3rem", top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"1px solid rgba(255,255,255,0.15)",
                    color:"rgba(255,255,255,0.5)", width:"2.2rem", height:"2.2rem",
                    cursor:"pointer", fontSize:"0.9rem",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                >←</button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const i = galeriaUrls.indexOf(lightbox);
                    setLightbox(galeriaUrls[(i + 1) % galeriaUrls.length]);
                  }}
                  style={{
                    position:"absolute", right:"-3rem", top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"1px solid rgba(255,255,255,0.15)",
                    color:"rgba(255,255,255,0.5)", width:"2.2rem", height:"2.2rem",
                    cursor:"pointer", fontSize:"0.9rem",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                >→</button>
              </>
            )}
            {/* Contador */}
            <div style={{
              position:"absolute", bottom:"-2rem", left:"50%", transform:"translateX(-50%)",
              fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem",
              color:"rgba(255,255,255,0.3)", letterSpacing:"0.4em",
            }}>
              {String(galeriaUrls.indexOf(lightbox)+1).padStart(2,"0")} / {String(galeriaUrls.length).padStart(2,"0")}
            </div>
          </div>
        </div>
      )}

      {/* Galería horizontal */}
      <div
        ref={galleryTrackRef}
        style={{
          display:"flex", alignItems:"center",
          height:"100%", paddingLeft:"5vw",
          gap:"2vw", willChange:"transform",
        }}
      >
        {galeriaUrls.map((url, i) => (
          <div
            key={i}
            onClick={() => setLightbox(url)}
            style={{
              flexShrink:0,
              width:"60vw", height:"70vh",
              cursor:"zoom-in",
              overflow:"hidden",
              position:"relative",
            }}
          >
            <img
              src={url}
              alt={`Gallery ${i+1}`}
              style={{
                width:"100%", height:"100%",
                objectFit:"cover",
                transition:"transform 0.6s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div style={{
              position:"absolute", bottom:"1.5rem", right:"1.5rem",
              color:"rgba(255,255,255,0.4)",
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.4rem", letterSpacing:"0.4em",
            }}>
              {String(i+1).padStart(2,"0")}
            </div>
          </div>
        ))}
        <div style={{ flexShrink:0, width:"5vw" }}/>
      </div>
    </>
  );
}

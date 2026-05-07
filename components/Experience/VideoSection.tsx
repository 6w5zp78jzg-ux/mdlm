"use client";

interface VideoSectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  infographic1Ref: React.RefObject<HTMLDivElement | null>;
  infographic2Ref: React.RefObject<HTMLDivElement | null>;
  videoUrl?: string;
  inf1?: { label: string; titulo: string; subtitulo: string; texto: string } | null;
  inf2?: { label: string; titulo: string; subtitulo: string; texto: string } | null;
}

export default function VideoSection({
  videoRef, infographic1Ref, infographic2Ref,
  videoUrl = "/videos/hero.mp4", inf1, inf2,
}: VideoSectionProps) {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .inf-wrapper-1 { justify-content: flex-start !important; align-items: flex-end !important; padding: 0 0 35vh 1.5rem !important; }
          .inf-wrapper-2 { justify-content: flex-end !important; align-items: flex-start !important; padding: 15vh 1.5rem 0 0 !important; }
          .inf-box { max-width: 48vw !important; }
        }
      `}</style>
      <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100vh", overflow:"hidden" }}>
        <video
          ref={videoRef}
          src={videoUrl}
          muted playsInline preload="auto"
          style={{ width:"100%", height:"100%", objectFit:"cover" }}
        />

        {/* INFOGRAFICO 1 — izquierda */}
        <div className="inf-wrapper-1" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"flex-start", padding:"0 clamp(1.5rem,8vw,8vw)", pointerEvents:"none" }}>
          <div
            ref={infographic1Ref}
            className="inf-box"
            style={{
              opacity:0,
              transform:"translate3d(0px, 120px, 0)",
              transition:"none",
              background:"transparent",
              border:"none",
              padding:"clamp(1rem,2vw,2rem) 0",
              maxWidth:"clamp(180px,32vw,32rem)",
            }}
          >
            <span style={{ color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.45em", fontSize:"clamp(0.4rem,1vw,0.55rem)", display:"block", marginBottom:"1rem", fontStyle:"italic" }}>
              {inf1?.label || "Especificaciones"}
            </span>
            <h2 style={{ fontFamily:"Georgia,serif", color:"white", fontSize:"clamp(1.6rem,3.5vw,4rem)", fontWeight:300, lineHeight:1.15, margin:"0 0 0.8rem" }}>
              {inf1?.titulo || "12.000 m²"}<br />
              <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.75em", fontFamily:"sans-serif", fontWeight:100 }}>
                {inf1?.subtitulo || "Parcela Privada"}
              </span>
            </h2>
            <div style={{ width:"2.5rem", height:"1px", background:"rgba(255,255,255,0.35)", marginBottom:"0.8rem" }}/>
            <p style={{ color:"rgba(255,255,255,0.8)", textTransform:"uppercase", letterSpacing:"0.15em", fontSize:"clamp(0.4rem,0.9vw,0.6rem)", lineHeight:1.9, margin:0 }}>
              {inf1?.texto || "Arquitectura brutalista fundida con el paisaje mediterraneo."}
            </p>
          </div>
        </div>

        {/* INFOGRAFICO 2 — derecha */}
        <div className="inf-wrapper-2" style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"0 clamp(1.5rem,8vw,8vw)", pointerEvents:"none" }}>
          <div
            ref={infographic2Ref}
            className="inf-box"
            style={{
              opacity:0,
              transform:"translate3d(0px, 120px, 0)",
              transition:"none",
              background:"transparent",
              border:"none",
              padding:"clamp(1rem,2vw,2rem) 0",
              maxWidth:"clamp(180px,32vw,32rem)",
              textAlign:"right",
            }}
          >
            <span style={{ color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.45em", fontSize:"clamp(0.4rem,1vw,0.55rem)", display:"block", marginBottom:"1rem", fontStyle:"italic" }}>
              {inf2?.label || "Perspectiva"}
            </span>
            <h2 style={{ fontFamily:"Georgia,serif", color:"white", fontSize:"clamp(1.6rem,3.5vw,4rem)", fontWeight:300, lineHeight:1.15, margin:"0 0 0.8rem" }}>
              {inf2?.titulo || "Horizonte"}<br />
              <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.75em", fontFamily:"sans-serif", fontWeight:100 }}>
                {inf2?.subtitulo || "Sin Limites"}
              </span>
            </h2>
            <div style={{ width:"2.5rem", height:"1px", background:"rgba(255,255,255,0.35)", marginBottom:"0.8rem", marginLeft:"auto" }}/>
            <p style={{ color:"rgba(255,255,255,0.8)", textTransform:"uppercase", letterSpacing:"0.15em", fontSize:"clamp(0.4rem,0.9vw,0.6rem)", lineHeight:1.9, margin:0 }}>
              {inf2?.texto || "Piscina panoramica con reflejos de titanio."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

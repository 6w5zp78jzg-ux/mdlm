"use client";

interface VideoSectionProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  infographic1Ref: React.RefObject<HTMLDivElement | null>;
  infographic2Ref: React.RefObject<HTMLDivElement | null>;
  videoUrl?: string;
  inf1?: { label: string; titulo: string; subtitulo: string; texto: string } | null;
  inf2?: { label: string; titulo: string; subtitulo: string; texto: string } | null;
}

const mobileInfStyle = `
  @media (max-width: 768px) {
    .inf-box {
      background: transparent !important;
      border: none !important;
      backdrop-filter: none !important;
    }
  }
`;

export default function VideoSection({
  videoRef, infographic1Ref, infographic2Ref,
  videoUrl = "/videos/hero.mp4", inf1, inf2,
}: VideoSectionProps) {
  return (
    <>
    <style>{mobileInfStyle}</style>
    <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100vh", overflow:"hidden" }}>
      <video
        ref={videoRef}
        src={videoUrl}
        muted playsInline preload="auto"
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
      />

      {/* INFOGRAFICO 1 — izquierda */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"flex-start", padding:"0 clamp(1.5rem,5vw,8vw)", pointerEvents:"none" }}>
        <div
          ref={infographic1Ref}
          className="inf-box"
          style={{
            opacity:0,
            transform:"translate3d(0px, 120px, 0)",
            transition:"none",
            background:"rgba(0,0,0,0.09)",
            border:"1px solid rgba(255,255,255,0.15)",
            padding:"clamp(1.2rem,3vw,3rem) clamp(1.5rem,4vw,4rem)",
            maxWidth:"clamp(200px,38vw,36rem)",
            width:"100%",
            borderRadius:"2px",
          }}
        >
          <span style={{ color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.4em", fontSize:"clamp(0.4rem,1.2vw,0.55rem)", display:"block", marginBottom:"1rem", fontStyle:"italic" }}>
            {inf1?.label || "Especificaciones"}
          </span>
          <h2 style={{ fontFamily:"Georgia,serif", color:"white", fontSize:"clamp(1.4rem,3.5vw,4rem)", fontWeight:300, lineHeight:1.2, margin:"0 0 1rem" }}>
            {inf1?.titulo || "12.000 m²"}<br />
            <span style={{ color:"rgba(255,255,255,0.65)", fontSize:"0.75em", fontFamily:"sans-serif", fontWeight:100 }}>
              {inf1?.subtitulo || "Parcela Privada"}
            </span>
          </h2>
          <div style={{ width:"3rem", height:"1px", background:"rgba(255,255,255,0.4)", marginBottom:"1rem" }}/>
          <p style={{ color:"rgba(255,255,255,0.85)", textTransform:"uppercase", letterSpacing:"0.15em", fontSize:"clamp(0.45rem,1vw,0.6rem)", lineHeight:2, margin:0 }}>
            {inf1?.texto || "Arquitectura brutalista fundida con el paisaje mediterraneo."}
          </p>
        </div>
      </div>

      {/* INFOGRAFICO 2 — derecha */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"0 clamp(1.5rem,5vw,8vw)", pointerEvents:"none" }}>
        <div
          ref={infographic2Ref}
          className="inf-box"
          style={{
            opacity:0,
            transform:"translate3d(0px, 120px, 0)",
            transition:"none",
            background:"rgba(0,0,0,0.09)",
            border:"1px solid rgba(255,255,255,0.15)",
            padding:"clamp(1.2rem,3vw,3rem) clamp(1.5rem,4vw,4rem)",
            maxWidth:"clamp(200px,38vw,36rem)",
            width:"100%",
            borderRadius:"2px",
            textAlign:"right",
          }}
        >
          <span style={{ color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.4em", fontSize:"clamp(0.4rem,1.2vw,0.55rem)", display:"block", marginBottom:"1rem", fontStyle:"italic" }}>
            {inf2?.label || "Perspectiva"}
          </span>
          <h2 style={{ fontFamily:"Georgia,serif", color:"white", fontSize:"clamp(1.4rem,3.5vw,4rem)", fontWeight:300, lineHeight:1.2, margin:"0 0 1rem" }}>
            {inf2?.titulo || "Horizonte"}<br />
            <span style={{ color:"rgba(255,255,255,0.65)", fontSize:"0.75em", fontFamily:"sans-serif", fontWeight:100 }}>
              {inf2?.subtitulo || "Sin Limites"}
            </span>
          </h2>
          <div style={{ width:"3rem", height:"1px", background:"rgba(255,255,255,0.4)", marginBottom:"1rem", marginLeft:"auto" }}/>
          <p style={{ color:"rgba(255,255,255,0.85)", textTransform:"uppercase", letterSpacing:"0.15em", fontSize:"clamp(0.45rem,1vw,0.6rem)", lineHeight:2, margin:0 }}>
            {inf2?.texto || "Piscina panoramica con reflejos de titanio."}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

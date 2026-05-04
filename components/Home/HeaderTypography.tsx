"use client";
import { useEffect, useState } from "react";

const PHRASES = [
  { top:"THE APEX OF",    mainLeft:"MEDITERRANEAN", mainRight:"LIVING",   bottom:"ULTRA LUXURY ESTATES" },
  { top:"CURATED FOR",    mainLeft:"UNCOMPROMISING", mainRight:"VISION",  bottom:"ARCHITECTURAL POETRY" },
  { top:"WHERE ETERNITY", mainLeft:"MEETS",          mainRight:"THE SEA", bottom:"COASTAL MASTERPIECES" },
  { top:"REDEFINING",     mainLeft:"MODERN",         mainRight:"OPULENCE",bottom:"EXCLUSIVE SANCTUARIES" },
];

export default function HeaderTypography() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p+1)%PHRASES.length), 7000);
    return () => clearInterval(t);
  }, []);
  const p = PHRASES[idx];

  return (
    <>
      <style>{`
        .sp{perspective:1000px;transform-style:preserve-3d;}
        @keyframes revealTopText{0%{opacity:0;transform:translateY(20px);letter-spacing:0.1em;filter:blur(8px);}15%{opacity:1;transform:translateY(0);letter-spacing:0.5em;filter:blur(0);}85%{opacity:1;letter-spacing:0.6em;}100%{opacity:0;transform:translateY(-20px);filter:blur(12px);}}
        @keyframes slideImpactLeft{0%{opacity:0;transform:translate3d(-100px,0,-100px) rotateY(15deg);filter:blur(20px);clip-path:inset(0 100% 0 0);}15%{opacity:1;transform:translate3d(0,0,0) rotateY(0deg);filter:blur(0);clip-path:inset(0 0% 0 0);}85%{opacity:1;}100%{opacity:0;transform:translate3d(100px,0,100px) rotateY(-15deg);filter:blur(20px);clip-path:inset(0 0 0 100%);}}
        @keyframes slideImpactRight{0%{opacity:0;transform:translate3d(100px,0,100px) rotateY(-15deg);filter:blur(20px);clip-path:inset(0 0 0 100%);}15%{opacity:1;transform:translate3d(0,0,0) rotateY(0deg);filter:blur(0);clip-path:inset(0 0% 0 0);}85%{opacity:1;}100%{opacity:0;transform:translate3d(-100px,0,-100px) rotateY(15deg);filter:blur(20px);clip-path:inset(0 100% 0 0);}}
        @keyframes revealBottomText{0%{opacity:0;transform:translateY(30px) scale(0.95);clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);filter:blur(10px);}20%{opacity:1;transform:translateY(0) scale(1);clip-path:polygon(0 0,100% 0,100% 100%,0 100%);filter:blur(0);}80%{opacity:1;}100%{opacity:0;transform:translateY(-30px) scale(1.05);clip-path:polygon(0 0,100% 0,100% 0,0 0);filter:blur(10px);}}
        @keyframes masterBloom{0%,100%{filter:drop-shadow(0 0 20px rgba(255,255,255,0.2)) drop-shadow(0 0 50px rgba(201,169,110,0.1));}50%{filter:drop-shadow(0 0 35px rgba(255,255,255,0.5)) drop-shadow(0 0 80px rgba(201,169,110,0.25));}}
        @keyframes uiFadeIn{0%{opacity:0;filter:blur(10px);transform:translateY(15px);}100%{opacity:1;filter:blur(0);transform:translateY(0);}}
        .att{animation:revealTopText 7s cubic-bezier(0.19,1,0.22,1) both;will-change:transform,opacity,filter,letter-spacing;}
        .alt{animation:slideImpactLeft 7s cubic-bezier(0.16,1,0.3,1) both;will-change:transform,opacity,filter,clip-path;}
        .art{animation:slideImpactRight 7s cubic-bezier(0.16,1,0.3,1) both;will-change:transform,opacity,filter,clip-path;}
        .abt{animation:revealBottomText 7s cubic-bezier(0.25,1,0.5,1) both;will-change:transform,opacity,filter,clip-path;}
        .d1{animation-delay:0.1s;} .d2{animation-delay:0.3s;} .d3{animation-delay:0.4s;}
        .mg{animation:masterBloom 8s ease-in-out infinite;mix-blend-mode:screen;}
        .ue{animation:uiFadeIn 2.5s cubic-bezier(0.16,1,0.3,1) both;}
      `}</style>

      <div className="sp mg" style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 2rem",userSelect:"none",width:"100%"}}>
        <div key={idx} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <p className="att" style={{fontFamily:"'Helvetica Neue','Inter',sans-serif",fontSize:"clamp(0.6rem,1vw,0.9rem)",fontWeight:300,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",margin:"0 0 1.5rem",textAlign:"center"}}>{p.top}</p>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",flexWrap:"wrap",lineHeight:0.85,padding:"10px 0",gap:"0.15em"}}>
            <span className="alt d1" style={{fontFamily:"'Helvetica Neue','Inter',sans-serif",fontSize:"clamp(3rem,9vw,9rem)",fontWeight:100,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.95)",letterSpacing:"-0.01em",transformOrigin:"right center"}}>{p.mainLeft}</span>
            <span className="art d2" style={{fontFamily:"'Playfair Display','Didot','Bodoni MT',serif",fontSize:"clamp(3.5rem,10vw,10rem)",fontWeight:700,fontStyle:"italic",color:"#ffffff",letterSpacing:"-0.04em",transformOrigin:"left center"}}>{p.mainRight}</span>
          </div>
          <p className="abt d3" style={{fontFamily:"'Helvetica Neue','Inter',sans-serif",fontWeight:400,fontSize:"clamp(0.65rem,1vw,0.85rem)",textTransform:"uppercase",color:"#c9a96e",margin:"2.5rem 0 0",textAlign:"center",letterSpacing:"0.4em"}}>{p.bottom}</p>
        </div>
        <div className="ue" style={{width:"1px",height:"4rem",background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.3),transparent)",margin:"3rem 0 2rem",animationDelay:"1.5s"}}/>
        <div className="ue" style={{display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap",justifyContent:"center",color:"rgba(255,255,255,0.4)",fontFamily:"'Helvetica Neue','Inter',sans-serif",fontSize:"clamp(0.45rem,0.65vw,0.6rem)",fontWeight:400,letterSpacing:"0.35em",textTransform:"uppercase",animationDelay:"1.7s"}}>
          {["Golden Mile","Puerto Banús","Nueva Andalucía","Sierra Blanca"].map((loc,i,arr) => (
            <span key={loc} style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {loc}{i<arr.length-1&&<span style={{fontFamily:"'Playfair Display',serif",color:"rgba(201,169,110,0.6)",fontSize:"1.2em"}}>✦</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="ue" style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",pointerEvents:"none",zIndex:20,animationDelay:"2s"}}>
        <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.45rem",letterSpacing:"0.6em",fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,textTransform:"uppercase"}}>DISCOVER</span>
      </div>
    </>
  );
}

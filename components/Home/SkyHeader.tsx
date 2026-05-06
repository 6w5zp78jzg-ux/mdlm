"use client";
import { useEffect, useState } from "react";

const PHRASES = [
  { top:"THE APEX OF",     mainLeft:"MEDITERRANEAN", mainRight:"LIVING",   bottom:"ULTRA LUXURY ESTATES" },
  { top:"CURATED FOR",     mainLeft:"UNCOMPROMISING", mainRight:"VISION",  bottom:"ARCHITECTURAL POETRY" },
  { top:"WHERE ETERNITY",  mainLeft:"MEETS",          mainRight:"THE SEA", bottom:"COASTAL MASTERPIECES" },
  { top:"REDEFINING",      mainLeft:"MODERN",         mainRight:"OPULENCE",bottom:"EXCLUSIVE SANCTUARIES" },
];

export default function SkyHeader() {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(p => (p + 1) % PHRASES.length);
      setAnimKey(p => p + 1);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const p = PHRASES[idx];

  return (
    <>
      <style>{`
        @keyframes lineInOut{
          0%  {opacity:0;transform:translateY(30px);filter:blur(12px);}
          12% {opacity:1;transform:translateY(0);filter:blur(0);}
          85% {opacity:1;transform:translateY(0);filter:blur(0);}
          100%{opacity:0;transform:translateY(-20px);filter:blur(20px);}
        }
        @keyframes lineIn{
          0%  {opacity:0;transform:translateY(20px);filter:blur(8px);}
          100%{opacity:1;transform:translateY(0);filter:blur(0);}
        }
        .tl1{animation:lineInOut 7s cubic-bezier(0.16,1,0.3,1) 0s both;}
        .tl2{animation:lineInOut 7s cubic-bezier(0.16,1,0.3,1) 0.12s both;}
        .tl3{animation:lineInOut 7s cubic-bezier(0.16,1,0.3,1) 0.24s both;}
        .ue{animation:lineIn 1.2s cubic-bezier(0.16,1,0.3,1) both;}
      `}</style>

      <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 2rem",userSelect:"none",width:"100%"}}>
        <div key={animKey} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <p className="tl1" style={{
            fontFamily:"'Helvetica Neue',sans-serif",
            fontSize:"clamp(0.6rem,1vw,0.9rem)",
            fontWeight:300, color:"rgba(255,255,255,0.7)",
            textTransform:"uppercase", margin:"0 0 1.5rem", textAlign:"center",
            letterSpacing:"0.5em",
          }}>{p.top}</p>

          <div className="tl2" style={{display:"flex",alignItems:"baseline",justifyContent:"center",flexWrap:"wrap",lineHeight:0.85,padding:"10px 0",gap:"0.15em"}}>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"clamp(3rem,9vw,9rem)", fontWeight:100,
              color:"transparent",
              WebkitTextStroke:"1px rgba(255,255,255,0.95)",
              letterSpacing:"-0.01em",
            }}>{p.mainLeft}</span>
            <span style={{
              fontFamily:"'Playfair Display','Didot',serif",
              fontSize:"clamp(3.5rem,10vw,10rem)", fontWeight:700,
              fontStyle:"italic", color:"#fff",
              letterSpacing:"-0.04em",
            }}>{p.mainRight}</span>
          </div>

          <p className="tl3" style={{
            fontFamily:"'Helvetica Neue',sans-serif",
            fontWeight:400, fontSize:"clamp(0.65rem,1vw,0.85rem)",
            textTransform:"uppercase", color:"#c9a96e",
            margin:"2.5rem 0 0", textAlign:"center", letterSpacing:"0.4em",
          }}>{p.bottom}</p>
        </div>

        <div className="ue" style={{
          width:"1px", height:"4rem",
          background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.3),transparent)",
          margin:"3rem 0 2rem", animationDelay:"0.5s",
        }}/>

        <div className="ue" style={{
          display:"flex", alignItems:"center", gap:"1.5rem",
          flexWrap:"wrap", justifyContent:"center",
          color:"rgba(255,255,255,0.4)",
          fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"clamp(0.45rem,0.65vw,0.6rem)",
          fontWeight:400, letterSpacing:"0.35em",
          textTransform:"uppercase", animationDelay:"0.7s",
        }}>
          {["Golden Mile","Puerto Banús","Nueva Andalucía","Sierra Blanca"].map((loc,i,arr) => (
            <span key={loc} style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {loc}{i<arr.length-1&&<span style={{fontFamily:"'Playfair Display',serif",color:"rgba(201,169,110,0.6)",fontSize:"1.2em"}}>✦</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="ue" style={{
        position:"absolute", bottom:"2rem", left:"50%",
        transform:"translateX(-50%)", zIndex:20, animationDelay:"1s",
      }}>
        <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.45rem",letterSpacing:"0.6em",fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,textTransform:"uppercase"}}>SCROLL</span>
      </div>
    </>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

const PHRASES = [
  { top:"THE APEX OF",     mainLeft:"MEDITERRANEAN", mainRight:"LIVING",   bottom:"ULTRA LUXURY ESTATES" },
  { top:"CURATED FOR",     mainLeft:"UNCOMPROMISING", mainRight:"VISION",  bottom:"ARCHITECTURAL POETRY" },
  { top:"WHERE ETERNITY",  mainLeft:"MEETS",          mainRight:"THE SEA", bottom:"COASTAL MASTERPIECES" },
  { top:"REDEFINING",      mainLeft:"MODERN",         mainRight:"OPULENCE",bottom:"EXCLUSIVE SANCTUARIES" },
];

export default function SkyHeader() {
  const skyRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(p => (p + 1) % PHRASES.length);
      setAnimKey(p => p + 1);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let rafId: number;
    let cycleTime = 0;
    const lc = (a: number[], b: number[], k: number) =>
      `rgb(${Math.round(a[0]+(b[0]-a[0])*k)},${Math.round(a[1]+(b[1]-a[1])*k)},${Math.round(a[2]+(b[2]-a[2])*k)})`;
    const palettes = [
      [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
      [[255,245,184],[255,213,79],[79,195,247],[25,118,210],[6,26,58]],
      [[255,167,38],[216,67,21],[106,27,154],[26,18,69],[6,8,24]],
      [[80,40,120],[40,30,80],[26,18,69],[10,10,42],[0,0,0]],
      [[10,10,58],[5,5,36],[2,2,26],[0,0,0],[0,0,0]],
      [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
    ];
    const tick = () => {
      cycleTime = (cycleTime + 1/60/90) % 1;
      const t = cycleTime;
      const angle = t * 360 - 90;
      const lx = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const ly = 50 + Math.sin(angle * Math.PI / 180) * 80;
      const pi = Math.floor(t * 5) % 5;
      const k = (t * 5) - Math.floor(t * 5);
      const pA = palettes[pi], pB = palettes[pi + 1];
      if (skyRef.current) {
        skyRef.current.style.background = `radial-gradient(ellipse 130% 90% at ${lx}% ${ly}%,
          ${lc(pA[0],pB[0],k)} 0%,${lc(pA[1],pB[1],k)} 12%,
          ${lc(pA[2],pB[2],k)} 30%,${lc(pA[3],pB[3],k)} 60%,
          ${lc(pA[4],pB[4],k)} 100%)`;
      }
      if (starsRef.current) {
        let v = 0;
        if (t > 0.5 && t < 0.95) v = Math.sin(((t-0.5)/0.45)*Math.PI);
        starsRef.current.style.opacity = String(v);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const stars = Array.from({ length: 80 }, (_, i) => ({
    left: (i * 37) % 100, top: (i * 71) % 70,
    size: i % 3 === 0 ? 2 : 1, delay: (i * 0.13) % 4, bright: i % 5 === 0,
  }));

  const p = PHRASES[idx];

  return (
    <>
      <style>{`
        @keyframes starTwinkle{0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:1;transform:scale(1.5);}}
        .star{animation:starTwinkle ease-in-out infinite;}
        @keyframes lineIn{
          0%{opacity:0;transform:translateY(30px);filter:blur(8px);}
          100%{opacity:1;transform:translateY(0);filter:blur(0);}
        }
        .tl1{animation:lineIn 0.9s cubic-bezier(0.16,1,0.3,1) 0s both;}
        .tl2{animation:lineIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.12s both;}
        .tl3{animation:lineIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.24s both;}
        .ue{animation:lineIn 1.2s cubic-bezier(0.16,1,0.3,1) both;}
      `}</style>

      <div ref={skyRef} style={{position:"absolute",inset:0,transition:"background 0.1s linear"}}/>

      <div ref={starsRef} style={{position:"absolute",inset:0,opacity:0,pointerEvents:"none"}}>
        {stars.map((s,i) => (
          <div key={i} className="star" style={{
            position:"absolute",left:`${s.left}%`,top:`${s.top}%`,
            width:`${s.size}px`,height:`${s.size}px`,borderRadius:"50%",
            background:s.bright?"rgba(255,255,255,1)":"rgba(220,230,255,0.7)",
            boxShadow:s.bright?"0 0 4px rgba(255,255,255,0.8)":"none",
            animationDuration:`${2+s.delay}s`,animationDelay:`${s.delay}s`,
          }}/>
        ))}
      </div>

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

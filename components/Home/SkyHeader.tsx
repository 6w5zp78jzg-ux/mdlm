"use client";
import { useEffect, useRef, useState } from "react";

const PHRASES = [
  {
    line1: { text: "MEDITERRANEAN", weight: 900 },
    line2: { text: "living", weight: 100, italic: true },
    line3: { text: "ESTATES", weight: 900 },
    sub: "ULTRA LUXURY REAL ESTATE",
  },
  {
    line1: { text: "UNCOMPROMISING", weight: 900 },
    line2: { text: "vision", weight: 100, italic: true },
    line3: { text: "AWAITS", weight: 900 },
    sub: "ARCHITECTURAL POETRY",
  },
  {
    line1: { text: "WHERE ETERNITY", weight: 100 },
    line2: { text: "MEETS", weight: 900, italic: false },
    line3: { text: "the sea", weight: 100, italic: true },
    sub: "COASTAL MASTERPIECES",
  },
  {
    line1: { text: "REDEFINING", weight: 900 },
    line2: { text: "modern", weight: 100, italic: true },
    line3: { text: "OPULENCE", weight: 900 },
    sub: "EXCLUSIVE SANCTUARIES",
  },
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
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,100;0,6..96,400;0,6..96,900;1,6..96,100;1,6..96,400;1,6..96,900&display=swap');

        @keyframes starTwinkle{0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:1;transform:scale(1.5);}}
        .star{animation:starTwinkle ease-in-out infinite;}

        @keyframes lineIn{
          0%  {opacity:0;transform:translateY(30px);}
          100%{opacity:1;transform:translateY(0);}
        }
        @keyframes lineOut{
          0%  {opacity:1;transform:translateY(0);}
          100%{opacity:0;transform:translateY(-20px);}
        }

        .tl1{animation:lineIn 0.9s cubic-bezier(0.16,1,0.3,1) 0s both;}
        .tl2{animation:lineIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.12s both;}
        .tl3{animation:lineIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.24s both;}
        .tsub{animation:lineIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s both;}
        .ue{animation:lineIn 1.2s cubic-bezier(0.16,1,0.3,1) both;}
      `}</style>

      {/* CIELO */}
      <div ref={skyRef} style={{position:"absolute",inset:0,transition:"background 0.1s linear"}}/>

      {/* ESTRELLAS */}
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

      {/* TIPOGRAFIA — Bodoni Moda con contraste extremo de pesos */}
      <div style={{
        position:"relative", zIndex:10,
        display:"flex", flexDirection:"column",
        alignItems:"center", padding:"0 3rem",
        userSelect:"none", width:"100%",
      }}>
        <div key={animKey} style={{
          display:"flex", flexDirection:"column",
          alignItems:"center", width:"100%",
          textAlign:"center",
        }}>

          {/* LINEA 1 */}
          <div className="tl1" style={{
            fontFamily:"'Bodoni Moda',serif",
            fontSize: p.line1.weight === 900
              ? "clamp(2.8rem,7vw,7.5rem)"
              : "clamp(2rem,5vw,5.5rem)",
            fontWeight: p.line1.weight,
            fontStyle: "normal",
            color: p.line1.weight === 900 ? "#fff" : "rgba(255,255,255,0.6)",
            letterSpacing: p.line1.weight === 900 ? "-0.02em" : "0.15em",
            lineHeight: 0.95,
            textTransform:"uppercase",
          }}>
            {p.line1.text}
          </div>

          {/* LINEA 2 — contraste máximo */}
          <div className="tl2" style={{
            fontFamily:"'Bodoni Moda',serif",
            fontSize: p.line2.weight === 900
              ? "clamp(3.5rem,9vw,9.5rem)"
              : "clamp(3rem,8vw,8.5rem)",
            fontWeight: p.line2.weight,
            fontStyle: p.line2.italic ? "italic" : "normal",
            color: p.line2.weight === 100 ? "rgba(255,255,255,0.75)" : "#fff",
            letterSpacing: p.line2.weight === 900 ? "-0.03em" : "0.02em",
            lineHeight: 0.9,
            textTransform: p.line2.italic ? "none" : "uppercase",
          }}>
            {p.line2.text}
          </div>

          {/* LINEA 3 */}
          <div className="tl3" style={{
            fontFamily:"'Bodoni Moda',serif",
            fontSize: p.line3.weight === 900
              ? "clamp(2.5rem,6vw,6.5rem)"
              : "clamp(1.8rem,4vw,4.5rem)",
            fontWeight: p.line3.weight,
            fontStyle: p.line3?.italic ? "italic" : "normal",
            color: p.line3.weight === 900
              ? "transparent"
              : "rgba(255,255,255,0.5)",
            WebkitTextStroke: p.line3.weight === 900
              ? "1px rgba(255,255,255,0.8)"
              : "none",
            letterSpacing: p.line3.weight === 900 ? "-0.02em" : "0.2em",
            lineHeight: 1,
            textTransform:"uppercase",
          }}>
            {p.line3.text}
          </div>

          {/* Sub */}
          <div className="tsub" style={{
            fontFamily:"'Bodoni Moda',serif",
            fontSize:"clamp(0.5rem,0.8vw,0.75rem)",
            fontWeight:400,
            color:"#c9a96e",
            letterSpacing:"0.5em",
            textTransform:"uppercase",
            marginTop:"2.5rem",
          }}>
            {p.sub}
          </div>

        </div>

        {/* Linea vertical */}
        <div className="ue" style={{
          width:"1px", height:"4rem",
          background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.25),transparent)",
          margin:"2.5rem 0 1.5rem",
          animationDelay:"0.6s",
        }}/>

        {/* Localidades */}
        <div className="ue" style={{
          display:"flex", alignItems:"center", gap:"1.5rem",
          flexWrap:"wrap", justifyContent:"center",
          color:"rgba(255,255,255,0.35)",
          fontFamily:"'Bodoni Moda',serif",
          fontSize:"clamp(0.4rem,0.6vw,0.55rem)",
          fontWeight:400, letterSpacing:"0.4em",
          textTransform:"uppercase",
          animationDelay:"0.8s",
        }}>
          {["Golden Mile","Puerto Banús","Nueva Andalucía","Sierra Blanca"].map((loc,i,arr) => (
            <span key={loc} style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {loc}{i<arr.length-1&&<span style={{color:"rgba(201,169,110,0.5)",fontSize:"1.2em"}}>✦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* SCROLL */}
      <div className="ue" style={{
        position:"absolute", bottom:"2rem", left:"50%",
        transform:"translateX(-50%)", zIndex:20,
        animationDelay:"1s",
      }}>
        <span style={{
          color:"rgba(255,255,255,0.35)", fontSize:"0.45rem",
          letterSpacing:"0.6em", fontFamily:"'Bodoni Moda',serif",
          fontWeight:300, textTransform:"uppercase",
        }}>SCROLL</span>
      </div>
    </>
  );
}

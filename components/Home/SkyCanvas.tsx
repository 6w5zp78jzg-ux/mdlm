"use client";
import { useEffect, useRef } from "react";

export default function SkyCanvas() {
  const skyRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  const stars = Array.from({ length: 80 }, (_, i) => ({
    left: (i * 37) % 100, top: (i * 71) % 70,
    size: i % 3 === 0 ? 2 : 1,
    delay: (i * 0.13) % 4,
    bright: i % 5 === 0,
  }));

  useEffect(() => {
    let rafId: number;
    let cycleTime = 0;

    const lerpColor = (a: number[], b: number[], k: number) =>
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
      cycleTime = (cycleTime + 1 / 60 / 90) % 1;
      const t = cycleTime;
      const angle = t * 360 - 90;
      const lx = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const ly = 50 + Math.sin(angle * Math.PI / 180) * 80;
      const pi = Math.floor(t * 5) % 5;
      const k = (t * 5) - Math.floor(t * 5);
      const pA = palettes[pi], pB = palettes[pi + 1];

      if (skyRef.current) {
        skyRef.current.style.background = `radial-gradient(ellipse 130% 90% at ${lx}% ${ly}%,
          ${lerpColor(pA[0],pB[0],k)} 0%, ${lerpColor(pA[1],pB[1],k)} 12%,
          ${lerpColor(pA[2],pB[2],k)} 30%, ${lerpColor(pA[3],pB[3],k)} 60%,
          ${lerpColor(pA[4],pB[4],k)} 100%)`;
      }
      if (sunRef.current) {
        let v = 0;
        if (t < 0.45) v = 1;
        else if (t < 0.55) v = 1 - (t - 0.45) / 0.10;
        else if (t > 0.95) v = (t - 0.95) / 0.05;
        sunRef.current.style.opacity = String(v);
        sunRef.current.style.left = `${lx}%`;
        sunRef.current.style.top = `${ly}%`;
      }
      if (moonRef.current) {
        let v = 0;
        if (t > 0.55 && t < 0.95) {
          if (t < 0.65) v = (t - 0.55) / 0.10;
          else if (t > 0.85) v = 1 - (t - 0.85) / 0.10;
          else v = 1;
        }
        const ma = (t - 0.5) * 2 * 180 - 90;
        moonRef.current.style.opacity = String(v);
        moonRef.current.style.left = `${50 + Math.cos(ma * Math.PI / 180) * 35}%`;
        moonRef.current.style.top = `${30 + Math.sin(ma * Math.PI / 180) * 20}%`;
      }
      if (starsRef.current) {
        let v = 0;
        if (t > 0.5 && t < 0.95) v = Math.sin(((t - 0.5) / 0.45) * Math.PI);
        starsRef.current.style.opacity = String(v);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style>{`
        @keyframes sunGlow { 0%,100%{box-shadow:0 0 30px 8px rgba(255,200,100,0.5),0 0 60px 18px rgba(255,140,40,0.2);} 50%{box-shadow:0 0 45px 12px rgba(255,220,140,0.7),0 0 80px 25px rgba(255,160,60,0.3);} }
        @keyframes moonGlow { 0%,100%{box-shadow:0 0 40px 10px rgba(220,230,255,0.4);} 50%{box-shadow:0 0 60px 15px rgba(240,245,255,0.6);} }
        @keyframes starTwinkle { 0%,100%{opacity:0.3;transform:scale(1);} 50%{opacity:1;transform:scale(1.5);} }
        .sun-orb{animation:sunGlow 4s ease-in-out infinite;}
        .moon-orb{animation:moonGlow 5s ease-in-out infinite;}
        .star{animation:starTwinkle ease-in-out infinite;}
      `}</style>

      <div ref={skyRef} style={{ position:"absolute", inset:0 }} />

      <div ref={starsRef} style={{ position:"absolute", inset:0, opacity:0, pointerEvents:"none" }}>
        {stars.map((s, i) => (
          <div key={i} className="star" style={{ position:"absolute", left:`${s.left}%`, top:`${s.top}%`, width:`${s.size}px`, height:`${s.size}px`, borderRadius:"50%", background: s.bright ? "rgba(255,255,255,1)" : "rgba(220,230,255,0.7)", boxShadow: s.bright ? "0 0 4px rgba(255,255,255,0.8)" : "none", animationDuration:`${2+s.delay}s`, animationDelay:`${s.delay}s` }} />
        ))}
      </div>

      <div ref={sunRef} className="sun-orb" style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", background:"radial-gradient(circle, #fff5b8 0%, #ffd54f 40%, #ff8c00 80%, transparent 100%)", transform:"translate(-50%,-50%)", pointerEvents:"none" }}>
        <div style={{ position:"absolute", inset:"-20px", borderRadius:"50%", background:"radial-gradient(circle, rgba(255,200,80,0.3) 0%, transparent 70%)" }} />
      </div>

      <div ref={moonRef} className="moon-orb" style={{ position:"absolute", width:"100px", height:"100px", borderRadius:"50%", background:"radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f4ff 40%, #c8d4f0 70%, #8090b0 100%)", transform:"translate(-50%,-50%)", pointerEvents:"none", opacity:0 }}>
        <div style={{ position:"absolute", top:"30%", left:"25%", width:"12px", height:"12px", borderRadius:"50%", background:"rgba(120,140,170,0.4)" }} />
        <div style={{ position:"absolute", top:"55%", left:"55%", width:"8px",  height:"8px",  borderRadius:"50%", background:"rgba(120,140,170,0.3)" }} />
        <div style={{ position:"absolute", top:"20%", left:"60%", width:"6px",  height:"6px",  borderRadius:"50%", background:"rgba(120,140,170,0.35)" }} />
        <div style={{ position:"absolute", top:"65%", left:"20%", width:"10px", height:"10px", borderRadius:"50%", background:"rgba(120,140,170,0.3)" }} />
      </div>
    </>
  );
}

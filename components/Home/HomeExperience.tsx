"use client";
import { useRef, useEffect } from "react";
import { useHomeScroll } from "./useHomeScroll";
import SkyHeader from "./SkyHeader";
import FilterPanels from "./FilterPanels";

interface Props { locale: string; }

const TOTAL_PANELS = 3;

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useHomeScroll({ headerRef, filtersRef, panelRefs, totalPanels: TOTAL_PANELS });

  // Cielo permanente — vive en HomeExperience, nunca desaparece
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
      const grad = `radial-gradient(ellipse 130% 90% at ${lx}% ${ly}%,
        ${lc(pA[0],pB[0],k)} 0%,${lc(pA[1],pB[1],k)} 12%,
        ${lc(pA[2],pB[2],k)} 30%,${lc(pA[3],pB[3],k)} 60%,
        ${lc(pA[4],pB[4],k)} 100%)`;
      if (skyRef.current) skyRef.current.style.background = grad;
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


  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"#000"}}>

      {/* Cielo permanente — nunca desaparece */}
      <div ref={skyRef} style={{position:"absolute",inset:0,zIndex:0,transition:"background 0.1s linear"}}/>
      <div ref={starsRef} style={{position:"absolute",inset:0,zIndex:1,opacity:0,pointerEvents:"none"}}>
        {stars.map((s,i) => (
          <div key={i} className="star-p" style={{
            position:"absolute",left:`${s.left}%`,top:`${s.top}%`,
            width:`${s.size}px`,height:`${s.size}px`,borderRadius:"50%",
            background:s.bright?"rgba(255,255,255,1)":"rgba(220,230,255,0.7)",
            boxShadow:s.bright?"0 0 4px rgba(255,255,255,0.8)":"none",
            animationDuration:`${2+s.delay}s`,animationDelay:`${s.delay}s`,
          }}/>
        ))}
      </div>

      {/* Header — solo tipografia */}
      <div ref={headerRef} style={{
        position:"absolute", inset:0, zIndex:20,
        willChange:"opacity,transform",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <SkyHeader locale={locale} />
      </div>

      {/* Filtros */}
      <div ref={filtersRef} style={{
        position:"absolute", inset:0, zIndex:10,
        opacity:0, pointerEvents:"none",
        perspective:"500px",
        perspectiveOrigin:"center center",
        background:"transparent",
      }}>
        <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d"}}>
          <FilterPanels locale={locale} panelRefs={panelRefs} />
        </div>
      </div>
    </div>
  );
}

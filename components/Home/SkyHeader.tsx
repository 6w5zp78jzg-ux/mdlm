"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getT } from "@/lib/i18n";

interface Props { locale: string; }

export default function SkyHeader({ locale }: Props) {
  const pathname = usePathname();
  const urlLocale = pathname.split("/")[1] || locale;
  const t = getT(urlLocale);
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const phrases = t.header.phrases;
  const locations = t.header.locations;

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(p => (p + 1) % phrases.length);
      setAnimKey(p => p + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [phrases.length]);

  const p = phrases[idx] ?? phrases[0];

  return (
    <>
      <style>{`
        @keyframes lineInOut{
          0%{opacity:0;transform:translateY(30px);filter:blur(12px);}
          12%{opacity:1;transform:translateY(0);filter:blur(0);}
          85%{opacity:1;}
          100%{opacity:0;transform:translateY(-20px);filter:blur(20px);}
        }
        @keyframes lineIn{
          0%{opacity:0;transform:translateY(20px);filter:blur(8px);}
          100%{opacity:1;transform:translateY(0);filter:blur(0);}
        }
        .tl1{animation:lineInOut 7s cubic-bezier(0.16,1,0.3,1) 0s both;}
        .tl2{animation:lineInOut 7s cubic-bezier(0.16,1,0.3,1) 0.12s both;}
        .tl3{animation:lineInOut 7s cubic-bezier(0.16,1,0.3,1) 0.24s both;}
        .ue{animation:lineIn 1.2s cubic-bezier(0.16,1,0.3,1) both;}
      `}</style>

      {/* Tipografia */}
      <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 2rem",userSelect:"none",width:"100%"}}>
        <div key={animKey} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <p className="tl1" style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(0.6rem,1vw,0.9rem)",fontWeight:300,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",margin:"0 0 1.5rem",textAlign:"center",letterSpacing:"0.5em"}}>
            {p?.top}
          </p>
          <div className="tl2" style={{display:"flex",alignItems:"baseline",justifyContent:"center",flexWrap:"wrap",lineHeight:0.85,padding:"10px 0",gap:"0.15em"}}>
            <span style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(3rem,9vw,9rem)",fontWeight:100,color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,0.95)",letterSpacing:"-0.01em"}}>
              {p?.mainLeft}
            </span>
            <span style={{fontFamily:"'Playfair Display','Didot',serif",fontSize:"clamp(3.5rem,10vw,10rem)",fontWeight:700,fontStyle:"italic",color:"#fff",letterSpacing:"-0.04em"}}>
              {p?.mainRight}
            </span>
          </div>
          <p className="tl3" style={{fontFamily:"'Helvetica Neue',sans-serif",fontWeight:400,fontSize:"clamp(0.65rem,1vw,0.85rem)",textTransform:"uppercase",color:"#c9a96e",margin:"2.5rem 0 0",textAlign:"center",letterSpacing:"0.4em"}}>
            {p?.bottom}
          </p>
        </div>

        <div className="ue" style={{width:"1px",height:"4rem",background:"linear-gradient(to bottom,transparent,rgba(255,255,255,0.3),transparent)",margin:"3rem 0 2rem",animationDelay:"0.5s"}}/>

        <div className="ue" style={{display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap",justifyContent:"center",color:"rgba(255,255,255,0.4)",fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(0.45rem,0.65vw,0.6rem)",fontWeight:400,letterSpacing:"0.35em",textTransform:"uppercase",animationDelay:"0.7s"}}>
          {locations.map((loc,i,arr) => (
            <span key={loc} style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {loc}{i<arr.length-1&&<span style={{fontFamily:"'Playfair Display',serif",color:"rgba(201,169,110,0.6)",fontSize:"1.2em"}}>✦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll */}
      <div className="ue" style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",zIndex:20,animationDelay:"1s"}}>
        <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.45rem",letterSpacing:"0.6em",fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,textTransform:"uppercase"}}>
          {t.header.scroll}
        </span>
      </div>
    </>
  );
}

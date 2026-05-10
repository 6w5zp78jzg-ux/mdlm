"use client";
import { useEffect, useRef, useState } from "react";
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

  const stars = Array.from({ length: 80 }, (_, i) => ({
    left: (i * 37) % 100, top: (i * 71) % 70,
    size: i % 3 === 0 ? 2 : 1, delay: (i * 0.13) % 4, bright: i % 5 === 0,
  }));

  const p = phrases[idx] ?? phrases[0];

  return (
    <>
      <style>{`
        @keyframes starTwinkle{0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:1;transform:scale(1.5);}}
        .star{animation:starTwinkle ease-in-out infinite;}
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
      <div className="ue" style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",zIndex:20,animationDelay:"1s"}}>
        <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.45rem",letterSpacing:"0.6em",fontFamily:"'Helvetica Neue',sans-serif",fontWeight:300,textTransform:"uppercase"}}>
          {t.header.scroll}
        </span>
      </div>
    </>
  );
}

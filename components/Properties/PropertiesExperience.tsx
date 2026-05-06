"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import Navbar from "@/components/Experience/Navbar";

interface Props {
  properties: Property[];
  locale: string;
  filters: { zona?: string; tipo?: string; precio?: string };
}

export default function PropertiesExperience({ properties, locale, filters }: Props) {
  const router = useRouter();
  const lang = locale as "es" | "en" | "fr" | "ru";
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const isAnimating = useRef(false);

  // Scroll acumulado para trinquete continuo
  const scrollAccum = useRef(0);
  const SCROLL_THRESHOLD = 120;

  const advance = (dir: 1 | -1) => {
    if (isAnimating.current) return;
    const next = current + dir;
    if (next < 0 || next >= properties.length) return;
    isAnimating.current = true;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
      isAnimating.current = false;
      // Permitir siguiente avance si hay scroll acumulado
      if (Math.abs(scrollAccum.current) >= SCROLL_THRESHOLD) {
        const remainDir = scrollAccum.current > 0 ? 1 : -1;
        scrollAccum.current = 0;
        advance(remainDir);
      }
    }, 650);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollAccum.current += e.deltaY;
      if (Math.abs(scrollAccum.current) >= SCROLL_THRESHOLD) {
        const dir = scrollAccum.current > 0 ? 1 : -1;
        scrollAccum.current = 0;
        advance(dir);
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        advance(dx > 0 ? 1 : -1);
      } else if (Math.abs(dy) > 50) {
        advance(dy > 0 ? 1 : -1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [current]);

  if (properties.length === 0) {
    return (
      <div style={{ position:"fixed", inset:0, background:"#080604", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <Navbar />
        <div style={{ textAlign:"center", padding:"2rem" }}>
          <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", letterSpacing:"0.5em", color:"rgba(201,169,110,0.7)", textTransform:"uppercase", marginBottom:"2rem" }}>
            No properties found
          </p>
          <h2 style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(2rem,4vw,3.5rem)", fontWeight:100, textTransform:"uppercase", color:"white", letterSpacing:"-0.02em", marginBottom:"3rem" }}>
            Refine your search
          </h2>
          <button
            onClick={() => router.push(`/${locale}`)}
            style={{ background:"none", border:"1px solid rgba(201,169,110,0.4)", color:"#c9a96e", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", letterSpacing:"0.5em", textTransform:"uppercase", padding:"1.2rem 3rem", cursor:"pointer" }}
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"#080604", overflow:"hidden" }}>
      <style>{`
        @keyframes ratchetOut {
          0%   { transform: rotateY(0deg);    opacity:1; }
          60%  { opacity:0.3; }
          100% { transform: rotateY(-110deg); opacity:0; }
        }
        @keyframes ratchetIn {
          0%   { transform: rotateY(110deg);  opacity:0; }
          40%  { opacity:0.3; }
          100% { transform: rotateY(0deg);    opacity:1; }
        }
        @keyframes ratchetOutReverse {
          0%   { transform: rotateY(0deg);   opacity:1; }
          100% { transform: rotateY(110deg); opacity:0; }
        }
        @keyframes ratchetInReverse {
          0%   { transform: rotateY(-110deg); opacity:0; }
          100% { transform: rotateY(0deg);    opacity:1; }
        }
        .card-stack {
          position: absolute;
          top: 50%; left: 50%;
          width: 72vw; height: 78vh;
          margin-left: -36vw; margin-top: -39vh;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }
        .card-stack-item {
          position: absolute; inset: 0;
          transform-origin: left center;
        }
      `}</style>

      <Navbar />

      {/* Filtros activos */}
      <div style={{
        position:"absolute", top:"5rem", left:"50%", transform:"translateX(-50%)",
        display:"flex", alignItems:"center", gap:"1rem", zIndex:30, flexWrap:"wrap", justifyContent:"center",
      }}>
        {Object.entries(filters).filter(([,v])=>v).map(([k,v]) => (
          <span key={k} style={{
            fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", fontWeight:300,
            color:"rgba(201,169,110,0.7)", letterSpacing:"0.4em", textTransform:"uppercase",
            padding:"0.4rem 1rem", border:"1px solid rgba(201,169,110,0.2)",
          }}>{v}</span>
        ))}
        <button
          onClick={() => router.push(`/${locale}`)}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", letterSpacing:"0.3em", textTransform:"uppercase", cursor:"pointer" }}
        >
          ← new search
        </button>
      </div>

      {/* Mazo de cartas — perspectiva global */}
      <div style={{ position:"absolute", inset:0, perspective:"1200px", perspectiveOrigin:"center center" }}>

        {/* Cartas del mazo apiladas detrás */}
        {properties.slice(0, current).map((_, i) => {
          const depth = current - i;
          return (
            <div key={`stack-${i}`} className="card-stack" style={{
              transform: `translateZ(${-depth * 8}px) scale(${1 - depth * 0.02})`,
              opacity: depth > 5 ? 0 : 1 - depth * 0.15,
              zIndex: i,
            }}>
              <div style={{ position:"absolute", inset:0, background:"#0d0b08", border:"1px solid rgba(201,169,110,0.08)" }}/>
            </div>
          );
        })}

        {/* Carta actual con animación de trinquete */}
        {properties[current] && (
          <div
            key={`card-${current}`}
            className="card-stack"
            style={{
              zIndex: properties.length + 1,
              animation: animating
                ? `ratchetOut 0.7s cubic-bezier(0.4,0,0.6,1) forwards`
                : "none",
            }}
          >
            <PropertyCard
              property={properties[current]}
              locale={locale}
              lang={lang}
              onNavigate={() => router.push(`/${locale}/propiedades/${properties[current].slug}`)}
            />
          </div>
        )}

        {/* Carta entrante */}
        {animating && properties[current + 1] && (
          <div
            key={`next-${current + 1}`}
            className="card-stack"
            style={{
              zIndex: properties.length + 2,
              animation: `ratchetIn 0.7s cubic-bezier(0.2,1.4,0.4,1) forwards`,
            }}
          >
            <PropertyCard
              property={properties[current + 1]}
              locale={locale}
              lang={lang}
              onNavigate={() => router.push(`/${locale}/propiedades/${properties[current + 1].slug}`)}
            />
          </div>
        )}
      </div>

      {/* Navegación */}
      <div style={{
        position:"absolute", bottom:"3rem", left:"50%", transform:"translateX(-50%)",
        display:"flex", alignItems:"center", gap:"3rem", zIndex:40,
      }}>
        <button
          onClick={() => advance(-1)}
          disabled={current === 0 || animating}
          style={{
            background:"none", border:"1px solid rgba(255,255,255,0.1)",
            color: current === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)",
            fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.42rem",
            letterSpacing:"0.3em", textTransform:"uppercase",
            padding:"0.8rem 1.8rem", cursor: current === 0 ? "default" : "pointer",
            transition:"all 0.3s",
          }}
        >
          ← prev
        </button>

        {/* Indicador */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
          {properties.map((_, i) => (
            <div key={i} style={{
              width: i === current ? "2rem" : "0.4rem",
              height:"1px",
              background: i === current ? "#c9a96e" : "rgba(255,255,255,0.15)",
              transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}/>
          ))}
        </div>

        <button
          onClick={() => advance(1)}
          disabled={current === properties.length - 1 || animating}
          style={{
            background:"none", border:"1px solid rgba(255,255,255,0.1)",
            color: current === properties.length - 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.4)",
            fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.42rem",
            letterSpacing:"0.3em", textTransform:"uppercase",
            padding:"0.8rem 1.8rem", cursor: current === properties.length - 1 ? "default" : "pointer",
            transition:"all 0.3s",
          }}
        >
          next →
        </button>
      </div>

      {/* Contador */}
      <div style={{
        position:"absolute", bottom:"7rem", left:"50%", transform:"translateX(-50%)",
        fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", fontWeight:200,
        color:"rgba(255,255,255,0.15)", letterSpacing:"0.4em", textTransform:"uppercase", zIndex:30,
      }}>
        {String(current + 1).padStart(2,"0")} / {String(properties.length).padStart(2,"0")}
      </div>

    </div>
  );
}

// Componente de tarjeta de propiedad
function PropertyCard({ property, locale, lang, onNavigate }: {
  property: Property;
  locale: string;
  lang: "es" | "en" | "fr" | "ru";
  onNavigate: () => void;
}) {
  return (
    <div style={{ position:"absolute", inset:0, cursor:"pointer" }} onClick={onNavigate}>
      <video
        src={property.video_url} muted playsInline autoPlay loop
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
      />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 30%,rgba(0,0,0,0.95) 100%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, border:"1px solid rgba(201,169,110,0.2)", pointerEvents:"none" }}/>

      {/* Numero */}
      <div style={{ position:"absolute", top:"2.5rem", right:"2.5rem", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", fontWeight:200, color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em" }}>
        VOL.
      </div>

      {/* Info */}
      <div style={{ position:"absolute", bottom:"3rem", left:"3rem", right:"3rem" }}>
        <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", fontWeight:300, letterSpacing:"0.45em", color:"#c9a96e", textTransform:"uppercase", margin:"0 0 1rem" }}>
          {property.ubicacion}
        </p>
        <h2 style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:100, textTransform:"uppercase", color:"#fff", letterSpacing:"0.02em", lineHeight:1.1, margin:"0 0 1.5rem" }}>
          {property.titulo[lang]}
        </h2>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"1.5rem" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:"0.4rem" }}>
            <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"1rem", fontWeight:200, color:"#c9a96e" }}>€</span>
            <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(1.4rem,2.5vw,2rem)", fontWeight:100, color:"white", letterSpacing:"0.05em" }}>
              {(property.precio/1000000).toFixed(1)}<span style={{color:"#c9a96e",fontSize:"0.7em"}}>M</span>
            </span>
          </div>
          <div style={{ display:"flex", gap:"2rem" }}>
            <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:"rgba(255,255,255,0.35)", letterSpacing:"0.3em" }}>
              {property.habitaciones} BED
            </span>
            <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:"rgba(255,255,255,0.35)", letterSpacing:"0.3em" }}>
              {property.m2_construidos} M²
            </span>
          </div>
          <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:"rgba(255,255,255,0.25)", letterSpacing:"0.4em", textTransform:"uppercase" }}>
            Discover →
          </span>
        </div>
      </div>
    </div>
  );
}

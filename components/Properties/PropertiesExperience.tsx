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
  const rotationRef = useRef(0);       // grados actuales suavizados
  const targetRotRef = useRef(0);      // grados objetivo (múltiplos de step)
  const currentIdxRef = useRef(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const rafRef = useRef<number>(0);
  const scrollAccum = useRef(0);
  const SCROLL_THRESHOLD = 100;
  const n = properties.length;
  const STEP = 360 / n;               // grados entre paneles
  const RADIUS = 600;                 // radio de la rueda en px

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Suavizado con lerp — efecto de inercia tipo trinquete
      rotationRef.current = lerp(rotationRef.current, targetRotRef.current, 0.08);

      // Actualizar cada panel
      for (let i = 0; i < n; i++) {
        const el = document.getElementById(`prop-card-${i}`);
        if (!el) continue;

        // Ángulo de este panel en la rueda
        const angle = (i * STEP + rotationRef.current) % 360;
        const rad = (angle * Math.PI) / 180;

        // Posición en el círculo — eje Y (tiovivo)
        const x = Math.sin(rad) * RADIUS;
        const z = Math.cos(rad) * RADIUS - RADIUS; // restar RADIUS para que el frente quede en z=0

        // Opacidad y escala según la profundidad z
        const normalized = (z + RADIUS) / (RADIUS * 2); // 0=atrás, 1=frente
        const scale = 0.85 + normalized * 0.15;
        const opacity = normalized < 0.05 ? 0 : Math.min(1, (normalized - 0.05) / 0.25);
        const blur = 0;

        el.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`;
        el.style.opacity = String(Math.min(1, opacity));
        el.style.scale = String(scale);
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
        el.style.zIndex = String(Math.round(normalized * 100));
        el.style.pointerEvents = normalized > 0.9 ? "auto" : "none";
      }

      // Detectar panel activo
      const rawIdx = Math.round(-targetRotRef.current / STEP);
      const idx = ((rawIdx % n) + n) % n;
      if (idx !== currentIdxRef.current) {
        currentIdxRef.current = idx;
        setDisplayIdx(idx);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const advance = (dir: 1 | -1) => {
      targetRotRef.current -= dir * STEP;
    };

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
    const handleTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) advance(dx > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [n, STEP]);

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
      <Navbar />

      {/* Filtros activos — barra editorial superior */}
      <div style={{
        position:"absolute", top:0, left:0, right:0,
        height:"4.5rem",
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:"0", zIndex:100,
        borderBottom:"1px solid rgba(255,255,255,0.06)",
        background:"rgba(8,6,4,0.7)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
      }}>
        {/* Botón volver */}
        <button
          onClick={() => router.push(`/${locale}`)}
          style={{
            background:"none", border:"none",
            color:"rgba(255,255,255,0.35)",
            fontFamily:"'Helvetica Neue',sans-serif",
            fontSize:"0.55rem", letterSpacing:"0.35em",
            textTransform:"uppercase", cursor:"pointer",
            padding:"0 2rem",
            borderRight:"1px solid rgba(255,255,255,0.08)",
            height:"100%", display:"flex", alignItems:"center",
          }}
        >
          ← Search
        </button>

        {/* Filtros seleccionados */}
        {Object.entries(filters).filter(([,v])=>v).map(([k,v], fi) => (
          <div key={k} style={{
            display:"flex", alignItems:"center",
            height:"100%",
            padding:"0 2rem",
            borderRight:"1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.45rem", fontWeight:200,
              color:"rgba(201,169,110,0.5)",
              letterSpacing:"0.4em", textTransform:"uppercase",
              marginRight:"0.8rem",
            }}>{k}</span>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.6rem", fontWeight:300,
              color:"rgba(201,169,110,0.9)",
              letterSpacing:"0.2em", textTransform:"uppercase",
            }}>{v}</span>
          </div>
        ))}

        {/* Contador derecha */}
        <div style={{
          marginLeft:"auto",
          padding:"0 2rem",
          fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"0.5rem", fontWeight:200,
          color:"rgba(255,255,255,0.2)",
          letterSpacing:"0.3em",
        }}>
          {String(displayIdx+1).padStart(2,"0")} / {String(n).padStart(2,"0")}
        </div>
      </div>

      {/* RUEDA — escena 3D */}
      <div style={{
        position:"absolute", inset:0,
        perspective:"800px",
        perspectiveOrigin:"50% 50%",
      }}>
        <div style={{
          position:"absolute",
          top:"50%", left:"50%",
          transform:"translate(-50%, -50%)",
          transformStyle:"preserve-3d",
          width:0, height:0,
        }}>
          {properties.map((property, i) => (
            <div
              key={property.id}
              id={`prop-card-${i}`}
              style={{
                position:"absolute",
                width:"65vw", height:"72vh",
                marginLeft:"-32.5vw", marginTop:"-36vh",
                willChange:"transform,opacity,filter",
                cursor:"pointer",
                transformStyle:"preserve-3d",
              }}
              onClick={() => {
                if (displayIdx === i) {
                  router.push(`/${locale}/propiedades/${property.slug}`);
                }
              }}
            >
              <video
                src={property.video_url} muted playsInline autoPlay loop
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
              />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 30%,rgba(0,0,0,0.95) 100%)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", inset:0, border:"1px solid rgba(201,169,110,0.15)", pointerEvents:"none" }}/>

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
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", letterSpacing:"0.25em" }}>
                      {property.habitaciones} BED
                    </span>
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", letterSpacing:"0.25em" }}>
                      {property.m2_construidos} M²
                    </span>
                  </div>
                  <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", letterSpacing:"0.35em", textTransform:"uppercase" }}>
                    Discover →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicador */}
      <div style={{
        position:"absolute", bottom:"3rem", left:"50%", transform:"translateX(-50%)",
        display:"flex", alignItems:"center", gap:"0.8rem", zIndex:100,
      }}>
        {properties.map((_, i) => (
          <div key={i} style={{
            width: i === displayIdx ? "2.5rem" : "0.4rem",
            height:"1px",
            background: i === displayIdx ? "#c9a96e" : "rgba(255,255,255,0.12)",
            transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}/>
        ))}
      </div>



    </div>
  );
}

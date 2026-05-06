"use client";
import { useEffect, useRef } from "react";
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
  const propertyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const SECTION_LENGTH = 1.0;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      progressRef.current = lerp(progressRef.current, targetRef.current, 0.06);

      properties.forEach((_, i) => {
        const el = propertyRefs.current[i];
        if (!el) return;
        const dist = progressRef.current - i * SECTION_LENGTH;
        let opacity = 0, scale = 0.4, zPos = -2000, blur = 30;
        if (dist >= -SECTION_LENGTH && dist < -SECTION_LENGTH * 0.3) {
          const tt = (dist + SECTION_LENGTH) / (SECTION_LENGTH * 0.7);
          opacity = tt * tt; scale = 0.4 + tt * 0.6; zPos = -2000 + tt * 2000; blur = 30 - tt * 30;
        } else if (dist >= -SECTION_LENGTH * 0.3 && dist < SECTION_LENGTH * 0.3) {
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else if (dist >= SECTION_LENGTH * 0.3 && dist < SECTION_LENGTH) {
          const tt = (dist - SECTION_LENGTH * 0.3) / (SECTION_LENGTH * 0.7);
          opacity = 1 - tt; scale = 1 + tt * 0.5; zPos = tt * 800; blur = tt * 20;
        } else if (dist >= SECTION_LENGTH) {
          opacity = 0; scale = 1.5; zPos = 800; blur = 20;
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0,0,${zPos}px) scale(${scale})`;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
        el.style.pointerEvents = opacity > 0.7 ? "auto" : "none";
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current = Math.max(0, Math.min(
        (properties.length - 1) * SECTION_LENGTH,
        targetRef.current + e.deltaY * 0.0008
      ));
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * 1.5;
      touchStartY = e.touches[0].clientY;
      targetRef.current = Math.max(0, Math.min(
        (properties.length - 1) * SECTION_LENGTH,
        targetRef.current + delta * 0.0008
      ));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [properties.length]);

  // Estado vacío
  if (properties.length === 0) {
    return (
      <div style={{ position:"fixed", inset:0, background:"#080604", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <Navbar />
        <div style={{ textAlign:"center", padding:"2rem" }}>
          <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", letterSpacing:"0.5em", color:"rgba(201,169,110,0.7)", textTransform:"uppercase", marginBottom:"2rem" }}>
            No properties found
          </p>
          <h2 style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(2rem,4vw,3.5rem)", fontWeight:300, color:"white", letterSpacing:"-0.02em", marginBottom:"3rem" }}>
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

      {/* Filtros activos — breadcrumb */}
      <div style={{
        position:"absolute", top:"5rem", left:"50%", transform:"translateX(-50%)",
        display:"flex", alignItems:"center", gap:"1rem", zIndex:30,
        flexWrap:"wrap", justifyContent:"center",
      }}>
        {Object.entries(filters).filter(([,v])=>v).map(([k,v]) => (
          <span key={k} style={{
            fontFamily:"'Helvetica Neue',sans-serif",
            fontSize:"0.4rem", fontWeight:300,
            color:"rgba(201,169,110,0.7)",
            letterSpacing:"0.4em", textTransform:"uppercase",
            padding:"0.4rem 1rem",
            border:"1px solid rgba(201,169,110,0.2)",
          }}>
            {v}
          </span>
        ))}
        <button
          onClick={() => router.push(`/${locale}`)}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", letterSpacing:"0.3em", textTransform:"uppercase", cursor:"pointer", padding:"0.4rem 0.8rem" }}
        >
          ← new search
        </button>
      </div>

      {/* Contador */}
      <div style={{
        position:"absolute", bottom:"2rem", left:"50%", transform:"translateX(-50%)",
        fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", fontWeight:200,
        color:"rgba(255,255,255,0.2)", letterSpacing:"0.4em", textTransform:"uppercase",
        zIndex:30,
      }}>
        {properties.length} {properties.length === 1 ? "property" : "properties"} found
      </div>

      {/* Z-Axis properties */}
      <div ref={containerRef} style={{
        position:"absolute", inset:0,
        perspective:"1200px", perspectiveOrigin:"center center",
      }}>
        <div style={{ position:"absolute", inset:0, transformStyle:"preserve-3d" }}>
          {properties.map((property, i) => (
            <div
              key={property.id}
              ref={el => { propertyRefs.current[i] = el; }}
              onClick={() => router.push(`/${locale}/propiedades/${property.slug}`)}
              style={{
                position:"absolute", top:"50%", left:"50%",
                width:"70vw", height:"75vh",
                marginLeft:"-35vw", marginTop:"-37.5vh",
                cursor:"pointer",
                willChange:"transform,opacity,filter",
              }}
            >
              <video
                src={property.video_url} muted playsInline autoPlay loop
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
              />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 30%,rgba(0,0,0,0.95) 100%)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", inset:0, border:"1px solid rgba(201,169,110,0.2)", pointerEvents:"none" }}/>

              {/* Numero */}
              <div style={{ position:"absolute", top:"2rem", left:"2.5rem", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", fontWeight:200, color:"rgba(201,169,110,0.6)", letterSpacing:"0.4em" }}>
                {String(i+1).padStart(2,"0")} / {String(properties.length).padStart(2,"0")}
              </div>

              {/* Info */}
              <div style={{ position:"absolute", bottom:"3rem", left:"3rem", right:"3rem" }}>
                <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", fontWeight:300, letterSpacing:"0.4em", color:"#c9a96e", textTransform:"uppercase", margin:"0 0 1rem" }}>
                  {property.ubicacion}
                </p>
                <h2 style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:200, textTransform:"uppercase", color:"#fff", letterSpacing:"0.02em", lineHeight:1.1, margin:"0 0 1.5rem" }}>
                  {property.titulo[lang]}
                </h2>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"1.5rem" }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:"0.4rem" }}>
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"1.1rem", fontWeight:200, color:"#c9a96e" }}>€</span>
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(1.4rem,2.5vw,2rem)", fontWeight:100, color:"white", letterSpacing:"0.05em" }}>
                      {(property.precio/1000000).toFixed(1)}<span style={{color:"#c9a96e",fontSize:"0.7em"}}>M</span>
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:"2rem" }}>
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.3em" }}>
                      {property.habitaciones} BED
                    </span>
                    <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.3em" }}>
                      {property.m2_construidos} M²
                    </span>
                  </div>
                  <span style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.45rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.4em", textTransform:"uppercase" }}>
                    Discover →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

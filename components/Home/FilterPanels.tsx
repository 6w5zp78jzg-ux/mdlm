"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id:"zona", index:"01", label:"ZONA",
    question:"Where.",
    accent:"#c9a96e", accentRgb:"201,169,110",
    options:[
      { v:"marbella",   l:"Marbella",   sub:"36°30'N · 4°53'W" },
      { v:"estepona",   l:"Estepona",   sub:"36°25'N · 5°08'W" },
      { v:"mijas",      l:"Mijas",      sub:"36°35'N · 4°38'W" },
      { v:"benahavis",  l:"Benahavís",  sub:"36°31'N · 5°02'W" },
      { v:"sotogrande", l:"Sotogrande", sub:"36°17'N · 5°23'W" },
    ],
  },
  {
    id:"tipo", index:"02", label:"TIPO",
    question:"What.",
    accent:"#d4c4a8", accentRgb:"212,196,168",
    options:[
      { v:"villa",     l:"Villa",     sub:"Private Estate" },
      { v:"apartment", l:"Apartment", sub:"Sky Residence" },
      { v:"townhouse", l:"Townhouse", sub:"Urban Address" },
      { v:"plot",      l:"Plot",      sub:"Raw Land" },
    ],
  },
  {
    id:"precio", index:"03", label:"INVERSIÓN",
    question:"How much.",
    accent:"#b8a898", accentRgb:"184,168,152",
    options:[
      { v:"500k-1m", l:"500K – 1M",  sub:"€" },
      { v:"1m-2m",   l:"1M – 2M",    sub:"€€" },
      { v:"2m-5m",   l:"2M – 5M",    sub:"€€€" },
      { v:"5m+",     l:"5M+",        sub:"€€€€" },
    ],
  },
];

interface Props {
  locale: string;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export default function FilterPanels({ locale, panelRefs }: Props) {
  const [selected, setSelected] = useState<Record<string,string>>({});
  const router = useRouter();

  const handleSelect = (filterId: string, value: string, idx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (idx < FILTERS.length - 1) {
      setTimeout(() => (window as any).__advancePanel?.(idx + 1), 400);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        .aopt {
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .aopt:hover { background: rgba(255,255,255,0.03) !important; }
        .aopt:hover .aopt-label { opacity: 1 !important; letter-spacing: 0.12em !important; }
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position:"absolute", top:"50%", left:"50%",
            width:"72vw", height:"76vh",
            marginLeft:"-36vw", marginTop:"-38vh",
            transformStyle:"preserve-3d",
            willChange:"transform,opacity,filter",
            background:"rgba(10,9,8,0.82)",
            backdropFilter:"blur(60px) saturate(120%)",
            WebkitBackdropFilter:"blur(60px) saturate(120%)",
            border:`1px solid rgba(${filter.accentRgb},0.12)`,
            boxShadow:`
              0 40px 120px rgba(0,0,0,0.8),
              0 0 0 1px rgba(255,255,255,0.03),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
          }}
        >
          {/* Linea superior de acento */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"1px",
            background:`linear-gradient(90deg, transparent, rgba(${filter.accentRgb},0.6), transparent)`,
          }}/>

          {/* Header del panel */}
          <div style={{
            position:"absolute", top:"3.5rem", left:"4rem", right:"4rem",
            display:"flex", justifyContent:"space-between", alignItems:"baseline",
          }}>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.5rem", fontWeight:300,
              color:`rgba(${filter.accentRgb},0.8)`,
              letterSpacing:"0.6em", textTransform:"uppercase",
            }}>
              {filter.label}
            </span>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.5rem", fontWeight:200,
              color:"rgba(255,255,255,0.15)",
              letterSpacing:"0.3em",
            }}>
              {filter.index} / 03
            </span>
          </div>

          {/* Pregunta — tipografia arquitectonica pura */}
          <div style={{
            position:"absolute",
            top:"30%", transform:"translateY(-50%)",
            left:"4rem", right:"4rem",
          }}>
            <h2 style={{
              fontFamily:"'Helvetica Neue','Arial',sans-serif",
              fontSize:"clamp(4rem,9vw,8rem)",
              fontWeight:100,
              color:"rgba(255,255,255,0.9)",
              letterSpacing:"-0.03em",
              lineHeight:1,
              margin:0,
            }}>
              {filter.question}
            </h2>
            <div style={{
              height:"1px",
              width:"3rem",
              background:`rgba(${filter.accentRgb},0.6)`,
              marginTop:"2rem",
            }}/>
          </div>

          {/* Opciones — lista arquitectonica */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
          }}>
            {filter.options.map((opt, oi) => {
              const isSel = selected[filter.id] === opt.v;
              return (
                <div
                  key={opt.v}
                  className="aopt"
                  onClick={() => handleSelect(filter.id, opt.v, i)}
                  style={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between",
                    padding:"1.4rem 4rem",
                    background: isSel ? `rgba(${filter.accentRgb},0.07)` : "transparent",
                    borderLeft: isSel ? `2px solid ${filter.accent}` : "2px solid transparent",
                    transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div style={{display:"flex", alignItems:"baseline", gap:"2rem"}}>
                    <span style={{
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"0.4rem", fontWeight:300,
                      color:`rgba(${filter.accentRgb},${isSel?0.8:0.3})`,
                      letterSpacing:"0.3em",
                      minWidth:"1.5rem",
                      transition:"color 0.4s",
                    }}>
                      {String(oi+1).padStart(2,"0")}
                    </span>
                    <span className="aopt-label" style={{
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"clamp(1.2rem,2.2vw,2rem)",
                      fontWeight:200,
                      color: isSel ? "#fff" : "rgba(255,255,255,0.45)",
                      letterSpacing: isSel ? "0.08em" : "0.04em",
                      textTransform:"uppercase",
                      transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}>
                      {opt.l}
                    </span>
                  </div>
                  <span style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.45rem", fontWeight:200,
                    color: isSel ? `rgba(${filter.accentRgb},0.9)` : "rgba(255,255,255,0.2)",
                    letterSpacing:"0.25em",
                    transition:"color 0.4s",
                  }}>
                    {opt.sub}
                  </span>
                </div>
              );
            })}

            {/* CTA */}
            {i===FILTERS.length-1 && allSelected && (
              <div style={{padding:"2rem 4rem", borderTop:`1px solid rgba(${filter.accentRgb},0.1)`}}>
                <button
                  onClick={() => router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                  style={{
                    background:"none",
                    border:`1px solid rgba(${filter.accentRgb},0.5)`,
                    color:filter.accent,
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.5rem",
                    letterSpacing:"0.6em",
                    textTransform:"uppercase",
                    padding:"1.2rem 3rem",
                    cursor:"pointer",
                    transition:"all 0.4s ease",
                    width:"100%",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${filter.accentRgb},0.1)`;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="none";}}
                >
                  Discover Properties →
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

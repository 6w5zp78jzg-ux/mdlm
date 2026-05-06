"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id:"zona", index:"01", label:"ZONA",
    question:"Where do you want to live?",
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
    question:"What defines your vision?",
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
    question:"Define the scale of your ambition.",
    accent:"#b8a898", accentRgb:"184,168,152",
    options:[
      { v:"500k-1m", l:"500K – 1M",  sub:"Entry" },
      { v:"1m-2m",   l:"1M – 2M",    sub:"Prime" },
      { v:"2m-5m",   l:"2M – 5M",    sub:"Ultra" },
      { v:"5m+",     l:"5M +",       sub:"No Limits" },
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
        .fopt {
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .fopt:hover .fopt-name {
          color: rgba(255,255,255,0.9) !important;
          letter-spacing: 0.08em !important;
        }
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position:"absolute",
            top:"50%", left:"50%",
            width:"78vw", height:"80vh",
            marginLeft:"-39vw", marginTop:"-40vh",
            willChange:"transform,opacity,filter",
            // Sin overflow, sin transformStyle aquí — el RAF maneja todo
            background:"rgba(6,5,4,0.88)",
            backdropFilter:"blur(60px)",
            WebkitBackdropFilter:"blur(60px)",
            border:`1px solid rgba(${filter.accentRgb},0.15)`,
            boxShadow:`
              0 0 0 1px rgba(255,255,255,0.03),
              0 60px 180px rgba(0,0,0,0.95),
              inset 0 1px 0 rgba(255,255,255,0.06)
            `,
          }}
        >
          {/* Barra acento top */}
          <div style={{
            position:"absolute", top:0, left:"15%", right:"15%", height:"1px",
            background:`linear-gradient(90deg,transparent,rgba(${filter.accentRgb},0.7),transparent)`,
          }}/>

          {/* Label + counter */}
          <div style={{
            position:"absolute", top:"2.8rem", left:"4rem", right:"4rem",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.42rem", fontWeight:300,
              color:`rgba(${filter.accentRgb},0.8)`,
              letterSpacing:"0.65em", textTransform:"uppercase",
            }}>{filter.label}</span>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.42rem", fontWeight:200,
              color:"rgba(255,255,255,0.1)",
              letterSpacing:"0.3em",
            }}>{filter.index} / 03</span>
          </div>

          {/* Pregunta — máximo protagonismo tipográfico */}
          <div style={{
            position:"absolute",
            top:"22%", left:"4rem", right:"4rem",
          }}>
            <h2 style={{
              fontFamily:"'Helvetica Neue','Arial',sans-serif",
              fontSize:"clamp(2.4rem,4.5vw,4.8rem)",
              fontWeight:100,
              color:"rgba(255,255,255,0.92)",
              letterSpacing:"-0.025em",
              lineHeight:1.1,
              margin:0,
            }}>{filter.question}</h2>
            <div style={{
              height:"1px", width:"3rem",
              background:`rgba(${filter.accentRgb},0.55)`,
              marginTop:"2rem",
            }}/>
          </div>

          {/* Grid de opciones horizontal */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            display:"grid",
            gridTemplateColumns:`repeat(${filter.options.length},1fr)`,
            borderTop:`1px solid rgba(255,255,255,0.05)`,
            height:"38%",
          }}>
            {filter.options.map((opt, oi) => {
              const isSel = selected[filter.id] === opt.v;
              return (
                <div key={opt.v} className="fopt"
                  onClick={() => handleSelect(filter.id, opt.v, i)}
                  style={{
                    display:"flex", flexDirection:"column",
                    justifyContent:"space-between",
                    padding:"2rem 2.2rem 2.5rem",
                    borderRight:`1px solid rgba(255,255,255,0.04)`,
                    background: isSel
                      ? `linear-gradient(180deg, rgba(${filter.accentRgb},0.08) 0%, transparent 100%)`
                      : "transparent",
                    borderTop: isSel
                      ? `1px solid rgba(${filter.accentRgb},0.4)`
                      : "1px solid transparent",
                    marginTop: isSel ? "-1px" : 0,
                    position:"relative",
                  }}
                >
                  <span style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.38rem", fontWeight:200,
                    color:`rgba(${filter.accentRgb},${isSel?0.7:0.2})`,
                    letterSpacing:"0.35em",
                    transition:"color 0.4s",
                  }}>{String(oi+1).padStart(2,"0")}</span>

                  <div>
                    <div className="fopt-name" style={{
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"clamp(1.1rem,2vw,1.8rem)",
                      fontWeight:200,
                      textTransform:"uppercase",
                      color: isSel ? "#fff" : "rgba(255,255,255,0.38)",
                      letterSpacing: isSel ? "0.06em" : "0.03em",
                      marginBottom:"0.8rem",
                      transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}>{opt.l}</div>

                    <div style={{
                      height:"1px",
                      width: isSel ? "100%" : "18%",
                      background: isSel
                        ? `rgba(${filter.accentRgb},0.7)`
                        : "rgba(255,255,255,0.07)",
                      marginBottom:"0.8rem",
                      transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}/>

                    <span style={{
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"0.38rem", fontWeight:200,
                      color: isSel
                        ? `rgba(${filter.accentRgb},0.8)`
                        : "rgba(255,255,255,0.12)",
                      letterSpacing:"0.25em",
                      textTransform:"uppercase",
                      transition:"color 0.4s",
                    }}>{opt.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {i===FILTERS.length-1&&allSelected&&(
            <div style={{
              position:"absolute",
              bottom:"calc(38% + 2rem)",
              right:"4rem",
            }}>
              <button
                onClick={()=>router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                style={{
                  background:"none",
                  border:`1px solid rgba(${filter.accentRgb},0.45)`,
                  color:filter.accent,
                  fontFamily:"'Helvetica Neue',sans-serif",
                  fontSize:"0.42rem",
                  letterSpacing:"0.6em",
                  textTransform:"uppercase",
                  padding:"1.1rem 2.8rem",
                  cursor:"pointer",
                  transition:"all 0.4s ease",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${filter.accentRgb},0.1)`;}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";}}
              >
                Discover Properties →
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

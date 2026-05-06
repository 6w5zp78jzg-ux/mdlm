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
  const [activePanel, setActivePanel] = useState(0);
  const [selected, setSelected] = useState<Record<string,string>>({});
  const router = useRouter();

  const handleSelect = (filterId: string, value: string, idx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (idx < FILTERS.length - 1) {
      const next = idx + 1;
      setTimeout(() => {
        setActivePanel(next);
        (window as any).__advancePanel?.(next);
      }, 400);
    }
  };

  const handleBack = (idx: number) => {
    if (idx > 0) {
      const prev = idx - 1;
      setActivePanel(prev);
      // Limpiar selección del panel actual para poder elegir de nuevo
      setSelected(prev2 => {
        const copy = { ...prev2 };
        delete copy[FILTERS[idx].id];
        return copy;
      });
      (window as any).__advancePanel?.(prev);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        .fopt {
          cursor: pointer;
          transition: all 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .fopt:hover {
          background: rgba(255,255,255,0.04) !important;
        }
        .fopt:hover .fname {
          color: rgba(255,255,255,0.9) !important;
        }
        .back-btn {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .back-btn:hover {
          color: rgba(255,255,255,0.7) !important;
        }
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position:"absolute",
            top:"50%", left:"50%",
            width:"78vw", height:"78vh",
            marginLeft:"-39vw", marginTop:"-39vh",
            willChange:"transform,opacity,filter",
            // GLASSMORPHISM real — transparente con blur
            background:"rgba(8,6,4,0.45)",
            backdropFilter:"blur(50px) saturate(150%)",
            WebkitBackdropFilter:"blur(50px) saturate(150%)",
            border:`1px solid rgba(${filter.accentRgb},0.18)`,
            boxShadow:`
              0 0 0 1px rgba(255,255,255,0.04),
              0 40px 120px rgba(0,0,0,0.7),
              inset 0 1px 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Barra acento superior */}
          <div style={{
            position:"absolute", top:0, left:"10%", right:"10%", height:"1px",
            background:`linear-gradient(90deg,transparent,rgba(${filter.accentRgb},0.8),transparent)`,
          }}/>

          {/* Header — label + counter + back */}
          <div style={{
            position:"absolute", top:"2.5rem", left:"3.5rem", right:"3.5rem",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <div style={{display:"flex", alignItems:"center", gap:"1.5rem"}}>
              {/* Botón volver */}
              {i > 0 && (
                <button
                  className="back-btn"
                  onClick={() => handleBack(i)}
                  style={{
                    background:"none", border:"none", padding:0,
                    color:"rgba(255,255,255,0.2)",
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.42rem", letterSpacing:"0.3em",
                    textTransform:"uppercase",
                    display:"flex", alignItems:"center", gap:"0.5rem",
                  }}
                >
                  ← back
                </button>
              )}
              <span style={{
                fontFamily:"'Helvetica Neue',sans-serif",
                fontSize:"0.42rem", fontWeight:300,
                color:`rgba(${filter.accentRgb},0.8)`,
                letterSpacing:"0.65em", textTransform:"uppercase",
              }}>{filter.label}</span>
            </div>
            <span style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.42rem", fontWeight:200,
              color:"rgba(255,255,255,0.1)",
              letterSpacing:"0.3em",
            }}>{filter.index} / 03</span>
          </div>

          {/* Pregunta */}
          <div style={{
            position:"absolute", top:"20%", left:"3.5rem", right:"3.5rem",
          }}>
            <h2 style={{
              fontFamily:"'Helvetica Neue','Arial',sans-serif",
              fontSize:"clamp(2.2rem,4.2vw,4.5rem)",
              fontWeight:100,
              color:"rgba(255,255,255,0.92)",
              letterSpacing:"-0.025em",
              lineHeight:1.1,
              margin:0,
            }}>{filter.question}</h2>
            <div style={{
              height:"1px", width:"2.5rem",
              background:`rgba(${filter.accentRgb},0.55)`,
              marginTop:"1.8rem",
            }}/>
          </div>

          {/* Opciones horizontal */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            display:"grid",
            gridTemplateColumns:`repeat(${filter.options.length},1fr)`,
            height:"42%",
            borderTop:`1px solid rgba(255,255,255,0.06)`,
          }}>
            {filter.options.map((opt, oi) => {
              const isSel = selected[filter.id] === opt.v;
              return (
                <div key={opt.v} className="fopt"
                  onClick={() => handleSelect(filter.id, opt.v, i)}
                  style={{
                    display:"flex", flexDirection:"column",
                    justifyContent:"space-between",
                    padding:"2rem 2rem 2.5rem",
                    borderRight:`1px solid rgba(255,255,255,0.04)`,
                    background: isSel
                      ? `rgba(${filter.accentRgb},0.09)`
                      : "transparent",
                    borderTop: isSel
                      ? `1px solid rgba(${filter.accentRgb},0.5)`
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
                    <div className="fname" style={{
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"clamp(1rem,1.9vw,1.75rem)",
                      fontWeight:200,
                      textTransform:"uppercase",
                      color: isSel ? "#fff" : "rgba(255,255,255,0.35)",
                      letterSpacing: isSel ? "0.06em" : "0.03em",
                      marginBottom:"0.7rem",
                      transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}>{opt.l}</div>
                    <div style={{
                      height:"1px",
                      width: isSel ? "85%" : "15%",
                      background: isSel
                        ? `rgba(${filter.accentRgb},0.7)`
                        : "rgba(255,255,255,0.07)",
                      marginBottom:"0.7rem",
                      transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}/>
                    <span style={{
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"0.38rem", fontWeight:200,
                      color: isSel
                        ? `rgba(${filter.accentRgb},0.8)`
                        : "rgba(255,255,255,0.1)",
                      letterSpacing:"0.25em",
                      textTransform:"uppercase",
                      transition:"color 0.4s",
                    }}>{opt.sub}</span>
                  </div>

                  {isSel && (
                    <div style={{
                      position:"absolute", bottom:0, left:0, right:0, height:"1px",
                      background:`linear-gradient(90deg,rgba(${filter.accentRgb},0.6),transparent)`,
                    }}/>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {i===FILTERS.length-1&&allSelected&&(
            <div style={{
              position:"absolute",
              bottom:"calc(42% + 2rem)", right:"3.5rem",
            }}>
              <button
                onClick={()=>router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                style={{
                  background:"none",
                  border:`1px solid rgba(${filter.accentRgb},0.45)`,
                  color:filter.accent,
                  fontFamily:"'Helvetica Neue',sans-serif",
                  fontSize:"0.42rem", letterSpacing:"0.6em",
                  textTransform:"uppercase", padding:"1.1rem 2.8rem",
                  cursor:"pointer",
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${filter.accentRgb},0.12)`;}}
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

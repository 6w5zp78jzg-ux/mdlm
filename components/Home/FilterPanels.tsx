"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id:"zona", index:"01", label:"ZONA",
    question:"Where do you\nwant to live?",
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
    question:"What defines\nyour vision?",
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
    question:"Define the scale\nof your ambition.",
    accent:"#b8a898", accentRgb:"184,168,152",
    options:[
      { v:"500k-1m", l:"500K–1M",  sub:"€" },
      { v:"1m-2m",   l:"1M–2M",    sub:"€€" },
      { v:"2m-5m",   l:"2M–5M",    sub:"€€€" },
      { v:"5m+",     l:"5M+",      sub:"€€€€" },
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
          position: relative;
        }
        .aopt::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(255,255,255,0.04);
          transition: all 0.4s;
        }
        .aopt:hover .opt-label { opacity: 1 !important; transform: translateY(-3px); }
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position:"absolute", top:"50%", left:"50%",
            width:"75vw", height:"72vh",
            marginLeft:"-37.5vw", marginTop:"-36vh",
            transformStyle:"preserve-3d",
            willChange:"transform,opacity,filter",
            background:"rgba(8,7,6,0.75)",
            backdropFilter:"blur(80px) saturate(110%)",
            WebkitBackdropFilter:"blur(80px) saturate(110%)",
            border:`1px solid rgba(${filter.accentRgb},0.1)`,
            boxShadow:`
              0 50px 150px rgba(0,0,0,0.9),
              0 0 0 1px rgba(255,255,255,0.03),
              inset 0 1px 0 rgba(255,255,255,0.04),
              0 0 200px rgba(${filter.accentRgb},0.06)
            `,
          }}
        >
          {/* Linea acento superior */}
          <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:"1px",background:`linear-gradient(90deg,transparent,rgba(${filter.accentRgb},0.5),transparent)`}}/>

          {/* Header */}
          <div style={{position:"absolute",top:"2.5rem",left:"3.5rem",right:"3.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.45rem",fontWeight:300,color:`rgba(${filter.accentRgb},0.7)`,letterSpacing:"0.6em",textTransform:"uppercase"}}>
              {filter.label}
            </span>
            <span style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.45rem",fontWeight:200,color:"rgba(255,255,255,0.12)",letterSpacing:"0.3em"}}>
              {filter.index} — 03
            </span>
          </div>

          {/* Pregunta */}
          <div style={{position:"absolute",top:"18%",left:"3.5rem",right:"3.5rem"}}>
            <h2 style={{
              fontFamily:"'Helvetica Neue','Arial',sans-serif",
              fontSize:"clamp(2.2rem,5vw,4.5rem)",
              fontWeight:100,
              color:"rgba(255,255,255,0.88)",
              letterSpacing:"-0.02em",
              lineHeight:1.15,
              margin:0,
              whiteSpace:"pre-line",
            }}>
              {filter.question}
            </h2>
            <div style={{height:"1px",width:"2.5rem",background:`rgba(${filter.accentRgb},0.5)`,marginTop:"1.5rem"}}/>
          </div>

          {/* Opciones HORIZONTAL */}
          <div style={{
            position:"absolute", bottom:0, left:0, right:0,
            display:"grid",
            gridTemplateColumns:`repeat(${filter.options.length},1fr)`,
            borderTop:`1px solid rgba(255,255,255,0.05)`,
          }}>
            {filter.options.map((opt, oi) => {
              const isSel = selected[filter.id] === opt.v;
              return (
                <div
                  key={opt.v}
                  className="aopt"
                  onClick={() => handleSelect(filter.id, opt.v, i)}
                  style={{
                    padding:"2.5rem 2rem 3rem",
                    borderRight:`1px solid rgba(255,255,255,0.04)`,
                    background: isSel ? `rgba(${filter.accentRgb},0.07)` : "transparent",
                    borderTop: isSel ? `1px solid rgba(${filter.accentRgb},0.3)` : "1px solid transparent",
                    marginTop: isSel ? "-1px" : "0",
                    transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <div style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.4rem", fontWeight:200,
                    color:`rgba(${filter.accentRgb},${isSel?0.7:0.25})`,
                    letterSpacing:"0.4em", marginBottom:"1.2rem",
                    transition:"color 0.4s",
                  }}>
                    {String(oi+1).padStart(2,"0")}
                  </div>

                  <div className="opt-label" style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"clamp(1rem,1.8vw,1.7rem)",
                    fontWeight:200,
                    textTransform:"uppercase",
                    color: isSel ? "#fff" : "rgba(255,255,255,0.4)",
                    letterSpacing:"0.04em",
                    marginBottom:"1.2rem",
                    transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    display:"block",
                  }}>
                    {opt.l}
                  </div>

                  <div style={{
                    height:"1px",
                    width: isSel ? "80%" : "20%",
                    background: isSel ? `rgba(${filter.accentRgb},0.6)` : "rgba(255,255,255,0.08)",
                    marginBottom:"1rem",
                    transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}/>

                  <div style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.4rem", fontWeight:200,
                    color: isSel ? `rgba(${filter.accentRgb},0.7)` : "rgba(255,255,255,0.15)",
                    letterSpacing:"0.25em",
                    textTransform:"uppercase",
                    transition:"color 0.4s",
                  }}>
                    {opt.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {i===FILTERS.length-1&&allSelected&&(
            <button
              onClick={()=>router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
              style={{
                position:"absolute", bottom:"calc(33% + 1.5rem)", right:"3.5rem",
                background:"none",
                border:`1px solid rgba(${filter.accentRgb},0.4)`,
                color:filter.accent,
                fontFamily:"'Helvetica Neue',sans-serif",
                fontSize:"0.45rem", letterSpacing:"0.6em",
                textTransform:"uppercase", padding:"1rem 2.5rem",
                cursor:"pointer",
              }}>
              Discover Properties →
            </button>
          )}
        </div>
      ))}
    </>
  );
}

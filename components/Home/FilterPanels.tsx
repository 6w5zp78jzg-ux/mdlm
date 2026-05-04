"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id:"zona", index:"01", label:"ZONA", accent:"#c9a96e", accentRgb:"201,169,110",
    question:"Where do you want to live?",
    options:[
      { v:"marbella",   l:"Marbella",   sub:"36°30'N 4°53'W" },
      { v:"estepona",   l:"Estepona",   sub:"36°25'N 5°08'W" },
      { v:"mijas",      l:"Mijas",      sub:"36°35'N 4°38'W" },
      { v:"benahavis",  l:"Benahavís",  sub:"36°31'N 5°02'W" },
      { v:"sotogrande", l:"Sotogrande", sub:"36°17'N 5°23'W" },
    ],
  },
  {
    id:"tipo", index:"02", label:"TIPO", accent:"#a8c4d4", accentRgb:"168,196,212",
    question:"What defines your vision?",
    options:[
      { v:"villa",     l:"Villa",     sub:"THE ESTATE" },
      { v:"apartment", l:"Apartment", sub:"THE SKY" },
      { v:"townhouse", l:"Townhouse", sub:"THE ADDRESS" },
      { v:"plot",      l:"Plot",      sub:"THE CANVAS" },
    ],
  },
  {
    id:"precio", index:"03", label:"INVERSIÓN", accent:"#e8a87c", accentRgb:"232,168,124",
    question:"Define the scale of your ambition.",
    options:[
      { v:"500k-1m", l:"€500K – 1M",  sub:"I" },
      { v:"1m-2m",   l:"€1M – 2M",    sub:"II" },
      { v:"2m-5m",   l:"€2M – 5M",    sub:"III" },
      { v:"5m+",     l:"€5M & above", sub:"∞" },
    ],
  },
];

interface Props {
  locale: string;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export default function FilterPanels({ locale, panelRefs }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSelect = (filterId: string, value: string, idx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (idx < FILTERS.length - 1) {
      setTimeout(() => (window as any).__advancePanel?.(idx + 1), 350);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        .gopt{transition:all 0.4s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .gopt:hover{background:rgba(255,255,255,0.06) !important;backdrop-filter:blur(20px);}
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position:"absolute", top:"50%", left:"50%",
            width:"80vw", height:"75vh",
            marginLeft:"-40vw", marginTop:"-37.5vh",
            transformStyle:"preserve-3d",
            willChange:"transform,opacity,filter",
            // GLASSMORPHISM
            background:`linear-gradient(135deg, rgba(${filter.accentRgb},0.08) 0%, rgba(20,20,20,0.4) 100%)`,
            backdropFilter:"blur(40px) saturate(140%)",
            WebkitBackdropFilter:"blur(40px) saturate(140%)",
            border:`1px solid rgba(${filter.accentRgb},0.2)`,
            boxShadow:`0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 100px rgba(${filter.accentRgb},0.1)`,
          }}
        >
          {/* Numero fantasma */}
          <div style={{position:"absolute",top:"-3%",left:"-2%",fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(8rem,18vw,14rem)",fontWeight:100,color:"transparent",WebkitTextStroke:`1px rgba(${filter.accentRgb},0.18)`,letterSpacing:"-0.05em",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>
            {filter.index}
          </div>

          {/* VOL */}
          <div style={{position:"absolute",top:"2.5rem",right:"2.5rem",color:`rgba(${filter.accentRgb},0.7)`,fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",fontWeight:300,letterSpacing:"0.5em"}}>
            VOL. {filter.index}
          </div>

          {/* Categoria */}
          <div style={{position:"absolute",top:"3rem",left:"3rem"}}>
            <p style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",fontWeight:300,letterSpacing:"0.5em",color:filter.accent,textTransform:"uppercase",margin:0}}>{filter.label}</p>
            <div style={{height:"1px",width:"3rem",background:filter.accent,marginTop:"0.6rem"}}/>
          </div>

          {/* Pregunta */}
          <div style={{position:"absolute",top:"42%",transform:"translateY(-50%)",left:"3rem",right:"3rem"}}>
            <h2 style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(1.8rem,3.5vw,3.5rem)",fontWeight:100,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.15,margin:0}}>
              {filter.question}
            </h2>
            <div style={{height:"1px",width:"4rem",background:`rgba(${filter.accentRgb},0.5)`,marginTop:"1.5rem"}}/>
          </div>

          {/* Opciones */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,display:"grid",gridTemplateColumns:`repeat(${filter.options.length},1fr)`,borderTop:`1px solid rgba(${filter.accentRgb},0.12)`}}>
            {filter.options.map(opt => {
              const isSel = selected[filter.id] === opt.v;
              return (
                <div key={opt.v} className="gopt"
                  onClick={() => handleSelect(filter.id, opt.v, i)}
                  style={{
                    padding:"2rem 1.5rem 2.5rem",
                    borderRight:`1px solid rgba(${filter.accentRgb},0.08)`,
                    background:isSel?`rgba(${filter.accentRgb},0.1)`:"transparent",
                    boxShadow:isSel?`inset 0 0 40px rgba(${filter.accentRgb},0.1)`:"none",
                    position:"relative",
                  }}>
                  <div style={{fontFamily:"monospace",fontSize:"0.45rem",color:`rgba(${filter.accentRgb},${isSel?0.9:0.4})`,letterSpacing:"0.3em",marginBottom:"1rem"}}>{opt.sub}</div>
                  <h3 style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(1rem,1.6vw,1.5rem)",fontWeight:200,textTransform:"uppercase",color:isSel?"#fff":"rgba(255,255,255,0.6)",letterSpacing:"0.02em",margin:0}}>{opt.l}</h3>
                  <div style={{height:"1px",width:isSel?"100%":"25%",background:isSel?filter.accent:`rgba(${filter.accentRgb},0.2)`,marginTop:"1rem",transition:"all 0.5s"}}/>
                  {isSel&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${filter.accent},transparent)`}}/>}
                </div>
              );
            })}
          </div>

          {/* CTA solo en último panel */}
          {i===FILTERS.length-1&&allSelected&&(
            <button onClick={() => router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
              style={{position:"absolute",bottom:"calc(28% + 1rem)",right:"3rem",background:"none",border:`1px solid ${filter.accent}`,color:filter.accent,fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",letterSpacing:"0.5em",textTransform:"uppercase",padding:"1rem 2.5rem",cursor:"pointer"}}>
              Discover Properties →
            </button>
          )}
        </div>
      ))}
    </>
  );
}

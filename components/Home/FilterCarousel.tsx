"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id:"zona", index:"01", category:"ZONA", accent:"#c9a96e", accentRgb:"201,169,110",
    question:"Where do you want to live?",
    options:[
      { value:"marbella",   label:"Marbella",   sub:"36°30'N 4°53'W", detail:"Golden Mile · Puerto Banús · Sierra Blanca" },
      { value:"estepona",   label:"Estepona",   sub:"36°25'N 5°08'W", detail:"New Golden Mile · Selwo · Marina" },
      { value:"mijas",      label:"Mijas",      sub:"36°35'N 4°38'W", detail:"La Cala · El Chaparral · Calanova" },
      { value:"benahavis",  label:"Benahavís",  sub:"36°31'N 5°02'W", detail:"La Zagaleta · Monte Mayor" },
      { value:"sotogrande", label:"Sotogrande", sub:"36°17'N 5°23'W", detail:"La Reserva · Valderrama" },
    ],
  },
  {
    id:"tipo", index:"02", category:"TIPO", accent:"#a8c4d4", accentRgb:"168,196,212",
    question:"What defines your vision?",
    options:[
      { value:"villa",     label:"Villa",     sub:"THE ESTATE",  detail:"Privacy · Architecture · Infinity" },
      { value:"apartment", label:"Apartment", sub:"THE SKY",     detail:"Views · Altitude · Prestige" },
      { value:"townhouse", label:"Townhouse", sub:"THE ADDRESS", detail:"Community · Security · Elegance" },
      { value:"plot",      label:"Plot",      sub:"THE CANVAS",  detail:"Raw Land · Your Vision · No Limits" },
    ],
  },
  {
    id:"precio", index:"03", category:"INVERSIÓN", accent:"#e8a87c", accentRgb:"232,168,124",
    question:"Define the scale of your ambition.",
    options:[
      { value:"500k-1m", label:"€500K – 1M",  sub:"I",   detail:"Entry to Luxury" },
      { value:"1m-2m",   label:"€1M – 2M",    sub:"II",  detail:"Prime Collection" },
      { value:"2m-5m",   label:"€2M – 5M",    sub:"III", detail:"Ultra Premium" },
      { value:"5m+",     label:"€5M & above", sub:"∞",   detail:"No Limits" },
    ],
  },
];

interface Props {
  locale: string;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  activePanelRef: React.RefObject<number>;
}

export default function FilterCarousel({ locale, panelRefs, activePanelRef }: Props) {
  const [selected, setSelected] = useState<Record<string,string>>({});
  const router = useRouter();

  const handleSelect = (filterId: string, value: string, idx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (idx < FILTERS.length - 1) {
      const next = idx + 1;
      setTimeout(() => {
        activePanelRef.current = next;
        (window as any).__advancePanel?.(next);
      }, 300);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        .fopt{transition:all 0.35s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .fopt:hover{transform:translateY(-5px);background:rgba(255,255,255,0.04) !important;}
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position:"absolute", top:"50%", left:"50%",
            width:"80vw", height:"78vh",
            marginLeft:"-40vw", marginTop:"-39vh",
            willChange:"transform,opacity,filter",
            transform: `translate3d(0,0,${i * -2000}px) scale(${i === 0 ? 1 : 0.4})`,
            opacity: i === 0 ? 1 : 0,
            background:`linear-gradient(135deg,rgba(${filter.accentRgb},0.06) 0%,rgba(8,8,8,0.97) 100%)`,
            border:`1px solid rgba(${filter.accentRgb},0.2)`,
            boxShadow:`0 0 120px rgba(${filter.accentRgb},0.08),inset 0 0 80px rgba(${filter.accentRgb},0.04)`,
          }}
        >
          {/* Cuadricula arquitectonica */}
          <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.04}}>
            {[...Array(8)].map((_,k) => <div key={k} style={{position:"absolute",left:`${k*14.28}%`,top:0,bottom:0,width:"1px",background:"white"}}/>)}
            {[...Array(6)].map((_,k) => <div key={k} style={{position:"absolute",top:`${k*20}%`,left:0,right:0,height:"1px",background:"white"}}/>)}
          </div>

          {/* Numero gigante fantasma */}
          <div style={{position:"absolute",top:"-5%",left:"-3%",fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(8rem,20vw,16rem)",fontWeight:100,color:"transparent",WebkitTextStroke:`1px rgba(${filter.accentRgb},0.2)`,letterSpacing:"-0.05em",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>
            {filter.index}
          </div>

          {/* VOL esquina */}
          <div style={{position:"absolute",top:"2.5rem",right:"2.5rem",color:`rgba(${filter.accentRgb},0.7)`,fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",fontWeight:300,letterSpacing:"0.5em"}}>
            VOL. {filter.index}
          </div>

          {/* Categoria + linea */}
          <div style={{position:"absolute",top:"3rem",left:"3rem"}}>
            <p style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",fontWeight:300,letterSpacing:"0.5em",color:filter.accent,textTransform:"uppercase",margin:0}}>{filter.category}</p>
            <div style={{height:"1px",width:"3rem",background:filter.accent,marginTop:"0.6rem"}}/>
          </div>

          {/* Pregunta */}
          <div style={{position:"absolute",top:"40%",transform:"translateY(-60%)",left:"3rem",right:"3rem"}}>
            <h2 style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(1.5rem,3vw,2.8rem)",fontWeight:100,color:"white",letterSpacing:"-0.02em",lineHeight:1.2,margin:0}}>
              {filter.question}
            </h2>
            <div style={{height:"1px",width:"4rem",background:`rgba(${filter.accentRgb},0.5)`,marginTop:"1.2rem"}}/>
          </div>

          {/* Opciones */}
          <div style={{
            position:"absolute",bottom:0,left:0,right:0,
            display:"grid",
            gridTemplateColumns:filter.options.length===5?"repeat(5,1fr)":"repeat(4,1fr)",
            borderTop:`1px solid rgba(${filter.accentRgb},0.12)`,
          }}>
            {filter.options.map((opt) => {
              const isSel = selected[filter.id] === opt.value;
              return (
                <div
                  key={opt.value}
                  className="fopt"
                  onClick={() => handleSelect(filter.id, opt.value, i)}
                  style={{
                    padding:"2rem 1.5rem 2.5rem",
                    borderRight:`1px solid rgba(${filter.accentRgb},0.08)`,
                    background:isSel?`rgba(${filter.accentRgb},0.08)`:"transparent",
                    boxShadow:isSel?`inset 0 0 40px rgba(${filter.accentRgb},0.08)`:"none",
                    position:"relative",
                  }}
                >
                  <div style={{fontFamily:"monospace",fontSize:"0.45rem",color:`rgba(${filter.accentRgb},${isSel?0.9:0.35})`,letterSpacing:"0.3em",marginBottom:"1rem",transition:"color 0.4s"}}>{opt.sub}</div>
                  <h3 style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(1rem,1.8vw,1.6rem)",fontWeight:200,textTransform:"uppercase",color:isSel?"#fff":"rgba(255,255,255,0.55)",letterSpacing:"0.02em",lineHeight:1.1,margin:"0 0 0.8rem",transition:"color 0.4s"}}>{opt.label}</h3>
                  <div style={{height:"1px",width:isSel?"100%":"25%",background:isSel?filter.accent:`rgba(${filter.accentRgb},0.2)`,marginBottom:"0.8rem",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}/>
                  <p style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.4rem",fontWeight:300,color:isSel?`rgba(${filter.accentRgb},0.9)`:"rgba(255,255,255,0.25)",letterSpacing:"0.2em",textTransform:"uppercase",lineHeight:1.7,margin:0,transition:"color 0.4s"}}>{opt.detail}</p>
                  {isSel&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${filter.accent},transparent)`}}/>}
                </div>
              );
            })}
          </div>

          {/* CTA final */}
          {i===FILTERS.length-1&&allSelected&&(
            <button onClick={()=>router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
              style={{position:"absolute",bottom:"calc(30% + 1rem)",right:"3rem",background:"none",border:`1px solid ${filter.accent}`,color:filter.accent,fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",letterSpacing:"0.5em",textTransform:"uppercase",padding:"1rem 2.5rem",cursor:"pointer"}}>
              Discover Properties →
            </button>
          )}
        </div>
      ))}
    </>
  );
}

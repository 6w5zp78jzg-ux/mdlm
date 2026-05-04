"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  {
    id:"zona", category:"01 · ZONA", question:"Where do you want to live?",
    options:[
      { value:"marbella",   label:"Marbella",   sub:"Golden Mile · Puerto Banús · Sierra Blanca", icon:"M" },
      { value:"estepona",   label:"Estepona",   sub:"New Golden Mile · Selwo · Marina",           icon:"E" },
      { value:"mijas",      label:"Mijas",      sub:"La Cala · El Chaparral · Calanova",          icon:"Mi" },
      { value:"benahavis",  label:"Benahavís",  sub:"La Zagaleta · Monte Mayor · Los Arqueros",   icon:"B" },
      { value:"sotogrande", label:"Sotogrande", sub:"La Reserva · Valderrama · Kings & Queens",   icon:"S" },
    ],
    accent:"#c9a96e",
    bg:"radial-gradient(ellipse 140% 100% at 60% 80%, #0f0800 0%, #1a1000 40%, #000000 100%)",
  },
  {
    id:"tipo", category:"02 · TIPO", question:"What is your vision?",
    options:[
      { value:"villa",     label:"Villa",     sub:"Private · Exclusive · Iconic",  icon:"V" },
      { value:"apartment", label:"Apartment", sub:"Sky · Views · Penthouse",       icon:"A" },
      { value:"townhouse", label:"Townhouse", sub:"Gated · Elegant · Community",   icon:"T" },
      { value:"plot",      label:"Plot",      sub:"Raw Land · Infinite Potential", icon:"P" },
    ],
    accent:"#e8d5b7",
    bg:"radial-gradient(ellipse 140% 100% at 40% 20%, #000d1a 0%, #001020 40%, #000000 100%)",
  },
  {
    id:"precio", category:"03 · PRICE", question:"Define your investment.",
    options:[
      { value:"500k-1m", label:"€500K – 1M", sub:"Entry Luxury",    icon:"·" },
      { value:"1m-2m",   label:"€1M – 2M",   sub:"Prime Collection", icon:"··" },
      { value:"2m-5m",   label:"€2M – 5M",   sub:"Ultra Premium",   icon:"···" },
      { value:"5m+",     label:"€5M +",       sub:"No Limits",       icon:"∞" },
    ],
    accent:"#ff8c42",
    bg:"radial-gradient(ellipse 140% 100% at 50% 100%, #0f0500 0%, #1a0800 40%, #000000 100%)",
  },
];

interface Props { locale: string; }

export default function FilterCarousel({ locale }: Props) {
  const [activePanel, setActivePanel] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  const handleSelect = (filterId: string, value: string) => {
    if (transitioning) return;
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (activePanel < FILTERS.length - 1) {
      setTransitioning(true);
      setTimeout(() => { setActivePanel(p => p + 1); setTransitioning(false); }, 600);
    }
  };

  const filter = FILTERS[activePanel];
  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        @keyframes panelEnter { 0%{opacity:0;transform:translate3d(80px,0,-300px) rotateY(-6deg) scale(0.92);filter:blur(24px);} 100%{opacity:1;transform:translate3d(0,0,0) rotateY(0deg) scale(1);filter:blur(0);} }
        @keyframes optionEnter { 0%{opacity:0;transform:translateY(30px);filter:blur(8px);} 100%{opacity:1;transform:translateY(0);filter:blur(0);} }
        .panel-enter  { animation: panelEnter  0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .option-enter { animation: optionEnter 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .option-card  { transition: all 0.35s cubic-bezier(0.16,1,0.3,1); cursor:pointer; }
        .option-card:hover { transform: translateY(-6px) scale(1.03); }
      `}</style>

      <div style={{ position:"absolute", inset:0, perspective:"1200px", perspectiveOrigin:"center center" }}>
        <div key={activePanel} className="panel-enter" style={{ width:"100%", height:"100%", background:filter.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>

          {/* Cuadricula */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.04 }}>
            {[...Array(8)].map((_,i) => <div key={i} style={{ position:"absolute", left:`${i*14.28}%`, top:0, bottom:0, width:"1px", background:"white" }} />)}
            {[...Array(6)].map((_,i) => <div key={i} style={{ position:"absolute", top:`${i*20}%`, left:0, right:0, height:"1px", background:"white" }} />)}
          </div>

          {/* Numero fantasma */}
          <div style={{ position:"absolute", right:"-0.05em", bottom:"-0.2em", fontFamily:"Georgia,serif", fontSize:"clamp(12rem,30vw,28rem)", fontWeight:700, color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,0.04)", lineHeight:1, userSelect:"none", pointerEvents:"none" }}>
            {String(activePanel+1).padStart(2,"0")}
          </div>

          <p style={{ color:filter.accent, fontFamily:"Georgia,serif", fontSize:"clamp(0.4rem,0.8vw,0.65rem)", letterSpacing:"0.6em", textTransform:"uppercase", margin:"0 0 1rem", opacity:0.8 }}>
            {filter.category}
          </p>

          <h2 style={{ color:"white", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(1.8rem,4vw,3.5rem)", fontWeight:100, letterSpacing:"0.05em", margin:"0 0 4rem", textAlign:"center" }}>
            {filter.question}
          </h2>

          <div style={{ display:"grid", gridTemplateColumns: filter.options.length===5 ? "repeat(5,1fr)" : "repeat(4,1fr)", gap:"1.5rem", maxWidth:"90vw", width:"100%", padding:"0 4vw" }}>
            {filter.options.map((opt, oi) => {
              const isSelected = selected[filter.id] === opt.value;
              return (
                <div key={opt.value} className="option-card option-enter" onClick={() => handleSelect(filter.id, opt.value)}
                  style={{ border:`1px solid ${isSelected ? filter.accent : "rgba(255,255,255,0.1)"}`, background: isSelected ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.3)", padding:"2.5rem 2rem", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem", position:"relative", overflow:"hidden", boxShadow: isSelected ? `0 0 40px rgba(201,169,110,0.15),inset 0 0 30px rgba(201,169,110,0.05)` : "none", animationDelay:`${oi*0.08+0.2}s` }}>

                  <div style={{ fontFamily:"Georgia,serif", fontSize: filter.id==="precio" ? "2rem" : "clamp(2rem,4vw,3.5rem)", fontWeight:300, color: isSelected ? filter.accent : "rgba(255,255,255,0.15)", lineHeight:1, transition:"color 0.4s ease" }}>{opt.icon}</div>
                  <div style={{ width: isSelected ? "3rem" : "1.5rem", height:"1px", background: isSelected ? filter.accent : "rgba(255,255,255,0.2)", transition:"all 0.4s ease" }} />
                  <p style={{ color: isSelected ? "white" : "rgba(255,255,255,0.7)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"clamp(0.9rem,1.6vw,1.3rem)", fontWeight: isSelected ? 400 : 300, letterSpacing:"0.05em", margin:0, textAlign:"center", transition:"color 0.4s ease" }}>{opt.label}</p>
                  <p style={{ color:"rgba(255,255,255,0.35)", fontFamily:"Georgia,serif", fontSize:"clamp(0.35rem,0.6vw,0.5rem)", letterSpacing:"0.3em", textTransform:"uppercase", margin:0, textAlign:"center", fontStyle:"italic" }}>{opt.sub}</p>

                  {isSelected && (
                    <div style={{ position:"absolute", top:"1rem", right:"1rem", width:"1.2rem", height:"1.2rem", border:`1px solid ${filter.accent}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:"0.5rem", height:"0.5rem", background:filter.accent }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ position:"absolute", bottom:"2.5rem", display:"flex", alignItems:"center", gap:"2rem" }}>
            <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
              {FILTERS.map((_,i) => <div key={i} style={{ width: i===activePanel ? "2rem" : "0.4rem", height:"1px", background: i<=activePanel ? filter.accent : "rgba(255,255,255,0.2)", transition:"all 0.4s ease" }} />)}
            </div>
            <div style={{ display:"flex", gap:"0.8rem" }}>
              {Object.entries(selected).map(([k,v]) => <span key={k} style={{ color:"rgba(255,255,255,0.4)", fontFamily:"Georgia,serif", fontSize:"0.45rem", letterSpacing:"0.3em", textTransform:"uppercase", fontStyle:"italic" }}>{v}</span>)}
            </div>
            {allSelected && (
              <button onClick={() => router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)} style={{ background:"none", border:`1px solid ${filter.accent}`, color:filter.accent, fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.55rem", letterSpacing:"0.4em", textTransform:"uppercase", padding:"0.8rem 2rem", cursor:"pointer", transition:"all 0.4s ease" }}>
                Discover Properties →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

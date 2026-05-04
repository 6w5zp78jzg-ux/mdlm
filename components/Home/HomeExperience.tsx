"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Props { locale: string; }

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

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skyRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<"header" | "filters">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const SECTION_LENGTH = 1.0;
  const [selected, setSelected] = useState<Record<string,string>>({});
  const router = useRouter();

  const handleSelect = (filterId: string, value: string, idx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (idx < FILTERS.length - 1) {
      setTimeout(() => {
        targetProgressRef.current = idx + 1;
      }, 300);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    let cycleTime = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      cycleTime += 1 / 60 / 90;
      cycleTime = cycleTime % 1;
      const t = cycleTime;
      const angle = t * 360 - 90;
      const sunX = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const sunY = 50 + Math.sin(angle * Math.PI / 180) * 80;

      const lerpColor = (a: number[], b: number[], k: number) =>
        `rgb(${Math.round(a[0]+(b[0]-a[0])*k)},${Math.round(a[1]+(b[1]-a[1])*k)},${Math.round(a[2]+(b[2]-a[2])*k)})`;

      const palettes = [
        [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
        [[255,245,184],[255,213,79],[79,195,247],[25,118,210],[6,26,58]],
        [[255,167,38],[216,67,21],[106,27,154],[26,18,69],[6,8,24]],
        [[80,40,120],[40,30,80],[26,18,69],[10,10,42],[0,0,0]],
        [[10,10,58],[5,5,36],[2,2,26],[0,0,0],[0,0,0]],
        [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
      ];
      const phaseFloat = t * 5;
      const phaseIdx = Math.floor(phaseFloat) % 5;
      const k = phaseFloat - Math.floor(phaseFloat);
      const pA = palettes[phaseIdx], pB = palettes[phaseIdx+1];

      if (skyRef.current) skyRef.current.style.background = `radial-gradient(ellipse 130% 90% at ${sunX}% ${sunY}%,
        ${lerpColor(pA[0],pB[0],k)} 0%,${lerpColor(pA[1],pB[1],k)} 12%,
        ${lerpColor(pA[2],pB[2],k)} 30%,${lerpColor(pA[3],pB[3],k)} 60%,
        ${lerpColor(pA[4],pB[4],k)} 100%)`;

      if (sunRef.current) {
        let v = 0;
        if (t<0.45) v=1; else if (t<0.55) v=1-(t-0.45)/0.10; else if (t>0.95) v=(t-0.95)/0.05;
        sunRef.current.style.opacity = String(v);
        sunRef.current.style.left = `${sunX}%`;
        sunRef.current.style.top = `${sunY}%`;
      }
      if (moonRef.current) {
        let v = 0;
        if (t>0.55&&t<0.95) { if (t<0.65) v=(t-0.55)/0.10; else if (t>0.85) v=1-(t-0.85)/0.10; else v=1; }
        const ma = (t-0.5)*2*180-90;
        moonRef.current.style.opacity = String(v);
        moonRef.current.style.left = `${50+Math.cos(ma*Math.PI/180)*35}%`;
        moonRef.current.style.top = `${30+Math.sin(ma*Math.PI/180)*20}%`;
      }
      if (starsRef.current) {
        let v = 0;
        if (t>0.5&&t<0.95) v=Math.sin(((t-0.5)/0.45)*Math.PI);
        starsRef.current.style.opacity = String(v);
      }

      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1-smoothHeader);
        headerRef.current.style.transform = `translate3d(0,${-smoothHeader*80}px,0) scale(${1-smoothHeader*0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader>0.85?"none":"auto";
      }
      if (filtersRef.current) {
        const fOp = Math.max(0, (smoothHeader-0.4)/0.6);
        filtersRef.current.style.opacity = String(fOp);
        filtersRef.current.style.pointerEvents = fOp>0.3?"auto":"none";
      }

      // ── FILTROS Z-AXIS — motor identico al de propiedades ────────────
      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.06);
      FILTERS.forEach((_, i) => {
        const el = filterRefs.current[i];
        if (!el) return;
        const dist = progressRef.current - i * SECTION_LENGTH;
        let opacity=0, scale=0.4, zPos=-2000, blur=30;
        if (dist>=-SECTION_LENGTH && dist<-SECTION_LENGTH*0.3) {
          const tt=(dist+SECTION_LENGTH)/(SECTION_LENGTH*0.7);
          opacity=tt*tt; scale=0.4+tt*0.6; zPos=-2000+tt*2000; blur=30-tt*30;
        } else if (dist>=-SECTION_LENGTH*0.3 && dist<SECTION_LENGTH*0.3) {
          opacity=1; scale=1; zPos=0; blur=0;
        } else if (dist>=SECTION_LENGTH*0.3 && dist<SECTION_LENGTH) {
          const tt=(dist-SECTION_LENGTH*0.3)/(SECTION_LENGTH*0.7);
          opacity=1-tt; scale=1+tt*0.5; zPos=tt*800; blur=tt*20;
        } else if (dist>=SECTION_LENGTH) {
          opacity=0; scale=1.5; zPos=800; blur=20;
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0,0,${zPos}px) scale(${scale})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.pointerEvents = opacity>0.7?"auto":"none";
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current+delta*0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) phaseRef.current = "filters";
      } else {
        if (targetProgressRef.current<=0 && delta<0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const stars = Array.from({length:80},(_,i)=>({
    left:(i*37)%100, top:(i*71)%70,
    size:i%3===0?2:1, delay:(i*0.13)%4, bright:i%5===0,
  }));

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"#000"}}>
      <style>{`
        @keyframes wordReveal{0%{clip-path:inset(0 100% 0 0);opacity:0;}100%{clip-path:inset(0 0% 0 0);opacity:1;}}
        @keyframes lineGrow{0%{transform:scaleY(0);opacity:0;}100%{transform:scaleY(1);opacity:1;}}
        @keyframes glowPulse{0%,100%{text-shadow:0 0 40px rgba(255,160,50,0.2);}50%{text-shadow:0 0 60px rgba(255,180,80,0.5);}}
        @keyframes sunGlow{0%,100%{box-shadow:0 0 30px 8px rgba(255,200,100,0.5),0 0 60px 18px rgba(255,140,40,0.2);}50%{box-shadow:0 0 45px 12px rgba(255,220,140,0.7),0 0 80px 25px rgba(255,160,60,0.3);}}
        @keyframes moonGlow{0%,100%{box-shadow:0 0 40px 10px rgba(220,230,255,0.4);}50%{box-shadow:0 0 60px 15px rgba(240,245,255,0.6);}}
        @keyframes starTwinkle{0%,100%{opacity:0.3;transform:scale(1);}50%{opacity:1;transform:scale(1.5);}}
        @keyframes neonBreath{0%,100%{height:1.5rem;opacity:0.3;box-shadow:0 0 4px 1px rgba(255,255,255,0.3);}50%{height:3.5rem;opacity:1;box-shadow:0 0 12px 3px rgba(255,255,255,0.9);}}
        @keyframes subtleFade{0%,100%{opacity:0.3;}50%{opacity:0.8;}}
        .neon-home{animation:neonBreath 2.4s ease-in-out infinite;}
        .scroll-fade{animation:subtleFade 2.4s ease-in-out infinite;}
        .mar-glow{animation:glowPulse 4s ease-in-out infinite;}
        .reveal-1{animation:wordReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both;}
        .reveal-2{animation:wordReveal 1.4s cubic-bezier(0.16,1,0.3,1) 0.8s both;}
        .reveal-3{animation:wordReveal 1s cubic-bezier(0.16,1,0.3,1) 1.4s both;}
        .reveal-4{animation:wordReveal 0.8s cubic-bezier(0.16,1,0.3,1) 1.8s both;}
        .line-grow{animation:lineGrow 1s ease-out 0.1s both;transform-origin:top;}
        .sun-orb{animation:sunGlow 4s ease-in-out infinite;}
        .moon-orb{animation:moonGlow 5s ease-in-out infinite;}
        .star{animation:starTwinkle ease-in-out infinite;}
        .fopt{transition:all 0.35s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .fopt:hover{background:rgba(255,255,255,0.04) !important;}
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div ref={headerRef} style={{position:"absolute",inset:0,zIndex:20,willChange:"opacity,transform",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <div ref={skyRef} style={{position:"absolute",inset:0,transition:"background 0.1s linear"}}/>
        <div ref={starsRef} style={{position:"absolute",inset:0,opacity:0,pointerEvents:"none",transition:"opacity 0.5s ease"}}>
          {stars.map((s,i) => (
            <div key={i} className="star" style={{position:"absolute",left:`${s.left}%`,top:`${s.top}%`,width:`${s.size}px`,height:`${s.size}px`,borderRadius:"50%",background:s.bright?"rgba(255,255,255,1)":"rgba(220,230,255,0.7)",boxShadow:s.bright?"0 0 4px rgba(255,255,255,0.8)":"none",animationDuration:`${2+s.delay}s`,animationDelay:`${s.delay}s`}}/>
          ))}
        </div>
        <div ref={sunRef} className="sun-orb" style={{position:"absolute",width:"80px",height:"80px",borderRadius:"50%",background:"radial-gradient(circle, #fff5b8 0%, #ffd54f 40%, #ff8c00 80%, transparent 100%)",transform:"translate(-50%,-50%)",pointerEvents:"none",transition:"opacity 1s ease"}}/>
        <div ref={moonRef} className="moon-orb" style={{position:"absolute",width:"100px",height:"100px",borderRadius:"50%",background:"radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f4ff 40%, #c8d4f0 70%, #8090b0 100%)",transform:"translate(-50%,-50%)",pointerEvents:"none",opacity:0,transition:"opacity 1s ease"}}>
          <div style={{position:"absolute",top:"30%",left:"25%",width:"12px",height:"12px",borderRadius:"50%",background:"rgba(120,140,170,0.4)"}}/>
          <div style={{position:"absolute",top:"55%",left:"55%",width:"8px",height:"8px",borderRadius:"50%",background:"rgba(120,140,170,0.3)"}}/>
          <div style={{position:"absolute",top:"20%",left:"60%",width:"6px",height:"6px",borderRadius:"50%",background:"rgba(120,140,170,0.35)"}}/>
          <div style={{position:"absolute",top:"65%",left:"20%",width:"10px",height:"10px",borderRadius:"50%",background:"rgba(120,140,170,0.3)"}}/>
        </div>

        <div style={{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 2rem"}}>
          <div className="line-grow" style={{width:"1px",height:"5rem",background:"linear-gradient(to bottom,transparent,rgba(255,180,80,0.5))",marginBottom:"2.5rem"}}/>
          <p className="reveal-1" style={{color:"rgba(255,180,80,0.8)",fontFamily:"Georgia,serif",fontSize:"clamp(0.45rem,0.9vw,0.7rem)",letterSpacing:"0.7em",textTransform:"uppercase",margin:"0 0 2rem",fontWeight:300,fontStyle:"italic"}}>
            WHERE THE MEDITERRANEAN BECOMES EPIC
          </p>
          <div className="reveal-2 mar-glow" style={{display:"flex",alignItems:"baseline",gap:"0.02em",lineHeight:0.85,marginBottom:"0.5rem"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:"clamp(5rem,14vw,13rem)",fontWeight:300,color:"white",letterSpacing:"-0.02em"}}>MAR</span>
            <span style={{fontFamily:"Georgia,serif",fontSize:"clamp(5rem,14vw,13rem)",fontWeight:700,background:"linear-gradient(135deg,#ffd700 0%,#ff8c00 40%,#ff4500 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.04em"}}>BELLA</span>
          </div>
          <p className="reveal-3" style={{color:"rgba(255,255,255,0.45)",fontFamily:"Georgia,serif",fontSize:"clamp(0.8rem,2vw,1.5rem)",fontWeight:300,letterSpacing:"0.5em",fontStyle:"italic",margin:"1.5rem 0 2.5rem",textTransform:"uppercase"}}>
            Ultra · Luxury · Real Estate
          </p>
          <div className="reveal-4" style={{display:"flex",alignItems:"center",gap:"0.8rem",color:"rgba(255,180,80,0.55)",fontFamily:"Georgia,serif",fontSize:"clamp(0.35rem,0.65vw,0.55rem)",letterSpacing:"0.45em",textTransform:"uppercase"}}>
            {["Golden Mile","Puerto Banús","Nueva Andalucía","Sierra Blanca"].map((loc,i,arr)=>(
              <span key={loc} style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
                {loc}{i<arr.length-1&&<span style={{width:"3px",height:"3px",borderRadius:"50%",background:"rgba(255,180,80,0.4)",display:"inline-block"}}/>}
              </span>
            ))}
          </div>
          <div className="line-grow" style={{width:"1px",height:"5rem",background:"linear-gradient(to bottom,rgba(255,180,80,0.4),transparent)",marginTop:"2.5rem"}}/>
        </div>

        <div style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.7rem",pointerEvents:"none",zIndex:20}}>
          <span className="scroll-fade" style={{color:"rgba(255,255,255,0.5)",fontSize:"0.4rem",letterSpacing:"0.5em",fontFamily:"Georgia,serif",textTransform:"uppercase"}}>SCROLL</span>
          <div className="neon-home" style={{width:"1px",background:"rgba(255,200,100,0.8)"}}/>
        </div>
      </div>

      {/* ── FILTROS Z-AXIS — misma estructura exacta que propiedades ── */}
      <div ref={filtersRef} style={{
        position:"absolute", inset:0, opacity:0, pointerEvents:"none",
        perspective:"1200px", perspectiveOrigin:"center center",
        background:"radial-gradient(ellipse at center,#0a0a0a 0%,#000000 100%)",
      }}>
        <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d"}}>
          {FILTERS.map((filter, i) => (
            <div
              key={filter.id}
              ref={el => { filterRefs.current[i] = el; }}
              style={{
                position:"absolute", top:"50%", left:"50%",
                width:"70vw", height:"75vh",
                marginLeft:"-35vw", marginTop:"-37.5vh",
                transformStyle:"preserve-3d",
                willChange:"transform,opacity,filter",
                background:`linear-gradient(135deg,rgba(${filter.accentRgb},0.06) 0%,rgba(8,8,8,0.97) 100%)`,
                border:`1px solid rgba(${filter.accentRgb},0.25)`,
                boxShadow:`0 0 80px rgba(${filter.accentRgb},0.15),inset 0 0 40px rgba(${filter.accentRgb},0.05)`,
              }}
            >
              {/* Cuadricula */}
              <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.04}}>
                {[...Array(8)].map((_,k)=><div key={k} style={{position:"absolute",left:`${k*14.28}%`,top:0,bottom:0,width:"1px",background:"white"}}/>)}
                {[...Array(6)].map((_,k)=><div key={k} style={{position:"absolute",top:`${k*20}%`,left:0,right:0,height:"1px",background:"white"}}/>)}
              </div>

              {/* Numero fantasma */}
              <div style={{position:"absolute",top:"-5%",left:"-3%",fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(8rem,20vw,16rem)",fontWeight:100,color:"transparent",WebkitTextStroke:`1px rgba(${filter.accentRgb},0.2)`,letterSpacing:"-0.05em",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>
                {filter.index}
              </div>

              {/* VOL */}
              <div style={{position:"absolute",top:"2.5rem",right:"2.5rem",color:`rgba(${filter.accentRgb},0.7)`,fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",fontWeight:300,letterSpacing:"0.5em"}}>
                VOL. {filter.index}
              </div>

              {/* Categoria */}
              <div style={{position:"absolute",top:"3rem",left:"3rem"}}>
                <p style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",fontWeight:300,letterSpacing:"0.5em",color:filter.accent,textTransform:"uppercase",margin:0}}>{filter.category}</p>
                <div style={{height:"1px",width:"3rem",background:filter.accent,marginTop:"0.6rem"}}/>
              </div>

              {/* Pregunta */}
              <div style={{position:"absolute",top:"38%",transform:"translateY(-50%)",left:"3rem",right:"3rem"}}>
                <h2 style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(1.5rem,3vw,2.8rem)",fontWeight:100,color:"white",letterSpacing:"-0.02em",lineHeight:1.2,margin:0}}>
                  {filter.question}
                </h2>
                <div style={{height:"1px",width:"4rem",background:`rgba(${filter.accentRgb},0.5)`,marginTop:"1.2rem"}}/>
              </div>

              {/* Opciones */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,display:"grid",gridTemplateColumns:filter.options.length===5?"repeat(5,1fr)":"repeat(4,1fr)",borderTop:`1px solid rgba(${filter.accentRgb},0.12)`}}>
                {filter.options.map(opt => {
                  const isSel = selected[filter.id]===opt.value;
                  return (
                    <div key={opt.value} className="fopt"
                      onClick={()=>handleSelect(filter.id,opt.value,i)}
                      style={{padding:"2rem 1.5rem 2.5rem",borderRight:`1px solid rgba(${filter.accentRgb},0.08)`,background:isSel?`rgba(${filter.accentRgb},0.08)`:"transparent",boxShadow:isSel?`inset 0 0 40px rgba(${filter.accentRgb},0.08)`:"none",position:"relative"}}>
                      <div style={{fontFamily:"monospace",fontSize:"0.45rem",color:`rgba(${filter.accentRgb},${isSel?0.9:0.35})`,letterSpacing:"0.3em",marginBottom:"1rem",transition:"color 0.4s"}}>{opt.sub}</div>
                      <h3 style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"clamp(1rem,1.8vw,1.6rem)",fontWeight:200,textTransform:"uppercase",color:isSel?"#fff":"rgba(255,255,255,0.55)",letterSpacing:"0.02em",lineHeight:1.1,margin:"0 0 0.8rem",transition:"color 0.4s"}}>{opt.label}</h3>
                      <div style={{height:"1px",width:isSel?"100%":"25%",background:isSel?filter.accent:`rgba(${filter.accentRgb},0.2)`,marginBottom:"0.8rem",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}/>
                      <p style={{fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.4rem",fontWeight:300,color:isSel?`rgba(${filter.accentRgb},0.9)`:"rgba(255,255,255,0.25)",letterSpacing:"0.2em",textTransform:"uppercase",lineHeight:1.7,margin:0,transition:"color 0.4s"}}>{opt.detail}</p>
                      {isSel&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${filter.accent},transparent)`}}/>}
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              {i===FILTERS.length-1&&allSelected&&(
                <button onClick={()=>router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                  style={{position:"absolute",bottom:"calc(35% + 1rem)",right:"3rem",background:"none",border:`1px solid ${filter.accent}`,color:filter.accent,fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.55rem",letterSpacing:"0.5em",textTransform:"uppercase",padding:"1rem 2.5rem",cursor:"pointer"}}>
                  Discover Properties →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useRef } from "react";
import { useHomeScroll } from "./useHomeScroll";
import SkyHeader from "./SkyHeader";
import FilterPanels from "./FilterPanels";

interface Props { locale: string; }

const TOTAL_PANELS = 3;

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useHomeScroll({ headerRef, filtersRef, panelRefs, totalPanels: TOTAL_PANELS });

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"#000"}}>
      <div ref={headerRef} style={{position:"absolute",inset:0,zIndex:20,willChange:"opacity,transform",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <SkyHeader />
      </div>
      <div ref={filtersRef} style={{position:"absolute",inset:0,zIndex:10,opacity:0,pointerEvents:"none",perspective:"800px",perspectiveOrigin:"center center",background:"radial-gradient(ellipse 60% 60% at center, #1a1410 0%, #0d0b08 40%, #000 100%)"}}>
        <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d"}}>
          <FilterPanels locale={locale} panelRefs={panelRefs} />
        </div>
      </div>
    </div>
  );
}

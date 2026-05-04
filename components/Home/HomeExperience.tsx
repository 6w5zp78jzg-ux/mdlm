"use client";
import { useRef } from "react";
import { useHomeScroll } from "./useHomeScroll";
import SkyCanvas from "./SkyCanvas";
import HeaderTypography from "./HeaderTypography";
import FilterCarousel from "./FilterCarousel";

interface Props { locale: string; }

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activePanelRef = useRef<number>(0);

  useHomeScroll({ headerRef, filtersRef, panelRefs, activePanelRef });

  return (
    <div style={{ position:"fixed", inset:0, width:"100%", height:"100vh", overflow:"hidden", background:"#000" }}>
      <div ref={headerRef} style={{ position:"absolute", inset:0, zIndex:20, willChange:"opacity,transform", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <SkyCanvas />
        <HeaderTypography />
      </div>
      <div ref={filtersRef} style={{ position:"absolute", inset:0, zIndex:10, opacity:0, pointerEvents:"none" }}>
        <FilterCarousel locale={locale} panelRefs={panelRefs} activePanelRef={activePanelRef} />
      </div>
    </div>
  );
}

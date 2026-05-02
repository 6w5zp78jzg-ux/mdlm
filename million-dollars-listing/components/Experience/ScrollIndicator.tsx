"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Html } from "@react-three/drei";

// Indicador dinamico que muta texto y morfologia segun fase del scroll
export default function ScrollIndicator() {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!indicatorRef.current || !lineRef.current) return;
    const isGalleryPhase = scroll.offset > 0.48;
    indicatorRef.current.innerText = isGalleryPhase ? "Galeria" : "Descubrir";
    indicatorRef.current.style.transform = isGalleryPhase
      ? "rotate(-90deg)"
      : "rotate(0deg)";
    lineRef.current.style.height = isGalleryPhase ? "20px" : "48px";
  });

  return (
    <Html fullscreen className="pointer-events-none z-50">
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-70">
        <span
          ref={indicatorRef}
          className="text-[9px] text-white tracking-[0.2em] uppercase font-bold transition-all duration-700"
        >
          Descubrir
        </span>
        <div
          ref={lineRef}
          className="w-[1px] bg-white transition-all duration-700 h-12"
        />
      </div>
    </Html>
  );
}

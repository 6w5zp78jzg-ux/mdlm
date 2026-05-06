"use client";
import { useEffect, useRef } from "react";

interface Props {
  headerRef: React.RefObject<HTMLDivElement | null>;
  filtersRef: React.RefObject<HTMLDivElement | null>;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  totalPanels: number;
}

export function useHomeScroll({ headerRef, filtersRef, panelRefs, totalPanels }: Props) {
  const phaseRef = useRef<"header" | "filters">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);

      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0,${-smoothHeader * 80}px,0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }
      if (filtersRef.current) {
        const fOp = Math.max(0, (smoothHeader - 0.4) / 0.6);
        filtersRef.current.style.opacity = String(fOp);
        filtersRef.current.style.pointerEvents = fOp > 0.3 ? "auto" : "none";
      }

      // Z-AXIS — tú avanzas hacia los paneles
      // Panel activo: Z=0 (tamaño normal)
      // Panel siguiente: Z=+600 (grande, cerca, delante) → se aleja a Z=0 al activarse
      // Panel anterior: Z=-400 (pequeño, lejos, detrás)
      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.07);

      for (let i = 0; i < totalPanels; i++) {
        const el = panelRefs.current[i];
        if (!el) continue;

        // diff: cuánto está este panel por delante del activo
        // diff=0 → activo, diff=1 → siguiente, diff=-1 → anterior
        const diff = i - progressRef.current;

        let opacity = 0, scale = 1, zPos = 0, blur = 0;

        if (diff > 1 || diff < -1.5) {
          // Fuera de rango — invisible
          opacity = 0; scale = 0.6; zPos = diff > 0 ? 800 : -600; blur = 20;
        } else if (diff > 0 && diff <= 1) {
          // Panel SIGUIENTE — grande y cerca, se acerca desde adelante
          const t = diff; // 1→0
          opacity = 1 - t * 0.85;
          scale = 1 + t * 0.5;      // 1.5 → 1
          zPos = t * 600;            // 600 → 0 (viene desde delante)
          blur = t * 16;
        } else if (diff === 0) {
          // Panel ACTIVO
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else {
          // Panel ANTERIOR — pequeño y lejos detrás
          const t = Math.abs(diff); // 0→1
          opacity = Math.max(0, 1 - t * 1.2);
          scale = Math.max(0.5, 1 - t * 0.35);
          zPos = -t * 400;
          blur = t * 10;
        }

        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0,0,${zPos}px) scale(${scale})`;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
        el.style.pointerEvents = Math.abs(diff) < 0.4 ? "auto" : "none";
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    (window as any).__advancePanel = (next: number) => {
      targetProgressRef.current = Math.max(0, Math.min(totalPanels - 1, next));
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current + delta * 0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) phaseRef.current = "filters";
      } else {
        if (targetProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * 1.5;
      touchStartY = e.touches[0].clientY;
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current + delta * 0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) phaseRef.current = "filters";
      } else {
        if (targetProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
}

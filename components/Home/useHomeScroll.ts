"use client";
import { useEffect, useRef } from "react";

interface Props {
  headerRef: React.RefObject<HTMLDivElement | null>;
  filtersRef: React.RefObject<HTMLDivElement | null>;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  activePanel: number;
  onPanelChange: (i: number) => void;
}

export function useHomeScroll({ headerRef, filtersRef, panelRefs, activePanel, onPanelChange }: Props) {
  const phaseRef = useRef<"header" | "filters">("header");
  const headerProgressRef = useRef(0);
  const activePanelRef = useRef(activePanel);

  // Mantener ref sincronizada con el state de React
  activePanelRef.current = activePanel;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Posiciones Z suavizadas por panel — igual que hacíamos con propiedades
    const smoothZ = [0, -2000, -2000];
    const targetZ = [0, -2000, -2000];
    const TOTAL_PANELS = 3;

    const tick = () => {
      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);

      // HEADER
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0, ${-smoothHeader * 80}px, 0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }
      if (filtersRef.current) {
        const fOp = Math.max(0, (smoothHeader - 0.4) / 0.6);
        filtersRef.current.style.opacity = String(fOp);
        filtersRef.current.style.pointerEvents = fOp > 0.3 ? "auto" : "none";
      }

      // Z-AXIS — motor idéntico al de propiedades
      const current = activePanelRef.current;
      for (let i = 0; i < TOTAL_PANELS; i++) {
        const diff = i - current;
        if (diff === 0) {
          targetZ[i] = 0;
        } else if (diff < 0) {
          // Panel pasado — se aleja hacia atrás en Z positivo
          targetZ[i] = Math.abs(diff) * 800;
        } else {
          // Panel futuro — espera en Z negativo profundo
          targetZ[i] = diff * -2000;
        }
        smoothZ[i] = lerp(smoothZ[i], targetZ[i], 0.07);

        const el = panelRefs.current[i];
        if (!el) continue;

        const zPos = smoothZ[i];
        // Escala y opacidad proporcionales a la distancia en Z
        const distNorm = Math.abs(diff);
        const scale = diff === 0 ? 1 : diff < 0 ? 1 + distNorm * 0.05 : Math.max(0.4, 1 - distNorm * 0.6);
        const opacity = diff === 0 ? 1 : diff < 0 ? Math.max(0, 1 - distNorm * 0.9) : 0;
        const blur = diff === 0 ? 0 : diff < 0 ? distNorm * 6 : distNorm * 30;

        el.style.transform = `translate3d(0, 0, ${zPos}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = `blur(${blur}px)`;
        el.style.pointerEvents = diff === 0 ? "auto" : "none";
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const processScroll = (delta: number) => {
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current + delta * 0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) phaseRef.current = "filters";
      } else {
        if (delta < 0 && activePanelRef.current <= 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 1;
          targetHeader = 1;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => { e.preventDefault(); processScroll(e.deltaY); };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * 1.5;
      touchStartY = e.touches[0].clientY;
      processScroll(delta);
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

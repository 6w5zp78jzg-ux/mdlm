"use client";
import { useEffect, useRef } from "react";

interface Props {
  headerRef: React.RefObject<HTMLDivElement | null>;
  filtersRef: React.RefObject<HTMLDivElement | null>;
}

export function useHomeScroll({ headerRef, filtersRef }: Props) {
  const phaseRef = useRef<"header" | "filters">("header");
  const headerProgressRef = useRef(0);

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
        headerRef.current.style.transform = `translate3d(0, ${-smoothHeader * 80}px, 0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }
      if (filtersRef.current) {
        const fOp = Math.max(0, (smoothHeader - 0.4) / 0.6);
        filtersRef.current.style.opacity = String(fOp);
        filtersRef.current.style.pointerEvents = fOp > 0.3 ? "auto" : "none";
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
        if (delta < 0) {
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

"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export type Phase = "video" | "transition" | "gallery";

interface ScrollEngineProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  galleryTrackRef: React.RefObject<HTMLDivElement | null>;
  infographic1Ref: React.RefObject<HTMLDivElement | null>;
  infographic2Ref: React.RefObject<HTMLDivElement | null>;
}

export function useScrollEngine({
  videoRef,
  stageRef,
  galleryTrackRef,
  infographic1Ref,
  infographic2Ref,
}: ScrollEngineProps) {
  // --- STATE MACHINE ---
  const phaseRef = useRef<Phase>("video");
  const videoProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !stage || !galleryTrack) return;

    // Secuestro del viewport para control absoluto del lienzo (Single Canvas Paradigm)
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    gsap.set(stage, { height: "100vh" });

    // Variables para el Render Pipeline (Interpolación lineal)
    let smoothTransition = 0;
    let smoothGallery = 0;
    let targetTransition = 0;
    let targetGallery = 0;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // --- RENDER LOOP ---
    const tick = () => {
      smoothTransition = lerp(smoothTransition, targetTransition, 0.08);
      smoothGallery = lerp(smoothGallery, targetGallery, 0.08);

      // Desplazamiento del Stage (Efecto Parallax Vertical Paralelo)
      if (smoothTransition > 0.001) {
        const newHeight = 100 + smoothTransition * 50;
        const scrollY = smoothTransition * 50;
        gsap.set(stage, { y: -scrollY + "vh", height: newHeight + "vh" });
      }

      // Track de Galería Horizontal (Desplazamiento en eje X puro)
      if (smoothGallery > 0.001) {
        const maxX = galleryTrack.scrollWidth - window.innerWidth;
        gsap.set(galleryTrack, { x: -smoothGallery * maxX });
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // --- KINEMATICS & EVENT MANAGER ---
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;

      // ----------------------------------------------------
      // PHASE 1: VIDEO & SOLID ARCHITECTURAL BLOCKS
      // ----------------------------------------------------
      if (phaseRef.current === "video") {
        videoProgressRef.current = Math.max(0, Math.min(1, videoProgressRef.current + delta * 0.0006));
        if (video.duration) video.currentTime = videoProgressRef.current * video.duration;

        const p = videoProgressRef.current;

        // PANEL 1: Invasión espacial desde la izquierda y desde abajo
        // Dinámica: Se clava en la composición cortando la diagonal
        if (infographic1Ref.current) {
          const entry = Math.max(0, Math.min(1, (p - 0.15) / 0.25)); 
          
          // Vector Y: Asciende 170px hasta su anclaje
          // Vector X: Viene desde -50px hacia 0
          const yOff1 = 50 - (entry * 170); 
          const xOff1 = (1 - entry) * -50; 
          
          infographic1Ref.current.style.transform = `translate3d(${xOff1}px, ${yOff1}px, 0)`;
        }

        // PANEL 2: Contra-movimiento desde la derecha
        // Dinámica: Equilibra la narrativa visual respondiendo al primer panel
        if (infographic2Ref.current) {
          const entry2 = Math.max(0, Math.min(1, (p - 0.55) / 0.25));
          
          // Vector Y: Asciende 170px hasta su anclaje
          // Vector X: Viene desde +50px hacia 0
          const yOff2 = 50 - (entry2 * 170);
          const xOff2 = (1 - entry2) * 50; 
          
          infographic2Ref.current.style.transform = `translate3d(${xOff2}px, ${yOff2}px, 0)`;
        }

        // Trigger de transición a Fase 2
        if (videoProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 0;
          targetTransition = 0;
        }
      }

      // ----------------------------------------------------
      // PHASE 2: ELEVATOR TRANSITION
      // ----------------------------------------------------
      else if (phaseRef.current === "transition") {
        transitionProgressRef.current = Math.max(0, Math.min(1, transitionProgressRef.current + delta * 0.004));
        targetTransition = transitionProgressRef.current;

        if (transitionProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "gallery";
          galleryProgressRef.current = 0;
          targetGallery = 0;
        }
        if (transitionProgressRef.current <= 0.001 && delta < 0) {
          phaseRef.current = "video";
          videoProgressRef.current = 1;
        }
      }

      // ----------------------------------------------------
      // PHASE 3: HORIZONTAL GALLERY
      // ----------------------------------------------------
      else if (phaseRef.current === "gallery") {
        galleryProgressRef.current = Math.max(0, Math.min(1, galleryProgressRef.current + delta * 0.0006));
        targetGallery = galleryProgressRef.current;

        if (galleryProgressRef.current <= 0.001 && delta < 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 1;
          targetTransition = 1;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    // --- GARBAGE COLLECTION ---
    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
}

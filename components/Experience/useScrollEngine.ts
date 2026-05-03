"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export type Phase = "video" | "transition" | "gallery";

export function infographicOpacity(progress: number, center: number, width = 0.35): number {
  const dist = progress - center;
  if (dist < -width) return 0;
  if (dist < -width * 0.3) return Math.max(0, 1 - (Math.abs(dist) - width * 0.3) / (width * 0.7));
  if (dist < width * 0.5) return 1;
  if (dist < width) return Math.max(0, 1 - ((dist - width * 0.5) / (width * 0.5)));
  return 0;
}

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
  const phaseRef = useRef<Phase>("video");
  const videoProgressRef = useRef(0);
  const transitionProgressRef = useRef(0);
  const galleryProgressRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    const galleryTrack = galleryTrackRef.current;
    if (!video || !stage || !galleryTrack) return;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    gsap.set(stage, { height: "100vh" });

    let smoothTransition = 0;
    let smoothGallery = 0;
    let targetTransition = 0;
    let targetGallery = 0;
    let rafId: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      smoothTransition = lerp(smoothTransition, targetTransition, 0.08);
      smoothGallery = lerp(smoothGallery, targetGallery, 0.08);

      if (smoothTransition > 0.001) {
        const newHeight = 100 + smoothTransition * 50;
        const scrollY = smoothTransition * 50;
        gsap.set(stage, { y: -scrollY + "vh", height: newHeight + "vh" });
      }

      if (smoothGallery > 0.001) {
        const maxX = galleryTrack.scrollWidth - window.innerWidth;
        gsap.set(galleryTrack, { x: -smoothGallery * maxX });
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;

      if (phaseRef.current === "video") {
        videoProgressRef.current = Math.max(0, Math.min(1, videoProgressRef.current + delta * 0.0006));
        if (video.duration) video.currentTime = videoProgressRef.current * video.duration;

        const p = videoProgressRef.current;

        if (infographic1Ref.current) {
          const op1 = infographicOpacity(p, 0.25);
          const relPos = (p - 0.25) / 0.35;
          const yOff1 = relPos * -120;
          const xOff1 = (1 - Math.min(1, op1 * 2)) * -50;
          infographic1Ref.current.style.opacity = String(Math.max(0, op1));
          infographic1Ref.current.style.transform = `translate3d(${xOff1}px, ${yOff1}px, 0)`;
        }

        if (infographic2Ref.current) {
          const op2 = infographicOpacity(p, 0.65);
          const relPos2 = (p - 0.65) / 0.35;
          const yOff2 = relPos2 * -120;
          const xOff2 = (1 - Math.min(1, op2 * 2)) * 50;
          infographic2Ref.current.style.opacity = String(Math.max(0, op2));
          infographic2Ref.current.style.transform = `translate3d(${xOff2}px, ${yOff2}px, 0)`;
        }

        if (videoProgressRef.current >= 0.999 && delta > 0) {
          phaseRef.current = "transition";
          transitionProgressRef.current = 0;
          targetTransition = 0;
        }
      }

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

    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
}

"use client";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

// Scrubbing cinematico: el scroll controla currentTime del video
// en lugar de reproducirlo linealmente. Efecto de tiempo congelado.
export default function VideoBackground({ url }: { url: string }) {
  const { viewport } = useThree();
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);

  const video = useMemo(() => {
    if (typeof window === "undefined") return null;
    const v = document.createElement("video");
    v.src = url;
    v.crossOrigin = "Anonymous";
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.loop = true;
    v.load();
    v.play().catch(() => {});
    return v;
  }, [url]);

  useFrame(() => {
    if (!video || !video.duration) return;
    const videoProgress = Math.min(scroll.offset * 2, 1);
    const targetTime = videoProgress * video.duration;
    video.currentTime = THREE.MathUtils.lerp(video.currentTime, targetTime, 0.1);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <meshBasicMaterial toneMapped={false}>
        {video && (
          <videoTexture
            attach="map"
            args={[video]}
            colorSpace={THREE.SRGBColorSpace}
          />
        )}
      </meshBasicMaterial>
    </mesh>
  );
}

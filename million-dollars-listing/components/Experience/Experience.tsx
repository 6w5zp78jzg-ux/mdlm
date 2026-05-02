"use client";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import VideoBackground from "./VideoBackground";
import ScrollIndicator from "./ScrollIndicator";
import HoverInfographic from "./HoverInfographic";

const GALLERY_IMAGES = [
  "/gallery/228e370e-3d41-406d-a6aa-d72bc8cc2772.jpeg",
  "/gallery/a741c346-7225-4ccb-81fb-13b02e7f5573.jpeg",
  "/gallery/a8c5ab21-42e6-4e78-8613-43737facb1d8.jpeg",
];

export default function Experience() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", background: "black", overflow: "hidden" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        eventSource={typeof document !== "undefined" ? (document.documentElement as HTMLElement) : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <ScrollControls pages={8} damping={0.15}>

            <VideoBackground url="/videos/hero.mp4" />
            <ScrollIndicator />

            <Scroll html>
              <div style={{ width: "100vw" }}>

                <HoverInfographic page={1} align="left">
                  <span className="text-white/60 uppercase tracking-[0.5em] text-[10px] mb-4 block italic font-medium">Especificaciones</span>
                  <h2 className="font-serif text-white text-4xl md:text-6xl font-light tracking-wide mb-6">
                    12.000 m&sup2; <br />
                    <span className="text-white/70 text-3xl md:text-5xl font-sans font-thin tracking-tighter">Parcela Privada</span>
                  </h2>
                  <div className="w-12 h-[1px] bg-white/40 mb-6" />
                  <p className="text-white/90 uppercase tracking-[0.2em] text-[10px] md:text-xs leading-loose">
                    Arquitectura brutalista fundida con el paisaje mediterraneo.
                  </p>
                </HoverInfographic>

                <HoverInfographic page={2} align="right">
                  <span className="text-white/60 uppercase tracking-[0.5em] text-[10px] mb-4 block italic font-medium">Perspectiva</span>
                  <h2 className="font-serif text-white text-4xl md:text-6xl font-light tracking-wide mb-6">
                    Horizonte <br />
                    <span className="text-white/70 text-3xl md:text-5xl font-sans font-thin tracking-tighter">Sin Limites</span>
                  </h2>
                  <div className="w-12 h-[1px] bg-white/40 mb-6 ml-auto" />
                  <p className="text-white/90 uppercase tracking-[0.2em] text-[10px] md:text-xs leading-loose">
                    Piscina panoramica con reflejos de titanio.
                  </p>
                </HoverInfographic>

                {/* Galeria horizontal */}
                <section style={{
                  height: "100vh",
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                  padding: "0 4rem",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                }}>
                  {GALLERY_IMAGES.map((src, i) => (
                    <div key={i} style={{
                      flexShrink: 0,
                      width: "70vw",
                      height: "80vh",
                      scrollSnapAlign: "center",
                      overflow: "hidden",
                    }}>
                      <img
                        src={src}
                        alt={"Propiedad " + (i + 1)}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </section>

                <div style={{ height: "100vh" }} />
              </div>
            </Scroll>

          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

interface HoverInfographicProps {
  page: number;
  align?: "left" | "right" | "center";
  children: React.ReactNode;
}

// Cada bloque aparece con fade+slide coordinado con scroll.curve()
// page: indice de pagina en el scroll total (0-8)
export default function HoverInfographic({
  page,
  align = "center",
  children,
}: HoverInfographicProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!textRef.current) return;
    const baseCurve = scroll.curve(page / 8, 1.5 / 8);
    const readingFade = Math.min(1, baseCurve * 4);
    const xOffset =
      align === "left"
        ? (1 - readingFade) * -40
        : align === "right"
        ? (1 - readingFade) * 40
        : 0;
    const yOffset = 20 - readingFade * 20;
    textRef.current.style.opacity = readingFade.toString();
    textRef.current.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
  });

  const alignmentClass =
    align === "left"
      ? "items-start text-left"
      : align === "right"
      ? "items-end text-right"
      : "items-center text-center";

  return (
    <section
      className={"h-screen w-screen flex flex-col justify-center px-6 md:px-24 " + alignmentClass}
    >
      <div className="bg-black/[0.09] p-8 md:p-16 border border-white/10 max-w-2xl rounded-sm">
        <div ref={textRef} className="opacity-0">
          {children}
        </div>
      </div>
    </section>
  );
}

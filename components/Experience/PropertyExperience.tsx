"use client";
import { useRef } from "react";
import { Property } from "@/types/property";
import { useScrollEngine } from "./useScrollEngine";
import Navbar from "./Navbar";
import ScrollIndicator from "./ScrollIndicator";
import VideoSection from "./VideoSection";
import GallerySection from "./GallerySection";

interface Props {
  property: Property;
  locale: string;
}

export default function PropertyExperience({ property, locale }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const infographic1Ref = useRef<HTMLDivElement>(null);
  const infographic2Ref = useRef<HTMLDivElement>(null);

  const lang = locale as "es" | "en" | "fr" | "ru";
  const inf1 = property.infografias?.[0] || null;
  const inf2 = property.infografias?.[1] || null;

  useScrollEngine({
    videoRef,
    stageRef,
    galleryTrackRef,
    infographic1Ref,
    infographic2Ref,
  });

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
      <Navbar locale={locale} />
      <ScrollIndicator />
      <div ref={stageRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", willChange: "height, transform" }}>
        <VideoSection
          videoRef={videoRef}
          infographic1Ref={infographic1Ref}
          infographic2Ref={infographic2Ref}
          videoUrl={property.video_url}
          inf1={inf1}
          inf2={inf2}
        />
        <GallerySection
          galleryTrackRef={galleryTrackRef}
          images={property.galeria_urls}
          titulo={property.titulo[lang]}
          ubicacion={property.ubicacion}
        />
      </div>
    </div>
  );
}

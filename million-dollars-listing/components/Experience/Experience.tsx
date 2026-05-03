"use client";
import { useRef } from "react";
import { useScrollEngine } from "./useScrollEngine";
import Navbar from "./Navbar";
import ScrollIndicator from "./ScrollIndicator";
import VideoSection from "./VideoSection";
import GallerySection from "./GallerySection";

export default function Experience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const infographic1Ref = useRef<HTMLDivElement>(null);
  const infographic2Ref = useRef<HTMLDivElement>(null);

  useScrollEngine({
    videoRef,
    stageRef,
    galleryTrackRef,
    infographic1Ref,
    infographic2Ref,
  });

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
      <Navbar />
      <ScrollIndicator />
      <div ref={stageRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", willChange: "height, transform" }}>
        <VideoSection
          videoRef={videoRef}
          infographic1Ref={infographic1Ref}
          infographic2Ref={infographic2Ref}
        />
        <GallerySection galleryTrackRef={galleryTrackRef} images={["/gallery/228e370e-3d41-406d-a6aa-d72bc8cc2772.jpeg","/gallery/a741c346-7225-4ccb-81fb-13b02e7f5573.jpeg","/gallery/a8c5ab21-42e6-4e78-8613-43737facb1d8.jpeg"]} />
      </div>
    </div>
  );
}

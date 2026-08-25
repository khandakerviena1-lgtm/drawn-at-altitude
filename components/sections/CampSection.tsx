"use client";

// Framer "CampSection": the camp as constant, not a hotel gallery.
// Real footage (v05, glass pavilion over the river) plays only while in view.
import { useEffect, useRef } from "react";
import { camp } from "@/lib/content/retreat";
import {
  ChapterTitle,
  BodyEditorial,
  MetaLabel,
} from "@/components/ui/Typography";

export default function CampSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section className="campSection" aria-label="The Indus River Camp">
      <ChapterTitle>{camp.heading}</ChapterTitle>
      <BodyEditorial className="campSupport">{camp.support}</BodyEditorial>
      <video
        ref={videoRef}
        className="campMedia"
        src="/video/v05-window-mountains.mp4"
        poster="/video-posters/v05-window-mountains.webp"
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={camp.mediaAlt}
      />
      <ul className="campDetails">
        {camp.details.map((d) => (
          <li key={d}>
            <MetaLabel as="span">{d}</MetaLabel>
          </li>
        ))}
      </ul>
    </section>
  );
}

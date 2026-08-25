"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { useScrubbedVideo } from "@/lib/animation/useScrubbedVideo";
import { folioOpening } from "@/lib/content/retreat";

// WHERE THE COLOUR COMES FROM — the beat that opens the Folio.
//
// Ground madder pigment warms and desaturates until it is the sand of the
// page, the powder becomes a wash sitting in paper fibre, and the camera pulls
// back to the whole plate. It used to sit at the tail of the opening film,
// where it was the last thing seen before the page began; it belongs here, at
// the head of the section it is about.
//
// Scrubbed like the hero, and short: 10.2s over 300vh. The visitor arrives at
// the Folio already inside its material.

const FALLBACK_DURATION = 10.23;

export default function FolioOpening() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: f } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useScrubbedVideo(videoRef, f, FALLBACK_DURATION);

  const kickerOpacity = useScrollMapped(
    f,
    [0.03, 0.1, 0.62, 0.72],
    [0, 1, 1, 0],
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced && mounted) {
    return (
      <section
        ref={containerRef}
        className="folioOpening"
        aria-label="Colour, and where it comes from"
      >
        <div className="heroSticky">
          <img
            className="heroReel"
            src="/video-posters/folio-open.webp"
            alt={folioOpening.alt}
          />
          <p className="typoLabel folioOpeningKicker">{folioOpening.kicker}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="folioOpening"
      aria-label="Colour, and where it comes from"
    >
      <div className="heroSticky">
        <video
          ref={videoRef}
          className="heroReel"
          src="/video/folio-open.mp4"
          poster="/video-posters/folio-open.webp"
          muted
          playsInline
          preload="auto"
          aria-label={folioOpening.alt}
        />
        <motion.p
          className="typoLabel folioOpeningKicker"
          style={{ opacity: kickerOpacity }}
        >
          {folioOpening.kicker}
        </motion.p>
      </div>
    </section>
  );
}

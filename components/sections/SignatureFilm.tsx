"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { useScrubbedVideo } from "@/lib/animation/useScrubbedVideo";
import { signature } from "@/lib/content/retreat";

// SIGNATURE SCENE — REALITY + SKETCHBOOK, shown rather than simulated.
//
// This replaces the composited version (`SignatureScene`, kept alongside),
// which built the moment out of a CSS book, a generated drawing and a masked
// colour sweep. It had to simulate the mechanic because no asset showed it.
// The client's concept images do show it — three times — so the scene is now
// the thing itself:
//
//   the page, and the room it was drawn in
//   → up, and out through the open window
//   → the river, then its page
//   → the plant, then its page
//   → and then the finished book, leafed through
//
// Scrubbed, not played: the visitor moves between the world and the page at
// their own pace, and stops wherever the two align. That is the whole subject
// of the retreat, handed to the pointer.
//
// Every image here is fabricated concept art cleared for PoC use, never
// Anastasiia's hand — see ASSET-MANIFEST. Two pans carry hard limits recorded
// there: Ref3's must stop above its "kyrgyzstan" annotation, and the KEY
// PLACES spread used is the clean twin, not the one with surfboards.

const FALLBACK_DURATION = 23.83;

export default function SignatureFilm() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: q } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useScrubbedVideo(videoRef, q, FALLBACK_DURATION);

  // The kicker states the claim once, early, then gets out of the way: the
  // sequence argues it better than the words do.
  const kickerOpacity = useScrollMapped(
    q,
    [0.01, 0.06, 0.15, 0.2],
    [0, 1, 1, 0],
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced && mounted) {
    return (
      <section
        ref={containerRef}
        className="signature isFilm"
        aria-label="The valley, observed and drawn"
      >
        <div className="signatureSticky">
          <img
            className="signatureFilm isArtwork"
            src="/video-posters/signature-chain.webp"
            alt="An open sketchbook held against the bank of the Indus, the three wicker chairs on the page drawn from the three chairs standing behind it"
          />
          <p className="typoLabel signatureKicker">{signature.kicker}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="signature isFilm"
      aria-label="The valley, observed and drawn"
    >
      <div className="signatureSticky">
        <video
          ref={videoRef}
          className="signatureFilm isArtwork"
          src="/video/signature-chain.mp4"
          poster="/video-posters/signature-chain.webp"
          muted
          playsInline
          preload="auto"
          aria-label="Moved through by scrolling: a sketchbook page in a room at the camp, rising to the window and out over the Indus; the riverside chairs and the same chairs drawn; sea buckthorn picked by hand and the same branch drawn; then the finished sketchbook, its pages turning"
        />
        <motion.p
          className="typoLabel signatureKicker"
          style={{ opacity: kickerOpacity }}
        >
          {signature.kicker}
        </motion.p>
      </div>
    </section>
  );
}

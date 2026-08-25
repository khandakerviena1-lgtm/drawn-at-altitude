"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { signature } from "@/lib/content/retreat";

// SIGNATURE SCENE — REALITY + SKETCHBOOK.
//
// The move the whole site turns on: the real room at The Indus River Camp
// plays behind, a sketchbook is held in the lower frame, and inside it the
// same view is drawn — real mountain against drawn mountain, real river
// against a grey-green wash, real window against ink. Modelled on Ref0 (the
// authentic Seoul frame: book held near-horizontal, the drawing echoing what
// is actually behind it) and Ref4 (the Ladakh room concept).
//
// The artwork is a GENERATED PLACEHOLDER derived from the v05 frame — see
// ASSET-MANIFEST. It is composited, never presented as Anastasiia's hand.
//
// Two techniques carry the illusion:
//
// 1. `mix-blend-mode: multiply` on the artwork over our own paper. The
//    generated file has cream paper baked in; multiply drops that paper to
//    nothing and leaves only ink and pigment, so the marks sit *on* our page
//    instead of being a photograph of someone else's page pasted onto it.
// 2. A soft-edged mask sweeping left→right, so the drawing arrives the way it
//    was made — construction first, then colour following the hand across the
//    page — rather than cross-fading in as a finished object.
//
// Scroll ranges (holds are deliberate — see MOTION-SYSTEM.md):
//   .00–.08  film alone, the observation line
//   .08–.20  the book is raised into frame
//   .20–.26  HOLD — a blank page against the real view
//   .26–.40  graphite construction settles onto the page
//   .36–.72  colour sweeps across, following the hand
//   .70–.80  the annotation is written
//   .80–.90  alignment: the book lifts, the film gives way to the page
//   .90–1.0  HOLD
export default function SignatureScene() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: q } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const kickerOpacity = useScrollMapped(q, [0.02, 0.08, 0.16, 0.22], [0, 1, 1, 0]);

  // The book is raised into frame held at an angle, worked on, then turned
  // flat to camera, then lowered away again. Measured off the Seoul reel.
  const bookY = useScrollMapped(
    q,
    [0.06, 0.18, 0.68, 0.82, 0.9, 1.0],
    ["44vh", "7vh", "7vh", "0vh", "0vh", "66vh"],
  );
  const bookScale = useScrollMapped(
    q,
    [0.06, 0.18, 0.68, 0.82, 0.9, 1.0],
    [0.86, 0.97, 0.97, 1.07, 1.07, 0.99],
  );
  // The tilt is the whole tell: held obliquely while it is being worked on,
  // turned to face the viewer only once there is something to show.
  const bookTiltX = useScrollMapped(
    q,
    [0.06, 0.18, 0.68, 0.82, 0.9, 1.0],
    [54, 45, 45, 1, 1, 20],
  );
  const bookRoll = useScrollMapped(
    q,
    [0.06, 0.18, 0.68, 0.82],
    [-4.5, -2.6, -2.6, 0],
  );
  const bookOpacity = useScrollMapped(q, [0.06, 0.13], [0, 1]);

  // Construction pass, then colour following the hand across the page.
  const graphiteOpacity = useScrollMapped(q, [0.24, 0.38], [0, 0.5]);
  const colourSweep = useScrollMapped(q, [0.34, 0.66], [-12, 118]);
  const annotationOpacity = useScrollMapped(q, [0.64, 0.72], [0, 1]);

  // The film gives way while the page is presented — and comes back, at full
  // strength, as the book drops out of frame. That return is the payoff of the
  // Seoul reel: the drawing first, then the place it came from.
  const filmSaturation = useScrollMapped(
    q,
    [0.68, 0.82, 0.9, 0.99],
    [1, 0.5, 0.5, 1],
  );
  const filmDim = useScrollMapped(q, [0.68, 0.82, 0.9, 0.99], [0, 0.3, 0.3, 0]);
  // Stacks on top of the shared grade rather than replacing it.
  const filmFilter = useMotionTemplate`var(--film-grade) saturate(${filmSaturation})`;

  useEffect(() => {
    const video = videoRef.current;
    const el = containerRef.current;
    if (!video || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const art = "/sketch/s05-signature-window-GENERATED-PLACEHOLDER.jpg";

  // Both branches share this markup; only the driving values differ.
  const page = (
    <>
      <div className="signaturePaper" />
      <div className="signatureGutter" />
    </>
  );

  if (reduced && mounted) {
    return (
      <section
        ref={containerRef}
        className="signature"
        aria-label="The valley, observed and drawn"
      >
        <div className="signatureSticky">
          <img
            className="signatureFilm"
            src="/video-posters/v05-window-mountains.webp"
            alt="A room at The Indus River Camp looking through its window across the Indus to the mountains"
          />
          <div className="signatureFilmDim" style={{ opacity: 0.34 }} />
          <p className="typoLabel signatureKicker">{signature.kicker}</p>
          <div className="signatureBook">
            <div className="signatureSpread">
              {page}
              <img className="sketchArt" src={art} alt={signature.artAlt} />
              <p className="hand signatureAnnotation">{signature.annotation}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="signature"
      aria-label="The valley, observed and drawn"
    >
      <div className="signatureSticky">
        <motion.video
          ref={videoRef}
          className="signatureFilm"
          src="/video/v05-window-mountains.mp4"
          poster="/video-posters/v05-window-mountains.webp"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Film of a room at The Indus River Camp looking through its window across the Indus to the mountains"
          style={{ filter: filmFilter }}
        />
        <motion.div className="signatureFilmDim" style={{ opacity: filmDim }} />

        <motion.p
          className="typoLabel signatureKicker"
          style={{ opacity: kickerOpacity }}
        >
          {signature.kicker}
        </motion.p>

        <motion.div
          className="signatureBook"
          style={{
            y: bookY,
            scale: bookScale,
            rotate: bookRoll,
            opacity: bookOpacity,
          }}
        >
          <motion.div className="signatureCast" style={{ opacity: bookOpacity }} />
          <motion.div className="signatureSpread" style={{ rotateX: bookTiltX }}>
            {page}
            {/* Construction pass — the searching, before the colour. */}
            <motion.img
              className="sketchArt sketchGraphite"
              src={art}
              alt=""
              aria-hidden
              style={{ opacity: graphiteOpacity }}
            />
            {/* Colour, arriving across the page behind a soft wet edge. */}
            <motion.img
              className="sketchArt sketchColour"
              src={art}
              alt={signature.artAlt}
              style={{ ["--sweep" as string]: colourSweep }}
            />
            <motion.p
              className="hand signatureAnnotation"
              style={{ opacity: annotationOpacity }}
            >
              {signature.annotation}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

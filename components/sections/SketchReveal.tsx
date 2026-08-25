"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useCinematicScroll } from "@/lib/animation/useCinematicScroll";
import { CAMERA_EASE, useScrollMapped } from "@/lib/animation/useScrollMapped";
import { sketchReveal } from "@/lib/content/retreat";

// ONE PAGE, FROM NOTHING — the drawing makes itself.
//
// This is the stand-in for the process film in Video Inspiration 2 (a real
// hand, a real brush, one continuous overhead take). That film cannot be
// edited into ours: its sketch is not a layer but a physical event, with the
// hand crossing over it for most of 3,540 frames — and it is someone else's
// footage. So this reaches the same place from the other end.
//
// The trick is that all three states come out of ONE file. The colour plate
// is divided by a heavy blur of itself, which keeps fine dark strokes and
// drops broad wash tone, leaving the drawing's own linework; that is emitted
// twice, once faint and grey (graphite) and once dark (ink). Because every
// layer is derived from the same image they register perfectly — which is
// exactly what the ten method panels could not do, being ten separate
// drawings rather than one drawing recorded ten times.
//
// The order is the method sheet's own: big shapes lightly, then the line
// commits, then wet-on-wet from the sky down. So the two line passes sweep
// across the page the way a hand works, and the colour arrives top-down,
// sky and far mountains first.
//
// HONEST LIMIT, and it should not be quietly forgotten: there is no hand and
// no brush here, and the plate underneath is fabricated concept art, not
// Anastasiia's. It cannot ship publicly as her work. The real fix is 20
// minutes of overhead phone footage of her drawing one page.

const FEATHER = 22; // % of the sweep that is soft edge rather than hard line

type Stage = { at: number; to: number; line: string; note: string };

function RevealCaption({ p, stage }: { p: MotionValue<number>; stage: Stage }) {
  const { at, to, line, note } = stage;
  const f = 0.018;
  const opacity = useScrollMapped(p, [at, at + f, to - f, to], [0, 1, 1, 0]);
  const y = useScrollMapped(p, [at, at + f * 2], [12, 0]);
  return (
    <motion.div className="revealCaption" style={{ opacity }}>
      <motion.p className="serif revealCaptionLine" style={{ y }}>
        {line}
      </motion.p>
      <p className="hand revealCaptionNote">{note}</p>
    </motion.div>
  );
}

export default function SketchReveal() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  // Damped, not raw: see useCinematicScroll.
  const p = useCinematicScroll(containerRef);

  // Two line passes sweeping across the page, then colour falling down it.
  const pencilEdge = useScrollMapped(p, [0.08, 0.3], [-FEATHER, 100], CAMERA_EASE);
  const inkEdge = useScrollMapped(p, [0.3, 0.56], [-FEATHER, 100], CAMERA_EASE);
  const washEdge = useScrollMapped(p, [0.56, 0.86], [-FEATHER, 100], CAMERA_EASE);

  const pencilMask = useMotionTemplate`linear-gradient(100deg, #000 ${pencilEdge}%, transparent calc(${pencilEdge}% + ${FEATHER}%))`;
  const inkMask = useMotionTemplate`linear-gradient(100deg, #000 ${inkEdge}%, transparent calc(${inkEdge}% + ${FEATHER}%))`;
  // 172°, not 180°: a wash laid by hand does not arrive on a spirit level.
  const washMask = useMotionTemplate`linear-gradient(172deg, #000 ${washEdge}%, transparent calc(${washEdge}% + ${FEATHER}%))`;

  // The graphite is meant to be buried, not erased: once the ink is down it
  // fades to a ghost, the way an under-drawing survives under a finished page.
  const pencilOpacity = useScrollMapped(p, [0.3, 0.56], [1, 0.34]);
  const kickerOpacity = useScrollMapped(p, [0.02, 0.07, 0.9, 0.96], [0, 1, 1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced && mounted) {
    return (
      <section className="reveal isStill" aria-label={sketchReveal.kicker}>
        <div className="revealStill">
          <p className="typoEyebrow">{sketchReveal.kicker}</p>
          <img
            className="revealStillImage"
            src="/img/room-plate.webp"
            alt={sketchReveal.alt}
          />
          {sketchReveal.stages.map((s) => (
            <p className="serif revealCaptionLine isStatic" key={s.at}>
              {s.line}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="reveal"
      aria-label={sketchReveal.kicker}
    >
      <div className="revealSticky">
        <motion.p
          className="typoEyebrow revealKicker"
          style={{ opacity: kickerOpacity }}
        >
          {sketchReveal.kicker}
        </motion.p>

        <div className="revealPage">
          <div className="observedGrain" />

          <motion.img
            className="revealLayer"
            src="/img/room-line-pencil.webp"
            alt=""
            aria-hidden
            style={{
              opacity: pencilOpacity,
              maskImage: pencilMask,
              WebkitMaskImage: pencilMask,
            }}
          />
          <motion.img
            className="revealLayer"
            src="/img/room-line-ink.webp"
            alt=""
            aria-hidden
            style={{ maskImage: inkMask, WebkitMaskImage: inkMask }}
          />
          {/* The finished page. Alt lives here: this is the drawing. */}
          <motion.img
            className="revealLayer"
            src="/img/room-plate.webp"
            alt={sketchReveal.alt}
            style={{ maskImage: washMask, WebkitMaskImage: washMask }}
          />
        </div>

        <div className="revealCaptionSlot">
          {sketchReveal.stages.map((s) => (
            <RevealCaption key={s.at} p={p} stage={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion } from "motion/react";
import { useAutoplayProgress } from "@/lib/animation/useAutoplayProgress";
import { CAMERA_EASE, useScrollMapped } from "@/lib/animation/useScrollMapped";
import { camp, morph } from "@/lib/content/retreat";

// THE SAME WINDOW, TWICE — one scene with two visual states.
//
// Built to the note that everything else on this page got wrong: these are
// not two sections that hand over to each other, and not two components
// crossfading. There is ONE sticky viewport, ONE camera transform, and the
// two media are layers underneath it. The world changes under the camera
// instead of the page cutting from one block to the next.
//
// The pair is `source/real-drawn-pairs/camp-room-window-{drawn,photo}`: the
// room guests actually sleep in, drawn and photographed. Same curtains, same
// wall of windows, same two wicker chairs on the grass, same river, same
// ridge — which is what lets the annotation mean what it says literally.
//
// FOURTH PAIR, and the earlier three are the reason this one is measured
// rather than eyeballed:
//   1. An earlier version of this room (9D489664 / Ref4) — same room, but the
//      drawn mullions did not fall where the real ones do, so a painted
//      window frame crossed empty air in the photograph. Refused on sight.
//   2. The riverside chairs (both halves of Ref1) — seamless but tiny:
//      771×514 and 633×421, which capped the push at 1.55×.
//   3. The yaks — no straight edges at all and large, so the safest of the
//      four; kept in source/ and a one-line swap away.
//
// Why this one registers where (1) did not, and it is not luck: the vertical
// members were measured, not judged. First pass came out 1.72% off and the
// error GREW toward the right — a systematic drift, i.e. a 3.5% horizontal
// scale error, not a placement error. Corrected, it reads 0.79% with the
// drift gone and only scatter left, which is the artist's own licence and is
// as good as this ever gets. Horizontal members land near 0.6%.
//
// The two crops therefore have DIFFERENT aspect ratios on purpose. The
// originals are 4:3 and 8:5 and the drawn window is about 9% taller, so no
// uniform scale can satisfy both axes; the anisotropy is baked into the crop
// boxes and the output aspect is the geometric mean of the two, which splits
// the correction evenly instead of distorting one plate alone.
//
// Nothing here is a hard cut. The two layers overlap for 30% of the section:
// the watercolour is still at 0.7 when the photograph is already at 0.3, and
// they pass each other while the camera keeps moving in the same direction at
// the same rate. Around 45% you should not be able to say which one you are
// looking at.
//
// The camera never changes direction, never stops and never hands over. It
// pushes from 1 to 2 through the whole section on one origin, so every layer
// shares the same movement by construction rather than by matching numbers.
//
// This section REPLACES the old CampSection — it is "One place to return to",
// so it carries that chapter's heading, its line, and its details list. The
// camp used to be a heading over a loop of the glass dining pavilion; it is
// the room itself now, drawn and then real.
//
// RESOLUTION: the photograph is 1391×1138 in its registered crop and ships at
// 1200, so it is downscaled rather than stretched. The push stops at 1.9
// because the two wicker chairs are the one place the plates still disagree,
// and every extra bit of zoom doubles that — the camera aims past them, at
// the window and the river.

const ZOOM_END = 1.9;

export default function WindowMorph() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  // The scene plays itself once it is on screen, rather than being scrubbed.
  // Same value shape as the scroll version, so everything below is unchanged.
  const p = useAutoplayProgress(containerRef, 9);

  // ONE camera. Every layer rides this; none has a transform of its own.
  //   0.00–0.15  almost still, a breath of a push
  //   0.15–0.35  into the page; the paper and the book edge leave frame
  //   0.35–0.50  close; pigment becomes texture
  //   0.50–0.65  the two media pass each other, camera unchanged
  //   0.65–0.85  fully real, still travelling
  //   0.85–1.00  slowing to a stop
  const scale = useScrollMapped(
    p,
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [1, 1.05, 1.42, 1.62, 1.76, 1.85, ZOOM_END],
    CAMERA_EASE,
  );
  // A slow lateral drift, so the last third still reads as travelling once the
  // push has flattened out. The zoom cannot keep climbing there — the real
  // plate is already at the limit of what it has — but the camera can keep
  // moving sideways for nothing, which is what stops the ending going static.
  const driftX = useScrollMapped(
    p,
    [0.45, 1],
    ["0%", "-3.2%"],
    CAMERA_EASE,
  );

  // The watercolour. Holds, softens as we get too close for paint to resolve,
  // then hands over — at 0.5 it is still at 0.7, which is what stops the
  // handover reading as a cut.
  const wcOpacity = useScrollMapped(p, [0.35, 0.5, 0.65], [1, 0.7, 0]);
  // Kept low deliberately. Blur hides the residual misregistration between the
  // two plates, and at 2× that mismatch is doubled — but blurring both layers
  // at once turns the handover to mush, which is worse than the seam it hides.
  const wcBlur = useScrollMapped(p, [0.3, 0.5, 0.65], [0, 0.9, 2.4]);
  const wcSaturate = useScrollMapped(p, [0.35, 0.65], [1, 1.25]);
  const wcFilter = useMotionTemplate`blur(${wcBlur}px) saturate(${wcSaturate})`;

  // The photograph, arriving from underneath: out of focus and washed out at
  // first, so it reads as the same paper resolving rather than as a new image
  // being laid on top.
  const realOpacity = useScrollMapped(p, [0.35, 0.5, 0.65], [0, 0.3, 1]);
  const realBlur = useScrollMapped(p, [0.35, 0.5, 0.66], [6, 1.7, 0]);
  const realSat = useScrollMapped(p, [0.35, 0.5, 0.72], [0.55, 0.78, 1]);
  const realContrast = useScrollMapped(p, [0.35, 0.72], [0.86, 1]);
  const realFilter = useMotionTemplate`blur(${realBlur}px) saturate(${realSat}) contrast(${realContrast})`;

  // Paper. The fibre rises as the camera closes on the pigment, then goes with
  // the watercolour — it is the last thing that says "this is a page".
  const grainOpacity = useScrollMapped(
    p,
    [0.2, 0.42, 0.55, 0.66],
    [0.28, 0.72, 0.5, 0],
  );
  // The sketchbook's own edge and mat, which simply leave the frame as the
  // camera moves into the page rather than fading on a timer.
  const matOpacity = useScrollMapped(p, [0.16, 0.32], [1, 0]);

  const kickerOpacity = useScrollMapped(p, [0.02, 0.08, 0.3, 0.4], [0, 1, 1, 0]);
  const noteOpacity = useScrollMapped(p, [0.86, 0.93], [0, 1]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const details = (
    <ul className="campDetails morphDetails">
      {camp.details.map((d) => (
        <li key={d}>
          <span className="typoLabel">{d}</span>
        </li>
      ))}
    </ul>
  );

  if (reduced && mounted) {
    return (
      <section className="morph isStill" aria-label={camp.heading}>
        <div className="morphStill">
          <h2 className="typoChapter">{camp.heading}</h2>
          <p className="typoBody">{camp.support}</p>
          <img src="/img/morph-wc.webp" alt={morph.altWc} />
          <img src="/img/morph-real.webp" alt={morph.altReal} />
          <p className="serif morphAnnotation isStatic">{morph.annotation}</p>
          {details}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="morph" aria-label={camp.heading}>
      <div className="morphSticky">
        {/* This is the camp chapter now, so it carries its heading and its
            line, and they leave as the camera starts moving. */}
        <motion.div className="morphTitle" style={{ opacity: kickerOpacity }}>
          <h2 className="typoChapter">{camp.heading}</h2>
          <p className="typoBody morphSupport">{camp.support}</p>
        </motion.div>

        <div className="morphViewport">
          {/* The one camera. Nothing below it moves on its own. */}
          <motion.div className="morphCamera" style={{ scale, x: driftX }}>
            <motion.div className="morphMat" style={{ opacity: matOpacity }} />

            <motion.img
              className="morphLayer"
              src="/img/morph-real.webp"
              alt={morph.altReal}
              style={{ opacity: realOpacity, filter: realFilter }}
            />
            <motion.img
              className="morphLayer isWc"
              src="/img/morph-wc.webp"
              alt={morph.altWc}
              style={{ opacity: wcOpacity, filter: wcFilter }}
            />
            <motion.div
              className="morphGrain"
              style={{ opacity: grainOpacity }}
              aria-hidden
            />
          </motion.div>
        </div>

        <motion.div className="morphNote" style={{ opacity: noteOpacity }}>
          <p className="serif morphAnnotation">{morph.annotation}</p>
          <p className="hand morphNoteLine">{morph.note}</p>
          {details}
        </motion.div>
      </div>
    </section>
  );
}

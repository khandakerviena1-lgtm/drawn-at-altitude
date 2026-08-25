"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { EditorialTitle, BodyEditorial } from "@/components/ui/Typography";
import {
  FOLIO_ARCH_CONSTRUCTION,
  FOLIO_ARCH_DETAIL,
  FOLIO_ARCH_PRIMARY,
  FOLIO_BERRIES,
  FOLIO_BOTANY_LEAVES,
  FOLIO_BOTANY_STEM,
  FOLIO_RIDGE,
  FOLIO_RIDGE_WASH,
  FOLIO_RIVER,
  FOLIO_RIVER_WASH,
  FOLIO_SWATCHES,
  FOLIO_VIEWBOX,
} from "@/components/sketch/folioPaths";
import { folio } from "@/lib/content/retreat";

// THE LADAKH FOLIO — the climax, and the longest scene on screen.
//
// Nine days of looking arrive as one plate, assembled in the order the work
// was actually done: bare paper → graphite construction → ink → pigment →
// botany → the hand writing on it → silence. The brief asks for a brutal
// slowdown here, so this is 520vh for one composition, and it ends on a long
// hold where nothing moves at all.
//
// Everything is a live layer — paper, SVG, wash, notes — never a flattened
// image. That is what lets it assemble at all, and it is the form the real
// artwork has to drop into (ASSET-MANIFEST).
//
// Scroll ranges:
//   .00–.10  the empty plate arrives
//   .10–.18  HOLD — bare ivory, the whole point of the scene's patience
//   .18–.30  graphite construction
//   .28–.46  ink: architecture, then ridge and river
//   .44–.58  pigment band and the washes under ridge and river
//   .56–.70  botany: stem, leaves, then berries as a stagger
//   .68–.80  the handwritten notes
//   .80–1.0  HOLD — visual silence
const DRAW = { pathLength: 1 } as const;

export default function FolioSection() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress: f } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const plateOpacity = useScrollMapped(f, [0.02, 0.1], [0, 1]);
  const plateY = useScrollMapped(f, [0.02, 0.12], ["5vh", "0vh"]);

  // Ink is drawn, not faded: stroke-dashoffset via pathLength.
  const construction = useScrollMapped(f, [0.18, 0.3], [0, 1]);
  const archInk = useScrollMapped(f, [0.28, 0.4], [0, 1]);
  const archDetail = useScrollMapped(f, [0.38, 0.46], [0, 1]);
  const ridgeInk = useScrollMapped(f, [0.36, 0.46], [0, 1]);
  const riverInk = useScrollMapped(f, [0.42, 0.5], [0, 1]);

  // Pigment arrives as opacity — paint lands, it is not drawn.
  const washOpacity = useScrollMapped(f, [0.44, 0.56], [0, 0.82]);
  const swatchOpacity = useScrollMapped(f, [0.48, 0.58], [0, 0.88]);

  const stemInk = useScrollMapped(f, [0.56, 0.64], [0, 1]);
  const leafOpacity = useScrollMapped(f, [0.62, 0.68], [0, 0.9]);
  const berryOpacity = useScrollMapped(f, [0.64, 0.72], [0, 1]);

  const notesOpacity = useScrollMapped(f, [0.68, 0.8], [0, 1]);
  const labelOpacity = useScrollMapped(f, [0.72, 0.84], [0, 1]);

  const ink = "var(--ink)";

  return (
    <section
      ref={containerRef}
      className="folio"
      aria-label={folio.heading}
      id="folio"
    >
      <div className="folioSticky">
        <div className="folioHead">
          <EditorialTitle as="h2">{folio.heading}</EditorialTitle>
          <BodyEditorial className="folioSupport">{folio.support}</BodyEditorial>
        </div>

        <motion.div
          className="folioPlate"
          style={
            reduced ? undefined : { opacity: plateOpacity, y: plateY }
          }
          role="img"
          aria-label="The Ladakh Folio: a monastery line study, the Indus ridge and river in pigment, a sea buckthorn branch and handwritten field notes, assembled on one ivory plate"
        >
          <svg
            className="folioArt"
            viewBox={FOLIO_VIEWBOX}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {/* Pigment sits under the ink, the way it does on paper. */}
            <motion.g style={reduced ? undefined : { opacity: washOpacity }}>
              <path d={FOLIO_RIDGE_WASH} fill="var(--ochre)" opacity="0.5" />
              <path d={FOLIO_RIVER_WASH} fill="var(--indus)" opacity="0.55" />
            </motion.g>

            <motion.g style={reduced ? undefined : { opacity: swatchOpacity }}>
              {FOLIO_SWATCHES.map((s, i) => (
                <path key={i} d={s.d} fill={s.fill} opacity="0.62" />
              ))}
            </motion.g>

            {/* Graphite construction — left open, never closed up. */}
            <motion.path
              d={FOLIO_ARCH_CONSTRUCTION}
              fill="none"
              stroke={ink}
              strokeOpacity="0.24"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={DRAW}
              style={reduced ? undefined : { pathLength: construction }}
            />

            {/* Ink */}
            <motion.path
              d={FOLIO_ARCH_PRIMARY}
              fill="none"
              stroke={ink}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={DRAW}
              style={reduced ? undefined : { pathLength: archInk }}
            />
            <motion.path
              d={FOLIO_ARCH_DETAIL}
              fill="none"
              stroke={ink}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={DRAW}
              style={reduced ? undefined : { pathLength: archDetail }}
            />
            <motion.path
              d={FOLIO_RIDGE}
              fill="none"
              stroke={ink}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={DRAW}
              style={reduced ? undefined : { pathLength: ridgeInk }}
            />
            <motion.path
              d={FOLIO_RIVER}
              fill="none"
              stroke={ink}
              strokeWidth="1.8"
              strokeLinecap="round"
              initial={DRAW}
              style={reduced ? undefined : { pathLength: riverInk }}
            />

            {/* Botany */}
            <motion.path
              d={FOLIO_BOTANY_STEM}
              fill="none"
              stroke={ink}
              strokeWidth="1.9"
              strokeLinecap="round"
              initial={DRAW}
              style={reduced ? undefined : { pathLength: stemInk }}
            />
            <motion.path
              d={FOLIO_BOTANY_LEAVES}
              fill="var(--herbal)"
              stroke={ink}
              strokeWidth="0.9"
              style={reduced ? undefined : { opacity: leafOpacity }}
            />
            <motion.g style={reduced ? undefined : { opacity: berryOpacity }}>
              {FOLIO_BERRIES.map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={4.6}
                  fill="var(--apricot)"
                  stroke={ink}
                  strokeWidth="0.7"
                  opacity={0.92}
                />
              ))}
            </motion.g>
          </svg>

          {/* The hand writing on the plate, last. */}
          <motion.div
            className="folioNotes"
            style={reduced ? undefined : { opacity: notesOpacity }}
          >
            <p className="hand folioNote folioNoteArch">{folio.notes.arch}</p>
            <p className="hand folioNote folioNotePigment">
              {folio.notes.pigment}
            </p>
            <p className="hand folioNote folioNoteBotany">
              {folio.notes.botany}
            </p>
          </motion.div>

          <motion.div
            className="folioCorners"
            style={reduced ? undefined : { opacity: labelOpacity }}
          >
            {folio.labels.map((l) => (
              <p key={l} className="typoLabel">
                {l}
              </p>
            ))}
          </motion.div>
        </motion.div>

        <p className="typoLabel folioPlaceholder">{folio.placeholder}</p>
      </div>
    </section>
  );
}

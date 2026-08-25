"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { pillars } from "@/lib/content/retreat";
import {
  ChapterTitle,
  SectionEyebrow,
  BodyEditorial,
  MetaLabel,
} from "@/components/ui/Typography";
import {
  FOLIO_ARCH_CONSTRUCTION,
  FOLIO_ARCH_DETAIL,
  FOLIO_ARCH_PRIMARY,
  FOLIO_BERRIES,
  FOLIO_BOTANY_LEAVES,
  FOLIO_BOTANY_STEM,
  FOLIO_SWATCHES,
} from "@/components/sketch/folioPaths";

// Four chapter rows, each a small world rather than a card in a list: the
// footage is the subject, and the study being made *from* that subject is
// drawn over it as the row comes up.
//
// The geometry is deliberately the Folio's own, cropped per pillar via the
// viewBox. That is the point — each pillar is where one study gets made, and
// the Folio at the end of the page is where the four are assembled. Reusing
// the literal paths turns the climax from a handsome plate into a
// recapitulation of things the visitor has already watched being drawn.
//
// Per-row `useScroll` with a viewport-relative offset, so each world animates
// on its own arrival instead of being slaved to one section-wide progress.

type StudyKind = "line" | "colour" | "texture" | "botany";

const STUDY_BY_NUMBER: Record<string, StudyKind> = {
  "01": "line",
  "02": "colour",
  "03": "texture",
  "04": "botany",
};

// Each study crops the shared Folio viewBox to just its own region.
const STUDY_VIEWBOX: Record<StudyKind, string> = {
  line: "40 66 424 252",
  colour: "48 312 502 84",
  texture: "0 0 200 200",
  botany: "96 372 172 164",
};

// Motion accepts a plain number wherever it accepts a MotionValue, so reduced
// motion just passes 1 and every layer renders resolved.
type Driver = MotionValue<number> | number;

function PillarStudy({
  kind,
  draw,
  paint,
}: {
  kind: StudyKind;
  draw: Driver;
  paint: Driver;
}) {
  const ink = "var(--paper)"; // drawn over footage, so the line is light
  const common = {
    fill: "none",
    stroke: ink,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "line") {
    return (
      <>
        <motion.path
          {...common}
          d={FOLIO_ARCH_CONSTRUCTION}
          strokeOpacity={0.4}
          strokeWidth={1.4}
          initial={{ pathLength: 1 }}
          style={{ pathLength: draw }}
        />
        <motion.path
          {...common}
          d={FOLIO_ARCH_PRIMARY}
          strokeWidth={2.6}
          initial={{ pathLength: 1 }}
          style={{ pathLength: draw }}
        />
        <motion.path
          {...common}
          d={FOLIO_ARCH_DETAIL}
          strokeWidth={1.4}
          initial={{ pathLength: 1 }}
          style={{ pathLength: paint }}
        />
      </>
    );
  }

  if (kind === "colour") {
    return (
      <motion.g style={{ opacity: paint }}>
        {FOLIO_SWATCHES.map((s, i) => (
          <path key={i} d={s.d} fill={s.fill} opacity={0.78} />
        ))}
      </motion.g>
    );
  }

  if (kind === "botany") {
    return (
      <>
        <motion.path
          {...common}
          d={FOLIO_BOTANY_STEM}
          strokeWidth={2}
          initial={{ pathLength: 1 }}
          style={{ pathLength: draw }}
        />
        <motion.path
          d={FOLIO_BOTANY_LEAVES}
          fill="var(--herbal)"
          stroke={ink}
          strokeWidth={0.9}
          style={{ opacity: paint }}
        />
        <motion.g style={{ opacity: paint }}>
          {FOLIO_BERRIES.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={4.6}
              fill="var(--apricot)"
              stroke={ink}
              strokeWidth={0.7}
            />
          ))}
        </motion.g>
      </>
    );
  }

  // Texture has no source footage, so its world is the study itself: a weave
  // drawn thread by thread. Honest — it invents a pattern, not a photograph.
  const warp = Array.from({ length: 9 }, (_, i) => 20 + i * 20);
  return (
    <>
      <motion.g initial={{ pathLength: 1 }} style={{ pathLength: draw }}>
        {warp.map((x) => (
          <motion.line
            key={`w${x}`}
            x1={x}
            y1={16}
            x2={x}
            y2={184}
            stroke={ink}
            strokeOpacity={0.55}
            strokeWidth={1.4}
            initial={{ pathLength: 1 }}
            style={{ pathLength: draw }}
          />
        ))}
      </motion.g>
      <motion.g style={{ opacity: paint }}>
        {warp.map((y) => (
          <line
            key={`f${y}`}
            x1={16}
            y1={y}
            x2={184}
            y2={y}
            stroke="var(--clay)"
            strokeOpacity={0.7}
            strokeWidth={3.4}
            strokeDasharray="14 6"
          />
        ))}
      </motion.g>
    </>
  );
}

function PillarRow({ p }: { p: (typeof pillars)[number] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Offsets are viewport-relative: the world resolves as the row crosses the
  // middle of the screen, not when the whole section does.
  const { scrollYProgress: r } = useScroll({
    target: ref,
    offset: ["start 88%", "end 45%"],
  });

  // Annotated so the literals widen to number: useScrollMapped is generic on
  // the output element type, and MotionValue is invariant, so an inferred
  // MotionValue<0 | 1> will not satisfy MotionValue<number>.
  const draw = useScrollMapped<number>(r, [0.12, 0.62], [0, 1]);
  const paint = useScrollMapped<number>(r, [0.46, 0.86], [0, 1]);
  // Media drifts slightly against the copy — depth, not decoration.
  const mediaY = useScrollMapped(r, [0, 1], ["4%", "-4%"]);
  const kind = STUDY_BY_NUMBER[p.number] ?? "line";

  return (
    <article className="pillarRow" ref={ref}>
      <div className="pillarCopy">
        <SectionEyebrow>
          {p.number} · {p.eyebrow}
        </SectionEyebrow>
        <ChapterTitle>{p.title}</ChapterTitle>
        <BodyEditorial>{p.support}</BodyEditorial>
        <MetaLabel className="pillarResult">{p.result}</MetaLabel>
      </div>

      <figure className={`pillarMedia${p.media ? "" : " pillarMediaStudy"}`}>
        {p.media ? (
          <motion.img
            src={p.media}
            alt={p.mediaAlt}
            loading="lazy"
            style={reduced ? undefined : { y: mediaY }}
          />
        ) : (
          <div className="pillarWeaveGround" aria-hidden />
        )}
        <svg
          className="pillarStudy"
          viewBox={STUDY_VIEWBOX[kind]}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <PillarStudy
            kind={kind}
            draw={reduced ? 1 : draw}
            paint={reduced ? 1 : paint}
          />
        </svg>
        {!p.media && (
          <figcaption className="pillarStudyNote">
            <MetaLabel>Pattern study — material footage to produce</MetaLabel>
          </figcaption>
        )}
      </figure>
    </article>
  );
}

export default function CreativePillars() {
  return (
    <section className="pillars" aria-label="Four creative pillars">
      {pillars.map((p) => (
        <PillarRow key={p.number} p={p} />
      ))}
    </section>
  );
}

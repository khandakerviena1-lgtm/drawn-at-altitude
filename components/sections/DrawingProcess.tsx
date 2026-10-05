"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { CAMERA_EASE, useScrollMapped } from "@/lib/animation/useScrollMapped";
import { drawingProcess, STAGE_BUILD } from "@/lib/content/retreat";

// HOW A PAGE IS MADE — the method and the page it makes, in one section.
//
// This merges two sections that were saying the same thing twice: the method
// deck (ten printed stages) and "One page, from nothing" (a drawing building
// itself from graphite to washes). They were separated by three screens and
// neither explained the other.
//
// The hinge is that the method sheet's stages ARE the build stages. Step to
// 04 CONTOUR WITH MICRON and the ink goes down; step to 07 FIRST WASHES and
// the colour arrives. Nothing is invented to make that line up — `STAGE_BUILD`
// maps each printed stage onto the pencil/ink/wash windows the reveal already
// used, and 04 and 07 land exactly on the ink and wash thresholds because
// that is what those stages say they are.
//
// So: the left plate teaches, the right plate demonstrates, and one control
// drives both. The instruction and its result can no longer drift apart.
//
// The reveal machinery is unchanged and simply driven by a different source.
// `useScrollMapped` takes any MotionValue, so swapping scroll for a stepped,
// tweened value needed no change to the masks at all — which is the payoff of
// having built that layer to accept a value rather than read scroll itself.
//
// All three states come from ONE file: the colour plate divided by a heavy
// blur of itself keeps fine dark strokes and drops broad wash tone, leaving
// the drawing's own linework, emitted twice — faint grey graphite, dark ink.
// Because every layer derives from the same image they register perfectly.
//
// HONEST LIMIT, unchanged: no hand, no brush, and the plate underneath is
// fabricated concept art, not Anastasiia's. It cannot ship publicly as her
// work. The real fix is overhead footage of her drawing one page.

const COUNT = drawingProcess.stages.length;
const FEATHER = 22;

export default function DrawingProcess() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(COUNT - 1, next)));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  // The page's build position. Stepped, then tweened — so the drawing catches
  // up to the stage rather than snapping to it.
  // Explicit generic: STAGE_BUILD is `as const`, so this would infer
  // MotionValue<0.1> and refuse every later value (the same literal-inference
  // trap documented in FilmBook and ArtistVision).
  const build = useMotionValue<number>(STAGE_BUILD[0]);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  useEffect(() => {
    controls.current?.stop();
    if (reduced) {
      build.set(STAGE_BUILD[index]);
      return;
    }
    controls.current = animate(build, STAGE_BUILD[index], {
      duration: 0.85,
      ease: [0.4, 0, 0.25, 1],
    });
    return () => controls.current?.stop();
  }, [index, reduced, build]);

  const pencilEdge = useScrollMapped(build, [0.08, 0.3], [-FEATHER, 100], CAMERA_EASE);
  const inkEdge = useScrollMapped(build, [0.3, 0.56], [-FEATHER, 100], CAMERA_EASE);
  const washEdge = useScrollMapped(build, [0.56, 0.86], [-FEATHER, 100], CAMERA_EASE);

  const pencilMask = useMotionTemplate`linear-gradient(100deg, #000 ${pencilEdge}%, transparent calc(${pencilEdge}% + ${FEATHER}%))`;
  const inkMask = useMotionTemplate`linear-gradient(100deg, #000 ${inkEdge}%, transparent calc(${inkEdge}% + ${FEATHER}%))`;
  // 172°, not 180°: a wash laid by hand does not arrive on a spirit level.
  const washMask = useMotionTemplate`linear-gradient(172deg, #000 ${washEdge}%, transparent calc(${washEdge}% + ${FEATHER}%))`;

  // Graphite is buried, not erased — an under-drawing survives beneath a
  // finished page.
  const pencilOpacity = useScrollMapped(build, [0.3, 0.56], [1, 0.34]);

  const stage = drawingProcess.stages[index];
  const tween =
    mounted && !reduced
      ? { duration: 0.62, ease: [0.65, 0, 0.35, 1] as const }
      : { duration: 0 };

  // LAYOUT (2026-10-05, client: "zoomed, and more classy"). The page is now
  // the subject — large, matted like a print — and the method sheet moves to
  // a museum-label column beside it: the printed stage as a small card, the
  // stage number, its title and one line of method. Previously the two were
  // equal partners side by side, and `.revealPage`'s 1080px width (later in
  // the stylesheet) silently overrode the pair's sizing, so the row ran off
  // both edges of the screen. The sheet has its own class now.
  //
  // ZOOM: the camera pushes in a little at every stage, ending ~11% closer
  // on the window and the river, so stepping through reads as leaning in to
  // the page as it fills — not a slideshow of states.
  return (
    <section className="process" aria-label={drawingProcess.kicker}>
      <header className="processHead">
        <p className="typoEyebrow processKicker">{drawingProcess.kicker}</p>
        <h2 className="typoChapter processHeading">{drawingProcess.heading}</h2>
        <p className="typoBody processSub">{drawingProcess.sub}</p>
      </header>

      <div className="processStage" onKeyDown={onKeyDown}>
        {/* The page: the same drawing, built to this stage. */}
        <figure className="processSheet">
          {/* A fixed window that crops, and the drawing zooming inside it —
              scaling the window itself would grow the frame past its mat. */}
          <div className="processWindow">
          <motion.div
            className="processZoom"
            animate={{ scale: 1 + index * 0.012 }}
            transition={mounted && !reduced ? { duration: 1.1, ease: [0.4, 0, 0.25, 1] } : { duration: 0 }}
          >
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
            <motion.img
              className="revealLayer"
              src="/img/room-plate.webp"
              alt="A room at the Indus River Camp drawn in ink and watercolour: the bed, a curtain, and a wall of windows onto the river and the mountains"
              style={{ maskImage: washMask, WebkitMaskImage: washMask }}
            />
          </motion.div>
          </div>
        </figure>

        {/* The label: the printed stage, and what it asks for. */}
        <aside className="processLabel">
          <div className="processCard">
            <motion.img
              className="processStrip"
              src="/img/method-strip.webp"
              alt={drawingProcess.alt}
              animate={{ x: `-${index * 10}%` }}
              transition={tween}
            />
          </div>

          <div className="processText">
            <p className="processCount">
              <span className="serif processNum">{stage.n}</span>
              <span className="typoLabel processOf">/ {String(COUNT).padStart(2, "0")}</span>
            </p>
            <p className="serif processTitle">{stage.title}</p>
            <p className="processNote">{drawingProcess.notes[index]}</p>

            <div className="processArrows">
              <button
                type="button"
                className="processArrow"
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="Previous stage"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                className="processArrow"
                onClick={() => go(index + 1)}
                disabled={index === COUNT - 1}
                aria-label="Next stage"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      <p className="processLive" aria-live="polite">
        {`Stage ${stage.n} of ${COUNT} — ${stage.title}`}
      </p>

      {/* The ten stages as a fine rule: numbers only — the title lives in
          the label — with the run so far drawn in. */}
      <ol className="processRail" style={{ "--rail": index / (COUNT - 1) } as React.CSSProperties}>
        {drawingProcess.stages.map((s, i) => (
          <li key={s.n}>
            <button
              type="button"
              className={`processTick${i === index ? " isActive" : ""}${i < index ? " isDone" : ""}`}
              onClick={() => go(i)}
              aria-current={i === index ? "step" : undefined}
              aria-label={`Stage ${s.n} — ${s.title}`}
            >
              <span className="processTickDot" aria-hidden />
              <span className="typoLabel processTickNum">{s.n}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

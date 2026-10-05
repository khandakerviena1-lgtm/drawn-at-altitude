"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { drawingProcess } from "@/lib/content/retreat";

// HOW A PAGE IS MADE — the method sheet beside the page it builds.
//
// ONE STATE PER STAGE (2026-10-05, client: the method and the drawing did not
// match). The earlier build had only three layers — pencil, ink, colour —
// so seven of the ten printed stages (composition, perspective, values,
// palette, depth, textures, annotation) changed nothing the sheet described.
// Now every stage has its own state of the drawing, built offline by
// scripts/build-process-stages.py from the ONE plate and its line layers, so
// all states register pixel for pixel:
//
//   01 five flat shapes in the sheet's palette   06 the value page + palette swatches
//   02 shapes under a first light pencil         07 wet-on-wet sky and far mountains only
//   03 full pencil construction                  08 colour everywhere, still soft
//   04 Micron ink over a graphite ghost          09 the finished, crisp page
//   05 value study in five greys under the ink   10 the page + handwritten notes
//
// The guides the sheet draws by hand — numbered shapes, thirds and a focal
// ring, horizon and vanishing lines, swatches, notes — are SVG/HTML on top,
// in the drawing's own coordinates (viewBox 1536×1024), so they zoom with it.
//
// CROSSFADE WITHOUT A DIP: states are stacked in stage order and every state
// at or below the current one is fully opaque. Forward, the new state fades
// in over the old; backward, the top state fades out over one already there.
// Never two half-transparent images, so the page never greys out mid-change.
//
// HONEST LIMIT, unchanged: the plate is fabricated concept art, not
// Anastasiia's, and the stages are derived from it, not drawn. It cannot ship
// publicly as her work; the real fix is overhead footage of her drawing a page.

const COUNT = drawingProcess.stages.length;

const STATES = [
  "s01-shapes",
  "s02-sketch",
  "s03-pencil",
  "s04-ink",
  "s05-value",
  "s07-washes",
  "s08-depth",
  "s09-final",
] as const;
// Which state each printed stage shows (06 and 10 add overlays, not states).
const STAGE_STATE = [0, 1, 2, 3, 4, 4, 5, 6, 7, 7];

// The sheet's own Ladakh palette, as printed on panel 06.
const PALETTE = [
  ["Mineral blue", "#7d93ad"],
  ["Pangong blue", "#a9bfd4"],
  ["Mauve grey", "#a99aaa"],
  ["Mountain grey", "#a3a19c"],
  ["Warm earth", "#b48a62"],
  ["Raw sienna", "#c99a63"],
  ["Olive green", "#8a8f5a"],
  ["Warm ochre", "#d1a85e"],
  ["Stone", "#c4baa8"],
] as const;

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

  const stage = drawingProcess.stages[index];
  const current = STAGE_STATE[index];
  const animated = mounted && !reduced;
  const tween = animated
    ? { duration: 0.62, ease: [0.65, 0, 0.35, 1] as const }
    : { duration: 0 };
  const fade = animated ? { duration: 0.75, ease: [0.4, 0, 0.25, 1] as const } : { duration: 0 };
  const show = (on: boolean) => ({ opacity: on ? 1 : 0 });

  return (
    <section className="process" aria-label={drawingProcess.kicker}>
      <header className="processHead">
        <p className="typoEyebrow processKicker">{drawingProcess.kicker}</p>
        <h2 className="typoChapter processHeading">{drawingProcess.heading}</h2>
        <p className="typoBody processSub">{drawingProcess.sub}</p>
      </header>

      <div className="processStage" onKeyDown={onKeyDown}>
        <figure className="processSheet">
          {/* A fixed window that crops, and the drawing zooming inside it —
              scaling the window itself would grow the frame past its mat. */}
          <div className="processWindow">
            <motion.div
              className="processZoom"
              animate={{ scale: 1 + index * 0.012 }}
              transition={animated ? { duration: 1.1, ease: [0.4, 0, 0.25, 1] } : { duration: 0 }}
            >
              {STATES.map((s, i) => (
                <motion.img
                  key={s}
                  className="processState"
                  src={`/img/process/${s}.webp`}
                  alt={
                    i === current
                      ? `The camp room drawing at stage ${stage.n}, ${stage.title.toLowerCase()}`
                      : ""
                  }
                  aria-hidden={i === current ? undefined : true}
                  loading="lazy"
                  decoding="async"
                  initial={false}
                  animate={show(i <= current)}
                  transition={fade}
                />
              ))}

              <svg
                className="processGuides"
                viewBox="0 0 1536 1024"
                preserveAspectRatio="none"
                aria-hidden
              >
                {/* 01 — the five big shapes, numbered as on the sheet. */}
                <motion.g initial={false} animate={show(index === 0)} transition={fade}>
                  {[
                    [1060, 150, "1"],
                    [1180, 335, "2"],
                    [1000, 470, "3"],
                    [1000, 615, "4"],
                    [1160, 880, "5"],
                  ].map(([x, y, n]) => (
                    <g key={n} className="guideNumber">
                      <circle cx={x} cy={y} r={30} />
                      <text x={x} y={Number(y) + 12} textAnchor="middle">
                        {n}
                      </text>
                    </g>
                  ))}
                </motion.g>

                {/* 02 — thirds, and the main focal point. */}
                <motion.g initial={false} animate={show(index === 1)} transition={fade}>
                  <path className="guideThirds" d="M512 0V1024M1024 0V1024M0 341H1536M0 683H1536" />
                  <ellipse className="guideRed" cx={975} cy={640} rx={170} ry={95} />
                  <text className="guideHand guideRedText" x={1040} y={790}>
                    Main focal point
                  </text>
                </motion.g>

                {/* 03 — horizon, and the window's lines running to the
                    vanishing point off the left of the page. */}
                <motion.g initial={false} animate={show(index === 2)} transition={fade}>
                  <path className="guideRed" d="M0 420H1536" />
                  <path className="guideRedThin" d="M1500 46L0 174M1500 796L0 596" />
                  <text className="guideHand guideRedText" x={1330} y={405}>
                    Horizon
                  </text>
                  <text className="guideHand guideRedText" x={110} y={150}>
                    ← VP
                  </text>
                </motion.g>

                {/* 10 — the page tells the journey. */}
                <motion.g initial={false} animate={show(index === 9)} transition={fade}>
                  <text className="guideHand guideInk" x={130} y={120}>
                    A quiet afternoon by the Indus.
                  </text>
                  <text className="guideHand guideInk" x={1230} y={445}>
                    Indus River ↓
                  </text>
                  <text className="guideHand guideInk" x={960} y={900}>
                    Afternoon light
                  </text>
                  <text className="guideHand guideInk" x={130} y={930}>
                    Leh, Ladakh · September 2027
                  </text>
                </motion.g>
              </svg>

              {/* 06 — the limited palette, painted as test swatches on the
                  margin of the page, the way the sheet lays it out. */}
              <motion.ul
                className="processPalette"
                initial={false}
                animate={show(index === 5)}
                transition={fade}
                aria-hidden
              >
                {PALETTE.map(([name, colour]) => (
                  <li key={name} style={{ background: colour }} title={name} />
                ))}
              </motion.ul>
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

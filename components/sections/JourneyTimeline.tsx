"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { nineDays, NINE_DAYS_STATUS } from "@/lib/content/retreat";
import MealIcon, { type MealKind } from "@/components/ui/MealIcon";

// THE STAGES OF THE JOURNEY — one continuous journey, not a carousel.
//
// The whole component is derived from ONE number: `pos`, a continuous
// position from 1 to 9. Nothing is animated per-day and nothing is triggered
// by having visited a day; every visual is a pure function of `pos`, so
// stopping halfway between day 3 and day 4 leaves every element halfway, and
// scrubbing backwards reverses everything exactly. That is the whole design.
//
//   currentDay = floor(pos)   t = pos - currentDay
//
// THE ORANGE LINE IS THE TIMELINE'S ARROW, NOT AN ELEVATION PROFILE. It runs
// dead straight from day 1 to day 9 and ends in an arrowhead, because it
// measures time, not height — a first version had it climbing with altitude,
// which turned a chronological frieze into a chart and made the traveller
// ride a slope for no reason. The car and the walker move horizontally.
//
// ALTITUDE LIVES IN THE MOUNTAINS INSTEAD. Each peak is scaled by its day's
// real altitude, so the hierarchy reads without labels: Alchi is visibly the
// smallest at 3,100 m, the two 4,000 m days the tallest. Each one draws from
// its base upward as the traveller approaches, finishing exactly on arrival.
//
// Transport for a segment is the mode of the day being travelled TO, which is
// how the itinerary reads: day 4 is the walk up to Gotsang, so the segment
// 3 → 4 is the hiker.

const DAYS = nineDays.days;
const DWELL = 4600;
const N = DAYS.length;

// Geometry, computed once from the real altitudes.
const X0 = 100;
const DX = 170;
const BASE_Y = 430;
const CLIMB = 95;
const MH_MIN = 58;
const MH_RANGE = 86;
const VB_W = X0 * 2 + DX * (N - 1);
const VB_H = 560;

const ALT_LO = Math.min(...DAYS.map((d) => d.altitude));
const ALT_HI = Math.max(...DAYS.map((d) => d.altitude));
const norm = (alt: number) => (alt - ALT_LO) / (ALT_HI - ALT_LO);

// y is constant: the arrow is a timeline. Only the mountain height varies.
const GEO = DAYS.map((d, i) => ({
  ...d,
  x: X0 + i * DX,
  y: BASE_Y,
  mh: MH_MIN + norm(d.altitude) * MH_RANGE,
}));

const ARROW_TAIL = X0 - 56;
const ARROW_TIP = GEO[N - 1].x + 66;
const ROUTE_D = `M ${ARROW_TAIL} ${BASE_Y} L ${ARROW_TIP} ${BASE_Y}`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// A mountain silhouette scaled to its day's altitude. Seeded off the index so
// the range varies without any two being identical, and without randomness.
function peak(x: number, y: number, h: number, i: number) {
  const w = h * 1.35;
  const skew = ((i % 3) - 1) * 0.14;
  const apex = x + w * skew * 0.5;
  const shoulderL = x - w * 0.28 + skew * 8;
  const shoulderR = x + w * 0.3 + skew * 8;
  return `M ${x - w} ${y} L ${shoulderL} ${y - h * 0.52} L ${apex} ${y - h} L ${shoulderR} ${y - h * 0.56} L ${x + w} ${y} Z`;
}
function cap(x: number, y: number, h: number, i: number) {
  const w = h * 1.35;
  const skew = ((i % 3) - 1) * 0.14;
  const apex = x + w * skew * 0.5;
  return `M ${apex - w * 0.2} ${y - h * 0.68} L ${apex} ${y - h} L ${apex + w * 0.21} ${y - h * 0.7} L ${apex + w * 0.08} ${y - h * 0.74} L ${apex - w * 0.06} ${y - h * 0.66} Z`;
}

/* ---------------------------------------------------------------- mountains */

function Peak({ pos, i, reduced }: { pos: MotionValue<number>; i: number; reduced: boolean }) {
  const g = GEO[i];
  // Draws while the traveller crosses toward it; complete exactly on arrival.
  const reveal = useTransform(pos, (p) => clamp01(p - i));
  const scaleY = useTransform(reveal, (r) => (reduced ? 1 : 0.06 + r * 0.94));
  const opacity = useTransform(reveal, (r) => 0.08 + r * 0.92);
  const capOpacity = useTransform(reveal, (r) => clamp01((r - 0.55) / 0.45));
  const labelOpacity = useTransform(pos, (p) => 0.25 + clamp01(1 - Math.abs(p - 1 - i)) * 0.75);

  return (
    <g>
      <motion.g
        style={{ scaleY, opacity, originX: `${g.x}px`, originY: `${g.y}px` }}
      >
        <path d={peak(g.x, g.y, g.mh, i)} className="jtPeak" />
        <motion.path d={cap(g.x, g.y, g.mh, i)} className="jtCap" style={{ opacity: capOpacity }} />
      </motion.g>
      <motion.text
        x={g.x}
        y={g.y - g.mh - 14}
        textAnchor="middle"
        className="jtAlt"
        style={{ opacity: labelOpacity }}
      >
        {g.altitude.toLocaleString("fr-FR").replace(",", " ")} m
      </motion.text>
    </g>
  );
}

/* ------------------------------------------------------------------- markers */

function DayMark({
  pos,
  i,
  onPick,
}: {
  pos: MotionValue<number>;
  i: number;
  onPick: (d: number) => void;
}) {
  const g = GEO[i];
  const near = useTransform(pos, (p) => clamp01(1 - Math.abs(p - 1 - i)));
  const fill = useTransform(near, (n) => `rgba(198, 106, 42, ${n})`);
  const numFill = useTransform(near, (n) => (n > 0.55 ? "#fbf7ef" : "#c66a2a"));
  // Past days stay legible; future days remain a faint structural preview.
  const opacity = useTransform(pos, (p) => (p - 1 >= i ? 1 : 0.42 + near.get() * 0.5));

  return (
    <motion.g
      style={{ opacity }}
      className="jtMark"
      onClick={() => onPick(i + 1)}
      role="button"
      tabIndex={0}
      aria-label={`Day ${i + 1} — ${g.place}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick(i + 1);
        }
      }}
    >
      {/* Invisible, and roughly 40px across on screen once the viewBox is
          scaled down for mobile — the visible dot alone measured 15px there,
          under half a comfortable thumb target, with 77px between marks
          leaving plenty of room to grow it. `fill="none"` shapes take no
          pointer events at all; transparent does. */}
      <circle cx={g.x} cy={g.y} r={45} fill="transparent" aria-hidden />
      <motion.circle cx={g.x} cy={g.y} r={17} className="jtDot" style={{ fill }} />
      <motion.text x={g.x} y={g.y + 5} textAnchor="middle" className="jtDotNum" style={{ fill: numFill }}>
        {i + 1}
      </motion.text>
    </motion.g>
  );
}

/* ----------------------------------------------------------------- traveller */

function Traveller({ pos, reduced }: { pos: MotionValue<number>; reduced: boolean }) {
  const seg = useTransform(pos, (p) => Math.min(N - 2, Math.max(0, Math.floor(p - 1))));
  const x = useTransform(pos, (p) => {
    const i = Math.min(N - 2, Math.max(0, Math.floor(p - 1)));
    return lerp(GEO[i].x, GEO[i + 1].x, clamp01(p - 1 - i));
  });
  // The arrow is flat, so the traveller rides it flat — no slope, no tilt.
  // -30, not -24: the figure is drawn with its feet near +7 in local units,
  // and at 1.6× those land ~11 below the anchor, so the anchor rises to keep
  // the feet on the line rather than through it.
  const y = BASE_Y - 30;
  // Gait is driven by distance travelled, never by a clock.
  const gait = useTransform(pos, (p) => (reduced ? 0 : Math.sin(p * 11) * 9));
  const gait2 = useTransform(pos, (p) => (reduced ? 0 : -Math.sin(p * 11) * 9));
  const bob = useTransform(pos, (p) => (reduced ? 0 : Math.abs(Math.sin(p * 11)) * -1.4));

  const [mode, setMode] = useState(DAYS[1].move);
  useMotionValueEvent(seg, "change", (i) => setMode(DAYS[i + 1].move));
  useEffect(() => setMode(DAYS[1].move), []);

  return (
    <motion.g style={{ x, y }}>
      {/* 1.6× on the whole figure: at the mobile viewBox scale the traveller
          measured ~15px on screen, which the client read as barely visible.
          Scaling the group keeps every icon's own proportions. */}
      <g transform="scale(1.6)">
        {mode === "walk" ? (
          <motion.g className="jtWalker" style={{ y: bob }}>
            <circle cx="0" cy="-15" r="3.4" />
            <path d="M0 -12 L0 -3" />
            <motion.path d="M0 -3 L-4 6" style={{ rotate: gait, originX: "0px", originY: "-3px" }} />
            <motion.path d="M0 -3 L4 6" style={{ rotate: gait2, originX: "0px", originY: "-3px" }} />
            <motion.path d="M0 -9 L6 -4" style={{ rotate: gait2, originX: "0px", originY: "-9px" }} />
            <path d="M7 -12 L7 7" className="jtPole" />
          </motion.g>
        ) : mode === "sketch" || mode === "stay" ? (
          <motion.g className="jtSketcher" style={{ y: bob }}>
            <circle cx="-3" cy="-14" r="3.2" />
            <path d="M-3 -11 L-3 -2" />
            <path d="M-3 -2 L-6 6M-3 -2 L1 6" />
            <motion.path d="M-3 -8 L4 -6" style={{ rotate: gait, originX: "-3px", originY: "-8px" }} />
            <rect x="4" y="-12" width="9" height="7" rx="0.8" className="jtBoard" />
          </motion.g>
        ) : (
          <g className="jtCar">
            <path d="M-11 2 L-9 -4 L4 -4 L8 2 Z" />
            {/* Static wheels, welded to the body — the client's call after
                seeing them drift ("fix them to the main car"). They rotated
                via per-element origins that SVG resolves against the
                viewport, not the shape, so at speed they orbited away from
                the car; and a spokeless circle shows nothing when it spins
                anyway, so the rotation bought no motion, only the bug. */}
            <circle cx="-6" cy="4" r="2.6" />
            <circle cx="4.5" cy="4" r="2.6" />
          </g>
        )}
      </g>
    </motion.g>
  );
}

/* --------------------------------------------------------------- thermometer */

function Thermo({
  pos,
  kind,
}: {
  pos: MotionValue<number>;
  kind: "day" | "night";
}) {
  const value = useTransform(pos, (p) => {
    const i = Math.min(N - 2, Math.max(0, Math.floor(p - 1)));
    const t = clamp01(p - 1 - i);
    const a = kind === "day" ? DAYS[i].tempDay : DAYS[i].tempNight;
    const b = kind === "day" ? DAYS[i + 1].tempDay : DAYS[i + 1].tempNight;
    return lerp(a, b, t);
  });
  const [shown, setShown] = useState(kind === "day" ? DAYS[0].tempDay : DAYS[0].tempNight);
  useMotionValueEvent(value, "change", (v) => setShown(Math.round(v)));

  // Fill height and colour both follow the interpolated value, so a warming
  // day and a cooling night can happen in the same transition.
  const fill = useTransform(value, (v) => clamp01((v + 5) / 32));
  const height = useTransform(fill, (f) => 2 + f * 26);
  const yPos = useTransform(height, (h) => 32 - h);
  const colour = useTransform(fill, (f) => {
    const warm = [199, 74, 44];
    const cool = [74, 118, 168];
    const c = warm.map((w, k) => Math.round(lerp(cool[k], w, f)));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  });

  return (
    <div className="jtThermo">
      <svg viewBox="0 0 16 42" aria-hidden className="jtThermoSvg">
        <rect x="5" y="2" width="6" height="30" rx="3" className="jtTube" />
        <motion.rect x="5" y={yPos} width="6" height={height} rx="3" style={{ fill: colour }} />
        <motion.circle cx="8" cy="35" r="5.5" style={{ fill: colour }} />
      </svg>
      <span className="jtThermoVal">
        {shown}°C <span className="jtThermoKind">{kind === "day" ? "day" : "night"}</span>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------- section */

export default function JourneyTimeline() {
  const reduced = useReducedMotion() ?? false;
  const pos = useMotionValue(1);
  const trackRef = useRef<SVGSVGElement>(null);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, "change", (p) => setActive(Math.round(p) - 1));

  // Two ways to take the journey, because two kinds of reader arrive here.
  // "Explore" is the default: nothing moves until you move it, and the drawing
  // follows your pointer exactly. "Play" walks the ten days on its own, so the
  // journey can simply be watched. Any manual input drops back to Explore —
  // fighting an autoplay for control is the worst version of both.
  const [playing, setPlaying] = useState(false);

  const goTo = useCallback(
    (day: number) => {
      const target = Math.min(N, Math.max(1, day));
      controls.current?.stop();
      if (reduced) {
        pos.set(target);
        return;
      }
      controls.current = animate(pos, target, {
        duration: 1.1,
        ease: [0.4, 0, 0.25, 1],
      });
    },
    [pos, reduced],
  );

  // Every manual entry point goes through this, so there is exactly one place
  // where autoplay is surrendered.
  const take = useCallback(
    (day: number) => {
      setPlaying(false);
      goTo(day);
    },
    [goTo],
  );

  const step = useCallback(
    (dir: 1 | -1) => take(Math.round(pos.get()) + dir),
    [take, pos],
  );

  // Direct scrubbing: no easing, the drawing follows the pointer exactly.
  const dragging = useRef(false);
  const fromClientX = useCallback((clientX: number) => {
    const svg = trackRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const vbX = ((clientX - r.left) / r.width) * VB_W;
    const raw = 1 + (vbX - X0) / DX;
    pos.set(Math.min(N, Math.max(1, raw)));
  }, [pos]);

  // Autoplay: move to the next day, then hold long enough to read it. It stops
  // at the last day rather than looping, because the journey ends — it does not
  // go round. Under reduced motion the move is a cut and only the dwell remains.
  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const advance = () => {
      if (cancelled) return;
      const next = Math.round(pos.get()) + 1;
      if (next > N) {
        setPlaying(false);
        return;
      }
      const hold = () => {
        if (!cancelled) timer = setTimeout(advance, DWELL);
      };
      controls.current?.stop();
      if (reduced) {
        pos.set(next);
        hold();
        return;
      }
      controls.current = animate(pos, next, {
        duration: 1.05,
        ease: [0.4, 0, 0.25, 1],
        onComplete: hold,
      });
    };

    // Starting a finished journey starts it again from the first day.
    if (Math.round(pos.get()) >= N) pos.set(1);
    timer = setTimeout(advance, 700);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controls.current?.stop();
    };
  }, [playing, pos, reduced]);

  useEffect(() => {
    const move = (e: PointerEvent) => dragging.current && fromClientX(e.clientX);
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [fromClientX]);

  // Route progress: solid behind the traveller, pale ahead.
  const progress = useTransform(pos, (p) => (p - 1) / (N - 1));

  // Mobile keeps the active day near the centre instead of shrinking nine
  // days into illegibility.
  const shift = useTransform(pos, (p) => -(X0 + (p - 1) * DX - VB_W / 2));

  const day = DAYS[Math.min(N - 1, Math.max(0, active))];

  return (
    <section id="journey" className="jt" aria-label={nineDays.heading}>
      <div className="jtHead">
        <h2 className="jtTitle">The stages of the journey</h2>
        <p className="jtSub">Ladakh · nine nights</p>

        <div className="jtModes" role="group" aria-label="How to move through the journey">
          <button type="button" className="jtMode" aria-pressed={!playing} onClick={() => setPlaying(false)}>
            Explore
          </button>
          <button type="button" className="jtMode" aria-pressed={playing} onClick={() => setPlaying(true)}>
            Play
          </button>
        </div>

        <p className="jtModeHint">
          {playing
            ? "Playing through the ten days — touch the line to take over."
            : "Drag along the line, or pick a day."}
        </p>
      </div>

      <div className="jtStage">
        <svg
          ref={trackRef}
          className="jtSvg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          onPointerDown={(e) => {
            dragging.current = true;
            setPlaying(false);
            controls.current?.stop();
            fromClientX(e.clientX);
          }}
          role="img"
          aria-label="Altitude profile of the journey, from 3,100 m at Alchi to 4,000 m at the Gotsang hermitage and Pangong"
        >
          <motion.g style={{ x: shift }} className="jtShift">
            {GEO.map((_, i) => (
              <Peak key={i} pos={pos} i={i} reduced={reduced} />
            ))}

            <path d={ROUTE_D} className="jtRoutePale" />
            <motion.path d={ROUTE_D} className="jtRoute" style={{ pathLength: progress }} />
            {/* The frieze points forward: it is a timeline, not a graph. */}
            <path
              d={`M ${ARROW_TIP} ${BASE_Y} l -16 -9 l 0 18 Z`}
              className="jtArrowHead"
            />

            {GEO.map((_, i) => (
              <DayMark key={i} pos={pos} i={i} onPick={take} />
            ))}

            <Traveller pos={pos} reduced={reduced} />

            {GEO.map((g, i) => (
              <DayLabel key={i} pos={pos} i={i} x={g.x} />
            ))}
          </motion.g>
        </svg>
      </div>

      {/* The arrows sit directly under the frieze they drive, not beside the
          text panel three hundred pixels lower — the client's call after
          phone testing. What they operate is the diagram; they belong to it. */}
      <div className="jtArrowRow">
        <button type="button" className="jtArrow" onClick={() => step(-1)} aria-label="Previous day">
          <span aria-hidden>←</span>
        </button>
        <button type="button" className="jtArrow" onClick={() => step(1)} aria-label="Next day">
          <span aria-hidden>→</span>
        </button>
      </div>

      <div className="jtPanel">
        <div className="jtPanelBody">
          <p className="typoLabel jtPanelDay">Day {active + 1}</p>
          <p className="serif jtPanelTitle">
            {day.place} <span className="jtSep">/</span> {day.fragment}
          </p>
          <p className="jtPanelLong">{day.long}</p>
          {/* What can change on the day, in the camp's words — only on the
              days where there is a real choice. */}
          {day.flexible && (
            <p className="jtPanelFlex">
              <span className="typoLabel">Flexible</span> {day.flexible}
            </p>
          )}
          {/* Breakfast, lunch and dinner — and where each one is eaten. */}
          <dl className="jtMeals">
            {([
              ["Breakfast", day.meals.breakfast],
              ["Lunch", day.meals.lunch],
              ["Dinner", day.meals.dinner],
            ] as const).map(([label, meal]) => (
              <div className="jtMeal" key={label}>
                <dt>
                  <MealIcon kind={meal.kind as MealKind} className="jtMealIcon" />
                  <span className="typoLabel">{label}</span>
                </dt>
                <dd>{meal.note}</dd>
              </div>
            ))}
          </dl>

          <div className="jtTemps">
            <Thermo pos={pos} kind="day" />
            <Thermo pos={pos} kind="night" />
          </div>
        </div>
      </div>

      <p className="typoLabel jtCaveat">{NINE_DAYS_STATUS}</p>
    </section>
  );
}

/* Labels stay visible throughout; only emphasis crossfades. */
function DayLabel({ pos, i, x }: { pos: MotionValue<number>; i: number; x: number }) {
  const near = useTransform(pos, (p) => clamp01(1 - Math.abs(p - 1 - i)));
  const opacity = useTransform(near, (n) => 0.42 + n * 0.58);
  return (
    <motion.text x={x} y={BASE_Y + 62} textAnchor="middle" className="jtDayLabel" style={{ opacity }}>
      Day {i + 1}
    </motion.text>
  );
}

"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { nineDays, NINE_DAYS_STATUS, type DayMove } from "@/lib/content/retreat";
import { useCinematicScroll } from "@/lib/animation/useCinematicScroll";
import { useScrollMapped, CAMERA_EASE } from "@/lib/animation/useScrollMapped";
import { ChapterTitle } from "@/components/ui/Typography";
import MoveIcon from "@/components/ui/MoveIcon";

// NINE DAYS — a chronological frieze whose shape is the mountains.
//
// The ridge is not decoration and not a metaphor: y is altitude across the
// week's real range (3,100–4,000 m) and x is the day. Gotsang and Pangong
// are the two peaks because they are the two 4,000 m days; Alchi is the low
// point because it is the one day the week drops to 3,100. The profile of
// the drawing IS the profile of the itinerary, so the shape carries
// information rather than illustrating it.
//
// That is also why the Chang La gets its own mark above day 7: at 5,300 m it
// is higher than anywhere the group sleeps, and it is the number a guest
// should meet before booking rather than in the small print.
//
// The ridge draws itself as you scroll, the day markers arrive along it in
// order, and each card follows its own marker. Nothing moves on its own and
// nothing snaps — scroll position is animation position throughout, so the
// frieze can be read at any speed and reversed exactly.

const MOVE_LABEL: Record<DayMove, string> = {
  arrive: "Fly in and transfer",
  depart: "Transfer and fly out",
  drive: "By road",
  walk: "On foot",
  sketch: "Sketching at camp",
  stay: "At the camp",
};

function duration(minutes: number) {
  if (minutes === 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m}` : `${h} h`;
}

type Day = (typeof nineDays.days)[number];

function Marker({
  p,
  day,
  index,
}: {
  p: ReturnType<typeof useCinematicScroll>;
  day: Day;
  index: number;
}) {
  const at = 0.08 + index * 0.034;
  const opacity = useScrollMapped(p, [at, at + 0.05], [0, 1]);
  const r = useScrollMapped(p, [at, at + 0.06], [0, 6], CAMERA_EASE);

  return (
    <motion.g style={{ opacity }}>
      <motion.circle cx={day.x} cy={day.y} r={r} className="ridgeDot" />
      <text x={day.x} y={day.y - 16} className="ridgeDay" textAnchor="middle">
        {day.number}
      </text>
      <text x={day.x} y={day.y + 26} className="ridgeAlt" textAnchor="middle">
        {day.altitude.toLocaleString("en-GB")}
      </text>
    </motion.g>
  );
}

function DayCard({
  p,
  day,
  index,
}: {
  p: ReturnType<typeof useCinematicScroll>;
  day: Day;
  index: number;
}) {
  const at = 0.2 + index * 0.058;
  const opacity = useScrollMapped(p, [at, at + 0.07], [0, 1]);
  const y = useScrollMapped(p, [at, at + 0.09], [14, 0], CAMERA_EASE);

  return (
    <motion.li className="dayCard" style={{ opacity, y }}>
      <div className="dayCardHead">
        <span className="typoLabel dayCardNum">{day.number}</span>
        <span className="serif dayCardPlace">
          {day.place} <span className="daySep">/</span> {day.fragment}
        </span>
      </div>

      <p className="dayCardSummary">{day.summary}</p>

      <div className="dayCardMeta">
        <span className="dayCardMove">
          <MoveIcon move={day.move} className="moveIcon" />
          {MOVE_LABEL[day.move]}
          {day.km > 0 && ` · ${day.km} km · ${duration(day.minutes)}`}
        </span>
        <span className="dayCardAlt">
          {day.altitude.toLocaleString("en-GB")} m
        </span>
        <span className="dayCardTemp">
          {day.tempDay}° / {day.tempNight}°
        </span>
      </div>

      <p className="hand dayCardTools">{day.tools.join(" · ")}</p>
    </motion.li>
  );
}

export default function NineDays() {
  const containerRef = useRef<HTMLElement>(null);
  const p = useCinematicScroll(containerRef);

  const drawn = useScrollMapped(p, [0.04, 0.42], [0, 1], CAMERA_EASE);
  const pathLength = useTransform(drawn, (v) => v);
  const massOpacity = useScrollMapped(p, [0.14, 0.46], [0, 1]);
  const passOpacity = useScrollMapped(p, [0.3, 0.38], [0, 1]);

  return (
    <section
      ref={containerRef}
      id="journey"
      className="nineDays"
      aria-label="Nine days"
    >
      <div className="nineDaysHead">
        <ChapterTitle>{nineDays.heading}</ChapterTitle>
        <p className="typoBody nineDaysSub">{nineDays.subheading}</p>
      </div>

      <div className="ridgeWrap">
        <svg
          className="ridge"
          viewBox={nineDays.ridgeViewBox}
          role="img"
          aria-label="Altitude profile of the nine days, from 3,100 m at Alchi to 4,000 m at Gotsang and Pangong"
        >
          <motion.path
            d={nineDays.ridgeFill}
            className="ridgeMass"
            style={{ opacity: massOpacity }}
          />
          <motion.path
            d={nineDays.ridge}
            className="ridgeLine"
            style={{ pathLength }}
          />

          {/* The pass: higher than any night of the week. */}
          <motion.g style={{ opacity: passOpacity }}>
            <line
              x1={nineDays.pass.x}
              y1={18}
              x2={nineDays.pass.x}
              y2={34}
              className="ridgePassTick"
            />
            <text
              x={nineDays.pass.x}
              y={12}
              className="ridgePass"
              textAnchor="middle"
            >
              {nineDays.pass.label}
            </text>
          </motion.g>

          {nineDays.days.map((d, i) => (
            <Marker key={d.number} p={p} day={d} index={i} />
          ))}
        </svg>
      </div>

      <ol className="dayCards">
        {nineDays.days.map((d, i) => (
          <DayCard key={d.number} p={p} day={d} index={i} />
        ))}
      </ol>

      <p className="typoLabel dayCaveat">{NINE_DAYS_STATUS}</p>
    </section>
  );
}

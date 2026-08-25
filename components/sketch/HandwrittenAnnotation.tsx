"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { ARROW_VIEWBOX, ARROW_PATH, ARROW_HEAD } from "./paths";

// A field note: curved arrow draws first, then the written observation fades
// in whole (never typed character-by-character). Appears only after its
// subject is established — sequencing is the caller's responsibility via range.
type Props = {
  progress: MotionValue<number>;
  range: [number, number];
  text: string;
  className?: string;
  color?: string;
};

export default function HandwrittenAnnotation({
  progress,
  range,
  text,
  className,
  color = "var(--paper)",
}: Props) {
  const [start, end] = range;
  const mid = start + (end - start) * 0.55;
  // pathLength stays a useTransform (Motion handles dash interpolation in JS);
  // plain opacity/transform go through useScrollMapped (see that hook's note).
  const arrowLength = useTransform(progress, [start, mid], [0, 1], {
    clamp: true,
  });
  const textOpacity = useScrollMapped(progress, [mid, end], [0, 1]);
  const textY = useScrollMapped(progress, [mid, end], [6, 0]);

  return (
    <div className={className} aria-hidden={false}>
      <motion.svg
        viewBox={ARROW_VIEWBOX}
        fill="none"
        style={{ width: "3.4rem", display: "block", marginBottom: "0.3rem" }}
        aria-hidden
      >
        <motion.path
          d={ARROW_PATH}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeOpacity={0.85}
          style={{ pathLength: arrowLength }}
        />
        <motion.path
          d={ARROW_HEAD}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeOpacity={0.85}
          style={{ opacity: textOpacity }}
        />
      </motion.svg>
      <motion.p
        className="hand annotationText"
        style={{ opacity: textOpacity, y: textY, color }}
      >
        {text}
      </motion.p>
    </div>
  );
}

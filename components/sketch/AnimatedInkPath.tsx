"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

// Two-pass ink drawing: a light, wobbly construction pass followed by the
// decisive primary stroke, both driven from one scroll progress value so the
// passes overlap the way a hand revisits a line (never uniform-speed).
type Props = {
  progress: MotionValue<number>;
  viewBox: string;
  constructionD?: string;
  primaryD: string;
  constructionRange?: [number, number];
  primaryRange?: [number, number];
  stroke?: string;
  className?: string;
  strokeWidth?: number;
  opacity?: MotionValue<number> | number;
};

export default function AnimatedInkPath({
  progress,
  viewBox,
  constructionD,
  primaryD,
  constructionRange = [0, 0.5],
  primaryRange = [0.3, 1],
  stroke = "var(--ink)",
  className,
  strokeWidth = 2.4,
  opacity = 1,
}: Props) {
  const constructionLength = useTransform(progress, constructionRange, [0, 1], {
    clamp: true,
  });
  const primaryLength = useTransform(progress, primaryRange, [0, 1], {
    clamp: true,
  });

  return (
    <motion.svg
      viewBox={viewBox}
      fill="none"
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      {constructionD && (
        <motion.path
          d={constructionD}
          stroke={stroke}
          strokeWidth={strokeWidth * 0.66}
          strokeLinecap="round"
          strokeOpacity={0.45}
          style={{ pathLength: constructionLength }}
        />
      )}
      <motion.path
        d={primaryD}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeOpacity={0.9}
        style={{ pathLength: primaryLength }}
      />
    </motion.svg>
  );
}

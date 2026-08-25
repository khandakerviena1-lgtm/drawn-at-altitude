"use client";

import {
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";
import type { RefObject } from "react";

// The damped scrub. This is the motion/react equivalent of GSAP's
// `scrub: 1.2`, and until now the project had no equivalent at all: every
// section read raw scrollYProgress and wrote styles from it on the same
// frame, so the image was welded to the wheel and inherited every jolt of a
// trackpad. Lenis smooths the scroll *position*; nothing smoothed the
// mapping from position to picture.
//
// Tuned deliberately short. Lenis is already lerping underneath, so a long
// catch-up here stacks two lags and produces exactly the oily, out-of-control
// feel that a scrubbed site has to avoid. ~0.5s to settle.
//
// Overdamped on purpose (ζ ≈ 1.03): a spring that overshoots would run the
// film *backwards* past every beat before settling, which on a scrubbed video
// reads as a glitch rather than as softness.
const CINEMATIC = {
  stiffness: 32,
  damping: 8.5,
  mass: 0.5,
  restDelta: 0.0002,
} as const;

export function useCinematicScroll(
  ref: RefObject<HTMLElement | null>,
): MotionValue<number> {
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const damped = useSpring(scrollYProgress, CINEMATIC);

  // Both hooks always run, so the order is stable; only the value handed back
  // changes. Reduced motion gets the undamped value — there is no animation
  // to soften, and a spring would only delay the static end state.
  return reduced ? scrollYProgress : damped;
}

"use client";

import {
  cubicBezier,
  transform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";

type Easing = (v: number) => number;

// The house curve for camera moves — a slow build and a slow settle, which is
// what makes a push-in read as a camera rather than as a CSS transition.
// Equivalent to GSAP's power2.inOut.
export const CAMERA_EASE: Easing = cubicBezier(0.65, 0, 0.35, 1);

// Gentler, for long travels where power2 would feel like it lurches.
export const TRAVEL_EASE: Easing = cubicBezier(0.45, 0, 0.55, 1);

// Deterministic scroll→style mapping with guaranteed JS-driven inline style
// writes. We deliberately avoid handing raw useTransform(scrollProgress)
// values straight to `style`: Motion 13 promotes simple opacity/transform
// cases to native Web Animations whose timeline mapping proved unreliable for
// container-targeted useScroll (elements froze at stale values). Values
// produced here update via useMotionValueEvent, which Motion applies as
// plain per-frame style writes.
// `ease` shapes the curve *between* stops. Holds (two stops with the same
// output) are unaffected, so a stepped mapping can be eased safely: only the
// glides change. Without it every move here was perfectly linear, which is
// the one thing a camera never is.
export function useScrollMapped<T extends string | number>(
  source: MotionValue<number>,
  input: number[],
  output: T[],
  ease?: Easing,
): MotionValue<T> {
  const mapper = transform(input, output, { clamp: true, ...(ease ? { ease } : {}) });
  const value = useMotionValue<T>(mapper(source.get()));
  useMotionValueEvent(source, "change", (v) => value.set(mapper(v)));
  return value;
}

export function useScrollComputed<T extends string | number>(
  source: MotionValue<number>,
  fn: (v: number) => T,
): MotionValue<T> {
  const value = useMotionValue<T>(fn(source.get()));
  useMotionValueEvent(source, "change", (v) => value.set(fn(v)));
  return value;
}

"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import type { RefObject } from "react";

// A 0→1 progress value the scene drives itself, instead of being scrubbed by
// the wheel.
//
// Deliberately the same SHAPE as useCinematicScroll: both return a plain
// MotionValue<number>, so a section swaps between scroll-driven and
// self-playing by changing one line, and every useScrollMapped call below it
// keeps working untouched. That is the whole reason the mapping layer was
// built to take a motion value rather than read scroll itself.
//
// It plays ONCE, the first time the section is properly on screen, and then
// stays where it ended. It does not rewind and does not replay.
//
// An earlier version rewound on exit so that scrolling back replayed it. That
// is worse here: this scene ends on the real photograph, which is the point it
// is making, and resetting it means anyone who scrolls back past the section
// finds the room turned into a painting again and the move restarting under
// them. Played once, the ending stays true.

export function useAutoplayProgress(
  ref: RefObject<HTMLElement | null>,
  seconds = 9,
): MotionValue<number> {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion gets the end state, not a slower version of the move.
    if (reduced) {
      progress.set(1);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Stop watching the moment it starts: one play, and no way for a
        // later intersection to interrupt or restart it.
        io.disconnect();
        controls.current = animate(progress, 1, {
          duration: seconds,
          // Gentle at both ends so the scene arrives and settles rather
          // than starting and stopping on a hard edge.
          ease: [0.4, 0, 0.3, 1],
        });
      },
      // Half the section visible: high enough that it does not start while
      // still a sliver at the bottom of the screen and finish unseen.
      { threshold: 0.5 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      controls.current?.stop();
    };
  }, [ref, reduced, seconds, progress]);

  return progress;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// The slider used by both the rooms and the dye workshop. Extracted rather
// than copied the moment a second section needed it — the centring maths and
// the two faults already found and fixed here (eager loading, clamped rather
// than wrapped arrows) are exactly the things that would drift apart between
// two copies.
//
// Centring is CSS-only and needs no measurement: the track is padded by half
// the leftover width, which centres slide 0, and slide i is centred by
// translating exactly i × (slide + gap). Correct at any viewport, any count.

export type Slide = {
  readonly src: string;
  readonly title: string;
  readonly alt: string;
};

export default function PeekSlider({
  slides,
  label,
}: {
  slides: readonly Slide[];
  label: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Which slides have been given a src. Plain `loading="lazy"` is wrong here
  // twice over: inside an overflow-hidden track a lazy image only starts
  // loading as it is translated in, which is a blank frame at the exact
  // moment of the click — and `loading` is read once, so it cannot be
  // changed later. So the window is managed instead: the current slide, its
  // two neighbours, and everything already visited. The set only grows,
  // so nothing ever unloads and going back is instant.
  //
  // It matters at ten slides: the dye spreads are 2.7MB together, and this
  // brings the first paint down to the two that can actually be seen.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]));
  useEffect(() => {
    setSeen((prev) => {
      const next = new Set(prev);
      for (const i of [index - 1, index, index + 1]) {
        if (i >= 0 && i < slides.length) next.add(i);
      }
      return next.size === prev.size ? prev : next;
    });
  }, [index, slides.length]);

  const count = slides.length;
  // Clamped, not wrapped: the track is one translated strip, so "previous"
  // from the first slide would sweep the whole thing backwards and read as a
  // rewind rather than as a wrap.
  const go = useCallback(
    (next: number) => setIndex(Math.max(0, Math.min(count - 1, next))),
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <>
      <div className="roomsStage" onKeyDown={onKeyDown}>
        <div className="roomsWindow">
          <motion.div
            className="roomsTrack"
            animate={{
              x: `calc(-${index} * (var(--slide-w) + var(--slide-gap)))`,
            }}
            transition={
              mounted && !reduced
                ? { duration: 0.66, ease: [0.65, 0, 0.35, 1] }
                : { duration: 0 }
            }
          >
            {slides.map((s, i) => (
              <figure
                className={`roomsSlide ${i === index ? "isActive" : ""}`}
                key={s.src}
                aria-hidden={i === index ? undefined : true}
              >
                {seen.has(i) ? (
                  <img src={s.src} alt={s.alt} decoding="async" />
                ) : (
                  <span className="roomsSlideHold" aria-hidden />
                )}
              </figure>
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          className="roomsArrow isPrev"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={`Previous ${label}`}
        >
          <span aria-hidden>‹</span>
        </button>
        <button
          type="button"
          className="roomsArrow isNext"
          onClick={() => go(index + 1)}
          disabled={index === count - 1}
          aria-label={`Next ${label}`}
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      <p className="serif roomsTitle" aria-live="polite">
        {slides[index].title}
      </p>
    </>
  );
}

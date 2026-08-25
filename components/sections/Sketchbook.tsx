"use client";

import { useCallback, useRef, useState } from "react";
import FilmBook from "@/components/sections/FilmBook";
import InteractiveSketchbook from "@/components/sections/InteractiveSketchbook";
import { scrollToY } from "@/lib/scroll/lenisControl";

// THE FIRST SKETCHBOOK, TWO WAYS THROUGH IT.
//
// Turning it by hand and scrubbing it with the wheel are two different
// pleasures, and the arrow version was built to replace the scroll one. That
// was a step too far: the client wanted the scrolled film kept. So neither is
// gone — this picks between them, the way the itinerary picks between Explore
// and Play.
//
//   TURN   InteractiveSketchbook — arrows turn the pages, the wheel is left
//          alone and keeps moving the visitor down the landing page. 168vh.
//   SCROLL FilmBook — the original scrubbed film, the cover opening onto the
//          two clips and closing again. 1200vh of sticky section.
//
// Both show the same pictures: the book's pages ARE frames of the film, taken
// at the beats their captions belong to. Changing mode changes how you move
// through them, not what you see.
//
// Default is TURN, because the brief that asked for it was explicit that the
// first sketchbook should be leafed through rather than scrolled. Switching is
// one click, and each mode carries the control back to the other.
export default function Sketchbook() {
  const [mode, setMode] = useState<"turn" | "scroll">("turn");
  const wrapRef = useRef<HTMLDivElement>(null);

  // The two modes are 168vh and 1200vh, so switching changes the height of the
  // section under the visitor's feet. Without this you switch out of the film
  // half way down and land 3,300px past a section that just got seven times
  // shorter — measured, not guessed. Re-anchoring to the top of the section is
  // the only honest answer: it is the same book either way, so you should be
  // looking at it either way.
  const switchTo = useCallback((next: "turn" | "scroll") => {
    setMode(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        scrollToY(el.getBoundingClientRect().top + window.scrollY, 0);
      });
    });
  }, []);

  return (
    <div ref={wrapRef}>
      {mode === "turn" ? (
        <InteractiveSketchbook onSwitchMode={() => switchTo("scroll")} />
      ) : (
        <FilmBook onSwitchMode={() => switchTo("turn")} />
      )}
    </div>
  );
}

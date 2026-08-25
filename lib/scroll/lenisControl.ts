"use client";

// A tiny registry so the entry gate can stop and start the smooth scroller.
//
// Lenis is created inside LenisProvider's effect and never escaped it, so
// there was no way to pause it from elsewhere. This keeps that instance
// private to the module rather than hanging it off `window`.
//
// Locking is belt and braces on purpose: Lenis is disabled entirely under
// prefers-reduced-motion, so `stop()` alone would leave the page scrollable
// for exactly the users least likely to want a moving gate. The `isGated`
// class on <html> holds the native scroller still in that case.

type Scroller = {
  stop: () => void;
  start: () => void;
  scrollTo?: (target: number, opts?: { duration?: number; immediate?: boolean }) => void;
};

let scroller: Scroller | null = null;

export function registerScroller(next: Scroller | null) {
  scroller = next;
}

// `overflow: hidden` is the layout half of the lock, but it has never been
// trustworthy on iOS Safari, which will still rubber-band the document. These
// cancel the input itself, which is the half that actually holds everywhere.
// Deliberately not `position: fixed` on <body> — that is the other common fix,
// but it collapses the document to viewport height, and every sticky section
// here would have its scroll range re-measured wrong on the way out.
const KEYS = new Set([
  " ",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
]);

const blockEvent = (e: Event) => e.preventDefault();
const blockKeys = (e: KeyboardEvent) => {
  // Tab must keep working, or the gate becomes a keyboard trap.
  if (KEYS.has(e.key)) e.preventDefault();
};

export function lockScroll() {
  scroller?.stop();
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("isGated");
  window.addEventListener("wheel", blockEvent, { passive: false });
  window.addEventListener("touchmove", blockEvent, { passive: false });
  window.addEventListener("keydown", blockKeys, { passive: false });
}

// Used by the phone remote. Goes through Lenis when it is running so the move
// is the same eased glide the wheel produces — a native scrollTo would fight
// it, since Lenis owns scrollTop and would drag the page back.
export function scrollToY(y: number, seconds = 1.1) {
  if (scroller?.scrollTo) {
    scroller.scrollTo(y, { duration: seconds });
    return;
  }
  window.scrollTo({ top: y, behavior: seconds > 0 ? "smooth" : "auto" });
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("isGated");
  window.removeEventListener("wheel", blockEvent);
  window.removeEventListener("touchmove", blockEvent);
  window.removeEventListener("keydown", blockKeys);
  scroller?.start();
}

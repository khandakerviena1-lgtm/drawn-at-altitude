"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { lockScroll, unlockScroll } from "@/lib/scroll/lenisControl";
import { identity, intro } from "@/lib/content/retreat";

// THE ENTRY GATE — the book opens itself, and you click to go in.
//
// NOT WIRED. Built 2026-08-12 to client direction, then rejected in favour of
// the scroll-driven opening it replaced; `page.tsx` no longer renders it and
// FilmBook opens its own cover again. Kept whole and working, the way
// FilmHero, SketchbookHero and FolioOpening are, so it costs one import to
// bring back. `lib/scroll/lenisControl.ts` exists only for this and is
// likewise dormant — nothing else locks the page.
//
// Everything else on this page is scroll-driven; this deliberately is not.
// The book plays its own opening once — the cover, then two leaves — settles
// on the first spread, and then holds completely still. It does not loop: a
// book riffling forever behind a title reads as restless, and "no hurry" is
// the register of the whole retreat.
//
// It is a real gate: the page will not scroll until Enter is clicked. Four
// things stop that becoming a trap.
//   1. The lock is applied in an effect, so it only ever exists where JS runs.
//   2. <noscript> hides the gate outright. Without this the fixed overlay
//      would cover the document forever for anyone whose JS failed, and no
//      amount of scrolling would get past it.
//   3. Escape enters, and the button takes focus when it appears, so the
//      keyboard path is the same length as the mouse one.
//   4. Under prefers-reduced-motion nothing animates: the book is already
//      open and Enter is already there.
//
// The gate settles on the first spread, which is the frame FilmBook begins
// on, so the handover is a cut between two identical images. That is why
// FilmBook no longer opens its own cover — this owns the opening, and
// FilmBook only closes the book at the end.

const EASE = [0.3, 0.1, 0.2, 1] as const;

// Where every leaf ends up: turned, and faded out past vertical. One face
// only, because a two-faced leaf under preserve-3d shows its mirrored
// underside (the trap documented in SketchbookHero).
const TURNED = { rotateY: -170, opacity: 0 };
const CLOSED = { rotateY: 0, opacity: 1 };

export default function BookIntro() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Hold the page still, and start from the top: a reload halfway down would
  // otherwise gate a view of the middle of the site.
  useEffect(() => {
    if (gone) return;
    window.scrollTo(0, 0);
    lockScroll();
    return () => unlockScroll();
  }, [gone]);

  const enter = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => {
      unlockScroll();
      setGone(true);
    }, 620);
  }, []);

  useEffect(() => {
    if (gone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter, gone]);

  useEffect(() => {
    if (gone) return;
    const t = window.setTimeout(
      () => buttonRef.current?.focus(),
      reduced ? 60 : 2900,
    );
    return () => window.clearTimeout(t);
  }, [gone, reduced]);

  if (gone) return null;

  // Server and first client render must agree, so the build only begins once
  // mounted. Reduced motion reaches the same end state with no duration.
  const target = mounted ? TURNED : CLOSED;
  const instant = { duration: 0 };

  return (
    <>
      <noscript>
        <style>{`.gate{display:none!important}`}</style>
      </noscript>
      <motion.div
        className="gate"
        role="dialog"
        aria-modal="true"
        aria-label="Enter Drawn at Altitude"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.62, ease: "easeInOut" }}
      >
        <div className="gateStage">
          <motion.div
            className="gateBook"
            animate={{ scale: leaving ? 1.07 : 1 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
            <div className="gateCast" />
            <div className="gateLeaves" />

            {/* What the book settles open at — and the frame FilmBook starts
                on, so entering is a cut between two identical images. */}
            <div className="gateSpread">
              <div className="gateGutter" />
              <div className="gatePlate">
                <img src="/video-posters/book-a.webp" alt="" aria-hidden />
              </div>
            </div>

            {/* Two plain leaves, so the book riffles rather than merely
                opening on its first page. */}
            {[0, 1].map((i) => (
              <motion.div
                className="gateLeaf"
                key={i}
                initial={CLOSED}
                animate={target}
                transition={
                  reduced
                    ? instant
                    : {
                        rotateY: {
                          delay: 1.35 + i * 0.6,
                          duration: 0.8,
                          ease: EASE,
                        },
                        opacity: { delay: 1.85 + i * 0.6, duration: 0.35 },
                      }
                }
              />
            ))}

            <motion.div
              className="gateCover"
              initial={CLOSED}
              animate={mounted ? { rotateY: -172, opacity: 0 } : CLOSED}
              transition={
                reduced
                  ? instant
                  : {
                      rotateY: { delay: 0.5, duration: 1.05, ease: EASE },
                      opacity: { delay: 1.15, duration: 0.4 },
                    }
              }
            >
              <img
                src="/img/book-cover.webp"
                alt="The sketchbook cover — Travel Sketching Retreat, Indian Himalayas 2027"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="gateText">
          <p className="typoEyebrow">{identity.kicker}</p>
          <p className="typoDisplay gateTitle">{identity.title}</p>
          <p className="gateSupport">{intro.statement}</p>
          <motion.button
            ref={buttonRef}
            type="button"
            className="gateEnter"
            onClick={enter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 2.85, duration: 0.6 }}
          >
            Enter
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

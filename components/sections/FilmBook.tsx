"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCinematicScroll } from "@/lib/animation/useCinematicScroll";
import { CAMERA_EASE, useScrollMapped } from "@/lib/animation/useScrollMapped";
import { useScrubbedVideo } from "@/lib/animation/useScrubbedVideo";
import { scrollToY } from "@/lib/scroll/lenisControl";
import {
  bookBeatsA,
  bookBeatsB,
  bookPins,
  filmHandover,
  hero,
  identity,
  sketchbookModes,
} from "@/lib/content/retreat";

// THE FILM, TIPPED INTO A SKETCHBOOK.
//
// Three problems with showing it full-bleed, all fixed by giving it an object
// to live in:
//
// 1. `object-fit: cover` on a 1.667 film cropped it hard at every viewport it
//    did not happen to match. Here it sits *inside* the page at its own
//    aspect, so nothing is cut.
// 2. Copy over film needed a scrim to survive cream pages, and still fought
//    the image. Here it is written on the paper below the image, dark on
//    cream — legible at a size that no longer shouts.
// 3. The room→river transition was a zoom through a window, which read as
//    abrupt. Here it is a page turning: a physical event, not an optical one.
//
// So the film plays as a print tipped onto the spread, the caption is written
// under it, and scroll does three things at once — scrubs the clip, breathes
// the book in the reader's hands, and at the seam turns the leaf.
//
// Two clips rather than one: `book-a` runs to the room, the page turns, and
// `book-b` carries the river onward. The turn is the transition, so the clips
// need no optical join at all.
//
// Encoding note that outranks this file: both clips carry a keyframe every 10
// frames. At a default GOP the scrub stutters however good the code is.

const DUR_A = 8.83;
const DUR_B = 13.2;
// The section opens on a closed book seen square on, and closes the same way:
//   0.00–0.04  the card — straight, front on, the cover facing the reader
//   0.04–0.13  the cover swings open on its left hinge as the card grows
//   0.13–0.17  the spread beneath, still fogged; three pins name three places
//   0.17–0.46  book-a       0.46–0.52  the leaf turns       0.52–0.90  book-b
//   0.90–0.96  the world compresses back and the cover closes over it
//   0.96–1.00  the card again, straight, with the closing line beside it
//
// An autoplaying entry gate that did this opening for you, with a click to
// come in, was built and rejected — kept unwired in BookIntro.tsx. Scroll
// owns the opening again, which is why the cover both opens and closes here.
const COVER_HOLD = 0.04;
const COVER_OPEN = 0.13;
const IN_END = 0.17;
const TURN_START = 0.46;
const TURN_END = 0.52;
const OUT_START = 0.9;
const COVER_CLOSE = 0.96;

type Beat = { at: number; to: number; line: string; notes: readonly string[] };

// The book's stops, in order: the closed card, the middle of each caption beat,
// and the closed card again at the end. Derived from the beats rather than
// written out, so retiming a caption moves its page with it and the two can
// never drift apart.
const STOPS: readonly number[] = [
  0.02,
  ...[...bookBeatsA, ...bookBeatsB].map((b) => (b.at + b.to) / 2),
  0.975,
];

// The softness of the edge the picture arrives behind, in percent of the
// spread. Wide enough to read as a wash rather than a wipe.
const FORM_FEATHER = 26;

// One component per beat: hooks stay out of a map loop, and each caption owns
// its own arrival.
function BookCaption({ p, beat }: { p: MotionValue<number>; beat: Beat }) {
  const { at, to, line, notes } = beat;
  const f = 0.014;

  const opacity = useScrollMapped(p, [at, at + f, to - f, to], [0, 1, 1, 0]);
  // Ink settling rather than a UI slide: the line rises a little and its
  // letter-spacing closes, the way type resolves as a lens finds it.
  const y = useScrollMapped(p, [at, at + f * 2.2], [14, 0]);
  const letterSpacing = useScrollMapped(
    p,
    [at, at + f * 2.2],
    ["0.06em", "0.008em"],
  );
  const noteOpacity = useScrollMapped(
    p,
    [at + f, at + f * 3, to - f, to],
    [0, 1, 1, 0],
  );

  return (
    <motion.div className="bookCaption" style={{ opacity }}>
      <motion.p className="serif bookCaptionLine" style={{ y, letterSpacing }}>
        {line}
      </motion.p>
      <motion.div className="bookCaptionNotes" style={{ opacity: noteOpacity }}>
        {notes.map((n) => (
          <p className="hand bookCaptionNote" key={n}>
            {n}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function FilmBook({
  onSwitchMode,
}: {
  onSwitchMode?: () => void;
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  // Damped, not raw: see useCinematicScroll.
  const p = useCinematicScroll(containerRef);

  // Each clip gets its own 0→1 across its half of the section.
  // Explicit generic: literal inference would type these MotionValue<0 | 1>,
  // which useScrubbedVideo rightly refuses.
  const pA = useScrollMapped<number>(p, [IN_END, TURN_START], [0, 1]);
  const pB = useScrollMapped<number>(p, [TURN_END, OUT_START], [0, 1]);
  useScrubbedVideo(videoARef, pA, DUR_A);
  useScrubbedVideo(videoBRef, pB, DUR_B);

  // The card, and crossing into it. It begins square on and dead straight —
  // a book presented to the reader, not a spread already in perspective — and
  // only picks up a few degrees once it is open, which is when the tilt starts
  // meaning "held" rather than "styled". It goes straight again to close.
  const bookScale = useScrollMapped(
    p,
    [0, COVER_HOLD, IN_END, OUT_START, COVER_CLOSE, 1],
    [0.46, 0.46, 1, 1, 0.5, 0.5],
    CAMERA_EASE,
  );
  const rotateX = useScrollMapped(
    p,
    [0, COVER_HOLD, IN_END, TURN_END, OUT_START, COVER_CLOSE, 1],
    [0, 0, 6, 4, 6, 0, 0],
    CAMERA_EASE,
  );
  const rotateY = useScrollMapped(
    p,
    [0, COVER_HOLD, IN_END, TURN_END, OUT_START, COVER_CLOSE, 1],
    [0, 0, -4, 2, -3, 0, 0],
    CAMERA_EASE,
  );
  // A card floats; a page you are inside does not. The shadow answers to that.
  // The title and the card were overlapping by 17px at 430x325, measured — the
  // card is centred in the sticky viewport while the title is absolutely placed
  // near its top, so at small viewport heights they meet. Rather than shrink
  // the card or move the title off the design, the book sits lower while the
  // title is on screen and rises into the centre as the title leaves. The
  // collision only exists during the card phase, so the fix only lasts as long.
  const bookY = useScrollMapped(
    p,
    [0, COVER_HOLD, IN_END, OUT_START, COVER_CLOSE, 1],
    ["9vh", "9vh", "0vh", "0vh", "9vh", "9vh"],
    CAMERA_EASE,
  );

  const castOpacity = useScrollMapped(
    p,
    [0, COVER_HOLD, IN_END, OUT_START, COVER_CLOSE, 1],
    [1, 1, 0.35, 0.35, 1, 1],
  );

  // The cover. Hinged at the left and one-faced, for the same reason the
  // turning leaf is: a two-faced page under preserve-3d shows its mirrored
  // underside. It opens once, stays open through the film, and shuts at the
  // end — so a single mapping carries both directions.
  const coverY = useScrollMapped(
    p,
    [0, COVER_HOLD, COVER_OPEN, OUT_START, COVER_CLOSE, 1],
    [0, 0, -170, -170, 0, 0],
    CAMERA_EASE,
  );
  const coverOpacity = useScrollMapped(
    p,
    [0, 0.092, COVER_OPEN, 0.925, 0.962, 1],
    [1, 1, 0, 0, 1, 1],
  );
  const coverShade = useScrollMapped(
    p,
    [COVER_HOLD, 0.07, COVER_OPEN, OUT_START, 0.93, COVER_CLOSE],
    [0, 0.45, 0, 0, 0.45, 0],
  );
  // THE PAGE IS BLANK FIRST, AND THE PICTURE ARRIVES ON IT.
  //
  // Both spreads used to carry their film the moment they were uncovered, so
  // the cover opened onto a finished picture and the leaf turned onto another
  // one. A sketchbook does not work like that: you turn onto paper, and then
  // the page fills. So each plate is masked away behind a soft diagonal edge
  // that travels across the spread, and the `.filmBookSpread` paper underneath
  // is what you see until it has passed.
  //
  // Spread B's window opens exactly at TURN_END, which means the whole turn is
  // performed onto genuinely empty paper — while the leaf is moving there is
  // nothing underneath it yet, which is the point.
  const formA = useScrollMapped<number>(
    p,
    [0.125, 0.185],
    [-FORM_FEATHER, 100],
    CAMERA_EASE,
  );
  const formB = useScrollMapped<number>(
    p,
    [TURN_END, TURN_END + 0.055],
    [-FORM_FEATHER, 100],
    CAMERA_EASE,
  );
  const formAEnd = useTransform(formA, (v) => v + FORM_FEATHER);
  const formBEnd = useTransform(formB, (v) => v + FORM_FEATHER);
  const maskA = useMotionTemplate`linear-gradient(105deg, #000 ${formA}%, transparent ${formAEnd}%)`;
  const maskB = useMotionTemplate`linear-gradient(105deg, #000 ${formB}%, transparent ${formBEnd}%)`;
  // Colour arrives a beat behind the shape, the way a wash dries into paper.
  // Without this the travelling edge reads as a wipe rather than as ink taking.
  const developA = useScrollMapped(
    p,
    [0.125, 0.2],
    ["saturate(0.35) contrast(0.92)", "saturate(1) contrast(1)"],
  );
  const developB = useScrollMapped(
    p,
    [TURN_END, TURN_END + 0.07],
    ["saturate(0.35) contrast(0.92)", "saturate(1) contrast(1)"],
  );

  // The pins name three places while the page is still fogged, then get out of
  // the way before the cloud gives the first one back.
  const pinOpacity = useScrollMapped(p, [0.1, 0.125, 0.145, 0.165], [0, 1, 1, 0]);

  // The turn. One face only, faded out past vertical — a two-faced leaf under
  // preserve-3d shows its mirrored underside (see SketchbookHero).
  const turnY = useScrollMapped(p, [TURN_START, TURN_END], [0, -168], CAMERA_EASE);
  const turnOpacity = useScrollMapped(
    p,
    [TURN_START + 0.035, TURN_END],
    [1, 0],
  );
  const turnShadow = useScrollMapped(
    p,
    [TURN_START, TURN_START + 0.03, TURN_END],
    [0, 0.5, 0],
  );

  // The title keeps the card company, the way the reference site sets its
  // heading beside the postcard, and leaves as the page takes the frame.
  const titleOpacity = useScrollMapped(p, [0.1, 0.15], [1, 0]);
  // The hint used to say "scroll" and leave almost immediately. Two things were
  // wrong with that: it never said the film runs *backwards* too, which is the
  // one thing about this section a reader cannot guess; and it left before the
  // cover had finished opening, so it vanished exactly while the reader was
  // still working out what they were looking at. It now stays until the film
  // itself has started.
  // Present the instant the reader lands, not after they have already worked
  // out that scrolling is the thing to do. The old window started at 0.008,
  // which meant the hint was invisible at scroll position zero — the one
  // moment it exists for.
  const hintOpacity = useScrollMapped(p, [0, 0.15, 0.19], [1, 1, 0]);
  // A way past the sketchbook, available the whole way through — not only at
  // the start. Someone who is two beats in and wants the practical detail
  // should not have to scroll the rest of the film to reach it.
  const skipOpacity = useScrollMapped(p, [0, 0.86, 0.92], [1, 1, 0]);
  const skipPointer = useTransform(skipOpacity, (o) => (o > 0.5 ? "auto" : "none"));
  // The closing line arrives once the cover has shut over the world again.
  const handoverOpacity = useScrollMapped(p, [0.955, 0.985], [0, 1]);

  // Next / previous page. The book is scroll-driven, so a page arrow is a
  // scroll to that page's position rather than a second state machine — one
  // source of truth, and the arrows and the wheel can never disagree about
  // which page you are on.
  const turnPage = useCallback(
    (dir: 1 | -1) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const range = r.height - window.innerHeight;
      if (range <= 0) return;
      // Indexed off the page the counter is showing, not off a threshold
      // against the raw progress. Searching for "the next stop past here" made
      // the very first click a no-op: at the top of the section progress is 0,
      // stop 0 is 0.02, so the arrow scrolled 72px and stayed on page 1. One
      // click is one page, always.
      const i = pageRef.current - 1 + dir;
      if (i < 0 || i >= STOPS.length) return;
      scrollToY(top + STOPS[i] * range, 1.05);
    },
    [],
  );

  // Which page we are on: state for the counter, a ref for the arrows. The ref
  // is what keeps `turnPage` from being rebuilt on every page change, and it is
  // current the instant progress moves rather than after React has re-rendered
  // — two clicks in quick succession therefore advance two pages.
  const [page, setPage] = useState(1);
  const pageRef = useRef(1);
  useMotionValueEvent(p, "change", (v) => {
    let i = 0;
    for (let k = 0; k < STOPS.length; k++) if (v >= STOPS[k] - 0.006) i = k;
    pageRef.current = i + 1;
    setPage(i + 1);
  });

  // Skip lands on the section's own bottom edge, which is where the next
  // section begins. Routed through Lenis rather than window.scrollTo — Lenis
  // owns scrollTop while it runs and would drag a native jump straight back.
  const skip = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    scrollToY(r.top + window.scrollY + r.height, 1.2);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced && mounted) {
    return (
      <section
        ref={containerRef}
        className="filmBook isStill"
        aria-label="Drawn at Altitude — introduction"
      >
        <div className="filmBookStill">
          <p className="typoEyebrow">{identity.kicker}</p>
          <h1 className="typoDisplay">{identity.title}</h1>
          <p className="typoBody heroSub">{hero.sub}</p>
          <img
            className="filmBookStillImage"
            src="/img/book-cover.webp"
            alt="The sketchbook cover — Travel Sketching Retreat, Indian Himalayas 2027 — laid over a map, brushes and open sketchbooks"
          />
          <img
            className="filmBookStillImage"
            src="/video-posters/book-b.webp"
            alt="An open sketchbook held against the bank of the Indus, the three wicker chairs on the page drawn from the three standing behind it"
          />
          {[...bookBeatsA, ...bookBeatsB].map((b) => (
            <p className="serif bookCaptionLine isStatic" key={b.at}>
              {b.line}
            </p>
          ))}
          <p className="serif bookCaptionLine isStatic">
            {filmHandover.statement}
          </p>
          <p className="typoLabel">{filmHandover.label}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="filmBook"
      aria-label="Drawn at Altitude — introduction"
    >
      <div className="filmBookSticky">
        <motion.div className="filmBookTitle" style={{ opacity: titleOpacity }}>
          <p className="typoEyebrow">{identity.kicker}</p>
          <h1 className="typoDisplay">{identity.title}</h1>
        </motion.div>

        <div className="filmBookStage">
          <motion.div
            className="filmBookWrap"
            style={{ rotateX, rotateY, scale: bookScale, y: bookY }}
          >
            <motion.div
              className="filmBookCast"
              style={{ opacity: castOpacity }}
            />
            <div className="filmBookLeaves" />

            {/* The spread underneath — revealed as the leaf turns. */}
            <div className="filmBookSpread">
              <div className="filmBookGutter" />
              <motion.div
                className="filmBookPlate"
                style={{ maskImage: maskB, WebkitMaskImage: maskB, filter: developB }}
              >
                <video
                  ref={videoBRef}
                  className="filmBookVideo"
                  src="/video/book-b.mp4"
                  poster="/video-posters/book-b.webp"
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Moved through by scrolling: the Indus and its riverside chairs beside the same chairs drawn, sea buckthorn picked by hand beside the same branch drawn, then the finished sketchbook — places, a bluethroat, and the evening table"
                />
              </motion.div>
            </div>

            {/* The leaf that turns, carrying the first half of the film. */}
            <motion.div
              className="filmBookSpread filmBookTurn"
              style={{ rotateY: turnY, opacity: turnOpacity }}
            >
              <div className="filmBookGutter" />
              <motion.div
                className="filmBookPlate"
                style={{ maskImage: maskA, WebkitMaskImage: maskA, filter: developA }}
              >
                <video
                  ref={videoARef}
                  className="filmBookVideo"
                  src="/video/book-a.mp4"
                  poster="/video-posters/book-a.webp"
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Moved through by scrolling: cloud clears onto a painted monastery, the page travels across the spread, and a room at the camp rises to its window over the Indus"
                />
                <motion.div
                  className="filmBookPins"
                  style={{ opacity: pinOpacity }}
                  aria-hidden
                >
                  {bookPins.map((pin) => (
                    <span
                      className="filmBookPin"
                      key={pin.label}
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    >
                      <span className="filmBookPinDot" />
                      <span className="hand filmBookPinLabel">{pin.label}</span>
                    </span>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                className="filmBookTurnShade"
                style={{ opacity: turnShadow }}
              />
            </motion.div>

            {/* The cover, closed over everything to begin with. The reader
                meets a book before they meet a page. */}
            <motion.div
              className="filmBookCover"
              style={{ rotateY: coverY, opacity: coverOpacity }}
            >
              <img
                className="filmBookCoverArt"
                src="/img/book-cover.webp"
                alt="The sketchbook cover — Travel Sketching Retreat, Indian Himalayas 2027 — laid over a map, brushes and open sketchbooks"
              />
              <motion.div
                className="filmBookTurnShade"
                style={{ opacity: coverShade }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Both leaves' captions, written on the ivory under the book. Their
            windows never overlap, so one slot holds all of them and only one
            is ever on screen. */}
        <div className="bookCaptionSlot">
          {[...bookBeatsA, ...bookBeatsB].map((beat) => (
            <BookCaption key={beat.at} p={p} beat={beat} />
          ))}
          <motion.div
            className="bookCaption isHandover"
            style={{ opacity: handoverOpacity }}
          >
            <p className="serif bookCaptionLine">{filmHandover.statement}</p>
            <p className="typoLabel bookCaptionLabel">{filmHandover.label}</p>
          </motion.div>
        </div>

        {/* Guidance, and a way out. Both sit under the book rather than over
            it, so neither ever covers the film. */}
        <motion.div className="scrollHint" style={{ opacity: hintOpacity }}>
          <span className="scrollHintArrows" aria-hidden>
            <svg viewBox="0 0 12 30" className="scrollHintGlyph">
              <path d="M6 2v26M6 2 2.6 5.8M6 2l3.4 3.8M6 28l-3.4-3.8M6 28l3.4-3.8" />
            </svg>
          </span>
          <span className="scrollHintText">
            Scroll up and down — the film follows you both ways
          </span>
        </motion.div>

        {/* Turning the pages by hand, for readers who would rather click than
            scroll. Placed under the book rather than over its edges, so they
            never sit on the picture. */}
        <motion.div className="filmBookPager" style={{ opacity: skipOpacity, pointerEvents: skipPointer }}>
          <button
            type="button"
            className="filmBookPage"
            onClick={() => turnPage(-1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <span aria-hidden>&#8592;</span>
          </button>
          <span className="typoLabel filmBookPageNum">
            {page} / {STOPS.length}
          </span>
          <button
            type="button"
            className="filmBookPage"
            onClick={() => turnPage(1)}
            disabled={page >= STOPS.length}
            aria-label="Next page"
          >
            <span aria-hidden>&#8594;</span>
          </button>
        </motion.div>

        {onSwitchMode && (
          <motion.button
            type="button"
            className="typoLabel filmBookMode"
            style={{ opacity: skipOpacity, pointerEvents: skipPointer }}
            onClick={onSwitchMode}
          >
            {sketchbookModes.turn}
          </motion.button>
        )}

        <motion.button
          type="button"
          className="typoLabel filmBookSkip"
          style={{ opacity: skipOpacity, pointerEvents: skipPointer }}
          onClick={skip}
        >
          Skip the sketchbook <span aria-hidden>↓</span>
        </motion.button>
      </div>
    </section>
  );
}

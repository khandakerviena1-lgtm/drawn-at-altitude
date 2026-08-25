"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import {
  identity,
  sketchbookCues,
  sketchbookModes,
  sketchbookPages,
} from "@/lib/content/retreat";

// THE FIRST SKETCHBOOK — turned by hand, with three pages you can look around.
//
// Arrows flip the pages. The wheel is never captured: the section is a normal
// block, so scrolling past it behaves like scrolling past anything else. This
// does not replace the scrubbed film — `Sketchbook.tsx` picks between the two,
// and the pages here ARE frames of that film, so switching mode changes how
// you move, not what you see.
//
// TWO KINDS OF PAGE, and the difference is the whole idea of the section.
//
//   DRAWN   a finished spread. It appears when the leaf lands, at once. No
//           staged materialising — the client asked for the drawing to arrive
//           without animation, and a page that paints itself is a different
//           story from a page someone already drew.
//
//   SCENE   the real place, and the only pages that scroll. Each is a segment
//           of the film where the camera travels between the place and the
//           sketchbook: the bed rising to the window, the mountains coming
//           down to the chairs and the open book, the picker down to the drawn
//           branch. Scrolling one of those is looking up and down between what
//           is in front of you and what is on your page.
//
// THE SCENE SCROLL IS A REAL SCROLL CONTAINER, not a hijacked wheel. The pane
// is `overflow-y: auto` with a tall spacer, and its scrollTop drives the clip's
// currentTime. Two consequences that both matter: when the pane runs out, the
// browser chains to the document and the landing page carries on by itself;
// and touch, keyboard and trackpad all work without a line of gesture code.
// `data-lenis-prevent` keeps Lenis's smooth scroller off it, or the wheel would
// be swallowed before the pane ever saw it.
//
// THE BOOK MODEL IS A REAL ONE. Each plate is a whole spread, so the book shows
// its left and right halves side by side. Turning forward lifts the right half
// at the spine and lays it on the left; the leaf's underside is bare paper.
//
// THE DESTINATION PAGE IS ALREADY THERE, from the first instant of a turn —
// not revealed after a pause. A real sketchbook has no moment where the next
// spread does not exist yet; it is simply under the page you are turning.
// (An earlier version staged a deliberate blank beat here, at a different
// brief's request. This supersedes it.)

const SEGMENTS = 3; // nested panels across the leaf — this is what makes it bend

const TURN_MS = 1000;
const RM_TURN_MS = 160;

const TURN_EASE = [0.42, 0, 0.32, 1] as const;

type Dir = 1 | -1;
type Page = (typeof sketchbookPages)[number];

const plate = (p: Page) => `/img/sketchbook/${p.key}-colour.webp`;

/* ------------------------------------------------------------------- scene */

// A place you can look around in. The pane scrolls; the clip follows it.
function ScenePane({ page }: { page: Page }) {
  const paneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  const scene = page.scene!;

  useEffect(() => {
    const pane = paneRef.current;
    const video = videoRef.current;
    if (!pane || !video) return;

    const { from, to } = scene;
    let queued = false;

    const seek = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const max = pane.scrollHeight - pane.clientHeight;
        const t = max > 0 ? Math.min(1, Math.max(0, pane.scrollTop / max)) : 0;
        const time = from + t * (to - from);
        // Both clips carry a keyframe every 10 frames, which is what makes
        // seeking this often survivable at all.
        if (Math.abs(video.currentTime - time) > 0.01) video.currentTime = time;
        setAtEnd(t > 0.92);
      });
    };

    const start = () => {
      video.currentTime = from;
    };
    if (video.readyState >= 1) start();
    else video.addEventListener("loadedmetadata", start);

    pane.scrollTop = 0;
    pane.addEventListener("scroll", seek, { passive: true });
    return () => {
      video.removeEventListener("loadedmetadata", start);
      pane.removeEventListener("scroll", seek);
    };
  }, [scene]);

  return (
    <>
      <div className="sbPane" ref={paneRef} data-lenis-prevent>
        <div className="sbPaneSticky">
          <video
            ref={videoRef}
            className="sbPaneVideo"
            src={`/video/book-${scene.clip}.mp4`}
            poster={plate(page)}
            muted
            playsInline
            preload="auto"
            aria-label={page.alt}
          />
        </div>
        <div className="sbPaneSpacer" />
      </div>

      {/* How the scrolling is done, shown rather than described. It goes quiet
          once you have reached the bottom and made the point. */}
      <div className={`sbScrollHint${atEnd ? " isDone" : ""}`} aria-hidden>
        <svg viewBox="0 0 14 44" className="sbScrollGlyph">
          <path d="M7 4v36M7 4 3 9M7 4l4 5M7 40l-4-5M7 40l4-5" />
        </svg>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- leaf */

// The turning sheet: SEGMENTS nested panels, each hinged on the edge of the one
// before it, so the outer corner travels further and faster than the paper at
// the spine and the sheet bends instead of pivoting like a card. Front is the
// page you were on; back is bare paper.
function Leaf({
  dir,
  page,
  turn,
}: {
  dir: Dir;
  page: Page;
  turn: ReturnType<typeof useMotionValue<number>>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const segRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const castRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (t: number) => {
      const a = t * 180 * (dir === 1 ? -1 : 1);
      if (rootRef.current) rootRef.current.style.transform = `rotateY(${a}deg)`;
      // Nothing at rest, most of it mid-turn, gone again as the sheet lies
      // down: a page is only curved while it is being held.
      const bend = Math.sin(Math.PI * t) * 15 * (dir === 1 ? -1 : 1);
      for (let i = 1; i < SEGMENTS; i++) {
        const el = segRefs.current[i];
        if (el) el.style.transform = `rotateY(${bend}deg)`;
      }
      const shade = Math.sin(Math.PI * t) * 0.5;
      for (const el of shadeRefs.current) if (el) el.style.opacity = String(shade);
      if (castRef.current) {
        const c = Math.sin(Math.PI * t);
        castRef.current.style.opacity = String(0.55 * c);
        castRef.current.style.transform = `scaleX(${1 - 0.55 * c})`;
      }
    };
    apply(turn.get());
    return turn.on("change", apply);
  }, [turn, dir]);

  // Forward turns carry the right half (slices 3,4,5 of six across the spread),
  // backward turns the left half (2,1,0, outward from the spine).
  const sliceAt = (i: number) => (dir === 1 ? 3 + i : 2 - i);

  const build = (i: number): React.ReactNode => {
    if (i >= SEGMENTS) return null;
    return (
      <div
        className="sbSeg"
        ref={(el) => {
          segRefs.current[i] = el;
        }}
        style={i === 0 ? undefined : dir === 1 ? { left: "100%" } : { right: "100%" }}
      >
        <div
          className="sbFace isFront"
          style={{
            backgroundImage: `url(${plate(page)})`,
            backgroundPosition: `${(sliceAt(i) / 5) * 100}% 50%`,
          }}
        />
        <div className="sbFace isBack" />
        <div
          className="sbFaceShade"
          ref={(el) => {
            shadeRefs.current[i] = el;
          }}
        />
        {build(i + 1)}
      </div>
    );
  };

  return (
    <>
      <div className={`sbCast is${dir === 1 ? "Fwd" : "Back"}`} ref={castRef} />
      <div className={`sbLeaf is${dir === 1 ? "Fwd" : "Back"}`} ref={rootRef}>
        {build(0)}
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- section */

export default function InteractiveSketchbook({
  onSwitchMode,
}: {
  onSwitchMode?: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<Dir>(1);
  const [phase, setPhase] = useState<"idle" | "turning">("idle");
  const [nudged, setNudged] = useState(false);
  const [inView, setInView] = useState(false);

  const turn = useMotionValue<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const busy = useRef(false);
  // The departing page's picture, for the turning leaf's front face. `current`
  // moves to the destination the instant a turn starts (see go()), so by the
  // time Leaf renders, `page` is already the NEW page — this is the only
  // record of what the leaf itself should show while it is in the air.
  const fromPageRef = useRef<Page>(sketchbookPages[0]);

  const isTurning = phase !== "idle";
  const page = sketchbookPages[current];

  // Only this page and its neighbours.
  useEffect(() => {
    for (const i of [current - 1, current, current + 1]) {
      const p = sketchbookPages[i];
      if (p) new Image().src = plate(p);
    }
  }, [current]);

  const go = useCallback(
    (d: Dir) => {
      if (busy.current) return;
      const next = current + d;
      if (next < 0 || next >= sketchbookPages.length) return;

      busy.current = true;
      setNudged(true);
      setDir(d);
      fromPageRef.current = page;
      // The destination's picture is already underneath before the leaf has
      // moved at all — a real page does not wait for you to finish turning
      // the one in front of it to exist. `current` (and so `page`, `sbCount`,
      // the caption) all flip to the new page in this same tick.
      setCurrent(next);
      setPhase("turning");
      turn.set(0);

      animate(turn, 1, {
        duration: (reduced ? RM_TURN_MS : TURN_MS) / 1000,
        ease: reduced ? "linear" : [...TURN_EASE],
        onComplete: () => {
          turn.set(0);
          setPhase("idle");
          busy.current = false;
        },
      });
    },
    [current, page, reduced, turn],
  );

  // Left/Right only, and only while the book holds focus — Up and Down belong
  // to the page, and inside a scene pane they belong to the pane.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    },
    [go],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const atStart = current === 0;
  const atEnd = current === sketchbookPages.length - 1;

  return (
    <section
      ref={sectionRef}
      id="sketchbook"
      className="sb"
      aria-label="The first sketchbook"
    >
      <div className="sbTitle">
        {/* The lockup lives here now, in the page, since the fixed header it
            rode on is gone — see Navigation.tsx. */}
        <p className="typoLabel sbProducers">{identity.producers}</p>
        <p className="typoEyebrow">{identity.kicker}</p>
        <h1 className="typoDisplay">{identity.title}</h1>
        {onSwitchMode && (
          <div className="sbModes">
            <span className="typoLabel sbModeOn">{sketchbookModes.turn}</span>
            <button type="button" className="typoLabel sbModeOff" onClick={onSwitchMode}>
              {sketchbookModes.scroll}
            </button>
          </div>
        )}
        <p className="sbModeHint">{sketchbookModes.turnHint}</p>
      </div>

      <div className="sbScene">
        <div
          className="sbBook"
          tabIndex={0}
          role="group"
          aria-roledescription="sketchbook"
          aria-label={`Sketchbook, page ${current + 1} of ${sketchbookPages.length}: ${page.title}`}
          onKeyDown={onKeyDown}
        >
          <div className="sbBoard" aria-hidden />

          {/* Bare paper underneath, always — what the leaf's blank back is
              made of, and what would show if a page ever had nothing on it. */}
          <div className="sbHalf isLeft" aria-hidden />
          <div className="sbHalf isRight" aria-hidden />

          {/* The destination page, present from the first instant of a turn —
              not after it. A real book never has an empty spread waiting for
              you to finish the page you are turning. */}
          {page.scene ? (
            <ScenePane key={page.key} page={page} />
          ) : (
            <>
              <div
                className="sbPlate isLeft"
                style={{ backgroundImage: `url(${plate(page)})` }}
                aria-hidden
              />
              <div
                className="sbPlate isRight"
                style={{ backgroundImage: `url(${plate(page)})` }}
                aria-hidden
              />
            </>
          )}

          {phase === "turning" && (
            <Leaf dir={dir} page={fromPageRef.current} turn={turn} />
          )}

          <div className="sbGutter" aria-hidden />

          <img className="sbA11y" src={plate(page)} alt={page.alt} />
        </div>

        <button
          type="button"
          className="sbArrow isPrev"
          onClick={() => go(-1)}
          disabled={atStart || isTurning}
          aria-label="Previous sketchbook page"
        >
          <span aria-hidden>&#8592;</span>
        </button>
        <button
          type="button"
          className={`sbArrow isNext${inView && !nudged ? " isNudge" : ""}`}
          onClick={() => go(1)}
          disabled={atEnd || isTurning}
          aria-label="Next sketchbook page"
        >
          <span aria-hidden>&#8594;</span>
        </button>
      </div>

      <div className="sbCaption">
        <p className="serif sbCaptionLine">{page.line}</p>
        {page.scene ? (
          <p className="typoLabel sbSceneCue">{sketchbookCues.scene}</p>
        ) : (
          <p className="hand sbCaptionNote">{page.note}</p>
        )}
        <p className="typoLabel sbCount">
          {page.title} · {current + 1} / {sketchbookPages.length}
        </p>
      </div>

      <motion.p
        className="sbCue isDown"
        initial={false}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        <span className="typoLabel">{sketchbookCues.down}</span>
        <span aria-hidden>&#8595;</span>
      </motion.p>

      <p className="sbLive" role="status" aria-live="polite">
        {phase === "idle" ? `Page ${current + 1}: ${page.title}` : ""}
      </p>
    </section>
  );
}

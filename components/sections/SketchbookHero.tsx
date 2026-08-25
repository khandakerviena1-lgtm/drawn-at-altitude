"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import AnimatedInkPath from "@/components/sketch/AnimatedInkPath";
import {
  useScrollComputed,
  useScrollMapped,
} from "@/lib/animation/useScrollMapped";
import {
  CONTOUR_CONSTRUCTION,
  CONTOUR_PRIMARY,
  CONTOUR_VIEWBOX,
} from "@/components/sketch/paths";
import { hero, identity } from "@/lib/content/retreat";

// Scenes 00–02 as one continuous transformation:
// graphite line → notebook as a physical object → cover opens onto a drawn
// page → the camera pushes in on that page → then pulls back out, and the
// reel is behind it, running. Full mapping in /docs/MOTION-SYSTEM.md.
//
// The book no longer opens straight onto Indus footage. It opens onto *paper*,
// carrying the contour drawn in scene 00 — a sketchbook contains a page, not a
// film. The place arrives afterwards, on the pull-back, as the reel.
//
// Scroll ranges, with four deliberate holds (nothing moves — the hold is the
// point; luxury here is time given to look):
//   .00–.13  first line draws and lifts
//   .09–.22  book arrives (paper spring)
//   .22–.30  HOLD — the object settles, read as cloth/board/paper
//   .30–.52  cover swings open on its top hinge
//   .52–.58  HOLD — the drawn page is revealed
//   .58–.72  camera pushes in on the page
//   .72–.78  HOLD — closest point, paper filling the frame
//   .78–.90  camera pulls back out; the reel comes up behind
//   .90–.97  arrival statement over the reel
//   .97–1.0  HOLD
//
// Camera phases use p directly (deterministic); paper phases use a damped
// spring. Push and pull are a translateZ dolly, not a scale: the board and
// page edges genuinely leave and re-enter frame instead of a rectangle
// growing and shrinking.
// Fallback only — the real perspective is read off .tiltWrap at measure time,
// because the mobile breakpoint overrides it (see globals.css).
const BOOK_PERSPECTIVE = 1600;
const LEAF_COUNT = 7;

export default function SketchbookHero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: p } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Paper phases move through a damped spring; camera phases use p directly.
  const paper = useSpring(p, { stiffness: 120, damping: 28, mass: 1 });

  // — Scene 00: first line —
  const lineOpacity = useScrollMapped(p, [0.06, 0.13], [0.9, 0]);
  const lineY = useScrollMapped(p, [0.06, 0.14], ["0vh", "-4vh"]);
  // Framer hero copy block: present on arrival, hands off as the book takes over.
  const copyOpacity = useScrollMapped(p, [0.06, 0.17], [1, 0]);
  const hintOpacity = useScrollMapped(p, [0.0, 0.03, 0.07, 0.11], [0, 1, 1, 0]);

  // — Scene 01: book arrives, cover opens —
  const bookOpacity = useTransform(paper, [0.09, 0.19], [0, 1]);
  const bookY = useTransform(paper, [0.09, 0.22], ["10vh", "0vh"]);
  const bookScale = useTransform(paper, [0.09, 0.22], [0.9, 1]);
  // Positive rotateX: with the hinge on the top edge the cover swings toward
  // the viewer and over the top, like a field pad. (Negative would swing it
  // behind the opaque page plane and vanish under preserve-3d.)
  const coverRotateX = useTransform(paper, [0.3, 0.52], [0, 112]);
  // Single-face cover: fade it out as it swings past vertical (~100°) so we
  // never render its mirrored underside. (Animating opacity on a preserve-3d
  // two-face cover forces browser plane-flattening and shows mirrored text.)
  const coverOpacity = useTransform(paper, [0.5, 0.56], [1, 0]);
  // Shadow the cover throws onto the page, driven by the actual cover angle so
  // light and geometry stay married. Gone by the time the cover clears ~100°.
  const coverCastOpacity = useTransform(coverRotateX, [8, 100], [0.95, 0]);
  // Weight lifts off the block as the cover opens: the cast shadow shortens
  // and softens rather than staying a fixed box-shadow.
  const castOpacity = useTransform(coverRotateX, [0, 112], [1, 0.68]);
  const castScaleX = useTransform(coverRotateX, [0, 112], [1, 0.9]);

  // — Scene 02: camera dollies into the page —
  // Measure how far the page must travel toward the viewer to fill the
  // viewport. Perspective scale = P / (P - z), so z = P * (1 - 1/scale).
  const [dollyDepth, setDollyDepth] = useState(
    BOOK_PERSPECTIVE * (1 - 1 / 3),
  );
  useEffect(() => {
    const measure = () => {
      const el = pageRef.current;
      if (!el) return;
      // Read the perspective off the element rather than trusting a constant:
      // the mobile breakpoint overrides it, and a depth computed against the
      // wrong P can land past the camera plane and blow the projection up to
      // hundreds of thousands of pixels.
      const tiltEl = tiltRef.current;
      if (!tiltEl) return;
      const perspective =
        parseFloat(getComputedStyle(tiltEl).perspective) || BOOK_PERSPECTIVE;
      // offsetWidth/Height, not getBoundingClientRect: the rect reports the
      // *transformed* box, so a resize fired mid-dolly would measure the
      // already-magnified page, drive the target scale below 1 and invert the
      // whole push. Layout size is transform-independent and always correct.
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;

      // A perspective push magnifies distances *from the perspective origin*,
      // not from the viewport centre. With the origin at 50% 42% the top edge
      // has further to travel than the bottom, so a naive max(vw/w, vh/h)
      // leaves a sliver of paper uncovered along the top. Solve each edge
      // against the origin and take the worst case.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const [oxRaw, oyRaw] = getComputedStyle(tiltEl)
        .perspectiveOrigin.split(" ");
      const ox = parseFloat(oxRaw);
      const oy = parseFloat(oyRaw);
      // The book is centred in the sticky viewport, so its at-rest edges and
      // the origin follow from the layout size alone (transform-independent).
      const left = vw / 2 - w / 2;
      const top = vh / 2 - h / 2;
      const cx = Number.isFinite(ox) ? left + ox : vw / 2;
      const cy = Number.isFinite(oy) ? top + oy : vh / 2;
      const need = (gap: number, reach: number) =>
        reach > 0.5 ? gap / reach : 1;
      const scale =
        Math.max(
          need(cx, cx - left),
          need(vw - cx, left + w - cx),
          need(cy, cy - top),
          need(vh - cy, top + h - cy),
        ) * 1.06;
      // Clamp short of the camera plane: past ~0.9P the projection explodes
      // and a single scroll frame can jump the page across the whole viewport.
      // Floor the scale at 1 so the push can never resolve to a negative
      // depth (which would send the page away from the viewer).
      setDollyDepth(
        Math.min(
          perspective * (1 - 1 / Math.max(scale, 1.01)),
          perspective * 0.9,
        ),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  // Push in on the page, hold at the closest point, then pull back out —
  // past the origin, so the book recedes rather than merely returning.
  const dollyZ = useScrollMapped(
    p,
    [0.58, 0.72, 0.78, 0.9],
    [0, dollyDepth, dollyDepth, -300],
  );
  // Radius goes as the paper fills the frame, and comes back on the way out.
  const pageRadius = useScrollMapped(
    p,
    [0.58, 0.7, 0.8, 0.9],
    ["6px", "0px", "0px", "6px"],
  );
  // Board, leaves and shadows ride the whole move and leave with the book.
  const frameOpacity = useScrollMapped(p, [0.84, 0.94], [1, 0]);
  // The book itself hands off to the reel on the pull-back.
  const bookFade = useScrollMapped(p, [0.84, 0.95], [1, 0]);
  // Hard cut as a safety net for any stale sub-frame opacity on last update.
  const frameVisibility = useScrollComputed(p, (v) =>
    v > 0.96 ? "hidden" : "visible",
  );
  // Ivory veil over the reel: the hero reads as paper until the pull-back
  // uncovers the film that was running behind it all along.
  const veilOpacity = useScrollMapped(p, [0.78, 0.93], [1, 0]);
  const headlineOpacity = useScrollMapped(p, [0.9, 0.97], [0, 1]);
  const headlineY = useScrollMapped(p, [0.9, 0.97], [12, 0]);
  // Cast shadow answers to both the cover angle and the dolly fade.
  const castTotalOpacity = useTransform(
    () => castOpacity.get() * frameOpacity.get(),
  );
  // Arrival fade in, hand-off fade out, on one value.
  const bookTotalOpacity = useTransform(
    () => bookOpacity.get() * bookFade.get(),
  );

  // Pointer tilt (≤2.5°), faded out as the camera takes over.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 60, damping: 20 });
  const tiltY = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const tiltAmp = useTransform(p, [0.56, 0.64], [1, 0]);
  const rotateX = useTransform(() => tiltX.get() * tiltAmp.get());
  const rotateY = useTransform(() => tiltY.get() * tiltAmp.get());

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    pointerX.set(nx * 5); // ±2.5°
    pointerY.set(ny * -5);
  };

  // The reel is already running before the veil lifts, so the pull-back
  // uncovers a moving image rather than starting one.
  useMotionValueEvent(p, "change", (v) => {
    const video = videoRef.current;
    if (!video) return;
    if (v > 0.66 && video.paused) video.play().catch(() => {});
    else if (v <= 0.6 && !video.paused) video.pause();
  });

  // Swap to the reduced variant only after mount so the server-rendered tree
  // always matches the first client render (avoids hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // What the cover opens onto: paper carrying the contour drawn in scene 00.
  // The line the visitor watched being made is now *in the book* — which is
  // what makes the object a sketchbook rather than a screen.
  const drawnPage = (
    <>
      <div className="pagePaper" />
      <svg
        className="pageDrawing"
        viewBox={CONTOUR_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <path
          d={CONTOUR_CONSTRUCTION}
          fill="none"
          stroke="var(--graphite)"
          strokeOpacity="0.22"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d={CONTOUR_PRIMARY}
          fill="none"
          stroke="var(--graphite)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  if (reduced && mounted) {
    // Same story, still compositions: open notebook, then the full film frame.
    return (
      <section
        ref={containerRef}
        className="hero"
        aria-label="Drawn at Altitude — introduction"
      >
        <div className="heroSticky">
          <img
            className="heroReel"
            src="/video-posters/hero-film.webp"
            alt="Three wicker chairs on the bank of the Indus at golden hour, and below them an open sketchbook held in a hand containing the same three chairs drawn in ink and watercolour"
          />
          <div className="heroReelVeil" style={{ opacity: 0.82 }} />
          <div className="heroCopy">
            <p className="typoEyebrow">{identity.kicker}</p>
            <h1 className="typoDisplay">{identity.title}</h1>
            <p className="typoBody heroSub">{hero.sub}</p>
            <div className="heroMetaRow">
              <p className="typoLabel">{hero.metaSeason}</p>
              <p className="typoLabel">{hero.meta}</p>
            </div>
          </div>
          <div className="tiltWrap">
            <div className="bookWrap">
              <div className="bookCast" />
              <div className="bookContact" />
              <div className="bookBlock">
                <div className="bookBack" />
                {Array.from({ length: LEAF_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className="leaf"
                    style={{
                      inset: `${i * 0.3}%`,
                      transform: `translateZ(${(i * 7) / LEAF_COUNT}px)`,
                    }}
                  />
                ))}
              </div>
              <div className="pageWrap" style={{ borderRadius: 6 }}>
                {drawnPage}
                <div className="pageCurve" />
                <div className="pageSheen" />
              </div>
              <div className="bookHinge" />
            </div>
          </div>
          <div
            className="heroHeadlineWrap"
            style={{ position: "relative", paddingTop: "6vh", paddingBottom: "6vh" }}
          >
            <h2 className="serif heroHeadline" style={{ color: "var(--graphite)", textShadow: "none" }}>
              {hero.headline}
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="hero"
      aria-label="Drawn at Altitude — introduction"
      onPointerMove={onPointerMove}
    >
      <div className="heroSticky">
        {/* The reel runs behind everything from the start, hidden under an
            ivory veil — the pull-back uncovers it rather than starting it. */}
        <video
          ref={videoRef}
          className="heroReel"
          src="/video/hero-film.mp4"
          poster="/video-posters/hero-film.webp"
          muted
          playsInline
          preload="auto"
          aria-label="The opening film: a sketchbook page opens onto the Ladakh mountains, cloud clears onto a painted monastery, the Indus and its riverside chairs appear beside the same scene drawn, and the sequence closes on a finished folio page"
        />
        <motion.div className="heroReelVeil" style={{ opacity: veilOpacity }} />

        {/* Scene 00 — first line + Framer hero copy block */}
        <motion.div className="heroCopy" style={{ opacity: copyOpacity }}>
          <p className="typoEyebrow">{identity.kicker}</p>
          <h1 className="typoDisplay">{identity.title}</h1>
          <p className="typoBody heroSub">{hero.sub}</p>
          <div className="heroMetaRow">
            <p className="typoLabel">{hero.metaSeason}</p>
            <p className="typoLabel">{hero.meta}</p>
          </div>
        </motion.div>
        <motion.div
          className="firstLine"
          style={{ opacity: lineOpacity, y: lineY }}
        >
          <AnimatedInkPath
            progress={p}
            viewBox={CONTOUR_VIEWBOX}
            constructionD={CONTOUR_CONSTRUCTION}
            primaryD={CONTOUR_PRIMARY}
            constructionRange={[0.0, 0.06]}
            primaryRange={[0.02, 0.1]}
            stroke="var(--graphite)"
          />
        </motion.div>
        <motion.p className="scrollHint" style={{ opacity: hintOpacity }}>
          scroll
        </motion.p>

        {/* Scenes 01–02 — the sketchbook as an object, then the camera inside it */}
        <motion.div
          ref={tiltRef}
          className="tiltWrap"
          style={{ rotateX, rotateY }}
        >
          <motion.div
            className="bookWrap"
            style={{
              opacity: bookTotalOpacity,
              y: bookY,
              scale: bookScale,
              z: dollyZ,
            }}
          >
            {/* Two shadows, independently driven: long cast + short contact. */}
            <motion.div
              className="bookCast"
              style={{
                opacity: castTotalOpacity,
                scaleX: castScaleX,
                visibility: frameVisibility,
              }}
            />
            <motion.div
              className="bookContact"
              style={{ opacity: frameOpacity, visibility: frameVisibility }}
            />

            {/* Back board + page block: the fore-edge is what gives it mass. */}
            <motion.div
              className="bookBlock"
              style={{ opacity: frameOpacity, visibility: frameVisibility }}
            >
              <div className="bookBack" />
              {Array.from({ length: LEAF_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="leaf"
                  style={{
                    inset: `${i * 0.3}%`,
                    transform: `translateZ(${(i * 7) / LEAF_COUNT}px)`,
                  }}
                />
              ))}
            </motion.div>

            <motion.div
              ref={pageRef}
              className="pageWrap"
              style={{ borderRadius: pageRadius }}
            >
              {drawnPage}
              {/* Paper bowing away from the hinge, and the light on that bow. */}
              <motion.div
                className="pageCurve"
                style={{ opacity: frameOpacity }}
              />
              <motion.div
                className="pageSheen"
                style={{ opacity: frameOpacity }}
              />
              <motion.div
                className="coverCast"
                style={{ opacity: coverCastOpacity }}
              />
            </motion.div>

            <motion.div
              className="bookHinge"
              style={{ opacity: frameOpacity, visibility: frameVisibility }}
            />

            <motion.div
              className="cover"
              style={{
                z: 12, // in front of the hinge (10) and the page (8)
                rotateX: coverRotateX,
                opacity: coverOpacity,
                visibility: frameVisibility,
              }}
            >
              <p className="typoLabel coverLockup">{identity.producers}</p>
              <p className="coverSub">{identity.coverSub}</p>
              <div className="coverEdge" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Arrival statement over full-bleed film */}
        <div className="heroHeadlineWrap">
          <motion.h2
            className="serif heroHeadline"
            style={{ opacity: headlineOpacity, y: headlineY }}
          >
            {hero.headline}
          </motion.h2>
          <motion.p className="typoLabel heroFilmMeta" style={{ opacity: headlineOpacity }}>
            {hero.meta}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { useScrollMapped } from "@/lib/animation/useScrollMapped";
import { useScrubbedVideo } from "@/lib/animation/useScrubbedVideo";
import {
  filmBeats,
  filmHandover,
  hero,
  identity,
} from "@/lib/content/retreat";

// THE FILM, TRAVERSED — scroll position drives video.currentTime, and the copy
// arrives on the frames it belongs to.
//
// Nothing plays on its own. The visitor pushes the camera out of a whiteout,
// finds a monastery in it, travels the page, rises through a window, and comes
// to rest on a finished sketchbook. A hold is simply where they stopped, which
// is where the brief's "moments of calm" come from without authoring any.
//
// Nine statements, one at a time, each with its margin notes — the two
// registers §14 allows over an image. Windows are declared in
// lib/content/retreat.ts and deliberately do not overlap, even though the
// film's own beats do, through their dissolves.
//
// Section length is the playback rate: 500vh ≈ 17vh of scroll per second of
// film at a 900px viewport. Longer = slower. This is the tuning knob.
//
// The encoding matters more than this code: hero-film.mp4 carries a keyframe
// every 10 frames, so a seek decodes at most nine. At a default ~8s GOP the
// identical component stutters — check the GOP before the JavaScript.

const FALLBACK_DURATION = 23.83;

// Each beat owns its own hooks, so the list stays a plain map instead of a
// rules-of-hooks violation waiting to happen.
function FilmBeat({
  p,
  beat,
}: {
  p: MotionValue<number>;
  beat: (typeof filmBeats)[number];
}) {
  const { at, to, line, notes } = beat;
  const f = 0.018; // fade width, in scroll progress

  const opacity = useScrollMapped(p, [at, at + f, to - f, to], [0, 1, 1, 0]);
  // Arrival is a focus pull, not a slide: the line rises a little and its
  // letter-spacing settles, the way type resolves as a lens finds it.
  const y = useScrollMapped(p, [at, at + f * 2.4], [22, 0]);
  const letterSpacing = useScrollMapped(
    p,
    [at, at + f * 2.4],
    ["0.09em", "0.012em"],
  );
  const filter = useScrollMapped(
    p,
    [at, at + f * 1.8],
    ["blur(7px)", "blur(0px)"],
  );

  const noteOpacity = useScrollMapped(
    p,
    [at + f, at + f * 3, to - f, to],
    [0, 1, 1, 0],
  );
  const noteY = useScrollMapped(p, [at + f, at + f * 3.4], [14, 0]);

  return (
    <motion.div className="filmBeat" style={{ opacity }} aria-hidden={false}>
      <motion.p
        className="serif filmBeatLine"
        style={{ y, letterSpacing, filter }}
      >
        {line}
      </motion.p>
      <motion.div
        className="filmBeatNotes"
        style={{ opacity: noteOpacity, y: noteY }}
      >
        {notes.map((n) => (
          <p className="hand filmBeatNote" key={n}>
            {n}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function FilmHero() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress: p } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useScrubbedVideo(videoRef, p, FALLBACK_DURATION);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The title block is present on arrival and hands off almost at once — the
  // brief forbids a blank ivory hero holding the visitor up.
  const titleOpacity = useScrollMapped(p, [0.005, 0.045], [1, 0]);
  const hintOpacity = useScrollMapped(p, [0, 0.015, 0.04, 0.06], [0, 1, 1, 0]);
  // The scrim is what makes the copy legible over both cream paper and
  // photography. It breathes with the beats rather than sitting flat.
  const scrimOpacity = useScrollMapped(p, [0, 0.05, 0.95, 1], [0.15, 1, 1, 0.5]);
  const handoverOpacity = useScrollMapped(p, [0.965, 0.995], [0, 1]);

  if (reduced && mounted) {
    return (
      <section
        ref={containerRef}
        className="filmHero isStill"
        aria-label="Drawn at Altitude — introduction"
      >
        <div className="heroSticky">
          <img
            className="heroReel"
            src="/video-posters/hero-film.webp"
            alt="Three wicker chairs on the bank of the Indus at golden hour, and below them an open sketchbook held in a hand containing the same three chairs drawn in ink and watercolour"
          />
          <div className="filmScrim" />
          <div className="heroCopy">
            <p className="typoEyebrow">{identity.kicker}</p>
            <h1 className="typoDisplay">{identity.title}</h1>
            <p className="typoBody heroSub">{hero.sub}</p>
          </div>
          <div className="filmStillCopy">
            {filmBeats.map((b) => (
              <p className="serif filmBeatLine isStatic" key={b.at}>
                {b.line}
              </p>
            ))}
            <p className="serif filmHandoverLine">{filmHandover.statement}</p>
            <p className="typoLabel filmHandoverLabel">{filmHandover.label}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="filmHero"
      aria-label="Drawn at Altitude — introduction"
    >
      <div className="heroSticky">
        <video
          ref={videoRef}
          className="heroReel"
          src="/video/hero-film.mp4"
          poster="/video-posters/hero-film.webp"
          muted
          playsInline
          preload="auto"
          aria-label="The opening film, moved through by scrolling: cloud clears onto a painted monastery, a sketchbook page travels, a room rises to its window and out over the Indus, the riverside chairs and the same chairs drawn, sea buckthorn picked by hand, then the finished sketchbook"
        />
        <motion.div className="filmScrim" style={{ opacity: scrimOpacity }} />

        <motion.div className="heroCopy" style={{ opacity: titleOpacity }}>
          <p className="typoEyebrow">{identity.kicker}</p>
          <h1 className="typoDisplay">{identity.title}</h1>
          <p className="typoBody heroSub">{hero.sub}</p>
        </motion.div>

        <motion.p className="scrollHint" style={{ opacity: hintOpacity }}>
          scroll
        </motion.p>

        {filmBeats.map((beat) => (
          <FilmBeat key={beat.at} p={p} beat={beat} />
        ))}

        <motion.div
          className="filmHandover"
          style={{ opacity: handoverOpacity }}
        >
          <p className="serif filmHandoverLine">{filmHandover.statement}</p>
          <p className="typoLabel filmHandoverLabel">{filmHandover.label}</p>
        </motion.div>
      </div>
    </section>
  );
}

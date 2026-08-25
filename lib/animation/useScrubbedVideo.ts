"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { type MotionValue, useMotionValueEvent } from "motion/react";

// Drive a <video> from a scroll progress value: the film is traversed rather
// than played. Every subtlety of doing that lives here so it exists once.
//
// Three things this handles that a naive `video.currentTime = p * duration`
// does not:
//
// 1. Seek coalescing. Assigning currentTime on every scroll frame queues seeks
//    inside the element, and the image falls further behind the faster you
//    move. We hold one pending target, issue a seek only when none is in
//    flight, and flush on `seeked`.
// 2. Decoder priming. Safari and iOS ignore currentTime on an element that has
//    never played — scrubbing silently does nothing. A muted play() followed
//    immediately by pause() is what makes it work at all.
// 3. Sub-frame moves are skipped: invisible, and each one costs a decode.
//
// The other half of the problem is not solvable in JavaScript. The file needs
// dense keyframes (`-g 10 -keyint_min 10 -sc_threshold 0`, a keyframe every
// third of a second at 30fps). With a default ~8s GOP this hook still
// stutters — if scrubbing feels sticky, check the encode before the code.
//
// Returns `ready`, which is false until metadata has landed; callers should
// not assume a duration before then.
export function useScrubbedVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  progress: MotionValue<number>,
  fallbackDuration: number,
) {
  const [ready, setReady] = useState(false);
  const pending = useRef<number | null>(null);
  const seeking = useRef(false);
  const flushRef = useRef<() => void>(() => {});

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const flush = () => {
      if (seeking.current || pending.current === null) return;
      const target = pending.current;
      pending.current = null;
      if (Math.abs(video.currentTime - target) < 1 / 60) return;
      seeking.current = true;
      video.currentTime = target;
    };
    flushRef.current = flush;

    const onSeeked = () => {
      seeking.current = false;
      flush();
    };
    const onLoaded = () => {
      setReady(true);
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [videoRef]);

  useMotionValueEvent(progress, "change", (v) => {
    const video = videoRef.current;
    if (!video || !ready) return;
    const duration = Number.isFinite(video.duration)
      ? video.duration
      : fallbackDuration;
    pending.current = Math.min(Math.max(v, 0), 1) * duration;
    flushRef.current();
  });

  return ready;
}

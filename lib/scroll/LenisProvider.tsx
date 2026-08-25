"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { registerScroller } from "./lenisControl";

// Smooth scroll on native scrollTop so motion/react's useScroll stays accurate.
// Disabled entirely under prefers-reduced-motion.
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    // Handed to lenisControl so the entry gate can hold the page still.
    registerScroller(lenis);
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      registerScroller(null);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}

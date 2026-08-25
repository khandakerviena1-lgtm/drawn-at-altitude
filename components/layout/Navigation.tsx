"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content/retreat";

// A SIDE BAND, NOT A FIXED HEADER.
//
// The client's complaint after phone testing was not where the menu was but
// that it was always THERE — a fixed bar riding over the artwork the whole
// way down, on a page that is mostly artwork. Hide-on-scroll softened that;
// this removes it. Collapsed, the navigation is a slim vertical tab on the
// right edge — a bookmark, not a toolbar. Tapping it slides out a band with
// the three section links; picking one closes it and goes there.
//
// The brand lockup moved into the page itself (the sketchbook's title block),
// where a name belongs — nothing about "Indus River Camp × Anastasiia" needs
// to follow the reader to the booking table.
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // Escape closes; so does tapping anywhere off the band.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (railRef.current && !railRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className={`sideRail${open ? " isOpen" : ""}`} ref={railRef}>
      <button
        type="button"
        className="sideRailTab"
        aria-expanded={open}
        aria-controls="siteMenu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav className="sideRailPanel" id="siteMenu" aria-label="Site">
        {nav.links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

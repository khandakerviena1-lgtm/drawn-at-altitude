"use client";

import PeekSlider from "@/components/ui/PeekSlider";
import type { Gallery } from "@/lib/content/retreat";

// A chapter of the camp's photography — Ladakh, life at the camp, the table,
// the neighbours. Same slider and head as the rooms and the dye workshop, so
// the page keeps one way of showing a set of pictures. `tone` alternates the
// ground so two galleries in a row still read as two chapters.

export default function PhotoGallery({
  gallery,
  tone = "paper",
}: {
  gallery: Gallery;
  tone?: "paper" | "warm";
}) {
  return (
    <section
      id={gallery.id}
      className={`rooms photoGallery${tone === "warm" ? " isWarm" : ""}`}
      aria-label={gallery.kicker}
    >
      <div className="roomsHead">
        <p className="typoEyebrow">{gallery.kicker}</p>
        <h2 className="typoChapter dyeHeading">{gallery.heading}</h2>
        <p className="typoBody roomsSupport">{gallery.support}</p>
      </div>

      <PeekSlider slides={gallery.slides} label={gallery.label} />
    </section>
  );
}

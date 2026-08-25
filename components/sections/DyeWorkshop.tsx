"use client";

import PeekSlider from "@/components/ui/PeekSlider";
import { dye } from "@/lib/content/retreat";

// IMMERSIVE TIE & DYE AND TEXTILE WORKSHOPS.
//
// Fills the one pillar that has been empty since the beginning: CreativePillars
// carries LINE, COLOUR and TEXTURE, and TEXTURE — "cloth and clay" — has had
// `media: null` and a labelled placeholder the whole time, because there was
// no textile material beyond a screen-recorded proxy of the We Are Kal studio.
//
// These five spreads are that material, and they arrive already in order: the
// undyed silk, the two dye baths, the iron bath that darkens them, and the
// range that comes out. So the slider is not a gallery — it is the process,
// and it can be stepped through the way the method sheet is.

export default function DyeWorkshop() {
  return (
    <section className="rooms dyeWorkshop" aria-label={dye.kicker}>
      <div className="roomsHead">
        <p className="typoEyebrow">{dye.kicker}</p>
        <h2 className="typoChapter dyeHeading">{dye.heading}</h2>
      </div>

      <PeekSlider slides={dye.slides} label="stage" />
    </section>
  );
}

"use client";

import { vision } from "@/lib/content/retreat";

// THE VALLEY, OBSERVED — the real confluence, still.
//
// One real photograph: source/photos/IMG_5671, the Zanskar meeting the Indus,
// which is the place the copy actually names. No animation — the client's
// call (2026-08-19, "stop the animation"), and the end of a chain of
// treatments: an invented SVG ridge, then a scroll-scrubbed three-plane depth
// push with traced lines, then a self-playing push. Each carried its own
// failure mode; the photograph carries none.
//
// The three-plane depth machinery (clip-path planes, the push mappings, the
// replay observer) lived in this file's git history and in
// MOTION-SYSTEM.md if it is ever wanted again. `useReducedMotion` went with
// it: a still image is its own reduced-motion variant.
//
// This is a server-renderable section now; "use client" stays only because
// nothing else about the page's import graph was audited for the change, and
// the directive is inert on a component with no hooks.

export default function ArtistVision() {
  return (
    <section className="vision" aria-label="Learning to look — the valley, observed">
      <div className="visionSticky">
        <div className="visionStage">
          <img
            className="visionPlate"
            src="/img/indus-sangam.webp"
            alt="The Sangam: the Zanskar meeting the Indus below a pyramid massif, the water pale glacial green over grey sand bars"
          />
        </div>
        <div className="visionScrim" />
        <div className="visionText">
          <p className="typoEyebrow visionKicker">{vision.kicker}</p>
          <h2 className="serif">{vision.headline}</h2>
          <p>{vision.support}</p>
        </div>
      </div>
    </section>
  );
}

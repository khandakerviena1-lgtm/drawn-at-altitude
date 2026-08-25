"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useCinematicScroll } from "@/lib/animation/useCinematicScroll";
import { CAMERA_EASE, useScrollMapped } from "@/lib/animation/useScrollMapped";

// THE CAMP, ENTERED — one camera moved through six photographs.
//
//   EXTERIOR → VERANDA → GLASS → BEDROOM → WINDOW → LANDSCAPE
//
// NOT WIRED. Built 2026-08-17, removed the same day — "no point". Kept whole,
// like FilmHero, SketchbookHero, FolioOpening, CampSection, WindowMorph and
// BookIntro before it; `page.tsx` no longer renders it, and its plates stay
// in /public/img/journey/ so re-adding it is one import.
//
// Worth knowing before reviving it: the flat-photograph ceiling is the reason
// it did not land. Perspective and occlusion can fake moving *forward*, but
// nothing here can produce looking left, right or up, because a flat frame
// holds no information beyond its edges. That needs capture we do not have —
// 360° spheres or a scan, shot at the property. The technique below is as far
// as six stills go.
//
// FIRST VERSION WAS FLAT, and the reason is worth keeping: it animated
// `scale`, which enlarges a picture uniformly. Walking toward a building does
// not do that — near timber diverges and leaves the frame while the ridge
// behind barely shifts, and vertical edges spread. A zoom cannot produce any
// of that. Three mechanisms replace it:
//
// 1. PERSPECTIVE, NOT SCALE. The stage carries `perspective`, and each plate
//    travels on `translateZ`. Under perspective, z-travel diverges the edges
//    the way approach does; scale cannot. Perceived size is P/(P−z), so the
//    z values below are derived, not guessed: at P = 1200, z = 300 reads as
//    1.33×, z = 165 as 1.16×.
//
// 2. OCCLUSION. Near plates travel much further in z than far ones, so they
//    blow past the camera and leave through the frame edges instead of
//    dissolving in place. That is what says "I have just passed that", and
//    it is why the exterior and veranda run to z 300+ while the landscape,
//    which is the destination rather than something passed, barely moves.
//
// 3. A THRESHOLD, NOT A CROSSFADE. Window → landscape is the one crossing
//    that must not be a dissolve: the glazing's own aperture opens and
//    swallows the frame. The inset below is measured off 05-window.webp —
//    the glass runs x 245→745 of 900 and y 45→390 of 562 — so the landscape
//    starts clipped to exactly that opening and expands to full bleed. The
//    visitor goes *through* the window rather than watching it fade.
//
// Everything else that already worked is kept: scroll position IS animation
// position (stop and it freezes, reverse and it reverses exactly), every
// handover overlaps so no frame is ever blank, and interior arrivals resolve
// from blur and low saturation rather than appearing.
//
// Built on the page's existing stack — motion/react, Lenis, the damped scrub
// in useCinematicScroll (≈ GSAP scrub 1) and CAMERA_EASE (= power2.inOut).
// No second scroll engine.

const PERSPECTIVE = 1200;

const PLATES = [
  {
    src: "/img/journey/01-exterior.webp",
    pos: "50% 38%",
    origin: "52% 44%", // the veranda mouth — where the camera is heading
    alt: "A timber-framed cottage at the Indus River Camp under the snow range, poplars behind it",
  },
  {
    src: "/img/journey/02-veranda.webp",
    pos: "62% 45%",
    origin: "68% 52%", // between the posts, toward the glazing
    alt: "The thatched veranda of a cottage, wicker chairs facing the river and the mountains",
  },
  {
    src: "/img/journey/03-glass.webp",
    pos: "50% 45%",
    origin: "50% 46%",
    alt: "The cottage's glazing up close, the mountains and reeds reflected between timber posts",
  },
  {
    src: "/img/journey/04-bedroom.webp",
    pos: "45% 55%",
    origin: "42% 46%", // the lit window wall
    alt: "The bedroom in low evening light, a block-printed quilt and timber beams",
  },
  {
    src: "/img/journey/05-window.webp",
    pos: "58% 45%",
    origin: "55% 40%", // the centre of the glazing
    alt: "The bed in the foreground and the wall of windows onto the river, the chairs on the grass and the ridge",
  },
  {
    src: "/img/journey/06-landscape.webp",
    pos: "50% 55%",
    origin: "50% 50%",
    alt: "The open river landscape of the camp below the Stok range, reeds and water in September light",
  },
] as const;

type Life = {
  in: [number, number];
  out: [number, number];
  // z travel across the plate's whole life. Near things travel far and leave;
  // the destination barely moves.
  z: [number, number, number, number];
  focusIn?: boolean;
};

const LIVES: Life[] = [
  { in: [0, 0], out: [0.24, 0.32], z: [0, -40, 0.32, 300] },
  { in: [0.2, 0.28], out: [0.42, 0.5], z: [0.2, -70, 0.5, 300] },
  { in: [0.42, 0.5], out: [0.6, 0.68], z: [0.42, -70, 0.68, 320] },
  { in: [0.58, 0.66], out: [0.76, 0.84], z: [0.58, -50, 0.84, 210], focusIn: true },
  { in: [0.74, 0.82], out: [0.9, 0.96], z: [0.74, -50, 0.96, 230] },
  { in: [0.88, 0.96], out: [1, 1], z: [0.88, -30, 1, 55], focusIn: true },
];

// The glazing of 05-window, as insets. The landscape is born inside it.
const APERTURE = { top: 8, right: 17.2, bottom: 30.6, left: 27.2 };

function JourneyPlate({
  p,
  plate,
  life,
  index,
}: {
  p: MotionValue<number>;
  plate: (typeof PLATES)[number];
  life: Life;
  index: number;
}) {
  const first = life.in[0] === life.in[1];
  const last = life.out[0] === 1;

  const opacity = useScrollMapped(
    p,
    first ? [life.out[0], life.out[1]] : [life.in[0], life.in[1], life.out[0], life.out[1]],
    first ? [1, 0] : [0, 1, 1, last ? 1 : 0],
  );

  const z = useScrollMapped(p, [life.z[0], life.z[2]], [life.z[1], life.z[3]], CAMERA_EASE);

  const blur = useScrollMapped(
    p,
    [life.in[0], life.in[1] + 0.04],
    life.focusIn ? [5, 0] : [0, 0],
  );
  const sat = useScrollMapped(
    p,
    [life.in[0], life.in[1] + 0.06],
    life.focusIn ? [0.72, 1] : [1, 1],
  );
  const filter = useMotionTemplate`blur(${blur}px) saturate(${sat})`;

  // Only the landscape has an aperture: it is the plate you pass through the
  // window into. It opens from the measured glazing to full bleed.
  const isLandscape = index === PLATES.length - 1;
  const apTop = useScrollMapped(p, [0.88, 0.985], [APERTURE.top, 0], CAMERA_EASE);
  const apRight = useScrollMapped(p, [0.88, 0.985], [APERTURE.right, 0], CAMERA_EASE);
  const apBottom = useScrollMapped(p, [0.88, 0.985], [APERTURE.bottom, 0], CAMERA_EASE);
  const apLeft = useScrollMapped(p, [0.88, 0.985], [APERTURE.left, 0], CAMERA_EASE);
  const clipPath = useMotionTemplate`inset(${apTop}% ${apRight}% ${apBottom}% ${apLeft}%)`;

  return (
    <motion.img
      className="journeyPlate"
      src={plate.src}
      alt={plate.alt}
      style={{
        opacity,
        z,
        filter,
        objectPosition: plate.pos,
        transformOrigin: plate.origin,
        ...(isLandscape ? { clipPath } : {}),
      }}
    />
  );
}

export default function CampJourney() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const p = useCinematicScroll(containerRef);

  const kickerOpacity = useScrollMapped(p, [0.0, 0.04, 0.16, 0.22], [0, 1, 1, 0]);
  const closingOpacity = useScrollMapped(p, [0.93, 0.985], [0, 1]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduced && mounted) {
    return (
      <section className="journey isStill" aria-label="The Indus River Camp, entered">
        <div className="journeyStill">
          <p className="typoEyebrow">The Indus River Camp</p>
          <img src={PLATES[0].src} alt={PLATES[0].alt} />
          <img src={PLATES[5].src} alt={PLATES[5].alt} />
          <p className="serif journeyClosingLine">Step outside.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="journey"
      aria-label="The Indus River Camp, entered"
    >
      <div className="journeySticky" style={{ perspective: `${PERSPECTIVE}px` }}>
        {PLATES.map((plate, i) => (
          <JourneyPlate
            key={plate.src}
            p={p}
            plate={plate}
            life={LIVES[i]}
            index={i}
          />
        ))}

        <motion.div className="journeyKicker" style={{ opacity: kickerOpacity }}>
          <p className="typoEyebrow journeyKickerLine">The Indus River Camp</p>
          <p className="typoLabel journeyKickerSub">Ladakh · one riverside base</p>
        </motion.div>

        <motion.p
          className="serif journeyClosingLine"
          style={{ opacity: closingOpacity }}
        >
          Step outside.
        </motion.p>
      </div>
    </section>
  );
}

# MOTION SYSTEM
Primary animation system: **Motion for React** (`motion/react`). No GSAP (no documented Motion limitation encountered in Milestone 1). Smooth scroll: Lenis, feeding `useScroll` via default window scroll (Lenis animates native scrollTop, so `useScroll` stays accurate).

**Note on Motion AI:** the master spec states Motion AI tooling is connected; no Motion MCP tool was present in this environment (verified via tool search). Choreography below was therefore designed directly against Motion's documented primitives — `useScroll` + `useTransform` (deterministic scroll mapping), `useSpring` (only where material calls for damping), `useMotionValue`/`useMotionTemplate` (pointer-driven values, no React re-renders), `useReducedMotion`. Flag for re-review when Motion AI tooling is actually available.

## Global principles applied
- Camera/video: deterministic scroll mapping, **no springs** (weighted, cinematic).
- Paper/book: scroll-mapped transform with a soft spring smoothing (stiffness 120, damping 28, mass 1) — paper is damped, never bouncy.
- Ink: `pathLength` draw with non-uniform timing (construction pass fast/light, primary pass slower/decisive), slight per-segment overlap.
- Watercolor: mask/opacity/scale reveals, delayed relative to ink; no blur filters.
- Handwriting: fades/draws in only after its subject is established; never terminal-typed.
- Pointer parallax: max ±2.5° tilt, spring-smoothed (stiffness 60, damping 20).
- All continuous values are MotionValues bound to style — zero React re-renders per frame.
- Every scene has a reduced-motion fallback rendering its resolved state.

## SCENE: Hero (Scenes 00–02) — `SketchbookHero`
Container: **540vh**; inner sticky viewport. `useScroll({ target, offset: ["start start", "end end"] })` → progress **p**.

The added length over the original 420vh is spent entirely on **three holds** — stretches where nothing moves. They are the scene, not padding: the object has to be read as an object, the film has to be registered as living *inside* the page, and the arrival has to be allowed to land.

| Element | Purpose | Input (p) | Output | Behaviour |
|---|---|---|---|---|
| Graphite first line | curiosity; drawing begins before place exists | 0.00–0.06 | pathLength 0→1 (construction), opacity 0.9 | scroll-linked, `circOut`-shaped via transform easing |
| Contour settles / recedes | the line becomes the idea of a ridge, hands off to the book | 0.06–0.14 | opacity 1→0, y 0→-4vh | scroll-linked |
| Framer hero copy block (kicker / display title / sub / meta) | Part 2: composition authority — the editorial title page hands off to the object | present at 0, fades 0.06–0.17 | opacity 1→0 | scroll-linked |
| Notebook | object arrives on desk | 0.09–0.22 | opacity 0→1, y 10vh→0, scale 0.90→1 | scroll-mapped through paper spring (damped settle) |
| **HOLD — object settles** | the visitor reads cloth, board, page block, weight | **0.22–0.30** | nothing moves | — |
| Cover | reveal film inside | 0.30–0.56 | rotateX 0→**+112°** (transform-origin top — positive swings the cover toward the viewer and over the top like a field pad; negative pushes it behind the opaque page plane under preserve-3d and it vanishes) | scroll-mapped through paper spring; perspective 1600px |
| Cover shadow on page | light married to geometry | driven by **cover angle**, 8°→100° | opacity 0.95→0 | derived from `coverRotateX`, not from p — the shadow can never disagree with the cover |
| Long cast shadow | weight lifts off the block as the cover opens | driven by cover angle, 0°→112° | opacity 1→0.68, scaleX 1→0.90 | shortens and softens; separate element from the short contact shadow |
| Cover fade | cover leaves as it passes vertical | 0.50–0.56 | opacity 1→0 | single-face cover; fading past ~100° avoids ever rendering its mirrored underside (two-face + backface-visibility breaks because animated opacity forces plane flattening) |
| **HOLD — the drawn page** | the book is understood to contain *paper*, not a screen | **0.52–0.58** | nothing moves | — |
| Camera pushes in on the page | the drawing is examined | 0.58–0.72 | **`translateZ` 0→z on the whole book**, border-radius 6px→0 | **deterministic scroll mapping, no spring** (camera weight) |
| **HOLD — closest point** | paper fills the frame | **0.72–0.78** | nothing moves | — |
| Reel starts | so the veil uncovers a moving image, never starts one | 0.66 | video play() gate | event at threshold |
| Camera pulls back out | the place arrives *behind* the book | 0.78–0.90 | `translateZ` z→**−300** (past the origin, so the book recedes rather than merely returning), radius back to 6px; **ivory veil over the reel lifts 0.78–0.93**; book, board and shadows fade 0.84–0.95 | deterministic |
| Film headline "A sketchbook practice returns to a painted valley." | arrival statement | 0.90–0.97 | opacity 0→1, y 12px→0 | scroll-linked |
| **HOLD — arrival** | the statement is given time | **0.97–1.00** | nothing moves; the reel runs | — |
| Scroll hint | affordance | 0.0–0.03 out by 0.11 | opacity | scroll-linked |

Overlaps are intentional (the cover is still fading as the dolly begins) — no isolated steps.

### What the cover opens onto
Not Indus footage. The book opens onto **paper**, carrying the same contour the visitor watched being drawn in scene 00 — a sketchbook contains a page, not a screen, and the line that was just made is now in the book. The place arrives afterwards, on the pull-back, as `hero-reel.mp4` coming up from behind.

That reel is the combined PoC edit (see ASSET-MANIFEST): a held sketchbook, then a move out to the river. Its own filmed sketchbook is cropped away on desktop, which is fine — at that moment the visitor is looking at *our* book, and the reel is the place behind it. On phones the 9:16 source fits natively. **It is AI-generated placeholder footage and must be replaced before anything ships publicly.**

### Why a dolly and not a scale
Scaling the page rectangle read as "a UI block growing". The push is now a real `translateZ` on the whole book, with depth derived from the perspective projection: `z = P · (1 − 1/scale)`. The board, the leaf stack, the binding and the page edges all travel together and **leave the frame** as the camera passes them, which is what makes it read as entering the notebook.

Two traps, both hit and fixed during the build — do not reintroduce:
1. **Measure with `offsetWidth`/`offsetHeight`, never `getBoundingClientRect()`.** The rect reports the *transformed* box. A `resize` firing mid-dolly measures the already-magnified page, drives the target scale below 1, and inverts the whole push (the page travels away from the viewer). The scale is also floored at 1 so a negative depth is unrepresentable.
2. **Inside `preserve-3d`, paint order comes from real Z, not `z-index`.** The depth ladder is `cast −18 · contact −6 · board 0 · leaves 0–7 · page 8 · hinge 10 · cover 12`. Giving the page a `translateZ` without lifting the cover and binding above it puts the film *in front of the closed cover*.

Note also that any element whose `opacity` drops below 1 has its `preserve-3d` flattened by CSS — this is why the leaf stack's fore-edge collapses at p ≈ 0.80. It is fading out simultaneously, so it is not visible in practice.

### Book anatomy (what makes it an object)
Board with bookcloth weave · 7-leaf page block whose fore-edge is visible under perspective · cylindrical binding on the top hinge · board thickness on the cover's free edge · paper bowing away from the hinge (`.pageCurve`) with a matching light catch (`.pageSheen`) · three independently driven shadows. Cloth and paper grain are CSS placeholders pending real scans — see ASSET-MANIFEST.

**Reduced motion:** static open notebook composition (same anatomy, no motion), then a full-bleed poster still with headline; opacity-only transitions.
**Mobile:** same mapping; `v01-…-mobile.mp4`; pointer tilt disabled; perspective shallower (1200px).

## SCENE: Artist Vision (Scene 03) — `ArtistVision`
Container: 260vh sticky. Progress **q**. Pointer position → `useMotionValue` pair → spring (stiffness 60, damping 20) → mask position (desktop). Mobile: mask follows a scroll-mapped path instead.

| Element | Purpose | Input (q) | Output | Behaviour |
|---|---|---|---|---|
| Real film (v02 braided Indus) | reality dominant | 0–1 | plays while sticky, pauses offscreen | IntersectionObserver gate |
| Section kicker "Learning to look" | frame the act of observation | 0.04–0.14 | opacity 0→1 | scroll-linked |
| Mountain contour (s01, construction pass) | first observation | 0.10–0.30 | pathLength 0→1, opacity 0.55 | scroll-linked draw |
| Mountain contour (primary pass) | decision after exploration | 0.22–0.44 | pathLength 0→1, opacity 0.9 | scroll-linked draw, overlaps construction |
| Vision region (irregular wash-shaped mask) | signature interaction: inside = observed Ladakh | 0.18–0.30 | opacity 0→1 bloom; inside layer = paper + pigment ribbons + simplified river contour riding **inside** the region (art translates with the mask so the revealed composition is stable) | scroll-linked entrance, then pointer-led (desktop) / scroll-drift (mobile) |
| Pigment note (Indus grey-green swatch + label) | colour is collected, not decorated | 0.42–0.56 | opacity 0→1, y 6px→0, slight settle | scroll-linked, settles once (no float) |
| Handwritten note "grey-green — glacier water, moves fast" + arrow | observation written after seeing | 0.55–0.70 | arrow pathLength 0→1 then text opacity 0→1 (staggered) | scroll-linked |
| Interpretation gains weight | film 1→0.82 saturation outside region | 0.6–0.9 | filter saturate, paper vignette opacity 0→0.25 | scroll-linked |

### The vision region is a watercolour edge, not a soft mask — reworked 2026-08-09
The client's note was that the reveal read as a round mask. It did: one near-oval path under a single Gaussian blur, which is the recipe for a **vignette** — the reveal looked like a spotlight sliding over the film. Wet pigment does the opposite. It runs into lobes, *stops* against the paper with a defined boundary, and frays only in a narrow fringe.

Four changes, in `VISION_MASK_URI` (`components/sketch/paths.ts`) and `.observedGrain`:

1. **Three overlapping, non-concentric lobes** instead of one blob, so the union has no axis.
2. **Two displacement passes** — a coarse one (baseFrequency 0.006/0.009, scale 42) for big excursions, then a fine one (0.055, scale 9) for pigment-scale fraying. A single pass at one frequency scallops the outline evenly and reads as a die-cut sticker; this was visible on the first attempt and is why there are two.
3. **`feColorMatrix` steepens the alpha ramp** (a → 2.8a − 0.72). This is the move that matters: it collapses the blur's long gradient into a narrow transition, so the edge reads as pigment stopping rather than opacity fading. First tuning at 4.2a − 1.15 went too far and produced a hard cut-out — the fringe has to survive.
4. **`.observedGrain`** multiplies two noise scales over the paper (settling pigment at 420px, paper tooth at 160px). Without it the interior is perfectly uniform and the wash reads as a flat shape pasted on the film no matter how good its edge is.

**Reduced motion:** static composition — poster with contour + fixed vision region + all annotations visible.
**Mobile:** vision region follows scroll-driven drift path across the frame; tap does nothing (no hidden content behind interaction).

## SCENE: The Ladakh Folio (`FolioSection`) — BUILT 2026-08-09
The climax, and by design the longest scene on screen: **520vh** (460vh mobile) for one composition, ending on a hold where nothing moves at all. The brief asked for a brutal slowdown here; the length is the slowdown.

Nine days of looking arrive as one plate, assembled **in the order the work was actually done** — that ordering is the whole argument, and it is why this cannot be a fade-in of a finished image.

| Phase | Range | Event |
|---|---|---|
| The empty plate arrives | 0.00–0.10 | opacity 0→1, y 5vh→0 |
| **HOLD — bare ivory** | **0.10–0.18** | nothing on the paper; the scene's patience starts here |
| Graphite construction | 0.18–0.30 | `pathLength` 0→1, left open and unclosed |
| Ink: architecture | 0.28–0.46 | primary contour, then window slits and roof lines |
| Ink: ridge and river | 0.36–0.50 | `pathLength` |
| Pigment | 0.44–0.58 | washes under ridge and river (opacity, **not** drawn — paint lands), then the swatch band |
| Botany | 0.56–0.72 | stem drawn, leaves, then berries as a staggered group |
| The hand writes | 0.68–0.80 | three field notes in Caveat |
| Corner labels | 0.72–0.84 | opacity |
| **HOLD — visual silence** | **0.80–1.00** | a fifth of the scene with nothing moving |

### Why it is layered and not an image
Paper, SVG line, wash, notes and labels are all live layers. That is what lets the plate assemble at all — you cannot draw a flattened JPEG on in the order it was made — and it is the form Anastasiia's real artwork has to drop into (ASSET-MANIFEST: "final plate stays layered, flattened images only as fallback").

Pigment sits **under** the ink in paint order, the washes deliberately drift past the contour, and the construction pass is never closed up. The geometry is hand-authored placeholder work in `components/sketch/folioPaths.ts` and the plate carries a visible "Development plate — not the artist's work" label until real studies exist.

**Reduced motion:** every layer renders at its final state, no draw, no stagger.

## SCENE: Creative Pillars (`CreativePillars`) — BUILT 2026-08-09
Four chapter rows, each a small world rather than a card in a list: the footage is the subject, and the study being made *from* that subject is drawn over it as the row arrives.

Per-row `useScroll` with `offset: ["start 88%", "end 45%"]` — each world resolves on its own arrival, not slaved to one section-wide progress. Draw 0.12–0.62, paint 0.46–0.86, media parallax +4%→−4% (the image is scaled 1.1 so the drift never exposes an edge).

| # | World | Study |
|---|---|---|
| 01 Line | camp architecture footage | monastery massing: construction, then contour, then window slits |
| 02 Colour | braided Indus footage | the four pigment swatches land |
| 03 Texture | no footage — the world *is* the study | a weave drawn thread by thread: warp in ink, weft in clay |
| 04 Botany | sea buckthorn footage | the sea buckthorn sprig, then leaves and berries |

### Why the geometry is the Folio's own
Each pillar reuses `folioPaths.ts` directly, cropped by viewBox. That is the point: the pillars are where the four studies get **made**, the Folio at the end of the page is where they are **assembled**. Reusing the literal paths turns the climax from a handsome plate into a recapitulation of marks the visitor has already watched being drawn.

### Known mismatch — Line
Pillar 04 works because the drawn sprig sits over footage of the actual plant: drawn subject and photographed subject are the same, which is the site's whole thesis in one frame. Pillar 01 does **not** have that: the study is a Thiksey-style monastery massing and the footage is a timber cottage at the camp. It reads as a study laid over a reference rather than a tracing of it. Left as-is because the copy explicitly names Thiksey, Leh Palace and Stakna — none of which are in any footage we hold. The honest fixes are a real Thiksey still, or moving the study off the photo onto its own paper patch.

## Timing tokens (from spec §20, tuned)
micro 200ms · small reveal 500ms · editorial 900–1200ms · transformation scroll-owned · annotation stagger 120ms.

## SCENE: Signature — reality + sketchbook (`SignatureScene`) — BUILT 2026-08-09
The move the site turns on, and the piece the client identified as most conspicuously missing. Real footage of the room at The Indus River Camp plays behind; a sketchbook is held low in the frame; inside it the same view is drawn. Placed **immediately after the hero**, before any editorial copy, because the client's note was that it has to land straight out of the film.

Container: 340vh (300vh mobile), inner sticky viewport → progress **q**.

Primary footage: shot 15 (glass pavilion → river → mountains, 37.92–44.21s, cut as `v05-window-mountains.mp4`). Composition follows **Ref0** — the authentic Seoul frame, the only real one: book held low and near-horizontal, real scene surviving above it. **Ref4** supplied the Ladakh equivalent.

### The Seoul reel, measured
The motion was taken off `seoul-sketching-reel.mp4` frame by frame rather than invented. What that clip actually does, in three beats:

1. **0.0–2.8s — the book is held obliquely and turns.** It enters steeply foreshortened (the page seen at a sharp angle, the block's edge visible) and rotates progressively toward the camera until it is nearly flat, rising and growing slightly as it goes. **The background barely moves** — the pavilion holds its position in frame throughout. The animation belongs to the hand, not the camera. This is the detail that was missed on the first pass.
2. **~2.8s — flat to camera.** The drawing is readable, the real subject still plainly visible above it.
3. **3.35–4.2s — the book is lowered out of frame**, revealing the full real view (pavilion, pond, reflection). The drawing first; the place it came from second.

Beat 3 is the payoff, and the first build did the opposite — it dimmed the film at the end. The film now *returns* to full strength as the book drops away.

| Phase | Range | Event |
|---|---|---|
| Film alone | 0.00–0.06 | v05 full-bleed, graded; observation line fades in |
| Book raised in, held oblique | 0.06–0.18 | y 44vh→7vh, scale 0.86→0.97, **rotateX 54°→45°**, roll −4.5°→−2.6° |
| **HOLD — blank page** | **0.18–0.24** | a bare page against the real view; nothing moves |
| Graphite construction | 0.24–0.38 | greyscale pass to opacity 0.5 |
| Colour sweeps across | 0.34–0.66 | soft-edged mask travelling left→right |
| Annotation written | 0.64–0.72 | handwritten place and date |
| Turned flat to camera | 0.68–0.82 | **rotateX 45°→1°**, y 7vh→0, scale 0.97→1.07, roll →0; film saturation 1→0.5, dim →0.3 |
| **HOLD — presented** | **0.82–0.90** | the drawing readable, the real view still visible above it |
| Book lowered away | 0.90–1.00 | y 0→66vh, rotateX 1°→20°, scale →0.99; **film saturation 0.5→1, dim →0** |

`.signatureSpread` carries the tilt with `transform-origin: 50% 92%` under a 1500px perspective on `.signatureBook`, so the book pivots where a hand would hold it instead of spinning about its centre.

### The two techniques that carry it
1. **`mix-blend-mode: multiply` on the artwork over our own paper.** The generated file has cream paper baked in; multiply drops that paper away and leaves only ink and pigment, so the marks sit *on* our page instead of reading as a photograph of someone else's page pasted on. It also means the page can exist, blank and lit, before a single mark arrives — which is what makes the hold at 0.20–0.26 worth having.
2. **A soft-edged mask sweeping left→right** (`--sweep`, a bare number driving `calc()` stops in a `mask-image` gradient) rather than a cross-fade. The drawing arrives the way it was made — construction first, colour following the hand across the page.

The artwork holds the shot's composition because it was generated *from the v05 frame*, so the drawn mullions, ridge, river band and chairs land where the real ones do. The correspondence is close, not pixel-exact — which is why the scene deliberately does **not** overlay the drawing on the footage. Reality stays photographic above; the page interprets below. That is also what Ref0 actually does.

**Reduced motion:** same composition as a still — poster frame, dimmed, completed page, no sweep.
**Mobile:** real view upper, spread lower at 92vw — the phone itself reads as the field journal.

## Implementation finding — Motion 13 scroll/WAAPI workaround
Handing raw `useTransform(scrollProgress, …)` values straight to `style` let Motion promote some simple opacity/transform cases to native Web Animations whose timeline mapping proved unreliable for container-targeted `useScroll` (elements froze at stale values; verified in Chromium via `el.getAnimations()`). All directly scroll-driven style values now go through `useScrollMapped` / `useScrollComputed` (`/lib/animation/useScrollMapped.ts`), which update via `useMotionValueEvent` and are applied as plain per-frame inline writes. Spring-derived values (`useSpring`) and SVG `pathLength` were unaffected and stay as-is. Re-evaluate on future Motion upgrades.

## Performance notes
- Only transform/opacity/clip-path/mask-position animate; no layout animation anywhere.
- Videos: `preload="auto"` hero only; v02 `preload="metadata"`, played only when sticky region intersects; both `muted playsInline loop`, paused when offscreen.
- Paper fibre = one static SVG turbulence layer, `pointer-events:none`, no animation.
- Lenis `lerp: 0.1`; destroyed under reduced motion.

## SCENE: The film, traversed (`FilmHero`) — BUILT 2026-08-11

**Replaces `SketchbookHero` as the page's opening.** That component is kept in
`components/sections/` and can be swapped back in from `app/page.tsx`; nothing
was deleted.

**Intent contract.** The film is not played, it is *traversed*: scroll position
maps directly to `video.currentTime`. The visitor pushes the camera into a
painted mountain, waits out the cloud, travels up the page, arrives on the
bird. Every frame is where they put it, and a hold is simply where they
stopped — which delivers the brief's "moments of calm" without authoring them,
and makes the motion scroll-choreographed in the most literal sense available.

**Pace lives in CSS, not JS.** `.filmHero` is `640vh`; the sticky inner is
`100vh`, so the scrubbable range is 540vh ≈ 130px of scroll per second of film
at a 900px viewport, roughly one wheel notch per second. Lengthen the section
to slow the film down. This is the tuning knob.

**The encoding matters more than the code.** `/public/video/hero-film.mp4` is
encoded with `-g 10 -keyint_min 10 -sc_threshold 0` — a keyframe every third of
a second, so a seek decodes at most nine frames. Re-encoded at the usual ~8s
GOP the identical component stutters badly. **If scrubbing ever feels sticky,
check the GOP before touching the JavaScript.**

**Resolution, revised 2026-08-11.** The first pass mastered the film at
784×470 — Pika's native output — and it looked soft the moment it was shown
full-bleed, because that is a 2x upscale on a 1600px viewport. No encoder
setting recovers pixels that were never there. The film was therefore rebuilt
at **1280×768** from the higher-resolution sources (`source/film/_hd/`, master
`_assembly/drawn-at-altitude-film-v3-hd.mp4`): the concept spreads are
1448–1491px, Ref1/Ref3 941×1672, the bluethroat photograph 1069×1336. Only
Gen 01 and Gen 05 are hard-capped at 784×470, being generated clips, and are
lanczos-upscaled. Delivered at crf 30, 7.0 MB. crf 27 (9.6 MB) was compared
frame-for-frame and is indistinguishable — resolution was the binding
constraint, not bitrate.

**Seek coalescing.** Assigning `currentTime` on every scroll frame queues seeks
inside the element and the image falls progressively further behind the scroll
the faster you move. `FilmHero` therefore keeps one pending target, issues a
seek only when no seek is in flight, flushes on `seeked`, and skips sub-frame
moves (< 1/60 s).

**Decoder priming.** Safari and iOS ignore `currentTime` on a `<video>` that
has never played. On `loadedmetadata` the component calls `play()` and
immediately `pause()`; without it, scrubbing silently does nothing on those
browsers.

**Grade.** `.heroReel` no longer applies `--film-grade`. That token exists to
pull digital cyan out of the 480p camp proxy, which this film no longer
contains — and a sepia + hue-rotate would walk Gen 06's measured sand off the
target value it was matched to.

**Reduced motion.** No traversal: a single still (`hero-film.webp`, the frame
at 16.2s) carrying the whole idea — the real riverside chairs, and the same
chairs drawn on the held page.

**Not yet verified in a browser.** The change was confirmed structurally (DOM,
section height, asset served 200 `video/mp4`, ffprobe) but playback and scrub
feel were never seen: the dev Chrome window kept minimising, and Chrome will
not load media in a hidden tab (`visibilityState: "hidden"` → `readyState 0`).
Open the page with the window visible and scroll the hero to confirm.

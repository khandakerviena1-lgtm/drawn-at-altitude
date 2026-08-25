# Implementation log — Indus River Camp cinematic sequence

## STATUS: REMOVED 2026-08-17

Unwired from `app/page.tsx` the day it was built — "no point". Component and
plates kept intact (`CampJourney.tsx`, `/public/img/journey/`); re-adding is
one import.

**Why it did not land, recorded so it is not rebuilt blind:** the ceiling is
the source material, not the technique. Perspective and occlusion can fake
moving *forward* through a flat photograph; nothing can produce looking left,
right or up, because a flat frame holds no information past its edges. The
reference the client compared it to (Lakshmi Vilas Palace, filmed at
localhost:3000 by `webdeveloper_us`) contains no 3D either — its most
"spatial" moments are a three-card grid and a typographic slide reading "The
space. Seen from above." Its advantage is material: a palace, professionally
shot, with aerials. Ours is six stills of a camp.

Real free-look needs capture at the property: 360° spheres (a phone
photosphere per point is enough), a Matterport/Polycam scan, or gaussian
splatting. Brief issued to the client for six spheres — drive, veranda,
bedroom, bathroom, terrace, riverbank — starting with one test sphere.

## 2026-08-17 — first milestone (superseded)

### Assets identified (local, no duplication)
Classified by content, not filename. Exported once to `/public/img/journey/`
(1920w, webp q80, 1.5MB total); masters untouched in `source/`.

| State | Source master | Anchor (object-position) |
|---|---|---|
| 01 exterior | `source/photos/camp/cottage.jpeg` | roofline + snow ridge, 50% 38% |
| 02 veranda | `source/photos/camp/veranda.jpeg` | thatch edge + river, 62% 45% |
| 03 glass | `source/photos/camp/longview.jpeg` | glazing posts + reflection, 50% 45% |
| 04 bedroom | `source/photos/camp/bedroom.jpeg` | lit window wall, 45% 55% |
| 05 window | `source/real-drawn-pairs/camp-room-window-photo.jpeg` | mullions + ridge, 58% 45% |
| 06 landscape | `source/photos/IMG_5664.jpeg` | ridge line + reeds, 50% 55% |

### Architecture
- `components/sections/CampJourney.tsx`, wired in `app/page.tsx` between
  CreativePillars and RoomSlider. Integration above: the pillars' editorial
  flow releases into the exterior. Integration below: the sequence ends on
  the open landscape and hands into "One place to return to" (the rooms).
- Type A cinematic: 500vh outer (340vh mobile), 100vh sticky stage.
- Existing animation stack extended, per the inspect-first rule: motion/react
  + Lenis + `useCinematicScroll` (damped scrub ≈ GSAP scrub 1) +
  `CAMERA_EASE` (= power2.inOut). No GSAP added; no second scroll engine.
- Scroll position = animation position. No snap, no activeSectionIndex, no
  onEnter-play. Reverse is exact by construction (pure mappings of p).
- One camera direction: every plate's scale rises through its whole life
  (1 → 1.03–1.14). Interior arrivals (bedroom, landscape) resolve from
  blur 5px + saturate 0.72 so they read as focus, not as a new image.
- Copy: one kicker at arrival, "Step outside." at the end. Nothing else.

### Transition timeline (p across the section)
exterior hold 0–0.15 (push 1→1.035) · approach 0.15–0.32 ·
veranda 0.20–0.50 · glass 0.42–0.68 · bedroom 0.58–0.84 (ambiguity mid
~0.62: glass 0.75 / bedroom 0.50) · window 0.74–0.96 · landscape 0.88–1.

### Revision 2 — why v1 felt flat
Client: "it doesn't make you feel you are in a 3D rendered visiting the place."
Correct, and the cause was the mechanism, not the timing. v1 animated
`scale`, which enlarges a picture uniformly — near timber and far ridge grow
at the same rate. Approach does not look like that. Three replacements:

1. **Perspective, not scale.** Stage carries `perspective: 1200px`; plates
   travel on `translateZ`. Perceived size is P/(P−z), so z values are derived:
   z 300 → 1.333×, z 165 → 1.16×. Edges now diverge as they do on approach.
2. **Occlusion.** Near plates travel far in z (exterior/veranda/glass to
   300–320, i.e. 1.33–1.36×) and blow past the camera out of the frame edges;
   the landscape, being the destination rather than something passed, only
   reaches 1.05×. Differential 1.27× — that ratio is the "I just passed that"
   cue v1 had none of.
3. **A threshold, not a crossfade.** Window → landscape is no longer a
   dissolve: the landscape is born clipped to the glazing of 05-window
   (measured: x 245→745 of 900, y 45→390 of 562 → `inset(8% 17.2% 30.6%
   27.2%)`) and the aperture opens to full bleed over p 0.88→0.985. You pass
   through the window.

Plate boxes are overscanned to 124% (`inset: -12%`): a plate at negative z
renders at 0.945× and would otherwise let the stage show through its edges.
Verified 1.24 × 0.945 = 1.172× — always covers.

### Test results
- Numeric validation (node, offline): combined opacity ≥ 1.000 at every p —
  no blank frame anywhere; all five handovers overlap; both images visible
  at every crossover midpoint (worst pair 0.58/0.56).
- tsc clean; FilmBook contract script still passes; page 200; all six
  plates serve 200.
- Server HTML: 6 journeyPlates render, section order confirmed
  pillars → journey → rooms.
- Stop-mid-transition and reverse are structural (pure p-mappings), not
  timed animations — they cannot auto-complete.
- NOT verified visually in motion: the session's browser tab reports a 0×0
  viewport and 0 rAF frames (documented project-wide limitation). Anchor
  alignment between plates is chosen from stills, judged, and needs one
  human pass; object-positions are one-line tweaks.

### Reduced motion
Static fallback: exterior + landscape in normal flow with the closing line.

### Canva
No Canva connector exists in this session — ToolSearch returns zero Canva
tools (checked before building, per the no-hallucination rule). Routes A–C
unavailable; the local landing page remains the sole implementation. If a
Canva MCP is connected later, the sequence is self-contained in
CampJourney.tsx + /img/journey/ for porting.

### Remaining limitations
- Anchor alignment unseen in motion (0×0 headless viewport).
- 06-landscape is 444KB — could be re-encoded harder if LCP matters.
- No preloading strategy beyond eager imgs; fine at 1.5MB total.


## Itinerary in English, with two ways to take it (2026-08-17)

The itinerary chrome was still French on an otherwise English page — day labels,
meal headings, thermometer units, arrow labels, the heading and the SVG
description. All translated; the day copy in `retreat.ts` was already English.
"Ladakh · 9 jours" became "Ladakh · nine nights", which is also the corrected
count (nine nights, ten dates).

Two modes, because two kinds of reader arrive at an itinerary. **Explore** is
the default and is what existed: drag the line, pick a day, nothing moves on its
own. **Play** walks the ten days by itself — 1.05 s to move, 4.6 s to read —
and stops at day 10 rather than looping, because the journey ends. Any manual
input surrenders autoplay through a single `take()` wrapper, so there is exactly
one place where that happens and no way to end up fighting the animation for
control. Under reduced motion the move is a cut and only the dwell remains.

## Sketchbook: say what scroll does, and offer a way past it (2026-08-17)

The hint said "scroll" and faded at p=0.075. Two faults: it never said the film
runs backwards too — the one thing about the section a reader cannot guess —
and it started at p=0.008, so it was invisible at scroll position zero, the one
moment it exists for. It now reads "Scroll up and down — the film follows you
both ways", is present on landing, and stays until the film has started.

`Skip the sketchbook` sits opposite it and is available the whole way through,
not only at the start: someone two beats in who wants the practical detail
should not have to scroll the rest of the film to reach it. It routes through
`scrollToY` rather than `window.scrollTo`, because Lenis owns scrollTop while it
runs and drags a native jump straight back. Its pointer-events follow its
opacity, or an invisible button would keep swallowing clicks over the closing
spread.

Verified in the browser: skip lands on 2535 = the Intro's top edge exactly;
Play advances 1 day per 5.65 s as designed, reaches day 10, stops, and flips
itself back to Explore; an arrow click mid-play returns to Explore; hint and
skip are both opacity 1 at scrollY 0 and both 0 with pointer-events none at the
end; the two never overlap at 1280 px.


## The sketchbook turns onto blank paper (2026-08-17)

Four client notes, all on `FilmBook`.

**The title sat on the card.** Measured at 430x325: the display line ran
94-124px and the card 107-218, a 17px collision. The card is centred in the
sticky viewport while the title is absolutely placed near its top, so they meet
whenever the viewport is short. Fixed by dropping the book 9vh while the title
is on screen and lifting it back to centre as the title leaves — the collision
only exists during the card phase, so neither the card size nor the title
position had to change. Now a 12px gap.

**Too fast.** `.filmBook` 780vh -> 1200vh. The phase map is fractional, so this
one number slows every scrub, every caption and both forming windows in
proportion, with nothing retimed. 54% more scroll per beat.

**Turn onto blank paper, then the image forms.** Both spreads used to carry
their film the moment they were uncovered — the cover opened onto a finished
picture and the leaf turned onto another one, which is not how a sketchbook
behaves. Each plate is now masked behind a soft 26% diagonal edge that travels
across the spread, with the spread's own paper showing until it passes, and a
saturate 0.35 -> 1 ramp trailing it so colour dries in behind the shape rather
than wiping on. Spread B's window opens exactly at `TURN_END`, so the entire
turn happens over genuinely empty paper. Verified by sampling the computed mask:
spread A 0% at p=0.10, 35.6% at 0.15, complete by 0.20; spread B still 0% at
0.46, 0.49 AND 0.52 — blank for the whole turn — then 78% at 0.55, complete by
0.60.

**Page arrows.** `STOPS` is derived from the caption beats (card, each beat's
midpoint, card) so retiming a caption moves its page with it. An arrow is a
scroll to that page's position, not a second state machine, so the arrows and
the wheel can never disagree. ⚠️ First version indexed by "the next stop past
current progress", which made the very first click a no-op: at the top of the
section progress is 0 and stop 0 is 0.02, so it scrolled 72px and stayed on
page 1. Now indexed off the page counter through a ref — one click, one page,
verified 1→6 and back to 3, with the arrows disabling at both ends.

## Spinning the wool joins the dye sequence (2026-08-17)

`source/real-drawn-pairs/spinning-wool-drawn.png` (1536x1024) resized to
1500x1000 — the exact format of the ten dye plates, same 3:2, so no crop and no
letterbox — as `public/img/dye/spinning-wool.webp`.

Placed by the logic of the process rather than appended: the dyestuffs are
gathered first (henna, henna leaves, marigolds, myrobalan), then the fibre has
to exist before anything can be dyed. So spinning goes immediately before RAW
SILK and immediately after the last raw dyestuff — position 5 of 11.

⚠️ It keeps its own filename rather than a `dye-NN` one because it comes from a
different batch with different provenance. Like every spread in this section it
is described in its alt text and never attributed — the `real-drawn-pairs` set
is PoC-cleared only and its authorship is still unconfirmed.


## The first sketchbook is leafed through by hand (2026-08-17)

`components/sections/InteractiveSketchbook.tsx`, replacing `FilmBook` as the
first section. **`FilmBook.tsx` is kept unwired** — the project's convention for
superseded sections — so the scrubbed film is one import away from returning
further down the page.

**Why it had to be a replacement and not an edit.** The brief's central rule is
that vertical scroll moves the visitor through the landing page and arrows move
them through the book, and that the two never mix. `FilmBook` was 1200vh of
sticky section whose entire purpose was to bind scroll to the book — the exact
coupling the brief rules out. The new section is 168vh, touches no wheel or
touch handler, and scrolling past it behaves like scrolling past anything else
(verified: `scrollTo(+400)` moves exactly 400px, no `isGated`, no lock).

**The book model is a real one, and that is what makes the blank beat honest.**
Each asset is a whole spread, so the book shows its left and right halves side
by side (one image, `background-size: 200%`, positions 0% and 100%). Turning
forward lifts the right half at the spine and lays it on the left; the leaf's
underside is bare paper, so once it lands the entire book is blank — both
halves — and only then does the next spread come up out of the paper. That is
the supplied storyboard exactly: lift, curl, cross, land, nothing, drawing.

**The curl is three nested panels**, each hinged on the edge of the one before
it, so the outer corner travels further and faster than the paper at the spine.
Rotating a single plane gives a rectangle pivoting, which the eye reads as a
card. Slices are sized to reassemble: forward turns carry background positions
60/80/100% (the right three of six across the spread), backward turns 40/20/0%
— both verified in the DOM mid-turn.

**Timeline** 1000ms turn + 320ms blank + 850ms reveal = **2170ms**, inside the
brief's 2-2.3s. Bend peaks at 15 degrees at the halfway point and returns to
zero: a page is only curved while it is being held. Shade and cast shadow ride
the same sine, so the sheet darkens and its shadow narrows through the vertical
and both vanish as it lands.

**The reveal is three registered layers of one drawing**, built by the new
`scripts/make-sketchbook-pages.py` — the recipe `SketchReveal` documented in
prose and never had a script for. Divide the greyscale plate by a heavy blur of
itself: broad wash tone cancels, fine dark strokes survive; emit that twice, as
faint warm graphite and as dark ink. Because all three come from one file they
cannot drift apart. Windows verified offline: at reveal 0 all three cover 0% —
**the page is genuinely blank** — then pencil, then ink, then colour, at
different angles so it does not read as one mechanical wipe.

**Verified in the browser:** forward and reverse both turn the correct half
with the correct slices and the correct cast-shadow direction; six clicks fired
as fast as the event loop allows advance exactly **one** page; keyboard
Left/Right work only while the book holds focus; and the book's rect is
byte-identical before, during and after a turn (`20,38,375,250`) — the camera is
locked and only the paper moves.

⚠️ **The preview tab was throttled during this work** (rAF at 0 fps, timers
firing 2 ticks of an expected 30), so the animation was validated structurally
and numerically rather than watched. It needs a look on a real screen.

⚠️ **The upward scroll cue is deliberately not rendered.** The brief asks for
"Look through the window from your room" above and "Sketch from the river"
below. The downward one is true — `ArtistVision` (the Indus Sangam) is what
follows. The upward one is not: the sketchbook is the first section, so there
is nothing above it, and the room and window material sits *below*. The cue
renders itself the moment the section is no longer first
(`el.getBoundingClientRect().top + scrollY > 8`); both strings are already in
`sketchbookCues`. Moving the book below the room section makes both true and is
a one-line change.

⚠️ **Provenance unchanged.** All five pages are `source/real-drawn-pairs`
spreads, PoC-cleared 2026-08-15 with authorship unconfirmed. Every one is
described in its alt text and none is attributed.


## Corrected: the pages are the film's pages, and scroll stays (2026-08-17)

Two client corrections to the previous entry, both fair.

**"Why did you change the pictures?"** I had substituted a different set of
drawings (the `real-drawn-pairs` spreads) for a book that was supposed to show
what the site already showed. Fixed at the source: `make-sketchbook-pages.py`
now lifts each plate out of `book-a.mp4` / `book-b.mp4` at the moment its
caption was on screen, so the pages ARE the film's pages and each carries the
line the film carried under it. The book's aspect moved 3:2 -> 5:3 to match the
film, so nothing is cropped.

Four pages, not eight: the film alternates drawn and real, and the room, the
riverside chairs and the sea buckthorn are photographs — a photograph is not
something you turn. Those stay in the film. The bluethroat spread is also
deliberately out: it carries a plausible dated record in a convincing hand with
unconfirmed provenance, and promoting it from a passing frame to a page a
visitor dwells on under a caption raises its exposure. It remains in the film,
where it already was.

**"Keep the option to scroll up down like we used to."** Removing FilmBook was
a step too far. `Sketchbook.tsx` now picks between the two, the way the
itinerary picks between Explore and Play: TURN (arrows, 168vh) and SCROLL
(the original scrubbed film, 1200vh). Same pictures either way. Each mode
carries the control back to the other — in film mode it sits with the pager and
the skip, pinned in the sticky viewport, so it is reachable from anywhere in
the 1200vh rather than only from the top.

⚠️ **Bug found while testing the switch, and fixed.** The two modes are 168vh
and 1200vh, so changing mode changes the height of the section under the
visitor's feet. Switching out of the film half way down left them **3,357px
past a section that had just got seven times shorter** — measured. Both
switches now re-anchor to the top of the section. Verified from 5,000px deep in
the film: lands at the sketchbook, visible, section top at 0.

Verified: pages run Thiksey -> Indus River Camp -> Key places -> Momos with the
film's own captions, arrows disable at both ends, and both mode switches mount
the right component (film mode: 12 viewport heights, both clips, pager, skip).


## Eight pages, three of which you can look around in (2026-08-17)

**All eight of the film's pictures are now pages**, flipped by the arrows:
Thiksey, the Indus River Camp, your room, the riverbank, sea buckthorn, Key
places, Bluethroat, Momos. Each carries the line the film carried under it.

**The drawing appears without animation.** The staged graphite -> ink -> wash
reveal is gone, and with it the derived line layers — `make-sketchbook-pages.py`
now emits colour plates only and deletes the stale `-ink` / `-pencil` files. The
leaf still turns and the blank beat is still there (320ms), but when the page
lands the drawing is simply on it. Verified: the plate's computed
`transition-duration` is 0s, so nothing eases in.

**Pages 3, 4 and 5 scroll, and only those.** They are the film's real-footage
segments, and each one travels between the place and the sketchbook — the bed
rising to the window and the valley (book-a 6.4-8.8s), the mountains coming down
to the chairs and the open book (book-b 0-3.4s), the picker down to the drawn
branch (book-b 4.0-6.4s). Scrolling one is looking up and down between what is
in front of you and what is on your page, which is exactly what the cue says:
"Scroll to look up and down as much as you need to draw what the place makes
you feel."

**The scene scroll is a real scroll container, not a captured wheel.** The pane
is `overflow-y: auto` with a 220% spacer and a sticky video; its scrollTop
drives the clip's currentTime. Three things fall out of that for free: when the
pane runs out the browser chains to the document and the landing page carries
on; touch, trackpad and keyboard all work with no gesture code; and there is no
`preventDefault` anywhere. `data-lenis-prevent` keeps Lenis off the pane —
without it the smooth scroller swallows the wheel before the pane sees it.

Verified by driving the pane: scrollTop 0 / 25 / 50 / 75 / 100% maps to
6.40 / 7.00 / 7.60 / 8.20 / 8.80s, dead linear across the segment; the page
still scrolls its own 300px afterwards; the double-headed arrow hint fades to
0.02 once you reach the bottom.

**Arrows are black now** (`--graphite`, 0.9 opacity, filling solid on hover) —
they are the book's only control and a thin grey arrow was not reading as one.

⚠️ **The bluethroat spread is now a page, at the client's explicit
instruction.** It had been left out and flagged: it carries a dated record
("Indus Valley, Ladakh / 22 May 2024 / 7:15 am") in a convincing hand whose
provenance is unconfirmed, and a page a visitor dwells on under a caption is
more exposure than a passing frame. Included as asked; the constraint is
unchanged — PoC only, and it must never be presented as a genuine field
observation.


## No blank pause; scroll pages open on the drawing (2026-08-17)

Two client corrections.

**"Pictures should already be present in the pages as the sketchbook is
flipping."** The earlier deliberate blank beat is gone. `current` (and with it
`page`, the caption, the count) now flip to the destination the instant a turn
starts, not on completion — so the destination's plate (or scene pane) is
mounted underneath from the first frame of the turn, and the departing page's
picture rides on the leaf in front of it. `fromPageRef` holds what the leaf
should show, since `page` itself is already the new page by the time Leaf
renders. `BLANK_MS` / `RM_BLANK_MS` and the third `phase` value are gone.
Verified in the same tick as a click: leaf front = departing page's key, plates
underneath = destination's key, both present together.

**"The scrolling pictures must start from the drawing."** Fine-sampled all
three scroll segments at 0.4s steps (contact sheets in the session, not kept in
the repo). Room already opened on the drawing (6.4s, sketchbook filling the
frame) and needed nothing. River and buckthorn had it backwards — their
`from` was the real photo, so scrolling *revealed* the drawing instead of
taking it away. Both reversed: river now 2.6s (drawn) -> 0.0s (real), buckthorn
6.0s (drawn) -> 4.0s (real). The poster/plate stills were regenerated at the
new drawn instants, since the plate now also has to be right for the turning
leaf, which shows a still. Verified: both open on their drawn time and land on
their real time after a full scroll.



## Mobile pass: three real tap-target fixes (2026-08-18)

Audited at 375px (mobile preset). No horizontal overflow anywhere on the page
-- `document.documentElement.scrollWidth === innerWidth` -- the wide elements
that show up in a naive DOM sweep (`.visionStage`, `.processStrip`) are
deliberately oversized panels clipped by their own containers, not bugs.

Swept every button/link for tap-target size and found three real ones, all
well under the ~40px minimum a thumb needs:

**`.sbModeOff` ("Scroll the film") — 116x13px.** The only way to reach the
scrolled film on a touch device, and 13px tall. Fixed with `padding: 13px 8px`
+ matching negative margin -- the padding genuinely grows the element's own
box (measured 132x39px after), the negative margin cancels its effect on the
surrounding layout so the row still sits exactly where it did. Verified the
`.sbModeOn`/`.sbModeOff` row does not overlap after the change (132 ends,
138 begins).

**Journey day-marks — 15px SVG hit circles, 77px apart.** Added an invisible
`r=45` circle (`fill="transparent"`, not `none` -- `none` shapes take no
pointer events at all) as a same-<g> sibling of the visible dot in
`JourneyTimeline.tsx`. 77px spacing gives ample room; verified a point 90% of
the way to the *next* dot still resolves to this one via `elementFromPoint`.

**`.processTick` (method-deck stage dots) — 18-21px, only 34-35px apart in a
fixed-width flex row.** Real padding would widen the row past the 375px
viewport with nowhere to go. Used an invisible `::after` hit-area instead
(`inset: -10px -6px`), which extends the clickable region without touching
layout at all. 6px horizontal keeps neighbouring extended zones from
overlapping; vertical has slack the row doesn't, so it goes further there.
Verified by hit-testing a real DOM point 4px past the tick's own edge, inside
the pseudo-element's 6px extension -- resolves to the tick. Left honestly
short of 40px, which ten side-by-side targets in 327px of rail make
structurally impossible; the arrows beside it remain the primary control at
a real 38px.

Confirmed elsewhere already comfortable and untouched: RoomSlider/DyeWorkshop
arrows (52px), the sketchbook's own page-turn arrows (44px, `.sbArrow`
already had a mobile rule pulling them inside the book edges).

⚠️ The remote browser tab hit its known rAF-throttling issue mid-session
(a backgrounded tab stops driving requestAnimationFrame, so a Framer Motion
`animate()` mid-flight never calls `onComplete` and the sketchbook's turn
lock never releases) -- not a site bug, a testing-environment artifact seen
before in this project. Worked around it by verifying geometry and hit-testing
statically rather than through full animated interaction sequences.


## Mobile: the real cause, and a header rewrite (2026-08-18)

The client reported "not working well on mobile." Investigated properly this
time rather than assuming CSS.

**The actual cause, found in the dev server's own log:** `next dev` blocks
cross-origin requests to dev-only assets by default, and testing on a real
phone happens over the LAN address (`http://192.168.1.18:3000`, printed by
`next dev` as "Network:") -- a different origin from `localhost`. Every JS
chunk request and the HMR socket were being silently blocked with a 403-style
refusal logged server-side; the page's HTML still loaded, so it would have
LOOKED present on a phone while zero JavaScript ran -- no Lenis, no
sketchbook, no itinerary, nothing interactive on a page whose entire identity
is scroll-driven motion. That is a much better fit for "not working well" than
any layout bug could be on its own. Fixed with one line,
`allowedDevOrigins: ["192.168.1.18"]` in `next.config.ts` -- confirmed by
curling the LAN address's own JS chunk with an `Origin` header and getting 200
where it was silently failing before, and the "Blocked cross-origin" line is
gone from a fresh server log.

**Real UI bug found alongside it: the header.** At 375px the brand lockup
("INDIA-KHAN × NATURA ILLUSTRATA") and the three nav links were forced onto
one row by a `max-width: 150px` cap on the brand, which existed specifically
to keep them on that row -- and it worked by squeezing the company name into
a cramped two-line wrap beside the links on every single pageview, on every
phone. Rebuilt as a proper stacked header (`flex-direction: column`): brand
gets the section's full width and renders on ONE line (confirmed: natural
single-line width is 194px against 335px available), links sit on their own
row below with more breathing room (14px gap -> 20px).

⚠️ **That surfaced a second, genuine bug**, not a redesign choice: the
taller two-row nav (96px, measured) now overlapped the sketchbook's title by
23px, because the section's own top padding (`clamp(56px, 9vh, ...)`,
resolving to 73px at 375x812) had been sized for the OLD single-row nav and
had no idea the nav had grown. Fixed `.sb`'s padding-top, `.filmBookTitle`'s
top, and `.heroCopy`'s top (the last two are unwired but kept consistent) all
off one shared, measured formula: `nav-pad-y*2 + 60px + 1rem`, where 60px is
the stacked nav's own real content height at this breakpoint's fixed font
sizes (brand 27 + gap 8 + links 25), not a guess.

⚠️ **The first attempt at the `.sb` fix silently failed and taught something
about this file:** I placed the override inside the existing "phone" media
query block near the top of the mobile section, and it never applied --
`.sb`'s own BASE rule is defined much later in the file (its whole section was
built more recently), and at equal specificity a later same-specificity rule
wins regardless of which media query matches, media queries don't affect
cascade order. Moved the override to live directly after `.sb`'s own rule,
matching how every other mobile override added this session (FilmBook's pager,
the sketchbook's own styles) was already placed in this file. Worth
remembering for the next one: a mobile override for a newer component belongs
beside that component, not in the older shared "phone" block.

Verified at both 375x812 and 320x690 (the narrowest common phone): brand
single line at both, 16px clean gap between nav and title at both, zero
horizontal overflow (`document.documentElement.scrollWidth === innerWidth`)
before and after, and the scroll-mode film's title clears the nav by the
identical 16px -- same shared formula, same result, checked by switching
modes and re-measuring rather than assumed.


## Phone-testing pass: seven changes (2026-08-19)

All from the client's first real test on a phone.

**Sketchbook arrows below the book on mobile.** They sat ON the pages (inset
-6px), putting a thumb over the drawing to turn it. Now a centred row under
the book (top:auto/bottom:0, +-64px of centre), with 68px reserved in
.sbScene. Verified: arrow tops 494 >= book bottom 470.

**Scene-pane touch scroll no longer scrolls the page.** `data-lenis-prevent`
only tells Lenis to stand aside — it does not stop the browser's own scroll
chaining, and the pane STARTS at its top edge, so on touch an upward swipe
chained straight to the document. `overscroll-behavior: contain` +
`touch-action: pan-y` on .sbPane.

**Itinerary moved up** to directly below the sketchbook (page.tsx reorder;
the #journey anchor rides with it).

**The Valley, Observed: self-playing, stripped, contained.** Swapped
useCinematicScroll -> useAutoplayProgress(8s) — same MotionValue shape, so
the plane mappings didn't change. Section 340vh -> 100dvh (was 2,761px of
scrub on the phone). The traced ridge/river lines and the handwritten note
are unwired (AnimatedInkPath + SANGAM_* paths kept). visionStage
`max(100vw,161.51vh)` -> `min(...)`: contain, not cover — the photo had been
blown to ~1,311px wide on a 375px phone, the client's "too zoomed in".
Verified: 812px tall, stage 375 wide, 0 ink paths, no annotation.

**Nav hides on scroll down, returns on first scroll up.** 6px hysteresis so
Lenis's settling tail can't flicker it; never hides inside the first 120px;
reads window scroll directly so it works under reduced motion where Lenis is
off. Opacity rides the transform because exclusion-blended text half
off-screen reads as a glitch. Verified both directions via MessageChannel
polling (timers are throttled in the test pane).

**How a page is made: side by side on mobile, zoomed out.** Was stacked
(38vh panel above an 88vw page). Now panel ~108px + page ~165px on one row,
arrows wrapping to their own centred row beneath. ⚠️ Took three attempts,
each defeated by the cascade: (1) a LATER max-767px block re-inflated the
panel to 58vh — its height override is deleted; (2) `.revealPage`'s width
rule sits later than `.processPage`'s and won at equal specificity — doubled
selector `.processPage.revealPage`; (3) the max-900 block sits BEFORE
.processViewport's base rule, so the base won — descendant selector
`.processPair .processViewport`. Also the real budget is the pair's inner
295px, not the section's 335 (the pair adds its own --pad-x on top of the
section's) — 328px of content wrapped by 33px until resized to 287.

**Journey traveller and arrows.** The car's wheels rotated via per-element
origins that drifted at speed, and a spokeless circle shows nothing when it
spins anyway — now static, welded to the body. Whole traveller scaled 1.6x
(it measured ~15px on a phone); ride height -24 -> -30 so the bigger figure's
feet stay on the line. Arrows moved out of the text panel into a .jtArrowRow
directly under the frieze. Verified: row below SVG, 2 arrows in it, 0 left
in the panel.

**The cascade lesson, now three-for-three:** this stylesheet's mobile
overrides are only safe when they either live directly after their
component's base rules or out-rank them in specificity. Media queries do not
affect cascade order. Check `getComputedStyle` after every mobile edit here;
two of today's three "applied" rules silently weren't.


## Second phone pass: cover, cue, branding, side band, vision replay (2026-08-19)

**The sketchbook opens on its cover.** New page 1 of 9 from
`public/img/book-cover.webp` (contained onto the 1500x900 paper ground as
`sketchbook/cover-colour.webp`); the first arrow-turn opens the book onto
Thiksey. Standing flag travels with it: the cover's sketches are Kinnaur
Valley, Himachal Pradesh, not Ladakh — client-directed, unresolved.

**Scene cue rewritten to the client's own line:** "Hold the sketch with your
finger and move up — see what the sketcher saw to draw what they drew."

**All India-Khan mentions removed** (client instruction). Lockup is now
"Indus River Camp × Anastasiia" — spelled Anastasiia to match the rest of the
site; the client wrote "Anastasia", flagged. Itinerary caveat, flights line
and facts reworded neutrally. ⚠️ **The operator legal block went with it, and
that needs eyes before publication:** the APST IM 075 190048 / RC APST/285428
/ HISCOX line is India-Khan's own registration, so it cannot stay once the
name goes — showing credentials detached from their holder (or reattached to
another name) would be a false statement on a commercial page. The page now
names only ground operations (Alphonso Stories, Delhi) and carries NO
licensed-operator or financial-protection disclosure, which the previous
version had. Verified 0 India-Khan matches in rendered body text.

**The fixed header is gone; navigation is a side band.** Yesterday's
hide-on-scroll didn't resolve the client's real objection — a bar that is
always THERE on a page that is mostly artwork. Collapsed: a slim vertical
"Menu" tab, right edge, mid-height (31x77px, real button). Open: a paper band
slides out with the three section links at 41px row height each; a link click
closes it and jumps (#journey verified landing), Escape and tapping outside
close it. The brand lockup moved into the sketchbook's title block, in flow —
a name does not need to follow the reader to the booking table. Old .siteNav
rules kept dead, per the swappable convention. ⚠️ Verified via
MessageChannel polling and with the transition disabled for geometry (this
test pane cannot run CSS transitions): open panel spans 199-375 at 375vw,
fully on screen, tab attached at its left edge.

**The Valley's animation bug, diagnosed and fixed.** The client reported "a
bug on the animation of the first picture", with a screenshot showing the
photograph static and the copy missing. Both symptoms shared one cause:
useAutoplayProgress plays ONCE, EVER — fire that once while the reader is
mid-flight past the section (or before paint) and every later visit finds a
frozen, half-pushed photograph; and the text's opacity rode the same progress
value, so a failure to play also erased the words. Fix: replay-on-entry
observer inline (reset on exit, re-run on enter — this scene ends pushed-in,
not on a resting truth, so replaying costs nothing), threshold 0.5 -> 0.34
(half of a full-viewport section is a strict ask on a short phone), and the
copy is static — words need to be there, not choreographed.
useAutoplayProgress itself is untouched; WindowMorph (unwired) still uses it,
and its once-only behaviour is right for the scene it was built for.


## The valley is a still photograph (2026-08-19)

"Stop the animation" — so it stopped. ArtistVision is now the photograph, the
scrim and the copy, nothing else: no planes, no push, no observer, no motion
imports at all. This ends the chain of treatments this section has been
through (invented SVG ridge -> scroll-scrubbed three-plane push with traced
lines -> self-playing push with replay); each carried its own failure mode,
and the photograph carries none. The depth machinery lives in git history and
MOTION-SYSTEM.md if ever wanted back. Verified: 0 plane elements, image at
identity transform (the matrix offset is the stage's own centring translate),
text opacity 1, one viewport tall.

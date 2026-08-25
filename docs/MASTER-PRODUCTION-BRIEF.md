# MASTER PRODUCTION BRIEF — Drawn at Altitude

**Status: governing document as of 2026-08-09.** This fuses the client's master
prompt (preserved verbatim in `source-briefs/master-prompt-verbatim-2026-08-09.md`),
the six-generation production method, and the film → interface handover into
one brief. Where this contradicts earlier docs (MOTION-SYSTEM, FRAMER-CODE-MAP,
the Part 2 spec), **this wins**; those remain valid as implementation records of
what is currently built.

Three parts, deliberately distinct:

- **PART I — THE OPENING FILM.** What the visitor sees. The film is the hero.
- **PART II — THE GENERATION METHOD.** How the film gets made: six controlled
  generations, each gated by human approval, frame-locked to the next.
- **PART III — THE INTERFACE HANDOVER.** The landing page physically takes over
  from the film's final frame, then unfolds the learning journey.

Plus **PART IV**, the Jet 2 feedback recast as binding design constraints, and
**PART V**, the asset reality that everything above must respect.

---

## PART I — THE OPENING FILM

**The film is the hero.** The visitor does not arrive on a page and then watch
a video; they arrive inside Anastasiia's visual experience of Ladakh. No
navbar, no blank luxury hero, no giant static typography, no floating CTA
during the first moments.

*Navigation rule (one rule, both parts):* navigation appears **at the
handover** — when playback ends and the final frame becomes HTML. An
intentional scroll during playback is a skip gesture: it **accelerates the
handover** (film resolves early to its final state), and navigation appears
with it. Navigation never floats over the running film uninvited.

Central narrative: **SKETCH → REALITY → OBSERVATION → MATERIAL → PIGMENT →
SKETCH → INTERFACE → LEARNING → JOURNEY.** The claim being made: *we are not
simply travelling to Ladakh; we are learning how to SEE Ladakh.* The camp is
not a hotel — it is the field of observation, and that mapping is
content-directing for every section of the page: mountains are presented as
studies of mass, windows as studies of perspective, water as studies of
reflection, plants as studies of mark-making, light as colour, materials as
pigment, experiences as pages in a sketchbook.

### Opening timing
- **0–2s** — no interface. An open physical sketchbook: paper, graphite,
  Micron, transparent watercolour, quiet natural atmosphere.
- **2–5s** — the camera slowly enters one painted mountain: sketch → paper
  grain → pigment granulation → geological texture → real mountain.
- **5–10s** — the real Indus River Camp landscape breathes. Optionally, very
  soft minimal typography: *DRAWN AT ALTITUDE / A Travel Sketching Retreat in
  Ladakh*. Then the material journey begins.

*Where the breathing beat lives:* no generation produces it. It belongs to
the **edit** — a held extension of Gen 01's approved final frames, or a real
footage insert (shot 04) cut between Gen 01 and Gen 02. Decided at the edit
stage, after Gen 01 is approved; the generations themselves stay confined to
their transformations.

### The material chain
SKETCHBOOK → PAINTED MOUNTAIN → WATERCOLOUR GRANULATION → REAL MOUNTAIN →
ROCK → MINERAL STRIATION → TEXTILE → WOVEN LINE → RIVER RIPPLE → INDUS →
REFLECTED SKY → REAL SKY → WINDOW → VEGETATION → WARM LIGHT → FIRE → BURNT
SIENNA → WATERCOLOUR PIGMENT → BRUSH → PAPER → FINAL LADAKH FOLIO.

### The transition rule
Every transition: RECOGNISABLE SUBJECT → approach → macro → physical texture →
temporary abstraction → **visual correspondence** → new material → reveal →
NEW RECOGNISABLE SUBJECT. Anchors: shape, line, texture, colour, light, camera
direction, motion, reflection, occlusion. Conventional crossfades are never
the primary mechanism. Target reaction: *"I don't know exactly when one thing
became another."*

### Camera language
Slow controlled pushes; intimate macro; deliberate pull-backs; physical
foreground occlusion; realistic lens breathing; subtle handheld imperfection;
natural motion blur; shallow DOF during material transitions, deeper DOF on
landscape reveals. Operated by a human observer — never a digital 3D camera.

### Source of truth
The supplied Indus River Camp material is the visual authority. Preserve
actual geography, mountains, river, architecture, rooms, windows, textiles,
vegetation, fire, light. The AI connects existing physical realities; it does
not redesign them.

### Strict visual negatives
No fantasy particles, magical dust, sparkles, liquid CGI morphing, melting
objects, digital warping, surreal geography, invented architecture,
hyper-saturated travel advertising, luxury-hotel commercial feel, rapid
montage, artificial orbit, aggressive zoom, fake drone moves indoors, generic
AI parallax, self-drawing watercolour, floating notebook, fake hand anatomy,
tourism copy blocks over landscapes, or any effect merely because it is
possible.

---

## PART II — THE GENERATION METHOD

**Never generate the whole film at once.** Six controlled generations, each
with: one narrative objective, one controlled start frame, one controlled
destination frame, at most one or two material transformations, strict
continuity with the previous clip.

**The gate:** generate → review → approve or regenerate. A generation is
complete only when *visually approved by a human* — never merely because it
rendered. On approval, extract the strongest final frame; that exact image is
the locked continuity reference and (where the engine supports it) the start
frame of the next generation. Preserve across clips: camera trajectory, scale,
colour temperature, light direction, lens character, geography, texture,
motion velocity. The six clips must feel like one camera movement.

| Gen | Passage | Start | End |
|---|---|---|---|
| 01 | Sketchbook → real Ladakh | open sketchbook page (camp view) | real mountain, camera approaching a diagonal geological line |
| 02 | Mountain → rock → textile | Gen 01 locked frame | real textile macro, fibres visible, one flowing woven line |
| 03 | Textile → Indus → sky | Gen 02 locked frame | real sky, quiet motion, uncluttered |
| 04 | Sky → window → vegetation | Gen 03 locked frame | one ochre/orange sunlit plant dominating |
| 05 | Vegetation → fire → pigment | Gen 04 locked frame | loaded brush leaving palette toward paper |
| 06 | Pigment → brush → final folio | Gen 05 locked frame | completed double-page = the site's first HTML frame |

Full per-generation specs: verbatim brief, sections GEN 01–06.

### Engine policy (client decision, 2026-08-09)
- **Pika / Pikaframes is the PoC lab**, in place of Runway. Rationale:
  Pikaframes is built around start-frame → end-frame transformations — the
  exact shape of the frame-locking method. Free Basic tier: 80 credits/month,
  480p, ~12 credits per 5s clip. **Judge transition logic, camera behaviour
  and the paper/pigment → rock passage — not sharpness.**
- **Retry budget, resolved:** the approve-or-regenerate gate needs retries the
  free tier barely has (~6 attempts/month total). Policy: the free tier's job
  is to validate **Gen 01's transition logic** (2–3 attempts if needed), not
  to carry all six generations. If Gen 01 rejects more than twice, the
  fallbacks are, in order: the 172 remaining Pixa credits (≈1 video pass),
  Luma's free image-to-video trial, or a client decision to fund a paid tier.
  The pipeline never silently stalls a month on a rejection.
- A/B criteria (only four): geographic continuity · absence of visible AI
  morphing · camera behaviour · beauty of the paper/pigment → rock passage.
- Luma Ray (multi-keyframe support) is the quality-comparison engine once the
  concept is validated at 480p.
- **No MCP connector exists for Pika** (registry checked 2026-08-09; the Pixa
  aggregator carries no Pika models). Pika runs through the browser at
  pika.art on the client's own account and free tier.
- **Operational finding (2026-08-10, partly superseded 2026-08-11): the frame
  upload must be done by hand.** Routes closed by design: the browser
  extension's file API only accepts session-shared paths; the CDN carries no
  CORS; synthesized clicks do not open file pickers; OS-level keystroke
  injection cannot reliably target the dialog (Windows foreground-lock — two
  attempts landed keystrokes in the wrong application, which is disqualifying);
  and an in-tab Ctrl+V does nothing, because CDP key events carry no clipboard
  payload (tested 2026-08-11).
- **Correction (2026-08-11): "Chrome's private network access blocks
  page-fetches of localhost" is false as stated.** PNA has a standard opt-in.
  A local server that answers the preflight with
  `Access-Control-Allow-Private-Network: true` plus
  `Access-Control-Allow-Origin: https://pika.art` is fetched successfully from
  the pika.art tab — verified end to end (45,543-byte JPEG, correct MIME).
  The Pikaframes panel exposes exactly **two hidden `input[type=file]`**
  elements (`accept="image/png,image/jpeg,image/webp,image/heic"`), one per
  slot, so the remaining step is the standard
  `DataTransfer → input.files → dispatchEvent('change')` assignment. Working
  server: `scratchpad/frame-server.js` (read-only, loopback, two files).
- **Route proven end to end (2026-08-11): the frame upload no longer needs a
  human.** Gen 02 was uploaded and launched with no manual file picking — React
  accepts the synthetic `change` event: both slots filled, `Total` went to 5s,
  and the render completed normally. Reusable sequence for Gens 03–06:
  1. start `scratchpad/frame-server.js` (serves the generation folder on
     `127.0.0.1:8787` with the PNA + CORS headers);
  2. open Tools → Pikaframes, type the prompt into "Describe your transition";
  3. per slot — `fetch` the frame from the local server, wrap the blob in a
     `File`, assign via `DataTransfer` to the first `input[type=file]` whose
     `files.length === 0`, then
     `dispatchEvent(new Event('change', {bubbles:true}))`;
  4. verify `Total 5s` / 16:9 · 480p / 12 credits on screen, then launch;
  5. read the result's `<video>.src` off the page and download it directly —
     the CDN URL fetches fine from outside the browser.

  Requires the `mcp__claude-in-chrome__javascript_tool` permission to be loaded
  **at session start**; a rule added mid-session is not picked up.
  **The credit spend stays a human decision** — prepare, verify, then ask.

### Structural decision — THE SKETCHBOOK CHAIN (client, 2026-08-11)

**The sketchbook replaces material morphing as the connective tissue between
generations.** Instead of one substance becoming another, the film now
alternates **real ↔ drawn**: a real place resolves into its study in the
notebook, the page carries us to the next study, and that study resolves into
the next real place. Chosen deliberately over preserving the material chain.

*What this costs, accepted knowingly:* cutting Gen 02 at 1s discards its
textile ending, so the **TEXTILE link leaves the film** — and with it the
We Are Kal footage that was also the source for Gen 05's PIGMENT link. **Gen 05
(vegetation → fire → pigment) must be re-planned before it is generated.**

*What makes it legitimate under the transition rule:* the brief forbids
conventional crossfades as the primary mechanism. These dissolves are not
blends between two subjects — the drawn and the real are **the same place,
composed to register**, so the dissolve reads as coincidence rather than
transition. Verified frame-by-frame (`gen03/_candidates/blend-compare.png`).

*Real → drawn is carried by cloud occlusion, not by a dissolve* (client, 2026-08-11).
Gen 02's mountain is swallowed by drifting cloud, the cut happens blind at peak
density, and the cloud clears to uncover the drawn monastery — the brief's own
sanctioned mechanism ("allow it to physically OCCLUDE the whole lens; use that
to conceal the transition"), and far stronger than a crossfade. The fog is a
**real Ladakh cumulus** cropped from `source/photos/IMG_5664.jpeg`, enlarged and
blurred (`crop=500:299:760:335 → scale 1600×958 → boxblur=24:2 → eq brightness
.16 saturation .25`), drifted with `zoompan` and given a 0→1→0 alpha envelope by
two chained `fade=…:alpha=1` filters. Unplanned dividend worth keeping: the
cloud's white clears **into the cream of the paper**, so the sky becomes the
page rather than merely hiding a join. File: `gen02/_candidates/gen02-edit-draft3-fog.mp4`.

*Assembled chain, 10.37s, 0 credits* — `gen03/_candidates/chain-gen02-gen03-preview.mp4`:
real mountain (1s) → **drawn Thiksey** → camera travels **up the same page** →
**drawn Indus River Camp** → slow dissolve → **real Indus**. Thiksey and the
Indus study sit on one spread, so the move between them is a pan across paper,
not a cut. Gen 02's final frame and Gen 03's first frame are the identical crop
(`512×307 at 170,420`), so the join is invisible.

### Current execution status
**CONTROLLED GENERATION 03 (updated 2026-08-11).** Gen 02 take 1 **approved by
the client**; its locked final frame is the start of Gen 03. **Gen 03 take 1 is
rendered and a retake is recommended** (12 credits, 44 left): the weave → ripple
correspondence works and the camera keeps discipline near the water, but the
river reads as **open sea with a flat horizon**, which breaks the source-of-truth
rule — there is no oceanic horizon in Ladakh. Cause: the negative "no mountains
in the final frame" was applied globally, stripping the valley walls out of the
water section. A retake should keep banks, sand bars and enclosing valley in the
water passage and constrain the sky-only instruction to the last beat alone.
Gens 04–06 stay out of scope.

*Prompt-writing lesson (2026-08-11):* Pikaframes applies negatives to the whole
clip, not to the beat they name. Never scope a negative with "in the final
frame" — say what each beat **contains** instead.

**Superseded status — CONTROLLED GENERATION 02 (2026-08-11).** Gen 01 take 1 was
**accepted for PoC** — not because it met all four criteria, but because the
client chose to spend the remaining credits advancing the chain rather than
on a take 2. Criterion 1 (geographic continuity) passed; **criterion 4 (the
paper/pigment → rock passage) was never validated**, and take 1's actual
reading is now the locked premise of everything downstream. **Gen 02 take 1 was rendered
2026-08-11** (12 credits, 56 left) and is **stopped, awaiting human approval**
against the four criteria in `gen02-prompt.md`. Pre-review reading: markedly
stronger than Gen 01 — the strata → weave correspondence works, the monastery
does not get dragged into the macro, and the four-transformation compression
did not break the shot; the reservations are a cool blue-grey middle third
where the spec asks for mauve/ochre/warm brown, and a passage around 2.3–3.3s
where the scale reads like a woven rug over the mountain. Generations 03–06
remain out of scope: do not generate, preview, combine or anticipate them. On
approval, extract the strongest final frame as the locked start of Gen 03 and
follow the pale thread.

*Asset authorisation (client, 2026-08-11):* **all material in the "À trier"
folder is sanctioned as PoC source.** This lifts the "direction only, never
displayed" restriction on Ref0–Ref4 and the concept spreads **for PoC work
only**. It does not touch the standing rules: nothing fabricated ships as
Anastasiia's hand or as documentary footage of the camp, and everything stays
labelled in `ASSET-MANIFEST.md`.

*Consequence for the production film:* the diagnosed cause of take 1's weak
passage is the start frame, not the prompt — the s05 page carries almost no
Micron line or graphite grain, so the engine had nothing to convert into rock
striation and merely sharpened the wash. The Gen 01 re-shoot should start from
a 16:9 crop of the **Ref4 spread**, which supplies the line work, the paper
grain and a visible book gutter. That removes sanctioned deviation 2 outright
and softens deviation 1.

*Scope of the prohibition:* it forbids **generating video** for Gens 02–06.
It does not forbid design work the handover needs — in particular, Gen 06's
destination frame is the folio spread, which already exists as authored
design (`FolioSection`) and will eventually be Anastasiia's plate. The
source-of-truth rule splits accordingly: camp footage is the authority on
**place**; the authored folio plate is the authority on **artwork**. The
interface dictating Gen 06's final frame is not an inversion — the film ends
on the artwork because the artwork is the destination of the whole narrative.

### Gen 01 working assets (prepared 2026-08-09, revised same day after verification)
- Start frame: `source/film/gen01/start-frame.jpg` — the s05 signature-window
  sketch (itself derived from the real v05 frame), centre-cropped to 16:9,
  1280×720. **Two sanctioned deviations from the verbatim spec are recorded in
  `gen01-prompt.md`** (full-frame page instead of a photographed open book;
  watercolour-only surface). Approving Gen 01 approves them; the production
  film re-introduces the physical book at the head.
- End frame: `source/film/gen01/end-frame.jpg` — **mountain-dominant** crop of
  `source/photos/IMG_5666.jpeg`: layered mauve/ochre ranges, diagonal shadow
  geology, vegetation reduced to a base line — the camera can credibly still
  be "approaching one diagonal geological line", and Gen 02 (mountain → rock)
  starts near the wall rather than across a valley. The earlier wider crop
  (river + monastery + valley) is kept as `end-frame-wide-ALT.jpg` for
  comparison; it was rejected because it spends river and vegetation, which
  the material chain reserves for Gens 03–04.
- Prompt: `source/film/gen01/gen01-prompt.md` — self-contained (engine, tier,
  credit cost, push-target localisation, deviations, acceptance criteria,
  stop rule).

---

## PART III — THE INTERFACE HANDOVER

**The landing page physically takes over from the film's last frame.**

- Gen 06's final folio composition is rebuilt as an identically-aligned
  HTML/CSS state (paper, SVG line work, washes, notes — live layers, exactly
  the form `FolioSection` already uses). When playback ends, the swap to HTML
  must be imperceptible. Never video → fade to black → website.
- Only then may navigation gently appear.
- On first scroll, the sketchbook responds: an annotation shifts, a painted
  detail separates, a page corner lifts, a photographed observation expands.
  The film has secretly become the interface.
- First editorial message is **not** "About the retreat" but:
  *YOU HAVE ENTERED THE LANDSCAPE. NOW LEARN TO SEE IT.*

### Content order after the film
FULL-SCREEN FILM (*Enter the sketch*) → INTERACTIVE SKETCHBOOK (*Learn how to
see*) → THE FIVE PRACTICES (*See · Line · Colour · Atmosphere · Story*) → THE
LADAKH FOLIO (*What you will create*) → THE JOURNEY → ANASTASIIA → THE
RETREAT (practical) → JOIN THE JOURNEY.

### The five practices
Not five feature cards — five visually experienced principles: 01 See &
Simplify (a real observation reduced to ~5 masses, showing what is removed) ·
02 Line & Structure (thumbnail → construction → restrained Micron contour,
construction left visible) · 03 Light & Colour (value study, palette tests,
transparent wash) · 04 Depth & Atmosphere (cool/pale distance, defined middle,
warm textured foreground) · 05 Tell the Journey (recombination into a spread).
Pedagogical rule: each stage demonstrates a **different decision** — never ten
progressively-more-coloured versions of one sketch. Masterclass pages, not an
infographic.

### The Folio
Not merely a later section — the destination the whole page has been building
toward. *This is what you could leave Ladakh with.*

### Rhythm, micro-material, photo ↔ sketch
Alternate LANDSCAPE ↔ HUMAN ↔ MACRO-MATERIAL scale; never sit permanently at
panorama scale. After each major revelation, stillness. Never let Ladakh run
long as mere travel photography — keep returning reality to the act of seeing
(what do I notice / remove / which line matters / where is the light / what
are the colours / how do I record this).

### Typography
Exactly three roles: editorial serif (storytelling), clean sans (practical),
handwritten (authentic annotation only). On photography, type is either a
large editorial statement or a small sketchbook annotation — never weak
mid-sized text floating over an expressive image.

### Overall design feel (binding tone pairs)
Editorial rather than commercial · sensory rather than technological ·
handmade rather than digitally decorative · observational rather than touristy
· sophisticated without looking like a luxury hotel website · immersive
without becoming a 3D gimmick · quiet enough to make the landscape feel
powerful.

The thesis, verbatim: **LADAKH IS THE SUBJECT. ANASTASIIA TEACHES YOU HOW TO
LOOK AT IT. THE SKETCHBOOK IS WHERE THE JOURNEY IS TRANSFORMED INTO MEMORY.**

---

## PART IV — JET 2 FEEDBACK AS DESIGN CONSTRAINTS

Binding rules, not notes. Each maps to the current build:

| # | Constraint | Current build status | Action owed |
|---|---|---|---|
| J1 | No empty white/ivory hero introduction | **Violated** — the page opens on the title block over ivory before the book arrives | Hero opening is replaced by the film (Part I). The current scroll hero survives only until the film exists, then is reworked into the handover |
| J2 | No generic clean SVG mountain line | **Violated** — scene 00's contour and the vision-scene overlay use development SVG paths | Replace with traced-from-footage line work or Anastasiia originals; keep the *behaviour*, replace the *geometry* |
| J3 | No digital staircase / progress graph | **Already compliant** — `NineDays` is a quiet two-column text ledger, no chart or graphic (the constraint likely targets an earlier iteration) | Constraint guards future work: the itinerary may become sketchbook pages, never a chart |
| J4 | Nothing that reads as "stay somewhere beautiful" / hotel site | Partly violated — camp and details sections read hotel-adjacent | Reframe camp as *field of observation*; every full-bleed photo needs an act of seeing attached |
| J5 | Reduce scroll → photo → scroll → photo | Partly present | Interleave macro-material and study layers between any two full-frame photographs |
| J6 | Notebook as the central narrative object | Already central (hero book, signature scene, folio) | Keep; the film reinforces it |
| J7 | Photo ↔ drawing correspondence, permanently | Present in signature scene, pillars, folio | Extend to camp/journey sections |
| J8 | Much more macro-material | **Missing** — no macro texture footage in the build | New textile/dye footage (`we-are-kal-textile-dyeing-SCREENREC.mov`) + macro stills; micro-material interludes between sections |
| J9 | Moments of calm | Holds exist in hero/signature/folio | Extend the principle between sections; stillness after every reveal |
| J10 | No generic UI animations | Mostly compliant — motion is scroll-choreographed, not decorative | Standing rule: no easing-library flourishes, no hover gimmicks; every movement must be a drawing, camera or paper behaviour |

---

## PART V — ASSET REALITY (2026-08-09 intake)

New material arrived with the brief (catalogued from Downloads/À trier):

- **`source/photos/` — 9 real high-resolution stills** (IMG_5659, 5664, 5665,
  5666, 5668, 5669, 5670, 5671, 5672 — up to 1920×1280): white yak (5659),
  camp + snowbound Stok range (5664), cottage exteriors (5665, 5669),
  **layered-mountain + monastery valley view (5666 — Gen 01 end-frame
  source)**, bluethroat (5668), kitchen (5670). First high-res photography in
  the project — supersedes 480p video frames as still-image authority
  wherever both exist.
- **`source/video/we-are-kal-textile-dyeing-SCREENREC.mov`** — 45.6s screen
  recording (1180×572 proxy): wool, spinning, weaving, natural dye pots
  ("Naturally dyed colours"), red pigment bowl. **Real source for the TEXTILE
  and PIGMENT links of the material chain (Gen 02, Gen 05) and for pillar 03**,
  which previously had no footage. Proxy quality; a clean export is wanted.
- **`source/concept-spreads/*.PNG`** — 8 AI-generated concept sketchbook
  spreads ("KEY PLACES" etc.). Direction only, **not Anastasiia's work** — one
  panel shows palm trees and surfboards at a Ladakh lake, which is the level
  of trust they deserve. Never publish, never trace as artist material.

Unchanged rules: nothing generated ships as Anastasiia's hand or as
documentary footage of the camp; placeholders stay labelled; the layered-form
requirement for the folio plate stands.

*How that rule coexists with the film:* the opening film is generated video
that depicts the real place. The rule's meaning here is **never pass generated
material off as documentary record** — the film is an authored artistic
sequence built from and faithful to the camp's real geography, and is
disclosed as such (site credits). Real-footage inserts within the edit remain
real. What stays absolutely forbidden is presenting a generated clip as "raw
footage of the camp" or generated artwork as Anastasiia's hand.

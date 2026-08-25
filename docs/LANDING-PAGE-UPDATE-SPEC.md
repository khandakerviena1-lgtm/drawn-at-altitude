# Landing page update — spec for approval

**Status: awaiting sign-off. Nothing in here is built yet.**
Supersedes `DORA-PROMPT.md`, which described a generated site; this describes
changes to the Next.js build that exists.

---

## Why the page needs this

Two scroll-scrubbed films are currently wired in: the hero plays all of film v3
(37.5s) and the signature section plays the merged piece (23.8s). **The merged
piece is largely made of film v3.** Gen 02's cloud, Gen 03's page traverse, Ref1
and Ref3 all play twice, a few screens apart. That is the defect this update
exists to fix — everything else follows from it.

The other half is that the film currently carries no words. It is beautiful and
mute; a visitor who does not already know what the retreat is learns nothing
from it.

---

## What the visitor gets, top to bottom

1. **The film, scrubbed, with the copy arriving on it.** 23.8s traversed over
   500vh. Opens in whiteout; a drawn monastery emerges; the page travels; a
   room rises to its window; the camera passes through it into sky; the river
   and its drawn chairs; sea buckthorn and its drawn branch; then the finished
   sketchbook, leafed through. Nine statements arrive and leave with the images.
2. **The handover.** The film stops on the last page and the site continues from
   it: closing statement, then the label.
3. **Everything below is unchanged** — Intro, ArtistVision, CreativePillars,
   CampSection, NineDays, Folio, Host, Details, CTA.
4. **The Folio section gains an opening.** The pigment→folio material that leaves
   the hero (10.2s: madder pigment turning to sand watercolour, then the whole
   plate) is placed at the head of `FolioSection`, where it belongs — the folio
   section should begin with the colour becoming the folio.

---

## Changes, file by file

| File | Change |
|---|---|
| `app/page.tsx` | `FilmHero` becomes the merged film; the separate `SignatureFilm` section is removed (the hero now contains it) |
| `components/sections/FilmHero.tsx` | Source swaps to the merged film; the nine copy beats are added as scroll-timed overlays; duration constant → 23.83 |
| `components/sections/FolioSection.tsx` | A scrubbed video beat is prepended: pigment → sand → the plate |
| `app/globals.css` | `.filmHero` 640vh → 500vh (23.8s needs less room than 37.5s); new classes for the beat overlays |
| `public/video/hero-film.mp4` | Re-encoded from `merged-signature.mp4` (≈5.6MB) |
| `public/video/folio-open.mp4` | New: film v3 27.2→37.5s (≈2.5MB) |
| `public/video/signature-chain.mp4` | Deleted — folded into the hero |
| `lib/content/retreat.ts` | The nine beats + handover copy added as structured content, not hard-coded in JSX |

**Not touched, and kept in the repo:** `SketchbookHero`, `SignatureScene`,
`SignatureFilm`. All three remain swappable; nothing is deleted.

---

## The copy, and exactly when it appears

Two registers only, per §14 — a large editorial statement, and a small margin
annotation. Windows are scroll progress `p` across the hero (film time ÷ 23.83),
staggered so only one statement is ever on screen. Each fades in over ~0.02 and
out over ~0.02.

| p range | film | large statement | margin |
|---|---|---|---|
| 0.00–0.09 | whiteout → monastery | Do not draw what you see. Draw what the mountain does to you as it comes through the cloud. | Thiksey — light, geometry, and silence. |
| 0.11–0.21 | page travels | A journey through the Ladakhi Himalaya, gathered one page at a time. | Nine days. One sketchbook. No hurry. |
| 0.23–0.35 | room → window | From the quiet of your room, the landscape becomes something to pause over, sketch, and reflect on. | A place to rest. A place to look. A place to draw. |
| 0.37–0.45 | through the window | Look longer, and the valley gives you more than it gave the first time. | The window does the framing. You do the noticing. |
| 0.47–0.60 | river → drawn chairs | Do not just sketch the riverbank. Sketch the contemplation it invites — the silence, the wonder, the smallness of standing before it. | What a place makes you feel is half of what it looks like. |
| 0.62–0.73 | sea buckthorn | The page remembers what the eye alone would lose. | Sea buckthorn, sour and bright. Apricot. Dust on the fingertips. · Colour gathered by hand, never chosen from a chart. |
| 0.75–0.83 | spread of places | Thiksey. Alchi. Hemis. Pangong. Each place leaves its own trace. | Arrival · Thiksey · Leh · Hemis · Alchi · Igoo · Pangong · Apricot · Tea · *and* Not merely visited. Observed, felt, and carried onto the page. |
| 0.85–0.91 | bluethroat | Look long enough, and even what was about to leave can be kept. | Gone in a moment. Held on the page. |
| 0.93–1.00 | final spread | You came to see Ladakh. You leave able to make someone else feel it. | A drawing stops being a record the moment it carries what you felt. |

**At the handover, after the film rests:**
Nine days. A landscape felt slowly. A journey recorded by hand.
*label:* Leh → Leh · September 2027 · 8 guests · The Indus River Camp

**Placement rule.** Statements sit in the lower third on a scrim no darker than
needed; margin notes sit right, in the handwritten face, small. Neither is ever
centred over a face, a bird, or the gutter of a page.

---

## Technical requirements that are not optional

- **Dense keyframes.** Both videos encode with `-g 10 -keyint_min 10
  -sc_threshold 0`. At a default ~8s GOP the scrub stutters no matter how good
  the JavaScript is.
- **`useScrubbedVideo`** already handles seek coalescing, decoder priming
  (Safari/iOS ignore `currentTime` on a never-played element) and sub-frame
  skipping. Both scrubbed sections use it.
- **No `--film-grade`** on either video. That token pulls cyan out of the 480p
  proxy; these carry watercolour matched to measured values and would shift.
- **Reduced motion**: no traversal. Poster still, statements stacked as static
  text, no scrub.
- **Weight**: hero ≈5.6MB + folio ≈2.5MB. The posters carry LCP; both videos
  stream with faststart. This is heavy and deliberate — a scrubbed film must
  buffer. If it must come down, shorten the film rather than lower the quality:
  resolution is what makes the drawing legible.

---

## Two decisions I need from you

**1. The closing spread shows Nubra Valley, which is not on the itinerary.**
The nine days are Arrival, Thiksey, Leh, Hemis, Alchi, Igoo, Pangong, Apricot,
Tea. So the final beat — *"You came to see Ladakh…"* — plays over a place the
retreat does not visit, two beats after naming Pangong. Options: **(a)** swap the
closing spread for one on the itinerary (my recommendation), **(b)** keep it and
soften the closing line so it makes no itinerary claim, **(c)** leave as is.

**2. The ten method stages.** `A31CAFD5…PNG` is the same window drawn ten times,
from five masses to the finished plate, with the palette named and the last
panel annotated *Leh, Ladakh, September 2027*. It maps exactly onto
`CreativePillars` / the five practices. Adding it is a **separate** piece of work
and not in this spec — say if you want it folded in.

---

## What I will verify before calling it done

`npx tsc --noEmit`; both videos served 200 with correct length; scrub tested by
seeking to several `p` values and confirming `currentTime` follows; copy windows
checked for overlap; reduced-motion branch rendered. **Playback and feel need a
visible browser window** — Chrome will not load media in a hidden tab, which has
blocked visual confirmation twice today.

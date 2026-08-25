# GEN 06 — Pigment → the finished folio (Pikaframes)

Engine: Pika / Pikaframes at **pika.art**, free Basic tier. 16:9, 5s, 480p —
**12 credits**. 32 available before this attempt.

Start: `start-frame.jpg` — the **locked final frame of Gen 05**
(`gen05/gen05-final.mp4`): the red madder pigment field.

End: `end-frame.jpg` — the **clean KEY PLACES spread**
(`concept-spreads/D46FC1BA…PNG`), padded to 16:9 with the paper's own sampled
tone `#EDDFC9` so the whole double page is visible: five studies, the title,
the bare-paper quarter, the cover edges.

## Why this spread, and why it changes more than Gen 06

`D46FC1BA` is the same KEY PLACES layout as `3F607A35` — the one currently used
in Gen 02 and Gen 03 — **minus the "Madha Beach" panel with its palm trees and
surfboards.** In its place: untouched paper, which is exactly the *"large ivory
negative spaces"* the brief demands of the folio. **The single worst
authenticity liability in the assembled film disappears by changing file.**

**Recommended follow-up: swap Gen 02 and Gen 03 to this spread too.** The crops
need re-registering (the vignettes sit at slightly different coordinates and the
image is 1448×1086 rather than 1536×1024), but the method is the one already
used throughout — overlay at 50%, adjust until the bands align. Doing so also
makes the film's structure close properly: it opens *inside* two studies from
this page (Thiksey, Indus River Camp) and ends by pulling back to reveal the
page that holds them. That is the brief's own logic — *"it contains memories
encountered during the film."*

## What this generation cannot do

The verbatim GEN 06 begins with *"the approved loaded brush"* touching paper and
shows **one deliberate painting stroke**. There is no brush in any asset, and
Gen 05 does not deliver one. So the passage is a **pull-back**, not a gesture:
we are inside the pigment, we withdraw, and the pigment turns out to be paint on
a page. The painting act itself remains unfilmed — an asset request, not a
prompt problem.

## Prompt (paste as-is)

A single continuous shot, no cuts. The camera begins extremely close on a
field of granular deep red pigment, then pulls slowly and steadily backwards.
The grain resolves into transparent watercolour sitting in the fibres of warm
ivory paper; an uneven wash edge appears, then a second colour, then a line.
Continuing to pull back, the washes are revealed as small painted studies on
an open travel sketchbook: a village on a river bank, a monastery on a hill, a
lake between mountains, each with a few handwritten notes beside it, wide
areas of the paper left completely untouched. The camera pulls back until the
whole open double page is in frame, its cover edges visible, then gradually
becomes still and holds. Nothing animates on the page: no paint spreading, no
ink appearing, no writing being written. Natural soft daylight. Slow human
handheld breathing settling to stillness.

## Negative prompt (if the UI has a field; otherwise appended)

no crossfade, no dissolve, no morphing, no liquid CGI, no particles, no
sparkles, no melting, no watermark, no hands, no people, no brush, no painting
gesture, no new text appearing, no invented pages, no oversaturation, no fast
zoom, no camera orbit

## Acceptance criteria

1. **One continuous pull-back** out of Gen 05's last frame — no cut, no restart,
   settling to a hold.
2. **The page never animates.** This is the failure that killed Gen 01 and
   recurred in Gen 05. Watch the middle seconds specifically.
3. **The paper stays paper** — fibre, transparency, untouched ivory. Not a flat
   digital cream.
4. **The final frame is usable as the site's first HTML frame** — the page
   square to camera, still, complete.

STOP after this generation. Note that criterion 4 can only be *fully* satisfied
once `FolioSection` renders Anastasiia's real plate; the component is a live
layered scaffold and is currently labelled *"DEVELOPMENT PLATE — NOT THE
ARTIST'S WORK"* (verified on the running site, 2026-08-11).

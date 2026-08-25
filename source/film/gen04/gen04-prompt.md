# GEN 04 — Indus → window (Pikaframes)

Engine: Pika / Pikaframes at **pika.art** (client account, free Basic tier).
16:9, 5s, 480p — **12 credits**. 44 credits available before this attempt.

Start: `start-frame.jpg` — the **locked final frame of Gen 03**
(`gen03/_candidates/gen03-edit-draft7b-pan.mp4`, last frame; the real Indus at
water level, kayak, far bank with cottages and poplars, mountains, blue sky).
Upscaled 784×470 → 1280×720, not re-graded.

End: `end-frame.jpg` — the **real camp window**, shot 17 at 42.42s scaled to
1280×720: timber mullions and posts, hanging woven lamp, terrace table and
chairs, the river band, layered mountains. This is the same window the s05
signature sketch and the Ref4 concept room were both derived from — the
canonical camp window, filmed for real.

## Scope decision — this generation does LESS than the verbatim spec

The verbatim GEN 04 packs: hold → pull back → reveal window → reveal room →
move laterally → occlude the lens with curtain or frame → emerge into
vegetation macro → settle on one ochre plant. **That is three or more material
transformations in 5s, where the brief allows one or two — the exact
over-stuffing that produced Gen 03 take 1's sea horizon.**

Split adopted instead:

- **Generated (this file):** the river → window spatial revelation. One
  transformation, well inside budget.
- **Edit stage, 0 credits:** the occlusion → vegetation beat. The vegetation
  already exists as **real footage** — shot 06, sea buckthorn berries, cropped
  plant-only in `_candidates/edit-target-seabuckthorn.jpg`. Generating it would
  spend credits to invent something we already own, and would risk the model
  rendering the defocused hand that sits in the real frame. The occlusion is
  the technique validated on Gen 02: a real element crossing the lens, with the
  cut hidden at peak density.

Two consequences of the chain change, both already accepted: Gen 04 begins from
the **river**, not "the approved sky", because the sketchbook chain ends Gen 03
on the real Indus; and the sky beat no longer exists anywhere in the film.

## Three risks to judge against

1. **Spatial honesty — the main one.** Shot 03 is filmed at water level from
   the bank; shot 17's window sits elevated in the dining pavilion. Pulling
   back from one to the other asserts a continuity the real geography does not
   have. Mitigating fact: both show the same river and the same mountain wall,
   so it reads as the same place from a different remove rather than a new
   location. **Flag at review** — if it reads as a lie, the fix is to re-cut
   Gen 03 to end on a river view actually taken from the pavilion.
2. **Straight-line geometry.** Timber mullions, glass and posts are exactly
   what generative video warps. Watch the frame edges for bending.
3. **Colour swing.** Start is a cool midday river; end is warm interior timber.
   The warmth is correct — we are moving indoors — but it must arrive from the
   wood entering frame, not from a global grade shift.

## Prompt (paste as-is)

A single continuous shot, no cuts. The camera begins on the real Indus river
seen at water level, holds briefly, then pulls slowly and steadily backwards.
One vertical wooden edge enters at the side of the frame, then another;
timber mullions and a glass pane gradually surround the view, and we discover
we have been looking at the river through the large wooden window of a
Ladakhi camp. Continue pulling back to reveal warm timber posts, a hanging
woven lamp, a wooden table and chairs on a sunlit terrace, the river band and
the layered mountains beyond. This is a spatial revelation, not a cut to an
interior: the river never leaves the frame, it simply becomes framed. Natural
midday light, warm wood against the cool river. Slow human handheld
breathing, deep focus throughout, straight architectural lines.

## Negative prompt (if the UI has a field; otherwise appended)

no crossfade, no dissolve, no morphing, no cut to interior, no liquid CGI, no
particles, no text, no watermark, no people, no hands, no invented
architecture, no warped window frames, no bending straight lines, no fisheye,
no camera orbit, no fast zoom, no oversaturation

## Acceptance criteria

1. **Movement continuity** — one continuous backward move out of Gen 03's last
   frame; same speed family, no restart, no cut.
2. **Spatial revelation** — the window is discovered *around* the existing
   view; the river is never replaced by a different river.
3. **Geometry holds** — mullions, posts and table edges stay straight; no
   warping at the frame edges.
4. **It reads as the real camp** — real timber, real terrace, real river and
   mountain wall, not a generic lodge interior.

STOP after this generation. Wait for human approval. On approval the edit
stage adds the occlusion into the real sea buckthorn footage; Gen 05 is **not**
prepared, because the sketchbook chain removed the We Are Kal footage that was
its pigment source — see MASTER-PRODUCTION-BRIEF.

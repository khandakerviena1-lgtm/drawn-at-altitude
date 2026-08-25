# GEN 02 — Mountain → rock → textile (Pikaframes)

Engine: Pika / Pikaframes at **pika.art** (client account, free Basic tier).
16:9, 5s, 480p — **12 credits**. 68 credits available before this attempt.

Start: `start-frame.jpg` — the **locked final frame of Gen 01 take 1**
(extracted from `../gen01/gen01-take1.mp4` at 5.03s, cropped 784×441 from
784×470 to reach 16:9, upscaled to 1280×720). Not re-graded, not retouched.

End: `end-frame.jpg` — real handwoven Ladakhi wool, macro. Cropped from
`source/video/we-are-kal-textile-dyeing-SCREENREC.mov` at **44.30s**
(crop 620×349 at x=560,y=150 → 1280×720, ≈2× upscale). The crop deliberately
excludes the hand, the paper label and its handwriting that occupy the left
half of the source frame.

## Approval context (2026-08-11)

Gen 01 take 1 was **accepted for PoC purposes** by the client's decision to
proceed to Gen 02 rather than spend credits on a take 2. Recorded consequence:
acceptance criterion 4 of Gen 01 (beauty of the paper/pigment → rock passage)
is **not validated**, and take 1's actual reading — "the painting gains
realism inside the window, then the frame dissolves" — is now the locked
premise of everything downstream. Geographic continuity, criterion 1, did
pass. All material in the client's "À trier" folder is sanctioned as PoC
source (2026-08-11), which also clears `Ref4` for the eventual production
start frame of Gen 01.

## Three risks to judge against, flagged before generating

1. **Transformation budget.** The brief allows one or two material
   transformations per generation. Take 1 ended on a *wide vista* rather than
   "still gently approaching one diagonal geological line", so Gen 02 must
   travel landscape → mountain detail → rock → mineral → abstract → textile
   in 5s. If the result reads as a rushed morph, the honest fix is to split
   this passage in two, not to re-prompt harder.
2. **Colour continuity.** The spec asks Gen 02 to preserve dusty mauve, ochre,
   stone grey and warm brown. The start frame is dominated by **cool blue**
   (sky, shadowed ridges) and a green valley band; the end frame is
   cream/black/stone grey. Blue and green must leave the frame during the
   push — which is why the push target is high on the rock, away from the
   vegetation band and the monastery.
3. **Textile provenance.** The spec says "a line inside a REAL Indus River
   Camp textile". This is real Ladakhi handloom from the We Are Kal footage
   the client supplied for exactly this link, not a textile filmed at the
   camp. Flag at review; a camp textile would be preferable for production.

## Push target (localised)

The **dark diagonal shadow striation across the large grey-blue massif right
of centre**, roughly 55–85% across and 25–60% down — where light and shade
make parallel diagonal bands in the rock. **Not** the ochre fort ridge lower
left (that is built architecture and must not be dragged into a rock
passage), and **not** the green vegetation band along the bottom, which the
material chain reserves for Gen 04.

## Prompt (paste as-is)

A single continuous shot, no cuts. The camera continues the same slow
forward push across a layered Ladakh mountain landscape, moving toward the
dark diagonal shadow striation on the large grey-blue massif right of
centre. The sky and the green valley leave the frame as the ridge fills it.
The rock face grows closer: strata, dust, mineral grain, parallel diagonal
bands of light and shadow, stone grey and warm brown. At extreme macro the
rock becomes almost abstract — only repeated diagonal lines and granular
texture. The repeated strata become the repeated rows of a handwoven wool
textile; mineral grain becomes fibre; the geological line becomes one pale
thread running across the weave. Slowly reveal real cream and dark-brown
Ladakhi handloom fabric in macro, individual fibres visible, natural
daylight. Same direction and same speed throughout. Slow human handheld
breathing, shallow focus in the abstract middle.

## Negative prompt (if the UI has a field; otherwise appended)

no crossfade, no dissolve, no morphing, no liquid CGI, no particles, no
sparkles, no melting, no text, no label, no handwriting, no watermark, no
hands, no people, no sewing, no invented buildings, no monastery, no
oversaturation, no fast zoom, no camera orbit

## Acceptance criteria

1. **Movement continuity** — one push continuous with Gen 01's: same
   direction, same speed, no restart, no jump.
2. **No visible AI morphing** — the passage rides the correspondence
   strata → weave rows and mineral grain → fibre, not object warping.
3. **Geological honesty** — the rock stays real Ladakhi geology; no invented
   peaks, no architecture pulled into the macro.
4. **The strata → weave correspondence is beautiful and legible.**

STOP after this generation. Wait for human approval. On approval, extract the
strongest final frame as the locked start of Gen 03, and follow the pale
thread — it is Gen 03's route into the Indus ripples.

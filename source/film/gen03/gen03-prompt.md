# GEN 03 — Textile → Indus → sky (Pikaframes)

Engine: Pika / Pikaframes at **pika.art** (client account, free Basic tier).
16:9, 5s, 480p — **12 credits**. 56 credits available before this attempt.

Start: `start-frame.jpg` — the **locked final frame of Gen 02 take 1**
(extracted from `../gen02/gen02-take1.mp4` at 5.03s, cropped 784×441 from
784×470 to reach 16:9, upscaled to 1280×720). Not re-graded, not retouched.
The pale thread looping across the weave is the route in.

End: `end-frame.jpg` — real Ladakh sky. Cropped from
`source/photos/IMG_5664.jpeg` (crop 587×330 at x=680,y=100 → 1280×720). Deep
blue with a white cumulus mass rising in the lower third and two smaller
clouds right. **No mountains, no vegetation** — Gen 04 pulls back from this
frame to reveal the camp window, so the sky must stay uncluttered.
`_candidates/sky-B.jpg` is the rejected alternative (trees and a snow peak
intrude and would fight that reveal).

## Approval context (2026-08-11)

Gen 02 take 1 **approved by the client**. Its strata → weave correspondence
worked, so the method is validated: build the passage on a texture rhythm that
is already present in both frames, and let the camera keep one direction.

## Real-world accuracy note

The Indus at the camp is **pale glacial turquoise-green**, braided over grey
sand bars, with a bright band of specular glitter where the sun hits the
riffles — see `source/photos/IMG_5671.jpeg` (Sangam) and `IMG_5666.jpeg`. It
is *not* a blue river. The blue in this passage must come from **reflected
sky**, exactly as the brief specifies, never from mis-colouring the water.

## Two risks to judge against

1. **Scale discipline.** The brief says "reveal the actual Indus, **remain
   close to its surface**". The likely failure is a cut or pull-back to a wide
   valley vista — which would also spend the aerial river view that nothing
   later needs. The prompt therefore keeps the camera low and near the water
   throughout.
2. **Warm → cool swing.** The start is cream, black and warm neutral wool; the
   end is saturated blue. Unlike Gen 02 this cool shift is *intended* — "blue
   increasingly fills the frame" is in the spec — but it should arrive through
   the water's reflection, not as a global grade change.

## Prompt (paste as-is)

A single continuous shot, no cuts. The camera continues the same slow
forward movement across a handwoven cream and dark-brown wool textile in
macro, following the one pale thread that runs across the weave. Moving
closer, the fibres lose their identity and the repeated rows of the weave
become repeated ripples on water; the bright highlights along the threads
become sunlight reflecting off a moving surface. Woven rhythm becomes water
rhythm. A real river is revealed: the pale glacial turquoise-green Indus,
the camera staying low and very close to its surface, tiny ripples,
realistic water physics, natural daylight, a band of bright specular
glitter. The camera follows one blue reflection on the water; blue fills
more and more of the frame; a reflected white cloud drifts into alignment
with a real cloud, and the reflected sky becomes the real sky. Ends on a
clear deep blue Ladakh sky with one white cumulus low in the frame, quiet
slow motion. Same direction and same speed throughout. Slow human handheld
breathing.

## Negative prompt (if the UI has a field; otherwise appended)

no crossfade, no dissolve, no morphing, no liquid CGI, no particles, no
sparkles, no melting, no text, no watermark, no hands, no people, no boats,
no wide aerial valley shot, no drone pull-back, no mountains in the final
frame, no blue-dyed river, no oversaturation, no fast zoom, no camera orbit

## Acceptance criteria

1. **Movement continuity** — one push continuous with Gen 02's: same
   direction, same speed, no restart, no cut.
2. **No visible AI morphing** — the passage rides `weave rows → ripples` and
   `thread highlight → specular sunlight`, not object warping.
3. **Scale discipline** — the camera stays close to the water; no wide valley
   or aerial reveal.
4. **The reflected sky → real sky resolve is beautiful**, and the final frame
   is uncluttered enough for Gen 04 to pull back into the window.

STOP after this generation. Wait for human approval. On approval, extract the
strongest final frame as the locked start of Gen 04, which begins by holding
on the sky and then pulling back to discover the camp window around it.

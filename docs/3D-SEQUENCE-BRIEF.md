# Immersive painterly 3D Ladakh sequence — client brief

Received 2026-08-11. Preserved because it is the most complete art direction the
project has, and because the decisions below depend on reading it exactly.

**Reference Video A supplied 2026-08-11** as `Inspiration 3D Website.MP4`
(75s, 1180×2556) — a phone recording of a feed, not one site. Frames extracted
to `source/reference-3d/`. It contains four references, and reading them
**changes the production answer below**:

- **AERIA Journeys — "Step Inside the Postcard".** A framed image floating on
  pale ground with a soft shadow and small labelled pins (*The Coast · The Stay
  · The Walks*); on scroll the card grows to full bleed and becomes the world —
  *"More Than a Picture"*. This is the load-bearing reference.
- **A villa site** travelling room to room through a building.
- **The underwater piece** the brief names and rules out on subject.
- Several scroll-driven travel cards (Saint Antönien, Nagano, Merzouga).

**None of these is a rendered 3D film.** They are real-time web scenes — scroll-
driven transforms, layered parallax, a little R3F or Spline. The AERIA opening
in particular is a framed image that scales; its depth comes from the frame, the
shadow and the motion, not from modelled terrain.

**So the earlier "weeks of a 3D artist" reading was wrong**, and is corrected
below. The references ask for web craft this codebase can already do.

**And the idea is already the project's own.** *Step inside the postcard* is
*enter the sketch* — except a sketchbook page is a better object than a postcard,
because it is what the retreat actually produces.

---

## The brief, as given

**Objective.** Turn the visual universe of a travel sketchbook into a physical
three-dimensional world the camera can enter. Ink lines become physical
contours; watercolour becomes atmospheric haze; painted mountain shapes become
sculptural terrain. *"We did not transition from a sketch to Ladakh. We
physically entered the sketch, and discovered Ladakh inside it."*

**Sequence.** Empty page → the drawing emerges → the first impossible moment
(pigment gains depth, paper fibres become monumental) → entering the sketch
(camera crosses the ink line) → Ladakh becomes a world → scale and human
smallness → foreground depth → architectural reveal → the living sketchbook
world → paper forms suspended in space → page-to-mountain metamorphosis →
atmospheric climax → return to watercolour → exit the world → final image: an
open sketchbook holding the memory of the journey.

**Visual language.** Painterly cinematic 3D — between an art-directed animated
film, a museum installation, an editorial photograph, a paper diorama.
Materials derived from physical media: mineral matte mountains, chalky
architecture, paper with visible fibre, watercolour behaving as suspended
pigment. Never glossy, plastic or synthetic.

**Palette.** Warm ivory, mineral blue, Indus grey-green, dusty mauve, stone
grey, soft ochre, burnt terracotta, clay brown, sage green, apricot orange, deep
ink brown. No saturation, no neon, no teal-and-orange grade.

**Light.** Volumetric early-morning Himalayan sun, soft rays through
atmospheric dust, haze between mountain layers, long soft shadows. Light creates
depth rather than merely illuminating.

**Camera.** Slow dolly forward, gentle lateral drift, subtle orbit, controlled
elevation, foreground occlusion, strong parallax, dramatic scale changes. No
handheld, no shake, no whip pan, no sudden zoom, no cuts.

**The scroll requirement, which governs everything.** One continuous camera path
through one coherent environment. No hard cuts, no teleporting, no transitions
that only work in one direction. *"The sequence should remain visually
understandable if played forward, paused, or slowly backwards."* Any frozen
frame must look natural.

**Transitions must be spatial, not optical.** Pass through pigment haze rather
than crossfade. Pass behind a page rather than cut. Follow an ink line rather
than switch scene. Move through a window rather than dissolve.

**Depth system.** Every scene carries three layers — foreground (paper edge,
branch, rock, herb), middle (traveller, monastery, path, river), background
(massifs, atmosphere, sky).

**Emotional direction.** Wonder, silence, curiosity, intimacy, contemplation,
human smallness, the pleasure of looking slowly. Avoid adventure clichés,
spiritual clichés, exoticisation, touristic spectacle.

**Prohibited.** Flat 2D animation, Pixar/anime/children's-book aesthetics,
visible low-poly, glossy or metallic materials, neon, magic effects, sparkles,
floating glowing particles, hyperreal drone footage, rapid cuts, camera shake,
fisheye, tilt-shift, AI morphing artefacts, objects appearing arbitrarily, text
or logos inside the scene. Website typography is added separately in HTML — the
final composition must hold long enough and stay calm enough to receive it.

---

## What this actually requires — and what it does not

**This cannot be generated with the tools currently in play.** 20 Pika credits
remain, which buys one five-second 480p interpolation between two still frames.
The brief asks for sustained camera continuity, stable geometry, consistent
lighting direction and believable occlusion across a long single take —
precisely the properties generative video does not hold. Runway or Luma would
produce handsome fragments and fail the continuity clause, which is the clause
the whole thing rests on.

**More importantly, it should probably not be a video at all.** Read the brief's
own requirements back: it must follow scroll position, remain coherent paused,
and read correctly *backwards*. Those are the specification of a **real-time 3D
scene**, not of a rendered clip — and Spline, the tool behind the missing
reference, publishes exactly that to the web. A live scene also removes both
faults reported on the current build today: a rendered film has one fixed
resolution (hence "too zoomed", "quality too bad") and a fixed weight (5.9MB for
24 seconds), while a scene renders at the viewer's own resolution and weighs a
fraction of it.

**Three routes, revised after seeing the reference**

| Route | What it gives | Real cost |
|---|---|---|
| Rendered 3D film (Blender/Houdini) | The brief taken literally | Weeks of a 3D artist — and **the reference does not ask for this** |
| **Scroll-driven web scene, built here** | What the references actually are: a card that opens into the world, layered parallax, camera travelling through | **Days, in this codebase**, on top of `FilmBook` |
| Generative video | Fast, cheap | Fails camera continuity, stable geometry and reverse-readability |

## The move to build, in the project's own language

The AERIA opening, translated: **the spread begins as a card, and the visitor
scrolls into it.**

1. **The card.** The sketchbook spread sits small on warm ivory, held by its own
   soft shadow, tilted a few degrees. Around it, three or four hairline pins in
   the handwritten face — *Thiksey · the river · the room* — the sketchbook
   equivalent of AERIA's *The Coast · The Stay*.
2. **The approach.** Scroll grows the card and the pins fade. The paper edge and
   the gutter stay visible longest, so the object never stops being a book.
3. **Crossing.** The card reaches full bleed as the film's first frame — the
   whiteout. The visitor is inside the page, and the beats begin exactly as they
   do now.
4. **The return.** At the end, the reverse: the world compresses back to a
   spread resting on ivory, which is the handover into the site.

This costs no new film, no modelling and no credits. It reuses `FilmBook`'s
book, its scrub and its captions, and adds one move at each end — which is
precisely the move the reference is admired for.

**What would genuinely need 3D later:** parallax *inside* the drawing (sky, far
ridge, mid ground, water moving at different rates). That needs the spreads
separated into layers, which is manual masking and risks a cardboard-cutout
look. Worth a test on one spread before committing to it.

**What the current build already delivers from this brief.** The narrative arc is
built and running: begin on the page, the page gains depth, cross into the
world, paper forms in space (the suspended spreads), return to watercolour, end
on a sketchbook holding the journey. What it lacks is literal dimension — it is
2D film shown inside a 3D book rather than a 3D world. So the upgrade is not a
rewrite: it is replacing the video plate inside `FilmBook` with a live scene,
keeping the same beats, the same copy and the same scroll mechanics.

**What is needed before anything starts:** the actual Reference Video A. The
brief's spatial language is defined by it, and no amount of prose substitutes
for seeing the camera behaviour being asked for.

# MASTER BUILD SPEC — DRAWN AT ALTITUDE (working copy)
The authoritative master specification was delivered in the project brief (client conversation, 2026-08-08) together with `india-khan-anastasiia-ladakh.pdf`. This file records the binding decisions the codebase is built against. If anything conflicts, priority order is:
1. Anastasiia references (`/source/anastasiia-reference/IMG_5629–5636.PNG`)
2. The Indus River Camp video (`/source/video/`)
3. The master specification (brief)
4. Campaign references (`9F8BC70B….PNG`, `IMG_5625.JPG`)
5. Development placeholders

## Product
Immersive editorial landing page for **DRAWN AT ALTITUDE** — a nine-day travel-sketching immersion in Ladakh, September 2027. Hosted by Anastasiia Morozova (Natura Illustrata), produced by India-Khan. 8 guests, individual rooms, Leh→Leh, base: The Indus River Camp, €5,000 land only.

## Central transformation
REAL PLACE → OBSERVATION → LINE → COLOUR → TEXTURE → BOTANY → COLLECTION → FOLIO — then back to real film. The site starts mostly photographic and ends mostly field-journal, closing the loop.

## Non-negotiables
- Not a travel brochure, hotel site, SaaS template, WebGL demo, or game.
- Real footage and Anastasiia's actual visual grammar only; no stock, no fabricated "artist" work; placeholders must be labelled (see ASSET-MANIFEST.md).
- Motion (`motion/react`) is the primary animation system; R3F only where depth genuinely helps; no GSAP without a documented Motion limitation; respect `prefers-reduced-motion`; performance budget LCP ≤ 2.5s (production).
- Palette (§13), typography (serif/sans/handwriting, §14), motion material rules (§19), copy tone (§79: short poetic headlines, factual support, no tourism clichés).

## Scene structure
00 First Line · 01 Sketchbook · 02 Enter Camp · 03 Artist Vision · 04 LINE · 05 COLOUR · 06 TEXTURE · 07 BOTANY & TABLE · 08 Camp As Constant · 09 Page Memory · 10 Final Folio · 11 Anastasiia · 12 Practical · 13 Return/CTA. Details per scene in SCENE-MAP.md.

## Milestone gates
M1 Hero+Film+Observation (built — this repo state) → STOP → M2 book materiality → M3 LINE+COLOUR → M4 TEXTURE+BOTANY → M5 camp recurrence → M6 Final Folio → M7 host/practical/CTA → M8 polish. Never continue past a gate without explicit approval.

## Companion documents
- `VIDEO-SHOT-LIST.md` — measured shot boundaries (supersede spec's approximate timestamps)
- `ANASTASIIA-STYLE-GUIDE.md` — extracted visual grammar (binding)
- `ASSET-MANIFEST.md` — every asset with status
- `SCENE-MAP.md` — scene→component→asset map
- `MOTION-SYSTEM.md` — every major animation's intent contract

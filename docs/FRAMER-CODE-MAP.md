# FRAMER → CODE MAP
Each Framer section mapped to its coded implementation. "Static authority" = what Framer decides; "Interactive layer" = what code owns. Statuses: **integrated** (Part 2), **foundation** (static now, animated in a later milestone), **existing** (Milestone 1 logic preserved).

| Framer section | Code component | Static authority (Framer) | Interactive layer (code) | Media | Motion | Mobile difference | Status |
|---|---|---|---|---|---|---|---|
| Navigation | `layout/Navigation` | placement, 12px caps, brand left / links right, paper fill | fixed positioning; opacity eases down over immersive scenes | — | scroll-mapped opacity | same row, 20px padding, larger hit areas | integrated |
| Hero | `sections/SketchbookHero` | title block top-left (Display 76px, kicker, 650px sub, meta row), 40px gutters, min-height 900 | existing graphite line → book → film portal → fullscreen choreography (M1, preserved) | v01 clips + posters | existing MOTION-SYSTEM hero mapping; hero copy fades 0.10–0.22 | 86vw book; copy scales via clamp; mobile clip | integrated |
| Intro (statement) | `sections/Intro` | 150px section pad, 820px statement (Chapter Title 48px→statement scale), 600px support | none (calm reading) | — | none (static) | full-width text, 20px pad | integrated |
| Intro (media: "Real Ladakh → Observation → Sketch") | `sections/ArtistVision` | slot position after statement | signature observation scene: film + pointer/scroll vision region + contour + swatch + annotation (M1, restyled) | v02 clip + poster | existing scene mapping + planned SIGNATURE REALITY→SKETCHBOOK upgrade (M3, see MOTION-SYSTEM.md) | scroll-led region, drift path | integrated / existing |
| CreativePillars (reworked 2026-08-09: each row is a small world — footage + the study drawn over it, geometry reused from `folioPaths` so the Folio reads as a recapitulation) | `sections/CreativePillars` | 4 rows: copy 1fr + media 48%×360, gap 64/120, numbered labels | none yet — full LINE/COLOUR/TEXTURE/BOTANY interactions are M3/M4 | real stills: line→camp architecture (33.5s), colour→braided Indus (5.5s), botany→sea buckthorn (21.5s); texture→labelled placeholder (no source footage yet) | none (foundation) | stacked, media 340px | foundation |
| CampSection | `sections/CampSection` | heading + support, wide media, caps details row, 140px pads | video plays only in view | **v05 window/pavilion clip (38.0–44.2s)** + poster | in-view play/pause only | full-width media | integrated |
| NineDays | `sections/NineDays` | "Nine days. Nine observations." + 2-col ledger, 16px rows, hairlines | day-detail expansion is a later milestone | — | none (foundation) | single column | foundation |
| FolioSection | `sections/FolioSection` | centered Display title, 500px sub, 860×560 plate `#F7F1E6`, corner labels | **the climax** — 520vh sticky; the plate assembles in the order the work was done, then holds in silence | layered SVG: construction → ink → pigment → botany → notes. Hand-authored placeholder geometry, plate carries a visible "not the artist's work" label | scroll-driven `pathLength` for ink, opacity for paint | 460vh, plate capped at 52vh | integrated |
| HostSection | `sections/HostSection` | two-col 45%/1fr, gap 76, ochre-tint portrait slot, italic 27px quote | none | portrait TO PRODUCE (labelled placeholder) | none | stacked | foundation |
| PracticalDetails | `sections/RetreatDetails` (restyled) | "Practical details" heading, 4-col grid of 13px labels / serif values, 130px pads | none — clarity wins | — | none | single column | integrated |
| FinalCTA | `sections/FinalCTA` | Indus grey-green band, centered 62px Paper headline, meta, solid CTA + text link | none (quiet) | — | none | headline clamps | integrated |

## Page assembly (`app/page.tsx`)
Navigation → SketchbookHero → Intro → ArtistVision → CreativePillars → CampSection → NineDays → FolioSection → HostSection → RetreatDetails → FinalCTA.

## Anchors
Journey → `#journey` (NineDays) · Details → `#details` (PracticalDetails) · Enquire → `#enquire` (FinalCTA).

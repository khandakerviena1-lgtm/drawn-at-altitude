# SCENE MAP
Scene → component → asset relationships. Milestone 1 implements Scenes 00–03 as one continuous scroll choreography plus a minimal practical/CTA block so the prototype ends legibly. Scenes marked ◻ are later milestones.

| Scene | Name | Component(s) | Assets | Status |
|---|---|---|---|---|
| 00 | First Line | `SketchbookHero` (phase A), `AnimatedInkPath` | inline graphite contour SVG (PLACEHOLDER), identity lockup (text) | **M1 built** |
| 01 | Sketchbook Opening | `SketchbookHero` (phase B–C): 2.5D linen book, cover `rotateX` open, film inside page | v01 clip + poster, paper texture (inline), Instrument Serif cover type | **M1 built** |
| 02 | Enter Camp Film | `SketchbookHero` (phase D): page expands, book edges leave frame, fullscreen film + headline | v01 clip (desktop) / v01-mobile (≤768px) | **M1 built** |
| 03 | Artist Vision | `ArtistVision` + `WatercolorVision` (irregular vision region: outside = real film, inside = paper-toned observed layer + contour + pigment note), `HandwrittenAnnotation` | v02 clip + poster, s01 contour (PLACEHOLDER), Caveat annotations | **M1 built** — pointer-led desktop, scroll-led mobile |
| 04 | LINE | ◻ `LineStudy` | s02 SVGs (TO PRODUCE), v05 window clip | M3 |
| 05 | COLOUR | ◻ `ColourStudy` | v02/v03 water clips, w01 washes, palette swatches (TO PRODUCE) | M3 |
| 06 | TEXTURE | ◻ `TextureStudy` | textile/clay footage absent from current video — needs source material or stills; flag to client | M4 |
| 07 | BOTANY & TABLE | ◻ `BotanyStudy` | v03 sea buckthorn clip, v04 table clip, b0x plates (TO PRODUCE) | M4 |
| 08 | Camp As Constant | ◻ `CampConstant` | v05–v10 clips | M5 |
| 09 | Nine Days / Page Memory | ◻ `FolioCollector` day fragments | day-fragment assets (TO PRODUCE) | M5 |
| 10 | Final Ladakh Folio | ◻ `FolioAssembly` (layered: paper + s02 + pigment + botany + notes) | folio layers (TO PRODUCE, artist-approved) | M6 |
| 11 | Anastasiia | ◻ `HostPortrait` | approved portrait (TO PRODUCE), quote (in `/lib/content`) | M7 |
| 12 | Practical Information | `RetreatDetails` (minimal M1 version shipped as scroll terminus) | facts from `/lib/content/retreat.ts` | **M1 minimal** |
| 13 | Return / CTA | ◻ full version with staged desk + folio; M1 ships quiet CTA row inside `RetreatDetails` | campaign-style staging assets | M7 |

## Scroll ownership
- `SketchbookHero` owns a 420vh sticky region → internal progress 0→1 drives Scenes 00–02 (mapping in MOTION-SYSTEM.md).
- `ArtistVision` owns a 260vh sticky region → Scene 03 (scroll reveals observation layers; pointer moves the vision region on desktop).
- `RetreatDetails` is normal document flow (calm, readable, no choreography).

## Global systems
- `LenisProvider` (`/lib/scroll`) — smooth scroll, disabled under `prefers-reduced-motion`.
- `paper` background + fibre texture on `<body>`; palette tokens in `globals.css`.
- Reduced motion: every scene renders its final composed state as stills with soft fades (see MOTION-SYSTEM.md → fallbacks).

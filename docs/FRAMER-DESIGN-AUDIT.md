# FRAMER DESIGN AUDIT
Audited 2026-08-09 via Framer CLI session (project `SyToesz51cvUApGx0gev`, name "Diligent Background" — auto-generated name, content is the Drawn at Altitude foundation). Breakpoint screenshots + full node-tree serialization captured; measured values below are from the live canvas, not eyeballed.

## Project structure
- **Pages:** one page `/` with three breakpoints — Desktop `min-width:1200`, Tablet `810–1199.98`, Phone `max-width:809.98`.
- **Sections (Desktop order):** Hero · Intro · CreativePillars (4 × ChapterSection) · CampSection · NineDays (9 × ItineraryDay) · FolioSection · HostSection · PracticalDetails (8 × PracticalDetail) · FinalCTA.
- **Components:** Navigation, MediaPlaceholder, SectionLabel, EditorialHeading, PrimaryCTA, ChapterSection, ItineraryDay, PracticalDetail. No code components, no CMS, no icon sets.

## Typography system (Framer text styles)
| Style | Font | Size / LH / LS | Use |
|---|---|---|---|
| Editorial Display (h1) | Bodoni Moda 500 | 76px / 0.98 / −2px | hero title, folio title, CTA (62px/−1px variant) |
| Chapter Title (h2) | Bodoni Moda 500 | 48px / 1.0 / −1px | section headings, chapter names |
| Editorial Body (p) | Inter 400 | 17px / 1.55 / −0.02em | supporting copy |
| Field Label (p) | Inter 500 | 11px / 1.2 / +1.3px, uppercase | eyebrows, metadata, nav, buttons |
Host quote: Bodoni italic 27px. NineDays value rows: 20px serif. Practical labels 13px/+0.5px.

## Color system (Framer color styles)
Paper `#F2EBDD` (page + nav fill) · Graphite `#343536` (text, PrimaryCTA fill) · Muted graphite `#6E6A62` (secondary text) · Indus grey-green `#7C8981` (**FinalCTA band fill**, media-placeholder tint 9%) · Mineral blue `#31566C` (chapter media tint 8%) · Ladakh ochre `#A87848` (host portrait tint 10%). Folio plate fill `#F7F1E6` (slightly lighter than Paper — deliberate "fresh page" value).

## Spacing / width system (measured, desktop)
- Global side padding **40px**; content stack max-widths **1200px** (Hero, CreativePillars, CampSection, FolioSection, FinalCTA) and **1100px** (Intro, NineDays, HostSection, PracticalDetails).
- Section vertical padding: Intro 150/150 · CreativePillars 70/150 (gap 120 between chapters) · Camp 140/140 · NineDays 130/130 · Folio 160/160 · Host 140/140 · Practical 130/130 · FinalCTA 150/150. Hero: 0 top (nav inside), 80 bottom, min-height 900.
- Text measures: hero sub 650px · intro statement 820px · intro support 600px · section headings 760px · folio sub 500px · CTA headline 900px.
- Component internals: ChapterSection = copy 1fr + media 48%×360 (gap 64); ItineraryDay row pad 16/0 gap 8; PracticalDetail 320px col; Navigation pad 22/0, links gap 26; PrimaryCTA pad 14×20.

## Navigation
Left brand "India-Khan × Natura Illustrata" (12px), right links Journey · Details · Enquire (12px, gap 26). Paper fill, no border. Phone keeps the same single-row layout at 18/20 padding (no hamburger).

## CTA system
Primary: solid Graphite fill, Paper text, 11px caps +1.2px, 14×20 padding, square (no radius). Secondary: bare caps text link 11px. FinalCTA band: full-width Indus grey-green fill, centered Paper serif headline 62px, metadata 12px, primary button, secondary link.

## Responsive differences
Phone (390): single column; hero title wraps to two lines; chapter copy above media (340px tall); NineDays becomes single-column ledger; practical grid single column; paddings 20px. Tablet: intermediate two-column retained for chapters/host, side padding 40px. No mobile-specific "field journal" composition yet — media are placeholders, so mobile identity must come from the coded scenes (flagged, not a Framer defect).

## Verdict
Feels editorial, spacious, restrained, non-template — compatible with the immersive experience. Genuinely close to the master direction.

## Adopted
Full type scale (incl. **Bodoni Moda replacing Instrument Serif** — Framer is typography authority; Bodoni's high-contrast didone also matches the natural-history-plate register), color tokens incl. Muted graphite + folio-plate value, all measured widths/spacings, navigation pattern, ledger-style NineDays, solid-graphite PrimaryCTA, Indus grey-green FinalCTA band, host two-column, practical grid.

## Rejected / not transferred
1. **MediaPlaceholder frames as production media** — dashed-border tinted boxes are canvas scaffolding; they are replaced by the coded hero, signature observation scene, and real camp footage. Their 1px rgba borders are not a production style.
2. **Hero media placeholder ("Sketchbook / Indus video portal")** — the coded immersive hero fills this slot; the Framer hero contributes only the copy block composition above it.
3. **Phone nav without touch affordance review** — kept single-row (it fits), but link hit-areas enlarged in code beyond Framer's raw 12px text.
4. **Folio plate corner labels as final art** — kept as labelled TO-PRODUCE scaffolding inside active negative space, per authenticity rules.
5. Framer's static camp media placeholder → replaced with the real v05 window/pavilion clip (shot 15).

## Conflicts documented
- Framer hero places the title **above** the media portal; Milestone 1 placed the title **on the book cover**. Resolution: adopt Framer hierarchy (title block top-left over the scene), keep the choreography — copy fades as the book opens; the cover carries only a small lockup. Composition authority wins, animation preserved.
- Master spec §14 suggested Instrument Serif; Framer chose Bodoni Moda. Adopted Bodoni (documented above).

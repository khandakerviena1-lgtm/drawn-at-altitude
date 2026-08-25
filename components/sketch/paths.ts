// PLACEHOLDER line work (see ASSET-MANIFEST.md). Paths trace the actual
// mountain skyline of hero shot 04 but are development geometry, to be
// replaced by Anastasiia's original strokes. Mirrored in
// /public/sketch/s01-mountain-contour.svg.

export const CONTOUR_VIEWBOX = "0 0 1200 400";

// Primary pass — decisive, variable ridge.
export const CONTOUR_PRIMARY =
  "M -8 258 C 40 252 74 244 108 232 C 128 225 148 210 166 196 " +
  "C 180 185 196 178 208 166 C 224 150 238 128 252 122 C 258 119 263 124 268 121 " +
  "C 282 112 296 96 310 92 C 318 90 322 97 328 103 C 344 119 360 137 378 149 " +
  "C 392 158 404 170 420 175 C 442 182 458 172 476 160 C 490 151 502 136 514 122 " +
  "C 524 110 534 96 546 94 C 552 93 557 100 562 106 C 576 122 588 142 604 152 " +
  "C 622 163 640 168 658 176 C 676 184 692 196 710 202 C 728 208 748 208 766 204 " +
  "C 784 200 800 189 816 180 C 830 172 844 162 858 156 C 866 153 872 158 878 163 " +
  "C 892 174 904 190 920 198 C 940 208 962 212 984 218 C 1010 225 1036 233 1062 238 " +
  "C 1096 245 1132 250 1168 254 L 1210 258";

// Construction pass — light exploratory searches around the peaks, left open.
export const CONTOUR_CONSTRUCTION =
  "M 20 258 C 60 250 90 244 120 234 " +
  "M 150 218 C 175 200 195 185 215 165 " +
  "M 236 138 C 248 126 258 118 270 116 " +
  "M 452 172 C 470 162 488 148 505 132 " +
  "M 520 118 C 530 106 540 98 550 96 " +
  "M 780 202 C 798 196 818 186 836 172 " +
  "M 900 190 C 924 200 950 207 976 213";

// Curved annotation arrow (per IMG_5630 / IMG_5636 arrow language).
export const ARROW_VIEWBOX = "0 0 100 80";
export const ARROW_PATH = "M 4 64 C 34 72 62 66 80 44 C 90 32 89 19 78 12";
export const ARROW_HEAD = "M 78 12 l 15 1 M 78 12 l 2 14";

// Irregular pigment swatch (brush-test shape, not a rectangle).
export const SWATCH_VIEWBOX = "0 0 160 90";
export const SWATCH_PATH =
  "M 12 30 C 10 18 28 10 52 9 C 84 7 122 10 142 16 C 152 19 150 34 148 46 " +
  "C 146 60 150 70 138 76 C 118 84 76 84 44 80 C 22 77 16 68 16 56 C 16 46 14 40 12 30 Z";

// Simplified river contour used inside the observed layer.
export const RIVER_VIEWBOX = "0 0 600 480";
export const RIVER_PATH =
  "M -10 300 C 60 288 110 296 170 280 C 230 264 260 236 320 228 " +
  "C 380 220 430 236 480 226 C 530 216 570 196 612 190";

// Vision-region mask — a WATERCOLOUR edge, not a soft round blob.
//
// A single oval under one Gaussian blur reads as a vignette: the reveal looks
// like a spotlight sliding over the film. Wet pigment does the opposite — it
// runs into lobes, *stops* against the paper with a defined boundary, and
// frays only in a narrow fringe. Three things build that here:
//
//   1. Three overlapping lobes, deliberately not concentric, so the union has
//      a wandering silhouette instead of an axis.
//   2. feTurbulence → feDisplacementMap warps that silhouette, so no part of
//      the boundary is a clean arc.
//   3. feColorMatrix steepens the alpha ramp (a → 4.2a − 1.15). This is the
//      move that matters: it collapses the blur's long gradient into a narrow
//      transition, so the edge reads as pigment stopping rather than as
//      opacity fading out. The blur before it survives only as the fringe.
//
// Rendered at a lower baseFrequency on the second octave so the fraying has
// both a large wobble and a fine nibble, the way a wet edge dries.
const MASK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480">` +
  `<defs>` +
  `<filter id="w" x="-30%" y="-30%" width="160%" height="160%" ` +
  `color-interpolation-filters="sRGB">` +
  // Coarse wander first: a few big excursions, so the outline has no axis.
  `<feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" ` +
  `numOctaves="3" seed="9" result="n1"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="n1" scale="42" ` +
  `xChannelSelector="R" yChannelSelector="G" result="d1"/>` +
  // Then a fine nibble on top, so the boundary frays at pigment scale
  // instead of scalloping at one regular frequency (which reads as a sticker).
  `<feTurbulence type="fractalNoise" baseFrequency="0.055" ` +
  `numOctaves="2" seed="4" result="n2"/>` +
  `<feDisplacementMap in="d1" in2="n2" scale="9" ` +
  `xChannelSelector="R" yChannelSelector="G" result="d2"/>` +
  `<feGaussianBlur in="d2" stdDeviation="8" result="b"/>` +
  // Steepen — but not to a cut-out. 2.8a − 0.72 keeps a narrow fringe alive.
  `<feColorMatrix in="b" type="matrix" values="` +
  `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.8 -0.72"/>` +
  `</filter>` +
  `</defs>` +
  `<g fill="#fff" filter="url(#w)">` +
  // main body of the wash
  `<path d="M78 236 C66 168 118 106 196 86 C252 72 312 92 368 78 ` +
  `C430 62 502 82 532 138 C560 190 546 254 522 302 C498 350 442 392 378 406 ` +
  `C310 421 228 412 168 378 C112 346 88 300 78 236 Z"/>` +
  // lower-left lobe, where the brush was reloaded
  `<path d="M96 300 C120 268 178 262 226 282 C268 300 288 344 272 380 ` +
  `C254 418 190 430 146 408 C104 387 78 340 96 300 Z"/>` +
  // upper-right bloom running off the main body
  `<path d="M418 96 C462 78 520 92 542 130 C562 166 552 214 520 232 ` +
  `C486 251 438 238 416 204 C396 173 392 128 418 96 Z"/>` +
  `</g></svg>`;

export const VISION_MASK_URI = `url("data:image/svg+xml,${encodeURIComponent(MASK_SVG)}")`;

// ---------------------------------------------------------------------------
// SANGAM — traced from the real photograph, not invented.
//
// These are measured off source/photos/IMG_5671.jpeg (the Zanskar meeting the
// Indus) on a 1200×743 grid and checked by rendering them back over the photo,
// so unlike the placeholder geometry above they are the actual skyline and the
// actual water of the place the copy names. The viewBox therefore has to be
// driven at the photograph's own aspect — see .visionStage, which is sized to
// cover the viewport while holding 1200/743, so these coordinates land on the
// terrain at every screen.
export const SANGAM_VIEWBOX = "0 0 1200 743";

export const SANGAM_RIDGE =
  "M 0.0 158.0 C 10.0 162.0 40.0 171.3 60.0 182.0 C 80.0 192.7 100.0 211.0 120.0 222.0 C 140.0 233.0 160.0 240.3 180.0 248.0 C 200.0 255.7 220.0 262.3 240.0 268.0 C 260.0 273.7 280.8 278.0 300.0 282.0 C 319.2 286.0 338.3 289.7 355.0 292.0 C 371.7 294.3 387.2 295.7 400.0 296.0 C 412.8 296.3 420.7 297.0 432.0 294.0 C 443.3 291.0 455.8 283.3 468.0 278.0 C 480.2 272.7 493.0 268.0 505.0 262.0 C 517.0 256.0 528.8 248.0 540.0 242.0 C 551.2 236.0 561.3 231.7 572.0 226.0 C 582.7 220.3 592.7 214.3 604.0 208.0 C 615.3 201.7 628.0 194.7 640.0 188.0 C 652.0 181.3 664.3 173.8 676.0 168.0 C 687.7 162.2 699.0 154.0 710.0 153.0 C 721.0 152.0 730.3 157.2 742.0 162.0 C 753.7 166.8 767.0 175.0 780.0 182.0 C 793.0 189.0 806.7 196.2 820.0 204.0 C 833.3 211.8 846.7 220.7 860.0 229.0 C 873.3 237.3 886.7 245.5 900.0 254.0 C 913.3 262.5 926.7 272.3 940.0 280.0 C 953.3 287.7 966.7 294.0 980.0 300.0 C 993.3 306.0 1006.7 311.0 1020.0 316.0 C 1033.3 321.0 1046.7 326.2 1060.0 330.0 C 1073.3 333.8 1085.8 336.3 1100.0 339.0 C 1114.2 341.7 1128.3 344.2 1145.0 346.0 C 1161.7 347.8 1190.8 349.3 1200.0 350.0";

// The first pass: the same ridge with fewer decisions in it, sitting a little
// high the way a searching line does before the hand commits.
export const SANGAM_RIDGE_CONSTRUCTION =
  "M 0.0 150.0 C 20.0 160.7 80.0 195.3 120.0 214.0 C 160.0 232.7 193.3 249.3 240.0 262.0 C 286.7 274.7 355.8 291.0 400.0 290.0 C 444.2 289.0 465.0 274.0 505.0 256.0 C 545.0 238.0 605.8 200.3 640.0 182.0 C 674.2 163.7 680.0 143.3 710.0 146.0 C 740.0 148.7 781.7 176.7 820.0 198.0 C 858.3 219.3 900.0 253.0 940.0 274.0 C 980.0 295.0 1016.7 312.3 1060.0 324.0 C 1103.3 335.7 1176.7 340.7 1200.0 344.0";

// Both arms of the confluence: the Indus coming in from the right, the
// Zanskar down the left. Drawn after the ridge, the way water is.
export const SANGAM_RIVERS =
  "M 1040.0 548.0 C 1026.7 550.3 988.3 557.0 960.0 562.0 C 931.7 567.0 900.0 573.0 870.0 578.0 C 840.0 583.0 810.0 587.0 780.0 592.0 C 750.0 597.0 718.3 603.7 690.0 608.0 C 661.7 612.3 634.2 614.0 610.0 618.0 C 585.8 622.0 561.7 628.3 545.0 632.0 C 528.3 635.7 515.8 638.7 510.0 640.0 M 400.0 428.0 C 396.3 433.0 386.0 447.7 378.0 458.0 C 370.0 468.3 360.3 479.3 352.0 490.0 C 343.7 500.7 335.8 511.0 328.0 522.0 C 320.2 533.0 311.0 544.7 305.0 556.0 C 299.0 567.3 293.7 579.0 292.0 590.0 C 290.3 601.0 291.7 611.2 295.0 622.0 C 298.3 632.8 304.5 644.3 312.0 655.0 C 319.5 665.7 330.0 676.2 340.0 686.0 C 350.0 695.8 362.0 704.5 372.0 714.0 C 382.0 723.5 395.3 738.2 400.0 743.0";

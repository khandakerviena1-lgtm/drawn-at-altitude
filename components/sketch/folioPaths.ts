// PLACEHOLDER line work for the Ladakh Folio plate (see ASSET-MANIFEST).
// Hand-authored development geometry in the grammar of Anastasiia's studies —
// angular construction under a decisive contour, washes drifting past the ink,
// large areas of paper left bare. To be replaced by her originals; nothing
// here should ever be presented as her hand.
//
// One shared viewBox so every layer registers with every other.
export const FOLIO_VIEWBOX = "0 0 860 560";

// — Architecture: a monastery massing stepping up its hill (Thiksey study) —
// Construction pass: the searching, left open and unclosed.
export const FOLIO_ARCH_CONSTRUCTION =
  "M 58 300 L 438 300 " +
  "M 96 300 L 96 214 M 168 300 L 168 176 M 244 300 L 244 132 " +
  "M 318 300 L 318 104 M 388 300 L 388 168 " +
  "M 58 302 L 396 96 " +
  "M 150 190 L 350 190";

// Primary pass: stacked whitewashed blocks, drawn in one decisive run.
export const FOLIO_ARCH_PRIMARY =
  "M 62 298 L 62 246 L 122 244 L 124 202 L 186 200 L 188 160 L 248 158 " +
  "L 250 118 L 316 116 L 318 92 L 372 94 L 374 148 L 404 150 L 406 208 " +
  "L 436 210 L 438 298";

// Window slits and roof lines — the marks that make it a building, not a shape.
export const FOLIO_ARCH_DETAIL =
  "M 78 262 L 78 282 M 96 262 L 96 282 M 114 262 L 114 282 " +
  "M 140 218 L 140 236 M 158 218 L 158 236 " +
  "M 204 176 L 204 194 M 222 176 L 222 194 " +
  "M 266 134 L 266 152 M 284 134 L 284 152 " +
  "M 330 106 L 330 110 L 366 108 " +
  "M 56 246 L 128 242 M 118 202 L 192 198 M 182 160 L 254 156";

// — Ridge and river, right of the plate —
export const FOLIO_RIDGE =
  "M 452 196 L 486 164 L 514 178 L 546 142 L 584 116 L 618 140 " +
  "L 652 164 L 692 148 L 730 162 L 768 140 L 800 154 L 820 148";

export const FOLIO_RIVER =
  "M 448 236 C 508 227 566 239 624 230 C 682 221 740 233 802 225";

// Wash under the ridge: ochre rock, deliberately drifting past the contour.
export const FOLIO_RIDGE_WASH =
  "M 450 200 L 486 170 L 516 182 L 548 148 L 584 124 L 618 146 L 654 168 " +
  "L 694 152 L 732 166 L 770 146 L 802 158 L 824 152 L 828 214 " +
  "C 760 222 690 214 620 220 C 550 226 496 220 448 226 Z";

// River wash, a shade wider than the drawn line.
export const FOLIO_RIVER_WASH =
  "M 444 228 C 508 219 566 231 624 222 C 682 213 742 225 806 217 " +
  "L 808 248 C 742 256 682 244 624 253 C 566 262 506 250 444 258 Z";

// — Pigment band: brush tests, not swatches from a palette app —
export const FOLIO_SWATCHES: { d: string; fill: string }[] = [
  {
    d: "M 64 338 C 62 330 78 326 104 325 C 134 324 158 328 166 333 C 172 337 170 350 168 360 C 166 371 168 378 158 382 C 140 388 100 386 76 382 C 62 379 60 371 60 362 C 60 353 66 346 64 338 Z",
    fill: "var(--ochre)",
  },
  {
    d: "M 186 336 C 184 328 200 324 226 324 C 254 323 278 327 286 332 C 292 336 290 348 288 358 C 286 369 288 377 278 381 C 260 387 220 385 198 381 C 184 378 182 370 182 361 C 182 352 188 344 186 336 Z",
    fill: "var(--indus)",
  },
  {
    d: "M 308 340 C 306 331 322 327 348 327 C 376 326 400 330 408 335 C 414 339 412 350 410 360 C 408 371 410 378 400 382 C 382 388 342 386 320 382 C 306 379 304 372 304 363 C 304 354 310 348 308 340 Z",
    fill: "var(--mineral)",
  },
  {
    d: "M 430 337 C 428 329 444 325 470 325 C 498 324 520 328 528 333 C 534 337 532 349 530 359 C 528 370 530 377 520 381 C 502 387 464 385 442 381 C 428 378 426 370 426 361 C 426 352 432 345 430 337 Z",
    fill: "var(--clay)",
  },
];

// — Botany: a sea buckthorn sprig, the valley's actual autumn subject —
export const FOLIO_BOTANY_STEM =
  "M 118 520 C 132 480 150 448 176 424 C 196 406 220 396 244 392 " +
  "M 152 470 C 168 458 188 452 208 450 " +
  "M 176 436 C 196 424 218 418 240 416";

export const FOLIO_BOTANY_LEAVES =
  "M 150 472 C 140 462 138 450 146 442 C 154 450 154 464 150 472 Z " +
  "M 174 438 C 164 428 162 416 170 408 C 178 416 178 430 174 438 Z " +
  "M 200 452 C 194 440 198 428 208 424 C 212 434 208 446 200 452 Z " +
  "M 224 418 C 218 406 222 394 232 390 C 236 400 232 412 224 418 Z";

// Berries as points so they can be drawn as a stagger rather than a blob.
export const FOLIO_BERRIES: [number, number][] = [
  [166, 452], [180, 444], [193, 437], [206, 445], [218, 431],
  [231, 424], [158, 462], [244, 410], [204, 428], [176, 458],
];

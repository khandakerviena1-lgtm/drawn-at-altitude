// Asserts the FilmBook scroll contract, by reading the real source rather than
// a copy of it — the numbers live in two files that must agree, and every
// retiming so far has been done by hand.
//
//   node scripts/check-filmbook.mjs
//
// Checks: the phases are ordered and cover the whole section; every caption
// window sits inside the scrub it belongs to; no two captions overlap; the
// pins are gone before the first caption arrives; assets referenced exist.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const film = readFileSync(join(root, "components/sections/FilmBook.tsx"), "utf8");
const content = readFileSync(join(root, "lib/content/retreat.ts"), "utf8");

const fail = [];
const check = (ok, msg) => void (ok || fail.push(msg));

// --- phase constants, read out of the component ---------------------------
const constOf = (name) => {
  const m = film.match(new RegExp(`const ${name} = ([0-9.]+);`));
  if (!m) throw new Error(`FilmBook.tsx no longer defines ${name}`);
  return parseFloat(m[1]);
};
const P = {
  COVER_HOLD: constOf("COVER_HOLD"),
  COVER_OPEN: constOf("COVER_OPEN"),
  IN_END: constOf("IN_END"),
  TURN_START: constOf("TURN_START"),
  TURN_END: constOf("TURN_END"),
  OUT_START: constOf("OUT_START"),
  COVER_CLOSE: constOf("COVER_CLOSE"),
};

const order = [
  "COVER_HOLD",
  "COVER_OPEN",
  "IN_END",
  "TURN_START",
  "TURN_END",
  "OUT_START",
  "COVER_CLOSE",
];
order.forEach((name, i) => {
  if (i === 0) return;
  const prev = order[i - 1];
  check(P[prev] < P[name], `phases out of order: ${prev} (${P[prev]}) >= ${name} (${P[name]})`);
});
check(P.COVER_HOLD > 0, "the card needs a beat to be looked at before it opens");
check(P.COVER_CLOSE < 1, "the closed cover needs a beat at the end");

// --- caption windows, read out of the content file ------------------------
const beatsOf = (name) => {
  const block = content.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\n\\] as const;`));
  if (!block) throw new Error(`retreat.ts no longer exports ${name}`);
  return [...block[1].matchAll(/at:\s*([0-9.]+),\s*\n\s*to:\s*([0-9.]+),/g)].map((m) => ({
    at: parseFloat(m[1]),
    to: parseFloat(m[2]),
  }));
};

const A = beatsOf("bookBeatsA");
const B = beatsOf("bookBeatsB");
check(A.length > 0 && B.length > 0, "expected caption beats on both leaves");

const inPhase = (beats, label, start, end) =>
  beats.forEach((b, i) => {
    check(b.at < b.to, `${label}[${i}] window is inverted (${b.at} → ${b.to})`);
    check(
      b.at >= start && b.to <= end,
      `${label}[${i}] (${b.at}–${b.to}) falls outside its scrub ${start}–${end}`,
    );
  });
inPhase(A, "bookBeatsA", P.IN_END, P.TURN_START);
inPhase(B, "bookBeatsB", P.TURN_END, P.OUT_START);

// One caption on the paper at a time — across both leaves, since the turn is
// short enough that a stray window could bridge it.
const all = [...A, ...B].sort((x, y) => x.at - y.at);
all.forEach((b, i) => {
  if (i === 0) return;
  check(
    all[i - 1].to <= b.at,
    `caption windows overlap: ${all[i - 1].at}–${all[i - 1].to} and ${b.at}–${b.to}`,
  );
});

// --- the pins clear before the film starts talking ------------------------
const pins = film.match(/pinOpacity = useScrollMapped\(p, \[([0-9.,\s]+)\]/);
check(!!pins, "pinOpacity mapping not found");
if (pins) {
  const stops = pins[1].split(",").map((s) => parseFloat(s.trim()));
  const gone = stops[stops.length - 1];
  check(gone <= P.IN_END, `pins outlast the approach (fade out ${gone}, book-a starts ${P.IN_END})`);
  check(stops[0] >= P.COVER_OPEN - 0.04, `pins appear before the cover is open (${stops[0]})`);
  check(all[0].at >= gone, `first caption (${all[0].at}) arrives before the pins clear (${gone})`);
}

// --- assets referenced actually exist -------------------------------------
for (const m of film.matchAll(/src="(\/[^"]+)"/g)) {
  check(existsSync(join(root, "public", m[1])), `missing asset: ${m[1]}`);
}

if (fail.length) {
  console.error("FilmBook contract FAILED:\n" + fail.map((f) => "  ✗ " + f).join("\n"));
  process.exit(1);
}
console.log(
  `FilmBook contract OK — phases ${order.map((n) => P[n]).join(" < ")}; ` +
    `${A.length}+${B.length} captions, none overlapping.`,
);

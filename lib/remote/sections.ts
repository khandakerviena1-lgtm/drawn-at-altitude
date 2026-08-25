// The jump list, in page order. Selectors are resolved on the screen showing
// the site, not here, so this stays a plain label→selector map that both the
// phone and the receiver can import.
//
// Long scroll-driven sections are worth more than one stop: landing at the top
// of a 780vh section shows the card and nothing else, which is not what you
// want to be looking at when you say "and then the page turns". `at` is the
// fraction through that section to land on.

export type RemoteStop = {
  sel: string;
  label: string;
  at?: number;
};

export const REMOTE_STOPS: RemoteStop[] = [
  { sel: ".filmBook", label: "The cover" },
  { sel: ".filmBook", label: "The film", at: 0.22 },
  { sel: ".filmBook", label: "The page turns", at: 0.47 },
  { sel: ".filmBook", label: "The river", at: 0.62 },
  { sel: ".filmBook", label: "The book closes", at: 0.93 },
  { sel: ".introSection", label: "Intro" },
  { sel: ".vision", label: "The valley" },
  { sel: ".vision", label: "The line drawn", at: 0.6 },
  { sel: ".pillars", label: "Line, colour, texture" },
  { sel: ".campSection", label: "The camp" },
  { sel: ".nineDays", label: "Nine days" },
  { sel: ".process", label: "Method sheet" },
  { sel: ".process", label: "First washes", at: 0.62 },
  { sel: ".reveal", label: "One page — pencil" },
  { sel: ".reveal", label: "One page — ink", at: 0.42 },
  { sel: ".reveal", label: "One page — washes", at: 0.72 },
  { sel: ".folio", label: "The folio" },
  { sel: ".hostSection", label: "The host" },
  { sel: ".details", label: "Details" },
  { sel: ".finalCta", label: "Enquire" },
];

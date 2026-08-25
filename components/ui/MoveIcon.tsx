import type { DayMove } from "@/lib/content/retreat";

// Pictograms for how each day moves. Drawn as strokes rather than filled
// shapes so they sit at the same weight as the Micron line the rest of the
// page is about, and so they inherit colour from the type around them.
//
// Decorative only: every icon is paired with a written label in the markup,
// which is what a screen reader gets.

export default function MoveIcon({
  move,
  className,
}: {
  move: DayMove;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if (move === "walk") {
    return (
      <svg {...common}>
        <circle cx="13.2" cy="4.4" r="1.6" />
        <path d="M12.4 8.2 9.6 10.4l1.4 3.2" />
        <path d="M12.9 7.9l2.6 1.9 2.3.5" />
        <path d="M11 13.6 8.4 20" />
        <path d="M11 13.6l3.1 2.2.9 4.2" />
      </svg>
    );
  }

  if (move === "arrive" || move === "depart") {
    return (
      <svg {...common} style={move === "depart" ? undefined : { transform: "scaleX(-1)" }}>
        <path d="M3 19h18" />
        <path d="M4.6 13.4l2.6.6 3.1-3.3-4.6-5.1 1.9-.4 6 4.4 3.9-1.1a2 2 0 0 1 1 3.9l-11 3a1.6 1.6 0 0 1-1.8-.7z" />
      </svg>
    );
  }

  // Days spent at the camp are not idle — they are the drawing days.
  if (move === "sketch") {
    return (
      <svg {...common}>
        <circle cx="9.4" cy="4.6" r="1.6" />
        <path d="M9.4 8.2 8 13.2" />
        <path d="M8.2 13.2 7 20M8.2 13.2 10.6 20" />
        <path d="M9.2 9.6 13 11.4" />
        <rect x="13" y="7.4" width="7.4" height="6" rx="0.6" />
      </svg>
    );
  }

  if (move === "stay") {
    return (
      <svg {...common}>
        <path d="M4 11.2 12 5l8 6.2" />
        <path d="M6 10.4V19h12v-8.6" />
        <path d="M10 19v-4.4h4V19" />
      </svg>
    );
  }

  // drive
  return (
    <svg {...common}>
      <path d="M4.4 15.6h15.2" />
      <path d="M5.6 15.6v1.9M18.4 15.6v1.9" />
      <path d="M5.2 15.6l1.5-4.6a1.6 1.6 0 0 1 1.5-1.1h7.6a1.6 1.6 0 0 1 1.5 1.1l1.5 4.6" />
      <circle cx="8" cy="15.6" r="1.5" />
      <circle cx="16" cy="15.6" r="1.5" />
    </svg>
  );
}

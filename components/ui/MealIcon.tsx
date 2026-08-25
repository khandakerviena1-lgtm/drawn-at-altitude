export type MealKind = "camp" | "out" | "workshop" | "picnic" | "none";

// Where each meal is eaten, drawn rather than written.
//
//   camp     — plate, fork and knife: eaten at the Indus River Camp
//   out      — a restaurant sign on its bracket: eaten out
//   workshop — a bowl on the workshop table: eaten as part of the workshop
//   picnic   — a basket: packed by the camp, eaten in the field
//
// The client named the first three. The fourth exists because the costing
// sheet distinguishes packed picnics from both camp meals and restaurants —
// three days are field lunches carried from the camp, and calling those
// "at the camp" would say the wrong thing about where the day is spent.

export default function MealIcon({
  kind,
  className,
}: {
  kind: MealKind;
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

  if (kind === "out") {
    return (
      <svg {...common}>
        <path d="M6 3.5v4a2.4 2.4 0 0 0 4.8 0v-4" />
        <path d="M8.4 9.9V20" />
        <path d="M17.4 3.5c-1.5 0-2.4 2-2.4 5s.9 4 2.4 4" />
        <path d="M17.4 3.5v17" />
      </svg>
    );
  }

  if (kind === "workshop") {
    return (
      <svg {...common}>
        <path d="M3.6 11.4h16.8" />
        <path d="M5.4 11.4a6.6 6.6 0 0 0 13.2 0" />
        <path d="M12 4.2c-1.1.9-1.1 1.9 0 2.8" />
        <path d="M15.4 4.6c-.8.7-.8 1.4 0 2.1" />
        <path d="M4.6 20.4h14.8" />
      </svg>
    );
  }

  if (kind === "picnic") {
    return (
      <svg {...common}>
        <path d="M4.2 10.2h15.6l-1.5 9.4H5.7z" />
        <path d="M8.2 10.2a3.8 3.8 0 0 1 7.6 0" />
        <path d="M4.8 14.2h14.4" />
      </svg>
    );
  }

  if (kind === "none") {
    return (
      <svg {...common} strokeWidth={1.2}>
        <circle cx="12" cy="12" r="7.4" strokeDasharray="2.6 3" />
      </svg>
    );
  }

  // camp — plate, fork and knife
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="6.4" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M3.6 3.8v4.4a1.7 1.7 0 0 0 3.4 0V3.8" />
      <path d="M5.3 9.9V20.2" />
      <path d="M18.9 3.8c-1 0-1.7 1.5-1.7 3.6s.7 2.9 1.7 2.9" />
      <path d="M18.9 3.8v16.4" />
    </svg>
  );
}

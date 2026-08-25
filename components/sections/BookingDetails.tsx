// THE CONTRACT — dates, price, what is and is not included, altitude, kit.
//
// Everything else on this page argues that the retreat is worth doing. This
// section is the part that lets someone act on that, and until now it did not
// exist: the page stated a month, a price and four lines of small print, with
// no dates, no inclusions, no exclusions, no booking route and — on a retreat
// named Drawn at Altitude — nothing about altitude.
//
// Two decisions worth keeping:
//
// 1. NO DEPOSIT. Anastasiia's own 2027 waiting list offers the full programme
//    and a presale rather than taking money, which suits a departure thirteen
//    months out and matches this page's "no urgency, no countdowns".
//
// 2. `TO CONFIRM` IS RENDERED, not hidden. Unconfirmed fields are shown as
//    unconfirmed rather than guessed at or quietly omitted — an omitted price
//    reads as evasive, and a guessed date is worse than no date. They are
//    styled to be obvious in review and are meant to be gone before launch.
import {
  altitude,
  booking,
  excluded,
  included,
  materials,
} from "@/lib/content/retreat";
import { ChapterTitle, MetaLabel } from "@/components/ui/Typography";

function Value({ value }: { value: string }) {
  const pending = value === "TO CONFIRM";
  return (
    <span className={pending ? "toConfirm" : undefined}>
      {value}
      {pending && <span className="srOnly"> — not yet confirmed</span>}
    </span>
  );
}

export default function BookingDetails() {
  return (
    <section id="booking" className="booking" aria-label={booking.heading}>
      <div className="bookingHead">
        <ChapterTitle>{booking.heading}</ChapterTitle>
        <p className="typoBody bookingLead">{booking.lead}</p>
      </div>

      <dl className="bookingTable">
        {booking.rows.map((r) => (
          <div className="bookingRow" key={r.label}>
            <dt>
              <MetaLabel as="span">{r.label}</MetaLabel>
            </dt>
            <dd>
              <Value value={r.value} />
              {r.hint && <span className="bookingHint">{r.hint}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <p className="typoLabel bookingPriceNote">{booking.priceNote}</p>

      <div className="bookingLists">
        <div className="bookingList">
          <h3 className="typoLabel">{included.heading}</h3>
          <ul>
            {included.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div className="bookingList">
          <h3 className="typoLabel">{excluded.heading}</h3>
          <ul>
            {excluded.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* The section a Rajasthan itinerary never needs. */}
      <div className="altitudeBlock">
        <h3 className="serif altitudeHeading">{altitude.heading}</h3>
        <p className="typoBody">{altitude.lead}</p>
        <ul className="altitudeList">
          {altitude.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="kitBlock">
        <h3 className="serif altitudeHeading">{materials.heading}</h3>
        <p className="typoBody">{materials.lead}</p>
        <dl className="kitList">
          {materials.kit.map((k) => (
            <div className="kitItem" key={k.label}>
              <dt>{k.label}</dt>
              <dd>{k.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The French operator's name and its APST/liability line were removed
          together at the client's instruction — see the note on
          booking.operator in retreat.ts. Empty fields render nothing. */}
      <div className="bookingOperator">
        <p className="typoLabel">
          {booking.operator.label} {booking.operator.name}
        </p>
        {booking.operator.line && (
          <p className="typoLabel bookingOperatorLine">{booking.operator.line}</p>
        )}
        {booking.operator.ground && (
          <p className="typoLabel bookingOperatorLine">{booking.operator.ground}</p>
        )}
      </div>
    </section>
  );
}

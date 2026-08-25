// Framer "PracticalDetails" — minimal motion, clarity wins.
// Server component: plain semantic HTML on the Framer grid.
import { facts, factsSmall } from "@/lib/content/retreat";
import { ChapterTitle } from "@/components/ui/Typography";

export default function RetreatDetails() {
  return (
    <section id="details" className="details" aria-label="Practical information">
      <ChapterTitle>Practical details</ChapterTitle>
      <dl className="factGrid">
        {facts.map((f) => (
          <div className="fact" key={f.label}>
            <dt>{f.label}</dt>
            <dd className="typoValue">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="smallPrint">
        {factsSmall.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}

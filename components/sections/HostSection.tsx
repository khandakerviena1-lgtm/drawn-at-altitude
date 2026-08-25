// Framer "HostSection": editorial two-column, not a bio card.
//
// The portrait slot was built empty and labelled "awaiting approved material"
// from the start; this fills it, and fills the biography with it. Both were
// placeholders on a page whose whole argument is that the host is the reason
// to come — the one section where an empty frame did real damage.
//
// The biography is sourced from anastasiiamorozova.com and cross-checked
// against her publisher, not written from impression. Its middle paragraph is
// the load-bearing one: it says why she turned to travel sketching, and the
// reason is a specific journey rather than a sentiment.
import Image from "next/image";
import { host } from "@/lib/content/retreat";
import {
  ChapterTitle,
  SectionEyebrow,
  BodyEditorial,
  MetaLabel,
} from "@/components/ui/Typography";

export default function HostSection() {
  return (
    <section className="hostSection" aria-label="Anastasiia Morozova">
      <div className="hostPortrait">
        <Image
          src="/img/anastasiia-portrait.webp"
          alt={host.portraitAlt}
          width={1000}
          height={1250}
          sizes="(max-width: 767px) 90vw, 45vw"
          className="hostPortraitImage"
        />
      </div>

      <div className="hostCopy">
        <ChapterTitle>{host.name}</ChapterTitle>
        <SectionEyebrow>{host.studio}</SectionEyebrow>
        <blockquote className="hostQuote serif">{host.quote}</blockquote>

        {host.bioFirstPerson.map((para: string) => (
          <BodyEditorial className="hostBio" key={para.slice(0, 32)}>
            {para}
          </BodyEditorial>
        ))}

        <dl className="hostFacts">
          {host.facts.map((f) => (
            <div className="hostFact" key={f.label}>
              <dt>
                <MetaLabel as="span">{f.label}</MetaLabel>
              </dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

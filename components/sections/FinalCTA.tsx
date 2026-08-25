// Framer "FinalCTA": full-width Indus grey-green band, centered, quiet.
// No urgency, no countdowns.
import { cta } from "@/lib/content/retreat";
import { MetaLabel } from "@/components/ui/Typography";

export default function FinalCTA() {
  return (
    <section id="enquire" className="finalCta" aria-label="Join the journey">
      <h2 className="serif finalCtaHeadline">{cta.closing}</h2>
      <MetaLabel className="finalCtaMeta">{cta.meta}</MetaLabel>
      <a className="btnSolid" href={cta.mailto}>
        {cta.primary} <span className="arrow">→</span>
      </a>
      <a className="ctaTextLink" href="#journey">
        {cta.secondary}
      </a>
    </section>
  );
}

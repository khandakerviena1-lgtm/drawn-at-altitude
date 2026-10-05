// Framer "FinalCTA": full-width Indus grey-green band, centered, quiet.
// No urgency, no countdowns.
import { cta } from "@/lib/content/retreat";
import { MetaLabel } from "@/components/ui/Typography";
import CopyEmail from "@/components/ui/CopyEmail";

export default function FinalCTA() {
  return (
    <section id="enquire" className="finalCta" aria-label="Join the journey">
      <h2 className="serif finalCtaHeadline">{cta.closing}</h2>
      <MetaLabel className="finalCtaMeta">{cta.meta}</MetaLabel>
      <div className="ctaButtons">
        <a className="btnSolid" href={cta.mailto}>
          {cta.primary} <span className="arrow">→</span>
        </a>
        <a className="btnSolid btnOutline" href={cta.webinar.href} target="_blank" rel="noopener noreferrer">
          {cta.webinar.label} <span className="arrow">→</span>
        </a>
      </div>
      <p className="ctaWebinarNote">
        <span className="ctaWebinarDate">{cta.webinar.date}</span>
        {cta.webinar.note}
      </p>
      <a className="ctaTextLink" href="#journey">
        {cta.secondary}
      </a>
      <div className="ctaContacts">
        <MetaLabel className="finalCtaMeta">{cta.contactsHeading}</MetaLabel>
        <dl>
          {cta.contacts.map((c) => (
            <div key={c.topic} className="ctaContact">
              <dt>{c.topic}</dt>
              <dd>
                {c.name && <span className="ctaContactName">{c.name}</span>}
                {c.email && (
                  <span className="ctaContactMail">
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                    <CopyEmail email={c.email} />
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

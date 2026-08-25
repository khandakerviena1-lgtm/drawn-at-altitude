// Scene: Intro statement (Framer "Intro"). Calm reading, no choreography.
// The media slot that followed it in Framer is the ArtistVision scene,
// rendered as the next section.
import { intro } from "@/lib/content/retreat";
import { EditorialStatement, BodyEditorial } from "@/components/ui/Typography";

export default function Intro() {
  return (
    <section className="introSection" aria-label="Introduction">
      <EditorialStatement className="introStatement">
        {intro.statement}
      </EditorialStatement>
      <BodyEditorial className="introSupport">{intro.support}</BodyEditorial>
    </section>
  );
}

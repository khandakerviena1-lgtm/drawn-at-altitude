import Sketchbook from "@/components/sections/Sketchbook";
import Intro from "@/components/sections/Intro";
import ArtistVision from "@/components/sections/ArtistVision";
import RoomSlider from "@/components/sections/RoomSlider";
import DyeWorkshop from "@/components/sections/DyeWorkshop";
import JourneyTimeline from "@/components/sections/JourneyTimeline";
import DrawingProcess from "@/components/sections/DrawingProcess";
import HostSection from "@/components/sections/HostSection";
import RetreatDetails from "@/components/sections/RetreatDetails";
import BookingDetails from "@/components/sections/BookingDetails";
import FinalCTA from "@/components/sections/FinalCTA";
import PhotoGallery from "@/components/sections/PhotoGallery";
import { campLife, ladakh, table, wildlife } from "@/lib/content/retreat";

export default function Home() {
  return (
    <main>
      {/* The first sketchbook, and both ways through it. Turn the pages with
          the arrows, or scroll the film as before — same pictures either way,
          because the book's pages ARE frames of the film taken at the beats
          their captions belong to. FilmHero and SketchbookHero remain unwired
          and swappable. */}
      <Sketchbook />
      {/* The itinerary moved up here at the client's instruction (2026-08-19,
          after phone testing): the journey is the thing being sold, and it
          was arriving seven sections deep. Its nav anchor (#journey) rides
          with it. */}
      <JourneyTimeline />
      {/* The places the itinerary names, photographed — straight after the
          days that name them. */}
      <PhotoGallery gallery={ladakh} />
      <Intro />
      <ArtistVision />
      {/* Anastasiia takes the place the four pillars held: the reason to come
          is the person leading it, in her own voice. CreativePillars is kept
          unwired — its Texture and Colour material now lives in the dye
          workshop and the method section. */}
      <HostSection />
      {/* "One place to return to" — the rooms, plainly. The watercolour→photo
          morph that sat here reads as a demo rather than as a room you would
          book; it is kept unwired in WindowMorph.tsx, as is the original
          CampSection. */}
      <RoomSlider />
      {/* The rest of the camp, then its table: what a day there is like
          between sessions. Same slider as the rooms, alternating ground. */}
      <PhotoGallery gallery={campLife} tone="warm" />
      <PhotoGallery gallery={table} />
      {/* Sits with the camp on purpose: you have just watched the room become
          real through a drawing, so the method that makes such a drawing
          belongs here rather than eight screens later. */}
      <DrawingProcess />
      {/* The TEXTURE pillar, finally with material behind it: natural dyeing
          from raw silk to the finished range, in Anastasiia's spreads. */}
      <DyeWorkshop />
      {/* The neighbours — birds and animals seen at and around the camp,
          next to the drawing chapters because they are what gets drawn. */}
      <PhotoGallery gallery={wildlife} />
      {/* SketchReveal folded into DrawingProcess above — the page building
          itself is now driven by the method's own stages. FolioSection was
          development scaffolding (a generated plate, labelled as such); both
          are kept unwired. */}
      <RetreatDetails />
      {/* The contract: dates, price, inclusions, altitude and kit. Sits after
          the practical facts and before the ask, because it is what someone
          reads between wanting to come and enquiring. */}
      <BookingDetails />
      <FinalCTA />
    </main>
  );
}

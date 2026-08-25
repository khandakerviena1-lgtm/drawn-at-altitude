"use client";

import PeekSlider from "@/components/ui/PeekSlider";
import { camp, rooms } from "@/lib/content/retreat";

// ONE PLACE TO RETURN TO — the rooms.
//
// This is the camp chapter. It replaced a scene that morphed a watercolour of
// the room into the photograph of it: technically the most interesting thing
// on the page, and the client's verdict was that it did not look professional
// — the right call for the one section a guest reads to decide where they
// will sleep. The drawings do their work elsewhere; here the room just has to
// look like itself. The morph is kept unwired in WindowMorph.tsx.
//
// The carousel itself lives in ui/PeekSlider, shared with the dye workshop.

export default function RoomSlider() {
  return (
    <section className="rooms" aria-label={camp.heading}>
      <div className="roomsHead">
        <h2 className="typoChapter">{camp.heading}</h2>
        <p className="typoBody roomsSupport">{camp.support}</p>
      </div>

      <PeekSlider slides={rooms} label="room" />

      <ul className="campDetails roomsDetails">
        {camp.details.map((d) => (
          <li key={d}>
            <span className="typoLabel">{d}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

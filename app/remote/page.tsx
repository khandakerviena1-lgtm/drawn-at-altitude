"use client";

import { useCallback, useEffect, useState } from "react";
import { REMOTE_STOPS } from "@/lib/remote/sections";

// THE REMOTE — open this on a phone, drive the site on the laptop.
//
// Same wifi, no cloud: `next dev` already serves on the network address it
// prints at startup, so the phone just visits http://<that address>/remote.
//
// Deliberately dumb. It POSTs commands and shows how many screens are
// listening; all the scrolling logic lives on the screen being driven. That
// keeps the phone's job to "say what was pressed", which is the only part
// that has to survive a flaky radio.

type Command = Record<string, unknown>;

export default function RemotePage() {
  const [screens, setScreens] = useState<number | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/remote/send", { cache: "no-store" });
      const data = (await res.json()) as { screens?: number };
      setScreens(typeof data.screens === "number" ? data.screens : null);
    } catch {
      setScreens(null);
    }
  }, []);

  useEffect(() => {
    poll();
    const t = setInterval(poll, 4000);
    return () => clearInterval(t);
  }, [poll]);

  const send = useCallback(
    async (command: Command, label?: string) => {
      // A phone in the hand should confirm the press even before the laptop
      // moves, otherwise every command feels broken on a slow radio.
      if (label) {
        setFlash(label);
        window.setTimeout(() => setFlash(null), 600);
      }
      if (navigator.vibrate) navigator.vibrate(8);
      try {
        const res = await fetch("/api/remote/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(command),
        });
        const data = (await res.json()) as { screens?: number };
        if (typeof data.screens === "number") setScreens(data.screens);
      } catch {
        setScreens(null);
      }
    },
    [],
  );

  return (
    <div className="rc">
      <header className="rcHead">
        <p className="rcTitle">Drawn at Altitude</p>
        <p className={`rcStatus ${screens ? "isLive" : "isDead"}`}>
          {screens === null
            ? "no connection"
            : screens === 0
              ? "no screen listening"
              : `${screens} screen${screens > 1 ? "s" : ""} listening`}
        </p>
      </header>

      <div className="rcPad">
        <button
          className="rcBig"
          onClick={() => send({ k: "by", dy: -window.innerHeight * 0.9 }, "up")}
        >
          ▲
        </button>
        <div className="rcRow">
          <button className="rcSmall" onClick={() => send({ k: "top" }, "top")}>
            top
          </button>
          <button
            className="rcSmall"
            onClick={() => send({ k: "by", dy: -240 }, "nudge up")}
          >
            −
          </button>
          <button
            className="rcSmall"
            onClick={() => send({ k: "by", dy: 240 }, "nudge down")}
          >
            +
          </button>
          <button className="rcSmall" onClick={() => send({ k: "end" }, "end")}>
            end
          </button>
        </div>
        <button
          className="rcBig"
          onClick={() => send({ k: "by", dy: window.innerHeight * 0.9 }, "down")}
        >
          ▼
        </button>
      </div>

      <label className="rcScrubWrap">
        <span className="rcLabel">whole page</span>
        <input
          className="rcScrub"
          type="range"
          min={0}
          max={1000}
          defaultValue={0}
          onChange={(e) =>
            send({ k: "to", frac: Number(e.target.value) / 1000 })
          }
        />
      </label>

      <p className="rcLabel rcJumpLabel">jump to</p>
      <ul className="rcJumps">
        {REMOTE_STOPS.map((s, i) => (
          <li key={`${s.sel}-${i}`}>
            <button
              className="rcJump"
              onClick={() =>
                send({ k: "section", sel: s.sel, at: s.at }, s.label)
              }
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>

      <div className={`rcFlash ${flash ? "isOn" : ""}`} aria-live="polite">
        {flash}
      </div>
    </div>
  );
}

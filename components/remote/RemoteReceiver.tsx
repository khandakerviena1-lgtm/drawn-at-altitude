"use client";

import { useEffect } from "react";
import { scrollToY } from "@/lib/scroll/lenisControl";
import type { RemoteCommand } from "@/lib/remote/bus";

// Listens for commands from the phone and moves the page.
//
// Renders nothing. Mounted from the layout only when remote control is
// enabled, so a public build carries none of this — see layout.tsx.
//
// Everything goes through lenisControl.scrollToY rather than window.scrollTo:
// Lenis owns scrollTop while it is running, and a native scroll would be
// dragged straight back by its next frame.

export default function RemoteReceiver() {
  useEffect(() => {
    const maxY = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const apply = (c: RemoteCommand) => {
      switch (c.k) {
        case "by":
          scrollToY(
            Math.max(0, Math.min(maxY(), window.scrollY + c.dy)),
            0.75,
          );
          break;
        case "to":
          scrollToY(maxY() * c.frac, 0.5);
          break;
        case "top":
          scrollToY(0, 1.2);
          break;
        case "end":
          scrollToY(maxY(), 1.2);
          break;
        case "section": {
          const el = document.querySelector(c.sel);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          // `at` is a fraction through the section's own scroll range, which
          // for a sticky section is its height minus one viewport — the same
          // range motion's useScroll maps over. Landing at the top of a 780vh
          // section would otherwise show only its first frame.
          const range = Math.max(0, rect.height - window.innerHeight);
          scrollToY(
            Math.min(maxY(), top + range * (c.at ?? 0)),
            1.2,
          );
          break;
        }
      }
    };

    let source: EventSource | null = null;
    let retry: number | undefined;
    let closed = false;

    const connect = () => {
      if (closed) return;
      source = new EventSource("/api/remote/stream");
      source.onmessage = (event) => {
        try {
          apply(JSON.parse(event.data) as RemoteCommand);
        } catch {
          // ignore anything that is not a command
        }
      };
      source.onerror = () => {
        // EventSource retries on its own, but not after the server restarts
        // mid-session — which in dev is constantly. Reconnect deliberately.
        source?.close();
        source = null;
        retry = window.setTimeout(connect, 1500);
      };
    };

    connect();

    return () => {
      closed = true;
      window.clearTimeout(retry);
      source?.close();
    };
  }, []);

  return null;
}

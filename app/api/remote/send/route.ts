import { broadcast, listenerCount, type RemoteCommand } from "@/lib/remote/bus";

// The phone posts here. Validated rather than trusted: this endpoint is
// reachable by anything on the wifi, and a bad payload should be a 400 rather
// than something odd happening on the screen in front of a client.

function parse(body: unknown): RemoteCommand | null {
  if (typeof body !== "object" || body === null) return null;
  const c = body as Record<string, unknown>;
  switch (c.k) {
    case "by":
      return typeof c.dy === "number" && Number.isFinite(c.dy)
        ? { k: "by", dy: Math.max(-20000, Math.min(20000, c.dy)) }
        : null;
    case "to":
      return typeof c.frac === "number" && Number.isFinite(c.frac)
        ? { k: "to", frac: Math.max(0, Math.min(1, c.frac)) }
        : null;
    case "section": {
      // Only ever a plain class selector for one of our own sections.
      if (typeof c.sel !== "string" || !/^\.[a-zA-Z][\w-]*$/.test(c.sel)) {
        return null;
      }
      const at =
        typeof c.at === "number" && Number.isFinite(c.at)
          ? Math.max(0, Math.min(1, c.at))
          : undefined;
      return { k: "section", sel: c.sel, at };
    }
    case "top":
      return { k: "top" };
    case "end":
      return { k: "end" };
    default:
      return null;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "expected JSON" }, { status: 400 });
  }

  const command = parse(body);
  if (!command) {
    return Response.json({ error: "unrecognised command" }, { status: 400 });
  }

  const screens = broadcast(command);
  return Response.json({ ok: true, screens });
}

// Lets the phone show whether anything is actually listening.
export async function GET() {
  return Response.json({ screens: listenerCount() });
}

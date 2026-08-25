// A one-process pub/sub between the phone and the screen showing the site.
//
// The phone POSTs a command to /api/remote/send; every browser holding the
// /api/remote/stream SSE connection gets it. No socket library, no cloud, no
// database — the two route handlers just need to see the same Set.
//
// That Set lives on globalThis on purpose. Route handlers are bundled per
// route, and a plain module-level `const` can end up instantiated twice, in
// which case /send would broadcast into an empty set and nothing would ever
// move. This is the same singleton trick the Prisma client uses in Next.
//
// SCOPE, deliberately: this only works where both routes run in one long-lived
// process — `next dev`, or `next start` on one machine. On serverless it would
// not, because SSE connections and module state do not survive between
// invocations. That is fine; this is a tool for driving a laptop from a phone
// on the same wifi, not a production feature.

export type RemoteCommand =
  | { k: "by"; dy: number }
  | { k: "to"; frac: number }
  | { k: "section"; sel: string; at?: number }
  | { k: "top" }
  | { k: "end" };

type Sink = (chunk: string) => void;

const KEY = Symbol.for("drawn-at-altitude.remote.sinks");
const store = globalThis as unknown as { [KEY]?: Set<Sink> };

function sinks(): Set<Sink> {
  if (!store[KEY]) store[KEY] = new Set<Sink>();
  return store[KEY];
}

export function addSink(sink: Sink): () => void {
  sinks().add(sink);
  return () => {
    sinks().delete(sink);
  };
}

export function broadcast(command: RemoteCommand): number {
  const payload = `data: ${JSON.stringify(command)}\n\n`;
  const all = sinks();
  for (const sink of all) {
    try {
      sink(payload);
    } catch {
      // A dead connection should not take the others down with it.
      all.delete(sink);
    }
  }
  return all.size;
}

export function listenerCount(): number {
  return sinks().size;
}

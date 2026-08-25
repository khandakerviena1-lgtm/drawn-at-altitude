import { addSink, listenerCount } from "@/lib/remote/bus";

// The screen showing the site holds this open and receives commands.
// Route handlers are uncached by default in this version, so no config needed.

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let open = true;
      const send = (chunk: string) => {
        if (!open) return;
        controller.enqueue(encoder.encode(chunk));
      };

      send(`: connected (${listenerCount() + 1} screen(s))\n\n`);
      const remove = addSink(send);

      // Comment pings keep proxies and phone radios from dropping an idle
      // connection mid-demo, which is exactly when it would be noticed.
      const ping = setInterval(() => send(": ping\n\n"), 20000);

      const close = () => {
        if (!open) return;
        open = false;
        clearInterval(ping);
        remove();
        try {
          controller.close();
        } catch {
          // already closed by the client going away
        }
      };

      request.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Nginx and friends buffer streamed responses into uselessness.
      "X-Accel-Buffering": "no",
    },
  });
}

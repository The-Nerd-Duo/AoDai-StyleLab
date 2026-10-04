import { NextRequest } from "next/server";
import { lookbookEvents, LookbookEventPayload } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection handshake
      try {
        controller.enqueue(
          encoder.encode(
            `event: connected\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`
          )
        );
      } catch (e) {
        console.error("Error sending initial SSE handshake:", e);
      }

      // Event listener for all lookbook database changes
      const onEvent = (payload: LookbookEventPayload) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        } catch {
          // Stream might have been closed by client
        }
      };

      lookbookEvents.on("change", onEvent);

      // Send periodic heartbeat ping every 25 seconds
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
        }
      }, 25000);

      // Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(pingInterval);
        lookbookEvents.off("change", onEvent);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

import { EventEmitter } from "events";
import { LookbookItem } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __lookbookEventEmitter: EventEmitter | undefined;
}

// Singleton EventEmitter across Next.js dev server hot-reloads
export const lookbookEvents: EventEmitter =
  globalThis.__lookbookEventEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalThis.__lookbookEventEmitter = lookbookEvents;
}

// Increase max listeners for multiple simultaneous SSE clients
lookbookEvents.setMaxListeners(200);

export type LookbookEventPayload =
  | { type: "NEW_LOOKBOOK"; data: LookbookItem; senderId?: string }
  | { type: "UPDATE_LIKES"; data: { id: string; likes: number }; senderId?: string }
  | { type: "UPDATE_SHARES"; data: { id: string; shares: number }; senderId?: string };

export function emitLookbookEvent(payload: LookbookEventPayload) {
  lookbookEvents.emit("change", payload);
}

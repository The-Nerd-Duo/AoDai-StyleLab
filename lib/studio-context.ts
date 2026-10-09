import { OutfitState, formatRemixOutfitSummary } from "./utils";

export { formatRemixOutfitSummary };

export interface ActiveStudioContext {
  type: "remix" | "trial";
  title?: string;
  details: string;
  outfit?: OutfitState;
  garmentName?: string;
  garmentId?: string;
  frameId?: string;
  img?: string | null;
  createdAt?: number;
}

const STORAGE_KEY = "vietphuc_active_studio_context";

export function getActiveStudioContext(): ActiveStudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveStudioContext(context: ActiveStudioContext): void {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify({ ...context, createdAt: Date.now() });
    sessionStorage.setItem(STORAGE_KEY, json);
    localStorage.setItem(STORAGE_KEY, json);
  } catch {}
}

export function clearActiveStudioContext(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("vietphuc_studio_context");
    localStorage.removeItem("vietphuc_studio_context");
  } catch {}
}

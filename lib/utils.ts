import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface OutfitState {
  garmentId: string;
  colorId: string;
  occasionId: string;
  styleId: string;
  accessoryId: string;
  personaId: string;
}

export function encodeOutfitToQuery(state: OutfitState, frameId?: string): string {
  const params = new URLSearchParams({
    g: state.garmentId,
    c: state.colorId,
    o: state.occasionId,
    s: state.styleId,
    a: state.accessoryId || "none",
    p: state.personaId || "female-modern",
  });
  if (frameId) {
    params.set("f", frameId);
  }
  return params.toString();
}

export function decodeOutfitFromQuery(searchParams: { [key: string]: string | string[] | undefined }): {
  outfit: OutfitState;
  frameId: string;
} {
  const getParam = (key: string, defaultVal: string) => {
    const val = searchParams[key];
    if (typeof val === "string" && val.length > 0) return val;
    if (Array.isArray(val) && val[0]) return val[0];
    return defaultVal;
  };

  return {
    outfit: {
      garmentId: getParam("g", "ao-dai-cach-tan"),
      colorId: getParam("c", "red-son"),
      occasionId: getParam("o", "street-walk"),
      styleId: getParam("s", "y2k-neo"),
      accessoryId: getParam("a", "man-modern"),
      personaId: getParam("p", "female-modern"),
    },
    frameId: getParam("f", "frame-minimal-gold"),
  };
}

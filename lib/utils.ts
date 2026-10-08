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
  accessoryIds?: string[];
  personaId: string;
}

export const GARMENT_MOCKUP_MAP: Record<string, string> = {
  "ao-dai-cach-tan": "/mockups/ao-dai-cach-tan.jpg",
  "ao-dai-truyen-thong": "/mockups/ao-dai_heritage.webp",
  "ao-ngu-than-tay-chen": "/mockups/ngu-than_heritage.webp",
  "ao-tac-ngu-than-tay-thung": "/mockups/ao-tac.jpg",
  "ao-tu-than": "/mockups/ao-tu-than.jpg",
  "ao-nhat-binh": "/mockups/nhat-binh_heritage.webp",
  "ao-giao-linh": "/mockups/giao-linh_heritage.webp",
  "ao-lap-linh": "/mockups/lap-linh_heritage.webp",
};

export function getGarmentMockupUrl(garmentId?: string): string {
  if (!garmentId) return "/mockups/ao-dai-cach-tan.jpg";
  return GARMENT_MOCKUP_MAP[garmentId] || "/mockups/ao-dai-cach-tan.jpg";
}

export function getShareOrigin(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://aodai-stylelab.pages.dev";
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  const hostname = window.location.hostname;
  // If running on local development (localhost / 127.0.0.1 / private LAN),
  // fallback to the official public HTTPS domain so mobile phone cameras
  // (iOS Camera, Zalo, Android) immediately detect a valid link banner.
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  ) {
    return "https://aodai-stylelab.pages.dev";
  }
  return window.location.origin;
}

export function encodeOutfitToQuery(
  state: OutfitState,
  frameId?: string,
  imageUrl?: string | null,
  shareId?: string
): string {
  const accIds =
    state.accessoryIds && state.accessoryIds.length > 0
      ? state.accessoryIds.join(",")
      : state.accessoryId || "none";
  const params = new URLSearchParams({
    g: state.garmentId,
    c: state.colorId,
    o: state.occasionId,
    s: state.styleId,
    a: accIds,
    p: state.personaId || "female-modern",
  });
  if (frameId) {
    params.set("f", frameId);
  }
  if (shareId) {
    params.set("id", shareId);
  }
  if (
    imageUrl &&
    !imageUrl.startsWith("data:") &&
    !imageUrl.startsWith("blob:") &&
    !imageUrl.startsWith("/mockups/")
  ) {
    params.set("img", imageUrl);
  }
  return params.toString();
}

export function decodeOutfitFromQuery(searchParams: { [key: string]: string | string[] | undefined }): {
  outfit: OutfitState;
  frameId: string;
  imageUrl: string | null;
  shareId?: string;
} {
  const getParam = (key: string, defaultVal: string) => {
    const val = searchParams[key];
    if (typeof val === "string" && val.length > 0) return val;
    if (Array.isArray(val) && val[0]) return val[0];
    return defaultVal;
  };

  const rawImg = searchParams["img"];
  const imageUrl =
    typeof rawImg === "string" && rawImg.length > 0
      ? rawImg
      : Array.isArray(rawImg) && rawImg[0]
      ? rawImg[0]
      : null;

  const rawId = searchParams["id"];
  const shareId =
    typeof rawId === "string" && rawId.length > 0
      ? rawId
      : Array.isArray(rawId) && rawId[0]
      ? rawId[0]
      : undefined;

  const rawAcc = getParam("a", "man-modern");
  const accessoryIds = rawAcc === "none" ? [] : rawAcc.split(",").filter(Boolean);
  const primaryAccessory = accessoryIds[0] || "none";

  return {
    outfit: {
      garmentId: getParam("g", "ao-dai-cach-tan"),
      colorId: getParam("c", "red-son"),
      occasionId: getParam("o", "street-walk"),
      styleId: getParam("s", "y2k-neo"),
      accessoryId: primaryAccessory,
      accessoryIds,
      personaId: getParam("p", "female-modern"),
    },
    frameId: getParam("f", "frame-minimal-gold"),
    imageUrl,
    shareId,
  };
}

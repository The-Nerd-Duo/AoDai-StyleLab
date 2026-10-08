import { OutfitState } from "./utils";
import mockupsData from "@/config/mockups.json";

const PRIVATE_STORAGE_KEY = "vietphuc_private_shares";

// Compress heavy base64 images so KV and localStorage don't hit size quotas
export async function compressImageForUpload(imgUrl: string | null): Promise<string | null> {
  if (!imgUrl) return null;
  if (!imgUrl.startsWith("data:image")) return imgUrl;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const MAX_SIZE = 800;
          let w = img.width;
          let h = img.height;
          if (w > MAX_SIZE || h > MAX_SIZE) {
            if (w > h) {
              h = Math.round((h * MAX_SIZE) / w);
              w = MAX_SIZE;
            } else {
              w = Math.round((w * MAX_SIZE) / h);
              h = MAX_SIZE;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(imgUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/jpeg", 0.82);
          resolve(compressed);
        } catch {
          resolve(imgUrl);
        }
      };
      img.onerror = () => resolve(imgUrl);
      img.src = imgUrl;
    } catch {
      resolve(imgUrl);
    }
  });
}

export function savePrivateShareLocally(item: any): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PRIVATE_STORAGE_KEY);
    const existing: any[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((i) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 50); // Keep last 50 private shares
    localStorage.setItem(PRIVATE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save private share locally:", err);
  }
}

export function getPrivateShareLocally(id: string): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRIVATE_STORAGE_KEY);
    if (!raw) return null;
    const items: any[] = JSON.parse(raw);
    return items.find((i) => i.id === id) || null;
  } catch {
    return null;
  }
}

// In-memory cache to prevent duplicate background uploads for the exact same outfit & image
const sharePromiseCache = new Map<string, Promise<string | null>>();
const shareIdCache = new Map<string, string>();

function getOutfitSignature(outfit: OutfitState, frameId: string, img: string | null | undefined): string {
  const imgSig = img ? (img.length > 100 ? `${img.slice(0, 50)}_${img.length}` : img) : "no-img";
  return `${outfit.garmentId}_${outfit.colorId}_${outfit.occasionId}_${outfit.styleId}_${outfit.accessoryIds?.join(",") || outfit.accessoryId}_${outfit.personaId}_${frameId}_${imgSig}`;
}

/**
 * Ensures a private share ID exists for the current design without publishing it to the public community feed.
 * Saves snapshot to Cloudflare KV (isCommunity: false) and caches locally.
 */
export async function getOrGeneratePrivateShareId({
  outfit,
  frameId,
  imageUrl,
  title,
}: {
  outfit: OutfitState;
  frameId: string;
  imageUrl?: string | null;
  title?: string;
}): Promise<string | null> {
  const sig = getOutfitSignature(outfit, frameId, imageUrl);

  if (shareIdCache.has(sig)) {
    return shareIdCache.get(sig)!;
  }

  if (sharePromiseCache.has(sig)) {
    return sharePromiseCache.get(sig)!;
  }

  const promise = (async () => {
    try {
      const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
      const optimizedImage = await compressImageForUpload(imageUrl || null);

      const localFallbackId = `lookbook-priv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const payload = {
        title: title || `${garment.name} (Bản Chia Sẻ Riêng Tư)`,
        author: "Khách Ẩn Danh",
        isAnonymous: true,
        isCommunity: false, // CRITICAL: Only private share, do NOT post to public community feed!
        category: "y2k",
        img: optimizedImage,
        outfit,
        frameId,
        era: garment.dynasty || "Việt Phục",
        culturalNote: garment.culturalSignificance,
      };

      let resolvedId = localFallbackId;

      try {
        const res = await fetch("/api/lookbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json?.data?.id) {
            resolvedId = json.data.id;
          }
        }
      } catch (netErr) {
        console.warn("API private share upload skipped or offline, using local snapshot:", netErr);
      }

      // Save locally to private storage for local & offline access
      savePrivateShareLocally({
        ...payload,
        id: resolvedId,
        createdAt: new Date().toISOString(),
      });

      shareIdCache.set(sig, resolvedId);
      return resolvedId;
    } catch (err) {
      console.warn("Error creating private share snapshot:", err);
      return null;
    } finally {
      sharePromiseCache.delete(sig);
    }
  })();

  sharePromiseCache.set(sig, promise);
  return promise;
}

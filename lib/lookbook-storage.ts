import { LookbookItem, CreateLookbookInput } from "./types";
export { getPrivateShareLocally, savePrivateShareLocally } from "./share-service";

// All demo lookbook cards removed per user request (starts empty, only user creations)
export const SAMPLE_LOOKBOOKS: LookbookItem[] = [];

const STORAGE_KEY = "vietphuc_community_lookbooks";

export function getLocalLookbooks(): LookbookItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let userLikedSet = new Set<string>();
      try {
        const savedLikes = localStorage.getItem("vietphuc_liked_lookbook_ids");
        if (savedLikes) {
          userLikedSet = new Set(JSON.parse(savedLikes));
        }
      } catch {}

      let needsSave = false;
      // Purge any legacy sample/demo cards and automated duplicate spam cards
      const clean = parsed
        .filter(
          (item) =>
            item &&
            !String(item.id).startsWith("sample-") &&
            !(
              item.isAnonymous &&
              item.author === "Khách Ẩn Danh" &&
              item.title === "Bản Phối Di Sản 2026"
            )
        )
        .map((item) => {
          const isLiked = userLikedSet.has(item.id);
          // If the user hasn't liked it and it had legacy 1 auto-like, reset to 0!
          const expectedLikes = isLiked ? Math.max(1, item.likes || 1) : (item.likes === 1 ? 0 : Math.max(0, item.likes || 0));
          if (item.likes !== expectedLikes) {
            needsSave = true;
            return { ...item, likes: expectedLikes };
          }
          return item;
        });

      if (clean.length !== parsed.length || needsSave) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      }
      return clean;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveLocalLookbook(input: CreateLookbookInput): LookbookItem {
  const current = getLocalLookbooks();
  const isAnon = !!input.isAnonymous;
  const authorName = isAnon
    ? "Khách Ẩn Danh"
    : (input.author && input.author.trim()) || "Đồng Sáng Tạo";
  const authorInitial = isAnon ? "Ẩ" : authorName.charAt(0).toUpperCase();

  const newItem: LookbookItem = {
    id: `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: input.title?.trim() || "Bản Phối Di Sản 2026",
    era: input.era || "Việt Phục Cách Tân",
    author: authorName,
    authorInitial,
    isAnonymous: isAnon,
    likes: 0,
    shares: 0,
    category: input.category || "y2k",
    img: input.img || null,
    outfit: input.outfit,
    frameId: input.frameId || "frame-heritage-vermilion",
    culturalNote: input.culturalNote,
    createdAt: new Date().toISOString(),
    badge: "Mới đăng",
  };

  const updated = [newItem, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const bc = new BroadcastChannel("vietphuc_lookbook_channel");
      bc.postMessage({ type: "NEW_LOOKBOOK", data: newItem });
      bc.close();
    } catch {}
  }

  return newItem;
}

export function updateLocalLookbookLikes(id: string, newLikes: number): void {
  const current = getLocalLookbooks();
  const idx = current.findIndex((item) => item.id === id);
  if (idx !== -1) {
    current[idx].likes = Math.max(0, newLikes);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {}
    }
  }
}

export function toggleLocalLike(id: string, action: "like" | "unlike"): { id: string; likes: number } {
  const current = getLocalLookbooks();
  const idx = current.findIndex((item) => item.id === id);
  let newLikes = 0;
  if (idx !== -1) {
    const delta = action === "like" ? 1 : -1;
    newLikes = Math.max(0, (current[idx].likes || 0) + delta);
    current[idx].likes = newLikes;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {}
    }
  }
  return { id, likes: newLikes };
}

export function incrementLocalShare(id: string): { id: string; shares: number } {
  const current = getLocalLookbooks();
  const idx = current.findIndex((item) => item.id === id);
  let newShares = 1;
  if (idx !== -1) {
    newShares = (current[idx].shares || 0) + 1;
    current[idx].shares = newShares;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        const bc = new BroadcastChannel("vietphuc_lookbook_channel");
        bc.postMessage({ type: "UPDATE_SHARES", data: { id, shares: newShares } });
        bc.close();
      } catch {}
    }
  }
  return { id, shares: newShares };
}

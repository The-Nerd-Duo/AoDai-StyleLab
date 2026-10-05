import { LookbookItem, CreateLookbookInput } from "./types";

export const SAMPLE_LOOKBOOKS: LookbookItem[] = [
  {
    id: "sample-1",
    title: "Nhật Bình Hoàng Triều Ánh Kim",
    era: "Thời Nguyễn (1802 - 1945)",
    author: "Minh Anh",
    authorInitial: "M",
    isAnonymous: false,
    likes: 128,
    shares: 45,
    category: "cung-dinh",
    img: "/mockups/nhatbinh-yellow-luxury.png",
    frameId: "frame-heritage-vermilion",
    culturalNote: "Hoa văn Loan Phượng đối khâm kết hợp dải ngũ sắc viền tay áo uy nghiêm, tôn quý bậc nhất.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    badge: "Giám tuyển VNU",
  },
  {
    id: "sample-2",
    title: "Ngũ Thân Tay Chẽn Phố Đi Bộ",
    era: "Phong trào Phục Hưng 2026",
    author: "Bảo Long",
    authorInitial: "B",
    isAnonymous: false,
    likes: 94,
    shares: 31,
    category: "pho-co",
    img: "/mockups/nguthan-green-streetwear.png",
    frameId: "frame-hanoi-stamp",
    culturalNote: "Áo ngũ thân cổ lập kết hợp sneaker trắng và kính râm retro phong thái Gen Z tự tin dạo phố.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    badge: "Xu hướng",
  },
  {
    id: "sample-3",
    title: "Áo Tấc Lễ Phục Thủy Ba Tam Sơn",
    era: "Thời Nguyễn",
    author: "Khách Ẩn Danh",
    authorInitial: "Ẩ",
    isAnonymous: true,
    likes: 83,
    shares: 20,
    category: "da-tiec",
    img: "/mockups/aotac-blue-luxury.png",
    frameId: "frame-minimal-luxury",
    culturalNote: "Họa tiết Thủy Ba Tam Sơn sóng nước ngút ngàn biểu trưng thái bình thịnh trị non sông.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "sample-4",
    title: "Áo Dài Lemur Cyber Neon",
    era: "Tân Thời Hiện Đại",
    author: "Diệp Chi",
    authorInitial: "D",
    isAnonymous: false,
    likes: 156,
    shares: 62,
    category: "y2k",
    img: "/mockups/aodai-pink-y2k.png",
    frameId: "frame-cyber-indochine",
    culturalNote: "Cảm hứng cách tân Lemur 1930 hòa sắc ánh neon Cyber Indochine đầy bứt phá nghệ thuật.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    badge: "Nổi bật",
  },
];

const STORAGE_KEY = "vietphuc_community_lookbooks";

export function getLocalLookbooks(): LookbookItem[] {
  if (typeof window === "undefined") {
    return SAMPLE_LOOKBOOKS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LOOKBOOKS));
      return SAMPLE_LOOKBOOKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_LOOKBOOKS;
  } catch {
    return SAMPLE_LOOKBOOKS;
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
    likes: 1,
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

export function toggleLocalLike(id: string, action: "like" | "unlike"): { id: string; likes: number } {
  const current = getLocalLookbooks();
  const idx = current.findIndex((item) => item.id === id);
  let newLikes = 1;
  if (idx !== -1) {
    const delta = action === "like" ? 1 : -1;
    newLikes = Math.max(0, (current[idx].likes || 0) + delta);
    current[idx].likes = newLikes;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        const bc = new BroadcastChannel("vietphuc_lookbook_channel");
        bc.postMessage({ type: "UPDATE_LIKES", data: { id, likes: newLikes } });
        bc.close();
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

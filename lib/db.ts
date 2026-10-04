import fs from "fs";
import path from "path";
import { LookbookItem, CreateLookbookInput } from "./types";
import { emitLookbookEvent } from "./events";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "lookbooks.json");

// Initial community lookbook items (starts empty, only stores what users upload and share)
const INITIAL_LOOKBOOKS: LookbookItem[] = [];

// Ensure directory and database file exist
function ensureDatabase(): LookbookItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_LOOKBOOKS, null, 2), "utf8");
      return INITIAL_LOOKBOOKS;
    }

    const content = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_LOOKBOOKS;
  } catch (err) {
    console.error("Failed to read lookbooks database:", err);
    return INITIAL_LOOKBOOKS;
  }
}

// Atomically save data to disk
function saveDatabase(items: LookbookItem[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(items, null, 2), "utf8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Failed to write lookbooks database:", err);
  }
}

export async function getAllLookbooks(): Promise<LookbookItem[]> {
  const items = ensureDatabase();
  // Return sorted by creation date (newest first)
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getLookbookById(id: string): Promise<LookbookItem | null> {
  const items = ensureDatabase();
  return items.find((item) => item.id === id) || null;
}

export async function createLookbook(input: CreateLookbookInput): Promise<LookbookItem> {
  const items = ensureDatabase();

  const isAnonymous = !!input.isAnonymous;
  const author = isAnonymous
    ? "Khách Ẩn Danh"
    : (input.author && input.author.trim()) || "Đồng Sáng Tạo";
  const authorInitial = isAnonymous ? "Ẩ" : author.trim().charAt(0).toUpperCase();

  const newItem: LookbookItem = {
    id: `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: input.title && input.title.trim() ? input.title.trim() : "Bản Phối Di Sản 2026",
    era: input.era || "Việt Phục Cách Tân",
    author,
    authorInitial,
    isAnonymous,
    likes: 1, // Auto 1 like from creator
    shares: 0,
    category: input.category || "y2k",
    img: input.img || null,
    outfit: input.outfit,
    frameId: input.frameId || "frame-heritage-vermilion",
    culturalNote: input.culturalNote,
    createdAt: new Date().toISOString(),
    badge: "Mới đăng",
  };

  items.unshift(newItem);
  saveDatabase(items);

  // Emit SSE real-time event to all connected browsers
  emitLookbookEvent({
    type: "NEW_LOOKBOOK",
    data: newItem,
  });

  return newItem;
}

export async function toggleLikeLookbook(
  id: string,
  action: "like" | "unlike"
): Promise<{ id: string; likes: number }> {
  const items = ensureDatabase();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Lookbook with ID ${id} not found`);
  }

  const current = items[index];
  const delta = action === "like" ? 1 : -1;
  const newLikes = Math.max(0, (current.likes || 0) + delta);

  items[index] = {
    ...current,
    likes: newLikes,
  };

  saveDatabase(items);

  // Emit SSE real-time event
  emitLookbookEvent({
    type: "UPDATE_LIKES",
    data: { id, likes: newLikes },
  });

  return { id, likes: newLikes };
}

export async function incrementShareLookbook(
  id: string
): Promise<{ id: string; shares: number }> {
  const items = ensureDatabase();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Lookbook with ID ${id} not found`);
  }

  const current = items[index];
  const newShares = (current.shares || 0) + 1;

  items[index] = {
    ...current,
    shares: newShares,
  };

  saveDatabase(items);

  // Emit SSE real-time event
  emitLookbookEvent({
    type: "UPDATE_SHARES",
    data: { id, shares: newShares },
  });

  return { id, shares: newShares };
}

interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: any): Promise<{ keys: { name: string }[] }>;
}

interface D1Database {
  prepare(query: string): {
    bind(...values: any[]): any;
    all(): Promise<{ results: any[] }>;
    first(): Promise<any>;
    run(): Promise<any>;
  };
}

interface Env {
  LOOKBOOK_KV?: KVNamespace;
  KV?: KVNamespace;
  LOOKBOOK_STORE?: KVNamespace;
  DB?: D1Database;
  LOOKBOOK_DB?: D1Database;
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

function getKV(env: Env): KVNamespace | null {
  return env.LOOKBOOK_KV || env.KV || env.LOOKBOOK_STORE || null;
}

function getD1(env: Env): D1Database | null {
  return env.DB || env.LOOKBOOK_DB || null;
}

// GET /api/lookbook - Load community lookbook list from Cloudflare KV or D1
export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const d1 = getD1(context.env);
    if (d1) {
      try {
        await d1.prepare(`
          CREATE TABLE IF NOT EXISTS lookbooks (
            id TEXT PRIMARY KEY,
            title TEXT,
            era TEXT,
            author TEXT,
            authorInitial TEXT,
            isAnonymous INTEGER,
            likes INTEGER,
            shares INTEGER,
            category TEXT,
            img TEXT,
            outfit TEXT,
            frameId TEXT,
            culturalNote TEXT,
            createdAt TEXT,
            badge TEXT
          )
        `).run();

        const { results } = await d1.prepare(
          "SELECT * FROM lookbooks ORDER BY createdAt DESC LIMIT 200"
        ).all();

        const items = (results || []).map((row: any) => ({
          ...row,
          isAnonymous: Boolean(row.isAnonymous),
          outfit: row.outfit ? JSON.parse(row.outfit) : undefined,
        }));

        return new Response(
          JSON.stringify({
            success: true,
            data: items,
            storage: "cloudflare-d1",
          }),
          { headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.warn("D1 read error:", err);
      }
    }

    const kv = getKV(context.env);
    if (kv) {
      try {
        const raw = await kv.get("lookbooks_community_all");
        let items: any[] = [];
        if (raw) {
          items = typeof raw === "string" ? JSON.parse(raw) : raw;
        }
        // Purge any legacy sample cards
        items = (items || []).filter(
          (item) => item && !String(item.id).startsWith("sample-")
        );

        return new Response(
          JSON.stringify({
            success: true,
            data: items,
            storage: "cloudflare-kv",
          }),
          { headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.warn("KV read error:", err);
      }
    }

    // Default empty array if no Cloudflare database binding is attached yet
    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        storage: "none",
        message: "Chưa cấu hình Cloudflare KV (LOOKBOOK_KV) hoặc D1 (DB) trong Pages Settings.",
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Lỗi đọc dữ liệu Lookbook" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// POST /api/lookbook - Save community lookbook into Cloudflare KV or D1
export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    const isAnon = !!body.isAnonymous;
    const author = isAnon ? "Khách Ẩn Danh" : (body.author && body.author.trim()) || "Đồng Sáng Tạo";

    const newItem = {
      id: `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: (body.title && body.title.trim()) || "Bản Phối Di Sản 2026",
      era: body.era || "Việt Phục",
      author,
      authorInitial: isAnon ? "Ẩ" : author.charAt(0).toUpperCase(),
      isAnonymous: isAnon,
      likes: 1,
      shares: 0,
      category: body.category || "y2k",
      img: body.img || null,
      outfit: body.outfit || null,
      frameId: body.frameId || "frame-heritage-vermilion",
      culturalNote: body.culturalNote || "",
      createdAt: new Date().toISOString(),
      badge: "Mới đăng",
    };

    let storageUsed = "none";

    // 1. Try Cloudflare D1
    const d1 = getD1(context.env);
    if (d1) {
      try {
        await d1.prepare(`
          CREATE TABLE IF NOT EXISTS lookbooks (
            id TEXT PRIMARY KEY,
            title TEXT,
            era TEXT,
            author TEXT,
            authorInitial TEXT,
            isAnonymous INTEGER,
            likes INTEGER,
            shares INTEGER,
            category TEXT,
            img TEXT,
            outfit TEXT,
            frameId TEXT,
            culturalNote TEXT,
            createdAt TEXT,
            badge TEXT
          )
        `).run();

        await d1.prepare(`
          INSERT INTO lookbooks (id, title, era, author, authorInitial, isAnonymous, likes, shares, category, img, outfit, frameId, culturalNote, createdAt, badge)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          newItem.id,
          newItem.title,
          newItem.era,
          newItem.author,
          newItem.authorInitial,
          newItem.isAnonymous ? 1 : 0,
          newItem.likes,
          newItem.shares,
          newItem.category,
          newItem.img,
          newItem.outfit ? JSON.stringify(newItem.outfit) : null,
          newItem.frameId,
          newItem.culturalNote,
          newItem.createdAt,
          newItem.badge
        ).run();

        storageUsed = "cloudflare-d1";
      } catch (err: any) {
        console.warn("D1 write error:", err);
      }
    }

    // 2. Try Cloudflare KV
    const kv = getKV(context.env);
    if (kv) {
      try {
        const raw = await kv.get("lookbooks_community_all");
        let items: any[] = [];
        if (raw) {
          items = typeof raw === "string" ? JSON.parse(raw) : raw;
        }
        items = [newItem, ...items.filter((i) => i.id !== newItem.id)].slice(0, 200);
        await kv.put("lookbooks_community_all", JSON.stringify(items));
        await kv.put(`lookbook:${newItem.id}`, JSON.stringify(newItem));
        storageUsed = storageUsed === "none" ? "cloudflare-kv" : `${storageUsed}+kv`;
      } catch (err: any) {
        console.warn("KV write error:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: newItem,
        storage: storageUsed,
      }),
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Lỗi lưu Lookbook vào Cloudflare" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

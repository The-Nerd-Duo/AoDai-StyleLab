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

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Automatically detect any KV binding regardless of exact case or name
function findKV(env: any): KVNamespace | null {
  const sources = [
    env,
    typeof globalThis !== "undefined" ? (globalThis as any) : null,
    typeof process !== "undefined" ? (process as any)?.env : null,
  ];

  const candidateNames = [
    "LOOKBOOK_KV",
    "lookbook_kv",
    "KV",
    "kv",
    "LOOKBOOK_STORE",
    "lookbook_store",
    "LOOKBOOK",
    "lookbook",
  ];

  for (const src of sources) {
    if (!src || typeof src !== "object") continue;
    for (const name of candidateNames) {
      const c = src[name];
      if (c && typeof c.get === "function" && typeof c.put === "function") {
        return c;
      }
    }
    for (const key of Object.keys(src)) {
      const val = src[key];
      if (val && typeof val === "object" && typeof val.get === "function" && typeof val.put === "function") {
        return val;
      }
    }
  }
  return null;
}

// Automatically detect any D1 binding regardless of exact case or name
function findD1(env: any): D1Database | null {
  if (!env || typeof env !== "object") return null;
  const candidates = [
    env.DB,
    env.db,
    env.LOOKBOOK_DB,
    env.lookbook_db,
    env.DATABASE,
  ];
  for (const c of candidates) {
    if (c && typeof c.prepare === "function") {
      return c;
    }
  }
  for (const key of Object.keys(env)) {
    const val = env[key];
    if (val && typeof val === "object" && typeof val.prepare === "function") {
      return val;
    }
  }
  return null;
}

// GET /api/lookbook - Load community lookbooks from Cloudflare KV or D1
export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const d1 = findD1(context.env);
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

        // Clean any auto spam records from D1 if present
        await d1.prepare(
          "DELETE FROM lookbooks WHERE isAnonymous = 1 AND author = 'Khách Ẩn Danh' AND title = 'Bản Phối Di Sản 2026'"
        ).run().catch(() => {});

        const { results } = await d1.prepare(
          "SELECT * FROM lookbooks ORDER BY createdAt DESC LIMIT 200"
        ).all();

        const items = (results || []).map((row: any) => ({
          ...row,
          isAnonymous: Boolean(row.isAnonymous),
          outfit: row.outfit ? (typeof row.outfit === "string" ? JSON.parse(row.outfit) : row.outfit) : undefined,
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

    const kv = findKV(context.env);
    if (kv) {
      try {
        const raw = await kv.get("lookbooks_community_all", "json");
        let items: any[] = [];
        if (Array.isArray(raw)) {
          items = raw;
        } else if (typeof raw === "string") {
          items = JSON.parse(raw);
        }

        const initialCount = items.length;
        // Purge legacy sample cards & automated duplicate spam cards
        items = (items || []).filter((item) => {
          if (!item) return false;
          if (String(item.id).startsWith("sample-")) return false;
          // Filter out automated duplicate spam cards caused by useEffect auto-trigger
          if (
            item.isAnonymous &&
            item.author === "Khách Ẩn Danh" &&
            item.title === "Bản Phối Di Sản 2026"
          ) {
            return false;
          }
          return true;
        });

        // Permanently persist the cleaned list back to KV if any spam was removed
        if (items.length !== initialCount) {
          try {
            await kv.put("lookbooks_community_all", JSON.stringify(items));
          } catch (writeErr) {
            console.warn("KV sync cleaned items notice:", writeErr);
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: items,
            storage: "cloudflare-kv",
            count: items.length,
          }),
          { headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error("KV read error:", err);
        return new Response(
          JSON.stringify({
            success: false,
            error: "KV read error: " + (err?.message || "Unknown error"),
            storage: "cloudflare-kv-error",
          }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // Default if no storage binding configured on Cloudflare Pages yet
    const envKeys = context.env ? Object.keys(context.env) : [];
    return new Response(
      JSON.stringify({
        success: true,
        data: [],
        storage: "none",
        warning: "LOOKBOOK_KV chưa có trong context.env. Biến hiện có: " + (envKeys.length ? envKeys.join(", ") : "không có biến nào"),
        envKeys,
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
export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body: any = await context.request.json();
    const isCommunity = body.isCommunity !== false;
    const isAnon = !!body.isAnonymous;
    const author = isAnon ? "Khách Ẩn Danh" : (body.author && body.author.trim()) || "Đồng Sáng Tạo";

    const newItem = {
      id: `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: (body.title && body.title.trim()) || "Bản Phối Di Sản 2026",
      era: body.era || "Việt Phục",
      author,
      authorInitial: isAnon ? "Ẩ" : author.charAt(0).toUpperCase(),
      isAnonymous: isAnon,
      likes: 0,
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
    let kvError: string | null = null;

    // 1. Save to Cloudflare D1 if available (only for public community posts)
    const d1 = findD1(context.env);
    if (d1 && isCommunity) {
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

    // 2. Save to Cloudflare KV if available
    const kv = findKV(context.env);
    if (kv) {
      try {
        // Always store individual card snapshot so /api/lookbook/[id] can load it for sharing
        await kv.put(`lookbook:${newItem.id}`, JSON.stringify(newItem));

        // ONLY add to public community feed if this is an explicit community submission
        if (isCommunity) {
          const raw = await kv.get("lookbooks_community_all", "json");
          let items: any[] = [];
          if (Array.isArray(raw)) {
            items = raw;
          } else if (typeof raw === "string") {
            items = JSON.parse(raw);
          }
          // Filter out legacy sample cards and automated duplicate spam cards
          items = (items || []).filter(
            (i: any) =>
              i &&
              !String(i.id).startsWith("sample-") &&
              !(i.isAnonymous && i.author === "Khách Ẩn Danh" && i.title === "Bản Phối Di Sản 2026")
          );

          // Put new item at front, keep up to 100 items
          items = [newItem, ...items.filter((i: any) => i.id !== newItem.id)].slice(0, 100);
          await kv.put("lookbooks_community_all", JSON.stringify(items));
        }

        storageUsed = storageUsed === "none" ? "cloudflare-kv" : `${storageUsed}+kv`;
      } catch (err: any) {
        console.error("KV write error:", err);
        kvError = err?.message || "Lỗi ghi vào Cloudflare KV";
      }
    }

    if (storageUsed === "none") {
      const envKeys = context.env ? Object.keys(context.env) : [];
      return new Response(
        JSON.stringify({
          success: false,
          error: kvError 
            ? `Lỗi ghi vào Cloudflare KV: ${kvError}` 
            : `Cloudflare KV (LOOKBOOK_KV) chưa có hiệu lực trên deployment này. Biến môi trường hiện có: [${envKeys.join(", ")}]. Vui lòng đảm bảo bản deploy mới nhất đã hoàn thành.`,
          data: newItem,
          storage: "none",
        }),
        { status: 503, headers: CORS_HEADERS }
      );
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


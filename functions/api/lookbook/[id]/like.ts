interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
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
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

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

function findD1(env: any): D1Database | null {
  if (!env || typeof env !== "object") return null;
  const candidates = [env.DB, env.db, env.LOOKBOOK_DB, env.lookbook_db];
  for (const c of candidates) {
    if (c && typeof c.prepare === "function") return c;
  }
  for (const key of Object.keys(env)) {
    const val = env[key];
    if (val && typeof val === "object" && typeof val.prepare === "function") return val;
  }
  return null;
}

export async function onRequestPost(context: {
  request: Request;
  env: any;
  params: { id: string };
}) {
  try {
    const id = context.params?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing lookbook id" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const body: any = await context.request.json().catch(() => ({}));
    const action = body.action === "unlike" ? "unlike" : "like";
    const deviceId = (body.deviceId && String(body.deviceId).trim()) || `anon_${Date.now()}`;
    const delta = action === "like" ? 1 : -1;
    let newLikes = 0;
    let storageHandled = false;

    // 1. Cloudflare D1
    const d1 = findD1(context.env);
    if (d1) {
      try {
        await d1.prepare(`
          CREATE TABLE IF NOT EXISTS lookbook_likes (
            lookbook_id TEXT,
            device_id TEXT,
            created_at TEXT,
            PRIMARY KEY (lookbook_id, device_id)
          )
        `).run().catch(() => {});

        if (action === "like") {
          await d1.prepare("INSERT OR IGNORE INTO lookbook_likes (lookbook_id, device_id, created_at) VALUES (?, ?, ?)")
            .bind(id, deviceId, new Date().toISOString())
            .run();
        } else {
          await d1.prepare("DELETE FROM lookbook_likes WHERE lookbook_id = ? AND device_id = ?")
            .bind(id, deviceId)
            .run();
        }

        const countRow: any = await d1.prepare("SELECT COUNT(*) as cnt FROM lookbook_likes WHERE lookbook_id = ?").bind(id).first();
        if (countRow && typeof countRow.cnt === "number") {
          newLikes = countRow.cnt;
        } else {
          const item: any = await d1.prepare("SELECT likes FROM lookbooks WHERE id = ?").bind(id).first();
          newLikes = Math.max(0, (item?.likes || 0) + delta);
        }
        await d1.prepare("UPDATE lookbooks SET likes = ? WHERE id = ?").bind(newLikes, id).run();
        storageHandled = true;
      } catch (err) {
        console.warn("D1 like update error:", err);
      }
    }

    // 2. Cloudflare KV
    const kv = findKV(context.env);
    if (kv) {
      try {
        let likers: string[] = [];
        let baseCount = 0;
        const likersRaw: any = await kv.get(`lookbook_likers:${id}`, "json");
        if (Array.isArray(likersRaw)) {
          likers = likersRaw;
        } else if (likersRaw && typeof likersRaw === "object") {
          likers = Array.isArray(likersRaw.likers) ? likersRaw.likers : [];
          baseCount = typeof likersRaw.baseCount === "number" ? likersRaw.baseCount : 0;
        }

        // If likers not tracked yet, seed with current item count if available
        const singleRaw = await kv.get(`lookbook:${id}`, "json");
        if (likers.length === 0 && baseCount === 0 && singleRaw?.likes) {
          baseCount = singleRaw.likes;
        }

        if (action === "like") {
          if (!likers.includes(deviceId)) {
            likers.push(deviceId);
          }
        } else {
          if (likers.includes(deviceId)) {
            likers = likers.filter((d) => d !== deviceId);
          } else if (baseCount > 0) {
            baseCount = Math.max(0, baseCount - 1);
          }
        }

        if (!storageHandled) {
          newLikes = Math.max(0, baseCount + likers.length);
        }

        await kv.put(`lookbook_likers:${id}`, JSON.stringify({ likers, baseCount }));

        if (singleRaw) {
          singleRaw.likes = newLikes;
          await kv.put(`lookbook:${id}`, JSON.stringify(singleRaw));
        }

        const raw = await kv.get("lookbooks_community_all", "json");
        if (raw) {
          const items = Array.isArray(raw) ? raw : (typeof raw === "string" ? JSON.parse(raw) : []);
          const idx = items.findIndex((i: any) => i.id === id);
          if (idx !== -1) {
            items[idx].likes = newLikes;
            await kv.put("lookbooks_community_all", JSON.stringify(items));
          }
        }
        storageHandled = true;
      } catch (err) {
        console.warn("KV like update error:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { id, likes: newLikes },
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Lỗi cập nhật like" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

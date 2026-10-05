interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
}

interface D1Database {
  prepare(query: string): {
    bind(...values: any[]): any;
    first(): Promise<any>;
  };
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function findKV(env: any): KVNamespace | null {
  if (!env || typeof env !== "object") return null;
  const candidates = [env.LOOKBOOK_KV, env.lookbook_kv, env.KV, env.kv, env.LOOKBOOK_STORE];
  for (const c of candidates) {
    if (c && typeof c.get === "function" && typeof c.put === "function") return c;
  }
  for (const key of Object.keys(env)) {
    const val = env[key];
    if (val && typeof val === "object" && typeof val.get === "function" && typeof val.put === "function") return val;
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

export async function onRequestGet(context: {
  request: Request;
  env: any;
  params: { id: string };
}) {
  try {
    const id = context.params?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    // 1. Cloudflare D1
    const d1 = findD1(context.env);
    if (d1) {
      try {
        const item: any = await d1.prepare("SELECT * FROM lookbooks WHERE id = ?").bind(id).first();
        if (item) {
          return new Response(
            JSON.stringify({
              success: true,
              data: {
                ...item,
                isAnonymous: Boolean(item.isAnonymous),
                outfit: item.outfit ? (typeof item.outfit === "string" ? JSON.parse(item.outfit) : item.outfit) : undefined,
              },
            }),
            { headers: CORS_HEADERS }
          );
        }
      } catch (err) {
        console.warn("D1 get error:", err);
      }
    }

    // 2. Cloudflare KV
    const kv = findKV(context.env);
    if (kv) {
      try {
        const direct = await kv.get(`lookbook:${id}`, "json");
        if (direct) {
          return new Response(JSON.stringify({ success: true, data: direct }), {
            headers: CORS_HEADERS,
          });
        }
        const raw = await kv.get("lookbooks_community_all", "json");
        if (raw) {
          const items = Array.isArray(raw) ? raw : (typeof raw === "string" ? JSON.parse(raw) : []);
          const found = items.find((i: any) => i.id === id);
          if (found) {
            return new Response(JSON.stringify({ success: true, data: found }), {
              headers: CORS_HEADERS,
            });
          }
        }
      } catch (err) {
        console.warn("KV get error:", err);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Không tìm thấy thẻ lookbook" }),
      { status: 404, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Lỗi lấy dữ liệu" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

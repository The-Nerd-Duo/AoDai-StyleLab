interface KVNamespace {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
}

interface D1Database {
  prepare(query: string): {
    bind(...values: any[]): any;
    first(): Promise<any>;
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
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context: {
  request: Request;
  env: Env;
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
    const d1 = context.env.DB || context.env.LOOKBOOK_DB;
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
                outfit: item.outfit ? JSON.parse(item.outfit) : undefined,
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
    const kv = context.env.LOOKBOOK_KV || context.env.KV || context.env.LOOKBOOK_STORE;
    if (kv) {
      try {
        const direct = await kv.get(`lookbook:${id}`, "json");
        if (direct) {
          return new Response(JSON.stringify({ success: true, data: direct }), {
            headers: CORS_HEADERS,
          });
        }
        const raw = await kv.get("lookbooks_community_all");
        if (raw) {
          const items = typeof raw === "string" ? JSON.parse(raw) : raw;
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

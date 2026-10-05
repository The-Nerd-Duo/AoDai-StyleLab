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
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
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

    let newShares = 1;

    // 1. Cloudflare D1
    const d1 = context.env.DB || context.env.LOOKBOOK_DB;
    if (d1) {
      try {
        const item: any = await d1.prepare("SELECT shares FROM lookbooks WHERE id = ?").bind(id).first();
        if (item) {
          newShares = (item.shares || 0) + 1;
          await d1.prepare("UPDATE lookbooks SET shares = ? WHERE id = ?").bind(newShares, id).run();
        }
      } catch (err) {
        console.warn("D1 share update error:", err);
      }
    }

    // 2. Cloudflare KV
    const kv = context.env.LOOKBOOK_KV || context.env.KV || context.env.LOOKBOOK_STORE;
    if (kv) {
      try {
        const raw = await kv.get("lookbooks_community_all");
        if (raw) {
          const items = typeof raw === "string" ? JSON.parse(raw) : raw;
          const idx = items.findIndex((i: any) => i.id === id);
          if (idx !== -1) {
            newShares = (items[idx].shares || 0) + 1;
            items[idx].shares = newShares;
            await kv.put("lookbooks_community_all", JSON.stringify(items));
          }
        }
      } catch (err) {
        console.warn("KV share update error:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { id, shares: newShares },
      }),
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Lỗi cập nhật share" }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

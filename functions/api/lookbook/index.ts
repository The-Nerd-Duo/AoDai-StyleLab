import { SAMPLE_LOOKBOOKS } from "@/lib/lookbook-storage";

export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      success: true,
      data: SAMPLE_LOOKBOOKS,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function onRequestPost(context: { request: Request }) {
  try {
    const body: any = await context.request.json();
    const isAnon = !!body.isAnonymous;
    const author = isAnon ? "Khách Ẩn Danh" : body.author || "Đồng Sáng Tạo";
    const newItem = {
      id: `lookbook-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: body.title || "Bản Phối Di Sản 2026",
      era: body.era || "Việt Phục",
      author,
      authorInitial: isAnon ? "Ẩ" : author.charAt(0).toUpperCase(),
      isAnonymous: isAnon,
      likes: 1,
      shares: 0,
      category: body.category || "y2k",
      img: body.img || null,
      outfit: body.outfit,
      frameId: body.frameId || "frame-heritage-vermilion",
      culturalNote: body.culturalNote,
      createdAt: new Date().toISOString(),
      badge: "Mới đăng",
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: newItem,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Lỗi xử lý" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

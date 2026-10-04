import { NextRequest, NextResponse } from "next/server";
import { toggleLikeLookbook } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Thiếu ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action === "unlike" ? "unlike" : "like";

    const result = await toggleLikeLookbook(id, action);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(`POST /api/lookbook/${params.id}/like error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi khi cập nhật lượt thích" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { incrementShareLookbook } from "@/lib/db";

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

    const result = await incrementShareLookbook(id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(`POST /api/lookbook/${params.id}/share error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi khi cập nhật lượt chia sẻ" },
      { status: 500 }
    );
  }
}

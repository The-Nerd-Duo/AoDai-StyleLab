import { NextRequest, NextResponse } from "next/server";
import { getAllLookbooks, createLookbook } from "@/lib/db";
import { CreateLookbookInput } from "@/lib/types";

export const dynamic = "force-dynamic";

// GET /api/lookbook - Get all community lookbooks
export async function GET() {
  try {
    const lookbooks = await getAllLookbooks();
    return NextResponse.json({
      success: true,
      data: lookbooks,
    });
  } catch (error: any) {
    console.error("GET /api/lookbook error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi khi lấy danh sách lookbook" },
      { status: 500 }
    );
  }
}

// POST /api/lookbook - Create a new lookbook item & broadcast in real-time
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.outfit) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu bản phối (outfit) không hợp lệ" },
        { status: 400 }
      );
    }

    const input: CreateLookbookInput = {
      title: body.title,
      author: body.author,
      isAnonymous: Boolean(body.isAnonymous),
      category: body.category || "y2k",
      img: body.img || null,
      outfit: body.outfit,
      frameId: body.frameId,
      era: body.era,
      culturalNote: body.culturalNote,
    };

    const newItem = await createLookbook(input);

    return NextResponse.json(
      {
        success: true,
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/lookbook error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Lỗi khi đăng lookbook" },
      { status: 500 }
    );
  }
}

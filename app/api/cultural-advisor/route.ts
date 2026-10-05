import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { evaluateCulturalHarmony } from "@/lib/cultural-engine";
import { getCandidateModels } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "";
    const { garmentId, colorId, occasionId, styleId } = body;

    if (apiKey) {
      const candidateModels = getCandidateModels();

      const prompt = `Bạn là "Cố Vấn Di Sản & Thời Trang Việt Phục" trong dự án Việt Phục Remix (AI Arena Vietnam 2026).
Hãy phân tích bộ phối trang phục:
- Trang phục ID: ${garmentId}
- Màu sắc ID: ${colorId}
- Bối cảnh ID: ${occasionId}
- Phong cách ID: ${styleId}

HÃY PHẢN HỒI HOÀN TOÀN BẰNG ĐỊNH DẠNG JSON HỢP LỆ (KHÔNG DÙNG BACKTICKS MARKDOWN):
{
  "colorHarmonyScore": số từ 60 đến 99,
  "weatherFitScore": số từ 60 đến 99,
  "culturalRespectScore": số từ 60 đến 100,
  "overallScore": số trung bình có trọng số,
  "elementAnalysis": { "element": "Kim/Mộc/Thủy/Hỏa/Thổ", "description": "Ý nghĩa ngũ hành" },
  "colorHarmonyVerdict": "Nhận xét 1-2 câu",
  "weatherAdvice": "Lời khuyên 1-2 câu",
  "culturalNotes": "Đánh giá 1-2 câu",
  "genZStylingTip": "Mẹo phối Gen Z",
  "warnings": []
}`;

      const ai = new GoogleGenAI({ apiKey });

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              temperature: 0.4,
            },
          });

          const rawText = response.text || "";
          const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);
          return NextResponse.json(parsed);
        } catch (err: any) {
          console.warn(`Gemini Advisor call warning with ${model}:`, err?.message || err);
        }
      }
    }

    // Fallback to local rule engine
    const fallback = evaluateCulturalHarmony({
      garmentId,
      colorId,
      occasionId,
      styleId,
      accessoryId: body.accessoryId,
      accessoryIds: body.accessoryIds,
      personaId: body.personaId,
    });

    return NextResponse.json(fallback);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi xử lý cố vấn di sản" },
      { status: 500 }
    );
  }
}

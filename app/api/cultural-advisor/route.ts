import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { evaluateCulturalHarmony } from "@/lib/cultural-engine";
import { getCandidateModels } from "@/lib/gemini";

// In-memory cache to save API quota and prevent redundant calls
const advisorCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "";
    const { garmentId, colorId, occasionId, styleId } = body;

    const cacheKey = `${garmentId}_${colorId}_${occasionId}_${styleId}_${body.accessoryId || "none"}`;
    if (advisorCache.has(cacheKey)) {
      return NextResponse.json(advisorCache.get(cacheKey));
    }

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

          advisorCache.set(cacheKey, parsed);
          return NextResponse.json(parsed);
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          // If rate limited (429 / RESOURCE_EXHAUSTED), break immediately to avoid spamming multiple models
          if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded")) {
            console.info("Gemini Free Tier quota reached (15 RPM), using local heritage rule engine.");
            break;
          }
          console.warn(`Gemini Advisor call warning with ${model}:`, errMsg);
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

    advisorCache.set(cacheKey, fallback);
    return NextResponse.json(fallback);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi xử lý cố vấn di sản" },
      { status: 500 }
    );
  }
}

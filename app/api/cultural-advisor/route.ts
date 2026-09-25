import { NextResponse } from "next/server";
import { genAI, DEFAULT_FLASH_MODEL } from "@/lib/gemini";
import mockupsData from "@/config/mockups.json";
import culturalRules from "@/config/cultural-rules.json";

export interface CulturalAdvisorRequest {
  garmentId: string;
  colorId: string;
  occasionId: string;
  styleId: string;
  accessoryId: string;
  personaId: string;
}

export interface CulturalAdvisorResponse {
  colorHarmonyScore: number;
  weatherFitScore: number;
  culturalRespectScore: number;
  overallScore: number;
  elementAnalysis: {
    element: string;
    description: string;
  };
  colorHarmonyVerdict: string;
  weatherAdvice: string;
  culturalNotes: string;
  genZStylingTip: string;
  warnings: string[];
}

export async function POST(req: Request) {
  try {
    const body: CulturalAdvisorRequest = await req.json();
    const { garmentId, colorId, occasionId, styleId, accessoryId } = body;

    const garment = mockupsData.garments.find((g) => g.id === garmentId) || mockupsData.garments[0];
    const color = mockupsData.colors.find((c) => c.id === colorId) || mockupsData.colors[0];
    const occasion = mockupsData.occasions.find((o) => o.id === occasionId) || mockupsData.occasions[0];
    const style = mockupsData.styles.find((s) => s.id === styleId) || mockupsData.styles[0];
    const accessory = mockupsData.accessories.find((a) => a.id === accessoryId) || mockupsData.accessories[0];

    // Check pre-configured cultural warnings
    const localWarnings: string[] = [];
    for (const rule of culturalRules.forbiddenCombinations) {
      const matchGarment = !rule.garmentId || rule.garmentId === garmentId;
      const matchOccasion = !rule.occasionId || rule.occasionId === occasionId;
      const matchStyle = !rule.styleId || rule.styleId === styleId;
      const matchAccessory = !rule.accessoryId || rule.accessoryId === accessoryId;

      if (matchGarment && matchOccasion && matchStyle && matchAccessory) {
        localWarnings.push(rule.reason);
      }
    }

    // Try calling Google AI Studio SDK if configured
    if (genAI) {
      try {
        const prompt = `
Bạn là "Cố Vấn Di Sản & Thời Trang Việt Phục" trong dự án Việt Phục Remix (AI Arena Vietnam 2026).
Hãy phân tích bộ phối trang phục sau theo 3 yếu tố:
1. Hài hòa màu sắc (Lý thuyết màu sắc và Ngũ Hành Á Đông: Kim, Mộc, Thủy, Hỏa, Thổ)
2. Độ phù hợp thời tiết & bối cảnh sự kiện
3. Thuần phong mỹ tục & Quy chuẩn nghi lễ di sản (Responsible AI)

Thông tin phối đồ:
- Trang phục: ${garment.name} (${garment.dynasty})
- Màu sắc: ${color.name} (Ngũ hành: ${color.element})
- Bối cảnh sự kiện: ${occasion.name} (${occasion.formalityLevel})
- Phong cách Gen Z: ${style.name} (${style.description})
- Phụ kiện: ${accessory.name}

HÃY PHẢN HỒI HOÀN TOÀN BẰNG ĐỊNH DẠNG JSON HỢP LỆ VỚI CÁC TRƯỜNG SAU (KHÔNG DÙNG BACKTICKS MARKDOWN):
{
  "colorHarmonyScore": số từ 60 đến 99,
  "weatherFitScore": số từ 60 đến 99,
  "culturalRespectScore": số từ 60 đến 100,
  "overallScore": số trung bình có trọng số,
  "elementAnalysis": {
    "element": "${color.element}",
    "description": "Ngắn gọn về ý nghĩa Ngũ hành của màu ${color.name}"
  },
  "colorHarmonyVerdict": "Nhận xét 1-2 câu về sự hòa sắc và thị giác",
  "weatherAdvice": "Lời khuyên 1-2 câu về thời tiết và chất liệu",
  "culturalNotes": "Đánh giá 1-2 câu về sự chuẩn mực văn hóa, nghi lễ và thuần phong mỹ tục",
  "genZStylingTip": "Gợi ý 1 mẹo mix match Gen Z cực cool",
  "warnings": ["cảnh báo nếu có điểm chưa phù hợp hoặc bỏ trống nếu đã tốt"]
}
`;

        const response = await genAI.models.generateContent({
          model: DEFAULT_FLASH_MODEL,
          contents: prompt,
        });

        const rawText = response.text || "";
        // Clean markdown wrapper if any
        const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText) as CulturalAdvisorResponse;

        // Merge with local rule warnings
        if (localWarnings.length > 0) {
          parsed.warnings = Array.from(new Set([...(parsed.warnings || []), ...localWarnings]));
          // Penalty if critical warning
          parsed.culturalRespectScore = Math.min(parsed.culturalRespectScore, 70);
          parsed.overallScore = Math.round((parsed.colorHarmonyScore + parsed.weatherFitScore + parsed.culturalRespectScore) / 3);
        }

        return NextResponse.json(parsed);
      } catch (aiError) {
        console.warn("Gemini API call failed, falling back to rule engine:", aiError);
      }
    }

    // High quality Fallback Rule Engine (Instant <0.1s response)
    const baseRespect = localWarnings.length > 0 ? 68 : 95;
    const isHarmoniousOccasion = garment.recommendedOccasions.includes(occasionId);
    const weatherScore = isHarmoniousOccasion ? 92 : 78;
    const colorScore = 88;
    const overall = Math.round((colorScore + weatherScore + baseRespect) / 3);

    const fallbackResponse: CulturalAdvisorResponse = {
      colorHarmonyScore: colorScore,
      weatherFitScore: weatherScore,
      culturalRespectScore: baseRespect,
      overallScore: overall,
      elementAnalysis: {
        element: color.element,
        description: `${color.meaning} Gam màu ${color.name} mang năng lượng hành ${color.element} tạo hiệu ứng thị giác nổi bật.`,
      },
      colorHarmonyVerdict: `Sắc ${color.name} kết hợp cùng phong cách ${style.name} mang lại sự cân bằng giữa nét cổ kính và hơi thở đương đại.`,
      weatherAdvice: `${occasion.weatherHint} Nên ưu tiên chất liệu lụa tơ tằm, đũi hoặc gấm nhẹ thoáng khí để thoải mái vận động.`,
      culturalNotes: `${garment.culturalSignificance} Khi kết hợp với ${accessory.name}, tổng thể vẫn giữ được nét tao nhã di sản.`,
      genZStylingTip: `Thử tạo dáng khoanh tay cung kính truyền thống kết hợp góc máy cận cảnh để làm nổi bật chi tiết ${accessory.name}.`,
      warnings: localWarnings,
    };

    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error("Error in cultural-advisor API:", error);
    return NextResponse.json({ error: "Lỗi xử lý cố vấn văn hóa" }, { status: 500 });
  }
}

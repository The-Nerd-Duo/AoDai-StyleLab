import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { evaluateCulturalHarmony } from "@/lib/cultural-engine";
import { getCandidateModels } from "@/lib/gemini";
import mockupsData from "@/config/mockups.json";
import { fetchWeatherForLocation, WeatherInfo } from "@/lib/weather";

// In-memory cache to save API quota and prevent redundant calls
const advisorCache = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "";
    const { garmentId, colorId, occasionId, styleId } = body;
    const locationId = body.locationId || "hanoi";

    // Lấy thông tin thời tiết thời gian thực từ Open-Meteo
    let weather: WeatherInfo = body.weather;
    if (!weather) {
      weather = await fetchWeatherForLocation(locationId);
    }

    const cacheKey = `${garmentId}_${colorId}_${occasionId}_${styleId}_${body.accessoryId || "none"}_${locationId}`;
    if (advisorCache.has(cacheKey)) {
      const cached = advisorCache.get(cacheKey);
      return NextResponse.json({ ...cached, weatherInfo: weather });
    }

    const garment = mockupsData.garments.find((g) => g.id === garmentId) || mockupsData.garments[0];
    const color = mockupsData.colors.find((c) => c.id === colorId) || mockupsData.colors[0];
    const occasion = mockupsData.occasions.find((o) => o.id === occasionId) || mockupsData.occasions[0];
    const style = mockupsData.styles.find((s) => s.id === styleId) || mockupsData.styles[0];

    const accessoryIds: string[] = body.accessoryIds && body.accessoryIds.length > 0
      ? body.accessoryIds
      : body.accessoryId && body.accessoryId !== "none"
      ? [body.accessoryId]
      : [];
    const selectedAccessories = mockupsData.accessories.filter((a) => accessoryIds.includes(a.id));
    const accessoryNames = selectedAccessories.length > 0 ? selectedAccessories.map((a) => a.name).join(", ") : "Không có phụ kiện";

    if (apiKey) {
      const candidateModels = getCandidateModels();

      const prompt = `Bạn là "Cố Vấn Di Sản & Thời Trang Việt Phục" trong dự án Việt Phục Remix (AI Arena Vietnam 2026).
Hãy phân tích và thẩm định bộ phối trang phục Việt Phục sau trong ĐIỀU KIỆN THỜI TIẾT THỰC TẾ:

[THỜI TIẾT THỰC TẾ]:
- Địa điểm: ${weather.cityName}
- Nhiệt độ hiện tại: ${weather.temperature}°C (Cảm nhận thực tế: ${weather.apparentTemperature}°C)
- Tình trạng: ${weather.conditionText}
- Độ ẩm không khí: ${weather.humidity}% | Sức gió: ${weather.windSpeed} km/h
${weather.isRain ? "- Lưu ý đặc biệt: Ngoài trời đang có mưa/ẩm ướt." : ""}

[BỘ PHỐI TRANG PHỤC]:
- Tên trang phục: ${garment.name} (Thời kỳ/Triều đại: ${garment.dynasty})
- Tông màu: ${color.name} (Hành ${color.element} - ${color.meaning})
- Bối cảnh: ${occasion.name} (${occasion.weatherHint})
- Phong cách: ${style.name}
- Phụ kiện kết hợp: ${accessoryNames}

YÊU CẦU ĐẶC BIỆT VỀ NỘI DUNG THẨM ĐỊNH:
1. "originAndSignificance": Nêu chính xác nguồn gốc lịch sử (triều đại, thời kỳ ra đời, bối cảnh lịch sử) và ý nghĩa biểu trưng văn hóa của ${garment.name} một cách súc tích, trang trọng, ngắn gọn trong 2-3 câu. Tránh nói chung chung, phải đúng bản chất lịch sử trang phục này.
2. "weatherFitScore": Chấm điểm số từ 60 đến 99 về mức độ thoải mái và tương thích của ${garment.name} với thời tiết ${weather.temperature}°C tại ${weather.cityName}.
3. "weatherAdvice": Nhận xét 1-2 câu sâu sắc về chất liệu (lụa, gấm, đũi, nhung) và số lớp áo để thích ứng với thời tiết ${weather.temperature}°C (${weather.conditionText}), kèm mẹo mang phụ kiện bảo quản/che chắn thực tế (ô giấy dầu khi mưa, quạt lụa khi nóng, áo lót cổ cao khi lạnh).
4. "culturalNotes": Đánh giá 1-2 câu về quy chế di sản, sự tôn trọng chuẩn mực phom dáng và tính hài hòa khi kết hợp trang phục này với phụ kiện (${accessoryNames}). TUYỆT ĐỐI KHÔNG lặp lại nội dung của "originAndSignificance".

HÃY PHẢN HỒI HOÀN TOÀN BẰNG ĐỊNH DẠNG JSON HỢP LỆ (KHÔNG DÙNG BACKTICKS MARKDOWN):
{
  "colorHarmonyScore": số từ 60 đến 99,
  "weatherFitScore": số từ 60 đến 99,
  "culturalRespectScore": số từ 60 đến 100,
  "overallScore": số trung bình có trọng số,
  "originAndSignificance": "Nêu đúng nguồn gốc triều đại và ý nghĩa biểu trưng ngắn gọn (2-3 câu)",
  "elementAnalysis": { "element": "${color.element}", "description": "Ý nghĩa ngũ hành" },
  "colorHarmonyVerdict": "Nhận xét 1-2 câu về màu sắc",
  "weatherAdvice": "Lời khuyên 1-2 câu về chất liệu thích ứng thời tiết thực tế",
  "culturalNotes": "Đánh giá 1-2 câu về quy chế di sản khi phối cùng phụ kiện",
  "genZStylingTip": "Mẹo phối Gen Z 1 câu",
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
          parsed.weatherInfo = weather;

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
      locationId,
      weather,
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

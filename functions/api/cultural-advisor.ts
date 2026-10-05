interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_FLASH_MODEL?: string;
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-goog-api-key",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    const apiKey =
      context.env?.GEMINI_API_KEY ||
      (typeof process !== "undefined" && process?.env?.GEMINI_API_KEY) ||
      "";
    const { garmentId, colorId, occasionId, styleId } = body;

    if (apiKey) {
      const candidateModels = Array.from(
        new Set([
          context.env?.GEMINI_FLASH_MODEL || "gemini-3.8-flash",
          "gemini-3.8-flash",
          "gemini-3.5-flash-lite",
          "gemini-2.5-flash",
          "gemini-2.5-flash-lite",
          "gemini-2.0-flash",
          "gemini-1.5-flash",
        ])
      );

      const prompt = `Bạn là "Cố Vấn Di Sản & Thời Trang Việt Phục" trong dự án Việt Phục Remix (AI Arena Vietnam 2026).
Hãy phân tích bộ phối trang phục:
- Trang phục ID: ${garmentId || "mặc định"}
- Màu sắc ID: ${colorId || "mặc định"}
- Bối cảnh ID: ${occasionId || "mặc định"}
- Phong cách ID: ${styleId || "mặc định"}

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

      for (const model of candidateModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData: any = await geminiRes.json();
            const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanedText);
            return new Response(JSON.stringify(parsed), {
              headers: CORS_HEADERS,
            });
          } else {
            const errText = await geminiRes.text();
            console.warn(`Cloudflare Gemini call error on ${model} (HTTP ${geminiRes.status}):`, errText);
          }
        } catch (err) {
          console.warn(`Cloudflare Gemini call exception on ${model}:`, err);
        }
      }
    }

    const fallback = {
      colorHarmonyScore: 88,
      weatherFitScore: 92,
      culturalRespectScore: 95,
      overallScore: 92,
      elementAnalysis: {
        element: "Hỏa",
        description: "Gam màu mang năng lượng rực rỡ và nhiệt huyết của tuổi trẻ.",
      },
      colorHarmonyVerdict: "Bản phối giữ vững nét tôn nghiêm di sản trong hình thái thời trang hiện đại.",
      weatherAdvice: "Nên ưu tiên chất liệu lụa tơ tằm hoặc gấm nhẹ thoáng khí.",
      culturalNotes: "Bộ trang phục tuân thủ chuẩn mực di sản và thuần phong mỹ tục.",
      genZStylingTip: "Tạo dáng trang nghiêm với góc máy cận cảnh để làm nổi bật chi tiết cổ phục.",
      warnings: [],
    };

    return new Response(JSON.stringify(fallback), {
      headers: CORS_HEADERS,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Lỗi xử lý" }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

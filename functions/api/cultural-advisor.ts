interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_FLASH_MODEL?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body: any = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY || "";
    const { garmentId, colorId, occasionId, styleId } = body;

    if (apiKey) {
      try {
        const model = context.env.GEMINI_FLASH_MODEL || "gemini-2.0-flash";
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

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData: any = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);
          return new Response(JSON.stringify(parsed), {
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (err) {
        console.warn("Cloudflare Gemini call error:", err);
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
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Lỗi xử lý" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

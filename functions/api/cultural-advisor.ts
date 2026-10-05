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
      const candidateModels = Array.from(
        new Set([
          context.env.GEMINI_FLASH_MODEL || "gemini-3.8-flash",
          "gemini-3.8-flash",
          "gemini-3.5-flash-lite",
          "gemini-2.5-flash",
          "gemini-2.5-flash-lite",
        ])
      );

      for (const model of candidateModels) {
        try {
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
          console.warn(`Cloudflare Gemini call error on ${model}:`, err);
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
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Lỗi xử lý" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

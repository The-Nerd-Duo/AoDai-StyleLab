interface Env {
  GEMINI_API_KEY?: string;
  GEMINI_PRO_MODEL?: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { question }: any = await context.request.json();
    const apiKey = context.env.GEMINI_API_KEY || "";

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Câu hỏi không hợp lệ" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (apiKey) {
      try {
        const model = context.env.GEMINI_PRO_MODEL || "gemini-3.8-flash";
        const systemInstruction = `Bạn là "Bách Khoa Toàn Thư Di Sản Việt Phục", trợ lý AI chuyên sâu thuộc dự án Việt Phục Remix (AI Arena Vietnam 2026).
Nhiệm vụ: Giải đáp chính xác, tự hào và cuốn hút về các trang phục truyền thống Việt Nam (Áo dài, Áo ngũ thân, Áo tấc, Áo tứ thân, Áo giao lĩnh, Áo nhật bình...) qua các triều đại Lý, Trần, Lê, Nguyễn. Giữ giọng văn thân thiện, tri thức và truyền cảm hứng cho Gen Z.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemInstruction}\n\nNgười dùng hỏi: "${question}"` },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData: any = await geminiRes.json();
          const answer =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (answer) {
            return new Response(
              JSON.stringify({
                answer,
                source: "gemini-ai",
              }),
              { headers: { "Content-Type": "application/json" } }
            );
          }
        }
      } catch (err) {
        console.warn("Cloudflare assistant Gemini call error:", err);
      }
    }

    // Heritage Vault Fallback
    const qLower = question.toLowerCase();
    let answer =
      "Cảm ơn bạn đã quan tâm đến cổ phục Việt Nam! Việt phục là kho tàng vô giá kết tinh tinh hoa văn hóa hàng nghìn năm của cha ông. Bạn có thể hỏi cụ thể hơn về Áo Ngũ Thân, Áo Dài, Áo Tấc hoặc quy tắc phối màu ngũ hành nhé!";

    if (qLower.includes("ngũ thân") || qLower.includes("5 thân")) {
      answer =
        "Áo ngũ thân được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1827. Áo may bằng 5 mảnh vải: 4 thân ngoài tượng trưng cho 'tứ thân phụ mẫu' (cha mẹ đẻ, cha mẹ vợ/chồng) và thân con bên trong tượng trưng cho người mặc được chở che. 5 chiếc cúc tượng trưng cho Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín.";
    } else if (qLower.includes("áo tấc")) {
      answer =
        "Áo Tấc (còn gọi là áo ngũ thân tay thụng) là lễ phục trang trọng thời Nguyễn dành cho cả nam lẫn nữ vào các dịp đại lễ, cưới hỏi, cúng bái. Điểm đặc trưng là tay áo rộng, dài thụng xuống, khi khoanh tay trước ngực hành lễ tạo nên phong thái cung kính, trang nghiêm.";
    } else if (qLower.includes("nhật bình")) {
      answer =
        "Áo Nhật Bình là thường phục cao cấp của Hoàng hậu, Công chúa và mệnh phụ triều đình nhà Nguyễn. Tên gọi bắt nguồn từ cổ áo khoác có hình chữ nhật đối khâm trước ngực, viền chỉ vàng thêu hoa văn tinh xảo và dải ngũ sắc rực rỡ ở viền tay áo.";
    } else if (qLower.includes("tứ thân")) {
      answer =
        "Áo Tứ Thân là biểu tượng mộc mạc duyên dáng của phụ nữ đồng bằng Bắc Bộ, gắn liền với hát Quan họ Kinh Bắc. Áo có 4 vạt: hai vạt sau may liền thành sống lưng, hai vạt trước buông thả hoặc thắt nút trước bụng.";
    } else if (qLower.includes("phối") || qLower.includes("gen z") || qLower.includes("sneaker")) {
      answer =
        "Gen Z hoàn toàn có thể phối Việt phục cùng sneaker trắng, kính râm retro hay túi vải canvas để dạo phố! Điều cốt lõi là giữ cho phom áo thẳng thớm, cài cúc chỉnh tề và không mặc hở hang hoặc cắt xẻ làm sai lệch cấu trúc cổ truyền.";
    }

    return new Response(
      JSON.stringify({
        answer,
        source: "heritage-vault-local",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Lỗi xử lý trợ lý văn hóa" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import { NextResponse } from "next/server";
import { genAI, DEFAULT_PRO_MODEL } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { question, history } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Câu hỏi không hợp lệ" }, { status: 400 });
    }

    if (genAI) {
      try {
        const systemInstruction = `
Bạn là "Bách Khoa Toàn Thư Di Sản Việt Phục", trợ lý AI chuyên sâu thuộc dự án Việt Phục Remix (AI Arena Vietnam 2026).
Nhiệm vụ:
- Giải đáp chính xác, tự hào và cuốn hút về các trang phục truyền thống Việt Nam (Áo dài, Áo ngũ thân, Áo tấc, Áo tứ thân, Áo giao lĩnh, Áo nhật bình...).
- Cung cấp bối cảnh lịch sử qua các triều đại Lý, Trần, Lê, Nguyễn.
- Khuyến khích thế hệ trẻ Gen Z phối đồ hiện đại nhưng luôn nhấn mạnh lòng tự tôn dân tộc và tuân thủ quy chuẩn thuần phong mỹ tục.
- Giữ giọng văn thân thiện, tri thức, hào hứng và truyền cảm hứng.
`;

        const response = await genAI.models.generateContent({
          model: DEFAULT_PRO_MODEL,
          contents: `${systemInstruction}\n\nNgười dùng hỏi: "${question}"`,
        });

        return NextResponse.json({
          answer: response.text || "Xin lỗi, hiện tại tôi chưa thể tìm thấy câu trả lời phù hợp.",
          source: "gemini-ai",
        });
      } catch (aiError) {
        console.warn("Cultural assistant Gemini call failed, using knowledge base fallback:", aiError);
      }
    }

    // Smart Local Knowledge Base Fallback
    const qLower = question.toLowerCase();
    let answer = "Cảm ơn bạn đã quan tâm đến cổ phục Việt Nam! Việt phục là kho tàng vô giá kết tinh tinh hoa văn hóa hàng nghìn năm của cha ông. Bạn có thể hỏi cụ thể hơn về Áo Ngũ Thân, Áo Dài, Áo Tấc hoặc quy tắc phối màu ngũ hành nhé!";

    if (qLower.includes("ngũ thân") || qLower.includes("5 thân")) {
      answer = "Áo ngũ thân được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1827. Áo may bằng 5 mảnh vải: 4 thân ngoài tượng trưng cho 'tứ thân phụ mẫu' (cha mẹ đẻ, cha mẹ vợ/chồng) và thân con bên trong tượng trưng cho người mặc được chở che. 5 chiếc cúc tượng trưng cho Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín.";
    } else if (qLower.includes("áo tấc")) {
      answer = "Áo Tấc (còn gọi là áo ngũ thân tay thụng hay áo thụng) là lễ phục trang trọng thời Nguyễn dành cho cả nam lẫn nữ vào các dịp đại lễ, cưới hỏi, cúng bái. Điểm đặc trưng là tay áo rộng, dài thụng xuống, khi khoanh tay trước ngực hành lễ tạo nên phong thái cung kính, trang nghiêm tuyệt đối.";
    } else if (qLower.includes("nhật bình")) {
      answer = "Áo Nhật Bình là thường phục cao cấp của Hoàng hậu, Công chúa và mệnh phụ triều đình nhà Nguyễn. Tên gọi bắt nguồn từ cổ áo khoác có hình chữ nhật đối khâm trước ngực, viền chỉ vàng thêu hoa văn tinh xảo và dải ngũ sắc rực rỡ ở viền tay áo.";
    } else if (qLower.includes("tứ thân")) {
      answer = "Áo Tứ Thân là biểu tượng mộc mạc duyên dáng của phụ nữ đồng bằng Bắc Bộ, gắn liền với hát Quan họ Kinh Bắc. Áo có 4 vạt: hai vạt sau may liền thành sống lưng, hai vạt trước buông thả hoặc thắt nút trước bụng, bên trong mặc yếm đào thắm sắc.";
    } else if (qLower.includes("phối") || qLower.includes("gen z") || qLower.includes("sneaker")) {
      answer = "Gen Z hoàn toàn có thể phối Việt phục cùng sneaker trắng, kính râm retro hay túi vải canvas để dạo phố! Điều cốt lõi là giữ cho phom áo thẳng thớm, cài cúc chỉnh tề và không mặc hở hang hoặc cắt xẻ làm sai lệch cấu trúc cổ truyền.";
    }

    return NextResponse.json({
      answer,
      source: "heritage-vault-local",
    });
  } catch (error) {
    console.error("Error in cultural-assistant API:", error);
    return NextResponse.json({ error: "Lỗi trợ lý văn hóa" }, { status: 500 });
  }
}

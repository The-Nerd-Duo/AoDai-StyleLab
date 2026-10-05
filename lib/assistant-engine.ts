export function answerHeritageQuestion(question: string): { answer: string; source: string } {
  const qLower = question.toLowerCase();
  let answer =
    "Cảm ơn bạn đã quan tâm đến cổ phục Việt Nam! Việt phục là kho tàng vô giá kết tinh tinh hoa văn hóa hàng nghìn năm của cha ông. Bạn có thể hỏi cụ thể hơn về Áo Ngũ Thân, Áo Dài, Áo Tấc, Áo Nhật Bình hoặc quy tắc phối màu ngũ hành nhé!";

  if (qLower.includes("ngũ thân") || qLower.includes("5 thân")) {
    answer =
      "Áo ngũ thân được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1827. Áo may bằng 5 mảnh vải: 4 thân ngoài tượng trưng cho 'tứ thân phụ mẫu' (cha mẹ đẻ, cha mẹ vợ/chồng) và thân con bên trong tượng trưng cho người mặc được chở che. 5 chiếc cúc tượng trưng cho Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín.";
  } else if (qLower.includes("áo tấc")) {
    answer =
      "Áo Tấc (còn gọi là áo ngũ thân tay thụng hay áo thụng) là lễ phục trang trọng thời Nguyễn dành cho cả nam lẫn nữ vào các dịp đại lễ, cưới hỏi, cúng bái. Điểm đặc trưng là tay áo rộng, dài thụng xuống, khi khoanh tay trước ngực hành lễ tạo nên phong thái cung kính, trang nghiêm tuyệt đối.";
  } else if (qLower.includes("nhật bình")) {
    answer =
      "Áo Nhật Bình là thường phục cao cấp của Hoàng hậu, Công chúa và mệnh phụ triều đình nhà Nguyễn. Tên gọi bắt nguồn từ cổ áo khoác có hình chữ nhật đối khâm trước ngực, viền chỉ vàng thêu hoa văn tinh xảo và dải ngũ sắc rực rỡ ở viền tay áo.";
  } else if (qLower.includes("tứ thân")) {
    answer =
      "Áo Tứ Thân là biểu tượng mộc mạc duyên dáng của phụ nữ đồng bằng Bắc Bộ, gắn liền với hát Quan họ Kinh Bắc. Áo có 4 vạt: hai vạt sau may liền thành sống lưng, hai vạt trước buông thả hoặc thắt nút trước bụng, bên trong mặc yếm đào thắm sắc.";
  } else if (qLower.includes("giao lĩnh")) {
    answer =
      "Áo Giao Lĩnh (tràng vạt) là dạng áo cổ chéo xuất hiện từ thời Lý, Trần, Lê. Khi mặc, vạt bên trái đè lên vạt bên phải, mang đậm tinh thần phóng khoáng, cổ phong của người Việt thời trung đại.";
  } else if (qLower.includes("lemur")) {
    answer =
      "Áo dài Lemur do họa sĩ Cát Tường sáng tạo vào thập niên 1930 tại Hà Nội, đánh dấu cuộc cách mạng hiện đại hóa áo dài với cổ khoét trái tim, tay bồng, phom ôm sát cơ thể phụ nữ tôn vinh đường cong tự nhiên.";
  } else if (qLower.includes("phối") || qLower.includes("gen z") || qLower.includes("sneaker")) {
    answer =
      "Gen Z hoàn toàn có thể phối Việt phục cùng sneaker trắng, kính râm retro hay túi vải canvas để dạo phố! Điều cốt lõi là giữ cho phom áo thẳng thớm, cài cúc chỉnh tề và không mặc hở hang hoặc cắt xẻ làm sai lệch cấu trúc cổ truyền.";
  }

  return {
    answer,
    source: "heritage-vault-local",
  };
}

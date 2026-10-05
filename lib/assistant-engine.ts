export function answerHeritageQuestion(question: string): { answer: string; source: string } {
  const qLower = question.toLowerCase();
  let answer =
    "Cảm ơn bạn đã quan tâm đến cổ phục Việt Nam! Việt phục là kho tàng vô giá kết tinh tinh hoa văn hóa hàng nghìn năm của cha ông. Bạn có thể hỏi cụ thể hơn về Áo Ngũ Thân, Áo Dài, Áo Tấc, Áo Nhật Bình hoặc quy tắc phối màu ngũ hành nhé!";

  if (qLower.includes("áo dài") || qLower.includes("ao dai")) {
    answer =
      "Dạ, áo dài chính là biểu tượng **quốc phục tôn vinh nét đẹp thanh tao** của người Việt Nam qua bao thế hệ.\n\n" +
      "• **Cấu trúc tinh tế**: Gồm hai vạt trước sau ôm sát cơ thể, xẻ tà đến hông trên nền **quần dài ống rộng**, vừa kín đáo vừa uyển chuyển.\n" +
      "• **Tiến hóa qua thời gian**: Phát triển từ chiếc **Áo Ngũ thân** truyền thống, được cách tân qua các thời kỳ (như **Áo dài Le Mur**, Raglan) để hiện đại hóa.\n" +
      "• **Hồn cốt dân tộc**: Đại diện cho sự giao thoa hoàn hảo giữa **truyền thống và hơi thở đương đại**.\n\n" +
      "Bạn có muốn thử phối áo dài truyền thống với **sneaker trắng** hoặc kính vintage để dạo phố cực phong cách không?";
  } else if (qLower.includes("ngũ thân") || qLower.includes("5 thân")) {
    answer =
      "Dạ, **Áo Ngũ Thân** là đỉnh cao của trang phục truyền thống định hình cốt cách người Việt.\n\n" +
      "• **Cấu trúc 5 thân**: 4 thân ngoài tượng trưng cho **tứ thân phụ mẫu** (cha mẹ đôi bên), thân con bên trong tượng trưng cho **bản thân người mặc** được chở che.\n" +
      "• **5 chiếc cúc**: Tượng trưng cho **Ngũ Thường** trong đạo làm người: Nhân, Lễ, Nghĩa, Trí, Tín.\n" +
      "• **Chuẩn hóa triều Nguyễn**: Được chúa Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng chuẩn hóa toàn quốc năm 1827.\n\n" +
      "Bạn có muốn tìm hiểu sự khác biệt giữa Áo Ngũ Thân tay chẽn và Áo Tấc không?";
  } else if (qLower.includes("áo tấc")) {
    answer =
      "Dạ, **Áo Tấc** (còn gọi là áo ngũ thân tay thụng) là lễ phục trang trọng bậc nhất thời Nguyễn.\n\n" +
      "• **Đặc trưng tay áo**: Tay áo may **rộng và thụng dài**, khi khoanh tay trước ngực hành lễ tạo nên phong thái cung kính, trang nghiêm tuyệt đối.\n" +
      "• **Bối cảnh sử dụng**: Dành cho cả nam lẫn nữ trong các dịp **đại lễ, tế tự, hôn lễ** và nghi lễ cung đình triều Nguyễn.\n" +
      "• **Phụ kiện đi kèm**: Thường mặc cùng **khăn đóng/mấn** và quần trắng để hoàn thiện nét thanh tao.\n\n" +
      "Bạn có muốn biết cách chọn màu sắc Áo Tấc chuẩn quy tắc ngũ hành không?";
  } else if (qLower.includes("nhật bình")) {
    answer =
      "Dạ, **Áo Nhật Bình** là tuyệt tác triều phục cung đình thời nhà Nguyễn.\n\n" +
      "• **Cổ áo độc bản**: Tên gọi bắt nguồn từ cổ áo khoác có hình **chữ nhật đối khâm** trước ngực, viền chỉ vàng thêu hoa văn tinh xảo.\n" +
      "• **Dải ngũ sắc**: Viền tay áo có các dải màu **ngũ hành** (lục, vàng, xanh, trắng, đỏ) rực rỡ tượng trưng cho sự uy nghiêm.\n" +
      "• **Địa vị quyền quý**: Thường phục cao cấp dành riêng cho **Hoàng hậu, Công chúa và mệnh phụ** triều đình.\n\n" +
      "Bạn có muốn tìm hiểu về quy chuẩn hoa văn Loan Phụng trên Áo Nhật Bình không?";
  } else if (qLower.includes("tứ thân")) {
    answer =
      "Dạ, **Áo Tứ Thân** là biểu tượng mộc mạc, duyên dáng của phụ nữ Bắc Bộ xưa.\n\n" +
      "• **Cấu trúc 4 vạt**: Hai vạt sau may liền thành sống lưng, hai vạt trước buông thả hoặc thắt nút trước bụng, kết hợp **yếm đào thắm sắc** bên trong.\n" +
      "• **Gắn liền di sản**: Gắn liền với các liền chị và nghệ thuật **dân ca Quan họ Kinh Bắc**.\n" +
      "• **Ý nghĩa văn hóa**: Đại diện cho nét đẹp lao động cần cù, duyên thầm của người phụ nữ Việt.\n\n" +
      "Bạn có muốn tìm hiểu cách phối nón quai thao cùng Áo Tứ Thân sao cho chuẩn nét xưa không?";
  } else if (qLower.includes("giao lĩnh")) {
    answer =
      "Dạ, **Áo Giao Lĩnh** (còn gọi là tràng vạt) là dạng trang phục cổ truyền thời Lý, Trần, Lê.\n\n" +
      "• **Cổ áo chéo đặc trưng**: Khi mặc, **vạt bên trái đè lên vạt bên phải**, tạo góc chéo thanh thoát trước ngực.\n" +
      "• **Dấu ấn lịch sử**: Phổ biến rộng rãi trong cung đình lẫn dân gian suốt thời kỳ trung đại Việt Nam.\n" +
      "• **Phong thái khoáng đạt**: Phom dáng rộng rãi mang đậm tinh thần tự do, cổ phong phương Đông.\n\n" +
      "Bạn có muốn khám phá sự chuyển biến từ Giao Lĩnh sang Ngũ Thân qua các thế kỷ không?";
  } else if (qLower.includes("lemur")) {
    answer =
      "Dạ, **Áo dài Le Mur** do họa sĩ Cát Tường sáng tạo vào thập niên 1930 tại Hà Nội.\n\n" +
      "• **Cuộc cách mạng phom dáng**: Đánh dấu bước cách tân hiện đại đầu tiên với **cổ khoét trái tim, tay bồng** và nhấn eo ôm sát đường cong tự nhiên.\n" +
      "• **Giao thoa Đông - Tây**: Kết hợp giữa nét đẹp áo dài truyền thống với phong cách thời trang Paris đương thời.\n" +
      "• **Tiền đề cho Áo dài hiện đại**: Là bước đệm quan trọng dẫn đến áo dài Raglan thập niên 1960.\n\n" +
      "Bạn có muốn so sánh phom dáng Le Mur với Áo dài Raglan không?";
  } else if (qLower.includes("phối") || qLower.includes("gen z") || qLower.includes("sneaker")) {
    answer =
      "Dạ, Gen Z hoàn toàn có thể thổi làn gió đương đại vào Việt phục truyền thống!\n\n" +
      "• **Phối Sneaker trắng**: Tạo nên diện mạo năng động, phá cách nhưng vẫn giữ được nét thanh lịch khi dạo phố.\n" +
      "• **Phụ kiện cổ điển**: Kết hợp cùng **kính mát vintage, túi cói/canvas** và quạt giấy xếp để tạo điểm nhấn thị giác.\n" +
      "• **Quy chuẩn văn hóa**: Luôn giữ cho tà áo thẳng thớm, cài cúc chỉnh tề và không cắt xẻ làm lệch cấu trúc di sản.\n\n" +
      "Bạn muốn tư vấn set đồ Việt phục đi dạo phố hay đi chụp ảnh kỷ yếu?";
  }

  return {
    answer,
    source: "heritage-vault-local",
  };
}

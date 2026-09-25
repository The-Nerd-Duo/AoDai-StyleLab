# VIỆT PHỤC REMIX (v2) 🇻🇳
**Cuộc thi:** AI Arena Vietnam 2026  
**Đề thi Vòng Audition:** Việt phục Remix - Phối trang phục truyền thống theo phong cách Gen Z  
**Đơn vị tổ chức:** Đại học Quốc gia Hà Nội (VNU) & Google  

---

## 🌟 Tổng Quan Dự Án
Ứng dụng web giúp thế hệ trẻ (Gen Z) khám phá, sáng tạo và phối trang phục truyền thống Việt Nam (Áo dài, Áo ngũ thân, Áo tấc, Áo tứ thân, Áo Nhật bình, Áo giao lĩnh...) kết hợp phong cách đương đại (Y2K, Streetwear, Cyber Indochine), đồng thời bảo tồn và truyền tải chuẩn mực giá trị di sản văn hóa lịch sử.

---

## 🚀 3 Trụ Cột Tính Năng Cốt Lõi (3 Tabs)

### 🎨 Tab 1: Studio Phối Đồ & AI Cố Vấn Văn Hóa (`/`)
- **Tùy chọn phong phú:** Nhóm trang phục, Bảng màu di sản & Ngũ Hành, Hoàn cảnh sự kiện, Phong cách Gen Z, Phụ kiện.
- **Nhân vật đại diện (Persona & Avatar):** Chọn persona đại diện (Gen Z Nữ/Nam, Thục nữ, Sĩ phu) hoặc tải ảnh khuôn mặt cá nhân.
- **Live Preview:** Hiển thị tức thì mockup phối đồ sinh động, phản hồi <0.5s.
- **AI Cultural Advisor (Gemini 2.0 Flash):**
  - Đánh giá độ hài hòa màu sắc & Ngũ Hành tương sinh tương khắc.
  - Phân tích độ phù hợp thời tiết & bối cảnh sự kiện.
  - **Responsible AI:** Cảnh báo các phối đồ vi phạm thuần phong mỹ tục hoặc sai lệch quy chuẩn nghi lễ.
- **So Sánh A/B:** Lưu phiên bản A và so sánh trực quan song song (Side-by-Side) với phiên bản B.

### 🖼️ Tab 2: Tạo & Chia Sẻ Thẻ Lookbook (`/lookbook`)
- **Khung thiết kế chuẩn tỉ lệ 9:16:** 5 mẫu khung nghệ thuật (Chu Sa Hoàng Kim, Minimal Luxury, Cyber Indochine, Tem Thư Hà Thành, Giám Tuyển Di Sản).
- **Xuất ảnh PNG sắc nét:** Chụp khung thẻ trực tiếp bằng `html-to-image` client-side.
- **Chia sẻ Stateless 100%:** Mã hóa toàn bộ thuộc tính trang phục vào URL Query Parameters (`/share?g=...&c=...`), 0% Database, 0$ chi phí máy chủ.

### 📜 Tab 3: Bách Khoa Việt Phục - Interactive Cultural Vault (`/wiki`)
- **Gia phả Việt phục (Visual Timeline):** Dòng thời gian 1000 năm tiến hóa trang phục qua các triều đại Lý, Trần, Hậu Lê, Chúa Nguyễn Phúc Khoát (1744), Vua Minh Mạng (1827), Áo dài Lemur (1930), Raglan (1960) đến phong trào Phục hưng Gen Z.
- **Giải mã Hoa văn Cổ truyền:** Tra cứu ý nghĩa biểu tượng của Mây Ngũ Sắc, Bách Liên Hoa, Long Phụng, Thủy Ba Tam Sơn, Chữ Thọ.
- **Trợ lý Gemini AI Chat:** Trò chuyện, giải đáp mọi thắc mắc chuyên sâu về nghi thức mặc, cách phân biệt các dạng cổ phục.

---

## 🛠️ Tech Stack Tinh Gọn (0$ Cost)
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons (Heritage Dark & Imperial Color Palette)
- **AI Engine:** Google AI Studio SDK (`@google/genai`) với Gemini 2.0 Flash & Gemini 2.0 Pro
- **Exporting:** `html-to-image`
- **Deployment:** Google Cloud Run (Multi-stage Docker Container)

---

## 📦 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Gemini API Key
Tạo file `.env.local` tại thư mục gốc:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```
*(Nếu chưa có API Key, hệ thống tự động kích hoạt Rule Engine thông minh dự phòng, bảo đảm ứng dụng luôn hoạt động mượt mà không bị gián đoạn).*

### 3. Chạy môi trường Development
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

### 4. Build Docker & Deploy Google Cloud Run
```bash
docker build -t vietphuc-remix .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key vietphuc-remix
```
Sau đó deploy lên Google Cloud Run theo chuẩn Codelab Google.

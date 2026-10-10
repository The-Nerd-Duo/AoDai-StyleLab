# 🇻🇳 VIỆT PHỤC REMIX (AoDai StyleLab)

> **Cuộc thi:** AI Arena Vietnam 2026  
> **Đề thi Vòng Audition:** Việt phục Remix - Phối trang phục truyền thống theo phong cách Gen Z  
> **Đơn vị tổ chức:** Đại học Quốc gia Hà Nội (VNU) & Google  
> **Đội ngũ phát triển:** The Nerd Duo  
> **Phiên bản:** v2.2 (Cập nhật Kiến trúc AI Đa Tầng, Thời tiết Thời gian thực & Tự động Định vị Vị trí)

---

## 🌟 1. Bối Cảnh & Vấn Đề (Problem Statement)

Trang phục truyền thống Việt Nam (Cổ phục) qua các triều đại Lý, Trần, Lê, Nguyễn—từ **Áo Giao Lĩnh, Áo Tứ Thân, Áo Ngũ Thân Tay Chẽn, Áo Tấc** đến **Áo Nhật Bình** và **Áo Dài Lemur/Raglan**—chứa đựng tinh hoa thẩm mỹ và triết lý nhân sinh nghìn năm của dân tộc.

Tuy nhiên, thế hệ trẻ (Gen Z) đang đối mặt với những rào cản lớn:
1. **Khoảng cách tiếp cận & Sợ sai lệch quy chuẩn:** Giới trẻ muốn đưa cổ phục vào đời sống thường nhật (dạo phố, lễ hội, sự kiện nghệ thuật) nhưng e ngại "phạm húy", phối sai nghi thức điển lễ hoặc lệch ngũ hành tương sinh tương khắc.
2. **Thiếu không gian thử nghiệm số hóa trực quan (Mix & Match):** Không có công cụ cho phép trực quan hóa tức thì việc kết hợp giữa phom dáng cổ phục kinh điển và phụ kiện/hơi thở thời đại (Y2K, Cyber Indochine, Streetwear).
3. **Thích ứng thực tế & Thời tiết địa phương:** Cổ phục truyền thống có nhiều lớp và chất liệu đặc thù (gấm, tơ tằm, sa, đũi). Người mặc thường bối rối không biết chất liệu nào phù hợp với điều kiện thời tiết thực tế tại địa phương chụp ảnh.
4. **Nguy cơ sai lệch thẩm mỹ & Hở hang phản cảm khi tạo ảnh AI:** Nhiều mô hình AI tạo sinh trang phục truyền thống dễ bị nhầm lẫn phom dáng, lai tạp văn hóa hoặc tạo ra hình ảnh thiếu kín đáo, không phù hợp thuần phong mỹ tục Việt Nam.

👉 **Việt Phục Remix (AoDai StyleLab)** ra đời như một **Cyber-Heritage Fashion Lab**—kết hợp sức mạnh của **Google Gemini AI**, **Open-Meteo Real-Time Weather API** và **FLUX Prompt Engine có Guardrails Văn Hóa**, giúp Gen Z tự do sáng tạo bản phối thời trang độc bản mà vẫn tuyệt đối tôn trọng và bảo tồn giá trị di sản.

---

## 🚀 2. 3 Trụ Cột Trải Nghiệm Cốt Lõi

```mermaid
graph TD
    A[Việt Phục Remix] --> B[Trụ Cột 1: Studio Phối Đồ & AI Cố Vấn '/']
    A --> C[Trụ Cột 2: Lookbook Nghệ Thuật & Chia Sẻ '/lookbook']
    A --> D[Trụ Cột 3: Bách Khoa Việt Phục & AI Chat '/bach-khoa']

    B --> B1[Interactive Mix & Match Deck]
    B --> B2[Persona Đại Diện Nam / Nữ]
    B --> B3[Cultural Harmony AI Engine]
    B --> B4[Tự Động Nhận Diện Vị Trí & Thời Tiết Thực]
    B --> B5[So Sánh Song Song A/B Testing]

    C --> C1[5 Mẫu Khung Nghệ Thuật 9:16]
    C --> C2[Mã QR Động Client-Side]
    C --> C3[Chia Sẻ Stateless URL & Cộng Đồng]
    C --> C4[Xuất File PNG Sắc Nét]

    D --> D1[Visual Timeline 1000 Năm Di Sản]
    D --> D2[Interactive Pattern Vault]
    D --> D3[Trợ Lý Gemini AI Di Sản Nổi]
```

---

### 🎨 Trụ Cột 1: Studio Phối Đồ & Cố Vấn Văn Hóa Thông Minh (`/`)
* **Ma trận phối đồ trực quan & tức thì:**
  * **Cổ phục giám tuyển:** Áo Dài Cách Tân, Áo Ngũ Thân Tay Chẽn, Áo Tấc, Áo Nhật Bình Cung Đình, Áo Tứ Thân Kinh Bắc, Áo Giao Lĩnh Cổ Kính.
  * **Bảng màu di sản & Ngũ Hành:** Đỏ Son (Hỏa), Xanh Ngọc Thanh Thiên (Thủy/Mộc), Vàng Hoàng Cung (Thổ), Đen Huyền Thoại (Thủy), Trắng Ngà Tinh Khôi (Kim).
  * **Bối cảnh sự kiện:** Dạo phố mùa xuân, Lễ tân gia / Cưới hỏi, Triển lãm nghệ thuật đương đại, Lễ hội hoa đăng.
  * **Phong cách Gen Z:** Neo-Y2K, Streetwear Cyber, Minimalist Luxury, Indochine Vintage.
  * **Phụ kiện phối kèm:** Mặc định "Không dùng phụ kiện" để tôn nét mộc mạc nguyên bản; tùy chọn Mấn Tết cách điệu, Vòng kiềng bạc/vàng, Kính râm Y2K, Sneaker chunky, Túi gấm cung đình, Nón quai thao mini.
* **Nhân vật đại diện (Persona):** Vuốt trượt mượt mà giữa Persona Nữ (Dáng chuẩn Á Đông) và Persona Nam (Khí chất đĩnh đạc).
* **So sánh A/B Testing trực quan:** Lưu biến thể trang phục A và so sánh song song đối chiếu với biến thể B trước khi đưa ra quyết định.
* **Cụm Cố Vấn Văn Hóa Toàn Diện (Cultural Harmony AI - 3 Thẻ Chẩn Đoán):**
  * 📜 **Thẻ 1 - Nguồn gốc & Ý nghĩa:** Phân tích ngắn gọn, chuẩn xác nguồn gốc triều đại và biểu trưng văn hóa của từng kiểu áo cổ truyền.
  * ⛅ **Thẻ 2 - Thời tiết & Chất liệu thích ứng:** 
    * Tích hợp **Open-Meteo API** và cơ chế **Tự động nhận diện vị trí người dùng ngầm** (qua IP Geolocation hoặc GPS) hiển thị nhiệt độ, trạng thái bầu trời thực tế.
    * Gemini AI đưa ra lời khuyên chọn chất liệu vải thông minh (lụa tơ tằm, sa cát, gấm dày, đũi mát...) phù hợp hoàn hảo với thời tiết thực tế tại địa phương.
  * ⚖️ **Thẻ 3 - Quy chế Di sản:** Đánh giá độ chuẩn mực nghi lễ, chấm điểm chuẩn mực 100% hoặc đưa ra cảnh báo guardrail khi phát hiện bản phối phạm quy chế.
  * ⭐ **Đánh giá tổng thể 5 sao & Mẹo Phối Đồ Gen Z:** Gợi ý cách phối tạo điểm nhấn cá tính, hiện đại mà không làm mất đi tính trang nghiêm của trang phục cội nguồn.

---

### 🖼️ Trụ Cột 2: Tạo & Chia Sẻ Thẻ Lookbook Nghệ Thuật (`/lookbook`)
* **Khung nghệ thuật chuẩn tỷ lệ 9:16:** 5 mẫu khung giám tuyển (Chu Sa Hoàng Kim, Minimal Luxury, Cyber Indochine, Tem Thư Hà Thành, Giám Tuyển Di Sản) tối ưu chuẩn Story Instagram / TikTok.
* **Mã QR động Client-side:** Tự động tạo mã QR chuẩn tương thích quét tức thì trên camera điện thoại mọi nền tảng.
* **Cơ chế chia sẻ kép:**
  * **Stateless URL (0% Database):** Đóng gói toàn bộ cấu hình phối đồ vào Query Parameters (`/share?g=...&c=...`), chia sẻ tức thì không tốn chi phí lưu trữ máy chủ.
  * **Phòng trưng bày cộng đồng:** Khám phá và tương tác các bản phối sáng tạo từ cộng đồng yêu Việt phục.
* **Xuất ảnh chất lượng cao:** Chụp và tải xuống file ảnh PNG độ phân giải sắc nét qua `html-to-image`.

---

### 📜 Trụ Cột 3: Bách Khoa Việt Phục & Trợ Lý Gemini AI (`/bach-khoa`)
* **Gia phả Việt phục (Visual Timeline 1000 Năm):** Tiến trình lịch sử trang phục từ thời Lý, Trần, Hậu Lê, Chúa Nguyễn Phúc Khoát (1744 - Định hình tiền thân áo dài), Vua Minh Mạng (1827), Áo dài Lemur (1930), Raglan (1960) đến làn sóng Phục hưng của Gen Z.
* **Kho tàng hoa văn di sản (Pattern Vault):** Tra cứu ý nghĩa biểu tượng của Mây Ngũ Sắc, Bách Liên Hoa, Long Phụng, Thủy Ba Tam Sơn, Chữ Thọ.
* **Trợ lý Di sản Gemini AI dạng Floating Chatbox:** Nút tương tác nổi ở góc màn hình, hỗ trợ hỏi đáp chuyên sâu điển chế phục sức, phong cách phối đồ thanh lịch đúng văn hóa với khả năng toggle đóng/mở mượt mà.

---

## 🧠 3. Kiến Trúc AI Đột Phá & Responsible AI Guardrails

### 🔄 1. Mô Hình Hybrid AI Architecture (Zero-Latency + Deep Intelligence)

Hệ thống kết hợp mô hình **Local Rule Engine** và **Google Gemini 2.0 Flash**:

```
[Người dùng vuốt chọn đồ]
           │
           ├─► (0ms Latency) ──► [Local Cultural Engine] ────────► Cập nhật UI & Điểm Ngũ Hành ngay lập tức
           │
           └─► (Debounce 650ms) ─► [In-Memory Cache Check]
                                           │
                               ┌───────────┴───────────┐
                           (Đã có cache)           (Chưa có cache)
                               │                       │
                               ▼                       ▼
                         Trả kết quả tức thì      Gọi Gemini 2.0 Flash API (với context thời tiết thực tế)
                                                       │
                                       ┌───────────────┴───────────────┐
                                    (Thành công)                 (429 / Offline)
                                       │                               │
                                       ▼                               ▼
                             Cập nhật đánh giá sâu         Tự động Fallback về Rule Engine
```

1. **Local Cultural Engine (`lib/cultural-engine.ts`):** Tính toán tức thì điểm số tương sinh ngũ hành, nguyên lý màu sắc và khuyến cáo cơ bản ngay khi chạm vuốt, triệt tiêu hoàn toàn cảm giác chờ đợi.
2. **Google Gemini 2.0 Flash Engine (`app/api/cultural-advisor/route.ts`):** 
   * Đóng vai trò **Cố Vấn Di Sản & Thời Trang Việt Phục Cao Cấp**.
   * Tiếp nhận thông số thời tiết thực tế từ Open-Meteo và toạ độ người dùng.
   * Sinh lời khuyên chất liệu vải thích ứng, ý nghĩa cội nguồn và mẹo sáng tạo Gen Z.
3. **In-Memory Caching (15 phút):** Lưu trữ kết quả đánh giá theo tổ hợp món đồ & toạ độ nhằm tối ưu hạn mức API và phản hồi tức thì.
4. **Client-Side Direct Fallback:** Đảm bảo hệ thống hoạt động bền bỉ 100%, tự động dự phòng nếu máy chủ gặp hạn chế vị trí địa lý hoặc mất mạng.

---

### ⛅ 2. Tích Hợp Thời Tiết Thực Tế & Tự Động Định Vị (Open-Meteo API)

* **Hoàn toàn miễn phí, 0$ API Key, độ trễ <100ms:** Sử dụng Open-Meteo API phục vụ dữ liệu nhiệt độ, độ ẩm, sức gió và mã WMO thời tiết theo thời gian thực.
* **Tự động nhận diện vị trí người dùng (Auto-Detection):**
  * Tự động nhận diện ngầm qua **IP Geolocation** (`ipwho.is` / `ipapi.co`) chỉ trong 200ms, không hiển thị pop-up xin quyền vị trí gây gián đoạn trải nghiệm.
  * Tự động ưu tiên GPS chính xác cao nếu người dùng đã cấp quyền cho trình duyệt.
  * Tinh giản giao diện: Chỉ hiển thị thanh badge trang nhã `📍 [Thành phố]: [Nhiệt độ]°C • [Tình trạng]` kèm nút refresh nhanh, loại bỏ các chỉ số rườm rà gây chật hẹp khung nhìn.

---

### 🛡️ 3. Lưới An Toàn Văn Hóa & Thuần Phong Mỹ Tục (FLUX Prompt Engine & Guardrails)

* **FLUX Prompt Engine (`config/flux-prompt-engine.json` & `lib/ai-prompt.ts`):**
  * Cung cấp bộ cấu trúc prompt tạo ảnh AI chuyên sâu cho cổ phục Việt Nam: ánh sáng tự nhiên điện ảnh, chất liệu gấm thêu chân thực, bối cảnh Hoàng thành/Phố cổ/Studio nghệ thuật.
* **Guardrails khống chế tính kín đáo & thuần phong mỹ tục:**
  * Khắc phục triệt để lỗi AI vẽ trang phục hở hang phản cảm (nhất là đối với Áo Tứ Thân Kinh Bắc).
  * Kiểm soát prompt nghiêm ngặt: Áo Tứ Thân luôn đi kèm **yếm lụa kín đáo che ngực, khoác ngoài áo cánh nâu sồng/tứ thân tứ hài, dải lụa thắt eo tao nhã**, thể hiện trọn vẹn nét duyên dáng, e ấp chuẩn mực của người con gái Kinh Bắc truyền thống.
  * Cảnh báo người dùng khi kết hợp trang phục đại lễ (Áo Tấc, Áo Nhật Bình) với phụ kiện quái dị hoặc bối cảnh sinh hoạt thiếu tôn nghiêm.

---

## 🛠️ 4. Tech Stack Tinh Gọn (0$ Cost)

| Thành phần | Công nghệ sử dụng | Phiên bản | Vai trò kiến trúc |
| :--- | :--- | :--- | :--- |
| **Fullstack Framework** | Next.js (App Router, TypeScript) | `14.2.24` | SSR/SSG tối ưu SEO, routing hiện đại, API routes tích hợp |
| **Styling & Icons** | Tailwind CSS + Lucide Icons | `3.4.17` / `0.475` | Thiết kế giao diện Di sản (Heritage Gold, Son Đỏ, Giấy Dó, Ngọc Bích) |
| **GenAI Model** | Google Gemini 2.0 Flash (`@google/genai`) | `^2.24.0` | Cố vấn di sản văn hóa và Trợ lý AI Bách khoa |
| **Weather API** | Open-Meteo API | REST v1 | Cung cấp dữ liệu thời tiết thời gian thực không cần API key |
| **Geo Location** | Silent IP Geolocation + HTML5 GPS | Browser / REST | Tự động nhận diện vị trí người dùng mượt mà |
| **QR Code Engine** | `qrcode` | `^1.5.4` | Sinh mã QR động chuẩn xác phía Client-side |
| **Image Generation** | `html-to-image` | `^1.11.11` | Render và xuất thẻ Lookbook PNG độ nét cao |
| **Prompt Engine** | FLUX Heritage Prompt Engine | v2.0 | Chuẩn hóa prompt tạo ảnh với Guardrails thuần phong mỹ tục |
| **Container & Cloud** | Docker + Google Cloud Run | Multi-stage | Đóng gói container chuẩn hóa, mở rộng tức thì trên Google Cloud |

---

## 📦 5. Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
* Node.js `18.x` hoặc `20.x` trở lên
* Trình quản lý gói `npm` hoặc `yarn`

### 2. Cài đặt Dependencies
```bash
git clone https://github.com/The-Nerd-Duo/AoDai-StyleLab.git
cd AoDai-StyleLab
npm install
```

### 3. Cấu hình Biến Môi Trường (Environment Variables)
Tạo file `.env.local` tại thư mục gốc của dự án:
```env
# Google AI Studio API Key (Gemini 2.0 Flash)
GEMINI_API_KEY=your_google_ai_studio_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_google_ai_studio_api_key_here
```
*(Nếu chưa cấu hình API Key, hệ thống tự động kích hoạt Heritage Rule Engine thông minh dự phòng, bảo đảm ứng dụng luôn vận hành mượt mà 100%).*

### 4. Khởi chạy môi trường Phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt và truy cập: `http://localhost:3000`

### 5. Kiểm tra Build Production
```bash
npm run build
npm run start
```

### 6. Build Docker & Triển khai Google Cloud Run
Dự án đã cấu hình sẵn `Dockerfile` đa tầng tối ưu dung lượng:
```bash
# Build Docker image
docker build -t vietphuc-remix:latest .

# Chạy thử container cục bộ
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key vietphuc-remix:latest
```

Triển khai lên Google Cloud Run theo hướng dẫn chuẩn của Google Cloud SDK:
```bash
gcloud run deploy vietphuc-remix \
  --image gcr.io/YOUR_PROJECT_ID/vietphuc-remix:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

---

## 👥 6. Thông Tin Tác Giả & Bản Quyền

* **Đội thi:** The Nerd Duo
* **Dự án:** AoDai StyleLab / Việt Phục Remix
* **Cuộc thi:** AI Arena Vietnam 2026 (VNU & Google)
* **Giấy phép:** MIT License
* **Liên kết kho lưu trữ:** [https://github.com/The-Nerd-Duo/AoDai-StyleLab](https://github.com/The-Nerd-Duo/AoDai-StyleLab)

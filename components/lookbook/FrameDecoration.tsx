"use client";

import React from "react";

interface FrameDecorationProps {
  theme: string;
  borderColor?: string;
  accentColor?: string;
}

export const FrameDecoration: React.FC<FrameDecorationProps> = ({
  theme,
  borderColor = "#C5A059",
  accentColor = "#BA2D27",
}) => {
  // 0. Default: Không dùng khung
  if (theme === "none" || !theme) {
    return null;
  }

  // 1. Royal Imperial: Hoa văn mây cuộn hoàng triều Đại Việt & Viền chu sa thếp vàng cung đình
  if (theme === "royal") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl select-none">
        {/* Lớp viền ngoài thếp vàng ánh kim sang trọng */}
        <div
          className="absolute inset-1.5 sm:inset-2 rounded-[22px] border-[2.5px] pointer-events-none shadow-[0_0_15px_rgba(212,175,55,0.35)]"
          style={{
            borderColor: "#D4AF37",
            boxShadow: "inset 0 0 10px rgba(186,45,39,0.2), 0 0 14px rgba(212,175,55,0.3)",
          }}
        />

        {/* Lớp viền trong chu sa hoàng cung mảnh mai */}
        <div className="absolute inset-3 sm:inset-3.5 rounded-[18px] border border-[#BA2D27]/80 pointer-events-none" />
        <div className="absolute inset-[15px] sm:inset-[18px] rounded-[14px] border border-[#D4AF37]/40 pointer-events-none" />

        {/* Hoa văn góc Tây Nam - Đông Bắc: Mây cuộn hoàng triều Đại Việt & Triện son */}
        {/* Góc trên bên trái */}
        <svg
          className="absolute top-2 left-2 w-14 h-14 sm:w-16 sm:h-16 text-[#D4AF37] filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Khung góc kép mạ vàng */}
          <path d="M4 28V4H28" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 24V8H24" stroke="#BA2D27" strokeWidth="1.2" strokeLinecap="round" />
          {/* Mây cuộn hoàng gia Đại Việt */}
          <path
            d="M5 5C14 5 22 9 26 18C30 27 24 36 15 36C8 36 4 30 5 23C6 16 13 13 19 14C25 15 27 20 24 24C21 27 17 26 17 23"
            stroke="#F5E6BE"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 12C15 12 19 15 21 20M12 28C16 28 20 25 21 21"
            stroke="#BA2D27"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Đính ngọc chu sa góc viền */}
          <circle cx="5" cy="5" r="3.5" fill="#BA2D27" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.2" fill="#FFE29F" />
        </svg>

        {/* Góc trên bên phải */}
        <svg
          className="absolute top-2 right-2 w-14 h-14 sm:w-16 sm:h-16 text-[#D4AF37] filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] scale-x-[-1]"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 28V4H28" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 24V8H24" stroke="#BA2D27" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M5 5C14 5 22 9 26 18C30 27 24 36 15 36C8 36 4 30 5 23C6 16 13 13 19 14C25 15 27 20 24 24C21 27 17 26 17 23"
            stroke="#F5E6BE"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 12C15 12 19 15 21 20M12 28C16 28 20 25 21 21"
            stroke="#BA2D27"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="5" cy="5" r="3.5" fill="#BA2D27" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.2" fill="#FFE29F" />
        </svg>

        {/* Góc dưới bên trái */}
        <svg
          className="absolute bottom-2 left-2 w-14 h-14 sm:w-16 sm:h-16 text-[#D4AF37] filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] scale-y-[-1]"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 28V4H28" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 24V8H24" stroke="#BA2D27" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M5 5C14 5 22 9 26 18C30 27 24 36 15 36C8 36 4 30 5 23C6 16 13 13 19 14C25 15 27 20 24 24C21 27 17 26 17 23"
            stroke="#F5E6BE"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 12C15 12 19 15 21 20M12 28C16 28 20 25 21 21"
            stroke="#BA2D27"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="5" cy="5" r="3.5" fill="#BA2D27" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.2" fill="#FFE29F" />
        </svg>

        {/* Góc dưới bên phải */}
        <svg
          className="absolute bottom-2 right-2 w-14 h-14 sm:w-16 sm:h-16 text-[#D4AF37] filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] -scale-100"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 28V4H28" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 24V8H24" stroke="#BA2D27" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M5 5C14 5 22 9 26 18C30 27 24 36 15 36C8 36 4 30 5 23C6 16 13 13 19 14C25 15 27 20 24 24C21 27 17 26 17 23"
            stroke="#F5E6BE"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M10 12C15 12 19 15 21 20M12 28C16 28 20 25 21 21"
            stroke="#BA2D27"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="5" cy="5" r="3.5" fill="#BA2D27" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="1.2" fill="#FFE29F" />
        </svg>

        {/* Ấn triện hoàng triều Đại Việt ở cạnh trên giữa */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#BA2D27]/90 border border-[#D4AF37] shadow-md flex items-center gap-1 backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE29F]" />
          <span className="font-serif text-[8px] font-bold text-[#FFE29F] tracking-widest uppercase">
            ĐẠI TRIỀU • DI SẢN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFE29F]" />
        </div>
      </div>
    );
  }

  // 2. Editorial Haute Couture: Khung tạp chí thời trang cao cấp với typography và crop marks
  if (theme === "editorial") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl select-none">
        {/* Khung chỉ vàng tinh tế kiểu Haute Couture */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-[20px] border-2 border-[#D4AF37]/80 shadow-[0_0_12px_rgba(212,175,55,0.25)]" />
        <div className="absolute inset-3.5 sm:inset-4 rounded-[16px] border border-white/25" />

        {/* 4 Góc Crop Marks (+) & Thước đo Studio */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]">
          <span className="absolute -top-2 -left-2 text-[10px] text-[#D4AF37] font-mono font-bold leading-none">+</span>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]">
          <span className="absolute -top-2 -right-2 text-[10px] text-[#D4AF37] font-mono font-bold leading-none">+</span>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]">
          <span className="absolute -bottom-2 -left-2 text-[10px] text-[#D4AF37] font-mono font-bold leading-none">+</span>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]">
          <span className="absolute -bottom-2 -right-2 text-[10px] text-[#D4AF37] font-mono font-bold leading-none">+</span>
        </div>

        {/* Thanh tiêu đề Tạp chí Thời trang ở cạnh trên */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-[#D4AF37]/50 shadow-sm">
          <span className="font-serif text-[8px] font-bold text-[#E5C158] tracking-widest uppercase">
            AODAI STYLELAB // HAUTE COUTURE
          </span>
          <span className="w-1 h-1 rounded-full bg-[#E5C158]" />
          <span className="font-mono text-[7px] text-white/80">VOL. 2026</span>
        </div>

        {/* Thước đo quang học 2 bên sườn */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 flex flex-col gap-1.5 opacity-75">
          <span className="w-3 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/50" />
          <span className="w-2.5 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/50" />
          <span className="w-3.5 h-[2px] bg-[#D4AF37]" />
        </div>
        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex flex-col items-end gap-1.5 opacity-75">
          <span className="w-3 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/50" />
          <span className="w-2.5 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/50" />
          <span className="w-3.5 h-[2px] bg-[#D4AF37]" />
        </div>

        {/* Mã vạch & Serial lưu trữ bảo tàng thời trang ở cạnh dưới */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2.5 py-0.5 rounded bg-black/55 backdrop-blur-xs border border-white/20">
          <span className="font-mono text-[6.5px] tracking-wider text-white/90">
            HERITAGE ARCHIVE • EDITION N° 0884
          </span>
        </div>
      </div>
    );
  }

  // 3. Cyber Indochine: Vi mạch dạ quang Neon HUD tương lai hòa quyện hoa sen Á Đông
  if (theme === "cyber") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl select-none">
        {/* Viền đôi Neon Cyan phát sáng cực ấn tượng */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-[20px] border-2 border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.6),inset_0_0_12px_rgba(45,212,191,0.3)]" />
        <div className="absolute inset-3.5 sm:inset-4 rounded-[16px] border border-teal-300/40" />

        {/* 4 Góc HUD Vi mạch tương lai với bóng đèn tín hiệu */}
        <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-teal-300">
          <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
          <span className="absolute top-1 left-1 font-mono text-[6px] text-teal-300 font-bold">HUD</span>
        </div>
        <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-teal-300">
          <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
          <span className="absolute top-1 right-1 font-mono text-[6px] text-teal-300 font-bold">2026</span>
        </div>
        <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-teal-300">
          <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
          <span className="absolute bottom-1 left-1 font-mono text-[6px] text-teal-300 font-bold">SYS</span>
        </div>
        <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-teal-300">
          <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
          <span className="absolute bottom-1 right-1 font-mono text-[6px] text-teal-300 font-bold">CYBER</span>
        </div>

        {/* Tọa độ HUD & Nhãn Cyber Indochine */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/80 border border-teal-400/80 shadow-[0_0_10px_rgba(45,212,191,0.4)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-ping" />
          <span className="font-mono text-[7px] text-teal-200 tracking-wider font-bold">
            NEO-HERITAGE // 21°02&apos;N 105°51&apos;E
          </span>
        </div>

        {/* Thanh trạng thái vi mạch bên sườn */}
        <div className="absolute top-1/2 right-2.5 -translate-y-1/2 flex flex-col gap-1">
          <span className="w-1 h-3 rounded-full bg-teal-400 shadow-[0_0_5px_#2dd4bf]" />
          <span className="w-1 h-1.5 rounded-full bg-teal-400/50" />
          <span className="w-1 h-5 rounded-full bg-teal-300 shadow-[0_0_6px_#2dd4bf]" />
          <span className="w-1 h-1.5 rounded-full bg-teal-400/50" />
          <span className="w-1 h-3 rounded-full bg-teal-400 shadow-[0_0_5px_#2dd4bf]" />
        </div>
      </div>
    );
  }

  // 4. Vintage Postal: Tem thư răng cưa hoài niệm & Dấu mộc bưu chính Đông Dương
  if (theme === "vintage") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl select-none">
        {/* Viền răng cưa tem thư cổ điển */}
        <div className="absolute inset-2 sm:inset-2.5 rounded-[20px] border-2 border-dashed border-[#D97706] shadow-[0_0_14px_rgba(217,119,6,0.35)]" />
        <div className="absolute inset-3.5 sm:inset-4 rounded-[16px] border border-[#92400E]/60 bg-[#D97706]/5" />

        {/* 4 Góc đóng ngàm tem thư cổ điển */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#92400E]">
          <span className="absolute top-0.5 left-0.5 text-[8px] text-[#D97706] font-bold">◆</span>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#92400E]">
          <span className="absolute top-0.5 right-0.5 text-[8px] text-[#D97706] font-bold">◆</span>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#92400E]">
          <span className="absolute bottom-0.5 left-0.5 text-[8px] text-[#D97706] font-bold">◆</span>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#92400E]">
          <span className="absolute bottom-0.5 right-0.5 text-[8px] text-[#D97706] font-bold">◆</span>
        </div>

        {/* Dấu mộc tròn bưu chính Đông Dương (Hà Nội - Sài Gòn) ở góc phải */}
        <div className="absolute top-3.5 right-3.5 w-14 h-14 rounded-full border-2 border-[#D97706]/90 flex flex-col items-center justify-center p-1 text-center -rotate-12 bg-black/55 backdrop-blur-xs shadow-xl">
          <span className="font-mono text-[6.5px] tracking-wider text-[#D97706] font-bold uppercase leading-none">
            HÀ NỘI
          </span>
          <span className="font-mono text-[7px] font-extrabold text-[#FDFBF7] tracking-wider my-0.5">
            1924-2026
          </span>
          <span className="font-mono text-[5.5px] text-[#D97706] font-semibold tracking-widest leading-none">
            INDOCHINE
          </span>
          {/* Vạch sóng bưu chính */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 pointer-events-none">
            <span className="w-5 h-[1px] bg-[#D97706]/70" />
            <span className="w-6 h-[1.5px] bg-[#D97706]/90" />
            <span className="w-5 h-[1px] bg-[#D97706]/70" />
          </div>
        </div>

        {/* Nhãn tem thư di sản ở cạnh dưới */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#92400E]/85 border border-[#D97706] shadow-sm">
          <span className="font-serif text-[7.5px] text-[#FDFBF7] tracking-wider font-bold">
            BƯU THIẾP ĐÔNG DƯƠNG • 1924
          </span>
        </div>
      </div>
    );
  }

  // 5. Museum Curator: Sơn mài đen tuyền viền thếp vàng & Biển đồng giám tuyển bảo tàng
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-3xl select-none">
      {/* Khung sơn mài thếp vàng đen bóng sang trọng */}
      <div className="absolute inset-2 sm:inset-2.5 rounded-[20px] border-2 border-[#C5A059] shadow-[0_0_18px_rgba(197,160,89,0.35)]" />
      <div className="absolute inset-3.5 sm:inset-4 rounded-[16px] border border-[#E5C158]/50" />

      {/* 4 Góc mạ đồng đúc cổ vật với đinh tán mỹ thuật */}
      <div className="absolute top-2 left-2 w-7 h-7 border-t-[3px] border-l-[3px] border-[#E5C158] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
      <div className="absolute top-2 right-2 w-7 h-7 border-t-[3px] border-r-[3px] border-[#E5C158] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
      <div className="absolute bottom-2 left-2 w-7 h-7 border-b-[3px] border-l-[3px] border-[#E5C158] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
      <div className="absolute bottom-2 right-2 w-7 h-7 border-b-[3px] border-r-[3px] border-[#E5C158] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>

      {/* Biển đồng giám tuyển cổ vật Viện Bảo Tàng ở cạnh dưới */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-stone-900/90 border border-[#E5C158] shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
        <span className="font-serif text-[7.5px] font-bold text-[#E5C158] tracking-widest uppercase">
          BẢO TÀNG MỸ THUẬT • GIÁM TUYỂN DI SẢN
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
      </div>
    </div>
  );
};

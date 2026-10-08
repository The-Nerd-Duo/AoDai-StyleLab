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
  // 0. Default: Không dùng khung lookbook
  if (theme === "none" || !theme) {
    return null;
  }

  // 1. Royal Imperial: Hoa văn mây cuộn hoàng triều Đại Việt & Viền kép hoàng kim
  if (theme === "royal") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Double inner gold border */}
        <div className="absolute inset-2 sm:inset-2.5 border-2 border-[#C5A059]/80 rounded-2xl shadow-[0_0_10px_rgba(197,160,89,0.25)] pointer-events-none" />
        <div className="absolute inset-3 sm:inset-3.5 border border-[#BA2D27]/60 rounded-xl pointer-events-none" />

        {/* Top-Left Royal Cloud Motif */}
        <svg
          className="absolute top-1.5 left-1.5 w-11 h-11 sm:w-12 sm:h-12 text-[#C5A059] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 24V3H24M3 3C12 3 20 7 24 16C28 25 22 34 13 34C6 34 2 28 3 21C4 14 11 11 17 12C23 13 25 18 22 22C19 25 15 24 15 21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="3" cy="3" r="2.5" fill="#BA2D27" stroke="currentColor" strokeWidth="1" />
          <path d="M7 10C12 10 16 13 18 18" stroke="#BA2D27" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Top-Right Royal Cloud Motif */}
        <svg
          className="absolute top-1.5 right-1.5 w-11 h-11 sm:w-12 sm:h-12 text-[#C5A059] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] scale-x-[-1]"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 24V3H24M3 3C12 3 20 7 24 16C28 25 22 34 13 34C6 34 2 28 3 21C4 14 11 11 17 12C23 13 25 18 22 22C19 25 15 24 15 21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="3" cy="3" r="2.5" fill="#BA2D27" stroke="currentColor" strokeWidth="1" />
          <path d="M7 10C12 10 16 13 18 18" stroke="#BA2D27" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Bottom-Left Royal Cloud Motif */}
        <svg
          className="absolute bottom-1.5 left-1.5 w-11 h-11 sm:w-12 sm:h-12 text-[#C5A059] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] scale-y-[-1]"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 24V3H24M3 3C12 3 20 7 24 16C28 25 22 34 13 34C6 34 2 28 3 21C4 14 11 11 17 12C23 13 25 18 22 22C19 25 15 24 15 21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="3" cy="3" r="2.5" fill="#BA2D27" stroke="currentColor" strokeWidth="1" />
          <path d="M7 10C12 10 16 13 18 18" stroke="#BA2D27" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Bottom-Right Royal Cloud Motif */}
        <svg
          className="absolute bottom-1.5 right-1.5 w-11 h-11 sm:w-12 sm:h-12 text-[#C5A059] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] -scale-100"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 24V3H24M3 3C12 3 20 7 24 16C28 25 22 34 13 34C6 34 2 28 3 21C4 14 11 11 17 12C23 13 25 18 22 22C19 25 15 24 15 21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="3" cy="3" r="2.5" fill="#BA2D27" stroke="currentColor" strokeWidth="1" />
          <path d="M7 10C12 10 16 13 18 18" stroke="#BA2D27" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 2. Editorial: Tạp chí thời trang cao cấp & Crosshair studio
  if (theme === "editorial") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Sleek Editorial Hairline Border */}
        <div className="absolute inset-2 sm:inset-2.5 border-2 border-[#D4AF37]/75 rounded-2xl shadow-[0_0_12px_rgba(212,175,55,0.2)]" />
        <div className="absolute inset-3 sm:inset-3.5 border border-white/20 rounded-xl" />

        {/* 4 Minimalist Studio Corner Crosshairs */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]">
          <span className="absolute -top-1.5 -left-1.5 text-[9px] text-[#D4AF37] font-mono leading-none">+</span>
        </div>
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]">
          <span className="absolute -top-1.5 -right-1.5 text-[9px] text-[#D4AF37] font-mono leading-none">+</span>
        </div>
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]">
          <span className="absolute -bottom-1.5 -left-1.5 text-[9px] text-[#D4AF37] font-mono leading-none">+</span>
        </div>
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]">
          <span className="absolute -bottom-1.5 -right-1.5 text-[9px] text-[#D4AF37] font-mono leading-none">+</span>
        </div>

        {/* Side Measurement Ticks */}
        <div className="absolute top-1/2 left-1.5 -translate-y-1/2 flex flex-col gap-1.5 opacity-80">
          <span className="w-2.5 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/60" />
          <span className="w-3.5 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/60" />
          <span className="w-2.5 h-[1.5px] bg-[#D4AF37]" />
        </div>
        <div className="absolute top-1/2 right-1.5 -translate-y-1/2 flex flex-col gap-1.5 opacity-80">
          <span className="w-2.5 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/60" />
          <span className="w-3.5 h-[1.5px] bg-[#D4AF37]" />
          <span className="w-1.5 h-[1px] bg-white/60" />
          <span className="w-2.5 h-[1.5px] bg-[#D4AF37]" />
        </div>
      </div>
    );
  }

  // 3. Cyber Indochine: Viền phát sáng Neon & HUD Vi mạch tương lai
  if (theme === "cyber") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Glowing Neon Cyan/Teal Double Border */}
        <div className="absolute inset-2 sm:inset-2.5 border-2 border-teal-400 rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.5),inset_0_0_15px_rgba(45,212,191,0.25)]" />
        <div className="absolute inset-3 sm:inset-3.5 border border-teal-400/40 rounded-xl" />

        {/* 4 Futuristic HUD Tech Brackets with Glowing Nodes */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-teal-300">
          <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-teal-300">
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-teal-300">
          <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-teal-300">
          <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_10px_#2dd4bf]" />
        </div>
      </div>
    );
  }

  // 4. Vintage: Viền tem thư răng cưa & Dấu mộc bưu chính Đông Dương
  if (theme === "vintage") {
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Postal Stamp Perforated Dashed Border */}
        <div className="absolute inset-2 sm:inset-2.5 border-2 border-dashed border-[#D97706] rounded-2xl shadow-[0_0_10px_rgba(217,119,6,0.3)]" />
        <div className="absolute inset-3 sm:inset-3.5 border border-[#B45309]/50 rounded-xl" />

        {/* 4 Corner Postal Rosettes */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#92400E]">
          <span className="absolute top-0.5 left-0.5 text-[8px] text-[#D97706]">♦</span>
        </div>
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#92400E]">
          <span className="absolute top-0.5 right-0.5 text-[8px] text-[#D97706]">♦</span>
        </div>
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#92400E]">
          <span className="absolute bottom-0.5 left-0.5 text-[8px] text-[#D97706]">♦</span>
        </div>
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#92400E]">
          <span className="absolute bottom-0.5 right-0.5 text-[8px] text-[#D97706]">♦</span>
        </div>

        {/* Vintage Postal Postmark Seal in Top Right (Non-conflicting) */}
        <div className="absolute top-4 right-4 w-13 h-13 rounded-full border-2 border-[#D97706]/85 flex flex-col items-center justify-center p-1 text-center -rotate-12 bg-black/45 backdrop-blur-xs shadow-xl">
          <span className="font-mono text-[6.5px] tracking-wider text-[#D97706] font-bold uppercase leading-none">
            HÀ NỘI
          </span>
          <span className="font-mono text-[7px] font-extrabold text-[#FDFBF7] tracking-wider my-0.5">
            1924-2026
          </span>
          <span className="font-mono text-[5.5px] text-[#D97706] font-semibold tracking-widest leading-none">
            POSTAGE
          </span>
        </div>
      </div>
    );
  }

  // 5. Museum Curator: Sơn mài đen viền thếp vàng & Góc đồng bảo tàng
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Lacquer Gold Inner Double Border */}
      <div className="absolute inset-2 sm:inset-2.5 border-2 border-[#C5A059] rounded-2xl shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
      <div className="absolute inset-3 sm:inset-3.5 border border-[#C5A059]/40 rounded-xl" />

      {/* 4 Antique Brass Museum Brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-[#E5C158]">
        <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
      <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-[#E5C158]">
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-[#E5C158]">
        <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-[#E5C158]">
        <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-xs" />
      </div>
    </div>
  );
};

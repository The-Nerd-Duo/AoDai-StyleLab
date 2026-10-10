"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, Clock, X, Compass, Palette } from "lucide-react";

interface QuotaLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuotaLimitModal: React.FC<QuotaLimitModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quota-modal-title"
      className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 shadow-2xl border border-border-bronze-light/80 flex flex-col items-center text-center select-none animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Heritage Corner Accents */}
        <div className="absolute top-3.5 left-3.5 w-3 h-3 border-t-2 border-l-2 border-bronze-gold/45 pointer-events-none" />
        <div className="absolute top-3.5 right-3.5 w-3 h-3 border-t-2 border-r-2 border-bronze-gold/45 pointer-events-none" />
        <div className="absolute bottom-3.5 left-3.5 w-3 h-3 border-b-2 border-l-2 border-bronze-gold/45 pointer-events-none" />
        <div className="absolute bottom-3.5 right-3.5 w-3 h-3 border-b-2 border-r-2 border-bronze-gold/45 pointer-events-none" />

        {/* Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-text-warm-gray/60 hover:text-text-charcoal hover:bg-black/5 transition-all cursor-pointer z-10"
          aria-label="Đóng cửa sổ"
          title="Đóng"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Emblem Glowing Icon */}
        <div className="relative mb-3.5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vermilion-red/15 via-amber-500/10 to-bronze-gold/20 border border-vermilion-red/30 flex items-center justify-center text-vermilion-red shadow-inner">
            <Clock className="w-8 h-8 text-vermilion-red stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-bronze-gold text-white flex items-center justify-center shadow-md border border-white">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Demo Version Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vermilion-red/10 border border-vermilion-red/25 text-vermilion-red font-mono text-[10px] font-bold tracking-wider uppercase mb-2">
          <span>Phiên Bản Thử Nghiệm (Demo)</span>
        </div>

        {/* Title */}
        <h3
          id="quota-modal-title"
          className="font-serif text-lg sm:text-xl font-bold text-text-charcoal tracking-tight leading-snug"
        >
          Hạn Mức Tạo Ảnh Đã Đạt Giới Hạn
        </h3>

        {/* Friendly explanation */}
        <p className="text-xs sm:text-[13px] text-text-warm-gray leading-relaxed mt-2.5 max-w-[340px]">
          Hiện tại hệ thống AI đã đạt giới hạn lượt tạo ảnh trong phiên trải nghiệm.
          Vì đây là <strong className="text-text-charcoal font-semibold">phiên bản Demo thử nghiệm</strong>, hạn mức tạo ảnh được thiết lập ở mức vừa phải để đảm bảo tài nguyên phục vụ mọi người.
        </p>

        {/* Reassurance & Encouragement Box */}
        <div className="w-full mt-4 p-3 rounded-2xl bg-[#F4EDE2]/80 border border-border-bronze-light/70 text-left flex items-start gap-2.5">
          <Palette className="w-4 h-4 text-bronze-gold flex-shrink-0 mt-0.5" />
          <div className="text-[11.5px] text-text-charcoal/90 leading-relaxed">
            <p className="font-semibold text-text-charcoal">Xin hãy thử lại sau ít phút!</p>
            <p className="text-text-warm-gray text-[11px] mt-0.5">
              Trong lúc này, bạn vẫn có thể phối đồ, đổi khung trang trí di sản hoặc khám phá các bản phối trong Bộ sưu tập.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2 mt-5">
          <Link
            href="/lookbook"
            onClick={onClose}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-vermilion-red to-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Khám Phá Lookbook</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-surface-pure hover:bg-paper-cream border border-border-bronze-light/70 text-text-charcoal font-semibold text-xs transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

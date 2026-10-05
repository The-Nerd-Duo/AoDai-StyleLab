"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import genealogyData from "@/config/genealogy.json";
import { useOutfitStore } from "@/lib/store";
import {
  Sparkles,
  Palette,
  ChevronRight,
  Scroll,
  Layers,
} from "lucide-react";

// Mapping between genealogy studio_garment_id and mockups.json garments ID
const STUDIO_GARMENT_MAP: Record<string, string> = {
  "giao-linh": "ao-giao-linh",
  "lap-linh": "ao-lap-linh",
  "ngu-than": "ao-ngu-than-tay-chen",
  "nhat-binh": "ao-nhat-binh",
  "ao-dai": "ao-dai-cach-tan",
};

const PATTERN_LABELS: Record<string, string> = {
  "chim-lac": "🪶 Chim Lạc",
  "hoa-sen": "🪷 Hoa Sen",
  "may-rong": "🐉 Mây Rồng",
  "cuc-gam": "🌼 Cúc Gấm",
  "chuc-tho": "✨ Chữ Thọ",
  "phuong-mua": "🦚 Phượng Múa",
  "ngu-sac": "🌈 Ngũ Sắc",
  "cyber-pattern": "⚡ Cyber Remix",
  "thuy-ba": "🌊 Thủy Ba",
  "may-tan": "☁️ Mây Tản",
};

export interface GarmentGenealogyItem {
  id: string;
  era: string;
  dynasty: string;
  name: string;
  category: string;
  image: string;
  summary: string;
  origin: string;
  symbolism: string;
  related_patterns: string[];
  studio_garment_id: string;
  ai_prompt_hint: string;
}

interface GarmentGenealogyProps {
  onAskAi: (promptHint: string) => void;
  onSelectPattern: (patternId: string) => void;
}

export const GarmentGenealogy: React.FC<GarmentGenealogyProps> = ({
  onAskAi,
  onSelectPattern,
}) => {
  const router = useRouter();
  const { updateOutfitField } = useOutfitStore();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleTryInStudio = (studioGarmentId: string) => {
    const targetId = STUDIO_GARMENT_MAP[studioGarmentId] || studioGarmentId;
    if (updateOutfitField) {
      updateOutfitField("garmentId", targetId);
    }
    router.push(`/?g=${encodeURIComponent(targetId)}`);
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-bronze-gold font-bold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[17px]">account_tree</span>
            <span>Tiến trình Di sản Nghìn năm</span>
          </div>
          <h2 className="font-serif font-bold text-lg sm:text-xl text-text-charcoal tracking-tight">
            Niên biểu Cổ phục Việt Nam
          </h2>
          <p className="text-xs text-text-warm-gray leading-relaxed max-w-2xl">
            Tổng quan 5 mốc tiến hóa trang phục từ thời Lý – Trần đến các bản phối Gen Z đương đại.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-bronze-gold bg-paper-cream px-3 py-1 rounded-full border border-border-bronze-light/60 shadow-2xs self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-vermilion-red animate-pulse" />
          <span>Thế kỷ XI — Thế kỷ XXI</span>
        </div>
      </div>

      {/* Timeline Container with Dashed Axis - Compact spacing */}
      <div className="relative pl-5 sm:pl-8 ml-2 sm:ml-4 border-l-2 border-dashed border-[#E5D5B5] space-y-4 sm:space-y-5 py-1">
        {(genealogyData as GarmentGenealogyItem[]).map((item, index) => {
          const hasImageError = imageErrors[item.id];

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Node Marker on the Axis */}
              <div className="absolute -left-[31px] sm:-left-[43px] top-3.5 w-6 h-6 rounded-full bg-surface-pure border-2 border-bronze-gold flex items-center justify-center shadow-2xs group-hover:scale-110 group-hover:border-vermilion-red transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-vermilion-red" />
              </div>

              {/* Timeline Card: Thu gọn chiều cao tối đa, bố cục linh hoạt */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-border-bronze-light/60 p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-3.5 sm:gap-4 items-stretch">
                {/* 1. Ảnh Phác Họa: Giới hạn chiều rộng cố định, tỉ lệ gọn gàng */}
                <div className="w-full md:w-52 lg:w-60 shrink-0">
                  <div className="relative aspect-[16/10] md:h-full w-full rounded-xl overflow-hidden bg-paper-cream border border-border-bronze-light/50 group/img shadow-inner min-h-[140px]">
                    {!hasImageError ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={() => handleImageError(item.id)}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Fallback Canvas Mỹ thuật Di sản */
                      <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-[#221f1d] via-[#1a1817] to-[#121110] relative select-none">
                        <div className="absolute inset-0 opacity-20 blur-xl bg-vermilion-red pointer-events-none" />
                        <div className="flex items-center justify-between text-[9px] font-mono text-bronze-gold relative z-10">
                          <span>{item.dynasty}</span>
                          <span>HERITAGE</span>
                        </div>
                        <div className="my-auto text-center relative z-10">
                          <Layers className="w-6 h-6 text-bronze-gold/80 mx-auto mb-1" />
                          <span className="font-serif text-xs font-bold text-paper-cream block">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[8px] text-white/50 text-center font-mono relative z-10">
                          AoDai StyleLab Archive
                        </span>
                      </div>
                    )}

                    {/* Small watermark tag */}
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs rounded text-[9px] font-mono text-white/90">
                      {item.era}
                    </div>
                  </div>
                </div>

                {/* 2. Khung Nội dung: Tinh gọn, hiển thị song song */}
                <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                  {/* Header: Era + Title + Category */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-0.5">
                      <span className="text-[11px] font-bold text-[#D93829] tracking-wider uppercase font-sans">
                        {item.era} • {item.dynasty}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bronze-gold/15 text-stone-800 text-[10px] font-semibold border border-bronze-gold/30">
                        <Scroll className="w-2.5 h-2.5 text-bronze-gold" />
                        <span>{item.category}</span>
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-base sm:text-lg text-text-charcoal tracking-tight leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-text-warm-gray leading-relaxed mt-0.5 line-clamp-1 sm:line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  {/* Narrative Boxes: Xếp 2 cột ngang song song thay vì xếp dọc */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 sm:p-2.5 bg-paper-cream/70 rounded-xl border border-border-bronze-light/40 space-y-0.5">
                      <span className="font-bold text-vermilion-red uppercase text-[9px] tracking-wider block">
                        📜 Nguồn gốc & Bối cảnh
                      </span>
                      <p className="text-text-charcoal leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {item.origin}
                      </p>
                    </div>

                    <div className="p-2 sm:p-2.5 bg-paper-cream/70 rounded-xl border border-border-bronze-light/40 space-y-0.5">
                      <span className="font-bold text-bronze-gold uppercase text-[9px] tracking-wider block">
                        🪷 Triết lý & Ý nghĩa
                      </span>
                      <p className="text-text-charcoal leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {item.symbolism}
                      </p>
                    </div>
                  </div>

                  {/* Footer Row: Dải Hoa văn + Action Buttons */}
                  <div className="pt-2 border-t border-border-bronze-light/35 flex flex-wrap items-center justify-between gap-2">
                    {/* Pattern Badges */}
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-bronze-gold font-bold uppercase tracking-wider mr-0.5">
                        Hoa văn:
                      </span>
                      {item.related_patterns.map((pId) => {
                        const label = PATTERN_LABELS[pId] || pId;
                        return (
                          <button
                            key={pId}
                            type="button"
                            onClick={() => onSelectPattern(pId)}
                            className="px-2 py-0.5 rounded-full bg-surface-pure hover:bg-vermilion-red/10 text-text-charcoal hover:text-vermilion-red text-[10px] font-medium border border-border-bronze-light transition-colors shadow-2xs flex items-center gap-0.5 group/chip"
                            title={`Xem giải mã hoa văn '${label}'`}
                          >
                            <span>{label}</span>
                            <ChevronRight className="w-2.5 h-2.5 text-bronze-gold group-hover/chip:translate-x-0.5 transition-transform" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        type="button"
                        onClick={() => handleTryInStudio(item.studio_garment_id)}
                        className="py-1.5 px-3 rounded-lg bg-vermilion-red hover:bg-primary text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                      >
                        <Palette className="w-3 h-3 text-paper-cream" />
                        <span>Thử phối</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onAskAi(item.ai_prompt_hint)}
                        className="py-1.5 px-3 rounded-lg bg-paper-cream hover:bg-bronze-gold/20 text-stone-800 border border-bronze-gold/40 font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all active:scale-95"
                      >
                        <Sparkles className="w-3 h-3 text-bronze-gold" />
                        <span>Hỏi AI</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

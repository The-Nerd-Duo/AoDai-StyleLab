"use client";

import React, { useState } from "react";
import genealogyData from "@/config/genealogy.json";
import { History, Milestone, ChevronRight } from "lucide-react";

export const GarmentGenealogy: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(genealogyData.length - 1);
  const current = genealogyData[selectedIdx];

  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-heritage-gold" />
          <h2 className="text-base font-bold text-white">
            Gia Phả Việt Phục • Dòng Thời Gian Tiến Hóa
          </h2>
        </div>
        <span className="text-[11px] text-gray-400">1000 Năm Di Sản</span>
      </div>

      {/* Horizontal Timeline Scroll Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-heritage-dark-border">
        {genealogyData.map((item, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-left border transition-all ${
                isSelected
                  ? "bg-heritage-gold/20 border-heritage-gold text-white shadow-md shadow-heritage-gold/20"
                  : "bg-heritage-dark/60 border-heritage-dark-border text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <span className="text-[10px] text-heritage-gold font-bold block">
                {item.period}
              </span>
              <span className="text-xs font-semibold block truncate max-w-[130px]">
                {item.dynasty}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Era Spotlight Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-heritage-dark to-[#131722] border border-heritage-gold/30 relative overflow-hidden shadow-xl">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-bold text-heritage-gold uppercase tracking-wider">
              {current.period} • {current.dynasty}
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-0.5">
              {current.title}
            </h3>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-heritage-gold/15 text-heritage-gold border border-heritage-gold/30 text-[10px] font-bold">
            {current.keyGarment}
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          {current.description}
        </p>

        <div className="p-3 rounded-xl bg-heritage-dark/80 border border-white/10 flex items-start gap-2 text-xs">
          <Milestone className="w-4 h-4 text-heritage-gold flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Dấu mốc vàng son: </span>
            <span className="text-amber-200/90">{current.highlight}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

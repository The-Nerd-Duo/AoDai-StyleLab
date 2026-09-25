"use client";

import React, { useState } from "react";
import patternsData from "@/config/patterns.json";
import { Compass, Sparkles, Check } from "lucide-react";

export const PatternDecoder: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState(patternsData[0]);

  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-heritage-gold" />
          <h2 className="text-base font-bold text-white">
            Giải Mã Hoa Văn & Họa Tiết Cổ Truyền
          </h2>
        </div>
        <span className="text-[11px] text-gray-400">Cultural Decoder</span>
      </div>

      {/* Pattern Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {patternsData.map((p) => {
          const isSelected = selectedPattern.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPattern(p)}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-teal-500/15 border-teal-400 shadow-sm"
                  : "bg-heritage-dark/60 border-heritage-dark-border text-gray-400 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              <span className="text-xs font-bold text-white block truncate mb-1">
                {p.name}
              </span>
              <span className="text-[10px] text-teal-300 block">
                {p.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Decoder Output Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-heritage-dark border border-heritage-dark-border flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {selectedPattern.name}
            </h3>
            <span className="text-[11px] text-heritage-gold font-medium">
              Niên đại: {selectedPattern.dynasty} • Chủ đề: {selectedPattern.category}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="text-xs space-y-2">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="font-semibold text-gray-200 block mb-1">
              Ý nghĩa biểu tượng & Triết lý:
            </span>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              {selectedPattern.symbolism}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="font-semibold text-gray-200 block mb-1">
              Ứng dụng trên Việt phục:
            </span>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              {selectedPattern.usage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

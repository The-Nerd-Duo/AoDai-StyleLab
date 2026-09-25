"use client";

import React from "react";
import framesData from "@/config/frames.json";
import { Sparkles, Check } from "lucide-react";

interface FrameSelectorProps {
  selectedFrameId: string;
  onSelectFrame: (id: string) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrameId,
  onSelectFrame,
}) => {
  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-heritage-gold" />
          <h3 className="text-sm font-bold text-white">Chọn Mẫu Khung Lookbook 9:16</h3>
        </div>
        <span className="text-[11px] text-gray-400">Pre-designed Frames</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {framesData.map((f) => {
          const isSelected = selectedFrameId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFrame(f.id)}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between relative ${
                isSelected
                  ? "bg-heritage-gold/15 border-heritage-gold shadow-md shadow-heritage-gold/20"
                  : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-white leading-tight">
                  {f.name}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-heritage-gold text-heritage-dark flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">
                {f.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

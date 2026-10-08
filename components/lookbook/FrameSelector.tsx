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
    <div className="bg-surface-pure rounded-2xl p-4 sm:p-5 shadow-sm border border-border-bronze-light/60 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-border-bronze-light/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-vermilion-red" />
          <h3 className="text-sm font-bold text-text-charcoal font-serif">
            Khung Viền Di Sản &amp; Tạp Chí 9:16
          </h3>
        </div>
        <span className="text-[11px] text-text-warm-gray font-mono">{framesData.length} phong cách độc bản</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {framesData.map((f) => {
          const isSelected = selectedFrameId === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFrame(f.id)}
              className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-sm ring-1 ring-vermilion-red/30"
                  : "bg-paper-cream hover:bg-surface-container border-border-bronze-light/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs flex-shrink-0"
                      style={{ backgroundColor: f.borderColor !== "transparent" ? f.borderColor : "#D1D5DB" }}
                    />
                    <span className="text-xs font-bold text-text-charcoal leading-tight">
                      {f.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-vermilion-red text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-warm-gray line-clamp-2 mt-1 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border-bronze-light/40 flex items-center justify-between text-[10px] font-mono text-bronze-gold">
                <span className="uppercase font-semibold tracking-wider">
                  {f.theme === "none" ? "Không Khung" : f.theme}
                </span>
                <span className="text-text-warm-gray/80">9:16 Editorial</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

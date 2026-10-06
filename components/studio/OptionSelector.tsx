"use client";

import React, { useState } from "react";
import { OutfitState } from "@/lib/utils";
import {
  generateOutfitPrompt,
  getOutfitPromptBreakdown,
} from "@/lib/ai-prompt";
import {
  Shirt,
  Palette,
  Calendar,
  Sparkles,
  Glasses,
  Flame,
  Copy,
  ArrowLeft,
  User,
} from "lucide-react";
import { StackedDeckCarousel } from "./StackedDeckCarousel";
import { PersonaSelector } from "./PersonaSelector";

interface OptionSelectorProps {
  outfit: OutfitState;
  onChange: <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => void;
  customAvatarUrl?: string | null;
  onUploadCustomAvatar?: (dataUrl: string) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  outfit,
  onChange,
  customAvatarUrl,
  onUploadCustomAvatar,
}) => {
  const [isPersonaConfirmed, setIsPersonaConfirmed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "garment" | "color" | "occasion" | "style" | "accessory"
  >("garment");
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: "garment", label: "Cổ Phục", icon: Shirt },
    { id: "color", label: "Màu Sắc", icon: Palette },
    { id: "accessory", label: "Phụ Kiện", icon: Glasses },
    { id: "occasion", label: "Bối Cảnh", icon: Calendar },
    { id: "style", label: "Phong Cách", icon: Flame },
  ];

  const breakdown = getOutfitPromptBreakdown(outfit);

  return (
    <aside className="w-full flex flex-col gap-4 bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60">
      {/* Title Header */}
      <div className="border-b border-border-bronze-light/40 pb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-vermilion-red text-[20px]">
              hub
            </span>
            <h2 className="font-serif text-base font-bold text-text-charcoal">
              Studio Mix &amp; Match
            </h2>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-paper-cream border border-border-bronze-light/60 text-bronze-gold font-bold">
            {!isPersonaConfirmed ? "Bước 1: Chọn Nhân Vật" : "Bước 2: Phối Cổ Phục"}
          </span>
        </div>
      </div>

      {/* GIAI ĐOẠN 1: CHỌN NHÂN VẬT ĐẠI DIỆN (VUỐT NGANG NAM/NỮ) */}
      {!isPersonaConfirmed ? (
        <div className="animate-fadeIn">
          <PersonaSelector
            selectedPersonaId={outfit.personaId || "female-modern"}
            onSelectPersona={(id) => onChange("personaId", id)}
            customAvatarUrl={customAvatarUrl}
            onUploadCustomAvatar={onUploadCustomAvatar}
            onConfirm={() => setIsPersonaConfirmed(true)}
          />
        </div>
      ) : (
        /* GIAI ĐOẠN 2: PHỐI CỔ PHỤC & MÀU SẮC */
        <div className="flex flex-col gap-4 animate-fadeIn">
          {/* Top Bar with "Quay lại chọn nhân vật" button & active persona status */}
          <div className="bg-paper-cream/90 p-2.5 rounded-xl border border-border-bronze-light/60 flex items-center justify-between gap-2 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPersonaConfirmed(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-pure hover:bg-paper-cream border border-border-bronze-light/70 text-xs font-bold text-text-charcoal hover:text-vermilion-red transition-all shadow-2xs active:scale-95 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-vermilion-red group-hover:-translate-x-0.5 transition-transform" />
              <span>Quay lại chọn nhân vật</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-pure border border-border-bronze-light/50 text-[11px] font-bold text-text-charcoal">
              <User className="w-3 h-3 text-vermilion-red" />
              <span>
                {outfit.personaId === "female-modern"
                  ? "Nhân vật: Nữ"
                  : "Nhân vật: Nam"}
              </span>
              {customAvatarUrl && (
                <span className="text-[10px] text-bronze-gold font-bold">
                  (+Ảnh riêng)
                </span>
              )}
            </div>
          </div>

          {/* Category Navigation - 5 Options Grid */}
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5 p-1 bg-paper-cream/70 rounded-xl border border-border-bronze-light/50">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex flex-col items-center justify-center py-2 px-0.5 sm:px-1 rounded-lg text-center transition-all duration-150 active:scale-95 active:translate-y-0.5 ${
                    isActive
                      ? "bg-vermilion-red text-white shadow-xs font-bold"
                      : "text-text-warm-gray hover:text-text-charcoal hover:bg-surface-pure font-medium"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1 shrink-0" />
                  <span className="text-[10px] sm:text-xs leading-tight font-semibold">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3D Depth Card Deck with Horizontal Swipe */}
          <StackedDeckCarousel
            category={activeCategory}
            outfit={outfit}
            onChange={onChange}
          />

          {/* Full Prompt Preview Footer */}
          <div className="pt-2 border-t border-border-bronze-light/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-charcoal flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-bronze-gold" />
                Prompt AI FLUX (Tự động đồng bộ):
              </span>
              <button
                type="button"
                onClick={() => {
                  const fullPrompt = generateOutfitPrompt(outfit);
                  navigator.clipboard.writeText(fullPrompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-[10px] text-vermilion-red hover:underline font-semibold"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? "Đã sao chép!" : "Sao chép"}</span>
              </button>
            </div>

            {/* Chips showing active choices including persona */}
            <div className="flex flex-wrap gap-1 text-[9px]">
              <span className="px-2 py-0.5 rounded-lg bg-vermilion-red/10 text-vermilion-red border border-vermilion-red/25 font-bold truncate">
                👤 {outfit.personaId === "female-modern" ? "Nữ" : "Nam"}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-bronze-gold/15 text-stone-800 border border-bronze-gold/30 font-medium truncate max-w-[120px]">
                👘 {breakdown.garmentName}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-vermilion-red/10 text-vermilion-red border border-vermilion-red/20 font-medium truncate">
                🎨 {breakdown.colorName}
              </span>
              {breakdown.accessoryPrompt ? (
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-500/20 font-medium truncate">
                  👓 {breakdown.accessoryName}
                </span>
              ) : null}
              <span className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-800 border border-sky-500/20 font-medium truncate">
                📍 {breakdown.occasionName}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-guardrail-pass-surface text-guardrail-pass border border-guardrail-pass/30 font-medium truncate">
                ⚡ {breakdown.styleName}
              </span>
            </div>

            {/* Full prompt string text box */}
            <p className="text-[10px] text-text-warm-gray font-mono bg-paper-cream p-2 rounded-xl border border-border-bronze-light/50 leading-relaxed max-h-16 overflow-y-auto select-all">
              {breakdown.fullPrompt}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

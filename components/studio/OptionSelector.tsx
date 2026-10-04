"use client";

import React, { useState, useRef } from "react";
import mockupsData from "@/config/mockups.json";
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
  Check,
  Flame,
  Copy,
  User,
  Upload,
} from "lucide-react";
import { StackedDeckCarousel } from "./StackedDeckCarousel";


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
  const [activeCategory, setActiveCategory] = useState<"garment" | "color" | "occasion" | "style" | "accessory">("garment");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadCustomAvatar) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onUploadCustomAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
        </div>
      </div>

      {/* KHỐI NHÂN VẬT ĐẠI DIỆN (PERSONA) CỐ ĐỊNH Ở ĐẦU */}
      <div className="bg-paper-cream p-3 rounded-xl border border-border-bronze-light/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-vermilion-red" />
            <span className="font-serif text-xs font-bold text-text-charcoal">
              Nhân Vật Đại Diện (Persona)
            </span>
          </div>
          <span className="text-[10px] font-mono text-bronze-gold font-bold">
            2 Giới Tính &amp; Face Upload
          </span>
        </div>

        {/* 2 Options: Nữ & Nam */}
        <div className="grid grid-cols-2 gap-2">
          {mockupsData.personas.map((p) => {
            const isSelected = outfit.personaId === p.id && !customAvatarUrl;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (onUploadCustomAvatar) onUploadCustomAvatar("");
                  onChange("personaId", p.id);
                }}
                className={`py-2 px-3 rounded-xl text-left border transition-all duration-150 relative flex items-center justify-between active:scale-95 active:translate-y-0.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs ring-1 ring-vermilion-red/30"
                    : "bg-surface-pure border-border-bronze-light/50 hover:bg-paper-cream text-text-charcoal"
                }`}
              >
                <span className="text-xs font-bold text-text-charcoal">{p.name}</span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-vermilion-red text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Upload Custom User Avatar */}
        <div className="pt-2 border-t border-border-bronze-light/40 flex items-center justify-between gap-2">
          <div className="text-[11px] text-text-warm-gray flex items-center gap-1.5 truncate">
            <Upload className="w-3.5 h-3.5 text-bronze-gold flex-shrink-0" />
            <span className="truncate">Hoặc tải ảnh khuôn mặt cá nhân:</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all duration-150 shadow-2xs whitespace-nowrap active:scale-95 active:translate-y-0.5 ${
              customAvatarUrl
                ? "bg-guardrail-pass-surface border-guardrail-pass/40 text-guardrail-pass"
                : "border-border-bronze-light/60 bg-surface-pure text-text-charcoal hover:bg-paper-cream"
            }`}
          >
            {customAvatarUrl ? "✓ Đã tải ảnh riêng" : "Tải ảnh lên"}
          </button>
        </div>
      </div>

      {/* Category Navigation - 5 Options Grid (No horizontal scrolling) */}
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

        {/* 5 Chips showing each active choice */}
        <div className="flex flex-wrap gap-1 text-[9px]">
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
    </aside>
  );
};

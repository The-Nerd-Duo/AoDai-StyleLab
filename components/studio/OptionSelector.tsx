"use client";

import React, { useState } from "react";
import { OutfitState } from "@/lib/utils";
import { getOutfitPromptBreakdown } from "@/lib/ai-prompt";
import {
  Shirt,
  Palette,
  Calendar,
  Glasses,
  Flame,
  ArrowLeft,
  User,
} from "lucide-react";
import { StackedDeckCarousel } from "./StackedDeckCarousel";
import { PersonaSelector } from "./PersonaSelector";

interface OptionSelectorProps {
  outfit: OutfitState;
  onChange: <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => void;
  isPersonaConfirmed?: boolean;
  setIsPersonaConfirmed?: (val: boolean) => void;
  chosenCategories?: Set<string>;
  setChosenCategories?: React.Dispatch<React.SetStateAction<Set<string>>>;
  activeCategory?: "garment" | "color" | "occasion" | "style" | "accessory";
  setActiveCategory?: (cat: "garment" | "color" | "occasion" | "style" | "accessory") => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  outfit,
  onChange,
  isPersonaConfirmed: propIsPersonaConfirmed,
  setIsPersonaConfirmed: propSetIsPersonaConfirmed,
  chosenCategories: propChosenCategories,
  setChosenCategories: propSetChosenCategories,
  activeCategory: propActiveCategory,
  setActiveCategory: propSetActiveCategory,
}) => {
  const [internalPersonaConfirmed, setInternalPersonaConfirmed] = useState(false);
  const [internalChosenCategories, setInternalChosenCategories] = useState<Set<string>>(() => new Set());
  const [internalActiveCategory, setInternalActiveCategory] = useState<
    "garment" | "color" | "occasion" | "style" | "accessory"
  >("garment");

  const isPersonaConfirmed =
    propIsPersonaConfirmed !== undefined ? propIsPersonaConfirmed : internalPersonaConfirmed;
  const setIsPersonaConfirmed = propSetIsPersonaConfirmed || setInternalPersonaConfirmed;

  const chosenCategories =
    propChosenCategories !== undefined ? propChosenCategories : internalChosenCategories;
  const setChosenCategories = propSetChosenCategories || setInternalChosenCategories;

  const activeCategory =
    propActiveCategory !== undefined ? propActiveCategory : internalActiveCategory;
  const setActiveCategory = propSetActiveCategory || setInternalActiveCategory;

  const categories = [
    { id: "garment", label: "Cổ Phục", icon: Shirt },
    { id: "color", label: "Màu Sắc", icon: Palette },
    { id: "accessory", label: "Phụ Kiện", icon: Glasses },
    { id: "occasion", label: "Bối Cảnh", icon: Calendar },
    { id: "style", label: "Phong Cách", icon: Flame },
  ];

  const breakdown = getOutfitPromptBreakdown(outfit);

  const handleOptionChange = <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => {
    setChosenCategories((prev) => {
      const next = new Set(prev);
      next.add(key as string);
      if (key === "accessoryId" || key === "accessoryIds") {
        next.add("accessory");
      }
      return next;
    });
    onChange(key, value);
  };

  const hasAnySelected =
    (chosenCategories.has("personaId")) ||
    (chosenCategories.has("garmentId")) ||
    (chosenCategories.has("colorId")) ||
    (chosenCategories.has("occasionId")) ||
    (chosenCategories.has("styleId")) ||
    (chosenCategories.has("accessory") || chosenCategories.has("accessoryIds"));

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
          {!isPersonaConfirmed && (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-paper-cream border border-border-bronze-light/60 text-bronze-gold font-bold">
              Chọn Nhân Vật
            </span>
          )}
        </div>
      </div>

      {/* GIAI ĐOẠN 1: CHỌN NHÂN VẬT ĐẠI DIỆN (VUỐT NGANG NAM/NỮ) */}
      {!isPersonaConfirmed ? (
        <div className="animate-fadeIn">
          <PersonaSelector
            selectedPersonaId={outfit.personaId || "female-modern"}
            onSelectPersona={(id) => {
              onChange("personaId", id);
              setChosenCategories((prev) => new Set(prev).add("personaId"));
            }}
            onConfirm={() => {
              setIsPersonaConfirmed(true);
              setChosenCategories((prev) => new Set(prev).add("personaId"));
            }}
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

          {/* Active Selection Chips - Nằm giữa thanh chọn 5 mục và phần Cổ phục giám tuyển */}
          {hasAnySelected && (
            <div className="flex flex-wrap gap-1 text-[9px] p-2 bg-paper-cream/60 rounded-xl border border-border-bronze-light/50 items-center animate-fadeIn">
              {chosenCategories.has("personaId") && (
                <span className="px-2 py-0.5 rounded-lg bg-vermilion-red/10 text-vermilion-red border border-vermilion-red/25 font-bold truncate">
                  👤 {outfit.personaId === "female-modern" ? "Nữ" : "Nam"}
                </span>
              )}
              {chosenCategories.has("garmentId") && (
                <span className="px-2 py-0.5 rounded-lg bg-bronze-gold/15 text-stone-800 border border-bronze-gold/30 font-medium truncate max-w-[130px]">
                  👘 {breakdown.garmentName}
                </span>
              )}
              {chosenCategories.has("colorId") && (
                <span className="px-2 py-0.5 rounded-lg bg-vermilion-red/10 text-vermilion-red border border-vermilion-red/20 font-medium truncate">
                  🎨 {breakdown.colorName}
                </span>
              )}
              {(chosenCategories.has("accessory") || chosenCategories.has("accessoryIds")) &&
                breakdown.accessoryPrompt && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-500/20 font-medium truncate">
                    👓 {breakdown.accessoryName}
                  </span>
                )}
              {chosenCategories.has("occasionId") && (
                <span className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-800 border border-sky-500/20 font-medium truncate">
                  📍 {breakdown.occasionName}
                </span>
              )}
              {chosenCategories.has("styleId") && (
                <span className="px-2 py-0.5 rounded-lg bg-guardrail-pass-surface text-guardrail-pass border border-guardrail-pass/30 font-medium truncate">
                  ⚡ {breakdown.styleName}
                </span>
              )}
            </div>
          )}

          {/* 3D Depth Card Deck with Horizontal Swipe */}
          <StackedDeckCarousel
            category={activeCategory}
            outfit={outfit}
            onChange={handleOptionChange}
            chosenCategories={chosenCategories}
          />
        </div>
      )}
    </aside>
  );
};

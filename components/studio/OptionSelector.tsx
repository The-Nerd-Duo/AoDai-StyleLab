"use client";

import React, { useState } from "react";
import mockupsData from "@/config/mockups.json";
import { OutfitState } from "@/lib/utils";
import {
  generateOutfitPrompt,
  getOutfitPromptBreakdown,
  GARMENT_PROMPT_MAP,
  COLOR_PROMPT_MAP,
  OCCASION_PROMPT_MAP,
  STYLE_BACKGROUND_MAP,
  ACCESSORY_PROMPT_MAP,
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
} from "lucide-react";

interface OptionSelectorProps {
  outfit: OutfitState;
  onChange: <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ outfit, onChange }) => {
  const [activeCategory, setActiveCategory] = useState<"garment" | "color" | "occasion" | "style" | "accessory">("garment");
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: "garment", label: "Trang Phục", icon: Shirt },
    { id: "color", label: "Màu & Ngũ Hành", icon: Palette },
    { id: "occasion", label: "Bối Cảnh / Dịp", icon: Calendar },
    { id: "style", label: "Phong Cách Gen Z", icon: Flame },
    { id: "accessory", label: "Phụ Kiện", icon: Glasses },
  ];

  const breakdown = getOutfitPromptBreakdown(outfit);

  // Lấy đoạn prompt tương ứng với tab đang chọn để người dùng thấy rõ
  const getActiveTabPromptSnippet = () => {
    switch (activeCategory) {
      case "garment":
        return {
          label: "Trang phục",
          name: breakdown.garmentName,
          english: GARMENT_PROMPT_MAP[outfit.garmentId] || outfit.garmentId,
        };
      case "color":
        return {
          label: "Màu sắc",
          name: breakdown.colorName,
          english: COLOR_PROMPT_MAP[outfit.colorId] || outfit.colorId,
        };
      case "occasion":
        return {
          label: "Bối cảnh / Dịp",
          name: breakdown.occasionName,
          english: OCCASION_PROMPT_MAP[outfit.occasionId] || outfit.occasionId,
        };
      case "style":
        return {
          label: "Phong cách",
          name: breakdown.styleName,
          english: STYLE_BACKGROUND_MAP[outfit.styleId]?.styleDesc || outfit.styleId,
        };
      case "accessory":
        return {
          label: "Phụ kiện",
          name: breakdown.accessoryName,
          english: ACCESSORY_PROMPT_MAP[outfit.accessoryId] || "none",
        };
      default:
        return { label: "", name: "", english: "" };
    }
  };

  const currentTabInfo = getActiveTabPromptSnippet();

  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-heritage-dark-border">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-heritage-red text-white shadow-md shadow-heritage-red/30"
                  : "bg-heritage-dark text-gray-400 hover:text-gray-200 hover:bg-heritage-dark-hover"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Real-time sync banner: Báo từ khóa tab đang chọn được thêm vào Prompt AI */}
      <div className="bg-black/40 border border-heritage-gold/20 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-heritage-gold animate-pulse flex-shrink-0" />
          <span className="text-gray-300 font-medium">
            Đang đồng bộ <strong className="text-white">[{currentTabInfo.label}]</strong>:
          </span>
          <span className="px-2 py-0.5 rounded-md bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30 font-semibold text-[11px]">
            {currentTabInfo.name}
          </span>
        </div>
        <div className="text-[11px] text-amber-300/90 font-mono truncate max-w-sm">
          + prompt: &quot;{currentTabInfo.english}&quot;
        </div>
      </div>

      {/* Category 1: Garment */}
      {activeCategory === "garment" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Chọn nhóm trang phục truyền thống:</span>
            <span className="text-[11px] text-heritage-gold">{mockupsData.garments.length} mẫu thiết kế</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mockupsData.garments.map((g) => {
              const isSelected = outfit.garmentId === g.id;
              const promptKeyword = GARMENT_PROMPT_MAP[g.id] || "";
              return (
                <button
                  key={g.id}
                  onClick={() => onChange("garmentId", g.id)}
                  className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between gap-2 ${
                    isSelected
                      ? "bg-heritage-red/10 border-heritage-red shadow-sm shadow-heritage-red/20 ring-1 ring-heritage-red/40"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600 text-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        {g.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-heritage-red-light stroke-[3]" />}
                      </div>
                      <span className="text-[10px] text-heritage-gold font-medium">{g.dynasty}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                      {g.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{g.description}</p>
                  
                  {/* Prompt FLUX tag */}
                  <div className="pt-1 border-t border-white/5 flex items-center gap-1 text-[9px] text-gray-400 font-mono truncate">
                    <span className="text-heritage-gold font-semibold">AI FLUX:</span>
                    <span className="truncate">{promptKeyword}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category 2: Color & Wu Xing */}
      {activeCategory === "color" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Chọn sắc màu Di sản & Ngũ Hành:</span>
            <span className="text-[11px] text-heritage-gold">Triết lý Ngũ Sắc Á Đông</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mockupsData.colors.map((c) => {
              const isSelected = outfit.colorId === c.id;
              const promptKeyword = COLOR_PROMPT_MAP[c.id] || "";
              return (
                <button
                  key={c.id}
                  onClick={() => onChange("colorId", c.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? "bg-white/10 border-heritage-gold shadow-md ring-1 ring-heritage-gold/50"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 shadow-inner border border-white/20 flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 stroke-[3] ${c.id === "white-ngoc-trai" ? "text-gray-900" : "text-white"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-heritage-gold/15 text-heritage-gold font-semibold border border-heritage-gold/30">
                          Hành {c.element}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.meaning}</p>
                    </div>
                  </div>

                  {/* Prompt FLUX tag */}
                  <div className="pt-1 border-t border-white/5 flex items-center gap-1 text-[9px] text-gray-400 font-mono truncate">
                    <span className="text-amber-400 font-semibold">+ Màu AI:</span>
                    <span className="truncate">{promptKeyword}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category 3: Occasion */}
      {activeCategory === "occasion" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Chọn hoàn cảnh & không gian xuất hiện:</span>
            <span className="text-[11px] text-heritage-gold">Phù hợp nghi lễ & bối cảnh</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mockupsData.occasions.map((o) => {
              const isSelected = outfit.occasionId === o.id;
              const promptKeyword = OCCASION_PROMPT_MAP[o.id] || "";
              return (
                <button
                  key={o.id}
                  onClick={() => onChange("occasionId", o.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? "bg-heritage-indigo/30 border-heritage-gold shadow-sm ring-1 ring-heritage-gold/40"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{o.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                      {o.formalityLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{o.weatherHint}</p>
                  
                  {/* Prompt FLUX tag */}
                  <div className="pt-1 border-t border-white/5 flex items-center gap-1 text-[9px] text-gray-400 font-mono truncate">
                    <span className="text-emerald-400 font-semibold">+ Bối cảnh AI:</span>
                    <span className="truncate">{promptKeyword}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category 4: Gen Z Style */}
      {activeCategory === "style" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Chọn tinh thần thời trang Gen Z:</span>
            <span className="text-[11px] text-heritage-gold">Remix cá tính</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mockupsData.styles.map((s) => {
              const isSelected = outfit.styleId === s.id;
              const styleDesc = STYLE_BACKGROUND_MAP[s.id]?.styleDesc || "";
              return (
                <button
                  key={s.id}
                  onClick={() => onChange("styleId", s.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? "bg-heritage-jade/20 border-teal-400 shadow-sm ring-1 ring-teal-400/40"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.name}</span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-teal-300" />}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{s.description}</p>
                  
                  {/* Prompt FLUX tag */}
                  <div className="pt-1 border-t border-white/5 flex items-center gap-1 text-[9px] text-gray-400 font-mono truncate">
                    <span className="text-teal-300 font-semibold">+ Style & Nền:</span>
                    <span className="truncate">{styleDesc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category 5: Accessories */}
      {activeCategory === "accessory" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Điểm xuyết phụ kiện hiện đại & truyền thống:</span>
            <span className="text-[11px] text-heritage-gold">Chi tiết nâng tầm</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {mockupsData.accessories.map((a) => {
              const isSelected = outfit.accessoryId === a.id;
              const promptKeyword = ACCESSORY_PROMPT_MAP[a.id] || (a.id === "none" ? "Không dùng phụ kiện" : "");
              return (
                <button
                  key={a.id}
                  onClick={() => onChange("accessoryId", a.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-2 ${
                    isSelected
                      ? "bg-heritage-gold/15 border-heritage-gold shadow-sm ring-1 ring-heritage-gold/40"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{a.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-heritage-gold stroke-[3]" />}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{a.culturalNote}</p>
                  
                  {/* Prompt FLUX tag */}
                  <div className="pt-1 border-t border-white/5 flex items-center gap-1 text-[9px] text-gray-400 font-mono truncate">
                    <span className="text-sky-300 font-semibold">+ Phụ kiện:</span>
                    <span className="truncate">{promptKeyword || "none"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Live Prompt FLUX.1 Assembly Bar */}
      <div className="mt-2 pt-3 border-t border-heritage-dark-border flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-heritage-gold">
            <Sparkles className="w-3.5 h-3.5 fill-heritage-gold" />
            <span>Prompt FLUX.1 Tổng Hợp (Tự Động Ghép Từ Các Tab)</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(breakdown.fullPrompt);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <span className="text-emerald-400 font-bold">Đã sao chép!</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Sao chép Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* 5 Chips showing each tab's active value */}
        <div className="flex flex-wrap gap-1.5 text-[10px]">
          <span className="px-2 py-0.5 rounded-lg bg-heritage-gold/15 text-heritage-gold border border-heritage-gold/30 font-medium">
            👘 {breakdown.garmentName}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 font-medium">
            🎨 {breakdown.colorName}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
            🏞️ {breakdown.occasionName}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium">
            ⚡ {breakdown.styleName}
          </span>
          {outfit.accessoryId !== "none" && (
            <span className="px-2 py-0.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium">
              💎 {breakdown.accessoryName}
            </span>
          )}
        </div>

        {/* Full prompt string text box */}
        <div className="p-2.5 rounded-xl bg-black/70 border border-white/10 text-[10px] text-gray-300 font-mono leading-relaxed select-all">
          {breakdown.fullPrompt}
        </div>
      </div>
    </div>
  );
};

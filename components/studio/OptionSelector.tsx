"use client";

import React, { useState } from "react";
import mockupsData from "@/config/mockups.json";
import { OutfitState } from "@/lib/utils";
import {
  Shirt,
  Palette,
  Calendar,
  Sparkles,
  Glasses,
  Check,
  Flame,
  Info,
} from "lucide-react";

interface OptionSelectorProps {
  outfit: OutfitState;
  onChange: <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ outfit, onChange }) => {
  const [activeCategory, setActiveCategory] = useState<"garment" | "color" | "occasion" | "style" | "accessory">("garment");

  const categories = [
    { id: "garment", label: "Trang Phục", icon: Shirt },
    { id: "color", label: "Màu & Ngũ Hành", icon: Palette },
    { id: "occasion", label: "Bối Cảnh / Dịp", icon: Calendar },
    { id: "style", label: "Phong Cách Gen Z", icon: Flame },
    { id: "accessory", label: "Phụ Kiện", icon: Glasses },
  ];

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
              return (
                <button
                  key={g.id}
                  onClick={() => onChange("garmentId", g.id)}
                  className={`p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-heritage-red/10 border-heritage-red shadow-sm shadow-heritage-red/20"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600 text-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
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
              return (
                <button
                  key={c.id}
                  onClick={() => onChange("colorId", c.id)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center gap-3 ${
                    isSelected
                      ? "bg-white/10 border-heritage-gold shadow-md"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
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
              return (
                <button
                  key={o.id}
                  onClick={() => onChange("occasionId", o.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? "bg-heritage-indigo/30 border-heritage-gold shadow-sm"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{o.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                      {o.formalityLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{o.weatherHint}</p>
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
              return (
                <button
                  key={s.id}
                  onClick={() => onChange("styleId", s.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? "bg-heritage-jade/20 border-teal-400 shadow-sm"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{s.name}</span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-teal-300" />}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{s.description}</p>
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
              return (
                <button
                  key={a.id}
                  onClick={() => onChange("accessoryId", a.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? "bg-heritage-gold/15 border-heritage-gold shadow-sm"
                      : "bg-heritage-dark/60 border-heritage-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{a.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-heritage-gold stroke-[3]" />}
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2">{a.culturalNote}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

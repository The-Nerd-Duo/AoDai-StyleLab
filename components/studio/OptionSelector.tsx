"use client";

import React, { useState, useRef } from "react";
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
  User,
  Upload,
} from "lucide-react";

const GARMENT_IMAGES: Record<string, string> = {
  "ngu-than-tay-chen":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyzXUf3BHqxz22reppUwLUA64GI1o-bQIfrd6t-Gf95IXjLF2dbgICCvu9WhERkwWkNFdlx5CaSUhqptaaar-eraMinIv50Q0P9ykSoR5oM5-4UkHfwn8g9FwZMJT9f9j8CSefE4QfE1S4rRtuF0bZUgrUuv0tafPcfVp9_1cGdt8wc_EsfucFHOsmywxYrWF0wGOxsmuwZw86jgMPbn6cbG8tEkHKe4XlfwlJv-nmq-JGLuDFdomE",
  "giao-linh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCknccmCrDHpUjcXWnqFvpC3WkpVR6ks8ptQd98VveeBqkzD6RsIxzqbeMMpYeg5QqEuSk0XKBDrrsc8gtvMQuEhXSUoaO-XQ7NM_EkHqoaCAynEGdFj96O0v4i3M_P697Uvce3v62cRUZU6996BBl5LiTCpO76pCF8JVomuzQNFEaAhSxR7AtAd359lexe6HSM-ytB91YwF-8C_sC7a_Snvyt7USFte4hsZrHEvlUXF0-WDBk9N5tc",
  "tu-than":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0x4FRbQdHyYtXiqXPyTy2Oy8eJrqST-GzG8oGVOlFrYq74lExqXakd8_LbEls06XuwsNSNe8P0J1OkOmRHw-tZcNkvTp7L-tzFDWZ8Tn4UQRWHFYMnWSw-EjRyYgJtOouGkdTcfaBlCvUQTqAs9A6nC3LJfUSF7BMA72kysYRFxozCZjr5Aui_HVNtsf5Rf9jJMhWMS94jx_5JHu9zIZDEoYgrYQfHx33FMv3IS3LhvOnsbi7xxbr",
  "vien-linh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4fyx0tMRm5-2yZ9TwSJBC06VH33TEUNPgWskLleCx_LASZdV3pClbmtbFjisbxD-YpMAzFEJ2fr49WRkzYvEnT8lOzaAsB6rKO5payeqtqvAX4Bt144LP_n8JSYNaZrMQt3s8lEBbbPIdPKl6SLLgsVbIHXZl5IQZSwIcLkf8_Dcbtny_IdxDnZXl9EtmiLreZH0blxCPKdLsPWpD1BTEx29ULJOmyNkxU_SYng29VY0lMvnzl_k",
  "nhat-binh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSCMz45PF4ZIsUApnOtp6niwqv_EK_pT4hBY9SgkjmfNWH4T6FiiQw4_6R8zGjc5wnMVLooa5nTLoJ-XBp_4zpv6in9IU7VvLlDxUZ3vepkIetKVISxrPcoSEuVFTsPteJ4zpFLt8fqiviusKq2fMQsUHN6NCB0mmJRm6-kh1nnLXcCfLPhXw-9nNMkvRP89_cvdmfhHsP-Wh6tp77zdKzZ7Oi51J9mkA9lwVqoSUW8YHllXwHLa-G",
  "lemur-1930":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzptqeiNiTrbpOFPHDtyChIEsDbduFujGuEa9mgJ3NMAaItGBIRVtwS8XHnGZgqFZ4MuuGTI9beznhEPjRLYxrMfOIhSeIXDdFNvvDfjoMYpMkjLmSHGL2agoWKnJnW2AgdzKqLvUQMYO7WCUs_shYP3noVwJTIb-WlYvqQthOHMFxezkDDQ2UAHEEd2zBe_LqJojdzKzD0P9rNgJvk_h8IMpzfJks1lX2kSZIDpKTFIfv-O7Pills",
  "ao-tac":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpOAxeyNU-ueqoWFNbL-ZWkeNj_gjNNw_IH0R6MaLYnmA5lwgX6cDXSW3j2nSiB58n9a0gsUHBNPjncrqYfARAkBcleHlPlijMDaYSfMJCcwK5BMeETHgKz_cKCVcASjl7USFlAC3p14fmLGtjZRIcbft5H-dzD5dgJYslHPfXnSuoU_0vOPN2s_DXcI8A3OtvYxsOUVzjUIrUg-kHug1PIjmSt2B9PhhZ_6WHvphT6wH5aHMj7al",
  "ao-dai-nam":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqtloS8lWBgKJhemPxI9fMALOCcDHTW--rwkUpbl2AXqjxB808PiLxsfqEMo7faBVfCumkLRYKPQR4CHOVF0DGjG7t4rDqTJ0igvTmuLethE02zP_LNXNriN720o68BHRKgC4NPizgJ4wQPk5pVGDEQC5lLRJEt2djGRZ-ka02ReBOVlCMpS_PYYs9sa_9cqCXJbhqGIUixn7EV8WnLEVq3BfyYWCWuLPW3dYRFh-5BtWmbLkC-nPs",
};

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
                className={`p-2.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs ring-1 ring-vermilion-red/30"
                    : "bg-surface-pure border-border-bronze-light/50 hover:bg-paper-cream text-text-charcoal"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-text-charcoal">{p.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-vermilion-red text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-warm-gray line-clamp-1">{p.vibe}</p>
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
            className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors shadow-2xs whitespace-nowrap ${
              customAvatarUrl
                ? "bg-guardrail-pass-surface border-guardrail-pass/40 text-guardrail-pass"
                : "border-border-bronze-light/60 bg-surface-pure text-text-charcoal hover:bg-paper-cream"
            }`}
          >
            {customAvatarUrl ? "✓ Đã tải ảnh riêng" : "Tải ảnh lên"}
          </button>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border-bronze-light/40">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-vermilion-red text-white shadow-xs"
                  : "bg-paper-cream text-text-warm-gray hover:text-text-charcoal border border-border-bronze-light/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: CỔ PHỤC GIÁM TUYỂN (GARMENTS LIST) */}
      {activeCategory === "garment" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
              Cổ phục giám tuyển
            </span>
            <span className="text-[11px] text-bronze-gold font-bold">
              {mockupsData.garments.length} Kiểu Dáng
            </span>
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: "thin" }}>
            {mockupsData.garments.map((g) => {
              const isSelected = outfit.garmentId === g.id;
              const imgUrl = GARMENT_IMAGES[g.id] || "https://lh3.googleusercontent.com/aida-public/AB6AXuDyzXUf3BHqxz22reppUwLUA64GI1o-bQIfrd6t-Gf95IXjLF2dbgICCvu9WhERkwWkNFdlx5CaSUhqptaaar-eraMinIv50Q0P9ykSoR5oM5-4UkHfwn8g9FwZMJT9f9j8CSefE4QfE1S4rRtuF0bZUgrUuv0tafPcfVp9_1cGdt8wc_EsfucFHOsmywxYrWF0wGOxsmuwZw86jgMPbn6cbG8tEkHKe4XlfwlJv-nmq-JGLuDFdomE";
              const promptKeyword = GARMENT_PROMPT_MAP[g.id] || "";

              return (
                <div
                  key={g.id}
                  onClick={() => onChange("garmentId", g.id)}
                  className={`relative p-2.5 rounded-xl border-2 transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-gradient-to-r from-paper-cream to-surface-pure border-vermilion-red shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream border-border-bronze-light/40 shadow-xs"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 right-3 bg-vermilion-red text-white font-mono text-[9px] px-2 py-0.2 rounded-full font-bold shadow-xs">
                      ĐANG MẶC
                    </div>
                  )}

                  <div className="flex gap-2.5">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 relative border border-border-bronze-light">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={imgUrl}
                        alt={g.name}
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-serif text-[13px] leading-tight text-text-charcoal font-bold truncate">
                            {g.name}
                          </h3>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px] text-vermilion-red flex-shrink-0">
                              check_circle
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-text-warm-gray mt-0.5 line-clamp-1">
                          {g.dynasty} • {g.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-pure border border-border-bronze-light font-bold text-text-charcoal">
                          {g.tag}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bronze-gold/15 text-stone-800 font-bold truncate max-w-[120px]">
                          {promptKeyword}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: MÀU SẮC CHI TIẾT */}
      {activeCategory === "color" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
              Bảng Màu Di Sản
            </span>
            <span className="text-[11px] text-bronze-gold font-bold">
              {mockupsData.colors.length} Sắc Màu
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {mockupsData.colors.map((c) => {
              const isSelected = outfit.colorId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onChange("colorId", c.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-3 ${
                    isSelected
                      ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream border-border-bronze-light/50"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl shadow-inner border border-black/10 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check className={`w-4 h-4 stroke-[3] ${c.id === "white-ngoc-trai" ? "text-gray-900" : "text-white"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-text-charcoal truncate">{c.name}</span>
                    </div>
                    <p className="text-[10px] text-text-warm-gray truncate mt-0.5">{c.meaning}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: PHỤ KIỆN NEO-Y2K */}
      {activeCategory === "accessory" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
              Phụ kiện Neo-Y2K
            </span>
            <span className="text-[11px] text-bronze-gold font-bold">
              {mockupsData.accessories.length} Lựa Chọn
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {mockupsData.accessories.map((a) => {
              const isSelected = outfit.accessoryId === a.id;
              const promptKeyword = ACCESSORY_PROMPT_MAP[a.id] || "";
              return (
                <button
                  key={a.id}
                  onClick={() => onChange("accessoryId", a.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream border-border-bronze-light/50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text-charcoal">{a.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-paper-cream border border-border-bronze-light/50 text-text-warm-gray font-mono">
                        {a.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-warm-gray line-clamp-1 mt-0.5">
                      {a.culturalNote}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {isSelected ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vermilion-red text-white font-bold">
                        Đang chọn
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-cream border border-border-bronze-light text-text-warm-gray">
                        + Thêm
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: BỐI CẢNH / DỊP */}
      {activeCategory === "occasion" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
              Bối Cảnh / Hoàn Cảnh
            </span>
            <span className="text-[11px] text-bronze-gold font-bold">
              {mockupsData.occasions.length} Bối Cảnh
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {mockupsData.occasions.map((o) => {
              const isSelected = outfit.occasionId === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => onChange("occasionId", o.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream border-border-bronze-light/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-charcoal">{o.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-paper-cream border border-border-bronze-light/50 text-text-warm-gray font-mono">
                      {o.formalityLevel}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-warm-gray line-clamp-1">{o.weatherHint}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 5: PHONG CÁCH GEN Z */}
      {activeCategory === "style" && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
              Phong Cách Gen Z
            </span>
            <span className="text-[11px] text-bronze-gold font-bold">
              {mockupsData.styles.length} Phong Cách
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {mockupsData.styles.map((s) => {
              const isSelected = outfit.styleId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onChange("styleId", s.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream border-border-bronze-light/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-charcoal">{s.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-vermilion-red stroke-[3]" />}
                  </div>
                  <p className="text-[10px] text-text-warm-gray line-clamp-2">{s.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

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

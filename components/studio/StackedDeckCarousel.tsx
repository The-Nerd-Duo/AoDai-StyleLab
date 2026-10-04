"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import mockupsData from "@/config/mockups.json";
import { OutfitState } from "@/lib/utils";
import {
  GARMENT_PROMPT_MAP,
  COLOR_PROMPT_MAP,
  OCCASION_PROMPT_MAP,
} from "@/lib/ai-prompt";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Coffee,
  HeartHandshake,
  Landmark,
  GraduationCap,
  Flame,
  ArrowLeftRight,
  Layers,
  Crown,
  Eye,
  Footprints,
  Gem,
  ShoppingBag,
  Sparkle,
  CircleOff,
  Feather,
} from "lucide-react";

export const GARMENT_IMAGES: Record<string, string> = {
  "ao-dai-cach-tan":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzptqeiNiTrbpOFPHDtyChIEsDbduFujGuEa9mgJ3NMAaItGBIRVtwS8XHnGZgqFZ4MuuGTI9beznhEPjRLYxrMfOIhSeIXDdFNvvDfjoMYpMkjLmSHGL2agoWKnJnW2AgdzKqLvUQMYO7WCUs_shYP3noVwJTIb-WlYvqQthOHMFxezkDDQ2UAHEEd2zBe_LqJojdzKzD0P9rNgJvk_h8IMpzfJks1lX2kSZIDpKTFIfv-O7Pills",
  "ao-dai-truyen-thong":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfU1l0gSbPaLoTeo3tgEUecbSQacO9PmaHyrM_sRwombBm0vUFArSJLn3HOqMK6veCuwZyAYtXo6Kl3Em6Jp1PFuZ2F0eKkmWDkaFlRSjS4QoD1Wy6VdTOVLw4k4U6enNolycvm8GyzLBEHd2kLeC8spZgBBfnQy9hxl7Os3cduJmuI06bqx_ZnGv-SPqIQUrtiI9GXZpwM8RYUvx68onqr6gZMkGyYorHicAH4k0Aa0oQvnarHv0_",
  "ao-ngu-than-tay-chen":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyzXUf3BHqxz22reppUwLUA64GI1o-bQIfrd6t-Gf95IXjLF2dbgICCvu9WhERkwWkNFdlx5CaSUhqptaaar-eraMinIv50Q0P9ykSoR5oM5-4UkHfwn8g9FwZMJT9f9j8CSefE4QfE1S4rRtuF0bZUgrUuv0tafPcfVp9_1cGdt8wc_EsfucFHOsmywxYrWF0wGOxsmuwZw86jgMPbn6cbG8tEkHKe4XlfwlJv-nmq-JGLuDFdomE",
  "ao-tac-ngu-than-tay-thung":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpOAxeyNU-ueqoWFNbL-ZWkeNj_gjNNw_IH0R6MaLYnmA5lwgX6cDXSW3j2nSiB58n9a0gsUHBNPjncrqYfARAkBcleHlPlijMDaYSfMJCcwK5BMeETHgKz_cKCVcASjl7USFlAC3p14fmLGtjZRIcbft5H-dzD5dgJYslHPfXnSuoU_0vOPN2s_DXcI8A3OtvYxsOUVzjUIrUg-kHug1PIjmSt2B9PhhZ_6WHvphT6wH5aHMj7al",
  "ao-tu-than":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0x4FRbQdHyYtXiqXPyTy2Oy8eJrqST-GzG8oGVOlFrYq74lExqXakd8_LbEls06XuwsNSNe8P0J1OkOmRHw-tZcNkvTp7L-tzFDWZ8Tn4UQRWHFYMnWSw-EjRyYgJtOouGkdTcfaBlCvUQTqAs9A6nC3LJfUSF7BMA72kysYRFxozCZjr5Aui_HVNtsf5Rf9jJMhWMS94jx_5JHu9zIZDEoYgrYQfHx33FMv3IS3LhvOnsbi7xxbr",
  "ao-nhat-binh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSCMz45PF4ZIsUApnOtp6niwqv_EK_pT4hBY9SgkjmfNWH4T6FiiQw4_6R8zGjc5wnMVLooa5nTLoJ-XBp_4zpv6in9IU7VvLlDxUZ3vepkIetKVISxrPcoSEuVFTsPteJ4zpFLt8fqiviusKq2fMQsUHN6NCB0mmJRm6-kh1nnLXcCfLPhXw-9nNMkvRP89_cvdmfhHsP-Wh6tp77zdKzZ7Oi51J9mkA9lwVqoSUW8YHllXwHLa-G",
  "ao-giao-linh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCknccmCrDHpUjcXWnqFvpC3WkpVR6ks8ptQd98VveeBqkzD6RsIxzqbeMMpYeg5QqEuSk0XKBDrrsc8gtvMQuEhXSUoaO-XQ7NM_EkHqoaCAynEGdFj96O0v4i3M_P697Uvce3v62cRUZU6996BBl5LiTCpO76pCF8JVomuzQNFEaAhSxR7AtAd359lexe6HSM-ytB91YwF-8C_sC7a_Snvyt7USFte4hsZrHEvlUXF0-WDBk9N5tc",
  "ao-lap-linh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4fyx0tMRm5-2yZ9TwSJBC06VH33TEUNPgWskLleCx_LASZdV3pClbmtbFjisbxD-YpMAzFEJ2fr49WRkzYvEnT8lOzaAsB6rKO5payeqtqvAX4Bt144LP_n8JSYNaZrMQt3s8lEBbbPIdPKl6SLLgsVbIHXZl5IQZSwIcLkf8_Dcbtny_IdxDnZXl9EtmiLreZH0blxCPKdLsPWpD1BTEx29ULJOmyNkxU_SYng29VY0lMvnzl_k",
  // Aliases
  "ngu-than-tay-chen":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDyzXUf3BHqxz22reppUwLUA64GI1o-bQIfrd6t-Gf95IXjLF2dbgICCvu9WhERkwWkNFdlx5CaSUhqptaaar-eraMinIv50Q0P9ykSoR5oM5-4UkHfwn8g9FwZMJT9f9j8CSefE4QfE1S4rRtuF0bZUgrUuv0tafPcfVp9_1cGdt8wc_EsfucFHOsmywxYrWF0wGOxsmuwZw86jgMPbn6cbG8tEkHKe4XlfwlJv-nmq-JGLuDFdomE",
  "giao-linh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCknccmCrDHpUjcXWnqFvpC3WkpVR6ks8ptQd98VveeBqkzD6RsIxzqbeMMpYeg5QqEuSk0XKBDrrsc8gtvMQuEhXSUoaO-XQ7NM_EkHqoaCAynEGdFj96O0v4i3M_P697Uvce3v62cRUZU6996BBl5LiTCpO76pCF8JVomuzQNFEaAhSxR7AtAd359lexe6HSM-ytB91YwF-8C_sC7a_Snvyt7USFte4hsZrHEvlUXF0-WDBk9N5tc",
  "tu-than":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0x4FRbQdHyYtXiqXPyTy2Oy8eJrqST-GzG8oGVOlFrYq74lExqXakd8_LbEls06XuwsNSNe8P0J1OkOmRHw-tZcNkvTp7L-tzFDWZ8Tn4UQRWHFYMnWSw-EjRyYgJtOouGkdTcfaBlCvUQTqAs9A6nC3LJfUSF7BMA72kysYRFxozCZjr5Aui_HVNtsf5Rf9jJMhWMS94jx_5JHu9zIZDEoYgrYQfHx33FMv3IS3LhvOnsbi7xxbr",
  "nhat-binh":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSCMz45PF4ZIsUApnOtp6niwqv_EK_pT4hBY9SgkjmfNWH4T6FiiQw4_6R8zGjc5wnMVLooa5nTLoJ-XBp_4zpv6in9IU7VvLlDxUZ3vepkIetKVISxrPcoSEuVFTsPteJ4zpFLt8fqiviusKq2fMQsUHN6NCB0mmJRm6-kh1nnLXcCfLPhXw-9nNMkvRP89_cvdmfhHsP-Wh6tp77zdKzZ7Oi51J9mkA9lwVqoSUW8YHllXwHLa-G",
  "lemur-1930":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzptqeiNiTrbpOFPHDtyChIEsDbduFujGuEa9mgJ3NMAaItGBIRVtwS8XHnGZgqFZ4MuuGTI9beznhEPjRLYxrMfOIhSeIXDdFNvvDfjoMYpMkjLmSHGL2agoWKnJnW2AgdzKqLvUQMYO7WCUs_shYP3noVwJTIb-WlYvqQthOHMFxezkDDQ2UAHEEd2zBe_LqJojdzKzD0P9rNgJvk_h8IMpzfJks1lX2kSZIDpKTFIfv-O7Pills",
  "ao-tac":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpOAxeyNU-ueqoWFNbL-ZWkeNj_gjNNw_IH0R6MaLYnmA5lwgX6cDXSW3j2nSiB58n9a0gsUHBNPjncrqYfARAkBcleHlPlijMDaYSfMJCcwK5BMeETHgKz_cKCVcASjl7USFlAC3p14fmLGtjZRIcbft5H-dzD5dgJYslHPfXnSuoU_0vOPN2s_DXcI8A3OtvYxsOUVzjUIrUg-kHug1PIjmSt2B9PhhZ_6WHvphT6wH5aHMj7al",
};

interface StackedDeckCarouselProps {
  category: "garment" | "color" | "accessory" | "occasion" | "style";
  outfit: OutfitState;
  onChange: <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => void;
}

export const StackedDeckCarousel: React.FC<StackedDeckCarouselProps> = ({
  category,
  outfit,
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current list of items based on category
  const items = React.useMemo(() => {
    switch (category) {
      case "garment":
        return mockupsData.garments;
      case "color":
        return mockupsData.colors;
      case "accessory":
        return mockupsData.accessories;
      case "occasion":
        return mockupsData.occasions;
      case "style":
        return mockupsData.styles;
      default:
        return [];
    }
  }, [category]);

  const total = items.length;

  // Sync activeIndex with currently selected item when category opens or changes
  useEffect(() => {
    let targetIndex = 0;
    if (category === "garment") {
      targetIndex = mockupsData.garments.findIndex((g) => g.id === outfit.garmentId);
    } else if (category === "color") {
      targetIndex = mockupsData.colors.findIndex((c) => c.id === outfit.colorId);
    } else if (category === "occasion") {
      targetIndex = mockupsData.occasions.findIndex((o) => o.id === outfit.occasionId);
    } else if (category === "style") {
      targetIndex = mockupsData.styles.findIndex((s) => s.id === outfit.styleId);
    } else if (category === "accessory") {
      const activeAcc = outfit.accessoryIds?.[0] || outfit.accessoryId;
      if (activeAcc && activeAcc !== "none") {
        targetIndex = mockupsData.accessories.findIndex((a) => a.id === activeAcc);
      }
    }
    setActiveIndex(targetIndex >= 0 ? targetIndex : 0);
    setDragDeltaX(0);
  }, [category, outfit.garmentId, outfit.colorId, outfit.occasionId, outfit.styleId]);

  // Navigate to Next
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Navigate to Previous
  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Shortest circular offset between index and activeIndex
  const getCircularOffset = (index: number, active: number, count: number) => {
    let diff = index - active;
    while (diff > count / 2) diff -= count;
    while (diff < -count / 2) diff += count;
    return diff;
  };

  // Multi-select helpers for accessories
  const selectedAccessoryIds = React.useMemo(() => {
    if (outfit.accessoryIds !== undefined) return outfit.accessoryIds;
    if (outfit.accessoryId && outfit.accessoryId !== "none") return [outfit.accessoryId];
    return [];
  }, [outfit.accessoryIds, outfit.accessoryId]);

  const handleToggleAccessory = (accId: string) => {
    let nextIds: string[];
    if (selectedAccessoryIds.includes(accId)) {
      nextIds = selectedAccessoryIds.filter((id) => id !== accId);
    } else {
      nextIds = [...selectedAccessoryIds, accId];
    }
    onChange("accessoryIds", nextIds);
    onChange("accessoryId", nextIds[0] || "none");
  };

  const handleClearAccessories = () => {
    onChange("accessoryIds", []);
    onChange("accessoryId", "none");
  };

  // Touch and Mouse Drag Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - dragStartX;
    setDragDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    }
    setDragDeltaX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const delta = currentX - dragStartX;
    setDragDeltaX(delta);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    }
    setDragDeltaX(0);
  };

  // Compute 3D Depth Card Style (Cái đứng trước, cái đứng sau)
  const getCardTransform = (offset: number) => {
    const delta = isDragging ? dragDeltaX : 0;

    // Card in the front (Front Active)
    if (offset === 0) {
      const tx = delta;
      const rotY = delta * 0.05;
      return {
        transform: `translate3d(${tx}px, 0px, 0px) scale(1) rotateY(${rotY}deg)`,
        zIndex: 30,
        opacity: 1,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 18px 24px rgba(0, 0, 0, 0.12))",
        transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.35s ease, filter 0.35s ease",
      };
    }

    // Next Card (Peeking from behind on the right)
    if (offset === 1) {
      const tx = 52 + delta * 0.35;
      const rotY = -7;
      return {
        transform: `translate3d(${tx}px, 6px, -45px) scale(0.91) rotateY(${rotY}deg)`,
        zIndex: 20,
        opacity: 0.88,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.07))",
        transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.35s ease, filter 0.35s ease",
      };
    }

    // Previous Card (Peeking from behind on the left)
    if (offset === -1) {
      const tx = -52 + delta * 0.35;
      const rotY = 7;
      return {
        transform: `translate3d(${tx}px, 6px, -45px) scale(0.91) rotateY(${rotY}deg)`,
        zIndex: 20,
        opacity: 0.88,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.07))",
        transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.35s ease, filter 0.35s ease",
      };
    }

    // +2 Card (Further right, layered behind)
    if (offset === 2) {
      const tx = 94 + delta * 0.15;
      const rotY = -14;
      return {
        transform: `translate3d(${tx}px, 14px, -90px) scale(0.82) rotateY(${rotY}deg)`,
        zIndex: 10,
        opacity: 0.45,
        pointerEvents: "none" as const,
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
        transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.35s ease, filter 0.35s ease",
      };
    }

    // -2 Card (Further left, layered behind)
    if (offset === -2) {
      const tx = -94 + delta * 0.15;
      const rotY = 14;
      return {
        transform: `translate3d(${tx}px, 14px, -90px) scale(0.82) rotateY(${rotY}deg)`,
        zIndex: 10,
        opacity: 0.45,
        pointerEvents: "none" as const,
        filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
        transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.35s ease, filter 0.35s ease",
      };
    }

    // Hidden cards
    return {
      transform: `translate3d(${offset > 0 ? 120 : -120}px, 20px, -140px) scale(0.7)`,
      zIndex: 0,
      opacity: 0,
      pointerEvents: "none" as const,
      transition: "transform 0.3s ease, opacity 0.3s ease",
    };
  };

  // Helper icon for accessories
  const getAccessoryIcon = (type: string) => {
    switch (type) {
      case "headwear":
        return Crown;
      case "eyewear":
        return Eye;
      case "footwear":
        return Footprints;
      case "jewelry":
        return Gem;
      case "bag":
        return ShoppingBag;
      case "props":
        return Feather;
      case "none":
        return CircleOff;
      default:
        return Sparkle;
    }
  };

  // Helper icon for occasions
  const getOccasionIcon = (iconName: string) => {
    switch (iconName) {
      case "Coffee":
        return Coffee;
      case "Sparkles":
        return Sparkles;
      case "HeartHandshake":
        return HeartHandshake;
      case "Landmark":
        return Landmark;
      case "GraduationCap":
        return GraduationCap;
      case "Flame":
        return Flame;
      default:
        return Sparkles;
    }
  };

  // Titles per category
  const categoryHeaders: Record<string, { title: string; subtitle: string }> = {
    garment: { title: "CỔ PHỤC GIÁM TUYỂN", subtitle: `${total} Kiểu Dáng` },
    color: { title: "BẢNG MÀU DI SẢN", subtitle: `${total} Sắc Màu` },
    accessory: { title: "PHỤ KIỆN NEO-Y2K", subtitle: `${selectedAccessoryIds.length}/${total} Đã chọn` },
    occasion: { title: "BỐI CẢNH / HOÀN CẢNH", subtitle: `${total} Bối Cảnh` },
    style: { title: "PHONG CÁCH GEN Z", subtitle: `${total} Phong Cách` },
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Category Subheader */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-vermilion-red" />
          <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
            {categoryHeaders[category]?.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {category === "accessory" && selectedAccessoryIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearAccessories}
              className="text-[10px] text-vermilion-red hover:underline font-semibold"
            >
              Bỏ chọn tất cả
            </button>
          )}
          <span className="text-[11px] font-mono text-bronze-gold font-bold">
            {activeIndex + 1}/{total}
          </span>
        </div>
      </div>

      {/* 3D Depth Card Stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[395px] flex items-center justify-center overflow-hidden select-none touch-pan-y"
        style={{ perspective: "1050px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Floating Left Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-1 z-40 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-border-bronze-light shadow-md flex items-center justify-center text-text-charcoal hover:bg-paper-cream hover:scale-110 active:scale-95 transition-all focus:outline-none"
          aria-label="Lựa chọn trước"
        >
          <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* Floating Right Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-1 z-40 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-border-bronze-light shadow-md flex items-center justify-center text-text-charcoal hover:bg-paper-cream hover:scale-110 active:scale-95 transition-all focus:outline-none"
          aria-label="Lựa chọn kế tiếp"
        >
          <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* Render 3D Stack Cards */}
        {items.map((item: any, index: number) => {
          const offset = getCircularOffset(index, activeIndex, total);
          const style = getCardTransform(offset);
          const isFront = offset === 0;

          // Render card content based on category
          return (
            <div
              key={item.id}
              style={style}
              onClick={() => {
                if (offset === 1) handleNext();
                else if (offset === -1) handlePrev();
              }}
              className={`absolute top-2 w-[275px] sm:w-[285px] h-[375px] rounded-2xl bg-surface-pure border-2 transition-colors cursor-pointer flex flex-col overflow-hidden ${
                isFront
                  ? "border-vermilion-red/70 shadow-xl ring-2 ring-vermilion-red/20"
                  : "border-border-bronze-light/70 shadow-md hover:border-bronze-gold/60"
              }`}
            >
              {/* CATEGORY 1: GARMENT CARD */}
              {category === "garment" && (() => {
                const isSelected = outfit.garmentId === item.id;
                const imgUrl =
                  GARMENT_IMAGES[item.id] ||
                  GARMENT_IMAGES[item.id.replace("ao-", "")] ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDyzXUf3BHqxz22reppUwLUA64GI1o-bQIfrd6t-Gf95IXjLF2dbgICCvu9WhERkwWkNFdlx5CaSUhqptaaar-eraMinIv50Q0P9ykSoR5oM5-4UkHfwn8g9FwZMJT9f9j8CSefE4QfE1S4rRtuF0bZUgrUuv0tafPcfVp9_1cGdt8wc_EsfucFHOsmywxYrWF0wGOxsmuwZw86jgMPbn6cbG8tEkHKe4XlfwlJv-nmq-JGLuDFdomE";
                const promptKeyword = GARMENT_PROMPT_MAP[item.id] || "";

                return (
                  <div className="flex flex-col h-full">
                    {/* Top Image Preview */}
                    <div className="relative h-[200px] w-full bg-stone-100 overflow-hidden shrink-0 border-b border-border-bronze-light/40">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-semibold shadow-xs">
                          {item.dynasty}
                        </span>
                        {isSelected ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đang mặc
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-text-charcoal border border-border-bronze-light font-semibold shadow-xs">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-white/90 backdrop-blur-xs truncate max-w-[170px]">
                          {promptKeyword}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-text-warm-gray mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange("garmentId", item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? "bg-vermilion-red/10 border-2 border-vermilion-red text-vermilion-red cursor-default"
                            : "bg-vermilion-red text-white hover:bg-vermilion-red/90 hover:shadow-xs active:scale-98"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Đã chọn mặc trang phục này
                          </>
                        ) : (
                          "Chọn cổ phục này"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* CATEGORY 2: COLOR CARD */}
              {category === "color" && (() => {
                const isSelected = outfit.colorId === item.id;
                const isWhite = item.id === "white-ngoc-trai";

                return (
                  <div className="flex flex-col h-full">
                    {/* Top Silk Swatch Banner */}
                    <div
                      className="relative h-[180px] w-full flex items-center justify-center shrink-0 border-b border-border-bronze-light/40 overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 50% 40%, ${item.hex}ee, ${item.hex}bb 60%, #1a1a1a 140%)`,
                      }}
                    >
                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white border border-white/20 font-bold shadow-xs">
                          Ngũ Hành: {item.element}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90 border border-white/20 font-semibold shadow-xs">
                          {item.hex}
                        </span>
                      </div>

                      {/* Silk Sheen Circle Swatch */}
                      <div
                        className="w-20 h-20 rounded-full border-4 border-white/70 shadow-2xl flex items-center justify-center relative transition-transform duration-300 hover:scale-105"
                        style={{ backgroundColor: item.hex }}
                      >
                        {/* Silk reflection highlights */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                        {isSelected && (
                          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                            {item.name}
                          </h3>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red/10 text-vermilion-red font-bold border border-vermilion-red/20">
                              Đang dùng
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-warm-gray mt-1.5 line-clamp-3 leading-relaxed italic">
                          &ldquo;{item.meaning}&rdquo;
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange("colorId", item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? "bg-vermilion-red/10 border-2 border-vermilion-red text-vermilion-red cursor-default"
                            : "bg-text-charcoal text-white hover:bg-black hover:shadow-xs active:scale-98"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Đã áp dụng sắc màu này
                          </>
                        ) : (
                          "Áp dụng sắc màu này"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* CATEGORY 3: ACCESSORY CARD (MULTI-SELECT) */}
              {category === "accessory" && (() => {
                const isSelected = selectedAccessoryIds.includes(item.id);
                const IconComponent = getAccessoryIcon(item.type);

                return (
                  <div className="flex flex-col h-full">
                    {/* Top Graphic Banner */}
                    <div className="relative h-[180px] w-full bg-gradient-to-br from-[#FDF8EE] via-[#F6ECE0] to-[#EFE2D2] flex flex-col items-center justify-center shrink-0 border-b border-border-bronze-light/40">
                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-pure border border-border-bronze-light/60 text-text-charcoal font-bold shadow-xs capitalize">
                          {item.type}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đã thêm
                          </span>
                        )}
                      </div>

                      {/* Floating Icon Medallion */}
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105 border-2 shadow-lg ${
                          isSelected
                            ? "bg-vermilion-red/10 border-vermilion-red text-vermilion-red ring-4 ring-vermilion-red/15"
                            : "bg-surface-pure border-border-bronze-light text-bronze-gold"
                        }`}
                      >
                        <IconComponent className="w-9 h-9 stroke-[1.75]" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-text-warm-gray mt-1.5 line-clamp-3 leading-relaxed">
                          {item.culturalNote}
                        </p>
                      </div>

                      {/* Action Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAccessory(item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? "bg-vermilion-red text-white hover:bg-vermilion-red/90"
                            : "bg-surface-pure border-2 border-border-bronze-light/80 text-text-charcoal hover:border-bronze-gold hover:bg-paper-cream"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Đã chọn (Bấm để gỡ)
                          </>
                        ) : (
                          "+ Thêm vào phụ kiện"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* CATEGORY 4: OCCASION CARD */}
              {category === "occasion" && (() => {
                const isSelected = outfit.occasionId === item.id;
                const IconComponent = getOccasionIcon(item.icon);

                return (
                  <div className="flex flex-col h-full">
                    {/* Top Scenic Banner */}
                    <div className="relative h-[180px] w-full bg-gradient-to-br from-[#F5EFE6] via-[#EFE6D8] to-[#E3D4C2] flex flex-col items-center justify-center shrink-0 border-b border-border-bronze-light/40">
                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-pure border border-border-bronze-light/60 text-stone-700 font-bold shadow-xs">
                          {item.formalityLevel}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đang chọn
                          </span>
                        )}
                      </div>

                      {/* Icon Medallion */}
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105 border-2 shadow-lg ${
                          isSelected
                            ? "bg-vermilion-red/10 border-vermilion-red text-vermilion-red ring-4 ring-vermilion-red/15"
                            : "bg-surface-pure border-border-bronze-light text-stone-700"
                        }`}
                      >
                        <IconComponent className="w-9 h-9 stroke-[1.75]" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-text-warm-gray mt-1.5 line-clamp-3 leading-relaxed">
                          {item.weatherHint}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange("occasionId", item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? "bg-vermilion-red/10 border-2 border-vermilion-red text-vermilion-red cursor-default"
                            : "bg-vermilion-red text-white hover:bg-vermilion-red/90 hover:shadow-xs active:scale-98"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Đã đặt bối cảnh này
                          </>
                        ) : (
                          "Chọn bối cảnh này"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* CATEGORY 5: STYLE CARD */}
              {category === "style" && (() => {
                const isSelected = outfit.styleId === item.id;

                return (
                  <div className="flex flex-col h-full">
                    {/* Top Cyber-Heritage Banner */}
                    <div className="relative h-[180px] w-full bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 flex flex-col items-center justify-center shrink-0 border-b border-border-bronze-light/40 overflow-hidden">
                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20 font-bold shadow-xs">
                          Gen Z Vibe
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đang dùng
                          </span>
                        )}
                      </div>

                      {/* Flame/Sparkle Hologram Medallion */}
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105 border-2 shadow-2xl relative ${
                          isSelected
                            ? "bg-vermilion-red/20 border-vermilion-red text-vermilion-red ring-4 ring-vermilion-red/20"
                            : "bg-white/10 border-white/20 text-amber-300"
                        }`}
                      >
                        <Sparkles className="w-9 h-9 stroke-[1.75]" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                      <div>
                        <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-text-warm-gray mt-1.5 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange("styleId", item.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? "bg-vermilion-red/10 border-2 border-vermilion-red text-vermilion-red cursor-default"
                            : "bg-text-charcoal text-white hover:bg-black hover:shadow-xs active:scale-98"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            Đã chọn phong cách này
                          </>
                        ) : (
                          "Chọn phong cách này"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Bottom Dots Indicator Bar */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex
                ? "w-6 h-1.5 bg-vermilion-red shadow-xs"
                : "w-1.5 h-1.5 bg-border-bronze-light hover:bg-bronze-gold hover:scale-125"
            }`}
            aria-label={`Chuyển đến lựa chọn ${idx + 1}`}
          />
        ))}
      </div>

      {/* Swipe Guidance Hint */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-warm-gray font-medium pt-0.5">
        <ArrowLeftRight className="w-3 h-3 text-bronze-gold animate-pulse" />
        <span>Vuốt ngang hoặc bấm mũi tên để xem các lựa chọn</span>
      </div>
    </div>
  );
};

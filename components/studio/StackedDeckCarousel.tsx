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
  ArrowLeftRight,
  Layers,
  Ban,
} from "lucide-react";

export const GARMENT_IMAGES: Record<string, string> = {
  "ao-dai-cach-tan": "/mockups/ao-dai-cach-tan.jpg",
  "ao-dai-truyen-thong": "/mockups/ao-dai_heritage.webp",
  "ao-ngu-than-tay-chen": "/mockups/ngu-than_heritage.webp",
  "ao-tac-ngu-than-tay-thung": "/mockups/ao-tac.jpg",
  "ao-tu-than": "/mockups/ao-tu-than.jpg",
  "ao-nhat-binh": "/mockups/nhat-binh_heritage.webp",
  "ao-giao-linh": "/mockups/giao-linh_heritage.webp",
  "ao-lap-linh": "/mockups/lap-linh_heritage.webp",
  // Aliases
  "ngu-than-tay-chen": "/mockups/ngu-than_heritage.webp",
  "giao-linh": "/mockups/giao-linh_heritage.webp",
  "tu-than": "/mockups/ao-tu-than.jpg",
  "nhat-binh": "/mockups/nhat-binh_heritage.webp",
  "lemur-1930": "/mockups/ao-dai-cach-tan.jpg",
  "ao-tac": "/mockups/ao-tac.jpg",
};

export const ACCESSORY_IMAGES: Record<string, string> = {
  "man-modern": "/accessories/man-modern.jpg",
  "silver-choker": "/accessories/silver-choker.jpg",
  "tui-gam": "/accessories/tui-gam.jpg",
  "sneaker-chunky": "/accessories/sneaker-chunky.jpg",
  "retro-sunglasses": "/accessories/retro-sunglasses.jpg",
  "tote-coi": "/accessories/tote-coi.jpg",
  "non-quai-thao-mini": "/accessories/non-quai-thao.jpg",
  none:
    "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
};

export const OCCASION_IMAGES: Record<string, string> = {
  "street-walk":
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  "tet-holiday":
    "https://images.unsplash.com/photo-1563354860-799d15199ac3?auto=format&fit=crop&w=700&q=80",
  "wedding-party":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "temple-heritage":
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
  "school-presentation":
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
  "y2k-party":
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
};

export const STYLE_IMAGES: Record<string, string> = {
  "y2k-neo":
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
  streetwear:
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
  "minimal-chic":
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  "cyber-retro": "/patterns/cyberpunk-dong-a.jpg",
  "vintage-academia":
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_GARMENT_FALLBACK = "/mockups/ao-dai_heritage.webp";
const DEFAULT_ACCESSORY_FALLBACK = "/accessories/tote-coi.jpg";
const DEFAULT_OCCASION_FALLBACK =
  "https://images.unsplash.com/photo-1563354860-799d15199ac3?auto=format&fit=crop&w=700&q=80";
const DEFAULT_STYLE_FALLBACK = "/patterns/cyberpunk-dong-a.jpg";

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
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);

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
    hasDraggedRef.current = false;
  }, [category, outfit.garmentId, outfit.colorId, outfit.occasionId, outfit.styleId]);

  // Auto-select for single-choice categories with tactile press-down feedback
  const applySelectionForIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= items.length) return;
      const targetItem = items[targetIndex];
      if (!targetItem) return;

      // Trigger tactile press-down feedback
      setPressedItemId(targetItem.id);
      setTimeout(() => {
        setPressedItemId(null);
      }, 120);

      // Auto-select for garment, color, occasion, style (single-choice)
      if (category === "garment") {
        onChange("garmentId", targetItem.id);
      } else if (category === "color") {
        onChange("colorId", targetItem.id);
      } else if (category === "occasion") {
        onChange("occasionId", targetItem.id);
      } else if (category === "style") {
        onChange("styleId", targetItem.id);
      }
      // Note: for accessory, do not auto-select on swipe
    },
    [category, items, onChange]
  );

  // Navigate to Next & auto-select
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const nextIdx = (activeIndex + 1) % total;
    setActiveIndex(nextIdx);
    applySelectionForIndex(nextIdx);
  }, [total, activeIndex, applySelectionForIndex]);

  // Navigate to Previous & auto-select
  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const prevIdx = (activeIndex - 1 + total) % total;
    setActiveIndex(prevIdx);
    applySelectionForIndex(prevIdx);
  }, [total, activeIndex, applySelectionForIndex]);

  // Shortest circular offset between index and activeIndex
  const getCircularOffset = (index: number, active: number, count: number) => {
    let diff = index - active;
    while (diff > count / 2) diff -= count;
    while (diff < -count / 2) diff += count;
    return diff;
  };

  // Multi-select helpers for accessories
  const selectedAccessoryIds = React.useMemo(() => {
    if (outfit.accessoryIds !== undefined && outfit.accessoryIds.length > 0) return outfit.accessoryIds;
    if (outfit.accessoryId && outfit.accessoryId !== "none") return [outfit.accessoryId];
    return ["none"];
  }, [outfit.accessoryIds, outfit.accessoryId]);

  const handleToggleAccessory = (accId: string) => {
    if (accId === "none") {
      onChange("accessoryIds", ["none"]);
      onChange("accessoryId", "none");
      return;
    }

    const currentActive = selectedAccessoryIds.filter((id) => id !== "none");
    let nextIds: string[];
    if (currentActive.includes(accId)) {
      nextIds = currentActive.filter((id) => id !== accId);
    } else {
      nextIds = [...currentActive, accId];
    }

    if (nextIds.length === 0) {
      onChange("accessoryIds", ["none"]);
      onChange("accessoryId", "none");
    } else {
      onChange("accessoryIds", nextIds);
      onChange("accessoryId", nextIds[0]);
    }
  };

  // Click anywhere on a card to select with snappy, fast press-down animation
  const handleCardClick = (item: any, offset: number) => {
    if (hasDraggedRef.current) return;

    // Fast, crisp press-down feedback
    setPressedItemId(item.id);
    setTimeout(() => {
      setPressedItemId(null);
    }, 120);

    const targetIdx = items.findIndex((i: any) => i.id === item.id);
    if (targetIdx !== -1 && targetIdx !== activeIndex) {
      setActiveIndex(targetIdx);
    }

    if (category === "accessory") {
      handleToggleAccessory(item.id);
    } else {
      if (category === "garment") onChange("garmentId", item.id);
      else if (category === "color") onChange("colorId", item.id);
      else if (category === "occasion") onChange("occasionId", item.id);
      else if (category === "style") onChange("styleId", item.id);
    }
  };

  // Touch and Mouse Drag Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
    setDragStartX(e.touches[0].clientX);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - dragStartX;
    if (Math.abs(delta) > 8) {
      hasDraggedRef.current = true;
    }
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
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const delta = currentX - dragStartX;
    if (Math.abs(delta) > 8) {
      hasDraggedRef.current = true;
    }
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
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
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
        transition: isDragging
          ? "none"
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease, filter 0.3s ease",
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
        transition: isDragging
          ? "none"
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease, filter 0.3s ease",
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
        transition: isDragging
          ? "none"
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease, filter 0.3s ease",
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
        transition: isDragging
          ? "none"
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease, filter 0.3s ease",
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
        transition: isDragging
          ? "none"
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease, filter 0.3s ease",
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

  // Titles per category
  const categoryHeaders: Record<string, { title: string; subtitle: string }> = {
    garment: { title: "CỔ PHỤC GIÁM TUYỂN", subtitle: `${total} Kiểu Dáng` },
    color: { title: "BẢNG MÀU DI SẢN", subtitle: `${total} Sắc Màu` },
    accessory: { title: "PHỤ KIỆN NEO-Y2K", subtitle: `${selectedAccessoryIds.length}/${total} Đã chọn` },
    occasion: { title: "BỐI CẢNH / HOÀN CẢNH", subtitle: `${total} Bối Cảnh` },
    style: { title: "PHONG CÁCH GEN Z", subtitle: `${total} Phong Cách` },
  };

  // Render dedicated 2-Column Grid for Accessories
  if (category === "accessory") {
    const isNoneSelected =
      selectedAccessoryIds.includes("none") || selectedAccessoryIds.length === 0;
    const activeCount = isNoneSelected ? 0 : selectedAccessoryIds.length;

    return (
      <div className="flex flex-col gap-2.5 w-full">
        {/* Header bar */}
        <div className="flex items-center justify-between px-1 bg-paper-cream/80 p-2 rounded-xl border border-border-bronze-light/50">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-vermilion-red" />
            <span className="font-mono text-[11px] font-bold text-text-charcoal uppercase tracking-wider">
              {categoryHeaders.accessory.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-bronze-gold font-bold">
              {activeCount > 0 ? `Đã chọn ${activeCount} món` : "Không dùng phụ kiện"}
            </span>
          </div>
        </div>

        {/* 2-Column Card Grid */}
        <div className="grid grid-cols-2 gap-2.5 max-h-[415px] overflow-y-auto pr-1">
          {items.map((item: any) => {
            const isNone = item.id === "none";
            const isSelected = selectedAccessoryIds.includes(item.id);
            const imgUrl = ACCESSORY_IMAGES[item.id] || DEFAULT_ACCESSORY_FALLBACK;

            return (
              <div
                key={item.id}
                onClick={() => handleToggleAccessory(item.id)}
                className={`relative h-[175px] rounded-xl overflow-hidden border-2 cursor-pointer select-none transition-all duration-150 active:scale-95 group ${
                  isSelected
                    ? "border-vermilion-red shadow-md ring-2 ring-vermilion-red/25"
                    : "border-border-bronze-light/70 hover:border-bronze-gold/70 shadow-2xs"
                }`}
              >
                {isNone ? (
                  /* Option không dùng phụ kiện: Nền xám trơn + hình tròn có gạch chéo */
                  <div className="absolute inset-0 bg-[#D8D6D0] flex flex-col items-center justify-center p-3">
                    <div className="w-14 h-14 rounded-full border-2 border-stone-500/70 flex items-center justify-center bg-stone-300/70 shadow-inner">
                      <Ban className="w-8 h-8 text-stone-600 stroke-[2]" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={imgUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== DEFAULT_ACCESSORY_FALLBACK) {
                        target.src = DEFAULT_ACCESSORY_FALLBACK;
                      }
                    }}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Gradient đen mờ từ đáy lên */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 via-45% to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-10">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-xs capitalize border border-white/10">
                    {isNone ? "Mặc định" : item.type}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-0.5 shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Đã chọn
                    </span>
                  )}
                </div>

                {/* Bottom Overlaid Text */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 flex flex-col justify-end text-white z-10 pointer-events-none">
                  <h4 className="font-serif text-xs font-bold text-amber-100 leading-snug drop-shadow-sm">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5 leading-normal">
                    {item.culturalNote}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
          const isPressed = pressedItemId === item.id;
          const isSelected =
            category === "garment"
              ? outfit.garmentId === item.id
              : category === "color"
              ? outfit.colorId === item.id
              : category === "occasion"
              ? outfit.occasionId === item.id
              : category === "style"
              ? outfit.styleId === item.id
              : false;

          // Render card content based on category
          return (
            <div
              key={item.id}
              style={style}
              className="absolute top-2 w-[275px] sm:w-[285px] h-[375px]"
            >
              {/* Inner Card: Click anywhere to select + Snappy, fast press-down effect */}
              <div
                onClick={() => handleCardClick(item, offset)}
                className={`w-full h-full rounded-2xl bg-surface-pure border-2 flex flex-col overflow-hidden select-none cursor-pointer group ${
                  isFront
                    ? isSelected
                      ? "border-vermilion-red/80 shadow-xl ring-2 ring-vermilion-red/25"
                      : "border-border-bronze-light shadow-md hover:border-bronze-gold/60"
                    : "border-border-bronze-light/70 shadow-md hover:border-bronze-gold/60 opacity-85 hover:opacity-95"
                } ${
                  isPressed
                    ? "scale-[0.96] translate-y-1.5 shadow-sm ring-2 ring-vermilion-red/60 brightness-95"
                    : "active:scale-[0.97] active:translate-y-1"
                }`}
                style={{
                  transformOrigin: "center center",
                  transition: isPressed
                    ? "transform 0.08s ease-out, filter 0.08s ease-out, box-shadow 0.08s ease-out"
                    : "transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.15), filter 0.2s ease, box-shadow 0.2s ease, border-color 0.15s ease",
                }}
              >
                {/* CATEGORY 1: GARMENT CARD */}
                {category === "garment" && (() => {
                  const isSelected = outfit.garmentId === item.id;
                  const imgUrl =
                    GARMENT_IMAGES[item.id] ||
                    GARMENT_IMAGES[item.id.replace("ao-", "")] ||
                    DEFAULT_GARMENT_FALLBACK;
                  const promptKeyword = GARMENT_PROMPT_MAP[item.id] || "";

                  return (
                    <div className="relative w-full h-full overflow-hidden pointer-events-none">
                      {/* Full Vertical Image */}
                      <img
                        src={imgUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== DEFAULT_GARMENT_FALLBACK) {
                            target.src = DEFAULT_GARMENT_FALLBACK;
                          }
                        }}
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Dark Gradient Overlay for Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-45% to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-semibold shadow-xs">
                          {item.dynasty}
                        </span>
                        {isSelected && isFront ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đang mặc
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/90 border border-white/20 font-medium shadow-xs backdrop-blur-xs">
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Bottom Overlaid Content */}
                      <div className="absolute bottom-0 inset-x-0 p-3.5 flex flex-col justify-end text-white z-10">
                        <div className="mb-1">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-amber-200 border border-amber-400/20 backdrop-blur-xs truncate max-w-[180px]">
                              {promptKeyword}
                            </span>
                          </div>
                          <h3 className="font-serif text-base font-bold text-amber-100 leading-snug drop-shadow-sm">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-white/85 mt-1 line-clamp-2 leading-relaxed drop-shadow-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CATEGORY 2: COLOR CARD */}
                {category === "color" && (() => {
                  const isSelected = outfit.colorId === item.id;

                  return (
                    <div
                      className="relative w-full h-full overflow-hidden pointer-events-none flex flex-col justify-between"
                      style={{
                        background: `radial-gradient(circle at 50% 38%, ${item.hex}ee, ${item.hex} 55%, #181818 120%)`,
                      }}
                    >
                      {/* Dark gradient at bottom for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 via-45% to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="relative top-0 inset-x-0 p-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/20 font-bold shadow-xs">
                          Ngũ Hành: {item.element}
                        </span>
                        {isSelected && isFront ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold shadow-xs transition-all">
                            Đang dùng
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white/90 border border-white/20 font-semibold shadow-xs">
                            {item.hex}
                          </span>
                        )}
                      </div>

                      {/* Silk Sheen Circle Swatch in Center (No checkmark tick) */}
                      <div className="relative flex items-center justify-center my-auto z-10">
                        <div
                          className="w-24 h-24 rounded-full border-4 border-white/80 shadow-2xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundColor: item.hex }}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* Bottom Overlaid Content */}
                      <div className="relative bottom-0 inset-x-0 p-3.5 flex flex-col justify-end text-white z-10">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-base font-bold text-amber-100 leading-snug drop-shadow-sm">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-[11px] text-white/85 mt-1 line-clamp-2 leading-relaxed italic drop-shadow-xs">
                            &ldquo;{item.meaning}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}



                {/* CATEGORY 4: OCCASION CARD */}
                {category === "occasion" && (() => {
                  const isSelected = outfit.occasionId === item.id;
                  const imgUrl =
                    OCCASION_IMAGES[item.id] ||
                    DEFAULT_OCCASION_FALLBACK;

                  return (
                    <div className="relative w-full h-full overflow-hidden pointer-events-none">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== DEFAULT_OCCASION_FALLBACK) {
                            target.src = DEFAULT_OCCASION_FALLBACK;
                          }
                        }}
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-45% to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-bold shadow-xs">
                          {item.formalityLevel}
                        </span>
                        {isSelected && isFront ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đang chọn
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/90 font-medium backdrop-blur-xs border border-white/20">
                            Chưa chọn
                          </span>
                        )}
                      </div>

                      {/* Bottom Overlaid Content */}
                      <div className="absolute bottom-0 inset-x-0 p-3.5 flex flex-col justify-end text-white z-10">
                        <div>
                          <h3 className="font-serif text-base font-bold text-amber-100 leading-snug drop-shadow-sm">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-white/85 mt-1 line-clamp-2 leading-relaxed drop-shadow-xs">
                            {item.weatherHint}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CATEGORY 5: STYLE CARD */}
                {category === "style" && (() => {
                  const isSelected = outfit.styleId === item.id;
                  const imgUrl =
                    STYLE_IMAGES[item.id] ||
                    DEFAULT_STYLE_FALLBACK;

                  return (
                    <div className="relative w-full h-full overflow-hidden pointer-events-none">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== DEFAULT_STYLE_FALLBACK) {
                            target.src = DEFAULT_STYLE_FALLBACK;
                          }
                        }}
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-45% to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-bold shadow-xs">
                          Gen Z Vibe
                        </span>
                        {isSelected && isFront ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Đang chọn
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/90 font-medium backdrop-blur-xs border border-white/20">
                            Chưa chọn
                          </span>
                        )}
                      </div>

                      {/* Bottom Overlaid Content */}
                      <div className="absolute bottom-0 inset-x-0 p-3.5 flex flex-col justify-end text-white z-10">
                        <div>
                          <h3 className="font-serif text-base font-bold text-amber-100 leading-snug drop-shadow-sm">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-white/85 mt-1 line-clamp-2 leading-relaxed drop-shadow-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
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
            onClick={() => {
              setActiveIndex(idx);
              applySelectionForIndex(idx);
            }}
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
        <span>👉 Vuốt ngang để tự động chọn &amp; phối đồ ngay</span>
      </div>
    </div>
  );
};

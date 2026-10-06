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
} from "lucide-react";

export const GARMENT_IMAGES: Record<string, string> = {
  "ao-dai-cach-tan":
    "https://images.unsplash.com/photo-1643030080539-b411caf44c37?auto=format&fit=crop&w=800&q=80",
  "ao-dai-truyen-thong":
    "https://images.unsplash.com/photo-1673233816654-e0c17cc39920?auto=format&fit=crop&w=800&q=80",
  "ao-ngu-than-tay-chen":
    "https://images.unsplash.com/photo-1672958431362-e6e737c73d9d?auto=format&fit=crop&w=800&q=80",
  "ao-tac-ngu-than-tay-thung":
    "https://images.unsplash.com/photo-1672958431327-047f3b8f1082?auto=format&fit=crop&w=800&q=80",
  "ao-tu-than":
    "https://images.unsplash.com/photo-1672958431309-843d4847d066?auto=format&fit=crop&w=800&q=80",
  "ao-nhat-binh":
    "https://images.unsplash.com/photo-1732321588647-75e396917646?auto=format&fit=crop&w=800&q=80",
  "ao-giao-linh":
    "https://images.unsplash.com/photo-1767603087616-b7620d39a42f?auto=format&fit=crop&w=800&q=80",
  "ao-lap-linh":
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
  // Aliases
  "ngu-than-tay-chen":
    "https://images.unsplash.com/photo-1672958431362-e6e737c73d9d?auto=format&fit=crop&w=800&q=80",
  "giao-linh":
    "https://images.unsplash.com/photo-1767603087616-b7620d39a42f?auto=format&fit=crop&w=800&q=80",
  "tu-than":
    "https://images.unsplash.com/photo-1672958431309-843d4847d066?auto=format&fit=crop&w=800&q=80",
  "nhat-binh":
    "https://images.unsplash.com/photo-1732321588647-75e396917646?auto=format&fit=crop&w=800&q=80",
  "lemur-1930":
    "https://images.unsplash.com/photo-1643030080539-b411caf44c37?auto=format&fit=crop&w=800&q=80",
  "ao-tac":
    "https://images.unsplash.com/photo-1672958431327-047f3b8f1082?auto=format&fit=crop&w=800&q=80",
};

export const ACCESSORY_IMAGES: Record<string, string> = {
  "man-modern": "/accessories/man-modern.jpg",
  "silver-choker": "/accessories/silver-choker.jpg",
  "tui-gam": "/accessories/tui-gam.jpg",
  "sneaker-chunky":
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
  "retro-sunglasses":
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  "tote-coi":
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
  "non-quai-thao-mini":
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=80",
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
  "cyber-retro":
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
  "vintage-academia":
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_GARMENT_FALLBACK =
  "https://images.unsplash.com/photo-1673233816654-e0c17cc39920?auto=format&fit=crop&w=800&q=80";
const DEFAULT_ACCESSORY_FALLBACK =
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80";
const DEFAULT_OCCASION_FALLBACK =
  "https://images.unsplash.com/photo-1563354860-799d15199ac3?auto=format&fit=crop&w=700&q=80";
const DEFAULT_STYLE_FALLBACK =
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80";

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
          const isPressed = pressedItemId === item.id;
          const isSelected =
            category === "garment"
              ? outfit.garmentId === item.id
              : category === "color"
              ? outfit.colorId === item.id
              : category === "accessory"
              ? selectedAccessoryIds.includes(item.id)
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
                    <div className="flex flex-col h-full pointer-events-none">
                      {/* Top Image Banner */}
                      <div className="relative h-[200px] w-full bg-stone-100 overflow-hidden shrink-0 border-b border-border-bronze-light/40">
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
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-semibold shadow-xs">
                            {item.dynasty}
                          </span>
                          {isSelected && isFront ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Đang mặc
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-white/80 border border-white/10 font-medium shadow-xs">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-white/95 backdrop-blur-xs truncate max-w-[170px]">
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
                          <p className="text-[11px] text-text-warm-gray mt-1 line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Clean Status Footer */}
                        <div className="pt-2 border-t border-border-bronze-light/40 flex items-center justify-between text-[11px]">
                          <span
                            className={`font-bold transition-colors ${
                              isSelected && isFront ? "text-vermilion-red" : "text-text-warm-gray"
                            }`}
                          >
                            {isSelected && isFront ? "✓ Đang chọn mặc" : "Vuốt sang để chọn"}
                          </span>
                          <span className="text-[10px] text-bronze-gold font-mono font-medium">
                            {item.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CATEGORY 2: COLOR CARD */}
                {category === "color" && (() => {
                  const isSelected = outfit.colorId === item.id;

                  return (
                    <div className="flex flex-col h-full pointer-events-none">
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
                          {isSelected && isFront ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Đang dùng
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/90 border border-white/20 font-semibold shadow-xs">
                              {item.hex}
                            </span>
                          )}
                        </div>

                        {/* Silk Sheen Circle Swatch */}
                        <div
                          className="w-20 h-20 rounded-full border-4 border-white/70 shadow-2xl flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundColor: item.hex }}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                          {isSelected && isFront && (
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
                            {isSelected && isFront && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red/10 text-vermilion-red font-bold border border-vermilion-red/20">
                                Đang dùng
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-warm-gray mt-1.5 line-clamp-3 leading-relaxed italic">
                            &ldquo;{item.meaning}&rdquo;
                          </p>
                        </div>

                        {/* Clean Status Footer */}
                        <div className="pt-2 border-t border-border-bronze-light/40 flex items-center justify-between text-[11px]">
                          <span
                            className={`font-bold transition-colors ${
                              isSelected && isFront ? "text-vermilion-red" : "text-text-warm-gray"
                            }`}
                          >
                            {isSelected && isFront ? "✓ Đã áp dụng sắc màu" : "Vuốt sang để chọn"}
                          </span>
                          <span className="text-[10px] text-bronze-gold font-mono font-bold">
                            {item.hex}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CATEGORY 3: ACCESSORY CARD (WITH REAL IMAGES) */}
                {category === "accessory" && (() => {
                  const isSelected = selectedAccessoryIds.includes(item.id);
                  const imgUrl =
                    ACCESSORY_IMAGES[item.id] ||
                    DEFAULT_ACCESSORY_FALLBACK;

                  return (
                    <div className="flex flex-col h-full pointer-events-none">
                      {/* Top Real Image Banner */}
                      <div className="relative h-[200px] w-full bg-stone-100 overflow-hidden shrink-0 border-b border-border-bronze-light/40">
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
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/20 font-bold shadow-xs capitalize">
                            {item.type}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Đã thêm
                            </span>
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
                          </div>
                          <p className="text-[11px] text-text-warm-gray mt-1 line-clamp-2 leading-relaxed">
                            {item.culturalNote}
                          </p>
                        </div>

                        {/* Status / Action Pill */}
                        <div
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                            isSelected
                              ? "bg-vermilion-red text-white shadow-xs"
                              : "bg-surface-pure border-2 border-border-bronze-light/80 text-text-charcoal group-hover:border-bronze-gold group-hover:bg-paper-cream"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              Đã chọn (Bấm để gỡ)
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-bronze-gold" />
                              + Bấm vào thẻ để thêm
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CATEGORY 4: OCCASION CARD (WITH REAL IMAGES) */}
                {category === "occasion" && (() => {
                  const isSelected = outfit.occasionId === item.id;
                  const imgUrl =
                    OCCASION_IMAGES[item.id] ||
                    DEFAULT_OCCASION_FALLBACK;

                  return (
                    <div className="flex flex-col h-full pointer-events-none">
                      {/* Top Real Scenic Banner */}
                      <div className="relative h-[200px] w-full bg-stone-100 overflow-hidden shrink-0 border-b border-border-bronze-light/40">
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
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-bold shadow-xs">
                            {item.formalityLevel}
                          </span>
                          {isSelected && isFront ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                              <Check className="w-3 h-3 stroke-[3]" />
                              Đang chọn
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/80 font-medium backdrop-blur-xs">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                        <div>
                          <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-text-warm-gray mt-1 line-clamp-3 leading-relaxed">
                            {item.weatherHint}
                          </p>
                        </div>

                        {/* Clean Status Footer */}
                        <div className="pt-2 border-t border-border-bronze-light/40 flex items-center justify-between text-[11px]">
                          <span
                            className={`font-bold transition-colors ${
                              isSelected && isFront ? "text-vermilion-red" : "text-text-warm-gray"
                            }`}
                          >
                            {isSelected && isFront ? "✓ Đã đặt bối cảnh này" : "Vuốt sang để chọn"}
                          </span>
                          <span className="text-[10px] text-bronze-gold font-mono font-medium">
                            {item.formalityLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* CATEGORY 5: STYLE CARD (WITH REAL IMAGES) */}
                {category === "style" && (() => {
                  const isSelected = outfit.styleId === item.id;
                  const imgUrl =
                    STYLE_IMAGES[item.id] ||
                    DEFAULT_STYLE_FALLBACK;

                  return (
                    <div className="flex flex-col h-full pointer-events-none">
                      {/* Top Real Editorial Style Banner */}
                      <div className="relative h-[200px] w-full bg-stone-100 overflow-hidden shrink-0 border-b border-border-bronze-light/40">
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
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

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
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/80 font-medium backdrop-blur-xs">
                              Chưa chọn
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-paper-cream to-surface-pure">
                        <div>
                          <h3 className="font-serif text-sm font-bold text-text-charcoal leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-text-warm-gray mt-1 line-clamp-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Clean Status Footer */}
                        <div className="pt-2 border-t border-border-bronze-light/40 flex items-center justify-between text-[11px]">
                          <span
                            className={`font-bold transition-colors ${
                              isSelected && isFront ? "text-vermilion-red" : "text-text-warm-gray"
                            }`}
                          >
                            {isSelected && isFront ? "✓ Đã chọn phong cách này" : "Vuốt sang để chọn"}
                          </span>
                          <span className="text-[10px] text-bronze-gold font-mono font-bold">
                            Gen Z
                          </span>
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

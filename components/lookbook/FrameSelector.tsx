"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import framesData from "@/config/frames.json";
import { Sparkles, Check, ChevronLeft, ChevronRight, ArrowLeftRight } from "lucide-react";
import { FrameDecoration } from "./FrameDecoration";

interface FrameSelectorProps {
  selectedFrameId: string;
  onSelectFrame: (id: string) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrameId,
  onSelectFrame,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);

  const total = framesData.length;

  // Sync activeIndex with external selectedFrameId when it changes
  useEffect(() => {
    const idx = framesData.findIndex((f) => f.id === selectedFrameId);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [selectedFrameId]);

  // Apply frame selection with tactile feedback
  const applySelectionForIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= total) return;
      const targetFrame = framesData[targetIndex];
      if (!targetFrame) return;

      setPressedItemId(targetFrame.id);
      setTimeout(() => {
        setPressedItemId(null);
      }, 120);

      onSelectFrame(targetFrame.id);
    },
    [total, onSelectFrame]
  );

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const nextIdx = (activeIndex + 1) % total;
    setActiveIndex(nextIdx);
    applySelectionForIndex(nextIdx);
  }, [total, activeIndex, applySelectionForIndex]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const prevIdx = (activeIndex - 1 + total) % total;
    setActiveIndex(prevIdx);
    applySelectionForIndex(prevIdx);
  }, [total, activeIndex, applySelectionForIndex]);

  // Shortest circular offset
  const getCircularOffset = (index: number, active: number, count: number) => {
    let diff = index - active;
    while (diff > count / 2) diff -= count;
    while (diff < -count / 2) diff += count;
    return diff;
  };

  const handleCardClick = (item: (typeof framesData)[0], offset: number) => {
    if (hasDraggedRef.current) return;

    setPressedItemId(item.id);
    setTimeout(() => {
      setPressedItemId(null);
    }, 120);

    const targetIdx = framesData.findIndex((f) => f.id === item.id);
    if (targetIdx !== -1 && targetIdx !== activeIndex) {
      setActiveIndex(targetIdx);
    }
    onSelectFrame(item.id);
  };

  // Drag and Touch Handling
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

  // 3D Depth Card Transform
  const getCardTransform = (offset: number) => {
    const delta = isDragging ? dragDeltaX : 0;

    if (offset === 0) {
      const tx = delta;
      const rotY = delta * 0.05;
      return {
        transform: `translate3d(${tx}px, 0px, 0px) scale(1) rotateY(${rotY}deg)`,
        zIndex: 30,
        opacity: 1,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 16px 22px rgba(0, 0, 0, 0.12))",
        transition: isDragging
          ? "none"
          : "transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease",
      };
    }

    if (offset === 1) {
      const tx = 60 + delta * 0.35;
      const rotY = -9;
      return {
        transform: `translate3d(${tx}px, 6px, -45px) scale(0.91) rotateY(${rotY}deg)`,
        zIndex: 20,
        opacity: 0.85,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.08))",
        transition: isDragging
          ? "none"
          : "transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease",
      };
    }

    if (offset === -1) {
      const tx = -60 + delta * 0.35;
      const rotY = 9;
      return {
        transform: `translate3d(${tx}px, 6px, -45px) scale(0.91) rotateY(${rotY}deg)`,
        zIndex: 20,
        opacity: 0.85,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 8px 14px rgba(0, 0, 0, 0.08))",
        transition: isDragging
          ? "none"
          : "transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease",
      };
    }

    const dir = offset > 0 ? 1 : -1;
    const tx = dir * (100 + Math.abs(offset) * 20);
    return {
      transform: `translate3d(${tx}px, 12px, -90px) scale(0.82)`,
      zIndex: 10 - Math.abs(offset),
      opacity: 0,
      pointerEvents: "none" as const,
      transition: isDragging ? "none" : "transform 0.35s ease, opacity 0.3s ease",
    };
  };

  return (
    <div className="bg-surface-pure rounded-2xl p-4 sm:p-5 shadow-sm border border-border-bronze-light/60 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-bronze-light/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-vermilion-red" />
          <h3 className="text-sm font-bold text-text-charcoal font-serif">
            Khung Viền Di Sản
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-bronze-gold font-bold">
            {activeIndex + 1}/{total}
          </span>
          <span className="text-[11px] text-text-warm-gray font-mono">
            {total} phong cách
          </span>
        </div>
      </div>

      {/* 3D Depth Card Deck Stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[360px] flex items-center justify-center overflow-hidden select-none touch-pan-y"
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
          aria-label="Khung viền trước"
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
          aria-label="Khung viền kế tiếp"
        >
          <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* Render 3D Stack Cards */}
        {framesData.map((f, index) => {
          const offset = getCircularOffset(index, activeIndex, total);
          const style = getCardTransform(offset);
          const isFront = offset === 0;
          const isPressed = pressedItemId === f.id;
          const isSelected = selectedFrameId === f.id;

          return (
            <div
              key={f.id}
              style={style}
              className="absolute top-2 w-[265px] sm:w-[275px] h-[340px]"
            >
              <div
                onClick={() => handleCardClick(f, offset)}
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
                {/* Visual Frame Presentation Area */}
                <div className="relative w-full h-full overflow-hidden pointer-events-none flex flex-col justify-between bg-stone-900">
                  {/* Background Mockup Canvas with Traditional Texture */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917] via-[#292524] to-[#0c0a09] opacity-95" />
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 40%, ${
                        f.accentColor || "#D4AF37"
                      } 0%, transparent 60%)`,
                    }}
                  />

                  {/* Silhouette Portrait Art in Center to Showcase Frame Effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-28 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-2 text-center backdrop-blur-2xs">
                      <span className="material-symbols-outlined text-[32px] text-amber-200/60 mb-1">
                        portrait
                      </span>
                      <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">
                        LOOKBOOK
                      </span>
                    </div>
                  </div>

                  {/* Render the Exact Live Decorative Frame */}
                  <FrameDecoration
                    theme={f.theme}
                    borderColor={f.borderColor}
                    accentColor={f.accentColor}
                  />

                  {/* Dark Gradient Overlay for Bottom Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-50% to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-30">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-semibold shadow-xs">
                      {f.theme === "none" ? "Nguyên Bản" : f.theme.toUpperCase()}
                    </span>
                    {isSelected && isFront ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Đang chọn
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/90 border border-white/20 font-medium shadow-xs backdrop-blur-xs">
                        Chưa chọn
                      </span>
                    )}
                  </div>

                  {/* Bottom Overlaid Content */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 flex flex-col justify-end text-white z-30">
                    <div className="mb-0.5">
                      <h3 className="font-serif text-base font-bold text-amber-100 leading-snug drop-shadow-sm">
                        {f.name}
                      </h3>
                      <p className="text-[11px] text-white/85 mt-1 leading-relaxed drop-shadow-xs">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Dots Indicator Bar */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5">
        {framesData.map((_, idx) => (
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
            aria-label={`Chuyển đến khung viền ${idx + 1}`}
          />
        ))}
      </div>

      {/* Swipe Guidance Hint */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-warm-gray font-medium pt-0.5">
        <ArrowLeftRight className="w-3 h-3 text-bronze-gold animate-pulse" />
        <span>👉 Vuốt ngang để chọn khung viền di sản</span>
      </div>
    </div>
  );
};

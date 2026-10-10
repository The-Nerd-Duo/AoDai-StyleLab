"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  User,
  Sparkles,
  ArrowLeftRight,
} from "lucide-react";

export interface PersonaItem {
  id: string;
  name: string;
  shortName: string;
  gender: "female" | "male";
  genderLabel: string;
  vibe: string;
  image: string;
  description: string;
  highlight: string;
}

export const PERSONAS: PersonaItem[] = [
  {
    id: "female-modern",
    name: "Nhân Vật Nữ",
    shortName: "Nữ",
    gender: "female",
    genderLabel: "Nữ • Female",
    vibe: "Năng động, thanh lịch, hiện đại",
    image: "/personas/female-modern.jpg",
    description:
      "Vóc dáng yêu kiều, thanh thoát. Tôn vinh trọn vẹn nét duyên dáng của Áo Dài Cách Tân, Áo Nhật Bình và Áo Tứ Thân.",
    highlight: "Dáng chuẩn Á Đông • Áo Dài & Nhật Bình",
  },
  {
    id: "male-modern",
    name: "Nhân Vật Nam",
    shortName: "Nam",
    gender: "male",
    genderLabel: "Nam • Male",
    vibe: "Cá tính, phóng khoáng, hiện đại",
    image: "/personas/male-modern.jpg",
    description:
      "Khí chất đĩnh đạc, phong độ và lịch lãm. Tôn lên nét trang nghiêm hào hoa của Áo Ngũ Thân Tay Chẽn và Áo Tấc.",
    highlight: "Khí chất đĩnh đạc • Ngũ Thân & Áo Tấc",
  },
];

interface PersonaSelectorProps {
  selectedPersonaId: string;
  onSelectPersona: (id: string) => void;
  onConfirm: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersonaId,
  onSelectPersona,
  onConfirm,
}) => {
  const [activeIndex, setActiveIndex] = useState(() =>
    selectedPersonaId === "male-modern" ? 1 : 0
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);

  // Sync activeIndex with selectedPersonaId on mount/change
  useEffect(() => {
    if (!selectedPersonaId) return;
    const idx = PERSONAS.findIndex((p) => p.id === selectedPersonaId);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [selectedPersonaId]);

  // Apply persona selection
  const applyPersonaSelection = useCallback(
    (idx: number) => {
      const item = PERSONAS[idx];
      if (!item) return;
      onSelectPersona(item.id);
    },
    [onSelectPersona]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % PERSONAS.length;
    setActiveIndex(nextIdx);
    applyPersonaSelection(nextIdx);
  }, [activeIndex, applyPersonaSelection]);

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + PERSONAS.length) % PERSONAS.length;
    setActiveIndex(prevIdx);
    applyPersonaSelection(prevIdx);
  }, [activeIndex, applyPersonaSelection]);

  // Circular offset calculation for 2 cards
  const getOffset = (index: number) => {
    if (index === activeIndex) return 0;
    return index > activeIndex ? 1 : -1;
  };

  const handleCardClick = (item: PersonaItem, offset: number) => {
    if (hasDraggedRef.current) return;

    const idx = PERSONAS.findIndex((p) => p.id === item.id);
    if (idx !== -1) {
      setActiveIndex(idx);
      applyPersonaSelection(idx);
    }
  };

  // Drag & Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
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

  // Card 3D transform for 2-item deck
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
          : "transform 0.44s cubic-bezier(0.25, 0.85, 0.35, 1), opacity 0.38s ease",
      };
    }

    if (offset === 1) {
      const tx = 56 + delta * 0.35;
      const rotY = -8;
      return {
        transform: `translate3d(${tx}px, 6px, -45px) scale(0.9) rotateY(${rotY}deg)`,
        zIndex: 20,
        opacity: 0.82,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.06))",
        transition: isDragging
          ? "none"
          : "transform 0.44s cubic-bezier(0.25, 0.85, 0.35, 1), opacity 0.38s ease",
      };
    }

    if (offset === -1) {
      const tx = -56 + delta * 0.35;
      const rotY = 8;
      return {
        transform: `translate3d(${tx}px, 6px, -45px) scale(0.9) rotateY(${rotY}deg)`,
        zIndex: 20,
        opacity: 0.82,
        pointerEvents: "auto" as const,
        filter: "drop-shadow(0 8px 12px rgba(0, 0, 0, 0.06))",
        transition: isDragging
          ? "none"
          : "transform 0.44s cubic-bezier(0.25, 0.85, 0.35, 1), opacity 0.38s ease",
      };
    }

    return {
      transform: "translate3d(0, 0, -100px) scale(0.7)",
      zIndex: 0,
      opacity: 0,
      pointerEvents: "none" as const,
    };
  };

  const currentPersona = PERSONAS[activeIndex] || PERSONAS[0];

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Subheader info */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4 text-vermilion-red" />
          <span className="font-mono text-xs font-bold text-text-charcoal uppercase tracking-wider">
            Chọn Diện Mạo Đại Diện
          </span>
        </div>
        <span className="text-[11px] font-mono text-bronze-gold font-bold">
          {activeIndex === 0 ? "1/2 Nữ" : "2/2 Nam"}
        </span>
      </div>

      {/* Swipeable 3D Deck */}
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
          className="absolute left-1 z-40 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-border-bronze-light shadow-md flex items-center justify-center text-text-charcoal hover:bg-paper-cream hover:scale-110 active:scale-95 transition-all focus:outline-none"
          aria-label="Nhân vật trước"
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
          className="absolute right-1 z-40 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-border-bronze-light shadow-md flex items-center justify-center text-text-charcoal hover:bg-paper-cream hover:scale-110 active:scale-95 transition-all focus:outline-none"
          aria-label="Nhân vật kế tiếp"
        >
          <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>

        {/* 2 Persona Cards */}
        {PERSONAS.map((item, index) => {
          const offset = getOffset(index);
          const style = getCardTransform(offset);
          const isFront = offset === 0;
          const isSelected = Boolean(selectedPersonaId && selectedPersonaId === item.id && isFront);

          return (
            <div
              key={item.id}
              style={style}
              className="absolute top-2 w-[275px] sm:w-[285px] h-[375px]"
            >
              <div
                onClick={() => handleCardClick(item, offset)}
                style={{
                  transformOrigin: "center center",
                }}
                className={`w-full h-full rounded-2xl bg-surface-pure border-2 flex flex-col overflow-hidden select-none cursor-pointer group active:scale-[0.98] active:translate-y-0.5 transition-all duration-200 ease-out ${isFront
                    ? isSelected
                      ? "border-vermilion-red/80 shadow-xl ring-2 ring-vermilion-red/25"
                      : "border-border-bronze-light shadow-md hover:border-bronze-gold/60"
                    : "border-border-bronze-light/70 shadow-md hover:border-bronze-gold/60 opacity-85 hover:opacity-95"
                  }`}
              >
                <div className="relative w-full h-full overflow-hidden pointer-events-none">
                  {/* Full Vertical Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-45% to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-amber-200 border border-amber-300/30 font-semibold shadow-xs">
                      {item.genderLabel}
                    </span>
                    {isSelected && isFront ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vermilion-red text-white font-bold flex items-center gap-1 shadow-xs transition-all">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Đang chọn
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/50 text-white/90 border border-white/20 font-medium shadow-xs backdrop-blur-xs">
                        {isFront && !selectedPersonaId ? "Chưa chọn" : item.vibe.split(",")[0]}
                      </span>
                    )}
                  </div>

                  {/* Bottom Overlaid Content */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 flex flex-col justify-end text-white z-10">
                    <div className="mb-1">
                      <h3 className="font-serif text-base font-bold text-amber-100 leading-snug drop-shadow-sm">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe Guidance Hint */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-text-warm-gray font-medium">
        <ArrowLeftRight className="w-3 h-3 text-bronze-gold animate-pulse" />
        <span>Nhấn vào thẻ hoặc vuốt ngang để chọn diện mạo Nam hoặc Nữ</span>
      </div>

      {/* Primary CTA Confirm Button */}
      <button
        type="button"
        disabled={!selectedPersonaId}
        onClick={onConfirm}
        className={`w-full py-3 px-4 rounded-xl font-serif font-bold text-sm shadow-md transition-all duration-150 flex items-center justify-center gap-2 ring-1 ${
          selectedPersonaId
            ? "bg-gradient-to-r from-vermilion-red via-[#d33a29] to-[#bf2e1f] hover:brightness-105 text-white shadow-md hover:shadow-lg active:scale-[0.98] ring-white/20 cursor-pointer"
            : "bg-stone-200 dark:bg-stone-800 text-stone-400 border border-stone-300/40 cursor-not-allowed opacity-60"
        }`}
      >
        <span>{selectedPersonaId ? "Sang phần phối đồ" : "Vui lòng chọn nhân vật trước"}</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
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
  customAvatarUrl?: string | null;
  onUploadCustomAvatar?: (dataUrl: string) => void;
  onConfirm: () => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersonaId,
  onSelectPersona,
  customAvatarUrl,
  onUploadCustomAvatar,
  onConfirm,
}) => {
  const [activeIndex, setActiveIndex] = useState(() =>
    selectedPersonaId === "male-modern" ? 1 : 0
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync activeIndex with selectedPersonaId on mount/change
  useEffect(() => {
    const idx = PERSONAS.findIndex((p) => p.id === selectedPersonaId);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [selectedPersonaId]);

  // Apply persona selection with snappy press-down feedback
  const applyPersonaSelection = useCallback(
    (idx: number) => {
      const item = PERSONAS[idx];
      if (!item) return;

      // Trigger crisp press-down feedback animation
      setPressedItemId(item.id);
      setTimeout(() => {
        setPressedItemId(null);
      }, 120);

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
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease",
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
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease",
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
          : "transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.3s ease",
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
        className="relative w-full h-[375px] flex items-center justify-center overflow-hidden select-none touch-pan-y"
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
          const isSelected = selectedPersonaId === item.id && isFront;
          const isPressed = pressedItemId === item.id;

          return (
            <div
              key={item.id}
              style={style}
              className="absolute top-2 w-[270px] sm:w-[285px] h-[355px]"
            >
              <div
                onClick={() => handleCardClick(item, offset)}
                style={{
                  transformOrigin: "center center",
                  transition: isPressed
                    ? "transform 0.08s ease-out, filter 0.08s ease-out"
                    : "transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.15), filter 0.2s ease, border-color 0.15s ease",
                }}
                className={`w-full h-full rounded-2xl bg-surface-pure border-2 flex flex-col overflow-hidden select-none cursor-pointer ${
                  isFront
                    ? isSelected
                      ? "border-vermilion-red shadow-xl ring-2 ring-vermilion-red/30"
                      : "border-border-bronze-light shadow-md hover:border-bronze-gold"
                    : "border-border-bronze-light/70 shadow-sm opacity-85 hover:opacity-95"
                } ${
                  isPressed
                    ? "scale-[0.96] translate-y-1.5 shadow-sm ring-2 ring-vermilion-red/60 brightness-95"
                    : "active:scale-[0.97] active:translate-y-1"
                }`}
              >
                {/* Image Section */}
                <div className="relative h-[225px] w-full bg-stone-100 overflow-hidden shrink-0">
                  <img
                    src={customAvatarUrl && isSelected ? customAvatarUrl : item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Gender Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wide flex items-center gap-1">
                    <span>{item.genderLabel}</span>
                  </div>

                  {/* Selection Status Badge: Flips between Chưa chọn and Đang chọn */}
                  {isSelected ? (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-vermilion-red text-white text-[10px] font-bold shadow-md flex items-center gap-1 ring-1 ring-white/30 animate-scaleIn transition-all">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Đang chọn</span>
                    </div>
                  ) : (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/50 text-white/80 text-[10px] font-medium backdrop-blur-xs border border-white/10 transition-all">
                      <span>Chưa chọn</span>
                    </div>
                  )}

                  {/* Bottom Image Overlay with Name & Vibe */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="font-serif text-sm font-bold drop-shadow-md">
                      {item.name}
                    </span>
                    <span className="text-[10px] bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md font-medium">
                      {item.vibe.split(",")[0]}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between bg-surface-pure">
                  <div>
                    <p className="text-[11px] text-text-charcoal font-medium leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] text-bronze-gold font-semibold">
                      <Sparkles className="w-3 h-3 text-bronze-gold shrink-0" />
                      <span className="truncate">{item.highlight}</span>
                    </div>
                  </div>

                  {/* Clean status feedback line */}
                  <div className="pt-2 border-t border-border-bronze-light/40 flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold transition-colors ${
                        isSelected ? "text-vermilion-red" : "text-text-warm-gray"
                      }`}
                    >
                      {isSelected ? "✓ Đã chọn diện mạo này" : "Vuốt sang để chọn"}
                    </span>
                    <span className="text-[10px] text-bronze-gold font-mono">
                      {item.gender === "female" ? "Thục nữ" : "Tuấn tú"}
                    </span>
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
        <span>Vuốt ngang để tự động chọn diện mạo Nam hoặc Nữ</span>
      </div>

      {/* Upload Custom User Avatar */}
      <div className="p-2.5 rounded-xl bg-paper-cream/80 border border-border-bronze-light/50 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text-charcoal flex items-center gap-1.5 text-[11px]">
            <Upload className="w-3.5 h-3.5 text-bronze-gold shrink-0" />
            Tùy chọn tải ảnh khuôn mặt cá nhân:
          </span>
          {customAvatarUrl && (
            <button
              type="button"
              onClick={() => onUploadCustomAvatar?.("")}
              className="text-[10px] text-vermilion-red hover:underline font-semibold"
            >
              Gỡ ảnh riêng
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
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
            className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              customAvatarUrl
                ? "bg-guardrail-pass-surface border-guardrail-pass/40 text-guardrail-pass shadow-2xs"
                : "bg-surface-pure border-border-bronze-light/70 text-text-charcoal hover:bg-paper-cream shadow-2xs"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="truncate">
              {customAvatarUrl
                ? "✓ Đã tải ảnh riêng (Nhấp để đổi ảnh)"
                : "Tải ảnh từ máy để thử khuôn mặt"}
            </span>
          </button>
          {customAvatarUrl && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-border-bronze-light shrink-0">
              <img
                src={customAvatarUrl}
                alt="Custom avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Primary CTA Confirm Button */}
      <button
        type="button"
        onClick={onConfirm}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-vermilion-red via-[#d33a29] to-[#bf2e1f] hover:brightness-105 text-white font-serif font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.98] ring-1 ring-white/20"
      >
        <span>
          Xác nhận {currentPersona.shortName === "Nữ" ? "Nhân Vật Nữ" : "Nhân Vật Nam"} &amp; Sang phần phối đồ
        </span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

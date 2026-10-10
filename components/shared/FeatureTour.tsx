"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Lightbulb,
  Compass,
  Shirt,
  Camera,
  Layers,
  BookOpen,
} from "lucide-react";

export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  highlightTip?: string;
  preferredPlacement?: "top" | "bottom" | "left" | "right";
  padding?: number;
  radius?: number;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "step-mix-match",
    targetSelector: "#mix-match-selector",
    title: "1. Chọn Nhân Vật & Cổ Phục",
    tag: "Studio Mix & Match",
    icon: Shirt,
    description:
      "Bắt đầu hành trình bằng việc chọn nhân vật đại diện (Nam/Nữ) và tùy biến 5 thành phần cốt lõi: Dòng cổ phục (Áo dài, Nhật bình, Giao lĩnh, Áo tấc...), Màu sắc truyền thống, Phụ kiện, Bối cảnh và Phong cách phục dựng.",
    highlightTip: "Mẹo: Hãy hoàn thành đủ 5 mục để kích hoạt nút Tạo ảnh AI thực tế!",
    preferredPlacement: "right",
    padding: 10,
    radius: 18,
  },
  {
    id: "step-preview-workspace",
    targetSelector: "#preview-workspace",
    title: "2. Khung Trưng Bày & Tạo Ảnh AI",
    tag: "Trí Tuệ Nhân Tạo",
    icon: Camera,
    description:
      "Nơi chiêm ngưỡng bộ phối và kích hoạt công nghệ tạo ảnh AI. Sau khi chọn đủ 5 tùy chọn, bấm nút 'Tạo Ảnh AI Thực Tế' để dệt nên bức ảnh sống động, giữ trọn nét trang nghiêm và đường nét di sản Việt.",
    highlightTip: "Bạn có thể nhấp vào ảnh kết quả để xem toàn màn hình độ phân giải cao.",
    preferredPlacement: "left",
    padding: 10,
    radius: 18,
  },
  {
    id: "step-lookbook-panel",
    targetSelector: "#lookbook-panel",
    title: "3. Thẻ Lookbook 9:16 & Chia Sẻ",
    tag: "Đóng Gói & Xuất Thẻ",
    icon: Layers,
    description:
      "Tác phẩm của bạn được đóng gói thành thẻ bài thời trang chuẩn tỷ lệ 9:16. Bạn có thể chọn các hoa văn khung viền cung đình, tải thẻ về máy hoặc quét mã QR độc bản để chia sẻ nhanh cho bạn bè.",
    highlightTip: "Mã QR tự động cập nhật ngay khi ảnh AI sẵn sàng mà không cần đăng ký phức tạp.",
    preferredPlacement: "left",
    padding: 10,
    radius: 18,
  },
  {
    id: "step-cultural-advisor",
    targetSelector: "#cultural-advisor",
    title: "4. Cố Vấn Hòa Hợp Văn Hóa AI",
    tag: "Kiểm Định Điển Chế",
    icon: BookOpen,
    description:
      "Hệ thống AI tự động đối chiếu trang phục bạn chọn với điển chế cổ nhân, thư tịch triều Nguyễn và Lê triều. Chấm điểm độ hòa hợp và đưa ra lời bình chuyên sâu về ý nghĩa hoa văn, hoa sắc.",
    highlightTip: "Giúp bạn hiểu sâu nguồn gốc lịch sử và cách mặc chuẩn lễ nghi truyền thống.",
    preferredPlacement: "bottom",
    padding: 10,
    radius: 18,
  },
  {
    id: "step-header-nav",
    targetSelector: "#header-nav",
    title: "5. Bách Khoa Di Sản & Bộ Sưu Tập",
    tag: "Khám Phá Sâu Rộng",
    icon: Compass,
    description:
      "Mở rộng tri thức tại 'Bách khoa Di sản' với Trợ lý AI giải đáp lịch sử, hoặc ghé 'Bộ sưu tập Lookbook' để remix và thử lại các bản phối di sản đặc sắc từ cộng đồng sáng tạo.",
    highlightTip: "Bạn luôn có thể bấm nút 'Hướng dẫn' ở góc trên để mở lại hướng dẫn này bất kỳ lúc nào!",
    preferredPlacement: "bottom",
    padding: 8,
    radius: 9999,
  },
];

const STORAGE_TOUR_KEY = "vietphuc_tour_completed";

export interface FeatureTourProps {
  autoStartDelay?: number;
}

// Calculate exact coordinates for any given step
function measureStep(stepIdx: number, cardEl: HTMLElement | null) {
  if (typeof window === "undefined" || stepIdx < 0 || stepIdx >= TOUR_STEPS.length) {
    return null;
  }

  const step = TOUR_STEPS[stepIdx];
  const targetEl = document.querySelector(step.targetSelector) as HTMLElement | null;

  if (!targetEl) return null;

  const rect = targetEl.getBoundingClientRect();
  const pad = step.padding ?? 10;
  const rad = step.radius ?? 16;

  const spotX = Math.max(0, rect.left - pad);
  const spotY = Math.max(0, rect.top - pad);
  const spotW = rect.width + pad * 2;
  const spotH = rect.height + pad * 2;

  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const cardW = Math.min(380, winW - 32);
  const cardH = cardEl?.offsetHeight || 260;

  let targetPlacement: "top" | "bottom" | "left" | "right" =
    step.preferredPlacement || "bottom";

  const isMobile = winW < 768;

  if (isMobile) {
    const spaceBelow = winH - (spotY + spotH) - 16;
    const spaceAbove = spotY - 16;
    targetPlacement = spaceBelow >= cardH || spaceBelow >= spaceAbove ? "bottom" : "top";
  } else {
    const spaceRight = winW - (spotX + spotW) - 20;
    const spaceLeft = spotX - 20;
    const spaceTop = spotY - 20;
    const spaceBottom = winH - (spotY + spotH) - 20;

    if (targetPlacement === "right") {
      if (spaceRight < cardW) {
        targetPlacement = spaceLeft >= cardW ? "left" : spaceBottom >= cardH ? "bottom" : "top";
      }
    } else if (targetPlacement === "left") {
      if (spaceLeft < cardW) {
        targetPlacement = spaceRight >= cardW ? "right" : spaceBottom >= cardH ? "bottom" : "top";
      }
    } else if (targetPlacement === "top") {
      if (spaceTop < cardH && spaceBottom >= cardH) {
        targetPlacement = "bottom";
      }
    } else if (targetPlacement === "bottom") {
      if (spaceBottom < cardH && spaceTop >= cardH) {
        targetPlacement = "top";
      }
    }
  }

  let finalX = 0;
  let finalY = 0;

  if (targetPlacement === "right") {
    finalX = spotX + spotW + 16;
    finalY = spotY + (spotH - cardH) / 2;
  } else if (targetPlacement === "left") {
    finalX = spotX - cardW - 16;
    finalY = spotY + (spotH - cardH) / 2;
  } else if (targetPlacement === "top") {
    finalX = spotX + (spotW - cardW) / 2;
    finalY = spotY - cardH - 16;
  } else {
    finalX = spotX + (spotW - cardW) / 2;
    finalY = spotY + spotH + 16;
  }

  finalX = Math.max(16, Math.min(finalX, winW - cardW - 16));
  finalY = Math.max(16, Math.min(finalY, winH - cardH - 16));

  return {
    cutout: {
      x: spotX,
      y: spotY,
      width: spotW,
      height: spotH,
      radius: rad,
    },
    cardPos: {
      x: finalX,
      y: finalY,
      placement: targetPlacement,
    },
  };
}

export const FeatureTour: React.FC<FeatureTourProps> = ({ autoStartDelay = 700 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isInitialEntry, setIsInitialEntry] = useState(true);
  const [isFadedIn, setIsFadedIn] = useState(false);

  const [cutout, setCutout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    radius: 16,
  });

  const [cardPos, setCardPos] = useState({
    x: 0,
    y: 0,
    placement: "bottom" as "top" | "bottom" | "left" | "right",
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafScrollRef = useRef<number | null>(null);

  // Directly calculate positions from actual live getBoundingClientRect()
  const updatePositions = useCallback((stepIdx = currentStep) => {
    const result = measureStep(stepIdx, cardRef.current);
    if (result) {
      setCutout(result.cutout);
      setCardPos(result.cardPos);
    }
  }, [currentStep]);

  // Navigate to step with ultra-smooth GPU physics and scroll coordination
  const goToStep = useCallback((stepIdx: number) => {
    if (stepIdx < 0 || stepIdx >= TOUR_STEPS.length) return;

    setCurrentStep(stepIdx);
    const step = TOUR_STEPS[stepIdx];
    const targetEl = document.querySelector(step.targetSelector) as HTMLElement | null;

    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const navHeaderHeight = 68;
    const viewportHeight = window.innerHeight;

    // Check if element is already comfortably visible
    const isAlreadyVisible =
      rect.top >= navHeaderHeight + 15 &&
      rect.bottom <= viewportHeight - 15;

    if (!isAlreadyVisible) {
      setIsScrolling(true);

      targetEl.scrollIntoView({
        behavior: "smooth",
        block: stepIdx === 4 ? "start" : "center",
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        updatePositions(stepIdx);
      }, 650);
    } else {
      setIsScrolling(false);
    }

    updatePositions(stepIdx);
  }, [updatePositions]);

  // Open tour handler: pre-measures Step 0 so there is ZERO flying/expansion from (0,0)
  const handleOpenTour = useCallback(() => {
    // If window is scrolled down, reset scroll first so Step 1 is cleanly in view
    if (window.scrollY > 50) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Measure Step 0 instantly before rendering
    const step0Data = measureStep(0, cardRef.current);
    if (step0Data) {
      setCutout(step0Data.cutout);
      setCardPos(step0Data.cardPos);
    }

    setCurrentStep(0);
    setIsInitialEntry(true);
    setIsFadedIn(false);
    setIsOpen(true);

    // Fade in gracefully in place
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsFadedIn(true);
        setTimeout(() => {
          setIsInitialEntry(false);
        }, 350);
      });
    });
  }, []);

  // High-FPS scroll listener throttled with requestAnimationFrame for 120Hz buttery smoothness
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      if (rafScrollRef.current !== null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        updatePositions(currentStep);
        rafScrollRef.current = null;
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        updatePositions(currentStep);
      }, 180);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafScrollRef.current !== null) {
        cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
    };
  }, [isOpen, currentStep, updatePositions]);

  // High-FPS window resize listener
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      updatePositions(currentStep);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, currentStep, updatePositions]);

  // Check URL param or first-time visitor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomTrigger = () => {
      handleOpenTour();
    };
    window.addEventListener("vietphuc_open_tour", handleCustomTrigger);

    const urlParams = new URLSearchParams(window.location.search);
    const hasTourParam = urlParams.get("tour") === "1" || urlParams.get("tour") === "true";

    if (hasTourParam) {
      const timer = setTimeout(() => {
        handleOpenTour();
        try {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("tour");
          window.history.replaceState({}, "", cleanUrl.toString());
        } catch {}
      }, autoStartDelay);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("vietphuc_open_tour", handleCustomTrigger);
      };
    }

    try {
      const completed = localStorage.getItem(STORAGE_TOUR_KEY);
      if (!completed) {
        const timer = setTimeout(() => {
          handleOpenTour();
        }, autoStartDelay);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("vietphuc_open_tour", handleCustomTrigger);
        };
      }
    } catch {}

    return () => {
      window.removeEventListener("vietphuc_open_tour", handleCustomTrigger);
    };
  }, [autoStartDelay, handleOpenTour]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsFadedIn(false);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_TOUR_KEY, "true");
      } catch {}
      setIsOpen(false);
    }, 200);
  };

  const handleComplete = () => {
    setIsFadedIn(false);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_TOUR_KEY, "true");
      } catch {}
      setIsOpen(false);
    }, 200);
  };

  if (!isOpen) return null;

  const activeStepData = TOUR_STEPS[currentStep];
  const StepIcon = activeStepData.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  // Ultra-fluid quintic ease-out curve (Apple luxury physics)
  const LUXURY_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  const TRANSITION_DURATION = "0.48s";

  return (
    <div
      className={`fixed inset-0 z-[9990] overflow-hidden select-none transition-opacity duration-300 ease-out ${
        isFadedIn ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="App Feature Tour"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Backdrop Click Interceptor */}
      <div
        className="fixed inset-0 z-[9991] cursor-pointer"
        onClick={handleSkip}
        title="Bấm ra ngoài để đóng hướng dẫn"
      />

      {/* 2. Pure GPU-Accelerated Spotlight Cutout (translate3d + Box-Shadow) */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9992]"
        style={{
          width: cutout.width,
          height: cutout.height,
          borderRadius: cutout.radius,
          boxShadow:
            "0 0 0 9999px rgba(15, 14, 12, 0.78), 0 0 0 2.5px rgba(217, 56, 41, 0.9), 0 0 30px rgba(212, 175, 55, 0.45), inset 0 0 16px rgba(217, 56, 41, 0.15)",
          transform: `translate3d(${cutout.x}px, ${cutout.y}px, 0)`,
          // If initial entry, NO transform transition so it appears directly in place without flying from (0,0)!
          transition: isInitialEntry
            ? "none"
            : isScrolling
            ? `width 0.3s ease, height 0.3s ease, border-radius 0.3s ease`
            : `transform ${TRANSITION_DURATION} ${LUXURY_EASE}, width ${TRANSITION_DURATION} ${LUXURY_EASE}, height ${TRANSITION_DURATION} ${LUXURY_EASE}, border-radius ${TRANSITION_DURATION} ${LUXURY_EASE}`,
          willChange: isInitialEntry ? "auto" : "transform, width, height",
        }}
      >
        {/* Royal Vietnamese Heritage Corner Accents */}
        <span className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-bronze-gold rounded-tl-sm pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-bronze-gold rounded-tr-sm pointer-events-none" />
        <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-bronze-gold rounded-bl-sm pointer-events-none" />
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-bronze-gold rounded-br-sm pointer-events-none" />
      </div>

      {/* 3. Floating Tooltip / Explanation Card (Matching Pure GPU Glide Physics) */}
      <div
        ref={cardRef}
        className={`fixed top-0 left-0 z-[10000] w-[calc(100vw-32px)] sm:w-[380px] bg-paper-cream rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border-bronze-light flex flex-col gap-3.5 transition-transform duration-300 ${
          isFadedIn ? "scale-100" : "scale-95"
        }`}
        style={{
          transform: `translate3d(${cardPos.x}px, ${cardPos.y}px, 0)`,
          // If initial entry, NO transform transition so it materializes directly in place
          transition: isInitialEntry
            ? "none"
            : isScrolling
            ? "none"
            : `transform ${TRANSITION_DURATION} ${LUXURY_EASE}`,
          willChange: isInitialEntry ? "auto" : "transform",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row: Step Badge + Tag + Close Icon */}
        <div className="flex items-center justify-between gap-2 border-b border-border-bronze-light/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-vermilion-red/10 border border-vermilion-red/25 text-vermilion-red text-[11px] font-bold tracking-tight">
              <Sparkles className="w-3 h-3 text-vermilion-red" />
              <span>
                Bước {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </span>
            <span className="text-[11px] font-semibold text-bronze-gold truncate max-w-[140px]">
              {activeStepData.tag}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            title="Đóng / Bỏ qua hướng dẫn (Esc)"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Dynamic Content Container with subtle crossfade */}
        <div key={currentStep} className="flex flex-col gap-3 animate-fadeIn">
          {/* Step Title & Icon */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-vermilion-red/10 border border-vermilion-red/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <StepIcon className="w-4 h-4 text-vermilion-red" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-serif font-bold text-text-charcoal text-[15px] sm:text-base leading-snug">
                {activeStepData.title}
              </h3>
            </div>
          </div>

          {/* Step Body Description */}
          <p className="text-stone-600 text-[12.5px] leading-relaxed">
            {activeStepData.description}
          </p>

          {/* Highlight Tip Callout Box */}
          {activeStepData.highlightTip && (
            <div className="bg-[#F6F1E8] border border-bronze-gold/35 rounded-xl p-2.5 flex items-start gap-2 text-[11.5px] text-stone-700">
              <Lightbulb className="w-3.5 h-3.5 text-bronze-gold flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{activeStepData.highlightTip}</span>
            </div>
          )}
        </div>

        {/* Bottom Actions Row: Progress Dots + Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-bronze-light/40">
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(idx)}
                className={`transition-all rounded-full ${
                  idx === currentStep
                    ? "w-5 h-2 bg-vermilion-red"
                    : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                }`}
                title={`Chuyển đến bước ${idx + 1}`}
                aria-label={`Chuyển đến bước ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons: Skip, Prev, Next */}
          <div className="flex items-center gap-1.5">
            {/* Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="px-2.5 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              Bỏ qua
            </button>

            {/* Prev Button (only if not step 0) */}
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 bg-surface-pure hover:bg-stone-100 border border-border-bronze-light/60 transition-all shadow-2xs active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>
            )}

            {/* Next / Finish Button */}
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 transition-all shadow-xs active:scale-95"
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bắt đầu khám phá</span>
                </>
              ) : (
                <>
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

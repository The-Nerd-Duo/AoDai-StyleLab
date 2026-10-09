"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { OutfitState, encodeOutfitToQuery, getGarmentMockupUrl, getShareOrigin } from "@/lib/utils";
import { LookbookItem } from "@/lib/types";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { useOutfitStore } from "@/lib/store";
import { toPng } from "html-to-image";
import { Download, Share2, Check, Sparkles, ChevronLeft, ChevronRight, ArrowLeftRight } from "lucide-react";
import { ShareCommunityModal } from "./ShareCommunityModal";
import { useQrCode } from "@/lib/use-qr-code";
import { FrameDecoration } from "./FrameDecoration";
import { getOrGeneratePrivateShareId } from "@/lib/share-service";

interface LookbookCardProps {
  outfit: OutfitState;
  frameId: string;
  onFrameChange?: (frameId: string) => void;
  imageUrl?: string | null;
  shareId?: string;
  onShareSuccess?: (item: LookbookItem) => void;
}

export const LookbookCard: React.FC<LookbookCardProps> = ({
  outfit,
  frameId,
  onFrameChange,
  imageUrl,
  shareId: propShareId,
  onShareSuccess,
}) => {
  const { resultImage } = useOutfitStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  // Measure card width for accurate transforms
  const [cardWidth, setCardWidth] = useState(350);
  useEffect(() => {
    const updateWidth = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth || 350);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Fallback internal frameId if onFrameChange is not passed
  const [internalFrameId, setInternalFrameId] = useState(frameId);
  useEffect(() => {
    setInternalFrameId(frameId);
  }, [frameId]);

  const activeFrameId = onFrameChange ? frameId : internalFrameId;
  const currentFrameIndex = framesData.findIndex((f) => f.id === activeFrameId);
  const activeIndex = currentFrameIndex >= 0 ? currentFrameIndex : 0;
  const currentFrame = framesData[activeIndex] || framesData[0];
  const nextFrame = framesData[(activeIndex + 1) % framesData.length];
  const prevFrame = framesData[(activeIndex - 1 + framesData.length) % framesData.length];

  const changeFrameByIndex = useCallback(
    (targetIndex: number) => {
      const clampedIndex = (targetIndex + framesData.length) % framesData.length;
      const nextTargetFrame = framesData[clampedIndex];
      if (!nextTargetFrame) return;

      if (onFrameChange) {
        onFrameChange(nextTargetFrame.id);
      } else {
        setInternalFrameId(nextTargetFrame.id);
      }
    },
    [onFrameChange]
  );

  // Real-time gradual sliding & transition animation state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInstantReset, setIsInstantReset] = useState(false);
  const isBusyRef = useRef(false);
  const dragStartXRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Slowed-down, smooth 650ms transition so the user can distinctly perceive the frame motion
  const handleNextClick = useCallback(() => {
    if (isBusyRef.current) return;
    const width = cardRef.current?.offsetWidth || cardWidth || 350;
    isBusyRef.current = true;
    setIsInstantReset(false);
    setIsTransitioning(true);
    setDragOffset(-width);

    setTimeout(() => {
      setIsInstantReset(true);
      setIsTransitioning(false);
      setDragOffset(0);
      changeFrameByIndex(activeIndex + 1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsInstantReset(false);
          isBusyRef.current = false;
        });
      });
    }, 650);
  }, [activeIndex, changeFrameByIndex, cardWidth]);

  const handlePrevClick = useCallback(() => {
    if (isBusyRef.current) return;
    const width = cardRef.current?.offsetWidth || cardWidth || 350;
    isBusyRef.current = true;
    setIsInstantReset(false);
    setIsTransitioning(true);
    setDragOffset(width);

    setTimeout(() => {
      setIsInstantReset(true);
      setIsTransitioning(false);
      setDragOffset(0);
      changeFrameByIndex(activeIndex - 1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsInstantReset(false);
          isBusyRef.current = false;
        });
      });
    }, 650);
  }, [activeIndex, changeFrameByIndex, cardWidth]);

  // Touch and Mouse Drag Gestures with real-time gradual follow
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isBusyRef.current) return;
    setIsDragging(true);
    setIsInstantReset(false);
    setIsTransitioning(false);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isBusyRef.current) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - dragStartXRef.current;
    if (Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
    }
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isBusyRef.current) return;
    setIsDragging(false);
    const width = cardRef.current?.offsetWidth || cardWidth || 350;

    if (dragOffset < -45) {
      isBusyRef.current = true;
      setIsTransitioning(true);
      setDragOffset(-width);
      setTimeout(() => {
        setIsInstantReset(true);
        setIsTransitioning(false);
        setDragOffset(0);
        changeFrameByIndex(activeIndex + 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsInstantReset(false);
            isBusyRef.current = false;
          });
        });
      }, 600);
    } else if (dragOffset > 45) {
      isBusyRef.current = true;
      setIsTransitioning(true);
      setDragOffset(width);
      setTimeout(() => {
        setIsInstantReset(true);
        setIsTransitioning(false);
        setDragOffset(0);
        changeFrameByIndex(activeIndex - 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsInstantReset(false);
            isBusyRef.current = false;
          });
        });
      }, 600);
    } else {
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || isBusyRef.current) return;
    setIsDragging(true);
    setIsInstantReset(false);
    setIsTransitioning(false);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isBusyRef.current) return;
    const currentX = e.clientX;
    const delta = currentX - dragStartXRef.current;
    if (Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
    }
    setDragOffset(delta);
  };

  const handleMouseUp = () => {
    if (!isDragging || isBusyRef.current) return;
    setIsDragging(false);
    const width = cardRef.current?.offsetWidth || cardWidth || 350;

    if (dragOffset < -45) {
      isBusyRef.current = true;
      setIsTransitioning(true);
      setDragOffset(-width);
      setTimeout(() => {
        setIsInstantReset(true);
        setIsTransitioning(false);
        setDragOffset(0);
        changeFrameByIndex(activeIndex + 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsInstantReset(false);
            isBusyRef.current = false;
          });
        });
      }, 600);
    } else if (dragOffset > 45) {
      isBusyRef.current = true;
      setIsTransitioning(true);
      setDragOffset(width);
      setTimeout(() => {
        setIsInstantReset(true);
        setIsTransitioning(false);
        setDragOffset(0);
        changeFrameByIndex(activeIndex - 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsInstantReset(false);
            isBusyRef.current = false;
          });
        });
      }, 600);
    } else {
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  };

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];

  const [imageError, setImageError] = useState(false);

  // Resolved display image:
  const hasPropImage = Boolean(imageUrl && imageUrl.trim());
  const rawDisplayImage = hasPropImage ? imageUrl! : (resultImage || null);
  const displayImage = imageError ? null : rawDisplayImage;

  useEffect(() => {
    setImageError(false);
  }, [rawDisplayImage]);

  const [shareUrl, setShareUrl] = useState("");
  const [internalShareId, setInternalShareId] = useState<string>("");
  const activeShareId = propShareId || internalShareId;

  // Automatically prepare private share ID in background as soon as design / AI image is ready
  useEffect(() => {
    let isMounted = true;
    if (!propShareId && displayImage && (displayImage.startsWith("data:") || displayImage.startsWith("blob:"))) {
      getOrGeneratePrivateShareId({
        outfit,
        frameId: activeFrameId,
        imageUrl: displayImage,
        title: `${garment.name} (Bản Phối Di Sản)`,
      }).then((id) => {
        if (isMounted && id) {
          setInternalShareId(id);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [outfit, activeFrameId, displayImage, garment.name, propShareId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = encodeOutfitToQuery(outfit, activeFrameId, displayImage, activeShareId);
      const baseOrigin = getShareOrigin();
      setShareUrl(`${baseOrigin}/share?${query}`);
    }
  }, [outfit, activeFrameId, displayImage, activeShareId]);

  const qrCodeUrl = useQrCode(displayImage ? shareUrl : "");

  const handleDownload = async () => {
    if (!displayImage || !cardRef.current) return;
    setDownloading(true);
    try {
      if (!activeShareId && displayImage && (displayImage.startsWith("data:") || displayImage.startsWith("blob:"))) {
        const id = await getOrGeneratePrivateShareId({
          outfit,
          frameId: activeFrameId,
          imageUrl: displayImage,
          title: `${garment.name} (Bản Phối Di Sản)`,
        });
        if (id) {
          setInternalShareId(id);
          await new Promise((r) => setTimeout(r, 220));
        }
      }

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution export
      });
      const link = document.createElement("a");
      link.download = `AoDai-StyleLab-Lookbook-${outfit.garmentId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Không thể tải ảnh. Vui lòng thử lại!");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!displayImage) return;
    let currentId = activeShareId;
    if (!currentId && displayImage && (displayImage.startsWith("data:") || displayImage.startsWith("blob:"))) {
      currentId = (await getOrGeneratePrivateShareId({
        outfit,
        frameId: activeFrameId,
        imageUrl: displayImage,
        title: `${garment.name} (Bản Chia Sẻ)`,
      })) || "";
      if (currentId) setInternalShareId(currentId);
    }

    const query = encodeOutfitToQuery(outfit, activeFrameId, displayImage, currentId || undefined);
    const origin = getShareOrigin();
    const currentShareUrl = `${origin}/share?${query}`;

    navigator.clipboard.writeText(currentShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Compute CSS transition duration and easing for the 3 frame layers
  const transitionStyle =
    isDragging || isInstantReset
      ? "none"
      : "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* 3D Depth Card Stage with Floating Navigation Arrows OUTSIDE the Card (matching StackedDeckCarousel) */}
      <div className="flex items-center justify-center gap-2.5 xs:gap-3 sm:gap-5 w-full">
        {/* Left Arrow Button OUTSIDE the card */}
        <button
          type="button"
          onClick={handlePrevClick}
          disabled={isTransitioning}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-paper-cream backdrop-blur-md border border-border-bronze-light shadow-md flex items-center justify-center text-text-charcoal hover:text-vermilion-red hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Khung viền trước"
          title="Khung viền trước"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Lookbook 9:16 Render Canvas Container (Clean, NO buttons inside!) */}
        <div
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full max-w-[280px] xs:max-w-[310px] sm:max-w-[350px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none bg-[#0D0C0B] cursor-grab active:cursor-grabbing touch-pan-y flex-shrink-0"
          style={{
            border: `3.5px solid ${
              currentFrame.borderColor && currentFrame.borderColor !== "transparent"
                ? currentFrame.borderColor
                : "#2D2A26"
            }`,
            boxShadow: `0 20px 50px -10px rgba(0,0,0,0.6), 0 0 25px -5px ${
              currentFrame.borderColor && currentFrame.borderColor !== "transparent"
                ? currentFrame.borderColor
                : "#000000"
            }40`,
            transition: isDragging ? "none" : "border-color 0.65s ease, box-shadow 0.65s ease",
          }}
        >
          {/* Hero Visual: Full Bleed AI Photo - 100% FIXED & IMMOBILE (Base Layer z-0) */}
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt={garment.name}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                onError={() => setImageError(true)}
              />
              {/* Top protective gradient */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
              {/* Bottom protective gradient */}
              <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/95 via-black/85 to-transparent pointer-events-none z-10" />
              {/* Subtle ambient hue tint */}
              <div
                className="absolute inset-0 opacity-15 mix-blend-screen pointer-events-none z-10"
                style={{ backgroundColor: color.hex }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181615] via-[#121110] to-[#0A0908] z-0 select-none">
              <div
                className="absolute inset-0 opacity-25 blur-3xl pointer-events-none"
                style={{ backgroundColor: color.hex }}
              />
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md flex items-center justify-center text-bronze-gold mb-3 shadow-inner">
                <Sparkles className="w-7 h-7 text-bronze-gold/90" />
              </div>
              <h4 className="relative z-10 font-serif text-base font-bold text-paper-cream tracking-wide">
                Khung Trưng Bày Di Sản
              </h4>
              <p className="relative z-10 text-[11px] text-white/55 mt-1.5 max-w-[210px] leading-relaxed">
                Chưa có ảnh phối đồ AI. Hãy tạo ảnh trong Studio để hoàn thiện thẻ Lookbook.
              </p>
              <span className="relative z-10 mt-3.5 px-3 py-0.5 rounded-full bg-white/[0.07] text-paper-cream/80 text-[9px] font-mono border border-white/10">
                HERITAGE READY
              </span>
            </div>
          )}

          {/* Real-time Gradual Sliding Frame Layers (Layer z-20) */}
          {/* 1. Incoming Previous Frame Layer (-100% + dragOffset) */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              transform: `translate3d(${-cardWidth + dragOffset}px, 0, 0)`,
              opacity: dragOffset > 0 ? Math.min(1, dragOffset / (cardWidth * 0.7)) : 0,
              transition: transitionStyle,
            }}
          >
            <FrameDecoration
              theme={prevFrame.theme || "none"}
              borderColor={prevFrame.borderColor}
              accentColor={prevFrame.accentColor}
            />
          </div>

          {/* 2. Current Active Frame Layer (0 + dragOffset) */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              transform: `translate3d(${dragOffset}px, 0, 0)`,
              opacity: Math.max(0, 1 - Math.abs(dragOffset) / (cardWidth * 1.1)),
              transition: transitionStyle,
            }}
          >
            <FrameDecoration
              theme={currentFrame.theme || "none"}
              borderColor={currentFrame.borderColor}
              accentColor={currentFrame.accentColor}
            />
          </div>

          {/* 3. Incoming Next Frame Layer (+100% + dragOffset) */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              transform: `translate3d(${cardWidth + dragOffset}px, 0, 0)`,
              opacity: dragOffset < 0 ? Math.min(1, Math.abs(dragOffset) / (cardWidth * 0.7)) : 0,
              transition: transitionStyle,
            }}
          >
            <FrameDecoration
              theme={nextFrame.theme || "none"}
              borderColor={nextFrame.borderColor}
              accentColor={nextFrame.accentColor}
            />
          </div>

          {/* Layer 1: Floating Top Seal Header (Layer z-30, Inset Safe Margins) */}
          <div className="relative z-30 flex items-center justify-between px-6 pt-5 sm:px-7 sm:pt-6 text-white pointer-events-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vermilion-red to-primary flex items-center justify-center text-[13px] font-bold text-white shadow-md border border-white/20">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[11px] leading-tight text-paper-cream tracking-wider uppercase font-bold">
                  AODAI STYLELAB
                </span>
                <span className="font-mono text-[9px] text-bronze-gold tracking-widest uppercase">
                  {currentFrame.badgeText || "LOOKBOOK ARCHIVE #088"}
                </span>
              </div>
            </div>
          </div>

          {/* Layer 2: Floating Bottom Narrative & QR Tray (Layer z-30, Inset Safe Margins) */}
          <div className="relative z-30 flex items-end justify-between gap-3 px-6 pb-6 sm:px-7 sm:pb-7 text-white pointer-events-none">
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-xs flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[11px] text-paper-cream font-medium tracking-wide">
                  {color.name}
                </span>
                <span className="text-[9px] font-mono text-bronze-gold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded uppercase border border-white/10 font-semibold">
                  {style.name}
                </span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide leading-tight drop-shadow-md truncate">
                {garment.name}
              </h3>
            </div>

            {/* QR Code Container - Only shown when AI image has been generated */}
            {displayImage && (
              <div className="flex flex-col items-center flex-shrink-0 pointer-events-auto">
                <div
                  className="w-12 h-12 sm:w-13 sm:h-13 bg-white p-1 rounded-lg shadow-lg border border-bronze-gold/40 flex items-center justify-center flex-shrink-0"
                  style={{ width: "48px", height: "48px", minWidth: "48px", minHeight: "48px" }}
                  title="Quét mã QR để xem & remix"
                >
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Quét mã QR"
                      className="w-full h-full object-contain pointer-events-none"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1A1A] rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] text-white">
                        qr_code
                      </span>
                    </div>
                  )}
                </div>
                <span className="font-mono text-[7px] text-paper-cream/80 uppercase tracking-widest mt-1 whitespace-nowrap font-bold">
                  QUÉT XEM
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Arrow Button OUTSIDE the card */}
        <button
          type="button"
          onClick={handleNextClick}
          disabled={isTransitioning}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-paper-cream backdrop-blur-md border border-border-bronze-light shadow-md flex items-center justify-center text-text-charcoal hover:text-vermilion-red hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Khung viền kế tiếp"
          title="Khung viền kế tiếp"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Frame Switcher Control Bar Under Card (Matching StackedDeckCarousel style) */}
      <div className="flex flex-col items-center gap-1.5 w-full max-w-[340px] sm:max-w-[380px]">
        {/* Current Frame Title Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-pure border border-border-bronze-light/60 shadow-2xs">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
            style={{
              backgroundColor:
                currentFrame.borderColor && currentFrame.borderColor !== "transparent"
                  ? currentFrame.borderColor
                  : "#D1D5DB",
            }}
          />
          <span className="text-xs font-serif font-bold text-text-charcoal truncate">
            {currentFrame.name}
          </span>
          <span className="text-[10px] font-mono text-bronze-gold font-bold ml-0.5">
            ({activeIndex + 1}/{framesData.length})
          </span>
        </div>

        {/* 6 Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {framesData.map((f, idx) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                if (isBusyRef.current || idx === activeIndex) return;
                changeFrameByIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? "w-6 h-1.5 bg-vermilion-red shadow-xs"
                  : "w-1.5 h-1.5 bg-border-bronze-light hover:bg-bronze-gold hover:scale-125"
              }`}
              aria-label={`Chọn ${f.name}`}
              title={f.name}
            />
          ))}
        </div>

        {/* Swipe Guidance Hint */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-text-warm-gray font-medium pt-0.5">
          <ArrowLeftRight className="w-3 h-3 text-bronze-gold animate-pulse" />
          <span>Bấm mũi tên hoặc kéo vuốt để trượt đổi khung viền</span>
        </div>
      </div>

      {!displayImage && (
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-vermilion-red hover:underline font-semibold flex items-center gap-1 justify-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chưa tạo ảnh AI? Quay lại Studio để tạo ảnh riêng →</span>
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-[340px] sm:max-w-[380px]">
        {/* Primary CTA: Chia sẻ lên Cộng đồng */}
        <button
          onClick={() => {
            if (!displayImage) return;
            setCommunityModalOpen(true);
          }}
          disabled={!displayImage}
          title={!displayImage ? "Vui lòng tạo ảnh phối đồ trước khi chia sẻ" : undefined}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-vermilion-red via-primary to-vermilion-red hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <Sparkles className="w-4 h-4 text-bronze-gold group-hover:rotate-12 transition-transform" />
          <span>Chia Sẻ Lên Thư Viện Cộng Đồng</span>
          <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full ml-1 font-semibold">
            Live
          </span>
        </button>

        {/* Secondary Actions: Tải PNG & Chép Link */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            onClick={handleDownload}
            disabled={!displayImage || downloading}
            title={!displayImage ? "Vui lòng tạo ảnh phối đồ trước khi tải ảnh" : undefined}
            className="flex-1 py-2.5 px-3 rounded-xl bg-paper-cream hover:bg-surface-pure border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <Download className={`w-3.5 h-3.5 text-vermilion-red ${downloading ? "animate-bounce" : ""}`} />
            <span>{downloading ? "Đang xuất..." : "Tải Thẻ PNG"}</span>
          </button>

          <button
            onClick={handleCopyShareLink}
            disabled={!displayImage}
            title={!displayImage ? "Vui lòng tạo ảnh phối đồ trước khi sao chép liên kết" : undefined}
            className="flex-1 py-2.5 px-3 rounded-xl bg-surface-pure hover:bg-paper-cream border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-guardrail-pass stroke-[3]" />
                <span className="text-guardrail-pass font-bold">Đã chép!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-bronze-gold" />
                <span>Sao chép Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Community Share Modal */}
      <ShareCommunityModal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
        outfit={outfit}
        frameId={activeFrameId}
        imageUrl={displayImage}
        onSuccess={(item) => {
          if (item?.id) {
            setInternalShareId(item.id);
          }
          if (onShareSuccess && item) {
            onShareSuccess(item);
          }
        }}
      />
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { OutfitState } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import { generateOutfitPrompt, callFluxWorkerAi, isAiQuotaError } from "@/lib/ai-prompt";
import { Sparkles, RefreshCw, Maximize2, Palette, X } from "lucide-react";
import { QuotaLimitModal } from "@/components/studio/QuotaLimitModal";

export interface StudioBadgeInfo {
  type: "remix" | "trial";
  details: string;
}

interface PreviewWorkspaceProps {
  outfit: OutfitState;
  resultImage?: string | null;
  setResultImage?: (url: string | null) => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  onGenerateOutfit?: () => void;
  className?: string;
  isOptionComplete?: boolean;
  missingItems?: { key: string; label: string }[];
  badgeInfo?: StudioBadgeInfo | null;
  onDismissBadge?: () => void;
}

export const PreviewWorkspace: React.FC<PreviewWorkspaceProps> = ({
  outfit,
  resultImage: externalResultImage,
  setResultImage: externalSetResultImage,
  loading: externalLoading,
  setLoading: externalSetLoading,
  onGenerateOutfit,
  className,
  isOptionComplete = true,
  missingItems = [],
  badgeInfo,
  onDismissBadge,
}) => {
  const [internalResultImage, setInternalResultImage] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);

  const resultImage = externalResultImage !== undefined ? externalResultImage : internalResultImage;
  const setResultImage = externalSetResultImage || setInternalResultImage;
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;
  const setLoading = externalSetLoading || setInternalLoading;

  React.useEffect(() => {
    setImageError(false);
  }, [resultImage]);

  const hasDisplayImage = Boolean(resultImage && !imageError);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];

  async function handleGenerateOutfit() {
    if (isOptionComplete === false) {
      return;
    }
    if (onGenerateOutfit) {
      onGenerateOutfit();
      return;
    }
    setLoading(true);
    try {
      const prompt = generateOutfitPrompt(outfit);
      const imageUrl = await callFluxWorkerAi(prompt);
      setResultImage(imageUrl);
    } catch (error: any) {
      if (isAiQuotaError(error)) {
        setQuotaModalOpen(true);
      } else {
        alert(error?.message || "Có lỗi khi tạo ảnh từ AI!");
      }
    } finally {
      setLoading(false);
    }
  }


  const handleResetToEmpty = () => {
    setImageError(false);
    if (setResultImage) {
      setResultImage(null);
    }
  };

  return (
    <div
      className={`relative w-full h-full rounded-2xl bg-surface-pure p-3.5 sm:p-4 shadow-sm border border-border-bronze-light/60 flex flex-col justify-between gap-3.5 ${
        className || ""
      }`}
    >
      {/* Top Header of Showcase Canvas */}
      <div className="flex flex-col gap-2 pb-3 px-1 border-b border-border-bronze-light/40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="material-symbols-outlined text-vermilion-red text-[20px]">
              view_in_ar
            </span>
            <h2 className="font-serif text-sm sm:text-base font-bold text-text-charcoal whitespace-nowrap">
              Kết Quả Phối Đồ AI
            </h2>
          </div>
        </div>

        {/* Khung chữ bên dưới tiêu đề: Hiển thị ĐẦY ĐỦ toàn bộ thông số (KHÔNG bị cắt bớt ...) */}
        {badgeInfo && (
          badgeInfo.type === "remix" ? (
            <div
              className="flex items-start justify-between gap-2.5 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-vermilion-red/10 via-amber-500/10 to-bronze-gold/15 border border-vermilion-red/35 text-xs shadow-2xs w-full animate-in fade-in duration-300"
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <Sparkles className="w-4 h-4 text-vermilion-red flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 min-w-0 flex-1 flex-wrap">
                  <span className="font-serif font-bold text-vermilion-red uppercase text-[11px] whitespace-nowrap flex-shrink-0">
                    Bản remix:
                  </span>
                  <span className="text-text-charcoal text-[11.5px] font-medium leading-relaxed break-words">
                    {badgeInfo.details}
                  </span>
                </div>
              </div>
              {onDismissBadge && (
                <button
                  type="button"
                  onClick={onDismissBadge}
                  className="text-text-warm-gray hover:text-white hover:bg-vermilion-red p-1 rounded-lg transition-all flex-shrink-0 cursor-pointer shadow-2xs border border-transparent hover:border-vermilion-red"
                  title="Bỏ bản remix này & đặt lại toàn bộ lựa chọn"
                  aria-label="Bỏ bản remix này & đặt lại toàn bộ lựa chọn"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>
          ) : (
            <div
              className="flex items-start justify-between gap-2.5 p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-600/35 text-xs shadow-2xs w-full animate-in fade-in duration-300"
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <Palette className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 min-w-0 flex-1 flex-wrap">
                  <span className="font-serif font-bold text-amber-800 uppercase text-[11px] whitespace-nowrap flex-shrink-0">
                    Bản thử phối:
                  </span>
                  <span className="text-text-charcoal text-[11.5px] font-semibold leading-relaxed break-words">
                    {badgeInfo.details}
                  </span>
                </div>
              </div>
              {onDismissBadge && (
                <button
                  type="button"
                  onClick={onDismissBadge}
                  className="text-text-warm-gray hover:text-white hover:bg-vermilion-red p-1 rounded-lg transition-all flex-shrink-0 cursor-pointer shadow-2xs border border-transparent hover:border-vermilion-red"
                  title="Bỏ bản thử phối này & đặt lại toàn bộ lựa chọn"
                  aria-label="Bỏ bản thử phối này & đặt lại toàn bộ lựa chọn"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Main Canvas Display Area */}
      <div className="flex justify-center w-full flex-1 min-h-[380px]">
        <div className="relative w-full h-[400px] sm:h-[440px] md:h-full md:min-h-[400px] rounded-xl overflow-hidden bg-[#121110] select-none border border-border-bronze-light/80 shadow-inner flex items-center justify-center p-4">
          {/* Subtle Ambient Glow matching current color */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl pointer-events-none transition-all duration-700"
            style={{ backgroundColor: color.hex }}
          />

          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-black/80 backdrop-blur-md border border-bronze-gold/40 text-center max-w-[280px] z-10">
              <RefreshCw className="w-9 h-9 text-bronze-gold animate-spin" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-white">AI đang tạo ảnh trang phục...</span>
              </div>
            </div>
          ) : hasDisplayImage ? (
            /* Generated AI Photo */
            <div className="relative w-full h-full flex items-center justify-center group z-10">
              <img
                src={resultImage!}
                alt={`Trang phục AI: ${garment.name}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
                onClick={() => setFullscreenImage(resultImage)}
                onError={() => {
                  setImageError(true);
                  if (setResultImage) {
                    setResultImage(null);
                  }
                }}
              />
            </div>
          ) : (
            /* Minimalist Neo-Heritage Empty State */
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 z-10 select-none">
              {/* Corner decorative accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-bronze-gold/40 pointer-events-none" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-bronze-gold/40 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-bronze-gold/40 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-bronze-gold/40 pointer-events-none" />

              {/* Minimalist Glowing Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-bronze-gold shadow-lg mb-3">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 opacity-85 text-bronze-gold" />
              </div>

              <h3 className="font-serif font-bold text-sm sm:text-base text-paper-cream tracking-wide">
                Khung Trưng Bày Phối Đồ
              </h3>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={handleGenerateOutfit}
          disabled={loading || isOptionComplete === false}
          title={
            isOptionComplete === false
              ? `Vui lòng chọn đủ các mục (${missingItems.map((m) => m.label).join(", ")}) để tạo đồ AI`
              : undefined
          }
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            isOptionComplete === false
              ? "bg-stone-200 text-stone-500 border border-stone-300 cursor-not-allowed opacity-80"
              : "bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 active:scale-[0.99] text-white disabled:opacity-50"
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Đang tạo ảnh AI...</span>
            </>
          ) : isOptionComplete === false ? (
            <>
              <span className="material-symbols-outlined text-[17px]">lock</span>
              <span>
                Chưa Chọn Đủ Tùy Chọn ({5 - missingItems.length}/5)
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{resultImage ? "Tạo Lại Ảnh AI Khác" : "Tạo Ảnh AI Thực Tế"}</span>
            </>
          )}
        </button>
        {isOptionComplete === false && (
          <p className="text-[11px] text-center text-amber-800/80 font-medium">
            * Chọn đủ Nhân vật, Cổ phục, Màu sắc, Bối cảnh, Phong cách để tạo ảnh
          </p>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen preview"
            className="max-h-[92vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl border border-white/20"
          />
        </div>
      )}

      {/* Demo Quota Limit Modal */}
      <QuotaLimitModal
        isOpen={quotaModalOpen}
        onClose={() => setQuotaModalOpen(false)}
      />
    </div>
  );
};

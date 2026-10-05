"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OutfitState } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import { generateOutfitPrompt, callFluxWorkerAi } from "@/lib/ai-prompt";
import { Sparkles, ArrowRight, RefreshCw, Copy, Check, Maximize2, RotateCcw } from "lucide-react";

interface PreviewWorkspaceProps {
  outfit: OutfitState;
  resultImage?: string | null;
  setResultImage?: (url: string | null) => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  onGenerateOutfit?: () => void;
  className?: string;
}

export const PreviewWorkspace: React.FC<PreviewWorkspaceProps> = ({
  outfit,
  resultImage: externalResultImage,
  setResultImage: externalSetResultImage,
  loading: externalLoading,
  setLoading: externalSetLoading,
  onGenerateOutfit,
  className,
}) => {
  const [internalResultImage, setInternalResultImage] = useState<string | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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
      alert(error?.message || "Có lỗi khi tạo ảnh từ AI!");
    } finally {
      setLoading(false);
    }
  }

  const handleCopyPrompt = () => {
    const prompt = generateOutfitPrompt(outfit);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

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
      <div className="flex items-center justify-between pb-3 px-1 border-b border-border-bronze-light/40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-vermilion-red text-[20px]">
            view_in_ar
          </span>
          <h2 className="font-serif text-sm sm:text-base font-bold text-text-charcoal">
            Kết Quả Phối Đồ AI (Showcase)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-guardrail-pass bg-guardrail-pass-surface border border-guardrail-pass/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-guardrail-pass animate-pulse" />
            DI SẢN HỢP CHUẨN
          </span>
          {hasDisplayImage && (
            <button
              onClick={handleResetToEmpty}
              className="p-1 text-text-warm-gray hover:text-vermilion-red hover:bg-paper-cream rounded-lg transition-colors"
              title="Đặt lại khung trống"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          {hasDisplayImage && (
            <button
              onClick={() => setFullscreenImage(resultImage)}
              className="p-1 text-text-warm-gray hover:text-text-charcoal hover:bg-paper-cream rounded-lg transition-colors"
              title="Xem toàn màn hình"
              type="button"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
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
                <span className="text-xs text-gray-300">Cloudflare Worker FLUX</span>
                <span className="text-[10px] text-bronze-gold font-mono">8K Cinematic Heritage</span>
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
              <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] flex items-center justify-between border border-white/10">
                <span className="font-serif truncate">{garment.name} • {color.name}</span>
                <span className="text-[10px] text-bronze-gold font-mono">{style.name}</span>
              </div>
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

              <div className="flex flex-col gap-1 max-w-[280px]">
                <h3 className="font-serif font-bold text-sm sm:text-base text-paper-cream tracking-wide">
                  Khung Trưng Bày Phối Đồ
                </h3>
                <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed">
                  Tùy chỉnh cổ phục &amp; phong cách, sau đó nhấn nút bên dưới để tạo ảnh AI thực tế.
                </p>
              </div>

              {/* Minimalist tags pill */}
              <div className="flex items-center gap-1.5 mt-3.5 flex-wrap justify-center">
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-paper-cream/80 font-mono">
                  {garment.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-bronze-gold/50" />
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-paper-cream/80 font-mono">
                  {color.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-bronze-gold/50" />
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] text-paper-cream/80 font-mono">
                  {style.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={handleGenerateOutfit}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Đang xử lý ảnh từ Cloudflare Worker...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{resultImage ? "Tạo Lại Ảnh AI Khác" : "Tạo Ảnh AI Thực Tế (Worker AI)"}</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Link to Lookbook */}
          <Link
            href="/lookbook"
            onClick={() => {
              if (resultImage) {
                try {
                  sessionStorage.setItem("vietphuc_result_image", resultImage);
                  localStorage.setItem("vietphuc_result_image", resultImage);
                } catch {}
              }
            }}
            className="py-2.5 px-3 rounded-xl bg-paper-cream hover:bg-surface-container text-text-charcoal border border-border-bronze-light/60 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span>Tạo Lookbook 9:16</span>
            <ArrowRight className="w-3.5 h-3.5 text-vermilion-red" />
          </Link>

          {/* Copy Prompt */}
          <button
            onClick={handleCopyPrompt}
            className="py-2.5 px-3 rounded-xl bg-paper-cream hover:bg-surface-container text-text-charcoal border border-border-bronze-light/60 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            type="button"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-guardrail-pass" />
                <span className="text-guardrail-pass font-bold">Đã chép prompt!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-warm-gray" />
                <span>Sao chép Prompt</span>
              </>
            )}
          </button>
        </div>
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
    </div>
  );
};

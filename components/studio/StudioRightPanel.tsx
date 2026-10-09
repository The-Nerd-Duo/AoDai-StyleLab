"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OutfitState, encodeOutfitToQuery, getShareOrigin } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { Download, Share2, Check, Sparkles } from "lucide-react";
import { useQrCode } from "@/lib/use-qr-code";
import { FrameDecoration } from "@/components/lookbook/FrameDecoration";
import { getOrGeneratePrivateShareId } from "@/lib/share-service";

interface StudioRightPanelProps {
  outfit: OutfitState;
  resultImage: string | null;
  selectedFrame: string;
  onSelectFrame: (frameId: string) => void;
  className?: string;
}

export const StudioRightPanel: React.FC<StudioRightPanelProps> = ({
  outfit,
  resultImage,
  selectedFrame,
  onSelectFrame,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [resultImage]);

  const hasDisplayImage = Boolean(resultImage && !imageError);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const frame = framesData.find((f) => f.id === selectedFrame) || framesData[0];

  const [shareUrl, setShareUrl] = useState("");
  const [shareId, setShareId] = useState<string>("");

  // Automatically prepare private share ID in background as soon as AI image is ready
  // This guarantees the QR code works IMMEDIATELY without needing to publish to the community library!
  React.useEffect(() => {
    let isSubscribed = true;
    if (resultImage && (resultImage.startsWith("data:") || resultImage.startsWith("blob:"))) {
      getOrGeneratePrivateShareId({
        outfit,
        frameId: selectedFrame,
        imageUrl: resultImage,
        title: `${garment.name} (Bản Phối Di Sản)`,
      }).then((id) => {
        if (isSubscribed && id) {
          setShareId(id);
        }
      });
    }
    return () => {
      isSubscribed = false;
    };
  }, [outfit, selectedFrame, resultImage, garment.name]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const query = encodeOutfitToQuery(outfit, selectedFrame, resultImage, shareId);
      const baseOrigin = getShareOrigin();
      setShareUrl(`${baseOrigin}/share?${query}`);
    }
  }, [outfit, selectedFrame, resultImage, shareId]);

  const qrCodeUrl = useQrCode(hasDisplayImage ? shareUrl : "");

  const handleCopyShareLink = async () => {
    if (!hasDisplayImage) return;
    let currentId = shareId;
    if (!currentId && resultImage && (resultImage.startsWith("data:") || resultImage.startsWith("blob:"))) {
      currentId = (await getOrGeneratePrivateShareId({
        outfit,
        frameId: selectedFrame,
        imageUrl: resultImage,
        title: `${garment.name} (Bản Chia Sẻ)`,
      })) || "";
      if (currentId) {
        setShareId(currentId);
      }
    }

    const query = encodeOutfitToQuery(outfit, selectedFrame, resultImage, currentId || undefined);
    const origin = getShareOrigin();
    const currentShareUrl = `${origin}/share?${query}`;

    navigator.clipboard.writeText(currentShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCycleFrame = () => {
    const currentIndex = framesData.findIndex((f) => f.id === selectedFrame);
    const nextIndex = (currentIndex + 1) % framesData.length;
    onSelectFrame(framesData[nextIndex].id);
  };

  return (
    <div className={`w-full h-full flex flex-col ${className || ""}`}>
      {/* Lookbook Card Preview */}
      <div className="w-full h-full bg-surface-pure rounded-2xl p-3.5 sm:p-4 shadow-sm border border-border-bronze-light/60 flex flex-col justify-between gap-3.5">
        <div className="flex items-center justify-between border-b border-border-bronze-light/40 pb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-vermilion-red">
              qr_code_2
            </span>
            <h2 className="font-serif text-sm sm:text-base font-bold text-text-charcoal">
              Thẻ Lookbook
            </h2>
          </div>
        </div>

        {/* Mini 9:16 Card Mockup Wrapper (Centered, flexible height) */}
        <div className="flex items-center justify-center flex-1 w-full my-auto py-1">
          <div
            className="relative w-full max-w-[210px] sm:max-w-[220px] aspect-[9/16] max-h-[440px] bg-[#111111] rounded-xl overflow-hidden shadow-lg border-2 flex flex-col justify-between p-3 select-none transition-all duration-300 group"
            style={{
              borderColor:
                frame.borderColor && frame.borderColor !== "transparent"
                  ? frame.borderColor
                  : "rgba(197, 160, 89, 0.25)",
            }}
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between z-30">
              <span className="font-mono text-[8px] uppercase tracking-wider text-surface-pure font-bold px-1.5 py-0.5 bg-vermilion-red/90 rounded">
                AODAI STYLELAB
              </span>
              <span className="text-[8px] font-mono px-1 rounded bg-guardrail-pass text-white font-bold">
                GEN-Z PROOF
              </span>
            </div>

            {/* Center: Image or Minimalist Empty Frame */}
            <div className="absolute inset-0 z-0">
              {hasDisplayImage ? (
                <>
                  <img
                    alt="Vertical portrait"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={resultImage!}
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text-charcoal via-transparent to-black/40" />
                </>
              ) : (
                /* Minimalist aesthetic empty state for lookbook card */
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#181615] to-[#100F0E] relative overflow-hidden select-none">
                  {/* Subtle Ambient Color Glow */}
                  <div
                    className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
                    style={{ backgroundColor: color.hex }}
                  />

                  {/* Minimalist Center Icon */}
                  <div className="relative z-10 w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-bronze-gold mb-2 shadow-inner">
                    <Sparkles className="w-5 h-5 opacity-85 text-bronze-gold" />
                  </div>

                  <div className="relative z-10 flex flex-col gap-0.5">
                    <span className="text-[11px] font-serif text-paper-cream font-bold tracking-wide">
                      Thẻ Lookbook
                    </span>
                    <span className="text-[9px] text-white/50 font-sans leading-tight">
                      Sẵn sàng kết nối ảnh AI
                    </span>
                  </div>

                  <span className="relative z-10 mt-3 px-2 py-0.5 rounded-full bg-white/[0.06] text-paper-cream/80 text-[8px] font-mono border border-white/10">
                    HERITAGE READY
                  </span>
                </div>
              )}
            </div>

            {/* Heritage Frame Corner Decorations (z-20, sits above image) */}
            <FrameDecoration
              theme={frame.theme || "royal"}
              borderColor={frame.borderColor}
              accentColor={frame.accentColor}
            />

            {/* Bottom Card Overlay */}
            <div className="relative z-20 text-white space-y-1.5">
              <div className="flex items-end justify-between">
                <div>
                  <span className="font-mono text-[9px] text-bronze-gold block font-semibold uppercase">
                    {style.name}
                  </span>
                  <p className="font-serif text-[13px] leading-tight font-bold text-white truncate max-w-[120px]">
                    {garment.name}
                  </p>
                </div>
                {hasDisplayImage && (
                  <div
                    className="w-9 h-9 bg-white p-0.5 rounded-md shadow-md border border-bronze-gold/40 flex items-center justify-center flex-shrink-0"
                    style={{ width: "36px", height: "36px" }}
                    title="Quét mã QR để mở & remix bản phối trên điện thoại"
                  >
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain pointer-events-none"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ) : (
                      <div className="w-full h-full bg-text-charcoal rounded-[2px] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[15px] text-white">
                          qr_code
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/20">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }} />
                  <span className="w-2 h-2 rounded-full bg-bronze-gold" />
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="font-mono text-[8px] text-white/70">ID #VN-2026-098</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Panel */}
        <div className="flex flex-col gap-2 pt-1">
          {hasDisplayImage ? (
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
              className="w-full py-3 px-4 bg-gradient-to-r from-vermilion-red to-primary text-white rounded-xl font-sans text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Thẻ Lookbook + QR</span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              title="Vui lòng tạo ảnh phối đồ trước khi xuất thẻ Lookbook"
              className="w-full py-3 px-4 bg-stone-200 text-stone-400 rounded-xl font-sans text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed shadow-none"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Thẻ Lookbook + QR</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyShareLink}
              disabled={!hasDisplayImage}
              title={!hasDisplayImage ? "Vui lòng tạo ảnh phối đồ trước khi chia sẻ link" : undefined}
              className="py-2.5 px-3 bg-paper-cream hover:bg-surface-container text-text-charcoal rounded-xl font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-border-bronze-light/60 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-paper-cream"
              type="button"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-guardrail-pass" />
                  <span className="text-guardrail-pass font-bold">Đã chép!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-text-warm-gray" />
                  <span>Chia sẻ link</span>
                </>
              )}
            </button>

            <button
              onClick={handleCycleFrame}
              disabled={!hasDisplayImage}
              className={`py-2.5 px-3 rounded-xl font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all shadow-xs ${
                !hasDisplayImage
                  ? "bg-paper-cream/50 text-text-warm-gray/40 border-border-bronze-light/30 cursor-not-allowed opacity-60"
                  : "bg-paper-cream hover:bg-surface-container text-text-charcoal border-border-bronze-light/60 active:scale-95 cursor-pointer"
              }`}
              type="button"
              title={
                !hasDisplayImage
                  ? "Vui lòng tạo ảnh phối đồ trước khi đổi khung viền"
                  : "Đổi mẫu khung viền di sản"
              }
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  !hasDisplayImage ? "text-text-warm-gray/40" : "text-bronze-gold"
                }`}
              >
                crop_free
              </span>
              <span>Đổi Khung Viền</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

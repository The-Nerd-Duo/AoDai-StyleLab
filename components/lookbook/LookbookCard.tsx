"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { OutfitState, encodeOutfitToQuery } from "@/lib/utils";
import { LookbookItem } from "@/lib/types";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { useOutfitStore } from "@/lib/store";
import { toPng } from "html-to-image";
import { Download, Share2, Check, Sparkles } from "lucide-react";
import { ShareCommunityModal } from "./ShareCommunityModal";

interface LookbookCardProps {
  outfit: OutfitState;
  frameId: string;
  imageUrl?: string | null;
  onShareSuccess?: (item: LookbookItem) => void;
}

export const LookbookCard: React.FC<LookbookCardProps> = ({
  outfit,
  frameId,
  imageUrl,
  onShareSuccess,
}) => {
  const { resultImage } = useOutfitStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const frame = framesData.find((f) => f.id === frameId) || framesData[0];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
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

  const [imageError, setImageError] = useState(false);

  // Resolved display image: props imageUrl takes precedence, then store resultImage, otherwise null ("để khung trống")
  const rawDisplayImage = imageUrl !== undefined ? imageUrl : resultImage;
  const displayImage = imageError ? null : rawDisplayImage;

  React.useEffect(() => {
    setImageError(false);
  }, [rawDisplayImage]);

  const handleCopyShareLink = () => {
    const query = encodeOutfitToQuery(outfit, frameId, displayImage);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/share?${query}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Lookbook 9:16 Render Canvas Container */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none bg-gradient-to-b from-[#FAF5EC] via-surface-pure to-[#F4EDE0]"
        style={{
          border: `3px solid ${frame.borderColor || "#D93829"}`,
        }}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-text-charcoal flex flex-col justify-between p-4 shadow-inner">
          {/* Frame Decorative Background & Glow */}
          <div
            className="absolute inset-0 opacity-20 blur-2xl pointer-events-none"
            style={{ backgroundColor: color.hex }}
          />

          {/* Layer 1: Top Seal Header */}
          <div className="relative z-10 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-vermilion-red flex items-center justify-center text-[12px] font-bold text-white shadow-md">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[11px] leading-tight text-paper-cream tracking-wider uppercase font-bold">
                  AODAI STYLELAB
                </span>
                <span className="font-mono text-[9px] text-bronze-gold tracking-widest uppercase">
                  {frame.badgeText || "LOOKBOOK ARCHIVE #088"}
                </span>
              </div>
            </div>
            <div className="bg-text-charcoal/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-guardrail-pass animate-pulse" />
              <span className="font-mono text-[10px] text-paper-cream">
                {garment.dynasty.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Layer 2: Center Visual AI Photo or Empty Frame ("khung trống") */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-3 overflow-hidden">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-bronze-gold/50 flex items-center justify-center bg-black/40 relative">
              {displayImage ? (
                <>
                  <img
                    src={displayImage}
                    alt={garment.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[9px] text-bronze-gold text-center font-medium">
                    Ảnh AI Thực Tế • Cloudflare Worker
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181615] to-[#100f0e] rounded-xl relative overflow-hidden select-none">
                  {/* Subtle Ambient Color Glow */}
                  <div
                    className="absolute inset-0 opacity-20 blur-2xl pointer-events-none"
                    style={{ backgroundColor: color.hex }}
                  />

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-bronze-gold/30 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-bronze-gold/30 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-bronze-gold/30 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-bronze-gold/30 pointer-events-none" />

                  {/* Minimalist Glowing Icon */}
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-center text-bronze-gold mb-3 shadow-inner">
                    <Sparkles className="w-6 h-6 text-bronze-gold/85" />
                  </div>
                  <h4 className="relative z-10 font-serif text-sm font-bold text-paper-cream tracking-wide">
                    Khung Trưng Bày 9:16
                  </h4>
                  <p className="relative z-10 text-[11px] text-white/50 mt-1 max-w-[200px] leading-relaxed">
                    Chưa có ảnh phối đồ AI. Hãy tạo ảnh trong Studio để hoàn thiện thẻ Lookbook.
                  </p>
                  <span className="relative z-10 mt-3 px-2.5 py-0.5 rounded-full bg-white/[0.06] text-paper-cream/80 text-[9px] font-mono border border-white/10">
                    HERITAGE READY
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Layer 3: Bottom Narrative & Palette Tray */}
          <div className="relative z-10 flex flex-col gap-2 bg-text-charcoal/85 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-white/15 text-white">
            <div className="flex items-center justify-between gap-1 pb-1">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center -space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-vermilion-red shadow-sm border border-white/20" title="#D93829 Đỏ Son" />
                  <span className="w-4 h-4 rounded-full bg-bronze-gold shadow-sm border border-white/20" title="#C5A059 Vàng Đồng" />
                  <span className="w-4 h-4 rounded-full bg-paper-cream shadow-sm border border-white/20" title="#FDFBF7 Trắng Ngà Điệp" />
                  <span className="w-4 h-4 rounded-full bg-[#1A1A1A] shadow-sm border border-white/20" title="#1A1A1A Than Trắc" />
                </div>
                <span className="text-[10px] text-paper-cream/80 font-medium">
                  {color.name} ({occasion.name.split("&")[0].trim()})
                </span>
              </div>
              <span className="text-[9px] font-mono text-bronze-gold bg-tertiary/40 px-2 py-0.5 rounded uppercase">
                {style.name}
              </span>
            </div>

            <p className="font-serif text-paper-cream/95 leading-snug line-clamp-2 text-[11px] italic">
              &ldquo;{garment.culturalSignificance}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-white/15">
              <div className="flex items-center gap-1.5 text-guardrail-pass">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span className="text-[10px] text-paper-cream tracking-wide">
                  Gemini AI: <strong className="text-guardrail-pass font-semibold">100% Chuẩn Lịch Sử</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-white/90">
                <span className="material-symbols-outlined text-[12px]">qr_code</span>
                <span>VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!resultImage && (
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
          onClick={() => setCommunityModalOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-vermilion-red via-primary to-vermilion-red hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 group"
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
            disabled={downloading}
            className="flex-1 py-2.5 px-3 rounded-xl bg-paper-cream hover:bg-surface-pure border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 text-vermilion-red ${downloading ? "animate-bounce" : ""}`} />
            <span>{downloading ? "Đang xuất..." : "Tải PNG (9:16)"}</span>
          </button>

          <button
            onClick={handleCopyShareLink}
            className="flex-1 py-2.5 px-3 rounded-xl bg-surface-pure hover:bg-paper-cream border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
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
        frameId={frameId}
        imageUrl={displayImage}
        onSuccess={(item) => {
          if (onShareSuccess && item) {
            onShareSuccess(item);
          }
        }}
      />
    </div>
  );
};

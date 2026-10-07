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
import { useQrCode } from "@/lib/use-qr-code";
import { FrameDecoration } from "./FrameDecoration";

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

  const [shareUrl, setShareUrl] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const query = encodeOutfitToQuery(outfit, frameId, displayImage);
      const baseOrigin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      setShareUrl(`${baseOrigin}/share?${query}`);
    }
  }, [outfit, frameId, displayImage]);

  const qrCodeUrl = useQrCode(shareUrl);

  const handleCopyShareLink = () => {
    const query = encodeOutfitToQuery(outfit, frameId, displayImage);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const currentShareUrl = `${origin}/share?${query}`;

    navigator.clipboard.writeText(currentShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Lookbook 9:16 Render Canvas Container - Full Bleed Magazine Style */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none bg-[#0D0C0B]"
        style={{
          border: `3.5px solid ${frame.borderColor || "#D93829"}`,
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.6), 0 0 25px -5px ${frame.borderColor || "#D93829"}40`,
        }}
      >
        {/* Hero Visual: Full Bleed AI Photo or Empty State (Base Layer z-0) */}
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={garment.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
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
              Khung Trưng Bày 9:16
            </h4>
            <p className="relative z-10 text-[11px] text-white/55 mt-1.5 max-w-[210px] leading-relaxed">
              Chưa có ảnh phối đồ AI. Hãy tạo ảnh trong Studio để hoàn thiện thẻ Lookbook.
            </p>
            <span className="relative z-10 mt-3.5 px-3 py-0.5 rounded-full bg-white/[0.07] text-paper-cream/80 text-[9px] font-mono border border-white/10">
              HERITAGE READY
            </span>
          </div>
        )}

        {/* Decorative Heritage Frame Corners & Motifs (Layer z-20, sits above image & gradients) */}
        <FrameDecoration
          theme={frame.theme || "royal"}
          borderColor={frame.borderColor}
          accentColor={frame.accentColor}
        />

        {/* Layer 1: Floating Top Seal Header (Layer z-30, Inset Safe Margins) */}
        <div className="relative z-30 flex items-center justify-between px-6 pt-5 sm:px-7 sm:pt-6 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vermilion-red to-primary flex items-center justify-center text-[13px] font-bold text-white shadow-md border border-white/20">
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
        </div>

        {/* Layer 2: Floating Bottom Narrative & QR Tray (Layer z-30, Inset Safe Margins) */}
        <div className="relative z-30 flex flex-col gap-2 px-6 pb-5 sm:px-7 sm:pb-6 text-white">
          {/* Palette & Style Row */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-vermilion-red shadow-sm border border-white/20" title="#D93829 Đỏ Son" />
                <span className="w-4 h-4 rounded-full bg-bronze-gold shadow-sm border border-white/20" title="#C5A059 Vàng Đồng" />
                <span className="w-4 h-4 rounded-full bg-paper-cream shadow-sm border border-white/20" title="#FDFBF7 Trắng Ngà Điệp" />
                <span className="w-4 h-4 rounded-full bg-[#1A1A1A] shadow-sm border border-white/20" title="#1A1A1A Than Trắc" />
              </div>
              <span className="text-[10px] text-paper-cream/90 font-medium">
                {color.name} ({occasion.name.split("&")[0].trim()})
              </span>
            </div>
            <span className="text-[9px] font-mono text-bronze-gold bg-white/10 px-2 py-0.5 rounded uppercase border border-white/10">
              {style.name}
            </span>
          </div>

          {/* Garment Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-wide leading-tight drop-shadow-md">
            {garment.name}
          </h3>

          {/* Cultural Significance Quote */}
          <p className="font-serif text-paper-cream/90 leading-snug line-clamp-2 text-[10.5px] italic">
            &ldquo;{garment.culturalSignificance}&rdquo;
          </p>

          {/* Clean Heritage Metadata & Prominent Scannable QR Code */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-bronze-gold font-bold tracking-wider">
                  DIGITAL ID
                </span>
                <span className="text-white/30">•</span>
                <span className="font-mono text-[9px] text-paper-cream/80 tracking-widest">
                  #{outfit.garmentId.toUpperCase().slice(0, 8)}
                </span>
              </div>
              <span className="font-mono text-[8.5px] text-white/60">
                Quét mã để xem & remix bản phối
              </span>
            </div>

            {/* QR Code Container - Enforced Big & Crisp for Mobile Scanning */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 bg-white p-1 rounded-xl shadow-xl border-2 border-bronze-gold/70 flex items-center justify-center overflow-hidden transition-transform hover:scale-105"
                title="Quét mã QR để mở & remix bản phối trên điện thoại"
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Quét mã QR để remix bản phối"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-white">
                      qr_code
                    </span>
                  </div>
                )}
              </div>
              <span className="font-mono text-[7px] text-paper-cream/75 uppercase tracking-widest mt-0.5">
                QUÉT REMIX
              </span>
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

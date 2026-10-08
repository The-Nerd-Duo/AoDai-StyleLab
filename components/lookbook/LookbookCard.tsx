"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { OutfitState, encodeOutfitToQuery, getGarmentMockupUrl } from "@/lib/utils";
import { LookbookItem } from "@/lib/types";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { useOutfitStore } from "@/lib/store";
import { toPng } from "html-to-image";
import { Download, Share2, Check, Sparkles, ExternalLink, X, Copy } from "lucide-react";
import { ShareCommunityModal } from "./ShareCommunityModal";
import { useQrCode } from "@/lib/use-qr-code";
import { FrameDecoration } from "./FrameDecoration";
import { getOrGeneratePrivateShareId } from "@/lib/share-service";

interface LookbookCardProps {
  outfit: OutfitState;
  frameId: string;
  imageUrl?: string | null;
  shareId?: string;
  onShareSuccess?: (item: LookbookItem) => void;
}

export const LookbookCard: React.FC<LookbookCardProps> = ({
  outfit,
  frameId,
  imageUrl,
  shareId: propShareId,
  onShareSuccess,
}) => {
  const { resultImage } = useOutfitStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const frame = framesData.find((f) => f.id === frameId) || framesData[0];

  const [imageError, setImageError] = useState(false);

  // Resolved display image:
  // 1. props imageUrl takes precedence if non-empty
  // 2. store resultImage (local AI generation)
  // 3. Fallback to authentic garment heritage illustration mockup
  const hasPropImage = Boolean(imageUrl && imageUrl.trim());
  const fallbackMockup = getGarmentMockupUrl(outfit.garmentId);
  const rawDisplayImage = hasPropImage ? imageUrl! : (resultImage || fallbackMockup);
  const displayImage = imageError ? fallbackMockup : rawDisplayImage;

  React.useEffect(() => {
    setImageError(false);
  }, [rawDisplayImage]);

  const [shareUrl, setShareUrl] = useState("");
  const [internalShareId, setInternalShareId] = useState<string>("");
  const activeShareId = propShareId || internalShareId;

  // Automatically prepare private share ID in background as soon as design / AI image is ready
  // This guarantees the QR code works IMMEDIATELY without needing to publish to the community library!
  React.useEffect(() => {
    let isMounted = true;
    if (!propShareId && displayImage && (displayImage.startsWith("data:") || displayImage.startsWith("blob:"))) {
      getOrGeneratePrivateShareId({
        outfit,
        frameId,
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
  }, [outfit, frameId, displayImage, garment.name, propShareId]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const query = encodeOutfitToQuery(outfit, frameId, displayImage, activeShareId);
      const baseOrigin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      setShareUrl(`${baseOrigin}/share?${query}`);
    }
  }, [outfit, frameId, displayImage, activeShareId]);

  const qrCodeUrl = useQrCode(shareUrl);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Ensure private share ID is prepared if we have an AI image so the exported QR code is 100% active
      if (!activeShareId && displayImage && (displayImage.startsWith("data:") || displayImage.startsWith("blob:"))) {
        const id = await getOrGeneratePrivateShareId({
          outfit,
          frameId,
          imageUrl: displayImage,
          title: `${garment.name} (Bản Phối Di Sản)`,
        });
        if (id) {
          setInternalShareId(id);
          // Wait a moment for QR code canvas to update with the new ID
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
    let currentId = activeShareId;
    if (!currentId && displayImage && (displayImage.startsWith("data:") || displayImage.startsWith("blob:"))) {
      currentId = (await getOrGeneratePrivateShareId({
        outfit,
        frameId,
        imageUrl: displayImage,
        title: `${garment.name} (Bản Chia Sẻ)`,
      })) || "";
      if (currentId) setInternalShareId(currentId);
    }

    const query = encodeOutfitToQuery(outfit, frameId, displayImage, currentId || undefined);
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
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[9px] text-bronze-gold font-bold tracking-wider whitespace-nowrap">
                  DIGITAL ID
                </span>
                <span className="text-white/30">•</span>
                <span className="font-mono text-[9px] text-paper-cream/80 truncate">
                  #{outfit.garmentId.toUpperCase().slice(0, 10)}
                </span>
              </div>
              <span className="font-mono text-[8px] text-white/60 truncate">
                Quét mã để xem & remix
              </span>
            </div>

            {/* QR Code Container - Strictly sized to 48px to prevent mobile blowout, clickable to view enlarged */}
            <div className="flex flex-col items-center flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQrModalOpen(true);
                }}
                className="w-12 h-12 bg-white p-1 rounded-xl shadow-lg border-2 border-bronze-gold/70 flex items-center justify-center overflow-hidden flex-shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer group/qr"
                style={{ width: "48px", height: "48px", minWidth: "48px", minHeight: "48px", maxWidth: "48px", maxHeight: "48px" }}
                title="Nhấn để phóng to mã QR & xem liên kết riêng tư (không cần đăng cộng đồng)"
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Quét mã QR để remix bản phối"
                    className="w-full h-full object-contain pointer-events-none group-hover/qr:opacity-90"
                    style={{ width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px" }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-white">
                      qr_code
                    </span>
                  </div>
                )}
              </button>
              <span className="font-mono text-[7px] text-paper-cream/75 uppercase tracking-widest mt-0.5 whitespace-nowrap">
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

      {/* Action Buttons & QR Independence Controls */}
      <div className="flex flex-col gap-2.5 w-full max-w-[340px] sm:max-w-[380px]">
        {/* QR Ready Status Banner */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-pure border border-border-bronze-light/70 text-[11px] shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-guardrail-pass opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-guardrail-pass"></span>
            </span>
            <span className="font-semibold text-text-charcoal">Mã QR hoạt động riêng tư</span>
          </div>
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="text-vermilion-red hover:underline font-mono text-[10px] font-bold flex items-center gap-1"
          >
            <span>Phóng to mã</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Primary CTA: Tải thẻ ảnh 9:16 (Bao gồm QR Code hoạt động độc lập) */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-vermilion-red via-primary to-vermilion-red hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className={`w-4 h-4 text-paper-cream ${downloading ? "animate-bounce" : ""}`} />
          <span>{downloading ? "Đang xuất thẻ..." : "Tải Thẻ PNG 9:16 (Kèm Mã QR)"}</span>
        </button>

        {/* Secondary Row: Chép Link QR & Xem Mã QR */}
        <div className="flex items-center gap-2.5 w-full">
          <button
            onClick={handleCopyShareLink}
            className="flex-1 py-2.5 px-3 rounded-xl bg-surface-pure hover:bg-paper-cream border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-guardrail-pass stroke-[3]" />
                <span className="text-guardrail-pass font-bold">Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-bronze-gold" />
                <span>Sao chép Link QR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-surface-pure hover:bg-paper-cream border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-vermilion-red">qr_code_2</span>
            <span>Mở Mã QR Lớn</span>
          </button>
        </div>

        {/* Community Showcase Button: Optional public sharing */}
        <div className="pt-0.5 flex flex-col gap-1">
          <button
            onClick={() => setCommunityModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-paper-cream hover:bg-surface-container border border-dashed border-bronze-gold/70 text-text-charcoal font-medium text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 group shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-bronze-gold group-hover:rotate-12 transition-transform" />
            <span>Đăng Lên Thư Viện Cộng Đồng (Công khai)</span>
            <span className="text-[10px] font-mono text-text-warm-gray ml-1">(Tùy chọn)</span>
          </button>
          <p className="text-[10.5px] text-center text-text-warm-gray leading-tight">
            Mã QR hoạt động ngay không cần đăng cộng đồng. Chỉ đăng khi bạn muốn giới thiệu trong Thư viện chung.
          </p>
        </div>
      </div>

      {/* Interactive QR Code Modal */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setQrModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-bronze-gold/50 flex flex-col items-center gap-4 text-center z-[10000] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-paper-cream hover:bg-black/10 flex items-center justify-center text-text-warm-gray transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-vermilion-red flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-text-charcoal">
                Mã QR Bản Phối Di Sản
              </h3>
              <p className="text-xs text-text-warm-gray mt-1 leading-relaxed">
                Quét bằng điện thoại để xem trực tiếp thẻ 9:16 và ảnh của bạn. Hoạt động độc lập, không bắt buộc đăng lên Thư viện Cộng đồng.
              </p>
            </div>

            {/* Large QR Display */}
            <div className="w-52 h-52 bg-white p-3 rounded-2xl shadow-lg border-2 border-bronze-gold/60 flex items-center justify-center overflow-hidden">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-text-warm-gray animate-pulse">
                  qr_code
                </span>
              )}
            </div>

            {/* Share Link Field */}
            <div className="w-full flex items-center gap-1.5 bg-paper-cream p-2 rounded-xl border border-border-bronze-light/60">
              <input
                readOnly
                value={shareUrl}
                className="text-xs bg-transparent text-text-charcoal flex-1 truncate font-mono outline-none px-1"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-2.5 py-1 bg-surface-pure hover:bg-white text-text-charcoal rounded-lg font-semibold text-xs border border-border-bronze-light flex items-center gap-1 transition-colors flex-shrink-0 shadow-2xs"
              >
                {copied ? <Check className="w-3 h-3 text-guardrail-pass stroke-[3]" /> : <Copy className="w-3 h-3 text-bronze-gold" />}
                <span>{copied ? "Đã chép" : "Chép"}</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="w-full flex items-center gap-2 pt-1">
              {shareUrl && (
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-surface-pure hover:bg-paper-cream border border-border-bronze-light text-text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-vermilion-red" />
                  <span>Mở xem thử</span>
                </a>
              )}
              <button
                onClick={() => setQrModalOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-vermilion-red text-white font-bold text-xs hover:opacity-95 transition-opacity shadow-sm"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Share Modal */}
      <ShareCommunityModal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
        outfit={outfit}
        frameId={frameId}
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

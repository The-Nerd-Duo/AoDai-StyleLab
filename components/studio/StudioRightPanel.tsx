"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OutfitState, encodeOutfitToQuery } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { Download, Share2, Check, Sparkles } from "lucide-react";

interface StudioRightPanelProps {
  outfit: OutfitState;
  resultImage: string | null;
  selectedFrame: string;
  onSelectFrame: (frameId: string) => void;
}

export const StudioRightPanel: React.FC<StudioRightPanelProps> = ({
  outfit,
  resultImage,
  selectedFrame,
  onSelectFrame,
}) => {
  const [copied, setCopied] = useState(false);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const frame = framesData.find((f) => f.id === selectedFrame) || framesData[0];

  const handleCopyShareLink = () => {
    const query = encodeOutfitToQuery(outfit, selectedFrame, resultImage);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/share?${query}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
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
    <div className="w-full flex flex-col gap-5">
      {/* Lookbook 9:16 Digital ID Card Preview */}
      <div className="bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60 space-y-3.5">
        <div className="flex items-center justify-between border-b border-border-bronze-light/40 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-vermilion-red">
              qr_code_2
            </span>
            <h2 className="font-serif text-sm font-bold text-text-charcoal">
              Thẻ Lookbook 9:16 Digital ID
            </h2>
          </div>
          <span className="text-[10px] font-mono text-bronze-gold font-bold">
            {frame.name.split(" ")[0]}
          </span>
        </div>

        {/* Mini 9:16 Card Mockup */}
        <div
          className="relative w-full max-w-[210px] mx-auto aspect-[9/16] bg-[#111111] rounded-xl overflow-hidden shadow-lg border-2 flex flex-col justify-between p-3 select-none transition-all duration-300 group"
          style={{ borderColor: frame.borderColor || "#C5A059" }}
        >
          {/* Top Tag */}
          <div className="flex items-center justify-between z-10">
            <span className="font-mono text-[8px] uppercase tracking-wider text-surface-pure font-bold px-1.5 py-0.5 bg-vermilion-red/90 rounded">
              AODAI STYLELAB
            </span>
            <span className="text-[8px] font-mono px-1 rounded bg-guardrail-pass text-white font-bold">
              GEN-Z PROOF
            </span>
          </div>

          {/* Center: Image or Empty Frame ("để khung trống") */}
          <div className="absolute inset-0 z-0">
            {resultImage ? (
              <>
                <img
                  alt="Vertical portrait"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={resultImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text-charcoal via-transparent to-black/30" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#181615] border border-dashed border-bronze-gold/30">
                <Sparkles className="w-6 h-6 text-bronze-gold/60 mb-1.5" />
                <span className="text-[10px] font-serif text-paper-cream/90 font-bold">
                  Khung Ảnh Trống
                </span>
                <span className="text-[8px] text-white/50 leading-relaxed mt-1 px-1">
                  Chưa có ảnh AI. Nhấn &ldquo;Tạo Ảnh AI FLUX&rdquo; ở cột giữa để hiển thị.
                </span>
              </div>
            )}
          </div>

          {/* Bottom Card Overlay */}
          <div className="relative z-10 text-white space-y-1.5">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-[9px] text-bronze-gold block font-semibold uppercase">
                  {style.name}
                </span>
                <p className="font-serif text-[13px] leading-tight font-bold text-white truncate max-w-[120px]">
                  {garment.name}
                </p>
              </div>
              <div className="w-7 h-7 bg-surface-pure p-0.5 rounded shadow-sm flex items-center justify-center">
                <div className="w-full h-full bg-text-charcoal rounded-[2px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[15px] text-white">
                    qr_code
                  </span>
                </div>
              </div>
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

        {/* Action Buttons Panel */}
        <div className="space-y-2 pt-1">
          <Link
            href="/lookbook"
            className="w-full py-2.5 bg-gradient-to-r from-vermilion-red to-primary text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Thẻ Lookbook 9:16 + QR</span>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyShareLink}
              className="py-2 bg-paper-cream hover:bg-surface-container text-text-charcoal rounded-xl font-mono text-[11px] font-semibold flex items-center justify-center gap-1 border border-border-bronze-light transition-colors"
              type="button"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-guardrail-pass" />
                  <span>Đã chép!</span>
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
              className="py-2 bg-paper-cream hover:bg-surface-container text-text-charcoal rounded-xl font-mono text-[11px] font-semibold flex items-center justify-center gap-1 border border-border-bronze-light transition-colors"
              type="button"
              title="Đổi mẫu khung viền 9:16"
            >
              <span className="material-symbols-outlined text-[15px] text-bronze-gold">
                filter_vintage
              </span>
              <span>Đổi Viền Thêu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

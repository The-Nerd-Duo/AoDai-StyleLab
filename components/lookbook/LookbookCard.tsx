"use client";

import React, { useRef, useState } from "react";
import { OutfitState, encodeOutfitToQuery } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { useOutfitStore } from "@/lib/store";
import { toPng } from "html-to-image";
import { Download, Share2, Sparkles, Check, QrCode, Sparkles as SparkleIcon, RefreshCw, Eye } from "lucide-react";

interface LookbookCardProps {
  outfit: OutfitState;
  frameId: string;
}

export const LookbookCard: React.FC<LookbookCardProps> = ({ outfit, frameId }) => {
  const { resultImage } = useOutfitStore();
  const [useAiPhoto, setUseAiPhoto] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const accessory = mockupsData.accessories.find((a) => a.id === outfit.accessoryId) || mockupsData.accessories[0];
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
      link.download = `vietphuc-lookbook-${outfit.garmentId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyShareLink = () => {
    const query = encodeOutfitToQuery(outfit, frameId);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/share?${query}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Lookbook 9:16 Render Canvas Container */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 select-none"
        style={{
          backgroundColor: "#0D1117",
          border: `3px solid ${frame.borderColor}`,
        }}
      >
        {/* Frame Decorative Background & Glow */}
        <div
          className="absolute inset-0 opacity-20 blur-2xl pointer-events-none"
          style={{ backgroundColor: color.hex }}
        />

        {/* Top Header Section */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="px-3 py-0.5 rounded-full bg-black/60 border border-white/20 text-[10px] font-bold tracking-widest text-heritage-gold uppercase mb-2">
            {frame.badgeText}
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide">
            {garment.name}
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">
            {garment.dynasty}
          </span>
        </div>

        {/* Center Mockup Stage */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-3">
          {resultImage && useAiPhoto ? (
            <div className="w-44 sm:w-52 h-56 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-heritage-gold/50 flex items-center justify-center bg-black/40 relative">
              <img
                src={resultImage}
                alt={garment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[9px] text-heritage-gold text-center font-medium">
                Ảnh AI Thực Tế • Cloudflare Worker
              </div>
            </div>
          ) : (
            /* Garment Visual */
            <div
              className="w-40 sm:w-48 h-56 sm:h-64 rounded-t-3xl rounded-b-xl shadow-2xl flex flex-col items-center justify-between p-3 border border-white/25 relative"
              style={{
                backgroundColor: color.hex,
                backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.25) 0%, transparent 70%)`,
              }}
            >
              {/* Traditional Pattern Motif Overlay */}
              <div className="w-12 h-6 border-b-2 border-heritage-gold rounded-b-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-heritage-gold" />
              </div>

              <div className="text-center bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10 w-full my-auto">
                <span className="text-[10px] text-amber-200 block font-bold uppercase tracking-wider">
                  Hành {color.element} • {color.name}
                </span>
                <span className="text-[9px] text-gray-300 block mt-0.5">
                  {style.name}
                </span>
              </div>

              {accessory.id !== "none" && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/70 text-heritage-gold border border-heritage-gold/40">
                  + {accessory.name}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Story & Metadata Card */}
        <div className="relative z-10 bg-black/75 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Bối cảnh:</span>
            <span className="text-white font-semibold">{occasion.name}</span>
          </div>

          <p className="text-[10px] text-gray-300 line-clamp-2 leading-relaxed italic">
            "{garment.culturalSignificance}"
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-gray-400">
            <span className="font-semibold text-heritage-gold">
              #VietPhucRemix #AIArena2026
            </span>
            <span>Stateless Card</span>
          </div>
        </div>
      </div>

      {/* Switch between AI photo and 2D vector */}
      {resultImage && (
        <div className="flex items-center gap-2 bg-heritage-dark-card border border-heritage-dark-border px-3 py-1.5 rounded-full text-xs">
          <span className="text-gray-400 text-[11px]">Chế độ ảnh:</span>
          <button
            onClick={() => setUseAiPhoto(true)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
              useAiPhoto
                ? "bg-heritage-gold text-heritage-dark shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Ảnh AI
          </button>
          <button
            onClick={() => setUseAiPhoto(false)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
              !useAiPhoto
                ? "bg-heritage-gold text-heritage-dark shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Đồ Họa 2D
          </button>
        </div>
      )}

      {/* Action Buttons: Download PNG & Copy Share Link */}
      <div className="flex items-center gap-3 w-full max-w-[340px] sm:max-w-[380px]">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 py-3 px-4 rounded-xl bg-heritage-gold hover:bg-heritage-gold-light text-heritage-dark font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-heritage-gold/20 transition-all"
        >
          <Download className={`w-4 h-4 ${downloading ? "animate-bounce" : ""}`} />
          <span>{downloading ? "Đang xuất PNG..." : "Tải Ảnh PNG (9:16)"}</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="flex-1 py-3 px-4 rounded-xl bg-heritage-dark-card hover:bg-heritage-dark-hover border border-heritage-dark-border text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span className="text-emerald-400 font-bold">Đã chép Link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-heritage-gold" />
              <span>Copy Link Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

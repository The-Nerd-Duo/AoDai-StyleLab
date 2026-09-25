"use client";

import React from "react";
import Link from "next/link";
import { OutfitState } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import { Sparkles, Layers, ArrowRight, ShieldCheck, Heart } from "lucide-react";

interface PreviewWorkspaceProps {
  outfit: OutfitState;
  customAvatarUrl?: string | null;
  onSaveToCompare: () => void;
  hasCompareOutfit: boolean;
}

export const PreviewWorkspace: React.FC<PreviewWorkspaceProps> = ({
  outfit,
  customAvatarUrl,
  onSaveToCompare,
  hasCompareOutfit,
}) => {
  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const accessory = mockupsData.accessories.find((a) => a.id === outfit.accessoryId) || mockupsData.accessories[0];
  const persona = mockupsData.personas.find((p) => p.id === outfit.personaId) || mockupsData.personas[0];

  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      {/* Top Bar of Workspace */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase">
            Live Preview • Trực Quan Phối Đồ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-heritage-gold/15 text-heritage-gold border border-heritage-gold/30">
            Hành {color.element}
          </span>
        </div>
      </div>

      {/* Main Mockup Visual Display (9:16 or 4:5 adaptive aesthetic ratio) */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[9/12] max-h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#181C26] via-[#10131B] to-[#0A0C10] border border-heritage-dark-border flex flex-col items-center justify-between p-5 shadow-2xl">
        {/* Background Cultural Silhouette & Ambient Glow */}
        <div
          className="absolute inset-0 opacity-25 blur-3xl transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: color.hex }}
        />

        {/* Top Badges */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-gray-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.hex }} />
            <span>{color.name}</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-heritage-gold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>{style.name}</span>
          </div>
        </div>

        {/* Center Character & Outfit Illustration Canvas */}
        <div className="relative flex-1 w-full flex items-center justify-center py-2 z-10">
          {/* Avatar representation or Custom uploaded avatar */}
          <div className="relative w-44 sm:w-56 h-full flex flex-col items-center justify-center">
            {/* Custom Face / Avatar Head */}
            <div className="relative z-20 -mb-3">
              {customAvatarUrl ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-heritage-gold shadow-lg">
                  <img src={customAvatarUrl} alt="Custom Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#EAD2B8] to-[#C9A683] border-2 border-heritage-gold shadow-md flex items-center justify-center text-heritage-dark font-bold text-xs">
                  {persona.gender === "female" ? "👩🏻" : "👨🏻"}
                </div>
              )}
            </div>

            {/* Simulated Garment Silhouette with Authentic Cut & Palette */}
            <div
              className="relative w-36 sm:w-48 h-56 sm:h-64 rounded-t-3xl rounded-b-xl shadow-2xl transition-all duration-500 flex flex-col items-center justify-between p-3 border border-white/20"
              style={{
                backgroundColor: color.hex,
                backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
              }}
            >
              {/* Collar Detail */}
              <div className="w-12 h-6 border-b-2 border-heritage-gold/80 rounded-b-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-heritage-gold" />
              </div>

              {/* Garment Details & Patterns */}
              <div className="text-center px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/10 w-full my-auto">
                <span className="text-[11px] font-bold text-white block uppercase tracking-wider">
                  {garment.name}
                </span>
                <span className="text-[9px] text-amber-200/90 block">
                  {garment.dynasty}
                </span>
              </div>

              {/* Accessory Tag at hem */}
              {accessory.id !== "none" && (
                <div className="px-2 py-0.5 rounded-full bg-black/70 border border-heritage-gold/40 text-[9px] text-heritage-gold flex items-center gap-1">
                  <span>+ {accessory.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Context Info Strip */}
        <div className="w-full z-10 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-400 text-[10px] block">Bối cảnh:</span>
            <span className="text-white font-semibold text-[11px]">{occasion.name}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-[10px] block">Đại diện:</span>
            <span className="text-heritage-gold font-medium text-[11px]">{persona.name}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: A/B Compare and Lookbook */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onSaveToCompare}
          className="px-3 py-2.5 rounded-xl border border-heritage-dark-border bg-heritage-dark-hover hover:border-gray-500 text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Layers className="w-4 h-4 text-heritage-gold" />
          <span>{hasCompareOutfit ? "Ghi đè bản A" : "Lưu làm bản A để so sánh"}</span>
        </button>

        <Link
          href="/lookbook"
          className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-heritage-red to-heritage-red-light hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-heritage-red/25 transition-all"
        >
          <span>Tạo Lookbook 9:16</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { Header } from "@/components/shared/Header";
import { OptionSelector } from "@/components/studio/OptionSelector";
import { PreviewWorkspace } from "@/components/studio/PreviewWorkspace";
import { CulturalAdvisorCard } from "@/components/studio/CulturalAdvisorCard";
import { PersonaSelector } from "@/components/studio/PersonaSelector";
import { OutfitComparisonModal } from "@/components/studio/OutfitComparisonModal";
import { useOutfitStore } from "@/lib/store";
import { Sparkles } from "lucide-react";
import mockupsData from "@/config/mockups.json";

// Dán link copy ở Bước 2 vào đây
const WORKER_AI_URL = "https://vietphuc-ai-api.tunaemm.workers.dev";

export default function StudioPage() {
  const {
    outfit,
    setOutfit,
    updateOutfitField,
    compareOutfit,
    saveToCompare,
    clearCompare,
    resultImage,
    setResultImage,
  } = useOutfitStore();

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId)?.name || outfit.garmentId;
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId)?.name || outfit.styleId;

  async function handleGenerateOutfit() {
    setLoading(true);
    try {
      const res = await fetch(WORKER_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Vietnamese model wearing traditional white ${garment}, ${style} style, studio light, 8k`
        }),
      });

      if (!res.ok) throw new Error("Lỗi khi tạo ảnh");

      // Nhận dữ liệu ảnh nhị phân và tạo link hiển thị
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      // Gán vào state hiển thị thẻ <img>
      setResultImage(imageUrl);
    } catch (error) {
      alert("Có lỗi khi tạo ảnh từ AI!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onOpenCompare={() => setIsCompareOpen(true)}
        hasCompareOutfit={!!compareOutfit}
      />

      <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 flex flex-col gap-6">
        {/* Hero Tagline */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-gold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Tab 1 • Studio Phối Đồ & Cố Vấn AI
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Phối Trang Phục Truyền Thống Theo Phong Cách Gen Z
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-3xl">
            Tự do thử nghiệm các bản phối giữa Áo Dài, Áo Ngũ Thân, Áo Tấc cùng gu thời trang đương đại.
            Hệ thống AI Gemini bảo đảm tính thẩm mỹ và thuần phong mỹ tục di sản.
          </p>
        </div>

        {/* Persona & Avatar Selector */}
        <PersonaSelector
          selectedPersonaId={outfit.personaId}
          onSelectPersona={(id) => updateOutfitField("personaId", id)}
          customAvatarUrl={customAvatar}
          onUploadCustomAvatar={(dataUrl) => setCustomAvatar(dataUrl)}
        />

        {/* Studio Main Grid: Left is Options & AI Advisor, Right is Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Option Controls & AI Advisor */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <OptionSelector outfit={outfit} onChange={updateOutfitField} />
            <CulturalAdvisorCard outfit={outfit} />
          </div>

          {/* Right Column (5 cols): Live Preview Sticky Workspace */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="sticky top-20">
              <PreviewWorkspace
                outfit={outfit}
                customAvatarUrl={customAvatar}
                onSaveToCompare={saveToCompare}
                hasCompareOutfit={!!compareOutfit}
                resultImage={resultImage}
                setResultImage={setResultImage}
                loading={loading}
                onGenerateOutfit={handleGenerateOutfit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Outfit Comparison Modal */}
      <OutfitComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        outfitA={compareOutfit}
        outfitB={outfit}
        onSelectA={() => {
          if (compareOutfit) setOutfit(compareOutfit);
        }}
      />
    </div>
  );
}

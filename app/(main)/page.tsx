"use client";

import React, { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { OptionSelector } from "@/components/studio/OptionSelector";
import { PreviewWorkspace } from "@/components/studio/PreviewWorkspace";
import { CulturalAdvisorCard } from "@/components/studio/CulturalAdvisorCard";
import { StudioRightPanel } from "@/components/studio/StudioRightPanel";
import { useOutfitStore } from "@/lib/store";
import { generateOutfitPrompt, callFluxWorkerAi } from "@/lib/ai-prompt";

export default function StudioPage() {
  const {
    outfit,
    updateOutfitField,
    resultImage,
    setResultImage,
    selectedFrame,
    setSelectedFrame,
  } = useOutfitStore();

  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerateOutfit() {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 flex flex-col gap-5">
        {/* MAIN STUDIO DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Mix & Match Matrix (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
            <OptionSelector
              outfit={outfit}
              onChange={updateOutfitField}
              customAvatarUrl={customAvatar}
              onUploadCustomAvatar={(dataUrl) => setCustomAvatar(dataUrl)}
            />
          </div>

          {/* RIGHT WORKSPACE AREA (col-span-8): Top Row (Preview & Lookbook) + Bottom Row (Cultural Harmony AI) */}
          <div className="lg:col-span-8 flex flex-col gap-5 order-1 lg:order-2">
            {/* TOP ROW: UI "Kết quả phối đồ" & UI "Thẻ lookbook" - Chiều cao bằng nhau và cố định song song */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Kết quả phối đồ (md:col-span-7) */}
              <div className="md:col-span-7 flex flex-col">
                <PreviewWorkspace
                  outfit={outfit}
                  resultImage={resultImage}
                  setResultImage={setResultImage}
                  loading={loading}
                  onGenerateOutfit={handleGenerateOutfit}
                />
              </div>

              {/* Thẻ Lookbook 9:16 (md:col-span-5) - Cố định cùng hàng, chiều cao bằng với UI Kết quả phối đồ */}
              <div className="md:col-span-5 flex flex-col">
                <StudioRightPanel
                  outfit={outfit}
                  resultImage={resultImage}
                  selectedFrame={selectedFrame}
                  onSelectFrame={setSelectedFrame}
                />
              </div>
            </div>

            {/* BOTTOM ROW: Cultural Harmony AI - Mở rộng toàn bộ sang bên phải đến mép của thẻ lookbook */}
            <div className="w-full">
              <CulturalAdvisorCard outfit={outfit} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

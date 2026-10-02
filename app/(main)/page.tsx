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
        {/* MAIN THREE-COLUMN STUDIO DASHBOARD */}
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

          {/* CENTER COLUMN: Showcase Canvas & Cultural Harmony AI (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-2">
            <PreviewWorkspace
              outfit={outfit}
              resultImage={resultImage}
              setResultImage={setResultImage}
              loading={loading}
              onGenerateOutfit={handleGenerateOutfit}
            />
            <CulturalAdvisorCard outfit={outfit} />
          </div>

          {/* RIGHT COLUMN: Lookbook 9:16 Digital ID (col-span-3, sticky) */}
          <div className="lg:col-span-3 flex flex-col gap-5 order-3 sticky top-20">
            <StudioRightPanel
              outfit={outfit}
              resultImage={resultImage}
              selectedFrame={selectedFrame}
              onSelectFrame={setSelectedFrame}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { OptionSelector } from "@/components/studio/OptionSelector";
import { PreviewWorkspace, StudioBadgeInfo } from "@/components/studio/PreviewWorkspace";
import { CulturalAdvisorCard } from "@/components/studio/CulturalAdvisorCard";
import { StudioRightPanel } from "@/components/studio/StudioRightPanel";
import { useOutfitStore } from "@/lib/store";
import { generateOutfitPrompt, callFluxWorkerAi } from "@/lib/ai-prompt";
import { formatRemixOutfitSummary } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";

const REQUIRED_CATEGORIES = [
  { key: "personaId", label: "Nhân vật", categoryId: "persona" },
  { key: "garmentId", label: "Cổ phục", categoryId: "garment" },
  { key: "colorId", label: "Màu sắc", categoryId: "color" },
  { key: "occasionId", label: "Bối cảnh", categoryId: "occasion" },
  { key: "styleId", label: "Phong cách", categoryId: "style" },
] as const;

export default function StudioPage() {
  const {
    outfit,
    setOutfit,
    updateOutfitField,
    resultImage,
    setResultImage,
    selectedFrame,
    setSelectedFrame,
  } = useOutfitStore();

  const [loading, setLoading] = useState(false);
  const [isPersonaConfirmed, setIsPersonaConfirmed] = useState(false);
  const [chosenCategories, setChosenCategories] = useState<Set<string>>(() => new Set());
  const [activeCategory, setActiveCategory] = useState<
    "garment" | "color" | "occasion" | "style" | "accessory"
  >("garment");
  const [badgeInfo, setBadgeInfo] = useState<StudioBadgeInfo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");

      if (mode === "remix") {
        let remixOutfit = outfit;
        try {
          const stored = sessionStorage.getItem("vietphuc_studio_context");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.type === "remix" && parsed.outfit) {
              remixOutfit = parsed.outfit;
              if (setOutfit) {
                setOutfit(parsed.outfit);
              }
            }
          }
        } catch {}

        const details = formatRemixOutfitSummary(remixOutfit);
        setBadgeInfo({
          type: "remix",
          details,
        });

        // Mark all options as selected when remixing
        setChosenCategories(new Set(["personaId", "garmentId", "colorId", "occasionId", "styleId"]));
        setIsPersonaConfirmed(true);
      } else if (mode === "trial") {
        let garmentName = params.get("name") || "";
        const g = params.get("g");

        if (!garmentName) {
          try {
            const stored = sessionStorage.getItem("vietphuc_studio_context");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.type === "trial" && parsed.garmentName) {
                garmentName = parsed.garmentName;
              }
            }
          } catch {}
        }

        if (!garmentName && g) {
          garmentName = mockupsData.garments.find((item) => item.id === g)?.name || g;
        }

        if (g && mockupsData.garments.some((item) => item.id === g)) {
          updateOutfitField("garmentId", g);
          setChosenCategories((prev) => new Set(prev).add("garmentId"));
        }

        setBadgeInfo({
          type: "trial",
          details: garmentName || "Cổ phục di sản",
        });
      } else {
        // Normal direct visit: no badge
        setBadgeInfo(null);
        try {
          sessionStorage.removeItem("vietphuc_studio_context");
        } catch {}

        const g = params.get("g");
        if (g && mockupsData.garments.some((item) => item.id === g)) {
          updateOutfitField("garmentId", g);
          setChosenCategories((prev) => new Set(prev).add("garmentId"));
        }
      }
    }
  }, [updateOutfitField, setOutfit]);

  const handleDismissBadge = () => {
    setBadgeInfo(null);
    try {
      sessionStorage.removeItem("vietphuc_studio_context");
      if (typeof window !== "undefined" && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete("mode");
        url.searchParams.delete("name");
        window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
      }
    } catch {}
  };

  const missingCategories = REQUIRED_CATEGORIES.filter((req) => {
    if (req.key === "personaId") {
      return !isPersonaConfirmed || !chosenCategories.has("personaId");
    }
    return !chosenCategories.has(req.key);
  });

  const isOptionComplete = missingCategories.length === 0;

  async function handleGenerateOutfit() {
    if (!isOptionComplete) {
      alert("Vui lòng chọn đầy đủ các mục (Nhân vật, Cổ phục, Màu sắc, Bối cảnh, Phong cách) trước khi tạo đồ!");
      return;
    }
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
          <div id="mix-match-selector" className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
            <OptionSelector
              outfit={outfit}
              onChange={updateOutfitField}
              isPersonaConfirmed={isPersonaConfirmed}
              setIsPersonaConfirmed={setIsPersonaConfirmed}
              chosenCategories={chosenCategories}
              setChosenCategories={setChosenCategories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
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
                  isOptionComplete={isOptionComplete}
                  missingItems={missingCategories}
                  badgeInfo={badgeInfo}
                  onDismissBadge={handleDismissBadge}
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
              <CulturalAdvisorCard outfit={outfit} resultImage={resultImage} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

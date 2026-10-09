"use client";

import React, { useState, useEffect, useRef } from "react";
import { OptionSelector } from "@/components/studio/OptionSelector";
import { PreviewWorkspace, StudioBadgeInfo } from "@/components/studio/PreviewWorkspace";
import { CulturalAdvisorCard } from "@/components/studio/CulturalAdvisorCard";
import { StudioRightPanel } from "@/components/studio/StudioRightPanel";
import { useOutfitStore, DEFAULT_OUTFIT } from "@/lib/store";
import { generateOutfitPrompt, callFluxWorkerAi } from "@/lib/ai-prompt";
import { formatRemixOutfitSummary } from "@/lib/utils";
import {
  getActiveStudioContext,
  setActiveStudioContext,
  clearActiveStudioContext,
} from "@/lib/studio-context";
import mockupsData from "@/config/mockups.json";

const REQUIRED_CATEGORIES = [
  { key: "personaId", label: "Nhân vật", categoryId: "persona" },
  { key: "garmentId", label: "Cổ phục", categoryId: "garment" },
  { key: "colorId", label: "Màu sắc", categoryId: "color" },
  { key: "occasionId", label: "Bối cảnh", categoryId: "occasion" },
  { key: "styleId", label: "Phong cách", categoryId: "style" },
] as const;

export const StudioDashboard: React.FC = () => {
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
  const [activeCategory, setActiveCategory] = useState<
    "garment" | "color" | "occasion" | "style" | "accessory"
  >("garment");

  // Synchronously initialize state on client so first paint ALREADY has remix / trial state (zero flashing/jumping)
  const [badgeInfo, setBadgeInfo] = useState<StudioBadgeInfo | null>(() => {
    if (typeof window !== "undefined") {
      const active = getActiveStudioContext();
      if (active) {
        return {
          type: active.type,
          details: active.details,
        };
      }
    }
    return null;
  });

  const [isPersonaConfirmed, setIsPersonaConfirmed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const active = getActiveStudioContext();
      if (active?.type === "remix") return true;
      try {
        const stored = sessionStorage.getItem("vietphuc_persona_confirmed");
        if (stored !== null) return stored === "1";
      } catch {}
    }
    return false;
  });

  const [chosenCategories, setChosenCategories] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const active = getActiveStudioContext();
      if (active?.type === "remix") {
        return new Set(["personaId", "garmentId", "colorId", "occasionId", "styleId"]);
      }
      try {
        const stored = sessionStorage.getItem("vietphuc_chosen_categories");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const s = new Set<string>(parsed);
            if (active?.type === "trial" && active.garmentId) {
              s.add("garmentId");
            }
            return s;
          }
        }
      } catch {}
      if (active?.type === "trial" && active.garmentId) {
        return new Set(["garmentId"]);
      }
    }
    return new Set();
  });

  const hasMountedRef = useRef(false);

  // Sync chosen categories and persona to sessionStorage whenever user alters choices
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    try {
      sessionStorage.setItem(
        "vietphuc_chosen_categories",
        JSON.stringify(Array.from(chosenCategories))
      );
    } catch {}
  }, [chosenCategories]);

  useEffect(() => {
    if (!hasMountedRef.current) return;
    try {
      sessionStorage.setItem(
        "vietphuc_persona_confirmed",
        isPersonaConfirmed ? "1" : "0"
      );
    } catch {}
  }, [isPersonaConfirmed]);

  // When clicking 'x': ABANDON the remix/trial and reset ALL current selections back to default
  const handleDismissBadge = () => {
    // 1. Clear badge display
    setBadgeInfo(null);

    // 2. Clear persisted studio context from storage
    clearActiveStudioContext();

    // 3. Clear URL query parameters
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("vietphuc_chosen_categories");
        sessionStorage.removeItem("vietphuc_persona_confirmed");
        sessionStorage.removeItem("vietphuc_result_image");
        localStorage.removeItem("vietphuc_result_image");
      } catch {}
      if (window.history.replaceState) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    }

    // 4. Reset AI Image to null and clear cached image
    if (setResultImage) {
      setResultImage(null);
    }

    // 5. Reset all user selections back to initial unselected neutral state
    setChosenCategories(new Set());
    setIsPersonaConfirmed(false);
    if (setOutfit) {
      setOutfit(DEFAULT_OUTFIT);
    }
    if (setSelectedFrame) {
      setSelectedFrame("frame-default-none");
    }
    setActiveCategory("garment");
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
  );
};

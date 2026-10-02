"use client";

import { useState, useEffect } from "react";
import { OutfitState } from "./utils";

export const DEFAULT_OUTFIT: OutfitState = {
  garmentId: "ao-dai-cach-tan",
  colorId: "red-son",
  occasionId: "street-walk",
  styleId: "y2k-neo",
  accessoryId: "man-modern",
  personaId: "female-modern",
};

const STORAGE_KEY = "vietphuc_current_outfit";
const COMPARE_KEY = "vietphuc_compare_outfit";
const FRAME_KEY = "vietphuc_selected_frame";
const RESULT_IMAGE_KEY = "vietphuc_result_image";

export function useOutfitStore() {
  const [outfit, setOutfitState] = useState<OutfitState>(DEFAULT_OUTFIT);
  const [compareOutfit, setCompareOutfitState] = useState<OutfitState | null>(null);
  const [selectedFrame, setSelectedFrameState] = useState<string>("frame-heritage-vermilion");
  const [resultImage, setResultImageState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedOutfit = localStorage.getItem(STORAGE_KEY);
      if (savedOutfit) {
        setOutfitState(JSON.parse(savedOutfit));
      }
      const savedCompare = localStorage.getItem(COMPARE_KEY);
      if (savedCompare) {
        setCompareOutfitState(JSON.parse(savedCompare));
      }
      const savedFrame = localStorage.getItem(FRAME_KEY);
      if (savedFrame) {
        setSelectedFrameState(savedFrame);
      }
      const savedImage = localStorage.getItem(RESULT_IMAGE_KEY);
      if (savedImage) {
        setResultImageState(savedImage);
      }
    } catch {
      // Ignore localStorage errors (e.g. incognito)
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setOutfit = (newOutfit: OutfitState) => {
    setOutfitState(newOutfit);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOutfit));
    } catch {}
  };

  const updateOutfitField = <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => {
    setOutfitState((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const saveToCompare = () => {
    setCompareOutfitState(outfit);
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(outfit));
    } catch {}
  };

  const clearCompare = () => {
    setCompareOutfitState(null);
    try {
      localStorage.removeItem(COMPARE_KEY);
    } catch {}
  };

  const setSelectedFrame = (frameId: string) => {
    setSelectedFrameState(frameId);
    try {
      localStorage.setItem(FRAME_KEY, frameId);
    } catch {}
  };

  const setResultImage = (url: string | null) => {
    setResultImageState(url);
    try {
      if (url) {
        localStorage.setItem(RESULT_IMAGE_KEY, url);
      } else {
        localStorage.removeItem(RESULT_IMAGE_KEY);
      }
    } catch {}
  };

  return {
    outfit,
    setOutfit,
    updateOutfitField,
    compareOutfit,
    saveToCompare,
    clearCompare,
    selectedFrame,
    setSelectedFrame,
    resultImage,
    setResultImage,
    isLoaded,
  };
}

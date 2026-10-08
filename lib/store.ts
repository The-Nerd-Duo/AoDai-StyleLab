"use client";

import { useSyncExternalStore, useEffect, useCallback } from "react";
import { OutfitState } from "./utils";

export const DEFAULT_OUTFIT: OutfitState = {
  garmentId: "ao-dai-cach-tan",
  colorId: "red-son",
  occasionId: "street-walk",
  styleId: "y2k-neo",
  accessoryId: "none",
  accessoryIds: ["none"],
  personaId: "female-modern",
};

const STORAGE_KEY = "vietphuc_current_outfit";
const COMPARE_KEY = "vietphuc_compare_outfit";
const FRAME_KEY = "vietphuc_selected_frame";
const RESULT_IMAGE_KEY = "vietphuc_result_image";

interface StoreState {
  outfit: OutfitState;
  compareOutfit: OutfitState | null;
  selectedFrame: string;
  resultImage: string | null;
  isLoaded: boolean;
}

const SERVER_SNAPSHOT: StoreState = {
  outfit: DEFAULT_OUTFIT,
  compareOutfit: null,
  selectedFrame: "frame-default-none",
  resultImage: null,
  isLoaded: false,
};

let currentStoreState: StoreState = {
  ...SERVER_SNAPSHOT,
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persistState(state: StoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.outfit));
    if (state.compareOutfit) {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(state.compareOutfit));
    } else {
      localStorage.removeItem(COMPARE_KEY);
    }
    localStorage.setItem(FRAME_KEY, state.selectedFrame);

    if (state.resultImage && state.resultImage.trim()) {
      // Store in sessionStorage (high capacity for base64 images per tab)
      try {
        sessionStorage.setItem(RESULT_IMAGE_KEY, state.resultImage);
      } catch {}

      // Also store in localStorage (cross-tab/reboot persistence)
      try {
        localStorage.setItem(RESULT_IMAGE_KEY, state.resultImage);
      } catch (quotaErr) {
        console.warn("localStorage quota exceeded for image, saved in sessionStorage:", quotaErr);
      }
    } else {
      try {
        sessionStorage.removeItem(RESULT_IMAGE_KEY);
        localStorage.removeItem(RESULT_IMAGE_KEY);
      } catch {}
    }
  } catch (err) {
    console.warn("Storage sync error:", err);
  }
}

let hasInitializedFromStorage = false;

function initFromStorage() {
  if (typeof window === "undefined" || hasInitializedFromStorage) return;
  hasInitializedFromStorage = true;

  try {
    let savedOutfit = currentStoreState.outfit;
    const rawOutfit = localStorage.getItem(STORAGE_KEY);
    if (rawOutfit) {
      const parsed = JSON.parse(rawOutfit);
      if (!Array.isArray(parsed.accessoryIds)) {
        parsed.accessoryIds = parsed.accessoryId ? [parsed.accessoryId] : [];
      }
      savedOutfit = parsed;
    }

    let savedCompare = currentStoreState.compareOutfit;
    const rawCompare = localStorage.getItem(COMPARE_KEY);
    if (rawCompare) {
      savedCompare = JSON.parse(rawCompare);
    }

    let savedFrame = currentStoreState.selectedFrame;
    const rawFrame = localStorage.getItem(FRAME_KEY);
    if (rawFrame) {
      savedFrame = rawFrame;
    }

    // Mặc định khi vào app, khung ảnh luôn ở trạng thái trống
    let savedImage: string | null = null;

    currentStoreState = {
      outfit: savedOutfit,
      compareOutfit: savedCompare,
      selectedFrame: savedFrame,
      resultImage: savedImage,
      isLoaded: true,
    };
    notify();
  } catch {
    currentStoreState = { ...currentStoreState, isLoaded: true };
    notify();
  }
}

export function useOutfitStore() {
  useEffect(() => {
    initFromStorage();
  }, []);

  const store = useSyncExternalStore(
    subscribe,
    () => currentStoreState,
    () => SERVER_SNAPSHOT
  );

  const setOutfit = useCallback((newOutfit: OutfitState) => {
    currentStoreState = {
      ...currentStoreState,
      outfit: newOutfit,
    };
    persistState(currentStoreState);
    notify();
  }, []);

  const updateOutfitField = useCallback(
    <K extends keyof OutfitState>(key: K, value: OutfitState[K]) => {
      const updatedOutfit = { ...currentStoreState.outfit, [key]: value };
      currentStoreState = {
        ...currentStoreState,
        outfit: updatedOutfit,
      };
      persistState(currentStoreState);
      notify();
    },
    []
  );

  const saveToCompare = useCallback(() => {
    currentStoreState = {
      ...currentStoreState,
      compareOutfit: currentStoreState.outfit,
    };
    persistState(currentStoreState);
    notify();
  }, []);

  const clearCompare = useCallback(() => {
    currentStoreState = {
      ...currentStoreState,
      compareOutfit: null,
    };
    persistState(currentStoreState);
    notify();
  }, []);

  const setSelectedFrame = useCallback((frameId: string) => {
    currentStoreState = {
      ...currentStoreState,
      selectedFrame: frameId,
    };
    persistState(currentStoreState);
    notify();
  }, []);

  const setResultImage = useCallback((url: string | null) => {
    currentStoreState = {
      ...currentStoreState,
      resultImage: url,
    };
    persistState(currentStoreState);
    notify();

    // If it is a blob URL, asynchronously convert to base64 Data URL so it permanently survives
    if (url && url.startsWith("blob:")) {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              currentStoreState = {
                ...currentStoreState,
                resultImage: reader.result,
              };
              persistState(currentStoreState);
              notify();
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {});
    }
  }, []);

  return {
    outfit: store.outfit,
    setOutfit,
    updateOutfitField,
    compareOutfit: store.compareOutfit,
    saveToCompare,
    clearCompare,
    selectedFrame: store.selectedFrame,
    setSelectedFrame,
    resultImage: store.resultImage,
    setResultImage,
    isLoaded: store.isLoaded,
  };
}

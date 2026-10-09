import { OutfitState } from "./utils";

export interface LookbookItem {
  id: string;
  title: string;
  era: string;
  author: string;
  authorInitial: string;
  isAnonymous: boolean;
  likes: number;
  shares: number;
  category: "all" | "pho-co" | "cung-dinh" | "y2k" | "da-tiec" | string;
  img?: string | null;
  outfit?: OutfitState;
  frameId?: string;
  culturalNote?: string;
  createdAt: string;
  badge?: string;
  deviceId?: string;
}

export interface CreateLookbookInput {
  title?: string;
  author?: string;
  isAnonymous?: boolean;
  category?: string;
  img?: string | null;
  outfit: OutfitState;
  frameId?: string;
  era?: string;
  culturalNote?: string;
  deviceId?: string;
}

export interface CulturalAdvisorRequest {
  garmentId?: string;
  colorId?: string;
  occasionId?: string;
  styleId?: string;
  accessoryId?: string;
  accessoryIds?: string[];
  personaId?: string;
}

export interface CulturalAdvisorResponse {
  colorHarmonyScore: number;
  weatherFitScore: number;
  culturalRespectScore: number;
  overallScore: number;
  elementAnalysis: {
    element: string;
    description: string;
  };
  colorHarmonyVerdict: string;
  weatherAdvice: string;
  culturalNotes: string;
  genZStylingTip: string;
  warnings: string[];
}

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
}

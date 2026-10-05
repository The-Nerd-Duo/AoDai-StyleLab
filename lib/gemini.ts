import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const DEFAULT_FLASH_MODEL = process.env.GEMINI_FLASH_MODEL || "gemini-3.5-flash-lite";
export const DEFAULT_PRO_MODEL = process.env.GEMINI_PRO_MODEL || "gemini-3.5-flash-lite";

// Danh sách model dự phòng theo đúng thứ tự ưu tiên:
// 1. gemini-3.5-flash-lite (tốc độ cao, hạn mức request lớn)
// 2. gemini-3.8-flash
// 3. gemini-2.5-flash
export const FALLBACK_MODELS: string[] = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

export function getCandidateModels(preferredModel?: string): string[] {
  const list = [
    preferredModel,
    process.env.GEMINI_FLASH_MODEL,
    ...FALLBACK_MODELS,
  ].filter(Boolean) as string[];
  return Array.from(new Set(list));
}

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const DEFAULT_FLASH_MODEL = process.env.GEMINI_FLASH_MODEL || "gemini-2.0-flash";
export const DEFAULT_PRO_MODEL = process.env.GEMINI_PRO_MODEL || "gemini-2.0-flash";

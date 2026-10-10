import { OutfitState } from "./utils";
import mockupsData from "@/config/mockups.json";

// Re-export từ src/utils/prompts để thống nhất API trên toàn bộ dự án
export {
  ANCHOR_PROMPT,
  GARMENT_PROMPTS,
  ACCESSORY_PROMPTS,
  SETTING_PROMPTS,
  STYLE_PROMPTS,
  buildFinalPrompt,
} from "@/src/utils/prompts";
import {
  ANCHOR_PROMPT,
  GARMENT_PROMPTS,
  ACCESSORY_PROMPTS,
  SETTING_PROMPTS,
  STYLE_PROMPTS,
} from "@/src/utils/prompts";

export const GARMENT_PROMPT_MAP = GARMENT_PROMPTS;
export const ACCESSORY_PROMPT_MAP = ACCESSORY_PROMPTS;
export const OCCASION_PROMPT_MAP = SETTING_PROMPTS;
export const STYLE_PROMPT_MAP = STYLE_PROMPTS;

export const COLOR_PROMPT_MAP: Record<string, string> = {
  "red-son": "vibrant vermilion red silk fabric (đỏ son chu sa)",
  "gold-hoang-kim": "imperial golden yellow silk fabric (vàng hoàng kim)",
  "jade-thanh-thien": "serene jade emerald celadon green silk fabric (xanh ngọc thanh thiên)",
  "indigo-cham": "traditional deep indigo blue silk fabric (xanh chàm cổ kính)",
  "white-ngoc-trai": "pure pearl ivory silk fabric (trắng ngà tơ tằm)",
  "black-tuyen": "luxurious deep pitch black silk fabric (đen huyền tuyền)",
  "pink-sen": "graceful lotus blossom pink silk fabric (hồng cánh sen)",
};

export const STYLE_BACKGROUND_MAP: Record<string, { styleDesc: string; background: string }> = {
  "y2k-neo": {
    styleDesc: STYLE_PROMPTS["y2k-neo"],
    background: "Y2K futuristic retro aesthetic",
  },
  "streetwear": {
    styleDesc: STYLE_PROMPTS["streetwear"],
    background: "raw urban high-fashion streetwear",
  },
  "minimal-chic": {
    styleDesc: STYLE_PROMPTS["minimal-chic"],
    background: "monochrome muted earth tones",
  },
  "cyber-retro": {
    styleDesc: STYLE_PROMPTS["cyber-retro"],
    background: "Eastern cyberpunk mood",
  },
  "vintage-academia": {
    styleDesc: STYLE_PROMPTS["vintage-academia"],
    background: "1930s French Indochine vintage film photography",
  },
};

export const PERSONA_MODEL_MAP: Record<string, string> = {
  "female-modern": "Vietnamese female model",
  "male-modern": "Vietnamese male model",
  "female-classic": "Vietnamese female model",
  "male-heritage": "Vietnamese male model",
};

export interface PromptBreakdown {
  garmentName: string;
  garmentPrompt: string;
  colorName: string;
  colorPrompt: string;
  occasionName: string;
  occasionPrompt: string;
  styleName: string;
  stylePrompt: string;
  accessoryName: string;
  accessoryPrompt: string;
  personaPrompt: string;
  fullPrompt: string;
}

export function getOutfitPromptBreakdown(outfit: OutfitState): PromptBreakdown {
  const garmentObj = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const colorObj = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasionObj = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const styleObj = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];

  const accessoryIds = outfit.accessoryIds && outfit.accessoryIds.length > 0
    ? outfit.accessoryIds
    : outfit.accessoryId && outfit.accessoryId !== "none" ? [outfit.accessoryId] : [];

  const selectedAccessories = mockupsData.accessories.filter((a) => accessoryIds.includes(a.id));
  const accessoryName = selectedAccessories.length > 0
    ? selectedAccessories.map((a) => a.name).join(", ")
    : "Không có phụ kiện";

  const garmentPrompt = GARMENT_PROMPT_MAP[outfit.garmentId] || GARMENT_PROMPT_MAP[garmentObj.name] || "";
  const colorPrompt = COLOR_PROMPT_MAP[outfit.colorId] || "";
  const occasionPrompt = OCCASION_PROMPT_MAP[outfit.occasionId] || "";
  const stylePrompt = STYLE_PROMPT_MAP[outfit.styleId] || "";
  const accessoryPrompt = accessoryIds
    .map((id) => ACCESSORY_PROMPT_MAP[id])
    .filter(Boolean)
    .join(", ");
  const personaPrompt = PERSONA_MODEL_MAP[outfit.personaId] || "Vietnamese model";

  const fullPrompt = generateOutfitPrompt(outfit);

  return {
    garmentName: garmentObj.name,
    garmentPrompt,
    colorName: colorObj.name,
    colorPrompt,
    occasionName: occasionObj.name,
    occasionPrompt: occasionPrompt ? `Setting: ${occasionPrompt}` : "",
    styleName: styleObj.name,
    stylePrompt: stylePrompt ? `Aesthetics: ${stylePrompt}` : "",
    accessoryName,
    accessoryPrompt: accessoryPrompt ? `Accessorized with ${accessoryPrompt}` : "",
    personaPrompt,
    fullPrompt,
  };
}

export function generateOutfitPrompt(outfit: OutfitState): string {
  const model = PERSONA_MODEL_MAP[outfit.personaId] || "Vietnamese model";
  const color = COLOR_PROMPT_MAP[outfit.colorId] || "vibrant vermilion red silk fabric (đỏ son chu sa)";
  const garment = GARMENT_PROMPT_MAP[outfit.garmentId] || GARMENT_PROMPT_MAP["ao-dai-truyen-thong"];
  const occasion = OCCASION_PROMPT_MAP[outfit.occasionId] || "";
  const style = STYLE_PROMPT_MAP[outfit.styleId] || "";

  const accessoryIds = outfit.accessoryIds && outfit.accessoryIds.length > 0
    ? outfit.accessoryIds
    : outfit.accessoryId && outfit.accessoryId !== "none" ? [outfit.accessoryId] : [];

  const accessoryPrompts = accessoryIds
    .map((id) => ACCESSORY_PROMPT_MAP[id])
    .filter(Boolean);

  let prompt = `${ANCHOR_PROMPT} ${model} wearing ${garment}, crafted from ${color}.`;
  if (accessoryPrompts.length > 0) {
    prompt += ` Accessorized with ${accessoryPrompts.join(", ")}.`;
  }
  if (occasion) {
    prompt += ` Setting: ${occasion}`;
  }
  if (style) {
    prompt += ` Aesthetics: ${style}`;
  }

  // Khống chế thuần phong mỹ tục cho trang phục truyền thống (đặc biệt Áo Tứ Thân Kinh Bắc)
  if (outfit.garmentId === "ao-tu-than") {
    prompt += " Strictly modest and respectful attire, high coverage neckline, zero cleavage, fully covered chest.";
  }

  return prompt.replace(/\s{2,}/g, " ").trim();
}

export const WORKER_AI_DEFAULT_URL = "https://vietphuc-ai-api.tunaemm.workers.dev";

export async function callFluxWorkerAi(prompt: string, workerUrl = WORKER_AI_DEFAULT_URL): Promise<string> {
  const res = await fetch(workerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    let errMessage = `Lỗi máy chủ (${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson.error) errMessage = errJson.error;
    } catch {}
    throw new Error(errMessage);
  }

  const contentType = res.headers.get("content-type") || "";

  // 1. Phản hồi JSON chứa chuỗi base64 (Chuẩn của Cloudflare Worker FLUX.1)
  if (contentType.includes("application/json")) {
    const json = await res.json();
    const raw = json.image || json.result?.image || json;
    if (typeof raw === "string") {
      return raw.startsWith("data:") ? raw : `data:image/jpeg;base64,${raw}`;
    }
    throw new Error("Không tìm thấy dữ liệu ảnh trong phản hồi JSON");
  }

  // 2. Phản hồi nhị phân blob (hoặc Worker trả về JSON nhưng header là image/jpeg)
  const blob = await res.blob();
  const previewText = await blob.slice(0, 50).text();

  if (previewText.trim().startsWith("{")) {
    try {
      const fullText = await blob.text();
      const json = JSON.parse(fullText);
      const raw = json.image || json.result?.image;
      if (raw && typeof raw === "string") {
        return raw.startsWith("data:") ? raw : `data:image/jpeg;base64,${raw}`;
      }
    } catch {}
  } else if (previewText.includes("[object Object]")) {
    throw new Error("Cloudflare Worker trả về [object Object]. Hãy cập nhật Worker để decode base64 sang nhị phân.");
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        resolve(URL.createObjectURL(blob));
      }
    };
    reader.onerror = () => reject(new Error("Lỗi đọc dữ liệu ảnh AI từ máy chủ"));
    reader.readAsDataURL(blob);
  });
}

export async function ensureDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  if (!url.startsWith("blob:")) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve(url);
        }
      };
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

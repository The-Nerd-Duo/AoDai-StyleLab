import { OutfitState } from "./utils";
import mockupsData from "@/config/mockups.json";

// Re-export từ src/utils/prompts để thống nhất API trên toàn bộ dự án
export {
  GARMENT_PROMPTS,
  ACCESSORY_PROMPTS,
  buildFinalPrompt,
} from "@/src/utils/prompts";
import { GARMENT_PROMPTS, ACCESSORY_PROMPTS } from "@/src/utils/prompts";

export const GARMENT_PROMPT_MAP = GARMENT_PROMPTS;
export const ACCESSORY_PROMPT_MAP = ACCESSORY_PROMPTS;

export const COLOR_PROMPT_MAP: Record<string, string> = {
  "red-son": "made of vibrant vermilion red silk fabric (đỏ son chu sa)",
  "gold-hoang-kim": "made of imperial golden yellow silk fabric (vàng hoàng kim)",
  "jade-thanh-thien": "made of serene jade emerald celadon green silk fabric (xanh ngọc thanh thiên)",
  "indigo-cham": "made of traditional deep indigo blue silk fabric (xanh chàm cổ kính)",
  "white-ngoc-trai": "made of pure pearl ivory silk fabric (trắng ngà tơ tằm)",
  "black-tuyen": "made of luxurious deep pitch black silk fabric (đen huyền tuyền)",
  "pink-sen": "made of graceful lotus blossom pink silk fabric (hồng cánh sen)",
};

export const STYLE_BACKGROUND_MAP: Record<string, { styleDesc: string; background: string }> = {
  "y2k-neo": {
    styleDesc: "Y2K Neo-Heritage aesthetic, futuristic cyberpunk-traditional fusion",
    background: "background of futuristic holographic studio with subtle ancient Vietnamese wooden architecture motifs, neon rim lights and soft glow",
  },
  "streetwear": {
    styleDesc: "contemporary Vietnamese streetwear, bold urban fashion styling",
    background: "background of atmospheric Hanoi Old Quarter street corner or Saigon heritage alleyway with vintage brick walls, cinematic street photography lighting",
  },
  "minimal-chic": {
    styleDesc: "minimalist contemporary high-fashion editorial",
    background: "background of ultra clean architectural minimal studio, neutral warm beige concrete wall, gentle soft natural window shadows",
  },
  "cyber-retro": {
    styleDesc: "East Asian Cyberpunk aesthetic, retro-futuristic Vietnamese styling",
    background: "background of vibrant moody cyberpunk metropolis at twilight, glowing neon signage with Vietnamese calligraphy, rain reflections",
  },
  "vintage-academia": {
    styleDesc: "1920s Indochine Vintage nostalgia, classical intellectual mood",
    background: "background of vintage French-Indochina colonial villa interior, dark wooden shutters, antique rattan armchair and warm golden hour sunlight",
  },
};

export const OCCASION_PROMPT_MAP: Record<string, string> = {
  "street-walk": "setting: dạo phố cuối tuần, weekend casual street stroll near a cozy aesthetic cafe in Vietnam",
  "tet-holiday": "setting: du xuân chúc Tết, festive Vietnamese Lunar New Year Tet atmosphere with blooming yellow mai and peach blossom flowers, red lanterns",
  "wedding-party": "setting: dự tiệc cưới hỷ lễ, elegant celebratory Vietnamese traditional wedding banquet setting",
  "temple-heritage": "setting: chiêm bái di tích đình chùa, serene sacred Vietnamese temple courtyard with ancient banyan tree and stone architecture",
  "school-presentation": "setting: ngày hội văn hóa học đường, academic heritage presentation setting with sunny courtyard",
  "y2k-party": "setting: party sáng tạo Gen Z, artistic music and cultural exhibition stage with dynamic creative lighting",
};

export const PERSONA_MODEL_MAP: Record<string, string> = {
  "female-modern": "a beautiful young Vietnamese female model with natural radiant smile",
  "male-modern": "a handsome stylish young Vietnamese male model with charismatic look",
  "female-classic": "an elegant graceful Vietnamese woman with poise and noble demeanor",
  "male-heritage": "a dignified refined Vietnamese gentleman with scholarly presence",
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
  const accessoryObj = mockupsData.accessories.find((a) => a.id === outfit.accessoryId) || mockupsData.accessories[0];

  const garmentPrompt = GARMENT_PROMPT_MAP[outfit.garmentId] || GARMENT_PROMPT_MAP[garmentObj.name] || "traditional Vietnamese attire";
  const colorPrompt = COLOR_PROMPT_MAP[outfit.colorId] || "traditional colored silk";
  const occasionPrompt = OCCASION_PROMPT_MAP[outfit.occasionId] || "";
  const styleInfo = STYLE_BACKGROUND_MAP[outfit.styleId] || {
    styleDesc: "contemporary Vietnamese fashion style",
    background: "background of elegant cultural studio with warm gentle lighting",
  };
  const accessoryPrompt = ACCESSORY_PROMPT_MAP[outfit.accessoryId] || ACCESSORY_PROMPT_MAP[accessoryObj.name] || "";
  const personaPrompt = PERSONA_MODEL_MAP[outfit.personaId] || "a stylish Vietnamese model";

  const fullPrompt = generateOutfitPrompt(outfit);

  return {
    garmentName: garmentObj.name,
    garmentPrompt,
    colorName: colorObj.name,
    colorPrompt,
    occasionName: occasionObj.name,
    occasionPrompt,
    styleName: styleObj.name,
    stylePrompt: `style: ${styleInfo.styleDesc}`,
    accessoryName: accessoryObj.name,
    accessoryPrompt,
    personaPrompt,
    fullPrompt,
  };
}

export function generateOutfitPrompt(outfit: OutfitState): string {
  const model = PERSONA_MODEL_MAP[outfit.personaId] || "a stylish Vietnamese model";
  const color = COLOR_PROMPT_MAP[outfit.colorId] || "traditional colored silk";
  const garment = GARMENT_PROMPT_MAP[outfit.garmentId] || "traditional Vietnamese attire";
  const occasion = OCCASION_PROMPT_MAP[outfit.occasionId] || "";
  const styleInfo = STYLE_BACKGROUND_MAP[outfit.styleId] || {
    styleDesc: "contemporary Vietnamese fashion style",
    background: "background of elegant cultural studio with warm gentle lighting",
  };
  const accessory = ACCESSORY_PROMPT_MAP[outfit.accessoryId] || "";

  const parts = [
    `Full-body portrait photo of ${model} wearing ${garment}`,
    color,
  ];

  if (accessory) {
    parts.push(accessory);
  }

  if (occasion) {
    parts.push(occasion);
  }

  parts.push(`style: ${styleInfo.styleDesc}`);
  parts.push(styleInfo.background);
  parts.push("cinematic lighting, photorealistic, intricate fabric texture and detailed silk embroidery, 8k resolution, award winning fashion photography");

  return parts.join(", ");
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

  return URL.createObjectURL(blob);
}

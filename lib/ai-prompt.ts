import { OutfitState } from "./utils";

export const COLOR_PROMPT_MAP: Record<string, string> = {
  "red-son": "vibrant vermilion red (đỏ son chu sa)",
  "gold-hoang-kim": "regal imperial golden yellow (vàng hoàng kim)",
  "jade-thanh-thien": "serene jade celadon green (xanh ngọc thanh thiên)",
  "indigo-cham": "traditional deep indigo blue (xanh chàm cổ kính)",
  "white-ngoc-trai": "pure pearl ivory silk white (trắng ngà tơ tằm)",
  "black-tuyen": "luxurious deep pitch black (đen huyền tuyền)",
  "pink-sen": "graceful lotus blossom pink (hồng cánh sen)",
};

export const GARMENT_PROMPT_MAP: Record<string, string> = {
  "ao-dai-cach-tan": "modernized Vietnamese Ao Dai with elegant cropped cut and flowing silk",
  "ao-dai-truyen-thong": "classic traditional Vietnamese Ao Dai silk dress with high stand collar and floor-length split flaps",
  "ao-ngu-than-tay-chen": "traditional Vietnamese 5-panel Ao Ngu Than robe with fitted tight sleeves (tay chẽn)",
  "ao-tac-ngu-than-tay-thung": "formal ceremonial Vietnamese Ao Tac robe with wide bell sleeves (ngũ thân tay thụng)",
  "ao-tu-than": "heritage northern Vietnamese 4-panel Ao Tu Than with colorful sashes and yếm bodice",
  "ao-nhat-binh": "royal Nguyen Dynasty imperial Nhat Binh robe with ornate rectangular collar and five-color cuffs",
  "ao-giao-linh": "ancient Vietnamese Giao Linh cross-collar robe with wide sleeves and traditional overlapping lapel",
};

export const STYLE_BACKGROUND_MAP: Record<string, { styleDesc: string; background: string }> = {
  "y2k-neo": {
    styleDesc: "Y2K Neo-Heritage aesthetic, futuristic cyberpunk-infused traditional fusion",
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

export const ACCESSORY_PROMPT_MAP: Record<string, string> = {
  "man-modern": "wearing a matching decorative modern Vietnamese Man headpiece (khăn đóng cách điệu)",
  "sneaker-chunky": "wearing stylish modern white chunky sneakers",
  "retro-sunglasses": "wearing trendy retro oval sunglasses",
  "silver-choker": "wearing an authentic handcrafted engraved silver collar choker necklace (kiềng bạc khắc mây)",
  "tote-coi": "holding a handcrafted woven straw tote bag with delicate silk embroidery",
  "non-quai-thao-mini": "holding a traditional northern Vietnamese flat palm hat (nón quai thao / nón lá)",
  "none": "",
};

export const PERSONA_MODEL_MAP: Record<string, string> = {
  "female-modern": "a beautiful young Vietnamese female model with natural radiant smile",
  "male-modern": "a handsome stylish young Vietnamese male model with charismatic look",
  "female-classic": "an elegant graceful Vietnamese woman with poise and noble demeanor",
  "male-heritage": "a dignified refined Vietnamese gentleman with scholarly presence",
};

export function generateOutfitPrompt(outfit: OutfitState): string {
  const model = PERSONA_MODEL_MAP[outfit.personaId] || "a stylish Vietnamese model";
  const color = COLOR_PROMPT_MAP[outfit.colorId] || "traditional colored";
  const garment = GARMENT_PROMPT_MAP[outfit.garmentId] || "traditional Vietnamese attire";
  const styleInfo = STYLE_BACKGROUND_MAP[outfit.styleId] || {
    styleDesc: "contemporary Vietnamese fashion style",
    background: "background of elegant cultural studio with warm gentle lighting",
  };
  const accessory = ACCESSORY_PROMPT_MAP[outfit.accessoryId] || "";

  const parts = [
    `Full-body portrait photo of ${model} wearing ${color} ${garment}`,
  ];

  if (accessory) {
    parts.push(accessory);
  }

  parts.push(styleInfo.styleDesc);
  parts.push(styleInfo.background);
  parts.push("cinematic lighting, photorealistic, intricate fabric texture and detailed embroidery, 8k resolution, award winning fashion photography");

  return parts.join(", ");
}

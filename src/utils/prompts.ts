/**
 * File mapping Prompt cho mô hình FLUX Schnell - Áo Dài StyleLab
 * Hỗ trợ tra cứu theo cả Tên hiển thị tiếng Việt lẫn ID hệ thống.
 * Cấu trúc chuẩn hóa:
 * 1. Anchor Prompt "Khóa Hình Thể" (Bắt buộc)
 * 2. Từ điển Giải phẫu Cắt may (Tailoring Specs) cho Flux
 * 3. Phụ kiện, Bối cảnh & Phong cách (Tách lớp mô tả)
 */

// 1. Anchor Prompt "Khóa Hình Thể" (Bắt buộc)
// Dùng đoạn này làm tiền tố cố định để triệt tiêu lỗi góc chụp nghiêng, crop nửa người hoặc sai tư thế
export const ANCHOR_PROMPT =
  "Full-length full-body studio portrait, head-to-toe shot with feet visible on floor, model standing upright strictly facing forward, direct eye contact with camera, perfectly centered symmetrical framing, eye-level perspective, no tilt, no dynamic pose, no cropped limbs, clear hyperrealistic fabric drape, sharp studio lighting, 8k uhd.";

// 2. Từ điển Giải phẫu Cắt may (Tailoring Specs) cho Flux
// Mô tả thuần cấu trúc may mặc để Flux vẽ đúng từng nếp áo, cổ áo và tay áo
export const GARMENT_PROMPTS: Record<string, string> = {
  // Áo ngũ thân tay chẽn
  "ao-ngu-than-tay-chen":
    "Traditional Vietnamese 5-panel garment (Ao Ngu Than Tay Chen), tailored modest form, asymmetrical curved front flap buttoned firmly down the right side with 5 small sphere buttons, high tight upright mandarin collar hugging the throat, narrow tight-fitting sleeves hugging the forearms to wrists, split side seams starting below waist, worn over loose white straight-leg silk pants.",
  "Áo Ngũ Thân Tay Chẽn":
    "Traditional Vietnamese 5-panel garment (Ao Ngu Than Tay Chen), tailored modest form, asymmetrical curved front flap buttoned firmly down the right side with 5 small sphere buttons, high tight upright mandarin collar hugging the throat, narrow tight-fitting sleeves hugging the forearms to wrists, split side seams starting below waist, worn over loose white straight-leg silk pants.",
  "Áo Ngũ Thân":
    "Traditional Vietnamese 5-panel garment (Ao Ngu Than Tay Chen), tailored modest form, asymmetrical curved front flap buttoned firmly down the right side with 5 small sphere buttons, high tight upright mandarin collar hugging the throat, narrow tight-fitting sleeves hugging the forearms to wrists, split side seams starting below waist, worn over loose white straight-leg silk pants.",

  // Áo tấc (Ngũ thân tay thụng)
  "ao-tac-ngu-than-tay-thung":
    "Traditional Vietnamese ceremonial Ao Tac robe, standing upright collar, diagonal right-side overlapping closure, loose voluminous silhouette with extremely wide rectangular drooping sleeves (bell sleeves) falling straight down past fingertips, long straight-cut hem reaching ankles over matching loose silk trousers.",
  "Áo Tấc (Ngũ Thân Tay Thụng)":
    "Traditional Vietnamese ceremonial Ao Tac robe, standing upright collar, diagonal right-side overlapping closure, loose voluminous silhouette with extremely wide rectangular drooping sleeves (bell sleeves) falling straight down past fingertips, long straight-cut hem reaching ankles over matching loose silk trousers.",
  "Áo Tấc":
    "Traditional Vietnamese ceremonial Ao Tac robe, standing upright collar, diagonal right-side overlapping closure, loose voluminous silhouette with extremely wide rectangular drooping sleeves (bell sleeves) falling straight down past fingertips, long straight-cut hem reaching ankles over matching loose silk trousers.",

  // Áo Nhật Bình
  "ao-nhat-binh":
    "Nguyen Dynasty royal court Ao Nhat Binh robe, open-front design fastened with small ties, iconic large stiff rectangular neckband framing chest adorned with 5-colored horizontal embroidered silk bands, embroidered golden five-clawed dragon or phoenix roundels, wide draped flowing sleeves with multicolor ribbon cuffs.",
  "Áo Nhật Bình Cung Đình":
    "Nguyen Dynasty royal court Ao Nhat Binh robe, open-front design fastened with small ties, iconic large stiff rectangular neckband framing chest adorned with 5-colored horizontal embroidered silk bands, embroidered golden five-clawed dragon or phoenix roundels, wide draped flowing sleeves with multicolor ribbon cuffs.",
  "Áo Nhật Bình":
    "Nguyen Dynasty royal court Ao Nhat Binh robe, open-front design fastened with small ties, iconic large stiff rectangular neckband framing chest adorned with 5-colored horizontal embroidered silk bands, embroidered golden five-clawed dragon or phoenix roundels, wide draped flowing sleeves with multicolor ribbon cuffs.",

  // Áo tứ thân Kinh Bắc
  "ao-tu-than":
    "Northern Vietnamese Kinh Bac Ao Tu Than folk costume, four long fluttering panels, two back panels sewn together, two front panels tied casually at belly, worn over an inner diamond-shaped scarlet red halter top (Yem bib), bound at waist with a bright flowing silk sash, paired with a dark floor-length flowing wrap skirt.",
  "Áo Tứ Thân Kinh Bắc":
    "Northern Vietnamese Kinh Bac Ao Tu Than folk costume, four long fluttering panels, two back panels sewn together, two front panels tied casually at belly, worn over an inner diamond-shaped scarlet red halter top (Yem bib), bound at waist with a bright flowing silk sash, paired with a dark floor-length flowing wrap skirt.",
  "Áo Tứ Thân":
    "Northern Vietnamese Kinh Bac Ao Tu Than folk costume, four long fluttering panels, two back panels sewn together, two front panels tied casually at belly, worn over an inner diamond-shaped scarlet red halter top (Yem bib), bound at waist with a bright flowing silk sash, paired with a dark floor-length flowing wrap skirt.",

  // Áo giao lĩnh (Cổ chéo)
  "ao-giao-linh":
    "Historical Vietnamese Ao Giao Linh robe, loose unisex robe, prominent diagonal overlapping crossover V-neck collar where left collar crosses over right, tied securely with a matching cloth waistband, ankle-length flowing layered robe hem.",
  "Áo Giao Lĩnh Cổ Chéo":
    "Historical Vietnamese Ao Giao Linh robe, loose unisex robe, prominent diagonal overlapping crossover V-neck collar where left collar crosses over right, tied securely with a matching cloth waistband, ankle-length flowing layered robe hem.",
  "Áo Giao Lĩnh":
    "Historical Vietnamese Ao Giao Linh robe, loose unisex robe, prominent diagonal overlapping crossover V-neck collar where left collar crosses over right, tied securely with a matching cloth waistband, ankle-length flowing layered robe hem.",

  // Áo lập lĩnh (Cổ đứng)
  "ao-lap-linh":
    "Vietnamese traditional Lap Linh structured robe, prominent high erect stiff standing neckband collar (mandarin style) completely closed at neck center, seamless right-side diagonal fastener, structured straight shoulders, minimalist historical tailoring.",
  "Áo Lập Lĩnh Cổ Đứng":
    "Vietnamese traditional Lap Linh structured robe, prominent high erect stiff standing neckband collar (mandarin style) completely closed at neck center, seamless right-side diagonal fastener, structured straight shoulders, minimalist historical tailoring.",
  "Áo Lập Lĩnh":
    "Vietnamese traditional Lap Linh structured robe, prominent high erect stiff standing neckband collar (mandarin style) completely closed at neck center, seamless right-side diagonal fastener, structured straight shoulders, minimalist historical tailoring.",

  // Áo dài truyền thống
  "ao-dai-truyen-thong":
    "Classic Vietnamese female Ao Dai, iconic 2-panel long dress, fitted tightly at waist and chest, high 3cm stiff standing collar, front and back panels hanging down to ankles, side slits cut high up to the ribcage, worn over floor-sweeping loose white silk palazzo trousers.",
  "Áo Dài Truyền Thống":
    "Classic Vietnamese female Ao Dai, iconic 2-panel long dress, fitted tightly at waist and chest, high 3cm stiff standing collar, front and back panels hanging down to ankles, side slits cut high up to the ribcage, worn over floor-sweeping loose white silk palazzo trousers.",
  "Áo Dài":
    "Classic Vietnamese female Ao Dai, iconic 2-panel long dress, fitted tightly at waist and chest, high 3cm stiff standing collar, front and back panels hanging down to ankles, side slits cut high up to the ribcage, worn over floor-sweeping loose white silk palazzo trousers.",

  // Áo dài cách tân
  "ao-dai-cach-tan":
    "Modern redesigned Vietnamese Ao Dai, relaxed contemporary silhouette, knee-length short tunic panels, modified collarless scoop neck or low mock neck, elbow-length or puff sleeves, paired with ankle-length wide-leg pleated culottes.",
  "Áo Dài Cách Tân":
    "Modern redesigned Vietnamese Ao Dai, relaxed contemporary silhouette, knee-length short tunic panels, modified collarless scoop neck or low mock neck, elbow-length or puff sleeves, paired with ankle-length wide-leg pleated culottes.",
};

// 3. Phụ kiện (Accessories)
export const ACCESSORY_PROMPTS: Record<string, string> = {
  // Mấn tết
  "man-modern":
    "rigid cylindrical layered fabric turban wrapped tightly around the head (Man Tet), flat clean crown.",
  "man-tet":
    "rigid cylindrical layered fabric turban wrapped tightly around the head (Man Tet), flat clean crown.",
  "Mấn Tết":
    "rigid cylindrical layered fabric turban wrapped tightly around the head (Man Tet), flat clean crown.",
  "Mấn tết":
    "rigid cylindrical layered fabric turban wrapped tightly around the head (Man Tet), flat clean crown.",
  "Mấn Tết Cách Điệu":
    "rigid cylindrical layered fabric turban wrapped tightly around the head (Man Tet), flat clean crown.",

  // Vòng kiềng
  "silver-choker":
    "solid thick polished circular silver neck ring choker (Vong Kieng), smooth reflective surface without pendant.",
  "vong-kieng":
    "solid thick polished circular silver neck ring choker (Vong Kieng), smooth reflective surface without pendant.",
  "Vòng Kiềng":
    "solid thick polished circular silver neck ring choker (Vong Kieng), smooth reflective surface without pendant.",
  "Vòng kiềng":
    "solid thick polished circular silver neck ring choker (Vong Kieng), smooth reflective surface without pendant.",
  "Vòng Kiềng Cổ (Vàng / Bạc)":
    "solid thick polished circular silver neck ring choker (Vong Kieng), smooth reflective surface without pendant.",

  // Nón quai thao
  "non-quai-thao":
    "large oversized flat disc-shaped straw hat (Non Quai Thao), worn behind shoulders or held, long hanging black silk ribbon straps.",
  "non-quai-thao-mini":
    "large oversized flat disc-shaped straw hat (Non Quai Thao), worn behind shoulders or held, long hanging black silk ribbon straps.",
  "Nón Quai Thao":
    "large oversized flat disc-shaped straw hat (Non Quai Thao), worn behind shoulders or held, long hanging black silk ribbon straps.",
  "Nón quai thao":
    "large oversized flat disc-shaped straw hat (Non Quai Thao), worn behind shoulders or held, long hanging black silk ribbon straps.",
  "Nón Quai Thao / Nón Lá Mini":
    "large oversized flat disc-shaped straw hat (Non Quai Thao), worn behind shoulders or held, long hanging black silk ribbon straps.",

  // Nón lá
  "non-la":
    "traditional pointed conical palm leaf hat (Non La) held at side.",
  "Nón Lá":
    "traditional pointed conical palm leaf hat (Non La) held at side.",
  "Nón lá":
    "traditional pointed conical palm leaf hat (Non La) held at side.",

  // Túi gấm hoàng cung
  "tui-gam":
    "small rectangular royal silk brocade pouch with gold metallic thread embroidery and hanging tassel.",
  "tui-gam-hoang-cung":
    "small rectangular royal silk brocade pouch with gold metallic thread embroidery and hanging tassel.",
  "Túi Gấm Hoàng Cung":
    "small rectangular royal silk brocade pouch with gold metallic thread embroidery and hanging tassel.",
  "Túi gấm hoàng cung":
    "small rectangular royal silk brocade pouch with gold metallic thread embroidery and hanging tassel.",
  "Túi Gấm Thêu Hoa Hoàng Cung":
    "small rectangular royal silk brocade pouch with gold metallic thread embroidery and hanging tassel.",

  // Túi cói mộc
  "tote-coi":
    "minimalist hand-woven natural beige straw basket tote bag with woven handles.",
  "tui-coi-moc":
    "minimalist hand-woven natural beige straw basket tote bag with woven handles.",
  "Túi Cói Mộc":
    "minimalist hand-woven natural beige straw basket tote bag with woven handles.",
  "Túi cói mộc":
    "minimalist hand-woven natural beige straw basket tote bag with woven handles.",
  "Túi Cói Đan Mộc":
    "minimalist hand-woven natural beige straw basket tote bag with woven handles.",

  // Phụ kiện biến tấu Gen Z
  "sneaker-chunky":
    "stylish modern white chunky street sneakers creating a bold Gen Z contrast.",
  "Sneaker Trắng Chunky":
    "stylish modern white chunky street sneakers creating a bold Gen Z contrast.",
  "retro-sunglasses":
    "trendy retro oval Y2K sunglasses.",
  "Kính Râm Oval Y2K":
    "trendy retro oval Y2K sunglasses.",

  // Không dùng phụ kiện
  "none": "",
  "Không dùng phụ kiện": "",
};

// 4. Bối cảnh (Settings)
export const SETTING_PROMPTS: Record<string, string> = {
  // Dạo phố & Cafe
  "street-walk":
    "sidewalk patio of an aesthetic Indochine-style coffee shop in Saigon, outdoor wooden bistro chairs, warm morning sunlight.",
  "Dạo phố & Cafe":
    "sidewalk patio of an aesthetic Indochine-style coffee shop in Saigon, outdoor wooden bistro chairs, warm morning sunlight.",
  "Dạo Phố & Cafe Cuối Tuần":
    "sidewalk patio of an aesthetic Indochine-style coffee shop in Saigon, outdoor wooden bistro chairs, warm morning sunlight.",

  // Du xuân chúc Tết Giáp Thìn
  "tet-holiday":
    "traditional Lunar New Year Tet festival, blooming pink peach blossom branches, hanging red silk lanterns, festive gold calligraphy banners.",
  "Du xuân chúc Tết Giáp Thìn":
    "traditional Lunar New Year Tet festival, blooming pink peach blossom branches, hanging red silk lanterns, festive gold calligraphy banners.",

  // Dự tiệc cưới & Hỷ lễ
  "wedding-party":
    "high-end modern wedding hall, floral arrangements with red lotus and silk drapes, warm candlelit illumination.",
  "Dự tiệc cưới & Hỷ lễ":
    "high-end modern wedding hall, floral arrangements with red lotus and silk drapes, warm candlelit illumination.",

  // Chiêm bái chùa chiền & Di tích
  "temple-heritage":
    "ancient courtyard of a Vietnamese Buddhist pagoda, carved dark teak wood pillars, mossy flagstones, faint wisps of incense smoke.",
  "Chiêm bái chùa chiền & Di tích":
    "ancient courtyard of a Vietnamese Buddhist pagoda, carved dark teak wood pillars, mossy flagstones, faint wisps of incense smoke.",

  // Thuyết trình & Ngày hội văn hóa
  "school-presentation":
    "minimalist cultural exhibition stage, stark gallery white floor, soft museum spotlighting on the subject.",
  "Thuyết trình & Ngày hội văn hóa":
    "minimalist cultural exhibition stage, stark gallery white floor, soft museum spotlighting on the subject.",

  // Sự kiện sáng tạo & Party Gen Z
  "y2k-party":
    "contemporary art gallery event, neon accent strip lights, raw concrete walls, vibrant youth social atmosphere.",
  "Sự kiện sáng tạo & Party Gen Z":
    "contemporary art gallery event, neon accent strip lights, raw concrete walls, vibrant youth social atmosphere.",
};

// 5. Phong cách nghệ thuật (Art Direction / Aesthetics)
export const STYLE_PROMPTS: Record<string, string> = {
  // Y2K Neo-Heritage
  "y2k-neo":
    "Y2K futuristic retro aesthetic, metallic silk sheen, iridescent pastel tints, cyber-nostalgia styling.",
  "Y2K Neo-Heritage":
    "Y2K futuristic retro aesthetic, metallic silk sheen, iridescent pastel tints, cyber-nostalgia styling.",

  // Streetwear Hầm Hố
  "streetwear":
    "raw urban high-fashion streetwear, layered utilitarian straps, chunky platform combat boots, dark mood lighting.",
  "Streetwear Hầm Hố":
    "raw urban high-fashion streetwear, layered utilitarian straps, chunky platform combat boots, dark mood lighting.",

  // Minimalist Đương Đại
  "minimal-chic":
    "monochrome muted earth tones, Scandinavian-Asian minimalist clean lines, diffuse soft daylight, zero clutter.",
  "Minimalist Đương Đại":
    "monochrome muted earth tones, Scandinavian-Asian minimalist clean lines, diffuse soft daylight, zero clutter.",

  // Cyberpunk Á Đông
  "cyber-retro":
    "Eastern cyberpunk mood, glowing neon cyan and crimson rim lights casting reflections on silk, high-contrast shadows.",
  "Cyberpunk Á Đông":
    "Eastern cyberpunk mood, glowing neon cyan and crimson rim lights casting reflections on silk, high-contrast shadows.",

  // Indochine Vintage
  "vintage-academia":
    "1930s French Indochine vintage film photography, nostalgic sepia and celadon green color grading, subtle 35mm film grain.",
  "Indochine Vintage":
    "1930s French Indochine vintage film photography, nostalgic sepia and celadon green color grading, subtle 35mm film grain.",
};

/**
 * Hàm ghép câu prompt chuẩn hóa cho FLUX Schnell:
 * Formula: {camera_anchor} {model} wearing {attire_spec}, crafted from {color_spec}. Accessorized with {accessory_spec}. Setting: {setting_spec}. Aesthetics: {style_spec}.
 */
export function buildFinalPrompt(
  garment: string,
  accessory: string,
  style: string,
  options?: {
    color?: string;
    occasion?: string;
    model?: string;
  }
): string {
  const garmentDesc =
    GARMENT_PROMPTS[garment] ||
    GARMENT_PROMPTS["ao-dai-truyen-thong"] ||
    "Classic Vietnamese female Ao Dai, iconic 2-panel long dress, fitted tightly at waist and chest, high 3cm stiff standing collar, front and back panels hanging down to ankles, side slits cut high up to the ribcage, worn over floor-sweeping loose white silk palazzo trousers.";

  const rawAccessory = ACCESSORY_PROMPTS[accessory] || "";
  const accessoryPart = rawAccessory ? ` Accessorized with ${rawAccessory}` : "";
  const modelPart = options?.model || "Vietnamese model";
  const colorPart = options?.color ? `, crafted from ${options.color}` : "";
  const rawSetting = options?.occasion ? (SETTING_PROMPTS[options.occasion] || options.occasion) : "";
  const settingPart = rawSetting ? ` Setting: ${rawSetting}` : "";
  const rawStyle = STYLE_PROMPTS[style] || style;
  const stylePart = rawStyle ? ` Aesthetics: ${rawStyle}` : "";

  return `${ANCHOR_PROMPT} ${modelPart} wearing ${garmentDesc}${colorPart}.${accessoryPart}${settingPart}${stylePart}`.replace(/\s{2,}/g, " ").trim();
}

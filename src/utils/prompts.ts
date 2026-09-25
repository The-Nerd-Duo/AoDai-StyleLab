/**
 * File mapping Prompt cho mô hình FLUX.1 - Áo Dài StyleLab
 * Hỗ trợ tra cứu theo cả Tên hiển thị tiếng Việt lẫn ID hệ thống.
 */

// 1. Chi tiết cấu trúc 5 loại Việt phục chính + Áo Tấc & Áo Nhật Bình
export const GARMENT_PROMPTS: Record<string, string> = {
  // Key theo tên tiếng Việt
  "Áo Ngũ Thân":
    "an authentic Vietnamese five-panel traditional robe (Ao Ngu Than), structured standing Mandarin collar (Lap Linh) upright and closed at the throat, asymmetric diagonal front flap wrapping across the chest and fastening down the right flank, row of five traditional fabric loop-and-knot buttons, straight loose draped silhouette, split side vents starting from the lower waist, wide tailored silk sleeves, flowing raw natural silk fabric with subtle matte sheen",
  "Áo Dài":
    "an iconic Vietnamese traditional Ao Dai tunic, fitted high standing Mandarin collar gently contouring the neck, tailored bodice gracefully hugging the torso, long flowing front and back panels hanging down to ankle length, high side waist slits extending up to the waistline, worn over billowing loose-fitting silk wide-leg trousers that graze the floor, elegant minimalist matte silk fabric",
  "Áo Tứ Thân":
    "traditional Northern Vietnamese four-panel tunic (Ao Tu Than), open neckline showing a layered inner diamond halter-top undergarment (Yem), outer robe divided into four panels: two back panels sewn into a central seam, two front long flowing panels untied and elegantly draping down or loosely knotted at the waist, wrapped with a contrasting vibrant silk sash belt tied at the front, loose rural airy silhouette with soft organic linen-silk drape",
  "Áo Giao Lĩnh":
    "traditional ancient Vietnamese crossed-collar robe (Ao Giao Linh), diagonal wrap-over V-shaped neckline crossing firmly right over left, overlapping diagonal front lapels forming an asymmetrical collar, voluminous extra-wide hanging butterfly sleeves, fastened securely around the waist with a broad silk sash belt (Dai), ankle-length straight flowing hem, historic royal court aesthetic",
  "Áo Lập Lĩnh":
    "traditional Vietnamese stand-up collar robe (Ao Lap Linh), rigid standing upright Mandarin collar clasped neatly at the front center of the throat, straight vertical frontal placket closure down the chest with traditional bead knot fastenings, structured clean rectangular shoulders, long straight draping sleeves, formal ceremonial scholar aesthetic, crisp pressed silk material",
  "Áo Tấc":
    "formal ceremonial Vietnamese Ao Tac robe (wide-sleeved Ao Ngu Than), structured standing collar, expansive flowing bell sleeves extending past the hands, asymmetric five-panel front closure with traditional loop buttons, solemn cultural ritual aesthetic",
  "Áo Nhật Bình":
    "royal Nguyen Dynasty imperial Nhat Binh robe (Ao Nhat Binh), rectangular decorative collar bordered with ornate embroidery, wide multi-colored five-element silk sleeve bands, front overlapping placket fastened with metallic cord buttons, regal imperial Vietnamese court aesthetic",

  // Key theo ID hệ thống trong config/mockups.json
  "ao-ngu-than-tay-chen":
    "an authentic Vietnamese five-panel traditional robe (Ao Ngu Than), structured standing Mandarin collar (Lap Linh) upright and closed at the throat, asymmetric diagonal front flap wrapping across the chest and fastening down the right flank, row of five traditional fabric loop-and-knot buttons, straight loose draped silhouette, split side vents starting from the lower waist, wide tailored silk sleeves, flowing raw natural silk fabric with subtle matte sheen",
  "ao-dai-cach-tan":
    "an iconic modern Vietnamese Ao Dai tunic, fitted standing Mandarin collar gently contouring the neck, tailored bodice gracefully hugging the torso, cropped ankle-grazing flowing panels with high waist slits, worn over loose wide-leg silk trousers, elegant contemporary matte silk fabric",
  "ao-dai-truyen-thong":
    "an iconic Vietnamese traditional Ao Dai tunic, fitted high standing Mandarin collar gently contouring the neck, tailored bodice gracefully hugging the torso, long flowing front and back panels hanging down to ankle length, high side waist slits extending up to the waistline, worn over billowing loose-fitting silk wide-leg trousers that graze the floor, elegant minimalist matte silk fabric",
  "ao-tu-than":
    "traditional Northern Vietnamese four-panel tunic (Ao Tu Than), open neckline showing a layered inner diamond halter-top undergarment (Yem), outer robe divided into four panels: two back panels sewn into a central seam, two front long flowing panels untied and elegantly draping down or loosely knotted at the waist, wrapped with a contrasting vibrant silk sash belt tied at the front, loose rural airy silhouette with soft organic linen-silk drape",
  "ao-giao-linh":
    "traditional ancient Vietnamese crossed-collar robe (Ao Giao Linh), diagonal wrap-over V-shaped neckline crossing firmly right over left, overlapping diagonal front lapels forming an asymmetrical collar, voluminous extra-wide hanging butterfly sleeves, fastened securely around the waist with a broad silk sash belt (Dai), ankle-length straight flowing hem, historic royal court aesthetic",
  "ao-lap-linh":
    "traditional Vietnamese stand-up collar robe (Ao Lap Linh), rigid standing upright Mandarin collar clasped neatly at the front center of the throat, straight vertical frontal placket closure down the chest with traditional bead knot fastenings, structured clean rectangular shoulders, long straight draping sleeves, formal ceremonial scholar aesthetic, crisp pressed silk material",
  "ao-tac-ngu-than-tay-thung":
    "formal ceremonial Vietnamese Ao Tac robe (wide-sleeved Ao Ngu Than), structured standing collar, expansive flowing bell sleeves extending past the hands, asymmetric five-panel front closure with traditional loop buttons, solemn cultural ritual aesthetic",
  "ao-nhat-binh":
    "royal Nguyen Dynasty imperial Nhat Binh robe (Ao Nhat Binh), rectangular decorative collar bordered with ornate embroidery, wide multi-colored five-element silk sleeve bands, front overlapping placket fastened with metallic cord buttons, regal imperial Vietnamese court aesthetic",
};

// 2. Chi tiết cấu trúc các loại Phụ kiện
export const ACCESSORY_PROMPTS: Record<string, string> = {
  // Key theo tên tiếng Việt
  "Nón Quai Thao":
    "wearing or holding a traditional Vietnamese oversized flat disc palm hat (Non Quai Thao / Non Ba Tam), wide circular brim made of finely woven dried palm leaves, shallow flat crown, adorned with long flowing black and maroon silk chin-strap ribbons hanging down the shoulders",
  "Nón Ba Tầm":
    "wearing or holding a traditional Vietnamese oversized flat disc palm hat (Non Quai Thao / Non Ba Tam), wide circular brim made of finely woven dried palm leaves, shallow flat crown, adorned with long flowing black and maroon silk chin-strap ribbons hanging down the shoulders",
  "Mấn Tết":
    "wearing an authentic Vietnamese braided headpiece (Man Tet), tightly rolled and interwoven fabric turban wrapped neatly around the top of the head forming a neat circular crown, textured woven silk wrap, framing an elegant sleek updo hairstyle",
  "Vòng Kiềng Vàng":
    "wearing an authentic traditional Vietnamese solid golden neck torc (Vong Kieng Vang), smooth polished rigid metallic open-collar ring resting closely against the collarbone, minimalist classic jewelry with mirror-gold reflection",
  "Kiềng Vàng":
    "wearing an authentic traditional Vietnamese solid golden neck torc (Vong Kieng Vang), smooth polished rigid metallic open-collar ring resting closely against the collarbone, minimalist classic jewelry with mirror-gold reflection",
  "Túi Cói":
    "carrying a minimalist hand-woven Vietnamese natural dried straw-reed tote bag (Tui Coi), organic wicker basket texture, modern rustic craftsmanship",
  "Túi Gấm":
    "holding an ornate Vietnamese silk brocade pouch (Tui Gam), rich woven jacquard fabric with subtle embossed traditional floral patterns, braided golden drawstring cords with hanging silk tassels",

  // Key theo ID hệ thống trong config/mockups.json
  "non-quai-thao-mini":
    "wearing or holding a traditional Vietnamese oversized flat disc palm hat (Non Quai Thao / Non Ba Tam), wide circular brim made of finely woven dried palm leaves, shallow flat crown, adorned with long flowing black and maroon silk chin-strap ribbons hanging down the shoulders",
  "man-modern":
    "wearing an authentic Vietnamese braided headpiece (Man Tet), tightly rolled and interwoven fabric turban wrapped neatly around the top of the head forming a neat circular crown, textured woven silk wrap, framing an elegant sleek updo hairstyle",
  "silver-choker":
    "wearing an authentic traditional Vietnamese solid golden neck torc (Vong Kieng Vang), smooth polished rigid metallic open-collar ring resting closely against the collarbone, minimalist classic jewelry with mirror-gold reflection",
  "tote-coi":
    "carrying a minimalist hand-woven Vietnamese natural dried straw-reed tote bag (Tui Coi), organic wicker basket texture, modern rustic craftsmanship",
  "tui-gam":
    "holding an ornate Vietnamese silk brocade pouch (Tui Gam), rich woven jacquard fabric with subtle embossed traditional floral patterns, braided golden drawstring cords with hanging silk tassels",
  "sneaker-chunky":
    "wearing stylish modern white chunky street sneakers creating a bold Gen Z contrast",
  "retro-sunglasses":
    "wearing trendy retro oval Y2K sunglasses",
  "none": "",
};

/**
 * Hàm ghép câu prompt hoàn chỉnh theo cấu trúc chuẩn Lookbook FLUX.1
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
    GARMENT_PROMPTS["Áo Dài"] ||
    GARMENT_PROMPTS["ao-dai-truyen-thong"];

  const rawAccessory = ACCESSORY_PROMPTS[accessory] || "";
  const accessoryDesc = rawAccessory ? `accessorized with ${rawAccessory},` : "";

  const colorPart = options?.color ? `made of ${options.color},` : "";
  const occasionPart = options?.occasion ? `${options.occasion},` : "";
  const modelPart = options?.model || "a stylish Vietnamese Gen Z model";

  return `Full-body editorial lookbook photograph of ${modelPart} wearing ${garmentDesc}, ${colorPart} ${accessoryDesc} ${occasionPart} remixed with ${style} aesthetic, plain studio backdrop, high-fashion softbox lighting, hyper-realistic, 8k resolution`.replace(/\s{2,}/g, " ").trim();
}

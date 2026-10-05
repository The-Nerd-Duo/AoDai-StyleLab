import mockupsData from "@/config/mockups.json";
import culturalRules from "@/config/cultural-rules.json";
import { CulturalAdvisorResponse, CulturalAdvisorRequest } from "./types";

export function evaluateCulturalHarmony(req: CulturalAdvisorRequest): CulturalAdvisorResponse {
  const garmentId = req.garmentId || mockupsData.garments[0].id;
  const colorId = req.colorId || mockupsData.colors[0].id;
  const occasionId = req.occasionId || mockupsData.occasions[0].id;
  const styleId = req.styleId || mockupsData.styles[0].id;

  const accessoryIds = req.accessoryIds && req.accessoryIds.length > 0
    ? req.accessoryIds
    : req.accessoryId && req.accessoryId !== "none"
    ? [req.accessoryId]
    : [];

  const garment = mockupsData.garments.find((g) => g.id === garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === styleId) || mockupsData.styles[0];
  const selectedAccessories = mockupsData.accessories.filter((a) => accessoryIds.includes(a.id));
  const accessoryText = selectedAccessories.length > 0 ? selectedAccessories.map((a) => a.name).join(", ") : "Không có phụ kiện";

  // Check pre-configured cultural warnings
  const localWarnings: string[] = [];
  for (const rule of culturalRules.forbiddenCombinations) {
    const matchGarment = !rule.garmentId || rule.garmentId === garmentId;
    const matchOccasion = !rule.occasionId || rule.occasionId === occasionId;
    const matchStyle = !rule.styleId || rule.styleId === styleId;
    const matchAccessory = !rule.accessoryId || accessoryIds.includes(rule.accessoryId);

    if (matchGarment && matchOccasion && matchStyle && matchAccessory) {
      localWarnings.push(rule.reason);
    }
  }

  const baseRespect = localWarnings.length > 0 ? 68 : 95;
  const isHarmoniousOccasion = garment.recommendedOccasions.includes(occasionId);
  const weatherScore = isHarmoniousOccasion ? 92 : 78;
  const colorScore = 88;
  const overall = Math.round((colorScore + weatherScore + baseRespect) / 3);

  return {
    colorHarmonyScore: colorScore,
    weatherFitScore: weatherScore,
    culturalRespectScore: baseRespect,
    overallScore: overall,
    elementAnalysis: {
      element: color.element,
      description: `${color.meaning} Gam màu ${color.name} mang năng lượng hành ${color.element} tạo hiệu ứng thị giác nổi bật.`,
    },
    colorHarmonyVerdict: `Sắc ${color.name} kết hợp cùng phong cách ${style.name} mang lại sự cân bằng giữa nét cổ kính và hơi thở đương đại.`,
    weatherAdvice: `${occasion.weatherHint} Nên ưu tiên chất liệu lụa tơ tằm, đũi hoặc gấm nhẹ thoáng khí để thoải mái vận động.`,
    culturalNotes: `${garment.culturalSignificance} Khi kết hợp với ${accessoryText}, tổng thể vẫn giữ được nét tao nhã di sản.`,
    genZStylingTip: `Thử tạo dáng khoanh tay cung kính truyền thống kết hợp góc máy cận cảnh để làm nổi bật chi tiết ${accessoryText}.`,
    warnings: localWarnings,
  };
}

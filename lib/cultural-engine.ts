import mockupsData from "@/config/mockups.json";
import culturalRules from "@/config/cultural-rules.json";
import { CulturalAdvisorResponse, CulturalAdvisorRequest } from "./types";

export const GARMENT_ORIGIN_SIGNIFICANCE: Record<string, string> = {
  "ao-tu-than":
    "Xuất hiện từ thời Lý - Trần và phổ biến sâu rộng trong đời sống dân gian đồng bằng Bắc Bộ. Bốn vạt áo tượng trưng cho tứ thân phụ mẫu (cha mẹ mình và cha mẹ chồng), kết hợp dải yếm và thắt lưng lụa đào tôn vinh nét duyên mộc mạc, tần tảo và đoan trang của người phụ nữ Việt.",
  "ao-tac-ngu-than-tay-thung":
    "Đại lễ phục trang trọng thời Nguyễn (1802-1945), bắt nguồn từ định chế trang phục năm 1744 của Chúa Nguyễn Phúc Khoát. Thiết kế tay thụng rộng dài uy nghi, năm thân áo tượng trưng cho tứ thân phụ mẫu và chính mình, biểu thị đạo hiếu và sự tôn kính trong các nghi lễ trang nghiêm.",
  "ao-ngu-than-tay-chen":
    "Định chế dưới thời Chúa Nguyễn Phúc Khoát (1744) và hoàn thiện dưới triều vua Minh Mạng (1827). Thiết kế tay chẽn ôm gọn thanh lịch; năm thân áo và năm cúc cài tượng trưng cho ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín), đại diện cho tinh thần khiêm nhường và nề nếp Nho gia.",
  "ao-nhat-binh":
    "Được quy định trong điển chế triều Nguyễn từ năm 1807 (thời Gia Long), là thường phục cao cấp của Hoàng hậu, Công chúa và mệnh phụ cung đình. Cổ áo chữ nhật viền hoa văn ngũ sắc tượng trưng cho ngũ hành, biểu thị phẩm hàm tôn quý và vẻ đẹp vương giả chốn hoàng cung.",
  "ao-giao-linh":
    "Là dạng cổ phục xuất hiện từ thời Lý, Trần đến Hậu Lê trước khi áo ngũ thân ra đời. Kiểu cổ vạt chéo giao nhau trước ngực gắn liền với phong thái ung dung, đĩnh đạc của tầng lớp sĩ phu và quan lại Đại Việt xưa.",
  "ao-lap-linh":
    "Dạng áo cổ đứng khuy cài bên phải, phát triển thịnh hành từ thời Hậu Lê sang thời Nguyễn. Phom dáng vuông vắn ngay ngắn đại diện cho chuẩn mực Nho giáo, tính lễ nghi Á Đông và cốt cách thanh cao của văn nhân sĩ tử.",
  "ao-dai-truyen-thong":
    "Kế thừa từ áo ngũ thân lập lĩnh thời Nguyễn và định hình qua phong trào Le Mur thập niên 1930. Hai tà áo thướt tha ôm trọn vóc dáng là biểu tượng quốc phục danh giá, tôn vinh nét đẹp đoan trang, thuần khiết và niềm tự hào dân tộc.",
  "ao-dai-cach-tan":
    "Phát triển từ thập niên 1960 (Áo Dài Raglan) và bùng nổ trong phong cách thời trang đương đại. Trang phục kết hợp tinh hoa tà áo truyền thống với đường cắt hiện đại, biểu trưng cho sự năng động, cởi mở và vẻ đẹp phụ nữ Việt thời mới.",
};

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

  const isHarmoniousOccasion = garment.recommendedOccasions.includes(occasionId);
  const weather = req.weather;
  let weatherScore = isHarmoniousOccasion ? 92 : 82;
  let weatherAdvice = `${occasion.weatherHint} Nên ưu tiên chất liệu lụa tơ tằm, đũi hoặc gấm nhẹ thoáng khí để thoải mái vận động.`;

  if (weather) {
    const temp = weather.temperature;
    const isHeavyGarment = garmentId === "ao-tac-ngu-than-tay-thung" || garmentId === "ao-nhat-binh";

    if (temp >= 32) {
      if (isHeavyGarment) {
        weatherScore = 72;
        weatherAdvice = `Thời tiết ${weather.cityName} oi bức (${temp}°C). ${garment.name} có nhiều lớp nên ưu tiên gấm mỏng dệt thoáng; khuyên mang theo quạt lụa vừa tao nhã vừa giải nhiệt.`;
      } else {
        weatherScore = 90;
        weatherAdvice = `Nhiệt độ ${weather.cityName} đạt ${temp}°C (${weather.conditionText}). ${garment.name} với chất liệu lụa tơ tằm hoặc đũi thoáng mát là lựa chọn tối ưu cho ngày nắng ráo.`;
      }
    } else if (temp <= 20) {
      if (isHeavyGarment) {
        weatherScore = 96;
        weatherAdvice = `Thời tiết ${weather.cityName} se lạnh (${temp}°C, ${weather.conditionText}) là điều kiện lý tưởng cho ${garment.name}. Vải gấm dày giúp giữ ấm tốt và tôn trọn phom dáng trang trọng.`;
      } else {
        weatherScore = 84;
        weatherAdvice = `Thời tiết ${weather.cityName} se lạnh (${temp}°C). Khi diện ${garment.name}, nên mặc thêm áo lót cổ cao bên trong để vừa giữ ấm vừa chuẩn mực phong thái.`;
      }
    } else {
      weatherScore = isHarmoniousOccasion ? 95 : 88;
      weatherAdvice = `Thời tiết ${weather.cityName} rất dịu mát (${temp}°C, ${weather.conditionText}, ẩm ${weather.humidity}%). Phù hợp diện ${garment.name} bằng vải lụa tơ tằm hoặc đũi thoáng khí.`;
    }

    if (weather.isRain) {
      weatherAdvice += " Trời có mưa ẩm, nên chuẩn bị ô giấy dầu cổ trang để vừa che sương mưa vừa tạo dáng đẹp.";
    }
  }

  const baseRespect = localWarnings.length > 0 ? 68 : 95;
  const colorScore = 88;
  const overall = Math.round((colorScore + weatherScore + baseRespect) / 3);

  const origin =
    GARMENT_ORIGIN_SIGNIFICANCE[garmentId] ||
    `${garment.name} có nguồn gốc từ ${garment.dynasty || "truyền thống dân tộc"}, mang giá trị di sản văn hóa sâu sắc và đại diện cho bản sắc người Việt.`;

  return {
    colorHarmonyScore: colorScore,
    weatherFitScore: weatherScore,
    culturalRespectScore: baseRespect,
    overallScore: overall,
    originAndSignificance: origin,
    weatherInfo: weather,
    elementAnalysis: {
      element: color.element,
      description: `${color.meaning} Gam màu ${color.name} mang năng lượng hành ${color.element} tạo hiệu ứng thị giác nổi bật.`,
    },
    colorHarmonyVerdict: `Sắc ${color.name} kết hợp cùng phong cách ${style.name} mang lại sự cân bằng giữa nét cổ kính và hơi thở đương đại.`,
    weatherAdvice,
    culturalNotes: `Quy chế di sản đánh giá ${garment.name} khi phối cùng ${accessoryText}. Bản phối giữ vững chuẩn mực phom dáng cổ truyền, đồng thời tạo điểm nhấn giao thoa hài hòa với phong cách hiện đại.`,
    genZStylingTip: `Thử tạo dáng khoanh tay cung kính truyền thống kết hợp góc máy cận cảnh để làm nổi bật chi tiết ${accessoryText}.`,
    warnings: localWarnings,
  };
}

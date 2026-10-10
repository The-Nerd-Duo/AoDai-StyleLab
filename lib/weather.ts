/**
 * Dịch vụ thời tiết thời gian thực cho AoDai StyleLab sử dụng Open-Meteo API
 * Hoàn toàn miễn phí, không cần API Key, độ trễ < 100ms.
 */

export interface HeritageLocation {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lon: number;
  region: string;
}

export const HERITAGE_LOCATIONS: HeritageLocation[] = [
  {
    id: "hanoi",
    name: "Hà Nội (Phố Cổ, Hoàng Thành)",
    shortName: "Hà Nội",
    lat: 21.0285,
    lon: 105.8542,
    region: "Miền Bắc",
  },
  {
    id: "hue",
    name: "Huế (Đại Nội, Lăng Tẩm)",
    shortName: "Huế",
    lat: 16.4637,
    lon: 107.5909,
    region: "Miền Trung",
  },
  {
    id: "hoian",
    name: "Hội An (Phố Cổ Hoài Phố)",
    shortName: "Hội An",
    lat: 15.8801,
    lon: 108.338,
    region: "Miền Trung",
  },
  {
    id: "hcm",
    name: "TP. Hồ Chí Minh (Sài Gòn)",
    shortName: "TP.HCM",
    lat: 10.8231,
    lon: 106.6297,
    region: "Miền Nam",
  },
  {
    id: "dalat",
    name: "Đà Lạt (Cung Nam Phương)",
    shortName: "Đà Lạt",
    lat: 11.9404,
    lon: 108.4583,
    region: "Tây Nguyên",
  },
  {
    id: "ninhbinh",
    name: "Ninh Bình (Tràng An, Cố Đô)",
    shortName: "Ninh Bình",
    lat: 20.2506,
    lon: 105.9745,
    region: "Miền Bắc",
  },
  {
    id: "sapa",
    name: "Sa Pa (Tây Bắc)",
    shortName: "Sa Pa",
    lat: 22.3364,
    lon: 103.8438,
    region: "Miền Bắc",
  },
];

export interface WeatherInfo {
  locationId: string;
  cityName: string;
  temperature: number; // °C
  apparentTemperature: number; // °C
  humidity: number; // %
  weatherCode: number;
  conditionText: string;
  isRain: boolean;
  windSpeed: number; // km/h
  iconName: string; // Material symbol icon name
}

// Chuyển mã WMO Weather code sang mô tả tiếng Việt và icon trực quan
export function interpretWmoCode(code: number, isDay = 1): { conditionText: string; iconName: string; isRain: boolean } {
  if (code === 0) {
    return {
      conditionText: isDay ? "Nắng ráo, trời quang" : "Đêm quang mây",
      iconName: isDay ? "wb_sunny" : "bedtime",
      isRain: false,
    };
  }
  if (code === 1 || code === 2) {
    return {
      conditionText: "Ít mây, dịu mát",
      iconName: isDay ? "partly_cloudy_day" : "partly_cloudy_night",
      isRain: false,
    };
  }
  if (code === 3) {
    return {
      conditionText: "Nhiều mây, râm mát",
      iconName: "cloud",
      isRain: false,
    };
  }
  if (code === 45 || code === 48) {
    return {
      conditionText: "Sương mù lãng đãng",
      iconName: "foggy",
      isRain: false,
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      conditionText: "Mưa phùn nhẹ",
      iconName: "rainy",
      isRain: true,
    };
  }
  if (code >= 61 && code <= 67) {
    return {
      conditionText: "Có mưa rào",
      iconName: "rainy",
      isRain: true,
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      conditionText: "Trời rét buốt",
      iconName: "ac_unit",
      isRain: false,
    };
  }
  if (code >= 80 && code <= 82) {
    return {
      conditionText: "Mưa rào thoáng qua",
      iconName: "rainy",
      isRain: true,
    };
  }
  if (code >= 95) {
    return {
      conditionText: "Có dông mưa",
      iconName: "thunderstorm",
      isRain: true,
    };
  }

  return {
    conditionText: "Tiết trời mát mẻ",
    iconName: "wb_sunny",
    isRain: false,
  };
}

// In-memory cache lưu thời tiết tối đa 15 phút để tối ưu tốc độ
const weatherCache = new Map<string, { data: WeatherInfo; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function fetchWeatherForLocation(locationId = "hanoi", customCoords?: { lat: number; lon: number; name?: string }): Promise<WeatherInfo> {
  const targetLocation =
    HERITAGE_LOCATIONS.find((loc) => loc.id === locationId) || HERITAGE_LOCATIONS[0];

  const lat = customCoords?.lat ?? targetLocation.lat;
  const lon = customCoords?.lon ?? targetLocation.lon;
  const cityName = customCoords?.name ?? targetLocation.shortName;
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;

  const now = Date.now();
  if (weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FBangkok`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

    const data = await res.json();
    const current = data?.current || {};

    const weatherCode = Number(current.weather_code ?? 0);
    const isDay = Number(current.is_day ?? 1);
    const { conditionText, iconName, isRain } = interpretWmoCode(weatherCode, isDay);

    const info: WeatherInfo = {
      locationId,
      cityName,
      temperature: Math.round(Number(current.temperature_2m ?? 24)),
      apparentTemperature: Math.round(Number(current.apparent_temperature ?? 25)),
      humidity: Math.round(Number(current.relative_humidity_2m ?? 75)),
      weatherCode,
      conditionText,
      isRain: isRain || Number(current.precipitation ?? 0) > 0,
      windSpeed: Math.round(Number(current.wind_speed_10m ?? 10)),
      iconName,
    };

    weatherCache.set(cacheKey, { data: info, timestamp: now });
    return info;
  } catch (error) {
    console.warn("Lỗi tải Open-Meteo API, sử dụng dữ liệu mặc định:", error);
    // Dữ liệu fallback chuẩn mực
    const fallback: WeatherInfo = {
      locationId,
      cityName,
      temperature: 24,
      apparentTemperature: 25,
      humidity: 75,
      weatherCode: 1,
      conditionText: "Tiết trời mát mẻ",
      isRain: false,
      windSpeed: 12,
      iconName: "partly_cloudy_day",
    };
    return fallback;
  }
}

export function normalizeVietnameseCity(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("hanoi") || lower.includes("ha noi")) return "Hà Nội";
  if (lower.includes("ho chi minh") || lower.includes("saigon") || lower.includes("sai gon")) return "TP. Hồ Chí Minh";
  if (lower.includes("da nang") || lower.includes("danang")) return "Đà Nẵng";
  if (lower.includes("hue") || lower.includes("thua thien")) return "Huế";
  if (lower.includes("hai phong") || lower.includes("haiphong")) return "Hải Phòng";
  if (lower.includes("can tho") || lower.includes("cantho")) return "Cần Thơ";
  if (lower.includes("nha trang")) return "Nha Trang";
  if (lower.includes("da lat") || lower.includes("dalat")) return "Đà Lạt";
  if (lower.includes("vung tau")) return "Vũng Tàu";
  if (lower.includes("quang ninh") || lower.includes("ha long")) return "Hạ Long";
  if (lower.includes("ninh binh")) return "Ninh Bình";
  if (lower.includes("sapa") || lower.includes("sa pa") || lower.includes("lao cai")) return "Sa Pa";
  if (lower.includes("hoi an") || lower.includes("hoian") || lower.includes("quang nam")) return "Hội An";
  return name;
}

/**
 * Tự động nhận diện vị trí của người dùng mà không cần danh sách chọn thủ công:
 * 1. Thử qua GPS nếu người dùng cho phép hoặc chủ động bấm cập nhật
 * 2. Tự động nhận diện ngầm qua IP Geo (ipwho.is) - mượt mà, không popup làm phiền
 * 3. Fallback an toàn về Hà Nội
 */
export async function detectUserWeather(requestGps = false): Promise<WeatherInfo> {
  // 1. Thử nhận diện qua GPS nếu chạy trên trình duyệt
  if (typeof window !== "undefined" && navigator.geolocation) {
    try {
      let shouldCheckGps = requestGps;
      if (!shouldCheckGps && "permissions" in navigator) {
        try {
          const perm = await navigator.permissions.query({ name: "geolocation" as PermissionName });
          if (perm.state === "granted") {
            shouldCheckGps = true;
          }
        } catch {}
      }

      if (shouldCheckGps) {
        const gpsCoords = await new Promise<{ lat: number; lon: number } | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 3000 }
          );
        });

        if (gpsCoords) {
          let cityName = "Vị trí của bạn";
          try {
            const revRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${gpsCoords.lat}&longitude=${gpsCoords.lon}&localityLanguage=vi`,
              { signal: AbortSignal.timeout(2000) }
            );
            if (revRes.ok) {
              const revData = await revRes.json();
              cityName = revData.city || revData.principalSubdivision || revData.locality || "Vị trí của bạn";
              cityName = normalizeVietnameseCity(cityName);
            }
          } catch {}

          return await fetchWeatherForLocation("gps", {
            lat: gpsCoords.lat,
            lon: gpsCoords.lon,
            name: cityName,
          });
        }
      }
    } catch {}
  }

  // 2. Tự động nhận diện ngầm qua IP (không cần cấp quyền GPS, phản hồi <200ms)
  try {
    const ipRes = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) });
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.success && ipData.latitude && ipData.longitude) {
        const cityName = normalizeVietnameseCity(ipData.city || "Việt Nam");
        return await fetchWeatherForLocation("auto-ip", {
          lat: ipData.latitude,
          lon: ipData.longitude,
          name: cityName,
        });
      }
    }
  } catch (err) {}

  // Dự phòng phụ nếu ipwho.is gặp sự cố mạng: thử ipapi.co
  try {
    const ipRes2 = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(2500) });
    if (ipRes2.ok) {
      const ipData2 = await ipRes2.json();
      if (ipData2.latitude && ipData2.longitude) {
        const cityName = normalizeVietnameseCity(ipData2.city || "Việt Nam");
        return await fetchWeatherForLocation("auto-ip", {
          lat: ipData2.latitude,
          lon: ipData2.longitude,
          name: cityName,
        });
      }
    }
  } catch {}

  // 3. Fallback mặc định Hà Nội
  return await fetchWeatherForLocation("hanoi");
}


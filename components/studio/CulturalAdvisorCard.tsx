"use client";

import React, { useEffect, useState } from "react";
import { OutfitState } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import { CulturalAdvisorResponse } from "@/lib/types";
import {
  Sparkles,
  ShieldAlert,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

import { evaluateCulturalHarmony } from "@/lib/cultural-engine";
import { useOutfitStore } from "@/lib/store";

interface CulturalAdvisorCardProps {
  outfit: OutfitState;
  resultImage?: string | null;
}

export const CulturalAdvisorCard: React.FC<CulturalAdvisorCardProps> = ({ outfit, resultImage: propResultImage }) => {
  const store = useOutfitStore();
  const resultImage = propResultImage !== undefined ? propResultImage : store.resultImage;
  const hasGenerated = Boolean(resultImage && resultImage.trim());

  const [data, setData] = useState<CulturalAdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cultural-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outfit),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.clientFallback && (json.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY)) {
          const directKey = json.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
          try {
            const directRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${json.model || "gemini-3.5-flash-lite"}:generateContent?key=${encodeURIComponent(directKey)}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: json.prompt }] }],
                }),
              }
            );
            if (directRes.ok) {
              const directData = await directRes.json();
              const rawText = directData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(cleanedText);
              setData(parsed);
              setLoading(false);
              return;
            }
          } catch (directErr) {
            console.warn("Direct client advisor call failed:", directErr);
          }
        }
        setData(json.fallback || json);
        setLoading(false);
        return;
      }
    } catch {
      // API call failed, fall back to rule engine below
    }
    // Instant fallback rule engine (<0.01s response)
    const local = evaluateCulturalHarmony({
      garmentId: outfit.garmentId,
      colorId: outfit.colorId,
      occasionId: outfit.occasionId,
      styleId: outfit.styleId,
      accessoryId: outfit.accessoryId,
      accessoryIds: outfit.accessoryIds,
      personaId: outfit.personaId,
    });
    setData(local);
    setLoading(false);
  };

  useEffect(() => {
    if (!hasGenerated) {
      setData(null);
      return;
    }

    // 1. Cập nhật ngay bằng Local Rule Engine để UI phản hồi mượt 0ms khi vuốt
    const local = evaluateCulturalHarmony({
      garmentId: outfit.garmentId,
      colorId: outfit.colorId,
      occasionId: outfit.occasionId,
      styleId: outfit.styleId,
      accessoryId: outfit.accessoryId,
      accessoryIds: outfit.accessoryIds,
      personaId: outfit.personaId,
    });
    setData((prev) => (prev ? { ...prev, colorHarmonyScore: local.colorHarmonyScore, overallScore: local.overallScore, culturalRespectScore: local.culturalRespectScore } : local));

    // 2. Debounce 650ms: chỉ khi dừng vuốt ở món cụ thể mới gửi request gọi Gemini AI
    const timer = setTimeout(() => {
      fetchAdvice();
    }, 650);

    return () => clearTimeout(timer);
  }, [hasGenerated, outfit.garmentId, outfit.colorId, outfit.occasionId, outfit.styleId, outfit.accessoryId, outfit.accessoryIds?.join(",")]);

  // Convert 100-point score to 5-star rating (e.g., 98 -> 4.9, 90 -> 4.5)
  const starRating = data ? (data.overallScore / 20).toFixed(1) : "4.9";
  const numStars = data ? Math.min(5, Math.max(1, Math.round(data.overallScore / 20))) : 5;

  return (
    <div className="bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60 space-y-3">
      {/* Header with 5-star Rating */}
      <div className="flex flex-wrap items-center justify-between pb-2 border-b border-border-bronze-light/40 gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-vermilion-red text-[20px]">
            verified
          </span>
          <h2 className="font-serif text-sm sm:text-base font-bold text-text-charcoal">
            Cultural Harmony AI
          </h2>
          <button
            onClick={fetchAdvice}
            disabled={loading || !hasGenerated}
            className="p-1 rounded-lg text-text-warm-gray hover:text-text-charcoal hover:bg-paper-cream transition-colors ml-1 disabled:opacity-40 disabled:cursor-not-allowed"
            title={hasGenerated ? "Thẩm định lại" : "Chờ tạo ảnh"}
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-vermilion-red" : ""}`} />
          </button>
        </div>

        {/* 5-Star Rating Badge */}
        <div className="flex items-center gap-2.5 bg-paper-cream px-3 py-1 rounded-full border border-border-bronze-light/50 shadow-inner">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-warm-gray font-bold hidden sm:inline">
            Đánh giá tổng thể AI:
          </span>
          {hasGenerated ? (
            <div className="flex items-center gap-0.5 text-bronze-gold">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="material-symbols-outlined text-[16px] text-bronze-gold"
                  style={{
                    fontVariationSettings: star <= numStars ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  star
                </span>
              ))}
              <span className="font-sans text-[14px] text-text-charcoal font-bold ml-1">
                {starRating}
                <span className="text-[10px] text-text-warm-gray font-normal font-mono">/5</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-text-warm-gray">
              <div className="flex items-center gap-0.5 text-stone-300">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="material-symbols-outlined text-[16px] text-stone-300"
                    style={{
                      fontVariationSettings: "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-mono text-[11px] text-text-warm-gray font-medium ml-0.5">
                Chưa chấm điểm
              </span>
              <span className="text-[10px] text-text-warm-gray/70 font-mono font-normal">
                (—/5)
              </span>
            </div>
          )}
        </div>
      </div>

      {loading && !data && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-text-warm-gray">
          <RefreshCw className="w-5 h-5 animate-spin text-bronze-gold" />
          <span className="text-xs">Gemini AI đang thẩm định chuẩn mực văn hóa...</span>
        </div>
      )}

      {!hasGenerated ? (
        /* Standby State when not evaluated yet */
        <div className="space-y-3">
          {/* 3 Standby Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            {/* Metric 1: Thời tiết & Chất liệu */}
            <div className="p-2.5 rounded-xl bg-paper-cream/60 border border-border-bronze-light/50 flex flex-col justify-between space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-charcoal font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-stone-400">
                    thermostat
                  </span>
                  Thời tiết &amp; Chất liệu
                </span>
                <span className="text-[9px] font-mono text-stone-500 font-medium px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                  Chờ chấm điểm
                </span>
              </div>
              <p className="text-text-warm-gray/70 leading-relaxed text-[11px] line-clamp-3 italic">
                Chưa có dữ liệu. AI sẽ phân tích độ phù hợp của chất liệu vải với thời tiết sau khi tạo ảnh.
              </p>
            </div>

            {/* Metric 2: Bối cảnh & Không gian */}
            <div className="p-2.5 rounded-xl bg-paper-cream/60 border border-border-bronze-light/50 flex flex-col justify-between space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-charcoal font-bold flex items-center gap-1 truncate max-w-[140px]">
                  <span className="material-symbols-outlined text-[14px] text-stone-400">
                    nightlife
                  </span>
                  {occasion.name.split("&")[0].trim()}
                </span>
                <span className="text-[9px] font-mono text-stone-500 font-medium px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                  Chờ chấm điểm
                </span>
              </div>
              <p className="text-text-warm-gray/70 leading-relaxed text-[11px] line-clamp-3 italic">
                Chưa có dữ liệu. AI sẽ đánh giá mức độ tương thích giữa trang phục và bối cảnh sự kiện sau khi tạo ảnh.
              </p>
            </div>

            {/* Metric 3: Quy chế Di sản */}
            <div className="p-2.5 rounded-xl bg-paper-cream/60 border border-border-bronze-light/50 flex flex-col justify-between space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-charcoal font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-stone-400">
                    rule
                  </span>
                  Quy chế Di sản
                </span>
                <span className="text-[9px] font-mono text-stone-500 font-medium px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                  Chờ chấm điểm
                </span>
              </div>
              <p className="text-text-warm-gray/70 leading-relaxed text-[11px] line-clamp-3 italic">
                Chưa có dữ liệu. AI sẽ thẩm định phom dáng cổ phục và quy chuẩn nghi lễ sau khi tạo ảnh.
              </p>
            </div>
          </div>

          {/* Standby Tip */}
          <div className="p-2.5 rounded-xl bg-paper-cream/50 border border-dashed border-border-bronze-light/60 text-text-warm-gray flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-text-warm-gray">
              <strong className="text-text-charcoal font-semibold">Mẹo Phối Đồ Gen Z: </strong>
              Chưa có mẹo phối đồ. Hãy bấm &quot;Tạo Ảnh Phối Đồ&quot; để AI kích hoạt cố vấn phong cách sáng tạo.
            </p>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-3">
          {/* Warnings Banner if any */}
          {data.warnings && data.warnings.length > 0 && (
            <div className="p-3 rounded-xl bg-guardrail-warning-surface border border-guardrail-warning/30 text-text-charcoal text-xs flex items-start gap-2 shadow-xs">
              <ShieldAlert className="w-4 h-4 text-guardrail-warning flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-guardrail-warning block text-[11px]">
                  Cảnh báo nghi lễ &amp; quy chuẩn:
                </span>
                {data.warnings.map((w, idx) => (
                  <p key={idx} className="mt-0.5 leading-relaxed text-[11px] text-text-charcoal">
                    {w}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 3 Diagnostic Cards Matching Prototype Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            {/* Metric 1: Thời tiết & Chất liệu */}
            <div className="p-2.5 rounded-xl bg-paper-cream border border-border-bronze-light/50 flex flex-col justify-between space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-charcoal font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-bronze-gold">
                    thermostat
                  </span>
                  Thời tiết &amp; Chất liệu
                </span>
                <span className="text-[9px] font-mono text-guardrail-pass font-bold px-1.5 py-0.5 rounded bg-guardrail-pass-surface border border-guardrail-pass/30">
                  {data.weatherFitScore >= 80 ? "LÝ TƯỞNG" : `${data.weatherFitScore}%`}
                </span>
              </div>
              <p className="text-text-warm-gray leading-relaxed text-[11px] line-clamp-3">
                {data.weatherAdvice}
              </p>
            </div>

            {/* Metric 2: Bối cảnh & Không gian */}
            <div className="p-2.5 rounded-xl bg-paper-cream border border-border-bronze-light/50 flex flex-col justify-between space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-charcoal font-bold flex items-center gap-1 truncate max-w-[140px]">
                  <span className="material-symbols-outlined text-[14px] text-vermilion-red">
                    nightlife
                  </span>
                  {occasion.name.split("&")[0].trim()}
                </span>
                <span className="text-[9px] font-mono text-bronze-gold font-bold px-1.5 py-0.5 rounded bg-[#F4EFEA] border border-border-bronze-light/40">
                  NỔI BẬT
                </span>
              </div>
              <p className="text-text-warm-gray leading-relaxed text-[11px] line-clamp-3">
                {data.colorHarmonyVerdict}
              </p>
            </div>

            {/* Metric 3: Quy chế Di sản */}
            <div className="p-2.5 rounded-xl bg-paper-cream border border-border-bronze-light/50 flex flex-col justify-between space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-text-charcoal font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-guardrail-pass">
                    rule
                  </span>
                  Quy chế Di sản
                </span>
                <span className="text-[9px] font-mono text-guardrail-pass font-bold px-1.5 py-0.5 rounded bg-guardrail-pass-surface border border-guardrail-pass/30">
                  {data.culturalRespectScore >= 85 ? "CHUẨN 100%" : "CẦN LƯU Ý"}
                </span>
              </div>
              <p className="text-text-warm-gray leading-relaxed text-[11px] line-clamp-3">
                {data.culturalNotes}
              </p>
            </div>
          </div>

          {/* Gen Z Styling Tip */}
          {data.genZStylingTip && (
            <div className="p-2.5 rounded-xl bg-bronze-gold/10 border border-bronze-gold/30 text-text-charcoal flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-bronze-gold flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-text-charcoal">
                <strong className="text-bronze-gold">Mẹo Phối Đồ Gen Z: </strong>
                {data.genZStylingTip}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

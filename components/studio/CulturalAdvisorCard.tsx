"use client";

import React, { useEffect, useState } from "react";
import { OutfitState } from "@/lib/utils";
import { CulturalAdvisorResponse } from "@/app/api/cultural-advisor/route";
import {
  Sparkles,
  ShieldAlert,
  SunMedium,
  Palette,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

interface CulturalAdvisorCardProps {
  outfit: OutfitState;
}

export const CulturalAdvisorCard: React.FC<CulturalAdvisorCardProps> = ({ outfit }) => {
  const [data, setData] = useState<CulturalAdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);

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
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load cultural advice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [outfit.garmentId, outfit.colorId, outfit.occasionId, outfit.styleId, outfit.accessoryId]);

  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Cố Vấn Văn Hóa & Phong Cách
            </h3>
            <span className="text-[10px] text-gray-400">Powered by Gemini 2.0 Flash • Responsible AI</span>
          </div>
        </div>

        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Phân tích lại"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-heritage-gold" : ""}`} />
        </button>
      </div>

      {loading && !data && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin text-heritage-gold" />
          <span className="text-xs">Gemini AI đang thẩm định chuẩn mực văn hóa...</span>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {/* Warnings Banner if any */}
          {data.warnings && data.warnings.length > 0 && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-300">Cảnh báo quy chuẩn nghi lễ & văn hóa:</span>
                {data.warnings.map((w, idx) => (
                  <p key={idx} className="mt-0.5 leading-relaxed text-[11px] text-red-200/90">{w}</p>
                ))}
              </div>
            </div>
          )}

          {/* 3 Metric Score Gauges */}
          <div className="grid grid-cols-3 gap-2">
            {/* Metric 1: Color */}
            <div className="p-2.5 rounded-xl bg-heritage-dark border border-heritage-dark-border text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-1">
                <Palette className="w-3 h-3 text-pink-400" />
                <span>Màu Sắc</span>
              </div>
              <div className="text-base font-bold text-white">
                {data.colorHarmonyScore}<span className="text-[10px] text-gray-500">/100</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-heritage-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.colorHarmonyScore}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Weather & Context */}
            <div className="p-2.5 rounded-xl bg-heritage-dark border border-heritage-dark-border text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-1">
                <SunMedium className="w-3 h-3 text-amber-400" />
                <span>Bối Cảnh</span>
              </div>
              <div className="text-base font-bold text-white">
                {data.weatherFitScore}<span className="text-[10px] text-gray-500">/100</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.weatherFitScore}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Cultural Respect */}
            <div className="p-2.5 rounded-xl bg-heritage-dark border border-heritage-dark-border text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mb-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Thuần Phong</span>
              </div>
              <div className="text-base font-bold text-white">
                {data.culturalRespectScore}<span className="text-[10px] text-gray-500">/100</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${data.culturalRespectScore < 70 ? "bg-red-500" : "bg-emerald-400"
                    }`}
                  style={{ width: `${data.culturalRespectScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* AI Insights & Reasoning */}
          <div className="space-y-2 text-xs">
            {/* Color & Wu Xing */}
            <div className="p-2.5 rounded-xl bg-heritage-dark/60 border border-heritage-dark-border">
              <span className="font-semibold text-heritage-gold block mb-0.5">
                Ngũ Hành & Hòa Sắc (Hành {data.elementAnalysis?.element || "Thổ"}):
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {data.colorHarmonyVerdict}
              </p>
            </div>

            {/* Weather & Fabric */}
            <div className="p-2.5 rounded-xl bg-heritage-dark/60 border border-heritage-dark-border">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                Thời Tiết & Chất Liệu Phù Hợp:
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {data.weatherAdvice}
              </p>
            </div>

            {/* Cultural Integrity */}
            <div className="p-2.5 rounded-xl bg-heritage-dark/60 border border-heritage-dark-border">
              <span className="font-semibold text-sky-400 block mb-0.5">
                Giá Trị Văn Hóa & Thuần Phong Mỹ Tục:
              </span>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                {data.culturalNotes}
              </p>
            </div>

            {/* Gen Z Styling Tip */}
            {data.genZStylingTip && (
              <div className="p-2.5 rounded-xl bg-heritage-gold/10 border border-heritage-gold/30 text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-0.5 text-heritage-gold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Mẹo Mix Match Gen Z:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-100">
                  {data.genZStylingTip}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

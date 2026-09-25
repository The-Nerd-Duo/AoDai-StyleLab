"use client";

import React from "react";
import { OutfitState } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import { X, Check, ArrowRightLeft } from "lucide-react";

interface OutfitComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfitA: OutfitState | null;
  outfitB: OutfitState;
  onSelectA: () => void;
}

export const OutfitComparisonModal: React.FC<OutfitComparisonModalProps> = ({
  isOpen,
  onClose,
  outfitA,
  outfitB,
  onSelectA,
}) => {
  if (!isOpen) return null;

  const getDetails = (outfit: OutfitState) => {
    const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
    const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
    const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
    const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
    const accessory = mockupsData.accessories.find((a) => a.id === outfit.accessoryId) || mockupsData.accessories[0];

    return { garment, color, occasion, style, accessory };
  };

  const detailsB = getDetails(outfitB);
  const detailsA = outfitA ? getDetails(outfitA) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-heritage-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-heritage-gold" />
            <h2 className="text-base font-bold text-white">So Sánh 2 Phương Án Phối Đồ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {!detailsA ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Bạn chưa lưu Phương án A.</p>
              <p className="text-xs mt-1 text-gray-500">
                Hãy nhấn nút "Lưu làm bản A" ở màn hình Live Preview trước khi so sánh nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Column Option A */}
              <div className="border border-heritage-gold/40 bg-heritage-dark rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-heritage-gold uppercase tracking-wider">
                      Phương án A (Đã Lưu)
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: detailsA.color.hex }}
                    />
                  </div>

                  {/* Garment Visual Silhouette */}
                  <div
                    className="w-full h-36 rounded-lg mb-3 flex flex-col items-center justify-center text-center p-2 border border-white/10"
                    style={{ backgroundColor: detailsA.color.hex }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow">
                      {detailsA.garment.name}
                    </span>
                    <span className="text-[10px] text-amber-200 drop-shadow">
                      {detailsA.garment.dynasty}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-400 text-[11px] block">Màu sắc & Ngũ hành:</span>
                      <span className="text-white font-medium">
                        {detailsA.color.name} (Hành {detailsA.color.element})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Bối cảnh:</span>
                      <span className="text-white font-medium">{detailsA.occasion.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Phong cách Gen Z:</span>
                      <span className="text-teal-400 font-medium">{detailsA.style.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Phụ kiện:</span>
                      <span className="text-gray-300 font-medium">{detailsA.accessory.name}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectA();
                    onClose();
                  }}
                  className="mt-4 w-full py-2 rounded-lg bg-heritage-gold text-heritage-dark font-bold text-xs hover:bg-heritage-gold-light transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Chọn Phương án A</span>
                </button>
              </div>

              {/* Column Option B */}
              <div className="border border-teal-500/40 bg-heritage-dark rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Phương án B (Hiện Tại)
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: detailsB.color.hex }}
                    />
                  </div>

                  {/* Garment Visual Silhouette */}
                  <div
                    className="w-full h-36 rounded-lg mb-3 flex flex-col items-center justify-center text-center p-2 border border-white/10"
                    style={{ backgroundColor: detailsB.color.hex }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow">
                      {detailsB.garment.name}
                    </span>
                    <span className="text-[10px] text-teal-200 drop-shadow">
                      {detailsB.garment.dynasty}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-400 text-[11px] block">Màu sắc & Ngũ hành:</span>
                      <span className="text-white font-medium">
                        {detailsB.color.name} (Hành {detailsB.color.element})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Bối cảnh:</span>
                      <span className="text-white font-medium">{detailsB.occasion.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Phong cách Gen Z:</span>
                      <span className="text-teal-400 font-medium">{detailsB.style.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Phụ kiện:</span>
                      <span className="text-gray-300 font-medium">{detailsB.accessory.name}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-4 w-full py-2 rounded-lg bg-teal-500 text-heritage-dark font-bold text-xs hover:bg-teal-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Giữ Phương án B hiện tại</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

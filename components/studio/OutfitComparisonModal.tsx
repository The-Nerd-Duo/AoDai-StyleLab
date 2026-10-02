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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-paper-cream border border-border-bronze-light rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-surface-pure border-b border-border-bronze-light/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-vermilion-red" />
            <h2 className="text-base font-bold text-text-charcoal font-serif">
              So Sánh 2 Phương Án Phối Đồ A / B
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-warm-gray hover:text-text-charcoal hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {!detailsA ? (
            <div className="text-center py-8 text-text-warm-gray">
              <p className="text-sm font-medium">Bạn chưa lưu phương án so sánh A.</p>
              <p className="text-xs mt-1 text-text-warm-gray">
                Nhấn &ldquo;Lưu để so sánh A/B&rdquo; ở màn hình Studio để ghi nhớ phương án trước khi thử phối kiểu mới.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A */}
              <div className="bg-surface-pure border border-border-bronze-light/60 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border-bronze-light/40 pb-2">
                  <span className="text-xs font-bold text-bronze-gold font-mono uppercase">
                    Phương Án A (Đã lưu)
                  </span>
                  <button
                    onClick={() => {
                      onSelectA();
                      onClose();
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-vermilion-red/10 hover:bg-vermilion-red text-vermilion-red hover:text-white font-medium transition-colors"
                  >
                    Chọn bản phối này
                  </button>
                </div>

                <div className="space-y-2 text-xs text-text-charcoal">
                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Trang phục:</span>
                    <strong className="text-sm text-text-charcoal">{detailsA.garment.name}</strong>
                    <span className="text-text-warm-gray block text-[11px]">{detailsA.garment.dynasty}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-text-warm-gray text-[11px]">Màu sắc:</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: detailsA.color.hex }}
                    />
                    <span className="font-semibold">{detailsA.color.name}</span>
                  </div>

                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Bối cảnh:</span>
                    <span>{detailsA.occasion.name}</span>
                  </div>

                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Phong cách:</span>
                    <span>{detailsA.style.name}</span>
                  </div>

                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Phụ kiện:</span>
                    <span>{detailsA.accessory.name}</span>
                  </div>
                </div>
              </div>

              {/* Option B */}
              <div className="bg-surface-pure border-2 border-vermilion-red rounded-xl p-4 flex flex-col gap-3 shadow-sm relative">
                <div className="absolute -top-2.5 right-4 bg-vermilion-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Hiện Tại
                </div>

                <div className="flex items-center justify-between border-b border-border-bronze-light/40 pb-2">
                  <span className="text-xs font-bold text-vermilion-red font-mono uppercase">
                    Phương Án B (Đang chọn)
                  </span>
                  <span className="text-xs text-guardrail-pass font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Đang kích hoạt
                  </span>
                </div>

                <div className="space-y-2 text-xs text-text-charcoal">
                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Trang phục:</span>
                    <strong className="text-sm text-text-charcoal">{detailsB.garment.name}</strong>
                    <span className="text-text-warm-gray block text-[11px]">{detailsB.garment.dynasty}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-text-warm-gray text-[11px]">Màu sắc:</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                      style={{ backgroundColor: detailsB.color.hex }}
                    />
                    <span className="font-semibold">{detailsB.color.name}</span>
                  </div>

                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Bối cảnh:</span>
                    <span>{detailsB.occasion.name}</span>
                  </div>

                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Phong cách:</span>
                    <span>{detailsB.style.name}</span>
                  </div>

                  <div>
                    <span className="text-text-warm-gray block text-[11px]">Phụ kiện:</span>
                    <span>{detailsB.accessory.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-pure border-t border-border-bronze-light/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-vermilion-red text-white text-xs font-semibold hover:bg-primary transition-colors"
          >
            Đóng so sánh
          </button>
        </div>
      </div>
    </div>
  );
};

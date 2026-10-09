"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, QrCode, X, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";

interface DownloadChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (withQr: boolean) => Promise<void>;
  downloading: boolean;
  downloadMode: "with_qr" | "without_qr" | null;
  garmentName?: string;
}

export const DownloadChoiceModal: React.FC<DownloadChoiceModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  downloading,
  downloadMode,
  garmentName,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!downloading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl shadow-2xl border border-bronze-gold/50 overflow-hidden flex flex-col z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Pattern */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-r from-vermilion-red/15 via-bronze-gold/15 to-paper-cream border-b border-border-bronze-light/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-vermilion-red to-primary flex items-center justify-center text-white shadow-md">
              <Download className="w-5 h-5 text-paper-cream" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-text-charcoal leading-tight">
                Tùy Chọn Tải Thẻ Lookbook
              </h3>
              <p className="text-[11px] text-text-warm-gray mt-0.5">
                {garmentName ? `${garmentName} • Chọn định dạng thẻ PNG` : "Chọn định dạng thẻ ảnh PNG bạn muốn lưu về máy"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={downloading}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-border-bronze-light flex items-center justify-center text-text-warm-gray hover:text-text-charcoal transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
            title="Đóng"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with 2 Options */}
        <div className="p-5 flex flex-col gap-3.5">
          {/* Lựa chọn 1: Tải không kèm mã QR */}
          <div
            onClick={() => {
              if (!downloading) onDownload(false);
            }}
            className={`group p-4 rounded-2xl border transition-all cursor-pointer relative bg-surface-pure flex flex-col gap-2.5 shadow-2xs hover:shadow-md ${
              downloadMode === "without_qr"
                ? "border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20"
                : "border-border-bronze-light/70 hover:border-emerald-600/70"
            } ${downloading && downloadMode !== "without_qr" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-text-charcoal group-hover:text-emerald-800 transition-colors">
                      Không kèm mã QR
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200/60">
                      Bản ảnh sạch
                    </span>
                  </div>
                  <p className="text-[11.5px] text-text-warm-gray mt-1 leading-relaxed">
                    Giữ trọn khung cảnh và chi tiết thiết kế, không gắn ô quét QR ở góc dưới. Phù hợp làm ảnh đại diện, in ấn hoặc đăng bài nghệ thuật.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                disabled={downloading}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(false);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-75"
              >
                {downloading && downloadMode === "without_qr" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xuất ảnh...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải Thẻ Không QR</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lựa chọn 2: Tải có kèm mã QR */}
          <div
            onClick={() => {
              if (!downloading) onDownload(true);
            }}
            className={`group p-4 rounded-2xl border transition-all cursor-pointer relative bg-surface-pure flex flex-col gap-2.5 shadow-2xs hover:shadow-md ${
              downloadMode === "with_qr"
                ? "border-vermilion-red ring-2 ring-vermilion-red/30 bg-red-50/20"
                : "border-border-bronze-light/70 hover:border-vermilion-red/70"
            } ${downloading && downloadMode !== "with_qr" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-center text-vermilion-red flex-shrink-0 group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-text-charcoal group-hover:text-vermilion-red transition-colors">
                      Có kèm mã QR
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bronze-gold/15 text-bronze-gold border border-bronze-gold/30">
                      Quét & Remix
                    </span>
                  </div>
                  <p className="text-[11.5px] text-text-warm-gray mt-1 leading-relaxed">
                    Tích hợp mã QR thông minh ở góc dưới. Người nhận có thể quét trực tiếp để mở lại thiết kế và Remix trang phục trên hệ thống.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                disabled={downloading}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-75"
              >
                {downloading && downloadMode === "with_qr" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xuất ảnh...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Tải Thẻ Có Mã QR</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="flex items-center gap-1.5 px-2 pt-1 text-[11px] text-text-warm-gray">
            <Sparkles className="w-3.5 h-3.5 text-bronze-gold flex-shrink-0" />
            <span>Thẻ ảnh PNG xuất ở độ phân giải cao 2x, chuẩn tỷ lệ 9:16 sắc nét.</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

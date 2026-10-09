"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Palette, AlertCircle, ArrowDown, X } from "lucide-react";
import { ActiveStudioContext } from "@/lib/studio-context";

interface ReplaceConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  currentContext: ActiveStudioContext | null;
  newContext?: ActiveStudioContext | null;
  incomingContext?: ActiveStudioContext | null;
}

export const ReplaceConfirmModal: React.FC<ReplaceConfirmModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  currentContext,
  newContext,
  incomingContext,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveNew = newContext || incomingContext;
  const handleClose = onClose || onCancel || (() => {});

  if (!mounted || !isOpen || !currentContext || !effectiveNew) return null;

  const currentLabel =
    currentContext.type === "remix" ? "Bản Remix" : "Bản Thử Phối";
  const newLabel =
    effectiveNew.type === "remix" ? "Bản Remix mới" : "Bản Thử Phối mới";

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-surface-pure rounded-2xl border border-border-bronze-light/80 shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-text-charcoal animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border-bronze-light/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-vermilion-red/10 border border-vermilion-red/20 flex items-center justify-center text-vermilion-red flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-text-charcoal leading-tight">
                Xác nhận thay thế bản đang mở?
              </h3>
              <p className="text-xs text-text-warm-gray mt-0.5">
                Studio đang lưu giữ một bản {currentLabel.toLowerCase()} trước đó.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-text-warm-gray hover:text-vermilion-red p-1 rounded-lg transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Box */}
        <div className="flex flex-col gap-2.5 py-1 text-xs">
          {/* Current Active Item */}
          <div className="p-3 rounded-xl bg-paper-cream/80 border border-border-bronze-light flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-text-warm-gray font-semibold text-[11px]">
              {currentContext.type === "remix" ? (
                <Sparkles className="w-3.5 h-3.5 text-vermilion-red" />
              ) : (
                <Palette className="w-3.5 h-3.5 text-bronze-gold" />
              )}
              <span className="uppercase tracking-wider">
                Đang mở: {currentLabel}
              </span>
            </div>
            <p className="text-text-charcoal font-medium leading-relaxed break-words pl-5">
              {currentContext.details}
            </p>
          </div>

          {/* Replacement Arrow Indicator */}
          <div className="flex items-center justify-center -my-1 text-bronze-gold">
            <div className="w-6 h-6 rounded-full bg-surface-container border border-border-bronze-light/80 flex items-center justify-center shadow-2xs">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* New Incoming Item */}
          <div className="p-3 rounded-xl bg-vermilion-red/5 border border-vermilion-red/30 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-vermilion-red font-bold text-[11px]">
              {effectiveNew.type === "remix" ? (
                <Sparkles className="w-3.5 h-3.5 text-vermilion-red animate-pulse" />
              ) : (
                <Palette className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span className="uppercase tracking-wider">
                Thay thế bằng: {newLabel}
              </span>
            </div>
            <p className="text-text-charcoal font-semibold leading-relaxed break-words pl-5">
              {effectiveNew.details}
            </p>
          </div>

          <p className="text-[11px] text-text-warm-gray italic pt-1">
            * Sau khi thay thế, bạn vẫn có thể nhấn nút <strong>×</strong> trên thanh tiêu đề Studio để hủy bỏ và đặt lại tất cả bất cứ lúc nào.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-bronze-light/40">
          <button
            type="button"
            onClick={handleClose}
            className="py-2 px-4 rounded-xl bg-paper-cream hover:bg-surface-container text-text-charcoal border border-border-bronze-light font-semibold text-xs transition-all active:scale-95 cursor-pointer"
          >
            Giữ bản hiện tại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thay thế & Mở trong Studio</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { OutfitState } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import framesData from "@/config/frames.json";
import { X, Sparkles, User, UserX, Check, AlertCircle, Share2, Layers } from "lucide-react";
import { saveLocalLookbook } from "@/lib/lookbook-storage";

interface ShareCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitState;
  frameId: string;
  imageUrl?: string | null;
  onSuccess?: (newLookbook: any) => void;
}

const CATEGORIES = [
  { id: "pho-co", label: "🏮 Đêm Phố Cổ" },
  { id: "cung-dinh", label: "👑 Cung Đình" },
  { id: "y2k", label: "⚡ Gen Z Y2K" },
  { id: "da-tiec", label: "🪷 Dạ tiệc" },
];

export const ShareCommunityModal: React.FC<ShareCommunityModalProps> = ({
  isOpen,
  onClose,
  outfit,
  frameId,
  imageUrl,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("y2k");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successDone, setSuccessDone] = useState(false);

  const garment = mockupsData.garments.find((g) => g.id === outfit.garmentId) || mockupsData.garments[0];
  const color = mockupsData.colors.find((c) => c.id === outfit.colorId) || mockupsData.colors[0];
  const occasion = mockupsData.occasions.find((o) => o.id === outfit.occasionId) || mockupsData.occasions[0];
  const style = mockupsData.styles.find((s) => s.id === outfit.styleId) || mockupsData.styles[0];
  const frame = framesData.find((f) => f.id === frameId) || framesData[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize author name from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("vietphuc_author_name");
      if (savedName) setAuthorName(savedName);
      const savedAnon = localStorage.getItem("vietphuc_is_anonymous") === "true";
      setIsAnonymous(savedAnon);
    }
  }, []);

  // Update default suggested title when garment / style changes
  useEffect(() => {
    if (isOpen) {
      setTitle(`${garment.name} • ${occasion.name.split("&")[0].trim()}`);
      // Auto suggest category
      if (outfit.styleId === "y2k-neo" || outfit.styleId === "cyber-retro") {
        setCategory("y2k");
      } else if (
        outfit.garmentId.includes("ngu-than") ||
        outfit.garmentId.includes("nhat-binh") ||
        outfit.garmentId.includes("tac")
      ) {
        setCategory("cung-dinh");
      } else if (outfit.occasionId === "wedding-party") {
        setCategory("da-tiec");
      } else {
        setCategory("pho-co");
      }
      setErrorMsg(null);
      setSuccessDone(false);
    }
  }, [isOpen, garment.name, occasion.name, outfit]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalAuthor = isAnonymous ? "Khách Ẩn Danh" : authorName.trim();
    if (!isAnonymous && !finalAuthor) {
      setErrorMsg("Vui lòng nhập họ tên của bạn hoặc chọn 'Đăng ẩn danh'");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save name preference
      if (typeof window !== "undefined") {
        if (!isAnonymous && finalAuthor) {
          localStorage.setItem("vietphuc_author_name", finalAuthor);
        }
        localStorage.setItem("vietphuc_is_anonymous", isAnonymous ? "true" : "false");
      }

      const payload = {
        title: title.trim() || `${garment.name} Di Sản`,
        author: finalAuthor,
        isAnonymous,
        category,
        img: imageUrl || null,
        outfit,
        frameId,
        era: garment.dynasty || "Việt Phục",
        culturalNote: garment.culturalSignificance,
      };

      let newItem: any = null;
      try {
        const res = await fetch("/api/lookbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            newItem = json.data;
          }
        }
      } catch {
        // Fallback to local storage
      }

      if (!newItem) {
        newItem = saveLocalLookbook(payload);
      }

      setSuccessDone(true);
      if (onSuccess) {
        onSuccess(newItem);
      }

      // Auto close after 1.2s
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Submit lookbook error:", err);
      setErrorMsg(err.message || "Đã xảy ra lỗi khi đăng tải Lookbook.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border border-bronze-gold/50 overflow-hidden flex flex-col max-h-[90vh] z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Pattern */}
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-r from-vermilion-red/15 via-bronze-gold/15 to-paper-cream border-b border-border-bronze-light/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-vermilion-red flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-paper-cream" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-text-charcoal leading-tight">
                Chia Sẻ Lên Thư Viện Cộng Đồng
              </h3>
              <p className="text-[11px] text-text-warm-gray mt-0.5">
                Cập nhật theo thời gian thực để mọi người đang mở web thấy ngay
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-border-bronze-light flex items-center justify-center text-text-warm-gray hover:text-text-charcoal transition-colors disabled:opacity-50 shadow-2xs"
            title="Đóng"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Card Miniature Preview */}
          <div className="bg-surface-pure rounded-2xl p-3 border border-border-bronze-light/60 flex items-center gap-3.5 shadow-2xs">
            <div className="relative w-14 h-20 rounded-xl overflow-hidden bg-text-charcoal flex-shrink-0 border border-bronze-gold/40 flex items-center justify-center shadow-xs">
              {imageUrl ? (
                <img src={imageUrl} alt={garment.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-1 flex flex-col items-center justify-center">
                  <Layers className="w-4 h-4 text-bronze-gold mb-0.5" />
                  <span className="text-[8px] font-mono text-paper-cream uppercase">9:16</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                <span className="text-[10px] font-mono text-bronze-gold uppercase tracking-wider font-semibold">
                  {garment.dynasty}
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-text-charcoal truncate">
                {garment.name}
              </h4>
              <p className="text-[11px] text-text-warm-gray truncate mt-0.5">
                {color.name} • {style.name} • {frame.name}
              </p>
            </div>
          </div>

          {/* Identity Setting: Anonymous Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-serif font-bold text-text-charcoal flex items-center gap-1.5">
              <span>Danh tính người chia sẻ</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${!isAnonymous
                    ? "bg-surface-pure border-vermilion-red text-vermilion-red shadow-xs font-bold ring-1 ring-vermilion-red/30"
                    : "bg-paper-cream border-border-bronze-light/60 text-text-warm-gray hover:text-text-charcoal"
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Công khai tên</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${isAnonymous
                    ? "bg-surface-pure border-bronze-gold text-bronze-gold shadow-xs font-bold ring-1 ring-bronze-gold/30"
                    : "bg-paper-cream border-border-bronze-light/60 text-text-warm-gray hover:text-text-charcoal"
                  }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Đăng ẩn danh</span>
              </button>
            </div>

            {/* Khung Nhập Họ Tên */}
            {!isAnonymous ? (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label htmlFor="author-input" className="text-[11px] font-medium text-text-warm-gray">
                  Họ và tên hoặc biệt danh của bạn:
                </label>
                <div className="relative">
                  <input
                    id="author-input"
                    type="text"
                    required={!isAnonymous}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ví dụ: Minh Anh, Hà My, Hoàng Long..."
                    maxLength={35}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-pure border border-border-bronze-light text-text-charcoal text-xs placeholder:text-text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-vermilion-red/30 focus:border-vermilion-red transition-all"
                  />
                  <User className="w-4 h-4 text-text-warm-gray absolute right-3 top-3 pointer-events-none opacity-50" />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-bronze-gold/10 border border-bronze-gold/25 flex items-center gap-2.5 text-xs text-text-charcoal animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-bronze-gold text-[18px]">
                  visibility_off
                </span>
                <div className="text-[11px] leading-tight">
                  Tên tác giả sẽ hiển thị là <strong className="text-bronze-gold font-bold">Khách Ẩn Danh</strong>. Danh tính của bạn hoàn toàn bảo mật.
                </div>
              </div>
            )}
          </div>

          {/* Lookbook Title Input */}
          <div className="space-y-1.5">
            <label htmlFor="title-input" className="text-xs font-serif font-bold text-text-charcoal">
              Tiêu đề bản phối:
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề hoặc tên tác phẩm..."
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-pure border border-border-bronze-light text-text-charcoal text-xs placeholder:text-text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-vermilion-red/30 focus:border-vermilion-red transition-all"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-text-charcoal">
              Chủ đề cộng đồng:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold transition-all border text-center truncate ${category === cat.id
                      ? "bg-vermilion-red text-white border-vermilion-red shadow-xs"
                      : "bg-surface-pure text-text-warm-gray hover:text-text-charcoal border-border-bronze-light/60 hover:bg-paper-cream"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successDone && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-xs text-green-700 animate-in fade-in">
              <Check className="w-4 h-4 flex-shrink-0 stroke-[3]" />
              <span className="font-semibold">Đã tải lên cộng đồng thành công! Thẻ của bạn đang xuất hiện...</span>
            </div>
          )}
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-surface-pure border-t border-border-bronze-light/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-warm-gray hover:text-text-charcoal hover:bg-paper-cream transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || successDone}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang tải lên...</span>
              </>
            ) : successDone ? (
              <>
                <Check className="w-4 h-4" />
                <span>Hoàn tất!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-bronze-gold" />
                <span>Đăng Ngay Lên Cộng Đồng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

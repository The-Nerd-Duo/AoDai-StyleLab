"use client";

import React from "react";
import { Header } from "@/components/shared/Header";
import { FrameSelector } from "@/components/lookbook/FrameSelector";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { useOutfitStore } from "@/lib/store";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function LookbookPage() {
  const { outfit, selectedFrame, setSelectedFrame } = useOutfitStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="max-w-5xl mx-auto w-full px-4 py-4 sm:px-6 sm:py-6 flex flex-col gap-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Studio Phối Đồ</span>
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-gold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Tab 2 • Tạo Thẻ Lookbook 9:16
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Bộ Sưu Tập Lookbook Việt Phục
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Ghép bản phối vào khung thiết kế chuẩn tỷ lệ Story 9:16.
            Tải ảnh PNG sắc nét hoặc chia sẻ liên kết trực tiếp không cần lưu trữ server.
          </p>
        </div>

        {/* Frame Selection */}
        <FrameSelector
          selectedFrameId={selectedFrame}
          onSelectFrame={setSelectedFrame}
        />

        {/* Lookbook Render Canvas & Actions */}
        <div className="flex justify-center py-4">
          <LookbookCard outfit={outfit} frameId={selectedFrame} />
        </div>
      </div>
    </div>
  );
}

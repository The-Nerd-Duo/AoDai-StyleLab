"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { decodeOutfitFromQuery } from "@/lib/utils";
import { useOutfitStore } from "@/lib/store";
import { Sparkles, Palette, Share2 } from "lucide-react";

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setOutfit, setSelectedFrame } = useOutfitStore();

  const paramsObject: { [key: string]: string | string[] | undefined } = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const { outfit, frameId } = decodeOutfitFromQuery(paramsObject);

  const handleRemixThisOutfit = () => {
    setOutfit(outfit);
    setSelectedFrame(frameId);
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 flex flex-col items-center gap-6">
      {/* Banner */}
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-gold/15 text-heritage-gold border border-heritage-gold/30 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Shared Lookbook • Việt Phục Remix</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
          Thẻ Lookbook Di Sản Được Chia Sẻ
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Bản phối trang phục truyền thống độc bản từ bạn bè. Bạn có thể lưu ảnh hoặc nhấn Remix để tự do biến tấu tiếp!
        </p>
      </div>

      {/* Lookbook Render Canvas */}
      <LookbookCard outfit={outfit} frameId={frameId} />

      {/* CTA Button to Remix */}
      <div className="pt-2">
        <button
          onClick={handleRemixThisOutfit}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-heritage-red to-heritage-red-light hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-heritage-red/30 flex items-center gap-2 transition-all"
        >
          <Palette className="w-4 h-4" />
          <span>Tự Remix Lại Bản Phối Này Trong Studio</span>
        </button>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center text-gray-400 text-sm">
            Đang tải dữ liệu Lookbook...
          </div>
        }
      >
        <ShareContent />
      </Suspense>
    </div>
  );
}

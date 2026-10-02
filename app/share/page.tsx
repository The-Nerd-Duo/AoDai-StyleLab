"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { decodeOutfitFromQuery } from "@/lib/utils";
import { useOutfitStore } from "@/lib/store";
import { Sparkles, Palette } from "lucide-react";

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setOutfit, setSelectedFrame, setResultImage } = useOutfitStore();

  const paramsObject: { [key: string]: string | string[] | undefined } = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const { outfit, frameId, imageUrl } = decodeOutfitFromQuery(paramsObject);

  const handleRemixThisOutfit = () => {
    setOutfit(outfit);
    setSelectedFrame(frameId);
    if (imageUrl) {
      setResultImage(imageUrl);
    }
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center gap-6">
      {/* Banner */}
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vermilion-red/10 text-vermilion-red border border-vermilion-red/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-bronze-gold" />
          <span>Shared Lookbook • AoDai StyleLab</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-text-charcoal">
          Thẻ Lookbook Di Sản Được Chia Sẻ
        </h2>
        <p className="text-xs text-text-warm-gray mt-1">
          Bản phối trang phục truyền thống độc bản từ bạn bè. Bạn có thể lưu ảnh hoặc nhấn Remix để tự do biến tấu tiếp!
        </p>
      </div>

      {/* Lookbook Render Canvas */}
      <LookbookCard outfit={outfit} frameId={frameId} imageUrl={imageUrl} />

      {/* CTA Button to Remix */}
      <div className="pt-2">
        <button
          onClick={handleRemixThisOutfit}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-vermilion-red to-primary hover:opacity-95 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
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
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <Header />
      <main className="flex-1 flex flex-col justify-center">
        <Suspense fallback={<div className="p-8 text-center text-text-warm-gray text-xs">Đang tải thẻ chia sẻ...</div>}>
          <ShareContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { decodeOutfitFromQuery } from "@/lib/utils";
import { useOutfitStore } from "@/lib/store";
import { Sparkles, Palette } from "lucide-react";
import { getPrivateShareLocally, getLocalLookbooks } from "@/lib/lookbook-storage";

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setOutfit, setSelectedFrame, setResultImage, resultImage } = useOutfitStore();

  const paramsObject: { [key: string]: string | string[] | undefined } = {};
  searchParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const { outfit, frameId, imageUrl, shareId } = decodeOutfitFromQuery(paramsObject);
  const [resolvedImage, setResolvedImage] = useState<string | null>(imageUrl);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(shareId && !imageUrl));

  // If a shareId was provided, fetch the full card from Cloudflare D1/KV to load the AI photo
  useEffect(() => {
    if (shareId && !resolvedImage) {
      let isMounted = true;
      setIsLoading(true);

      fetch(`/api/lookbook/${shareId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (!isMounted) return;
          if (json?.data?.img) {
            setResolvedImage(json.data.img);
          } else {
            // Local fallback for same browser / offline / local development
            const local = getPrivateShareLocally(shareId) || getLocalLookbooks().find((i) => i.id === shareId);
            if (local?.img) {
              setResolvedImage(local.img);
            }
          }
        })
        .catch(() => {
          if (!isMounted) return;
          const local = getPrivateShareLocally(shareId) || getLocalLookbooks().find((i) => i.id === shareId);
          if (local?.img) {
            setResolvedImage(local.img);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [shareId, resolvedImage]);

  const handleRemixThisOutfit = () => {
    setOutfit(outfit);
    setSelectedFrame(frameId);
    const finalImageToRemix = resolvedImage || resultImage;
    if (finalImageToRemix) {
      setResultImage(finalImageToRemix);
    }
    try {
      sessionStorage.setItem(
        "vietphuc_studio_context",
        JSON.stringify({
          type: "remix",
          outfit,
          title: "Bản Phối Chia Sẻ",
        })
      );
    } catch {}
    router.push("/?mode=remix");
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
      {isLoading ? (
        <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] rounded-3xl bg-[#0D0C0B] border border-bronze-gold/50 flex flex-col items-center justify-center p-6 text-center shadow-2xl animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-bronze-gold/40 flex items-center justify-center text-bronze-gold mb-3">
            <Sparkles className="w-6 h-6 text-bronze-gold animate-spin" />
          </div>
          <p className="text-paper-cream text-xs font-serif font-bold">Đang tải thẻ Lookbook di sản...</p>
          <span className="text-[10px] font-mono text-white/50 mt-1">Đang nạp ảnh phối độc bản</span>
        </div>
      ) : (
        <LookbookCard outfit={outfit} frameId={frameId} imageUrl={resolvedImage || undefined} shareId={shareId} />
      )}

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

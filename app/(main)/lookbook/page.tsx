"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { FrameSelector } from "@/components/lookbook/FrameSelector";
import { useOutfitStore } from "@/lib/store";
import { Sparkles, ArrowLeft } from "lucide-react";

// Curated Community Lookbook Cards for Inspiration
const COMMUNITY_ITEMS = [
  {
    id: "giao-linh-saigon",
    title: "Giao Lĩnh Sài Gòn 2026",
    era: "Hậu Lê • Cách Tân",
    author: "Minh Anh",
    authorInitial: "M",
    likes: 1420,
    shares: 320,
    category: "y2k",
    img: "/garments/ao-giao-linh.jpg",
  },
  {
    id: "tu-than-hoian",
    title: "Tứ Thân Du Xuân Phố Hội",
    era: "Bắc Bộ • Dân Gian",
    author: "Linh Đan",
    authorInitial: "L",
    likes: 890,
    shares: 145,
    category: "pho-co",
    img: "/garments/ao-tu-than.jpg",
  },
  {
    id: "vien-linh-cyber",
    title: "Viên Lĩnh Cyberpunk 2026",
    era: "Triều Nguyễn • Quan Viên",
    author: "Khôi Nguyên",
    authorInitial: "K",
    likes: 2100,
    shares: 640,
    category: "y2k",
    img: "/garments/ao-lap-linh.jpg",
  },
  {
    id: "ngu-than-bach-hoa",
    title: "Ngũ Thân Bách Hoa Điền",
    era: "Cung Đình Huế",
    author: "Thanh Trúc",
    authorInitial: "T",
    likes: 3400,
    shares: 812,
    category: "cung-dinh",
    img: "/garments/ao-ngu-than-tay-chen.jpg",
  },
  {
    id: "nhat-binh-hoang-gia",
    title: "Nhật Bình Hoàng Gia Remix",
    era: "Hậu Phi • Lễ Phục",
    author: "Hà My",
    authorInitial: "H",
    likes: 5200,
    shares: 1100,
    category: "cung-dinh",
    img: "/garments/ao-nhat-binh.jpg",
  },
  {
    id: "ao-dai-lemur",
    title: "Áo Dài Lemur Phục Hưng",
    era: "Thời Kỳ 1930s Tân Thời",
    author: "Quang Đăng",
    authorInitial: "Q",
    likes: 1800,
    shares: 410,
    category: "da-tiec",
    img: "/garments/ao-dai-cach-tan.jpg",
  },
];

export default function LookbookPage() {
  const { outfit, selectedFrame, setSelectedFrame, resultImage } = useOutfitStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, initialLikes: number) => {
    setUserLiked((prev) => {
      const isLiked = !prev[id];
      setLikeCounts((lPrev) => ({
        ...lPrev,
        [id]: (lPrev[id] !== undefined ? lPrev[id] : initialLikes) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const filteredCommunity = COMMUNITY_ITEMS.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "pho-co") return item.category === "pho-co";
    if (activeCategory === "cung-dinh") return item.category === "cung-dinh";
    if (activeCategory === "y2k") return item.category === "y2k";
    if (activeCategory === "da-tiec") return item.category === "da-tiec";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <Header />

      <main className="w-full flex flex-col">
        {/* Header Title & Back Button */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-paper-cream hover:bg-surface-container border border-border-bronze-light/60 text-text-warm-gray hover:text-text-charcoal transition-colors"
              title="Quay lại Studio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-charcoal tracking-tight">
              Bộ sưu tập Lookbook Di sản 9:16
            </h1>
          </div>
        </div>

        {/* Workspace: 2-Column Split */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 cols, sticky): Lookbook Card Editor */}
            <div className="lg:col-span-5 flex flex-col gap-5 sticky top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-charcoal font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-bronze-gold" />
                  Bản Phối Của Bạn (Live 9:16)
                </span>
                <span className="text-[11px] font-mono text-text-warm-gray bg-surface-pure px-2.5 py-0.5 rounded-full border border-border-bronze-light/50">
                  Tỷ lệ 1080 x 1920
                </span>
              </div>

              {/* Dynamic Lookbook Card */}
              <LookbookCard outfit={outfit} frameId={selectedFrame} imageUrl={resultImage} />

              {/* Dynamic Frame Selector */}
              <FrameSelector
                selectedFrameId={selectedFrame}
                onSelectFrame={setSelectedFrame}
              />
            </div>

            {/* Right Column (7 cols): Community Lookbook Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Gallery Header */}
              <div className="bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-bronze-gold">explore</span>
                    <h2 className="font-serif font-bold text-base text-text-charcoal">
                      Khám phá Lookbook Di sản Gen Z
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-paper-cream px-3 py-1.5 rounded-lg border border-border-bronze-light/50 self-start sm:self-auto shadow-inner">
                  <span className="font-serif text-base text-vermilion-red font-bold">2,840+</span>
                  <span className="text-[11px] text-text-warm-gray">thẻ cộng đồng</span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-nowrap">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "all"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  Tất cả (128)
                </button>
                <button
                  onClick={() => setActiveCategory("pho-co")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "pho-co"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  🏮 Đêm Phố Cổ (42)
                </button>
                <button
                  onClick={() => setActiveCategory("cung-dinh")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "cung-dinh"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  👑 Cung Đình (36)
                </button>
                <button
                  onClick={() => setActiveCategory("y2k")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "y2k"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  ⚡ Gen Z Y2K (29)
                </button>
                <button
                  onClick={() => setActiveCategory("da-tiec")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "da-tiec"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  🪷 Dạ tiệc (21)
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCommunity.map((item) => {
                  const currentLikes =
                    likeCounts[item.id] !== undefined ? likeCounts[item.id] : item.likes;
                  const isLiked = !!userLiked[item.id];

                  return (
                    <div
                      key={item.id}
                      className="bg-surface-pure rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group border border-border-bronze-light/50"
                    >
                      <div className="relative aspect-[9/14] w-full overflow-hidden bg-text-charcoal">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-text-charcoal via-transparent to-transparent" />

                        {/* Badge: AI Verified */}
                        <span className="absolute top-2.5 left-2.5 bg-text-charcoal/80 backdrop-blur-md text-guardrail-pass text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-semibold border border-guardrail-pass/30">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          AI Guardrail
                        </span>

                        {/* Save Heart */}
                        <button
                          onClick={() => handleLike(item.id, item.likes)}
                          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                            isLiked
                              ? "bg-vermilion-red text-white"
                              : "bg-text-charcoal/60 hover:bg-vermilion-red text-white"
                          }`}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isLiked ? "favorite" : "favorite_border"}
                          </span>
                        </button>

                        {/* On-Image Meta */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                          <span className="text-[9px] text-bronze-gold uppercase tracking-wider block font-semibold">
                            {item.era}
                          </span>
                          <h3 className="font-serif text-[13px] font-bold text-paper-cream truncate">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="p-2.5 flex items-center justify-between bg-surface-pure text-xs text-text-warm-gray">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-bronze-gold flex items-center justify-center text-[10px] text-white font-bold">
                            {item.authorInitial}
                          </div>
                          <span className="text-[11px] truncate max-w-[80px] font-medium">
                            {item.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-0.5 text-vermilion-red font-semibold">
                            <span className="material-symbols-outlined text-[13px]">favorite</span>
                            {currentLikes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">share</span>
                            {item.shares}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LookbookCard } from "@/components/lookbook/LookbookCard";
import { FrameSelector } from "@/components/lookbook/FrameSelector";
import { useOutfitStore } from "@/lib/store";
import { LookbookItem } from "@/lib/types";
import { encodeOutfitToQuery } from "@/lib/utils";
import mockupsData from "@/config/mockups.json";
import {
  Sparkles,
  ArrowLeft,
  Share2,
  Heart,
  Check,
  Radio,
  ExternalLink,
  Layers,
  Sparkle,
} from "lucide-react";

const INITIAL_FALLBACK_ITEMS: LookbookItem[] = [];

export default function LookbookPage() {
  const { outfit, selectedFrame, setSelectedFrame, resultImage, setOutfit, setResultImage } = useOutfitStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<LookbookItem[]>(INITIAL_FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);
  const [userLikedIds, setUserLikedIds] = useState<Set<string>>(new Set());
  const [newlyAddedIds, setNewlyAddedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Show a floating toast notification
  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Load liked items from localStorage
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem("vietphuc_liked_lookbook_ids");
      if (savedLikes) {
        setUserLikedIds(new Set(JSON.parse(savedLikes)));
      }
    } catch {}
  }, []);

  // Fetch initial lookbooks from API
  const fetchLookbooks = useCallback(async () => {
    try {
      const res = await fetch("/api/lookbook");
      if (!res.ok) throw new Error("Failed to load lookbooks");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setItems(json.data);
      }
    } catch (err) {
      console.warn("Could not fetch lookbooks from API, using cached data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLookbooks();
  }, [fetchLookbooks]);

  // Setup Real-time Server-Sent Events (SSE) and BroadcastChannel
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource("/api/lookbook/stream");

        eventSource.onopen = () => {
          setIsLiveConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (!parsed || !parsed.type) return;

            if (parsed.type === "NEW_LOOKBOOK" && parsed.data) {
              const newCard: LookbookItem = parsed.data;
              setItems((prev) => {
                if (prev.some((item) => item.id === newCard.id)) return prev;
                return [newCard, ...prev];
              });

              // Mark as newly added for pulse animation
              setNewlyAddedIds((prev) => {
                const next = new Set(prev);
                next.add(newCard.id);
                return next;
              });
              showToast(`🔔 ${newCard.author} vừa chia sẻ: "${newCard.title}"!`);

              // Remove highlight after 8 seconds
              setTimeout(() => {
                setNewlyAddedIds((prev) => {
                  const updated = new Set(prev);
                  updated.delete(newCard.id);
                  return updated;
                });
              }, 8000);
            } else if (parsed.type === "UPDATE_LIKES" && parsed.data) {
              const { id, likes } = parsed.data;
              setItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, likes } : item))
              );
            } else if (parsed.type === "UPDATE_SHARES" && parsed.data) {
              const { id, shares } = parsed.data;
              setItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, shares } : item))
              );
            }
          } catch (err) {
            console.error("Error parsing SSE event:", err);
          }
        };

        eventSource.onerror = () => {
          setIsLiveConnected(false);
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Try reconnecting in 5s
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.warn("SSE connection error:", err);
      }
    };

    connectSSE();

    // Cross-tab immediate BroadcastChannel listener
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        broadcastChannel = new BroadcastChannel("vietphuc_lookbook_channel");
        broadcastChannel.onmessage = (ev) => {
          const payload = ev.data;
          if (payload?.type === "NEW_LOOKBOOK" && payload.data) {
            const newCard = payload.data;
            setItems((prev) => {
              if (prev.some((item) => item.id === newCard.id)) return prev;
              return [newCard, ...prev];
            });
            setNewlyAddedIds((prev) => {
              const next = new Set(prev);
              next.add(newCard.id);
              return next;
            });
            showToast(`🔔 ${newCard.author} vừa chia sẻ: "${newCard.title}"!`);
          } else if (payload?.type === "UPDATE_LIKES" && payload.data) {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.data.id ? { ...item, likes: payload.data.likes } : item
              )
            );
          } else if (payload?.type === "UPDATE_SHARES" && payload.data) {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.data.id ? { ...item, shares: payload.data.shares } : item
              )
            );
          }
        };
      }
    } catch {}

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (broadcastChannel) broadcastChannel.close();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [showToast]);

  // Handle Heart / Like Toggle
  const handleToggleLike = async (id: string) => {
    const isCurrentlyLiked = userLikedIds.has(id);
    const action = isCurrentlyLiked ? "unlike" : "like";

    // Optimistic UI update
    const updatedLikes = new Set(userLikedIds);
    if (isCurrentlyLiked) {
      updatedLikes.delete(id);
    } else {
      updatedLikes.add(id);
    }
    setUserLikedIds(updatedLikes);

    try {
      localStorage.setItem(
        "vietphuc_liked_lookbook_ids",
        JSON.stringify(Array.from(updatedLikes))
      );
    } catch {}

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const delta = isCurrentlyLiked ? -1 : 1;
          return { ...item, likes: Math.max(0, (item.likes || 0) + delta) };
        }
        return item;
      })
    );

    // Broadcast across tabs immediately
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const item = items.find((i) => i.id === id);
        const currentLikes = item ? item.likes : 0;
        const newLikes = Math.max(0, currentLikes + (isCurrentlyLiked ? -1 : 1));
        const bc = new BroadcastChannel("vietphuc_lookbook_channel");
        bc.postMessage({ type: "UPDATE_LIKES", data: { id, likes: newLikes } });
        bc.close();
      }
    } catch {}

    // Send to backend API
    try {
      const res = await fetch(`/api/lookbook/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, likes: data.data.likes } : item))
        );
      }
    } catch (err) {
      console.warn("Could not sync like to server:", err);
    }
  };

  // Handle Share Lookbook Card
  const handleShareCard = async (item: LookbookItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    let shareUrl = `${origin}/share?id=${item.id}`;

    if (item.outfit) {
      const query = encodeOutfitToQuery(item.outfit, item.frameId, item.img);
      shareUrl = `${origin}/share?${query}`;
    }

    const shareTitle = `${item.title} • Thẻ Lookbook Di Sản Việt Phục`;
    const shareText = `Khám phá bản phối "${item.title}" (${item.era}) bởi ${item.author} trên AoDai StyleLab!`;

    // Optimistically increment share count
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, shares: (i.shares || 0) + 1 } : i))
    );

    // Call Web Share API if supported
    let usedNativeShare = false;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        usedNativeShare = true;
        showToast("✨ Đã chia sẻ thẻ Lookbook thành công!");
      } catch (e: any) {
        // User aborted or unsupported -> fallback to clipboard
        if (e.name !== "AbortError") {
          usedNativeShare = false;
        }
      }
    }

    if (!usedNativeShare) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("📋 Đã sao chép liên kết chia sẻ vào bộ nhớ tạm!");
      } catch {
        showToast("Liên kết: " + shareUrl);
      }
    }

    // Broadcast across tabs
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("vietphuc_lookbook_channel");
        bc.postMessage({
          type: "UPDATE_SHARES",
          data: { id: item.id, shares: (item.shares || 0) + 1 },
        });
        bc.close();
      }
    } catch {}

    // Send to backend API
    try {
      fetch(`/api/lookbook/${item.id}/share`, {
        method: "POST",
      }).catch(() => {});
    } catch {}
  };

  // Remix an outfit from community into Studio
  const handleRemixLookbook = (item: LookbookItem) => {
    if (item.outfit) {
      setOutfit(item.outfit);
    }
    if (item.frameId) {
      setSelectedFrame(item.frameId);
    }
    if (item.img && !item.img.startsWith("/garments/")) {
      setResultImage(item.img);
    }
    showToast(`Đã nạp bản phối "${item.title}" vào Studio!`);
  };

  // Category Filter
  const filteredCommunity = items.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  // Calculate category item counts
  const categoryCounts = {
    all: items.length,
    "pho-co": items.filter((i) => i.category === "pho-co").length,
    "cung-dinh": items.filter((i) => i.category === "cung-dinh").length,
    y2k: items.filter((i) => i.category === "y2k").length,
    "da-tiec": items.filter((i) => i.category === "da-tiec").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <Header />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-text-charcoal/95 backdrop-blur-md text-paper-cream px-4 py-3 rounded-2xl shadow-2xl border border-bronze-gold/50 flex items-center gap-3 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-vermilion-red animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="w-full flex flex-col flex-1 pb-12">
        {/* Header Title & Navigation Bar */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2.5 rounded-xl bg-paper-cream hover:bg-surface-container border border-border-bronze-light/60 text-text-warm-gray hover:text-text-charcoal transition-colors shadow-2xs"
                title="Quay lại Studio"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-charcoal tracking-tight flex items-center gap-2">
                  <span>Bộ sưu tập Lookbook Di sản 9:16</span>
                </h1>
                <p className="text-xs text-text-warm-gray mt-0.5">
                  Tạo thẻ định danh di sản của bạn hoặc khám phá và tương tác cùng cộng đồng
                </p>
              </div>
            </div>

            {/* Real-time Live Status Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-pure border border-border-bronze-light/60 px-3 py-1.5 rounded-xl shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span className="text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                <span>{isLiveConnected ? "Đồng bộ trực tiếp" : "Đang kết nối live..."}</span>
                <span className="font-mono text-bronze-gold text-[10px] uppercase font-bold">
                  (Real-time)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Workspace: 2-Column Split */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 cols, sticky): Lookbook Card Editor */}
            <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-charcoal font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-bronze-gold" />
                  Bản Phối Của Bạn (Live 9:16)
                </span>
                <span className="text-[11px] font-mono text-text-warm-gray bg-surface-pure px-2.5 py-0.5 rounded-full border border-border-bronze-light/50">
                  Tỷ lệ 1080 x 1920
                </span>
              </div>

              {/* Dynamic Lookbook Card with Community Share & PNG Download */}
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
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-bronze-gold/15 flex items-center justify-center text-bronze-gold">
                    <span className="material-symbols-outlined text-[19px]">explore</span>
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-text-charcoal leading-tight">
                      Khám phá Lookbook Di sản Gen Z
                    </h2>
                    <p className="text-[11px] text-text-warm-gray mt-0.5">
                      Được chia sẻ bởi cộng đồng người yêu trang phục truyền thống
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-paper-cream px-3 py-1.5 rounded-xl border border-border-bronze-light/50 self-start sm:self-auto shadow-inner">
                  <span className="font-serif text-base text-vermilion-red font-bold">
                    {items.length}
                  </span>
                  <span className="text-[11px] text-text-warm-gray">thẻ đã lưu vào database</span>
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
                  Tất cả ({categoryCounts.all})
                </button>
                <button
                  onClick={() => setActiveCategory("pho-co")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "pho-co"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  🏮 Đêm Phố Cổ ({categoryCounts["pho-co"]})
                </button>
                <button
                  onClick={() => setActiveCategory("cung-dinh")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "cung-dinh"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  👑 Cung Đình ({categoryCounts["cung-dinh"]})
                </button>
                <button
                  onClick={() => setActiveCategory("y2k")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "y2k"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  ⚡ Gen Z Y2K ({categoryCounts.y2k})
                </button>
                <button
                  onClick={() => setActiveCategory("da-tiec")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    activeCategory === "da-tiec"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                  }`}
                >
                  🪷 Dạ tiệc ({categoryCounts["da-tiec"]})
                </button>
              </div>

              {/* Cards Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="bg-surface-pure rounded-xl overflow-hidden shadow-xs border border-border-bronze-light/40 animate-pulse aspect-[9/14]"
                    />
                  ))}
                </div>
              ) : filteredCommunity.length === 0 ? (
                <div className="bg-surface-pure rounded-3xl p-10 border border-border-bronze-light/60 text-center flex flex-col items-center justify-center gap-3.5 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-paper-cream border border-bronze-gold/30 flex items-center justify-center text-bronze-gold shadow-inner">
                    <Sparkles className="w-7 h-7 text-bronze-gold" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-text-charcoal">
                    {items.length === 0
                      ? "Chưa có thẻ Lookbook nào trong Thư viện Cộng đồng"
                      : "Chưa có Lookbook nào trong chủ đề này"}
                  </h3>
                  <p className="text-xs text-text-warm-gray max-w-md leading-relaxed">
                    {items.length === 0
                      ? "Hệ thống cơ sở dữ liệu đã sẵn sàng! Hãy tạo bản phối ưng ý bên cột trái rồi nhấn 'Chia Sẻ Lên Thư Viện Cộng Đồng' để trở thành người đầu tiên xuất hiện tại đây theo thời gian thực."
                      : "Hãy là người đầu tiên chia sẻ thẻ Lookbook với phong cách này lên cộng đồng!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredCommunity.map((item) => {
                    const isLiked = userLikedIds.has(item.id);
                    const isNewlyAdded = newlyAddedIds.has(item.id);

                    // Garment lookup for fallback
                    const garmentMeta = item.outfit
                      ? mockupsData.garments.find((g) => g.id === item.outfit?.garmentId)
                      : null;
                    const colorMeta = item.outfit
                      ? mockupsData.colors.find((c) => c.id === item.outfit?.colorId)
                      : null;

                    return (
                      <div
                        key={item.id}
                        className={`bg-surface-pure rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group border relative ${
                          isNewlyAdded
                            ? "border-vermilion-red ring-2 ring-vermilion-red/40 animate-in zoom-in-95 duration-500"
                            : "border-border-bronze-light/50 hover:border-bronze-gold/50"
                        }`}
                      >
                        {/* Top Indicator for Newly Shared Item */}
                        {isNewlyAdded && (
                          <div className="absolute top-2 left-2 z-20 bg-vermilion-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                            <Sparkle className="w-2.5 h-2.5" />
                            <span>MỚI ĐĂNG LIVE</span>
                          </div>
                        )}

                        {/* Card Image or Heritage Visual Canvas */}
                        <div className="relative aspect-[9/14] w-full overflow-hidden bg-text-charcoal select-none">
                          {item.img && !item.img.startsWith("/garments/") ? (
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            /* Fallback Styled Visual for seeded items without photos */
                            <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-[#221f1d] via-[#1a1817] to-[#121110] relative overflow-hidden">
                              <div
                                className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
                                style={{ backgroundColor: colorMeta?.hex || "#D93829" }}
                              />
                              {/* Corner Accents */}
                              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-bronze-gold/40" />
                              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-bronze-gold/40" />
                              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-bronze-gold/40" />
                              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-bronze-gold/40" />

                              <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-bronze-gold">
                                <span>{garmentMeta?.dynasty || item.era}</span>
                                <span>9:16</span>
                              </div>

                              <div className="relative z-10 text-center my-auto flex flex-col items-center">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-bronze-gold/30 flex items-center justify-center text-bronze-gold mb-2 shadow-inner">
                                  <Layers className="w-5 h-5 text-bronze-gold/85" />
                                </div>
                                <span className="font-serif text-xs font-bold text-paper-cream line-clamp-1">
                                  {garmentMeta?.name || item.title}
                                </span>
                                <span className="text-[10px] text-paper-cream/60 mt-0.5 line-clamp-1">
                                  {colorMeta?.name || "Sắc Cổ Phong"}
                                </span>
                              </div>

                              <div className="relative z-10 text-center">
                                <span className="px-2 py-0.5 rounded-full bg-white/[0.07] text-bronze-gold text-[8px] font-mono border border-bronze-gold/20">
                                  HERITAGE ARCHIVE
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-text-charcoal via-transparent to-transparent pointer-events-none" />

                          {/* Badge: AI Verified */}
                          <span className="absolute top-2.5 left-2.5 bg-text-charcoal/85 backdrop-blur-md text-guardrail-pass text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-semibold border border-guardrail-pass/30 z-10">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            <span>AI Verified</span>
                          </span>

                          {/* Nút Tim (Floating Save Heart Button) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLike(item.id);
                            }}
                            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md z-10 active:scale-90 ${
                              isLiked
                                ? "bg-vermilion-red text-white scale-105 ring-2 ring-white/50"
                                : "bg-text-charcoal/70 hover:bg-vermilion-red text-white"
                            }`}
                            type="button"
                            title={isLiked ? "Bỏ thích" : "Thả tim Lookbook"}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? "fill-white text-white" : "text-white"
                              }`}
                            />
                          </button>

                          {/* Quick Remix Overlay Button */}
                          <button
                            onClick={() => handleRemixLookbook(item)}
                            className="absolute inset-x-2.5 bottom-12 bg-black/75 hover:bg-vermilion-red text-white backdrop-blur-md py-1.5 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5 text-[11px] font-semibold border border-white/20 shadow-md z-10"
                            type="button"
                          >
                            <Sparkles className="w-3 h-3 text-bronze-gold" />
                            <span>Remix Bản Phối Này</span>
                          </button>

                          {/* On-Image Meta Title & Dynasty */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white pointer-events-none">
                            <span className="text-[9px] text-bronze-gold uppercase tracking-wider block font-semibold truncate">
                              {item.era}
                            </span>
                            <h3 className="font-serif text-[13px] font-bold text-paper-cream truncate">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        {/* Card Bottom Bar with Author, Like Count, and Interactive Share Button */}
                        <div className="p-2.5 flex items-center justify-between bg-surface-pure text-xs text-text-warm-gray border-t border-border-bronze-light/40">
                          {/* Author Info */}
                          <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                item.isAnonymous
                                  ? "bg-text-warm-gray/70 text-white"
                                  : "bg-bronze-gold text-white"
                              }`}
                              title={item.isAnonymous ? "Khách Ẩn Danh" : item.author}
                            >
                              {item.authorInitial}
                            </div>
                            <span
                              className="text-[11px] truncate font-medium text-text-charcoal"
                              title={item.author}
                            >
                              {item.author}
                            </span>
                          </div>

                          {/* 2 Nút Hành Động: Tim & Chia sẻ */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Nút Tim (Heart Count & Toggle) */}
                            <button
                              type="button"
                              onClick={() => handleToggleLike(item.id)}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg transition-colors hover:bg-red-50 text-[11px] font-semibold ${
                                isLiked ? "text-vermilion-red font-bold" : "text-text-warm-gray hover:text-vermilion-red"
                              }`}
                              title={isLiked ? "Bỏ thích" : "Thả tim"}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                                  isLiked ? "fill-vermilion-red text-vermilion-red" : ""
                                }`}
                              />
                              <span>{(item.likes || 0).toLocaleString()}</span>
                            </button>

                            {/* Nút Chia sẻ (Share Button) */}
                            <button
                              type="button"
                              onClick={() => handleShareCard(item)}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg hover:bg-bronze-gold/10 text-text-warm-gray hover:text-bronze-gold transition-colors text-[11px] font-semibold group/share"
                              title="Chia sẻ thẻ Lookbook này"
                            >
                              <Share2 className="w-3.5 h-3.5 group-hover/share:scale-110 transition-transform text-bronze-gold" />
                              <span>{item.shares || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

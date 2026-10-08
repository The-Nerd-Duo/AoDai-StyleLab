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
  getLocalLookbooks,
  toggleLocalLike,
  updateLocalLookbookLikes,
  incrementLocalShare,
} from "@/lib/lookbook-storage";
import {
  Sparkles,
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

  // References for deterministic like state & rapid clicking debouncing
  const userLikedIdsRef = useRef<Set<string>>(new Set());
  const baseLikesMapRef = useRef<Map<string, number>>(new Map());
  const debounceTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const initialLikedStatusRef = useRef<Map<string, boolean>>(new Map());
  const recentlyInteractedRef = useRef<Map<string, number>>(new Map());
  const tabIdRef = useRef<string>(`tab-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`);

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
        const set = new Set<string>(JSON.parse(savedLikes));
        userLikedIdsRef.current = set;
        setUserLikedIds(set);
      }
    } catch { }
  }, []);

  // Fetch initial lookbooks from API or local storage (never wipes local cards)
  const fetchLookbooks = useCallback(async () => {
    // 1. First ensure user's liked IDs are read synchronously from localStorage
    let currentLikedIds = userLikedIdsRef.current;
    try {
      const savedLikes = localStorage.getItem("vietphuc_liked_lookbook_ids");
      if (savedLikes) {
        currentLikedIds = new Set(JSON.parse(savedLikes));
        userLikedIdsRef.current = currentLikedIds;
        setUserLikedIds(currentLikedIds);
      }
    } catch {}

    // 2. Immediately hydrate from local storage so cards are visible right on page load
    const localData = getLocalLookbooks();
    if (localData.length > 0) {
      const mappedLocal = localData.map((item) => {
        const isUserLiked = currentLikedIds.has(item.id);
        const rawLikes = item.likes || 0;
        // Unliked cards must strictly start at 0 (clearing legacy auto-1 like)
        const base = isUserLiked ? Math.max(0, rawLikes - 1) : (rawLikes === 1 ? 0 : rawLikes);
        baseLikesMapRef.current.set(item.id, base);
        return {
          ...item,
          likes: base + (isUserLiked ? 1 : 0),
        };
      });
      setItems(mappedLocal);
      setLoading(false);
    }

    // 3. Sync with Cloudflare backend
    try {
      const res = await fetch("/api/lookbook", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          if (json.storage !== "none") {
            setIsLiveConnected(true);
            const serverItems: LookbookItem[] = json.data.filter(
              (i: LookbookItem) =>
                !(i.isAnonymous && i.author === "Khách Ẩn Danh" && i.title === "Bản Phối Di Sản 2026")
            );
            const serverIds = new Set(serverItems.map((i) => i.id));

            serverItems.forEach((item) => {
              const lastInteracted = recentlyInteractedRef.current.get(item.id) || 0;
              if (Date.now() - lastInteracted > 8000 || !baseLikesMapRef.current.has(item.id)) {
                const isUserLiked = currentLikedIds.has(item.id);
                const rawLikes = item.likes || 0;
                const base = isUserLiked ? Math.max(0, rawLikes - 1) : (rawLikes === 1 ? 0 : rawLikes);
                baseLikesMapRef.current.set(item.id, base);
              }
            });

            // Merge server items with any locally created items not yet synced
            const recentLocal = localData.filter(
              (l) =>
                !serverIds.has(l.id) &&
                !(l.isAnonymous && l.author === "Khách Ẩn Danh" && l.title === "Bản Phối Di Sản 2026") &&
                Date.now() - new Date(l.createdAt).getTime() < 30 * 60 * 1000
            );
            const merged = [...recentLocal, ...serverItems].map((item) => {
              const isUserLiked = currentLikedIds.has(item.id);
              const base = baseLikesMapRef.current.get(item.id) ?? (isUserLiked ? 0 : (item.likes === 1 ? 0 : (item.likes || 0)));
              return { ...item, likes: base + (isUserLiked ? 1 : 0) };
            });
            setItems(merged);

            try {
              localStorage.setItem("vietphuc_community_lookbooks", JSON.stringify(merged));
            } catch {}
          } else {
            // Storage is "none" (KV not bound yet on deployment): keep local items intact!
            setIsLiveConnected(false);
            if (localData.length > 0) {
              setItems(localData);
            }
          }
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Fetch lookbooks error, using local fallback:", err);
    }

    if (localData.length > 0) {
      setItems(localData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLookbooks();
  }, [fetchLookbooks]);

  // Real-time synchronization across different devices and tabs (Cloudflare Polling + BroadcastChannel)
  useEffect(() => {
    let isSubscribed = true;

    // Cross-tab immediate BroadcastChannel listener (same device)
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
            // Filter out broadcasts originated by this same tab session
            if (payload.senderId && payload.senderId === tabIdRef.current) {
              return;
            }
            const { id, likes } = payload.data;
            const isUserLiked = userLikedIdsRef.current.has(id);
            const newBase = Math.max(0, likes - (isUserLiked ? 1 : 0));
            baseLikesMapRef.current.set(id, newBase);
            setItems((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, likes: newBase + (isUserLiked ? 1 : 0) } : item
              )
            );
          } else if (payload?.type === "UPDATE_SHARES" && payload.data) {
            if (payload.senderId && payload.senderId === tabIdRef.current) {
              return;
            }
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.data.id ? { ...item, shares: payload.data.shares } : item
              )
            );
          }
        };
      }
    } catch {}

    // Multi-device Cloudflare sync polling (every 4 seconds)
    const pollInterval = setInterval(async () => {
      if (typeof document !== "undefined" && document.hidden) return;

      try {
        const res = await fetch("/api/lookbook", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (isSubscribed && json.success && Array.isArray(json.data)) {
            if (json.storage !== "none") {
              setIsLiveConnected(true);
            }

            setItems((prev) => {
              const filteredData = (json.data || []).filter(
                (i: LookbookItem) =>
                  !(i.isAnonymous && i.author === "Khách Ẩn Danh" && i.title === "Bản Phối Di Sản 2026")
              );

              // 1. If server returned empty array: NEVER wipe out items that exist locally!
              if (filteredData.length === 0) {
                return prev.filter(
                  (i) => !(i.isAnonymous && i.author === "Khách Ẩn Danh" && i.title === "Bản Phối Di Sản 2026")
                );
              }

              // 2. Identify newly received items from other devices
              const prevIds = new Set(prev.map((i) => i.id));
              const newlyReceived = filteredData.filter((i: LookbookItem) => !prevIds.has(i.id));

              if (newlyReceived.length > 0) {
                newlyReceived.forEach((newCard: LookbookItem) => {
                  showToast(`🔔 ${newCard.author} vừa chia sẻ: "${newCard.title}"!`);
                });
                setNewlyAddedIds((old) => {
                  const next = new Set(old);
                  newlyReceived.forEach((i: LookbookItem) => next.add(i.id));
                  return next;
                });
                setTimeout(() => {
                  setNewlyAddedIds((old) => {
                    const next = new Set(old);
                    newlyReceived.forEach((i: LookbookItem) => next.delete(i.id));
                    return next;
                  });
                }, 8000);
              }

              // 3. Map server items while preserving local user interaction state
              const prevMap = new Map(prev.map((p) => [p.id, p]));
              const safeFilteredData = filteredData.map((serverItem: LookbookItem) => {
                const prevItem = prevMap.get(serverItem.id);
                const lastInteracted = recentlyInteractedRef.current.get(serverItem.id) || 0;
                // If user interacted recently with this card, preserve local like count
                if (Date.now() - lastInteracted < 8000 && prevItem) {
                  return { ...serverItem, likes: prevItem.likes };
                }
                const isUserLiked = userLikedIdsRef.current.has(serverItem.id);
                const serverLikes = serverItem.likes || 0;
                const newBase = isUserLiked
                  ? Math.max(0, serverLikes - 1)
                  : (serverLikes === 1 ? 0 : serverLikes);
                baseLikesMapRef.current.set(serverItem.id, newBase);
                return {
                  ...serverItem,
                  likes: newBase + (isUserLiked ? 1 : 0),
                };
              });

              // 4. Merge: keep any local cards not yet indexed on server
              const serverIdSet = new Set(filteredData.map((i: LookbookItem) => i.id));
              const localPending = prev.filter(
                (p) =>
                  !serverIdSet.has(p.id) &&
                  !(p.isAnonymous && p.author === "Khách Ẩn Danh" && p.title === "Bản Phối Di Sản 2026")
              );
              const merged = [...localPending, ...safeFilteredData];

              try {
                localStorage.setItem("vietphuc_community_lookbooks", JSON.stringify(merged));
              } catch {}

              return merged;
            });
          }
        }
      } catch {
        // network issue
      }
    }, 4000);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
      if (broadcastChannel) broadcastChannel.close();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      debounceTimersRef.current.forEach((t) => clearTimeout(t));
      debounceTimersRef.current.clear();
    };
  }, [showToast]);

  // Handle Heart / Like Toggle - Deterministic baseline & rapid-click debounced
  const handleToggleLike = useCallback((id: string) => {
    // 1. Immediately toggle synchronous status in Ref
    const wasLiked = userLikedIdsRef.current.has(id);
    const willBeLiked = !wasLiked;

    if (willBeLiked) {
      userLikedIdsRef.current.add(id);
    } else {
      userLikedIdsRef.current.delete(id);
    }

    // 2. Synchronously persist user's liked set to localStorage
    try {
      localStorage.setItem(
        "vietphuc_liked_lookbook_ids",
        JSON.stringify(Array.from(userLikedIdsRef.current))
      );
    } catch {}

    // 3. Immediately update UI state (instant icon color & state switch)
    setUserLikedIds(new Set(userLikedIdsRef.current));

    // 4. Calculate deterministic like count from baseline
    let base = baseLikesMapRef.current.get(id);
    if (base === undefined) {
      const currentItem = items.find((i) => i.id === id);
      const rawLikes = currentItem?.likes ?? 0;
      base = wasLiked ? Math.max(0, rawLikes - 1) : (rawLikes === 1 ? 0 : rawLikes);
      baseLikesMapRef.current.set(id, base);
    }
    const computedLikes = base + (willBeLiked ? 1 : 0);

    // Update items state with exact computedLikes
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: computedLikes } : item))
    );

    // Mark interaction timestamp to protect from polling overwrites
    recentlyInteractedRef.current.set(id, Date.now());

    // Record initial status at start of rapid click burst
    if (!initialLikedStatusRef.current.has(id)) {
      initialLikedStatusRef.current.set(id, wasLiked);
    }

    // Clear previous debounce timer for this id
    const existingTimer = debounceTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Debounce network and storage sync (350ms)
    const timer = setTimeout(async () => {
      debounceTimersRef.current.delete(id);
      const initialLiked = initialLikedStatusRef.current.get(id);
      initialLikedStatusRef.current.delete(id);

      const finalIsLiked = userLikedIdsRef.current.has(id);
      const currentBase = baseLikesMapRef.current.get(id) ?? 0;
      const finalLikes = currentBase + (finalIsLiked ? 1 : 0);

      // Only perform backend/storage sync if the state actually changed after the rapid clicks!
      if (initialLiked !== undefined && finalIsLiked !== initialLiked) {
        const action = finalIsLiked ? "like" : "unlike";

        // Update local storage lookbook collection
        updateLocalLookbookLikes(id, finalLikes);

        // Broadcast to other tabs
        try {
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const bc = new BroadcastChannel("vietphuc_lookbook_channel");
            bc.postMessage({
              type: "UPDATE_LIKES",
              data: { id, likes: finalLikes },
              senderId: tabIdRef.current,
            });
            bc.close();
          }
        } catch {}

        // Send single network request
        try {
          const res = await fetch(`/api/lookbook/${id}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
          });
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.success && data?.data?.likes !== undefined) {
              const serverLikes = data.data.likes;
              const newBase = Math.max(0, serverLikes - (finalIsLiked ? 1 : 0));
              baseLikesMapRef.current.set(id, newBase);
              setItems((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, likes: newBase + (userLikedIdsRef.current.has(id) ? 1 : 0) } : item
                )
              );
            }
          }
        } catch {}
      }
    }, 350);

    debounceTimersRef.current.set(id, timer);
  }, [items]);

  // Handle Share Lookbook Card
  const handleShareCard = async (item: LookbookItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    let shareUrl = `${origin}/share?id=${item.id}`;

    if (item.outfit) {
      const query = encodeOutfitToQuery(item.outfit, item.frameId, item.img, item.id);
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
          senderId: tabIdRef.current,
        });
        bc.close();
      }
    } catch { }

    // Sync share count to local storage
    incrementLocalShare(item.id);

    // Send to backend API if available
    try {
      fetch(`/api/lookbook/${item.id}/share`, {
        method: "POST",
      }).catch(() => { });
    } catch { }
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
    if (activeCategory === "favorites") {
      return userLikedIds.has(item.id);
    }
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  // Calculate category item counts
  const categoryCounts = {
    all: items.length,
    favorites: items.filter((i) => userLikedIds.has(i.id)).length,
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
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-text-charcoal tracking-tight flex items-center gap-2">
                  <span>Bộ sưu tập Lookbook Di sản 9:16</span>
                </h1>
              <p className="text-xs text-text-warm-gray mt-0.5">
                Tạo thẻ định danh di sản của bạn hoặc khám phá và tương tác cùng cộng đồng
              </p>
            </div>

            {/* Live Status Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-pure border border-border-bronze-light/60 px-3 py-1.5 rounded-xl shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${isLiveConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
                  }`}
              />
              <span className="text-[11px] font-medium text-text-charcoal">
                {isLiveConnected ? "Đồng bộ trực tiếp" : "Đang kết nối live..."}
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
              <LookbookCard
                outfit={outfit}
                frameId={selectedFrame}
                imageUrl={resultImage}
                onShareSuccess={(newCard) => {
                  setActiveCategory("all");
                  const cardWithZeroLikes = { ...newCard, likes: 0 };
                  baseLikesMapRef.current.set(newCard.id, 0);
                  setItems((prev) => {
                    const clean = [cardWithZeroLikes, ...prev.filter((item) => item.id !== newCard.id)];
                    try {
                      localStorage.setItem("vietphuc_community_lookbooks", JSON.stringify(clean));
                    } catch {}
                    return clean;
                  });
                  setNewlyAddedIds((prev) => {
                    const next = new Set(prev);
                    next.add(newCard.id);
                    return next;
                  });
                  showToast(`✨ Đã chia sẻ "${newCard.title}" lên Thư viện Cộng đồng!`);
                  setTimeout(() => {
                    setNewlyAddedIds((prev) => {
                      const updated = new Set(prev);
                      updated.delete(newCard.id);
                      return updated;
                    });
                  }, 8000);
                }}
              />

              {/* Dynamic Frame Selector */}
              <FrameSelector
                selectedFrameId={selectedFrame}
                onSelectFrame={setSelectedFrame}
              />
            </div>

            {/* Right Column (7 cols): Community Lookbook Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-bronze-gold/15 flex items-center justify-center text-bronze-gold flex-shrink-0">
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

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-nowrap">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${activeCategory === "all"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                    }`}
                >
                  Tất cả ({categoryCounts.all})
                </button>
                <button
                  onClick={() => setActiveCategory("favorites")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all flex items-center gap-1.5 ${activeCategory === "favorites"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                    }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${activeCategory === "favorites" ? "fill-white text-white" : "fill-vermilion-red/20 text-vermilion-red"}`} />
                  <span>Ưa thích ({categoryCounts.favorites})</span>
                </button>
                <button
                  onClick={() => setActiveCategory("pho-co")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${activeCategory === "pho-co"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                    }`}
                >
                  🏮 Đêm Phố Cổ ({categoryCounts["pho-co"]})
                </button>
                <button
                  onClick={() => setActiveCategory("cung-dinh")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${activeCategory === "cung-dinh"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                    }`}
                >
                  👑 Cung Đình ({categoryCounts["cung-dinh"]})
                </button>
                <button
                  onClick={() => setActiveCategory("y2k")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${activeCategory === "y2k"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "bg-surface-pure hover:bg-paper-cream text-text-warm-gray border border-border-bronze-light/50"
                    }`}
                >
                  ⚡ Gen Z Y2K ({categoryCounts.y2k})
                </button>
                <button
                  onClick={() => setActiveCategory("da-tiec")}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs transition-all ${activeCategory === "da-tiec"
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
                    {activeCategory === "favorites" ? (
                      <Heart className="w-7 h-7 text-vermilion-red fill-vermilion-red/20" />
                    ) : (
                      <Sparkles className="w-7 h-7 text-bronze-gold" />
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-base text-text-charcoal">
                    {activeCategory === "favorites"
                      ? "Chưa có Lookbook nào trong mục Ưa thích"
                      : items.length === 0
                      ? "Chưa có thẻ Lookbook nào trong Thư viện Cộng đồng"
                      : "Chưa có Lookbook nào trong chủ đề này"}
                  </h3>
                  <p className="text-xs text-text-warm-gray max-w-md leading-relaxed">
                    {activeCategory === "favorites"
                      ? "Hãy thả tim các bản phối bạn yêu thích trong thư viện cộng đồng để lưu vào danh sách ưa thích nhé!"
                      : items.length === 0
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
                        className={`bg-surface-pure rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group border relative ${isNewlyAdded
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

                          {/* Nút Tim (Floating Save Heart Button) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLike(item.id);
                            }}
                            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md z-10 active:scale-90 ${isLiked
                                ? "bg-vermilion-red text-white scale-105 ring-2 ring-white/50"
                                : "bg-text-charcoal/70 hover:bg-vermilion-red text-white"
                              }`}
                            type="button"
                            title={isLiked ? "Bỏ thích" : "Thả tim Lookbook"}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${isLiked ? "fill-white text-white" : "text-white"
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
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${item.isAnonymous
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
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg transition-colors hover:bg-red-50 text-[11px] font-semibold ${isLiked ? "text-vermilion-red font-bold" : "text-text-warm-gray hover:text-vermilion-red"
                                }`}
                              title={isLiked ? "Bỏ thích" : "Thả tim"}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${isLiked ? "fill-vermilion-red text-vermilion-red" : ""
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

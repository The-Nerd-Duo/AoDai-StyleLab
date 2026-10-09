"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export const LookbookSkeleton: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Page Header Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="h-7 w-64 bg-border-bronze-light/35 rounded-lg animate-pulse" />
          <div className="h-8 w-28 bg-surface-pure border border-border-bronze-light/50 rounded-xl animate-pulse self-start sm:self-auto" />
        </div>
      </div>

      {/* Workspace: 2-Column Split */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols, sticky): Lookbook Card Editor Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
            <div className="h-5 w-36 bg-border-bronze-light/30 rounded-lg animate-pulse" />
            <div className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-3xl bg-[#0D0C0B]/90 border border-bronze-gold/30 shadow-2xl flex flex-col items-center justify-center p-6 text-center animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-bronze-gold/40 flex items-center justify-center text-bronze-gold mb-3">
                <Sparkles className="w-6 h-6 text-bronze-gold/80" />
              </div>
              <div className="h-4 w-40 bg-white/20 rounded-md mb-2" />
              <div className="h-3 w-28 bg-white/10 rounded-md" />
            </div>
          </div>

          {/* Right Column (7 cols): Community Gallery Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Banner Skeleton */}
            <div className="bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-paper-cream border border-bronze-gold/30 flex items-center justify-center text-bronze-gold flex-shrink-0">
                <span className="material-symbols-outlined text-[20px] text-bronze-gold">explore</span>
              </div>
              <div className="flex-1">
                <div className="h-4.5 w-56 bg-border-bronze-light/40 rounded mb-1.5 animate-pulse" />
                <div className="h-3 w-72 bg-border-bronze-light/25 rounded animate-pulse" />
              </div>
            </div>

            {/* Category Filter Pills Skeleton */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[80, 70, 75, 90, 85, 80].map((width, idx) => (
                <div
                  key={idx}
                  style={{ width }}
                  className="h-8 bg-surface-pure rounded-full border border-border-bronze-light/40 animate-pulse flex-shrink-0"
                />
              ))}
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-surface-pure rounded-xl overflow-hidden shadow-xs border border-border-bronze-light/40 animate-pulse aspect-[9/14]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

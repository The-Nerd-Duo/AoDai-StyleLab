"use client";

import React from "react";

export const StudioSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left column skeleton */}
        <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
          <div className="w-full min-h-[580px] rounded-2xl bg-surface-pure/90 p-4 border border-border-bronze-light/60 shadow-sm flex flex-col gap-4 animate-pulse">
            <div className="h-6 w-44 bg-border-bronze-light/30 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-8 flex-1 bg-border-bronze-light/25 rounded-lg" />
              <div className="h-8 flex-1 bg-border-bronze-light/25 rounded-lg" />
              <div className="h-8 flex-1 bg-border-bronze-light/25 rounded-lg" />
            </div>
            <div className="flex-1 rounded-xl bg-paper-cream/60 border border-border-bronze-light/40" />
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="lg:col-span-8 flex flex-col gap-5 order-1 lg:order-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Preview workspace skeleton */}
            <div className="md:col-span-7 flex flex-col">
              <div className="w-full min-h-[520px] rounded-2xl bg-surface-pure/90 p-4 border border-border-bronze-light/60 shadow-sm flex flex-col gap-3.5 animate-pulse">
                <div className="h-6 w-40 bg-border-bronze-light/30 rounded-lg" />
                <div className="flex-1 rounded-xl bg-[#121110]/80 border border-border-bronze-light/40" />
                <div className="h-10 w-full bg-vermilion-red/20 rounded-xl" />
              </div>
            </div>

            {/* Lookbook card skeleton */}
            <div className="md:col-span-5 flex flex-col">
              <div className="w-full min-h-[520px] rounded-2xl bg-surface-pure/90 p-4 border border-border-bronze-light/60 shadow-sm flex flex-col gap-3.5 animate-pulse">
                <div className="h-6 w-36 bg-border-bronze-light/30 rounded-lg" />
                <div className="flex-1 rounded-2xl bg-[#0D0C0B]/90 border border-bronze-gold/30" />
              </div>
            </div>
          </div>

          {/* Cultural advisor skeleton */}
          <div className="w-full min-h-[140px] rounded-2xl bg-surface-pure/90 p-4 border border-border-bronze-light/60 shadow-sm flex flex-col gap-3 animate-pulse">
            <div className="h-5 w-48 bg-border-bronze-light/30 rounded-lg" />
            <div className="h-12 w-full bg-paper-cream/60 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

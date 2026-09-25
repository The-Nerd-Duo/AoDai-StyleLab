"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Layers } from "lucide-react";

interface HeaderProps {
  onOpenCompare?: () => void;
  hasCompareOutfit?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCompare, hasCompareOutfit }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-heritage-dark/85 border-b border-heritage-dark-border px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-heritage-red to-heritage-gold flex items-center justify-center shadow-lg shadow-heritage-red/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-serif font-bold text-xl tracking-wider">VP</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-heritage-gold transition-colors">
                Việt Phục Remix
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              AI Arena Vietnam 2026 • Di Sản Việt Trong Hơi Thở Gen Z
            </p>
          </div>
        </Link>

        {/* Actions & Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenCompare && (
            <button
              onClick={onOpenCompare}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                hasCompareOutfit
                  ? "bg-heritage-gold text-heritage-dark font-semibold shadow-md shadow-heritage-gold/20 hover:bg-heritage-gold-light"
                  : "bg-heritage-dark-card border border-heritage-dark-border text-gray-300 hover:text-white hover:border-gray-600"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>So sánh A/B</span>
              {hasCompareOutfit && (
                <span className="w-2 h-2 rounded-full bg-heritage-red absolute -top-1 -right-1 animate-ping" />
              )}
            </button>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-red/10 border border-heritage-red/30 text-heritage-red-light text-xs font-medium">
            <Sparkles className="w-3 h-3 text-heritage-gold" />
            <span>VNU x Google AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

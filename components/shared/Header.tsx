"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenCompare?: () => void;
  hasCompareOutfit?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCompare, hasCompareOutfit }) => {
  const pathname = usePathname();

  const handleStartTour = () => {
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("vietphuc_open_tour"));
    } else {
      window.location.href = "/?tour=1";
    }
  };

  const navItems = [
    {
      href: "/",
      label: "Studio Phối đồ",
      icon: "tune",
      isActive: pathname === "/",
    },
    {
      href: "/lookbook",
      label: "Bộ sưu tập Lookbook",
      icon: "photo_library",
      isActive: pathname === "/lookbook",
    },
    {
      href: "/bach-khoa",
      label: "Bách khoa Di sản",
      icon: "menu_book",
      isActive: pathname === "/bach-khoa",
    },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-border-bronze-light/50 shadow-[0_2px_12px_rgba(26,26,26,0.05)]">
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
        {/* Brand & Responsible AI Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif font-extrabold text-2xl sm:text-[26px] text-vermilion-red tracking-tight leading-none group-hover:opacity-90 transition-opacity">
              AoDai StyleLab
            </span>
          </Link>
        </div>

        {/* Pill Segmented Switcher / Floating Capsule Bar */}
        <nav id="header-nav" aria-label="Main Navigation" className="hidden md:flex items-center bg-[#F2EDE7]/90 p-1 rounded-full border border-border-bronze-light/60 shadow-inner gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full font-sans text-[13px] leading-tight flex items-center gap-1.5 transition-all ${
                item.isActive
                  ? "bg-vermilion-red text-white font-semibold shadow-sm"
                  : "text-stone-700 hover:text-text-charcoal hover:bg-surface-pure/80 font-medium"
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${item.isActive ? "text-white" : "text-stone-500"}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Corner: Hướng Dẫn (Feature Tour Trigger) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartTour}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-vermilion-red bg-vermilion-red/10 hover:bg-vermilion-red hover:text-white border border-vermilion-red/25 transition-all shadow-2xs group active:scale-95 cursor-pointer"
            title="Khám phá hướng dẫn sử dụng (Feature Tour)"
            aria-label="Khám phá hướng dẫn sử dụng"
          >
            <Sparkles className="w-3.5 h-3.5 text-vermilion-red group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">Hướng dẫn</span>
            <span className="sm:hidden text-[11px]">Tour</span>
          </button>
        </div>
      </div>
    </header>
  );
};

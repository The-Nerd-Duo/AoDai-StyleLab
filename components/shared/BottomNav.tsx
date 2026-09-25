"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Image as ImageIcon, BookOpen } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Studio Phối Đồ",
      sublabel: "AI Cố Vấn",
      icon: Palette,
      isActive: pathname === "/",
    },
    {
      href: "/lookbook",
      label: "Tạo Lookbook",
      sublabel: "Thẻ 9:16 & Share",
      icon: ImageIcon,
      isActive: pathname === "/lookbook",
    },
    {
      href: "/wiki",
      label: "Bách Khoa",
      sublabel: "Di Sản & Gemini",
      icon: BookOpen,
      isActive: pathname === "/wiki",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-heritage-dark/95 backdrop-blur-lg border-t border-heritage-dark-border px-4 py-2 sm:py-2.5">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                item.isActive
                  ? "bg-gradient-to-b from-heritage-gold/15 to-transparent text-heritage-gold font-medium border border-heritage-gold/30 shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-transform ${item.isActive ? "scale-110 text-heritage-gold" : ""}`} />
              <span className="text-[11px] leading-tight text-center font-medium">
                {item.label}
              </span>
              <span className="text-[9px] text-gray-500 hidden sm:block">
                {item.sublabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

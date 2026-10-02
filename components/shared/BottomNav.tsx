"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Studio Phối đồ",
      icon: "tune",
      isActive: pathname === "/",
    },
    {
      href: "/lookbook",
      label: "Bộ sưu tập",
      icon: "photo_library",
      isActive: pathname === "/lookbook",
    },
    {
      href: "/bach-khoa",
      label: "Bách khoa",
      icon: "menu_book",
      isActive: pathname === "/bach-khoa",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FDFBF7]/95 backdrop-blur-md border-t border-border-bronze-light/50 px-4 py-1.5 shadow-[0_-2px_10px_rgba(26,26,26,0.05)]">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
              item.isActive
                ? "bg-vermilion-red/10 text-vermilion-red font-semibold"
                : "text-text-warm-gray hover:text-text-charcoal hover:bg-black/5"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-transform ${
                item.isActive ? "scale-110 text-vermilion-red font-bold" : "text-text-warm-gray"
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] leading-tight text-center mt-0.5">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

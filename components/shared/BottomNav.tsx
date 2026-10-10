"use client";

import React, { useState, useRef, useEffect } from "react";
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

  const [targetPath, setTargetPath] = useState<string | null>(null);
  const activePath = targetPath ?? pathname;

  const [sliderStyle, setSliderStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  useEffect(() => {
    setTargetPath(null);
  }, [pathname]);

  useEffect(() => {
    const activeEl = tabRefs.current[activePath];
    if (activeEl) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
      });
    }
  }, [activePath]);

  useEffect(() => {
    const handleResize = () => {
      const activeEl = tabRefs.current[activePath];
      if (activeEl) {
        setSliderStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activePath]);

  const handleTabClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    if (el) {
      setSliderStyle({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
      setTargetPath(href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FDFBF7]/95 backdrop-blur-md border-t border-border-bronze-light/50 px-4 py-1.5 shadow-[0_-2px_10px_rgba(26,26,26,0.05)]">
      <div className="relative max-w-md mx-auto grid grid-cols-3 gap-1">
        {/* Sliding red pill for mobile bottom nav */}
        {sliderStyle && (
          <div
            className="absolute rounded-xl bg-vermilion-red/15 border border-vermilion-red/30 transition-all duration-[460ms] ease-[cubic-bezier(0.25,0.85,0.35,1)] pointer-events-none z-0"
            style={{
              transform: `translate3d(${sliderStyle.left}px, ${sliderStyle.top}px, 0)`,
              width: `${sliderStyle.width}px`,
              height: `${sliderStyle.height}px`,
              left: 0,
              top: 0,
            }}
          />
        )}

        {navItems.map((item) => {
          const isTabActive = item.href === activePath;
          return (
            <Link
              key={item.href}
              ref={(el) => {
                tabRefs.current[item.href] = el;
              }}
              href={item.href}
              onClick={(e) => handleTabClick(item.href, e)}
              className={`relative z-10 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-300 cursor-pointer active:scale-90 ${
                isTabActive
                  ? "text-vermilion-red font-semibold"
                  : "text-text-warm-gray hover:text-text-charcoal hover:bg-black/5"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isTabActive ? "scale-110 text-vermilion-red font-bold" : "text-text-warm-gray"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] leading-tight text-center mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

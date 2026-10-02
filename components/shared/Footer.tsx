"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-pure border-t border-border-bronze-light/50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-text-warm-gray text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-vermilion-red tracking-tight font-serif text-base">
            AoDai StyleLab
          </span>
          <span className="text-text-warm-gray">
            • AI Arena Vietnam 2026 (VNU &amp; Google)
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-xs text-text-warm-gray">
            &copy; 2026 VNU &amp; Google. Không gian sáng tạo Cyber-Heritage • Bảo tồn văn hóa dân tộc.
          </span>
        </div>
      </div>
    </footer>
  );
};

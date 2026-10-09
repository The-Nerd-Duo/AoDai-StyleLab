"use client";

import React from "react";

interface FrameDecorationProps {
  theme?: string;
  borderColor?: string;
  accentColor?: string;
  frameId?: string;
  image?: string | null;
}

export const FRAME_IMAGE_MAP: Record<string, string> = {
  // Direct file / frame names
  "khung_hoang_kim": "/frames/khung_hoang_kim.png",
  "khung_tap_chi_thoi_trang": "/frames/khung_tap_chi_thoi_trang.png",
  "khung_cyber": "/frames/khung_cyber.png",
  "khung_indochine": "/frames/khung_indochine.png",
  "khung_vintage": "/frames/khung_indochine.png",
  "khung_son_mai": "/frames/khung_son_mai.png",

  // Theme & ID mappings
  "hoang_kim": "/frames/khung_hoang_kim.png",
  "royal": "/frames/khung_hoang_kim.png",
  "frame-heritage-vermilion": "/frames/khung_hoang_kim.png",

  "tap_chi_thoi_trang": "/frames/khung_tap_chi_thoi_trang.png",
  "editorial": "/frames/khung_tap_chi_thoi_trang.png",
  "frame-minimal-gold": "/frames/khung_tap_chi_thoi_trang.png",

  "cyber": "/frames/khung_cyber.png",
  "cyber-indochine": "/frames/khung_cyber.png",
  "frame-cyber-indochine": "/frames/khung_cyber.png",

  "indochine": "/frames/khung_indochine.png",
  "vintage": "/frames/khung_indochine.png",
  "vintage-stamp": "/frames/khung_indochine.png",
  "frame-vintage-stamp": "/frames/khung_indochine.png",
  "frame-indochine": "/frames/khung_indochine.png",

  "son_mai": "/frames/khung_son_mai.png",
  "curator": "/frames/khung_son_mai.png",
  "museum-curator": "/frames/khung_son_mai.png",
  "frame-museum-curator": "/frames/khung_son_mai.png",
};

export const FrameDecoration: React.FC<FrameDecorationProps> = ({
  theme,
  borderColor,
  accentColor,
  frameId,
  image,
}) => {
  if (theme === "none" || frameId === "frame-default-none" || (!theme && !frameId && !image)) {
    return null;
  }

  const resolvedSrc =
    image ||
    (frameId ? FRAME_IMAGE_MAP[frameId] : undefined) ||
    (theme ? FRAME_IMAGE_MAP[theme] : undefined);

  if (!resolvedSrc) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none overflow-hidden">
      <img
        src={resolvedSrc}
        alt="Khung trang trí"
        className="w-full h-full object-fill pointer-events-none select-none"
        style={{
          imageRendering: "auto",
        }}
      />
    </div>
  );
};

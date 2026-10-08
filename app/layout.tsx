import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/shared/BottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "AoDai StyleLab • Không Gian Sáng Tạo Cyber-Heritage",
  description:
    "Ứng dụng phối trang phục truyền thống Việt Nam (Áo dài, Áo ngũ thân, Áo tấc...) theo phong cách Gen Z đương đại với AI Cố vấn văn hóa và Lookbook thời trang.",
  keywords: [
    "Việt phục",
    "Áo dài",
    "Áo ngũ thân",
    "Áo tấc",
    "Gen Z thời trang",
    "AI Arena Vietnam 2026",
    "Google AI Studio",
    "Gemini 2.0",
    "Di sản văn hóa Việt",
    "AoDai StyleLab",
  ],
  authors: [{ name: "The Nerd Duo", url: "https://github.com/The-Nerd-Duo/AoDai-StyleLab" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F5F0] text-text-charcoal font-sans">
        <main className="flex-1 pb-16 md:pb-0 flex flex-col">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

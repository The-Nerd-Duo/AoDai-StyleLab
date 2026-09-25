import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/shared/BottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Việt Phục Remix • AI Arena Vietnam 2026",
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
  ],
  authors: [{ name: "The Nerd Duo", url: "https://github.com/The-Nerd-Duo/AoDai-StyleLab" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen flex flex-col bg-heritage-dark text-slate-100 font-sans selection:bg-heritage-gold/30 selection:text-white">
        <main className="flex-1 pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

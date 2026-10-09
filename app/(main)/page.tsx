"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { StudioSkeleton } from "@/components/studio/StudioSkeleton";

const StudioDashboard = dynamic(
  () => import("@/components/studio/StudioDashboard").then((mod) => mod.StudioDashboard),
  {
    ssr: false,
    loading: () => <StudioSkeleton />,
  }
);

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <Header />
      <StudioDashboard />
      <Footer />
    </div>
  );
}

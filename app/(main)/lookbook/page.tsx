"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Footer } from "@/components/shared/Footer";
import { LookbookSkeleton } from "@/components/lookbook/LookbookSkeleton";

const LookbookWorkspace = dynamic(
  () => import("@/components/lookbook/LookbookWorkspace").then((mod) => mod.LookbookWorkspace),
  {
    ssr: false,
    loading: () => <LookbookSkeleton />,
  }
);

export default function LookbookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <LookbookWorkspace />
      <Footer />
    </div>
  );
}

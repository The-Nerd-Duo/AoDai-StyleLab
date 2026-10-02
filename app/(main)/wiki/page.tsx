"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WikiRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bach-khoa");
  }, [router]);

  return (
    <div className="p-8 text-center text-text-warm-gray text-xs">
      Đang chuyển hướng đến Bách khoa Di sản...
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export function useQrCode(text: string): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!text) {
      setDataUrl(null);
      return;
    }

    QRCode.toDataURL(text, {
      margin: 1,
      width: 320,
      color: {
        dark: "#0F0F0F",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.warn("QR code generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [text]);

  return dataUrl;
}

"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export function useQrCode(text: string): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!text || !text.trim()) {
      setDataUrl(null);
      return;
    }

    QRCode.toDataURL(text, {
      margin: 2,
      width: 400,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
        }
      })
      .catch((err) => {
        console.warn("QR Code generation error:", err);
        if (isMounted) {
          setDataUrl(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [text]);

  return dataUrl;
}

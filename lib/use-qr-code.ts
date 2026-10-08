"use client";

import { useState, useEffect } from "react";
import { QrCodeGenerator } from "./qr-generator";

export function useQrCode(text: string): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!text) {
      setDataUrl(null);
      return;
    }

    try {
      const qr = QrCodeGenerator.QrCode.encodeText(text, QrCodeGenerator.Ecc.MEDIUM);
      const url = qr.toDataUrl(2, "#0F0F0F", "#FFFFFF");
      if (isMounted) {
        setDataUrl(url);
      }
    } catch (err) {
      console.warn("QR code generation error:", err);
      if (isMounted) {
        setDataUrl(null);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [text]);

  return dataUrl;
}

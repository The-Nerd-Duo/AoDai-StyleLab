"use client";

import React, { useRef } from "react";
import mockupsData from "@/config/mockups.json";
import { User, Upload, Check } from "lucide-react";

interface PersonaSelectorProps {
  selectedPersonaId: string;
  onSelectPersona: (id: string) => void;
  customAvatarUrl?: string | null;
  onUploadCustomAvatar?: (dataUrl: string) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersonaId,
  onSelectPersona,
  customAvatarUrl,
  onUploadCustomAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadCustomAvatar) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onUploadCustomAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-surface-pure rounded-2xl p-4 shadow-sm border border-border-bronze-light/60">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-vermilion-red" />
          <h3 className="text-sm font-bold text-text-charcoal font-serif">
            Nhân Vật Đại Diện (Persona)
          </h3>
        </div>
        <span className="text-[11px] text-text-warm-gray font-mono">Gen Z Avatar</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {mockupsData.personas.map((persona) => {
          const isSelected = selectedPersonaId === persona.id && !customAvatarUrl;
          return (
            <button
              key={persona.id}
              onClick={() => {
                if (onUploadCustomAvatar) onUploadCustomAvatar("");
                onSelectPersona(persona.id);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-gradient-to-r from-paper-cream to-surface-pure border-2 border-vermilion-red shadow-xs ring-1 ring-vermilion-red/30"
                  : "bg-paper-cream border-border-bronze-light/50 hover:bg-surface-container text-text-charcoal"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold text-text-charcoal">
                  {persona.name.split("-")[0].trim()}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-vermilion-red text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-warm-gray line-clamp-1">
                {persona.vibe}
              </p>
            </button>
          );
        })}
      </div>

      {/* Upload Custom User Avatar */}
      <div className="mt-3 pt-3 border-t border-border-bronze-light/40 flex items-center justify-between">
        <div className="text-[11px] text-text-warm-gray flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-bronze-gold" />
          <span>Hoặc tải ảnh khuôn mặt cá nhân để thử phối đồ:</span>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors shadow-xs ${
            customAvatarUrl
              ? "bg-guardrail-pass-surface border-guardrail-pass/40 text-guardrail-pass"
              : "border-border-bronze-light/60 bg-paper-cream text-text-charcoal hover:bg-surface-container"
          }`}
        >
          {customAvatarUrl ? "✓ Đã tải ảnh riêng" : "Tải ảnh lên"}
        </button>
      </div>
    </div>
  );
};

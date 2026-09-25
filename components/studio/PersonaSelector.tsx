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
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-heritage-gold" />
          <h3 className="text-sm font-semibold text-white">Nhân Vật Đại Diện (Persona)</h3>
        </div>
        <span className="text-[11px] text-gray-400">Gen Z Avatar</span>
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
                  ? "bg-heritage-gold/10 border-heritage-gold shadow-sm shadow-heritage-gold/20"
                  : "bg-heritage-dark-hover/50 border-heritage-dark-border hover:border-gray-600 text-gray-300"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-white">
                  {persona.name.split("-")[0].trim()}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-heritage-gold text-heritage-dark flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-1">
                {persona.vibe}
              </p>
            </button>
          );
        })}
      </div>

      {/* Upload Custom User Avatar (Requirement Bonus: "Tải ảnh hoặc chọn nhân vật đại diện để thử phối đồ") */}
      <div className="mt-3 pt-3 border-t border-heritage-dark-border/60 flex items-center justify-between">
        <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-gray-400" />
          <span>Hoặc tải ảnh khuôn mặt cá nhân:</span>
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
          className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
            customAvatarUrl
              ? "bg-heritage-jade/30 border-heritage-jade-light text-teal-300"
              : "border-heritage-dark-border bg-heritage-dark text-gray-300 hover:text-white hover:border-gray-500"
          }`}
        >
          {customAvatarUrl ? "✓ Đã tải ảnh riêng" : "Tải ảnh lên"}
        </button>
      </div>
    </div>
  );
};

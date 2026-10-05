"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { answerHeritageQuestion } from "@/lib/assistant-engine";
import { FormattedMarkdown } from "@/components/shared/FormattedMarkdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const GeminiChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là Trợ lý AI Bách Khoa Việt Phục. Bạn có bất kỳ thắc mắc nào về lịch sử Áo Ngũ Thân, Áo Dài, Áo Tấc, các triều đại hoặc cách phối đồ Gen Z sao cho chuẩn mực văn hóa không?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "Ý nghĩa của 5 thân và 5 cúc trên Áo Ngũ Thân?",
    "Áo Tấc khác Áo Ngũ Thân tay chẽn ở điểm nào?",
    "Gen Z phối áo dài với sneaker trắng có được không?",
    "Nguồn gốc tên gọi của Áo Nhật Bình?",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/cultural-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer || "Đã xảy ra lỗi khi tìm câu trả lời." },
        ]);
        setLoading(false);
        return;
      }
    } catch {
      // API unavailable, use knowledge vault fallback below
    }

    const localAnswer = answerHeritageQuestion(text);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: localAnswer.answer },
    ]);
    setLoading(false);
  };

  return (
    <div className="bg-heritage-dark-card border border-heritage-dark-border rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Hỏi Đáp Cùng Trợ Lý Gemini AI
            </h2>
            <span className="text-[10px] text-gray-400">
              Chuyên gia Di Sản & Triều Điển Việt Nam
            </span>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-heritage-dark border border-heritage-dark-border hover:border-heritage-gold/50 text-gray-300 hover:text-white transition-all whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="h-64 sm:h-72 overflow-y-auto space-y-3 p-3 rounded-xl bg-heritage-dark/70 border border-heritage-dark-border">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-heritage-gold/20 border border-heritage-gold/40 flex-shrink-0 flex items-center justify-center text-heritage-gold">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-heritage-red text-white"
                  : "bg-heritage-dark-card border border-heritage-dark-border text-gray-200"
              }`}
            >
              {m.role === "assistant" ? (
                <FormattedMarkdown content={m.content} />
              ) : (
                m.content
              )}
            </div>

            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-gray-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-gray-400">
            <div className="w-7 h-7 rounded-full bg-heritage-gold/20 flex items-center justify-center text-heritage-gold">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>Gemini đang tra cứu sử liệu di sản...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Đặt câu hỏi về trang phục, cách mặc, phối đồ di sản..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-heritage-dark border border-heritage-dark-border focus:border-heritage-gold text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-heritage-gold hover:bg-heritage-gold-light disabled:opacity-50 text-heritage-dark font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gửi</span>
        </button>
      </form>
    </div>
  );
};

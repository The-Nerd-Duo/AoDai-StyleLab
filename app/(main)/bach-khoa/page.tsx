"use client";

import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { GarmentGenealogy } from "@/components/bach-khoa/GarmentGenealogy";
import { FormattedMarkdown } from "@/components/shared/FormattedMarkdown";
import {
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  MessageSquare,
  Diamond,
  MapPin,
} from "lucide-react";
import { answerHeritageQuestion } from "@/lib/assistant-engine";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time?: string;
  isCitation?: boolean;
  citationTitle?: string;
  citationBook?: string;
  isAuditResult?: boolean;
  auditPass?: boolean;
  auditDetails?: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Xin chào bạn! Tôi là Trợ lý Di sản AI, được huấn luyện trên thư tịch cổ triều Nguyễn, điển chế Lê triều và công trình nghiên cứu của các học giả cổ phục Việt Nam. Bạn có thể hỏi tôi về quy tắc may, cách phân biệt các dòng áo, quy chuẩn mặc lễ nghi, hoặc gửi hình ảnh trang phục để kiểm định tính xác thực lịch sử!",
  },
  {
    id: "user-example",
    sender: "user",
    text: "Sự khác nhau căn bản giữa Áo Ngũ Thân và Áo Tứ Thân là gì? Khi may Áo Ngũ Thân cần chú ý nhất quy tắc nào?",
    time: "14:28",
  },
  {
    id: "ai-example",
    sender: "ai",
    text: "Chào bạn, sự khác biệt mấu chốt giữa hai thức y phục này nằm ở tầng lớp xã hội, cấu trúc thân áo và cổ áo:\n\n• Áo Tứ Thân: Trang phục bình dân/lao động của phụ nữ Bắc Bộ. Cổ buông mở (không có cổ đứng), hai vạt trước buộc lại trước bụng, bên trong mặc yếm và dải yếm lộ duyên dáng.\n\n• Áo Ngũ Thân: Quốc phục chính thống quy định từ thời chúa Nguyễn Phúc Khoát (1744) và hoàn thiện dưới triều Minh Mạng. Dành cho cả nam và nữ, có cổ đứng nghiêm cẩn (3-4cm), 5 chiếc khuy cài kín đáo bên nách phải, không để hở áo lót bên trong.\n\nQuy tắc quan trọng nhất: Cổ áo phải luôn khép khít, cài khuy bên phải (Cát khâm). Tuyệt đối không cài sang trái (Hung khâm - dùng cho người quá cố).",
    isCitation: true,
    citationTitle: "Khâm Định Đại Nam Hội Điển Sự Lệ",
    citationBook: "Quyển 78 • Y phục triều Nguyễn, tờ 12a",
  },
];

const HERITAGE_MOTIFS = [
  {
    id: "chim-lac",
    name: "Chim Lạc Sải Cánh",
    dynasty: "Thời Đông Sơn",
    tagColor: "bg-text-charcoal",
    desc: "Mẫu thức cổ sơ nhất của người Việt, sải cánh dài bay ngược chiều kim đồng hồ quanh mặt trời, tượng trưng cho khát vọng chinh phục vũ trụ và cội nguồn Bách Việt.",
    position: "Vị trí: Cổ áo, viền dải lụa",
    img: "/patterns/chim-lac.jpg",
  },
  {
    id: "hoa-sen",
    name: "Hoa Sen Cổ Phong",
    dynasty: "Thời Lý – Trần",
    tagColor: "bg-guardrail-pass",
    desc: "Biểu tượng thanh khiết của Phật giáo Đại Việt, vươn lên từ bùn lầy giữ trọn hương sắc, gắn liền với cốt cách thanh cao và từ bi.",
    position: "Vị trí: Ngực áo, vạt áo Giao Lĩnh",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2rEcIVKz5_H2cYNTCRo5Al1FQFstocHTvA8ou9INHSSAKO0JnzzD_3tmDPVQS4i8Hoo767WVsL8Pjd9Go26pFwv-qLhuHwCWG2wWrFNqzkWf_ffZ73mtJJzgoutTgjB_2xxgqZam0lDL9GPRmAkErbQZwOjoovMDkX_4URKP7QJ3MjsNKfYLU7mfIblguS1jmkN2B6PgaN00CSe1aXaOa9biu4XSapXmr6aQJpJ2Avc5xrUvRlnw",
  },
  {
    id: "may-tan",
    name: "Mây Tản (Vân Khí Cung Đình)",
    dynasty: "Thời Hậu Lê",
    tagColor: "bg-bronze-gold",
    desc: "Dải mây dập dờn hình dải lụa mềm mại vươn cao, biểu trưng cho thiên khí cát tường, sự hanh thông của vương triều và cảnh giới tâm hồn thanh thoát.",
    position: "Vị trí: Tay áo, ngực áo Lập Lĩnh",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAyn-r9F6DSZZ7S-D9Ro1_1xlPNOvFPZN5aB7AbD3-WXwHf2tU1Dk28LvY7Dh3xiHVxWEvcuGNS2RHP5AJqd15Y07M8fYw9tYtF8ncYtOTxY_lxZ8nUzdyqeQgvcTEwR7nz397RyskS5HHC8qYs0gMc5xRl9QBpLq23iFJh3m8GNDsGH__e_r-TGR3NuZJuz2RHJZ02R57OY-3JVvbgXzA-MC2mvi-rrF7cbUyxaTWfclQQv0Tb-Tt",
  },
  {
    id: "may-rong",
    name: "Mây Rồng Thời Hậu Lê",
    dynasty: "Thời Lê Trung Hưng",
    tagColor: "bg-vermilion-red",
    desc: "Rồng ẩn hiện trong mây trời cuồn cuộn với bờm dài, móng vuốt uy phong, tượng trưng cho thiên mệnh chính trực và sự hưng thịnh của vương triều.",
    position: "Vị trí: Bổ tử, ngực áo quan lại",
    img: "/patterns/may-rong.jpg",
  },
  {
    id: "cuc-gam",
    name: "Cúc Gấm Cung Đình",
    dynasty: "Thời Lê – Nguyễn",
    tagColor: "bg-bronze-gold",
    desc: "Cúc gấm đại diện cho đức hạnh người quân tử, trường thọ viên mãn và sự điềm đạm thanh cao trong hệ giá trị lễ nghi Á Đông.",
    position: "Vị trí: Gấu áo, cổ áo",
    img: "/patterns/cuc-gam.jpg",
  },
  {
    id: "thuy-ba",
    name: "Thủy Ba Ba Đào (Sóng Nước)",
    dynasty: "Triều Nguyễn",
    tagColor: "bg-vermilion-red",
    desc: "Những cột sóng dâng cao vỗ vào mỏm đá ngầm, tượng trưng cho sự chở che giang sơn thái bình, sự phồn thực và uy lực bền bỉ của giang sơn xã tắc.",
    position: "Vị trí: Gấu áo Ngũ Thân & Cung bào",
    img: "/patterns/thuy-ba.jpg",
  },
  {
    id: "chuc-tho",
    name: "Chữ Thọ Đồ Án",
    dynasty: "Triều Nguyễn",
    tagColor: "bg-bronze-gold",
    desc: "Đồ án chữ Thọ cách điệu hình tròn hoặc vuông, phối kết cùng vân mây và dơi đỏ (ngũ phúc), biểu trưng cho phúc lộc và sự trường tồn miên viễn.",
    position: "Vị trí: Thân áo Ngũ Thân, mặt vải gấm",
    img: "/patterns/chuc-tho.jpg",
  },
  {
    id: "phuong-mua",
    name: "Phượng Múa Hoàng Tộc",
    dynasty: "Triều Nguyễn",
    tagColor: "bg-vermilion-red",
    desc: "Hình tượng chim phụng xòe cánh mềm mại ngậm hoa cúc, biểu trưng cho vẻ đẹp quý phái, đức hạnh và quyền uy của Hoàng hậu, Công chúa.",
    position: "Vị trí: Ngực áo Nhật Bình, dải cổ",
    img: "/patterns/phuong-mua.jpg",
  },
  {
    id: "ngu-sac",
    name: "Dải Dệt Ngũ Sắc",
    dynasty: "Triều Nguyễn",
    tagColor: "bg-text-charcoal",
    desc: "Năm dải lụa màu (xanh, vàng, trắng, đỏ, lục/đen) tương ứng với Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ), biểu trưng cho trật tự vũ trụ và sự hài hòa thịnh vượng.",
    position: "Vị trí: Tay áo Nhật Bình",
    img: "/patterns/ngu-sac.jpg",
  },
  {
    id: "cyber-pattern",
    name: "Cyber Đông Phương Matrix",
    dynasty: "Gen Z Remix",
    tagColor: "bg-primary",
    desc: "Đường nét vi mạch neon kết hợp họa tiết kỷ hà truyền thống, thể hiện tinh thần cách tân thời thượng của thế hệ trẻ hướng tới tương lai.",
    position: "Vị trí: Tà áo dài cách tân Gen Z",
    img: "/patterns/cyber-pattern.jpg",
  },
];

export default function BachKhoaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [highlightedMotifId, setHighlightedMotifId] = useState<string | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages or loading change
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loadingAi, isChatOpen]);

  const handleSendQuery = async (queryText?: string) => {
    const text = queryText || inputMsg;
    if (!text.trim() || loadingAi) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: "Vừa xong",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputMsg("");
    setLoadingAi(true);

    try {
      const res = await fetch("/api/cultural-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (res.ok) {
        const data = await res.json();

        // Nếu máy chủ Cloudflare bị Google chặn IP khu vực (location not supported),
        // trình duyệt người dùng tại Việt Nam sẽ trực tiếp gửi prompt đến Gemini
        if (data.clientFallback && (data.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY)) {
          const directKey = data.apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
          try {
            const directRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${data.model || "gemini-3.5-flash-lite"}:generateContent?key=${encodeURIComponent(directKey)}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: data.systemInstruction }],
                  },
                  contents: [
                    {
                      role: "user",
                      parts: [{ text }],
                    },
                  ],
                  generationConfig: {
                    temperature: 0.3,
                  },
                }),
              }
            );

            if (directRes.ok) {
              const directData = await directRes.json();
              const parts = directData?.candidates?.[0]?.content?.parts || [];
              const directAnswer = parts
                .map((p: any) => p.text || "")
                .filter(Boolean)
                .join("\n\n")
                .trim();

              if (directAnswer) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: (Date.now() + 1).toString(),
                    sender: "ai",
                    text: directAnswer,
                  },
                ]);
                return;
              }
            }
          } catch (clientErr) {
            console.warn("Client direct Gemini call failed:", clientErr);
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: data.answer || "Đã giải mã tư liệu.",
          },
        ]);
        return;
      } else {
        throw new Error("Lỗi khi kết nối API");
      }
    } catch {
      const local = answerHeritageQuestion(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: local.answer,
        },
      ]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAskAiFromGenealogy = (promptHint: string) => {
    setIsChatOpen(true);
    handleSendQuery(promptHint);
  };

  const handleSelectPattern = (patternId: string) => {
    setHighlightedMotifId(patternId);
    const element = document.getElementById(`motif-${patternId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      const section = document.getElementById("motifs-section");
      section?.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      setHighlightedMotifId(null);
    }, 3500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "reset",
        sender: "ai",
        text: "Phiên vấn đáp di sản đã được làm mới. Mời bạn đặt câu hỏi về lịch sử, triều điển hoặc cách phối đồ Việt phục!",
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <main className="w-full flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 space-y-10">
          {/* Top Editorial Header */}
          <div className="bg-[#FFFFFF] rounded-2xl p-5 sm:p-6 shadow-sm border border-border-bronze-light/60">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-bronze-gold font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Kho tàng Tri thức Di sản</span>
              </div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-text-charcoal tracking-tight">
                Bách khoa Toàn thư Việt phục
              </h1>
              <p className="text-xs sm:text-sm text-text-warm-gray leading-relaxed">
                Khám phá tiến trình nghìn năm y phục dân tộc, tìm hiểu nguồn gốc và giải mã mật ngữ hoa văn di sản qua các thời kỳ lịch sử.
              </p>
            </div>
          </div>

          {/* 1. Component GarmentGenealogy: Nằm ở vị trí đầu tiên của trang */}
          <GarmentGenealogy
            onAskAi={handleAskAiFromGenealogy}
            onSelectPattern={handleSelectPattern}
          />

          {/* 2. Bảng Giải mã Hoa Văn Di sản: Nằm ngay bên dưới */}
          <section id="motifs-section" className="w-full space-y-5 pt-4 border-t border-border-bronze-light/50">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
              <div>
                <div className="inline-flex items-center gap-1.5 text-bronze-gold font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">diamond</span>
                  <span>Giải mã Đồ án Di sản</span>
                </div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-text-charcoal tracking-tight mt-0.5">
                  Hoa Văn & Mật Ngữ Cổ Phong
                </h2>
                <p className="text-xs text-text-warm-gray leading-relaxed">
                  Ý nghĩa biểu tượng, vị trí thêu may và minh triết văn hóa qua từng nét vẽ cổ truyền.
                </p>
              </div>

              <span className="text-[11px] font-mono text-bronze-gold bg-paper-cream px-3 py-1 rounded-full border border-border-bronze-light/60 self-start sm:self-auto">
                {HERITAGE_MOTIFS.length} Đồ án Di sản
              </span>
            </div>

            {/* Grid Đồ Án Hoa Văn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {HERITAGE_MOTIFS.map((motif) => {
                const isHighlighted = highlightedMotifId === motif.id;

                return (
                  <div
                    key={motif.id}
                    id={`motif-${motif.id}`}
                    className={`bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 shadow-sm border space-y-4 transition-all duration-500 flex flex-col justify-between ${isHighlighted
                        ? "border-vermilion-red ring-2 ring-vermilion-red/50 shadow-lg scale-[1.02] bg-vermilion-red/5"
                        : "border-border-bronze-light/60 hover:translate-y-[-2px] hover:shadow-md hover:border-bronze-gold/70"
                      }`}
                  >
                    <div className="space-y-3.5">
                      <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden bg-paper-cream border border-border-bronze-light/40 group">
                        <img
                          src={motif.img}
                          alt={motif.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className={`absolute top-2 left-2 px-2.5 py-0.5 ${motif.tagColor} text-white rounded font-mono text-[10px] font-bold shadow-xs`}
                        >
                          {motif.dynasty}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-serif text-[15px] font-bold text-text-charcoal leading-snug">
                          {motif.name}
                        </h4>
                        <p className="text-xs text-text-warm-gray leading-relaxed">
                          {motif.desc}
                        </p>
                      </div>

                      {/* Khối thông tin Vị trí ứng dụng */}
                      <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-paper-cream/60 border border-border-bronze-light/40 text-[11px] text-text-charcoal leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-bronze-gold shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-bronze-gold">Vị trí: </span>
                          <span className="text-text-charcoal/90">
                            {motif.position.replace(/^Vị trí:\s*/, "")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nút bấm Hỏi AI */}
                    <div className="pt-3 border-t border-border-bronze-light/30">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChatOpen(true);
                          handleSendQuery(
                            `Đồ án hoa văn '${motif.name}' có ý nghĩa biểu tượng gì trong văn hóa cổ phục Việt và cách ứng dụng đúng vào thiết kế hiện đại?`
                          );
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-vermilion-red via-[#d33a2a] to-bronze-gold text-white font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all group/btn cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-paper-cream group-hover/btn:rotate-12 transition-transform" />
                        <span>Hỏi AI</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Floating Action Button (FAB) - Bottom Right Corner */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-vermilion-red via-primary to-bronze-gold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-paper-cream group"
        title={isChatOpen ? "Đóng cửa sổ chat (X)" : "Mở Trợ lý Cố vấn Di sản AI"}
      >
        <div className="relative flex items-center justify-center">
          {isChatOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 text-paper-cream transition-transform rotate-0" />
          ) : (
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-paper-cream group-hover:rotate-12 transition-transform" />
          )}
        </div>
        {/* Tooltip on hover for desktop */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 bg-text-charcoal/90 backdrop-blur-md text-white text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10">
          {isChatOpen ? "Đóng cửa sổ chat ✕" : "Hỏi Trợ lý Di sản AI 💬"}
        </span>
      </button>

      {/* Floating Chat Modal / Bottom Sheet */}
      {isChatOpen && (
        <div className="fixed bottom-[9rem] right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[500px] md:w-[540px] lg:w-[560px] h-[68vh] max-h-[700px] min-h-[460px] bg-surface-pure rounded-3xl shadow-2xl border border-bronze-gold/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300">
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-vermilion-red/10 via-bronze-gold/10 to-paper-cream border-b border-border-bronze-light/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-vermilion-red flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4 text-paper-cream" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-text-charcoal leading-tight">
                  Trợ lý Cố vấn Di sản
                </h3>
                <div className="flex items-center gap-1 text-guardrail-pass text-[10px] font-semibold">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>Gemini Cultural AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Conversation Log */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#FAF7F2]/60"
          >
            {messages.map((m) => {
              if (m.sender === "ai") {
                return (
                  <div key={m.id} className="flex items-start gap-2 max-w-[95%]">
                    <div className="w-7 h-7 rounded-full bg-vermilion-red flex items-center justify-center text-white shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                      AI
                    </div>
                    <div className="bg-paper-cream p-3 sm:p-3.5 rounded-2xl rounded-tl-xs space-y-2 text-text-charcoal text-xs border border-border-bronze-light/40 shadow-xs">
                      {m.isCitation && (
                        <div className="flex items-center gap-1 text-guardrail-pass font-bold text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">task_alt</span>
                          <span>Đã thẩm định theo Quy chuẩn Điển lễ</span>
                        </div>
                      )}

                      {m.isAuditResult && (
                        <div className="flex items-center gap-1.5 text-guardrail-pass font-bold text-xs">
                          <span className="material-symbols-outlined text-[15px]">
                            check_circle
                          </span>
                          <span>KẾT QUẢ THẨM ĐỊNH HÌNH ẢNH: ĐẠT CHUẨN (PASS 94%)</span>
                        </div>
                      )}

                      <FormattedMarkdown content={m.text} />

                      {m.auditDetails && (
                        <ul className="space-y-1 pl-1 text-[11px]">
                          {m.auditDetails.map((det, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-vermilion-red">•</span>
                              <span>{det}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Thư Tịch Cổ Citation Badge */}
                      {m.isCitation && (
                        <div className="bg-surface-pure p-2 rounded-lg flex items-center justify-between gap-2 border border-border-bronze-light/40 mt-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="material-symbols-outlined text-bronze-gold text-[18px]">
                              auto_stories
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-text-charcoal truncate">
                                {m.citationTitle}
                              </div>
                              <div className="text-[10px] text-text-warm-gray truncate">
                                {m.citationBook}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCitationModalOpen(true)}
                            className="px-2 py-0.5 bg-paper-cream hover:bg-secondary-fixed rounded text-vermilion-red font-bold text-[10px] whitespace-nowrap transition-colors border border-border-bronze-light/50"
                          >
                            Xem trích lục
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={m.id}
                    className="flex items-start justify-end gap-2 ml-auto max-w-[88%]"
                  >
                    <div className="bg-vermilion-red text-white p-3 rounded-2xl rounded-tr-xs space-y-1 text-xs shadow-xs">
                      <p className="leading-relaxed">{m.text}</p>
                      {m.time && (
                        <div className="text-right text-[9px] text-white/75 font-mono">
                          {m.time}
                        </div>
                      )}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-bronze-gold flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                    </div>
                  </div>
                );
              }
            })}

            {loadingAi && (
              <div className="flex items-start gap-2 max-w-[90%]">
                <div className="w-7 h-7 rounded-full bg-vermilion-red flex items-center justify-center text-white shrink-0 mt-0.5 text-xs font-bold">
                  AI
                </div>
                <div className="bg-paper-cream p-3 rounded-xl text-xs text-text-warm-gray flex items-center gap-2 border border-border-bronze-light/40">
                  <div className="w-3.5 h-3.5 border-2 border-vermilion-red border-t-transparent rounded-full animate-spin" />
                  <span>Trợ lý AI đang khảo chứng điển lễ lịch sử...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-surface-pure border-t border-border-bronze-light/40 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs scrollbar-none">
            <span className="text-[10px] text-bronze-gold font-bold uppercase tracking-wider shrink-0">
              Gợi ý:
            </span>
            {[
              "Tại sao Áo ngũ thân có 5 cúc?",
              "Mặc gì đi lễ chùa trang trọng?",
              "Áo Tấc khác Áo Ngũ Thân tay chẽn ở điểm nào?",
              "Quy tắc phối đồ chuẩn văn hóa cho Gen Z?",
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(chip)}
                className="px-2.5 py-1 bg-paper-cream hover:bg-vermilion-red/10 text-text-charcoal hover:text-vermilion-red rounded-full text-[11px] font-medium border border-border-bronze-light/60 transition-colors shrink-0 shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 sm:p-3 bg-paper-cream border-t border-border-bronze-light/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                placeholder="Hỏi AI về cổ phục, điển lễ, hoa văn..."
                className="w-full pl-3 pr-10 py-2 sm:py-2.5 bg-surface-pure rounded-xl text-text-charcoal text-xs placeholder:text-text-warm-gray focus:outline-none border border-border-bronze-light/60 shadow-inner"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSendQuery()}
                  disabled={loadingAi || !inputMsg.trim()}
                  className="p-1.5 bg-vermilion-red hover:bg-primary text-white rounded-lg transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heritage Citation Modal Overlay (Higher z-index) */}
      {isCitationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-text-charcoal/50 backdrop-blur-sm">
          <div className="bg-paper-cream max-w-lg w-full rounded-2xl p-6 shadow-xl space-y-4 border border-border-bronze-light animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-vermilion-red">
                <span className="material-symbols-outlined text-[22px]">menu_book</span>
                <h3 className="font-serif font-bold text-base">Trích lục Thư tịch Cổ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCitationModalOpen(false)}
                className="text-text-warm-gray hover:text-text-charcoal p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-surface-pure p-4 rounded-xl space-y-2 shadow-inner border border-border-bronze-light/50">
              <div className="text-[11px] font-mono font-bold text-bronze-gold uppercase">
                Nguyên văn Hán Nôm • Phiên âm:
              </div>
              <p className="font-serif text-text-charcoal italic leading-relaxed text-xs">
                “Năm Giáp Tý (1744), chúa Nguyễn Phúc Khoát định y phục: Phàm sĩ thứ y quan đều dùng áo ngũ thân, cài năm cúc ở bên phải, tay áo chẽn hoặc thụng theo nghi lễ... Tôn nghiêm lễ nhạc, định rõ tôn ty.”
              </p>
              <div className="text-right text-[11px] text-text-warm-gray pt-1 font-mono">
                — Nguồn: <em>Đại Nam Thực Lục Tiền Biên • Quyển 10</em>
              </div>
            </div>

            <div className="space-y-1 text-xs text-text-warm-gray leading-relaxed">
              <p>
                <strong>Diễn giải học thuật:</strong> Chiếc áo ngũ thân ra đời nhằm thống nhất văn hóa trang phục xứ Đàng Trong, tạo sự uy nghiêm, phân biệt rạch ròi với trang phục phương Bắc nhưng vẫn giữ cốt cách Đông phương thuần khiết.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCitationModalOpen(false)}
              className="w-full py-2.5 bg-vermilion-red hover:bg-primary text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
            >
              Đã hiểu • Đóng trích lục
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

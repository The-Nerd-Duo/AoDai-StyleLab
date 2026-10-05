"use client";

import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import genealogyData from "@/config/genealogy.json";
import { Sparkles, Send, RefreshCw, CheckCircle2, AlertTriangle, Paperclip, X, Eye } from "lucide-react";
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
    id: "thuy-ba",
    name: "Thủy Ba Ba Đào (Sóng Nước Nổi Cồn)",
    dynasty: "Triều Nguyễn",
    tagColor: "bg-vermilion-red",
    desc: "Những cột sóng dâng cao vỗ vào mỏm đá ngầm, tượng trưng cho sự chở che giang sơn thái bình, sự phồn thực và uy lực bền bỉ của bậc đế vương.",
    position: "Vị trí: Gấu áo Cung bào",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfu-tpuDfvaQ46mro3c5K7eq4OsUd5iIrVn9W1qq6UwQq-6hfu4am-9hiajPvtp36sjRpf30uS0jK8bntwg82cgAy9mdXGdWnVmNAo8mMMcOjl0tM2iakWTCqIF9fGIFFHlfFsXrv4uXxym_qkxnd8XeWBTS14daNkV34gEsk6dqhcBQViuRIFpPgGAAktHsIs_aW0b_3MsAQt27qMcTSIxZZBQMk2j_Y7VSu9aijdrVeYk4Ds6-nN",
  },
  {
    id: "may-tan",
    name: "Mây Tản (Vân Khí Cung Đình)",
    dynasty: "Thời Hậu Lê",
    tagColor: "bg-bronze-gold",
    desc: "Dải mây dập dờn hình dải lụa mềm mại vươn cao, biểu trưng cho thiên khí cát tường, sự hanh thông của vương triều và cảnh giới tâm hồn thanh thoát.",
    position: "Vị trí: Tay áo, ngực áo",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAyn-r9F6DSZZ7S-D9Ro1_1xlPNOvFPZN5aB7AbD3-WXwHf2tU1Dk28LvY7Dh3xiHVxWEvcuGNS2RHP5AJqd15Y07M8fYw9tYtF8ncYtOTxY_lxZ8nUzdyqeQgvcTEwR7nz397RyskS5HHC8qYs0gMc5xRl9QBpLq23iFJh3m8GNDsGH__e_r-TGR3NuZJuz2RHJZ02R57OY-3JVvbgXzA-MC2mvi-rrF7cbUyxaTWfclQQv0Tb-Tt",
  },
  {
    id: "chim-lac",
    name: "Chim Lạc Sải Cánh",
    dynasty: "Thời Tiền Sử / Đông Sơn",
    tagColor: "bg-text-charcoal",
    desc: "Mẫu thức cổ sơ nhất của người Việt, sải cánh dài bay ngược chiều kim đồng hồ quanh mặt trời, tượng trưng cho khát vọng chinh phục vũ trụ và nguồn gốc Bách Việt.",
    position: "Vị trí: Cổ áo, viền khăn",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ1vxuAux-cjVr7nKaQ3TtLVR2kOL8rbWJWyFBj8P3jLaN2vgLYIuqgf8hj80_ZPjA6GfE3mme5M0pmzmqgISzTAgoBv-mqialJ_tJWUQcsmq880tzPTWGeXGETk6mIWIscFz-jXN6wac7Jhlmm9NlWqEOg-lvxX_W42p7GzD4hftjlUozOYEJuP0J-U0ErHBNJbTGHXlIX3NEspsh9Za7Dd7NHDSmkJ-ybcoblnybyF7WgSmdf5za",
  },
  {
    id: "hoa-cuc-day",
    name: "Hoa Cúc Dây Cung Đình",
    dynasty: "Thời Lý – Trần",
    tagColor: "bg-guardrail-pass",
    desc: "Cúc dây liên hoàn biểu trưng cho lòng trung trinh, cốt cách thanh tao của kẻ sĩ và trường thọ viên mãn trong hệ giá trị nhân văn truyền thống.",
    position: "Vị trí: Thân áo, đai lưng",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2rEcIVKz5_H2cYNTCRo5Al1FQFstocHTvA8ou9INHSSAKO0JnzzD_3tmDPVQS4i8Hoo767WVsL8Pjd9Go26pFwv-qLhuHwCWG2wWrFNqzkWf_ffZ73mtJJzgoutTgjB_2xxgqZam0lDL9GPRmAkErbQZwOjoovMDkX_4URKP7QJ3MjsNKfYLU7mfIblguS1jmkN2B6PgaN00CSe1aXaOa9biu4XSapXmr6aQJpJ2Avc5xrUvRlnw",
  },
];

export default function BachKhoaPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "motifs" | "weaving">("timeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputMsg, setInputMsg] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loadingAi]);

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
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: data.answer || "Đã giải mã tư liệu.",
          },
        ]);
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

  const handleSimulateImageAudit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    const uploadBubble: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: `[Gửi ảnh kiểm định: ${file.name}] Kiểm định giúp tôi bộ trang phục trong ảnh có đúng quy chuẩn Việt phục triều Nguyễn không?`,
      time: "Vừa xong",
    };

    setMessages((prev) => [...prev, uploadBubble]);
    setLoadingAi(true);

    setTimeout(() => {
      const auditResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Hệ thống AI Vision đã quét các đặc trưng của bức ảnh và đối chiếu cơ sở dữ liệu VNU Heritage:",
        isAuditResult: true,
        auditPass: true,
        auditDetails: [
          "Cổ áo: Dáng đứng cổ bọc lót tinh xảo, cao 3.5cm – Chuẩn quy chế Áo Ngũ Thân Triều Nguyễn.",
          "Cài khuy: Khuy đồng đúc hình quả nhót cài sang phải (Cát khâm).",
          "Gợi ý cách tân: Quần trắng ống thụng đi kèm đạt độ buông chuẩn mực, có thể phối hài cườm truyền thống để hoàn thiện.",
        ],
      };
      setMessages((prev) => [...prev, auditResponse]);
      setLoadingAi(false);
    }, 1200);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "reset",
        sender: "ai",
        text: "Phiên vấn đáp di sản đã được làm mới. Mời bạn đặt câu hỏi hoặc gửi hình ảnh cần khảo chứng!",
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <Header />

      <main className="w-full flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* Top Editorial Header & Global Search Bar */}
          <div className="bg-surface-pure rounded-2xl p-5 sm:p-6 shadow-sm border border-border-bronze-light/60 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-bronze-gold font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  <span>Kho tàng Tri thức Di sản • Ban Thẩm định Cổ phục VNU</span>
                </div>
                <h1 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-text-charcoal tracking-tight">
                  Bách khoa Toàn thư Việt phục &amp; Trợ lý Di sản AI
                </h1>
                <p className="text-xs sm:text-sm text-text-warm-gray leading-relaxed">
                  Hệ thống cứu chuẩn tra cứu niên biểu 1000 năm y phục dân tộc, giải mã mật ngữ hoa văn và đối thoại trực tiếp cùng Trợ lý Cố Vấn Văn Hóa AI.
                </p>
              </div>
            </div>

            {/* Search Input Container */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-bronze-gold">
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery(`Tra cứu thông tin về: ${searchTerm}`)}
                placeholder="Tìm kiếm quy chế cổ phục, triều đại, hoa văn di sản, quy tắc cài khuy..."
                className="w-full pl-12 pr-32 py-3.5 bg-paper-cream rounded-xl text-text-charcoal text-sm placeholder:text-text-warm-gray focus:outline-none focus:bg-surface-pure border border-border-bronze-light/50 transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => alert("Hệ thống lọc theo Triều Đại, Hoa Văn, Chất Liệu Dệt.")}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-surface-pure rounded-lg text-xs font-semibold text-text-warm-gray shadow-xs hover:text-text-charcoal transition-colors border border-border-bronze-light/50"
                >
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                  <span>Bộ lọc</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuery(`Tra cứu thông tin về: ${searchTerm}`)}
                  className="bg-vermilion-red hover:bg-primary text-white px-4 py-2 rounded-lg font-semibold text-xs transition-opacity shadow-xs"
                >
                  Tra cứu
                </button>
              </div>
            </div>

            {/* Quick Exploration Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-text-warm-gray font-medium mr-1">Chủ đề nổi bật:</span>
              {[
                "Áo Ngũ Thân",
                "Áo Giao Lĩnh",
                "Màu sắc phẩm phục triều Nguyễn",
                "Quy tắc cài khuy bên phải",
                "Họa tiết Thủy Ba",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSearchTerm(chip);
                    handleSendQuery(`Hãy giải thích chi tiết về: ${chip}`);
                  }}
                  className="px-3 py-1 rounded-full bg-surface-container-low hover:bg-[#F2EDE7] text-text-charcoal font-medium transition-colors border border-border-bronze-light/40"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Split Workspace (7 cols left : 5 cols right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT WORKSPACE: Cổ phục Archive & Timeline (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-5">
              {/* View Mode Segment Control */}
              <div className="bg-surface-pure rounded-xl p-1.5 shadow-sm border border-border-bronze-light/60 flex items-center justify-between gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("timeline")}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "timeline"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "text-text-warm-gray hover:text-text-charcoal hover:bg-paper-cream"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  <span>Niên biểu Lịch sử</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("motifs")}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "motifs"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "text-text-warm-gray hover:text-text-charcoal hover:bg-paper-cream"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">texture</span>
                  <span>Giải mã Hoa văn Cổ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("weaving")}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "weaving"
                      ? "bg-vermilion-red text-white shadow-xs"
                      : "text-text-warm-gray hover:text-text-charcoal hover:bg-paper-cream"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">palette</span>
                  <span>Dệt &amp; Phẩm chất</span>
                </button>
              </div>

              {/* SECTION 1: Chronological Timeline Container */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-vermilion-red text-[20px]">
                        account_tree
                      </span>
                      <h2 className="font-serif font-bold text-base sm:text-lg text-text-charcoal">
                        Tiến trình Y phục Việt Nam
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-bronze-gold bg-paper-cream px-2.5 py-1 rounded-full border border-border-bronze-light/50">
                      TK XI — TK XX
                    </span>
                  </div>

                  <div className="space-y-3">
                    {genealogyData.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-surface-pure border border-border-bronze-light/60 shadow-xs hover:border-bronze-gold transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-bronze-gold uppercase tracking-wider">
                              {item.period} • {item.dynasty}
                            </span>
                            <h3 className="font-serif font-bold text-sm sm:text-base text-text-charcoal">
                              {item.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vermilion-red/10 text-vermilion-red border border-vermilion-red/20 whitespace-nowrap">
                            {item.keyGarment}
                          </span>
                        </div>
                        <p className="text-xs text-text-warm-gray leading-relaxed">
                          {item.description}
                        </p>
                        <div className="pt-2 border-t border-border-bronze-light/30 flex items-center justify-between text-xs">
                          <span className="text-text-warm-gray italic text-[11px]">
                            {item.highlight}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSendQuery(`Hãy phân tích chi tiết bối cảnh y phục triều đại ${item.dynasty} (${item.title})?`)}
                            className="text-vermilion-red font-semibold hover:underline flex items-center gap-0.5 text-[11px]"
                          >
                            Hỏi AI triều đại này →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 2: Cultural Motifs Archive Grid */}
              {(activeTab === "timeline" || activeTab === "motifs") && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-bronze-gold text-[20px]">
                        diamond
                      </span>
                      <h2 className="font-serif font-bold text-base sm:text-lg text-text-charcoal">
                        Hoa Văn &amp; Đồ Án Di Sản
                      </h2>
                    </div>
                    <span className="text-[11px] text-text-warm-gray font-medium">
                      Ký hiệu học &amp; Minh triết
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {HERITAGE_MOTIFS.map((motif) => (
                      <div
                        key={motif.id}
                        className="bg-surface-pure rounded-xl p-4 shadow-xs border border-border-bronze-light/60 space-y-3 hover:translate-y-[-2px] transition-transform"
                      >
                        <div className="relative h-44 rounded-lg overflow-hidden bg-paper-cream border border-border-bronze-light/40">
                          <img
                            src={motif.img}
                            alt={motif.name}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute top-2 left-2 px-2 py-0.5 ${motif.tagColor} text-white rounded font-mono text-[10px] font-bold shadow-xs`}
                          >
                            {motif.dynasty}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-serif text-[14px] font-bold text-text-charcoal">
                            {motif.name}
                          </h4>
                          <p className="text-xs text-text-warm-gray leading-relaxed line-clamp-3">
                            {motif.desc}
                          </p>
                          <div className="pt-2 flex items-center justify-between text-xs">
                            <span className="text-bronze-gold text-[11px] font-semibold">
                              {motif.position}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleSendQuery(
                                  `Đồ án hoa văn '${motif.name}' có ý nghĩa biểu tượng gì trong văn hóa cổ phục Việt và cách ứng dụng đúng vào thiết kế hiện đại?`
                                )
                              }
                              className="text-vermilion-red font-semibold hover:underline text-[11px]"
                            >
                              Hỏi AI ý nghĩa →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: Weaving & Material Insights */}
              {activeTab === "weaving" && (
                <div className="bg-surface-pure rounded-xl p-5 shadow-sm border border-border-bronze-light/60 space-y-4 animate-fadeIn">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-text-charcoal">
                    Chất liệu Dệt truyền thống &amp; Phẩm chất
                  </h3>
                  <p className="text-xs sm:text-sm text-text-warm-gray leading-relaxed">
                    Hệ thống gấm lụa truyền thống Việt Nam: Lụa Vạn Phúc (Hà Đông), Gấm Mã Châu (Quảng Nam), Lãnh Mỹ A (Tân Châu - An Giang nhuộm mặc nưa). Mỗi dòng dệt gắn liền với các phẩm cấp và công năng khí hậu nhiệt đới riêng biệt.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3.5 bg-paper-cream rounded-xl border border-border-bronze-light/50 text-center space-y-1">
                      <div className="font-serif text-sm font-bold text-vermilion-red">
                        Lãnh Mỹ A
                      </div>
                      <div className="text-xs text-text-warm-gray">
                        Đen tuyền óng ả từ trái mặc nưa, mát lạnh mùa hè, ấm áp mùa đông.
                      </div>
                    </div>

                    <div className="p-3.5 bg-paper-cream rounded-xl border border-border-bronze-light/50 text-center space-y-1">
                      <div className="font-serif text-sm font-bold text-bronze-gold">
                        Sa Đoạn Vạn Phúc
                      </div>
                      <div className="text-xs text-text-warm-gray">
                        Dệt hoa chìm tinh xảo, mỏng nhẹ thông thoáng thích hợp may lót áo Ngũ thân.
                      </div>
                    </div>

                    <div className="p-3.5 bg-paper-cream rounded-xl border border-border-bronze-light/50 text-center space-y-1">
                      <div className="font-serif text-sm font-bold text-text-charcoal">
                        Gấm Thêu Kim Tuyến
                      </div>
                      <div className="text-xs text-text-warm-gray">
                        Dành cho lễ phục Đại triều, sợi tơ phủ đồng lấp lánh bền vững hàng trăm năm.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT WORKSPACE: Interactive Cultural AI Assistant (5 cols, sticky) */}
            <div className="lg:col-span-5 flex flex-col space-y-4 sticky top-20">
              <div className="bg-surface-pure rounded-2xl shadow-md border border-border-bronze-light/60 overflow-hidden flex flex-col h-[740px]">
                {/* Chat Header */}
                <div className="p-4 bg-paper-cream border-b border-border-bronze-light/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-vermilion-red/10 flex items-center justify-center text-vermilion-red">
                      <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-text-charcoal">
                        Trợ lý Cố vấn Di sản
                      </h3>
                      <div className="flex items-center gap-1 text-guardrail-pass text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>Verified Cultural Guardrail (VNU &amp; Viện VH)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="p-1.5 text-text-warm-gray hover:text-text-charcoal rounded-lg hover:bg-surface-pure transition-colors"
                    title="Làm mới cuộc trò chuyện"
                  >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                  </button>
                </div>

                {/* Chat Conversation Log */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-surface-pure"
                >
                  {messages.map((m) => {
                    if (m.sender === "ai") {
                      return (
                        <div key={m.id} className="flex items-start gap-2 max-w-[95%]">
                          <div className="w-7 h-7 rounded-full bg-vermilion-red flex items-center justify-center text-white shrink-0 mt-0.5 text-xs font-bold">
                            AI
                          </div>
                          <div className="bg-paper-cream p-3.5 rounded-xl rounded-tl-xs space-y-2 text-text-charcoal text-xs border border-border-bronze-light/40 shadow-xs">
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

                            <div className="leading-relaxed whitespace-pre-line">{m.text}</div>

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
                          <div className="bg-vermilion-red text-white p-3 rounded-xl rounded-tr-xs space-y-1 text-xs shadow-xs">
                            <p className="leading-relaxed">{m.text}</p>
                            {m.time && (
                              <div className="text-right text-[9px] text-white/75 font-mono">
                                {m.time}
                              </div>
                            )}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-bronze-gold flex items-center justify-center text-white shrink-0 mt-0.5">
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
                      <div className="bg-paper-cream p-3 rounded-xl text-xs text-text-warm-gray flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-vermilion-red border-t-transparent rounded-full animate-spin" />
                        <span>Trợ lý AI đang khảo chứng điển lễ lịch sử...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-1.5 bg-surface-pure border-t border-border-bronze-light/40 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs text-text-warm-gray scrollbar-none">
                  <span className="text-[11px] text-bronze-gold font-semibold">Gợi ý:</span>
                  <button
                    type="button"
                    onClick={() => handleSendQuery("Mặc Áo Ngũ Thân đi lễ chùa cần lưu ý gì?")}
                    className="px-2 py-0.5 bg-paper-cream hover:bg-surface-container-high rounded text-text-charcoal text-[11px] border border-border-bronze-light/50 transition-colors"
                  >
                    Lưu ý khi mặc đi lễ chùa?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendQuery("Tại sao cổ phục Việt Nam cài khuy bên phải?")}
                    className="px-2 py-0.5 bg-paper-cream hover:bg-surface-container-high rounded text-text-charcoal text-[11px] border border-border-bronze-light/50 transition-colors"
                  >
                    Tại sao cài khuy bên phải?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendQuery("Ý nghĩa 5 chiếc khuy trên áo ngũ thân?")}
                    className="px-2 py-0.5 bg-paper-cream hover:bg-surface-container-high rounded text-text-charcoal text-[11px] border border-border-bronze-light/50 transition-colors"
                  >
                    Ý nghĩa 5 khuy cài?
                  </button>
                </div>

                {/* Chat Input Bar */}
                <div className="p-3 bg-paper-cream border-t border-border-bronze-light/50 space-y-1">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                      placeholder="Hỏi AI về lịch sử phục chế, quy chế, hoa văn hoặc vải dệt..."
                      className="w-full pl-3.5 pr-20 py-2.5 bg-surface-pure rounded-lg text-text-charcoal text-xs placeholder:text-text-warm-gray focus:outline-none border border-border-bronze-light/60 shadow-xs"
                    />
                    <div className="absolute right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 text-text-warm-gray hover:text-bronze-gold rounded transition-colors"
                        title="Tải ảnh Việt phục lên để AI thẩm định đúng sai"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          add_photo_alternate
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendQuery()}
                        disabled={loadingAi || !inputMsg.trim()}
                        className="p-1.5 bg-vermilion-red hover:bg-primary text-white rounded transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cultural Integrity Guardrail Notice Box */}
              <div className="bg-guardrail-warning-surface p-4 rounded-xl flex items-start gap-3 shadow-xs border border-guardrail-warning/30">
                <span className="material-symbols-outlined text-guardrail-warning text-[22px] shrink-0 mt-0.5">
                  policy
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-guardrail-warning">
                    Cam kết Giữ gìn Tính Xác thực Di sản
                  </h4>
                  <p className="text-[11px] text-text-charcoal leading-relaxed">
                    Dự án <em>AoDai StyleLab</em> khuyến khích Gen Z cách tân và ứng dụng trang phục trong đời sống đương đại, nhưng luôn đề cao nguyên tắc <strong>bảo toàn cấu trúc văn hóa nguyên bản</strong> (khuy cát khâm, tỷ lệ cổ áo, thần thái y quan). Mọi hành vi xuyên tạc biểu tượng lịch sử đều được cảnh báo bởi Cultural Guardrail AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Hidden File Input for Image Audit */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSimulateImageAudit}
        className="hidden"
      />

      {/* Heritage Citation Modal Overlay */}
      {isCitationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-charcoal/50 backdrop-blur-sm">
          <div className="bg-paper-cream max-w-lg w-full rounded-2xl p-6 shadow-xl space-y-4 border border-border-bronze-light">
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

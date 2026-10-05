import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { CULTURAL_ASSISTANT_SYSTEM_INSTRUCTION } from "@/lib/prompts";
import { answerHeritageQuestion } from "@/lib/assistant-engine";
import { getCandidateModels } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = (body.question || body.message || "").trim();

    if (!question) {
      return NextResponse.json(
        { error: "Câu hỏi không hợp lệ hoặc đang trống." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    if (apiKey) {
      const candidateModels = getCandidateModels();

      const ai = new GoogleGenAI({ apiKey });

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: question,
            config: {
              systemInstruction: CULTURAL_ASSISTANT_SYSTEM_INSTRUCTION,
              temperature: 0.3,
            },
          });

          const reply = response.text || "";
          if (reply) {
            return NextResponse.json({
              answer: reply,
              reply,
              source: `gemini-ai (${model})`,
            });
          }
        } catch (geminiError: any) {
          console.warn(`Gemini call failed with model ${model}:`, geminiError?.message || geminiError);
          // Thử tiếp model dự phòng tiếp theo trong danh sách
        }
      }
    }

    // Fallback thông minh từ từ điển di sản nội bộ khi offline hoặc mất kết nối
    const fallbackAnswer = answerHeritageQuestion(question);
    return NextResponse.json({
      answer: fallbackAnswer.answer,
      reply: fallbackAnswer.answer,
      source: "heritage-vault-local",
    });
  } catch (error: any) {
    console.error("Cultural assistant route error:", error);
    return NextResponse.json(
      { error: error?.message || "Lỗi xử lý câu hỏi văn hóa" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload?.message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const language = payload.language ?? "en";
  const responseByLanguage: Record<string, string> = {
    en: "Explanation: Keep consistency high. Advice: hit protein target and train today. Encouragement: discipline beats motivation.",
    pt: "Explicacao: consistencia vence. Conselho: bata sua meta de proteina e treine hoje. Incentivo: disciplina supera motivacao.",
    es: "Explicacion: la consistencia gana. Consejo: cumple proteina y entrena hoy. Animo: disciplina supera motivacion."
  };

  return NextResponse.json({
    assistant: "NUTRI_MUZY_AI",
    message: responseByLanguage[language] ?? responseByLanguage.en,
    vipWhatsAppEnabled: Boolean(payload.isVip)
  });
}

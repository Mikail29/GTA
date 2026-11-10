import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/knowledge";
import { AiProviderError } from "@/lib/ai/types";
import { chatRequestSchema, CHAT_MAX_HISTORY } from "@/lib/validations/chat";
import { clientKey, rateLimit } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 40_000;

function error(status: number, code: string, message: string, extraHeaders?: Record<string, string>) {
  return NextResponse.json({ error: { code, message } }, { status, headers: extraHeaders });
}

/** Statusabfrage: Ist ein KI-Anbieter eingerichtet? (verrät keine Details) */
export async function GET() {
  return NextResponse.json({ configured: getAiProvider() !== null });
}

export async function POST(request: Request) {
  // Nur Anfragen von der eigenen Seite zulassen (einfacher CSRF-/Missbrauchsschutz)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return error(403, "forbidden", "Anfrage nicht erlaubt.");
  }

  const provider = getAiProvider();
  if (!provider) {
    return error(503, "not_configured", "Der KI-Assistent ist noch nicht eingerichtet. Sobald ein KI-Anbieter konfiguriert ist, beantwortet er hier deine Fragen.");
  }

  const limit = Number(process.env.AI_RATE_LIMIT_PER_MINUTE) || 8;
  const rl = rateLimit(`ki:${clientKey(request.headers)}`, limit, 60_000);
  if (!rl.ok) {
    return error(429, "rate_limited", `Zu viele Anfragen. Bitte warte ${rl.retryAfter} Sekunden.`, { "Retry-After": String(rl.retryAfter) });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return error(413, "too_large", "Die Anfrage ist zu groß.");

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return error(400, "invalid_json", "Ungültige Anfrage.");
  }
  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return error(400, "invalid_input", parsed.error.issues[0]?.message ?? "Ungültige Eingabe.");
  }

  // Nur die letzten Nachrichten mitsenden; der Verlauf muss mit einer Nutzernachricht beginnen
  let messages = parsed.data.messages.slice(-CHAT_MAX_HISTORY);
  while (messages.length && messages[0].role !== "user") messages = messages.slice(1);
  const question = messages[messages.length - 1].content;

  try {
    const answer = await provider.generate({ system: buildSystemPrompt(question), messages, signal: request.signal });
    return NextResponse.json({ answer });
  } catch (e) {
    if (e instanceof AiProviderError) {
      const map = {
        auth: [503, "Der KI-Assistent ist falsch konfiguriert. Bitte informiere die Betreiber."],
        rate_limit: [429, "Der KI-Dienst ist gerade ausgelastet. Bitte versuche es gleich noch einmal."],
        unavailable: [503, "Der KI-Dienst ist momentan nicht erreichbar. Bitte versuche es später erneut."],
        refusal: [422, "Zu dieser Anfrage kann ich leider keine Antwort geben."],
        unknown: [500, "Es ist ein unerwarteter Fehler aufgetreten."],
      } as const;
      const [status, message] = map[e.kind];
      return error(status, e.kind, message);
    }
    return error(500, "unknown", "Es ist ein unerwarteter Fehler aufgetreten.");
  }
}

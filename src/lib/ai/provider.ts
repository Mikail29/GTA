import "server-only";
import { createAnthropicProvider } from "./anthropic";
import type { AiProvider } from "./types";

/**
 * Wählt den KI-Anbieter anhand von Umgebungsvariablen.
 * Weitere Anbieter können hier ergänzt werden, solange sie AiProvider implementieren.
 * Gibt null zurück, wenn keine KI konfiguriert ist (der Chat zeigt dann eine Hinweis-Meldung).
 */
export function getAiProvider(): AiProvider | null {
  const provider = (process.env.AI_PROVIDER ?? "none").trim().toLowerCase();
  switch (provider) {
    case "anthropic": {
      const key = process.env.ANTHROPIC_API_KEY?.trim();
      return key ? createAnthropicProvider(key) : null;
    }
    default:
      return null;
  }
}

export function isAiConfigured() {
  return getAiProvider() !== null;
}

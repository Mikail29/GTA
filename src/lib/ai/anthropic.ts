import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { AiProviderError, type AiProvider, type ChatMessage } from "./types";

const DEFAULT_MODEL = "claude-opus-5-5";

/**
 * Adapter für die Claude API von Anthropic.
 * Der API-Schlüssel wird ausschließlich serverseitig aus ANTHROPIC_API_KEY gelesen.
 */
export function createAnthropicProvider(apiKey: string): AiProvider {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 60_000 });
  const model = process.env.AI_MODEL?.trim() || DEFAULT_MODEL;

  return {
    id: "anthropic",
    async generate({ system, messages, signal }: { system: string; messages: ChatMessage[]; signal?: AbortSignal }) {
      try {
        const response = await client.beta.messages.create(
          {
            model,
            max_tokens: 2000,
            system,
            messages,
            // Chat-Antworten: geringer Aufwand reicht und hält Kosten/Latenz niedrig
            output_config: { effort: "low" },
            // Bei einer Ablehnung durch Sicherheitsfilter automatisch auf ein Ersatzmodell ausweichen
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
          },
          { signal },
        );

        if (response.stop_reason === "refusal") {
          throw new AiProviderError("Die Anfrage wurde abgelehnt.", "refusal");
        }
        const text = response.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return text || "Dazu kann ich leider keine Antwort geben.";
      } catch (error) {
        if (error instanceof AiProviderError) throw error;
        if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
          throw new AiProviderError("Ungültiger API-Schlüssel.", "auth");
        }
        if (error instanceof Anthropic.RateLimitError) throw new AiProviderError("Rate-Limit des Anbieters erreicht.", "rate_limit");
        if (error instanceof Anthropic.APIConnectionError || (error instanceof Anthropic.APIError && (error.status ?? 0) >= 500)) {
          throw new AiProviderError("KI-Dienst nicht erreichbar.", "unavailable");
        }
        throw new AiProviderError("Unbekannter Fehler beim KI-Dienst.", "unknown");
      }
    },
  };
}

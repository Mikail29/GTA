export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Gemeinsame Schnittstelle für alle KI-Anbieter (Adapter-Muster). */
export interface AiProvider {
  readonly id: string;
  generate(input: { system: string; messages: ChatMessage[]; signal?: AbortSignal }): Promise<string>;
}

export class AiProviderError extends Error {
  constructor(
    message: string,
    readonly kind: "auth" | "rate_limit" | "unavailable" | "refusal" | "unknown",
  ) {
    super(message);
  }
}

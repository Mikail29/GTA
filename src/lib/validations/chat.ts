import { z } from "zod";

export const CHAT_MAX_MESSAGE_LENGTH = 1000;
export const CHAT_MAX_HISTORY = 12;

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(CHAT_MAX_MESSAGE_LENGTH * 4),
      }),
    )
    .min(1)
    .max(CHAT_MAX_HISTORY * 2)
    .refine((m) => m[m.length - 1].role === "user", "Die letzte Nachricht muss vom Nutzer stammen.")
    .refine((m) => m[m.length - 1].content.length <= CHAT_MAX_MESSAGE_LENGTH, `Nachrichten dürfen höchstens ${CHAT_MAX_MESSAGE_LENGTH} Zeichen lang sein.`),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

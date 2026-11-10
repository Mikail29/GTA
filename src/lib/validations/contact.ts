import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen an.").max(80),
  subject: z.string().trim().min(3, "Bitte gib einen Betreff an.").max(120),
  message: z.string().trim().min(20, "Die Nachricht muss mindestens 20 Zeichen lang sein.").max(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;

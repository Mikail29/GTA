import { z } from "zod";
import { communityCategories } from "@/data/categories";

const categorySlugs = communityCategories.map((c) => c.slug) as [string, ...string[]];

/** Entfernt Steuerzeichen (außer Zeilenumbrüchen) aus Nutzereingaben. */
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

export const questionSchema = z.object({
  title: z.string().transform(clean).pipe(z.string().min(10, "Der Titel muss mindestens 10 Zeichen lang sein.").max(140, "Der Titel darf höchstens 140 Zeichen lang sein.")),
  body: z.string().transform(clean).pipe(z.string().min(20, "Bitte beschreibe deine Frage mit mindestens 20 Zeichen.").max(5000, "Die Frage darf höchstens 5000 Zeichen lang sein.")),
  category: z.enum(categorySlugs, { message: "Bitte wähle eine Kategorie." }),
  website: z.string().max(0).optional(),
});

export const answerSchema = z.object({
  questionId: z.string().uuid("Ungültige Frage."),
  body: z.string().transform(clean).pipe(z.string().min(5, "Die Antwort muss mindestens 5 Zeichen lang sein.").max(5000, "Die Antwort darf höchstens 5000 Zeichen lang sein.")),
  website: z.string().max(0).optional(),
});

export const commentSchema = z.object({
  answerId: z.string().uuid(),
  body: z.string().transform(clean).pipe(z.string().min(2, "Der Kommentar ist zu kurz.").max(1000, "Der Kommentar darf höchstens 1000 Zeichen lang sein.")),
});

export const reportReasons = ["spam", "beleidigung", "spoiler", "falschinfo", "illegal", "sonstiges"] as const;
export const reportReasonLabels: Record<(typeof reportReasons)[number], string> = {
  spam: "Spam oder Werbung",
  beleidigung: "Beleidigung oder Belästigung",
  spoiler: "Unmarkierte Spoiler",
  falschinfo: "Bewusste Falschinformation",
  illegal: "Rechtswidriger Inhalt",
  sonstiges: "Sonstiges",
};

export const reportSchema = z.object({
  targetType: z.enum(["question", "answer", "comment"]),
  targetId: z.string().uuid(),
  reason: z.enum(reportReasons),
  details: z.string().transform(clean).pipe(z.string().max(500)).optional(),
  goodFaith: z.literal(true, { message: "Bitte bestätige, dass deine Angaben nach bestem Wissen richtig sind." }),
});

/** Meldung ohne Konto (Digital Services Act, Art. 16). */
export const guestReportSchema = reportSchema.extend({
  email: z.union([z.literal(""), z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein.").max(254)]).optional(),
  website: z.string().max(0).optional(),
});

/** Gründe, die Moderatoren beim Ausblenden angeben können. */
export const moderationReasons = [
  "Spam oder Werbung",
  "Beleidigung oder Belästigung",
  "Unmarkierte Spoiler",
  "Bewusste Falschinformation",
  "Rechtswidriger Inhalt",
  "Verstoß gegen die Community-Regeln",
] as const;

export type QuestionInput = z.input<typeof questionSchema>;
export type AnswerInput = z.input<typeof answerSchema>;

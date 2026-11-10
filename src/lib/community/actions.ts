"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSession, hasRole } from "@/lib/auth/session";
import { rateLimit } from "@/lib/utils/rate-limit";
import { answerSchema, commentSchema, questionSchema, reportSchema, type AnswerInput, type QuestionInput } from "@/lib/validations/community";

export interface CommunityResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

const idSchema = z.string().uuid();

/**
 * Gemeinsame Vorbedingungen für alle schreibenden Aktionen:
 * Supabase konfiguriert, Nutzer serverseitig angemeldet, Profil vorhanden, nicht gesperrt.
 * Die Datenbank setzt dieselben Regeln zusätzlich per Row Level Security durch.
 */
async function requireWriter() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Die Community ist noch nicht mit einer Datenbank verbunden (Demo-Modus)." } as const;
  const session = await getSession();
  if (!session) return { error: "Bitte melde dich an, um Beiträge zu veröffentlichen." } as const;
  if (!session.profile) return { error: "Dein Profil konnte nicht geladen werden. Bitte melde dich erneut an." } as const;
  if (session.profile.is_banned) return { error: "Dein Konto ist für Beiträge gesperrt." } as const;
  return { supabase, session } as const;
}

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) out[String(i.path[0] ?? "form")] ??= i.message;
  return out;
}

function tooFast(userId: string, scope: string, limit: number, windowMs: number) {
  return !rateLimit(`${scope}:${userId}`, limit, windowMs).ok;
}

/** Übersetzt Datenbankfehler in verständliche Meldungen. */
function dbMessage(error: { message?: string; code?: string } | null, fallback: string) {
  if (error?.message?.includes("rate_limit")) return "Du schreibst gerade sehr schnell. Bitte warte kurz, bevor du erneut postest.";
  if (error?.code === "42501") return "Dafür fehlen dir die Berechtigungen.";
  return fallback;
}

export async function createQuestionAction(input: QuestionInput): Promise<CommunityResult> {
  const parsed = questionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };
  if (input.website) return { ok: false, message: "Ungültige Anfrage." }; // Honeypot

  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  if (tooFast(ctx.session.userId, "question", 3, 10 * 60_000)) return { ok: false, message: "Du hast in kurzer Zeit viele Fragen gestellt. Bitte warte ein paar Minuten." };

  const { data, error } = await ctx.supabase
    .from("questions")
    .insert({ title: parsed.data.title, body: parsed.data.body, category: parsed.data.category, author_id: ctx.session.userId })
    .select("id")
    .single();
  if (error || !data) return { ok: false, message: dbMessage(error, "Die Frage konnte nicht gespeichert werden.") };

  revalidatePath("/fragen");
  revalidatePath("/community");
  redirect(`/fragen/${data.id}`);
}

export async function updateQuestionAction(id: string, input: QuestionInput): Promise<CommunityResult> {
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Ungültige Frage." };
  const parsed = questionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };

  // RLS erlaubt Updates nur für eigene Beiträge (oder Moderation). Zusätzlich hier geprüft:
  const { data: existing } = await ctx.supabase.from("questions").select("author_id").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "Frage nicht gefunden." };
  if (existing.author_id !== ctx.session.userId && !hasRole(ctx.session, "moderator")) return { ok: false, message: "Du darfst nur eigene Fragen bearbeiten." };

  const { error } = await ctx.supabase
    .from("questions")
    .update({ title: parsed.data.title, body: parsed.data.body, category: parsed.data.category })
    .eq("id", id);
  if (error) return { ok: false, message: dbMessage(error, "Die Änderungen konnten nicht gespeichert werden.") };
  revalidatePath(`/fragen/${id}`);
  redirect(`/fragen/${id}`);
}

export async function deleteQuestionAction(id: string): Promise<CommunityResult> {
  if (!idSchema.safeParse(id).success) return { ok: false, message: "Ungültige Frage." };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  const { data: existing } = await ctx.supabase.from("questions").select("author_id").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "Frage nicht gefunden." };
  if (existing.author_id !== ctx.session.userId && !hasRole(ctx.session, "moderator")) return { ok: false, message: "Du darfst nur eigene Fragen löschen." };

  const { error } = await ctx.supabase.from("questions").delete().eq("id", id);
  if (error) return { ok: false, message: dbMessage(error, "Die Frage konnte nicht gelöscht werden.") };
  revalidatePath("/fragen");
  redirect("/fragen?geloescht=1");
}

export async function createAnswerAction(input: AnswerInput): Promise<CommunityResult> {
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };
  if (input.website) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  if (tooFast(ctx.session.userId, "answer", 6, 5 * 60_000)) return { ok: false, message: "Bitte warte kurz, bevor du erneut antwortest." };

  const { error } = await ctx.supabase.from("answers").insert({ question_id: parsed.data.questionId, body: parsed.data.body, author_id: ctx.session.userId });
  if (error) return { ok: false, message: dbMessage(error, "Die Antwort konnte nicht gespeichert werden.") };
  revalidatePath(`/fragen/${parsed.data.questionId}`);
  return { ok: true, message: "Antwort veröffentlicht." };
}

export async function updateAnswerAction(id: string, questionId: string, body: string): Promise<CommunityResult> {
  const parsed = answerSchema.safeParse({ questionId, body });
  if (!idSchema.safeParse(id).success || !parsed.success) return { ok: false, message: parsed.success ? "Ungültige Antwort." : parsed.error.issues[0].message };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  const { data: existing } = await ctx.supabase.from("answers").select("author_id").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "Antwort nicht gefunden." };
  if (existing.author_id !== ctx.session.userId && !hasRole(ctx.session, "moderator")) return { ok: false, message: "Du darfst nur eigene Antworten bearbeiten." };

  const { error } = await ctx.supabase.from("answers").update({ body: parsed.data.body }).eq("id", id);
  if (error) return { ok: false, message: dbMessage(error, "Die Änderungen konnten nicht gespeichert werden.") };
  revalidatePath(`/fragen/${questionId}`);
  return { ok: true, message: "Antwort aktualisiert." };
}

export async function deleteAnswerAction(id: string, questionId: string): Promise<CommunityResult> {
  if (!idSchema.safeParse(id).success || !idSchema.safeParse(questionId).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  const { data: existing } = await ctx.supabase.from("answers").select("author_id").eq("id", id).maybeSingle();
  if (!existing) return { ok: false, message: "Antwort nicht gefunden." };
  if (existing.author_id !== ctx.session.userId && !hasRole(ctx.session, "moderator")) return { ok: false, message: "Du darfst nur eigene Antworten löschen." };

  const { error } = await ctx.supabase.from("answers").delete().eq("id", id);
  if (error) return { ok: false, message: dbMessage(error, "Die Antwort konnte nicht gelöscht werden.") };
  revalidatePath(`/fragen/${questionId}`);
  return { ok: true, message: "Antwort gelöscht." };
}

export async function createCommentAction(answerId: string, questionId: string, body: string): Promise<CommunityResult> {
  const parsed = commentSchema.safeParse({ answerId, body });
  if (!parsed.success || !idSchema.safeParse(questionId).success) return { ok: false, message: parsed.success ? "Ungültige Anfrage." : parsed.error.issues[0].message };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  if (tooFast(ctx.session.userId, "comment", 10, 5 * 60_000)) return { ok: false, message: "Bitte warte kurz, bevor du erneut kommentierst." };

  const { error } = await ctx.supabase.from("comments").insert({ answer_id: answerId, body: parsed.data.body, author_id: ctx.session.userId });
  if (error) return { ok: false, message: dbMessage(error, "Der Kommentar konnte nicht gespeichert werden.") };
  revalidatePath(`/fragen/${questionId}`);
  return { ok: true, message: "Kommentar veröffentlicht." };
}

export async function deleteCommentAction(id: string, questionId: string): Promise<CommunityResult> {
  if (!idSchema.safeParse(id).success || !idSchema.safeParse(questionId).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  const { error } = await ctx.supabase.from("comments").delete().eq("id", id);
  if (error) return { ok: false, message: dbMessage(error, "Der Kommentar konnte nicht gelöscht werden.") };
  revalidatePath(`/fragen/${questionId}`);
  return { ok: true, message: "Kommentar gelöscht." };
}

export async function toggleLikeAction(targetType: "question" | "answer", targetId: string, questionId: string): Promise<CommunityResult & { liked?: boolean }> {
  if (!["question", "answer"].includes(targetType) || !idSchema.safeParse(targetId).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  if (tooFast(ctx.session.userId, "like", 60, 60_000)) return { ok: false, message: "Zu viele Aktionen. Bitte warte kurz." };

  const { data: existing } = await ctx.supabase.from("likes").select("id").eq("user_id", ctx.session.userId).eq("target_type", targetType).eq("target_id", targetId).maybeSingle();
  if (existing) {
    await ctx.supabase.from("likes").delete().eq("id", existing.id);
  } else {
    const { error } = await ctx.supabase.from("likes").insert({ user_id: ctx.session.userId, target_type: targetType, target_id: targetId });
    if (error && error.code !== "23505") return { ok: false, message: "Like konnte nicht gespeichert werden." };
  }
  revalidatePath(`/fragen/${questionId}`);
  return { ok: true, message: existing ? "Like entfernt." : "Gefällt dir.", liked: !existing };
}

export async function reportAction(input: { targetType: string; targetId: string; reason: string; details?: string }): Promise<CommunityResult> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte wähle einen Grund aus." };
  const ctx = await requireWriter();
  if ("error" in ctx) return { ok: false, message: ctx.error! };
  if (tooFast(ctx.session.userId, "report", 10, 60 * 60_000)) return { ok: false, message: "Du hast bereits viele Meldungen gesendet. Danke! Bitte versuche es später erneut." };

  const { error } = await ctx.supabase.from("reports").insert({
    reporter_id: ctx.session.userId,
    target_type: parsed.data.targetType,
    target_id: parsed.data.targetId,
    reason: parsed.data.reason,
    details: parsed.data.details || null,
  });
  if (error?.code === "23505") return { ok: true, message: "Du hast diesen Inhalt bereits gemeldet. Danke!" };
  if (error) return { ok: false, message: "Die Meldung konnte nicht gesendet werden." };
  return { ok: true, message: "Danke! Das Moderationsteam prüft die Meldung." };
}

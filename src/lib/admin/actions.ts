"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSession, hasRole } from "@/lib/auth/session";
import type { UserRole } from "@/types/community";

export interface AdminResult {
  ok: boolean;
  message: string;
}

const uuid = z.string().uuid();

async function staff(minimum: UserRole) {
  const supabase = await createSupabaseServerClient();
  const session = await getSession();
  if (!supabase || !session || !hasRole(session, minimum)) return null;
  return { supabase, session };
}

const DENIED: AdminResult = { ok: false, message: "Keine Berechtigung." };

/** Inhalte aus- oder einblenden (Moderation). */
export async function setHiddenAction(table: "questions" | "answers" | "comments", id: string, hidden: boolean): Promise<AdminResult> {
  if (!["questions", "answers", "comments"].includes(table) || !uuid.safeParse(id).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("moderator");
  if (!ctx) return DENIED;
  const { error } = await ctx.supabase.rpc("moderate_set_hidden", { target_table: table, target_id: id, hidden });
  if (error) return { ok: false, message: "Aktion fehlgeschlagen." };
  revalidatePath("/admin", "layout");
  revalidatePath("/fragen");
  return { ok: true, message: hidden ? "Inhalt ausgeblendet." : "Inhalt wieder sichtbar." };
}

export async function setQuestionStatusAction(id: string, status: "offen" | "beantwortet" | "geschlossen"): Promise<AdminResult> {
  if (!uuid.safeParse(id).success || !["offen", "beantwortet", "geschlossen"].includes(status)) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("moderator");
  if (!ctx) return DENIED;
  const { error } = await ctx.supabase.from("questions").update({ status }).eq("id", id);
  if (error) return { ok: false, message: "Aktion fehlgeschlagen." };
  revalidatePath("/admin", "layout");
  revalidatePath(`/fragen/${id}`);
  return { ok: true, message: "Status geändert." };
}

export async function resolveReportAction(id: string, status: "erledigt" | "abgelehnt"): Promise<AdminResult> {
  if (!uuid.safeParse(id).success || !["erledigt", "abgelehnt"].includes(status)) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("moderator");
  if (!ctx) return DENIED;
  const { error } = await ctx.supabase.from("reports").update({ status, resolved_by: ctx.session.userId, resolved_at: new Date().toISOString() }).eq("id", id);
  if (error) return { ok: false, message: "Aktion fehlgeschlagen." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Meldung bearbeitet." };
}

/** Rollen ändern – nur Administratoren. Die Datenbankfunktion prüft die Rolle zusätzlich. */
export async function setUserRoleAction(userId: string, role: UserRole): Promise<AdminResult> {
  if (!uuid.safeParse(userId).success || !["user", "moderator", "admin"].includes(role)) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("admin");
  if (!ctx) return DENIED;
  if (userId === ctx.session.userId) return { ok: false, message: "Du kannst deine eigene Rolle nicht ändern." };
  const { error } = await ctx.supabase.rpc("admin_set_role", { target_user: userId, new_role: role });
  if (error) return { ok: false, message: "Rolle konnte nicht geändert werden." };
  revalidatePath("/admin/nutzer");
  return { ok: true, message: "Rolle geändert." };
}

export async function setUserBannedAction(userId: string, banned: boolean): Promise<AdminResult> {
  if (!uuid.safeParse(userId).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("moderator");
  if (!ctx) return DENIED;
  if (userId === ctx.session.userId) return { ok: false, message: "Du kannst dich nicht selbst sperren." };
  const { error } = await ctx.supabase.rpc("moderate_set_banned", { target_user: userId, banned });
  if (error) return { ok: false, message: "Aktion fehlgeschlagen." };
  revalidatePath("/admin/nutzer");
  return { ok: true, message: banned ? "Nutzer gesperrt." : "Sperre aufgehoben." };
}

export async function setArticlePublishedAction(id: string, published: boolean): Promise<AdminResult> {
  if (!uuid.safeParse(id).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("admin");
  if (!ctx) return DENIED;
  const { error } = await ctx.supabase
    .from("articles")
    .update({ is_published: published, published_at: published ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return { ok: false, message: "Aktion fehlgeschlagen." };
  revalidatePath("/admin/inhalte");
  return { ok: true, message: published ? "Artikel veröffentlicht." : "Artikel zurückgezogen." };
}

const categorySchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9-]{2,40}$/, "Slug: 2–40 Kleinbuchstaben, Zahlen oder -"),
  name: z.string().trim().min(2).max(60),
  section: z.enum(["artikel", "missionen", "geheimnisse", "community"]),
});

export async function createCategoryAction(input: { slug: string; name: string; section: string }): Promise<AdminResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const ctx = await staff("admin");
  if (!ctx) return DENIED;
  const { error } = await ctx.supabase.from("categories").insert(parsed.data);
  if (error) return { ok: false, message: error.code === "23505" ? "Diese Kategorie existiert bereits." : "Kategorie konnte nicht angelegt werden." };
  revalidatePath("/admin/inhalte");
  return { ok: true, message: "Kategorie angelegt." };
}

export async function deleteCategoryAction(id: string): Promise<AdminResult> {
  if (!uuid.safeParse(id).success) return { ok: false, message: "Ungültige Anfrage." };
  const ctx = await staff("admin");
  if (!ctx) return DENIED;
  const { error } = await ctx.supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, message: "Kategorie konnte nicht gelöscht werden (wird evtl. noch verwendet)." };
  revalidatePath("/admin/inhalte");
  return { ok: true, message: "Kategorie gelöscht." };
}

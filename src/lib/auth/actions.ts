"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { clientKey, rateLimit } from "@/lib/utils/rate-limit";
import { siteConfig } from "@/lib/site";
import {
  forgotPasswordSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type ProfileInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

export interface ActionResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Die Anmeldung ist noch nicht eingerichtet. Bitte Supabase konfigurieren (siehe README).",
};

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const key = String(i.path[0] ?? "form");
    out[key] ??= i.message;
  }
  return out;
}

async function limited(scope: string, limit: number, windowMs: number) {
  const key = `${scope}:${clientKey(await headers())}`;
  return !rateLimit(key, limit, windowMs).ok;
}

/** Erlaubt nur interne Weiterleitungen (Schutz vor Open Redirects). */
function safeNext(next: unknown) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/profil";
}

export async function signInAction(input: LoginInput, next?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };
  if (await limited("login", 10, 10 * 60_000)) return { ok: false, message: "Zu viele Anmeldeversuche. Bitte warte einige Minuten." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    // Bewusst allgemeine Meldung, um keine Konten-Existenz preiszugeben
    if (error.code === "email_not_confirmed") return { ok: false, message: "Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail." };
    return { ok: false, message: "E-Mail-Adresse oder Passwort ist falsch." };
  }
  revalidatePath("/", "layout");
  redirect(safeNext(next));
}

export async function signUpAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };
  if (await limited("signup", 5, 60 * 60_000)) return { ok: false, message: "Zu viele Registrierungen von diesem Anschluss. Bitte versuche es später erneut." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;

  const { data: available } = await supabase.rpc("username_available", { name: parsed.data.username });
  if (available === false) return { ok: false, message: "Dieser Benutzername ist bereits vergeben.", fieldErrors: { username: "Dieser Benutzername ist bereits vergeben." } };

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
      emailRedirectTo: `${siteConfig.url}/auth/callback?next=/profil`,
    },
  });
  if (error) {
    if (error.code === "weak_password") return { ok: false, message: "Das Passwort ist zu schwach.", fieldErrors: { password: "Bitte wähle ein stärkeres Passwort." } };
    return { ok: false, message: "Die Registrierung ist fehlgeschlagen. Bitte versuche es später erneut." };
  }
  return { ok: true, message: "Fast geschafft! Wir haben dir eine E-Mail geschickt. Bitte bestätige deine Adresse über den Link darin." };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };
  if (await limited("forgot", 5, 60 * 60_000)) return { ok: false, message: "Zu viele Anfragen. Bitte versuche es später erneut." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteConfig.url}/auth/callback?next=/passwort-neu`,
  });
  // Immer gleiche Antwort – verrät nicht, ob ein Konto existiert
  return { ok: true, message: "Falls ein Konto mit dieser Adresse existiert, erhältst du in Kürze eine E-Mail mit einem Link zum Zurücksetzen." };
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;
  const session = await getSession();
  if (!session) return { ok: false, message: "Der Link ist abgelaufen. Bitte fordere einen neuen an." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, message: "Das Passwort konnte nicht geändert werden. Bitte versuche es erneut." };
  return { ok: true, message: "Dein Passwort wurde geändert." };
}

export async function updateProfileAction(input: ProfileInput): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte prüfe deine Eingaben.", fieldErrors: fieldErrors(parsed.error.issues) };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;
  const session = await getSession();
  if (!session) return { ok: false, message: "Bitte melde dich erneut an." };

  // Nur erlaubte Spalten – die Rolle kann hier (und per RLS/Spaltenrechten) nicht geändert werden
  const { error } = await supabase
    .from("profiles")
    .update({ username: parsed.data.username, bio: parsed.data.bio || null })
    .eq("id", session.userId);

  if (error) {
    if (error.code === "23505") return { ok: false, message: "Dieser Benutzername ist bereits vergeben.", fieldErrors: { username: "Bereits vergeben." } };
    return { ok: false, message: "Das Profil konnte nicht gespeichert werden." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Profil gespeichert." };
}

const AVATAR_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export async function uploadAvatarAction(formData: FormData): Promise<ActionResult> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Bitte wähle ein Bild aus." };
  const ext = AVATAR_TYPES[file.type];
  if (!ext) return { ok: false, message: "Erlaubt sind PNG, JPG und WebP." };
  if (file.size > AVATAR_MAX_BYTES) return { ok: false, message: "Das Bild darf höchstens 2 MB groß sein." };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NOT_CONFIGURED;
  const session = await getSession();
  if (!session) return { ok: false, message: "Bitte melde dich erneut an." };
  if (await limited(`avatar:${session.userId}`, 5, 60 * 60_000)) return { ok: false, message: "Zu viele Uploads. Bitte versuche es später erneut." };

  const path = `${session.userId}/avatar-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return { ok: false, message: "Der Upload ist fehlgeschlagen." };

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const { error } = await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", session.userId);
  if (error) return { ok: false, message: "Das Profilbild konnte nicht gespeichert werden." };

  revalidatePath("/", "layout");
  return { ok: true, message: "Profilbild aktualisiert." };
}

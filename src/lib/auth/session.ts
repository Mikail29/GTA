import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/community";

export interface SessionInfo {
  userId: string;
  email: string | null;
  profile: Profile | null;
}

/**
 * Liest den angemeldeten Nutzer serverseitig aus.
 * getUser() prüft das Token beim Supabase-Auth-Server und vertraut
 * nicht blind dem Cookie-Inhalt. Das Profil (inkl. Rolle) wird aus der
 * Datenbank gelesen – nie aus Client-Daten.
 */
export const getSession = cache(async (): Promise<SessionInfo | null> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, bio, role, is_banned, created_at")
    .eq("id", data.user.id)
    .maybeSingle<Profile>();

  return { userId: data.user.id, email: data.user.email ?? null, profile: profile ?? null };
});

const rank: Record<UserRole, number> = { user: 1, moderator: 2, admin: 3 };

export function hasRole(session: SessionInfo | null, minimum: UserRole) {
  const role = session?.profile?.role;
  return Boolean(role && rank[role] >= rank[minimum]);
}

/** Leitet nicht angemeldete Nutzer zum Login weiter. */
export async function requireUser(next = "/profil") {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`);
  return session;
}

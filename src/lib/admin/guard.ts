import "server-only";
import { notFound, redirect } from "next/navigation";
import { getSession, hasRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/community";

/**
 * Serverseitiger Zugriffsschutz für den Admin-Bereich.
 * Die Rolle stammt aus der Tabelle profiles (per RLS/Spaltenrechten vor
 * Selbständerung geschützt) – niemals aus Cookies oder Client-Daten.
 */
export async function requireStaff(minimum: UserRole = "moderator") {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { supabase: null, session: null } as const;
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  // Unberechtigte bekommen eine 404 – der Bereich wird nicht verraten
  if (!hasRole(session, minimum)) notFound();
  return { supabase, session } as const;
}

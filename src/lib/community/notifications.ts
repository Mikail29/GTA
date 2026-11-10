import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Notification {
  id: string;
  kind: "moderation" | "sperre" | "meldung" | "info";
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export async function listNotifications(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("notifications")
    .select("id, kind, message, link, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<Notification[]>();
  return data ?? [];
}

export async function countUnread(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;
  const { count } = await supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null);
  return count ?? 0;
}

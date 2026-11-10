import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Supabase-Client für Server Components, Server Actions und Route Handler.
 * Verwendet ausschließlich den öffentlichen Anon-Key – alle Rechte werden
 * durch Row Level Security in der Datenbank durchgesetzt.
 * Gibt null zurück, wenn Supabase nicht konfiguriert ist.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // In Server Components dürfen keine Cookies gesetzt werden.
          // Die Session wird stattdessen im Proxy (src/proxy.ts) aktualisiert.
        }
      },
    },
  });
}

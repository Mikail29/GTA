/**
 * Prüft, ob die öffentlichen Supabase-Variablen gesetzt sind.
 * Ohne Supabase läuft die Seite im Demo-Modus (nur lesend).
 */
export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

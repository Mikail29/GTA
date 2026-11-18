/**
 * Prüft, ob die öffentlichen Supabase-Variablen gesetzt sind.
 * Ohne Supabase läuft die Seite im Demo-Modus (nur lesend).
 */
/**
 * Adresse des Supabase-Projekts – immer nur der Grundteil (z. B. https://abc.supabase.co).
 * Wurde in den Einstellungen versehentlich mehr eingetragen (etwa „…/rest/v1/“ aus der API-Seite),
 * wird der Rest abgeschnitten. Sonst landen alle Anfragen an der Datenbank im Leeren (Fehler 404).
 */
export function supabaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

import { Notice } from "@/components/ui/notice";

export function AuthNotConfigured() {
  return (
    <Notice tone="research" title="Anmeldung noch nicht eingerichtet">
      Die Benutzerkonten werden über Supabase bereitgestellt. Sobald die Umgebungsvariablen <code>NEXT_PUBLIC_SUPABASE_URL</code> und <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> gesetzt sind, funktioniert
      dieses Formular. Eine Anleitung steht in der README.
    </Notice>
  );
}

import { Notice } from "@/components/ui/notice";

export function CommunityDemoNotice() {
  return (
    <Notice tone="research" title="Demo-Modus">
      Die Community ist noch nicht mit einer Datenbank verbunden. Du siehst Beispielbeiträge; Registrierung, Fragen und Antworten werden aktiv, sobald Supabase eingerichtet ist (siehe README).
    </Notice>
  );
}

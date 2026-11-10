import type { Metadata } from "next";
import { BookCheck, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ChatInterface } from "@/components/chat/chat-interface";
import { isAiConfigured } from "@/lib/ai/provider";

export const metadata: Metadata = {
  title: "GTA6-Kompass KI – der KI-Assistent",
  description: "Stelle deine Fragen zu GTA 6 und erhalte hilfreiche Antworten – auf Basis der geprüften Wissensdatenbank von GTA6-Kompass.",
  alternates: { canonical: "/ki-assistent" },
};

export const dynamic = "force-dynamic";

export default function KiAssistentPage() {
  const configured = isAiConfigured();
  return (
    <>
      <PageHeader eyebrow="KI-Assistent" title="GTA6-Kompass KI" text="Stelle deine Fragen zu GTA 6 und erhalte hilfreiche Antworten." crumbs={[{ label: "KI-Assistent" }]} />
      <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <ChatInterface configured={configured} />
        <aside className="grid content-start gap-4">
          {[
            { Icon: BookCheck, title: "Eigene Wissensdatenbank", text: "Antworten stützen sich auf Inhalte von GTA6-Kompass – inklusive Verifizierungsstatus." },
            { Icon: Sparkles, title: "Ehrlich bei Unbekanntem", text: "Ist etwas noch nicht bestätigt, sagt die KI das offen, statt zu raten." },
            { Icon: ShieldCheck, title: "Datenschutz", text: "Der Verlauf bleibt nur in diesem Browser-Tab. Bitte gib keine persönlichen Daten ein." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="surface p-5">
              <Icon className="mb-2 size-5 text-teal" aria-hidden="true" />
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
          <p className="text-xs text-muted">KI-Antworten können Fehler enthalten. Prüfe wichtige Informationen in unseren Ratgebern oder bei offiziellen Quellen.</p>
        </aside>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { ReportForm } from "@/components/forms/report-form";
import { isSupabaseConfigured } from "@/lib/env";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = {
  title: "Inhalt melden",
  description: "Melde rechtswidrige oder regelwidrige Inhalte auf GTA6-Kompass – auch ohne Konto.",
  alternates: { canonical: "/melden" },
};

export default async function MeldenPage({ searchParams }: { searchParams: SearchParams }) {
  const link = param((await searchParams).link, 300) ?? "";
  return (
    <>
      <PageHeader title="Inhalt melden" text="Du hast einen rechtswidrigen oder regelwidrigen Beitrag entdeckt? Melde ihn hier – ein Konto ist nicht nötig." crumbs={[{ label: "Inhalt melden" }]} />
      <Container className="grid max-w-5xl gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <div className="surface p-6">
          {isSupabaseConfigured() ? (
            <ReportForm initialLink={link} />
          ) : (
            <Notice tone="research" title="Noch nicht verfügbar">
              Die Community ist noch nicht mit der Datenbank verbunden. Bis dahin erreichst du uns über die{" "}
              <Link href="/kontakt" className="text-teal underline">
                Kontaktseite
              </Link>
              .
            </Notice>
          )}
        </div>
        <aside className="grid content-start gap-4 text-sm">
          <div className="surface p-5">
            <h2 className="font-semibold">So geht es weiter</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-muted">
              <li>Das Moderationsteam prüft deine Meldung so schnell wie möglich.</li>
              <li>Verstößt der Inhalt gegen Recht oder Regeln, wird er ausgeblendet oder gelöscht.</li>
              <li>Die betroffene Person erhält eine Begründung.</li>
              <li>Mit Konto oder E-Mail-Adresse informieren wir dich über das Ergebnis.</li>
            </ol>
          </div>
          <div className="surface p-5">
            <h2 className="font-semibold">Schneller geht&apos;s direkt am Beitrag</h2>
            <p className="mt-1 text-muted">Unter jeder Frage, Antwort und jedem Kommentar findest du den Button „Melden“.</p>
          </div>
          <p className="text-xs text-muted">
            Details in den{" "}
            <Link href="/nutzungsbedingungen#melden" className="text-teal underline">
              Nutzungsbedingungen
            </Link>{" "}
            und der{" "}
            <Link href="/datenschutz#meldungen" className="text-teal underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </aside>
      </Container>
    </>
  );
}

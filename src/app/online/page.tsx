import type { Metadata } from "next";
import { Bell, Clock, Newspaper, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "GTA 6 Online",
  description: "Der Bereich zu GTA 6 Online auf dem 5-Sterne-Kompass – momentan noch nicht verfügbar. Sobald GTA 6 Online erscheint, erstellen wir hier Ratgeber und Hilfen.",
  alternates: { canonical: "/online" },
};

export default function OnlinePage() {
  return (
    <>
      <PageHeader eyebrow="Online-Modus" title="GTA 6 Online" crumbs={[{ label: "GTA 6 Online" }]}>
        <p className="inline-flex items-center gap-2 rounded-full border border-sunset/40 bg-sunset/10 px-4 py-2 text-sm font-semibold text-sunset">
          <Clock className="size-4" aria-hidden="true" /> Momentan noch nicht verfügbar
        </p>
      </PageHeader>
      <Container className="max-w-4xl py-10">
        <section className="surface relative overflow-hidden p-8 text-center sm:p-12" aria-labelledby="online-bald">
          <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-pink/15 blur-3xl" />
          <div className="relative">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-sunset/15 text-sunset">
              <Clock className="size-8" aria-hidden="true" />
            </span>
            <h2 id="online-bald" className="mt-6 text-2xl font-bold sm:text-3xl">
              Dieser Bereich entsteht, sobald GTA 6 Online erscheint.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Aktuell gibt es hier noch keine Inhalte. Erst wenn GTA 6 Online verfügbar ist, erstellen wir diese Seite – mit geprüften Informationen statt Gerüchten.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="geplant">
          <h2 id="geplant" className="mb-4 text-xl font-bold">
            Was wir hier planen
          </h2>
          <ul className="grid gap-3 text-muted sm:grid-cols-2">
            {[
              "Einsteiger-Ratgeber für den Online-Modus",
              "Tipps, wie man legal und fair vorankommt",
              "Crew-Suche: Mitspieler aus der Community finden",
              "Aktuelle Events und Updates – mit Quellenangabe",
            ].map((t) => (
              <li key={t} className="surface flex items-start gap-3 p-4 text-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Das sind unsere Pläne für diesen Bereich – keine Angaben dazu, welche Funktionen das Spiel haben wird.</p>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Bis dahin">
          {[
            { Icon: Newspaper, title: "News verfolgen", text: "Neuigkeiten erfährst du zuerst in unseren News.", href: "/news", label: "Zu den News" },
            { Icon: Users, title: "Community", text: "Tausch dich schon jetzt mit anderen Spielern aus.", href: "/community#starter", label: "Zur Community" },
            { Icon: Bell, title: "Dabei sein", text: "Mit einem kostenlosen Konto bist du ab dem ersten Tag dabei.", href: "/registrieren", label: "Konto erstellen" },
          ].map(({ Icon, title, text, href, label }) => (
            <div key={title} className="surface flex flex-col p-5">
              <Icon className="mb-2 size-5 text-teal" aria-hidden="true" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{text}</p>
              <LinkButton href={href} variant="secondary" size="sm" className="mt-4 self-start">
                {label}
              </LinkButton>
            </div>
          ))}
        </section>
      </Container>
    </>
  );
}

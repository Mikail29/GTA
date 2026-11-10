import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ReleasePending } from "@/components/world/release-pending";
import { CategoryDirectory } from "@/components/world/category-directory";
import { contactCategories, contacts } from "@/data/contacts";

export const metadata: Metadata = {
  title: "Personen & Kontakte",
  description: "Personen und Kontakte in GTA 6: Wer dir im Spiel helfen kann, wo du sie findest und welche Telefonnummern im Spiel bekannt sind – nach Release geprüft.",
  alternates: { canonical: "/personen" },
};

export default function PersonenPage() {
  const entries = contacts.map((c) => ({ slug: c.slug, title: c.name, category: c.category, text: c.helpsWith, phone: c.phone, location: c.location, mapLocationId: c.mapLocationId, status: c.status, source: c.source }));
  return (
    <>
      <PageHeader
        eyebrow="Spielwelt"
        title="Personen & Kontakte"
        text="Wer kann dir im Spiel helfen? Hier findest du Auftraggeber, Händler, Helfer und Bekannte – mit Telefonnummern im Spiel, sobald sie bekannt sind."
        crumbs={[{ label: "Personen & Kontakte" }]}
      />
      <Container className="grid gap-8 py-10">
        {contacts.length === 0 && <ReleasePending what="Personen, Kontakte und Telefonnummern" />}
        <CategoryDirectory categories={contactCategories} entries={entries} emptyText="Noch keine Einträge – folgt nach dem Release." />
        <p className="flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Telefonnummern auf dieser Seite sind fiktive Nummern innerhalb des Spiels. Bitte rufe sie nicht mit deinem echten Telefon an. Die Kategorien sind unsere eigene Gliederung.
        </p>
      </Container>
    </>
  );
}

import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ReleasePending } from "@/components/world/release-pending";
import { CategoryDirectory } from "@/components/world/category-directory";
import { shopCategories, shops } from "@/data/shops";

export const metadata: Metadata = {
  title: "Läden",
  description: "Läden in GTA 6: Wo du Waffen, Kleidung, Fahrzeuge und mehr kaufen kannst – nach Release geprüft und mit Fundort.",
  alternates: { canonical: "/laeden" },
};

export default function LaedenPage() {
  const entries = shops.map((s) => ({ slug: s.slug, title: s.name, category: s.category, text: s.description, location: s.location, mapLocationId: s.mapLocationId, status: s.status, source: s.source }));
  return (
    <>
      <PageHeader
        eyebrow="Spielwelt"
        title="Läden"
        text="Wo kaufst du Waffen, Klamotten oder ein neues Auto? Hier findest du alle Läden – nach Kategorien sortiert und später mit Fundort auf der Karte."
        crumbs={[{ label: "Läden" }]}
      />
      <Container className="grid gap-8 py-10">
        {shops.length === 0 && <ReleasePending what="Läden und ihre Fundorte" />}
        <CategoryDirectory categories={shopCategories} entries={entries} emptyText="Noch keine Einträge – folgt nach dem Release." />
        <p className="flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Die Kategorien sind unsere eigene Gliederung. Welche Läden es im Spiel gibt, prüfen wir nach dem Release.
        </p>
      </Container>
    </>
  );
}

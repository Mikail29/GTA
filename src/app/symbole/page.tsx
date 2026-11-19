import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ReleasePending } from "@/components/world/release-pending";
import { CategoryDirectory } from "@/components/world/category-directory";
import { symbolCategories, symbols } from "@/data/symbols";

export const metadata: Metadata = {
  title: "Symbole",
  description: "Alle Symbole aus GTA 6 erklärt: Was bedeuten die Zeichen auf Karte, Radar und Anzeige? Nach dem Release geprüft und in eigenen Worten beschrieben.",
  alternates: { canonical: "/symbole" },
};

export default function SymbolePage() {
  const entries = symbols.map((s) => ({
    slug: s.slug,
    title: s.name,
    category: s.category,
    icon: s.icon,
    art: s.slug,
    looks: s.looks,
    text: s.meaning,
    location: s.where,
    status: s.status,
  }));
  return (
    <>
      <PageHeader
        eyebrow="Spielwelt"
        title="Symbole"
        text="Was bedeutet welches Zeichen auf Karte, Radar und Anzeige? Hier findest du alle Symbole des Spiels – beschrieben und erklärt, nach Kategorien sortiert."
        crumbs={[{ label: "Symbole" }]}
      />
      <Container className="grid gap-8 py-10">
        {symbols.length === 0 && <ReleasePending what="Symbole und ihre Bedeutung" />}
        <CategoryDirectory categories={symbolCategories} entries={entries} emptyText="Noch keine Einträge – wird gerade ergänzt." />
        <p className="flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Wir zeigen keine Original-Grafiken aus dem Spiel. Die Bilder hier haben wir selbst gezeichnet – in den Farben und Grundformen der Spielanzeige, damit du sie sofort wiedererkennst. Im Spiel
          können sie im Detail anders aussehen. Die Texte sind in eigenen Worten geschrieben, die Kategorien sind unsere eigene Gliederung.
        </p>
      </Container>
    </>
  );
}

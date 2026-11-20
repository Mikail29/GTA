import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { CategoryDirectory } from "@/components/world/category-directory";
import { weaponCategories, weapons } from "@/data/weapons";

export const metadata: Metadata = {
  title: "Waffen",
  description: "Welche Waffen gibt es in GTA 6, und wo bekommst du sie? Pistolen, Schrotflinten, Gewehre und Waffenläden – geprüft und in eigenen Worten erklärt.",
  alternates: { canonical: "/waffen" },
};

export default function WaffenPage() {
  const entries = weapons.map((w) => ({
    slug: w.slug,
    title: w.name,
    category: w.category,
    icon: w.icon,
    art: w.art,
    text: w.text,
    location: w.where,
    mapLocationId: w.mapLocationId,
    status: w.status,
  }));
  return (
    <>
      <PageHeader
        eyebrow="Spielwelt"
        title="Waffen"
        text="Welche Waffen gibt es in GTA 6, und wo bekommst du sie? Hier findest du die bisher bestätigten Waffen und Waffenläden."
        crumbs={[{ label: "Waffen" }]}
      />
      <Container className="grid gap-8 py-10">
        <Notice tone="info" title="So wechselst du die Waffe">
          Öffne das Waffenrad (PS5: L1, Xbox: LB) und wähle die Waffe aus. Preise nennen wir bewusst nicht – sie können sich mit Updates ändern.
        </Notice>
        <CategoryDirectory categories={weaponCategories} entries={entries} emptyText="Noch keine Einträge – wird gerade ergänzt." />
        <p className="flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Wir zeigen keine Original-Grafiken aus dem Spiel. Die Waffen-Bilder haben wir selbst gezeichnet – als einfache Umrisse wie im Waffenrad. Im Spiel sehen die Waffen im Detail anders aus. Die
          Texte sind in eigenen Worten geschrieben, die Kategorien sind unsere eigene Gliederung.
        </p>
      </Container>
    </>
  );
}

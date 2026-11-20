import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { CategoryDirectory } from "@/components/world/category-directory";
import { vehicleCategories, vehicles } from "@/data/vehicles";

export const metadata: Metadata = {
  title: "Fahrzeuge",
  description: "Autos, Motorräder und Werkstätten in GTA 6: Was ist bestätigt, und wo bekommst du es? Geprüft und in eigenen Worten erklärt.",
  alternates: { canonical: "/fahrzeuge" },
};

export default function FahrzeugePage() {
  const entries = vehicles.map((v) => ({
    slug: v.slug,
    title: v.name,
    category: v.category,
    icon: v.icon,
    art: v.art,
    text: v.text,
    location: v.where,
    mapLocationId: v.mapLocationId,
    status: v.status,
  }));
  return (
    <>
      <PageHeader
        eyebrow="Spielwelt"
        title="Fahrzeuge"
        text="Welche Autos, Motorräder und Werkstätten gibt es in GTA 6 – und wo bekommst du sie? Hier steht, was bisher bestätigt ist."
        crumbs={[{ label: "Fahrzeuge" }]}
      />
      <Container className="grid gap-8 py-10">
        <Notice tone="info" title="Gut zu wissen">
          Laut den Guides schalten sich manche Extras der Ultimate Edition erst in späteren Kapiteln frei. Seltene Fahrzeuge, die irgendwo in Leonida versteckt sind, findest du bei den{" "}
          <Link href="/geheimnisse?kategorie=seltene-fahrzeuge" className="text-teal underline underline-offset-2">
            Geheimnissen
          </Link>
          .
        </Notice>
        <CategoryDirectory categories={vehicleCategories} entries={entries} emptyText="Noch keine Einträge – wird gerade ergänzt." />
        <p className="flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Wir zeigen keine Original-Grafiken aus dem Spiel. Die Fahrzeug-Bilder haben wir selbst gezeichnet – sie zeigen die Grundform, im Spiel sehen die Autos im Detail anders aus. Die Texte
          sind in eigenen Worten geschrieben, die Kategorien sind unsere eigene Gliederung.
        </p>
      </Container>
    </>
  );
}

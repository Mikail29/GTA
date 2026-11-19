import type { Metadata } from "next";
import { Layers, MapPinPlus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { MapExplorer } from "@/components/map/map-explorer";
import { mapLocations } from "@/data/map-locations";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = {
  title: "Interaktive Karte",
  description: "Die Karte vom 5-Sterne-Kompass: eine eigene, schematische Übersicht über Leonida mit den Regionen aus GTA 6 – weitere geprüfte Orte folgen.",
  alternates: { canonical: "/karte" },
};

export default async function KartePage({ searchParams }: { searchParams: SearchParams }) {
  const marker = param((await searchParams).marker, 60);
  const initialMarker = mapLocations.some((l) => l.id === marker) ? marker : undefined;

  return (
    <>
      <PageHeader eyebrow="Karte" title="Interaktive Karte" text="Wo liegen Vice City, die Keys und die anderen Regionen von Leonida? Marker antippen für Details – weitere geprüfte Orte folgen." crumbs={[{ label: "Karte" }]} />
      <Container className="py-10">
        <Notice tone="info" title="Eigene, schematische Karte" className="mb-6">
          Diese Karte haben wir selbst gezeichnet. Sie zeigt grob, wo die von Rockstar genannten Regionen liegen – nicht maßstabsgetreu und ohne Daten aus der Spielkarte. Wo die Lage noch
          nicht offiziell bestätigt ist, steht das beim Marker. Weitere Orte tragen wir ein, sobald sie geprüft sind.
        </Notice>
        <MapExplorer locations={mapLocations} imageUrl="/map/leonida-schema.svg" initialMarker={initialMarker} />

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Geplante Kartenfunktionen">
          {[
            { Icon: Layers, title: "Kategorien & Ebenen", text: "Regionen, Geheimnisse, Sammelobjekte, Fahrzeuge, Missionen und Fundorte als einzeln schaltbare Ebenen." },
            { Icon: MapPinPlus, title: "Eigene Fundorte", text: "Angemeldete Nutzer sollen eigene Markierungen speichern können (Tabelle map_locations ist vorbereitet)." },
            { Icon: ShieldCheck, title: "Nur rechtssichere Daten", text: "Kartenbilder und Koordinaten werden nur verwendet, wenn Nutzungsrechte bestehen oder sie selbst erstellt wurden." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="surface p-5">
              <Icon className="mb-3 size-6 text-teal" aria-hidden="true" />
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </section>
      </Container>
    </>
  );
}

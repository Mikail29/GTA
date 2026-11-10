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
  description: "Die interaktive Karte vom 5-Sterne-Kompass: Fundorte, Geheimnisse, Sammelobjekte, Fahrzeuge und Missionen – aktuell als Demo mit eigener Platzhalter-Karte.",
  alternates: { canonical: "/karte" },
};

export default async function KartePage({ searchParams }: { searchParams: SearchParams }) {
  const marker = param((await searchParams).marker, 60);
  const initialMarker = mapLocations.some((l) => l.id === marker) ? marker : undefined;

  return (
    <>
      <PageHeader eyebrow="Karte" title="Interaktive Karte" text="Marker filtern, suchen und Details ansehen. Die echte Spielkarte folgt, sobald rechtlich nutzbare Kartendaten verfügbar sind." crumbs={[{ label: "Karte" }]} />
      <Container className="py-10">
        <Notice tone="warning" title="Demo-Karte – keine echten Spieldaten" className="mb-6">
          Die angezeigte Karte ist eine selbst gezeichnete, fiktive Platzhalter-Darstellung. Alle Marker sind Beispiele und zeigen keine echten Fundorte in GTA 6. Wir verwenden keine kopierten
          Karten oder Kartendaten von Rockstar Games.
        </Notice>
        <MapExplorer locations={mapLocations} imageUrl="/map/placeholder-map.svg" initialMarker={initialMarker} />

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Geplante Kartenfunktionen">
          {[
            { Icon: Layers, title: "Kategorien & Ebenen", text: "Geheimnisse, Sammelobjekte, Fahrzeuge, Missionen und Fundorte als einzeln schaltbare Ebenen." },
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

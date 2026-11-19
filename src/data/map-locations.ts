import type { MapCategory, MapLocation } from "@/types/content";

/**
 * Marker auf unserer eigenen, schematischen Karte von Leonida (public/map/leonida-schema.svg).
 * Die Karte ist selbst gezeichnet, nicht maßstabsgetreu und NICHT von der Spielkarte abgezeichnet.
 * Die Lage ist nur ungefähr: „verifiziert“ nur, wenn Rockstar die Lage selbst nennt.
 * Quellen: Rockstar Games („Only in Leonida“, rockstargames.com/VI) und mehrere unabhängige Guides (Stand 19.11.2026).
 */
export const mapLocations: MapLocation[] = [
  {
    id: "region-vice-city",
    title: "Vice City",
    category: "region",
    description: "Die große Stadt von Leonida mit Stränden und Nachtleben. Laut Rockstar liegt sie im Südosten des Bundesstaats.",
    status: "verifiziert",
    x: 735,
    y: 640,
  },
  {
    id: "region-mount-kalaga",
    title: "Mount Kalaga",
    category: "region",
    description: "Ein Nationalpark mit Wäldern und Bergen. Laut Rockstar das Hinterland ganz im Norden von Leonida.",
    status: "verifiziert",
    x: 620,
    y: 195,
  },
  {
    id: "region-leonida-keys",
    title: "Leonida Keys",
    category: "region",
    description: "Eine Kette aus kleinen Inseln. Rockstar nennt sie das „Tor zum Paradies“. Lage auf unserer Skizze ungefähr: im Süden, vor der Spitze des Festlands.",
    status: "unbestaetigt",
    x: 560,
    y: 890,
  },
  {
    id: "region-grassrivers",
    title: "Grassrivers",
    category: "region",
    description: "Ein wildes Sumpf- und Flussgebiet mit Alligatoren und Mangroven. Lage auf unserer Skizze ungefähr: im Süden, westlich von Vice City.",
    status: "unbestaetigt",
    x: 585,
    y: 690,
  },
  {
    id: "region-ambrosia",
    title: "Ambrosia",
    category: "region",
    description: "Das Industrie- und Landwirtschaftsgebiet von Leonida, unter anderem mit einer großen Zuckerraffinerie. Lage auf unserer Skizze ungefähr: in der Mitte des Bundesstaats.",
    status: "unbestaetigt",
    x: 600,
    y: 440,
  },
  {
    id: "region-port-gellhorn",
    title: "Port Gellhorn",
    category: "region",
    description: "Ein heruntergekommener früherer Urlaubsort an der Küste – Rockstar spricht von Leonidas „vergessener Küste“. Lage auf unserer Skizze ungefähr: im Nordwesten.",
    status: "unbestaetigt",
    x: 200,
    y: 185,
  },
];

export const mapCategoryMeta: Record<MapCategory, { label: string; color: string }> = {
  region: { label: "Regionen", color: "#FFD166" },
  geheimnis: { label: "Geheimnisse", color: "#9565FF" },
  sammelobjekt: { label: "Sammelobjekte", color: "#FF9B68" },
  fahrzeug: { label: "Fahrzeuge", color: "#42E8D5" },
  mission: { label: "Missionen", color: "#FF55B8" },
  fundort: { label: "Fundorte", color: "#FFFFFF" },
};

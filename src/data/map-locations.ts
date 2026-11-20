import type { MapCategory, MapLocation } from "@/types/content";

/**
 * Marker auf unserer eigenen Karte von Leonida (public/map/leonida.svg).
 * Die Karte ist selbst gestaltet: Küstenlinie aus Natural Earth (gemeinfrei, Vorbild Florida),
 * nicht maßstabsgetreu und NICHT von der Spielkarte abgezeichnet.
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
    x: 838,
    y: 727,
  },
  {
    id: "region-mount-kalaga",
    title: "Mount Kalaga",
    category: "region",
    description: "Ein Nationalpark mit Wäldern und Bergen. Laut Rockstar das Hinterland ganz im Norden von Leonida.",
    status: "verifiziert",
    x: 599,
    y: 271,
  },
  {
    id: "region-leonida-keys",
    title: "Leonida Keys",
    category: "region",
    description: "Eine Kette aus kleinen Inseln. Rockstar nennt sie das „Tor zum Paradies“. Lage auf unserer Skizze ungefähr: im Süden, vor der Spitze des Festlands.",
    status: "unbestaetigt",
    x: 758,
    y: 854,
  },
  {
    id: "region-grassrivers",
    title: "Grassrivers",
    category: "region",
    description: "Ein wildes Sumpf- und Flussgebiet mit Alligatoren und Mangroven. Lage auf unserer Skizze ungefähr: im Süden, westlich von Vice City.",
    status: "unbestaetigt",
    x: 750,
    y: 707,
  },
  {
    id: "region-ambrosia",
    title: "Ambrosia",
    category: "region",
    description: "Das Industrie- und Landwirtschaftsgebiet von Leonida, unter anderem mit einer großen Zuckerraffinerie. Lage auf unserer Skizze ungefähr: in der Mitte des Bundesstaats.",
    status: "unbestaetigt",
    x: 729,
    y: 589,
  },
  {
    id: "region-port-gellhorn",
    title: "Port Gellhorn",
    category: "region",
    description: "Ein heruntergekommener früherer Urlaubsort an der Küste – Rockstar spricht von Leonidas „vergessener Küste“. Lage auf unserer Skizze ungefähr: im Nordwesten.",
    status: "unbestaetigt",
    x: 259,
    y: 192,
  },
  {
    id: "geheimnis-skunk-ape",
    title: "Skunk Ape (Bigfoot)",
    category: "geheimnis",
    description: "Im Sumpfgebiet rund um Cottonmouth Lake im Süden von Grassrivers. Lage auf unserer Karte ungefähr.",
    status: "unbestaetigt",
    x: 735,
    y: 768,
    href: "/geheimnisse/skunk-ape-bigfoot",
  },
  {
    id: "geheimnis-ufo",
    title: "UFO-Entführung",
    category: "geheimnis",
    description: "Nachts (nach etwa 2 Uhr) auf den Landstraßen östlich von Port Gellhorn. Lage auf unserer Karte ungefähr.",
    status: "unbestaetigt",
    x: 320,
    y: 185,
    href: "/geheimnisse/ufo-entfuehrung-port-gellhorn",
  },
  {
    id: "geheimnis-funkturm",
    title: "Funkturm mit Ostereiern",
    category: "geheimnis",
    description: "Der höchste Funkturm im Bezirk Vice-Dale bei Vice City. Lage auf unserer Karte ungefähr.",
    status: "unbestaetigt",
    x: 812,
    y: 700,
    href: "/geheimnisse/eier-auf-dem-funkturm",
  },
  {
    id: "fundort-chucks",
    title: "Chuck's Tackle & Shot",
    category: "fundort",
    description: "Waffenladen in Key Lento – hier spielt die Mission „Gear Up“. Lage auf unserer Karte ungefähr.",
    status: "unbestaetigt",
    x: 792,
    y: 833,
    href: "/waffen#laeden",
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

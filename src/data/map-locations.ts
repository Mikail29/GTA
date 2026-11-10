import type { MapCategory, MapLocation } from "@/types/content";

/**
 * Demo-Marker für die Platzhalter-Karte.
 * Die Koordinaten beziehen sich auf eine selbst gezeichnete, fiktive Karte
 * (public/map/placeholder-map.svg) und NICHT auf die echte GTA-6-Spielwelt.
 */
export const mapLocations: MapLocation[] = [
  { id: "demo-geheimnis-1", title: "Demo-Geheimnis", category: "geheimnis", description: "Beispielmarker für ein Geheimnis. Kein echter Fundort.", status: "demo", x: 620, y: 410, href: "/geheimnisse/demo-easter-egg-vorlage" },
  { id: "demo-fundort-1", title: "Demo-Fundort", category: "fundort", description: "Beispielmarker für einen versteckten Ort. Kein echter Fundort.", status: "demo", x: 300, y: 260, href: "/geheimnisse/demo-versteckter-ort-vorlage" },
  { id: "demo-sammelobjekt-1", title: "Demo-Sammelobjekt", category: "sammelobjekt", description: "Beispielmarker für ein Sammelobjekt. Kein echter Fundort.", status: "demo", x: 480, y: 640, href: "/geheimnisse/demo-sammelobjekt-vorlage" },
  { id: "demo-sammelobjekt-2", title: "Demo-Sammelobjekt 2", category: "sammelobjekt", description: "Zweiter Beispielmarker für Sammelobjekte.", status: "demo", x: 720, y: 700 },
  { id: "demo-fahrzeug-1", title: "Demo-Fahrzeug", category: "fahrzeug", description: "Beispielmarker für ein seltenes Fahrzeug. Kein echter Fundort.", status: "demo", x: 380, y: 520, href: "/geheimnisse/demo-seltenes-fahrzeug-vorlage" },
  { id: "demo-mission-1", title: "Demo-Missionsstart", category: "mission", description: "Beispielmarker für einen Missionsstart.", status: "demo", x: 560, y: 300, href: "/missionen/demo-mission-hauptstory-vorlage" },
  { id: "demo-mission-2", title: "Demo-Nebenauftrag", category: "mission", description: "Beispielmarker für einen Nebenauftrag.", status: "demo", x: 250, y: 720, href: "/missionen/demo-mission-nebenauftrag-vorlage" },
];

export const mapCategoryMeta: Record<MapCategory, { label: string; color: string }> = {
  geheimnis: { label: "Geheimnisse", color: "#9565FF" },
  sammelobjekt: { label: "Sammelobjekte", color: "#FF9B68" },
  fahrzeug: { label: "Fahrzeuge", color: "#42E8D5" },
  mission: { label: "Missionen", color: "#FF55B8" },
  fundort: { label: "Fundorte", color: "#FFFFFF" },
};

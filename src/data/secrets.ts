import type { Secret } from "@/types/content";

/**
 * Beispiel-Einträge für Geheimnisse & Fundorte.
 * Keiner dieser Einträge beschreibt einen echten Fundort in GTA 6.
 * Fundort-Angaben sind ausdrücklich Platzhalter.
 */
export const secrets: Secret[] = [
  {
    slug: "demo-easter-egg-vorlage",
    title: "Demo: So sieht ein Easter-Egg-Eintrag aus",
    excerpt: "Beispiel für einen Easter-Egg-Eintrag mit Status, Spoiler-Hinweis und Kartenverknüpfung.",
    category: "easter-eggs",
    status: "demo",
    spoiler: true,
    location: "Platzhalter – kein echter Fundort",
    mapLocationId: "demo-geheimnis-1",
    publishedAt: "2026-11-02",
    blocks: [
      { type: "p", text: "Hier steht später die Beschreibung des Easter Eggs: was man sieht, worauf es anspielt und wie man es auslöst." },
      { type: "note", tone: "research", title: "Noch nicht verifiziert", text: "Dieser Eintrag ist ein Platzhalter. Es wird kein echtes Easter Egg aus GTA 6 beschrieben." },
    ],
  },
  {
    slug: "demo-versteckter-ort-vorlage",
    title: "Demo: Eintrag für einen versteckten Ort",
    excerpt: "Vorlage für abgelegene Orte mit Wegbeschreibung und Hinweis zur Erreichbarkeit.",
    category: "versteckte-orte",
    status: "demo",
    spoiler: false,
    location: "Platzhalter – kein echter Fundort",
    mapLocationId: "demo-fundort-1",
    publishedAt: "2026-11-03",
    blocks: [
      { type: "p", text: "Platzhalter für die Wegbeschreibung. Später ergänzt mit Bildern aus eigener Aufnahme und einem Marker auf der Karte." },
    ],
  },
  {
    slug: "demo-sammelobjekt-vorlage",
    title: "Demo: Eintrag für ein Sammelobjekt",
    excerpt: "So werden Sammelobjekte künftig dokumentiert – mit Fortschritt und Fundort auf der Karte.",
    category: "sammelobjekte",
    status: "demo",
    spoiler: false,
    location: "Platzhalter – kein echter Fundort",
    mapLocationId: "demo-sammelobjekt-1",
    publishedAt: "2026-11-04",
    blocks: [
      { type: "p", text: "Platzhalter: Beschreibung des Sammelobjekts, Anzahl insgesamt und mögliche Belohnungen – erst nach Prüfung." },
    ],
  },
  {
    slug: "demo-seltenes-fahrzeug-vorlage",
    title: "Demo: Eintrag für ein seltenes Fahrzeug",
    excerpt: "Vorlage für Fahrzeuge, die nur an bestimmten Orten oder zu bestimmten Zeiten erscheinen.",
    category: "seltene-fahrzeuge",
    status: "demo",
    spoiler: false,
    location: "Platzhalter – kein echter Fundort",
    mapLocationId: "demo-fahrzeug-1",
    publishedAt: "2026-11-05",
    blocks: [
      { type: "p", text: "Platzhalter: Fahrzeugbeschreibung und Bedingungen für das Erscheinen. Wir erfinden keine Fahrzeugnamen oder Fundorte." },
    ],
  },
  {
    slug: "community-hinweis-unbestaetigt-vorlage",
    title: "Demo: Unbestätigter Community-Hinweis",
    excerpt: "Beispiel, wie Hinweise aus der Community gekennzeichnet werden, solange sie nicht geprüft sind.",
    category: "geheimnisse",
    status: "unbestaetigt",
    spoiler: true,
    publishedAt: "2026-11-06",
    blocks: [
      { type: "p", text: "Community-Hinweise erscheinen mit dem Status „unbestätigt“, bis die Redaktion sie selbst geprüft hat." },
      { type: "note", tone: "warning", title: "Unbestätigt", text: "Bitte nicht als Tatsache weitergeben, solange der Status nicht „verifiziert“ lautet." },
    ],
  },
  {
    slug: "demo-besonderer-gegenstand-vorlage",
    title: "Demo: Eintrag für einen besonderen Gegenstand",
    excerpt: "Vorlage für seltene Gegenstände mit Beschreibung, Nutzen und Fundort.",
    category: "gegenstaende",
    status: "demo",
    spoiler: false,
    publishedAt: "2026-11-07",
    blocks: [{ type: "p", text: "Platzhalter: Beschreibung und Nutzen des Gegenstands – nach Prüfung im Spiel." }],
  },
];

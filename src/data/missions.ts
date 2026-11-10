import type { Mission } from "@/types/content";

/**
 * Beispiel-Missionen.
 * Es handelt sich ausdrücklich NICHT um offizielle GTA-6-Missionen.
 * Titel und Abläufe sind neutrale Vorlagen, die zeigen, wie eine
 * Komplettlösung auf GTA6-Kompass aufgebaut ist.
 */
export const missions: Mission[] = [
  {
    slug: "demo-mission-hauptstory-vorlage",
    title: "Demo: Vorlage für eine Hauptstory-Mission",
    excerpt:
      "Beispielstruktur einer Story-Komplettlösung mit Voraussetzungen, Schritten und Tipps – ohne echte Spielinhalte.",
    category: "hauptstory",
    difficulty: "mittel",
    status: "demo",
    spoiler: "stark",
    estimatedMinutes: 20,
    requirements: ["Platzhalter: vorherige Mission abgeschlossen", "Platzhalter: bestimmte Uhrzeit im Spiel"],
    steps: [
      { title: "Ausgangspunkt erreichen", text: "Platzhalter: Hier steht später, wo die Mission beginnt und wie man dorthin gelangt." },
      { title: "Erstes Ziel", text: "Platzhalter: Beschreibung des ersten Missionsziels in einfachen Worten." },
      { title: "Schwierige Stelle meistern", text: "Platzhalter: Konkrete Hilfe für die Stelle, an der viele Spieler hängen bleiben." },
      { title: "Abschluss", text: "Platzhalter: Was nach der Mission passiert und welche Inhalte freigeschaltet werden." },
    ],
    tips: [
      "Allgemein: Vor schwierigen Abschnitten Ausrüstung und Lebensenergie prüfen.",
      "Allgemein: Falls eine Stelle zu schwer ist, lohnt sich oft ein Blick in die Schwierigkeits-Einstellungen.",
    ],
    related: ["demo-mission-nebenauftrag-vorlage"],
    publishedAt: "2026-11-01",
  },
  {
    slug: "demo-mission-nebenauftrag-vorlage",
    title: "Demo: Vorlage für einen Nebenauftrag",
    excerpt:
      "So sehen Komplettlösungen für optionale Aufträge aus – kurze Schritte, klare Hinweise, optionaler Spoiler.",
    category: "nebenmissionen",
    difficulty: "leicht",
    status: "demo",
    spoiler: "leicht",
    estimatedMinutes: 10,
    requirements: ["Platzhalter: Auftrag in der Spielwelt entdeckt"],
    steps: [
      { title: "Auftrag annehmen", text: "Platzhalter: Wo und wie der Auftrag angenommen wird." },
      { title: "Aufgabe erledigen", text: "Platzhalter: Beschreibung des Ablaufs." },
      { title: "Belohnung abholen", text: "Platzhalter: Hinweise zur Belohnung – erst nach Prüfung." },
    ],
    tips: ["Allgemein: Nebenaufträge eignen sich gut, um Steuerung und Systeme in Ruhe zu üben."],
    related: ["demo-mission-hauptstory-vorlage", "demo-aktivitaet-vorlage"],
    publishedAt: "2026-11-03",
  },
  {
    slug: "demo-aktivitaet-vorlage",
    title: "Demo: Vorlage für eine Freizeit-Aktivität",
    excerpt:
      "Platzhalter für Aktivitäten abseits der Story – mit Platz für Bestzeiten, Tipps und Fundorte.",
    category: "aktivitaeten",
    difficulty: "leicht",
    status: "demo",
    spoiler: "keine",
    requirements: ["Keine (Platzhalter)"],
    steps: [
      { title: "Aktivität finden", text: "Platzhalter: Wo die Aktivität verfügbar ist – später mit Link zur Karte." },
      { title: "Ablauf", text: "Platzhalter: Regeln und Ziel der Aktivität." },
    ],
    tips: ["Allgemein: Aktivitäten sind eine gute Abwechslung zwischen längeren Story-Abschnitten."],
    related: ["demo-herausforderung-vorlage"],
    publishedAt: "2026-11-05",
  },
  {
    slug: "demo-herausforderung-vorlage",
    title: "Demo: Vorlage für eine Herausforderung",
    excerpt:
      "Struktur für schwierige Sonderziele, Medaillen oder Bestwerte – mit Schritt-für-Schritt-Strategie.",
    category: "herausforderungen",
    difficulty: "schwer",
    status: "demo",
    spoiler: "leicht",
    estimatedMinutes: 30,
    requirements: ["Platzhalter: Herausforderung freigeschaltet"],
    steps: [
      { title: "Vorbereitung", text: "Platzhalter: Welche Vorbereitung sinnvoll ist." },
      { title: "Strategie", text: "Platzhalter: Bewährte Vorgehensweise, sobald geprüft." },
      { title: "Häufige Fehler", text: "Platzhalter: Woran viele Versuche scheitern." },
    ],
    tips: ["Allgemein: Bei kniffligen Herausforderungen hilft es, Pausen einzulegen und Abschnitte einzeln zu üben."],
    related: ["demo-aktivitaet-vorlage"],
    publishedAt: "2026-11-06",
  },
];

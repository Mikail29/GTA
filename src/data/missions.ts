import type { Mission } from "@/types/content";

/**
 * Missionen aus GTA 6 (seit dem Release am 19.11.2026).
 * Regeln: nur Fakten aus mindestens zwei unabhängigen Quellen (oder selbst gespielt),
 * in eigenen Worten und mit eigenem Aufbau. Keine Listen oder Texte fremder Seiten übernehmen.
 */
export const missions: Mission[] = [
  {
    slug: "gone-fishing",
    title: "Gone Fishing",
    excerpt: "Jasons erste Mission: Mit dem Boot holst du für Cal Pakete aus dem Wasser, die ein Flugzeug abwirft – danach geht es um Donnie.",
    category: "hauptstory",
    difficulty: "leicht",
    status: "verifiziert",
    spoiler: "leicht",
    requirements: ["Den Prolog mit Lucia abgeschlossen"],
    steps: [
      { title: "Ins Boot steigen", text: "Du spielst Jason und steuerst das Boot. Cal fährt mit und holt die Pakete aus dem Wasser." },
      { title: "Dem Flugzeug folgen", text: "Ein kleines Flugzeug wirft über dem Wasser Pakete ab. Fahr ihm hinterher und steuere jedes Paket an. Die meisten Guides zählen drei Abwürfe." },
      { title: "Langsam heranfahren", text: "Werde kurz vor jedem Paket langsamer. Bei voller Fahrt kann Cal es nicht aus dem Wasser holen." },
      { title: "Donnie helfen", text: "Danach müsst ihr Donnie befreien. Wo genau er festgehalten wird, beschreiben die Guides unterschiedlich – folge einfach der Markierung im Spiel." },
      { title: "Abschluss", text: "Setz Cal ab und fahr zu Jasons Zuhause. Damit schaltest du Jasons erstes Zuhause (Safehouse) frei." },
    ],
    tips: [
      "Langsam an die Pakete heranfahren – mit Vollgas klappt das Einsammeln nicht.",
      "Sieht ein Schritt bei dir anders aus, folge einfach den Markierungen im Spiel.",
      "Du hast die Mission schon gespielt? Teile deine Tipps in der Community – wir ergänzen sie hier.",
    ],
    related: [],
    publishedAt: "2026-11-19",
    sources: [
      { label: "Video Games Chronicle: Gone Fishing Mission Walkthrough", url: "https://www.videogameschronicle.com/guide/gta-6-gone-fishing-mission-walkthrough/" },
      { label: "GTA BOOM: Gone Fishing und Jasons erstes Safehouse", url: "https://www.gtaboom.com/gta-6-gone-fishing-mission-walkthrough-ff86" },
      { label: "MetaForge: Gone Fishing – alle 3 Pakete und Donnie", url: "https://metaforge.app/gta-6/gta-6-gone-fishing-walkthrough" },
    ],
  },
];

import type { NewsItem } from "@/types/content";

export const news: NewsItem[] = [
  {
    slug: "willkommen-bei-gta6-kompass",
    title: "Willkommen bei GTA6-Kompass",
    excerpt: "Unser unabhängiges, deutschsprachiges Hilfeportal startet – das erwartet dich.",
    publishedAt: "2026-11-09",
    status: "verifiziert",
    blocks: [
      { type: "p", text: "GTA6-Kompass ist ein kostenloses Fanprojekt mit einem Ziel: dir verlässliche Hilfe rund um GTA 6 zu bieten – auf Deutsch, übersichtlich und ohne Clickbait." },
      { type: "h2", id: "was-dich-erwartet", text: "Was dich erwartet" },
      { type: "ul", items: ["Ratgeber und Komplettlösungen", "Geheimnisse und Fundorte mit Verifizierungsstatus", "Eine interaktive Karte (in Vorbereitung)", "Eine Community für Fragen und Antworten", "Den KI-Assistenten GTA6-Kompass KI"] },
      { type: "h2", id: "unabhaengig", text: "Unabhängig" },
      { type: "p", text: "Wir sind keine offizielle Website von Rockstar Games und stehen in keiner Verbindung zu Rockstar Games oder Take-Two Interactive." },
    ],
  },
  {
    slug: "so-kennzeichnen-wir-informationen",
    title: "Transparenz: So kennzeichnen wir Informationen",
    excerpt: "Verifiziert, unbestätigt oder Demo – jede Seite zeigt dir, wie verlässlich der Inhalt ist.",
    publishedAt: "2026-11-08",
    status: "verifiziert",
    blocks: [
      { type: "p", text: "Jeder Ratgeber, jede Mission und jedes Geheimnis trägt einen sichtbaren Status. So erkennst du sofort, ob eine Information belegt ist." },
      { type: "p", text: "Mehr dazu erfährst du im Ratgeber „So prüfen wir Informationen“." },
    ],
  },
  {
    slug: "offizielle-informationen-quellen",
    title: "Offizielle Informationen: Wo du sie findest",
    excerpt: "Neuigkeiten zu GTA 6 veröffentlicht Rockstar Games über eigene Kanäle. Wir verlinken dorthin, statt Gerüchte zu verbreiten.",
    publishedAt: "2026-11-07",
    status: "unbestaetigt",
    sources: [{ label: "Rockstar Games – offizielle Website", url: "https://www.rockstargames.com/" }],
    blocks: [
      { type: "note", tone: "warning", title: "Stand prüfen", text: "Termine und Details können sich ändern. Bitte prüfe offizielle Angaben immer direkt beim Hersteller." },
      { type: "p", text: "Wir berichten über offizielle Ankündigungen erst, wenn wir sie anhand der Originalquelle überprüft haben. Bis dahin verweisen wir direkt auf die Kanäle von Rockstar Games." },
    ],
  },
];

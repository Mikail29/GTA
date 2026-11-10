import type { Question } from "@/types/community";

/**
 * Starter-Threads der Community „GTA 6 Starter“.
 * Ohne Datenbank werden sie direkt angezeigt; mit Supabase legt
 * supabase/seed.sql dieselben Threads in der Datenbank an.
 */
const base = {
  author_id: null,
  category: "starter",
  status: "offen" as const,
  is_hidden: false,
  updated_at: null,
  likes_count: 0,
  answers_count: 0,
  author: { username: "GTA6-Kompass Team", avatar_url: null },
  is_pinned: true,
  is_official: true,
  demo: true,
};

export const starterThreads: Question[] = [
  {
    ...base,
    id: "starter-willkommen",
    title: "Willkommen in der GTA-6-Community – hier startest du!",
    body: `Schön, dass du da bist! 🌴

GTA6-Kompass ist eine kostenlose, deutschsprachige Community, in der sich Spielerinnen und Spieler gegenseitig bei GTA 6 helfen.

So machst du mit:
1. Kostenloses Konto erstellen (nur Benutzername, E-Mail und Passwort)
2. Im Thread „Stell dich vor“ kurz Hallo sagen
3. Deine Frage stellen – am besten mit passender Kategorie und einem klaren Titel
4. Anderen helfen: Antworten schreiben und hilfreiche Beiträge liken

Wichtig:
• Spoiler bitte immer deutlich ankündigen
• Freundlich bleiben – alle waren mal Anfänger
• Gerüchte als Gerüchte kennzeichnen
• Unpassende Beiträge über „Melden“ an das Moderationsteam geben

Viel Spaß – wir sehen uns in Vice City!`,
    created_at: "2026-11-10T08:25:00Z",
  },
  {
    ...base,
    id: "starter-vorstellung",
    title: "Stell dich vor: Wer bist du und worauf freust du dich bei GTA 6?",
    body: `Hier ist Platz für deine Vorstellung!

Erzähl uns zum Beispiel:
• Wie sollen wir dich nennen?
• Welche GTA-Teile hast du schon gespielt?
• Auf welcher Plattform spielst du?
• Worauf freust du dich bei GTA 6 am meisten?

Bitte keine persönlichen Daten wie Adresse oder Telefonnummer posten.`,
    created_at: "2026-11-10T08:20:00Z",
  },
  {
    ...base,
    id: "starter-einsteigerfragen",
    title: "Einsteigerfragen-Sammelthread: Keine Frage ist zu einfach",
    body: `Du bist neu bei GTA oder Open-World-Spielen? Dann stell deine Frage einfach hier als Antwort.

Typische Einsteigerfragen:
• Welche Einstellungen sollte ich am Anfang anpassen?
• Wie vermeide ich Spoiler?
• Wo finde ich Hilfe zu einer bestimmten Mission?

Größere Fragen gerne als eigene Frage mit passender Kategorie stellen – dann finden andere sie später leichter über die Suche.`,
    created_at: "2026-11-10T08:15:00Z",
  },
  {
    ...base,
    id: "starter-release-countdown",
    title: "Release-Countdown: Auf welcher Konsole spielst du GTA 6?",
    body: `Laut Rockstar Games erscheint GTA 6 am 19. November 2026 für PlayStation 5 und Xbox Series X|S (Quelle: Rockstar Newswire – Termine können sich ändern, bitte offiziell prüfen).

Auf welcher Konsole spielst du? Startest du direkt am Release-Tag oder wartest du noch?

Bitte keine Leaks oder Spoiler in diesem Thread.`,
    created_at: "2026-11-10T08:10:00Z",
  },
  {
    ...base,
    id: "starter-erste-eindruecke",
    title: "Spoilerfreie Zone: Eure ersten Eindrücke nach dem Release",
    body: `Hier sammeln wir nach dem Release eure ersten Eindrücke – komplett OHNE Story-Spoiler.

Erlaubt: Grafik, Steuerung, Gefühl beim Fahren, Lieblingsorte (ohne Story-Bezug), Technik und Leistung.
Nicht erlaubt: Story-Details, Wendungen, Enden, Missionsinhalte.

Für Story-Diskussionen bitte eine eigene Frage in der Kategorie „Missionen“ erstellen und den Spoiler im Titel kennzeichnen.`,
    created_at: "2026-11-10T08:05:00Z",
  },
  {
    ...base,
    id: "starter-feedback",
    title: "Feedback & Wünsche: Was soll GTA6-Kompass noch bieten?",
    body: `Die Seite wächst mit der Community. Welche Ratgeber, Funktionen oder Karten-Kategorien wünschst du dir?

Fehler auf der Website oder falsche Informationen gefunden? Schreib sie gerne hier hinein – jede Rückmeldung hilft.`,
    created_at: "2026-11-10T08:00:00Z",
  },
];

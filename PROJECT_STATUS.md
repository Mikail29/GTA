# PROJECT_STATUS – GTA6-Kompass

Stand: 10.11.2026 · Version 0.3.0

## Phasen

| Phase | Inhalt | Status |
| --- | --- | --- |
| 1 | Projektumgebung untersucht (leeres Repository, Node 22) | ✅ |
| 2 | Grundgerüst: Next.js 16, TypeScript, Tailwind 4, ESLint | ✅ |
| 3 | Designsystem (Farben, Typografie, Karten, Buttons, Badges, Hinweise) | ✅ |
| 4 | Startseite, Header mit Suche, mobiles Menü, Footer | ✅ |
| 5 | Tipps, Missionen, Geheimnisse, News, globale Suche | ✅ |
| 6 | Community & Authentifizierung (Supabase) | ✅ |
| 7 | KI-Chat (auf Wunsch wieder entfernt, Version 0.2.0) | ➖ |
| 8 | Interaktive Karte (Leaflet, Platzhalter-Karte) | ✅ |
| 9 | Datenbankmigration, Seed, Dokumentation | ✅ |
| 10 | Tests | ✅ |
| 11 | Community-Einstieg „GTA 6 Starter“ + Release-News | ✅ |
| 12 | DSA/DSGVO: Melden ohne Konto, Benachrichtigungen mit Begründung, Nutzungsbedingungen, Konto löschen | ✅ |

## Durchgeführte Tests

- `npm run typecheck` – ohne Fehler
- `npm run lint` – ohne Fehler und Warnungen
- `npm run build` – erfolgreich
- Automatischer Link-Crawler (Playwright): **94 Seiten**, keine kaputten Links, keine Konsolenfehler
- Funktionstests (Playwright, 42 Prüfungen): Hero-Suche, leere Suche, Filter, Sortierung, Spoiler-Schutz, Bewertung, Karte (Marker, Kategorien, Suche, Detailansicht, Deep-Link), KI vollständig entfernt, Starter-Bereich und angeheftete Threads, Release-News mit Quelle, Login-/Profil-/Admin-Schutz ohne Datenbank, 404-Seiten, mobiles Menü, Tastenkürzel-Suche, Sicherheits-Header, robots.txt, Sitemap
- Responsive Prüfung: Desktop (1440 px), iPad Pro 11 und iPhone 13 – kein horizontales Scrollen auf den geprüften Seiten
- Datenbank: Migration gegen PostgreSQL 16 eingespielt, **34 Sicherheitstests** für RLS/Trigger erfolgreich (`supabase/tests/01_rls_test.sql`, `02_starter_test.sql`, `03_dsa_test.sql`)

**Nicht getestet** (externe Dienste nicht verbunden): echte Anmeldung/Registrierung gegen ein Supabase-Projekt, Profilbild-Upload, Community-Schreibaktionen, Melde-Dialog für Gäste, Benachrichtigungsliste und Konto-Löschung im Browser. Die zugehörigen Datenbankregeln sind getestet; der End-to-End-Test steht aus, sobald Zugangsdaten vorliegen.

## Was vom Betreiber noch benötigt wird

1. **Supabase-Projekt** (URL + anon-Key) → Community, Konten, Admin-Bereich werden aktiv
2. **Impressum & Datenschutz**: Platzhalter (orange markiert) ausfüllen und rechtlich prüfen lassen
3. **Kontakt-E-Mail** (`NEXT_PUBLIC_CONTACT_EMAIL`)
4. **Domain** und `NEXT_PUBLIC_SITE_URL`
5. **SMTP-Anbieter** für Bestätigungs-E-Mails im Live-Betrieb

## Release-Inhalte (GTA 6 erscheint laut Rockstar am 19.11.2026)

Nach dem Release sollen Ratgeber, Missionen, Fundorte und Karte mit echten Informationen gefüllt werden. Regeln dafür:

- Fakten recherchieren und **eigene Texte** schreiben, mit Quellenangabe. **Keine** Texte, Bilder, Karten oder Koordinaten-Sammlungen von anderen Seiten kopieren (Urheber- und Datenbankrecht).
- Jeder Eintrag bekommt den passenden Status: „verifiziert“ nur bei offizieller Quelle oder eigener Prüfung im Spiel, sonst „unbestätigt“.
- Kartenmarker erst eintragen, wenn eine rechtlich nutzbare Karte vorliegt (z. B. selbst erstellt).

## Offene Funktionen / nächste Schritte

### Inhalte
- [ ] Echte, geprüfte Ratgeber, Missionen und Geheimnisse nach Release (Status „verifiziert“)
- [ ] Redaktionelle Inhalte aus der Datenbank laden (Tabellen sind vorbereitet; aktuell statisch in `src/data`)
- [ ] Artikel-/Missions-Editor im Admin-Bereich (aktuell: nur Veröffentlichen/Zurückziehen + Kategorien)
- [ ] Eigene Bilder für Beiträge (Bildupload über Supabase Storage)

### Karte
- [ ] Rechtlich nutzbares Kartenmaterial beschaffen oder selbst erstellen
- [ ] Marker aus `map_locations` laden statt aus `src/data/map-locations.ts`
- [ ] Eigene Marker für angemeldete Nutzer (RLS dafür vorhanden)
- [ ] Kartenkacheln für große Karten (`L.tileLayer`)

### Community
- [ ] E-Mail-Versand für Benachrichtigungen und Rückmeldungen an Gast-Meldende (aktuell manuell)
- [ ] Benachrichtigungen bei Antworten
- [ ] „Beste Antwort“ auswählen
- [ ] Öffentliche Profilseiten
- [ ] Zentrale Bewertungsstatistik für Artikel (aktuell nur lokal im Browser gespeichert)

### Technik
- [ ] Zentrales Rate-Limit (z. B. Redis) für Mehr-Instanzen-Betrieb
- [ ] Volltextsuche in Postgres (`tsvector`) statt `ilike`
- [ ] Automatisierte Tests als Teil des Repos (Playwright/Vitest) und CI
- [ ] Content-Security-Policy mit Nonces statt `'unsafe-inline'`

## Wichtige Entscheidungen

- **Keine erfundenen Spielinhalte:** Alle Missionen, Geheimnisse und Fundorte sind als Vorlage/Demo gekennzeichnet.
- **Demo-Modus ohne externe Dienste:** Die Seite ist ohne Supabase/KI voll navigierbar und zeigt verständliche Hinweise.
- **Inhalte als strukturierte Blöcke** statt HTML/Markdown → kein XSS-Risiko, Inhaltsverzeichnis automatisch.
- **KI-Assistent entfernt** (Version 0.2.0) auf Wunsch des Betreibers; Datenschutzerklärung und Umgebungsvariablen entsprechend bereinigt.
- **Community-Start:** 6 angeheftete Team-Threads in der Kategorie „GTA 6 Starter“ (ohne Datenbank direkt sichtbar, mit Datenbank über `seed.sql`).
- **Fehlerbehebung (0.3.0):** Zwei Datenbankfehler behoben: Konten mit Beiträgen ließen sich nicht löschen, und das Ausblenden von Antworten brach ab (Zugriff auf ein nur bei Fragen vorhandenes Feld).
- **Kein Tracking**, daher kein einwilligungspflichtiges Cookie-Banner nötig; nur ein Informationshinweis.
- **Next.js 16:** Middleware heißt jetzt `proxy.ts`.
- **404 bei dynamischen Seiten:** Die Ladeanzeige (`loading.tsx`) liegt nur unter `/community` und `/suche`, damit unbekannte Fragen einen echten 404-Status liefern.

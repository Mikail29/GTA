# 5-Sterne-Kompass

**Dein Weg durch GTA 6.** – Ein unabhängiges, deutschsprachiges und kostenloses Fan- und Hilfeportal rund um Grand Theft Auto VI.

> Der 5-Sterne-Kompass ist ein Fanprojekt und steht in keiner Verbindung zu Rockstar Games oder Take-Two Interactive. Es werden keine geschützten Logos, Screenshots, Karten oder Texte verwendet. Alle Grafiken sind selbst erstellt (CSS/SVG).

## Inhalt

- [Funktionen](#funktionen)
- [Technik](#technik)
- [Installation](#installation)
- [Starten](#starten)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Supabase-Einrichtung](#supabase-einrichtung)
- [Deployment](#deployment)
- [Projektstruktur](#projektstruktur)
- [Sicherheit & Datenschutz](#sicherheit--datenschutz)
- [Inhalte pflegen](#inhalte-pflegen)
- [Offene Funktionen](#offene-funktionen)

## Funktionen

| Bereich | Stand |
| --- | --- |
| Startseite (Hero, Suche, Schnellzugriff, beliebte & neueste Beiträge, News, Community-Vorschau) | ✅ fertig |
| Tipps & Tricks: Übersicht, Kategorien, Suche, Filter, Sortierung, Artikelseiten mit Inhaltsverzeichnis, Lesedauer, verwandten Artikeln, Teilen, Bewertung | ✅ fertig (Demo-Inhalte) |
| Missionen: Übersicht, Filter, Detailseiten mit Schritt-für-Schritt-Anleitung und Spoiler-Schutz | ✅ fertig (Vorlagen) |
| Geheimnisse & Fundorte: Kategorien, Verifizierungsstatus, Spoiler-Kennzeichnung, Kartenverknüpfung | ✅ fertig (Vorlagen) |
| Interaktive Karte (Leaflet): Kategorien, Filter, Suche, Detailansicht, Deep-Links | ✅ Demo mit eigener Platzhalter-Karte |
| Community: Fragen, Antworten, Kommentare, Likes, Bearbeiten, Löschen, Melden, Suche, Kategorien | ✅ fertig (benötigt Supabase, sonst Demo-Modus) |
| Konten: Registrierung, Login, Logout, Passwort zurücksetzen, Profil, Profilbild | ✅ fertig (benötigt Supabase) |
| Admin-Bereich: Dashboard, Meldungen, Beiträge, Nutzer & Rollen, Artikel & Kategorien | ✅ Grundlage fertig (benötigt Supabase) |
| Community-Einstieg „GTA 6 Starter“: Einsteiger-Kategorie, 3-Schritte-Anleitung, 6 angeheftete Team-Threads (Willkommen, Vorstellung, Einsteigerfragen, Release-Countdown, spoilerfreie Eindrücke, Feedback) | ✅ fertig |
| Rechtliche Pflichtfunktionen (DSA/DSGVO): Melden ohne Konto, Meldeformular `/melden`, Benachrichtigungen mit Begründung bei Moderation, Rückmeldung an Meldende, Widerspruchsweg, Konto selbst löschen, Nutzungsbedingungen | ✅ fertig (benötigt Supabase) |
| SEO: Titel, Meta-Descriptions, Open Graph, Sitemap, robots.txt, Canonicals, strukturierte Daten | ✅ fertig |
| Rechtliches: Impressum, Datenschutz, Nutzungsbedingungen, Kontakt, Community-Regeln | ✅ Vorlagen mit Platzhaltern (rechtlich zu prüfen) |

Ohne Supabase läuft die Website vollständig im **Demo-Modus**: alle Seiten funktionieren, Community-Funktionen zeigen gekennzeichnete Beispielbeiträge und verständliche Hinweise.

### Verifizierungsstatus

Jeder Inhalt trägt einen sichtbaren Status:

- **Verifiziert** – durch offizielle Quelle belegt oder selbst im Spiel geprüft
- **Unbestätigt** – noch nicht abschließend geprüft
- **Demo-Inhalt** – Beispielinhalt ohne echte Spielinformation

Es wurden **keine** GTA-6-Spielmechaniken, Missionen oder Fundorte erfunden.

## Technik

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Server Actions) + TypeScript
- Tailwind CSS 4 mit eigenem Designsystem (`src/app/globals.css`)
- Supabase (PostgreSQL, Auth, Storage) mit Row Level Security
- Zod (Validierung) + React Hook Form (Formulare)
- Leaflet (Karte), Lucide Icons
- Schriften lokal über Fontsource (keine Verbindung zu Google Fonts)

## Installation

Voraussetzungen: **Node.js 20.9 oder neuer** (getestet mit Node 22) und npm.

```bash
git clone <repository-url>
cd GTA
npm install
cp .env.example .env.local   # danach Werte eintragen (optional)
```

## Starten

```bash
npm run dev        # Entwicklungsserver auf http://localhost:3000
npm run build      # Produktions-Build
npm start          # Produktionsserver starten
npm run lint       # Code-Prüfung (ESLint)
npm run typecheck  # TypeScript-Prüfung
```

## Umgebungsvariablen

Alle Variablen stehen mit Erklärung in `.env.example`.

| Variable | Pflicht? | Beschreibung |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | empfohlen | Öffentliche URL (Sitemap, Canonical-URLs, E-Mail-Links) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optional | Kontaktadresse für Kontaktseite/Impressum |
| `NEXT_PUBLIC_SUPABASE_URL` | für Community/Konten | Supabase-Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | für Community/Konten | Öffentlicher Supabase-Schlüssel (durch RLS abgesichert) |

> `NEXT_PUBLIC_`-Variablen werden beim Build eingebettet. Nach Änderungen bitte neu bauen.

## Supabase-Einrichtung

Kurzfassung (ausführlich in **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**):

1. Projekt auf supabase.com anlegen (EU-Region wählen).
2. URL und `anon`-Key in `.env.local` eintragen.
3. Alle drei Dateien aus `supabase/migrations/` (in Reihenfolge) im SQL Editor ausführen, danach `supabase/seed.sql` (legt auch die Starter-Threads an).
4. Unter *Authentication → URL Configuration* die Site-URL und `…/auth/callback` als Redirect-URL eintragen.
5. Registrieren, E-Mail bestätigen und den ersten Admin per SQL festlegen (siehe Anleitung).

## Deployment

Die Website ist eine Standard-Next.js-Anwendung und läuft auf jedem Node.js-Hoster.

**Vercel (einfachster Weg):**
1. Repository bei Vercel importieren.
2. Umgebungsvariablen im Projekt eintragen (siehe oben).
3. Deploy starten. `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen und in Supabase als Site-URL/Redirect-URL eintragen.

**Eigener Server (Node.js):**
```bash
npm ci
npm run build
NODE_ENV=production PORT=3000 npm start
```
Davor einen Reverse-Proxy (z. B. nginx/Caddy) mit HTTPS betreiben.

> Hinweis: Das Rate-Limit für Formulare liegt im Arbeitsspeicher. Bei mehreren Server-Instanzen gilt es pro Instanz. Für hohe Last einen zentralen Speicher (z. B. Redis) verwenden. Die Community ist zusätzlich durch das Datenbank-Rate-Limit geschützt.

## Projektstruktur

```
src/
  app/                 Seiten (App Router) – je Rubrik ein Ordner
    admin/             Geschützter Verwaltungsbereich
    auth/callback/     Bestätigungs- und Passwort-Links
  components/          Wiederverwendbare Komponenten (ui, layout, cards, community, map …)
  data/                Inhalte (Ratgeber, Missionen, Geheimnisse, News, Karte, Starter-Threads)
  lib/
    auth/              Session-Prüfung & Auth-Server-Actions
    admin/             Admin-Zugriffsschutz & Aktionen
    community/         Abfragen & Server Actions der Community
    content/           Zugriff auf redaktionelle Inhalte
    supabase/          Supabase-Clients (Server, Browser, Proxy)
    validations/       Zod-Schemas
  types/               TypeScript-Typen
  proxy.ts             Session-Aktualisierung (Next.js 16 „Proxy“, früher Middleware)
supabase/
  migrations/          SQL-Schema inkl. RLS
  seed.sql             Startdaten
  tests/               Lokale Sicherheitstests für RLS
public/map/            Selbst gezeichnete Platzhalter-Karte
docs/                  Zusätzliche Dokumentation
```

## Sicherheit & Datenschutz

- **Berechtigungen serverseitig:** Jede Server Action prüft Anmeldung und Rolle; zusätzlich erzwingt die Datenbank alle Regeln per Row Level Security. Ausgeblendete Buttons sind nie der einzige Schutz.
- **Rollen** (Gast, Nutzer, Moderator, Administrator) liegen in der Datenbank und können nicht über das Frontend verändert werden.
- **Eingaben** werden mit Zod geprüft (Client und Server), Datenbank-Constraints begrenzen Längen und Werte.
- **XSS-Schutz:** Nutzerinhalte werden nur als Text gerendert (kein HTML), redaktionelle Inhalte als strukturierte Blöcke; Content-Security-Policy und weitere Sicherheits-Header sind gesetzt.
- **Spam-Schutz:** Honeypot-Felder, Rate-Limits (Server + Datenbank), E-Mail-Bestätigung, Sperrfunktion.
- **Open-Redirect-Schutz** bei Weiterleitungen nach dem Login.
- **Datenschutz:** kein Tracking, keine externen Schriften oder Skripte, Teilen ohne Social-Media-Plugins, nur technisch notwendige Cookies.

## Inhalte pflegen

Redaktionelle Inhalte liegen aktuell als TypeScript-Dateien in `src/data/`. Ein Artikel besteht aus strukturierten Blöcken (`p`, `h2`, `h3`, `ul`, `ol`, `note`). Neue Einträge einfach ergänzen – Übersicht, Suche und Sitemap übernehmen sie automatisch.

Bitte immer den passenden `status` setzen (`verifiziert`, `unbestaetigt`, `demo`).

## Offene Funktionen

Siehe **[PROJECT_STATUS.md](PROJECT_STATUS.md)** für den aktuellen Stand und die vollständige Liste offener Punkte.

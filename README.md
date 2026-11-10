# GTA6-Kompass

**Dein Weg durch GTA 6.** – Ein unabhängiges, deutschsprachiges und kostenloses Fan- und Hilfeportal rund um Grand Theft Auto VI.

> GTA6-Kompass ist ein Fanprojekt und steht in keiner Verbindung zu Rockstar Games oder Take-Two Interactive. Es werden keine geschützten Logos, Screenshots, Karten oder Texte verwendet. Alle Grafiken sind selbst erstellt (CSS/SVG).

## Inhalt

- [Funktionen](#funktionen)
- [Technik](#technik)
- [Installation](#installation)
- [Starten](#starten)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Supabase-Einrichtung](#supabase-einrichtung)
- [KI-Assistent einrichten](#ki-assistent-einrichten)
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
| KI-Assistent „GTA6-Kompass KI“ | ✅ Oberfläche + sichere Server-API (benötigt API-Schlüssel) |
| SEO: Titel, Meta-Descriptions, Open Graph, Sitemap, robots.txt, Canonicals, strukturierte Daten | ✅ fertig |
| Rechtliches: Impressum, Datenschutz, Kontakt, Community-Regeln | ✅ Vorlagen mit Platzhaltern (rechtlich zu prüfen) |

Ohne Supabase und ohne KI-Schlüssel läuft die Website vollständig im **Demo-Modus**: alle Seiten funktionieren, Community-Funktionen zeigen gekennzeichnete Beispielbeiträge und verständliche Hinweise.

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
- Claude API (`@anthropic-ai/sdk`) als erster KI-Anbieter, über einen austauschbaren Adapter

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
| `AI_PROVIDER` | für KI | `anthropic` oder `none` |
| `ANTHROPIC_API_KEY` | für KI | **Nur serverseitig** – niemals mit `NEXT_PUBLIC_` versehen |
| `AI_MODEL` | optional | Anderes Modell (Standard: `claude-opus-5-5`) |
| `AI_RATE_LIMIT_PER_MINUTE` | optional | Anfragen pro IP und Minute (Standard: 8) |

> `NEXT_PUBLIC_`-Variablen werden beim Build eingebettet. Nach Änderungen bitte neu bauen.

## Supabase-Einrichtung

Kurzfassung (ausführlich in **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**):

1. Projekt auf supabase.com anlegen (EU-Region wählen).
2. URL und `anon`-Key in `.env.local` eintragen.
3. `supabase/migrations/20261110000000_initial_schema.sql` im SQL Editor ausführen, danach `supabase/seed.sql`.
4. Unter *Authentication → URL Configuration* die Site-URL und `…/auth/callback` als Redirect-URL eintragen.
5. Registrieren, E-Mail bestätigen und den ersten Admin per SQL festlegen (siehe Anleitung).

## KI-Assistent einrichten

1. API-Schlüssel bei Anthropic erstellen (kostenpflichtig nach Verbrauch – bitte Preise und Limits prüfen).
2. In `.env.local` (bzw. beim Hoster) setzen:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=…
   ```
3. Neu starten. Ohne Schlüssel zeigt der Chat eine verständliche Konfigurationsmeldung.

So funktioniert die KI:

- Der Browser spricht nur mit der eigenen Route `/api/ki`; der Schlüssel bleibt auf dem Server.
- Rate-Limit pro IP, Längenbegrenzung pro Nachricht und Verlauf, Größenlimit für Anfragen, Herkunftsprüfung.
- Zu jeder Frage werden passende Einträge aus der **eigenen Wissensdatenbank** (Inhalte von GTA6-Kompass inkl. Verifizierungsstatus) mitgegeben. Die KI wird angewiesen, nichts zu erfinden und Unbekanntes offen zu sagen.
- Neue Anbieter: `AiProvider` aus `src/lib/ai/types.ts` implementieren und in `src/lib/ai/provider.ts` eintragen.

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

> Hinweis: Das Rate-Limit für KI und Formulare liegt im Arbeitsspeicher. Bei mehreren Server-Instanzen gilt es pro Instanz. Für hohe Last einen zentralen Speicher (z. B. Redis) verwenden. Die Community ist zusätzlich durch das Datenbank-Rate-Limit geschützt.

## Projektstruktur

```
src/
  app/                 Seiten (App Router) – je Rubrik ein Ordner
    api/ki/            Serverseitige KI-Schnittstelle
    admin/             Geschützter Verwaltungsbereich
    auth/callback/     Bestätigungs- und Passwort-Links
  components/          Wiederverwendbare Komponenten (ui, layout, cards, community, map, chat …)
  data/                Demo-Inhalte (Ratgeber, Missionen, Geheimnisse, News, Karte)
  lib/
    ai/                KI-Adapter, Anbieterwahl, Wissensdatenbank
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

Redaktionelle Inhalte liegen aktuell als TypeScript-Dateien in `src/data/`. Ein Artikel besteht aus strukturierten Blöcken (`p`, `h2`, `h3`, `ul`, `ol`, `note`). Neue Einträge einfach ergänzen – Übersicht, Suche, Sitemap und KI-Wissensdatenbank übernehmen sie automatisch.

Bitte immer den passenden `status` setzen (`verifiziert`, `unbestaetigt`, `demo`).

## Offene Funktionen

Siehe **[PROJECT_STATUS.md](PROJECT_STATUS.md)** für den aktuellen Stand und die vollständige Liste offener Punkte.

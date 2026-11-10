# Supabase einrichten – Schritt für Schritt

Diese Anleitung erklärt, wie du die Datenbank, die Anmeldung und den Bildspeicher für GTA6-Kompass einrichtest. Supabase bietet einen kostenlosen Tarif („Free Plan“); prüfe die aktuellen Bedingungen selbst, bevor du ein Projekt anlegst.

## 1. Projekt anlegen

1. Auf <https://supabase.com> anmelden und **New project** wählen.
2. Name z. B. `gta6-kompass`, ein starkes Datenbank-Passwort vergeben (sicher aufbewahren).
3. **Region:** für eine deutsche Website eine EU-Region wählen (z. B. Frankfurt) – wichtig für die DSGVO.

## 2. Schlüssel in `.env.local` eintragen

Im Dashboard unter **Project Settings → API** findest du:

| Wert im Dashboard | Umgebungsvariable |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

> Der **service_role**-Schlüssel wird von dieser Website **nicht** benötigt und darf niemals in den Code oder in `NEXT_PUBLIC_`-Variablen.

## 3. Datenbankschema einspielen

**Variante A – SQL Editor (am einfachsten):**
1. Im Dashboard **SQL Editor → New query** öffnen.
2. Inhalt von `supabase/migrations/20261110000000_initial_schema.sql` einfügen und **Run** klicken.
3. Danach `supabase/migrations/20261110120000_starter_community.sql` genauso ausführen.
4. Zum Schluss `supabase/seed.sql` ausführen. Das legt die Kategorien, einen Demo-Entwurf und die **6 angehefteten Starter-Threads** der Community „GTA 6 Starter“ an. Erst damit ist die Community beim Start nicht leer.

**Variante B – Supabase CLI:**
```bash
npx supabase login
npx supabase link --project-ref <deine-projekt-ref>
npx supabase db push
```

> Die Dateien in `supabase/tests/` sind nur für lokale Tests mit reinem PostgreSQL gedacht – **nicht** in Supabase ausführen.

## 4. Authentifizierung konfigurieren

Unter **Authentication → URL Configuration**:

- **Site URL:** deine Domain, z. B. `https://gta6-kompass.de` (lokal `http://localhost:3000`)
- **Redirect URLs:** `https://deine-domain.de/auth/callback` und `http://localhost:3000/auth/callback`

Unter **Authentication → Providers → Email**:

- „Confirm email“ **aktiviert** lassen (E-Mail-Bestätigung schützt vor Spam).
- Empfehlung: minimale Passwortlänge auf 10 setzen (entspricht der Prüfung im Formular).

Unter **Authentication → Emails → SMTP Settings**: Für den Live-Betrieb einen eigenen SMTP-Anbieter eintragen. Der eingebaute E-Mail-Versand von Supabase ist nur für Tests gedacht und stark begrenzt.

Optional: E-Mail-Vorlagen unter **Authentication → Emails → Templates** auf Deutsch übersetzen.

## 5. Ersten Administrator festlegen

Rollen kann nur ein Administrator vergeben. Den **ersten** Admin legst du einmalig im SQL Editor fest (dort läufst du mit vollen Rechten):

```sql
begin;
select set_config('app.privileged_update', 'on', true);
update public.profiles set role = 'admin' where username = 'DEIN_BENUTZERNAME';
commit;
```

(Alles zusammen ausführen. Vorher musst du dich mit diesem Benutzernamen registriert und die E-Mail bestätigt haben.) Danach kannst du weitere Moderatoren bequem unter `/admin/nutzer` ernennen.

## 6. Speicher für Profilbilder

Die Migration legt den öffentlichen Bucket `avatars` automatisch an (max. 2 MB, nur PNG/JPG/WebP). Jeder Nutzer darf nur in seinen eigenen Ordner `<user-id>/…` schreiben.

## 7. Neu bauen

Nach dem Eintragen der Umgebungsvariablen die Website **neu bauen und starten** (`npm run build && npm start`), da `NEXT_PUBLIC_`-Variablen beim Build eingebettet werden.

---

## Sicherheitskonzept im Überblick

| Bereich | Schutz |
| --- | --- |
| Alle Tabellen | Row Level Security aktiv, keine Schreibrechte für `anon` |
| Rollen | Spaltenrechte + Trigger verhindern Selbständerung; nur `admin_set_role()` (prüft `is_admin()`) |
| Beiträge | Nur eigene Beiträge bearbeiten/löschen; Moderatoren dürfen alles moderieren |
| Geschützte Felder | `is_hidden`, Zähler, Autor, Status „geschlossen“ – per Trigger geschützt |
| Spam | Rate-Limit in der Datenbank (3 Fragen/10 Min., 6 Antworten/5 Min., 10 Kommentare/5 Min.) + Honeypot-Felder + Server-Rate-Limit |
| Gesperrte Konten | Können nicht posten, liken oder melden |
| Meldungen | Nutzer sehen nur eigene, Moderation sieht alle |
| Redaktionelle Inhalte | Lesen nur veröffentlicht; Schreiben nur Admins |
| Angeheftete / Team-Beiträge | Nur Moderation darf anheften, nur Admins „offiziell“ markieren |
| Karte | Öffentliche Marker nur durch Admins; Nutzer dürfen nur private eigene Marker anlegen |

Die Regeln wurden mit `supabase/tests/01_rls_test.sql` gegen PostgreSQL 16 geprüft (23 Testfälle). So führst du die Tests lokal aus:

```bash
createdb gta_test
psql -d gta_test -f supabase/tests/00_local_stubs.sql
psql -d gta_test -f supabase/migrations/20261110000000_initial_schema.sql
psql -d gta_test -f supabase/migrations/20261110120000_starter_community.sql
psql -d gta_test -f supabase/tests/01_rls_test.sql      # alle Zeilen "T.. : true"
psql -d gta_test -f supabase/seed.sql
psql -d gta_test -f supabase/tests/02_starter_test.sql  # alle Zeilen "S.. : true"
```

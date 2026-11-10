-- =====================================================================
-- 5-Sterne-Kompass – Startdaten (Kategorien + ein Demo-Artikel als Entwurf)
-- Ausführen NACH der Migration, z. B. im Supabase SQL Editor.
-- Enthält bewusst KEINE erfundenen GTA-6-Spielinformationen.
-- =====================================================================

insert into public.categories (section, slug, name, description) values
  ('artikel', 'anfaenger', 'Anfänger-Tipps', 'Der leichte Einstieg'),
  ('artikel', 'fahrzeuge', 'Fahrzeuge', 'Autos, Boote und mehr'),
  ('artikel', 'waffen', 'Waffen', 'Ausrüstung und Taktik'),
  ('artikel', 'geld', 'Geld & Wirtschaft', 'Sparen und investieren'),
  ('artikel', 'gameplay', 'Gameplay', 'Spielmechaniken und Systeme'),
  ('artikel', 'charaktere', 'Charaktere', 'Hintergründe zu den Figuren'),
  ('artikel', 'einstellungen', 'Einstellungen', 'Grafik, Steuerung, Barrierefreiheit'),
  ('artikel', 'fortgeschritten', 'Fortgeschrittene Tipps', 'Für Profis'),
  ('missionen', 'hauptstory', 'Hauptstory', 'Missionen der Haupthandlung'),
  ('missionen', 'nebenmissionen', 'Nebenmissionen', 'Optionale Aufträge'),
  ('missionen', 'aktivitaeten', 'Aktivitäten', 'Freizeit und Minispiele'),
  ('missionen', 'herausforderungen', 'Herausforderungen', 'Sonderziele'),
  ('geheimnisse', 'easter-eggs', 'Easter Eggs', 'Versteckte Anspielungen'),
  ('geheimnisse', 'versteckte-orte', 'Versteckte Orte', 'Abgelegene Plätze'),
  ('geheimnisse', 'gegenstaende', 'Besondere Gegenstände', 'Seltene Objekte'),
  ('geheimnisse', 'sammelobjekte', 'Sammelobjekte', 'Alles zum Sammeln'),
  ('geheimnisse', 'seltene-fahrzeuge', 'Seltene Fahrzeuge', 'Besondere Fahrzeuge'),
  ('geheimnisse', 'geheimnisse', 'Geheimnisse', 'Mysterien und Rätsel'),
  ('community', 'allgemein', 'Allgemeine Fragen', null),
  ('community', 'missionen', 'Missionen', null),
  ('community', 'fahrzeuge', 'Fahrzeuge', null),
  ('community', 'geheimnisse', 'Geheimnisse', null),
  ('community', 'gameplay', 'Gameplay', null),
  ('community', 'technik', 'Technische Probleme', null)
on conflict (section, slug) do nothing;

insert into public.articles (slug, title, excerpt, body, category_id, status, tags, is_published)
select 'demo-datenbank-artikel',
       'Demo: Artikel aus der Datenbank',
       'Beispiel-Entwurf, um die Veröffentlichen-Funktion im Admin-Bereich zu testen.',
       '[{"type":"p","text":"Dies ist ein Demo-Artikel ohne echte Spielinformationen."}]'::jsonb,
       (select id from public.categories where section = 'artikel' and slug = 'anfaenger'),
       'demo', array['Demo'], false
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Community „GTA 6 Starter“: angeheftete Starter-Threads des Teams
-- (Benötigt Migration 20261110120000_starter_community.sql)
-- ---------------------------------------------------------------------
insert into public.questions (title, body, category, is_pinned, is_official, created_at)
select v.title, v.body, 'starter', true, true, v.created_at
from (values
  ('Willkommen in der GTA-6-Community – hier startest du!', 'Schön, dass du da bist! 🌴

Der 5-Sterne-Kompass ist eine kostenlose, deutschsprachige Community, in der sich Spielerinnen und Spieler gegenseitig bei GTA 6 helfen.

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

Viel Spaß – wir sehen uns in Vice City!', now() - interval '0 minutes'),
  ('Stell dich vor: Wer bist du und worauf freust du dich bei GTA 6?', 'Hier ist Platz für deine Vorstellung!

Erzähl uns zum Beispiel:
• Wie sollen wir dich nennen?
• Welche GTA-Teile hast du schon gespielt?
• Auf welcher Plattform spielst du?
• Worauf freust du dich bei GTA 6 am meisten?

Bitte keine persönlichen Daten wie Adresse oder Telefonnummer posten.', now() - interval '1 minutes'),
  ('Einsteigerfragen-Sammelthread: Keine Frage ist zu einfach', 'Du bist neu bei GTA oder Open-World-Spielen? Dann stell deine Frage einfach hier als Antwort.

Typische Einsteigerfragen:
• Welche Einstellungen sollte ich am Anfang anpassen?
• Wie vermeide ich Spoiler?
• Wo finde ich Hilfe zu einer bestimmten Mission?

Größere Fragen gerne als eigene Frage mit passender Kategorie stellen – dann finden andere sie später leichter über die Suche.', now() - interval '2 minutes'),
  ('Release-Countdown: Auf welcher Konsole spielst du GTA 6?', 'Laut Rockstar Games erscheint GTA 6 am 19. November 2026 für PlayStation 5 und Xbox Series X|S (Quelle: Rockstar Newswire – Termine können sich ändern, bitte offiziell prüfen).

Auf welcher Konsole spielst du? Startest du direkt am Release-Tag oder wartest du noch?

Bitte keine Leaks oder Spoiler in diesem Thread.', now() - interval '3 minutes'),
  ('Spoilerfreie Zone: Eure ersten Eindrücke nach dem Release', 'Hier sammeln wir nach dem Release eure ersten Eindrücke – komplett OHNE Story-Spoiler.

Erlaubt: Grafik, Steuerung, Gefühl beim Fahren, Lieblingsorte (ohne Story-Bezug), Technik und Leistung.
Nicht erlaubt: Story-Details, Wendungen, Enden, Missionsinhalte.

Für Story-Diskussionen bitte eine eigene Frage in der Kategorie „Missionen“ erstellen und den Spoiler im Titel kennzeichnen.', now() - interval '4 minutes'),
  ('Feedback & Wünsche: Was soll der 5-Sterne-Kompass noch bieten?', 'Die Seite wächst mit der Community. Welche Ratgeber, Funktionen oder Karten-Kategorien wünschst du dir?

Fehler auf der Website oder falsche Informationen gefunden? Schreib sie gerne hier hinein – jede Rückmeldung hilft.', now() - interval '5 minutes')
) as v(title, body, created_at)
where not exists (select 1 from public.questions q where q.is_official and q.title = v.title);

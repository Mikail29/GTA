-- =====================================================================
-- GTA6-Kompass – Startdaten (Kategorien + ein Demo-Artikel als Entwurf)
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

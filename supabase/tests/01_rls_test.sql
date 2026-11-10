-- Sicherheitstests für RLS, Trigger und Rechte. Erwartung: alle Zeilen "T.. : true".
-- Die ERROR-Meldungen zwischen den Tests sind beabsichtigt (blockierte Aktionen).
\set QUIET on
\pset tuples_only on
-- Testnutzer anlegen (Profil entsteht per Trigger)
insert into auth.users values ('11111111-1111-1111-1111-111111111111', '{"username":"alice"}'),
  ('22222222-2222-2222-2222-222222222222', '{"username":"bob"}'),
  ('33333333-3333-3333-3333-333333333333', '{"username":"Alice"}'),
  ('44444444-4444-4444-4444-444444444444', '{"username":"<script>"}');
select 'profiles: ' || string_agg(username || ':' || role, ', ' order by username) from public.profiles;
-- bob wird Moderator (direkt als Superuser über privilegierten Pfad)
select set_config('app.privileged_update','on',false); update public.profiles set role='moderator' where username='bob'; select set_config('app.privileged_update','off',false);

-- ===== alice (normaler Nutzer)
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
update public.profiles set role = 'admin', is_banned = false where id = auth.uid();
select 'T1 Rolle selbst ändern blockiert: ' || (role = 'user') from public.profiles where id = auth.uid();
\set ON_ERROR_STOP off
update public.profiles set username = 'alice_neu' where id = auth.uid();
select 'T2 Benutzername ändern: ' || (username = 'alice_neu') from public.profiles where id = auth.uid();
update public.profiles set bio = 'gehackt' where username = 'bob';
select 'T3 Fremdes Profil ändern blockiert: ' || (bio is null) from public.profiles where username = 'bob';
insert into public.questions (author_id, title, body, category) values ('22222222-2222-2222-2222-222222222222', 'Fremder Autor Titel', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
select 'T4 Frage als anderer Autor blockiert: ' || (count(*) = 0) from public.questions;
insert into public.questions (author_id, title, body, category, is_hidden) values (auth.uid(), 'Versteckt schon beim Anlegen', 'Dies ist ein Text mit genug Zeichen.', 'allgemein', true);
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Meine erste Testfrage', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
select 'T5 Eigene Frage anlegen: ' || (count(*) = 1) from public.questions;
update public.questions set is_hidden = true, likes_count = 999, answers_count = 50, status = 'geschlossen' where author_id = auth.uid();
select 'T6 Geschützte Spalten unverändert: ' || (not is_hidden and likes_count = 0 and answers_count = 0 and status = 'offen') from public.questions;
insert into public.answers (question_id, author_id, body) select id, auth.uid(), 'Eine Antwort' from public.questions;
select 'T7 Antwortzähler per Trigger: ' || answers_count from public.questions;
insert into public.likes (user_id, target_type, target_id) select auth.uid(), 'question', id from public.questions;
insert into public.likes (user_id, target_type, target_id) select auth.uid(), 'question', id from public.questions;
select 'T8 Like-Zähler (Doppel-Like verhindert): ' || likes_count from public.questions;
insert into public.likes (user_id, target_type, target_id) values (auth.uid(), 'question', gen_random_uuid());
select 'T9 Like auf nicht existierendes Ziel blockiert: ' || (count(*) = 1) from public.likes;
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Zweite Testfrage hier', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Dritte Testfrage hier', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Vierte Testfrage (Spam)', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
select 'T10 Rate-Limit (max. 3 in 10 Min.): ' || (count(*) = 3) from public.questions;
select public.admin_set_role('22222222-2222-2222-2222-222222222222', 'admin');
select public.moderate_set_hidden('questions', (select id from public.questions limit 1), true);
insert into public.reports (reporter_id, target_type, target_id, reason) select auth.uid(), 'question', id, 'spam' from public.questions where title like 'Zweite%';
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Kategorie ungültig', 'Dies ist ein Text mit genug Zeichen.', 'hack');
insert into public.articles (slug, title, excerpt, is_published) values ('hack', 'Hack-Artikel', 'x', true);
select 'T11 Artikel schreiben als Nutzer blockiert: ' || (count(*) = 0) from public.articles;
insert into public.map_locations (title, category, x, y, is_public, created_by) values ('Öffentlich?', 'fundort', 1, 1, true, auth.uid());
insert into public.map_locations (title, category, x, y, created_by) values ('Mein Marker', 'fundort', 1, 1, auth.uid());
select 'T12 Nur privater eigener Marker erlaubt: ' || (count(*) = 1 and bool_and(not is_public)) from public.map_locations;
reset role;

-- ===== bob (Moderator) sieht und versteckt
set role authenticated; set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select 'T13 Moderator sieht Meldungen: ' || (count(*) = 1) from public.reports;
select public.moderate_set_hidden('questions', (select id from public.questions where title like 'Zweite%'), true);
select public.admin_set_role('11111111-1111-1111-1111-111111111111', 'admin');
select 'T14 Moderator kann keine Rollen vergeben: ' || (role = 'user') from public.profiles where id = '11111111-1111-1111-1111-111111111111';
select public.moderate_set_banned('11111111-1111-1111-1111-111111111111', true);
reset role;

-- ===== anon
set role anon; set request.jwt.claim.sub = '';
select 'T15 Anon sieht versteckte Frage nicht: ' || (count(*) = 2) from public.questions;
insert into public.questions (author_id, title, body, category) values (null, 'Anonymer Spam hier', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
select 'T16 Anon sieht keine Meldungen/Likes: ' || ((select count(*) from public.reports) = 0 and (select count(*) from public.likes) = 0);
reset role;

-- ===== alice (jetzt gesperrt)
set role authenticated; set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
select 'T17 Gesperrte Autorin sieht eigene versteckte Frage: ' || (count(*) = 3) from public.questions;
insert into public.answers (question_id, author_id, body) select id, auth.uid(), 'Gesperrt antworten' from public.questions where title like 'Dritte%';
select 'T18 Gesperrter Nutzer kann nicht antworten: ' || (count(*) = 1) from public.answers;
reset role;
select 'T19 Namenskonflikt Alice/alice gelöst, <script> bereinigt: ' || string_agg(username, ', ' order by username) from public.profiles;

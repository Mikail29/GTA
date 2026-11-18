-- Tests für die Speicherfristen. Ausführen NACH 03_dsa_test.sql.
\pset tuples_only on
\set ON_ERROR_STOP off
insert into auth.users values ('77777777-7777-7777-7777-777777777777', '{"username":"emil"}');
set role authenticated; set request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Alte Frage von Emil', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Neue Frage von Emil', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
reset role;

-- Moderator bob blendet beide Fragen aus
set role authenticated; set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select public.moderate_set_hidden('questions', (select id from public.questions where title = 'Alte Frage von Emil'), true, 'Spam');
select public.moderate_set_hidden('questions', (select id from public.questions where title = 'Neue Frage von Emil'), true, 'Spam');
reset role;
select 'R1 Ausblenden setzt hidden_at: ' || (count(*) = 2 and bool_and(hidden_at is not null)) from public.questions where title like '% von Emil';

-- Emil versucht, das Datum zu verändern
set role authenticated; set request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
update public.questions set hidden_at = now() - interval '1 year' where author_id = auth.uid();
reset role;
select 'R2 hidden_at nicht selbst änderbar: ' || bool_and(hidden_at > now() - interval '1 day') from public.questions where title like '% von Emil';

-- Testdaten künstlich altern lassen (wie im SQL Editor)
alter table public.questions disable trigger questions_track_hidden;
update public.questions set hidden_at = now() - interval '7 months' where title = 'Alte Frage von Emil';
alter table public.questions enable trigger questions_track_hidden;
insert into public.reports (target_type, target_id, reason, status, resolved_at, created_at) values
  ('question', gen_random_uuid(), 'spam', 'erledigt', now() - interval '7 months', now() - interval '8 months'),
  ('question', gen_random_uuid(), 'spam', 'abgelehnt', now() - interval '1 month', now() - interval '2 months'),
  ('question', gen_random_uuid(), 'spam', 'offen', null, now() - interval '9 months');
insert into public.notifications (user_id, kind, message, created_at) values
  ('77777777-7777-7777-7777-777777777777', 'info', 'Sehr alte Nachricht', now() - interval '13 months'),
  ('77777777-7777-7777-7777-777777777777', 'info', 'Neue Nachricht', now() - interval '1 month');

-- Normale Nutzerin darf nicht aufräumen
set role authenticated; set request.jwt.claim.sub = '77777777-7777-7777-7777-777777777777';
select public.cleanup_old_data();
reset role;
select 'R3 Nur Admins dürfen aufräumen: ' || (count(*) = 1) from public.questions where title = 'Alte Frage von Emil';

-- Admin anlegen (wie in der Anleitung per SQL Editor) und aufräumen
insert into auth.users values ('88888888-8888-8888-8888-888888888888', '{"username":"chefin"}');
begin;
select set_config('app.privileged_update', 'on', true);
update public.profiles set role = 'admin' where id = '88888888-8888-8888-8888-888888888888';
commit;
set role authenticated; set request.jwt.claim.sub = '88888888-8888-8888-8888-888888888888';
select 'R4 Ergebnis: ' || public.cleanup_old_data()::text;
reset role;
select 'R5 Alte ausgeblendete Frage gelöscht, neue bleibt: ' || (not exists (select 1 from public.questions where title = 'Alte Frage von Emil') and exists (select 1 from public.questions where title = 'Neue Frage von Emil'));
select 'R6 Alte erledigte Meldung gelöscht: ' || (count(*) = 0) from public.reports where status <> 'offen' and resolved_at < now() - interval '6 months';
select 'R6b Neue und offene Meldungen bleiben: ' || ((select count(*) from public.reports where status = 'abgelehnt' and resolved_at > now() - interval '2 months') >= 1 and (select count(*) from public.reports where status = 'offen' and created_at < now() - interval '8 months') = 1);
select 'R7 Alte Benachrichtigung gelöscht, neue bleibt: ' || (not exists (select 1 from public.notifications where message = 'Sehr alte Nachricht') and exists (select 1 from public.notifications where message = 'Neue Nachricht'));
select 'R8 Keine zweite Lösch-Benachrichtigung beim Aufräumen: ' || (count(*) = 0) from public.notifications where message like '%„Alte Frage von Emil“ wurde vom Moderationsteam gelöscht%';

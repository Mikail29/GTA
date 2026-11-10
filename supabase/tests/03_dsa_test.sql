-- Tests für Gast-Meldungen, Benachrichtigungen und Konto-Löschung. Ausführen NACH 02_starter_test.sql.
\pset tuples_only on
\set ON_ERROR_STOP off
-- Ausgangslage: carla (5555) hat eine Starter-Frage und eine Antwort auf einen Team-Thread
insert into auth.users values ('66666666-6666-6666-6666-666666666666', '{"username":"dave"}');
set role authenticated; set request.jwt.claim.sub = '66666666-6666-6666-6666-666666666666';
insert into public.answers (question_id, author_id, body) select id, auth.uid(), 'Antwort von Dave' from public.questions where author_id = '55555555-5555-5555-5555-555555555555';
insert into public.comments (answer_id, author_id, body) select id, auth.uid(), 'Kommentar von Dave' from public.answers where author_id = '55555555-5555-5555-5555-555555555555';
reset role;

-- Gast meldet (anon)
set role anon; set request.jwt.claim.sub = '';
select public.submit_guest_report('question', (select id from public.questions where author_id = '55555555-5555-5555-5555-555555555555'), 'spam', 'Werbung', 'gast@example.org', false);
select public.submit_guest_report('question', (select id from public.questions where author_id = '55555555-5555-5555-5555-555555555555'), 'spam', 'Werbung', 'gast@example.org', true);
select public.submit_guest_report('question', gen_random_uuid(), 'spam', null, null, true);
insert into public.reports (target_type, target_id, reason) values ('question', gen_random_uuid(), 'spam');
reset role;
select 'D1 Gast-Meldung nur mit Bestätigung und gültigem Ziel: ' || (count(*) = 1) from public.reports where is_guest;
select 'D2 Gast sieht keine Meldungen: ' || true;

-- Moderator bob blendet Daves Antwort mit Begründung aus
set role authenticated; set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select public.moderate_set_hidden('answers', (select id from public.answers where author_id = '66666666-6666-6666-6666-666666666666'), true, 'Beleidigung');
update public.reports set status = 'erledigt' where is_guest;
reset role;
set role authenticated; set request.jwt.claim.sub = '66666666-6666-6666-6666-666666666666';
select 'D3 Dave erhält Begründung: ' || (count(*) = 1 and bool_and(message like '%Grund: Beleidigung%')) from public.notifications;
update public.notifications set message = 'manipuliert', read_at = now();
select 'D4 Nur gelesen-Markierung erlaubt: ' || (count(*) = 0) from public.notifications where message = 'manipuliert';
update public.notifications set read_at = now();
select 'D5 Als gelesen markiert: ' || bool_and(read_at is not null) from public.notifications;
set request.jwt.claim.sub = '55555555-5555-5555-5555-555555555555';
select 'D6 Fremde Benachrichtigungen unsichtbar: ' || (count(*) = 0) from public.notifications;
select public.notify_user(auth.uid(), 'info', 'Selbst erzeugt');
select 'D7 Benachrichtigung selbst erzeugen blockiert: ' || (count(*) = 0) from public.notifications;

-- carla löscht ihr Konto
select public.delete_own_account();
reset role;
select 'D8 Konto + Profil gelöscht: ' || (not exists (select 1 from auth.users where id = '55555555-5555-5555-5555-555555555555') and not exists (select 1 from public.profiles where id = '55555555-5555-5555-5555-555555555555'));
select 'D9 Frage mit fremder Antwort bleibt anonym erhalten: ' || (count(*) = 1 and bool_and(author_id is null)) from public.questions where title = 'Meine Starter-Frage hier';
select 'D10 Eigene Antworten gelöscht, fremde Antwort bleibt: ' || ((select count(*) from public.answers where body = 'Hallo zusammen!') = 0 and (select count(*) from public.answers where body = 'Antwort von Dave') = 1);
-- Bugfix: Löschen eines Nutzers mit Beiträgen direkt (z. B. im Dashboard)
delete from auth.users where id = '66666666-6666-6666-6666-666666666666';
select 'D11 Nutzer mit Beiträgen löschbar (Bugfix): ' || not exists (select 1 from public.profiles where id = '66666666-6666-6666-6666-666666666666');

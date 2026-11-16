-- Tests für angeheftete Team-Beiträge und die entfernte Kategorie „starter“.
-- Ausführen NACH 01_rls_test.sql und supabase/seed.sql.
\pset tuples_only on
-- Team-Beitrag so anlegen, wie es ein Admin im SQL Editor tun würde
insert into public.questions (title, body, category, is_pinned, is_official) values ('Willkommen im Team-Thread', 'Dies ist ein Text mit genug Zeichen.', 'allgemein', true, true);
select 'P1 Kategorie „starter“ entfernt: ' || (not exists (select 1 from public.categories where section = 'community' and slug = 'starter'));
insert into auth.users values ('55555555-5555-5555-5555-555555555555', '{"username":"carla"}');
set role authenticated; set request.jwt.claim.sub = '55555555-5555-5555-5555-555555555555';
\set ON_ERROR_STOP off
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Frage in alter Kategorie', 'Dies ist ein Text mit genug Zeichen.', 'starter');
select 'P2 Kategorie „starter“ nicht mehr erlaubt: ' || (count(*) = 0) from public.questions where author_id = auth.uid();
insert into public.questions (author_id, title, body, category, is_pinned, is_official) values (auth.uid(), 'Ich bin offiziell!!', 'Dies ist ein Text mit genug Zeichen.', 'allgemein', true, true);
select 'P3 Nutzer kann nicht als Team/angeheftet posten: ' || (count(*) = 0) from public.questions where author_id = auth.uid();
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Meine erste Frage hier', 'Dies ist ein Text mit genug Zeichen.', 'allgemein');
update public.questions set is_pinned = true, is_official = true where author_id = auth.uid();
select 'P4 Frage ok, Anheften selbst blockiert: ' || (count(*) = 1 and bool_and(not is_pinned and not is_official)) from public.questions where author_id = auth.uid();
select public.moderate_set_pinned((select id from public.questions where author_id = auth.uid()), true);
select 'P5 Nur Moderation darf anheften: ' || (count(*) = 1 and bool_and(not is_pinned)) from public.questions where author_id = auth.uid();
insert into public.answers (question_id, author_id, body) select id, auth.uid(), 'Hallo zusammen!' from public.questions where is_official limit 1;
select 'P6 Antwort auf Team-Thread möglich: ' || (count(*) = 1) from public.answers where author_id = auth.uid();
reset role;

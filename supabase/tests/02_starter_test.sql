-- Tests für die Community „GTA 6 Starter“. Ausführen NACH 01_rls_test.sql und supabase/seed.sql.
\pset tuples_only on
select 'S1 Starter-Threads angelegt: ' || (count(*) = 6) from public.questions where is_official and is_pinned and category = 'starter';
insert into auth.users values ('55555555-5555-5555-5555-555555555555', '{"username":"carla"}');
set role authenticated; set request.jwt.claim.sub = '55555555-5555-5555-5555-555555555555';
\set ON_ERROR_STOP off
insert into public.questions (author_id, title, body, category, is_pinned, is_official) values (auth.uid(), 'Ich bin offiziell!!', 'Dies ist ein Text mit genug Zeichen.', 'starter', true, true);
select 'S2 Nutzer kann nicht als Team/angeheftet posten: ' || (count(*) = 0) from public.questions where author_id = auth.uid();
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Meine Starter-Frage hier', 'Dies ist ein Text mit genug Zeichen.', 'starter');
update public.questions set is_pinned = true, is_official = true where author_id = auth.uid();
select 'S3 Starter-Frage ok, Anheften selbst blockiert: ' || (count(*) = 1 and bool_and(not is_pinned and not is_official)) from public.questions where author_id = auth.uid();
select public.moderate_set_pinned((select id from public.questions where author_id = auth.uid()), true);
insert into public.answers (question_id, author_id, body) select id, auth.uid(), 'Hallo zusammen!' from public.questions where is_official limit 1;
select 'S4 Antwort auf Starter-Thread möglich: ' || (count(*) = 1) from public.answers where author_id = auth.uid();
reset role;

-- Teil 3: Mitteilungen und keine Mindestlänge (setzt Seed voraus)
insert into auth.users values ('99999999-9999-9999-9999-999999999999', '{"username":"mira"}') on conflict do nothing;
set role authenticated; set request.jwt.claim.sub = '99999999-9999-9999-9999-999999999999';
insert into public.questions (author_id, title, body, category) values (auth.uid(), 'Hi', '', 'allgemein');
insert into public.questions (author_id, title, body, category, kind) values (auth.uid(), 'Neuer Ort', '', 'allgemein', 'mitteilung');
insert into public.answers (question_id, author_id, body) select id, auth.uid(), 'k' from public.questions where title = 'Hi';
insert into public.comments (answer_id, author_id, body) select id, auth.uid(), 'x' from public.answers where body = 'k';
reset role;
select 'M1 kurze Frage ohne Text gespeichert: ' || (count(*) = 1)::text from public.questions where title = 'Hi' and body = '' and kind = 'frage';
select 'M2 Mitteilung gespeichert: ' || (count(*) = 1)::text from public.questions where title = 'Neuer Ort' and kind = 'mitteilung';
select 'M3 Antwort mit 1 Zeichen: ' || (count(*) = 1)::text from public.answers where body = 'k';
select 'M4 Antwort auf Antwort mit 1 Zeichen: ' || (count(*) = 1)::text from public.comments where body = 'x';
do $$ begin
  begin insert into public.questions (author_id, title, body, category) values ('99999999-9999-9999-9999-999999999999', '', '', 'allgemein'); raise notice 'M5 leerer Titel abgelehnt: false';
  exception when check_violation then raise notice 'M5 leerer Titel abgelehnt: true'; end;
  begin insert into public.questions (author_id, title, body, category, kind) values ('99999999-9999-9999-9999-999999999999', 'Test', '', 'allgemein', 'quatsch'); raise notice 'M6 falsche Art abgelehnt: false';
  exception when check_violation then raise notice 'M6 falsche Art abgelehnt: true'; end;
end $$;

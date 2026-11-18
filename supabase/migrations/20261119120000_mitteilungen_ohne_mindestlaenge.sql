-- =====================================================================
-- 5-Sterne-Kompass – Teil 3: „Etwas mitteilen“ und keine Mindestlänge mehr
--  * questions.kind: 'frage' (Standard) oder 'mitteilung'
--  * Titel: 1–140 Zeichen (vorher mindestens 10), Beschreibung: darf leer sein (vorher mindestens 20)
--  * Antworten und Antworten auf Antworten: ab 1 Zeichen (vorher 5 bzw. 2)
-- Die Datei kann gefahrlos mehrfach ausgeführt werden.
-- =====================================================================

alter table public.questions add column if not exists kind text not null default 'frage';
alter table public.questions drop constraint if exists questions_kind_check;
alter table public.questions add constraint questions_kind_check check (kind in ('frage', 'mitteilung'));

alter table public.questions drop constraint if exists questions_title_check;
alter table public.questions add constraint questions_title_check check (length(title) between 1 and 140);
alter table public.questions drop constraint if exists questions_body_check;
alter table public.questions add constraint questions_body_check check (length(body) <= 5000);

alter table public.answers drop constraint if exists answers_body_check;
alter table public.answers add constraint answers_body_check check (length(body) between 1 and 5000);

alter table public.comments drop constraint if exists comments_body_check;
alter table public.comments add constraint comments_body_check check (length(body) between 1 and 1000);

-- Supabase die neue Spalte sofort bekannt machen
notify pgrst, 'reload schema';

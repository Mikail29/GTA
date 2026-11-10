-- =====================================================================
-- 5-Sterne-Kompass – Community „GTA 6 Starter“
--  * Neue Kategorie „starter“
--  * Angeheftete (is_pinned) und offizielle Team-Beiträge (is_official)
--  * Nur Moderation darf anheften; „offiziell“ setzen nur Admins/Server
--  * Rate-Limit-Trigger erlaubt Einfügen ohne Nutzerkontext (SQL Editor/Seed)
-- =====================================================================

alter table public.questions
  add column is_pinned boolean not null default false,
  add column is_official boolean not null default false;

create index questions_pinned_idx on public.questions (is_pinned desc, created_at desc) where not is_hidden;

alter table public.questions drop constraint questions_category_check;
alter table public.questions add constraint questions_category_check
  check (category in ('starter', 'allgemein', 'missionen', 'fahrzeuge', 'geheimnisse', 'gameplay', 'technik'));

-- Nutzer dürfen beim Anlegen weder anheften noch „offiziell“ markieren
drop policy "Fragen erstellen" on public.questions;
create policy "Fragen erstellen" on public.questions for insert to authenticated
  with check (
    author_id = auth.uid() and not is_hidden and status = 'offen'
    and likes_count = 0 and answers_count = 0 and not is_pinned and not is_official
  );

-- Schutz beim Bearbeiten
create or replace function public.protect_question_flags()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not public.is_moderator() then
    new.is_pinned := old.is_pinned;
  end if;
  if not public.is_admin() then
    new.is_official := old.is_official;
  end if;
  return new;
end;
$$;
create trigger questions_protect_flags before update on public.questions
  for each row execute function public.protect_question_flags();

-- Rate-Limit nur für angemeldete Nutzer prüfen. Einfügungen ohne Nutzerkontext
-- sind nur mit Admin-Rechten (SQL Editor / Seed) möglich, weil anon keine
-- Schreibrechte hat und RLS bei authenticated immer auth.uid() voraussetzt.
create or replace function public.enforce_post_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recent int;
  max_per_window int;
begin
  if auth.uid() is null then
    return new;
  end if;

  if not public.is_active_user() then
    raise exception 'Konto gesperrt oder nicht vorhanden' using errcode = '42501';
  end if;

  if tg_table_name = 'questions' then
    select count(*) into recent from public.questions where author_id = auth.uid() and created_at > now() - interval '10 minutes';
    max_per_window := 3;
  elsif tg_table_name = 'answers' then
    select count(*) into recent from public.answers where author_id = auth.uid() and created_at > now() - interval '5 minutes';
    max_per_window := 6;
  else
    select count(*) into recent from public.comments where author_id = auth.uid() and created_at > now() - interval '5 minutes';
    max_per_window := 10;
  end if;

  if recent >= max_per_window then
    raise exception 'rate_limit: zu viele Beiträge in kurzer Zeit' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

-- Anheften/Lösen durch Moderation
create or replace function public.moderate_set_pinned(target_id uuid, pinned boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_moderator() then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  update public.questions set is_pinned = pinned where id = target_id;
end;
$$;
revoke execute on function public.moderate_set_pinned(uuid, boolean) from public, anon;
grant execute on function public.moderate_set_pinned(uuid, boolean) to authenticated;
revoke execute on function public.protect_question_flags() from public, anon;

insert into public.categories (section, slug, name, description)
values ('community', 'starter', 'GTA 6 Starter', 'Neu hier? Stell dich vor und stelle Einsteigerfragen.')
on conflict (section, slug) do nothing;

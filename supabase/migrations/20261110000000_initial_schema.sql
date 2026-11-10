-- =====================================================================
-- GTA6-Kompass – Initiales Datenbankschema (Supabase / PostgreSQL)
--
-- Sicherheitsprinzipien:
--  * Row Level Security (RLS) auf ALLEN Tabellen aktiv.
--  * Keine öffentlichen Schreibrechte: Schreiben nur für angemeldete Nutzer
--    auf eigene Datensätze bzw. für Moderatoren/Administratoren.
--  * Rollen stehen in profiles.role und können von Nutzern NICHT selbst
--    geändert werden (Spaltenrechte + Trigger). Änderungen nur über
--    admin_set_role(), das intern is_admin() prüft.
--  * Zähler (Likes/Antworten) werden ausschließlich per Trigger gepflegt.
--  * Datenbankseitiges Rate-Limit gegen Spam.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Aufzählungstypen
-- ---------------------------------------------------------------------
create type public.user_role as enum ('user', 'moderator', 'admin');
create type public.verification_status as enum ('verifiziert', 'unbestaetigt', 'demo');
create type public.question_status as enum ('offen', 'beantwortet', 'geschlossen');
create type public.report_status as enum ('offen', 'erledigt', 'abgelehnt');
create type public.like_target as enum ('question', 'answer');
create type public.report_target as enum ('question', 'answer', 'comment');

-- ---------------------------------------------------------------------
-- Hilfsfunktion: updated_at automatisch setzen
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- =====================================================================
-- PROFILES
-- =====================================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null check (username ~ '^[A-Za-z0-9_-]{3,24}$'),
  avatar_url  text check (avatar_url is null or length(avatar_url) <= 500),
  bio         text check (bio is null or length(bio) <= 280),
  role        public.user_role not null default 'user',
  is_banned   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index profiles_username_lower_idx on public.profiles (lower(username));
create index profiles_role_idx on public.profiles (role) where role <> 'user';

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Rollen-Hilfsfunktionen (security definer, damit sie in RLS-Policies
-- ohne Rekursion auf profiles zugreifen können)
create or replace function public.current_role_of_user()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid() and not is_banned;
$$;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_role_of_user() in ('moderator', 'admin'), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_role_of_user() = 'admin', false);
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and not is_banned);
$$;

-- Profil automatisch bei Registrierung anlegen
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_name text;
  final_name text;
begin
  base_name := regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', ''), '[^A-Za-z0-9_-]', '', 'g');
  if length(base_name) < 3 then
    base_name := 'spieler_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  base_name := substr(base_name, 1, 24);
  final_name := base_name;

  -- Bei Namenskonflikt eine Zufallsendung anhängen
  while exists (select 1 from public.profiles where lower(username) = lower(final_name)) loop
    final_name := substr(base_name, 1, 19) || '_' || lpad((floor(random() * 10000))::int::text, 4, '0');
  end loop;

  insert into public.profiles (id, username) values (new.id, final_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prüft, ob ein Benutzername frei ist (für die Registrierung)
create or replace function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(name));
$$;

-- Schutz: Rolle und Sperrstatus können nur über die Admin-/Moderationsfunktionen geändert werden
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if coalesce(current_setting('app.privileged_update', true), '') <> 'on' then
    new.role := old.role;
    new.is_banned := old.is_banned;
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- Rolle setzen (nur Administratoren)
create or replace function public.admin_set_role(target_user uuid, new_role public.user_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  if target_user = auth.uid() then
    raise exception 'Eigene Rolle kann nicht geändert werden' using errcode = '42501';
  end if;
  perform set_config('app.privileged_update', 'on', true);
  update public.profiles set role = new_role where id = target_user;
  perform set_config('app.privileged_update', 'off', true);
end;
$$;

-- Nutzer sperren/entsperren (Moderatoren: nur normale Nutzer; Admins: alle außer sich selbst)
create or replace function public.moderate_set_banned(target_user uuid, banned boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_role public.user_role;
begin
  if not public.is_moderator() then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  select role into target_role from public.profiles where id = target_user;
  if target_user = auth.uid() or (target_role <> 'user' and not public.is_admin()) then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  perform set_config('app.privileged_update', 'on', true);
  update public.profiles set is_banned = banned where id = target_user;
  perform set_config('app.privileged_update', 'off', true);
end;
$$;

-- =====================================================================
-- KATEGORIEN & REDAKTIONELLE INHALTE
-- =====================================================================
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  section     text not null check (section in ('artikel', 'missionen', 'geheimnisse', 'community')),
  slug        text not null check (slug ~ '^[a-z0-9-]{2,40}$'),
  name        text not null check (length(name) between 2 and 60),
  description text check (description is null or length(description) <= 300),
  created_at  timestamptz not null default now(),
  unique (section, slug)
);

create table public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9-]{3,120}$'),
  title         text not null check (length(title) between 5 and 200),
  excerpt       text not null check (length(excerpt) <= 400),
  -- Strukturierte Inhaltsblöcke (siehe src/types/content.ts) – bewusst kein HTML
  body          jsonb not null default '[]'::jsonb,
  category_id   uuid references public.categories (id) on delete set null,
  status        public.verification_status not null default 'unbestaetigt',
  tags          text[] not null default '{}',
  is_published  boolean not null default false,
  published_at  timestamptz,
  author_id     uuid references public.profiles (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index articles_published_idx on public.articles (is_published, published_at desc);
create index articles_category_idx on public.articles (category_id);
create trigger articles_updated_at before update on public.articles for each row execute function public.set_updated_at();

create table public.missions (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9-]{3,120}$'),
  title             text not null check (length(title) between 3 and 200),
  excerpt           text not null check (length(excerpt) <= 400),
  category_id       uuid references public.categories (id) on delete set null,
  difficulty        text not null default 'mittel' check (difficulty in ('leicht', 'mittel', 'schwer')),
  spoiler           text not null default 'leicht' check (spoiler in ('keine', 'leicht', 'stark')),
  status            public.verification_status not null default 'unbestaetigt',
  estimated_minutes int check (estimated_minutes is null or estimated_minutes between 1 and 600),
  requirements      jsonb not null default '[]'::jsonb,
  steps             jsonb not null default '[]'::jsonb,
  tips              jsonb not null default '[]'::jsonb,
  is_published      boolean not null default false,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index missions_published_idx on public.missions (is_published, published_at desc);
create trigger missions_updated_at before update on public.missions for each row execute function public.set_updated_at();

create table public.map_locations (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (length(title) between 2 and 120),
  category     text not null check (category in ('geheimnis', 'sammelobjekt', 'fahrzeug', 'mission', 'fundort')),
  description  text check (description is null or length(description) <= 1000),
  status       public.verification_status not null default 'unbestaetigt',
  -- Koordinaten im Kartensystem der verwendeten (rechtlich zulässigen) Karte
  x            numeric not null check (x between 0 and 1000),
  y            numeric not null check (y between 0 and 1000),
  href         text check (href is null or href ~ '^/[a-z0-9/_-]*$'),
  -- Öffentliche Marker pflegt die Redaktion; eigene Marker von Nutzern sind privat
  is_public    boolean not null default false,
  created_by   uuid references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index map_locations_public_idx on public.map_locations (is_public, category);
create index map_locations_owner_idx on public.map_locations (created_by);
create trigger map_locations_updated_at before update on public.map_locations for each row execute function public.set_updated_at();

create table public.secrets (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9-]{3,120}$'),
  title            text not null check (length(title) between 3 and 200),
  excerpt          text not null check (length(excerpt) <= 400),
  body             jsonb not null default '[]'::jsonb,
  category_id      uuid references public.categories (id) on delete set null,
  status           public.verification_status not null default 'unbestaetigt',
  spoiler          boolean not null default false,
  location_text    text check (location_text is null or length(location_text) <= 300),
  map_location_id  uuid references public.map_locations (id) on delete set null,
  is_published     boolean not null default false,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index secrets_published_idx on public.secrets (is_published, published_at desc);
create trigger secrets_updated_at before update on public.secrets for each row execute function public.set_updated_at();

-- =====================================================================
-- COMMUNITY
-- =====================================================================
create table public.questions (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid references public.profiles (id) on delete set null,
  title          text not null check (length(title) between 10 and 140),
  body           text not null check (length(body) between 20 and 5000),
  category       text not null check (category in ('allgemein', 'missionen', 'fahrzeuge', 'geheimnisse', 'gameplay', 'technik')),
  status         public.question_status not null default 'offen',
  is_hidden      boolean not null default false,
  likes_count    int not null default 0,
  answers_count  int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz
);
create index questions_created_idx on public.questions (created_at desc) where not is_hidden;
create index questions_category_idx on public.questions (category, created_at desc);
create index questions_author_idx on public.questions (author_id);
create index questions_likes_idx on public.questions (likes_count desc);

create table public.answers (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.questions (id) on delete cascade,
  author_id    uuid references public.profiles (id) on delete set null,
  body         text not null check (length(body) between 5 and 5000),
  is_hidden    boolean not null default false,
  likes_count  int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz
);
create index answers_question_idx on public.answers (question_id, created_at);
create index answers_author_idx on public.answers (author_id);

create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  answer_id   uuid not null references public.answers (id) on delete cascade,
  author_id   uuid references public.profiles (id) on delete set null,
  body        text not null check (length(body) between 2 and 1000),
  is_hidden   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index comments_answer_idx on public.comments (answer_id, created_at);
create index comments_author_idx on public.comments (author_id);

create table public.likes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  target_type  public.like_target not null,
  target_id    uuid not null,
  created_at   timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);
create index likes_target_idx on public.likes (target_type, target_id);

create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid references public.profiles (id) on delete set null,
  target_type  public.report_target not null,
  target_id    uuid not null,
  reason       text not null check (reason in ('spam', 'beleidigung', 'spoiler', 'falschinfo', 'illegal', 'sonstiges')),
  details      text check (details is null or length(details) <= 500),
  status       public.report_status not null default 'offen',
  resolved_by  uuid references public.profiles (id) on delete set null,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);
create index reports_status_idx on public.reports (status, created_at desc);

-- ---------------------------------------------------------------------
-- Community-Trigger
-- ---------------------------------------------------------------------

-- Spam-Schutz: Rate-Limit pro Nutzer und Sperrprüfung
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

create trigger questions_rate_limit before insert on public.questions for each row execute function public.enforce_post_rate_limit();
create trigger answers_rate_limit before insert on public.answers for each row execute function public.enforce_post_rate_limit();
create trigger comments_rate_limit before insert on public.comments for each row execute function public.enforce_post_rate_limit();

-- Schutz geschützter Spalten: Nur Moderation darf Sichtbarkeit/Status ändern,
-- Zähler nur über Trigger, Autor und Erstellzeit nie.
create or replace function public.protect_post_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.author_id := old.author_id;
  new.created_at := old.created_at;

  if coalesce(current_setting('app.counter_update', true), '') <> 'on' then
    new.likes_count := old.likes_count;
    if tg_table_name = 'questions' then
      new.answers_count := old.answers_count;
    end if;
  end if;

  if not public.is_moderator() and coalesce(current_setting('app.privileged_update', true), '') <> 'on' then
    new.is_hidden := old.is_hidden;
    if tg_table_name = 'questions' then
      -- Autoren dürfen ihre Frage als beantwortet markieren, aber nicht schließen/öffnen
      if new.status = 'geschlossen' or old.status = 'geschlossen' then
        new.status := old.status;
      end if;
    end if;
  end if;

  if (new.body is distinct from old.body)
     or (tg_table_name = 'questions' and (new.title is distinct from old.title or new.category is distinct from old.category)) then
    new.updated_at := now();
  end if;
  return new;
end;
$$;

create trigger questions_protect before update on public.questions for each row execute function public.protect_post_columns();
create trigger answers_protect before update on public.answers for each row execute function public.protect_post_columns();

create or replace function public.protect_comment_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.author_id := old.author_id;
  new.answer_id := old.answer_id;
  new.created_at := old.created_at;
  if not public.is_moderator() and coalesce(current_setting('app.privileged_update', true), '') <> 'on' then
    new.is_hidden := old.is_hidden;
  end if;
  return new;
end;
$$;
create trigger comments_protect before update on public.comments for each row execute function public.protect_comment_columns();

-- Antwortzähler pflegen
create or replace function public.update_answers_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform set_config('app.counter_update', 'on', true);
  if tg_op = 'INSERT' then
    update public.questions set answers_count = answers_count + 1 where id = new.question_id;
  elsif tg_op = 'DELETE' then
    update public.questions set answers_count = greatest(answers_count - 1, 0) where id = old.question_id;
  end if;
  perform set_config('app.counter_update', 'off', true);
  return null;
end;
$$;
create trigger answers_count_trigger after insert or delete on public.answers for each row execute function public.update_answers_count();

-- Like-Zähler pflegen und Ziel validieren
create or replace function public.validate_like_target()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.target_type = 'question' and not exists (select 1 from public.questions where id = new.target_id and not is_hidden) then
    raise exception 'Ziel nicht gefunden';
  elsif new.target_type = 'answer' and not exists (select 1 from public.answers where id = new.target_id and not is_hidden) then
    raise exception 'Ziel nicht gefunden';
  end if;
  return new;
end;
$$;
create trigger likes_validate before insert on public.likes for each row execute function public.validate_like_target();

create or replace function public.update_likes_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  delta int;
  t_type public.like_target;
  t_id uuid;
begin
  if tg_op = 'INSERT' then
    delta := 1; t_type := new.target_type; t_id := new.target_id;
  else
    delta := -1; t_type := old.target_type; t_id := old.target_id;
  end if;
  perform set_config('app.counter_update', 'on', true);
  if t_type = 'question' then
    update public.questions set likes_count = greatest(likes_count + delta, 0) where id = t_id;
  else
    update public.answers set likes_count = greatest(likes_count + delta, 0) where id = t_id;
  end if;
  perform set_config('app.counter_update', 'off', true);
  return null;
end;
$$;
create trigger likes_count_trigger after insert or delete on public.likes for each row execute function public.update_likes_count();

-- Verwaiste Likes/Meldungen beim Löschen von Beiträgen entfernen
create or replace function public.cleanup_post_references()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'questions' then
    delete from public.likes where target_type = 'question' and target_id = old.id;
    delete from public.reports where target_type = 'question' and target_id = old.id;
  elsif tg_table_name = 'answers' then
    delete from public.likes where target_type = 'answer' and target_id = old.id;
    delete from public.reports where target_type = 'answer' and target_id = old.id;
  else
    delete from public.reports where target_type = 'comment' and target_id = old.id;
  end if;
  return old;
end;
$$;
create trigger questions_cleanup after delete on public.questions for each row execute function public.cleanup_post_references();
create trigger answers_cleanup after delete on public.answers for each row execute function public.cleanup_post_references();
create trigger comments_cleanup after delete on public.comments for each row execute function public.cleanup_post_references();

-- Moderation: Inhalte aus-/einblenden (nur whitelisted Tabellen)
create or replace function public.moderate_set_hidden(target_table text, target_id uuid, hidden boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_moderator() then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  perform set_config('app.privileged_update', 'on', true);
  if target_table = 'questions' then
    update public.questions set is_hidden = hidden where id = target_id;
  elsif target_table = 'answers' then
    update public.answers set is_hidden = hidden where id = target_id;
  elsif target_table = 'comments' then
    update public.comments set is_hidden = hidden where id = target_id;
  else
    raise exception 'Ungültige Tabelle';
  end if;
  perform set_config('app.privileged_update', 'off', true);
end;
$$;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.articles      enable row level security;
alter table public.missions      enable row level security;
alter table public.secrets       enable row level security;
alter table public.map_locations enable row level security;
alter table public.questions     enable row level security;
alter table public.answers       enable row level security;
alter table public.comments      enable row level security;
alter table public.likes         enable row level security;
alter table public.reports       enable row level security;

-- PROFILES: öffentlich lesbar (enthält keine E-Mail), nur eigenes Profil bearbeitbar
create policy "Profile sind öffentlich lesbar" on public.profiles for select using (true);
create policy "Eigenes Profil bearbeiten" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
-- Kein INSERT/DELETE für Clients (Anlage per Trigger, Löschung über auth.users)
revoke insert, delete on public.profiles from anon, authenticated;
revoke update on public.profiles from anon, authenticated;
grant update (username, avatar_url, bio) on public.profiles to authenticated;

-- KATEGORIEN: lesbar für alle, schreibbar nur für Admins
create policy "Kategorien lesen" on public.categories for select using (true);
create policy "Kategorien verwalten" on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- REDAKTIONELLE INHALTE: veröffentlicht = öffentlich; Entwürfe nur Moderation; Schreiben nur Admins
create policy "Artikel lesen" on public.articles for select using (is_published or public.is_moderator());
create policy "Artikel verwalten" on public.articles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Missionen lesen" on public.missions for select using (is_published or public.is_moderator());
create policy "Missionen verwalten" on public.missions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Geheimnisse lesen" on public.secrets for select using (is_published or public.is_moderator());
create policy "Geheimnisse verwalten" on public.secrets for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- KARTE: öffentliche Marker für alle; private Marker nur für Ersteller
create policy "Marker lesen" on public.map_locations for select
  using (is_public or created_by = auth.uid() or public.is_moderator());
create policy "Eigene private Marker anlegen" on public.map_locations for insert to authenticated
  with check (created_by = auth.uid() and (not is_public or public.is_admin()) and public.is_active_user());
create policy "Eigene Marker bearbeiten" on public.map_locations for update to authenticated
  using (created_by = auth.uid() or public.is_admin())
  with check ((created_by = auth.uid() and not is_public) or public.is_admin());
create policy "Eigene Marker löschen" on public.map_locations for delete to authenticated
  using (created_by = auth.uid() or public.is_admin());

-- FRAGEN
create policy "Sichtbare Fragen lesen" on public.questions for select
  using (not is_hidden or author_id = auth.uid() or public.is_moderator());
create policy "Fragen erstellen" on public.questions for insert to authenticated
  with check (author_id = auth.uid() and not is_hidden and status = 'offen' and likes_count = 0 and answers_count = 0);
create policy "Eigene Fragen bearbeiten" on public.questions for update to authenticated
  using (author_id = auth.uid() or public.is_moderator());
create policy "Eigene Fragen löschen" on public.questions for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

-- ANTWORTEN
create policy "Sichtbare Antworten lesen" on public.answers for select
  using (not is_hidden or author_id = auth.uid() or public.is_moderator());
create policy "Antworten erstellen" on public.answers for insert to authenticated
  with check (
    author_id = auth.uid() and not is_hidden and likes_count = 0
    and exists (select 1 from public.questions q where q.id = question_id and not q.is_hidden and q.status <> 'geschlossen')
  );
create policy "Eigene Antworten bearbeiten" on public.answers for update to authenticated
  using (author_id = auth.uid() or public.is_moderator());
create policy "Eigene Antworten löschen" on public.answers for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

-- KOMMENTARE
create policy "Sichtbare Kommentare lesen" on public.comments for select
  using (not is_hidden or author_id = auth.uid() or public.is_moderator());
create policy "Kommentare erstellen" on public.comments for insert to authenticated
  with check (
    author_id = auth.uid() and not is_hidden
    and exists (select 1 from public.answers a where a.id = answer_id and not a.is_hidden)
  );
create policy "Eigene Kommentare bearbeiten" on public.comments for update to authenticated
  using (author_id = auth.uid() or public.is_moderator());
create policy "Eigene Kommentare löschen" on public.comments for delete to authenticated
  using (author_id = auth.uid() or public.is_moderator());

-- LIKES: nur eigene Likes sehen/setzen/entfernen (Zähler sind öffentlich über die Beiträge)
create policy "Eigene Likes lesen" on public.likes for select to authenticated using (user_id = auth.uid());
create policy "Liken" on public.likes for insert to authenticated with check (user_id = auth.uid() and public.is_active_user());
create policy "Like entfernen" on public.likes for delete to authenticated using (user_id = auth.uid());
revoke update on public.likes from anon, authenticated;

-- MELDUNGEN: Nutzer melden und sehen eigene Meldungen; Moderation sieht und bearbeitet alle
create policy "Melden" on public.reports for insert to authenticated
  with check (reporter_id = auth.uid() and status = 'offen' and resolved_by is null and public.is_active_user());
create policy "Meldungen lesen" on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_moderator());
create policy "Meldungen bearbeiten" on public.reports for update to authenticated
  using (public.is_moderator()) with check (public.is_moderator());
create policy "Meldungen löschen" on public.reports for delete to authenticated using (public.is_admin());

-- Anonyme Nutzer dürfen grundsätzlich nichts schreiben
revoke insert, update, delete on all tables in schema public from anon;

-- Funktionsrechte: nur gezielte Freigaben
revoke execute on all functions in schema public from public, anon;
grant execute on function public.username_available(text) to anon, authenticated;
grant execute on function public.is_moderator() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_active_user() to anon, authenticated;
grant execute on function public.current_role_of_user() to anon, authenticated;
grant execute on function public.admin_set_role(uuid, public.user_role) to authenticated;
grant execute on function public.moderate_set_banned(uuid, boolean) to authenticated;
grant execute on function public.moderate_set_hidden(text, uuid, boolean) to authenticated;

-- =====================================================================
-- STORAGE: Profilbilder
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Nur in den eigenen Ordner (<user-id>/...) hochladen, ändern und löschen
create policy "Avatare öffentlich lesen" on storage.objects for select using (bucket_id = 'avatars');
create policy "Eigene Avatare hochladen" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Eigene Avatare ändern" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Eigene Avatare löschen" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

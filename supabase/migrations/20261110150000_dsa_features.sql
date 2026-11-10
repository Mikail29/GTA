-- =====================================================================
-- GTA6-Kompass – Pflichtfunktionen nach Digital Services Act (DSA) und DSGVO
--  1. Melden ohne Konto (Gast-Meldungen, Art. 16 DSA)
--  2. Benachrichtigungen mit Begründung bei Moderationsmaßnahmen (Art. 17 DSA)
--     und Rückmeldung an Meldende (Art. 16 Abs. 5 DSA)
--  3. Konto selbst löschen (Art. 17 DSGVO)
--  4. Fehlerbehebung: Autor-Schutz blockierte das Anonymisieren beim Konto-Löschen
-- =====================================================================

-- ---------------------------------------------------------------------
-- 4. Fehlerbehebung: author_id darf auf NULL gesetzt werden (Fremdschlüssel
--    „on delete set null“ beim Löschen eines Profils), aber nie umgeschrieben.
-- ---------------------------------------------------------------------
create or replace function public.protect_post_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.author_id is not null then
    new.author_id := old.author_id;
  end if;
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
      if new.status = 'geschlossen' or old.status = 'geschlossen' then
        new.status := old.status;
      end if;
    end if;
  end if;

  -- Hinweis: PL/pgSQL wertet Bedingungen nicht verkürzt aus, daher getrennte Prüfungen
  if new.body is distinct from old.body then
    new.updated_at := now();
  elsif tg_table_name = 'questions' then
    if new.title is distinct from old.title or new.category is distinct from old.category then
      new.updated_at := now();
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.protect_comment_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.author_id is not null then
    new.author_id := old.author_id;
  end if;
  new.answer_id := old.answer_id;
  new.created_at := old.created_at;
  if not public.is_moderator() and coalesce(current_setting('app.privileged_update', true), '') <> 'on' then
    new.is_hidden := old.is_hidden;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 2. Benachrichtigungen
-- ---------------------------------------------------------------------
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null check (kind in ('moderation', 'sperre', 'meldung', 'info')),
  message     text not null check (length(message) <= 1000),
  link        text check (link is null or link ~ '^/[a-z0-9/_-]*$'),
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;
create policy "Eigene Benachrichtigungen lesen" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "Eigene Benachrichtigungen als gelesen markieren" on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Eigene Benachrichtigungen löschen" on public.notifications for delete to authenticated using (user_id = auth.uid());
revoke insert, update on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;

-- Interne Hilfsfunktion (nicht von außen aufrufbar)
create or replace function public.notify_user(target uuid, kind text, message text, link text default null)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, kind, message, link)
  select target, kind, message, link
  where target is not null and exists (select 1 from public.profiles where id = target);
$$;
revoke execute on function public.notify_user(uuid, text, text, text) from public, anon, authenticated;

-- Ausblenden MIT Begründung; benachrichtigt die Autorin/den Autor
drop function public.moderate_set_hidden(text, uuid, boolean);
create or replace function public.moderate_set_hidden(target_table text, target_id uuid, hidden boolean, reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  author uuid;
  link_to text;
  label text;
begin
  if not public.is_moderator() then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  if reason is not null and length(reason) > 500 then
    raise exception 'Begründung zu lang';
  end if;

  perform set_config('app.privileged_update', 'on', true);
  if target_table = 'questions' then
    update public.questions set is_hidden = hidden where id = target_id returning author_id into author;
    link_to := '/fragen/' || target_id; label := 'Deine Frage';
  elsif target_table = 'answers' then
    update public.answers set is_hidden = hidden where id = target_id returning author_id, '/fragen/' || question_id into author, link_to;
    label := 'Deine Antwort';
  elsif target_table = 'comments' then
    update public.comments c set is_hidden = hidden from public.answers a
      where c.id = target_id and a.id = c.answer_id
      returning c.author_id, '/fragen/' || a.question_id into author, link_to;
    label := 'Dein Kommentar';
  else
    raise exception 'Ungültige Tabelle';
  end if;
  perform set_config('app.privileged_update', 'off', true);

  if author is not null and author <> auth.uid() then
    if hidden then
      perform public.notify_user(author, 'moderation',
        label || ' wurde vom Moderationsteam ausgeblendet. Grund: ' || coalesce(reason, 'Verstoß gegen die Community-Regeln')
        || '. Wenn du die Entscheidung für falsch hältst, kannst du über die Kontaktseite widersprechen.', link_to);
    else
      perform public.notify_user(author, 'moderation', label || ' ist nach erneuter Prüfung wieder sichtbar.', link_to);
    end if;
  end if;
end;
$$;
revoke execute on function public.moderate_set_hidden(text, uuid, boolean, text) from public, anon;
grant execute on function public.moderate_set_hidden(text, uuid, boolean, text) to authenticated;

-- Löschen durch die Moderation (nicht durch die Person selbst) → Benachrichtigung
create or replace function public.notify_moderation_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.author_id is not null and auth.uid() is not null and auth.uid() <> old.author_id and public.is_moderator() then
    perform public.notify_user(old.author_id, 'moderation',
      case tg_table_name when 'questions' then 'Deine Frage „' || left(old.title, 80) || '“'
                         when 'answers' then 'Eine deiner Antworten'
                         else 'Einer deiner Kommentare' end
      || ' wurde vom Moderationsteam gelöscht, weil sie gegen die Nutzungsbedingungen oder Community-Regeln verstoßen hat. Widerspruch ist über die Kontaktseite möglich.');
  end if;
  return old;
end;
$$;
create trigger questions_notify_delete after delete on public.questions for each row execute function public.notify_moderation_delete();
create trigger answers_notify_delete after delete on public.answers for each row execute function public.notify_moderation_delete();
create trigger comments_notify_delete after delete on public.comments for each row execute function public.notify_moderation_delete();

-- Sperre mit Benachrichtigung (ersetzt die bisherige Funktion)
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
  perform public.notify_user(target_user, 'sperre',
    case when banned then 'Dein Konto wurde wegen Verstößen gegen die Nutzungsbedingungen für neue Beiträge gesperrt. Widerspruch ist über die Kontaktseite möglich.'
         else 'Die Sperre deines Kontos wurde aufgehoben.' end);
end;
$$;

-- Rückmeldung an Meldende, wenn die Meldung bearbeitet wurde
create or replace function public.notify_report_resolved()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status = 'offen' and new.status <> 'offen' and new.reporter_id is not null then
    perform public.notify_user(new.reporter_id, 'meldung',
      case when new.status = 'erledigt' then 'Danke für deine Meldung! Wir haben sie geprüft und Maßnahmen ergriffen.'
           else 'Danke für deine Meldung! Wir haben sie geprüft, konnten aber keinen Verstoß feststellen.' end);
  end if;
  return new;
end;
$$;
create trigger reports_notify_resolved after update on public.reports for each row execute function public.notify_report_resolved();

-- ---------------------------------------------------------------------
-- 1. Melden ohne Konto
-- ---------------------------------------------------------------------
alter table public.reports
  add column reporter_email text check (reporter_email is null or (length(reporter_email) <= 254 and reporter_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  add column good_faith boolean not null default false,
  add column is_guest boolean not null default false;

create or replace function public.submit_guest_report(
  p_target_type public.report_target, p_target_id uuid, p_reason text, p_details text, p_email text, p_good_faith boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  open_guest_reports int;
begin
  if not coalesce(p_good_faith, false) then
    raise exception 'Bestätigung erforderlich';
  end if;
  if p_reason not in ('spam', 'beleidigung', 'spoiler', 'falschinfo', 'illegal', 'sonstiges') then
    raise exception 'Ungültiger Grund';
  end if;
  if (p_target_type = 'question' and not exists (select 1 from public.questions where id = p_target_id and not is_hidden))
     or (p_target_type = 'answer' and not exists (select 1 from public.answers where id = p_target_id and not is_hidden))
     or (p_target_type = 'comment' and not exists (select 1 from public.comments where id = p_target_id and not is_hidden)) then
    raise exception 'Inhalt nicht gefunden';
  end if;

  -- Flutschutz: begrenzte Anzahl offener Gast-Meldungen pro Inhalt und insgesamt
  select count(*) into open_guest_reports from public.reports where is_guest and status = 'offen' and target_id = p_target_id;
  if open_guest_reports >= 20 then
    return; -- Inhalt ist bereits ausreichend gemeldet
  end if;
  if (select count(*) from public.reports where is_guest and created_at > now() - interval '1 hour') >= 200 then
    raise exception 'rate_limit: zu viele Meldungen' using errcode = 'P0001';
  end if;

  insert into public.reports (reporter_id, target_type, target_id, reason, details, reporter_email, good_faith, is_guest)
  values (null, p_target_type, p_target_id, p_reason, nullif(left(coalesce(p_details, ''), 500), ''), nullif(p_email, ''), true, true);
end;
$$;
revoke execute on function public.submit_guest_report(public.report_target, uuid, text, text, text, boolean) from public;
grant execute on function public.submit_guest_report(public.report_target, uuid, text, text, text, boolean) to anon, authenticated;

-- Angemeldete Meldungen: Bestätigung „in gutem Glauben“ erlauben
drop policy "Melden" on public.reports;
create policy "Melden" on public.reports for insert to authenticated
  with check (reporter_id = auth.uid() and status = 'offen' and resolved_by is null and not is_guest
              and reporter_email is null and public.is_active_user());

-- ---------------------------------------------------------------------
-- 3. Konto selbst löschen
--    Fragen mit Antworten anderer bleiben anonymisiert erhalten („Gelöschtes Konto“),
--    damit fremde Antworten nicht verloren gehen. Alles andere wird gelöscht.
-- ---------------------------------------------------------------------
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Nicht angemeldet' using errcode = '42501';
  end if;
  delete from public.comments where author_id = uid;
  delete from public.answers where author_id = uid;
  delete from public.questions q where q.author_id = uid
    and not exists (select 1 from public.answers a where a.question_id = q.id);
  delete from public.notifications where user_id = uid;
  -- Löscht das Login-Konto; Profil, Likes, eigene Marker folgen per Fremdschlüssel,
  -- verbleibende Fragen werden anonymisiert (author_id = null)
  delete from auth.users where id = uid;
end;
$$;
revoke execute on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;

revoke execute on function public.notify_moderation_delete() from public, anon, authenticated;
revoke execute on function public.notify_report_resolved() from public, anon, authenticated;

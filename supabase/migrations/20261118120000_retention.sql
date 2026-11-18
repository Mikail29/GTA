-- =====================================================================
-- 5-Sterne-Kompass – Speicherfristen aus der Datenschutzerklärung
--  * hidden_at merkt sich, wann die Moderation einen Beitrag ausgeblendet hat
--  * cleanup_old_data() löscht
--      - erledigte oder abgelehnte Meldungen 6 Monate nach der Entscheidung
--      - ausgeblendete Beiträge 6 Monate nach dem Ausblenden
--      - Benachrichtigungen nach 12 Monaten
--    Nur Admins dürfen die Funktion ausführen. Die Website ruft sie automatisch
--    auf, wenn ein Admin die Seite „Verwaltung → Meldungen“ öffnet.
-- Die Datei kann gefahrlos mehrfach ausgeführt werden.
-- =====================================================================

alter table public.questions add column if not exists hidden_at timestamptz;
alter table public.answers add column if not exists hidden_at timestamptz;
alter table public.comments add column if not exists hidden_at timestamptz;

-- Schon ausgeblendete Beiträge bekommen das heutige Datum (volle Frist)
update public.questions set hidden_at = now() where is_hidden and hidden_at is null;
update public.answers set hidden_at = now() where is_hidden and hidden_at is null;
update public.comments set hidden_at = now() where is_hidden and hidden_at is null;

-- hidden_at wird nur beim Ausblenden bzw. Einblenden gesetzt und lässt sich sonst nicht ändern
create or replace function public.track_hidden_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_hidden is distinct from old.is_hidden then
    new.hidden_at := case when new.is_hidden then now() else null end;
  else
    new.hidden_at := old.hidden_at;
  end if;
  return new;
end;
$$;
revoke execute on function public.track_hidden_at() from public, anon;

drop trigger if exists questions_track_hidden on public.questions;
create trigger questions_track_hidden before update on public.questions for each row execute function public.track_hidden_at();
drop trigger if exists answers_track_hidden on public.answers;
create trigger answers_track_hidden before update on public.answers for each row execute function public.track_hidden_at();
drop trigger if exists comments_track_hidden on public.comments;
create trigger comments_track_hidden before update on public.comments for each row execute function public.track_hidden_at();

-- Beim automatischen Aufräumen keine zweite Lösch-Benachrichtigung verschicken
-- (die Person wurde schon beim Ausblenden mit Begründung informiert)
create or replace function public.notify_moderation_delete()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(current_setting('app.cleanup', true), '') = 'on' then
    return old;
  end if;
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

create or replace function public.cleanup_old_data()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  grenze timestamptz := now() - interval '6 months';
  n_meldungen int := 0;
  n_fragen int := 0;
  n_antworten int := 0;
  n_kommentare int := 0;
  n_benachrichtigungen int := 0;
begin
  if not public.is_admin() then
    raise exception 'Keine Berechtigung' using errcode = '42501';
  end if;
  perform set_config('app.cleanup', 'on', true);

  delete from public.reports where status <> 'offen' and coalesce(resolved_at, created_at) < grenze;
  get diagnostics n_meldungen = row_count;

  -- Likes und Meldungen zu gelöschten Beiträgen entfernt der Trigger cleanup_post_references
  delete from public.comments where is_hidden and hidden_at < grenze;
  get diagnostics n_kommentare = row_count;
  delete from public.answers where is_hidden and hidden_at < grenze;
  get diagnostics n_antworten = row_count;
  delete from public.questions where is_hidden and hidden_at < grenze;
  get diagnostics n_fragen = row_count;

  delete from public.notifications where created_at < now() - interval '12 months';
  get diagnostics n_benachrichtigungen = row_count;

  perform set_config('app.cleanup', 'off', true);
  return jsonb_build_object('meldungen', n_meldungen, 'fragen', n_fragen, 'antworten', n_antworten, 'kommentare', n_kommentare, 'benachrichtigungen', n_benachrichtigungen);
end;
$$;
revoke execute on function public.cleanup_old_data() from public, anon;
grant execute on function public.cleanup_old_data() to authenticated;

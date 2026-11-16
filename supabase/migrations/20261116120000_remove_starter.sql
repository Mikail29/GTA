-- =====================================================================
-- 5-Sterne-Kompass – Bereich „GTA 6 Starter“ entfernen
--  * Die angehefteten Team-Threads der Kategorie „starter“ werden gelöscht
--    (Antworten und Kommentare automatisch mit, Likes hier ausdrücklich).
--  * Eigene Fragen von Nutzern aus „starter“ bleiben erhalten und wandern
--    nach „Allgemeine Fragen“.
--  * Die Kategorie „starter“ wird entfernt und ist nicht mehr erlaubt.
-- Anheften und Team-Markierung bleiben als Moderationsfunktion erhalten.
-- Die Datei kann gefahrlos mehrfach ausgeführt werden.
-- =====================================================================

-- Likes haben keinen Fremdschlüssel, deshalb vor dem Löschen entfernen
delete from public.likes l
using public.answers a, public.questions q
where l.target_type = 'answer' and l.target_id = a.id and a.question_id = q.id
  and q.category = 'starter' and q.is_official;

delete from public.likes l
using public.questions q
where l.target_type = 'question' and l.target_id = q.id
  and q.category = 'starter' and q.is_official;

delete from public.questions where category = 'starter' and is_official;

update public.questions set category = 'allgemein' where category = 'starter';

alter table public.questions drop constraint if exists questions_category_check;
alter table public.questions add constraint questions_category_check
  check (category in ('allgemein', 'missionen', 'fahrzeuge', 'geheimnisse', 'gameplay', 'technik'));

delete from public.categories where section = 'community' and slug = 'starter';

-- Gym EPS, 26/11/2026 : passage des niveaux A → D aux niveaux A → E (choix de Gabin).
-- A = nouveaux exercices d'apprentissage ; les anciens niveaux montent d'un cran : A→B, B→C, C→D, D→E.
-- À exécuter UNE SEULE FOIS (une 2e exécution décalerait encore) : la table de sauvegarde sert de garde-fou.
-- Relu par architect le 26/11/2026. La nouvelle fonction gymeps_save (v_max = E) est dans gymeps-progress.sql.

begin;
lock table public.gymeps_progress in share row exclusive mode;

-- garde-fou : si la sauvegarde existe déjà, le décalage a déjà été fait → erreur, rien ne change
create table public.gymeps_progress_sauvegarde_ad as table public.gymeps_progress;
alter table public.gymeps_progress_sauvegarde_ad enable row level security;
revoke all on table public.gymeps_progress_sauvegarde_ad from public, anon, authenticated;

update public.gymeps_progress g
set niveaux = (
  select coalesce(jsonb_object_agg(
    e.key,
    case when jsonb_typeof(e.value) = 'object' and (e.value ->> 'niv') ~ '^[A-D]$'
      then jsonb_set(e.value, '{niv}', to_jsonb(chr(ascii(e.value ->> 'niv') + 1)))
      else e.value end), '{}'::jsonb)
  from jsonb_each(g.niveaux) e)
where g.niveaux <> '{}'::jsonb;

commit;

-- Gym EPS : progression des élèves (projet Supabase « Road2Fit », vvsmienmspftdzqykhnt).
-- Les élèves ÉCRIVENT seulement (fonction gymeps_save) ; personne ne peut lire depuis le site.
-- Le professeur (via Claude) lit la table directement pour faire les fiches.
-- Relu (architect) le 26/11/2026 : plafond de lignes, nettoyage des espaces, search_path vide.
-- 26/11/2026 : catégories = les 6 familles (A → D) au lieu des thèmes de progression.

create table if not exists public.gymeps_progress (
  cle text primary key,                       -- prénom + nom normalisés (minuscules, sans accents ni espaces superflus)
  prenom text not null,
  nom text not null,
  classe text,
  niveaux jsonb not null default '{}'::jsonb, -- { "roue": { "niv": "C", "date": "2026-11-26" }, … }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gymeps_progress enable row level security;
-- aucune règle (policy) : la table est fermée aux clés publiques ; seul gymeps_save (security definer) y écrit
revoke all on table public.gymeps_progress from anon, authenticated;

create or replace function public.gymeps_norm(t text) returns text
language sql immutable set search_path = '' as $$
  select btrim(regexp_replace(lower(
    translate(
      regexp_replace(normalize(replace(replace(coalesce(t, ''), 'œ', 'oe'), 'Œ', 'OE'), NFD), '[̀-ͯ]', '', 'g'),
      '''’-|', '    ')
  ), '\s+', ' ', 'g'));
$$;

create or replace function public.gymeps_save(p_prenom text, p_nom text, p_classe text, p_niveaux jsonb)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_prenom text;
  v_nom text;
  v_classe text;
  v_cle text;
  v_old jsonb;
  v_new jsonb := '{}'::jsonb;
  k text;
  v text;
  -- les 6 familles de l'accueil et leur dernier niveau (A → D)
  v_max jsonb := '{"renversements":"D","sauts":"D","maintiens":"D","roulements":"D","liaisons":"D","acrobaties":"D"}'::jsonb;
begin
  if length(p_prenom) > 200 or length(p_nom) > 200 or length(p_classe) > 100 or pg_column_size(p_niveaux) > 2000 then
    raise exception 'entrée trop longue';
  end if;
  v_prenom := btrim(left(btrim(regexp_replace(coalesce(p_prenom, ''), '\s+', ' ', 'g')), 40));
  v_nom := btrim(left(btrim(regexp_replace(coalesce(p_nom, ''), '\s+', ' ', 'g')), 40));
  v_classe := nullif(btrim(left(btrim(regexp_replace(coalesce(p_classe, ''), '\s+', ' ', 'g')), 20)), '');
  if length(v_prenom) < 1 or length(v_nom) < 1 then
    raise exception 'prénom et nom obligatoires';
  end if;
  if p_niveaux is null or jsonb_typeof(p_niveaux) <> 'object' then
    raise exception 'niveaux invalides';
  end if;
  v_cle := public.gymeps_norm(v_prenom) || '|' || public.gymeps_norm(v_nom);
  select niveaux into v_old from public.gymeps_progress where cle = v_cle;
  if not found then
    if (select count(*) from public.gymeps_progress) >= 1500 then
      raise exception 'limite atteinte, préviens ton professeur';
    end if;
    v_old := '{}'::jsonb;
  end if;
  for k, v in select key, value #>> '{}' from jsonb_each(p_niveaux) loop
    -- thème connu, niveau = une lettre entre A et le dernier niveau du thème ; sinon ignoré
    if v_max ? k and v ~ '^[A-H]$' and v <= (v_max ->> k) then
      if (v_old -> k ->> 'niv') is distinct from v then
        v_new := v_new || jsonb_build_object(k, jsonb_build_object('niv', v, 'date', to_char(now() at time zone 'Europe/Paris', 'YYYY-MM-DD')));
      end if;
    end if;
  end loop;
  insert into public.gymeps_progress as g (cle, prenom, nom, classe, niveaux)
  values (v_cle, v_prenom, v_nom, v_classe, v_new)
  on conflict (cle) do update
    set prenom = excluded.prenom,
        nom = excluded.nom,
        classe = coalesce(excluded.classe, g.classe),
        niveaux = g.niveaux || v_new,           -- un niveau saisi remplace l'ancien ; un thème laissé vide garde l'ancien
        updated_at = now();
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.gymeps_save(text, text, text, jsonb) from public;
grant execute on function public.gymeps_save(text, text, text, jsonb) to anon, authenticated;
revoke all on function public.gymeps_norm(text) from public, anon, authenticated;

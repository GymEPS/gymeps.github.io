# Gym EPS — consignes du projet

Bibliothèque de gymnastique au sol pour les élèves de 4e de Gabin (professeur d'EPS). Site statique, sans étape de construction : HTML + CSS + modules JavaScript. En ligne : https://gymeps.github.io/ (dépôt public `GymEPS/gymeps.github.io`, organisation GitHub « GymEPS » créée par Gabin pour avoir un lien court, GitHub Pages depuis `main`, racine). Une publication = un `git push` sur `main`.

## Contenu
- `js/data/familles.js` : les 6 familles du document « Les familles de la gymnastique au sol » (renversements, sauts, maintiens, roulements, liaisons / éléments chorégraphiques, acrobaties), éléments classés A → D avec leurs critères de réalisation. `lien: [thème, niveau]` relie un élément à sa fiche de progression ; `variantes` = autres animations au choix ; `prof: true` = à faire seulement avec le professeur.
- `js/data/progressions.js` : les 7 thèmes (flip et salto arrière MASQUÉS sur le site pour les 4e, `HIDDEN_THEMES` dans app.js, choix de Gabin) du PowerPoint « GymEPS N1-N4 » (fiches de travail de F. Demazeux, lycée Jean Rostand) : niveaux A → H, critères de réussite, consignes, matériel, remédiations (`seulementDiff` = la fiche ne donne que la consigne qui change), `parade`. Plus `SECURITE` et `VALIDATION`. Les vidéos du PowerPoint n'ont PAS été publiées (personnes filmées, document d'un autre enseignant) : elles ont seulement servi de modèle pour les animations.

## Moteur d'animation (`js/engine/`)
- `skeleton.js` : squelette 3D (colonne en 2 parties, cou, épaules qui montent bras levés, coudes, poignets, hanches, genoux, chevilles). Une animation = images clés (`keys`) cuites à 60 images/s par `bakeDef` :
  - au sol, le point le plus bas touche le sol ou le matériel et **ne glisse pas** (les roulades avancent toutes seules) ;
  - `plant: ['handR', 'handL', 'footR', 'footL']` = appuis fixés (cinématique inverse) ; le corps reste posé sur ses vrais appuis, il ne se déplace que si un membre ne peut pas atteindre son appui ;
  - `fly: distance` … `land: true` = vol balistique réel (gravité) de la clé d'appel à la clé de réception ;
  - matériel (`props` : `box`, `wedge`) = surfaces sur lesquelles on se pose ; `at / ref / dx` place un objet là où passe le gymnaste (deux calculs) ;
  - `clampDistal` : bouts des mains / pieds jamais sous la surface.
- `render.js` : dessin sur canvas, membres en volume ombrés et triés par profondeur, côté éloigné plus sombre, visage (yeux tournés vers la caméra), chignon pour lire l'orientation de la tête, ombre, praticable avec ligne d'axe. Vues : Profil, 3/4, Face, Dessus + rotation libre au doigt.
- `player.js` : lecteur (lecture / pause, ×¼ ×½ ×1, barre des phases, Décomposer = chronophotographie, Trajet du bassin), vignettes (`thumbnail`).

## Écrire une animation (`js/anims/`)
- `pose.js` : `K(t, pose)` angles relatifs ; `KW(t, pose)` angles VUS DE PROFIL (T buste, th cuisse, sn tibia, ar bras, fa avant-bras ; 0 = vers le bas / debout, + = vers l'avant) — plus simple pour les mouvements de profil ; utiliser `K` dès que le corps tourne sur lui-même (roue, rondade, flip après rondade). `chain()` enchaîne des morceaux, `hold()` tient une position.
- `blocks.js` : briques communes (fente → ATR, retour, élan + sursaut, préparation / réception de saut).
- Un fichier par famille + `index.js` (registre identifiant → fonction). Chaque identifiant utilisé dans les données doit exister (le test le vérifie).
- Contrôle : `npm test` (= `node tests/anims.test.mjs` : calcul de toutes les animations, rien d'enfoncé de plus de 3 cm, segments de longueur constante, animations manquantes). Appuis : `node tests/appuis.mjs id…` (hauteur en cm des fesses, mains, pieds, épaules à chaque phase : un appui au sol ≈ fesses 8, poignet 3, talon / orteils 2 ; à lancer après toute modification d'une position au sol). Contrôle visuel : `dev.html?q=id1,id2&n=12&c=6&h=150&w=620&v=profil|trois|face|dessus` (planche d'images).

## Publier
Avant chaque `git push` : `npm run version` (empreinte de chaque fichier JS / CSS dans `index.html` : carte d’import + `?v=`). Sans ça, un navigateur peut garder d’anciens fichiers et mélanger les versions → page vide (vu sur Opera le 26/11/2026). Filet de sécurité : si `window.__gymReady` (fin de app.js) n’est pas posé après 5 s, la page propose « Recharger ».

## Aperçu local
Entrée `gymeps` de `Claude dump/.claude/launch.json` (serveur statique Python, port 5210).

## Enregistrer ma progression (élèves)
- Bouton vert de l'accueil → `#/ma-progression` (`pageMaProgression` dans app.js) : prénom, nom, classe (facultatif), et pour chacune des 6 FAMILLES de l'accueil (choix de Gabin, pas les thèmes de progression) le plus haut niveau de difficulté A → D validé aujourd'hui (`PROG_CATS`) (ou « Pas de changement »).
- Stockage : table `public.gymeps_progress` du projet Supabase Road2Fit (`vvsmienmspftdzqykhnt`), schéma dans `supabase/gymeps-progress.sql` (relu par architect le 26/11/2026). Le site appelle seulement `rpc/gymeps_save` (clé publique) : il ÉCRIT, ne lit jamais. RLS sans policy = table fermée au public.
- Fusion : clé = prénom|nom normalisés (minuscules, sans accents, tirets / apostrophes = espaces) ; un niveau saisi et différent remplace l'ancien (avec sa date), une famille vide garde l'ancien ; plafond 1 500 élèves.
- Fiche pour le professeur : lire la table via le MCP Supabase (`select prenom, nom, classe, niveaux, updated_at from public.gymeps_progress order by classe, nom, prenom`) et produire la fiche demandée. Données d'élèves mineurs : ne jamais les mettre dans un brief de sous-agent ni dans un dépôt.
- Si une famille ou un niveau change : mettre à jour `v_max` dans la fonction SQL.

## Filmer et comparer (mode analyse)
- `js/analyse.js` (branché dans app.js par `initAnalyse`, routes `#/analyse`, `#/analyse/element/<id>`, `#/analyse/niveau/<thème>/<niv>`, `#/analyse/progression/<thème>`). Accès : menu (« Filmer et comparer » / « Filmer »), bouton de l'accueil, carte « Avant de commencer », lien sous chaque animation (fiche figure, niveau de progression) et bouton flottant rouge sur toutes les pages, qui vise la figure ou le niveau affiché (`setFab` / `analyseHref`).
- Un élève filme son camarade (caméra de la tablette, `getUserMedia` + `MediaRecorder`, 60 s maximum) ou choisit une vidéo. La vidéo se place à côté de l'animation (côte à côte à l'horizontale, l'une sous l'autre à la verticale), « Lire les deux » pilote l'animation sur le temps de la vidéo, « Caler ici » aligne un instant de la vidéo sur un instant de l'animation, image par image, ×¼ ×½ ×1, Miroir, Agrandir (plein écran). Puis auto-évaluation critère par critère (✅ / ❌) et verdict.
- **La vidéo ne quitte jamais l'appareil** (lien `blob:` en mémoire, effacé en quittant la page) et rien n'est enregistré : élèves mineurs filmés. Ne jamais ajouter d'envoi ni de sauvegarde en ligne des vidéos sans l'accord explicite de Gabin.
- Priorité à l'usage sur TABLETTE (choix de Gabin) : boutons ≥ 52 px, tout tester en 1180×820 et 820×1180.

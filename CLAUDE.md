# Gym EPS — consignes du projet

Bibliothèque de gymnastique au sol pour les élèves de 4e de Gabin (professeur d'EPS). Site statique, sans étape de construction : HTML + CSS + modules JavaScript. En ligne : https://gab1point0.github.io/gymeps/ (dépôt public `Gab1point0/gymeps`, GitHub Pages depuis `main`, racine). Une publication = un `git push` sur `main`.

## Contenu
- `js/data/familles.js` : les 6 familles du document « Les familles de la gymnastique au sol » (renversements, sauts, maintiens, roulements, liaisons / éléments chorégraphiques, acrobaties), éléments classés A → D avec leurs critères de réalisation. `lien: [thème, niveau]` relie un élément à sa fiche de progression ; `variantes` = autres animations au choix ; `prof: true` = à faire seulement avec le professeur.
- `js/data/progressions.js` : les 7 thèmes du PowerPoint « GymEPS N1-N4 » (fiches de travail de F. Demazeux, lycée Jean Rostand) : niveaux A → H, critères de réussite, consignes, matériel, remédiations (`seulementDiff` = la fiche ne donne que la consigne qui change), `parade`. Plus `SECURITE` et `VALIDATION`. Les vidéos du PowerPoint n'ont PAS été publiées (personnes filmées, document d'un autre enseignant) : elles ont seulement servi de modèle pour les animations.

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
- Contrôle : `npm test` (= `node tests/anims.test.mjs` : calcul de toutes les animations, rien d'enfoncé de plus de 3 cm, segments de longueur constante, animations manquantes). Contrôle visuel : `dev.html?q=id1,id2&n=12&c=6&h=150&w=620&v=profil|trois|face|dessus` (planche d'images).

## Aperçu local
Entrée `gymeps` de `Claude dump/.claude/launch.json` (serveur statique Python, port 5210).

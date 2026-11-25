// Les 6 familles d'éléments gymniques au sol, classés par difficulté (A → D), avec leurs critères de réalisation.
// D'après le document « Les familles de la gymnastique au sol » (critères de réalisation par élément).
// lien : fiche de travail correspondante dans les progressions (thème, niveau).

export const NIVEAUX = {
  A: { nom: 'Facile', couleur: '#22c55e' },
  B: { nom: 'Moyen', couleur: '#3b82f6' },
  C: { nom: 'Difficile', couleur: '#f59e0b' },
  D: { nom: 'Très difficile', couleur: '#ef4444' },
};

export const FAMILLES = [
  {
    id: 'renversements', titre: 'Renversements', couleur: '#a855f7',
    resume: 'Passer la tête en bas : placement du dos, trépied, ATR et ses variantes.',
    elements: [
      { id: 'placement-dos', nom: 'Placement du dos', niv: 'A', anim: 'placement-dos', criteres: ['Départ accroupi', 'Élévation corps groupé'] },
      { id: 'trepied', nom: 'Trépied', niv: 'A', anim: 'trepied', criteres: ['Alignement du corps', 'Tenu 2 secondes'] },
      { id: 'placement-dos-atr', nom: 'Placement du dos + ATR', niv: 'B', anim: 'placement-dos-atr', criteres: ['Départ accroupi', 'Élévation corps groupé puis tendre les jambes'], lien: ['atr', 'B'] },
      { id: 'placement-dos-atr-tendu', nom: 'Placement du dos + ATR jambes tendues', niv: 'B', anim: 'placement-dos-atr-tendu', criteres: ['Départ accroupi', 'Élévation jambes tendues (serrées ou écartées)'] },
      { id: 'atr-revenir', nom: 'ATR + revenir', niv: 'C', anim: 'atr-revenir', criteres: ['Départ en fente', 'ATR en position marquée (jambes serrées à la verticale renversée)'], lien: ['atr', 'C'] },
      { id: 'atr-roulade', nom: 'ATR + roulade', niv: 'C', anim: 'atr-roulade', criteres: ['Départ en fente', 'Passage par l’ATR puis rouler en avant', 'Réception sur les pieds'], lien: ['atr', 'E'] },
      { id: 'atr-tenu', nom: 'ATR tenu', niv: 'D', anim: 'atr-tenu', criteres: ['Départ en fente', 'ATR tenu 2 secondes (immobile, jambes serrées à la verticale renversée)'], lien: ['atr', 'C'] },
      { id: 'atr-demi-valse', nom: 'ATR + ½ valse', niv: 'D', anim: 'atr-demi-valse', criteres: ['Départ en fente', 'Élévation à l’ATR', '½ tour et retour en fente'] },
      { id: 'atr-healy', nom: 'ATR + Healy', niv: 'D', anim: 'atr-healy', criteres: ['Départ en fente', 'Élévation à l’ATR et enchaîner ½ tour en avant corps tendu', 'Réception à l’appui dorsal (1 ou 2 pieds)'] },
      { id: 'atr-valse', nom: 'ATR + 1/1 valse', niv: 'D', anim: 'atr-valse', criteres: ['Départ en fente', 'Élévation à l’ATR', '1 tour sur les mains et retour en fente'] },
    ],
  },
  {
    id: 'sauts', titre: 'Sauts', couleur: '#f59e0b',
    resume: 'Quitter le sol : sauts droits, tournés, groupés, écartés, jetés.',
    elements: [
      { id: 'saut-droit', nom: 'Saut droit', niv: 'A', anim: 'saut-droit', criteres: ['Appel 2 pieds', 'Saut vertical avec élévation des bras'] },
      { id: 'saut-assemble', nom: 'Saut assemblé', niv: 'A', anim: 'saut-assemble', criteres: ['Jambes tendues', 'Réception corrigée'] },
      { id: 'saut-scissone', nom: 'Saut scissone', niv: 'A', anim: 'saut-scissone', criteres: ['Jambes tendues', 'Arrivée en arabesque'] },
      { id: 'saut-demi-tour', nom: 'Saut + ½ tour', niv: 'B', anim: 'saut-demi-tour', criteres: ['Appel 2 pieds', 'Saut vertical avec élévation des bras'] },
      { id: 'saut-chat', nom: 'Saut de chat', niv: 'B', anim: 'saut-chat', criteres: ['Élévation alternée des 2 genoux'] },
      { id: 'saut-carpe-ecart', nom: 'Saut carpé écart', niv: 'C', anim: 'saut-carpe-ecart', criteres: ['Jambes tendues et écartées qui s’élèvent latéralement'] },
      { id: 'saut-groupe', nom: 'Saut groupé', niv: 'C', anim: 'saut-groupe', criteres: ['Jambes serrées', 'Élévation des genoux'] },
      { id: 'saut-tour', nom: 'Saut + 1/1 tour', niv: 'D', anim: 'saut-tour', criteres: ['Appel 2 pieds', 'Saut vertical avec élévation des bras'] },
      { id: 'grand-jete', nom: 'Grand jeté', niv: 'D', anim: 'grand-jete', criteres: ['Appel 1 pied', 'Jambes tendues et jambe avant à l’horizontale', 'Saut en déplacement'] },
      { id: 'saut-ciseau', nom: 'Saut ciseau', niv: 'D', anim: 'saut-ciseau', criteres: ['Appel 1 pied', 'Élévation alternée des 2 jambes tendues à l’horizontale'] },
    ],
  },
  {
    id: 'maintiens', titre: 'Maintiens', couleur: '#10b981',
    resume: 'Tenir une position 2 secondes : équilibres, chandelle, pont, équerres, écarts.',
    elements: [
      { id: 'equilibre-fessier', nom: 'Équilibre fessier', niv: 'A', anim: 'equilibre-fessier', criteres: ['Jambes tendues à 45° minimum', 'Position maintenue 2 secondes'] },
      { id: 'arabesque', nom: 'Arabesque', niv: 'A', anim: 'arabesque', criteres: ['Jambe arrière décollée', 'Bras écartés', 'Position maintenue 2 secondes'] },
      { id: 'planche-ecart', nom: 'Planche écart', niv: 'A', anim: 'planche-ecart', criteres: ['Jambes écartées', 'Buste à l’horizontale', 'Position maintenue 2 secondes'] },
      { id: 'attitude', nom: 'Attitude libre', niv: 'A', anim: 'attitude', criteres: ['Jambe au sol tendue', 'Position maintenue 2 secondes'] },
      { id: 'chandelle', nom: 'Chandelle', niv: 'B', anim: 'chandelle', criteres: ['Alignement du corps', 'Bras au sol', 'Position maintenue 2 secondes'] },
      { id: 'pont', nom: 'Pont', niv: 'C', anim: 'pont', criteres: ['Bras tendus', 'Jambes serrées', 'Position maintenue 2 secondes'] },
      { id: 'planche', nom: 'Planche', niv: 'C', anim: 'planche', criteres: ['Jambes tendues', 'Pied à plat', 'Jambe libre à l’horizontale', 'Position maintenue 2 secondes'] },
      { id: 'equerre-groupee', nom: 'Équerre groupée', niv: 'C', anim: 'equerre-groupee', criteres: ['Bras tendus, mains à plat', 'Fesses et pieds décollés', 'Jambes fléchies', 'Position maintenue 2 secondes'] },
      { id: 'y', nom: 'Y', niv: 'D', anim: 'y', criteres: ['Jambes tendues, pied à plat', 'Jambe libre à l’horizontale', 'Pied dans la main', 'Position maintenue 2 secondes'] },
      { id: 'grand-ecart', nom: 'Grand écart', niv: 'D', anim: 'grand-ecart', criteres: ['Ventre au sol ou écart facial ou antéro-postérieur', 'Position maintenue 2 secondes'] },
      { id: 'equerre', nom: 'Équerre', niv: 'D', anim: 'equerre', criteres: ['Bras tendus, mains à plat', 'Fesses et pieds décollés', 'Jambes tendues', 'Position maintenue 2 secondes'] },
    ],
  },
  {
    id: 'roulements', titre: 'Roulements', couleur: '#06b6d4',
    resume: 'Rouler en avant ou en arrière : groupé, écart, jambes tendues, jusqu’à l’ATR.',
    elements: [
      { id: 'roulade-avant', nom: 'Roulement avant', niv: 'A', anim: 'roulade-avant', criteres: ['Départ accroupi', 'Corps groupé', 'Réception accroupi', 'Se relever sans les mains'], lien: ['rouler-avant', 'B'] },
      { id: 'roulade-arriere', nom: 'Roulement arrière', niv: 'B', anim: 'roulade-arriere', criteres: ['Départ accroupi', 'Corps groupé', 'Réception accroupi'], lien: ['rouler-arriere', 'B'] },
      { id: 'roulade-arriere-ecart', nom: 'Roulement arrière écarté', niv: 'B', anim: 'roulade-arriere-ecart', criteres: ['Départ libre', 'Jambes tendues et écartées à la réception'], lien: ['rouler-arriere', 'B'] },
      { id: 'roulade-avant-ecart', nom: 'Roulement avant écarté', niv: 'B', anim: 'roulade-avant-ecart', criteres: ['Départ libre', 'Pose des mains entre les jambes', 'Jambes tendues et écartées à la réception'], lien: ['rouler-avant', 'D'] },
      { id: 'roulade-arriere-tendue', nom: 'Roulement arrière jambes tendues serrées', niv: 'C', anim: 'roulade-arriere-tendue', criteres: ['Jambes tendues et serrées du début à la fin de l’élément'], lien: ['rouler-arriere', 'C'] },
      { id: 'roulade-avant-tendue', nom: 'Roulement avant jambes tendues serrées', niv: 'D', anim: 'roulade-avant-tendue', criteres: ['Départ libre', 'Après la poussée initiale, les jambes sont serrées et tendues', 'Les mains se posent de chaque côté des jambes'], lien: ['rouler-avant', 'E'] },
      { id: 'roulade-arriere-bras-tendus', nom: 'Roulement arrière bras tendus', niv: 'D', anim: 'roulade-arriere-bras-tendus', criteres: ['Départ libre', 'Jambes tendues ensuite', 'Hauteur des jambes libre', 'Bras tendus'], lien: ['rouler-arriere', 'C'] },
      { id: 'roulade-arriere-atr', nom: 'Roulement arrière ATR', niv: 'D', anim: 'roulade-arriere-atr', criteres: ['Départ libre', 'Jambes tendues ensuite', 'Bras tendus ou pliés puis tendus', 'ATR passager'], lien: ['rouler-arriere', 'D'] },
    ],
  },
  {
    id: 'liaisons', titre: 'Liaisons et éléments chorégraphiques', court: 'Liaisons', couleur: '#ec4899',
    resume: 'Relier les éléments avec style : battements, pas chassés, tours, ressorts, cercles.',
    elements: [
      { id: 'grand-battement', nom: 'Grand battement', niv: 'A', anim: 'grand-battement', criteres: ['Jambe libre tendue', 'Au-dessus de l’horizontale'] },
      { id: 'demi-tour-pointes', nom: '½ tour sur demi-pointes', niv: 'A', anim: 'demi-tour-pointes', criteres: ['Tour « naturel » sur demi-pointes'] },
      { id: 'pas-chasses', nom: '2 pas chassés', niv: 'A', anim: 'pas-chasses', criteres: ['Pas chassés frontaux ou latéraux', 'Bras tendus sur le côté'] },
      { id: 'ressort-groupe', nom: 'Temps de ressort groupé', niv: 'A', anim: 'ressort-groupe', criteres: ['Départ appui facial', 'Temps de ressort et retour accroupi'] },
      { id: 'tour-enveloppe', nom: 'Tour enveloppé', niv: 'B', anim: 'tour-enveloppe', criteres: ['Bras placés', 'Sur demi-pointes'] },
      { id: 'demi-tour-appui', nom: '½ tour en appui facial', niv: 'B', anim: 'demi-tour-appui', criteres: ['Départ appui facial', 'Rotation corps tendu, bras tendus', 'Arrivée appui dorsal (idem dans l’autre sens)'] },
      { id: 'cercles-jambe', nom: '2 cercles d’une jambe', niv: 'B', anim: 'cercles-jambe', criteres: ['Une jambe au sol pliée', 'La jambe libre en rotation est tendue'] },
      { id: 'ressort-tendu', nom: 'Temps de ressort jambes tendues', niv: 'C', anim: 'ressort-tendu', criteres: ['Départ appui facial', 'Temps de ressort', 'Jambes tendues tout au long de la réalisation'] },
      { id: 'tour-appui', nom: '1/1 tour en appui', niv: 'C', anim: 'tour-appui', criteres: ['Départ et arrivée en appui manuel facial', 'Rotation corps tendu', 'Bras tendus'] },
      { id: 'demi-tour-pied', nom: '½ tour sur 1 pied', niv: 'C', anim: 'demi-tour-pied', criteres: ['Rotation sur demi-pointe', 'Position de la jambe libre au choix mais fixe', 'Retour de la jambe libre devant'] },
      { id: 'tour-pied', nom: '1/1 tour sur 1 pied', niv: 'D', anim: 'tour-pied', criteres: ['Rotation sur demi-pointe', 'Position de la jambe libre au choix mais fixe', 'Retour de la jambe libre devant'] },
      { id: 'cercle-jambes', nom: '1 cercle de jambes', niv: 'D', anim: 'cercle-jambes', criteres: ['Départ libre', '1 cercle des jambes serrées ou écartées'] },
    ],
  },
  {
    id: 'acrobaties', titre: 'Acrobaties', couleur: '#ef4444',
    resume: 'Tourner avec ou sans les mains : roue, rondade, souplesses, saut de mains, salto.',
    elements: [
      { id: 'roue', nom: 'Roue', niv: 'C', anim: 'roue', criteres: ['Départ et réception en fente', 'Bras et jambes tendus', 'Alignement des appuis mains-pieds'], lien: ['roue', 'C'] },
      { id: 'rondade', nom: 'Rondade', niv: 'C', anim: 'rondade', criteres: ['Départ en fente', 'Jambes tendues', 'Réception jambes serrées'], lien: ['roue', 'E'] },
      { id: 'sursaut-roue', nom: 'Sursaut + roue ou rondade', niv: 'C', anim: 'sursaut-roue', variantes: [{ nom: 'Sursaut + roue', anim: 'sursaut-roue' }, { nom: 'Sursaut + rondade', anim: 'sursaut-rondade' }], criteres: ['Départ jambes serrées fléchies', 'Grand sursaut ou 3 pas d’élan', 'Rebond avant réception'], lien: ['roue', 'F'] },
      { id: 'saut-tete', nom: 'Saut de tête', niv: 'C', anim: 'saut-tete', criteres: ['Départ et arrivée à la station debout', 'Jambes tendues et serrées'] },
      { id: 'pont-revenir', nom: 'Pont + revenir', niv: 'C', anim: 'pont-revenir', criteres: ['Départ sur le dos', 'Venir en pont', 'Bras tendus et jambe libre tendue'] },
      { id: 'souplesse-avant', nom: 'Souplesse avant', niv: 'C', anim: 'souplesse-avant', criteres: ['Départ et arrivée à la station debout', 'Jambe libre tendue'] },
      { id: 'souplesse-arriere', nom: 'Souplesse arrière', niv: 'D', anim: 'souplesse-arriere', criteres: ['Départ et arrivée à la station debout', 'Jambe libre tendue'] },
      { id: 'saut-mains', nom: 'Sursaut + saut de mains', niv: 'D', anim: 'saut-mains', criteres: ['Sursaut ou 3 pas d’élan', 'Bras et jambe libre tendus', 'Réception 1 pied ou 2 pieds'], lien: ['atr', 'H'] },
      { id: 'salto-avant-tremplin', nom: 'Salto avant avec tremplin et tapis', niv: 'D', anim: 'salto-avant-tremplin', criteres: ['3 pas d’élan', 'Impulsion sur tremplin', 'Jambes serrées et corps groupé', 'Réception à la station debout sur un tapis'], lien: ['salto-avant', 'D'], prof: true },
    ],
  },
];

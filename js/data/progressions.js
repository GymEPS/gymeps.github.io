// Progressions par thème, d’après les fiches de travail interactives de gymnastique (F. Demazeux, lycée Jean Rostand).
export const SECURITE = {
  materiel: [
    'Un seul élève passe sur l’atelier, les autres libèrent l’espace',
    'Avant chaque passage, les membres du groupe s’assurent que :',
    'Les tapis sont bien en place (collés les uns aux autres et à leur place)',
    'L’espace de travail est libre',
  ],
  regles: [
    '« Je libère l’atelier dès que possible »',
    '« J’attends que l’élève précédent ait terminé »',
    '« Je ne traverse pas la zone de travail »',
  ],
  parade: 'Elle consiste à assurer la sécurité du partenaire en cas de difficulté (déséquilibre, mauvaise impulsion etc.)',
  aide: 'Elle consiste à accompagner du début à la fin le partenaire pour l’aider à réaliser l’élément travaillé',
  criteresParade: [
    'Se placer de manière adaptée par rapport au partenaire et à l’élément travaillé (ex : ni trop près, ni trop loin, de profil…)',
    'Être vigilant du début à la fin de l’élément',
    'Communication simple et réduite (ne pas crier, utiliser un code simple entre les deux partenaires)',
  ],
  interdits: [
    'Interdiction de travailler des éléments d’un niveau supérieur sans avoir validé le précédent',
    'Interdiction de travailler d’autres éléments que ceux indiqués sur la progression',
  ],
};

export const VALIDATION = {
  niveaux: 'De A à H selon les thèmes',
  criteres: [
    'L’élément doit être réussi du premier coup',
    'Respect des critères de réussite',
    'Réception maîtrisée',
  ],
  seulProf: 'Seul l’enseignant peut valider un niveau',
  devise: 'Simple et correct vaut mieux que difficile et incorrect',
};

export const THEMES = [
  {
    id: 'rouler-avant', titre: 'Rouler en avant', element: 'Roulade avant → Saut de l’ange', couleur: '#22c55e',
    niveaux: [
      {
        niv: 'A', nom: 'Roulade avant groupé sur plan incliné', anim: 'roulade-avant-plan',
        criteres: ['Je roule dans l’axe', 'Je me relève sans poser les mains derrière les fesses'],
        consignes: ['Poser les mains à plat devant soi', 'Pousser dans les jambes pour monter les fesses au dessus de la tête', 'Amortir avec les bras et rentrer la tête (le menton touche la poitrine)'],
        materiel: ['Tremplin', 'Tapis', 'Mini tremplin en mousse'],
        parade: false,
        remediations: [
          {
            nom: 'Roulade avant groupé sur plan incliné', anim: 'roulade-avant-plan',
            consignes: ['Poser les mains à plat devant soi', 'Pousser dans les jambes pour monter les fesses au dessus de la tête', 'Amortir avec les bras et rentrer la tête (le menton touche la poitrine)'],
            materiel: ['Bloc de parade', 'Plan incliné'],
          },
          {
            nom: 'Roulade avant groupé sur plan incliné', anim: 'roulade-avant-bloc',
            consignes: ['Départ allongé sur le ventre', 'Poser les mains à plat au sol', 'Amortir avec les bras parallèles et poser la nuque en rentrant la tête (menton / poitrine), dos arrondi', 'Fléchir les jambes le plus tard possible pour se relever'],
            materiel: ['Table de saut en mousse ou Bloc en mousse rectangulaire type « Dima 6 »'],
          },
        ],
      },
      {
        niv: 'B', nom: 'Roulade avant groupé', anim: 'roulade-avant',
        criteres: ['Je roule dans l’axe', 'Je me relève sans poser les mains derrière les fesses'],
        consignes: ['Départ debout', 'Poser les mains loin devant en rentrant la tête (menton / poitrine)', 'Amortir avec les bras parallèles'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'C', nom: 'Roulade avant écart sur plan incliné', anim: 'roulade-avant-ecart-plan',
        criteres: ['Mes jambes restent tendues', 'Je pose mes mains entre mes jambes pour me redresser'],
        consignes: ['Départ pieds serrés', 'Poser les mains loin devant soi', 'Écarter les jambes le plus tard possible', 'Se relever jambes tendues avec l’aide des mains entre les jambes'],
        materiel: ['Tremplin', 'Tapis', 'Mini tremplin en mousse'],
        parade: false,
        remediations: [
          {
            nom: 'Roulade avant écart sur plan incliné', anim: 'redresse-ecart',
            consignes: ['Départ allongé sur le dos, jambes tendues à la verticale', 'Se redresser en écartant les jambes tendues et en poussant sur les mains entre les jambes'],
            materiel: ['Tremplin', 'Tapis'],
          },
          {
            nom: 'Roulade avant écart sur plan incliné', anim: 'roulade-avant-ecart-plan',
            consignes: ['Départ pieds serrés', 'Poser les mains loin devant soi', 'Écarter les jambes au dernier moment', 'Se relever jambes tendues avec l’aide des mains entre les jambes'],
            materiel: ['Bloc de parade', 'Plan incliné'],
          },
        ],
      },
      {
        niv: 'D', nom: 'Roulade avant écart', anim: 'roulade-avant-ecart',
        criteres: ['Mes jambes restent tendues', 'Je pose mes mains entre mes jambes pour me redresser'],
        consignes: ['Départ pieds serrés', 'Poser les mains loin devant soi', 'Écarter les jambes au dernier moment', 'Se relever jambes tendues avec l’aide des mains entre les jambes'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'E', nom: 'Roulade avant carpé', anim: 'roulade-avant-tendue',
        criteres: ['Mes jambes restent tendues et serrées jusqu’à la réception', 'Réception stabilisée'],
        consignes: ['Départ pieds serrés', 'Poser les mains loin devant soi', 'Se relever jambes tendues et serrées en poussant fort et longtemps sur les mains derrière les fesses'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'F', nom: 'Saut de l’ange', anim: 'saut-ange',
        criteres: ['Corps aligné en l’air', 'Rouler mains à plat au sol', 'Réception stabilisée'],
        consignes: ['3 pas d’élan, impulsion à 2 pieds, jambes tendues, dos arrondi, bras levés (« se grandir »)', 'Rester gainé en l’air', 'Regarder les mains se poser au sol pour amortir avec ses bras', 'Rentrer la tête (menton / poitrine) pour rouler', 'Fléchir les jambes le plus tard possible pour se relever'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Saut de l’ange', anim: 'saut-ange', seulementDiff: true,
            consignes: ['Regarder les mains se poser sur le sur-tapis de réception pour amortir avec ses bras'],
            materiel: ['Praticable', 'Sur-tapis de 10cm d’épaisseur'],
          },
          {
            nom: 'Saut de l’ange sur tremplin', anim: 'saut-ange-tremplin', seulementDiff: true,
            consignes: ['Regarder les mains se poser sur les tapis de réception pour amortir avec ses bras'],
            materiel: ['Praticable', '1 tremplin', '2 tapis de réception', 'Sur-tapis de 10cm d’épaisseur'],
          },
          {
            nom: 'Saut de l’ange sur tremplin', anim: 'saut-ange-tremplin', seulementDiff: true,
            consignes: ['Utiliser le tremplin pour monter haut, corps gainé et aligné avant de poser les mains sur le gros tapis de réception'],
            materiel: ['Praticable', '1 tremplin', '2 tapis de réception', '1 gros tapis de réception'],
          },
        ],
      },
    ],
  },
  {
    id: 'rouler-arriere', titre: 'Rouler en arrière', element: 'Roulade arrière', couleur: '#06b6d4',
    niveaux: [
      {
        niv: 'A', nom: 'Roulade arrière groupé sur plan incliné', anim: 'roulade-arriere-plan',
        criteres: ['Je roule dans l’axe', 'Mes coudes et mes genoux ne touchent pas le sol'],
        consignes: ['Départ assis, pieds serrés, mains tournées vers les épaules, coudes levés et parallèles', 'Rentrer la tête (menton / poitrine) et regarder ses genoux', 'Rouler sur le dos et poser les mains à plat', 'Rester groupé pour se réceptionner sur les pieds'],
        materiel: ['Tremplin', 'Tapis'],
        parade: false,
        remediations: [
          {
            nom: 'Roulade arrière écart sur plan incliné', anim: 'roulade-arriere-ecart-plan', seulementDiff: true,
            consignes: ['Écarter les jambes pour se réceptionner sur les pieds'],
            materiel: ['Tremplin', 'Tapis'],
          },
          {
            nom: 'Roulade arrière groupé sur plan incliné', anim: 'roulade-arriere-plan',
            consignes: ['Départ assis, pieds serrés, mains tournées vers les épaules, coudes levés et parallèles', 'Rentrer la tête (menton / poitrine) et regarder ses genoux', 'Rouler sur le dos et poser les mains à plat', 'Rester groupé pour se réceptionner sur les pieds'],
            materiel: ['Bloc triangulaire'],
          },
          {
            nom: 'Roulade arrière écart sur plan incliné', anim: 'roulade-arriere-ecart-plan', seulementDiff: true,
            consignes: ['Écarter les jambes pour se réceptionner sur les pieds'],
            materiel: ['Bloc triangulaire'],
          },
        ],
      },
      {
        niv: 'B', nom: 'Roulade arrière groupé', anim: 'roulade-arriere',
        criteres: ['Je roule dans l’axe', 'Mes coudes et mes genoux ne touchent pas le sol'],
        consignes: ['Départ debout, s’asseoir mains tournées vers les épaules, coudes levés et parallèles', 'Rentrer la tête (menton / poitrine) et regarder ses genoux', 'Rouler sur le dos et poser les mains à plat', 'Rester groupé pour se réceptionner sur les pieds'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Roulade arrière écart', anim: 'roulade-arriere-ecart', seulementDiff: true,
            consignes: ['Écarter les jambes pour se réceptionner sur les pieds'],
            materiel: ['Praticable'],
          },
        ],
      },
      {
        niv: 'C', nom: 'Roulade arrière carpé, bras tendus', anim: 'roulade-arriere-bras-tendus',
        criteres: ['Je roule dans l’axe', 'Mes jambes sont tendues à la réception'],
        consignes: ['S’accroupir en plaçant les bras tendus à hauteur des oreilles, mains tournées l’une vers l’autre', 'Lancer les jambes tendues vers l’arrière en poussant sur les épaules'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Roulade arrière carpé, bras fléchis', anim: 'roulade-arriere-tendue',
            consignes: ['S’asseoir mains tournées vers les épaules, coudes levés et parallèles', 'Lancer les jambes tendues vers l’arrière en poussant fort sur les bras pour se redresser'],
            materiel: ['Praticable'],
          },
          {
            nom: 'Roulade arrière carpé, bras tendus, sur plan incliné', anim: 'roulade-arriere-tendue-plan',
            consignes: ['S’asseoir en plaçant les bras tendus à hauteur des oreilles, mains tournées l’une vers l’autre', 'Lancer les jambes tendues vers l’arrière en poussant sur les épaules'],
            materiel: ['Tremplin', 'Tapis'],
          },
          {
            nom: 'Roulade arrière carpé, bras fléchis, sur plan incliné', anim: 'roulade-arriere-tendue-plan',
            consignes: ['S’asseoir mains tournées vers les épaules, coudes levés et parallèles', 'Lancer les jambes tendues vers l’arrière en poussant sur les bras'],
            materiel: ['Tremplin', 'Tapis'],
          },
          {
            nom: 'Roulade arrière carpé, bras tendus, sur plan incliné', anim: 'roulade-arriere-tendue-plan',
            consignes: ['S’asseoir en plaçant les bras tendus à hauteur des oreilles, mains tournées l’une vers l’autre', 'Lancer les jambes tendues vers l’arrière en poussant sur les épaules'],
            materiel: ['Bloc triangulaire'],
          },
          {
            nom: 'Roulade arrière carpé, bras fléchis, sur plan incliné', anim: 'roulade-arriere-tendue-plan',
            consignes: ['S’asseoir mains tournées vers les épaules, coudes levés et parallèles', 'Lancer les jambes tendues vers l’arrière en poussant sur les bras'],
            materiel: ['Bloc triangulaire'],
          },
        ],
      },
      {
        niv: 'D', nom: 'Roulade arrière à l’ATR, bras tendus', anim: 'roulade-arriere-atr',
        criteres: ['Je suis aligné en ATR'],
        consignes: ['S’asseoir en plaçant les bras tendus à hauteur des oreilles, mains tournées l’une vers l’autre', 'Lancer les jambes tendues vers le plafond (passage en chandelle) en poussant sur les épaules'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Roulade arrière à l’ATR, bras fléchis', anim: 'roulade-arriere-atr',
            consignes: ['S’asseoir mains tournées vers les épaules, coudes levés et parallèles', 'Lancer les jambes tendues vers le plafond (passage en chandelle) en poussant sur les bras'],
            materiel: ['Praticable'],
          },
          {
            nom: 'Roulade arrière à l’ATR, bras tendus', anim: 'roulade-arriere-atr',
            consignes: ['S’asseoir en plaçant les bras tendus à hauteur des oreilles, mains tournées l’une vers l’autre', 'Lancer les jambes tendues vers le plafond (passage en chandelle) en poussant sur les épaules'],
            materiel: ['Bloc triangulaire'],
          },
        ],
      },
    ],
  },
  {
    id: 'atr', titre: 'Se renverser en ATR pour tourner en avant', element: 'ATR → Saut de mains', couleur: '#a855f7',
    niveaux: [
      {
        niv: 'A', nom: 'Appui tendu renversé tenu 3’’ face au mur', anim: 'atr-face-mur',
        criteres: ['Je tiens 3’’', 'Il n’y a que les pieds qui touchent le mur'],
        consignes: ['Mains au sol, monter les pieds sur le plan incliné', 'Pousser sur les bras tendus', 'Gainer tout le corps (mains, épaules, dos et jambes alignés)', 'Tenir 3’’ en regardant les mains au sol', 'Rouler en fléchissant les bras parallèlement'],
        materiel: ['Mur', 'Bloc triangulaire', 'Tapis de réception'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'B', nom: 'Placement du dos 3’’ puis ATR dos au mur 3’’', anim: 'placement-dos-atr-mur',
        criteres: ['Je regarde toujours mes mains au sol', 'Je tiens chaque position 3’’', 'Il n’y a que les pieds qui touchent le mur'],
        consignes: ['Mains au sol, bras tendus, poser les pieds sur le bloc jambes tendues pour aligner le dos avec les bras (placement du dos)', 'Regarder les mains au sol', 'Monter une jambe, puis l’autre pour tenir l’ATR avec les pieds en contact avec le tapis au mur'],
        materiel: ['Gros tapis au mur', 'Table de saut en mousse', 'Tapis de réception'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'C', nom: 'ATR 3’’ dos au mur', anim: 'atr-dos-mur',
        criteres: ['Je regarde toujours mes mains au sol', 'Je tiens 3’’', 'Il n’y a que les pieds qui touchent le mur'],
        consignes: ['Poser les mains à plat en fléchissant la jambe avant, bras tendus, écartement des épaules', 'Regarder les mains au sol', 'Lancer la jambe arrière, tendue, vers le tapis au mur et assembler les 2 pieds'],
        materiel: ['Gros tapis au mur', 'Tapis de réception'],
        parade: false,
        remediations: [
          {
            nom: 'ATR 3’’ dos au mur', anim: 'atr-dos-mur', seulementDiff: true,
            consignes: ['Départ mains à plat au sol (bras tendus, écartement des épaules), jambe avant fléchie, jambe arrière tendue au dessus du sol'],
            materiel: ['Gros tapis au mur', 'Tapis de réception'],
          },
          {
            nom: 'ATR 3’’ dos au mur', anim: 'atr-dos-mur', seulementDiff: true,
            consignes: ['Regarder un repère visuel au sol du début à la fin'],
            materiel: ['Gros tapis au mur', 'Tapis de réception', 'Repère visuel au sol'],
          },
        ],
      },
      {
        niv: 'D', nom: 'ATR tomber à plat dos', anim: 'atr-plat-dos',
        criteres: ['Je regarde toujours mes mains au sol', 'Arriver bras tendus et alignés avec le dos, dans l’axe et corps gainé'],
        consignes: ['Poser les mains à plat en fléchissant la jambe avant, bras tendus, écartement des épaules', 'Regarder les mains ou un repère visuel au sol', 'Lancer la jambe arrière, tendue et assembler les 2 pieds à la verticale en restant gainé jusqu’à la réception sur le dos (bras, dos et jambes alignés)'],
        materiel: ['Tapis de réception', 'Repère visuel au sol'],
        parade: false,
        remediations: [
          {
            nom: 'ATR tomber à plat dos', anim: 'atr-plat-dos',
            consignes: ['Départ mains au sol, bras tendus, pieds sur le bloc jambes tendues, aligner le dos avec les bras (placement du dos)', 'Regarder les mains ou un repère visuel au sol', 'Monter une jambe puis l’autre à la verticale (ATR)', 'Rester gainé jusqu’à la réception sur le dos (bras, dos et jambes alignés)'],
            materiel: ['Bloc en mousse', 'Tapis de réception', 'Repère visuel au sol'],
          },
        ],
      },
      {
        niv: 'E', nom: 'ATR roulade avant', anim: 'atr-roulade',
        criteres: ['Je suis aligné, jambes serrées en ATR avant de rouler', 'Je me relève sans aide des mains au sol'],
        consignes: ['Lancer la jambe arrière pour passer à l’ATR, corps gainé et aligné, jambes serrées', 'Regarder les mains au sol le plus longtemps possible', 'Rouler bras tendus en rentrant la tête (menton / poitrine), dos arrondi', 'Fléchir les jambes le plus tard possible pour se relever'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'ATR roulade avant', anim: 'atr-roulade', seulementDiff: true,
            consignes: ['Rouler en fléchissant les bras'],
            materiel: ['Praticable'],
          },
          {
            nom: 'ATR roulade avant', anim: 'atr-roulade',
            consignes: ['Placement du dos jambes tendues, pieds sur le bloc (bras et dos alignés)', 'Regarder les mains au sol', 'Monter une jambe à l’ATR', 'Plier les bras parallèlement puis poser la nuque en rentrant la tête (menton / poitrine), dos arrondi', 'Fléchir les jambes le plus tard possible pour se relever'],
            materiel: ['Table de saut en mousse ou Bloc en mousse rectangulaire type « Dima 6 »'],
          },
          {
            nom: 'ATR roulade avant', anim: 'roulade-avant-bloc',
            consignes: ['Départ allongé sur le ventre', 'Poser les mains à plat', 'Amortir avec les bras parallèles pour poser la nuque en rentrant la tête (menton / poitrine), dos arrondi', 'Fléchir les jambes le plus tard possible pour se relever'],
            materiel: ['Table de saut en mousse ou Bloc en mousse rectangulaire type « Dima 6 »'],
          },
        ],
      },
      {
        niv: 'F', nom: 'ATR avec impulsion, tomber à plat dos', anim: 'atr-impulsion',
        criteres: ['Sursaut sur les mains bras tendus (impulsion)', 'Arriver bras tendus, dans l’axe, corps gainé'],
        consignes: ['Grande fente avant en regardant la marque à franchir au sol', 'Lancer fort la jambe arrière et pousser très fort dans les épaules pour franchir le repère visuel au sol en « sautant »', 'Passer en ATR après avoir franchi la marque au sol', 'Rester gainé jusqu’à la réception sur le dos (bras, dos et jambes alignés)'],
        materiel: ['Tapis de réception', 'Repère visuel au sol'],
        parade: false,
        remediations: [
          {
            nom: 'ATR avec impulsion, tomber à plat dos', anim: 'atr-impulsion', seulementDiff: true,
            consignes: ['Franchir le repère visuel au sol en avançant une main, puis l’autre, lorsque les pieds dépassent la verticale (marcher sur les mains)'],
            materiel: ['Tapis de réception', 'Repère visuel au sol'],
          },
        ],
      },
      {
        niv: 'G', nom: 'Saut de mains sur mini-trampoline', anim: 'saut-mains-trampo',
        criteres: ['Passage en ATR', 'Passer par-dessus l’obstacle sans le toucher', 'Réception debout, bras verticaux'],
        consignes: ['1 ou 2 pas d’élan, grand sursaut vers l’avant, bras alignés avec le dos (« se grandir »)', 'Grande fente avant en regardant le mini-trampoline le plus longtemps possible', 'Lancer très fort la jambe arrière et pousser très fort dans les épaules pour rebondir sur le mini-trampoline', 'Franchir l’obstacle corps gainé jusqu’à la réception debout (bras, dos et jambes alignés)'],
        materiel: ['2 Tapis de réception', '1 sur-tapis de réception', 'Bloc cylindrique', 'Mini-trampoline', '2 petites caisses en bois et leur chapeau'],
        parade: false,
        remediations: [
          {
            nom: 'Saut de mains sur mini-trampoline', anim: 'saut-mains-trampo',
            consignes: ['Départ debout bras alignés avec le dos (« se grandir »)', 'Grande fente avant en regardant le mini-trampoline le plus longtemps possible', 'Lancer la jambe arrière et pousser très fort dans les épaules au passage en ATR', 'Rester corps aligné et gainé jusqu’à l’arrivée du dos sur le bloc cylindrique'],
            materiel: ['2 Tapis de réception', '1 sur-tapis de réception', 'Bloc cylindrique', 'Mini-trampoline', '2 petites caisses en bois et leur chapeau'],
          },
        ],
      },
      {
        niv: 'H', nom: 'Saut de mains au sol', anim: 'saut-mains',
        criteres: ['Passage en ATR', 'Réception debout, bras verticaux'],
        consignes: ['1 à 3 pas d’élan, grand sursaut vers l’avant, bras alignés avec le dos (« se grandir »)', 'Grande fente avant en regardant les mains au sol le plus longtemps possible', 'Lancer très fort la jambe arrière et pousser très fort dans les épaules', 'Rester corps gainé jusqu’à la réception debout (bras, dos et jambes alignés)'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Saut de mains au sol', anim: 'saut-mains', seulementDiff: true,
            consignes: ['Poser les mains sur le tapis'],
            materiel: ['2 tapis de réception', '1 sur-tapis de réception'],
          },
        ],
      },
    ],
  },
  {
    id: 'roue', titre: 'Tourner en avant en passant par l’ATR avec rotation longitudinale', element: 'Roue → Rondade', couleur: '#f59e0b',
    niveaux: [
      {
        niv: 'A', nom: 'Roue sur obstacle en largeur', anim: 'roue-obstacle',
        criteres: ['Roue en arc de cercle', 'Départ et réception pieds décalés', 'Passage jambes tendues à 45°'],
        consignes: ['Départ debout pieds décalés', 'Lancer la jambe arrière et poser les mains sur l’obstacle (mains tournées l’une vers l’autre)', 'Pousser fort sur les bras tendus', 'Regarder l’obstacle jusqu’à la réception', 'Se réceptionner sur un pied, puis l’autre de l’autre côté de l’obstacle'],
        materiel: ['Chapeau de caisse en bois'],
        parade: false,
        remediations: [
          {
            nom: 'Roue sur obstacle en largeur', anim: 'roue-obstacle', seulementDiff: true,
            consignes: ['Lancer la jambe arrière par-dessus le bloc en mousse et poser les mains sur l’obstacle (mains tournées l’une vers l’autre)'],
            materiel: ['Chapeau de caisse en bois', 'Bloc en mousse trapézoïdal'],
          },
          {
            nom: 'Roue sur obstacle en largeur', anim: 'roue-obstacle', seulementDiff: true,
            consignes: ['Lancer la jambe arrière par-dessus la caisse en bois et poser les mains dessus (mains tournées l’une vers l’autre)'],
            materiel: ['Petite caisse en bois'],
          },
          {
            nom: 'Roue sur obstacle en largeur', anim: 'roue-obstacle',
            consignes: ['Départ debout, mains sur la caisse (mains tournées l’une vers l’autre), un pied de chaque côté de la caisse', 'Pousser fort sur les bras tendus et regarder les mains sur l’obstacle', 'Pousser alternativement sur une jambe puis sur l’autre'],
            materiel: ['Petite caisse en bois'],
          },
        ],
      },
      {
        niv: 'B', nom: 'Roue sur obstacle en longueur', anim: 'roue-plinth-long',
        criteres: ['J’arrive un pied après l’autre dans la zone de réception', 'Passage jambes tendues vers l’ATR'],
        consignes: ['Départ debout devant l’obstacle, bras levés alignés avec le dos', 'Poser un pied sur l’obstacle et lancer la jambe arrière tendue vers le haut', 'Poser une main après l’autre au bout de l’obstacle (mains tournées l’une vers l’autre)', 'Pousser fort sur les bras et regarder le bout de l’obstacle jusqu’à la réception'],
        materiel: ['Chapeau de caisse en bois', 'Carpette'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'C', nom: 'Roue dans un couloir', anim: 'roue',
        criteres: ['Roue axée dans le couloir', 'Mes jambes ne touchent pas les murs'],
        consignes: ['Départ en grande fente avant, bras alignés avec le dos', 'Lancer fort la jambe arrière tendue vers le haut et poser les mains au sol en tournant les épaules dans l’axe du déplacement', 'Pousser fort sur un bras puis sur l’autre', 'Regarder l’endroit où les mains se posent jusqu’à la réception'],
        materiel: ['2 blocs en mousse rectangulaires'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'D', nom: '2 Roues enchaînées au sol', anim: 'roue-double',
        criteres: ['Roues axées', 'Pas d’arrêt entre les 2 roues (2 poses de pieds maxi)'],
        consignes: ['Départ en grande fente avant, bras alignés avec le dos', 'Lancer fort la jambe arrière tendue vers le haut et poser les mains au sol en tournant les épaules dans l’axe du déplacement', 'Pousser fort sur un bras puis sur l’autre', 'Regarder l’endroit où les mains se posent jusqu’à la réception sur le 1er pied puis se replacer en fente avant…'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'E', nom: 'Sursaut, Rondade sur mini-trampoline', anim: 'rondade-trampo',
        criteres: ['Mes mains ne sont plus au sol quand mes pieds se posent', 'Réception debout, dans l’axe, bras parallèles'],
        consignes: ['Sursaut vers l’avant, bras alignés avec le dos (« se grandir »)', 'Grande fente avant en regardant le mini-trampoline jusqu’à la réception', 'Lancer la jambe arrière tendue vers le haut et poser les mains en tournant les épaules dans l’axe du déplacement', 'Pousser fort dans les épaules pour rebondir sur le mini-trampoline', 'Assembler les jambes et les poser en même temps face au mini-trampoline'],
        materiel: ['2 Tapis de réception', '1 sur-tapis de réception', 'Mini-trampoline', '2 petites caisses en bois et leur chapeau'],
        parade: false,
        remediations: [
          {
            nom: 'Rondade sur mini-trampoline', anim: 'rondade-trampo', seulementDiff: true,
            consignes: ['Départ en grande fente avant sans sursaut'],
            materiel: ['2 Tapis de réception', '1 sur-tapis de réception', 'Mini-trampoline', '2 petites caisses en bois et leur chapeau'],
          },
          {
            nom: 'Rondade sur mini-trampoline', anim: 'rondade-trampo',
            consignes: ['Bien tourner les épaules dans le sens du déplacement juste avant de poser les mains sur le mini-trampoline', 'Pousser sur les 2 bras pour rester dans l’axe'],
            materiel: ['2 Tapis de réception', '1 sur-tapis de réception', '1 obstacle en mousse', 'Mini-trampoline', '2 petites caisses en bois et leur chapeau'],
          },
        ],
      },
      {
        niv: 'F', nom: 'Sursaut, Rondade saut en extension', anim: 'rondade-saut',
        criteres: ['Temps de suspension avant la pose des pieds', 'Pas d’arrêt entre rondade et saut'],
        consignes: ['Grand sursaut vers l’avant, bras alignés avec le dos (« se grandir »)', 'Grande fente avant en regardant l’endroit où les mains se posent au sol jusqu’à la réception', 'Lancer la jambe arrière tendue vers le haut et poser les mains en tournant les épaules dans l’axe du déplacement', 'Pousser très fort dans les épaules', 'Assembler les jambes tendues pour rebondir et faire un saut en extension'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Sursaut, Rondade saut en extension', anim: 'rondade-saut', seulementDiff: true,
            consignes: ['1 pas avant le sursaut'],
            materiel: ['Praticable'],
          },
        ],
      },
    ],
  },
  {
    id: 'salto-avant', titre: 'Tourner en avant sans appui des mains', element: 'Salto avant', couleur: '#ef4444',
    niveaux: [
      {
        niv: 'A', nom: 'Roulade avant élevée avec mini-trampoline', anim: 'roulade-elevee-trampo',
        criteres: ['J’amortis avec mes bras', 'Contact de la nuque sur le tapis', 'J’arrive assis, dans l’axe'],
        consignes: ['Élan réduit (1 à 2 pas) et impulsion à 2 pieds, dos arrondi, bras levés', 'Poser les mains sur le tapis, derrière un repère visuel', 'Amortir avec les bras parallèles et rentrer la tête (menton / poitrine)'],
        materiel: ['5 tapis de réception empilés + 1 sur le côté', 'Mini-trampoline', '1 grande caisse en bois'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'B', nom: 'Salto avant avec mini-trampoline, réception assis', anim: 'salto-avant-assis',
        criteres: ['Pose des mains tolérées', 'Rotation dans l’axe, mains sur les genoux', 'Réception sur les fesses'],
        consignes: ['Élan réduit (1 à 2 pas) et impulsion à 2 pieds, dos arrondi, bras levés', 'Grouper en attrapant les genoux légèrement écartés, tête rentrée (menton / poitrine)'],
        materiel: ['5 tapis de réception empilés + 1 sur le côté', 'Mini-trampoline', '1 grande caisse en bois'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'C', nom: 'Salto avant avec mini-trampoline, réception debout', anim: 'salto-avant-trampo',
        criteres: ['Rotation dans l’axe, mains sur les genoux', 'Réception debout contrôlée (1 pas maxi)'],
        consignes: ['Élan réduit (1 à 2 pas) et impulsion à 2 pieds, jambes tendues, dos arrondi, bras levés (« se grandir »)', 'Monter et grouper vite en attrapant les genoux, tête rentrée (menton / poitrine)'],
        materiel: ['5 tapis de réception empilés + 1 sur le côté', 'Mini-trampoline', '1 grande caisse en bois'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'D', nom: 'Salto avant avec tremplin, réception debout', anim: 'salto-avant-tremplin',
        criteres: ['Rotation dans l’axe, mains sur les genoux', 'Réception debout contrôlée (1 pas maxi)'],
        consignes: ['3 pas d’élan, impulsion à 2 pieds, jambes tendues, dos arrondi, bras levés (« se grandir »)', 'Monter et grouper vite en attrapant les genoux, tête rentrée (menton / poitrine)', 'Dégrouper pour se réceptionner debout'],
        materiel: ['2 tapis de réception', '1 sur-tapis de réception', '1 tremplin'],
        parade: false,
        remediations: [
          {
            nom: 'Salto avant avec tremplin, réception debout', anim: 'salto-avant-tremplin', seulementDiff: true,
            consignes: ['Appel long et rasant par-dessus le repère visuel avant le tremplin'],
            materiel: ['2 tapis de réception', '1 sur-tapis de réception', '1 tremplin', '1 repère visuel au sol'],
          },
          {
            nom: 'Salto avant avec tremplin, réception debout', anim: 'salto-avant-tremplin',
            consignes: ['3 pas d’élan, appel long et rasant, impulsion à 2 pieds, jambes tendues, dos arrondi, bras levés (« se grandir »)', 'Monter et grouper vite en attrapant les genoux, tête rentrée (menton / poitrine)', 'Dégrouper pour se réceptionner debout'],
            materiel: ['2 tapis de réception', '1 sur-tapis de réception', '1 tremplin'],
          },
        ],
      },
      {
        niv: 'E', nom: 'Salto avant au sol, réception debout', anim: 'salto-avant',
        criteres: ['Rotation dans l’axe, mains sur les genoux', 'Réception debout contrôlée (1 pas maxi)'],
        consignes: ['3 pas d’élan, impulsion à 2 pieds, jambes tendues, dos arrondi, bras levés (« se grandir »)', 'Monter et grouper vite en attrapant les genoux, tête rentrée (menton / poitrine)', 'Dégrouper pour se réceptionner debout'],
        materiel: ['Praticable'],
        parade: false,
        remediations: [
          {
            nom: 'Salto avant au sol', anim: 'salto-avant', seulementDiff: true,
            consignes: ['Se réceptionner debout sur le sur-tapis pour amortir la réception'],
            materiel: ['Praticable', '1 sur-tapis de réception'],
          },
          {
            nom: 'Salto avant au sol', anim: 'salto-avant',
            consignes: ['Appel long et rasant par-dessus le repère visuel', 'Se réceptionner debout sur les tapis pour amortir la réception'],
            materiel: ['2 tapis de réception', '1 sur-tapis de réception', '1 repère visuel au sol'],
          },
        ],
      },
    ],
  },
  {
    id: 'flip', titre: 'Tourner en arrière avec passage en ATR', element: 'Flip arrière', couleur: '#ec4899',
    niveaux: [
      {
        niv: 'A', nom: 'Tomber à plat dos vers l’arrière', anim: 'tomber-dos',
        criteres: ['Je ne tourne pas la tête sur le côté', 'Je reste droit et gainé (tout mon corps touche le sol en même temps)'],
        consignes: ['Départ debout, bras croisés ou le long du corps, regard vers l’avant', 'Laisser tomber les épaules en arrière en gardant le corps gainé (jambes, dos, tête alignés)'],
        materiel: ['1 tapis de réception', '1 sur-tapis de réception', '1 tremplin'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'B', nom: 'Impulsion des jambes et lancer des bras vers l’arrière', anim: 'lancer-arriere',
        criteres: ['Je reste dans l’axe', 'Je me réceptionne corps aligné, bras tendus derrière la tête'],
        consignes: ['Départ debout, dos arrondi, bras vers le bas, regard vers le bas', 'Se déséquilibrer vers l’arrière et pousser très fort dans les jambes en lançant les bras tendus vers l’arrière', 'Se réceptionner sur le dos en extension complète, corps gainé (jambes, dos et bras alignés)'],
        materiel: ['Fosse de réception'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'C', nom: 'ATR tomber à plat ventre', anim: 'atr-plat-ventre',
        criteres: ['Passage en ATR', 'Tout le corps touche le sol en même temps'],
        consignes: ['Départ allongé sur le dos, descendre doucement vers l’arrière pour poser les mains à plat au sol', 'Se placer en ATR avec l’aide d’un pied sur le support en mousse', 'Regarder les mains au sol et « se grandir »', 'Tomber à plat ventre, corps gainé et aligné'],
        materiel: ['1 tapis de réception', '1 sur-tapis de réception', 'Table de saut en mousse'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'D', nom: 'Flip arrière', anim: 'flip',
        criteres: ['Je reste dans l’axe', 'Je passe par l’ATR (corps en extension)'],
        consignes: ['Départ debout, dos arrondi, bras vers le bas, regard vers le bas', 'Se déséquilibrer vers l’arrière et pousser fort dans les jambes en lançant les bras tendus vers l’arrière', 'Pousser fort dans les épaules au passage en ATR pour se redresser'],
        materiel: ['Praticable'],
        parade: true,
        remediations: [
          {
            nom: 'Flip arrière sur trampoline', anim: 'flip',
            consignes: ['Départ debout, dos arrondi, bras vers le bas, regard vers le bas', 'Se déséquilibrer vers l’arrière et pousser fort dans les jambes en lançant les bras tendus vers l’arrière', 'Pousser fort dans les épaules au passage en ATR pour se redresser'],
            materiel: ['Piste acro-tramp'],
          },
        ],
      },
      {
        niv: 'E', nom: 'Sursaut, rondade, flip, saut en extension', anim: 'rondade-flip',
        criteres: ['Je reste dans l’axe', 'Pas d’arrêt entre la rondade, le flip et le saut en extension'],
        consignes: ['1 à 3 pas d’élan, grand sursaut et grande fente avant', 'Rondade : pousser fort dans les épaules au passage en ATR pour se redresser en déséquilibre arrière et enchaîner le flip', 'Flip : pousser fort dans les épaules au passage en ATR pour se redresser et enchaîner le saut en extension'],
        materiel: ['Praticable'],
        parade: true,
        remediations: [
          {
            nom: 'Rondade, flip, saut en extension', anim: 'rondade-flip', seulementDiff: true,
            consignes: ['Poser les mains sur le sur-tapis à la rondade'],
            materiel: ['Praticable', 'Sur-tapis de réception'],
          },
          {
            nom: 'Sursaut, rondade, tomber dos', anim: 'rondade-tomber-dos',
            consignes: ['Grand sursaut et grande fente avant', 'Rondade dans l’axe du déplacement (tourner les épaules et regarder l’endroit où les mains se posent au sol jusqu’à l’arrivée sur les pieds)', 'Pousser fort dans les épaules au passage en ATR pour se redresser', 'Arriver jambes tendues en déséquilibre arrière pour rebondir vers l’arrière'],
            materiel: ['Fosse de réception'],
          },
          {
            nom: 'Sursaut, rondade, tomber dos', anim: 'rondade-tomber-dos',
            consignes: ['Grand sursaut et grande fente avant', 'Rondade dans l’axe du déplacement (tourner les épaules et regarder le mini-trampoline jusqu’à l’arrivée sur les pieds)', 'Pousser fort dans les épaules au passage en ATR pour se redresser', 'Arriver jambes tendues en déséquilibre arrière pour rebondir vers l’arrière'],
            materiel: ['2 Tapis de réception', '1 sur-tapis de réception', 'Fosse de réception', 'Mini-trampoline', '2 petites caisses en bois et leur chapeau'],
          },
        ],
      },
    ],
  },
  {
    id: 'salto-arriere', titre: 'Tourner en arrière sans appui des mains', element: 'Salto arrière', couleur: '#3b82f6',
    niveaux: [
      {
        niv: 'A', nom: 'Roulade arrière en contre-bas', anim: 'roulade-arriere-contrebas',
        criteres: ['Rouler dans l’axe, mains sous les genoux', 'Réception contrôlée sur les 2 pieds'],
        consignes: ['Départ allongé sur le dos sur le bloc en mousse, tête rentrée (seule la tête n’est pas en contact avec le bloc : menton / poitrine)', 'Monter et attraper les genoux vers la poitrine', 'Rouler en arrière et se réceptionner sur les pieds en lâchant les genoux'],
        materiel: ['Tapis de réception', 'Bloc en mousse rectangulaire type « Dima 6 »'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'B', nom: 'Roulade arrière sur plan incliné avec trampoline', anim: 'saut-arriere-plan',
        criteres: ['Je tourne dans l’axe', 'Je me réceptionne sur le haut du dos avant de rouler'],
        consignes: ['Départ debout, bras alignés avec le dos', 'Saut en extension en léger déséquilibre vers l’arrière (lancer des bras tendus synchronisé à l’impulsion des jambes)', 'Arriver sur le dos sur le plan incliné', 'Monter et attraper les genoux vers la poitrine pour rouler en arrière'],
        materiel: ['2 tapis de réception sur grosse fosse de réception', 'Bloc en mousse triangulaire', 'Piste acro-tramp'],
        parade: false,
        remediations: [],
      },
      {
        niv: 'C', nom: 'Salto arrière avec trampoline', anim: 'salto-arriere-trampo',
        criteres: ['Je tourne dans l’axe', 'Je me réceptionne sur les pieds'],
        consignes: ['Départ debout, bras alignés avec le dos', 'Saut en extension en léger déséquilibre arrière', 'Monter et attraper les genoux vers la poitrine', 'Dégrouper pour se réceptionner debout'],
        materiel: ['Piste acro-tramp'],
        parade: true,
        remediations: [
          {
            nom: 'Salto arrière avec trampoline', anim: 'salto-arriere-trampo',
            consignes: ['Départ debout, bras alignés avec le dos', 'Saut en extension en léger déséquilibre arrière', 'Monter et attraper les genoux vers la poitrine', 'Dégrouper pour se réceptionner debout'],
            materiel: ['1 tapis de réception sur grosse fosse de réception', 'Piste acro-tramp'],
          },
          {
            nom: 'Salto arrière avec trampoline', anim: 'salto-arriere-trampo',
            consignes: ['Départ debout, bras alignés avec le dos', 'Saut en extension en léger déséquilibre arrière', 'Monter et attraper les genoux vers la poitrine', 'Dégrouper pour se réceptionner à 4 pattes'],
            materiel: ['2 tapis de réception sur grosse fosse de réception', 'Piste acro-tramp'],
          },
        ],
      },
      {
        niv: 'D', nom: 'Salto arrière avec tremplin', anim: 'salto-arriere-tremplin',
        criteres: ['Je tourne dans l’axe', 'Réception debout contrôlée'],
        consignes: ['Départ debout, bras alignés avec le dos', 'Grand saut en extension en léger déséquilibre arrière', 'Monter et attraper les genoux vers la poitrine', 'Dégrouper pour se réceptionner debout'],
        materiel: ['2 tapis de réception', '1 sur-tapis', 'Tremplin'],
        parade: true,
        remediations: [],
      },
      {
        niv: 'E', nom: 'Salto arrière', anim: 'salto-arriere',
        criteres: ['Je tourne dans l’axe', 'Réception debout contrôlée'],
        consignes: ['Départ debout, bras alignés avec le dos', 'Grand saut en extension en léger déséquilibre arrière', 'Monter et attraper les genoux vers la poitrine', 'Dégrouper pour se réceptionner debout'],
        materiel: ['Praticable'],
        parade: true,
        remediations: [],
      },
      {
        niv: 'F', nom: 'Rondade salto arrière au sol', anim: 'rondade-salto',
        criteres: ['Rondade et salto arrière dans l’axe', 'Réception debout contrôlée'],
        consignes: ['3 pas d’élan et grand sursaut', 'Rondade dans l’axe du déplacement (tourner les épaules et regarder l’endroit où les mains se posent au sol)', 'Pousser fort dans les épaules pour se redresser, bras vers le haut', 'Rebondir jambes tendues', 'Monter et attraper les genoux vers la poitrine'],
        materiel: ['Praticable'],
        parade: true,
        remediations: [
          {
            nom: 'Rondade salto arrière sur tapis', anim: 'rondade-salto',
            consignes: ['3 pas d’élan et grand sursaut', 'Rondade dans l’axe du déplacement (tourner les épaules et regarder l’endroit où les mains se posent au sol)', 'Pousser fort dans les épaules pour se redresser, bras vers le haut', 'Rebondir jambes tendues', 'Monter et attraper les genoux vers la poitrine'],
            materiel: ['Praticable', '3 à 4 tapis de réception'],
          },
          {
            nom: 'Rondade, saut extension, roulade arrière sur tapis', anim: 'rondade-saut',
            consignes: ['1 à 3 pas d’élan et grand sursaut', 'Rondade dans l’axe du déplacement (tourner les épaules et regarder le repère visuel au sol)', 'Pousser fort dans les épaules pour se redresser, bras vers le haut', 'Rebondir jambes tendues pour monter et arriver sur le dos sur le plan incliné'],
            materiel: ['3 tapis de réception', 'Bloc triangulaire', 'Repère visuel au sol'],
          },
        ],
      },
    ],
  },
];

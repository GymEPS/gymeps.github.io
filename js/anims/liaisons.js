// Famille des LIAISONS et éléments CHORÉGRAPHIQUES.
import { K, KW, chain, hold } from './pose.js';
import { ST, ST_UP, HANDS, ALL4, finish } from './blocks.js';

const RELEVE = { an: 38, ff: 0 }; // sur demi-pointes
const SIDE = { ar: 90, fa: 90, sha: 86 };

export const grandBattement = () => ({
  keys: [
    KW(0, { ...ST, ...SIDE }, { label: 'Debout, bras écartés' }),
    KW(0.45, { ...ST, ...SIDE, thR: 112, snR: 112, anR: 55, fR: 0 }, { label: 'Lancer la jambe tendue au-dessus de l’horizontale' }),
    KW(0.9, { ...ST, ...SIDE }, { label: 'Redescendre en contrôlant' }),
    KW(1.4, { ...ST, ...SIDE, thL: 112, snL: 112, anL: 55, fL: 0 }, { label: 'Puis l’autre jambe' }),
    KW(1.85, { ...ST, ...SIDE }),
    KW(2.3, { ...ST_UP }),
  ],
  thumb: 0.45,
});

export const demiTourPointes = () => ({
  keys: [
    KW(0, { ...ST, ...SIDE }, { label: 'Debout, bras écartés' }),
    KW(0.4, { ...ST, ...SIDE, ...RELEVE }, { label: 'Monter sur demi-pointes' }),
    KW(1.2, { ...ST, ar: 175, fa: 175, sha: 10, ...RELEVE, yaw: 180 }, { label: 'Demi-tour sur demi-pointes, corps gainé' }),
    KW(1.6, { ...ST, ...SIDE, ...RELEVE, yaw: 180 }),
    KW(2.0, { ...ST, ...SIDE, yaw: 180 }, { label: 'Reposer les talons' }),
  ],
  thumb: 0.9,
});

export const pasChasses = () => {
  const k = [KW(0, { ...ST, ...SIDE }, { label: 'Debout, bras écartés sur le côté' })];
  let t = 0;
  for (let i = 0; i < 2; i++) {
    k.push(KW(t + 0.3, { ...ST, ...SIDE, thL: 35, snL: 20, thR: -10, snR: -10, fL: 0.3, anL: 20 }, { label: i === 0 ? 'Pas en avant' : undefined }));
    k.push(KW(t + 0.45, { ...ST, ...SIDE, lean: 4, thL: 10, snL: 10, thR: -10, snR: -10, an: 50, ff: 0 }, { label: i === 0 ? 'Chassé : le pied arrière rejoint l’autre en l’air' : undefined, fly: 0.3 }));
    k.push(KW(t + 0.62, { ...ST, ...SIDE, thL: 25, snL: 25, thR: -5, snR: -5, anL: 20, fL: 0, fR: 1 }, { land: true }));
    t += 0.62;
  }
  k.push(KW(t + 0.4, { ...ST, ...SIDE }));
  k.push(KW(t + 0.8, { ...ST_UP }));
  return { keys: k, thumb: 0.45 };
};

const PLANK = { lean: 74, T: 74, th: -74, sn: -74, ar: 0, fa: 0, an: 0, ff: 0, hf: 1, wr: 85, nk: -10 };

export const ressortGroupe = () => ({
  keys: chain(
    [KW(0, PLANK, { label: 'Appui facial (planche), bras tendus', plant: ALL4 }),
      KW(0.35, { ...PLANK, lean: 96, T: 80, th: -40, sn: -100 }, { label: 'Temps de ressort : pousser des pieds', plant: HANDS }),
      KW(0.6, { lean: 85, T: 95, th: 50, sn: -60, ar: 4, fa: 4, an: 20, ff: 0.5, nk: -10 }, { label: 'Ramener les genoux groupés' }),
      KW(0.8, { lean: 40, T: 75, th: 88, sn: -25, ar: 18, fa: 18, an: 0, ff: 1 }, { label: 'Retour accroupi, pieds entre les mains', plant: ALL4 })],
    hold([KW(0, {})], 0.5),
    [KW(0, {}), KW(0.5, { ...ST, lean: 22, T: 42, th: 82, sn: -32, ar: 55, fa: 60, hf: 0, wr: 0 }, { plant: [] }), KW(1.0, { ...ST_UP }, { label: 'Se relever' })],
  ),
  thumb: 0.6,
});

export const ressortTendu = () => ({
  keys: chain(
    [KW(0, PLANK, { label: 'Appui facial, bras tendus', plant: ALL4 }),
      KW(0.35, { ...PLANK, lean: 110, T: 96, th: -50, sn: -50, an: 40 }, { label: 'Temps de ressort : bassin haut', plant: HANDS }),
      KW(0.65, { lean: 120, T: 112, th: 10, sn: 10, ar: 8, fa: 8, an: 10, ff: 0.6, nk: -10 }, { label: 'Jambes tendues tout au long' }),
      KW(0.85, { lean: 112, T: 118, th: 4, sn: 4, ar: 10, fa: 10, an: 0, ff: 1 }, { label: 'Pieds près des mains, jambes tendues', plant: ALL4 })],
    hold([KW(0, {})], 0.4),
    [KW(0, {}), KW(0.7, { ...ST_UP }, { label: 'Se redresser', plant: [] })],
  ),
  thumb: 0.6,
});

/** Demi-tour (ou tour complet) en appui : appui facial → appui dorsal (→ appui facial). */
export const tourAppui = (deg = 180) => {
  const plank = { lean: 74, sp: 0, nk: -10, hp: [0, 0, 0], kn: 0, an: 0, ff: 0, sh: [74, 6, 0], el: 0, hf: 1, wr: 85 };
  const k = [K(0, { ...plank, yaw: 0 }, { label: 'Appui facial : corps tendu, bras tendus', plant: HANDS, slide: true })];
  const steps = [
    [90, { shR: [0, 88, 0], shL: [0, 100, 0], hR: 1, hL: 0 }, ['handR'], 'Lever une main et tourner, corps gainé'],
    [180, { sh: [-74, 6, 0], hf: 1, nk: 10 }, HANDS, 'Appui dorsal : bras tendus, bassin haut'],
    [270, { shL: [0, 88, 0], shR: [0, 100, 0], hL: 1, hR: 0, nk: -10 }, ['handL'], 'Tourner sur l’autre main'],
    [360, { sh: [74, 6, 0], hf: 1, nk: -10 }, HANDS, 'Retour en appui facial'],
  ];
  let t = 0.3;
  for (const [y, p, plant, label] of steps) {
    if (y > deg) break;
    t += 0.55;
    k.push(K(t, { ...plank, ...p, yaw: y }, { plant, label }));
    if (y % 180 === 0) { t += 0.5; k.push(K(t, {}, {})); }
  }
  return { keys: k, thumb: 0.85 };
};

export const tourEnveloppe = () => ({
  keys: [
    KW(0, { ...ST, ...SIDE }, { label: 'Debout, bras écartés' }),
    KW(0.35, { ...ST, ...SIDE, thL: 20, snL: -10, fL: 1, fR: 0.4, anR: 20 }, { label: 'Pied d’élan à côté' }),
    KW(0.7, { ...ST, ar: 70, fa: 110, sha: 20, ...RELEVE, thR: 0, snR: 0, yaw: 120 }, { label: 'Monter sur demi-pointes, bras placés (enveloppés)' }),
    KW(1.2, { ...ST, ar: 70, fa: 110, sha: 20, ...RELEVE, yaw: 300 }),
    KW(1.5, { ...ST, ...SIDE, ...RELEVE, yaw: 360 }, { label: 'Finir le tour gainé' }),
    KW(1.9, { ...ST, ...SIDE, yaw: 360 }),
  ],
  thumb: 0.9,
});

/** Demi-tour (½) ou tour (1/1) sur un pied, jambe libre fixe (retirée), puis retour devant. */
export const tourPied = (deg = 180) => ({
  keys: [
    KW(0, { ...ST, ...SIDE }, { label: 'Debout, bras écartés' }),
    KW(0.4, { ...ST, ...SIDE, thL: 25, snL: -15, fR: 0.3, anR: 20 }, { label: 'Préparation, genou fléchi' }),
    KW(0.75, { ...ST, ar: 175, fa: 175, sha: 8, anL: 40, fL: 0, thR: 80, snR: -60, hpaR: 40, anR: 55, fR: 0, yaw: deg * 0.25 }, { label: 'Monter sur demi-pointe, jambe libre fixe' }),
    KW(0.75 + deg / 300, { ...ST, ar: 175, fa: 175, sha: 8, anL: 40, fL: 0, thR: 80, snR: -60, hpaR: 40, anR: 55, fR: 0, yaw: deg }),
    KW(1.15 + deg / 300, { ...ST, ...SIDE, anL: 30, fL: 0, thR: 30, snR: 30, anR: 50, fR: 0, yaw: deg }, { label: 'Ramener la jambe libre devant' }),
    KW(1.6 + deg / 300, { ...ST, ...SIDE, yaw: deg }),
  ],
  thumb: 0.95,
});

/** Cercles d'une jambe : accroupi sur une jambe, jambe libre tendue qui balaie le sol (n tours). */
export const cerclesJambe = (n = 2) => {
  const k = [KW(0, { ...ST, lean: 30, T: 50, thL: 90, snL: -35, thR: 20, snR: 20, hpaR: 80, an: 0, ar: 20, fa: 20, hf: 1, wr: 80 }, { label: 'Accroupi sur une jambe, jambe libre tendue sur le côté', plant: ['footL', 'handR', 'handL'] })];
  let t = 0;
  for (let i = 0; i < n; i++) {
    const steps = [[-100, 20, 70], [0, 60, 10], [100, 90, 60], [180, 90, 80]];
    for (const [yawLeg, flex, abd] of steps) {
      t += 0.22;
      const liftR = yawLeg === 0 ? ['footL', 'handL'] : yawLeg === 100 ? ['footL', 'handR'] : ['footL', 'handR', 'handL'];
      k.push(K(t, { hpR: [flex, abd, yawLeg / 3], knR: 0, anR: 50, fR: 0 }, { plant: liftR, label: i === 0 && yawLeg === 0 ? 'La jambe tendue passe sous les mains (on lève une main)' : undefined }));
    }
  }
  k.push(KW(t + 0.3, { ...ST, lean: 30, T: 50, thL: 90, snL: -35, thR: 20, snR: 20, hpaR: 80, ar: 20, fa: 20 }, { plant: ['footL', 'handR', 'handL'] }));
  k.push(KW(t + 0.9, { ...ST_UP }, { plant: [], label: 'Se relever' }));
  return { keys: k, thumb: 0.66 };
};

/** Cercle des jambes serrées : en appui sur les MAINS seulement, fesses décollées, pieds en l'air (demande de Gabin) ;
 * les jambes font le tour : appui facial → passage sous une main levée → appui dorsal (bassin haut) → sous l'autre main → appui facial. */
export const cercleJambes = (lv = 0.86) => {
  const LV = lv * 100;
  const sup = { lean: LV, sp: 0, nk: -10, hp: [14, 0, 0], kn: 0, an: 40, ff: 0, sh: [LV, 6, 0], el: 0, hf: 1, wr: 85 };
  const k = [K(0, { ...sup, yaw: 0 }, { label: 'Appui sur les mains, fesses et pieds décollés, jambes serrées tendues', plant: HANDS })];
  const steps = [
    [90, { shR: [0, 88, 0], shL: [0, 100, 0], hR: 1, hL: 0 }, ['handR'], 'Lancer les jambes sur le côté : lever une main pour les laisser passer'],
    [180, { sh: [-LV, 6, 0], hp: [-14, 0, 0], hf: 1, nk: 10 }, HANDS, 'Appui dorsal : bras tendus, bassin haut'],
    [270, { shL: [0, 88, 0], shR: [0, 100, 0], hL: 1, hR: 0, nk: -10 }, ['handL'], 'Les jambes passent sous l’autre main'],
    [360, { sh: [LV, 6, 0], hf: 1, nk: -10 }, HANDS, 'Retour en appui facial : le cercle est fini'],
  ];
  let t = 0.35;
  for (const [y, p, plant, label] of steps) { t += 0.45; k.push(K(t, { ...sup, ...p, yaw: y }, { plant, label })); }
  k.push(K(t + 0.5, {}, {}));
  return { keys: k, thumb: 1.1 };
};

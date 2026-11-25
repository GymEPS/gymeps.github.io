// Famille des ROULEMENTS (et variantes des progressions « Rouler en avant / en arrière »).
// Pendant les roulés, on écrit les angles RELATIFS (K) : c'est la physique (point d'appui qui ne glisse pas) qui fait avancer le corps.
import { K, KW, chain } from './pose.js';
import { ST, ST_UP, HANDS, ALL4, finish } from './blocks.js';

export const PLAN_AV = { k: 'wedge', x0: -0.55, x1: 1.35, z0: -0.5, z1: 0.5, h0: 0.36, h1: 0.03, color: '#0ea5e9' };
export const PLAN_AR = { k: 'wedge', x0: -1.6, x1: 0.45, z0: -0.5, z1: 0.5, h0: 0.03, h1: 0.36, color: '#0ea5e9' };

/** Roulade avant. legs : 'groupe' | 'ecart' | 'tendu' (carpé). */
export function rouladeAvant({ legs = 'groupe', props } = {}) {
  const ecart = legs === 'ecart', tendu = legs === 'tendu';
  const hpa = ecart ? 44 : 3;
  const keys = [
    K(0, { sp: 0, nk: 0, sh: [176, 8, 0], el: 0, wr: 0, hp: [0, 0, 0], kn: 0, an: 0, ff: 1, hf: 0, lean: 0 }, { label: 'Départ debout, bras en haut' }),
    K(0.55, { lean: 25, sp: 25, hp: [105, 4, 0], kn: 118, sh: [80, 8, 0], el: 0, wr: 70 }, { label: 'Poser les mains loin devant, à plat' }),
    K(0.9, { lean: 58, sp: 40, nk: 38, hp: [112, 4, 0], kn: 88, sh: [98, 8, 0], hf: 1, wr: 80 }, { label: 'Pousser sur les jambes, menton sur la poitrine', plant: ALL4 }),
    K(1.22, { lean: 112, sp: 55, nk: 48, hp: [tendu || ecart ? 92 : 80, ecart ? 8 : 3, 0], kn: tendu || ecart ? 10 : 40, an: 30, ff: 0, sh: [150, 10, 0], el: 95 }, { label: 'Amortir avec les bras, nuque au sol', plant: HANDS }),
  ];
  if (legs === 'groupe') {
    keys.push(
      K(1.55, { lean: 196, sp: 60, nk: 42, hp: [130, 4, 0], kn: 142, an: 35, sh: [70, 10, 0], el: 35, hf: 0, wr: 0 }, { label: 'Rouler groupé, dos rond', plant: [] }),
      K(1.92, { lean: 298, sp: 52, nk: 30, hp: [128, 4, 0], kn: 140, an: 10, ff: 0.6, sh: [100, 8, 0], el: 10 }),
      K(2.22, { lean: 342, sp: 42, nk: 10, hp: [106, 4, 0], kn: 122, an: 0, ff: 1, sh: [125, 8, 0], el: 0 }, { label: 'Se relever sans les mains' }),
      K(2.75, { sp: 0, nk: 0, sh: [176, 8, 0], el: 0, hp: [0, 0, 0], kn: 0, lean: 360 }, { label: 'Finir debout, bras en haut' }),
    );
  } else {
    keys.push(
      K(1.55, { lean: 196, sp: 62, nk: 42, hp: [tendu ? 138 : 126, tendu ? 3 : 12, 0], kn: 0, an: 55, sh: [60, 10, 0], el: 20, hf: 0, wr: 0 }, { label: tendu ? 'Jambes tendues et serrées' : 'Jambes serrées… écarter au dernier moment', plant: [] }),
      KW(1.9, { lean: 318, T: 375, th: 92, sn: 92, hpa, an: 50, ff: 0, ar: tendu ? -5 : 40, fa: tendu ? -5 : 40, sha: tendu ? 14 : 4, wr: 85, hf: 0.5, nk: 25 }, { label: ecart ? 'Poser les mains entre les jambes' : 'Mains près des hanches, pousser fort et longtemps' }),
      KW(2.15, { lean: 345, T: 410, th: 60, sn: 60, hpa, an: 10, ff: 1, ar: tendu ? -10 : 20, fa: tendu ? -10 : 20, hf: 1, nk: 15 }, { plant: HANDS }),
      KW(2.45, { lean: 378, T: 442, th: 8, sn: 8, hpa: ecart ? 36 : 3, an: 0, ff: 1, ar: 15, fa: 15, hf: 0.3, wr: 40, nk: 5 }, { label: 'Se redresser jambes tendues', plant: [] }),
      KW(2.95, { ...ST_UP, lean: 360, T: 360, hpa: ecart ? 36 : 0 }),
      KW(3.35, { ...ST_UP, lean: 360, T: 360 }, { label: 'Finir debout, bras en haut' }),
    );
  }
  return { keys, props, thumb: 1.45 };
}

/** Roulade avant en partant allongé·e sur le ventre sur un bloc (amortir avec les bras, poser la nuque). */
export const rouladeAvantBloc = () => ({
  props: [{ k: 'box', x0: -1.8, x1: -0.2, z0: -0.4, z1: 0.4, h: 0.5, color: '#0ea5e9' }, { k: 'box', x0: -0.2, x1: 2.2, z0: -0.7, z1: 0.7, h: 0.1, color: '#2563eb' }],
  keys: [
    K(0, { lean: 90, sp: 0, nk: -10, hp: [0, 0, 0], kn: 0, an: 50, ff: 0, sh: [130, 8, 0], el: 0, wr: 60, x: -0.75 }, { label: 'Allongé·e sur le ventre sur le bloc' }),
    K(0.5, { lean: 100, sp: 25, nk: 20, sh: [150, 8, 0], el: 20, wr: 80, hf: 1 }, { label: 'Poser les mains à plat au sol', plant: HANDS }),
    K(0.95, { lean: 128, sp: 50, nk: 50, sh: [160, 10, 0], el: 110, hp: [20, 0, 0] }, { label: 'Amortir bras parallèles, poser la nuque, dos rond' }),
    K(1.35, { lean: 200, sp: 60, nk: 40, hp: [110, 0, 0], kn: 20, sh: [80, 10, 0], el: 30, hf: 0, wr: 0 }, { plant: [], label: 'Rouler' }),
    K(1.7, { lean: 290, sp: 55, nk: 30, hp: [125, 0, 0], kn: 140, an: 10, ff: 0.5, sh: [100, 8, 0], el: 10 }, { label: 'Fléchir les jambes le plus tard possible' }),
    K(2.0, { lean: 340, sp: 42, nk: 10, hp: [106, 4, 0], kn: 122, an: 0, ff: 1, sh: [125, 8, 0], el: 0 }, { label: 'Se relever' }),
    K(2.5, { lean: 360, sp: 0, nk: 0, hp: [0, 0, 0], kn: 0, sh: [176, 8, 0] }),
  ],
  thumb: 1.2,
});

/** Se redresser jambes écartées (départ allongé, jambes verticales) – remédiation. */
export const redresseEcart = () => ({
  keys: [
    KW(0, { ...ST, lean: -180, T: -90, th: 180, sn: 180, an: 55, ff: 0, ar: 90, fa: 90, sha: 10 }, { label: 'Allongé·e sur le dos, jambes tendues à la verticale' }),
    KW(0.6, { lean: -170, T: -80, th: 150, sn: 150, hpa: 20, ar: 60, fa: 60 }, { label: 'Descendre les jambes en les écartant' }),
    KW(1.0, { lean: -40, T: 15, th: 92, sn: 92, hpa: 44, ar: 40, fa: 40, wr: 85, hf: 0.5, nk: 25 }, { label: 'Pousser sur les mains entre les jambes' }),
    KW(1.3, { lean: -15, T: 50, th: 60, sn: 60, hpa: 44, an: 10, ff: 1, ar: 20, fa: 20, hf: 1 }, { plant: HANDS }),
    KW(1.65, { lean: 18, T: 82, th: 8, sn: 8, hpa: 36, ff: 1, ar: 15, fa: 15, hf: 0.3, nk: 5 }, { label: 'Se redresser jambes tendues', plant: [] }),
    KW(2.15, { ...ST_UP, hpa: 34 }),
    KW(2.55, { ...ST_UP }),
  ],
  thumb: 1.3,
});

/**
 * Roulade arrière. legs : 'groupe' | 'ecart' | 'tendu' (carpé) ; arms : 'plies' (mains aux épaules) | 'tendus' ;
 * atr : finir en ATR.
 */
export function rouladeArriere({ legs = 'groupe', arms = 'plies', atr = false, props, start = 'accroupi' } = {}) {
  const tendu = legs === 'tendu' || legs === 'ecart' || atr;
  const ecart = legs === 'ecart';
  const armsT = arms === 'tendus';
  const shA = armsT ? [176, 10, 0] : [150, 12, 0];
  const elA = armsT ? 0 : 150;
  const keys = [
    K(0, { lean: 0, sp: 0, nk: 0, hp: [0, 0, 0], kn: 0, an: 0, ff: 1, hf: 0, sh: [90, 8, 0], el: 0, wr: 0 }, { label: 'Départ debout, dos au tapis' }),
    K(0.5, { lean: 18, sp: 26, nk: 10, hp: [tendu ? 70 : 110, 3, 0], kn: tendu ? 20 : 125, sh: shA, el: elA, wr: 60 }, { label: armsT ? 'Bras tendus à hauteur des oreilles' : 'Mains tournées vers les épaules, coudes levés' }),
    K(0.85, { lean: -28, sp: 45, nk: 40, hp: [tendu ? 100 : 118, 3, 0], kn: tendu ? 0 : 122, ff: 0.5 }, { label: 'S’asseoir loin derrière, menton sur la poitrine' }),
    K(1.15, { lean: -112, sp: 55, hp: [tendu ? 130 : 128, 3, 0], kn: tendu ? 0 : 136, an: 40, ff: 0, hf: 0.5 }, { label: tendu ? 'Lancer les jambes tendues vers l’arrière' : 'Rouler sur le dos, bien groupé' }),
    K(1.42, { lean: -168, sp: 58, hp: [tendu ? 140 : 132, ecart ? 15 : 3, 0], kn: tendu ? 0 : 140, sh: armsT ? [178, 12, 0] : [168, 12, 0], el: armsT ? 0 : 135, hf: 1, wr: 80 }, { label: 'Mains à plat, pousser fort', plant: HANDS }),
  ];
  if (atr) {
    keys.push(
      K(1.75, { lean: -195, sp: 30, nk: 10, hp: [40, 0, 0], kn: 0, an: 55, sh: [176, 10, 0], el: armsT ? 0 : 60 }, { label: 'Lancer les jambes vers le plafond (chandelle)' }),
      K(2.05, { lean: -180, sp: 0, nk: -20, hp: [0, 0, 0], kn: 0, sh: [180, 8, 0], el: 0 }, { label: 'Pousser bras tendus jusqu’à l’ATR' }),
      K(2.5, { lean: -180, sp: 0, nk: -22 }, { label: 'ATR aligné' }),
      K(2.85, { lean: -212, sp: 6, hpR: [-35, 0, 0], hpL: [10, 0, 0] }, { label: 'Redescendre une jambe après l’autre' }),
      K(3.15, { lean: -280, sp: 20, nk: 0, hpR: [-25, 0, 0], hpL: [100, 0, 0], knL: 60, anL: 0, fL: 0.5 }),
      K(3.4, { lean: -340, sp: 15, hpR: [-20, 0, 0], hpL: [50, 0, 0], knL: 10, fL: 1, hf: 0, wr: 0, sh: [176, 8, 0] }, { plant: [] }),
      K(3.85, { lean: -360, sp: 0, hp: [0, 0, 0], kn: 0, an: 0, ff: 1, sh: [176, 8, 0], el: 0 }, { label: 'Finir debout' }),
    );
  } else if (tendu) {
    keys.push(
      K(1.72, { lean: -238, sp: 40, nk: 25, hp: [118, ecart ? 44 : 3, 0], kn: 0, an: 50, sh: [176, 12, 0], el: armsT ? 0 : 40 }, { label: ecart ? 'Écarter les jambes tendues' : 'Jambes tendues et serrées' }),
      K(1.98, { lean: -300, sp: 50, nk: 15, hp: [ecart ? 60 : 85, ecart ? 44 : 3, 0], kn: 0, an: 0, ff: 1, sh: [176, 10, 0], el: 0 }, { label: 'Réception pieds au sol, jambes tendues' }),
      K(2.2, { lean: -305, sp: 48, nk: 10, hf: 0, wr: 0 }, { plant: [] }),
      K(2.75, { lean: -360, sp: 0, nk: 0, hp: [0, ecart ? 30 : 0, 0], kn: 0, sh: [176, 8, 0] }, { label: 'Se redresser' }),
      K(3.15, { lean: -360, hp: [0, 0, 0] }, { label: 'Finir debout, bras en haut' }),
    );
  } else {
    keys.push(
      K(1.72, { lean: -238, sp: 50, hp: [112, 3, 0], kn: 92, an: 20, ff: 0.3, sh: [170, 10, 0], el: armsT ? 0 : 60 }, { label: 'Rester groupé, poser les pieds' }),
      K(1.98, { lean: -308, sp: 45, nk: 15, hp: [108, 3, 0], kn: 118, an: 0, ff: 1, sh: [150, 8, 0], el: 20 }, { label: 'Réception sur les pieds, accroupi', plant: ['footR', 'footL'] }),
      K(2.2, { lean: -335, sp: 32, nk: 5, hp: [100, 3, 0], kn: 118, sh: [110, 8, 0], el: 0, hf: 0, wr: 0 }, { plant: [] }),
      K(2.7, { lean: -360, sp: 0, nk: 0, hp: [0, 0, 0], kn: 0, sh: [176, 8, 0], el: 0 }, { label: 'Se relever, bras en haut' }),
    );
  }
  void start;
  return { keys, props, thumb: 1.42 };
}

/** Roulade arrière en contre-bas (départ allongé sur un bloc, sans les mains) – salto arrière A. */
export const rouladeArriereContrebas = () => ({
  props: [{ k: 'box', x0: -0.2, x1: 1.6, z0: -0.4, z1: 0.4, h: 0.5, color: '#0ea5e9' }, { k: 'box', x0: -2.2, x1: -0.2, z0: -0.7, z1: 0.7, h: 0.1, color: '#2563eb' }],
  keys: [
    K(0, { lean: -90, sp: 0, nk: 40, hp: [90, 0, 0], kn: 90, an: 0, ff: 1, sh: [20, 8, 0], el: 0, x: 0.55 }, { label: 'Allongé·e sur le dos sur le bloc, tête rentrée' }),
    K(0.6, { lean: -120, sp: 40, nk: 45, hp: [130, 0, 0], kn: 140, an: 30, ff: 0, sh: [60, 20, 0], el: 30 }, { label: 'Attraper les genoux vers la poitrine' }),
    K(1.0, { lean: -200, sp: 50, nk: 45, hp: [135, 0, 0], kn: 140, sh: [60, 20, 0], el: 30 }, { label: 'Rouler en arrière, mains sous les genoux' }),
    K(1.35, { lean: -300, sp: 40, nk: 20, hp: [120, 0, 0], kn: 130, an: 0, ff: 1, sh: [100, 10, 0], el: 0 }, { label: 'Lâcher les genoux, réception sur les pieds' }),
    K(1.8, { lean: -345, sp: 20, nk: 0, hp: [95, 0, 0], kn: 110, sh: [120, 8, 0] }),
    K(2.3, { lean: -360, sp: 0, hp: [0, 0, 0], kn: 0, sh: [176, 8, 0] }),
  ],
  thumb: 1.0,
});

export const rouladeAvantPlan = () => rouladeAvant({ props: [PLAN_AV] });
export const rouladeAvantEcartPlan = () => rouladeAvant({ legs: 'ecart', props: [PLAN_AV] });
export const rouladeArrierePlan = o => rouladeArriere({ ...o, props: [PLAN_AR] });
void chain; void finish; void ST;

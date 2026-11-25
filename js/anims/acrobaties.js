// Famille des ACROBATIES + éléments des progressions (roue, rondade, saut de mains, saltos, flip…).
// Angles RELATIFS (K) : ils restent justes quand le corps tourne sur lui-même (yaw), ce que demandent roue et rondade.
// lean = rotation dans le plan du déplacement (+ = vers l'avant, tête vers +X) ; yaw = tour autour de l'axe du corps.
import { K, chain } from './pose.js';
import { HANDS, ALL4, runHurdle } from './blocks.js';

const STAND_UP = { sp: 0, nk: 0, sh: [176, 10, 0], el: 0, wr: 0, hp: [0, 0, 0], kn: 0, an: 0, ff: 1, hf: 0, lean: 0, yaw: 0, roll: 0 };
const LUNGE = { ...STAND_UP, sp: 4, hpL: [52, 0, 0], knL: 60, hpR: [-24, 0, 0], knR: 0, anR: 25, fR: 0.5 };
const C = (t = 0) => K(t, {}); // « on continue » (raccord entre deux morceaux)

const start = (label = 'Départ debout, bras en haut') => [K(0, STAND_UP, { label }), K(0.45, LUNGE, { label: 'Grande fente avant, bras alignés avec le dos' })];
const lungeFromHurdle = () => [C(0), K(0.3, { ...LUNGE }, { label: 'Grande fente avant' })];

// ---------------------------------------------------------------- roue
/** Partie « renversée » d'une roue (de la fente à la réception pieds décalés). L = rotation déjà faite. */
function roueCore(L = 0, { second = false } = {}) {
  return [
    C(0),
    K(0.33, { lean: L + 48, yaw: -50, sp: 6, hpL: [35, 5, 0], knL: 45, fL: 1, hpR: [-35, 40, 0], knR: 0, anR: 50, fR: 0, sh: [176, 22, 0] }, { label: second ? 'Deuxième roue sans s’arrêter' : 'Lancer la jambe arrière, tourner les épaules dans l’axe' }),
    K(0.55, { lean: L + 96, yaw: -88, hpL: [14, 25, 0], knL: 15, hpR: [-5, 62, 0], sh: [176, 26, 0], hL: 1, wrL: 85 }, { label: 'Poser une main…', plant: ['handL', 'footL'] }),
    K(0.73, { lean: L + 138, yaw: -90, hpL: [0, 42, 0], knL: 0, anL: 45, fL: 0, hpR: [0, 50, 0], hR: 1, wrR: 85 }, { label: '… puis l’autre, bras tendus', plant: HANDS }),
    K(0.91, { lean: L + 182, hp: [0, 48, 0], sp: 0, nk: -15 }, { label: 'Passer à l’ATR jambes tendues écartées' }),
    K(1.11, { lean: L + 228, hpR: [0, 40, 0], hpL: [0, 52, 0] }, { label: 'Pousser sur un bras puis sur l’autre', plant: ['handR'] }),
    K(1.33, { lean: L + 282, hpR: [0, 30, 0], knR: 5, anR: 10, fR: 0.6, hpL: [0, 50, 0], hL: 0 }, { label: 'Réception un pied après l’autre', plant: ['footR'] }),
    K(1.53, { lean: L + 322, hpR: [0, 18, 0], hpL: [0, 38, 0], anL: 30, fL: 0.3, hR: 0, sh: [176, 30, 0], nk: 0 }, { plant: [] }),
    K(1.8, { lean: L + 360, hp: [0, 22, 0], kn: 0, an: 0, ff: 1, sh: [176, 32, 0] }, { label: 'Finir pieds décalés, bras en haut' }),
  ];
}
export const roue = ({ props } = {}) => ({ keys: chain(start(), roueCore(), [C(0), K(0.5, {})]), props, thumb: 1.36 });
export const roueDouble = () => ({
  keys: chain(start(), roueCore(), [C(0), K(0.25, { lean: 360, hpL: [30, 10, 0], knL: 30, hpR: [-10, 30, 0] }, { label: 'Se replacer en fente' })], roueCore(360, { second: true }), [C(0), K(0.5, {})]),
  thumb: 1.36,
});
export const sursautRoue = () => ({ keys: chain(runHurdle(1), lungeFromHurdle(), roueCore(), [C(0), K(0.5, {})]), thumb: 2.4 });

// ---------------------------------------------------------------- rondade
function rondadeCore(L = 0) {
  return [
    C(0),
    K(0.33, { lean: L + 50, yaw: -45, sp: 4, hpL: [35, 5, 0], knL: 45, fL: 1, hpR: [-40, 15, 0], knR: 0, anR: 50, fR: 0, sh: [176, 12, 0] }, { label: 'Lancer la jambe arrière tendue' }),
    K(0.53, { lean: L + 100, yaw: -78, hpL: [12, 10, 0], knL: 12, hpR: [-15, 25, 0], hL: 1, wrL: 85 }, { label: 'Poser les mains en tournant les épaules', plant: ['handL', 'footL'] }),
    K(0.7, { lean: L + 145, yaw: -115, hpL: [0, 18, 0], knL: 0, anL: 45, fL: 0, hpR: [0, 18, 0], hR: 1, wrR: 85 }, { plant: HANDS }),
    K(0.85, { lean: L + 180, yaw: -148, hp: [0, 2, 0], sp: -5, an: 55 }, { label: 'Assembler les jambes à la verticale' }),
    K(0.97, { lean: L + 214, yaw: -176, hp: [34, 2, 0], sp: 12, nk: 5, sh: [176, 8, 0] }, { label: 'Pousser fort dans les épaules, rentrer les pieds sous soi', plant: [], fly: 0.28 }),
    K(1.07, { lean: L + 272, yaw: -180, hp: [62, 2, 0], kn: 12, sp: 14, nk: 5, sh: [176, 8, 0], an: 30 }),
    K(1.17, { lean: L + 330, yaw: -180, hp: [40, 2, 0], kn: 35, an: 0, ff: 1, sp: 5, nk: 0, hf: 0, wr: 0, sh: [176, 8, 0] }, { label: 'Réception pieds joints, face au départ', land: true }),
  ];
}
const standAfter = (L, yaw) => [C(0), K(0.45, { ...STAND_UP, lean: L, yaw }, { label: 'Finir debout, bras en haut' })];
export const rondade = () => ({ keys: chain(start(), rondadeCore(), standAfter(360, -180)), thumb: 1.3 });
export const sursautRondade = () => ({ keys: chain(runHurdle(1), lungeFromHurdle(), rondadeCore(), standAfter(360, -180)), thumb: 2.3 });

/** Saut en extension en rebond (après une rondade : on recule dans le sens du déplacement). */
const rebondSaut = (L, yaw) => [
  C(0),
  K(0.12, { lean: L - 4, yaw, hp: [0, 0, 0], kn: 0, an: 50, ff: 0, sp: 0, sh: [178, 8, 0] }, { label: 'Rebondir jambes tendues : saut en extension', fly: 0.3 }),
  K(0.32, { lean: L, yaw, an: 55 }),
  K(0.52, { lean: L + 12, yaw, hp: [40, 0, 0], kn: 45, an: 0, ff: 1, sh: [120, 8, 0] }, { land: true, label: 'Réception amortie' }),
  K(0.95, { ...STAND_UP, lean: L, yaw }),
];
export const rondadeSaut = () => ({ keys: chain(runHurdle(1), lungeFromHurdle(), rondadeCore(), rebondSaut(360, -180)), thumb: 2.3 });
export const rondadeTrampo = () => ({
  props: [{ k: 'wedge', at: 'plant:handL', ref: 'wrL', dx: -0.25, x0: 0, x1: 0.95, z0: -0.45, z1: 0.45, h0: 0.22, h1: 0.4, color: '#1e293b' }],
  keys: chain(runHurdle(1), lungeFromHurdle(), rondadeCore(), standAfter(360, -180)),
  thumb: 2.3,
});

// ---------------------------------------------------------------- flip (sens : +1 = face à +X, -1 = face à -X)
function flipCore(L, s, yaw, { fromStand = true } = {}) {
  const r = a => L - s * a;
  const k = [C(0)];
  if (fromStand) {
    k.push(
      K(0.35, { lean: r(0), yaw, sp: 22, nk: 20, sh: [-15, 8, 0], hp: [22, 0, 0], kn: 18 }, { label: 'Dos arrondi, bras vers le bas, regard vers le bas' }),
      K(0.7, { lean: r(12), yaw, sp: 8, nk: 5, sh: [40, 8, 0], hp: [72, 0, 0], kn: 82, ff: 1 }, { label: 'Se déséquilibrer vers l’arrière (comme pour s’asseoir)' }),
    );
  }
  const t0 = fromStand ? 0.88 : 0.12;
  k.push(
    K(t0, { lean: r(42), yaw, sp: -18, nk: -20, sh: [195, 8, 0], hp: [-8, 0, 0], kn: 0, an: 50, ff: 0 }, { label: 'Pousser fort des jambes, lancer les bras tendus en arrière', fly: -s * 0.8 }),
    K(t0 + 0.22, { lean: r(152), yaw, sp: -24, nk: -25, sh: [186, 8, 0], hp: [-12, 0, 0], hf: 1, wr: 85 }, { label: 'Passage par l’ATR : mains au sol', land: true, plant: HANDS }),
    K(t0 + 0.34, { lean: r(186), yaw, sp: 0, nk: -10, hp: [18, 0, 0] }, { label: 'Pousser fort dans les épaules, repousser', plant: [], fly: -s * 0.45 }),
    K(t0 + 0.54, { lean: r(334), yaw, sp: 6, nk: 0, hp: [38, 0, 0], kn: 36, an: 0, ff: 1, hf: 0, wr: 0, sh: [176, 8, 0] }, { label: 'Réception debout, bras en haut', land: true }),
  );
  return k;
}
export const flip = () => ({ keys: chain([K(0, STAND_UP, { label: 'Départ debout' })], flipCore(0, 1, 0), [C(0), K(0.45, { ...STAND_UP, lean: -360 }, { label: 'Finir debout' })]), thumb: 1.1 });
export const rondadeFlip = () => ({
  keys: chain(runHurdle(1), lungeFromHurdle(), rondadeCore(), flipCore(360, -1, -180, { fromStand: false }), rebondSaut(720, -180)),
  thumb: 2.3,
});

/** Rondade puis tomber sur le dos (sur la fosse) – remédiation du flip. */
export const rondadeTomberDos = () => ({
  props: [{ k: 'box', at: 2.7, dx: 0.25, x0: 0, x1: 2.2, z0: -0.9, z1: 0.9, h: 0.5, color: '#1d4ed8' }],
  keys: chain(runHurdle(1), lungeFromHurdle(), rondadeCore(),
    [C(0), K(0.15, { lean: 356, yaw: -180, hp: [0, 0, 0], kn: 0, an: 40, ff: 0, sp: 0, sh: [178, 8, 0] }, { label: 'Arriver jambes tendues en déséquilibre arrière, rebondir', fly: 0.6 }),
      K(0.45, { lean: 420, yaw: -180, sp: -8 }), K(0.62, { lean: 448, yaw: -180, an: 40 }, { land: true, label: 'Tomber à plat dos, gainé' }), K(1.1, {})]),
  thumb: 2.5,
});

/** Tomber à plat dos vers l'arrière, corps gainé (flip A). */
export const tomberDos = () => ({
  props: [{ k: 'box', x0: -2.1, x1: -0.15, z0: -0.7, z1: 0.7, h: 0.22, color: '#2563eb' }],
  keys: [
    K(0, { ...STAND_UP, sh: [10, 30, 0], el: 140, wr: 0 }, { label: 'Debout, bras croisés, regard devant' }),
    K(0.5, { ...STAND_UP, sh: [10, 30, 0], el: 140, lean: -6 }),
    K(1.05, { ...STAND_UP, sh: [10, 30, 0], el: 140, lean: -60, an: 0 }, { label: 'Laisser tomber les épaules en arrière, gainé' }),
    K(1.3, { ...STAND_UP, sh: [10, 30, 0], el: 140, lean: -90, an: 30, ff: 0 }, { label: 'Tout le corps touche en même temps' }),
    K(1.9, {}),
  ],
  thumb: 1.0,
});

/** Impulsion des jambes et lancer des bras vers l'arrière, réception sur le dos (fosse) – flip B. */
export const lancerArriere = () => ({
  props: [{ k: 'box', x0: -2.6, x1: -0.25, z0: -0.9, z1: 0.9, h: 0.55, color: '#1d4ed8' }],
  keys: chain([K(0, STAND_UP, { label: 'Départ debout' })],
    [C(0),
      K(0.35, { sp: 22, nk: 20, sh: [-15, 8, 0], hp: [22, 0, 0], kn: 18 }, { label: 'Dos arrondi, bras vers le bas' }),
      K(0.7, { lean: -12, sp: 8, sh: [40, 8, 0], hp: [72, 0, 0], kn: 82 }, { label: 'Se déséquilibrer vers l’arrière' }),
      K(0.88, { lean: -40, sp: -18, nk: -20, sh: [195, 8, 0], hp: [-8, 0, 0], kn: 0, an: 50, ff: 0 }, { label: 'Pousser fort, lancer les bras en arrière', fly: -0.7 }),
      K(1.2, { lean: -88, sp: -6, nk: -5, sh: [180, 8, 0], hp: [0, 0, 0] }, { land: true, label: 'Réception sur le dos, corps aligné, bras derrière la tête' }),
      K(1.8, {})]),
  thumb: 1.0,
});

// ---------------------------------------------------------------- saltos
function saltoArriereCore(L, s, yaw, { arms = true, flight = 0.7, dist = 0.25 } = {}) {
  const r = a => L - s * a;
  const k = [C(0)];
  if (arms) {
    k.push(K(0.35, { lean: r(-4), yaw, sp: 18, nk: 5, hp: [58, 0, 0], kn: 70, sh: [-40, 8, 0], ff: 1 }, { label: 'Fléchir, bras en arrière' }));
  }
  const t0 = arms ? 0.6 : 0.1;
  const f = flight;
  k.push(
    K(t0, { lean: r(8), yaw, sp: -4, nk: -5, hp: [0, 0, 0], kn: 0, an: 50, ff: 0, sh: [178, 8, 0] }, { label: 'Grand saut en extension, léger déséquilibre arrière', fly: -s * dist }),
    K(t0 + f * 0.25, { lean: r(70), yaw, sp: 25, nk: 20, hp: [110, 0, 0], kn: 110, sh: [60, 15, 0], el: 40 }, { label: 'Monter les genoux, les attraper vers la poitrine' }),
    K(t0 + f * 0.55, { lean: r(210), yaw, sp: 35, nk: 30, hp: [135, 0, 0], kn: 142, sh: [45, 15, 0], el: 55 }),
    K(t0 + f * 0.8, { lean: r(312), yaw, sp: 10, nk: 5, hp: [70, 0, 0], kn: 50, sh: [120, 15, 0], el: 0 }, { label: 'Dégrouper' }),
    K(t0 + f, { lean: r(350), yaw, sp: 12, nk: 0, hp: [48, 0, 0], kn: 50, an: 0, ff: 1, sh: [100, 10, 0] }, { label: 'Réception debout contrôlée', land: true }),
  );
  return k;
}
export const saltoArriere = ({ props, flight = 0.7 } = {}) => ({
  keys: chain([K(0, STAND_UP, { label: 'Départ debout, bras alignés avec le dos' })], saltoArriereCore(0, 1, 0, { flight }), [C(0), K(0.5, { ...STAND_UP, lean: -360 }, { label: 'Finir debout' })]),
  props, thumb: 0.95,
});
export const saltoArriereTrampo = () => saltoArriere({ flight: 0.85, props: [{ k: 'box', x0: -0.6, x1: 0.6, z0: -0.6, z1: 0.6, h: 0.12, color: '#111827' }, { k: 'box', x0: -2.4, x1: -0.6, z0: -0.9, z1: 0.9, h: 0.12, color: '#2563eb' }] });
export const saltoArriereTremplin = () => saltoArriere({ flight: 0.78, props: [{ k: 'wedge', x0: -0.35, x1: 0.35, z0: -0.35, z1: 0.35, h0: 0.2, h1: 0.06, color: '#b45309' }, { k: 'box', x0: -2.4, x1: -0.4, z0: -0.9, z1: 0.9, h: 0.15, color: '#2563eb' }] });
export const rondadeSalto = () => ({
  keys: chain(runHurdle(1), lungeFromHurdle(), rondadeCore(), saltoArriereCore(360, -1, -180, { arms: false, flight: 0.72, dist: 0.35 }), [C(0), K(0.5, { ...STAND_UP, lean: 720, yaw: -180 }, { label: 'Finir debout' })]),
  thumb: 2.8,
});
/** Saut arrière sur plan incliné (trampoline) puis roulade arrière – salto arrière B. */
export const sautArrierePlan = () => ({
  props: [{ k: 'box', x0: -0.4, x1: 0.4, z0: -0.6, z1: 0.6, h: 0.12, color: '#111827' }, { k: 'wedge', x0: -2.6, x1: -0.55, z0: -0.6, z1: 0.6, h0: 0.12, h1: 0.62, color: '#0ea5e9' }],
  keys: chain([K(0, STAND_UP, { label: 'Départ debout, bras alignés avec le dos' })],
    [C(0), K(0.35, { sp: 18, hp: [58, 0, 0], kn: 70, sh: [-40, 8, 0] }, { label: 'Fléchir, bras en arrière' }),
      K(0.6, { lean: -8, sp: -6, hp: [0, 0, 0], kn: 0, an: 50, ff: 0, sh: [178, 8, 0] }, { label: 'Saut en extension, lancer des bras synchronisé', fly: -0.75 }),
      K(0.95, { lean: -78, sp: 10, nk: 25, hp: [30, 0, 0] }, { land: true, label: 'Arriver sur le dos sur le plan incliné' }),
      K(1.3, { lean: -170, sp: 50, nk: 40, hp: [130, 0, 0], kn: 140, sh: [60, 15, 0], el: 50 }, { label: 'Attraper les genoux, rouler en arrière' }),
      K(1.65, { lean: -300, sp: 40, nk: 15, hp: [118, 0, 0], kn: 128, an: 0, ff: 1, sh: [120, 8, 0], el: 0 }),
      K(2.15, { ...STAND_UP, lean: -360 }, { label: 'Se relever' })]),
  thumb: 0.95,
});

function saltoAvantCore(L, { flight = 0.7, dist = 1.0, seated = false } = {}) {
  const f = flight;
  const k = [C(0),
    K(0.12, { lean: L + 4, sp: 4, hp: [0, 0, 0], kn: 0, an: 50, ff: 0, sh: [176, 8, 0] }, { label: 'Impulsion 2 pieds, bras levés : « se grandir »', fly: dist }),
    K(0.12 + f * 0.25, { lean: L + 70, sp: 30, nk: 30, hp: [100, 0, 0], kn: 100, sh: [90, 12, 0], el: 30 }, { label: 'Monter et grouper vite, mains sur les genoux, tête rentrée' }),
    K(0.12 + f * 0.52, { lean: L + 200, sp: 40, nk: 35, hp: [130, 0, 0], kn: 140, sh: [60, 15, 0], el: 70 }),
  ];
  if (seated) {
    k.push(K(0.12 + f * 0.8, { lean: L + 300, sp: 20, nk: 10, hp: [100, 0, 0], kn: 40, sh: [90, 12, 0], el: 10 }, { label: 'Ouvrir pour arriver assis·e' }),
      K(0.12 + f, { lean: L + 335, sp: 15, hp: [95, 0, 0], kn: 10, an: 40, sh: [60, 20, 0] }, { land: true, label: 'Réception sur les fesses, dans l’axe' }));
  } else {
    k.push(K(0.12 + f * 0.8, { lean: L + 318, sp: 15, nk: 10, hp: [80, 0, 0], kn: 70, sh: [120, 12, 0], el: 0 }, { label: 'Dégrouper' }),
      K(0.12 + f, { lean: L + 376, sp: 18, nk: 0, hp: [82, 0, 0], kn: 86, an: 0, ff: 1, sh: [110, 10, 0] }, { land: true, label: 'Réception debout contrôlée (1 pas maxi)' }));
  }
  return k;
}
const STACK = (x0, h = 0.45, len = 2.2) => ({ k: 'box', x0, x1: x0 + len, z0: -0.9, z1: 0.9, h, color: '#2563eb' });
const TRAMP = (at, dx = -0.25) => ({ k: 'wedge', at, dx, x0: 0, x1: 0.7, z0: -0.4, z1: 0.4, h0: 0.25, h1: 0.45, color: '#111827' });
const TREMPLIN = (at, dx = -0.3) => ({ k: 'wedge', at, dx, x0: 0, x1: 0.75, z0: -0.35, z1: 0.35, h0: 0.05, h1: 0.22, color: '#b45309' });

export const saltoAvant = () => ({ keys: chain(runHurdle(3), saltoAvantCore(0), standAfter(360, 0)), thumb: 2.1 });
export const saltoAvantTremplin = () => ({
  props: [TREMPLIN(1.4), { ...STACK(0, 0.22), at: 1.4, dx: 0.6 }],
  keys: chain(runHurdle(3), saltoAvantCore(0, { flight: 0.78, dist: 1.2 }), standAfter(360, 0)), thumb: 2.1,
});
export const saltoAvantTrampo = ({ seated = false } = {}) => ({
  props: [TRAMP(0.95), { ...STACK(0, 0.5), at: 0.95, dx: 0.65 }],
  keys: chain(runHurdle(1), saltoAvantCore(0, { flight: 0.82, dist: 1.25, seated }), seated ? [C(0), K(0.5, { lean: 345, sp: 30, hp: [100, 0, 0], kn: 120, an: 0, ff: 1, sh: [110, 10, 0] }, { label: 'Se relever' }), K(1.0, { ...STAND_UP, lean: 360 })] : standAfter(360, 0)), thumb: 1.5,
});

/** Saut de l'ange (et roulade élevée) : impulsion 2 pieds, vol corps aligné, mains au sol, roulade. */
function angeCore({ high = false, dist = 1.0, flight = 0.5 } = {}) {
  return [C(0),
    K(0.12, { lean: 10, sp: -4, hp: [-4, 0, 0], kn: 0, an: 50, ff: 0, sh: [170, 8, 0] }, { label: 'Impulsion 2 pieds, jambes tendues, bras levés', fly: dist }),
    K(0.12 + flight * 0.5, { lean: high ? 60 : 48, sp: high ? 25 : -12, nk: high ? 20 : -10, hp: [high ? 30 : -8, 0, 0], an: 55, sh: [high ? 120 : 150, 8, 0] }, { label: high ? 'Dos arrondi, bras vers le tapis' : 'Corps aligné et gainé en l’air' }),
    K(0.12 + flight, { lean: 100, sp: 15, nk: 20, hp: [15, 0, 0], sh: [150, 8, 0], el: 5, hf: 1, wr: 80 }, { land: true, plant: HANDS, label: 'Regarder les mains se poser, amortir avec les bras' }),
    K(0.42 + flight, { lean: 135, sp: 50, nk: 48, hp: [60, 0, 0], kn: 30, sh: [160, 10, 0], el: 105 }, { label: 'Rentrer la tête (menton / poitrine), rouler' }),
    K(0.75 + flight, { lean: 210, sp: 60, nk: 40, hp: [128, 0, 0], kn: 140, an: 30, sh: [70, 10, 0], el: 30, hf: 0, wr: 0 }, { plant: [] }),
    K(1.08 + flight, { lean: 300, sp: 52, nk: 25, hp: [128, 0, 0], kn: 140, an: 0, ff: 0.6, sh: [100, 8, 0], el: 10 }),
    K(1.36 + flight, { lean: 342, sp: 42, nk: 10, hp: [106, 0, 0], kn: 122, ff: 1, sh: [125, 8, 0], el: 0 }, { label: 'Fléchir les jambes le plus tard possible, se relever' }),
    K(1.85 + flight, { ...STAND_UP, lean: 360 }, { label: 'Finir debout' }),
  ];
}
export const sautAnge = () => ({ keys: chain(runHurdle(3), angeCore()), thumb: 2.2 });
export const sautAngeTremplin = () => ({
  props: [TREMPLIN(1.4), { ...STACK(0, 0.22, 3), at: 1.4, dx: 0.55 }],
  keys: chain(runHurdle(3), angeCore({ dist: 1.3, flight: 0.62 })), thumb: 2.3,
});
export const rouladeEleveeTrampo = () => ({
  props: [TRAMP(0.95), { ...STACK(0, 0.5, 2.6), at: 0.95, dx: 0.6 }],
  keys: chain(runHurdle(1), angeCore({ high: true, dist: 0.9, flight: 0.55 })), thumb: 1.5,
});

// ---------------------------------------------------------------- saut de mains / saut de tête
function sautMainsCore({ dist = 0.95 } = {}) {
  return [C(0),
    K(0.25, { lean: 70, sp: 10, hpL: [60, 0, 0], knL: 40, hpR: [-70, 0, 0], knR: 0, anR: 50, fR: 0, sh: [176, 8, 0], wr: 70, nk: -10 }, { label: 'Lancer très fort la jambe arrière' }),
    K(0.42, { lean: 122, sp: 8, hpL: [40, 0, 0], knL: 10, hpR: [-112, 0, 0], hf: 1, wr: 85, nk: -20 }, { label: 'Mains au sol, regarder les mains', plant: HANDS }),
    K(0.56, { lean: 176, sp: -5, hp: [-6, 0, 0], kn: 0, an: 55, ff: 0, nk: -15 }, { label: 'Pousser très fort dans les épaules', plant: [], fly: dist }),
    K(0.8, { lean: 258, sp: -24, nk: -10, hp: [-10, 0, 0], sh: [186, 8, 0], hf: 0, wr: 0 }, { label: 'Corps gainé en l’air' }),
    K(1.0, { lean: 342, sp: -14, nk: 0, hp: [18, 0, 0], kn: 30, an: 0, ff: 1, sh: [180, 8, 0] }, { land: true, label: 'Réception debout, bras verticaux' }),
    K(1.45, { ...STAND_UP, lean: 360 }),
  ];
}
export const sautMains = () => ({ keys: chain(runHurdle(1), lungeFromHurdle(), sautMainsCore()), thumb: 2.35 });
export const sautMainsTrampo = () => ({
  props: [{ k: 'box', at: 'plant:handL', ref: 'wrL', dx: -0.3, x0: 0, x1: 0.7, z0: -0.4, z1: 0.4, h: 0.32, color: '#111827' }, { ...STACK(0, 0.3, 2.4), at: 'plant:handL', ref: 'wrL', dx: 0.75 }],
  keys: chain(runHurdle(1), lungeFromHurdle(), sautMainsCore({ dist: 1.15 })), thumb: 2.35,
});

export const sautTete = () => ({
  keys: [
    K(0, STAND_UP, { label: 'Départ debout' }),
    K(0.45, { lean: 70, sp: 45, nk: 35, hp: [118, 0, 0], kn: 0, sh: [150, 10, 0], el: 70, hf: 1, wr: 85 }, { label: 'Mains et front au sol, jambes tendues', plant: ALL4 }),
    K(0.85, { lean: 150, sp: 40, nk: 30, hp: [128, 0, 0], kn: 0, an: 50, ff: 0 }, { label: 'Basculer : bassin au-dessus de la tête', plant: HANDS }),
    K(1.02, { lean: 214, sp: -20, nk: -10, hp: [-18, 0, 0], sh: [180, 8, 0], el: 0 }, { label: 'Ouvrir fort les hanches, pousser sur les bras', plant: [], fly: 0.55 }),
    K(1.26, { lean: 284, sp: -30, hp: [-15, 0, 0], sh: [188, 8, 0], hf: 0, wr: 0, nk: -10 }),
    K(1.46, { lean: 346, sp: -12, nk: 0, hp: [28, 0, 0], kn: 34, an: 0, ff: 1, sh: [178, 8, 0] }, { land: true, label: 'Réception debout, jambes serrées' }),
    K(1.9, { ...STAND_UP, lean: 360 }),
  ],
  thumb: 1.05,
});

// ---------------------------------------------------------------- souplesses / pont
export const souplesseAvant = () => ({
  keys: chain(start(), [C(0),
    K(0.32, { lean: 62, sp: 10, hpL: [60, 0, 0], knL: 20, hpR: [-60, 0, 0], knR: 0, anR: 50, fR: 0, wr: 70 }, { label: 'Poser les mains, lancer la jambe arrière' }),
    K(0.55, { lean: 118, sp: 4, hpL: [40, 0, 0], knL: 0, hpR: [-110, 0, 0], hf: 1, wr: 85, nk: -20 }, { plant: HANDS }),
    K(0.85, { lean: 180, sp: -8, hpL: [60, 0, 0], hpR: [-70, 0, 0], anL: 55, fL: 0, nk: -20 }, { label: 'Passer par l’ATR jambes écartées' }),
    K(1.2, { lean: 238, sp: -55, hpR: [-100, 0, 0], hpL: [55, 0, 0], anR: 10, fR: 0.5, nk: -30 }, { label: 'Arriver sur un pied, dos cambré (pont)', plant: ['handR', 'handL', 'footR'] }),
    K(1.55, { lean: 300, sp: -50, hpR: [-40, 0, 0], hpL: [70, 0, 0], fR: 1, anR: 0, hf: 0.5, nk: -20 }, { label: 'Pousser sur les bras, ramener le buste', plant: ['footR'] }),
    K(1.95, { lean: 360, sp: 0, nk: 0, hpR: [0, 0, 0], hpL: [55, 0, 0], kn: 0, anL: 55, hf: 0, wr: 0, sh: [176, 10, 0] }, { label: 'Finir sur une jambe, l’autre tendue devant', plant: [] }),
    K(2.4, { ...STAND_UP, lean: 360 })]),
  thumb: 1.62,
});

function kickoverCore(Lb) {
  return [C(0),
    K(0.45, { lean: Lb, sp: -110, nk: -40, hpR: [100, 0, 0], knR: 0, anR: 50, fR: 0, hpL: [30, 0, 0], knL: 40, sh: [188, 8, 0], el: 0, hf: 1, wr: 85 }, { label: 'Pont : lever la jambe libre tendue', plant: ['handR', 'handL', 'footL'] }),
    K(0.85, { lean: -180, sp: -25, nk: -25, hpR: [80, 0, 0], hpL: [-50, 0, 0], knL: 0, anL: 50, fL: 0 }, { label: 'Pousser sur la jambe d’appui : les jambes passent par-dessus', plant: HANDS }),
    K(1.2, { lean: -262, sp: -45, hpR: [110, 0, 0], hpL: [-40, 0, 0], anR: 0, fR: 0.6 }, { label: 'Poser un pied, puis l’autre', plant: ['handR', 'handL', 'footR'] }),
    K(1.55, { lean: -325, sp: -25, nk: -10, hpR: [30, 0, 0], hpL: [-55, 0, 0], fR: 1, hf: 0.4 }, { plant: ['footR'] }),
    K(1.95, { lean: -360, sp: 0, nk: 0, hpR: [0, 0, 0], hpL: [-35, 0, 0], kn: 0, anL: 50, fL: 0, hf: 0, wr: 0, sh: [176, 10, 0] }, { label: 'Se redresser, bras en haut', plant: [] }),
    K(2.35, { ...STAND_UP, lean: -360 }),
  ];
}
export const souplesseArriere = () => ({
  keys: chain([K(0, { ...STAND_UP, hpR: [25, 0, 0], anR: 50, fR: 0 }, { label: 'Debout sur une jambe, bras en haut' }),
    K(0.6, { lean: -30, sp: -80, nk: -40, hpR: [45, 0, 0], sh: [192, 8, 0] }, { label: 'Pousser le bassin devant, se cambrer, regarder les mains' }),
    K(1.0, { lean: -88, sp: -112, hpR: [80, 0, 0], hf: 1, wr: 85 }, { label: 'Poser les mains : pont sur une jambe', plant: ['handR', 'handL', 'footL'] })],
  kickoverCore(-88)),
  thumb: 1.5,
});
export const pontRevenir = () => ({
  keys: chain([K(0, { lean: -90, sp: 0, nk: 0, hp: [50, 0, 0], kn: 90, an: 0, ff: 1, sh: [170, 12, 0], el: 130, wr: 60, hf: 1 }, { label: 'Départ sur le dos, mains près des oreilles', plant: ALL4 }),
    K(0.9, { lean: -42, sp: -112, nk: -40, hp: [26, 0, 0], kn: 62, sh: [188, 8, 0], el: 0 }, { label: 'Venir en pont : bras tendus' })],
  kickoverCore(-42)),
  thumb: 1.7,
});

/** Roue sur un obstacle (mains sur la caisse en largeur) – roue A ; en longueur – roue B. */
export const roueObstacle = () => ({
  ...roue(),
  props: [{ k: 'box', at: 'plant:handL', ref: 'wrL', dx: -0.2, x0: 0, x1: 0.55, z0: -0.45, z1: 0.45, h: 0.3, color: '#a16207' }],
});
export const rouePlinthLong = () => ({
  ...roue(),
  props: [{ k: 'box', at: 'plant:handL', ref: 'wrL', dx: -0.3, x0: 0, x1: 1.2, z0: -0.25, z1: 0.25, h: 0.25, color: '#a16207' }],
});

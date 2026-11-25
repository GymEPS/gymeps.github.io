// Famille des RENVERSEMENTS : placement du dos, trépied, ATR et ses variantes.
import { KW, chain, hold } from './pose.js';
import { ST, ST_UP, HANDS, ALL4, up, toLunge, lungeToATR, atrToLunge, finish } from './blocks.js';

const SQUAT = { ...ST, lean: 22, T: 42, th: 82, sn: -32, ar: 55, fa: 60, ff: 1 };
const HANDS_DOWN = { ...ST, lean: 40, T: 78, th: 92, sn: -24, ar: 14, fa: 14, hf: 1, wr: 80, ff: 1, nk: -10 };
const TUCK_INV = { lean: 178, T: 180, th: -42, sn: -178, ar: 0, fa: 0, an: 45, ff: 0, hf: 1, wr: 88, nk: -26 };
const ATR = { lean: 180, T: 180, th: -180, sn: -180, ar: 0, fa: 0, an: 50, ff: 0, hf: 1, wr: 88, nk: -24 };

/** Accroupi → mains au sol → bassin au-dessus des épaules, corps groupé (placement du dos). */
const squatToTuck = () => [
  KW(0, SQUAT, { label: 'Départ accroupi' }),
  KW(0.5, HANDS_DOWN, { label: 'Mains à plat, écartement des épaules', plant: ALL4 }),
  KW(0.95, { lean: 110, T: 128, th: 40, sn: -100, ar: 2, fa: 2, an: 30, ff: 0.3, nk: -20 }, { plant: HANDS }),
  KW(1.4, TUCK_INV, { label: 'Monter le bassin au-dessus des épaules, dos droit, corps groupé' }),
];
const tuckToSquat = () => [
  KW(0, TUCK_INV),
  KW(0.5, { lean: 110, T: 128, th: 40, sn: -100, an: 20, ff: 0.3 }),
  KW(0.95, HANDS_DOWN, { plant: ALL4, label: 'Reposer les pieds' }),
  KW(1.4, { ...SQUAT, hf: 0, wr: 0 }, { plant: [] }),
];

export const placementDos = () => ({
  keys: chain(squatToTuck(), hold([KW(0, TUCK_INV)], 1.6, { label: 'Tenir 2 secondes' }), tuckToSquat()),
  thumb: 2.2,
});

export const trepied = () => ({
  keys: chain(
    [KW(0, SQUAT, { label: 'Départ accroupi' }),
      KW(0.5, { ...HANDS_DOWN, lean: 52, T: 96, ar: 40, fa: 40, nk: 20 }, { label: 'Mains et front au sol : un triangle', plant: ALL4 }),
      KW(1.0, { lean: 120, T: 150, th: 40, sn: -110, ar: -95, fa: 0, an: 30, ff: 0.2, nk: 0 }, { plant: HANDS }),
      KW(1.5, { lean: 182, T: 182, th: -45, sn: -175, ar: -112, fa: 0, an: 45, ff: 0, nk: 0 }, { label: 'Monter les genoux groupés' }),
      KW(2.1, { lean: 182, T: 182, th: -180, sn: -180, ar: -112, fa: 0, an: 55, nk: 0 }, { label: 'Tendre les jambes : corps aligné' })],
    hold([KW(0, {})], 1.6, { label: 'Tenir 2 secondes' }),
    [KW(0, {}), KW(0.5, { lean: 182, T: 182, th: -45, sn: -175 }),
      KW(1.0, { lean: 120, T: 150, th: 40, sn: -110, ar: -95, fa: 0, an: 20, ff: 0.2 }),
      KW(1.5, { ...HANDS_DOWN, lean: 52, T: 96, ar: 40, fa: 40, nk: 20 }, { plant: ALL4, label: 'Redescendre groupé' }),
      KW(1.95, { ...SQUAT }, { plant: [] })],
  ),
  thumb: 2.6,
});

export const placementDosATR = ({ straight = false } = {}) => ({
  keys: chain(
    straight
      ? [KW(0, { ...ST, lean: 70, T: 100, th: 0, sn: 0, ar: 12, fa: 12, ff: 1, hf: 1, wr: 80 }, { label: 'Départ jambes tendues, mains au sol', plant: ALL4 }),
        KW(0.7, { lean: 110, T: 150, th: -20, sn: -20, hpa: 40, ar: 4, fa: 4, an: 40, ff: 0.2, nk: -18 }, { plant: HANDS, label: 'Monter le bassin, jambes tendues écartées' }),
        KW(1.4, { lean: 165, T: 178, th: -110, sn: -110, hpa: 45, ar: 0, fa: 0, an: 50, ff: 0, nk: -22 }, { label: 'Placement du dos : bras et dos alignés' }),
        KW(2.0, { ...ATR, hpa: 0 }, { label: 'Serrer les jambes à la verticale' })]
      : [...squatToTuck(), KW(2.0, { ...ATR }, { label: 'Tendre les jambes vers le haut : ATR' })],
    hold([KW(0, {})], 1.1, { label: 'Tenir' }),
    [KW(0, {}), KW(0.55, { ...TUCK_INV }, { label: 'Regrouper et redescendre' }), ...tuckToSquat().slice(1).map(k => ({ ...k, t: k.t + 0.55 }))],
  ),
  thumb: 2.4,
});

export const atrRevenir = ({ holdT = 0.25, label = 'Passer par l’ATR, bien gainé' } = {}) => ({
  keys: chain(toLunge(), lungeToATR(), hold([KW(0, ATR)], holdT, { label }), atrToLunge(), finish(0.45)),
  thumb: 1.75,
});
export const atrTenu = () => atrRevenir({ holdT: 2.0, label: 'Tenir 2 secondes immobile' });

export const atrRoulade = ({ props } = {}) => ({
  keys: chain(
    toLunge(), lungeToATR(), hold([KW(0, ATR)], 0.35, { label: 'ATR aligné, jambes serrées' }),
    [KW(0, ATR),
      KW(0.35, { lean: 196, T: 200, th: -150, sn: -150, ar: 30, fa: 30, nk: 30, an: 50 }, { label: 'Déséquilibrer vers l’avant, rentrer la tête' }),
      KW(0.65, { lean: 210, T: 225, th: -120, sn: -150, ar: -62, fa: 38, nk: 50 }, { label: 'Plier les bras, poser la nuque' }),
      KW(1.0, { lean: 270, T: 300, th: 30, sn: -110, ar: 150, fa: 150, nk: 40, an: 30, hf: 0, wr: 0 }, { plant: [], label: 'Rouler dos rond' }),
      KW(1.35, { lean: 320, T: 360, th: 85, sn: -55, ar: 100, fa: 100, nk: 20, an: 0, ff: 0.6 }),
      KW(1.65, { lean: 342, T: 382, th: 78, sn: -32, ar: 120, fa: 120, nk: 0, ff: 1 }, { label: 'Se relever sans les mains' }),
      KW(2.15, { ...ST_UP, lean: 360, T: 360 }, { label: 'Finir debout, bras en haut' })],
  ),
  props, thumb: 1.7,
});

/** Valse : tour sur les mains en ATR (deg = 180 ou 360). */
export const atrValse = (deg = 180) => {
  const turn = [];
  const steps = deg / 90;
  let t = 0;
  for (let i = 1; i <= steps; i++) {
    t += 0.42;
    turn.push(KW(t, { ...ATR, yaw: 90 * i }, { plant: i % 2 ? ['handL'] : ['handR'], label: i === 1 ? 'Tourner en déplaçant une main après l’autre' : undefined }));
    t += 0.18;
    turn.push(KW(t, { ...ATR, yaw: 90 * i }, { plant: HANDS }));
  }
  return {
    keys: chain(toLunge(), lungeToATR(), [KW(0, ATR), ...turn], atrToLunge({ yaw: deg }), finish(0.45, { yaw: deg })),
    thumb: 1.9,
  };
};

/** Healy : ATR, ½ tour en avant sur un bras, arrivée en appui dorsal. */
export const atrHealy = () => ({
  keys: chain(
    toLunge(), lungeToATR(),
    [KW(0, ATR, { label: 'ATR' }),
      KW(0.4, { ...ATR, yaw: 60, lean: 190, T: 190, th: -190, sn: -190 }, { plant: ['handL'], label: 'Pivoter en avant sur un bras, corps tendu' }),
      KW(0.8, { ...ATR, yaw: 150, lean: 222, T: 222, th: -222, sn: -222, arR: 40, faR: 40 }),
      KW(1.15, { lean: 252, T: 252, th: -235, sn: -235, yaw: 180, ar: -30, fa: -30, an: 45, ff: 0, hf: 1, wr: 85, nk: 0 }, { plant: HANDS, label: 'Arriver en appui dorsal, bras tendus' }),
      KW(1.55, { lean: 255, T: 255, th: -232, sn: -232, yaw: 180, ar: -32, fa: -32, an: 30, ff: 0.5 })],
    hold([KW(0, {})], 0.6),
  ),
  thumb: 1.9,
});

/** ATR face au mur : mains au sol, monter les pieds au mur, tenir, rouler. */
export const atrFaceMur = () => ({
  props: [{ k: 'box', x0: 0.9, x1: 1.05, z0: -0.9, z1: 0.9, h: 2.2, color: '#475569', solid: false }],
  keys: chain(
    [KW(0, { ...ST, lean: 75, T: 98, th: -5, sn: -5, ar: 10, fa: 10, hf: 1, wr: 80, ff: 0.6, an: 20 }, { label: 'Mains au sol devant le mur', plant: ALL4 }),
      KW(0.6, { lean: 110, T: 140, th: -60, sn: -150, ar: 2, fa: 2, an: 40, ff: 0, nk: -20 }, { plant: HANDS, label: 'Monter les pieds au mur' }),
      KW(1.3, { lean: 160, T: 172, th: -150, sn: -175, ar: 0, fa: 0, an: 45, nk: -22 }),
      KW(1.9, { ...ATR, lean: 176, T: 176, th: -176, sn: -176 }, { label: 'Pousser bras tendus, corps gainé, regarder les mains' })],
    hold([KW(0, {})], 1.5, { label: 'Tenir 3 secondes' }),
    [KW(0, {}),
      KW(0.4, { lean: 196, T: 200, th: -150, sn: -150, ar: 30, fa: 30, nk: 30 }, { label: 'Rouler en pliant les bras' }),
      KW(0.75, { lean: 215, T: 228, th: -120, sn: -150, ar: -65, fa: 35, nk: 50 }),
      KW(1.1, { lean: 270, T: 300, th: 30, sn: -110, ar: 150, fa: 150, nk: 40, hf: 0, wr: 0 }, { plant: [] }),
      KW(1.45, { lean: 320, T: 360, th: 85, sn: -55, ar: 100, fa: 100, nk: 20, ff: 0.6 }),
      KW(1.8, { lean: 342, T: 382, th: 78, sn: -32, ar: 120, fa: 120, ff: 1, nk: 0 })],
  ),
  thumb: 2.4,
});

/** Placement du dos sur le bloc puis ATR dos au mur. */
export const placementDosAtrMur = () => ({
  props: [
    { k: 'box', x0: -1.3, x1: -0.6, z0: -0.4, z1: 0.4, h: 0.42, color: '#0ea5e9' },
    { k: 'box', x0: 0.16, x1: 0.4, z0: -0.9, z1: 0.9, h: 2.0, color: '#64748b', solid: false },
  ],
  keys: chain(
    [KW(0, { lean: 182, T: 182, th: -58, sn: -58, ar: 0, fa: 0, hf: 1, wr: 88, ff: 0, an: 10, nk: -22 }, { label: 'Pieds sur le bloc, jambes tendues : dos et bras alignés', plant: ALL4 })],
    hold([KW(0, {})], 1.4, { label: 'Tenir 3 secondes (placement du dos)' }),
    [KW(0, {}),
      KW(0.6, { lean: 182, T: 182, thR: -178, snR: -178, thL: -58, snL: -58, anR: 50 }, { label: 'Monter une jambe…', plant: ['handR', 'handL', 'footL'] }),
      KW(1.2, { ...ATR, lean: 186, T: 186, th: -186, sn: -186 }, { label: '… puis l’autre : pieds contre le tapis au mur', plant: HANDS })],
    hold([KW(0, {})], 1.4, { label: 'Tenir 3 secondes' }),
    [KW(0, {}), KW(0.6, { lean: 182, T: 182, thR: -178, snR: -178, thL: -58, snL: -58, anL: 10 }, { label: 'Redescendre sur le bloc' }),
      KW(1.2, { lean: 182, T: 182, th: -58, sn: -58, an: 10 }, { plant: ALL4 })],
  ),
  thumb: 2.9,
});

/** ATR dos au mur (arrivée des talons contre le tapis au mur). */
export const atrDosMur = () => ({
  props: [{ k: 'box', x0: 1.45, x1: 1.75, z0: -0.9, z1: 0.9, h: 2.0, color: '#64748b', solid: false }],
  keys: chain(toLunge(), lungeToATR(), [KW(0, ATR), KW(0.25, { ...ATR, lean: 188, T: 190, th: -186, sn: -186 }, { label: 'Pieds contre le tapis au mur' })],
    hold([KW(0, {})], 2.4, { label: 'Tenir 3 secondes, regarder les mains' }), atrToLunge(), finish(0.4)),
  thumb: 2.0,
});

/** ATR puis tomber à plat dos, corps gainé. */
export const atrPlatDos = ({ impulsion = false } = {}) => ({
  props: [{ k: 'box', x0: 0.15, x1: 2.3, z0: -0.7, z1: 0.7, h: 0.12, color: '#2563eb' }],
  keys: chain(
    toLunge(),
    impulsion
      ? [KW(0, { lean: 0, T: 4, thL: 52, snL: -8, thR: -24, snR: -24, ar: 176, fa: 176, anR: 25, fR: 0.5 }),
        KW(0.32, { lean: 62, T: 82, thL: 62, snL: -12, thR: -78, snR: -78, ar: up(82), fa: up(82), wr: 70, anR: 40, fR: 0 }, { label: 'Lancer fort la jambe arrière' }),
        KW(0.55, { lean: 112, T: 125, thL: 30, snL: -14, thR: -135, snR: -135, ar: up(125), fa: up(125), wr: 85, hf: 1, anR: 55 }, { label: 'Pousser fort dans les épaules : franchir la marque', plant: HANDS }),
        KW(0.85, { lean: 160, T: 168, thL: -96, snL: -96, thR: -170, snR: -170, ar: up(168), fa: up(168), anL: 50, fL: 0 }, { plant: [] , fly: 0.25 }),
        KW(1.05, { ...ATR }, { land: true, plant: HANDS, label: 'Arriver en ATR, bras tendus, gainé' })]
      : lungeToATR(),
    [KW(0, ATR),
      KW(0.45, { ...ATR, lean: 220, T: 220, th: -220, sn: -220, ar: up(220), fa: up(220), nk: -10 }, { label: 'Rester gainé : bras, dos, jambes alignés' }),
      KW(0.75, { ...ATR, lean: 262, T: 262, th: -262, sn: -262, ar: up(262), fa: up(262), hf: 0, wr: 0, nk: 0 }, { plant: [], label: 'Arriver sur le dos d’un bloc' }),
      KW(1.0, { ...ATR, lean: 270, T: 270, th: -270, sn: -270, ar: up(270), fa: up(270), hf: 0, wr: 0, nk: 0, an: 40 })],
    hold([KW(0, {})], 0.7),
  ),
  thumb: 1.95,
});

/** ATR puis tomber à plat ventre (préparation du flip). */
export const atrPlatVentre = () => ({
  props: [{ k: 'wedge', x0: -1.0, x1: -0.2, z0: -0.45, z1: 0.45, h0: 0.6, h1: 0.6, color: '#0ea5e9' }, { k: 'box', x0: -0.2, x1: 2.0, z0: -0.7, z1: 0.7, h: 0.12, color: '#2563eb' }],
  keys: chain(
    [KW(0, { lean: 200, T: 210, thR: -150, snR: -150, thL: -120, snL: -200, ar: 0, fa: 0, hf: 1, wr: 88, an: 40, ff: 0, nk: -20, yaw: 180 }, { label: 'Mains au sol, un pied sur le bloc', plant: HANDS }),
      KW(0.7, { ...ATR, yaw: 180 }, { label: 'ATR : regarder les mains, « se grandir »' })],
    hold([KW(0, {})], 0.5),
    [KW(0, {}),
      KW(0.45, { ...ATR, yaw: 180, lean: 220, T: 220, th: -220, sn: -220, ar: up(220), fa: up(220) }, { label: 'Tomber à plat ventre, corps gainé et aligné' }),
      KW(0.75, { ...ATR, yaw: 180, lean: 262, T: 262, th: -262, sn: -262, ar: up(262), fa: up(262), hf: 0, wr: 0 }, { plant: [] }),
      KW(0.95, { ...ATR, yaw: 180, lean: 270, T: 270, th: -270, sn: -270, ar: up(270), fa: up(270), hf: 0 })],
    hold([KW(0, {})], 0.6),
  ),
  thumb: 1.0,
});

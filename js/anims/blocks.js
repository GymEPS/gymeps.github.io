// Briques de mouvement réutilisées par toutes les figures (angles vus de profil, voir W() dans pose.js).
// Chaque brique renvoie une liste d'images clés commençant à t = 0 ; on les assemble avec chain().
import { KW, chain } from './pose.js';

export const HANDS = ['handR', 'handL'];
export const FEET = ['footR', 'footL'];
export const ALL4 = [...HANDS, ...FEET];
export const up = T => 180 - T; // bras alignés avec le buste (au-dessus de la tête)

export const ST = { lean: 0, T: 0, th: 0, sn: 0, ar: 0, fa: 8, sha: 6, hpa: 0, nk: 0, an: 0, ff: 1, hf: 0, wr: 0, yaw: 0, roll: 0 };
export const ST_UP = { ...ST, ar: 178, fa: 178, sha: 10 };

/** Debout bras en haut → fente avant jambe gauche, bras dans le prolongement du dos. */
export const toLunge = (o = {}) => [
  KW(0, { ...ST_UP, ...o }, { label: 'Départ debout, bras en haut' }),
  KW(0.45, { ...ST_UP, T: 4, thL: 52, snL: -8, thR: -24, snR: -24, anR: 25, fR: 0.5, ...o }, { label: 'Grande fente avant, regard vers les mains' }),
];

/** De la fente à l'ATR (appui tendu renversé), mains fixées au sol. */
export const lungeToATR = (o = {}) => [
  KW(0, { lean: 0, T: 4, thL: 52, snL: -8, thR: -24, snR: -24, ar: 176, fa: 176, anR: 25, fR: 0.5, fL: 1, ...o }),
  KW(0.32, { lean: 62, T: 82, thL: 62, snL: -12, thR: -78, snR: -78, ar: up(82), fa: up(82), wr: 70, anR: 40, fR: 0, nk: -10, ...o }, { label: 'Poser les mains loin devant, bras tendus' }),
  KW(0.55, { lean: 108, T: 122, thL: 32, snL: -14, thR: -132, snR: -132, ar: up(122), fa: up(122), wr: 85, hf: 1, anR: 55, nk: -22, ...o }, { label: 'Lancer la jambe arrière tendue', plant: HANDS }),
  KW(0.85, { lean: 160, T: 168, thL: -96, snL: -96, thR: -170, snR: -170, ar: up(168), fa: up(168), anL: 50, fL: 0, an: 55, ...o }),
  KW(1.1, { lean: 180, T: 180, th: -180, sn: -180, ar: 0, fa: 0, an: 50, ff: 0, hf: 1, wr: 88, nk: -24, ...o }, { label: 'ATR : corps aligné et gainé, jambes serrées' }),
];

/** Retour de l'ATR vers la fente (on redescend par où on est monté). */
export const atrToLunge = (o = {}) => [
  KW(0, { lean: 180, T: 180, th: -180, sn: -180, ar: 0, fa: 0, an: 50, ff: 0, hf: 1, wr: 88, nk: -24, ...o }),
  KW(0.32, { lean: 158, T: 166, thR: -150, snR: -150, thL: -186, snL: -186, ar: up(166), fa: up(166), ...o }, { label: 'Redescendre une jambe après l’autre' }),
  KW(0.62, { lean: 100, T: 116, thR: -40, snR: -40, thL: -150, snL: -150, fR: 0, anR: 30, ar: up(116), fa: up(116), ...o }),
  KW(0.9, { lean: 40, T: 56, thR: -24, snR: -24, thL: 52, snL: -8, anL: 0, fL: 1, anR: 25, fR: 0.5, ar: up(56), fa: up(56), hf: 0, wr: 0, nk: 0, ...o }, { plant: [] }),
  KW(1.25, { ...ST_UP, T: 4, thL: 52, snL: -8, thR: -24, snR: -24, anR: 25, fR: 0.5, ...o }),
];

/** Debout bras en haut (petite tenue finale). */
export const finish = (dt = 0.5, o = {}, label = 'Finir debout, bras en haut') => [
  KW(0, {}),
  KW(dt, { ...ST_UP, ...o }, { label }),
];

/** Préparation d'un saut sur deux pieds : flexion, bras en arrière. */
export const crouch = (o = {}) => [
  KW(0, { ...ST, ar: 10, fa: 20, ...o }, { label: 'Départ debout' }),
  KW(0.4, { ...ST, lean: 22, T: 30, th: 75, sn: -30, ar: -45, fa: -40, ff: 1, ...o }, { label: 'Fléchir, bras en arrière' }),
];
/** Impulsion : extension complète, bras lancés vers le haut. */
export const takeoff = (o = {}) => KW(0.22, { ...ST, lean: 0, T: 0, th: 0, sn: 0, ar: 175, fa: 175, an: 40, ff: 0, ...o }, { label: 'Impulsion : pousser fort, bras vers le haut' });
/** Réception : les pieds touchent jambes presque tendues (fin du vol), puis on amortit au sol, bras devant (« réception corrigée »). */
export const landing = (t, o = {}) => [
  KW(t, { ...ST, lean: 4, T: 6, th: 14, sn: -2, ar: 120, fa: 120, an: 12, ff: 0.7, ...o }, { label: 'Réception : amortir, bras devant', land: true }),
  KW(t + 0.22, { ...ST, lean: 18, T: 26, th: 62, sn: -24, ar: 95, fa: 95, an: 0, ff: 1, ...o }),
];

/** Course d'élan (n foulées) puis sursaut (appel 1 pied → réception 2 pieds) ; finit pieds joints, bras en haut, prêt à la fente. */
export function runHurdle(n = 2) {
  // course pilotée : environ 2,6 m/s, foulées alternées ; puis sursaut (appel 1 pied, réception 2 pieds)
  const keys = [KW(0, { ...ST, ar: 10, fa: 30, x: 0 }, { label: 'Élan (quelques pas)', drive: true })];
  let t = 0, x = 0;
  for (let i = 0; i < n; i++) {
    const R = i % 2 === 0;
    t += 0.3; x += 0.78;
    keys.push(KW(t, {
      ...ST, x, lean: 8, T: 10, thR: R ? 42 : -28, snR: R ? 2 : -75, thL: R ? -28 : 42, snL: R ? -75 : 2,
      arR: R ? -40 : 50, faR: R ? -20 : 110, arL: R ? 50 : -40, faL: R ? 110 : -20, fR: R ? 0.6 : 0, fL: R ? 0 : 0.6, anR: R ? 0 : 55, anL: R ? 55 : 0,
    }));
  }
  t += 0.26; x += 0.55;
  keys.push(KW(t, { ...ST, x, lean: 4, T: 6, thL: 62, snL: 5, thR: -10, snR: -10, an: 40, ar: 150, fa: 165, ff: 0 }, { label: 'Sursaut : grand saut vers l’avant, bras en haut', fly: 0.9 }));
  t += 0.18;
  keys.push(KW(t, { ...ST, x, lean: 0, T: 0, thL: 40, snL: 20, thR: 0, snR: 0, an: 45, ar: 176, fa: 176, ff: 0 }));
  t += 0.2;
  keys.push(KW(t, { ...ST_UP, x, lean: 6, T: 8, th: 28, sn: -10, ar: 172, fa: 172, ff: 1 }, { land: true, drive: false, label: '« Se grandir », bras alignés avec le dos' }));
  return keys;
}

export const seq = chain;

// Famille des SAUTS.
import { KW, chain } from './pose.js';
import { ST, crouch, takeoff, landing, finish } from './blocks.js';

/** Saut sur deux pieds : préparation, impulsion, position en l'air (air), réception. */
function jump({ air, airLabel, flight = 0.5, dist = 0.1, yaw = 0, landO = {}, extra = [] }) {
  const k = [...crouch()];
  k.push(takeoff({ yaw: 0 }));
  k[k.length - 1] = { ...k[k.length - 1], t: k[k.length - 2].t + 0.22, fly: dist };
  const t0 = k[k.length - 1].t;
  k.push(KW(t0 + flight * 0.5, { ...ST, an: 55, ff: 0, ...air, yaw: yaw / 2 }, { label: airLabel }));
  for (const e of extra) k.push(KW(t0 + flight * e.at, { ...ST, an: 55, ff: 0, ...e.pose }));
  k.sort((a, b) => a.t - b.t);
  k.push({ ...KW(t0 + flight * 0.86, { ...ST, ar: 170, fa: 170, an: 40, ff: 0, yaw, ...landO.pre }), });
  k.push(...landing(t0 + flight, { yaw, ...landO.pose }));
  return { keys: chain(k, finish(0.6, { yaw })), thumb: t0 + flight * 0.5 };
}

export const sautDroit = () => jump({ air: { ar: 178, fa: 178, sha: 8 }, airLabel: 'Corps tendu, bras en haut', flight: 0.45 });
export const sautDemiTour = () => jump({ air: { ar: 178, fa: 178, sha: 4 }, airLabel: 'Tourner d’un demi-tour, corps gainé', flight: 0.5, yaw: 180 });
export const sautTour = () => jump({ air: { ar: 178, fa: 178, sha: 2 }, airLabel: 'Tour complet : bras serrés, corps gainé', flight: 0.56, yaw: 360 });
export const sautGroupe = () => jump({
  air: { lean: -14, T: 14, th: 142, sn: 8, ar: 72, fa: 125, an: 50, nk: 15 }, airLabel: 'Genoux à la poitrine, jambes serrées', flight: 0.56,
  extra: [{ at: 0.22, pose: { ar: 150, fa: 150, th: 40, sn: 0 } }, { at: 0.74, pose: { th: 50, sn: -10, ar: 120, fa: 120 } }],
});
export const sautCarpeEcart = () => jump({
  air: { lean: -18, T: 18, th: 88, sn: 88, hpa: 44, ar: 98, fa: 98, sha: 24, an: 60 }, airLabel: 'Jambes tendues écartées qui montent, bras vers les pieds', flight: 0.56,
  extra: [{ at: 0.2, pose: { ar: 160, fa: 160, th: 20, sn: 20, hpa: 10 } }, { at: 0.76, pose: { th: 20, sn: 20, hpa: 8, ar: 150, fa: 150 } }],
});

/** Saut de chat : appel 1 pied, montée alternée des genoux. */
export const sautChat = () => ({
  keys: chain(
    [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
      KW(0.35, { ...ST, lean: 8, T: 10, thL: 30, snL: -30, thR: -20, snR: -20, ar: 60, fa: 80, fR: 0.4 }, { label: 'Un pas, fléchir' }),
      KW(0.6, { ...ST, lean: 4, T: 6, thL: 10, snL: 0, thR: 112, snR: -15, ar: 150, fa: 150, an: 50, ff: 0 }, { label: 'Monter un genou…', fly: 0.35 }),
      KW(0.82, { ...ST, lean: 0, T: 4, thL: 112, snL: -20, thR: 55, snR: -15, ar: 160, fa: 160, an: 50, ff: 0 }, { label: '… puis l’autre' }),
      KW(1.02, { ...ST, lean: 4, T: 6, thR: 20, snR: -10, thL: 40, snL: 0, an: 30, ar: 140, fa: 140, ff: 0 }),
      KW(1.15, { ...ST, lean: 10, T: 14, thR: 40, snR: -20, thL: 25, snL: -5, fR: 1, fL: 0.4, anL: 30, ar: 100, fa: 100 }, { land: true, label: 'Réception un pied puis l’autre' })],
    finish(0.6),
  ),
  thumb: 0.82,
});

/** Assemblé : jambe lancée, les deux jambes se rejoignent en l'air, réception 2 pieds. */
export const sautAssemble = () => ({
  keys: chain(
    [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
      KW(0.35, { ...ST, lean: 8, T: 10, thL: 35, snL: -25, thR: -15, snR: -15, ar: 40, fa: 50, fR: 0.4 }, { label: 'Un pas, fléchir la jambe d’appel' }),
      KW(0.58, { ...ST, lean: 0, T: 2, thL: 0, snL: 0, thR: 60, snR: 60, an: 50, ff: 0, ar: 120, fa: 120, sha: 30 }, { label: 'Lancer la jambe tendue', fly: 0.3 }),
      KW(0.8, { ...ST, lean: -6, T: 0, th: 30, sn: 30, an: 60, ff: 0, ar: 170, fa: 170 }, { label: 'Assembler les jambes tendues en l’air' }),
      KW(1.0, { ...ST, th: 5, sn: 5, an: 40, ff: 0, ar: 160, fa: 160 }),
      ...landing(1.12)],
    finish(0.6),
  ),
  thumb: 0.8,
});

/** Saut scissone (sissonne) : appel 2 pieds, jambes écartées avant / arrière, arrivée en arabesque. */
export const sautScissone = () => ({
  keys: chain(
    crouch(),
    [KW(0, {}),
      KW(0.22, { ...ST, lean: 4, T: 4, an: 40, ff: 0, ar: 120, fa: 120, sha: 40 }, { label: 'Impulsion 2 pieds', fly: 0.35 }),
      KW(0.45, { ...ST, lean: 10, T: 10, thL: 40, snL: 40, thR: -60, snR: -60, an: 60, ff: 0, ar: 90, fa: 90, sha: 80 }, { label: 'Jambes tendues, écartées avant / arrière' }),
      KW(0.68, { ...ST, lean: 14, T: 14, thL: 12, snL: 6, thR: -50, snR: -50, anR: 50, fR: 0, fL: 1, anL: 0, ar: 90, fa: 90, sha: 85 }, { land: true, label: 'Arriver en arabesque sur un pied' }),
      KW(1.4, { ...ST, lean: 16, T: 16, thL: 0, snL: 0, thR: -50, snR: -50, anR: 50, fR: 0, ar: 90, fa: 90, sha: 85 }, { label: 'Tenir l’arabesque' })],
    finish(0.6),
  ),
  thumb: 0.95,
});

/** Grand jeté : élan, appel 1 pied, grand écart en l'air en avançant. */
export const grandJete = () => ({
  keys: chain(
    [KW(0, { ...ST, ar: 10, fa: 30 }, { label: 'Deux pas d’élan' }),
      KW(0.32, { ...ST, lean: 6, T: 8, thR: 45, snR: 0, thL: -25, snL: -60, arR: -30, arL: 50, faL: 100, fR: 0.5, fL: 0, anL: 50 }),
      KW(0.62, { ...ST, lean: 8, T: 10, thL: 30, snL: -20, thR: -20, snR: -40, ar: 40, fa: 60, sha: 40, fL: 1, fR: 0, anR: 40 }, { label: 'Appel sur un pied' }),
      KW(0.82, { ...ST, lean: 8, T: 8, thR: 80, snR: 80, thL: -10, snL: -10, an: 55, ff: 0, ar: 100, fa: 100, sha: 60 }, { label: 'Lancer la jambe avant tendue', fly: 1.1 }),
      KW(1.07, { ...ST, lean: 6, T: 6, thR: 92, snR: 92, thL: -80, snL: -80, an: 60, ff: 0, ar: 95, fa: 95, sha: 80 }, { label: 'Grand écart en l’air, jambe avant à l’horizontale' }),
      KW(1.28, { ...ST, lean: 10, T: 10, thR: 30, snR: 25, thL: -60, snL: -60, anR: 20, anL: 60, ff: 0, ar: 95, fa: 95, sha: 80 }),
      KW(1.36, { ...ST, lean: 16, T: 16, thR: 30, snR: -10, thL: -45, snL: -55, fR: 1, fL: 0, anL: 50, ar: 90, fa: 90, sha: 85 }, { land: true, label: 'Réception sur la jambe avant' })],
    finish(0.6),
  ),
  thumb: 1.07,
});

/** Saut ciseau : appel 1 pied, jambes tendues lancées l'une après l'autre à l'horizontale. */
export const sautCiseau = () => ({
  keys: chain(
    [KW(0, { ...ST, ar: 10, fa: 30 }, { label: 'Un pas d’élan' }),
      KW(0.35, { ...ST, lean: 8, T: 8, thL: 30, snL: -20, thR: -20, snR: -40, ar: 40, fa: 60, sha: 50, fR: 0, anR: 40 }, { label: 'Appel sur un pied' }),
      KW(0.55, { ...ST, lean: -4, T: 0, thR: 92, snR: 92, thL: 0, snL: 0, an: 55, ff: 0, ar: 90, fa: 90, sha: 80 }, { label: 'Lancer une jambe tendue à l’horizontale', fly: 0.35 }),
      KW(0.75, { ...ST, lean: -6, T: -2, thR: 30, snR: 30, thL: 92, snL: 92, an: 55, ff: 0, ar: 90, fa: 90, sha: 80 }, { label: 'Puis l’autre, en ciseau' }),
      KW(0.92, { ...ST, lean: 6, T: 6, thR: 5, snR: -5, thL: 60, snL: 50, anR: 10, fR: 1, ff: 0, ar: 95, fa: 95, sha: 80 }, { land: true, label: 'Réception sur la première jambe' })],
    finish(0.6),
  ),
  thumb: 0.66,
});

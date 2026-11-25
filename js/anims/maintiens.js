// Famille des MAINTIENS (positions tenues 2 secondes).
import { KW, chain, hold } from './pose.js';
import { ST, ST_UP, HANDS, ALL4, finish } from './blocks.js';

/** Entrer dans une position, la tenir 2", en sortir. */
function tenue(into, pose, label, { holdT = 2, out, extraProps } = {}) {
  const k = chain(into, hold([KW(0, pose, { label })], holdT, { label: 'Tenir 2 secondes' }), out || finish(0.7));
  return { keys: k, thumb: into[into.length - 1].t + 0.6, props: extraProps };
}

export const arabesque = () => tenue(
  [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
    KW(0.7, { ...ST, lean: 22, T: 22, thL: 0, snL: 0, thR: -62, snR: -62, anR: 55, fR: 0, ar: 90, fa: 90, sha: 80, nk: -10 }, { label: 'Monter la jambe arrière tendue, bras écartés' })],
  { lean: 24, T: 22, thL: 0, snL: 0, thR: -68, snR: -68, anR: 55, fR: 0, ar: 90, fa: 90, sha: 82, nk: -10 }, 'Arabesque : jambe arrière décollée, bras écartés');

export const planche = () => tenue(
  [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
    KW(0.9, { ...ST, lean: 72, T: 78, thL: 0, snL: 0, thR: -88, snR: -88, anR: 55, fR: 0, ar: 120, fa: 120, sha: 70, nk: -25 }, { label: 'Basculer le buste, jambe libre à l’horizontale' })],
  { lean: 80, T: 84, thL: 0, snL: 0, thR: -92, snR: -92, anR: 55, fR: 0, ar: 120, fa: 120, sha: 75, nk: -28 }, 'Planche : jambe libre à l’horizontale, pied d’appui à plat');

export const planchEcart = () => tenue(
  [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
    KW(0.5, { ...ST, hpa: 28, ar: 90, fa: 90, sha: 85 }, { label: 'Écarter les jambes' }),
    KW(1.1, { ...ST, lean: 75, T: 88, th: 0, sn: 0, hpa: 32, ar: 90, fa: 90, sha: 88, nk: -30 }, { label: 'Buste à l’horizontale' })],
  { ...ST, lean: 78, T: 90, th: 0, sn: 0, hpa: 32, ar: 90, fa: 90, sha: 88, nk: -30 }, 'Jambes écartées, buste à l’horizontale',
  { out: [KW(0, {}), KW(0.6, { ...ST, hpa: 28, ar: 90, fa: 90, sha: 85 }), KW(1.1, { ...ST_UP }, { label: 'Se redresser' })] });

export const attitude = () => tenue(
  [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
    KW(0.7, { ...ST, lean: 8, T: 6, thL: 0, snL: 0, thR: -48, snR: -140, hpr: 30, anR: 55, fR: 0, arR: 170, faR: 170, arL: 90, faL: 90, shaL: 80, shaR: 15 }, { label: 'Lever la jambe arrière fléchie' })],
  { lean: 10, T: 8, thL: 0, snL: 0, thR: -52, snR: -145, anR: 55, fR: 0, arR: 170, faR: 170, arL: 90, faL: 90 }, 'Attitude : jambe d’appui tendue');

export const equilibreFessier = () => tenue(
  [KW(0, { ...ST, lean: -30, T: -10, th: 70, sn: -50, ar: 40, fa: 40, ff: 1 }, { label: 'Assis, genoux fléchis' }),
    KW(0.8, { lean: -42, T: -14, th: 50, sn: 50, an: 55, ff: 0, ar: 75, fa: 75, sha: 60, nk: 10 }, { label: 'Tendre les jambes à 45° minimum' })],
  { lean: -44, T: -15, th: 52, sn: 52, an: 55, ff: 0, ar: 75, fa: 75, sha: 70, nk: 10 }, 'Équilibre sur les fesses, jambes tendues',
  { out: [KW(0, {}), KW(0.7, { lean: -30, T: -10, th: 70, sn: -50, an: 0, ff: 1, ar: 40, fa: 40 }, { label: 'Reposer les pieds' })] });

export const chandelle = () => tenue(
  [KW(0, { ...ST, lean: -90, T: -90, th: 90, sn: 90, ar: 90, fa: 90, ff: 0, an: 40 }, { label: 'Allongé sur le dos, bras au sol' }),
    KW(0.6, { lean: -150, T: -95, th: 130, sn: 60, ar: 90, fa: 90, an: 45 }, { label: 'Rouler en arrière, genoux vers le front' }),
    KW(1.3, { lean: -180, T: -178, th: 180, sn: 180, ar: 92, fa: 92, an: 55, nk: 70 }, { label: 'Corps aligné vers le plafond' })],
  { lean: -180, T: -178, th: 180, sn: 180, ar: 92, fa: 92, an: 55, nk: 70 }, 'Chandelle : épaules au sol, corps aligné',
  { out: [KW(0, {}), KW(0.7, { lean: -150, T: -95, th: 130, sn: 60, nk: 20 }), KW(1.4, { lean: -90, T: -90, th: 90, sn: 90, ar: 90, fa: 90, nk: 0 }, { label: 'Dérouler le dos' })] });

export const pont = () => tenue(
  [KW(0, { ...ST, lean: -95, T: -90, th: 135, sn: 45, ar: 225, fa: 20, ff: 1, hf: 1, nk: 0 }, { label: 'Sur le dos, pieds et mains à plat (mains près des oreilles)', plant: ALL4 }),
    KW(1.0, { lean: -40, T: -150, th: 60, sn: -10, ar: -15, fa: -15, sha: 10, nk: -40 }, { label: 'Pousser bras et jambes : monter le ventre' })],
  { lean: -38, T: -155, th: 62, sn: -4, ar: -18, fa: -18, nk: -45 }, 'Pont : bras tendus, jambes serrées',
  { out: [KW(0, {}), KW(0.9, { lean: -95, T: -90, th: 135, sn: 45, ar: 225, fa: 20, nk: 0 }, { label: 'Redescendre doucement' }), KW(1.3, { lean: -95, T: -90, th: 135, sn: 45 }, { plant: [] })] });

export const equerreGroupee = () => tenue(
  [KW(0, { ...ST, lean: -10, T: 0, th: 80, sn: -40, ar: 0, fa: 0, hf: 1, wr: 80, ff: 1 }, { label: 'Assis, mains à plat près des hanches', plant: HANDS }),
    KW(0.7, { lean: -8, T: 8, th: 122, sn: 8, ar: -4, fa: -4, an: 45, ff: 0, nk: 10 }, { label: 'Pousser bras tendus : décoller fesses et pieds' })],
  { lean: -8, T: 8, th: 126, sn: 10, ar: -4, fa: -4, an: 45, ff: 0, nk: 10 }, 'Équerre groupée : bras tendus, jambes fléchies',
  { out: [KW(0, {}), KW(0.6, { lean: -10, T: 0, th: 80, sn: -40, ar: 0, fa: 0, an: 0, ff: 1 }, { label: 'Se reposer' }), KW(1.0, {}, { plant: [] })] });

export const equerre = () => tenue(
  [KW(0, { ...ST, lean: -10, T: 0, th: 90, sn: 90, an: 50, ff: 0, ar: 0, fa: 0, hf: 1, wr: 80 }, { label: 'Assis jambes tendues, mains à plat', plant: HANDS }),
    KW(0.8, { lean: -12, T: 2, th: 92, sn: 92, ar: -6, fa: -6, an: 55 }, { label: 'Bras tendus : décoller fesses et pieds' })],
  { lean: -14, T: 2, th: 94, sn: 94, ar: -6, fa: -6, an: 55 }, 'Équerre : jambes tendues à l’horizontale',
  { out: [KW(0, {}), KW(0.6, { lean: -10, T: 0, th: 90, sn: 90, ar: 0, fa: 0 }), KW(1.0, {}, { plant: [] })] });

export const yBalance = () => tenue(
  [KW(0, { ...ST, ar: 10, fa: 20 }, { label: 'Départ debout' }),
    KW(0.6, { ...ST, thR: 70, snR: -40, hpaR: 30, arR: 60, faR: 60, shaR: 30, arL: 90, faL: 90, shaL: 85 }, { label: 'Attraper le pied' }),
    KW(1.3, { ...ST, roll: -8, thR: 10, snR: 10, hpaR: 95, hpr: 30, arR: 15, faR: 15, shaR: 110, arL: 90, faL: 90, shaL: 85, anR: 55, fR: 0 }, { label: 'Tendre la jambe sur le côté' })],
  { roll: -8, thR: 10, snR: 10, hpaR: 100, arR: 15, faR: 15, shaR: 112, arL: 90, faL: 90, shaL: 85, anR: 55, fR: 0 }, 'Y : jambe libre tendue, pied dans la main');

export const grandEcart = () => tenue(
  [KW(0, { ...ST, ar: 90, fa: 90, sha: 85 }, { label: 'Départ en fente' }),
    KW(0.6, { ...ST, lean: 4, T: 4, thL: 50, snL: -10, thR: -30, snR: -30, anR: 30, fR: 0.5, ar: 90, fa: 90, sha: 85 }),
    KW(1.6, { lean: 0, T: 0, thL: 90, snL: 90, thR: -90, snR: -90, an: 55, ff: 0, ar: 90, fa: 90, sha: 88 }, { label: 'Glisser jusqu’au sol, jambes tendues' })],
  { lean: 0, T: 0, thL: 90, snL: 90, thR: -90, snR: -90, an: 55, ff: 0, ar: 175, fa: 175, sha: 10 }, 'Grand écart antéro-postérieur',
  { out: [KW(0, {}), KW(0.9, { lean: 4, T: 4, thL: 50, snL: -10, thR: -30, snR: -30, anR: 30, fR: 0.5, anL: 0, fL: 1, ar: 90, fa: 90, sha: 85 }, { label: 'Remonter en fente' }), KW(1.4, { ...ST_UP })] });

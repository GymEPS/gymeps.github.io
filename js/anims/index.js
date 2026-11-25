// Registre de toutes les animations : identifiant → définition (images clés + matériel).
import * as R from './renversements.js';
import * as S from './sauts.js';
import * as M from './maintiens.js';
import * as RO from './roulements.js';
import * as L from './liaisons.js';
import * as A from './acrobaties.js';
import { KITS, withKits } from './kits.js';

const defs = {
  // Renversements
  'placement-dos': R.placementDos,
  'trepied': R.trepied,
  'placement-dos-atr': () => R.placementDosATR(),
  'placement-dos-atr-tendu': () => R.placementDosATR({ straight: true }),
  'atr-revenir': () => R.atrRevenir(),
  'atr-roulade': () => R.atrRoulade(),
  'atr-tenu': R.atrTenu,
  'atr-demi-valse': () => R.atrValse(180),
  'atr-healy': R.atrHealy,
  'atr-valse': () => R.atrValse(360),
  // Sauts
  'saut-droit': S.sautDroit, 'saut-assemble': S.sautAssemble, 'saut-scissone': S.sautScissone, 'saut-demi-tour': S.sautDemiTour,
  'saut-chat': S.sautChat, 'saut-carpe-ecart': S.sautCarpeEcart, 'saut-groupe': S.sautGroupe, 'saut-tour': S.sautTour,
  'grand-jete': S.grandJete, 'saut-ciseau': S.sautCiseau,
  // Maintiens
  'equilibre-fessier': M.equilibreFessier, 'arabesque': M.arabesque, 'planche-ecart': M.planchEcart, 'attitude': M.attitude,
  'chandelle': M.chandelle, 'pont': M.pont, 'planche': M.planche, 'equerre-groupee': M.equerreGroupee, 'y': M.yBalance,
  'grand-ecart': M.grandEcart, 'equerre': M.equerre,
  // Roulements
  'roulade-avant': () => RO.rouladeAvant(),
  'roulade-arriere': () => RO.rouladeArriere(),
  'roulade-arriere-ecart': () => RO.rouladeArriere({ legs: 'ecart' }),
  'roulade-avant-ecart': () => RO.rouladeAvant({ legs: 'ecart' }),
  'roulade-arriere-tendue': () => RO.rouladeArriere({ legs: 'tendu' }),
  'roulade-avant-tendue': () => RO.rouladeAvant({ legs: 'tendu' }),
  'roulade-arriere-bras-tendus': () => RO.rouladeArriere({ legs: 'tendu', arms: 'tendus' }),
  'roulade-arriere-atr': () => RO.rouladeArriere({ atr: true, arms: 'tendus' }),
  // Liaisons et éléments chorégraphiques
  'grand-battement': L.grandBattement, 'demi-tour-pointes': L.demiTourPointes, 'pas-chasses': L.pasChasses,
  'ressort-groupe': L.ressortGroupe, 'tour-enveloppe': L.tourEnveloppe, 'demi-tour-appui': () => L.tourAppui(180),
  'cercles-jambe': () => L.cerclesJambe(2), 'ressort-tendu': L.ressortTendu, 'tour-appui': () => L.tourAppui(360),
  'demi-tour-pied': () => L.tourPied(180), 'tour-pied': () => L.tourPied(360), 'cercle-jambes': L.cercleJambes,
  // Acrobaties
  'roue': () => A.roue(), 'rondade': A.rondade, 'sursaut-roue': A.sursautRoue, 'sursaut-rondade': A.sursautRondade,
  'saut-tete': A.sautTete, 'pont-revenir': A.pontRevenir, 'souplesse-avant': A.souplesseAvant, 'souplesse-arriere': A.souplesseArriere,
  'saut-mains': A.sautMains, 'salto-avant-tremplin': A.saltoAvantTremplin,
  // Progressions (variantes avec matériel)
  'roulade-avant-plan': RO.rouladeAvantPlan, 'roulade-avant-bloc': RO.rouladeAvantBloc, 'roulade-avant-ecart-plan': RO.rouladeAvantEcartPlan,
  'redresse-ecart': RO.redresseEcart, 'saut-ange': A.sautAnge, 'saut-ange-tremplin': A.sautAngeTremplin,
  'roulade-arriere-plan': () => RO.rouladeArrierePlan(), 'roulade-arriere-ecart-plan': () => RO.rouladeArrierePlan({ legs: 'ecart' }),
  'roulade-arriere-tendue-plan': () => RO.rouladeArrierePlan({ legs: 'tendu', arms: 'tendus' }),
  'roulade-arriere-contrebas': RO.rouladeArriereContrebas,
  'atr-face-mur': R.atrFaceMur, 'placement-dos-atr-mur': R.placementDosAtrMur, 'atr-dos-mur': R.atrDosMur,
  'atr-plat-dos': () => R.atrPlatDos(), 'atr-impulsion': () => R.atrPlatDos({ impulsion: true }), 'atr-plat-ventre': R.atrPlatVentre,
  'saut-mains-trampo': A.sautMainsTrampo,
  'roue-obstacle': A.roueObstacle, 'roue-plinth-long': A.rouePlinthLong, 'roue-double': A.roueDouble,
  'rondade-trampo': A.rondadeTrampo, 'rondade-saut': A.rondadeSaut,
  'roulade-elevee-trampo': A.rouladeEleveeTrampo, 'salto-avant-assis': () => A.saltoAvantTrampo({ seated: true }),
  'salto-avant-trampo': () => A.saltoAvantTrampo(), 'salto-avant': A.saltoAvant,
  'tomber-dos': A.tomberDos, 'lancer-arriere': A.lancerArriere, 'flip': A.flip, 'rondade-flip': A.rondadeFlip, 'rondade-tomber-dos': A.rondadeTomberDos,
  'saut-arriere-plan': A.sautArrierePlan, 'salto-arriere-trampo': A.saltoArriereTrampo, 'salto-arriere-tremplin': A.saltoArriereTremplin,
  'salto-arriere': () => A.saltoArriere(), 'rondade-salto': A.rondadeSalto,
};

const made = new Map();
/** id = « animation » ou « animation+kit+kit » (matériel en plus, voir kits.js). */
export function animDef(id) {
  if (made.has(id)) return made.get(id);
  const [base, ...kits] = id.split('+');
  if (!defs[base] || kits.some(k => !KITS[k])) return null;
  let def = defs[base]();
  if (kits.length) def = withKits(def, kits);
  made.set(id, def);
  return def;
}
export const ANIM_IDS = Object.keys(defs);
export const hasAnim = id => { const [base, ...kits] = id.split('+'); return !!defs[base] && kits.every(k => KITS[k]); };

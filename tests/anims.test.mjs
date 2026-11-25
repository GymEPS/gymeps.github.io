// Contrôle de toutes les animations : node tests/anims.test.mjs
// - chaque animation se calcule sans erreur ni valeur NaN ;
// - aucune partie du corps ne s'enfonce dans le sol / le matériel de plus de 3 cm ;
// - les segments gardent leur longueur (pas de bras qui s'étire) ;
// - toutes les animations utilisées par les données existent.
import { animDef, ANIM_IDS, hasAnim } from '../js/anims/index.js';
import { bakeDef, surfaceAt, BODY } from '../js/engine/skeleton.js';
import { THEMES } from '../js/data/progressions.js';
import { FAMILLES } from '../js/data/familles.js';

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const RAD = { head: BODY.headR, root: 0.1, l1: 0.095, l2: 0.1, nb: 0.075 };
let fails = 0;
const report = [];
const KIT_IDS = [];
for (const t of THEMES) for (const n of t.niveaux) for (const a of [n.anim, ...n.remediations.map(r => r.anim)]) if (a.includes('+') && !KIT_IDS.includes(a)) KIT_IDS.push(a);
for (const id of [...ANIM_IDS, ...KIT_IDS]) {
  let b;
  try { b = bakeDef(animDef(id)); } catch (e) { console.log('ERREUR', id, e.message); fails++; continue; }
  let worst = 0, where = '', stretch = 0, nan = false;
  for (const f of b.frames) {
    for (const k in f.P) {
      const p = f.P[k];
      if (p.some(Number.isNaN)) nan = true;
      const r = RAD[k] ?? (k.startsWith('to') || k.startsWith('fi') ? 0.012 : 0.03);
      const pen = surfaceAt(b.props, p[0], p[2]) - (p[1] - r);
      if (pen > worst) { worst = pen; where = `${k} à ${f.t.toFixed(2)} s`; }
    }
    for (const S of ['R', 'L']) {
      stretch = Math.max(stretch, Math.abs(dist(f.P['sh' + S], f.P['el' + S]) - BODY.uarm), Math.abs(dist(f.P['el' + S], f.P['wr' + S]) - BODY.farm),
        Math.abs(dist(f.P['hp' + S], f.P['kn' + S]) - BODY.thigh), Math.abs(dist(f.P['kn' + S], f.P['an' + S]) - BODY.shin));
    }
  }
  const bad = nan || worst > 0.03 || stretch > 0.01;
  if (bad) fails++;
  report.push(`${bad ? '✗' : '✓'} ${id.padEnd(30)} ${b.T.toFixed(2)} s  enfoncement max ${(worst * 100).toFixed(1)} cm (${where})  étirement ${(stretch * 100).toFixed(1)} cm${nan ? '  NaN !' : ''}`);
}
console.log(report.join('\n'));
const used = new Set();
for (const t of THEMES) for (const n of t.niveaux) { used.add(n.anim); n.remediations.forEach(r => used.add(r.anim)); }
for (const f of FAMILLES) for (const e of f.elements) used.add(e.anim);
const missing = [...used].filter(id => !hasAnim(id));
if (missing.length) { console.log('Animations manquantes :', missing.join(', ')); fails++; }
console.log(fails ? `\n${fails} problème(s)` : '\nTout est bon');
process.exit(fails ? 1 : 0);

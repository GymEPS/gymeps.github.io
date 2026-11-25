// Analyse des à-coups : node tests/jitter.mjs [id…]
// Pour chaque animation, repère :
//  - « saut » : un point qui se déplace d'un coup beaucoup plus que juste avant et juste après (téléportation) ;
//  - « flip » : un coude ou un genou dont le sens de pliage se retourne brutalement d'une image à l'autre ;
//  - « tour » : un angle de pose qui fait plus de 200° entre deux images clés (membre qui tourne sur lui-même).
import { animDef, ANIM_IDS } from '../js/anims/index.js';
import { bakeDef, REST, CHANNELS } from '../js/engine/skeleton.js';

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = a => Math.hypot(a[0], a[1], a[2]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const POINTS = ['root', 'head', 'nb', 'l2', 'shR', 'shL', 'elR', 'elL', 'wrR', 'wrL', 'fiR', 'fiL', 'knR', 'knL', 'anR', 'anL', 'toR', 'toL', 'heR', 'heL'];
const ROOTCH = new Set(['lean', 'yaw', 'roll', 'x', 'z', 'fR', 'fL', 'hR', 'hL']);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ANIM_IDS;
let total = 0;
for (const id of ids) {
  const def = animDef(id);
  const b = bakeDef(def);
  const F = b.frames;
  const issues = [];
  // sauts de position
  for (let f = 1; f < F.length - 1; f++) {
    for (const k of POINTS) {
      const d0 = len(sub(F[f].P[k], F[f - 1].P[k]));
      const dm = len(sub(F[f - 1].P[k], (F[f - 2] || F[f - 1]).P[k]));
      const d1 = len(sub(F[f + 1].P[k], F[f].P[k]));
      if (d0 > 0.035 && d0 > 2.8 * Math.max(dm, d1, 0.004)) issues.push({ t: F[f].t, kind: 'saut', k, v: d0 });
    }
  }
  // retournement des coudes / genoux
  for (const [a, m, c] of [['shR', 'elR', 'wrR'], ['shL', 'elL', 'wrL'], ['hpR', 'knR', 'anR'], ['hpL', 'knL', 'anL']]) {
    let prev = null;
    for (let f = 0; f < F.length; f++) {
      const P = F[f].P;
      const u = sub(P[m], P[a]), w = sub(P[c], P[m]);
      const n = cross(u, w);
      const bend = len(n) / (len(u) * len(w));
      if (bend < 0.15) { prev = null; continue; } // presque tendu : pas de sens
      const nn = n.map(x => x / len(n));
      if (prev && dot(prev, nn) < -0.2) issues.push({ t: F[f].t, kind: 'flip', k: m, v: dot(prev, nn) });
      prev = nn;
    }
  }
  // grands tours d'un angle entre deux clés
  let prevC = { ...REST };
  def.keys.forEach((key, i) => {
    const c = { ...prevC, ...key.c };
    if (i) for (const ch of CHANNELS) if (!ROOTCH.has(ch) && Math.abs(c[ch] - prevC[ch]) > 200) issues.push({ t: key.t, kind: 'tour', k: ch, v: c[ch] - prevC[ch] });
    prevC = c;
  });
  // on regroupe les problèmes proches
  const seen = new Set();
  const uniq = issues.filter(x => { const key = x.kind + x.k + Math.round(x.t * 5); if (seen.has(key)) return false; seen.add(key); return true; });
  total += uniq.length;
  if (uniq.length) console.log(`${id.padEnd(28)} ${uniq.length} : ` + uniq.slice(0, 8).map(x => `${x.kind} ${x.k}@${x.t.toFixed(2)}(${x.v.toFixed(2)})`).join(', ') + (uniq.length > 8 ? ' …' : ''));
}
console.log(`\nTotal : ${total} problème(s)`);

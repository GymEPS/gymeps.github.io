// Enchaînement : plusieurs figures jouées à la suite dans UNE animation.
// Chaque figure reprend où la précédente s'est arrêtée (rotation, déplacement) ; entre deux figures, une courte transition
// ramène debout, face au sens du déplacement.
import { animDef } from './index.js';
import { K } from './pose.js';
import { REST } from '../engine/skeleton.js';

const STAND = { sp: 0, nk: 0, sh: [0, 8, 0], el: 10, wr: 0, hp: [0, 0, 0], kn: 0, an: 0, ff: 1, hf: 0, roll: 0 };
const round360 = a => Math.round(a / 360) * 360;

/** Instant d'une ancre de matériel ('land', 'plant:handL', 'fly#2'…) dans les clés d'une figure. */
function resolveAt(keys, at) {
  if (typeof at !== 'string') return at;
  const [kindN, eff] = at.split(':');
  const [kind, nth = '1'] = kindN.split('#');
  const hits = keys.filter(q => (kind === 'plant' ? q.plant && q.plant.includes(eff) : q[kind] !== undefined && q[kind] !== false));
  const n = +nth;
  const k = n < 0 ? hits[hits.length + n] : hits[n - 1];
  return k ? k.t : 0;
}

/** items = [{ anim, nom }] → définition d'animation unique. */
export function buildSequence(items) {
  const keys = [];
  const props = [];
  let t = 0;
  let cur = { ...REST };
  items.forEach((it, i) => {
    const def = animDef(it.anim);
    if (!def) return;
    const L = round360(cur.lean), Y = round360(cur.yaw), X = cur.x || 0;
    if (i > 0) {
      // transition : se relever / se retourner, face au sens du déplacement
      t += 0.9;
      const c = { ...K(0, { ...STAND }).c, lean: L, yaw: Y, x: X };
      keys.push({ t, c, plant: [], drive: false });
      cur = { ...cur, ...c };
      t += 0.25;
      keys.push({ t, c: {}, plant: [] });
    }
    const t0 = t - def.keys[0].t;
    def.keys.forEach((k, j) => {
      const c = { ...k.c };
      if (c.lean !== undefined) c.lean += L;
      if (c.yaw !== undefined) c.yaw += Y;
      if (c.x !== undefined) c.x += X;
      if (j === 0) { if (c.lean === undefined) c.lean = L; if (c.yaw === undefined) c.yaw = Y; if (c.x === undefined) c.x = X; }
      const nk = { ...k, t: t0 + k.t, c, label: j === 0 ? `${i + 1}. ${it.nom}` : undefined };
      if (j === 0 && i > 0) nk.t = Math.max(nk.t, t + 0.05);
      keys.push(nk);
      cur = { ...cur, ...c };
    });
    for (const p of def.props || []) {
      const q = { ...p };
      if (q.at !== undefined) q.at = t0 + resolveAt(def.keys, q.at);
      props.push(q);
    }
    t = keys[keys.length - 1].t;
  });
  // les clés doivent rester dans l'ordre du temps
  for (let i = 1; i < keys.length; i++) if (keys[i].t <= keys[i - 1].t) keys[i].t = keys[i - 1].t + 0.02;
  keys.push({ t: keys[keys.length - 1].t + 0.6, c: {}, label: 'Fin : salut !' });
  return { keys, props, thumb: 1 };
}

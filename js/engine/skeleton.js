// Squelette 3D d'un·e gymnaste de 4e (≈ 1,63 m) : cinématique directe, appuis, cinématique inverse, et « cuisson »
// d'une animation (images précalculées à 60 par seconde) avec une petite physique :
//  - au sol : le point le plus bas touche le sol (ou le matériel) et ne glisse pas → les roulades avancent toutes seules ;
//  - appuis fixés (`plant`) : mains / pieds restent collés où ils se sont posés (cinématique inverse à 2 segments) ;
//  - en vol (`fly` … `land`) : trajectoire balistique réelle (gravité 9,81 m/s²) entre l'appel et la réception.
import { DEG, add, sub, scl, dot, cross, len, norm, lerp, clamp, mm, mv, mtv, rx, ry, rz, col, rotBetween, monotone } from './math3.js';

export const BODY = {
  hip: [0, -0.045, 0.085], thigh: 0.41, shin: 0.4,
  heel: [-0.045, -0.06, 0], toe: [0.15, -0.055, 0],
  lumbar: [0, 0.06, 0], spine1: 0.17, spine2: 0.19, neck: 0.085, head: [0.012, 0.1, 0], headR: 0.1,
  shoulder: [-0.01, -0.035, 0.15], uarm: 0.27, farm: 0.24, hand: 0.165,
};

// Canaux (degrés). Colonne : l1 = lombaires, l2 = dorsales, n = cou ; f = flexion avant, b = inclinaison côté droit, t = torsion.
// Bras : sh f = élévation avant (180 = bras en haut), a = écart latéral, r = rotation ; el = coude ; wr = poignet.
// Jambes : hp f = flexion (cuisse vers l'avant), a = écart, r = rotation ; kn = genou ; an = pointe de pied.
// fR / fL / hR / hL = pied / main posé à plat (0 à 1). Racine : lean = bascule avant (360 = tour complet),
// yaw = rotation autour du corps (vers la gauche +), roll = bascule vers la droite, x / z = décalage voulu.
export const CHANNELS = [
  'l1f', 'l1b', 'l1t', 'l2f', 'l2b', 'l2t', 'nf', 'nb', 'nt',
  'shRf', 'shRa', 'shRr', 'elR', 'wrR', 'shLf', 'shLa', 'shLr', 'elL', 'wrL',
  'hpRf', 'hpRa', 'hpRr', 'knR', 'anR', 'hpLf', 'hpLa', 'hpLr', 'knL', 'anL',
  'fR', 'fL', 'hR', 'hL', 'lean', 'yaw', 'roll', 'x', 'z',
];
export const REST = Object.fromEntries(CHANNELS.map(c => [c, 0]));
Object.assign(REST, { shRa: 6, shLa: 6, elR: 8, elL: 8, fR: 1, fL: 1 });

const ball = (f, a, r, s) => mm(rz(f * DEG), mm(rx(-s * a * DEG), ry(r * DEG)));
const spine = (f, b, t) => mm(rz(-f * DEG), mm(rx(b * DEG), ry(t * DEG)));
export const rootRot = c => mm(rz(-c.lean * DEG), mm(ry(c.yaw * DEG), rx(c.roll * DEG)));
const UP = [0, 1, 0];
const horiz = v => { const h = [v[0], 0, v[2]]; return len(h) > 1e-4 ? norm(h) : null; };

/** Cinématique directe. Renvoie les points (P) et repères (F) de chaque segment. */
export function fk(c, rootPos) {
  const P = {}, F = {};
  const R0 = rootRot(c);
  P.root = rootPos; F.root = R0;
  F.l1 = mm(R0, spine(c.l1f, c.l1b, c.l1t));
  P.l1 = add(rootPos, mv(R0, BODY.lumbar));
  P.l2 = add(P.l1, mv(F.l1, [0, BODY.spine1, 0]));
  F.l2 = mm(F.l1, spine(c.l2f, c.l2b, c.l2t));
  P.nb = add(P.l2, mv(F.l2, [0, BODY.spine2, 0]));
  F.head = mm(F.l2, spine(c.nf, c.nb, c.nt));
  P.hj = add(P.nb, mv(F.head, [0, BODY.neck, 0]));
  P.head = add(P.hj, mv(F.head, BODY.head));
  for (const S of ['R', 'L']) {
    const s = S === 'R' ? 1 : -1;
    const f = c['sh' + S + 'f'];
    const lift = 0.035 * clamp((f - 60) / 110, 0, 1) + 0.02 * clamp((c['sh' + S + 'a'] - 60) / 60, 0, 1);
    P['sh' + S] = add(P.nb, mv(F.l2, [BODY.shoulder[0], BODY.shoulder[1] + lift, s * BODY.shoulder[2]]));
    F['sh' + S] = mm(F.l2, ball(f, c['sh' + S + 'a'], c['sh' + S + 'r'], s));
    P['el' + S] = add(P['sh' + S], mv(F['sh' + S], [0, -BODY.uarm, 0]));
    F['el' + S] = mm(F['sh' + S], rz(c['el' + S] * DEG));
    P['wr' + S] = add(P['el' + S], mv(F['el' + S], [0, -BODY.farm, 0]));
    F['wr' + S] = mm(F['el' + S], rz(c['wr' + S] * DEG));
    P['fi' + S] = add(P['wr' + S], mv(F['wr' + S], [0, -BODY.hand, 0]));
    P['hp' + S] = add(rootPos, mv(R0, [BODY.hip[0], BODY.hip[1], s * BODY.hip[2]]));
    F['hp' + S] = mm(R0, ball(c['hp' + S + 'f'], c['hp' + S + 'a'], c['hp' + S + 'r'], s));
    P['kn' + S] = add(P['hp' + S], mv(F['hp' + S], [0, -BODY.thigh, 0]));
    F['kn' + S] = mm(F['hp' + S], rz(-c['kn' + S] * DEG));
    P['an' + S] = add(P['kn' + S], mv(F['kn' + S], [0, -BODY.shin, 0]));
    F['an' + S] = mm(F['kn' + S], rz(-c['an' + S] * DEG));
    P['he' + S] = add(P['an' + S], mv(F['an' + S], BODY.heel));
    P['to' + S] = add(P['an' + S], mv(F['an' + S], BODY.toe));
  }
  flatten(P, F, c);
  return { P, F };
}

/** Pieds et mains posés à plat (poids fR / fL / hR / hL) : semelle / paume horizontale, dans l'axe du tibia / de l'avant-bras. */
function flatten(P, F, c) {
  for (const S of ['R', 'L']) {
    const wf = c['f' + S];
    if (wf > 0.001) {
      const h = horiz(col(F['kn' + S], 0)) || horiz(sub(P['to' + S], P['he' + S])) || [1, 0, 0];
      const he = add(P['an' + S], add(scl(h, -0.045), [0, -0.062, 0]));
      const to = add(P['an' + S], add(scl(h, 0.15), [0, -0.062, 0]));
      P['he' + S] = lerp(P['he' + S], he, wf);
      P['to' + S] = lerp(P['to' + S], to, wf);
    }
    const wh = c['h' + S];
    if (wh > 0.001) {
      const h = horiz(col(F['el' + S], 0)) || horiz(sub(P['fi' + S], P['wr' + S])) || [1, 0, 0];
      const fi = add(P['wr' + S], add(scl(h, BODY.hand - 0.005), [0, -0.018, 0]));
      P['fi' + S] = lerp(P['fi' + S], fi, wh);
    }
  }
}

// Éléments de contact avec le sol : point, rayon, segment porteur (repère + origine) pour suivre le point « matière » quand on roule.
const CONTACTS = [];
for (const S of ['R', 'L']) {
  CONTACTS.push(
    { p: 'to' + S, r: 0.016, f: 'an' + S, o: 'an' + S }, { p: 'he' + S, r: 0.024, f: 'an' + S, o: 'an' + S },
    { p: 'an' + S, r: 0.042, f: 'an' + S, o: 'an' + S }, { p: 'kn' + S, r: 0.05, f: 'kn' + S, o: 'kn' + S },
    { p: 'mk' + S, r: 0.045, f: 'kn' + S, o: 'kn' + S }, { p: 'mt' + S, r: 0.062, f: 'hp' + S, o: 'hp' + S },
    { p: 'fi' + S, r: 0.012, f: 'wr' + S, o: 'wr' + S }, { p: 'wr' + S, r: 0.028, f: 'wr' + S, o: 'wr' + S },
    { p: 'el' + S, r: 0.036, f: 'el' + S, o: 'el' + S }, { p: 'ma' + S, r: 0.04, f: 'sh' + S, o: 'sh' + S },
    { p: 'sh' + S, r: 0.055, f: 'l2', o: 'l2' }, { p: 'hp' + S, r: 0.08, f: 'root', o: 'root' },
  );
}
CONTACTS.push(
  { p: 'root', r: 0.1, f: 'root', o: 'root' }, { p: 'bt', r: 0.085, f: 'root', o: 'root' },
  { p: 'l1', r: 0.095, f: 'l1', o: 'l1' }, { p: 'm1', r: 0.095, f: 'l1', o: 'l1' },
  { p: 'l2', r: 0.1, f: 'l2', o: 'l2' }, { p: 'm2', r: 0.105, f: 'l2', o: 'l2' }, { p: 'nb', r: 0.075, f: 'l2', o: 'l2' },
  { p: 'hj', r: 0.06, f: 'head', o: 'hj' }, { p: 'head', r: BODY.headR, f: 'head', o: 'hj' },
);
function addMids(P, F) {
  for (const S of ['R', 'L']) {
    P['mk' + S] = lerp(P['kn' + S], P['an' + S], 0.5);
    P['mt' + S] = lerp(P['hp' + S], P['kn' + S], 0.5);
    P['ma' + S] = lerp(P['sh' + S], P['el' + S], 0.5);
  }
  P.m1 = lerp(P.l1, P.l2, 0.5);
  P.m2 = lerp(P.l2, P.nb, 0.5);
  P.bt = add(P.root, mv(F.root, [-0.05, -0.06, 0])); // fesses
}

/** Surface du sol et du matériel. props = [{ k:'box'|'wedge', x0, x1, z0, z1, h | h0, h1 }] */
export function surfaceAt(props, x, z) {
  let y = 0;
  for (const p of props || []) {
    if (p.solid === false) continue;
    if (x < p.x0 || x > p.x1 || z < p.z0 || z > p.z1) continue;
    const top = p.k === 'wedge' ? p.h0 + (p.h1 - p.h0) * (x - p.x0) / (p.x1 - p.x0) : p.h;
    if (top > y) y = top;
  }
  return y;
}

function lowest(P, props, skip) {
  let best = null;
  for (const e of CONTACTS) {
    if (skip && skip(e)) continue;
    const q = P[e.p];
    const cl = q[1] - e.r - surfaceAt(props, q[0], q[2]);
    if (!best || cl < best.cl) best = { e, cl };
  }
  return best;
}
const shiftAll = (P, d) => { for (const k in P) P[k] = add(P[k], d); };

/** Bouts des mains / pieds qui passeraient sous la surface : on les relève en gardant la longueur (la main / le pied se pose à plat). */
function clampDistal(P, props) {
  const fix = (tip, base, r) => {
    const q = P[tip], b = P[base];
    const s = surfaceAt(props, q[0], q[2]) + r;
    if (q[1] >= s) return;
    const L = len(sub(q, b));
    const dy = s - b[1];
    let h = [q[0] - b[0], 0, q[2] - b[2]];
    const hl = len(h);
    h = hl > 1e-5 ? scl(h, 1 / hl) : [1, 0, 0];
    const hor = Math.sqrt(Math.max(0, L * L - dy * dy));
    P[tip] = [b[0] + h[0] * hor, s, b[2] + h[2] * hor];
  };
  for (const S of ['R', 'L']) {
    fix('fi' + S, 'wr' + S, 0.012);
    fix('to' + S, 'an' + S, 0.016);
    fix('he' + S, 'an' + S, 0.024);
  }
}

// Cinématique inverse à 2 segments : épaule→coude→poignet ou hanche→genou→cheville. Le plan de flexion suit la pose de départ.
const CHAINS = {
  handR: ['shR', 'elR', 'wrR', ['fiR'], BODY.uarm, BODY.farm], handL: ['shL', 'elL', 'wrL', ['fiL'], BODY.uarm, BODY.farm],
  footR: ['hpR', 'knR', 'anR', ['heR', 'toR'], BODY.thigh, BODY.shin], footL: ['hpL', 'knL', 'anL', ['heL', 'toL'], BODY.thigh, BODY.shin],
};
export function solveIK(P, eff, target) {
  const [a, b, c, tips, l1, l2] = CHAINS[eff];
  const A = P[a], B0 = P[b], C0 = P[c];
  let d = sub(target, A);
  let dl = len(d);
  const dmax = l1 + l2 - 1e-4, dmin = Math.abs(l1 - l2) + 0.02;
  const dc = clamp(dl, dmin, dmax);
  const dir = dl > 1e-6 ? scl(d, 1 / dl) : [0, -1, 0];
  let pole = sub(B0, A);
  pole = sub(pole, scl(dir, dot(pole, dir)));
  if (len(pole) < 1e-5) pole = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  pole = norm(pole);
  const x = (l1 * l1 - l2 * l2 + dc * dc) / (2 * dc);
  const h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  const B = add(A, add(scl(dir, x), scl(pole, h)));
  const C = add(A, scl(dir, dc));
  const rot = rotBetween(norm(sub(C0, B0)), norm(sub(C, B)));
  for (const t of tips) P[t] = add(C, mv(rot, sub(P[t], C0)));
  P[b] = B; P[c] = C;
}
const EFF_POINT = { handR: 'wrR', handL: 'wrL', footR: 'anR', footL: 'anL' };

// ---------------------------------------------------------------- Images clés → animation cuite
/**
 * anim = { keys: [{ t, ...canaux (via pose()), label?, plant?: ['handR', …], fly?: distance horizontale, land?: true }], props?, end? }
 * Les canaux non donnés reprennent la valeur de l'image clé précédente.
 */
export function bake(anim, fps = 60) {
  const keys = anim.keys;
  const props = anim.props || [];
  let prev = { ...REST };
  const full = keys.map(k => (prev = { ...prev, ...k.c }));
  const splines = {};
  const ts = keys.map(k => k.t);
  for (const ch of CHANNELS) splines[ch] = monotone(ts, full.map(f => f[ch]));
  const chAt = t => { const c = {}; for (const ch of CHANNELS) c[ch] = splines[ch](t); return c; };
  // états discrets (appuis, vols) par intervalle de clés
  let plant = [];
  const seg = keys.map((k, i) => {
    if (k.plant) plant = k.plant;
    return { plant, fly: k.fly, flyTo: k.fly !== undefined ? keys.findIndex((q, j) => j > i && q.land) : -1 };
  });
  // un vol dure de la clé d'appel jusqu'à la clé de réception, même s'il y a des clés entre les deux
  seg.forEach((s, i) => { if (s.fly !== undefined && s.flyTo > i) for (let k = i; k < s.flyTo; k++) seg[k].fl = i; });
  const T = keys[keys.length - 1].t;
  const n = Math.round(T * fps) + 1;
  const frames = [];
  let off = [0, 0, 0];
  let contact = null; // { e, local } point « matière » au contact au pas précédent
  let pins = {};
  let flight = null;
  for (let f = 0; f < n; f++) {
    const t = Math.min(T, f / fps);
    let ki = 0;
    while (ki < keys.length - 1 && t >= keys[ki + 1].t) ki++;
    const S0 = seg[ki];
    const S = S0.fl !== undefined ? { ...S0, fly: seg[S0.fl].fly, flyTo: seg[S0.fl].flyTo, flyKey: S0.fl } : S0;
    const c = chAt(t);
    let base = [c.x + off[0], 1, c.z + off[2]];
    let { P, F } = fk(c, base);
    addMids(P, F);
    // --- vol balistique
    if (S.fly !== undefined && S.flyTo > ki && t < keys[S.flyTo].t) {
      if (!flight || flight.ki !== S.flyKey) {
        const t0 = keys[S.flyKey].t, t1 = keys[S.flyTo].t;
        const x0 = frames.length ? frames[frames.length - 1].P.root : P.root;
        const c1 = chAt(t1);
        const x1 = [x0[0] + S.fly, 0, x0[2]];
        // hauteur de racine à la réception : on pose la pose d'arrivée au sol, à l'endroit d'arrivée
        const probe = fk(c1, [x1[0], 1, x1[2]]); addMids(probe.P, probe.F);
        const lo = lowest(probe.P, props);
        flight = { ki: S.flyKey, t0, t1, x0: [...x0], x1, y1: 1 - lo.cl, base0: c.x, base1: c1.x };
        pins = {}; contact = null;
      }
      const u = (t - flight.t0) / (flight.t1 - flight.t0);
      const Tf = flight.t1 - flight.t0;
      const y = flight.x0[1] + (flight.y1 - flight.x0[1]) * u + 0.5 * 9.81 * Tf * Tf * u * (1 - u);
      const target = [flight.x0[0] + (flight.x1[0] - flight.x0[0]) * u, y, flight.x0[2]];
      shiftAll(P, sub(target, P.root));
      const lo = lowest(P, props);
      if (lo.cl < 0) shiftAll(P, [0, -lo.cl, 0]);
      off = [P.root[0] - c.x, 0, P.root[2] - c.z];
    } else {
      if (flight) { flight = null; contact = null; }
      // --- appui au sol : le plus bas touche, sans glisser
      const lo = lowest(P, props);
      shiftAll(P, [0, -lo.cl, 0]);
      if (contact) {
        const now = add(P[contact.e.o], mv(F[contact.e.f], contact.local));
        const d = sub(contact.world, now);
        shiftAll(P, [d[0], 0, d[2]]);
      }
      // --- appuis fixés (mains / pieds)
      const wanted = S.plant || [];
      for (const k of Object.keys(pins)) if (!wanted.includes(k)) delete pins[k];
      for (const eff of wanted) {
        if (pins[eff]) continue;
        const q = P[EFF_POINT[eff]];
        const keepY = anim.pinAir && anim.pinAir.includes(eff); // appui sur un mur, une barre… : on garde la hauteur
        pins[eff] = keepY ? [...q] : [q[0], surfaceAt(props, q[0], q[2]) + (eff.startsWith('hand') ? 0.032 : 0.078), q[2]];
      }
      const effs = Object.keys(pins);
      if (effs.length) {
        // le corps reste posé sur ses appuis ; on ne le déplace que si un bras / une jambe ne peut pas atteindre son appui
        for (let it = 0; it < 4; it++) {
          let d = [0, 0, 0], nOut = 0;
          for (const eff of effs) {
            const [base, , , , l1, l2] = CHAINS[eff];
            const v = sub(pins[eff], P[base]);
            const L = len(v), reach = l1 + l2 - 0.004;
            if (L > reach) { d = add(d, scl(v, 1 - reach / L)); nOut++; }
          }
          if (!nOut) break;
          shiftAll(P, scl(d, 1 / nOut));
        }
        for (const eff of effs) solveIK(P, eff, pins[eff]);
        addMids(P, F);
        for (let it = 0; it < 5; it++) { // une autre partie du corps s'enfonce : on remonte et on retend les bras / jambes
          const lo2 = lowest(P, props);
          if (lo2.cl > -0.002) break;
          shiftAll(P, [0, -lo2.cl, 0]);
          for (const eff of effs) solveIK(P, eff, pins[eff]);
          addMids(P, F);
        }
      }
      off = [P.root[0] - c.x, 0, P.root[2] - c.z];
      const lo3 = lowest(P, props);
      const q = P[lo3.e.p];
      const world = [q[0], q[1] - lo3.e.r, q[2]];
      contact = { e: lo3.e, world, local: mtv(F[lo3.e.f], sub(world, P[lo3.e.o])) };
    }
    clampDistal(P, props);
    frames.push({ t, P, head: { fwd: col(F.head, 0), up: col(F.head, 1), right: col(F.head, 2) }, c });
  }
  // phases (étiquettes)
  const phases = [];
  keys.forEach(k => { if (k.label) phases.push({ t: k.t, label: k.label }); });
  return { frames, fps, T, props, phases, thumb: anim.thumb };
}

/**
 * Cuisson avec matériel « posé là où il faut » : un objet { at: t, ref: 'root'|'wrL'|…, dx, x0: 0, x1: largeur }
 * est placé à la position horizontale du point `ref` à l'instant t (premier calcul sans lui), puis on recalcule.
 */
export function bakeDef(def) {
  const props = def.props || [];
  if (!props.some(p => p.at !== undefined)) return bake(def);
  const pre = bake({ ...def, props: props.filter(p => p.at === undefined) });
  const placed = props.map(p => {
    if (p.at === undefined) return p;
    let at = p.at;
    if (typeof at === 'string') { // 'plant:handL' = 1re pose de cette main ; 'land' = 1re réception ; 'fly' = 1er appel
      const [kind, eff] = at.split(':');
      const k = def.keys.find(q => (kind === 'plant' ? q.plant && q.plant.includes(eff) : q[kind] !== undefined && q[kind] !== false));
      at = k ? k.t : 0;
    }
    const f = pre.frames[Math.min(pre.frames.length - 1, Math.round(at * pre.fps))];
    const x = f.P[p.ref || 'root'][0] + (p.dx || 0);
    return { ...p, x0: x + p.x0, x1: x + p.x1, at: undefined };
  });
  return bake({ ...def, props: placed });
}

/** Image interpolée à l'instant t (en secondes). */
export function frameAt(b, t) {
  const x = clamp(t, 0, b.T) * b.fps;
  const i = Math.min(b.frames.length - 1, Math.floor(x));
  const j = Math.min(b.frames.length - 1, i + 1);
  const u = x - i;
  const A = b.frames[i], B = b.frames[j];
  if (u < 1e-3 || i === j) return A;
  const P = {};
  for (const k in A.P) P[k] = lerp(A.P[k], B.P[k], u);
  return { t, P, head: { fwd: lerp(A.head.fwd, B.head.fwd, u), up: lerp(A.head.up, B.head.up, u), right: lerp(A.head.right, B.head.right, u) } };
}

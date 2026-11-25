// Dessin d'une image : sol (praticable), matériel, ombre, gymnaste en volume (segments ombrés triés par profondeur), visage.
import { add, sub, scl, dot, cross, norm, lerp, len, DEG } from './math3.js';

export const VIEWS = {
  profil: { yaw: 0, pitch: 6, label: 'Profil' },
  trois: { yaw: 38, pitch: 16, label: '3/4' },
  face: { yaw: 90, pitch: 6, label: 'Face' },
  dessus: { yaw: 0, pitch: 80, label: 'Dessus' },
};

export function camera(yaw, pitch, target, dist = 9) {
  const y = yaw * DEG, p = pitch * DEG;
  const dir = [Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p)];
  const eye = add(target, scl(dir, dist));
  const fwd = scl(dir, -1);
  let right = norm(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  return { eye, fwd, right, up, dist, toCam: dir, scale: 1, cx: 0, cy: 0 };
}
export function project(cam, p) {
  const v = sub(p, cam.eye);
  const z = dot(v, cam.fwd);
  const k = cam.dist / Math.max(0.5, z);
  return [cam.cx + dot(v, cam.right) * k * cam.scale, cam.cy - dot(v, cam.up) * k * cam.scale, z, k * cam.scale];
}

/** Cadre la caméra pour que toute l'animation tienne dans w × h. */
export function fitCamera(cam, baked, w, h, pad = 0.1) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  const step = Math.max(1, Math.floor(baked.frames.length / 40));
  const pts = [];
  for (let i = 0; i < baked.frames.length; i += step) { const P = baked.frames[i].P; for (const k of ['head', 'toR', 'toL', 'fiR', 'fiL', 'root', 'knR', 'knL']) pts.push(P[k]); }
  for (const pr of baked.props || []) if (!pr.deco) for (const q of boxCorners(pr)) pts.push(q);
  const save = { ...cam };
  cam.scale = 1; cam.cx = 0; cam.cy = 0;
  for (const p of pts) { const [x, y] = project(cam, p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const bw = Math.max(0.9, x1 - x0) + 0.3, bh = Math.max(1.0, y1 - y0) + 0.3;
  cam.scale = Math.min(w * (1 - pad * 2) / bw, h * (1 - pad * 2) / bh);
  cam.cx = w / 2 - ((x0 + x1) / 2) * cam.scale;
  cam.cy = h / 2 - ((y0 + y1) / 2) * cam.scale + h * 0.02;
  void save;
  return cam;
}

// ---------------------------------------------------------------- couleurs
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const WHITE = [255, 255, 255], BLACK = [8, 10, 18];

export const LOOK = {
  skin: '#e9b48c', hair: '#3b2a20', suit: '#22d3ee', suitDark: null, eye: '#1d1d22',
};

// ---------------------------------------------------------------- matériel
function boxCorners(p) {
  const h0 = p.k === 'wedge' ? p.h0 : p.h, h1 = p.k === 'wedge' ? p.h1 : p.h;
  const b = p.y0 || 0;
  return [[p.x0, b, p.z0], [p.x1, b, p.z0], [p.x1, b, p.z1], [p.x0, b, p.z1], [p.x0, b + h0, p.z0], [p.x1, b + h1, p.z0], [p.x1, b + h1, p.z1], [p.x0, b + h0, p.z1]];
}
const FACES = [[0, 1, 2, 3, 'b'], [4, 7, 6, 5, 't'], [0, 4, 5, 1, 's'], [3, 2, 6, 7, 's'], [0, 3, 7, 4, 'e'], [1, 5, 6, 2, 'e']];
function propPolys(cam, p) {
  const C = boxCorners(p);
  const col = hex(p.color || '#3b82f6');
  const out = [];
  for (const f of FACES) {
    const q = f.slice(0, 4).map(i => C[i]);
    const nrm = norm(cross(sub(q[1], q[0]), sub(q[3], q[0])));
    const ctr = scl(add(add(q[0], q[1]), add(q[2], q[3])), 0.25);
    const outward = sub(ctr, [(p.x0 + p.x1) / 2, (p.y0 || 0) + 0.2, (p.z0 + p.z1) / 2]);
    const n2 = dot(nrm, outward) < 0 ? scl(nrm, -1) : nrm;
    if (dot(n2, sub(cam.eye, ctr)) <= 0) continue;
    const light = 0.55 + 0.45 * Math.max(0, dot(n2, norm([-0.4, 1, 0.6])));
    const fill = rgb(mixc(BLACK, col, light));
    const pts = q.map(v => project(cam, v));
    out.push({ z: project(cam, ctr)[2] + (f[4] === 't' ? 0.05 : 0.1), draw: g => poly(g, pts, fill, p.line !== false ? rgb(mixc(col, WHITE, 0.35), 0.5) : null) });
  }
  return out;
}
function poly(g, pts, fill, stroke) {
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
  g.closePath();
  g.fillStyle = fill; g.fill();
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1; g.stroke(); }
}

// ---------------------------------------------------------------- corps
/** Segment en volume (capsule qui s'affine), ombré dans la largeur. */
function capsule(g, A, B, ra, rb, col, alpha = 1, flat = false) {
  const dx = B[0] - A[0], dy = B[1] - A[1];
  const L = Math.hypot(dx, dy);
  g.beginPath();
  if (L < Math.abs(ra - rb) + 0.5) {
    const r = Math.max(ra, rb); const C = ra > rb ? A : B;
    g.arc(C[0], C[1], r, 0, Math.PI * 2);
  } else {
    const a = Math.atan2(dy, dx);
    const s = Math.asin(Math.max(-1, Math.min(1, (ra - rb) / L)));
    g.arc(A[0], A[1], ra, a + Math.PI / 2 + s, a - Math.PI / 2 - s + Math.PI * 2, false);
    g.arc(B[0], B[1], rb, a - Math.PI / 2 - s, a + Math.PI / 2 + s, false);
    g.closePath();
  }
  if (flat) { g.fillStyle = rgb(col, alpha); g.fill(); return; }
  // ombrage : lumière venant d'en haut à gauche de l'écran
  let nx = -dy / (L || 1), ny = dx / (L || 1);
  if (nx * -0.55 + ny * -0.83 < 0) { nx = -nx; ny = -ny; }
  const r = Math.max(ra, rb);
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
  const gr = g.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
  gr.addColorStop(0, rgb(mixc(col, WHITE, 0.28), alpha));
  gr.addColorStop(0.45, rgb(col, alpha));
  gr.addColorStop(1, rgb(mixc(col, BLACK, 0.32), alpha));
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = rgb(mixc(col, BLACK, 0.55), 0.35 * alpha);
  g.lineWidth = 0.8;
  g.stroke();
}
function ball(g, C, r, col, alpha = 1, flat = false) {
  g.beginPath(); g.arc(C[0], C[1], r, 0, Math.PI * 2);
  if (flat) { g.fillStyle = rgb(col, alpha); g.fill(); return; }
  const gr = g.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.4, r * 0.1, C[0], C[1], r);
  gr.addColorStop(0, rgb(mixc(col, WHITE, 0.3), alpha));
  gr.addColorStop(0.6, rgb(col, alpha));
  gr.addColorStop(1, rgb(mixc(col, BLACK, 0.3), alpha));
  g.fillStyle = gr; g.fill();
  g.strokeStyle = rgb(mixc(col, BLACK, 0.55), 0.3 * alpha); g.lineWidth = 0.8; g.stroke();
}

/** Liste des morceaux du corps à dessiner (triés ensuite par profondeur). */
function bodyParts(cam, fr, look, opt) {
  const P = fr.P;
  const pr = k => project(cam, P[k]);
  const skin = hex(look.skin), suit = hex(look.suit), hair = hex(look.hair);
  const parts = [];
  const center = P.l1;
  const depthShade = (p3, col) => {
    // côté éloigné plus sombre (comme Road2Fit) pour lire tout de suite gauche / droite
    const d = dot(sub(p3, center), cam.toCam);
    return mixc(col, BLACK, clamp01(-d * 2.2) * 0.3);
  };
  const seg = (a, b, ra, rb, col, bias = 0) => {
    const A = project(cam, a), B = project(cam, b);
    const mid = lerp(a, b, 0.5);
    parts.push({ z: (A[2] + B[2]) / 2 + bias, draw: g => capsule(g, A, B, ra * A[3], rb * B[3], depthShade(mid, col), opt.alpha, opt.flat) });
  };
  const sph = (c, r, col, bias = 0) => {
    const C = project(cam, c);
    parts.push({ z: C[2] + bias, draw: g => ball(g, C, r * C[3], depthShade(c, col), opt.alpha, opt.flat) });
  };
  for (const S of ['R', 'L']) {
    seg(P['hp' + S], P['kn' + S], 0.068, 0.05, skin);
    seg(P['kn' + S], P['an' + S], 0.05, 0.034, skin);
    seg(P['an' + S], P['to' + S], 0.033, 0.019, skin, -0.001);
    sph(P['he' + S], 0.028, skin, 0.002);
    seg(P['sh' + S], P['el' + S], 0.046, 0.036, skin);
    seg(P['el' + S], P['wr' + S], 0.036, 0.027, skin);
    seg(P['wr' + S], lerp(P['wr' + S], P['fi' + S], 0.82), 0.028, 0.02, skin, -0.001);
  }
  // tronc (justaucorps)
  const lat = norm(sub(P.shR, P.shL));
  const hipLat = norm(sub(P.hpR, P.hpL));
  seg(P.hpL, P.hpR, 0.088, 0.088, suit);
  seg(P.root, P.l1, 0.1, 0.094, suit);
  seg(P.l1, P.l2, 0.094, 0.1, suit);
  const chest = lerp(P.l2, P.nb, 0.45);
  seg(add(chest, scl(lat, -0.055)), add(chest, scl(lat, 0.055)), 0.108, 0.108, suit);
  seg(P.l2, P.nb, 0.1, 0.082, suit);
  seg(P.shL, P.shR, 0.056, 0.056, suit);
  void hipLat;
  // cou et tête
  seg(P.nb, P.hj, 0.046, 0.042, skin);
  const H = fr.head;
  const hc = P.head;
  const hairC = add(hc, add(scl(H.up, 0.014), scl(H.fwd, -0.02)));
  const bun = add(hc, add(scl(H.up, 0.05), scl(H.fwd, -0.095)));
  sph(hairC, 0.103, hair, 0.0005);
  sph(bun, 0.042, hair, 0);
  const face = project(cam, hc);
  parts.push({
    z: face[2] - 0.0002,
    draw: g => {
      ball(g, face, 0.098 * face[3], depthShade(hc, skin), opt.alpha, opt.flat);
      if (opt.flat) return;
      // frange (redessinée par-dessus le visage côté front)
      const fr2 = project(cam, add(hc, add(scl(H.up, 0.058), scl(H.fwd, 0.035))));
      if (dot(H.up, cam.toCam) > -0.6) {
        g.beginPath(); g.ellipse(fr2[0], fr2[1], 0.06 * fr2[3], 0.035 * fr2[3], Math.atan2(project(cam, add(hc, H.right))[1] - face[1], project(cam, add(hc, H.right))[0] - face[0]), 0, Math.PI * 2);
        if (dot(H.fwd, cam.toCam) > -0.3) { g.fillStyle = rgb(mixc(hair, BLACK, 0.1), opt.alpha); g.fill(); }
      }
      // yeux : seulement ceux tournés vers la caméra
      for (const s of [-1, 1]) {
        const ed = norm(add(scl(H.fwd, 0.93), scl(H.right, s * 0.36)));
        if (dot(ed, cam.toCam) < 0.12) continue;
        const e = project(cam, add(hc, add(scl(ed, 0.092), scl(H.up, 0.01))));
        g.beginPath(); g.arc(e[0], e[1], Math.max(1.1, 0.013 * e[3]), 0, Math.PI * 2);
        g.fillStyle = rgb(hex(look.eye), opt.alpha); g.fill();
      }
      // nez (petit relief) quand on voit le visage de profil
      const nz = project(cam, add(hc, add(scl(H.fwd, 0.1), scl(H.up, -0.012))));
      if (Math.abs(dot(H.fwd, cam.toCam)) < 0.85 && dot(H.fwd, cam.toCam) > -0.2) {
        g.beginPath(); g.arc(nz[0], nz[1], Math.max(1, 0.014 * nz[3]), 0, Math.PI * 2);
        g.fillStyle = rgb(mixc(skin, BLACK, 0.08), opt.alpha); g.fill();
      }
    },
  });
  return parts;
}
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);

// ---------------------------------------------------------------- sol
function drawFloor(g, cam, bounds, accent) {
  const [xa, xb] = bounds;
  const za = -1.1, zb = 1.1;
  const quad = [[xa, 0, za], [xb, 0, za], [xb, 0, zb], [xa, 0, zb]].map(p => project(cam, p));
  const gr = g.createLinearGradient(0, Math.min(...quad.map(q => q[1])), 0, Math.max(...quad.map(q => q[1])));
  gr.addColorStop(0, '#16233a'); gr.addColorStop(1, '#1d3050');
  poly(g, quad, gr, null);
  g.strokeStyle = 'rgba(148,180,230,0.10)'; g.lineWidth = 1;
  g.beginPath();
  for (let x = Math.ceil(xa * 2) / 2; x <= xb; x += 0.5) { const a = project(cam, [x, 0, za]), b = project(cam, [x, 0, zb]); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
  for (let z = -1; z <= 1.01; z += 0.5) { const a = project(cam, [xa, 0, z]), b = project(cam, [xb, 0, z]); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
  g.stroke();
  // ligne d'axe (« rouler dans l'axe »)
  g.strokeStyle = accent ? rgb(hex(accent), 0.28) : 'rgba(255,255,255,0.15)';
  g.setLineDash([6, 6]); g.lineWidth = 1.5;
  const a = project(cam, [xa, 0.001, 0]), b = project(cam, [xb, 0.001, 0]);
  g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]);
}

function drawShadow(g, cam, fr, props, surf) {
  const P = fr.P;
  const c = lerp(P.root, P.l2, 0.4);
  const y = surf(props, c[0], c[2]);
  const hgt = Math.max(0, c[1] - y);
  const r = 0.32 + hgt * 0.15;
  const a = Math.max(0.05, 0.38 - hgt * 0.18);
  const pts = [];
  for (let i = 0; i < 20; i++) { const u = (i / 20) * Math.PI * 2; pts.push(project(cam, [c[0] + Math.cos(u) * r, y + 0.002, c[2] + Math.sin(u) * r * 0.6])); }
  const ctr = project(cam, [c[0], y, c[2]]);
  const gr = g.createRadialGradient(ctr[0], ctr[1], 0, ctr[0], ctr[1], r * ctr[3]);
  gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
  poly(g, pts, gr, null);
}

/**
 * Dessine une image complète.
 * opts : { look, ghosts:[frames], trail:[points 3D], accent, surface, floor:[xa,xb] }
 */
export function drawScene(g, cam, fr, baked, opts = {}) {
  const look = { ...LOOK, ...(opts.look || {}) };
  const props = baked.props || [];
  drawFloor(g, cam, opts.floor || [-1.5, 3], opts.accent);
  // matériel posé au sol avant tout le reste s'il est derrière ; sinon trié avec le corps
  const items = [];
  for (const p of props) items.push(...propPolys(cam, p));
  if (opts.surface) drawShadow(g, cam, fr, props, opts.surface);
  // fantômes (décomposition du mouvement)
  if (opts.ghosts) {
    opts.ghosts.forEach((gf, i) => {
      const parts = bodyParts(cam, gf, { ...look, suit: look.suit }, { alpha: 0.12 + 0.16 * (i / Math.max(1, opts.ghosts.length - 1)), flat: true });
      parts.sort((a, b) => b.z - a.z).forEach(p => p.draw(g));
    });
  }
  if (opts.trail && opts.trail.length > 1) {
    g.save(); g.setLineDash([2, 5]); g.lineWidth = 2; g.strokeStyle = rgb(hex(opts.accent || '#fbbf24'), 0.7);
    g.beginPath(); opts.trail.forEach((p, i) => { const q = project(cam, p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.stroke(); g.restore();
  }
  items.push(...bodyParts(cam, fr, look, { alpha: 1 }));
  items.sort((a, b) => b.z - a.z);
  for (const it of items) it.draw(g);
}
void len;

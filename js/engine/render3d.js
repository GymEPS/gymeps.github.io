// Rendu en vraie 3D (WebGL, three.js) : profondeur exacte (plus de membre qui « passe devant » par erreur), corps modelé,
// cheveux en calotte attachée à la tête, ombre portée, matériel opaque ou transparent.
// Un seul contexte WebGL pour tout le site : chaque lecteur / vignette dessine dans son propre <canvas> 2D par copie.
import * as THREE from '../vendor/three.module.min.js';
import { camera as camMath, fitCamera } from './render.js';

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const UPY = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpD = new THREE.Vector3();

let shared = null;
export function webglOK() {
  try { return !!document.createElement('canvas').getContext('webgl2') || !!document.createElement('canvas').getContext('webgl'); } catch { return false; }
}
function getShared() {
  if (shared) return shared;
  const canvas = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: false });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setClearColor(0x000000, 0);
  shared = { renderer, canvas, w: 0, h: 0 };
  return shared;
}

// ---------------------------------------------------------------- matériaux
const matCache = new Map();
function mat(color, { opacity = 1, rough = 0.62, metal = 0, emissive } = {}) {
  const key = color + '|' + opacity + '|' + rough + '|' + (emissive || '');
  if (!matCache.has(key)) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    if (emissive) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = 0.35; }
    if (opacity < 1) { m.transparent = true; m.opacity = opacity; m.depthWrite = false; }
    matCache.set(key, m);
  }
  return matCache.get(key);
}

// ---------------------------------------------------------------- personnage
const SEGS = [ // [a, b, rayon a, rayon b, matière]
  ['hpR', 'knR', 0.07, 0.052, 'skin'], ['hpL', 'knL', 0.07, 0.052, 'skin'],
  ['knR', 'anR', 0.05, 0.034, 'skin'], ['knL', 'anL', 0.05, 0.034, 'skin'],
  ['anR', 'toR', 0.032, 0.02, 'skin'], ['anL', 'toL', 0.032, 0.02, 'skin'],
  ['heR', 'anR', 0.028, 0.03, 'skin'], ['heL', 'anL', 0.028, 0.03, 'skin'],
  ['shR', 'elR', 0.047, 0.037, 'skin'], ['shL', 'elL', 0.047, 0.037, 'skin'],
  ['elR', 'wrR', 0.036, 0.027, 'skin'], ['elL', 'wrL', 0.036, 0.027, 'skin'],
  ['wrR', 'fiR', 0.028, 0.018, 'skin'], ['wrL', 'fiL', 0.028, 0.018, 'skin'],
  ['nb', 'hj', 0.047, 0.043, 'skin'],
];
const JOINTS = [ // sphères aux articulations
  ['knR', 0.051, 'skin'], ['knL', 0.051, 'skin'], ['anR', 0.034, 'skin'], ['anL', 0.034, 'skin'], ['heR', 0.028, 'skin'], ['heL', 0.028, 'skin'],
  ['toR', 0.02, 'skin'], ['toL', 0.02, 'skin'], ['elR', 0.037, 'skin'], ['elL', 0.037, 'skin'], ['wrR', 0.027, 'skin'], ['wrL', 0.027, 'skin'],
  ['fiR', 0.018, 'skin'], ['fiL', 0.018, 'skin'], ['shR', 0.052, 'suit'], ['shL', 0.052, 'suit'], ['hpR', 0.07, 'suit'], ['hpL', 0.07, 'suit'],
];
const geoCache = new Map();
function cyl(ra, rb) {
  const k = ra + '|' + rb;
  if (!geoCache.has(k)) geoCache.set(k, new THREE.CylinderGeometry(rb, ra, 1, 16, 1, true));
  return geoCache.get(k);
}
const SPHERE = new THREE.SphereGeometry(1, 24, 16);
// calotte de cheveux : pôle sur +Y, descend jusqu'à ~105° du pôle
const HAIRCAP = new THREE.SphereGeometry(1, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.6);


// Tronc continu : anneaux elliptiques le long de la colonne (bassin → taille → poitrine → épaules), recalculés à chaque image.
const RINGS = 18, RSEG = 20;
const PROFILE = [ // [position le long du tronc 0..1, demi-largeur, demi-épaisseur]
  [0, 0.085, 0.07], [0.08, 0.125, 0.09], [0.2, 0.137, 0.097], [0.36, 0.122, 0.085], [0.5, 0.118, 0.083],
  [0.64, 0.132, 0.093], [0.78, 0.15, 0.1], [0.9, 0.155, 0.092], [0.97, 0.13, 0.075], [1, 0.06, 0.05],
];
const prof = u => {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [a, wa, da] = PROFILE[i], [b, wb, db] = PROFILE[i + 1];
    if (u <= b) { const k = (u - a) / (b - a), e = k * k * (3 - 2 * k); return [wa + (wb - wa) * e, da + (db - da) * e]; }
  }
  return [PROFILE.at(-1)[1], PROFILE.at(-1)[2]];
};
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return p1.clone().multiplyScalar(2).add(p2.clone().sub(p0).multiplyScalar(t)).add(p0.clone().multiplyScalar(2).sub(p1.clone().multiplyScalar(5)).add(p2.clone().multiplyScalar(4)).sub(p3).multiplyScalar(t2))
    .add(p1.clone().multiplyScalar(3).sub(p0).sub(p2.clone().multiplyScalar(3)).add(p3).multiplyScalar(t3)).multiplyScalar(0.5);
}
class Torso {
  constructor(material) {
    const n = RINGS * RSEG + 2;
    this.pos = new Float32Array(n * 3);
    const idx = [];
    for (let r = 0; r < RINGS - 1; r++) for (let k = 0; k < RSEG; k++) {
      const a = r * RSEG + k, b = r * RSEG + ((k + 1) % RSEG), c = a + RSEG, d = b + RSEG;
      idx.push(a, c, b, b, c, d);
    }
    const bot = RINGS * RSEG, top = bot + 1;
    for (let k = 0; k < RSEG; k++) { idx.push(bot, k, (k + 1) % RSEG); const o = (RINGS - 1) * RSEG; idx.push(top, o + ((k + 1) % RSEG), o + k); }
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    this.geo.setIndex(idx);
    this.mesh = new THREE.Mesh(this.geo, material);
  }
  update(P) {
    const hipC = V(P.hpR).add(V(P.hpL)).multiplyScalar(0.5);
    const root = V(P.root), l1 = V(P.l1), l2 = V(P.l2), nb = V(P.nb);
    const upPel = l1.clone().sub(root).normalize();
    const base = hipC.clone().sub(upPel.clone().multiplyScalar(0.05));
    const top = nb.clone().add(nb.clone().sub(l2).normalize().multiplyScalar(0.035));
    const pts = [base.clone().sub(upPel.clone().multiplyScalar(0.05)), base, root, l1, l2, l2.clone().lerp(nb, 0.55), top, top.clone().add(nb.clone().sub(l2).normalize().multiplyScalar(0.05))];
    const latHip = V(P.hpR).sub(V(P.hpL)).normalize(), latSh = V(P.shR).sub(V(P.shL)).normalize();
    const segs = pts.length - 3; // tronçons utiles : base → top
    let prev = null;
    for (let r = 0; r < RINGS; r++) {
      const u = r / (RINGS - 1);
      const x = u * segs, i = Math.min(segs - 1, Math.floor(x)), t = x - i;
      const c = catmull(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], t);
      const c2 = catmull(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], Math.min(1, t + 0.05));
      let up = c2.clone().sub(c);
      if (up.lengthSq() < 1e-10) up = prev ? prev.clone() : upPel.clone();
      up.normalize(); prev = up;
      const k = Math.min(1, Math.max(0, (u - 0.25) / 0.55));
      const lat = latHip.clone().lerp(latSh, k * k * (3 - 2 * k));
      lat.sub(up.clone().multiplyScalar(lat.dot(up))).normalize();
      const fwd = new THREE.Vector3().crossVectors(up, lat);
      const [hw, hd] = prof(u);
      for (let j = 0; j < RSEG; j++) {
        const a = (j / RSEG) * Math.PI * 2;
        const ca = Math.cos(a), sa = Math.sin(a);
        const o = (r * RSEG + j) * 3;
        this.pos[o] = c.x + lat.x * ca * hw + fwd.x * sa * hd;
        this.pos[o + 1] = c.y + lat.y * ca * hw + fwd.y * sa * hd;
        this.pos[o + 2] = c.z + lat.z * ca * hw + fwd.z * sa * hd;
      }
      if (r === 0) { const o = RINGS * RSEG * 3; this.pos[o] = c.x - up.x * 0.02; this.pos[o + 1] = c.y - up.y * 0.02; this.pos[o + 2] = c.z - up.z * 0.02; }
      if (r === RINGS - 1) { const o = (RINGS * RSEG + 1) * 3; this.pos[o] = c.x + up.x * 0.015; this.pos[o + 1] = c.y + up.y * 0.015; this.pos[o + 2] = c.z + up.z * 0.015; }
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
    this.geo.computeBoundingSphere();
  }
}

class Figure {
  constructor(colors, { ghost = false, opacity = 1 } = {}) {
    this.group = new THREE.Group();
    const op = ghost ? opacity : 1;
    const M = {
      skin: ghost ? mat(colors.suit, { opacity: op }) : mat(colors.skin, { rough: 0.7 }),
      suit: ghost ? mat(colors.suit, { opacity: op }) : mat(colors.suit, { rough: 0.45, emissive: colors.suit }),
      hair: ghost ? mat(colors.suit, { opacity: op }) : mat(colors.hair, { rough: 0.85 }),
      eye: mat('#15161c', { rough: 0.3 }),
    };
    this.ghost = ghost;
    const add = (geo, m) => { const o = new THREE.Mesh(geo, m); o.castShadow = !ghost; o.matrixAutoUpdate = true; this.group.add(o); return o; };
    this.segs = SEGS.map(([a, b, ra, rb, m]) => ({ a, b, mesh: add(cyl(ra, rb), M[m]) }));
    this.joints = JOINTS.map(([p, r, m]) => { const o = add(SPHERE, M[m]); o.scale.setScalar(r); return { p, mesh: o }; });
    // tronc : volumes ellipsoïdaux (bassin, ventre, poitrine)
    this.torso = new Torso(M.suit);
    this.torso.mesh.castShadow = !ghost;
    this.group.add(this.torso.mesh);
    this.headM = add(SPHERE, M.skin); this.headM.scale.setScalar(0.098);
    this.hair = add(HAIRCAP, M.hair); this.hair.scale.setScalar(0.104);
    this.bun = add(SPHERE, M.hair); this.bun.scale.setScalar(0.042);
    if (!ghost) {
      this.eyes = [add(SPHERE, M.eye), add(SPHERE, M.eye)];
      this.eyes.forEach(e => e.scale.setScalar(0.012));
      this.nose = add(SPHERE, M.skin); this.nose.scale.setScalar(0.017);
    }
  }
  /** Ellipsoïde orienté : centre, axe haut, axe droite, demi-tailles [avant, haut, côté]. */
  ell(o, c, up, right, s) {
    const u = up.clone().normalize();
    let r = right.clone().sub(u.clone().multiplyScalar(right.dot(u))).normalize();
    const f = new THREE.Vector3().crossVectors(u, r);
    const m = new THREE.Matrix4().makeBasis(f, u, r);
    o.quaternion.setFromRotationMatrix(m);
    o.position.copy(c);
    o.scale.set(s[0], s[1], s[2]);
  }
  update(fr) {
    const P = fr.P;
    for (const s of this.segs) {
      tmpA.set(...P[s.a]); tmpB.set(...P[s.b]);
      tmpD.subVectors(tmpB, tmpA);
      const L = tmpD.length() || 1e-4;
      s.mesh.position.addVectors(tmpA, tmpB).multiplyScalar(0.5);
      s.mesh.quaternion.setFromUnitVectors(UPY, tmpD.multiplyScalar(1 / L));
      s.mesh.scale.set(1, L, 1);
    }
    for (const j of this.joints) j.mesh.position.set(...P[j.p]);
    this.torso.update(P);
    // tête : visage, calotte de cheveux (vers le haut et l'arrière), chignon, yeux, nez
    const hc = V(P.head), fwd = V(fr.head.fwd).normalize(), up = V(fr.head.up).normalize(), right = V(fr.head.right).normalize();
    this.headM.position.copy(hc);
    const axis = up.clone().multiplyScalar(0.82).add(fwd.clone().multiplyScalar(-0.57)).normalize();
    this.hair.position.copy(hc).add(up.clone().multiplyScalar(0.004));
    this.hair.quaternion.setFromUnitVectors(UPY, axis);
    this.bun.position.copy(hc).add(up.clone().multiplyScalar(0.05)).add(fwd.clone().multiplyScalar(-0.1));
    if (this.eyes) {
      [-1, 1].forEach((s, i) => {
        const d = fwd.clone().multiplyScalar(0.93).add(right.clone().multiplyScalar(0.36 * s)).normalize();
        this.eyes[i].position.copy(hc).add(d.multiplyScalar(0.09)).add(up.clone().multiplyScalar(0.012));
      });
      this.nose.position.copy(hc).add(fwd.clone().multiplyScalar(0.097)).add(up.clone().multiplyScalar(-0.012));
    }
  }
}

// ---------------------------------------------------------------- matériel
function propMesh(p, transparent) {
  const h0 = p.k === 'wedge' ? p.h0 : p.h, h1 = p.k === 'wedge' ? p.h1 : p.h;
  const b = p.y0 || 0;
  const C = [[p.x0, b, p.z0], [p.x1, b, p.z0], [p.x1, b, p.z1], [p.x0, b, p.z1], [p.x0, b + h0, p.z0], [p.x1, b + h1, p.z0], [p.x1, b + h1, p.z1], [p.x0, b + h0, p.z1]];
  const F = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [3, 7, 6], [3, 6, 2], [0, 4, 7], [0, 7, 3], [1, 2, 6], [1, 6, 5]];
  const pos = [];
  for (const f of F) for (const i of f) pos.push(...C[i]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  const color = p.color || '#3b82f6';
  const op = p.k === 'mark' ? 1 : transparent ? 0.38 : 1;
  const m = new THREE.MeshStandardMaterial({ color, roughness: 0.8, transparent: op < 1, opacity: op, depthWrite: op >= 1, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(g, m);
  mesh.castShadow = op >= 1; mesh.receiveShadow = true;
  const grp = new THREE.Group();
  grp.add(mesh);
  // arêtes claires pour bien lire la forme, même en transparence
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g, 20), new THREE.LineBasicMaterial({ color: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.45), transparent: true, opacity: transparent ? 0.9 : 0.55 }));
  grp.add(edges);
  return grp;
}

// ---------------------------------------------------------------- sol
let floorTex = null;
function floorTexture() {
  if (floorTex) return floorTex;
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#28497e'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(190,215,255,0.32)'; g.lineWidth = 3;
  g.strokeRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(190,215,255,0.12)'; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(128, 0); g.lineTo(128, 256); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke();
  floorTex = new THREE.CanvasTexture(c);
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.colorSpace = THREE.SRGBColorSpace;
  return floorTex;
}

/**
 * Une scène pour une animation cuite : personnage, fantômes, matériel, sol, ombre.
 */
export class Stage3D {
  constructor(baked, { suit = '#22d3ee', skin = '#e9b48c', hair = '#3b2a20', accent } = {}) {
    this.b = baked;
    this.colors = { suit, skin, hair };
    this.accent = accent || suit;
    const S = this.scene = new THREE.Scene();
    S.add(new THREE.HemisphereLight(0xeef3ff, 0x2a3555, 1.5));
    const sun = this.sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.02;
    S.add(sun); S.add(sun.target);
    const fill = new THREE.DirectionalLight(0x9ec5ff, 0.45); fill.position.set(-3, 2, -4); S.add(fill);
    // étendue du mouvement
    let x0 = Infinity, x1 = -Infinity;
    for (const f of baked.frames) { x0 = Math.min(x0, f.P.root[0]); x1 = Math.max(x1, f.P.root[0]); }
    this.x0 = x0; this.x1 = x1;
    const fx0 = x0 - 2.2, fx1 = x1 + 2.2;
    const tex = floorTexture().clone(); tex.needsUpdate = true;
    tex.repeat.set((fx1 - fx0) / 0.5, 2.6 / 0.5);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(fx1 - fx0, 2.6), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set((fx0 + fx1) / 2, 0, 0); floor.receiveShadow = true;
    S.add(floor);
    // ligne d'axe
    const axisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(fx0, 0.003, 0), new THREE.Vector3(fx1, 0.003, 0)]);
    const axisLine = new THREE.Line(axisGeo, new THREE.LineDashedMaterial({ color: this.accent, dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.45 }));
    axisLine.computeLineDistances(); S.add(axisLine);
    sun.position.set((x0 + x1) / 2 - 2.5, 6, 3.5);
    sun.target.position.set((x0 + x1) / 2, 0, 0);
    const span = Math.max(3, (x1 - x0) / 2 + 2.5);
    Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 0.5, far: 20 });
    sun.shadow.camera.updateProjectionMatrix();
    this.fig = new Figure(this.colors);
    S.add(this.fig.group);
    this.propsGroup = new THREE.Group(); S.add(this.propsGroup);
    this.setTransparent(true);
    this.ghosts = [];
    this.ghostGroup = new THREE.Group(); S.add(this.ghostGroup);
    this.trail = null;
    this.cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  }
  setTransparent(on) {
    this.transparent = on;
    this.propsGroup.clear();
    for (const p of this.b.props || []) this.propsGroup.add(propMesh(p, on && p.k !== 'mark'));
  }
  setGhosts(frames) {
    this.ghostGroup.clear();
    this.ghosts = [];
    if (!frames) return;
    frames.forEach((fr, i) => {
      const g = new Figure(this.colors, { ghost: true, opacity: 0.12 + 0.18 * (i / Math.max(1, frames.length - 1)) });
      g.update(fr);
      this.ghostGroup.add(g.group);
      this.ghosts.push(g);
    });
  }
  setTrail(points) {
    if (this.trail) { this.scene.remove(this.trail); this.trail = null; }
    if (!points) return;
    const g = new THREE.BufferGeometry().setFromPoints(points.map(V));
    this.trail = new THREE.Line(g, new THREE.LineDashedMaterial({ color: '#fbbf24', dashSize: 0.05, gapSize: 0.06 }));
    this.trail.computeLineDistances();
    this.scene.add(this.trail);
  }
  /** Dessine l'image fr dans le contexte 2D ctx (taille w × h en pixels CSS, dpr). */
  draw(ctx, w, h, dpr, fr, view) {
    const sh = getShared();
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (sh.w < W || sh.h < H) { sh.w = Math.max(sh.w, W); sh.h = Math.max(sh.h, H); sh.renderer.setSize(sh.w, sh.h, false); }
    this.fig.update(fr);
    // caméra : même cadrage que le moteur 2D (perspective douce, tout le mouvement dans l'image)
    let m;
    if (view.fitB) {
      // caméra qui suit : cadrage fixe calculé autour de x = 0, puis on se déplace avec le gymnaste
      m = camMath(view.yaw, view.pitch, [0, view.center[1], 0], 9);
      fitCamera(m, view.fitB, w, h, view.pad ?? 0.06);
      const m2 = camMath(view.yaw, view.pitch, view.center, 9);
      m2.scale = m.scale; m2.cx = m.cx; m2.cy = m.cy;
      m = m2;
    } else {
      m = camMath(view.yaw, view.pitch, view.center, 9);
      fitCamera(m, this.b, w, h, view.pad ?? 0.06);
    }
    const c = this.cam;
    c.position.set(...m.eye);
    c.up.set(...m.up);
    c.lookAt(...view.center);
    const fpx = m.dist * m.scale; // focale en pixels CSS
    c.fov = (2 * Math.atan(h / 2 / fpx) * 180) / Math.PI;
    c.aspect = w / h;
    c.setViewOffset(w, h, w / 2 - m.cx, h / 2 - m.cy, w, h);
    c.updateProjectionMatrix();
    sh.renderer.setViewport(0, 0, W, H);
    sh.renderer.setScissor(0, 0, W, H);
    sh.renderer.setScissorTest(true);
    sh.renderer.render(this.scene, c);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(sh.canvas, 0, sh.h - H, W, H, 0, 0, W, H);
    ctx.restore();
  }
  dispose() {
    this.scene.traverse(o => { if (o.geometry && !geoCacheHas(o.geometry)) o.geometry.dispose(); });
  }
}
function geoCacheHas(g) { if (g === SPHERE || g === HAIRCAP) return true; for (const v of geoCache.values()) if (v === g) return true; return false; }

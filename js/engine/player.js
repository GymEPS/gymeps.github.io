// Lecteur d'animation : lecture / pause, vitesse, angles de vue (ou rotation libre au doigt), décomposition (chronophotographie),
// trajectoire du bassin, barre des phases. Un seul calcul (« cuisson ») par animation, gardé en cache.
import { bakeDef as bake, frameAt, surfaceAt } from './skeleton.js';
import { camera, fitCamera, drawScene, VIEWS } from './render.js';
import { Stage3D, webglOK } from './render3d.js';

const GL = typeof document !== 'undefined' && webglOK();

const cache = new Map();
export function baked(id, def) {
  if (!cache.has(id)) cache.set(id, bake(def));
  return cache.get(id);
}

const PAUSE_END = 0.9; // s d'arrêt sur la position finale avant de recommencer
const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Player {
  constructor(root, { id, def, accent = '#22d3ee', suit, compact = false, view = 'profil', follow = false }) {
    this.b = baked(id, def);
    this.follow = follow;
    if (follow) {
      // caméra qui suit : cadrage calculé sur le corps seul (toutes les poses ramenées au même endroit) + un peu de marge
      const fr = this.b.frames.filter((_, i) => i % 4 === 0).map(f => {
        const P = {}; for (const k in f.P) P[k] = [f.P[k][0] - f.P.root[0], f.P[k][1], f.P[k][2]];
        return { P };
      });
      fr.push({ P: { head: [-1.1, 1.7, 0], toR: [1.1, 0, 0], toL: [1.1, 0, 0], fiR: [0, 0, 0], fiL: [0, 0, 0], root: [0, 1, 0], knR: [0, 0.5, 0], knL: [0, 0.5, 0] } });
      this.fitB = { frames: fr, props: [] };
      this.camX = this.b.frames[0].P.root[0];
    }
    this.accent = accent;
    this.suit = suit || accent;
    this.t = 0;
    this.speed = 1;
    this.playing = !reduce;
    this.view = view;
    this.yaw = VIEWS[view].yaw; this.pitch = VIEWS[view].pitch;
    this.decomp = false;
    this.trail = false;
    this.see = true; // matériel transparent (on voit le gymnaste à travers)
    this.hasProps = (this.b.props || []).some(p => p.k !== 'mark');
    this.stage = GL ? new Stage3D(this.b, { suit: this.suit, accent }) : null;
    this.root = root;
    root.classList.add('player');
    root.innerHTML = `
      <div class="pl-stage">
        <canvas class="pl-canvas" aria-label="Animation du mouvement"></canvas>
        <div class="pl-phase" aria-live="polite"></div>
        <div class="pl-hint">Fais glisser pour tourner autour</div>
      </div>
      <div class="pl-bar">
        <button class="pl-btn pl-play" aria-label="Pause"></button>
        <div class="pl-track" role="slider" aria-label="Position dans le mouvement" tabindex="0"><div class="pl-segs"></div><div class="pl-head"></div></div>
        <div class="pl-speed" role="group" aria-label="Vitesse">
          ${[0.25, 0.5, 1].map(s => `<button data-speed="${s}" class="${s === 1 ? 'on' : ''}">${s === 1 ? '×1' : s === 0.5 ? '×½' : '×¼'}</button>`).join('')}
        </div>
      </div>
      <div class="pl-tools">
        <div class="pl-views" role="group" aria-label="Angle de vue">
          ${Object.entries(VIEWS).map(([k, v]) => `<button data-view="${k}" class="${k === view ? 'on' : ''}">${v.label}</button>`).join('')}
        </div>
        <div class="pl-opts">
          <button class="pl-toggle" data-opt="decomp" aria-pressed="false" title="Voir toutes les étapes du mouvement en même temps">Décomposer</button>
          <button class="pl-toggle" data-opt="trail" aria-pressed="false" title="Trajet du bassin">Trajet</button>
          ${(this.b.props || []).some(p => p.k !== 'mark') ? '<button class="pl-toggle on" data-opt="see" aria-pressed="true" title="Rendre le matériel transparent ou plein">Matériel transparent</button>' : ''}
        </div>
      </div>`;
    this.cv = root.querySelector('.pl-canvas');
    this.g = this.cv.getContext('2d');
    this.phaseEl = root.querySelector('.pl-phase');
    this.headEl = root.querySelector('.pl-head');
    this.track = root.querySelector('.pl-track');
    this.playBtn = root.querySelector('.pl-play');
    if (compact) root.classList.add('compact');
    this.buildSegs();
    this.bind();
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.cv);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.loop(); });
    this.io.observe(root);
    this.updatePlay();
    this.draw();
  }

  get total() { return this.b.T + PAUSE_END; }

  buildSegs() {
    const segs = this.root.querySelector('.pl-segs');
    const ph = this.b.phases.length ? this.b.phases : [{ t: 0, label: '' }];
    segs.innerHTML = ph.map((p, i) => {
      const end = i + 1 < ph.length ? ph[i + 1].t : this.b.T;
      return `<div class="pl-seg" style="flex:${Math.max(0.05, end - p.t)}" data-i="${i}"><span>${p.label}</span></div>`;
    }).join('') + `<div class="pl-seg end" style="flex:${PAUSE_END}"></div>`;
  }

  bind() {
    this.playBtn.onclick = () => { this.playing = !this.playing; if (this.playing && this.t >= this.total) this.t = 0; this.updatePlay(); this.loop(); };
    this.root.querySelectorAll('[data-speed]').forEach(b => (b.onclick = () => {
      this.speed = +b.dataset.speed;
      this.root.querySelectorAll('[data-speed]').forEach(x => x.classList.toggle('on', x === b));
    }));
    this.root.querySelectorAll('[data-view]').forEach(b => (b.onclick = () => this.setView(b.dataset.view)));
    this.root.querySelectorAll('[data-opt]').forEach(b => (b.onclick = () => {
      this[b.dataset.opt] = !this[b.dataset.opt];
      b.setAttribute('aria-pressed', this[b.dataset.opt]);
      b.classList.toggle('on', this[b.dataset.opt]);
      if (this.stage) {
        if (b.dataset.opt === 'decomp') this.stage.setGhosts(this.decomp ? this.ghosts() : null);
        if (b.dataset.opt === 'trail') this.stage.setTrail(this.trail ? this.b.frames.filter((_, i) => i % 3 === 0).map(f => f.P.root) : null);
        if (b.dataset.opt === 'see') this.stage.setTransparent(this.see);
      }
      this.draw();
    }));
    // barre de temps
    const seek = e => {
      const r = this.track.getBoundingClientRect();
      this.t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * this.total;
      this.draw();
    };
    this.track.addEventListener('pointerdown', e => { this.track.setPointerCapture(e.pointerId); this.scrub = true; this.wasPlaying = this.playing; this.playing = false; seek(e); });
    this.track.addEventListener('pointermove', e => { if (this.scrub) seek(e); });
    this.track.addEventListener('pointerup', () => { this.scrub = false; this.playing = this.wasPlaying; this.updatePlay(); this.loop(); });
    this.track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { this.playing = false; this.t = Math.max(0, Math.min(this.total, this.t + (e.key === 'ArrowRight' ? 0.1 : -0.1))); this.updatePlay(); this.draw(); e.preventDefault(); }
    });
    // rotation à la souris / au doigt
    let drag = null;
    this.cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw: this.yaw, pitch: this.pitch }; this.cv.setPointerCapture(e.pointerId); this.root.classList.add('dragging'); });
    this.cv.addEventListener('pointermove', e => {
      if (!drag) return;
      this.yaw = drag.yaw - (e.clientX - drag.x) * 0.5;
      this.pitch = Math.max(-5, Math.min(85, drag.pitch + (e.clientY - drag.y) * 0.4));
      this.view = null;
      this.root.querySelectorAll('[data-view]').forEach(x => x.classList.remove('on'));
      this.fit(); this.draw();
    });
    const end = () => { drag = null; this.root.classList.remove('dragging'); this.root.classList.add('used'); };
    this.cv.addEventListener('pointerup', end); this.cv.addEventListener('pointercancel', end);
  }

  setView(v) {
    this.view = v;
    const target = VIEWS[v];
    this.root.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('on', x.dataset.view === v));
    // petite transition douce vers le nouvel angle
    const from = { yaw: this.yaw, pitch: this.pitch };
    let dy = ((target.yaw - from.yaw) % 360 + 540) % 360 - 180;
    const t0 = performance.now();
    const step = now => {
      const u = Math.min(1, (now - t0) / 450), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      this.yaw = from.yaw + dy * e; this.pitch = from.pitch + (target.pitch - from.pitch) * e;
      this.fit(); this.draw();
      if (u < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  updatePlay() {
    this.playBtn.classList.toggle('paused', !this.playing);
    this.playBtn.setAttribute('aria-label', this.playing ? 'Pause' : 'Lecture');
  }

  resize() {
    const r = this.cv.getBoundingClientRect();
    const dpr = this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(10, r.width); this.h = Math.max(10, r.height);
    this.cv.width = Math.round(this.w * dpr); this.cv.height = Math.round(this.h * dpr);
    this.g.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.fit();
    this.draw();
  }

  fit() {
    const b = this.b;
    let x0 = Infinity, x1 = -Infinity, y1 = 0, z0 = 0, z1 = 0;
    for (const f of b.frames) { x0 = Math.min(x0, f.P.root[0]); x1 = Math.max(x1, f.P.root[0]); y1 = Math.max(y1, f.P.head[1]); }
    void z0; void z1;
    this.center = [(x0 + x1) / 2, Math.min(0.9, y1 / 2 + 0.05), 0];
    this.floor = [x0 - 1.4, x1 + 1.4];
    this.cam = fitCamera(camera(this.yaw, this.pitch, this.center), b, this.w, this.h, 0.06);
  }

  loop() {
    if (this.raf || !this.visible) return;
    let last = performance.now();
    const tick = now => {
      this.raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (this.playing && !this.scrub) {
        this.t += dt * this.speed;
        if (this.t > this.total) this.t = 0;
        this.draw();
      }
      if (this.playing && this.visible) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  ghosts() {
    const b = this.b, out = [];
    const n = Math.max(5, Math.min(11, Math.round(b.T * 3)));
    for (let i = 0; i < n; i++) out.push(frameAt(b, (b.T * i) / (n - 1)));
    return out;
  }

  draw() {
    if (!this.cam) return;
    const g = this.g, b = this.b;
    const t = Math.min(this.t, b.T);
    const fr = frameAt(b, t);
    if (this.stage) {
      if (this.follow) {
        this.camX += (fr.P.root[0] - this.camX) * 0.12;
        if (!this.playing || this.scrub || Math.abs(fr.P.root[0] - this.camX) > 2.5 || this.t < 0.05) this.camX = fr.P.root[0];
        this.stage.draw(g, this.w, this.h, this.dpr, fr, { yaw: this.yaw, pitch: this.pitch, center: [this.camX, this.center[1], 0], fitB: this.fitB, fitX: this.camX });
      } else this.stage.draw(g, this.w, this.h, this.dpr, fr, { yaw: this.yaw, pitch: this.pitch, center: this.center });
    } else {
      g.clearRect(0, 0, this.w, this.h);
      const trail = this.trail ? b.frames.filter((_, i) => i % 3 === 0).map(f => f.P.root) : null;
      drawScene(g, this.cam, fr, b, { accent: this.accent, look: { suit: this.suit }, ghosts: this.decomp ? this.ghosts() : null, trail, floor: this.floor, surface: surfaceAt });
    }
    // phase en cours
    let pi = -1;
    b.phases.forEach((p, i) => { if (t >= p.t - 1e-6) pi = i; });
    const label = pi >= 0 ? b.phases[pi].label : '';
    if (this.phaseEl.dataset.i !== String(pi)) {
      this.phaseEl.dataset.i = String(pi);
      this.phaseEl.innerHTML = label ? `<b>${pi + 1}</b>${label}` : '';
      this.root.querySelectorAll('.pl-seg').forEach((s, i) => s.classList.toggle('on', i === pi));
      if (this.onPhase) this.onPhase(pi);
    }
    this.headEl.style.left = `${(this.t / this.total) * 100}%`;
  }

  /** Aller à l'instant t ; pause pour bien voir la position. */
  seek(t, pause = true) {
    this.t = Math.max(0, Math.min(this.total, t));
    if (pause) { this.playing = false; this.updatePlay(); }
    this.draw();
  }

  destroy() { cancelAnimationFrame(this.raf); this.ro.disconnect(); this.io.disconnect(); if (this.stage) this.stage.dispose(); }
}

/** Petite image fixe (vignette) d'une animation, à l'instant le plus parlant. */
export function thumbnail(canvas, id, def, { accent, at, view = 'trois' } = {}) {
  const b = baked(id, def);
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = r.width || 160, h = r.height || 120;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const g = canvas.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const v = VIEWS[view];
  let x0 = Infinity, x1 = -Infinity;
  for (const f of b.frames) { x0 = Math.min(x0, f.P.root[0]); x1 = Math.max(x1, f.P.root[0]); }
  const tt = at !== undefined ? at : b.thumb !== undefined ? b.thumb : b.T * 0.5;
  const ghosts = [0.15, 0.4, 0.65, 0.9].map(u => frameAt(b, b.T * u));
  const center = [(x0 + x1) / 2, 0.8, 0];
  if (GL) {
    const st = new Stage3D(b, { suit: accent, accent });
    st.setGhosts(ghosts);
    st.draw(g, w, h, dpr, frameAt(b, tt), { yaw: v.yaw, pitch: v.pitch, center, pad: 0.04 });
    st.dispose();
    return;
  }
  const cam = fitCamera(camera(v.yaw, v.pitch, center), b, w, h, 0.04);
  drawScene(g, cam, frameAt(b, tt), b, { accent, look: { suit: accent }, ghosts, floor: [x0 - 1.2, x1 + 1.2], surface: surfaceAt });
}

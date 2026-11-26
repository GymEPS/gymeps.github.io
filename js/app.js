// Gym EPS : navigation (adresses en #/…), pages, recherche.
import { FAMILLES, NIVEAUX } from './data/familles.js';
import { THEMES as ALL_THEMES, SECURITE, VALIDATION } from './data/progressions.js';
import { animDef } from './anims/index.js';
import { buildSequence } from './anims/sequence.js';
import { Player, thumbnail } from './engine/player.js';
import { initAnalyse, pageAnalyse, analyseCleanup, analyseHref } from './analyse.js';

const app = document.getElementById('app');
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LEVEL_COLORS = { A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#ef4444', E: '#a855f7', F: '#d946ef', G: '#ec4899', H: '#f43f5e' };
const lvlTag = n => `<span class="tag" style="background:${LEVEL_COLORS[n]}">${n}</span>`;
const ELEMENTS = FAMILLES.flatMap(f => f.elements.map(e => ({ ...e, fam: f })));
const elById = id => ELEMENTS.find(e => e.id === id);
// Progressions de niveau lycée masquées pour les 4e (choix de Gabin, 25/11/2026) : les données restent dans progressions.js.
const HIDDEN_THEMES = ['flip', 'salto-arriere'];
const THEMES = ALL_THEMES.filter(t => !HIDDEN_THEMES.includes(t.id));
const themeById = id => THEMES.find(t => t.id === id);

let players = [];
let thumbsIO = null;
function cleanup() {
  analyseCleanup();
  players.forEach(p => p.destroy());
  players = [];
  if (thumbsIO) thumbsIO.disconnect();
  thumbsIO = null;
}
function setAccent(c) {
  document.documentElement.style.setProperty('--fc', c || '#22d3ee');
}
function mountPlayer(el, animId, accent, opts = {}) {
  const def = animDef(animId);
  if (!def) { el.innerHTML = '<p class="muted">Animation à venir.</p>'; return null; }
  const p = new Player(el, { id: animId, def, accent, ...opts });
  players.push(p);
  return p;
}
/** Vignettes dessinées seulement quand elles arrivent à l'écran. */
function lazyThumbs(root) {
  thumbsIO = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const c = en.target;
      thumbsIO.unobserve(c);
      const id = c.dataset.anim;
      const def = animDef(id);
      if (!def) continue;
      const run = () => thumbnail(c, id, def, { accent: c.dataset.accent, view: c.dataset.view || 'trois' });
      (window.requestIdleCallback || (f => setTimeout(f, 16)))(run);
    }
  }, { rootMargin: '200px' });
  root.querySelectorAll('canvas[data-anim]').forEach(c => thumbsIO.observe(c));
}

// ------------------------------------------------------------------ pages
function pageHome() {
  setAccent('#22d3ee');
  const nEl = ELEMENTS.length;
  const nLv = THEMES.reduce((s, t) => s + t.niveaux.length, 0);
  app.innerHTML = `
    <section class="hero page-enter">
      <div>
        <h1>Gym EPS <span>au sol</span></h1>
        <p>Toutes les figures de gymnastique au sol, rangées par famille et par difficulté. Touche une figure pour la voir bouger en 3D, sous tous les angles, au ralenti si tu veux.</p>
        <div class="hero-ctas"><a class="save-cta" href="#/ma-progression">✍️ Enregistrer ma progression</a><a class="save-cta an-cta" href="#/analyse">🎥 Filmer et comparer</a></div>
        <div class="hero-stats">
          <div><b>6</b>familles</div>
          <div><b>${nEl}</b>figures</div>
          <div><b>A→D</b>niveaux de difficulté</div>
          <div><b>${nLv}</b>étapes de progression</div>
        </div>
      </div>
      <div class="hero-demo"><a class="hero-caption" href="#/element/rondade">Rondade ›</a><div id="demo"></div></div>
    </section>
    <div class="section-title"><h2>Les 6 familles</h2><p>Chaque famille est classée de A (facile) à D (très difficile).</p></div>
    <div class="grid fam-grid">
      ${FAMILLES.map(f => {
        const counts = Object.keys(NIVEAUX).map(n => [n, f.elements.filter(e => e.niv === n).length]).filter(x => x[1]);
        const show = f.elements.find(e => ['atr-tenu', 'saut-carpe-ecart', 'planche', 'roulade-avant', 'tour-pied', 'roue'].includes(e.id)) || f.elements[0];
        return `<a class="fam-card" href="#/famille/${f.id}" style="--c:${f.couleur}">
          <div><h3>${esc(f.court || f.titre)}</h3><p>${esc(f.resume)}</p>
          <div class="lvl-row">${counts.map(([n, c]) => `<span class="lvl-pill"><i style="background:${LEVEL_COLORS[n]}">${n}</i>${c}</span>`).join('')}</div></div>
          <canvas data-anim="${show.anim}" data-accent="${f.couleur}" aria-hidden="true"></canvas>
        </a>`;
      }).join('')}
    </div>
    <div class="section-title"><h2>Progressions pas à pas</h2><p>Des ateliers du plus simple au plus dur, avec le matériel et des solutions si tu bloques.</p></div>
    <div class="grid theme-grid">${THEMES.map(themeCard).join('')}</div>
    <div class="section-title"><h2>Avant de commencer</h2></div>
    <div class="grid info-grid">
      <a class="info-card" href="#/analyse"><span class="ico">🎥</span><div><h3>Filmer et comparer</h3><p>Filme un camarade : sa vidéo se met à côté de l’animation pour juger si la figure est réussie.</p></div></a>
      <a class="info-card" href="#/enchainement"><span class="ico">🤸</span><div><h3>Créer mon enchaînement</h3><p>Un élément par famille, dans l’ordre que tu veux, et l’animation de tout l’enchaînement.</p></div></a>
      <a class="info-card" href="#/securite"><span class="ico">🛡️</span><div><h3>Consignes de sécurité</h3><p>Matériel, espace de travail, parade et aide.</p></div></a>
      <a class="info-card" href="#/securite#validation"><span class="ico">✅</span><div><h3>Valider un niveau</h3><p>${esc(VALIDATION.devise)}.</p></div></a>
    </div>`;
  mountPlayer($('#demo'), 'rondade', '#22d3ee', { view: 'trois', compact: true });
  lazyThumbs(app);
}

function themeCard(t) {
  return `<a class="theme-card" href="#/progression/${t.id}" style="--c:${t.couleur}">
    <small>${t.niveaux.length} niveaux · ${t.niveaux[0].niv} à ${t.niveaux[t.niveaux.length - 1].niv}</small>
    <h3>${esc(t.titre)}</h3><span class="muted">${esc(t.element)}</span>
    <div class="steps">${t.niveaux.map((_, i) => `<span style="--i:${i}"></span>`).join('')}</div></a>`;
}

function pageFamille(id, filter) {
  const f = FAMILLES.find(x => x.id === id);
  if (!f) return pageNotFound();
  setAccent(f.couleur);
  const levels = Object.keys(NIVEAUX).filter(n => f.elements.some(e => e.niv === n));
  const shown = filter && levels.includes(filter) ? [filter] : levels;
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <span>${esc(f.titre)}</span></nav>
    <div class="page-head page-enter"><div><h1>Famille des <em>${esc(f.titre)}</em></h1><p>${esc(f.resume)} Touche une figure pour voir l’animation.</p></div></div>
    <div class="filters" role="group" aria-label="Filtrer par difficulté">
      <a class="chip ${!filter ? 'on' : ''}" href="#/famille/${f.id}">Toutes</a>
      ${levels.map(n => `<a class="chip ${filter === n ? 'on' : ''}" href="#/famille/${f.id}/${n}"><i style="background:${LEVEL_COLORS[n]}">${n}</i>${NIVEAUX[n].nom}</a>`).join('')}
    </div>
    ${shown.map(n => `
      <section class="level-block page-enter">
        <div class="level-head"><span class="level-badge" style="background:${LEVEL_COLORS[n]}">${n}</span><div><h2>Difficulté ${n}</h2><span>${NIVEAUX[n].nom}</span></div></div>
        <div class="grid el-grid">${f.elements.filter(e => e.niv === n).map(e => elCard(e, f)).join('')}</div>
      </section>`).join('')}`;
  lazyThumbs(app);
}

function elCard(e, f) {
  return `<a class="el-card" href="#/element/${e.id}">
    ${e.prof ? '<span class="prof-flag">Avec le prof</span>' : ''}
    <canvas data-anim="${e.anim}" data-accent="${f.couleur}" aria-hidden="true"></canvas>
    <span class="play-hint" aria-hidden="true"><svg viewBox="0 0 10 12"><path d="M0 0 L10 6 L0 12Z"/></svg></span>
    <div class="el-body"><h3>${esc(e.nom)}</h3>${lvlTag(e.niv)}</div></a>`;
}

function pageElement(id) {
  const e = elById(id);
  if (!e) return pageNotFound();
  const f = e.fam;
  setAccent(f.couleur);
  const list = f.elements;
  const i = list.findIndex(x => x.id === id);
  const prev = list[i - 1], next = list[i + 1];
  const th = e.lien && themeById(e.lien[0]);
  const lv = th && th.niveaux.find(n => n.niv === e.lien[1]);
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <a href="#/famille/${f.id}">${esc(f.titre)}</a> › <span>${esc(e.nom)}</span></nav>
    <div class="page-head page-enter"><div><h1>${esc(e.nom)}</h1><p>Famille des ${esc(f.titre.toLowerCase())} · difficulté ${e.niv} (${NIVEAUX[e.niv].nom.toLowerCase()})</p></div><span class="level-badge" style="background:${LEVEL_COLORS[e.niv]}">${e.niv}</span></div>
    <div class="el-layout page-enter">
      <div>
        ${e.variantes ? `<div class="variants">${e.variantes.map((v, k) => `<button class="chip ${k === 0 ? 'on' : ''}" data-variant="${v.anim}">${esc(v.nom)}</button>`).join('')}</div>` : ''}
        <div id="player"></div>
        <a class="an-link" href="#/analyse/element/${e.id}">🎥 Filmer un camarade et comparer avec cette animation</a>
        ${e.prof || lv?.parade ? `<div class="warn">⚠️ Élément à travailler uniquement avec le professeur et une parade.</div>` : ''}
      </div>
      <aside>
        <div class="panel"><h2>Critères de réalisation</h2><ul class="checks">${e.criteres.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
        <div class="panel"><h2>Les étapes du mouvement</h2><ol class="phase-list" id="phases"></ol></div>
        ${lv ? `<div class="panel"><h2>Pour t’entraîner</h2>
          <a class="link-card" href="#/progression/${th.id}/${lv.niv}"><span class="level-badge" style="background:${LEVEL_COLORS[lv.niv]}">${lv.niv}</span><div><b>${esc(lv.nom)}</b><span>Progression « ${esc(th.titre)} » : consignes, matériel, aides</span></div><span class="arrow">›</span></a></div>` : ''}
      </aside>
    </div>
    <nav class="pager">
      ${prev ? `<a href="#/element/${prev.id}"><small>‹ Précédent</small>${esc(prev.nom)}</a>` : '<span></span>'}
      ${next ? `<a class="next" href="#/element/${next.id}"><small>Suivant ›</small>${esc(next.nom)}</a>` : '<span></span>'}
    </nav>`;
  const holder = $('#player');
  const phasesEl = $('#phases');
  const load = animId => {
    players.forEach(p => p.destroy()); players = [];
    holder.innerHTML = '';
    const p = mountPlayer(holder, animId, f.couleur);
    if (!p) return;
    phasesEl.innerHTML = p.b.phases.map((ph, k) => `<li><button data-i="${k}">${esc(ph.label)}</button></li>`).join('');
    phasesEl.querySelectorAll('button').forEach(b => (b.onclick = () => p.seek(p.b.phases[+b.dataset.i].t + 0.001, true)));
    p.onPhase = k => phasesEl.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === k));
  };
  load(e.anim);
  app.querySelectorAll('[data-variant]').forEach(b => (b.onclick = () => {
    app.querySelectorAll('[data-variant]').forEach(x => x.classList.toggle('on', x === b));
    load(b.dataset.variant);
  }));
}

function pageProgressions() {
  setAccent('#22d3ee');
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <span>Progressions</span></nav>
    <div class="page-head page-enter"><div><h1>Progressions <em>pas à pas</em></h1><p>${THEMES.length} thèmes de travail, du niveau A au niveau le plus haut. Valide chaque niveau avant de passer au suivant.</p></div></div>
    <div class="grid theme-grid page-enter">${THEMES.map(themeCard).join('')}</div>`;
}

function pageProgression(id, openLv) {
  const t = themeById(id);
  if (!t) return pageNotFound();
  setAccent(t.couleur);
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <a href="#/progressions">Progressions</a> › <span>${esc(t.titre)}</span></nav>
    <div class="page-head page-enter"><div><h1>${esc(t.titre)}</h1><p>${esc(t.element)} · ${t.niveaux.length} niveaux. Ouvre un niveau pour voir l’animation, les consignes et le matériel.</p></div></div>
    <div class="ladder page-enter">${t.niveaux.map((n, k) => `
      <details class="step" id="niv-${n.niv}" data-k="${k}" style="--lc:${LEVEL_COLORS[n.niv]}" ${n.niv === openLv ? 'open' : ''}>
        <summary><span class="level-badge">${n.niv}</span><div><h3>${esc(n.nom)}</h3><p>${esc(n.criteres.join(' · '))}</p></div><span class="chev" aria-hidden="true"></span></summary>
        <div class="step-body"></div>
      </details>`).join('')}</div>
    <p class="muted" style="margin-top:18px">Seul le professeur valide un niveau : l’élément doit être réussi du premier coup, en respectant les critères, avec une réception maîtrisée.</p>`;
  app.querySelectorAll('details.step').forEach(d => {
    const fill = () => {
      const body = d.querySelector('.step-body');
      if (d.open && !body.dataset.done) {
        body.dataset.done = '1';
        const n = t.niveaux[+d.dataset.k];
        body.innerHTML = `
          <div><div class="pl-holder"></div><a class="an-link" href="#/analyse/niveau/${t.id}/${n.niv}">🎥 Filmer et comparer ce niveau</a>${n.parade ? '<div class="warn">⚠️ Toujours avec une parade et le professeur.</div>' : ''}</div>
          <div>
            <h4>Critères de réussite</h4><ul class="checks">${n.criteres.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
            <h4 style="margin-top:14px">Consignes</h4><ol>${n.consignes.map(c => `<li>${esc(c)}</li>`).join('')}</ol>
            <h4 style="margin-top:14px">Matériel</h4><div class="mat">${n.materiel.map(m => `<span>${esc(m)}</span>`).join('')}</div>
          </div>
          ${n.remediations.length ? `<div class="reme"><h4>Tu bloques ? Essaie d’abord :</h4>${n.remediations.map((r, j) => `
            <details data-j="${j}"><summary>💡 ${esc(r.nom)} <small>${r.materiel.slice(0, 2).map(esc).join(', ')}</small></summary><div class="reme-body"></div></details>`).join('')}</div>` : ''}`;
        mountPlayer(body.querySelector('.pl-holder'), n.anim, LEVEL_COLORS[n.niv], { compact: true });
        body.querySelectorAll('.reme details').forEach(rd => rd.addEventListener('toggle', () => {
          const rb = rd.querySelector('.reme-body');
          if (!rd.open || rb.dataset.done) return;
          rb.dataset.done = '1';
          const r = n.remediations[+rd.dataset.j];
          rb.innerHTML = `<div class="pl-holder"></div><div>
            <h4>${r.seulementDiff ? 'Comme le niveau, mais :' : 'Consignes'}</h4><ol>${r.consignes.map(c => `<li>${esc(c)}</li>`).join('')}</ol>
            <h4 style="margin-top:12px">Matériel</h4><div class="mat">${r.materiel.map(m => `<span>${esc(m)}</span>`).join('')}</div></div>`;
          mountPlayer(rb.querySelector('.pl-holder'), r.anim, LEVEL_COLORS[n.niv], { compact: true });
        }));
      }
    };
    d.addEventListener('toggle', () => { fill(); if (d.open) setFab(`#/analyse/niveau/${t.id}/${t.niveaux[+d.dataset.k].niv}`); });
    fill();
  });
  if (openLv) setTimeout(() => $('#niv-' + openLv)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
}

function pageSecurite() {
  setAccent('#22c55e');
  const S = SECURITE, V = VALIDATION;
  const list = a => (a || []).map(x => `<li>${esc(x)}</li>`).join('');
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <span>Sécurité et validation</span></nav>
    <div class="page-head page-enter"><div><h1>Sécurité <em>d’abord</em></h1><p>À relire avant chaque séance.</p></div></div>
    <div class="rules page-enter">
      <div class="panel"><h2>Matériel et espace de travail</h2><ul class="checks">${list(S.materiel)}</ul></div>
      <div class="panel"><h2>Ce que je dis, ce que je fais</h2><ul class="say">${list(S.regles)}</ul></div>
      <div class="panel"><h2>Parade et aide</h2><p><b>Parade :</b> ${esc(S.parade)}</p><p><b>Aide :</b> ${esc(S.aide)}</p><ul class="checks">${list(S.criteresParade)}</ul></div>
      <div class="panel"><h2>Interdit</h2><ul class="checks">${list(S.interdits)}</ul></div>
    </div>
    <div class="section-title" id="validation"><h2>Valider un niveau</h2></div>
    <div class="rules">
      <div class="panel"><p class="quote">« ${esc(V.devise)} »</p><p class="muted">${esc(V.niveaux)}</p></div>
      <div class="panel"><h2>Pour valider</h2><ul class="checks">${list(V.criteres)}<li>${esc(V.seulProf)}</li></ul></div>
    </div>`;
  if (location.hash.includes('#validation')) setTimeout(() => $('#validation')?.scrollIntoView(), 50);
}


// ------------------------------------------------------------------ créer mon enchaînement
const SEQ_KEY = 'gymeps:enchainement';
function loadSeq(fromHash) {
  // ordre = liste d'identifiants de familles ; choix = { famille: élément }
  let st = null;
  if (fromHash) {
    const ids = fromHash.split(',').map(decodeURIComponent);
    const order = [], pick = {};
    for (const id of ids) { const e = elById(id); if (e && !pick[e.fam.id]) { order.push(e.fam.id); pick[e.fam.id] = id; } }
    for (const f of FAMILLES) if (!order.includes(f.id)) order.push(f.id);
    st = { order, pick };
  }
  if (!st) { try { st = JSON.parse(localStorage.getItem(SEQ_KEY) || 'null'); } catch { st = null; } }
  if (!st || !Array.isArray(st.order) || st.order.length !== FAMILLES.length) st = { order: FAMILLES.map(f => f.id), pick: {} };
  return st;
}
function saveSeq(st) { try { localStorage.setItem(SEQ_KEY, JSON.stringify(st)); } catch { /* navigation privée */ } }

function pageEnchainement(fromHash) {
  setAccent('#f59e0b');
  const st = loadSeq(fromHash);
  saveSeq(st);
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <span>Mon enchaînement</span></nav>
    <div class="page-head page-enter"><div><h1>Créer mon <em>enchaînement</em></h1>
      <p>Choisis <b>un élément dans chaque famille</b>, range-les dans l’ordre que tu veux, puis regarde ton enchaînement en entier, figure après figure.</p></div></div>
    <div class="seq-tools page-enter">
      <div class="seq-summary" id="seq-sum"></div>
      <div class="seq-actions">
        <button class="chip" id="seq-rand">🎲 Au hasard</button>
        <button class="chip" id="seq-clear">Tout effacer</button>
        <button class="chip" id="seq-link">🔗 Copier le lien</button>
      </div>
    </div>
    <ol class="seq-list page-enter" id="seq-list"></ol>
    <div class="seq-play">
      <button class="seq-go" id="seq-go">▶ Voir mon enchaînement</button>
      <p class="muted" id="seq-go-hint"></p>
      <div id="seq-player"></div>
    </div>
    <div class="sheet" id="seq-sheet" hidden><div class="sheet-box" role="dialog" aria-label="Choisir un élément"><div class="sheet-head"><h2 id="sheet-title"></h2><button class="sheet-x" aria-label="Fermer">✕</button></div><div class="sheet-body" id="sheet-body"></div></div></div>`;
  const list = $('#seq-list');
  const render = () => {
    list.innerHTML = st.order.map((fid, i) => {
      const f = FAMILLES.find(x => x.id === fid);
      const e = st.pick[fid] ? elById(st.pick[fid]) : null;
      return `<li class="seq-slot ${e ? 'full' : ''}" style="--c:${f.couleur}">
        <span class="seq-num">${i + 1}</span>
        <div class="seq-main">
          <small>${esc(f.court || f.titre)}</small>
          ${e ? `<b>${esc(e.nom)}</b> ${lvlTag(e.niv)}` : '<b class="muted">Pas encore choisi</b>'}
        </div>
        ${e ? `<canvas data-anim="${e.anim}" data-accent="${f.couleur}" aria-hidden="true"></canvas>` : ''}
        <div class="seq-btns">
          <button class="seq-pick" data-f="${fid}">${e ? 'Changer' : 'Choisir'}</button>
          <span class="seq-move">
            <button data-up="${i}" aria-label="Monter" ${i === 0 ? 'disabled' : ''}>▲</button>
            <button data-down="${i}" aria-label="Descendre" ${i === st.order.length - 1 ? 'disabled' : ''}>▼</button>
          </span>
        </div>
      </li>`;
    }).join('');
    const chosen = st.order.filter(f => st.pick[f]).map(f => elById(st.pick[f]));
    $('#seq-sum').innerHTML = `<b>${chosen.length}/6</b> éléments choisis ${chosen.length ? '· ' + chosen.map(e => lvlTag(e.niv)).join(' ') : ''}`;
    $('#seq-go').disabled = chosen.length < 2;
    $('#seq-go-hint').textContent = chosen.length < 6 ? (chosen.length < 2 ? 'Choisis au moins 2 éléments pour voir l’enchaînement (6 pour l’enchaînement complet).' : `Il manque ${6 - chosen.length} famille(s) pour un enchaînement complet.`) : '';
    list.querySelectorAll('.seq-pick').forEach(b => (b.onclick = () => openPicker(b.dataset.f)));
    list.querySelectorAll('[data-up]').forEach(b => (b.onclick = () => { const i = +b.dataset.up; [st.order[i - 1], st.order[i]] = [st.order[i], st.order[i - 1]]; changed(); }));
    list.querySelectorAll('[data-down]').forEach(b => (b.onclick = () => { const i = +b.dataset.down; [st.order[i + 1], st.order[i]] = [st.order[i], st.order[i + 1]]; changed(); }));
    if (thumbsIO) thumbsIO.disconnect();
    lazyThumbs(list);
  };
  const changed = () => {
    saveSeq(st);
    const ids = st.order.filter(f => st.pick[f]).map(f => st.pick[f]);
    history.replaceState(null, '', '#/enchainement' + (ids.length ? '/' + ids.join(',') : ''));
    players.forEach(p => p.destroy()); players = [];
    $('#seq-player').innerHTML = '';
    render();
  };
  const sheet = $('#seq-sheet');
  const close = () => { sheet.hidden = true; if (thumbsIO) thumbsIO.disconnect(); lazyThumbs(list); };
  sheet.querySelector('.sheet-x').onclick = close;
  sheet.onclick = e => { if (e.target === sheet) close(); };
  function openPicker(fid) {
    const f = FAMILLES.find(x => x.id === fid);
    $('#sheet-title').innerHTML = `Famille des <span style="color:${f.couleur}">${esc(f.titre)}</span>`;
    const levels = Object.keys(NIVEAUX).filter(n => f.elements.some(e => e.niv === n));
    $('#sheet-body').innerHTML = levels.map(n => `
      <div class="level-head"><span class="level-badge" style="background:${LEVEL_COLORS[n]}">${n}</span><div><h2>Difficulté ${n}</h2><span>${NIVEAUX[n].nom}</span></div></div>
      <div class="grid el-grid">${f.elements.filter(e => e.niv === n).map(e => `
        <button class="el-card pick-card ${st.pick[fid] === e.id ? 'on' : ''}" data-el="${e.id}" style="--fc:${f.couleur}">
          <canvas data-anim="${e.anim}" data-accent="${f.couleur}" aria-hidden="true"></canvas>
          <div class="el-body"><h3>${esc(e.nom)}</h3>${lvlTag(e.niv)}</div></button>`).join('')}</div>`).join('');
    sheet.hidden = false;
    sheet.querySelector('.sheet-box').scrollTop = 0;
    sheet.querySelectorAll('[data-el]').forEach(b => (b.onclick = () => { st.pick[fid] = b.dataset.el; close(); changed(); }));
    if (thumbsIO) thumbsIO.disconnect();
    lazyThumbs(sheet);
  }
  $('#seq-rand').onclick = () => { for (const f of FAMILLES) st.pick[f.id] = f.elements[Math.floor(Math.random() * f.elements.length)].id; changed(); };
  $('#seq-clear').onclick = () => { st.pick = {}; st.order = FAMILLES.map(f => f.id); changed(); };
  $('#seq-link').onclick = async () => {
    const url = location.href;
    try { await navigator.clipboard.writeText(url); $('#seq-link').textContent = '✓ Lien copié'; } catch { prompt('Copie ce lien :', url); }
    setTimeout(() => { const b = $('#seq-link'); if (b) b.textContent = '🔗 Copier le lien'; }, 2000);
  };
  $('#seq-go').onclick = () => {
    const items = st.order.filter(f => st.pick[f]).map(f => { const e = elById(st.pick[f]); return { anim: e.anim, nom: e.nom }; });
    if (items.length < 2) return;
    players.forEach(p => p.destroy()); players = [];
    const holder = $('#seq-player');
    holder.innerHTML = '';
    const id = 'seq:' + items.map(x => x.anim).join(',');
    const p = new Player(holder, { id, def: buildSequence(items), accent: '#f59e0b', view: 'trois', follow: true });
    players.push(p);
    holder.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  render();
}


// ------------------------------------------------------------------ enregistrer ma progression
// Écriture seule dans Supabase (fonction gymeps_save) : le site ne relit jamais les résultats des élèves.
const SUPA = { url: 'https://vvsmienmspftdzqykhnt.supabase.co', key: 'sb_publishable_D0cEBEyEtCTA6Ys1xsQKoA_-uN-BEEN' };
async function saveProgress(prenom, nom, classe, niveaux) {
  const r = await fetch(SUPA.url + '/rest/v1/rpc/gymeps_save', {
    method: 'POST',
    headers: { apikey: SUPA.key, Authorization: 'Bearer ' + SUPA.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_prenom: prenom, p_nom: nom, p_classe: classe, p_niveaux: niveaux }),
  });
  if (!r.ok) throw new Error((await r.text()).slice(0, 200));
  return r.json();
}

// les 6 familles de l'accueil, niveaux A → D présents dans chaque famille
const PROG_CATS = FAMILLES.map(f => ({
  id: f.id, titre: f.titre, couleur: f.couleur,
  niveaux: Object.keys(NIVEAUX).filter(n => f.elements.some(e => e.niv === n)).map(n => ({
    niv: n, nom: `${NIVEAUX[n].nom} (${f.elements.filter(e => e.niv === n).map(e => e.nom).join(', ')})` })),
}));

function pageMaProgression() {
  setAccent('#22c55e');
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <span>Enregistrer ma progression</span></nav>
    <div class="page-head page-enter"><div><h1>Enregistrer ma <em>progression</em></h1>
      <p>Écris ton prénom et ton nom, puis, pour chaque famille, le <b>plus haut niveau validé aujourd’hui par ton professeur</b>. Laisse « Pas de changement » si tu n’as rien validé de nouveau : ton ancien résultat est gardé.</p></div></div>
    <form class="prog-form page-enter" id="prog-form" autocomplete="off">
      <div class="panel prog-who">
        <label><span>Prénom</span><input name="prenom" required maxlength="40" autocomplete="off"></label>
        <label><span>Nom de famille</span><input name="nom" required maxlength="40" autocomplete="off"></label>
        <label><span>Classe <small class="muted">(facultatif)</small></span><input name="classe" maxlength="20" placeholder="ex. 4eB" autocomplete="off"></label>
      </div>
      <div class="prog-themes">
        ${PROG_CATS.map(t => `
          <div class="panel prog-theme" style="--fc:${t.couleur}">
            <h2>${esc(t.titre)}</h2>
            <p class="muted">Difficulté de l’élément le plus dur réussi</p>
            <div class="prog-levels" role="radiogroup" aria-label="${esc(t.titre)}">
              <label class="lv-opt none"><input type="radio" name="t-${t.id}" value="" checked><span>Pas de changement</span></label>
              ${t.niveaux.map(n => `<label class="lv-opt" title="${esc(n.nom)}"><input type="radio" name="t-${t.id}" value="${n.niv}"><span style="--lc:${LEVEL_COLORS[n.niv]}">${n.niv}</span></label>`).join('')}
            </div>
            <p class="lv-name muted" data-t="${t.id}">&nbsp;</p>
          </div>`).join('')}
      </div>
      <div class="prog-send">
        <button type="submit" class="seq-go" style="--fc:#22c55e">Enregistrer</button>
        <p class="muted" id="prog-msg" role="status"></p>
      </div>
    </form>`;
  const form = $('#prog-form');
  form.querySelectorAll('input[type=radio]').forEach(r => (r.onchange = () => {
    const tid = r.name.slice(2);
    const t = PROG_CATS.find(x => x.id === tid);
    const n = t.niveaux.find(x => x.niv === r.value);
    form.querySelector(`.lv-name[data-t="${tid}"]`).textContent = n ? `Niveau ${n.niv} : ${n.nom}` : ' ';
  }));
  form.onsubmit = async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const prenom = (fd.get('prenom') || '').trim(), nom = (fd.get('nom') || '').trim(), classe = (fd.get('classe') || '').trim();
    const niveaux = {};
    for (const t of PROG_CATS) { const v = fd.get('t-' + t.id); if (v) niveaux[t.id] = v; }
    const msg = $('#prog-msg');
    if (!prenom || !nom) { msg.textContent = 'Écris ton prénom et ton nom.'; return; }
    if (!Object.keys(niveaux).length && !confirm('Tu n’as choisi aucun niveau. Enregistrer quand même ton nom ?')) return;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; msg.textContent = 'Enregistrement…';
    try {
      await saveProgress(prenom, nom, classe, niveaux);
      app.innerHTML = `<div class="page-head page-enter" style="margin-top:30px"><div><h1>C’est <em>enregistré</em> ✅</h1>
        <p>Merci ${esc(prenom)} ! ${Object.keys(niveaux).length ? `Niveaux envoyés : ${PROG_CATS.filter(t => niveaux[t.id]).map(t => `${esc(t.titre)} → <b>${niveaux[t.id]}</b>`).join(' · ')}.` : ''}</p>
        <p><a class="chip" href="#/">Retour à l’accueil</a> <a class="chip" href="#/ma-progression">Enregistrer un autre élève</a></p></div></div>`;
    } catch (err) {
      btn.disabled = false;
      msg.textContent = 'Impossible d’enregistrer pour l’instant (pas de connexion ?). Réessaie dans un moment.';
      console.error(err);
    }
  };
}

function pageNotFound() {
  setAccent('#22d3ee');
  app.innerHTML = `<div class="page-head" style="margin-top:30px"><div><h1>Oups</h1><p>Cette page n’existe pas. <a href="#/">Retour à l’accueil</a></p></div></div>`;
}

// ------------------------------------------------------------------ navigation
function route() {
  cleanup();
  const h = location.hash.replace(/^#\/?/, '').split('#')[0];
  const [a, b, c] = h.split('/');
  document.querySelectorAll('[data-nav]').forEach(x => x.classList.toggle('on', (x.dataset.nav === 'home' && (!a || a === 'famille' || a === 'element')) || x.dataset.nav === a || (x.dataset.nav === 'progressions' && a === 'progression')));
  if (!a) pageHome();
  else if (a === 'famille') pageFamille(b, c);
  else if (a === 'element') pageElement(b);
  else if (a === 'progressions') pageProgressions();
  else if (a === 'progression') pageProgression(b, c);
  else if (a === 'securite') pageSecurite();
  else if (a === 'enchainement') pageEnchainement(b);
  else if (a === 'ma-progression') pageMaProgression();
  else if (a === 'analyse') pageAnalyse(b, c, h.split('/')[3]);
  else pageNotFound();
  setFab(analyseHref(a, b, c), a === 'analyse' || a === 'ma-progression');
  const titles = { famille: FAMILLES.find(f => f.id === b)?.titre, element: elById(b)?.nom, progression: themeById(b)?.titre, progressions: 'Progressions', securite: 'Sécurité', enchainement: 'Mon enchaînement', 'ma-progression': 'Enregistrer ma progression', analyse: 'Filmer et comparer' };
  document.title = (titles[a] ? titles[a] + ' · ' : '') + 'Gym EPS';
  if (!(a === 'progression' && c) && !location.hash.includes('#validation')) window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
}
// bouton flottant « Filmer et comparer », présent sur toutes les pages (il vise la figure affichée)
const fab = $('.fab-analyse');
function setFab(href, hide) { if (!fab) return; if (href) fab.href = href; if (hide !== undefined) fab.hidden = hide; }
initAnalyse({ app, $, esc, elById, themeById, FAMILLES, THEMES, NIVEAUX, LEVEL_COLORS, lvlTag, setAccent, lazyThumbs, mountPlayer, pageNotFound,
  resetPlayers: () => { players.forEach(p => p.destroy()); players = []; } });
window.addEventListener('hashchange', route);
route();

// ------------------------------------------------------------------ recherche
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const INDEX = [
  ...ELEMENTS.map(e => ({ label: e.nom, sub: `${e.fam.court || e.fam.titre} · ${e.niv}`, href: `#/element/${e.id}`, niv: e.niv, key: norm(e.nom + ' ' + e.fam.titre) })),
  ...THEMES.flatMap(t => t.niveaux.map(n => ({ label: n.nom, sub: `Progression ${t.titre.toLowerCase()} · niveau ${n.niv}`, href: `#/progression/${t.id}/${n.niv}`, niv: n.niv, key: norm(n.nom + ' ' + t.titre + ' ' + t.element) }))),
];
const layer = $('.search-layer'), input = $('.search-layer input'), results = $('.search-results');
let sel = 0;
function openSearch() { layer.hidden = false; input.value = ''; renderResults(); input.focus(); }
function closeSearch() { layer.hidden = true; }
function renderResults() {
  const q = norm(input.value.trim());
  const words = q.split(/\s+/).filter(Boolean);
  const hits = (words.length ? INDEX.filter(it => words.every(w => it.key.includes(w))) : INDEX.slice(0, 8)).slice(0, 30);
  sel = 0;
  results.innerHTML = hits.length ? hits.map((h, i) => `<li><a href="${h.href}" class="${i === 0 ? 'sel' : ''}">${lvlTag(h.niv)}<span>${esc(h.label)}</span><small>${esc(h.sub)}</small></a></li>`).join('') : '<li class="empty">Aucune figure trouvée.</li>';
}
$('.search-btn').onclick = openSearch;
layer.addEventListener('click', e => { if (e.target === layer || e.target.closest('a')) closeSearch(); });
input.addEventListener('input', renderResults);
input.addEventListener('keydown', e => {
  const links = [...results.querySelectorAll('a')];
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % Math.max(1, links.length);
    links.forEach((l, i) => l.classList.toggle('sel', i === sel)); e.preventDefault();
  } else if (e.key === 'Enter' && links[sel]) { location.hash = links[sel].getAttribute('href'); closeSearch(); }
  else if (e.key === 'Escape') closeSearch();
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && layer.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  if (e.key === 'Escape' && !layer.hidden) closeSearch();
});

window.__gymReady = true;

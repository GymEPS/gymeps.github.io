// Mode « Filmer et comparer » : un élève filme son camarade, la vidéo se place à côté de l'animation de la même figure,
// on lit les deux ensemble (calées au même instant) et l'élève juge lui-même chaque critère.
// La vidéo ne quitte JAMAIS l'appareil : elle reste en mémoire (lien blob:) et disparaît quand on quitte la page.
// Pensé d'abord pour la TABLETTE : gros boutons, côte à côte à l'horizontale, l'un sous l'autre à la verticale, mode plein écran.

let C; // outils de app.js (voir initAnalyse)
let live = null; // ce qu'il faut arrêter en quittant la page (caméra, enregistrement, boucle, lien de la vidéo)

export function initAnalyse(ctx) { C = ctx; }

/** Arrêter caméra / enregistrement / boucle et libérer la vidéo (appelé à chaque changement de page). */
export function analyseCleanup() {
  if (!live) return;
  cancelAnimationFrame(live.raf);
  try { if (live.rec && live.rec.state !== 'inactive') live.rec.stop(); } catch { /* déjà arrêté */ }
  stopStream();
  if (live.url) URL.revokeObjectURL(live.url);
  document.body.classList.remove('cmp-lock');
  live = null;
}
function stopStream() {
  if (live && live.stream) { live.stream.getTracks().forEach(t => t.stop()); live.stream = null; }
}

/** Adresse du mode analyse pour la page affichée (bouton flottant). */
export function analyseHref(a, b, c) {
  if (a === 'element' && b) return `#/analyse/element/${b}`;
  if (a === 'progression' && b && c) return `#/analyse/niveau/${b}/${c}`;
  if (a === 'progression' && b) return `#/analyse/progression/${b}`;
  return '#/analyse';
}

/** Figure à comparer : élément d'une famille ou niveau d'une progression. */
function target(kind, b, c) {
  const { elById, themeById, NIVEAUX, LEVEL_COLORS } = C;
  if (kind === 'element') {
    const e = elById(b);
    if (!e) return null;
    const anims = e.variantes ? e.variantes.map(v => ({ nom: v.nom, anim: v.anim })) : [{ nom: e.nom, anim: e.anim }];
    return { titre: e.nom, sous: `${e.fam.titre} · difficulté ${e.niv} (${NIVEAUX[e.niv].nom.toLowerCase()})`, niv: e.niv, couleur: e.fam.couleur,
      anims, criteres: e.criteres, back: `#/element/${e.id}`, backLabel: 'la fiche de la figure', prof: e.prof,
      entrainement: e.lien ? `#/progression/${e.lien[0]}/${e.lien[1]}` : null };
  }
  if (kind === 'niveau') {
    const t = themeById(b), n = t && t.niveaux.find(x => x.niv === c);
    if (!n) return null;
    return { titre: n.nom, sous: `Progression « ${t.titre} » · niveau ${n.niv}`, niv: n.niv, couleur: LEVEL_COLORS[n.niv],
      anims: [{ nom: n.nom, anim: n.anim }], criteres: n.criteres, back: `#/progression/${t.id}/${n.niv}`, backLabel: 'la fiche du niveau', prof: n.parade,
      entrainement: n.remediations && n.remediations.length ? `#/progression/${t.id}/${n.niv}` : null };
  }
  return null;
}

export function pageAnalyse(kind, b, c) {
  if (kind === 'element' || kind === 'niveau') {
    const T = target(kind, b, c);
    return T ? pageCompare(T, kind, b, c) : C.pageNotFound();
  }
  return pagePicker(kind === 'progression' ? b : null);
}

// ------------------------------------------------------------------ 1. choisir la figure
function pagePicker(themeId) {
  const { app, $, esc, FAMILLES, THEMES, LEVEL_COLORS, lvlTag, setAccent, lazyThumbs } = C;
  setAccent('#f43f5e');
  const tab = themeId ? 'prog' : 'fig';
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <span>Filmer et comparer</span></nav>
    <div class="page-head page-enter"><div><h1>Filmer et <em>comparer</em></h1>
      <p>Filme ton camarade pendant qu’il fait la figure : sa vidéo se place à côté de l’animation, vous regardez les deux ensemble, au ralenti si besoin, et vous jugez si chaque critère est réussi.</p></div></div>
    <ol class="an-how page-enter">
      <li><b>1</b><span>Choisis la figure</span></li>
      <li><b>2</b><span>Filme ton camarade</span></li>
      <li><b>3</b><span>Compare et juge</span></li>
    </ol>
    <div class="an-tabs page-enter" role="tablist">
      <button role="tab" data-tab="fig" aria-selected="${tab === 'fig'}">Figures des 6 familles</button>
      <button role="tab" data-tab="prog" aria-selected="${tab === 'prog'}">Niveaux des progressions</button>
    </div>
    <div class="an-search page-enter"><input type="search" placeholder="Chercher une figure : roue, ATR, saut…" aria-label="Chercher une figure" autocomplete="off"></div>
    <div id="an-list" class="page-enter"></div>`;
  const list = $('#an-list'), q = $('.an-search input');
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  let cur = tab;
  const render = () => {
    const words = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    const ok = s => words.every(w => norm(s).includes(w));
    if (cur === 'fig') {
      list.innerHTML = FAMILLES.map(f => {
        const els = f.elements.filter(e => ok(e.nom + ' ' + f.titre));
        if (!els.length) return '';
        return `<section class="an-fam" style="--fc:${f.couleur}"><h2>${esc(f.titre)}</h2><div class="grid el-grid">${els.map(e => `
          <a class="el-card" href="#/analyse/element/${e.id}">
            <canvas data-anim="${e.anim}" data-accent="${f.couleur}" aria-hidden="true"></canvas>
            <div class="el-body"><h3>${esc(e.nom)}</h3>${lvlTag(e.niv)}</div></a>`).join('')}</div></section>`;
      }).join('') || '<p class="muted">Aucune figure trouvée.</p>';
    } else {
      list.innerHTML = THEMES.filter(t => !themeId || t.id === themeId || words.length).map(t => {
        const lv = t.niveaux.filter(n => ok(n.nom + ' ' + t.titre + ' ' + t.element));
        if (!lv.length) return '';
        return `<section class="an-fam" style="--fc:${t.couleur}"><h2>${esc(t.titre)}</h2><div class="an-levels">${lv.map(n => `
          <a class="an-level" href="#/analyse/niveau/${t.id}/${n.niv}" style="--lc:${LEVEL_COLORS[n.niv]}"><span class="level-badge">${n.niv}</span><b>${esc(n.nom)}</b><span class="arrow">›</span></a>`).join('')}</div></section>`;
      }).join('') + (themeId && !words.length ? '<p><a class="chip" href="#/analyse/progression">Voir toutes les progressions</a></p>' : '') || '<p class="muted">Aucun niveau trouvé.</p>';
    }
    lazyThumbs(list);
  };
  app.querySelectorAll('[data-tab]').forEach(btn => (btn.onclick = () => {
    cur = btn.dataset.tab;
    app.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === btn));
    render();
  }));
  q.addEventListener('input', render);
  render();
}

// ------------------------------------------------------------------ 2 et 3. filmer, comparer, juger
const fmt = s => (Math.max(0, s) || 0).toFixed(1).replace('.', ',') + ' s';
const MAX_REC = 60; // secondes

function pageCompare(T, kind, b, c) {
  const { app, $, esc, setAccent, mountPlayer, LEVEL_COLORS } = C;
  setAccent(T.couleur);
  live = { raf: 0, stream: null, rec: null, url: null, facing: 'environment', offset: 0, speed: 1, mirror: false };
  const canFilm = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  app.innerHTML = `
    <nav class="crumbs page-enter"><a href="#/">Accueil</a> › <a href="#/analyse">Filmer et comparer</a> › <span>${esc(T.titre)}</span></nav>
    <div class="page-head an-head page-enter"><div><h1>${esc(T.titre)}</h1><p>${esc(T.sous)}</p></div>
      <div class="an-head-links"><a class="chip" href="#/analyse">Changer de figure</a><a class="chip" href="${T.back}">Voir ${esc(T.backLabel)}</a></div></div>
    ${T.prof ? '<div class="warn page-enter">⚠️ Figure à faire uniquement avec le professeur et une parade.</div>' : ''}
    <div class="cmp-wrap" id="cmp-wrap">
      <div class="cmp" id="cmp">
        <section class="cmp-pane cmp-video" aria-label="Ta vidéo">
          <div class="pane-label"><span>📹 Ta vidéo</span><span class="pane-time" id="v-time"></span></div>
          <div class="vbox" id="vbox"></div>
        </section>
        <section class="cmp-pane cmp-model" aria-label="L’animation modèle">
          <div class="pane-label"><span>🧍 Le modèle</span>${T.anims.length > 1 ? `<span class="pane-variants">${T.anims.map((v, k) => `<button class="chip ${k === 0 ? 'on' : ''}" data-variant="${k}">${esc(v.nom)}</button>`).join('')}</span>` : ''}</div>
          <div id="an-player"></div>
        </section>
      </div>
      <div class="cmp-bar" id="cmp-bar" hidden>
        <div class="cmp-scrub"><input type="range" id="v-scrub" min="0" max="1000" value="0" aria-label="Position dans la vidéo"></div>
        <div class="cmp-ctrls">
          <button class="cb" id="b-start" aria-label="Revenir au début">⏮</button>
          <button class="cb" id="b-prev" aria-label="Image précédente">◀︎<small>image</small></button>
          <button class="cb cb-main" id="b-play">▶︎ Lire les deux</button>
          <button class="cb" id="b-next" aria-label="Image suivante"><small>image</small>▶︎</button>
          <div class="cb-speed" role="group" aria-label="Vitesse">${[0.25, 0.5, 1].map(s => `<button data-speed="${s}" class="${s === 1 ? 'on' : ''}">${s === 1 ? '×1' : s === 0.5 ? '×½' : '×¼'}</button>`).join('')}</div>
        </div>
        <div class="cmp-ctrls cmp-ctrls2">
          <button class="cb cb-sync" id="b-sync">🔗 Caler ici</button>
          <button class="cb" id="b-mirror" aria-pressed="false">↔︎ Miroir</button>
          <button class="cb" id="b-full" aria-pressed="false">⛶ Agrandir</button>
          <button class="cb" id="b-redo">🔄 Refaire la vidéo</button>
        </div>
        <p class="sync-info" id="sync-info"></p>
      </div>
    </div>
    <section class="panel an-eval page-enter" id="an-eval">
      <h2>Ton avis : est-ce réussi ?</h2>
      <p class="muted">Regarde la vidéo et l’animation, au ralenti si besoin, puis réponds pour chaque critère.</p>
      <ul class="crit-list">${T.criteres.map((cr, i) => `
        <li data-i="${i}"><span class="crit-txt">${esc(cr)}</span>
          <span class="crit-btns" role="group" aria-label="${esc(cr)}"><button data-v="1">✅ Oui</button><button data-v="0">❌ Pas encore</button></span></li>`).join('')}</ul>
      <div class="verdict" id="verdict" aria-live="polite"></div>
    </section>
    <p class="an-privacy muted">🔒 La vidéo reste sur cette tablette : elle n’est envoyée nulle part et elle s’efface quand tu quittes cette page.</p>`;

  // --- le modèle
  let P = null;
  const holder = $('#an-player');
  const loadModel = k => {
    C.resetPlayers();
    holder.innerHTML = '';
    P = mountPlayer(holder, T.anims[k].anim, T.couleur, { view: 'profil' });
    if (P && live.video) { P.playing = false; P.updatePlay(); syncModel(); }
  };
  app.querySelectorAll('[data-variant]').forEach(btn => (btn.onclick = () => {
    app.querySelectorAll('[data-variant]').forEach(x => x.classList.toggle('on', x === btn));
    loadModel(+btn.dataset.variant);
  }));
  loadModel(0);

  const vbox = $('#vbox'), bar = $('#cmp-bar'), wrap = $('#cmp-wrap');
  const vTime = $('#v-time'), scrub = $('#v-scrub'), playBtn = $('#b-play'), info = $('#sync-info');

  // --- écran de départ : filmer ou choisir une vidéo
  function showStart(msg = '') {
    stopStream();
    bar.hidden = true;
    live.video = null;
    vTime.textContent = '';
    vbox.innerHTML = `
      <div class="v-start">
        ${canFilm ? '<button class="big-btn rec-btn" id="b-cam"><span class="dot"></span>Filmer mon camarade</button>' : ''}
        <label class="big-btn file-btn"><input type="file" accept="video/*" id="v-file" hidden>📁 ${canFilm ? 'Ou choisir une vidéo de la tablette' : 'Filmer ou choisir une vidéo'}</label>
        <p class="v-tip">💡 Tablette <b>à l’horizontale</b>, filme <b>de côté</b>, à quelques mètres : tout le corps doit rester dans l’image, du départ à la réception.</p>
        ${msg ? `<p class="v-err">${msg}</p>` : ''}
      </div>`;
    const cam = $('#b-cam');
    if (cam) cam.onclick = () => openCamera();
    $('#v-file').onchange = e => { const f = e.target.files && e.target.files[0]; if (f) useVideo(f); };
  }

  // --- caméra
  async function openCamera() {
    stopStream();
    vbox.innerHTML = '<div class="v-wait">Ouverture de la caméra…<br><small>Si la tablette te le demande, autorise la caméra.</small></div>';
    try {
      live.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: live.facing }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    } catch (err) {
      console.error(err);
      return showStart('La caméra n’a pas pu s’ouvrir (autorisation refusée ou caméra déjà utilisée). Tu peux choisir une vidéo déjà filmée.');
    }
    if (!live) return; // page quittée entre-temps
    vbox.innerHTML = `
      <div class="v-live">
        <video id="v-cam" playsinline muted autoplay class="${live.facing === 'user' ? 'mirror' : ''}"></video>
        <div class="rec-time" id="rec-time" hidden>● 0,0 s</div>
        <div class="live-ctrls">
          <button class="lc" id="b-cancel" aria-label="Annuler">✕</button>
          <button class="rec-round" id="b-rec" aria-label="Commencer à filmer"><span></span></button>
          <button class="lc" id="b-flip" aria-label="Changer de caméra">⟲</button>
        </div>
      </div>`;
    const v = $('#v-cam');
    v.srcObject = live.stream;
    v.play().catch(() => {});
    $('#b-cancel').onclick = () => showStart();
    $('#b-flip').onclick = () => { live.facing = live.facing === 'user' ? 'environment' : 'user'; openCamera(); };
    $('#b-rec').onclick = () => (live.rec && live.rec.state === 'recording' ? live.rec.stop() : startRec());
  }

  function startRec() {
    const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const type = types.find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    let rec;
    try { rec = new MediaRecorder(live.stream, type ? { mimeType: type, videoBitsPerSecond: 4e6 } : undefined); } catch (err) { console.error(err); return showStart('Impossible de filmer avec cet appareil. Choisis une vidéo déjà filmée.'); }
    const chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      clearInterval(live && live.recTimer);
      if (!live) return;
      const blob = new Blob(chunks, { type: rec.mimeType || type || 'video/webm' });
      stopStream();
      if (blob.size) useVideo(blob); else showStart('La vidéo est vide, recommence.');
    };
    live.rec = rec;
    rec.start(250);
    const btn = $('#b-rec'), tEl = $('#rec-time'), t0 = performance.now();
    btn.classList.add('on'); btn.setAttribute('aria-label', 'Arrêter de filmer');
    $('#b-flip').disabled = true; $('#b-cancel').disabled = true;
    tEl.hidden = false;
    live.recTimer = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      tEl.textContent = '● ' + fmt(s);
      if (s >= MAX_REC && rec.state === 'recording') rec.stop();
    }, 100);
  }

  // --- la vidéo à comparer
  function useVideo(blob) {
    if (live.url) URL.revokeObjectURL(live.url);
    live.url = URL.createObjectURL(blob);
    vbox.innerHTML = `<video id="v-play" playsinline muted preload="auto" class="${live.mirror ? 'mirror' : ''}"></video>`;
    const v = live.video = $('#v-play');
    v.src = live.url;
    live.offset = 0; live.synced = null;
    v.addEventListener('loadedmetadata', () => {
      // vidéos WebM enregistrées dans le navigateur : durée inconnue tant qu'on n'a pas sauté à la fin
      if (!isFinite(v.duration)) {
        const fix = () => { v.removeEventListener('durationchange', fix); v.currentTime = 0; update(); };
        v.addEventListener('durationchange', fix);
        v.currentTime = 1e6;
      }
      update();
    });
    v.addEventListener('timeupdate', update);
    v.addEventListener('seeked', update);
    v.addEventListener('ended', () => { setPlaying(false); });
    v.addEventListener('click', () => togglePlay());
    bar.hidden = false;
    if (P) { P.playing = false; P.updatePlay(); }
    v.playbackRate = live.speed;
    showInfo();
    update();
    setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  const dur = () => { const v = live.video; return v && isFinite(v.duration) ? v.duration : 0; };
  function syncModel() {
    const v = live && live.video;
    if (!v || !P) return;
    P.playing = false;
    P.t = Math.max(0, Math.min(P.total, v.currentTime + live.offset));
    P.updatePlay();
    P.draw();
  }
  function update() {
    const v = live && live.video;
    if (!v) return;
    const d = dur();
    vTime.textContent = `${fmt(v.currentTime)}${d ? ' / ' + fmt(d) : ''}`;
    if (d && document.activeElement !== scrub) scrub.value = Math.round((v.currentTime / d) * 1000);
    syncModel();
  }
  function setPlaying(on) {
    playBtn.textContent = on ? '⏸ Pause' : '▶︎ Lire les deux';
    playBtn.classList.toggle('on', on);
  }
  function loop() {
    cancelAnimationFrame(live.raf);
    const tick = () => {
      if (!live || !live.video || live.video.paused) return;
      update();
      live.raf = requestAnimationFrame(tick);
    };
    live.raf = requestAnimationFrame(tick);
  }
  function togglePlay() {
    const v = live.video;
    if (!v) return;
    if (v.paused) {
      if (v.ended || (dur() && v.currentTime >= dur() - 0.05)) v.currentTime = 0;
      v.playbackRate = live.speed;
      v.play().then(() => { setPlaying(true); loop(); }).catch(() => setPlaying(false));
    } else { v.pause(); setPlaying(false); }
  }
  const step = dt => { const v = live.video; if (!v) return; v.pause(); setPlaying(false); v.currentTime = Math.max(0, Math.min(dur() || 1e6, v.currentTime + dt)); };
  function showInfo() {
    info.innerHTML = !live.synced
      ? 'Les deux démarrent ensemble. Si le mouvement de la vidéo commence plus tard : mets la vidéo <b>au début du mouvement</b>, place l’animation <b>sur la même position</b> (barre sous le modèle), puis touche <b>🔗 Caler ici</b>.'
      : `Calé : <b>${fmt(live.synced.v)}</b> de la vidéo = <b>${fmt(live.synced.a)}</b> de l’animation. <button class="linkish" id="b-unsync">Annuler le calage</button>`;
    const u = $('#b-unsync');
    if (u) u.onclick = () => { live.offset = 0; live.synced = null; showInfo(); update(); };
  }

  playBtn.onclick = togglePlay;
  $('#b-start').onclick = () => { const v = live.video; if (!v) return; v.pause(); setPlaying(false); v.currentTime = Math.max(0, -live.offset); };
  $('#b-prev').onclick = () => step(-1 / 30);
  $('#b-next').onclick = () => step(1 / 30);
  scrub.addEventListener('input', () => { const v = live.video, d = dur(); if (!v || !d) return; v.pause(); setPlaying(false); v.currentTime = (scrub.value / 1000) * d; });
  bar.querySelectorAll('[data-speed]').forEach(btn => (btn.onclick = () => {
    live.speed = +btn.dataset.speed;
    if (live.video) live.video.playbackRate = live.speed;
    bar.querySelectorAll('[data-speed]').forEach(x => x.classList.toggle('on', x === btn));
  }));
  $('#b-sync').onclick = () => {
    if (!live.video || !P) return;
    live.offset = P.t - live.video.currentTime;
    live.synced = { v: live.video.currentTime, a: P.t };
    showInfo();
    const s = $('#b-sync'); s.classList.add('flash'); setTimeout(() => s.classList.remove('flash'), 600);
  };
  $('#b-mirror').onclick = e => {
    live.mirror = !live.mirror;
    e.currentTarget.setAttribute('aria-pressed', live.mirror);
    e.currentTarget.classList.toggle('on', live.mirror);
    if (live.video) live.video.classList.toggle('mirror', live.mirror);
  };
  $('#b-full').onclick = e => {
    const on = !wrap.classList.contains('full');
    wrap.classList.toggle('full', on);
    wrap.scrollTop = 0;
    if (!on) wrap.scrollIntoView({ block: 'start' });
    document.body.classList.toggle('cmp-lock', on);
    e.currentTarget.setAttribute('aria-pressed', on);
    e.currentTarget.textContent = on ? '✕ Réduire' : '⛶ Agrandir';
  };
  $('#b-redo').onclick = () => {
    if (live.video) live.video.pause();
    setPlaying(false);
    if (wrap.classList.contains('full')) $('#b-full').click();
    showStart();
    if (P) { P.playing = true; P.updatePlay(); P.loop(); }
  };
  // le modèle déplacé à la main pendant que la vidéo est en pause : rien à faire (le calage se fait avec 🔗)

  // --- auto-évaluation
  const ans = {};
  const verdict = $('#verdict');
  const renderVerdict = () => {
    const n = T.criteres.length, k = Object.keys(ans).length, ok = Object.values(ans).filter(Boolean).length;
    if (k < n) { verdict.innerHTML = `<p class="muted">${k} critère${k > 1 ? 's' : ''} sur ${n} jugé${k > 1 ? 's' : ''}.</p>`; return; }
    if (ok === n) {
      verdict.innerHTML = `<div class="vd ok"><b>🎉 Mouvement réussi !</b><p>Tous les critères sont respectés. Montre-le à ton professeur : c’est lui qui valide le niveau.</p>
        <p><a class="chip" href="#/ma-progression">✍️ Enregistrer ma progression</a> <button class="chip" id="b-again">🔄 Filmer un autre essai</button></p></div>`;
    } else {
      const ko = T.criteres.filter((_, i) => !ans[i]);
      verdict.innerHTML = `<div class="vd ko"><b>💪 À retravailler</b><p>Concentre-toi sur : ${ko.map(x => `<b>${esc(x)}</b>`).join(' · ')}.</p>
        <p>${T.entrainement ? `<a class="chip" href="${T.entrainement}">💡 Exercices pour progresser</a> ` : ''}<button class="chip" id="b-again">🔄 Filmer un autre essai</button></p></div>`;
    }
    const again = $('#b-again');
    if (again) again.onclick = () => {
      Object.keys(ans).forEach(i => delete ans[i]);
      app.querySelectorAll('.crit-list li').forEach(li => li.querySelectorAll('button').forEach(x => x.classList.remove('on')));
      renderVerdict();
      $('#b-redo').click();
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  };
  app.querySelectorAll('.crit-list li').forEach(li => li.querySelectorAll('button').forEach(btn => (btn.onclick = () => {
    ans[li.dataset.i] = btn.dataset.v === '1';
    li.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === btn));
    li.classList.toggle('yes', btn.dataset.v === '1'); li.classList.toggle('no', btn.dataset.v === '0');
    renderVerdict();
  })));
  renderVerdict();
  void LEVEL_COLORS; void kind; void b; void c;
  showStart();
}

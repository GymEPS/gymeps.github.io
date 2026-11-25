// Écriture compacte des poses. Toutes les valeurs sont en degrés.
// sp : flexion de la colonne (répartie lombaires / dorsales) ou [flexion, inclinaison, torsion] ; nk : cou (+ = menton vers la poitrine)
// sh : bras [élévation avant, écart, rotation] (180 = bras en haut) ; el : coude ; wr : poignet
// hp : hanche [flexion, écart, rotation] ; kn : genou ; an : pointe de pied (+ = pied tendu)
// ff / hf : pieds / mains posés à plat (0 à 1). Suffixe R / L pour un seul côté.
// lean : bascule du bassin vers l'avant (tour complet = 360) ; yaw : rotation (vers la gauche +) ; roll : bascule latérale.
const arr = v => (Array.isArray(v) ? v : [v]);

export function pose(s) {
  const c = {};
  const put = (k, v) => { if (v !== undefined && v !== null) c[k] = v; };
  if (s.sp !== undefined) {
    const [f, b = 0, t = 0] = arr(s.sp);
    put('l1f', f * 0.45); put('l2f', f * 0.55); put('l1b', b / 2); put('l2b', b / 2); put('l1t', t / 2); put('l2t', t / 2);
  }
  if (s.l1 !== undefined) { const [f, b, t] = arr(s.l1); put('l1f', f); put('l1b', b); put('l1t', t); }
  if (s.l2 !== undefined) { const [f, b, t] = arr(s.l2); put('l2f', f); put('l2b', b); put('l2t', t); }
  if (s.nk !== undefined) { const [f, b, t] = arr(s.nk); put('nf', f); put('nb', b); put('nt', t); }
  for (const S of ['R', 'L']) {
    const sh = s['sh' + S] ?? s.sh;
    if (sh !== undefined) { const [f, a, r] = arr(sh); put('sh' + S + 'f', f); put('sh' + S + 'a', a); put('sh' + S + 'r', r); }
    put('el' + S, s['el' + S] ?? s.el);
    put('wr' + S, s['wr' + S] ?? s.wr);
    const hp = s['hp' + S] ?? s.hp;
    if (hp !== undefined) { const [f, a, r] = arr(hp); put('hp' + S + 'f', f); put('hp' + S + 'a', a); put('hp' + S + 'r', r); }
    put('kn' + S, s['kn' + S] ?? s.kn);
    put('an' + S, s['an' + S] ?? s.an);
    put('f' + S, s['f' + S] ?? s.ff);
    put('h' + S, s['h' + S] ?? s.hf);
  }
  for (const k of ['lean', 'yaw', 'roll', 'x', 'z']) put(k, s[k]);
  return c;
}

const wrap = (a, lo = -180) => ((((a - lo) % 360) + 360) % 360) + lo;

/**
 * Pose décrite par les angles VUS DE PROFIL dans l'espace (plus simple à imaginer) :
 * lean = bascule du bassin ; T = buste (0 = vertical tête en haut, + = penché vers l'avant, 180 = tête en bas) ;
 * th = cuisse, sn = tibia, ar = bras, fa = avant-bras (0 = vers le bas, + = vers l'avant, 90 = horizontal devant, 180 = vers le haut).
 * Suffixes R / L possibles (thR, snL, arR…). Les autres clés de pose() restent utilisables (nk, an, ff, écarts…).
 * Les écarts / rotations se donnent avec hpa / sha (écart des jambes / des bras) et hpr / shr.
 */
export function W(s) {
  const out = { ...s };
  const lean = s.lean ?? 0;
  for (const k of ['T', 'th', 'sn', 'ar', 'fa', 'thR', 'thL', 'snR', 'snL', 'arR', 'arL', 'faR', 'faL', 'hpa', 'sha', 'hpr', 'shr', 'hpaR', 'hpaL', 'shaR', 'shaL']) delete out[k];
  const T = s.T ?? 0;
  if (s.T !== undefined) out.sp = s.spb !== undefined || s.spt !== undefined ? [wrap(T - lean), s.spb || 0, s.spt || 0] : wrap(T - lean);
  delete out.spb; delete out.spt;
  for (const S of ['R', 'L']) {
    const th = s['th' + S] ?? s.th, sn = s['sn' + S] ?? s.sn, ar = s['ar' + S] ?? s.ar, fa = s['fa' + S] ?? s.fa;
    const hpa = s['hpa' + S] ?? s.hpa ?? 0, hpr = s.hpr ?? 0, sha = s['sha' + S] ?? s.sha ?? 6, shr = s.shr ?? 0;
    if (th !== undefined) out['hp' + S] = [wrap(th + lean), hpa, hpr];
    if (th !== undefined && sn !== undefined) out['kn' + S] = wrap(th - sn);
    if (ar !== undefined) out['sh' + S] = [wrap(ar + T, -90), sha, shr];
    if (ar !== undefined && fa !== undefined) out['el' + S] = wrap(fa - ar);
  }
  return out;
}

/** Image clé : K(temps, pose, { label, plant, fly, land }) ; KW = même chose avec les angles vus de profil. */
export const K = (t, s, o = {}) => ({ t, c: pose(s), ...o });
export const KW = (t, s, o = {}) => ({ t, c: pose(W(s)), ...o });

/** Décale une liste d'images clés dans le temps. */
export const shift = (keys, dt) => keys.map(k => ({ ...k, t: k.t + dt }));

/** Enchaîne des morceaux : chacun commence où finit le précédent (la 1re clé d'un morceau suivant est retirée si elle tombe au même instant). */
export function chain(...parts) {
  const out = [];
  for (const p of parts) {
    const t0 = out.length ? out[out.length - 1].t : 0;
    const base = p[0].t;
    for (const k of p) {
      const t = t0 + k.t - base;
      if (out.length && Math.abs(t - out[out.length - 1].t) < 1e-6) { out[out.length - 1] = { ...out[out.length - 1], ...k, c: { ...out[out.length - 1].c, ...k.c }, t }; continue; }
      out.push({ ...k, t });
    }
  }
  return out;
}

/** Tenir la position : répète la dernière clé dt secondes plus tard. */
export const hold = (keys, dt, o = {}) => [...keys, { t: keys[keys.length - 1].t + dt, c: {}, ...o }];

// ---- Positions de base
export const STAND = { sp: 0, nk: 0, sh: [0, 6, 0], el: 8, wr: 0, hp: [0, 0, 0], kn: 0, an: 0, ff: 1, hf: 0, lean: 0, yaw: 0, roll: 0 };
export const ARMS_UP = { sh: [176, 8, 0], el: 0, wr: 0 };      // bras alignés avec le dos
export const ARMS_SIDE = { sh: [0, 88, 0], el: 4, wr: 0 };      // bras écartés à l'horizontale
export const ARMS_FWD = { sh: [90, 6, 0], el: 0, wr: 0 };
export const POINT = { an: 55, ff: 0 };                          // pieds tendus

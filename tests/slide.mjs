// Glissements et déplacements parasites : node tests/slide.mjs [id…]
// - glissement : un pied / une main posé au sol (bas à moins de 2 cm de la surface sur 2 images) qui avance de plus de 8 mm par image ;
// - dérive : déplacement horizontal total du bassin, pour repérer les figures « sur place » qui se promènent.
import { animDef, ANIM_IDS } from '../js/anims/index.js';
import { bakeDef, surfaceAt } from '../js/engine/skeleton.js';

const TIPS = { toR: 0.016, toL: 0.016, heR: 0.024, heL: 0.024, fiR: 0.012, fiL: 0.012, wrR: 0.028, wrL: 0.028 };
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ANIM_IDS;
for (const id of ids) {
  const b = bakeDef(animDef(id));
  const F = b.frames;
  let slide = 0, slideMax = 0, where = '';
  const bad = [];
  for (let i = 1; i < F.length; i++) {
    for (const [k, r] of Object.entries(TIPS)) {
      const a = F[i - 1].P[k], c = F[i].P[k];
      const ga = a[1] - r - surfaceAt(b.props, a[0], a[2]), gc = c[1] - r - surfaceAt(b.props, c[0], c[2]);
      if (ga > 0.02 || gc > 0.02) continue;
      const d = Math.hypot(c[0] - a[0], c[2] - a[2]);
      slide += d;
      if (d > slideMax) { slideMax = d; where = `${k}@${F[i].t.toFixed(2)}`; }
      if (d > 0.008) bad.push(`${k}@${F[i].t.toFixed(2)}`);
    }
  }
  let travel = 0;
  for (let i = 1; i < F.length; i++) travel += Math.hypot(F[i].P.root[0] - F[i - 1].P.root[0], F[i].P.root[2] - F[i - 1].P.root[2]);
  const net = Math.hypot(F.at(-1).P.root[0] - F[0].P.root[0], F.at(-1).P.root[2] - F[0].P.root[2]);
  const uniq = [...new Set(bad.map(x => x.replace(/@(\d+\.\d)\d/, '@$1')))];
  console.log(`${id.padEnd(30)} glisse ${(slide * 100).toFixed(0).padStart(4)} cm (max ${(slideMax * 1000).toFixed(0)} mm/img ${where})  bassin : parcours ${travel.toFixed(2)} m, final ${net.toFixed(2)} m  ${uniq.length ? '⚠ ' + uniq.slice(0, 6).join(' ') : ''}`);
}

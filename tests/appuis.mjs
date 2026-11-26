// Hauteur (cm) des points du corps au-dessus du sol / du matériel à chaque phase : node tests/appuis.mjs id…
// Sert à vérifier les appuis (fesses, mains, pieds, épaules au sol) des positions tenues.
import { animDef } from '../js/anims/index.js';
import { bakeDef, surfaceAt } from '../js/engine/skeleton.js';
const P = ['bt', 'nb', 'head', 'shR', 'wrR', 'wrL', 'fiR', 'knR', 'heR', 'heL', 'toR', 'toL'];
for (const id of process.argv.slice(2)) {
  const b = bakeDef(animDef(id));
  const ts = b.phases.map(p => [p.t, p.label]);
  for (let i = 0; i < ts.length - 1; i++) ts.splice(++i, 0, [(ts[i - 1][0] + ts[i][0]) / 2, '·']);
  for (const [t, label] of ts) {
    const F = b.frames[Math.min(b.frames.length - 1, Math.round(t * b.fps))];
    console.log(id.padEnd(17), t.toFixed(2).padStart(5), P.map(k => k + ':' + ((F.P[k][1] - surfaceAt(b.props, F.P[k][0], F.P[k][2])) * 100).toFixed(0)).join(' '), ' ', label.slice(0, 38));
  }
}

// Met à jour les numéros de version dans index.html (à lancer avant chaque publication : npm run version).
// Chaque fichier JS / CSS reçoit une empreinte de son contenu : un navigateur ne peut plus mélanger
// des fichiers anciens (gardés en cache) et nouveaux, ce qui donnait une page vide après une mise à jour.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const h = p => createHash('sha1').update(readFileSync(join(root, p))).digest('hex').slice(0, 8);
const walk = d => readdirSync(join(root, d)).flatMap(f => {
  const p = d + '/' + f;
  return statSync(join(root, p)).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : [];
});
const files = walk('js').sort();
const map = {};
for (const f of files) map['./' + f] = './' + f + '?v=' + h(f);
const block = [
  '<!-- versions (npm run version) -->',
  '  <script type="importmap">' + JSON.stringify({ imports: map }) + '</script>',
  '  <link rel="stylesheet" href="css/style.css?v=' + h('css/style.css') + '">',
  '  <!-- /versions -->',
].join('\n');

const p = join(root, 'index.html');
let s = readFileSync(p, 'utf8');
s = s.replace(/<!-- versions[\s\S]*?<!-- \/versions -->/, block)
     .replace(/src="js\/app\.js[^"]*"/, 'src="js/app.js?v=' + h('js/app.js') + '"');
writeFileSync(p, s);
console.log('index.html : versions à jour (' + files.length + ' fichiers JS + style.css)');

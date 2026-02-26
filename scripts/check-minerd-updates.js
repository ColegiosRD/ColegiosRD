const https = require('https');
const fs = require('fs');
const path = require('path');

const URLS_TO_CHECK = [
  { name: 'Datos.gob.do - MINERD', url: 'https://datos.gob.do/organization/ministerio-de-educacion-minerd', keywords: ['pruebas nacionales', 'centros educativos', 'csv', 'xlsx', '2025', '2026'] },
  { name: 'MINERD Transparencia', url: 'https://www.ministeriodeeducacion.gob.do/transparencia/datos-abiertos/listados', keywords: ['pruebas nacionales', 'centros educativos', 'csv', 'xlsx'] },
  { name: 'MINERD Estadisticas', url: 'https://www.minerd.gob.do/transparencia/conjunto-de-datos-abiertos/estadisticas-de-pruebas-nacionales/2024/listados', keywords: ['primera convocatoria', 'segunda convocatoria', 'csv', 'xlsx'] }
];

const SNAPSHOT_FILE = path.join(__dirname, '.minerd-snapshot.json');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ColegiosRD-Monitor/1.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash.toString(16);
}

function extractContent(html) {
  const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  const linkRegex = /href=["']([^"']*\.(csv|xlsx|xls|pdf)[^"']*)/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) links.push(match[1]);
  return { hash: simpleHash(text), links };
}

async function main() {
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8')); } catch(e) {}
  const snap = {};
  let changes = 0;
  const date = new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  console.log(`MINERD Monitor - ${date}\n`);

  for (const src of URLS_TO_CHECK) {
    console.log(`Checking: ${src.name}...`);
    try {
      const html = await fetchPage(src.url);
      const result = extractContent(html);
      snap[src.name] = { hash: result.hash, links: result.links, checked: new Date().toISOString() };

      if (prev[src.name] && prev[src.name].hash !== result.hash) {
        const newLinks = result.links.filter(l => !(prev[src.name].links || []).includes(l));
        console.log('  CAMBIO DETECTADO!');
        if (newLinks.length > 0) { console.log('  Nuevos archivos:'); newLinks.forEach(l => console.log('    ' + l)); }
        changes++;
      } else if (!prev[src.name]) {
        console.log('  Primera revision. ' + result.links.length + ' archivos encontrados.');
      } else {
        console.log('  Sin cambios.');
      }
    } catch (e) {
      console.log('  Error: ' + e.message);
      if (prev[src.name]) snap[src.name] = prev[src.name];
    }
  }

  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snap, null, 2));
  console.log(changes > 0 ? '\nALERTA: ' + changes + ' fuente(s) con cambios!' : '\nTodo igual, sin cambios.');
  if (changes > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });

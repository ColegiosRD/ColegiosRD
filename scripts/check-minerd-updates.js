#!/usr/bin/env node

/**
 * MINERD Data Monitor
 * Checks datos.gob.do and MINERD transparency portal for new datasets.
 * Runs daily via GitHub Actions and sends email alert if new data is found.
 *
 * URLs monitored:
 * 1. https://datos.gob.do/organization/ministerio-de-educacion-minerd
 * 2. https://www.ministeriodeeducacion.gob.do/transparencia/datos-abiertos/listados
 * 3. https://www.minerd.gob.do/transparencia/conjunto-de-datos-abiertos/estadisticas-de-pruebas-nacionales/2024/listados
 * 4. https://www.ministeriodeeducacion.gob.do/sobre-nosotros/areas-institucionales/direccion-de-evaluacion-de-la-calidad/informe-estadistico-pruebas-nacionales
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const URLS_TO_CHECK = [
  {
    name: 'Datos.gob.do - MINERD Datasets',
    url: 'https://datos.gob.do/organization/ministerio-de-educacion-minerd',
    keywords: ['pruebas nacionales', 'centros educativos', 'csv', 'xlsx', '2025', '2026']
  },
  {
    name: 'MINERD Transparencia - Datos Abiertos',
    url: 'https://www.ministeriodeeducacion.gob.do/transparencia/datos-abiertos/listados',
    keywords: ['pruebas nacionales', 'estadísticas', 'centros educativos', 'csv', 'xlsx']
  },
  {
    name: 'MINERD - Estadísticas Pruebas Nacionales',
    url: 'https://www.minerd.gob.do/transparencia/conjunto-de-datos-abiertos/estadisticas-de-pruebas-nacionales/2024/listados',
    keywords: ['primera convocatoria', 'segunda convocatoria', 'csv', 'xlsx', 'descargar']
  },
  {
    name: 'MINERD - Informes Estadísticos',
    url: 'https://www.ministeriodeeducacion.gob.do/sobre-nosotros/areas-institucionales/direccion-de-evaluacion-de-la-calidad/informe-estadistico-pruebas-nacionales',
    keywords: ['2025', '2026', 'nuevo', 'actualizado', 'descargar', 'pdf']
  }
];

const SNAPSHOT_FILE = path.join(__dirname, '.minerd-snapshot.json');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': 'ColegiosRD-Monitor/1.0' },
      timeout: 15000
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function extractRelevantContent(html, keywords) {
  // Remove scripts, styles, and HTML tags
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  // Find keyword matches
  const matches = [];
  for (const keyword of keywords) {
    const kw = keyword.toLowerCase();
    const idx = text.indexOf(kw);
    if (idx !== -1) {
      // Extract context around the keyword (100 chars before and after)
      const start = Math.max(0, idx - 100);
      const end = Math.min(text.length, idx + kw.length + 100);
      matches.push({
        keyword,
        context: text.slice(start, end).trim()
      });
    }
  }

  // Extract all download links
  const linkRegex = /href=["']([^"']*\.(csv|xlsx|xls|ods|pdf)[^"']*)/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
  }

  return { matches, links, contentHash: simpleHash(text) };
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

function loadSnapshot() {
  try {
    if (fs.existsSync(SNAPSHOT_FILE)) {
      return JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveSnapshot(snapshot) {
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2));
}

async function checkForUpdates() {
  const previousSnapshot = loadSnapshot();
  const newSnapshot = {};
  const changes = [];
  const date = new Date().toLocaleDateString('es-DO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  console.log(`\n========================================`);
  console.log(`MINERD Data Monitor - ${date}`);
  console.log(`========================================\n`);

  for (const source of URLS_TO_CHECK) {
    console.log(`Checking: ${source.name}...`);

    try {
      const html = await fetchPage(source.url);
      const result = extractRelevantContent(html, source.keywords);

      newSnapshot[source.name] = {
        hash: result.contentHash,
        links: result.links,
        lastChecked: new Date().toISOString()
      };

      const prev = previousSnapshot[source.name];

      if (!prev) {
        console.log(`  → First check. Found ${result.links.length} download links.`);
        console.log(`  → Keywords found: ${result.matches.map(m => m.keyword).join(', ') || 'none'}`);
      } else if (prev.hash !== result.contentHash) {
        console.log(`  → ⚠️ CHANGE DETECTED! Page content has changed.`);

        // Find new links
        const newLinks = result.links.filter(l => !prev.links.includes(l));
        if (newLinks.length > 0) {
          console.log(`  → 🆕 NEW DOWNLOAD LINKS FOUND:`);
          newLinks.forEach(l => console.log(`     ${l}`));
        }

        changes.push({
          source: source.name,
          url: source.url,
          newLinks,
          keywords: result.matches.map(m => m.keyword)
        });
      } else {
        console.log(`  → No changes detected.`);
      }
    } catch (error) {
      console.log(`  → Error: ${error.message}`);
      // Keep previous snapshot for this source
      if (previousSnapshot[source.name]) {
        newSnapshot[source.name] = previousSnapshot[source.name];
      }
    }
  }

  saveSnapshot(newSnapshot);

  // Summary
  console.log(`\n========================================`);
  if (changes.length > 0) {
    console.log(`🚨 ALERTA: ${changes.length} fuente(s) con cambios detectados!`);
    console.log(`========================================\n`);

    for (const change of changes) {
      console.log(`📌 ${change.source}`);
      console.log(`   URL: ${change.url}`);
      if (change.newLinks.length > 0) {
        console.log(`   Nuevos archivos para descargar:`);
        change.newLinks.forEach(l => console.log(`   → ${l}`));
      }
      console.log('');
    }

    console.log(`ACCIÓN REQUERIDA: Revisar las fuentes con cambios y descargar los nuevos datos.`);

    // Set exit code for GitHub Actions to detect changes
    process.exitCode = 78; // Custom code indicating changes found
  } else {
    console.log(`✅ Sin cambios. Todo está igual que la última revisión.`);
    console.log(`========================================\n`);
  }

  return changes;
}

checkForUpdates().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});

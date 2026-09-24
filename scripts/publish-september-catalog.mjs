import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const sourceDir = join(root, 'produtos_cadastrar');
const outputDir = join(root, 'public/images/products');
const dataDir = resolve(process.env.ALEJOIAS_DATA_DIR || join(root, '.data'));
const manifest = JSON.parse(await readFile(join(import.meta.dirname, 'catalogo-setembro-2026.json'), 'utf8'));
const originals = (await readdir(sourceDir)).filter((name) => name.endsWith('.jpeg')).sort();
if (originals.length !== 25 || manifest.length !== 23) throw Error('Confira as 25 fotos de origem e os 23 produtos distintos.');
if (new Set(manifest.map((item) => item.id)).size !== manifest.length || new Set(manifest.map((item) => item.slug)).size !== manifest.length) throw Error('Código ou endereço duplicado no manifesto.');

if (process.argv[2] === 'prepare') {
  await mkdir(outputDir, { recursive: true });
  for (const item of manifest) {
    const original = originals[item.photo - 1];
    if (!original) throw Error(`Foto ${item.photo} ausente.`);
    const input = join(sourceDir, 'copias', original.replace(/\.jpeg$/, '-sem-marca.png'));
    let output;
    for (const quality of [82, 75, 68, 60, 52]) {
      output = await sharp(input).rotate().resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toBuffer();
      if (output.length <= 300_000) break;
    }
    if (output.length > 300_000) throw Error(`Foto ${item.photo} acima de 300 KB.`);
    await writeFile(join(outputDir, `${item.slug}.jpg`), output);
    console.log(`${item.photo}: ${item.id} -> ${item.slug}.jpg (${output.length} bytes)`);
  }
  process.exit(0);
}

if (process.argv[2] === 'correct-names') {
  const corrections = [
    ['PUL02-1565', 'pulseira-madreperola-geometrica'],
    ['AJ-BR-05', 'brinco-argola-cristais'],
    ['AJ-BR-22', 'brinco-perola-pendente'],
  ];
  const db = new DatabaseSync(join(dataDir, 'alejoias-site.sqlite'));
  db.exec('PRAGMA busy_timeout=5000; BEGIN IMMEDIATE');
  try {
    for (const [id, oldSlug] of corrections) {
      const item = manifest.find((entry) => entry.id === id);
      const row = db.prepare('SELECT data FROM products WHERE id=?').get(id);
      if (!item || !row) throw Error(`Produto ausente: ${id}`);
      const before = JSON.parse(row.data);
      if (before.slug === item.slug) continue;
      if (before.slug !== oldSlug) throw Error(`Endereço inesperado: ${id}`);
      const at = new Date().toISOString();
      const after = { ...before, slug: item.slug, image: `/images/products/${item.slug}.jpg`, revision: before.revision + 1, updatedAt: at };
      db.prepare('UPDATE products SET slug=?,data=? WHERE id=?').run(after.slug, JSON.stringify(after), id);
      db.prepare('INSERT INTO history(product_id,at,actor,source,before_json,after_json) VALUES(?,?,?,?,?,?)').run(id, at, 'administrador', 'correção de nomes visuais', row.data, JSON.stringify(after));
      console.log(`${id}: ${oldSlug} -> ${item.slug}`);
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  } finally {
    db.close();
  }
  process.exit(0);
}

if (process.argv[2] !== 'publish') throw Error('Use prepare, publish ou correct-names.');
const db = new DatabaseSync(join(dataDir, 'alejoias-site.sqlite'));
db.exec('PRAGMA busy_timeout=5000;');
const already = db.prepare("SELECT value FROM settings WHERE key='catalogo_setembro_2026'").get();
if (already) throw Error('Este lote já foi publicado. Faça ajustes posteriores pelo painel.');
for (const item of manifest) {
  if (db.prepare('SELECT id FROM products WHERE id=? OR slug=?').get(item.id, item.slug)) throw Error(`Produto já cadastrado: ${item.id}`);
}
const backup = join(dataDir, `catalogo-antes-setembro-2026-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`);
db.exec(`VACUUM INTO '${backup.replaceAll("'", "''")}'`);
const at = new Date().toISOString();
db.exec('BEGIN IMMEDIATE');
try {
  for (const row of db.prepare("SELECT id,data FROM products WHERE id LIKE 'DEMO-%'").all()) {
    const before = JSON.parse(row.data);
    if (!before.enabled) continue;
    const after = { ...before, enabled: false, available: false, revision: before.revision + 1, updatedAt: at };
    db.prepare('UPDATE products SET data=? WHERE id=?').run(JSON.stringify(after), row.id);
    db.prepare('INSERT INTO history(product_id,at,actor,source,before_json,after_json) VALUES(?,?,?,?,?,?)').run(row.id, at, 'administrador', 'substituição de amostras do catálogo', row.data, JSON.stringify(after));
  }
  for (const item of manifest) {
    const product = {
      id: item.id, slug: item.slug, name: item.name, category: item.category,
      image: `/images/products/${item.slug}.jpg`, alt: item.name,
      description: item.description, collections: ['novidades'], variants: ['Padrão'], tags: [],
      priceInCents: 5990, promoPriceInCents: null, promoStart: '', promoEnd: '',
      enabled: true, available: true, demo: false, revision: 1, createdAt: at, updatedAt: at,
    };
    const json = JSON.stringify(product);
    db.prepare('INSERT INTO products(id,slug,data) VALUES(?,?,?)').run(product.id, product.slug, json);
    db.prepare('INSERT INTO history(product_id,at,actor,source,before_json,after_json) VALUES(?,?,?,?,?,?)').run(product.id, at, 'administrador', 'fotos fornecidas em setembro de 2026', null, json);
  }
  db.prepare('INSERT INTO settings(key,value) VALUES(?,?)').run('catalogo_setembro_2026', at);
  db.exec('COMMIT');
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
} finally {
  db.close();
}
console.log(`Publicados ${manifest.length} produtos; 3 amostras desativadas. Backup: ${backup}`);

const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {readFileSync} = require('node:fs');
const path = require('node:path');
const {once} = require('node:events');
const http = require('node:http');

// Executar após build isolado: pnpm build --outDir .data/qa-origin-build
const base = 'http://127.0.0.1:4322';
const publicOrigin = 'https://alejoias.com';
const dataDir = path.resolve('.data/qa-origin-' + Date.now());
const proxy = {Host: 'alejoias.com', 'X-Forwarded-Proto': 'https'};
async function post(action, data, origin = publicOrigin, headers = proxy) {
  return new Promise((resolve, reject) => {
    const req = http.request(base + '/api/' + action, {
      method: 'POST', headers: {...headers, Origin: origin, 'Content-Type': 'application/json'},
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(new Response(Buffer.concat(chunks), {
        status: res.statusCode, headers: Object.fromEntries(Object.entries(res.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value])),
      })));
    });
    req.on('error', reject);
    req.end(JSON.stringify(data));
  });
}

(async () => {
  try { await fetch(base); throw Error('Porta QA 4322 ocupada; não reutilizar servidor desconhecido.'); }
  catch (error) { if (error.message !== 'fetch failed') throw error; }
  const server = spawn(process.execPath, ['.data/qa-origin-build/server/entry.mjs'], {
    env: {...process.env, HOST: '127.0.0.1', PORT: '4322', ALEJOIAS_DATA_DIR: dataDir},
    stdio: 'ignore', windowsHide: true,
  });
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try { ready = (await fetch(base + '/api/catalog')).ok; } catch {}
      if (ready) break;
      if (server.exitCode !== null) throw Error('Servidor QA encerrou.');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.ok(ready, 'Servidor QA iniciou');
    assert.deepEqual(await (await fetch(base + '/api/catalog')).json(), [], 'Banco novo começa sem amostras');
    await fetch(base + '/admin/login');
    const password = readFileSync(path.join(dataDir, 'acesso-admin.txt'), 'utf8').match(/Senha inicial: (.+)/)[1].trim();
    const login = await post('login', {password});
    assert.equal(login.status, 200);
    assert.match(login.headers.get('set-cookie'), /; Secure/i);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    for (const fixture of require('./fixtures/products.cjs')) {
      const created = await post('products', {...fixture, revision: 0}, publicOrigin, {...proxy, Cookie: cookie});
      assert.equal(created.status, 200, await created.text());
    }
    assert.equal((await post('request-pdf', {})).status, 404, 'HTTPS do Tunnel alcança a API');
    assert.equal((await post('request-pdf', {}, base, {})).status, 404, 'HTTP local preservado');
    assert.equal((await post('request-pdf', {}, 'https://example.org')).status, 403);
    assert.equal((await post('request-pdf', {}, 'null')).status, 403);
    assert.equal((await post('request-pdf', {}, 'https://example.org', {
      ...proxy, 'X-Forwarded-Host': 'example.org',
    })).status, 403, 'Host encaminhado não autorizado continua bloqueado');
    const product = (await (await fetch(base + '/api/catalog')).json()).find(p => p.id === 'DEMO-01');
    const orderResponse = await post('request', {
      key: crypto.randomUUID(), name: 'Cliente Fictícia QA', phone: '19999990000', note: 'Teste isolado',
      items: [{id: product.id, variant: product.variants[0], quantity: 1}],
      expectedSubtotalInCents: product.priceInCents,
    });
    const order = await orderResponse.json();
    assert.equal(orderResponse.status, 200, JSON.stringify(order));
    assert.ok(JSON.stringify(order).includes(publicOrigin + '/pedido/pdf#'), 'Link mantém HTTPS público');
    const pdf = await post('request-pdf', {id: order.id, token: order.pdfToken});
    assert.equal(pdf.status, 200);
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 4).toString(), '%PDF');
    for (const file of ['tests/admin-integration.cjs', 'tests/order-pdf.cjs', 'tests/share-pdf.cjs', 'tests/responsive.cjs']) {
      const browserTest = spawn(process.execPath, [file], {stdio: 'inherit', windowsHide: true, env: {...process.env, QA_DATA_DIR: dataDir}});
      const [code] = await once(browserTest, 'exit');
      assert.equal(code, 0, 'Regressão local: ' + file);
    }
    console.log('PASS: origem HTTPS pelo proxy, origem local, CSRF, host não autorizado, pedido/PDF isolado e cookie Secure.');
  } finally {
    server.kill();
    await once(server, 'exit');
  }
})().catch(error => {console.error(error); process.exitCode = 1;});

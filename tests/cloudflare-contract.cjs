const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {loginPayload}=require('./auth.cjs');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base='http://127.0.0.1:4322';
(async()=>{
  const password=fs.readFileSync(path.join(process.env.QA_DATA_DIR,'acesso-admin.txt'),'utf8').match(/Senha inicial: (.+)/)[1].trim();
  let cookie='';
  async function post(action,data,origin=base){const r=await fetch(base+'/api/'+action,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(data)});return {status:r.status,body:await r.json(),headers:r.headers};}
  const login=await post('login',await loginPayload(base,{password}));assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];
  const product=(await (await fetch(base+'/api/products',{headers:{Cookie:cookie}})).json()).find(p=>p.id==='DEMO-01');
  const [one,two]=await Promise.all([post('products',{...product,description:'Edição A'}),post('products',{...product,description:'Edição B'})]);
  assert.deepEqual([one.status,two.status].sort(),[200,400],'Somente uma edição concorrente é aceita');
  const raw={key:crypto.randomUUID(),name:'Cliente Fictícia PDF',phone:'19999990000',note:'Observação para testar a paginação. '.repeat(15),items:[{id:product.id,variant:product.variants[0],quantity:2}],expectedSubtotalInCents:20};
  const [first,retry]=await Promise.all([post('request',raw),post('request',raw)]);assert.equal(first.status,200);assert.equal(retry.status,200);assert.equal(first.body.id,retry.body.id);
  const order=first.body;
  cookie='';
  assert.equal((await post('request-pdf',{id:order.id,token:'invalid'})).status,404);
  assert.equal((await post('request-pdf',{id:order.id,token:order.pdfToken},'https://example.org')).status,403);
  const snapshot=await post('request-pdf',{id:order.id,token:order.pdfToken});assert.equal(snapshot.status,200);assert.equal(snapshot.headers.get('cache-control'),'no-store');assert.equal(snapshot.body.order.pdfToken,undefined);assert.equal(snapshot.body.order.subtotalInCents,20);
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.goto(order.pdfUrl);await page.locator('#pdf-download').waitFor({state:'visible'});
    const pending=page.waitForEvent('download');await page.locator('#pdf-download').click();const download=await pending;await download.saveAs(path.join(process.env.QA_DATA_DIR,'cloudflare-selection.pdf'));
    // O mesmo renderizador precisa paginar listas longas e não buscar produto atual.
    const fake={...snapshot.body.order,items:Array.from({length:12},(_,i)=>({...snapshot.body.order.items[0],id:'QA-'+i,name:'Colar com detalhes delicados e acabamento especial para conferir a quebra de nomes longos',variant:'Opção '+i})),subtotalInCents:240};
    await page.route('**/api/request-pdf',route=>route.fulfill({json:{format:'alejoias-pdf-snapshot-v1',order:fake}}));
    await page.reload();await page.locator('#pdf-download').waitFor({state:'visible'});const multi=page.waitForEvent('download');await page.locator('#pdf-download').click();await (await multi).saveAs(path.join(process.env.QA_DATA_DIR,'cloudflare-multipage.pdf'));
    await page.goto(base+'/admin/login');await page.getByLabel('Senha',{exact:true}).fill(password);await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.waitForURL('**/admin');
    await page.locator('#password-form [name=current]').fill(password);await page.locator('#password-form [name=password]').fill('SenhaFicticiaNova-2026');
    await page.locator('#password-form button').click();await page.waitForURL('**/admin/login');
    assert.equal((await post('login',await loginPayload(base,{password}))).status,400,'Senha anterior revogada');
    assert.equal((await post('login',await loginPayload(base,{password:'SenhaFicticiaNova-2026'}))).status,200,'Nova senha aceita');
    assert.equal((await fetch(base+'/api/products',{headers:{Cookie:login.headers.get('set-cookie').split(';')[0]}})).status,401,'Sessão anterior revogada');
  }finally{await browser.close();}
  console.log('PASS: concorrência, idempotência, PDF privado, documento multipágina e troca de senha com revogação.');
})().catch(e=>{console.error(e);process.exitCode=1;});

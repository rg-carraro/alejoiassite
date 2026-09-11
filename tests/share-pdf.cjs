const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/rgcar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const page=await browser.newPage({viewport:{width:360,height:800}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
 Object.defineProperty(navigator,'canShare',{value:()=>true,configurable:true});
 Object.defineProperty(navigator,'share',{value:async data=>{window.sharedPdf={name:data.files[0].name,size:data.files[0].size,text:data.text};},configurable:true});
});
await page.goto('http://127.0.0.1:4322/catalogo',{waitUntil:'networkidle'});await page.locator('[data-add="DEMO-01"]').click();
await page.goto('http://127.0.0.1:4322/sacola');await page.locator('#customer-name').fill('Cliente Teste PDF');await page.locator('#customer-phone').fill('19999990000');
await page.locator('#whatsapp-order').click();await page.locator('#share-order-pdf').waitFor({state:'visible'});await page.locator('#share-order-pdf').click();
const shared=await page.evaluate(()=>window.sharedPdf);assert.match(shared.name,/\.pdf$/);assert.ok(shared.size>1000);assert.match(shared.text,/^http:\/\/127\.0\.0\.1:4322\/pedido\/pdf#[a-f0-9-]{36}\/[a-f0-9]{64}$/);
assert.equal(await page.locator('#order-preview').inputValue(),shared.text);
assert.equal(new URL(await page.locator('#open-order-whatsapp').getAttribute('href')).searchParams.get('text'),shared.text);
const receiver=await browser.newPage();
await receiver.goto(shared.text);
await receiver.locator('#pdf-download').waitFor({state:'visible'});
const downloadEvent=receiver.waitForEvent('download');await receiver.locator('#pdf-download').click();const received=await downloadEvent;assert.match(received.suggestedFilename(),/\.pdf$/);
await receiver.goto('http://127.0.0.1:4322/pedido/pdf#invalid');
await receiver.locator('#pdf-status').filter({hasText:'inválido'}).waitFor();
await receiver.close();
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:'.data/qa-admin/pdf-mobile.png',fullPage:true});
await page.locator('#order-note').fill('Seleção alterada');assert.equal(await page.locator('#prepared-order').isVisible(),false);
await page.route('**/api/request-pdf',route=>route.fulfill({status:500,body:'{}'}));
await page.locator('#whatsapp-order').click();await page.locator('#request-feedback').filter({hasText:'não ficou pronto'}).waitFor();
assert.equal(await page.locator('#open-order-whatsapp').isVisible(),true);assert.equal(await page.locator('#download-order-pdf').isVisible(),false);
assert.deepEqual(errors,[]);
console.log('PASS: compartilhamento de arquivo simulado, PDF invalidado por edição, fallback quando geração falha, celular sem overflow.');
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});

const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:4322',dir=path.resolve('.data/qa-admin');
(async()=>{
const password=fs.readFileSync(path.join(dir,'acesso-admin.txt'),'utf8').match(/Senha inicial: (.+)/)[1].trim();
async function post(action,data,cookie=''){return fetch(base+'/api/'+action,{method:'POST',headers:{Origin:base,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(data)});}
const login=await post('login',{password}),cookie=login.headers.get('set-cookie').split(';')[0];
const products=await (await fetch(base+'/api/products',{headers:{Cookie:cookie}})).json();
const seed=products.find(p=>p.id==='DEMO-01');
const variants=Array.from({length:12},(_,i)=>'Opção real '+i);
const product={...seed,id:'QA-PDF-MULTI',slug:'qa-pdf-multi',name:'Colar com detalhes delicados e acabamento especial para conferir a quebra de nomes longos na tabela de separação',variants,revision:products.find(p=>p.id==='QA-PDF-MULTI')?.revision||0};
assert.equal((await post('products',product,cookie)).status,200);
const order=await (await post('request',{key:crypto.randomUUID(),name:'Cliente Fictícia de Validação',phone:'19999990000',note:'Conferir as fotos e separar as peças selecionadas. '.repeat(10),items:variants.map(variant=>({id:product.id,variant,quantity:2})),expectedSubtotalInCents:240})).json();
assert.ok(order.pdfToken);
assert.equal((await post('request-pdf',{id:order.id})).status,404);
assert.equal((await post('request-pdf',{id:order.id,token:'invalid'})).status,404);
const pdf=await post('request-pdf',{id:order.id,token:order.pdfToken});assert.equal(pdf.status,200);assert.equal(pdf.headers.get('content-type'),'application/pdf');assert.equal(pdf.headers.get('cache-control'),'no-store');
const bytes=Buffer.from(await pdf.arrayBuffer());assert.equal(bytes.subarray(0,4).toString(),'%PDF');fs.writeFileSync(path.join(dir,'multipage.pdf'),bytes);
assert.equal((await post('request-pdf',{id:order.id},cookie)).status,200);
console.log('PASS: PDF privado, token inválido bloqueado, download administrativo, 12 linhas e observação longa.');
})().catch(e=>{console.error(e);process.exit(1)});

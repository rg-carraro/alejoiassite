const {spawn,spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
const root=path.resolve('.data/qa-cloudflare-'+Date.now()),source=path.join(root,'source'),persist=path.join(root,'.wrangler','state');
const env={...process.env,WRANGLER_LOG_PATH:path.join(root,'logs'),CI:'true'};
const wrangler='node_modules/wrangler/bin/wrangler.js';
function run(args,extra={}){
  const result=spawnSync(process.execPath,args,{encoding:'utf8',env:{...env,...extra},windowsHide:true,maxBuffer:10*1024*1024});
  if(result.status!==0)throw Error(result.stdout+'\n'+result.stderr);
  return result.stdout;
}
(async()=>{
  try{await fetch('http://127.0.0.1:4322');throw Error('Porta 4322 ocupada; encerre somente o servidor QA antes de testar.');}catch(e){if(e.message!=='fetch failed')throw e;}
  fs.mkdirSync(source,{recursive:true});const db=new DatabaseSync(path.join(source,'alejoias-site.sqlite'));
  db.exec(fs.readFileSync('migrations/0001_store.sql','utf8'));
  const seeds=(await import('../src/data/products.ts')).products;
  const imageName=crypto.randomUUID()+'.jpg';fs.mkdirSync(path.join(source,'uploads'));
  fs.copyFileSync('public/images/products/anel-exemplo.jpg',path.join(source,'uploads',imageName));
  for(const seed of seeds){const product={...seed,...(seed.id==='DEMO-01'?{image:'/media/'+imageName}:{}),tags:[],promoPriceInCents:null,promoStart:'',promoEnd:'',enabled:true,available:true,demo:true,revision:1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};db.prepare('INSERT INTO products VALUES(?,?,?)').run(product.id,product.slug,JSON.stringify(product));}
  db.close();
  const prepared=run(['scripts/prepare-cloudflare-data.mjs',source]);
  const migration=prepared.match(/Preparação local concluída: (.+)/)[1].trim();
  run([wrangler,'d1','migrations','apply','alejoias-loja','--local','--persist-to',persist,'--config','wrangler.jsonc']);
  run([wrangler,'d1','execute','alejoias-loja','--local','--persist-to',persist,'--config','wrangler.jsonc','--file',path.join(migration,'import.sql')]);
  const server=spawn(process.execPath,[wrangler,'dev','--config','dist-cloudflare/server/wrangler.json','--port','4322','--persist-to',persist,'--local','--log-level','error'],{env,stdio:['ignore','pipe','pipe'],windowsHide:true});
  let log='';server.stdout.on('data',b=>log+=b);server.stderr.on('data',b=>log+=b);
  try{
    let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch('http://127.0.0.1:4322/api/catalog')).ok;}catch{}if(ready)break;if(server.exitCode!==null)throw Error(log);await new Promise(r=>setTimeout(r,300));}
    assert.ok(ready,'Emulador iniciou');
    const testEnv={QA_DATA_DIR:migration,QA_CLOUDFLARE:'1'};
    for(const file of ['admin-integration.cjs','share-pdf.cjs','cloudflare-contract.cjs'])console.log(run(['tests/'+file],testEnv).trim());
    const backup=path.join(root,'backup.sql');
    // d1 export não aceita --persist-to; usa .wrangler/state relativo ao config.
    const exportConfig=path.join(root,'wrangler.json');
    fs.writeFileSync(exportConfig,JSON.stringify({name:'alejoias-qa',d1_databases:[{binding:'DB',database_name:'alejoias-loja',database_id:'00000000-0000-0000-0000-000000000000'}]}));
    run([wrangler,'d1','export','alejoias-loja','--local','--config',exportConfig,'--output',backup]);
    const restored=new DatabaseSync(path.join(root,'restored.sqlite'));restored.exec(fs.readFileSync(backup,'utf8'));
    assert.ok(restored.prepare('SELECT COUNT(*) AS count FROM requests').get().count>0);
    assert.ok(restored.prepare('SELECT COUNT(*) AS count FROM media WHERE length(content)=size').get().count>0);
    assert.equal(restored.prepare('PRAGMA integrity_check').get().integrity_check,'ok');restored.close();
    console.log('PASS: backup SQL exportado e restaurado, incluindo pedidos e fotos.');
    console.log('PASS: Cloudflare local e migração isolada. Artefatos: '+migration);
  }finally{
    if(process.platform==='win32')spawnSync('taskkill',['/PID',String(server.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});else server.kill();
    fs.writeFileSync(path.join(root,'emulator.log'),log);
  }
})().catch(e=>{console.error(e);process.exitCode=1;});

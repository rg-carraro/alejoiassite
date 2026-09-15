import {env} from 'cloudflare:workers';
import {createHash} from 'node:crypto';
import {validateProduct, text} from '../product-validation';
import {effectivePrice, type CatalogProduct} from '../../data/catalog';
import type {D1PreparedStatement} from '@cloudflare/workers-types';
export {validateProduct};
export const digest = (value:string) => createHash('sha256').update(value).digest('hex');
export const randomUUID = () => crypto.randomUUID();
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2,'0')).join('');
const query = (sql:string, ...args:any[]) => env.DB.prepare(sql).bind(...args);
export async function authorized(value?:string) {
  return !!value && !!await query('SELECT token FROM sessions WHERE token=? AND expires>?', digest(value), Date.now()).first();
}
export async function authConfig(){
  const row=await query("SELECT value FROM settings WHERE key='admin'").first<{value:string}>();
  if(!row)throw Error('Painel ainda não configurado.');
  const saved=JSON.parse(row.value);return {mode:'pbkdf2-client-v1',salt:saved.salt};
}
async function checkPassword(password:unknown) {
  if(typeof password!=='string'||!/^[a-f0-9]{64}$/.test(password))return false;
  const row=await query("SELECT value FROM settings WHERE key='admin'").first<{value:string}>();
  if(!row)throw Error('Painel ainda não configurado.');
  const saved=JSON.parse(row.value);
  // O navegador deriva PBKDF2-SHA256/600000. O banco guarda outro hash,
  // de forma que o verificador salvo não possa ser usado diretamente no login.
  const actual={hash:digest(password)};
  let difference=actual.hash.length^String(saved.hash).length;
  for(let i=0;i<actual.hash.length;i++)difference|=actual.hash.charCodeAt(i)^String(saved.hash).charCodeAt(i);
  return difference===0 ? row.value : false;
}
export async function login(password:unknown) {
  const admin=await checkPassword(password);if(!admin)throw Error('Senha incorreta.');
  const session=token();
  // Uma troca de senha concorrente não pode criar sessão com a credencial antiga.
  const saved=await query("INSERT INTO sessions SELECT ?,? WHERE (SELECT value FROM settings WHERE key='admin')=?",digest(session),Date.now()+8*3600000,admin).run();
  if(!saved.meta.changes)throw Error('Senha mudou. Entre novamente.');
  return session;
}
export async function logout(value:string){await query('DELETE FROM sessions WHERE token=?',digest(value)).run();}
export async function changePassword(old:unknown,next:unknown){
  const before=await checkPassword(old);if(!before)throw Error('Senha atual incorreta.');
  const value=next as {salt?:string;proof?:string};
  if(!value||typeof value.salt!=='string'||typeof value.proof!=='string'||!/^[a-f0-9]{64}$/.test(value.salt)||!/^[a-f0-9]{64}$/.test(value.proof))throw Error('Nova senha inválida.');
  const credential={algorithm:'pbkdf2-client-v1',salt:value.salt,hash:digest(value.proof)};
  await env.DB.batch([
    query("INSERT INTO guards VALUES(1, CASE WHEN (SELECT value FROM settings WHERE key='admin')=? THEN 1 ELSE 0 END)",before),
    query("UPDATE settings SET value=? WHERE key='admin'",JSON.stringify(credential)),
    query('DELETE FROM sessions'),query('DELETE FROM guards'),
  ]);
}
export async function rateLimit(key:string,max:number,period:number){
  const now=Date.now();
  const row=await query(`INSERT INTO limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET
    count=CASE WHEN limits.until>? THEN limits.count+1 ELSE 1 END,
    until=CASE WHEN limits.until>? THEN limits.until ELSE excluded.until END RETURNING count`,key,now+period,now,now).first<{count:number}>();
  if(row&&row.count>max)throw Error('Muitas tentativas. Aguarde alguns minutos.');
}
export async function listProducts(all=false):Promise<CatalogProduct[]>{
  const rows=await query(all?'SELECT data FROM products ORDER BY rowid':"SELECT data FROM products WHERE json_extract(data,'$.enabled')=1 ORDER BY rowid").all<{data:string}>();
  return rows.results.map(r=>JSON.parse(r.data));
}
export async function getProduct(id:string):Promise<CatalogProduct|undefined>{const row=await query('SELECT data FROM products WHERE id=?',id).first<{data:string}>();return row?JSON.parse(row.data):undefined;}
export async function publicProducts(){return (await listProducts()).map(p=>({...p,priceInCents:effectivePrice(p),regularPriceInCents:p.priceInCents}));}
async function snapshot(){
  const results=await env.DB.batch([
    query("SELECT value FROM settings WHERE key='catalog_revision'"),query('SELECT data FROM products ORDER BY rowid'),
  ]);
  return {revision:String((results[0].results[0] as {value:string})?.value),products:results[1].results.map((r:any)=>JSON.parse(r.data) as CatalogProduct)};
}
function guard(revision:string){return query("INSERT INTO guards VALUES(1, CASE WHEN (SELECT value FROM settings WHERE key='catalog_revision')=? THEN 1 ELSE 0 END)",revision);}
async function batch(statements:D1PreparedStatement[]){
  try{return await env.DB.batch(statements);}catch(error){
    const message=String(error);
    if(message.includes('CHECK constraint'))throw Error('Cadastro mudou. Recarregue antes de salvar.');
    if(message.includes('UNIQUE constraint'))throw Error('Código ou endereço já utilizado.');
    throw error;
  }
}
export async function applyProducts(raws:any[],source:string){
  const state=await snapshot(), byId=new Map(state.products.map(p=>[p.id,p]));
  const changes=raws.map(raw=>{
    const before=byId.get(raw.id);if(!before&&raw.revision>0)throw Error('Cadastro mudou. Recarregue antes de salvar.');
    const after=validateProduct(raw,before);byId.set(after.id,after);
    return {after,before:before?JSON.stringify(before):null};
  });
  if(!changes.length)return [];
  // json_each mantém até 500 produtos em poucas consultas; D1 batch é atômico.
  await batch([
    guard(state.revision),
    query(`INSERT INTO products(id,slug,data) SELECT json_extract(value,'$.after.id'),json_extract(value,'$.after.slug'),json_extract(value,'$.after') FROM json_each(?) WHERE 1
      ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,data=excluded.data`,JSON.stringify(changes)),
    query(`INSERT INTO history(product_id,at,actor,source,before_json,after_json)
      SELECT json_extract(value,'$.after.id'),json_extract(value,'$.after.updatedAt'),'administrador',?,json_extract(value,'$.before'),json_extract(value,'$.after') FROM json_each(?)`,source,JSON.stringify(changes)),
    query('DELETE FROM guards'),
  ]);
  return changes.map(c=>c.after);
}
export async function saveProduct(raw:any,source='edição manual'){return (await applyProducts([raw],source))[0];}
export async function productHistory(id:string){return (await query('SELECT * FROM history WHERE product_id=? ORDER BY seq DESC',id).all()).results;}
export async function requests(){return (await query('SELECT data,status FROM requests ORDER BY created_at DESC LIMIT 1000').all<{data:string;status:string}>()).results.map(r=>({...JSON.parse(r.data),status:r.status}));}
export async function requestStatus(id:string,status:string){
  if(!['nova','em atendimento','concluída','cancelada'].includes(status))throw Error('Situação inválida.');
  if(!await query('SELECT id FROM requests WHERE id=?',id).first())throw Error('Solicitação não encontrada.');
  await env.DB.batch([query('UPDATE requests SET status=? WHERE id=?',status,id),query('INSERT INTO request_history(request_id,status,at,actor) VALUES(?,?,?,?)',id,status,new Date().toISOString(),'administrador')]);
}
async function priorRequest(key:string,hash:string){
  const prior=await query('SELECT hash,data FROM requests WHERE request_key=?',key).first<{hash:string;data:string}>();
  if(!prior)return null;if(prior.hash!==hash)throw Error('Solicitação já usada. Recarregue a página.');return JSON.parse(prior.data);
}
export async function createRequest(raw:any,origin:string){
  if(!raw||typeof raw!=='object')throw Error('Solicitação inválida.');
  const name=text(raw.name,'nome',100,true),phone=text(raw.phone,'telefone',25,true),note=text(raw.note||'','observação',600);
  if(name.length<2||!/^(?:\d{10,11}|55\d{10,11})$/.test(phone.replace(/\D/g,'')))throw Error('Confira nome e telefone com DDD.');
  if(typeof raw.key!=='string'||!/^[a-f0-9-]{36}$/.test(raw.key))throw Error('Identificador inválido.');
  if(!Array.isArray(raw.items)||!raw.items.length||raw.items.length>50)throw Error('Sacola inválida.');
  const hash=digest(JSON.stringify({name,phone,note,items:raw.items,expected:raw.expectedSubtotalInCents}));
  const prior=await priorRequest(raw.key,hash);if(prior)return prior;
  const state=await snapshot(),products=new Map(state.products.map(p=>[p.id,p])),seen=new Set();
  const items=raw.items.map((i:any)=>{
    if(!i||typeof i.id!=='string'||typeof i.variant!=='string'||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>99)throw Error('Item inválido.');
    const p=products.get(i.id);if(!p||!p.enabled||!p.available||!p.variants.includes(i.variant))throw Error('Uma peça não está mais disponível. Atualize a sacola.');
    const key=i.id+'|'+i.variant;if(seen.has(key))throw Error('Item duplicado.');seen.add(key);
    return {id:p.id,name:p.name,variant:i.variant,quantity:i.quantity,priceInCents:effectivePrice(p),demo:p.demo,image:p.image};
  });
  const subtotalInCents=items.reduce((sum:number,item:any)=>sum+item.quantity*item.priceInCents,0);
  if(raw.expectedSubtotalInCents!==subtotalInCents)throw Error('Os preços mudaram. Atualize a sacola e confira antes de enviar.');
  const id=randomUUID(),createdAt=new Date().toISOString(),pdfToken=token();
  const pdfUrl=new URL('/pedido/pdf',origin).href+'#'+id+'/'+pdfToken;
  const data={id,name,phone,note,items,subtotalInCents,createdAt,message:pdfUrl,pdfToken,pdfUrl,whatsappUrl:'https://wa.me/5519988038395?text='+encodeURIComponent(pdfUrl)};
  try{
    await batch([guard(state.revision),query('INSERT INTO requests VALUES(?,?,?,?,?,?)',id,raw.key,hash,JSON.stringify(data),'nova',createdAt),query('INSERT INTO request_history(request_id,status,at,actor) VALUES(?,?,?,?)',id,'nova',createdAt,'cliente'),query('DELETE FROM guards')]);
  }catch(error){const retry=await priorRequest(raw.key,hash);if(retry)return retry;throw error;}
  return data;
}
export async function requestForPdf(id:unknown,value:unknown,admin:boolean){
  if(typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))return null;
  const row=await query('SELECT data FROM requests WHERE id=?',id).first<{data:string}>();if(!row)return null;
  const order=JSON.parse(row.data);
  if(!admin&&(typeof value!=='string'||!order.pdfToken||digest(value)!==digest(order.pdfToken)))return null;
  // Apenas o snapshot necessário ao documento, sem devolver token ou URL privada.
  const {name,phone,note,createdAt,subtotalInCents,items}=order;
  return {id,name,phone,note,createdAt,subtotalInCents,items};
}

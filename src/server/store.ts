import {formatOrderTable} from '../data/order-message';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync,existsSync,writeFileSync,unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes,randomUUID,scryptSync,timingSafeEqual,createHash } from 'node:crypto';
import { products as seeds } from '../data/products';
import { categories } from '../data/categories';
import { type CatalogProduct, effectivePrice,formatPrice } from '../data/catalog';
export const dataDir=resolve(process.env.ALEJOIAS_DATA_DIR||'.data');
mkdirSync(dataDir,{recursive:true});
export const db=new DatabaseSync(resolve(dataDir,'alejoias-site.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY,slug TEXT UNIQUE NOT NULL,data TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS history(seq INTEGER PRIMARY KEY AUTOINCREMENT,product_id TEXT,at TEXT,actor TEXT,source TEXT,before_json TEXT,after_json TEXT);
 CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,expires INTEGER);
 CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY,count INTEGER,until INTEGER);
 CREATE TABLE IF NOT EXISTS requests(id TEXT PRIMARY KEY,request_key TEXT UNIQUE,hash TEXT,data TEXT,status TEXT,created_at TEXT);
 CREATE TABLE IF NOT EXISTS request_history(seq INTEGER PRIMARY KEY AUTOINCREMENT,request_id TEXT,status TEXT,at TEXT,actor TEXT);
`);
export function transaction<T>(fn:()=>T):T{db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
function setting(key:string){return (db.prepare('SELECT value FROM settings WHERE key=?').get(key) as {value:string}|undefined)?.value;}
function credential(password:string){const salt=randomBytes(16).toString('hex');return JSON.stringify({salt,hash:scryptSync(password,salt,64).toString('hex')});}
if(!setting('admin')){const password=randomBytes(18).toString('base64url');db.prepare('INSERT INTO settings VALUES(?,?)').run('admin',credential(password));const file=resolve(dataDir,'acesso-admin.txt');if(!existsSync(file))writeFileSync(file,'Painel local: http://localhost:4321/admin\nSenha inicial: '+password+'\nTroque a senha no painel. Este arquivo é privado e não entra no Git.\n',{mode:0o600});}
export function checkPassword(password:string){if(typeof password!=='string'||password.length>200)return false;const c=JSON.parse(setting('admin')!);return timingSafeEqual(Buffer.from(c.hash,'hex'),scryptSync(password,c.salt,64));}
export function changePassword(old:string,next:string){if(!checkPassword(old))throw Error('Senha atual incorreta.');if(typeof next!=='string'||next.length<12||next.length>200)throw Error('Use uma senha de 12 a 200 caracteres.');db.prepare('UPDATE settings SET value=? WHERE key=?').run(credential(next),'admin');db.exec('DELETE FROM sessions');const accessFile=resolve(dataDir,'acesso-admin.txt');if(existsSync(accessFile))unlinkSync(accessFile);}
export function rateLimit(key:string,max:number,period:number){const now=Date.now();const row=db.prepare('SELECT count,until FROM limits WHERE key=?').get(key) as {count:number;until:number}|undefined;if(row&&row.until>now&&row.count>=max)throw Error('Muitas tentativas. Aguarde alguns minutos.');db.prepare('INSERT OR REPLACE INTO limits VALUES(?,?,?)').run(key,row&&row.until>now?row.count+1:1,row&&row.until>now?row.until:now+period);}
export function login(password:string){if(!checkPassword(password))throw Error('Senha incorreta.');const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?)').run(digest(token),Date.now()+8*3600000);return token;}
export function authorized(token?:string){if(!token)return false;return !!db.prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(digest(token),Date.now());}
export function logout(token:string){db.prepare('DELETE FROM sessions WHERE token=?').run(digest(token));}
export function listProducts(all=false):CatalogProduct[]{return (db.prepare('SELECT data FROM products ORDER BY rowid').all() as {data:string}[]).map(r=>JSON.parse(r.data)).filter(p=>all||p.enabled);}
export function getProduct(id:string):CatalogProduct|undefined{const r=db.prepare('SELECT data FROM products WHERE id=?').get(id) as {data:string}|undefined;return r?JSON.parse(r.data):undefined;}
export function publicProducts(){return listProducts().map(p=>({...p,priceInCents:effectivePrice(p),regularPriceInCents:p.priceInCents}));}
function text(value:unknown,name:string,max:number,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw Error('Campo inválido: '+name);return value.trim();}
function array(value:unknown,name:string){if(!Array.isArray(value)||value.length>30||value.some(v=>typeof v!=='string'||!v.trim()||v.length>100))throw Error('Lista inválida: '+name);return [...new Set(value.map(v=>v.trim()))];}
export function validateProduct(raw:any,existing?:CatalogProduct):CatalogProduct{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Produto inválido.');
 const now=new Date().toISOString();const id=text(raw.id,'código',80,true);if(!/^[a-zA-Z0-9._-]+$/.test(id))throw Error('Código: use letras, números, ponto, hífen ou sublinhado.');
 const slug=text(raw.slug,'endereço',100,true);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Endereço inválido.');
 if(existing&&(id!==existing.id||raw.revision!==existing.revision))throw Error('Cadastro mudou. Recarregue antes de salvar.');
 if(!categories.some(c=>c.slug===raw.category))throw Error('Categoria inválida.');
 const money=(n:any)=>Number.isSafeInteger(n)&&n>=0&&n<=100000000;
 if(!money(raw.priceInCents))throw Error('Preço inválido.');
 const promo=raw.promoPriceInCents??null;if(promo!==null&&(!money(promo)||promo>=raw.priceInCents))throw Error('Preço promocional deve ser menor que o preço normal.');
 const date=(v:any)=>{if(!v)return '';if(typeof v!=='string'||!Number.isFinite(Date.parse(v)))throw Error('Data promocional inválida.');return new Date(v).toISOString();};
 const promoStart=date(raw.promoStart),promoEnd=date(raw.promoEnd);if(promoStart&&promoEnd&&promoEnd<=promoStart)throw Error('Fim da promoção deve ser após o início.');
 const image=text(raw.image,'imagem',250);if(image&&!/^\/(?:images|media)\/[a-zA-Z0-9/_\-.]+$/.test(image))throw Error('Use uma imagem enviada pelo painel ou um caminho local /images/.');
 const variants=array(raw.variants,'opções');if(!variants.length)throw Error('Informe pelo menos uma opção.');
 const collections=array(raw.collections,'coleções');if(collections.some(c=>!['novidades','presentes'].includes(c)))throw Error('Coleção inválida.');
 for(const key of ['enabled','available','demo'])if(typeof raw[key]!=='boolean')throw Error('Situação inválida: '+key);
 return {id,slug,name:text(raw.name,'nome',150,true),category:raw.category,image,alt:text(raw.alt,'texto da imagem',250),description:text(raw.description,'descrição',5000),collections,variants,tags:array(raw.tags,'tags'),priceInCents:raw.priceInCents,promoPriceInCents:promo,promoStart,promoEnd,enabled:raw.enabled,available:raw.available,demo:raw.demo,revision:(existing?.revision||0)+1,createdAt:existing?.createdAt||now,updatedAt:now};
}
function writeProduct(p:CatalogProduct,before:CatalogProduct|undefined,source:string){const other=db.prepare('SELECT id FROM products WHERE slug=? AND id<>?').get(p.slug,p.id);if(other)throw Error('Endereço já usado por outro produto.');db.prepare('INSERT INTO products VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,data=excluded.data').run(p.id,p.slug,JSON.stringify(p));db.prepare('INSERT INTO history(product_id,at,actor,source,before_json,after_json) VALUES(?,?,?,?,?,?)').run(p.id,p.updatedAt,'administrador',source,before?JSON.stringify(before):null,JSON.stringify(p));return p;}
export function saveProduct(raw:any,source='edição manual'){return transaction(()=>{const before=getProduct(raw.id);return writeProduct(validateProduct(raw,before),before,source);});}
if(!setting('seeded'))transaction(()=>{for(const seed of seeds){if(!getProduct(seed.id))writeProduct(validateProduct({...seed,tags:[],promoPriceInCents:null,promoStart:'',promoEnd:'',enabled:true,available:true,demo:true}),undefined,'amostra inicial');}db.prepare('INSERT INTO settings VALUES(?,?)').run('seeded','1');});
export function productHistory(id:string){return db.prepare('SELECT * FROM history WHERE product_id=? ORDER BY seq DESC').all(id);}
export function requests(){return db.prepare('SELECT * FROM requests ORDER BY created_at DESC LIMIT 1000').all().map((r:any)=>({...JSON.parse(r.data),status:r.status}));}
export function requestStatus(id:string,status:string){if(!['nova','em atendimento','concluída','cancelada'].includes(status))throw Error('Situação inválida.');transaction(()=>{if(!db.prepare('SELECT id FROM requests WHERE id=?').get(id))throw Error('Solicitação não encontrada.');db.prepare('UPDATE requests SET status=? WHERE id=?').run(status,id);db.prepare('INSERT INTO request_history(request_id,status,at,actor) VALUES(?,?,?,?)').run(id,status,new Date().toISOString(),'administrador');});}
export function createRequest(raw:any){return transaction(()=>{
 if(!raw||typeof raw!=='object')throw Error('Solicitação inválida.');
 const name=text(raw.name,'nome',100,true),phone=text(raw.phone,'telefone',25,true),note=text(raw.note||'','observação',600);
 if(name.length<2||!/^(?:\d{10,11}|55\d{10,11})$/.test(phone.replace(/\D/g,'')))throw Error('Confira nome e telefone com DDD.');
 if(typeof raw.key!=='string'||!/^[a-f0-9-]{36}$/.test(raw.key))throw Error('Identificador inválido.');
 if(!Array.isArray(raw.items)||!raw.items.length||raw.items.length>50)throw Error('Sacola inválida.');
 const hash=digest(JSON.stringify({name,phone,note,items:raw.items,expected:raw.expectedSubtotalInCents}));
 const prior=db.prepare('SELECT hash,data FROM requests WHERE request_key=?').get(raw.key) as {hash:string;data:string}|undefined;if(prior){if(prior.hash!==hash)throw Error('Solicitação já usada. Recarregue a página.');return JSON.parse(prior.data);}
 const seen=new Set();const items=raw.items.map((i:any)=>{if(!i||typeof i.id!=='string'||typeof i.variant!=='string'||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>99)throw Error('Item inválido.');const p=getProduct(i.id);if(!p||!p.enabled||!p.available||!p.variants.includes(i.variant))throw Error('Uma peça não está mais disponível. Atualize a sacola.');const key=i.id+'|'+i.variant;if(seen.has(key))throw Error('Item duplicado.');seen.add(key);return {id:p.id,name:p.name,variant:i.variant,quantity:i.quantity,priceInCents:effectivePrice(p),demo:p.demo};});
 const subtotalInCents=items.reduce((s:number,i:any)=>s+i.quantity*i.priceInCents,0);if(raw.expectedSubtotalInCents!==subtotalInCents)throw Error('Os preços mudaram. Atualize a sacola e confira antes de enviar.');
 const id=randomUUID(),createdAt=new Date().toISOString();const message=['Olá, AleJoias! Esta é minha seleção.','Solicitação: '+id,'Nome: '+name,'Telefone: '+phone,formatOrderTable(items),'Subtotal: '+formatPrice(subtotalInCents)+' (entrega a confirmar).',...(items.some((i:any)=>i.demo)?['Contém peças/preços demonstrativos; confirmar valores reais.']:[]),'Solicitação sujeita à confirmação; não é compra ou reserva.',...(note?['Observação: '+note]:[])].join('\n');
 const data={id,name,phone,note,items,subtotalInCents,createdAt,message,whatsappUrl:'https://wa.me/5519988038395?text='+encodeURIComponent(message)};
 db.prepare('INSERT INTO requests VALUES(?,?,?,?,?,?)').run(id,raw.key,hash,JSON.stringify(data),'nova',createdAt);db.prepare('INSERT INTO request_history(request_id,status,at,actor) VALUES(?,?,?,?)').run(id,'nova',createdAt,'cliente');return data;
});}
export function applyProducts(raws:any[],source:string){return transaction(()=>raws.map(raw=>{const before=getProduct(raw.id);return writeProduct(validateProduct(raw,before),before,source);}));}
export { randomUUID };

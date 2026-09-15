import {categories} from '../data/categories';
import type {CatalogProduct} from '../data/catalog';
export function text(value:unknown,name:string,max:number,required=false){if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw Error('Campo inválido: '+name);return value.trim();}
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

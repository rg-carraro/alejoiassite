import {pdfBlob} from './pdf-client';

import {formatPrice,type CatalogProduct} from '../data/catalog';
const products:CatalogProduct[]=await fetch('/api/catalog').then(r=>{if(!r.ok)throw Error('Catálogo indisponível');return r.json();});
type Item = {id:string; variant:string; quantity:number};
const key='alejoias-bag-v1';
const $ = <T extends HTMLElement>(selector:string) => document.querySelector<T>(selector);
let bag:Item[]=[];
function read(){try{const raw=JSON.parse(localStorage.getItem(key)||'[]');bag=Array.isArray(raw)?raw.filter((i:Item)=>products.some(p=>p.id===i.id&&p.available&&p.variants.includes(i.variant))&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=99).slice(0,50):[];}catch{bag=[];}}
read();
let timer:ReturnType<typeof setTimeout>;
function toast(message:string){const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('visible'),3500);}
function badge(){document.querySelectorAll('[data-bag-count]').forEach(el=>el.textContent=String(bag.reduce((s,i)=>s+i.quantity,0)));}
function save(){try{localStorage.setItem(key,JSON.stringify(bag));}catch{toast('Seu navegador não permitiu salvar a sacola. Mantenha esta página aberta.');}badge();}
badge();
document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button=>button.addEventListener('click',()=>{
 const p=products.find(p=>p.id===button.dataset.add);if(!p||!p.available)return;
 const input=$<HTMLInputElement>('#product-quantity');
 if(button.hasAttribute('data-detail')&&input&&!input.reportValidity())return;
 const quantity=button.hasAttribute('data-detail')?Number(input?.value||1):1;
 const variant=button.hasAttribute('data-detail')?($<HTMLSelectElement>('#product-variant')?.value||p.variants[0]):p.variants[0];
 const current=bag.find(i=>i.id===p.id&&i.variant===variant);
 if((current?.quantity||0)+quantity>99){toast('Limite de 99 unidades por opção.');return;}
 if(current)current.quantity+=quantity;else bag.push({id:p.id,variant,quantity});save();toast(p.name+' adicionado à sacola.');
}));
const filter=$<HTMLFormElement>('#filters');
if(filter){
 const params=new URLSearchParams(location.search);
 ['busca','categoria','colecao','ordem'].forEach(name=>{const el=filter.elements.namedItem(name) as HTMLInputElement|HTMLSelectElement;el.value=params.get(name)||'';});
 const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function apply(){if(!filter)return;const data=new FormData(filter);const query=normalize(String(data.get('busca')||'')).trim();let count=0;const cards=Array.from(document.querySelectorAll<HTMLElement>('[data-product-card]'));if(data.get('ordem')==='nome')cards.sort((a,b)=>(a.dataset.name||'').localeCompare(b.dataset.name||'','pt-BR'));else cards.sort((a,b)=>products.findIndex(p=>p.name===a.dataset.name)-products.findIndex(p=>p.name===b.dataset.name));cards.forEach(card=>{const visible=normalize(card.dataset.name||'').includes(query)&&(!data.get('categoria')||card.dataset.category===data.get('categoria'))&&(!data.get('colecao')||(card.dataset.collections||'').split(' ').includes(String(data.get('colecao'))));card.hidden=!visible;if(visible)count++;$('#catalog-grid')?.append(card);});const result=$('#result-count');if(result)result.textContent=count+' peça(s)';const empty=$('#no-results');if(empty)empty.hidden=count>0;const next=new URLSearchParams();data.forEach((value,key)=>{if(value)next.set(key,String(value));});history.replaceState(null,'',location.pathname+(next.size?'?'+next:''));}
 filter.addEventListener('input',apply);filter.addEventListener('submit',e=>{e.preventDefault();apply();});filter.addEventListener('reset',()=>setTimeout(apply,0));$('#clear-filters')?.addEventListener('click',()=>filter.reset());apply();
}
function subtotal(){return bag.reduce((sum,i)=>sum+products.find(p=>p.id===i.id)!.priceInCents*i.quantity,0);}
function message(){return prepared?.message||'Prepare o pedido para gerar o link do PDF.';}
function updateMessage(){invalidatePdf();const subtotalEl=$("#cart-subtotal");if(subtotalEl)subtotalEl.textContent=formatPrice(subtotal());const text=message();const preview=$<HTMLTextAreaElement>('#order-preview');if(preview)preview.value=text;}
function renderCart(){const list=$('#cart-items');if(!list)return;list.replaceChildren();const empty=$('#cart-empty'),content=$('#cart-content');if(empty)empty.hidden=bag.length>0;if(content)content.hidden=bag.length===0;
 bag.forEach((item,index)=>{const p=products.find(p=>p.id===item.id)!;const row=document.createElement('article');row.className='cart-row';const img=document.createElement('img');img.src=p.image;img.alt=p.alt;const body=document.createElement('div');const title=document.createElement('h2');const link=document.createElement('a');link.href='/produto/'+p.slug;link.textContent=p.name;title.append(link);const detail=document.createElement('p');detail.textContent=(p.variants.length>1?item.variant+' · ':'')+formatPrice(p.priceInCents)+' por unidade';const label=document.createElement('label');label.textContent='Quantidade';const input=document.createElement('input');input.type='number';input.min='1';input.max='99';input.step='1';input.value=String(item.quantity);input.setAttribute('aria-label','Quantidade de '+p.name);input.addEventListener('change',()=>{if(!input.reportValidity()){input.value=String(item.quantity);return;}bag[index].quantity=Number(input.value);save();updateMessage();const total=$('#cart-total');if(total)total.textContent=bag.reduce((s,i)=>s+i.quantity,0)+' peça(s) selecionada(s)';});label.append(input);const remove=document.createElement('button');remove.textContent='Remover';remove.setAttribute('aria-label','Remover '+p.name);remove.addEventListener('click',()=>{bag.splice(index,1);save();renderCart();toast('Peça removida da sacola.');});body.append(title,detail,label,remove);row.append(img,body);list.append(row);});const total=$('#cart-total');if(total)total.textContent=bag.reduce((s,i)=>s+i.quantity,0)+' peça(s) selecionada(s)';updateMessage();}
renderCart();$('#order-note')?.addEventListener('input',updateMessage);
$('#copy-order')?.addEventListener('click',async()=>{try{if(!prepared){toast('Prepare o pedido primeiro para gerar o link.');return;}await navigator.clipboard.writeText(message());toast('Link copiado.');}catch{const preview=$<HTMLTextAreaElement>('#order-preview');preview?.closest('details')?.setAttribute('open','');preview?.focus();preview?.select();toast('Selecione e copie o resumo exibido.');}});
window.addEventListener('storage',event=>{if(event.key===key){read();badge();renderCart();}});

// Integração opcional: leitura da seleção, sem enviar mensagens ou confirmar pedidos.
const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>unknown}}).modelContext;
if(context?.registerTool){const lifecycle=new AbortController();try{Promise.resolve(context.registerTool({name:'read_shopping_bag',description:'Lê a seleção atual da sacola; não envia nem confirma um pedido.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input:unknown){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Use um objeto vazio.');return {items:bag.map(i=>({...i})),pricing:'catalogo_atual',subtotalInCents:subtotal(),confirmed:false};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});}


function validCustomer(){
 const name=$<HTMLInputElement>('#customer-name'),phone=$<HTMLInputElement>('#customer-phone');
 if(!name||!phone)return false;
 name.setCustomValidity(name.value.trim().length<2?'Informe seu nome.':'');
 const digits=phone.value.replace(/\D/g,'');
 phone.setCustomValidity(/^(?:\d{10,11}|55\d{10,11})$/.test(digits)?'':'Informe o telefone com DDD (10 ou 11 dígitos), opcionalmente com +55.');
 return name.reportValidity()&&phone.reportValidity();
}
['#customer-name','#customer-phone'].forEach(selector=>$(selector)?.addEventListener('input',()=>{($<HTMLInputElement>(selector))?.setCustomValidity('');updateMessage();}));
let requestKey=crypto.randomUUID();
let lastPayload='';
type Prepared={file?:File;url?:string;message:string;whatsappUrl:string;payload:string};
var prepared:Prepared|undefined;
function payload(){return {name:$<HTMLInputElement>('#customer-name')!.value.trim(),phone:$<HTMLInputElement>('#customer-phone')!.value.trim(),note:$<HTMLTextAreaElement>('#order-note')?.value.trim()||'',items:bag,expectedSubtotalInCents:subtotal()};}
function invalidatePdf(){
 if(prepared?.url)URL.revokeObjectURL(prepared.url);
 prepared=undefined;
 const controls=$('#prepared-order');if(controls)controls.hidden=true;
 const feedback=$('#request-feedback');if(feedback)feedback.textContent='';
}
window.addEventListener('pagehide',invalidatePdf);
$('#whatsapp-order')?.addEventListener('click',async event=>{
 event.preventDefault();if(!bag.length||!validCustomer())return;
 const button=$<HTMLButtonElement>('#whatsapp-order'),feedback=$('#request-feedback');if(!button)return;button.disabled=true;
 invalidatePdf();
 try{
 const values=payload(),serialized=JSON.stringify(values);if(serialized!==lastPayload){requestKey=crypto.randomUUID();lastPayload=serialized;}
 const response=await fetch('/api/request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,key:requestKey})});const result=await response.json();if(!response.ok)throw Error(result.error||'Não foi possível registrar.');
 if(serialized!==JSON.stringify(payload()))throw Error('A seleção mudou. Prepare o PDF novamente.');
 prepared={message:result.message,whatsappUrl:result.whatsappUrl,payload:serialized};
 const preview=$<HTMLTextAreaElement>('#order-preview');if(preview)preview.value=result.message;
 const controls=$('#prepared-order')!,download=$<HTMLAnchorElement>('#download-order-pdf')!,share=$<HTMLButtonElement>('#share-order-pdf')!;
 controls.hidden=false;download.hidden=true;share.hidden=true;
 $<HTMLAnchorElement>('#open-order-whatsapp')!.href=result.whatsappUrl;
 if(feedback)feedback.textContent='Solicitação registrada. Preparando o PDF com as fotos…';
 const pdfResponse=await fetch('/api/request-pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:result.id,token:result.pdfToken})});
 if(!pdfResponse.ok)throw Error('A seleção foi registrada, mas o PDF não ficou pronto. Tente preparar novamente ou abra o WhatsApp abaixo.');
 const file=new File([await pdfBlob(pdfResponse)],'alejoias-'+result.id+'.pdf',{type:'application/pdf'});
 if(!prepared||serialized!==JSON.stringify(payload()))throw Error('A seleção mudou. Prepare o PDF novamente.');
 prepared.file=file;prepared.url=URL.createObjectURL(file);
 download.href=prepared.url;download.download=file.name;download.hidden=false;
 share.hidden=!(navigator.canShare?.({files:[file]}));
 if(feedback)feedback.textContent='PDF pronto! Abra o WhatsApp para enviar o link. Você também pode baixar o arquivo.';
 }catch(error){if(feedback)feedback.textContent=(error as Error).message;}finally{button.disabled=false;}
});
$('#share-order-pdf')?.addEventListener('click',async()=>{
 if(!prepared?.file||prepared.payload!==JSON.stringify(payload())){invalidatePdf();toast('Prepare novamente o PDF da seleção atual.');return;}
 try{await navigator.share({files:[prepared.file],text:prepared.message,title:'Minha seleção Ale Carraro'});}
 catch(error){if((error as Error).name!=='AbortError')toast('Baixe o PDF e anexe na conversa pelo WhatsApp.');}
});

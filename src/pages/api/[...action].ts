import {selectionPdf} from '../../server/order-pdf';
import type { APIRoute } from 'astro';
import {requestForPdf,authorized,login,logout,rateLimit,saveProduct,publicProducts,listProducts,productHistory,requests,requestStatus,createRequest,changePassword,dataDir,randomUUID} from '../../server/store';
import { previewImport,commitImport } from '../../server/importer';
import { mkdirSync,writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
export const prerender=false;
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export const ALL:APIRoute=async({request,params,cookies,url})=>{
 const action=params.action||'';const method=request.method;const token=cookies.get('alejoias_admin')?.value;
 try{
 if(method==='GET'&&action==='catalog')return json(publicProducts());
 if(!['GET','POST'].includes(method))return json({error:'Método inválido'},405);
 if(method==='POST'&&request.headers.get('origin')!==url.origin)return json({error:'Origem inválida'},403);
 const publicAction=['login','request','request-pdf'].includes(action);
 if(!publicAction&&!authorized(token))return json({error:'Entre no painel.'},401);
 if(method==='GET'){
  if(action==='products')return json(listProducts(true));
  if(action==='history')return json(productHistory(url.searchParams.get('id')||''));
  if(action==='requests')return json(requests());
  if(action==='export')return new Response(JSON.stringify(listProducts(true),null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="catalogo-backup.json"','Cache-Control':'no-store'}});
  return json({error:'Não encontrado'},404);
 }
 if(action==='upload'){
  if(Number(request.headers.get('content-length'))>5500000)throw Error('Imagem deve ter no máximo 5 MB.');
  const form=await request.formData(),file=form.get('image');if(!(file instanceof File)||file.size>5000000||file.size<12)throw Error('Selecione uma imagem de até 5 MB.');
  const buffer=Buffer.from(await file.arrayBuffer());const ext=buffer[0]===255&&buffer[1]===216?'jpg':buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP'?'webp':null;if(!ext)throw Error('Use JPEG, PNG ou WebP.');mkdirSync(resolve(dataDir,'uploads'),{recursive:true});const name=randomUUID()+'.'+ext;writeFileSync(resolve(dataDir,'uploads',name),buffer);return json({image:'/media/'+name});
 }
 if(Number(request.headers.get('content-length'))>1500000)throw Error('Conteúdo muito grande.');
 const text=await request.text();if(text.length>1500000)throw Error('Conteúdo muito grande.');const data=JSON.parse(text||'{}');
 if(action==='login'){rateLimit('login',15,15*60000);const session=login(data.password);cookies.set('alejoias_admin',session,{path:'/',httpOnly:true,sameSite:'strict',secure:url.protocol==='https:',maxAge:8*3600});return json({ok:true});}
 if(action==='request'){rateLimit('requests',100,60000);return json(createRequest(data));}
 if(action==='request-pdf'){
  rateLimit('request-pdf',60,60000);
  const order=requestForPdf(data.id,data.token,authorized(token));
  if(!order)return json({error:'Solicitação não disponível.'},404);
  const pdf=await selectionPdf(order);
  return new Response(new Uint8Array(pdf),{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="alejoias-'+order.id+'.pdf"','Cache-Control':'no-store'}});
 }
 if(action==='logout'){logout(token!);cookies.delete('alejoias_admin',{path:'/'});return json({ok:true});}
 if(action==='password'){changePassword(data.current,data.password);cookies.delete('alejoias_admin',{path:'/'});return json({ok:true});}
 if(action==='products')return json(saveProduct(data));
 if(action==='import-preview'){const p=previewImport(data);return json({summary:p.summary,token:p.token});}
 if(action==='import-apply')return json(commitImport(data));
 if(action==='request-status'){requestStatus(data.id,data.status);return json({ok:true});}
 return json({error:'Não encontrado'},404);
 }catch(e){const message=e instanceof SyntaxError?'Formato inválido.':(e as Error).message;const safe=message.startsWith('UNIQUE')||message.includes('SQLITE')?'Não foi possível salvar. Verifique os códigos e endereços.':message;return json({error:safe},400);}
};

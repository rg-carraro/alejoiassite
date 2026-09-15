import type {APIRoute} from 'astro';
import {env} from 'cloudflare:workers';
import * as store from './store';
import {previewImport,commitImport} from './importer';
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export const ALL:APIRoute=async({request,params,cookies,url})=>{
  const action=params.action||'',method=request.method,token=cookies.get('alejoias_admin')?.value;
  try{
    if(method==='GET'&&action==='auth-config')return json(await store.authConfig());
    if(method==='GET'&&action==='catalog')return json(await store.publicProducts());
    if(!['GET','POST'].includes(method))return json({error:'Método inválido'},405);
    let data:any={};
    if(method==='POST'&&action!=='upload'){
      if(Number(request.headers.get('content-length'))>1500000)throw Error('Conteúdo muito grande.');
      const body=await request.text();if(body.length>1500000)throw Error('Conteúdo muito grande.');
      data=JSON.parse(body||'{}');
    }
    if(method==='POST'&&request.headers.get('origin')!==url.origin)return json({error:'Origem inválida'},403);
    const admin=await store.authorized(token);
    if(!['login','request','request-pdf'].includes(action)&&!admin)return json({error:'Entre no painel.'},401);
    if(method==='GET'){
      if(action==='products')return json(await store.listProducts(true));
      if(action==='history')return json(await store.productHistory(url.searchParams.get('id')||''));
      if(action==='requests')return json(await store.requests());
      if(action==='export')return new Response(JSON.stringify(await store.listProducts(true),null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="catalogo-backup.json"','Cache-Control':'no-store'}});
      return json({error:'Não encontrado'},404);
    }
    if(action==='upload'){
      if(Number(request.headers.get('content-length'))>400000)throw Error('A foto otimizada deve ter até 300 KB.');
      const form=await request.formData(),file=form.get('image');
      if(!(file instanceof File)||file.size>300000||file.size<12)throw Error('A foto otimizada deve ter até 300 KB.');
      const bytes=new Uint8Array(await file.arrayBuffer());
      const ext=bytes[0]===255&&bytes[1]===216?'jpg':null;
      if(!ext)throw Error('Envie a foto pelo seletor do painel para otimizar a imagem.');
      const name=store.randomUUID()+'.jpg';
      await env.DB.prepare('INSERT INTO media(name,content,mime,size) VALUES(?,?,?,?)').bind(name,bytes.buffer,'image/jpeg',bytes.length).run();
      return json({image:'/media/'+name});
    }
    if(action==='login'){
      await store.rateLimit('login',15,15*60000);const session=await store.login(data.password);
      cookies.set('alejoias_admin',session,{path:'/',httpOnly:true,sameSite:'strict',secure:url.protocol==='https:',maxAge:8*3600});return json({ok:true});
    }
    if(action==='request'){await store.rateLimit('requests',100,60000);return json(await store.createRequest(data,url.origin));}
    if(action==='request-pdf'){
      await store.rateLimit('request-pdf',60,60000);
      const order=await store.requestForPdf(data.id,data.token,admin);
      if(!order)return json({error:'Solicitação não disponível.'},404);
      // Documento montado no navegador para não consumir CPU do Worker gratuito.
      return json({format:'alejoias-pdf-snapshot-v1',order});
    }
    if(action==='logout'){await store.logout(token!);cookies.delete('alejoias_admin',{path:'/'});return json({ok:true});}
    if(action==='password'){await store.changePassword(data.current,data.password);cookies.delete('alejoias_admin',{path:'/'});return json({ok:true});}
    if(action==='products')return json(await store.saveProduct(data));
    if(action==='import-preview'){const p=await previewImport(data);return json({summary:p.summary,token:p.token});}
    if(action==='import-apply')return json(await commitImport(data));
    if(action==='request-status'){await store.requestStatus(data.id,data.status);return json({ok:true});}
    return json({error:'Não encontrado'},404);
  }catch(error){
    const message=error instanceof SyntaxError?'Formato inválido.':(error as Error).message;
    const safe=/D1_|SQLITE|constraint/i.test(message)?'Não foi possível salvar. Confira os dados ou tente novamente.':message;
    return json({error:safe},400);
  }
};

import {defineMiddleware} from 'astro:middleware';
import {authorized} from './server/view-store';
export const onRequest=defineMiddleware(async(context,next)=>{
 if(context.url.hostname==='www.alejoias.com'&&['GET','HEAD'].includes(context.request.method)){const canonical=new URL(context.url);canonical.hostname='alejoias.com';canonical.protocol='https:';canonical.port='';return context.redirect(canonical.href,308);}
 if(context.url.pathname.startsWith('/admin')&&context.url.pathname!=='/admin/login'&&context.url.pathname!=='/admin/login/'&&!(await authorized(context.cookies.get('alejoias_admin')?.value)))return context.redirect('/admin/login');
 const response=await next();response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Referrer-Policy',context.url.pathname.startsWith('/pedido/pdf')?'no-referrer':'same-origin');response.headers.set('X-Frame-Options','DENY');
 if(context.url.pathname.startsWith('/admin')||context.url.pathname.startsWith('/api'))response.headers.set('Cache-Control','no-store');return response;
});

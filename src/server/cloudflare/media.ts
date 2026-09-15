import {env} from 'cloudflare:workers';
import type {APIRoute} from 'astro';
export const GET:APIRoute=async({params})=>{
  const name=params.file||'';
  if(!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name))return new Response('Não encontrado',{status:404});
  const row=await env.DB.prepare('SELECT content,mime FROM media WHERE name=?').bind(name).first<{content:ArrayBuffer;mime:string}>();
  return row?new Response(new Uint8Array(row.content),{headers:{'Content-Type':row.mime,'X-Content-Type-Options':'nosniff','Cache-Control':'public,max-age=31536000,immutable'}}):new Response('Não encontrado',{status:404});
};

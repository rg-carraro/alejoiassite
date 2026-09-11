import type {APIRoute} from 'astro';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {dataDir} from '../../server/store';
export const GET:APIRoute=({params})=>{const file=params.file||'';if(!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(file))return new Response('Não encontrado',{status:404});try{const bytes=readFileSync(resolve(dataDir,'uploads',file));return new Response(new Uint8Array(bytes),{headers:{'Content-Type':file.endsWith('.jpg')?'image/jpeg':file.endsWith('.png')?'image/png':'image/webp','X-Content-Type-Options':'nosniff','Cache-Control':'public,max-age=31536000,immutable'}});}catch{return new Response('Não encontrado',{status:404});}};

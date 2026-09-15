import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import {fileURLToPath} from 'node:url';
const cloud = process.env.ALEJOIAS_TARGET === 'cloudflare';
const cloudflare = cloud ? (await import('@astrojs/cloudflare')).default : null;
const target = name => fileURLToPath(new URL('./src/server/cloudflare/' + name + '.ts', import.meta.url));
// Node/SQLite publicado pelo Tunnel; Workers exigiria outro adapter/storage.
export default defineConfig({
  site: 'https://alejoias.com',
  output: 'server',
  adapter: cloud ? cloudflare({imageService: 'passthrough'}) : node({mode: 'standalone'}),
  outDir: cloud ? './dist-cloudflare' : './dist',
  ...(cloud ? {session: false} : {}),
  vite: cloud ? {resolve: {alias: [
    {find: /^.*\/server\/view-store$/, replacement: target('store')},
    {find: /^.*\/server\/node-api$/, replacement: target('api')},
    {find: /^.*\/server\/node-media$/, replacement: target('media')},
  ]}} : {},
  // Reconhece HTTPS encaminhado pelo proxy sem liberar hosts arbitrários.
  security: {allowedDomains: [{hostname: 'alejoias.com'}]},
  devToolbar: {enabled: false},
});

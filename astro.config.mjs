import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
// Servidor local com SQLite. Deploy Cloudflare requer adapter/storage próprios.
export default defineConfig({site:'https://alejoias.com',output:'server',adapter:node({mode:'standalone'}),devToolbar:{enabled:false}});

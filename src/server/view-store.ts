import * as local from './store';
// Contrato assíncrono usado pelas páginas em ambos os ambientes.
export async function listProducts(all=false){return local.listProducts(all);}
export async function authorized(token?:string){return local.authorized(token);}

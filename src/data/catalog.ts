export interface CatalogProduct {
 id:string; slug:string; name:string; category:string; image:string; alt:string;
 description:string; collections:string[]; variants:string[]; tags:string[];
 priceInCents:number; promoPriceInCents:number|null; promoStart:string; promoEnd:string;
 enabled:boolean; available:boolean; demo:boolean; revision:number; createdAt:string; updatedAt:string;
}
export const formatPrice=(cents:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
export function effectivePrice(p:CatalogProduct,now=new Date().toISOString()){
 return p.promoPriceInCents!==null&&(!p.promoStart||now>=p.promoStart)&&(!p.promoEnd||now<p.promoEnd)?p.promoPriceInCents:p.priceInCents;
}

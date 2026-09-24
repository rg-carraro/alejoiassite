// O catálogo é mantido no banco pelo painel. Instalações novas começam vazias.
export const products: { id: string }[] = [];
export const whatsapp = '5519988038395';

export const formatPrice = (cents:number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);


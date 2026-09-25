import {PDFDocument,StandardFonts,rgb, type PDFFont, type PDFPage} from 'pdf-lib';
import type {PdfSelection} from '../server/order-pdf';
const clean=(value:string)=>value.normalize('NFC').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[^\x20-\x7e\xa0-\xff\n]/g,'');
const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
export async function selectionPdf(order:PdfSelection):Promise<Blob>{
  const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica),bold=await doc.embedFont(StandardFonts.HelveticaBold);
  doc.setTitle('Ale Carraro - seleção de produtos');doc.setAuthor('Ale Carraro');
  let page:PDFPage,y=0;
  function lines(value:string,width:number,size:number,f:PDFFont=font){
    const result:string[]=[];
    for(const paragraph of clean(value).split('\n')){
      let line='';
      for(const word of paragraph.split(' ')){
        if(f.widthOfTextAtSize(line+(line?' ':'')+word,size)<=width){line+=(line?' ':'')+word;continue;}
        if(line){result.push(line);line='';}
        for(const character of word){if(f.widthOfTextAtSize(line+character,size)>width){result.push(line);line='';}line+=character;}
      }
      result.push(line);
    }
    return result;
  }
  function text(value:string,x:number,top:number,width:number,size=10,f:PDFFont=font){
    const wrapped=lines(value,width,size,f);
    wrapped.forEach((line,i)=>page.drawText(line,{x,y:842-top-size-i*(size+3),font:f,size,color:rgb(.19,.17,.16)}));
    return top+wrapped.length*(size+3);
  }
  function header(){page=doc.addPage([595,842]);text('Ale Carraro',40,36,515,25,bold);text('SELEÇÃO DE PRODUTOS',40,73,515);text('Solicitação: '+order.id,40,96,515,8);y=130;}
  function table(){page.drawRectangle({x:40,y:842-y-26,width:515,height:26,color:rgb(.95,.93,.91)});text('Foto',50,y+7,74,10,bold);text('Produto',144,y+7,267,10,bold);text('Valor',430,y+7,115,10,bold);y+=26;}
  header();y=text('Cliente: '+order.name,40,y,515,11,bold)+6;y=text('Telefone: '+order.phone,40,y,515)+6;
  y=text('Registrado em '+new Date(order.createdAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}),40,y,515,9)+18;table();
  const photos=new Map<string,Awaited<ReturnType<typeof doc.embedJpg>>|null>();
  for(const item of order.items){
    const variant=item.variant&&item.variant!=='Única'&&!item.variant.toLowerCase().includes('a confirmar')?'\nOpção: '+item.variant:'';
    const detail=item.name+'\nCódigo: '+item.id+variant+'\nQuantidade: '+item.quantity;
    const height=Math.max(108,lines(detail,267,10).length*13+28);
    if(y+height>742){header();table();}
    page!.drawRectangle({x:40,y:842-y-height,width:515,height,borderWidth:.5,borderColor:rgb(.87,.84,.8)});
    for(const x of [134,420])page!.drawLine({start:{x,y:842-y},end:{x,y:842-y-height},thickness:.5,color:rgb(.87,.84,.8)});
    if(item.image&&!photos.has(item.image)){
      try{
        if(!/^\/(images|media)\/[a-zA-Z0-9/_.-]+$/.test(item.image)||item.image.includes('..'))throw Error('Imagem inválida');
        const response=await fetch(item.image,{cache:'force-cache'});if(!response.ok)throw Error('Imagem ausente');
        const bitmap=await createImageBitmap(await response.blob());
        try{
          const scale=Math.min(1,360/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
          canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
          const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
          photos.set(item.image,await doc.embedJpg(canvas.toDataURL('image/jpeg',.85)));
        }finally{bitmap.close();}
      }catch{photos.set(item.image,null);}
    }
    const photo=item.image?photos.get(item.image):null;
    if(photo){const size=photo.scaleToFit(74,80);page!.drawImage(photo,{x:50+(74-size.width)/2,y:842-y-12-size.height,width:size.width,height:size.height});}
    else text('Foto não\ndisponível',50,y+36,74,9);
    text(detail,144,y+12,267);text(money(item.priceInCents*item.quantity),430,y+12,115,11,bold);
    if(item.quantity>1)text(money(item.priceInCents)+' / un.',430,y+38,115,8);
    y+=height;
  }
  const note=order.note?'Observação: '+order.note:'';
  if(y+80+lines(note,515,10).length*13>752)header();
  y=text('Subtotal: '+money(order.subtotalInCents),40,y+20,515,15,bold)+8;
  y=text('Entrega a combinar no atendimento.',40,y,515,9)+14;if(note)text(note,40,y,515);
  const pages=doc.getPages();pages.forEach((p,i)=>{page=p;text('Ale Carraro | (19) 98803-8395',40,780,400,8);text((i+1)+' / '+pages.length,510,780,45,8);});
  return new Blob([new Uint8Array(await doc.save())],{type:'application/pdf'});
}

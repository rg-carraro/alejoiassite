import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { dataDir } from './store';

export type PdfSelection = {
 id:string; name:string; phone:string; note:string; createdAt:string; subtotalInCents:number;
 items:{id:string;name:string;variant:string;quantity:number;priceInCents:number;image?:string}[];
};
const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value/100);
// Built-in PDF fonts cover Portuguese. Normalize punctuation and unsupported pictograms.
const clean=(s:string)=>s.normalize('NFC').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[^\x20-\x7e\xa0-\xff\n]/g,'');
async function photo(url?:string){
 if(!url)return null;
 const root=url.startsWith('/images/')?resolve('public/images'):url.startsWith('/media/')?resolve(dataDir,'uploads'):null;
 if(!root)return null;
 const path=resolve(root,url.slice(url.indexOf('/',1)+1));
 if(!path.startsWith(root+sep))return null;
 try {
  const input=await readFile(path);
  if(input.length>5_000_000)return null;
  return await sharp(input,{limitInputPixels:40_000_000}).rotate().resize(360,360,{fit:'inside',withoutEnlargement:true}).flatten({background:'#ffffff'}).jpeg({quality:85}).toBuffer();
 }catch{return null;}
}
export async function selectionPdf(order:PdfSelection):Promise<Buffer>{
 const photos: (Buffer|null)[]=[];
 for(const item of order.items)photos.push(await photo(item.image));
 const doc=new PDFDocument({size:'A4',margin:40,bufferPages:true,info:{Title:'AleJoias - seleção de produtos',Author:'AleJoias'}});
 const chunks:Buffer[]=[];
 const complete=new Promise<Buffer>((done,fail)=>{doc.on('data',chunk=>chunks.push(chunk));doc.on('end',()=>done(Buffer.concat(chunks)));doc.on('error',fail);});
 const left=40,width=515;
 const text=(value:string,x:number,y:number,w:number,size=10,bold=false)=>{
  doc.font(bold?'Helvetica-Bold':'Helvetica').fontSize(size).fillColor('#302b28').text(clean(value),x,y,{width:w,lineGap:3});
  return doc.y;
 };
 function header(){
  text('AleJoias',left,36,width,25,true);
  text('SELEÇÃO DE PRODUTOS',left,72,width,10);
  text('Solicitação: '+order.id,left,94,width,8);
  doc.moveTo(left,114).lineTo(left+width,114).strokeColor('#c4a574').stroke();
  return 130;
 }
 function table(y:number){
  doc.rect(left,y,width,26).fill('#f2eee7');
  text('Foto',50,y+8,78,10,true);text('Produto',144,y+8,265,10,true);text('Valor',430,y+8,115,10,true);
  return y+26;
 }
 let y=header();
 y=text('Cliente: '+order.name,left,y,width,11,true)+6;
 y=text('Telefone: '+order.phone,left,y,width)+6;
 y=text('Registrado em '+new Date(order.createdAt).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'}),left,y,width,9)+18;
 y=table(y);
 for(let index=0;index<order.items.length;index++){
  const item=order.items[index];
  const variant=item.variant&&item.variant!=='Única'&&!item.variant.toLowerCase().includes('a confirmar')?'\nOpção: '+item.variant:'';
  const detail=clean(item.name+'\nCódigo: '+item.id+variant+'\nQuantidade: '+item.quantity);
  doc.font('Helvetica').fontSize(10);
  const height=Math.max(108,doc.heightOfString(detail,{width:267,lineGap:3})+28);
  if(y+height>742){doc.addPage();y=table(header());}
  doc.rect(left,y,width,height).lineWidth(.5).strokeColor('#ddd5cb').stroke();
  doc.moveTo(134,y).lineTo(134,y+height).stroke();doc.moveTo(420,y).lineTo(420,y+height).stroke();
  if(photos[index])doc.image(photos[index]!,50,y+12,{fit:[74,80],align:'center',valign:'center'});
  else text('Foto não\ndisponível',50,y+36,74,9);
  text(detail,144,y+12,267);
  text(money(item.priceInCents*item.quantity),430,y+12,115,11,true);
  if(item.quantity>1)text(money(item.priceInCents)+' / un.',430,y+36,115,8);
  y+=height;
 }
 doc.font('Helvetica').fontSize(10);
 const noteHeight=order.note?doc.heightOfString(clean('Observação: '+order.note),{width,lineGap:3})+20:0;
 if(y+80+noteHeight>752){doc.addPage();y=header();}
 y=text('Subtotal: '+money(order.subtotalInCents),left,y+20,width,15,true)+8;
 y=text('Entrega a combinar no atendimento.',left,y,width,9)+14;
 if(order.note)text('Observação: '+order.note,left,y,width);
 const pages=doc.bufferedPageRange();
 for(let i=0;i<pages.count;i++){doc.switchToPage(i);text('AleJoias  |  (19) 98803-8395',40,780,400,8);text((i+1)+' / '+pages.count,510,780,45,8);}
 doc.end();
 return complete;
}

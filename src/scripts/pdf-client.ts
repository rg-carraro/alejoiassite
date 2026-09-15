export async function pdfBlob(response:Response):Promise<Blob>{
  if(!response.ok)throw Error('Não foi possível gerar o PDF. Confira o link ou tente novamente.');
  if(response.headers.get('content-type')?.includes('application/pdf'))return response.blob();
  const data=await response.json();
  if(data.format!=='alejoias-pdf-snapshot-v1')throw Error('Resposta do documento inválida.');
  const {selectionPdf}=await import('./pdf-render');
  return selectionPdf(data.order);
}

export async function optimizePhoto(file:File):Promise<File>{
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5000000)throw Error('Selecione JPEG, PNG ou WebP de até 5 MB.');
  const bitmap=await createImageBitmap(file);
  try{
    const scale=Math.min(1,1000/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
    for(const quality of [.85,.7,.5,.3]){
      const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
      if(blob&&blob.size<=300000)return new File([blob],'foto.jpg',{type:'image/jpeg'});
    }
    throw Error('Foto muito grande. Escolha uma imagem menor.');
  }finally{bitmap.close();}
}

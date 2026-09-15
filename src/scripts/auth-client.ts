const hex=(bytes:Uint8Array)=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function derive(password:string,salt:string){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:600000,hash:'SHA-256'},key,256)));
}
export async function authPayload(values:Record<string,unknown>){
  const response=await fetch('/api/auth-config',{cache:'no-store'});if(!response.ok)throw Error('Não foi possível iniciar o acesso.');
  const config=await response.json();if(config.mode==='password')return values;
  if(config.mode!=='pbkdf2-client-v1'||!/^[a-f0-9]{64}$/.test(config.salt))throw Error('Acesso ainda não configurado.');
  if('current' in values){
    const next=String(values.password||'');if(next.length<12||next.length>200)throw Error('Use uma senha de 12 a 200 caracteres.');
    const salt=hex(crypto.getRandomValues(new Uint8Array(32)));
    return {current:await derive(String(values.current||''),config.salt),password:{salt,proof:await derive(next,salt)}};
  }
  return {password:await derive(String(values.password||''),config.salt)};
}

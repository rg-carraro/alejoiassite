import {DatabaseSync} from 'node:sqlite';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {randomBytes,pbkdf2Sync,createHash} from 'node:crypto';
import sharp from 'sharp';

// Somente preparação local. Nunca executa importação remota nem imprime dados pessoais.
const source=process.argv[2];if(!source)throw Error('Informe a pasta .data de origem.');
const destination=resolve('.data','cloudflare-migration-'+Date.now());mkdirSync(destination,{recursive:true});
const db=new DatabaseSync(resolve(source,'alejoias-site.sqlite'),{readOnly:true});
const sql=["INSERT INTO guards VALUES(1, CASE WHEN (SELECT COUNT(*) FROM products)+(SELECT COUNT(*) FROM requests)+(SELECT COUNT(*) FROM media)+(SELECT COUNT(*) FROM settings WHERE key='admin')=0 THEN 1 ELSE 0 END);"];
const quote=value=>value===null?'NULL':typeof value==='number'?String(value):"'"+String(value).replaceAll("'","''")+"'";
const counts={};
db.exec('BEGIN');
try{
  for(const table of ['products','history','requests','request_history']){
    const rows=db.prepare('SELECT * FROM '+table).all();counts[table]=rows.length;
    for(const row of rows){
      const statement=`INSERT INTO ${table}(${Object.keys(row).join(',')}) VALUES(${Object.values(row).map(quote).join(',')});`;
      if(Buffer.byteLength(statement)>95000)throw Error('Registro excede o limite de importação SQL: '+table);
      sql.push(statement);
    }
  }
}finally{db.exec('ROLLBACK');db.close();}
const password=randomBytes(24).toString('base64url'),salt=randomBytes(32).toString('hex');
const proof=pbkdf2Sync(password,salt,600000,32,'sha256').toString('hex');
const credential=JSON.stringify({algorithm:'pbkdf2-client-v1',salt,hash:createHash('sha256').update(proof).digest('hex')});
sql.push(`INSERT INTO settings VALUES('admin',${quote(credential)});`);
let imageBytes=0,imageCount=0;
const uploads=resolve(source,'uploads');
if(existsSync(uploads))for(const name of readdirSync(uploads)){
  if(!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name))continue;
  const original=readFileSync(join(uploads,name));let bytes;
  for(const quality of [85,70,50,30]){
    bytes=await sharp(original,{limitInputPixels:40000000}).rotate().resize(1000,1000,{fit:'inside',withoutEnlargement:true}).flatten({background:'#ffffff'}).jpeg({quality}).toBuffer();
    if(bytes.length<=300000)break;
  }
  if(bytes.length>300000)throw Error('Uma foto excede 300 KB após otimização. Revise a pasta de origem.');
  imageBytes+=bytes.length;imageCount++;
  if(imageBytes>100000000)throw Error('Fotos excedem a capacidade inicial de 100 MB.');
  const first=bytes.subarray(0,32000);
  sql.push(`INSERT INTO media VALUES(${quote(name)},X'${first.toString('hex')}','image/jpeg',${bytes.length});`);
  for(let i=32000;i<bytes.length;i+=32000)sql.push(`UPDATE media SET content=CAST(content||X'${bytes.subarray(i,i+32000).toString('hex')}' AS BLOB) WHERE name=${quote(name)};`);
}
sql.push('DELETE FROM guards;');
writeFileSync(join(destination,'import.sql'),sql.join('\n'),{mode:0o600});
writeFileSync(join(destination,'acesso-admin.txt'),'Senha inicial: '+password+'\nTroque após entrar no painel da nuvem.\n',{mode:0o600});
writeFileSync(join(destination,'summary.json'),JSON.stringify({...counts,imageCount,imageBytes,createdAt:new Date().toISOString()},null,2));
console.log('Preparação local concluída: '+destination);
console.log(JSON.stringify({...counts,imageCount,imageBytes}));

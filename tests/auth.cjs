const {pbkdf2Sync}=require('node:crypto');
exports.loginPayload=async(base,data)=>{
  const response=await fetch(base+'/api/auth-config');const config=await response.json();
  return config.mode==='password'?data:{password:pbkdf2Sync(data.password,config.salt,600000,32,'sha256').toString('hex')};
};

import Aes from 'react-native-aes-crypto';
import {encryptProtectedBackup, decryptProtectedBackup, validBackupPassword} from '../protectedBackupCipher';
jest.mock('react-native-aes-crypto',()=>{
  const c=require('node:crypto');return {
    randomKey:jest.fn(async(n:number)=>c.randomBytes(n).toString('hex')),
    pbkdf2:jest.fn(async(p:string,s:string,n:number,b:number)=>c.pbkdf2Sync(p,s,n,b/8,'sha256').toString('hex')),
    hmac256:jest.fn(async(t:string,k:string)=>c.createHmac('sha256',Buffer.from(k,'hex')).update(t).digest('hex')),
    encrypt:jest.fn(async(t:string,k:string,iv:string)=>{const a=c.createCipheriv('aes-256-cbc',Buffer.from(k,'hex'),Buffer.from(iv,'hex'));return Buffer.concat([a.update(t,'utf8'),a.final()]).toString('base64');}),
    decrypt:jest.fn(async(t:string,k:string,iv:string)=>{const a=c.createDecipheriv('aes-256-cbc',Buffer.from(k,'hex'),Buffer.from(iv,'hex'));return Buffer.concat([a.update(t,'base64'),a.final()]).toString('utf8');}),
  };
});
const password='فاطمہ کی محفوظ عبارت 123', text='{"children":["عائشہ"]}';
beforeEach(()=>jest.clearAllMocks());
test('passphrase-only exports use independent salts and IVs; raw and quoted bytes interoperate',async()=>{
 const a=await encryptProtectedBackup(text,password),b=await encryptProtectedBackup(text,password);
 expect(a).not.toBe(b);expect(JSON.parse(a).salt).not.toBe(JSON.parse(b).salt);
 expect(await decryptProtectedBackup(a,password)).toBe(text);expect(await decryptProtectedBackup(JSON.stringify(b),password)).toBe(text);
 expect(Aes.pbkdf2).toHaveBeenCalledWith(password,expect.any(String),600000,256,'sha256');
});
test('a wrong passphrase cannot decrypt or authenticate a backup',async()=>{
 const a=await encryptProtectedBackup(text,password);jest.mocked(Aes.decrypt).mockClear();await expect(decryptProtectedBackup(a,'another secret phrase')).rejects.toThrow('Incorrect passphrase');expect(Aes.decrypt).not.toHaveBeenCalled();
});
test.each(['salt','iv','cipher','mac'])('tampered %s fails before decryption',async(field)=>{
 const e=JSON.parse(await encryptProtectedBackup(text,password));e[field]=(e[field][0]==='a'?'b':'a')+e[field].slice(1);jest.mocked(Aes.decrypt).mockClear();await expect(decryptProtectedBackup(JSON.stringify(e),password)).rejects.toThrow();expect(Aes.decrypt).not.toHaveBeenCalled();
});
test.each([{iterations:1},{iterations:2147483647},{kdf:'sha1'},{version:4}])('rejects attacker-selected work before key derivation: %j',async(change)=>{
 const e={...JSON.parse(await encryptProtectedBackup(text,password)),...change};jest.mocked(Aes.pbkdf2).mockClear();await expect(decryptProtectedBackup(JSON.stringify(e),password)).rejects.toThrow('Unsupported');expect(Aes.pbkdf2).not.toHaveBeenCalled();
});
test('weak or oversized passphrases are rejected',()=>{expect(validBackupPassword('short')).toBe(false);expect(validBackupPassword(' '.repeat(20))).toBe(false);expect(validBackupPassword('x'.repeat(1025))).toBe(false);expect(validBackupPassword(password)).toBe(true);});
test('Unicode-equivalent passphrases work across keyboard normalisation',async()=>{
 const encrypted=await encryptProtectedBackup(text,'cafe\u0301 is a long phrase');
 await expect(decryptProtectedBackup(encrypted,'café is a long phrase')).resolves.toBe(text);
});

import Aes from 'react-native-aes-crypto';
import {normaliseBackupCiphertext} from './backupFormat';
const FORMAT = 'bebbo-backup';
const ITERATIONS = 600000;
export const MAX_BACKUP_TEXT = 32 * 1024 * 1024;
export function backupUtf8Bytes(text: string): number {
  let bytes = 0;
  for(let i=0;i<text.length;i++) {
    const c=text.charCodeAt(i);
    if(c<128) bytes++; else if(c<2048) bytes+=2;
    else if(c>=0xd800&&c<=0xdbff&&text.charCodeAt(i+1)>=0xdc00&&text.charCodeAt(i+1)<=0xdfff) {bytes+=4;i++;}
    else bytes+=3;
  }
  return bytes;
}
const hex = (value: unknown, length: number): value is string => typeof value === 'string' && new RegExp(`^[a-f0-9]{${length}}$`, 'i').test(value);
export function validBackupPassword(value: string): boolean {
  return validBackupUnlockPassword(value) && Array.from(value.normalize('NFC')).length >= 12;
}
// Opening an existing file must not apply a newer creation-strength policy.
// Early v3 writers counted combining characters before normalisation.
export function validBackupUnlockPassword(value: string): boolean {
  return value.length > 0 && value.length <= 1024 && !/^[\s\u0000]*$/.test(value);
}
export function isProtectedBackup(input: string): boolean {
  const text = normaliseBackupCiphertext(input);
  if (!text.startsWith('{')) return false;
  return JSON.parse(text).version === 3;
}
async function keys(password: string, salt: string) {
  if (!validBackupUnlockPassword(password)) throw new Error('Invalid backup passphrase');
  const key = await Aes.pbkdf2(password.normalize('NFC'), salt, ITERATIONS, 256, 'sha256');
  if (!hex(key, 64)) throw new Error('Backup key derivation failed');
  return {key, authentication: await Aes.hmac256('bebbo-backup:3:authentication-key', key)};
}
const signedText = (salt: string, iv: string, cipher: string) =>
  `bebbo-backup:3:pbkdf2-sha256:${ITERATIONS}:${salt}:${iv}:${cipher}`;
export async function encryptProtectedBackup(text: string, password: string): Promise<string> {
  if (!validBackupPassword(password)) throw new Error('A backup passphrase must contain at least 12 characters');
  if (backupUtf8Bytes(text) > MAX_BACKUP_TEXT) throw new Error('Backup exceeds the supported size');
  const salt = await Aes.randomKey(32), iv = await Aes.randomKey(16);
  if (!hex(salt, 64) || !hex(iv, 32)) throw new Error('Backup random generation failed');
  const {key, authentication} = await keys(password, salt);
  const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
  const mac = await Aes.hmac256(signedText(salt, iv, cipher), authentication);
  return JSON.stringify({format: FORMAT, version: 3, kdf: 'pbkdf2-sha256', iterations: ITERATIONS, salt, iv, cipher, mac});
}
export async function decryptProtectedBackup(input: string, password: string): Promise<string> {
  if (input.length > MAX_BACKUP_TEXT * 2) throw new Error('Backup exceeds the supported size');
  const e = JSON.parse(normaliseBackupCiphertext(input));
  // Do not run attacker-selected work factors or algorithms before authentication.
  if (e.format !== FORMAT || e.version !== 3 || e.kdf !== 'pbkdf2-sha256' || e.iterations !== ITERATIONS ||
    !hex(e.salt, 64) || !hex(e.iv, 32) || !hex(e.mac, 64) ||
    typeof e.cipher !== 'string' || e.cipher.length > Math.ceil((MAX_BACKUP_TEXT+16)/3)*4 || e.cipher.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(e.cipher)) throw new Error('Unsupported or damaged backup');
  const {key, authentication} = await keys(password, e.salt);
  const expected = await Aes.hmac256(signedText(e.salt, e.iv, e.cipher), authentication);
  let difference = expected.length ^ e.mac.length;
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ e.mac.charCodeAt(i);
  if (difference) throw new Error('Incorrect passphrase or damaged backup');
  const text = await Aes.decrypt(e.cipher, key, e.iv, 'aes-256-cbc');
  if (backupUtf8Bytes(text) > MAX_BACKUP_TEXT) throw new Error('Backup exceeds the supported size');
  return text;
}

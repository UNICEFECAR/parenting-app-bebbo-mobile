import Aes from 'react-native-aes-crypto';
import {normaliseBackupCiphertext} from './backupFormat';
const context = 'bebbo-backup:2';
async function authenticationKey(key: string): Promise<string> {
  // Domain separation: do not use the AES key directly as the HMAC key.
  return Aes.hmac256(`${context}:authentication-key`, key);
}
export async function encryptBackup(text: string, key: string): Promise<string> {
  const iv = await Aes.randomKey(16);
  if (!/^[a-f0-9]{32}$/i.test(iv)) throw new Error('Backup random IV generation failed');
  const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
  const mac = await Aes.hmac256(`${context}:${iv}:${cipher}`, await authenticationKey(key));
  return JSON.stringify({format: 'bebbo-backup', version: 2, iv, cipher, mac});
}
export async function decryptBackup(input: string, key: string, legacyIV: string): Promise<string> {
  const text = normaliseBackupCiphertext(input);
  if (!text.startsWith('{')) return Aes.decrypt(text, key, legacyIV, 'aes-256-cbc');
  const envelope = JSON.parse(text);
  if (envelope.format !== 'bebbo-backup' || envelope.version !== 2 ||
    typeof envelope.iv !== 'string' || !/^[a-f0-9]{32}$/i.test(envelope.iv) ||
    typeof envelope.cipher !== 'string' || !envelope.cipher ||
    typeof envelope.mac !== 'string' || !/^[a-f0-9]{64}$/i.test(envelope.mac))
    throw new Error('Unsupported or damaged backup');
  const expected = await Aes.hmac256(`${context}:${envelope.iv}:${envelope.cipher}`, await authenticationKey(key));
  let difference = expected.length ^ envelope.mac.length;
  for (let index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ envelope.mac.charCodeAt(index);
  if (difference) throw new Error('Backup authentication failed');
  return Aes.decrypt(envelope.cipher, key, envelope.iv, 'aes-256-cbc');
}

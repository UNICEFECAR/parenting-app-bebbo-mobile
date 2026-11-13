import Aes from 'react-native-aes-crypto';
import {encryptBackup, decryptBackup} from '../backupCipher';
jest.mock('react-native-aes-crypto', () => {
  const crypto = require('node:crypto');
  return {
    randomKey: jest.fn(async (length: number) => crypto.randomBytes(length).toString('hex')),
    encrypt: jest.fn(async (text: string, key: string, iv: string) => {
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
      return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('base64');
    }),
    decrypt: jest.fn(async (text: string, key: string, iv: string) => {
      const cipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
      return Buffer.concat([cipher.update(text, 'base64'), cipher.final()]).toString('utf8');
    }),
    hmac256: jest.fn(async (text: string, key: string) => crypto.createHmac('sha256', Buffer.from(key, 'hex')).update(text).digest('hex')),
  };
});
const key = 'ab'.repeat(32), iv = 'cd'.repeat(16);
const contents = JSON.stringify([{uuid: 'child', childName: 'فاطِمة عائشہ', birthDate: '2024-01-01'}]);
beforeEach(() => jest.clearAllMocks());
test('fresh IVs produce different authenticated exports and both platforms can read raw or quoted files', async () => {
  const first = await encryptBackup(contents, key), second = await encryptBackup(contents, key);
  expect(first).not.toBe(second);
  expect(JSON.parse(first).iv).not.toBe(JSON.parse(second).iv);
  await expect(decryptBackup(first, key, iv)).resolves.toBe(contents);
  await expect(decryptBackup(JSON.stringify(second), key, iv)).resolves.toBe(contents);
});
test.each(['iv', 'cipher', 'mac'])('rejects tampered %s before invoking AES decryption', async field => {
  const envelope = JSON.parse(await encryptBackup(contents, key));
  envelope[field] = (envelope[field][0] === 'a' ? 'b' : 'a') + envelope[field].slice(1);
  await expect(decryptBackup(JSON.stringify(envelope), key, iv)).rejects.toThrow('authentication failed');
  expect(Aes.decrypt).not.toHaveBeenCalled();
});
test('rejects wrong keys, unsupported versions and truncated envelopes', async () => {
  const encrypted = await encryptBackup(contents, key);
  await expect(decryptBackup(encrypted, 'ef'.repeat(32), iv)).rejects.toThrow('authentication failed');
  await expect(decryptBackup(encrypted.replace('"version":2', '"version":3'), key, iv)).rejects.toThrow('Unsupported');
  await expect(decryptBackup(encrypted.slice(0, -8), key, iv)).rejects.toThrow();
});
test('retains raw and Android JSON-quoted legacy fixed-IV backups', async () => {
  const legacy = await Aes.encrypt(contents, key, iv, 'aes-256-cbc');
  await expect(decryptBackup(legacy, key, iv)).resolves.toBe(contents);
  await expect(decryptBackup(JSON.stringify(legacy), key, iv)).resolves.toBe(contents);
});

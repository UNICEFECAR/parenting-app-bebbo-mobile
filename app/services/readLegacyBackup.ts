import {decryptBackup} from './backupCipher';
import {parseBackupChildren} from './backupFormat';

// Legacy files have no key identifier. Try the installed build's settings first,
// followed by historical key/IV pairs supplied by the release configuration.
export async function readLegacyBackup(text: string, key: string, iv: string, historical?: string): Promise<any[]> {
  const pairs = [[key, iv]];
  for (const entry of historical?.split(',') ?? []) {
    const match = /^([a-f0-9]{64}):([a-f0-9]{32})$/i.exec(entry.trim());
    if (match) pairs.push([match[1], match[2]]);
  }
  let parseError: unknown;
  for (const [candidateKey, candidateIV] of pairs) {
    let plaintext: string;
    try {
      plaintext = await decryptBackup(text, candidateKey, candidateIV);
    } catch {
      continue;
    }
    try {
      return parseBackupChildren(plaintext);
    } catch (error) {
      // A different IV with the same key can produce valid padding but bad JSON.
      parseError ??= error;
    }
  }
  throw parseError ?? new Error('Cannot unlock legacy backup');
}

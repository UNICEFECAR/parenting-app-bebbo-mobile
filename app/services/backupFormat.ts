/** Read both historical Android JSON-string exports and raw iOS/Drive bytes. */
export function normaliseBackupCiphertext(input: string): string {
  if (typeof input !== 'string') throw new Error('Backup ciphertext is missing');
  const text = input.replace(/^\uFEFF/, '').trim();
  const cipher = text.startsWith('"') ? JSON.parse(text) : text;
  if (typeof cipher !== 'string' || !cipher.trim()) throw new Error('Backup ciphertext is empty');
  return cipher;
}

export function validateBackupChildren(data: unknown): any[] {
  if (!Array.isArray(data) || !data.length || data.some(child =>
    !child || typeof child !== 'object' || typeof child.uuid !== 'string' || !child.uuid.trim() ||
    !child.birthDate || !Number.isFinite(new Date(child.birthDate).getTime()),
  ) || new Set(data.map(child => child.uuid)).size !== data.length) {
    throw new Error('Backup contains invalid child data');
  }
  return data;
}

export function parseBackupChildren(decrypted: string): any[] {
  // Old exports can contain surrounding control bytes. Escaped JSON text is preserved.
  return validateBackupChildren(JSON.parse(decrypted.replace(/[\x00-\x1F\x7F]/g, '')));
}

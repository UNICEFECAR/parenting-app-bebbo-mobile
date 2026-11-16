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
    !child || typeof child !== 'object' || typeof child.uuid !== 'string' || !/^[A-Za-z0-9_:-]{1,128}$/.test(child.uuid) ||
    !child.birthDate || !Number.isFinite(new Date(child.birthDate).getTime()),
  ) || new Set(data.map(child => child.uuid)).size !== data.length) {
    throw new Error('Backup contains invalid child data');
  }
  for (const child of data) {
    for (const field of ['measures', 'reminders']) {
      const source = child[field];
      if (source == null || source === '') continue;
      const records = typeof source === 'string' ? JSON.parse(source) : source;
      if (!Array.isArray(records) || records.some(record => !record || typeof record !== 'object' || Array.isArray(record)))
        throw new Error('Backup contains invalid nested records');
      const ids = records.filter(record => record.uuid != null).map(record => record.uuid);
      if (ids.some(id => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length)
        throw new Error('Backup contains duplicate nested records');
    }
    for (const field of ['checkedMilestones', 'favoriteadvices', 'favoritegames']) {
      if (child[field] != null && (!Array.isArray(child[field]) || child[field].some((id: unknown) => !Number.isSafeInteger(id))))
        throw new Error('Backup contains invalid saved identifiers');
    }
  }
  return data;
}

export function parseBackupChildren(decrypted: string): any[] {
  // Tolerate historical framing only. Never silently remove bytes from child
  // names, clinical comments or other strings inside the JSON payload.
  return validateBackupChildren(JSON.parse(decrypted.replace(/^[\x00-\x20\x7F]+|[\x00-\x20\x7F]+$/g, '')));
}

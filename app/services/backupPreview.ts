// Navigation receives an opaque handle, not child records or photo bytes.
let serial = 0;
let preview: {id: string; data: unknown; expires: number} | undefined;
export function holdBackupPreview(data: unknown): string {
  const id = 'backup-preview-' + ++serial;
  preview = {id,data,expires:Date.now()+30*60*1000}; return id;
}
export function getBackupPreview(id: string): unknown {
  if(!preview || preview.id!==id || Date.now()>preview.expires) {preview=undefined;throw new Error('Backup preview expired. Select the backup again');}
  return preview.data;
}
export function clearBackupPreviews() {preview=undefined;}

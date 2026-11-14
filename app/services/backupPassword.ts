export type BackupPasswordMode = 'create' | 'unlock';
type Handler = (mode: BackupPasswordMode) => Promise<string | null>;
let handler: Handler | undefined;
export function installBackupPasswordHandler(next: Handler): () => void {
  handler = next;
  return () => {if (handler === next) handler = undefined;};
}
/** Secrets stay in the mounted prompt/operation, never Redux, navigation or disk. */
export function requestBackupPassword(mode: BackupPasswordMode): Promise<string | null> {
  if (!handler) return Promise.reject(new Error('Backup passphrase prompt unavailable'));
  return handler(mode);
}
let busy = false;
const busyListeners = new Set<(value: boolean) => void>();
export function setBackupOperationBusy(value: boolean) {busy = value; busyListeners.forEach(listener=>listener(value));}
export function subscribeBackupBusy(listener: (value: boolean)=>void) {listener(busy);busyListeners.add(listener);return ()=>{busyListeners.delete(listener);};}

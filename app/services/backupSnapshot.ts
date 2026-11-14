import {validateBackupPhoto} from './backupPhoto';
import * as RNFS from '@dr.pogodin/react-native-fs';
import Aes from 'react-native-aes-crypto';
import {DocumentDirectoryPath} from '@dr.pogodin/react-native-fs';
import {validateBackupChildren} from './backupFormat';
import type {BackupContext, BackupPreferences} from './backupRuntime';
export const PHOTO_DIRECTORY = `${DocumentDirectoryPath}/children`;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const preferenceKeys = ['userName', 'userParentalRole', 'userRelationToParent', 'userEnteredChildData', 'currentActiveChildId'] as const;
export type PortableSnapshot = {format: 'bebbo-snapshot'; version: 1; context: BackupContext; children: any[]; settings: Record<string, string>; preferences: BackupPreferences; photos: Record<string, string>};
export function validatePreferences(settings: any, flags: any): void {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings) || Object.entries(settings).some(([k,v]) => !preferenceKeys.includes(k as any) || typeof v !== 'string' || v.length > 4096) ||
    !flags || typeof flags !== 'object' || Object.keys(flags).some(k=>!['growthEnabled','developmentEnabled','vchcEnabled','lowbandWidth'].includes(k)) || (flags.lowbandWidth!==undefined && typeof flags.lowbandWidth!=='boolean') || ['growthEnabled','developmentEnabled','vchcEnabled'].some(k => typeof flags[k] !== 'boolean')) throw new Error('Invalid backup preferences');
}
export function photoPath(uri: string): string {
  const name = uri.replace(/^\//, '');
  if (!/^[A-Za-z0-9_.-]{1,200}$/.test(name) || name === '.' || name === '..') throw new Error('Invalid profile photo reference');
  return `${PHOTO_DIRECTORY}/${name}`;
}
export function validateSnapshot(value: any, current: BackupContext): PortableSnapshot {
  if (!value || value.format !== 'bebbo-snapshot' || value.version !== 1 || !value.context ||
    value.context.flavour !== current.flavour || value.context.country !== current.country || typeof value.context.language !== 'string') throw new Error('Select the same app and country as the backup');
  validateBackupChildren(value.children); validatePreferences(value.settings, value.preferences);
  if (!value.photos || typeof value.photos !== 'object' || Array.isArray(value.photos)) throw new Error('Invalid backup photos');
  const ids = new Set(value.children.map((c: any) => c.uuid));
  let total = 0;
  for (const [id, data] of Object.entries(value.photos)) {
    if (!ids.has(id) || typeof data !== 'string' || !data.length || data.length > Math.ceil(MAX_PHOTO_BYTES / 3) * 4 || data.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) throw new Error('Invalid or oversized backup photo');
    const decodedBytes = data.length / 4 * 3 - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0);
    if (decodedBytes > MAX_PHOTO_BYTES) throw new Error('Invalid or oversized backup photo');
    validateBackupPhoto(data);
    total += data.length;
  }
  if (total > 24*1024*1024) throw new Error('Backup photos exceed the supported size');
  for (const child of value.children) {
    const attached = Object.prototype.hasOwnProperty.call(value.photos, child.uuid);
    if ((child.photoUri && child.photoUri !== 'attached') || Boolean(child.photoUri) !== attached) throw new Error('Backup photo attachment is missing');
  }
  return value;
}
export async function createSnapshot(children: any[], settings: Record<string,string>, preferences: BackupPreferences, context: BackupContext): Promise<PortableSnapshot> {
  const detached = JSON.parse(JSON.stringify(validateBackupChildren(children)));
  const photos: Record<string,string> = Object.create(null);
  let totalPhotoSize = 0;
  for (const child of detached) {
    if (child.photoUri) {
      const path = photoPath(child.photoUri);
      const info = await RNFS.stat(path);
      if (!info.isFile() || !Number.isFinite(Number(info.size)) || Number(info.size) > MAX_PHOTO_BYTES) throw new Error('A profile photo is missing or exceeds 8 MB');
      totalPhotoSize += Math.ceil(Number(info.size)/3)*4;
      if(totalPhotoSize>24*1024*1024) throw new Error('Backup photos exceed the supported size');
      Object.defineProperty(photos, child.uuid, {value: await RNFS.readFile(path, 'base64'), enumerable:true, configurable:true});
      child.photoUri = 'attached';
    }
  }
  return validateSnapshot({format:'bebbo-snapshot',version:1,context,children:detached,settings,preferences,photos},context);
}
/** Stage new names only. Live profile photos are never overwritten during preparation. */
export async function stagePhotos(snapshot: PortableSnapshot): Promise<{children: any[]; paths: string[]}> {
  const children = JSON.parse(JSON.stringify(snapshot.children)), paths: string[] = [];
  try {
    await RNFS.mkdir(PHOTO_DIRECTORY);
    for (const child of children) {
      const data = snapshot.photos[child.uuid];
      if (!Object.prototype.hasOwnProperty.call(snapshot.photos, child.uuid)) {child.photoUri = ''; continue;}
      const random = await Aes.randomKey(16);
      if (!/^[a-f0-9]{32}$/i.test(random)) throw new Error('Photo staging failed');
      child.photoUri = `/restore-photo-${random}.jpg`;
      const path = photoPath(child.photoUri);
      if (await RNFS.exists(path)) throw new Error('Photo staging name collision');
      paths.push(path);
      await RNFS.writeFile(path, data, 'base64');
    }
    return {children,paths};
  } catch (error) {await Promise.all(paths.map(p=>RNFS.unlink(p).catch(()=>{}))); throw error;}
}
export async function cleanupRestorePhotos(children: any[]): Promise<void> {
  if (!(await RNFS.exists(PHOTO_DIRECTORY))) return;
  const retained = new Set(children.map(c=>c.photoUri));
  const files = await RNFS.readDir(PHOTO_DIRECTORY);
  for (const file of files) if (file.isFile() && /^restore-photo-[a-f0-9]{32}\.jpg$/i.test(file.name) && !retained.has('/'+file.name)) await RNFS.unlink(`${PHOTO_DIRECTORY}/${file.name}`);
}

import {userRealmCommon} from '../database/dbquery/userRealmCommon';
import {dataRealmCommon} from '../database/dbquery/dataRealmCommon';
import {backupRuntime, BackupPreferences} from './backupRuntime';
import {cleanupRestorePhotos, photoPath, preferenceKeys, validatePreferences} from './backupSnapshot';
import {validateBackupChildren} from './backupFormat';
import * as RNFS from '@dr.pogodin/react-native-fs';
const JOURNAL = '__backup_restore_v1';
type State = {children: any[]; settings: Record<string,string>; preferences: BackupPreferences};
type Journal = {version: 1; direction: 'forward' | 'rollback'; before: State; after: State};
let recovering: Promise<void> | undefined;
export function readPortableSettings(realm: any): Record<string,string> {
  const out: Record<string,string> = {};
  for (const key of preferenceKeys) {
    const row = realm.objects('ConfigSettings').filtered('key == $0',key)[0];
    if (row) out[key] = row.value;
  }
  return out;
}
function writeJournal(realm: any, journal: Journal) {
  realm.write(()=>{
    realm.delete(realm.objects('ConfigSettings').filtered('key == $0', JOURNAL));
    realm.create('ConfigSettings',{key:JOURNAL,value:JSON.stringify(journal),createdAt:new Date(),updatedAt:new Date()});
  });
}
export async function commitPortableRestore(children: any[], settings: Record<string,string>, preferences: BackupPreferences): Promise<void> {
  const user = await userRealmCommon.openRealm(), data = await dataRealmCommon.openRealm();
  if (!user || !data) throw new Error('Restore storage unavailable');
  if (data.objects('ConfigSettings').filtered('key == $0', JOURNAL).length) throw new Error('An interrupted restore must finish first');
  const before: State = {children: JSON.parse(JSON.stringify(user.objects('ChildEntity'))),settings:readPortableSettings(data),preferences:backupRuntime().flags()};
  writeJournal(data,{version:1,direction:'forward',before,after:{children,settings,preferences}});
  try {await recoverPendingBackup();}
  catch {backupRuntime().recoveryRequired(); throw new Error('Restore interrupted: retry recovery or keep the previous data');}
}
function stateChildren(children: any[]): any[] {
  if (children.length) validateBackupChildren(children);
  return children.map(c=>{
    const child = {...c};
    for (const key of ['birthDate','plannedTermDate','createdAt','updatedAt']) if (child[key]!=null) {child[key]=new Date(child[key]); if(!Number.isFinite(child[key].getTime()))throw new Error('Invalid recovery date');}
    return child;
  });
}
/** Durable roll-forward journal: preparing it never deletes the previous dataset. */
export async function recoverPendingBackup(rollback = false): Promise<void> {
  if (recovering) return recovering;
  recovering = (async()=>{
    const data = await dataRealmCommon.openRealm();
    if (!data) throw new Error('Restore storage unavailable');
    const row = data.objects<{key:string;value:string}>('ConfigSettings').filtered('key == $0',JOURNAL)[0];
    if (!row) {const user=await userRealmCommon.openRealm(); if(user) await cleanupRestorePhotos(JSON.parse(JSON.stringify(user.objects('ChildEntity')))).catch(()=>{}); return;}
    const j: Journal = JSON.parse(row.value);
    if (j.version !== 1 || !['forward','rollback'].includes(j.direction)) throw new Error('Restore recovery journal is invalid');
    if (rollback) {j.direction='rollback'; writeJournal(data,j);}
    const target = j.direction==='rollback' ? j.before : j.after;
    validatePreferences(target.settings,target.preferences);
    const children = stateChildren(target.children);
    for (const c of children) if (j.direction !== 'rollback' && c.photoUri && !(await RNFS.exists(photoPath(c.photoUri)))) throw new Error('A restored photo is unavailable');
    const user: any = await userRealmCommon.openRealm(); if(!user)throw new Error('Restore storage unavailable');
    user.write(()=>{user.deleteAll(); children.forEach(c=>user.create('ChildEntity',c,'modified'));});
    // Persist Redux before clearing the journal. If this fails, replay on restart.
    await backupRuntime().applyFlags(target.preferences);
    data.write(()=>{
      for (const key of preferenceKeys) {
        data.delete(data.objects('ConfigSettings').filtered('key == $0',key));
        if (Object.prototype.hasOwnProperty.call(target.settings,key)) data.create('ConfigSettings',{key,value:target.settings[key],createdAt:new Date(),updatedAt:new Date()});
      }
      data.delete(data.objects('ConfigSettings').filtered('key == $0',JOURNAL));
    });
    // Failed orphan cleanup is retried on startup, never reverses a committed restore.
    await cleanupRestorePhotos(children).catch(()=>{});
  })().finally(()=>{recovering=undefined;});
  return recovering;
}

/** Preparation failures have no journal and may safely discard unreferenced staging files. */
export async function cleanupUnjournaledBackupPhotos(): Promise<void> {
  const data = await dataRealmCommon.openRealm(), user = await userRealmCommon.openRealm();
  if (!data || !user || data.objects('ConfigSettings').filtered('key == $0',JOURNAL).length) return;
  await cleanupRestorePhotos(JSON.parse(JSON.stringify(user.objects('ChildEntity'))));
}

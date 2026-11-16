import {diagnosticError} from '../../services/diagnostics';
import * as RNFS from '@dr.pogodin/react-native-fs';

let RealmLib: any = null;
let initializing = false;

export async function getRealmLib() {
  if (RealmLib) return RealmLib;
  // Prevent race in initialization
  if (initializing) {
    while (initializing) {
      await new Promise((r) => setTimeout(r, 10));
      if (RealmLib) return RealmLib;
    }
  }
  try {
    initializing = true;
    const mod = await import('realm');
    RealmLib = mod && mod.default ? mod.default : mod;
    return RealmLib;
  } finally {
    initializing = false;
  }
}

export async function safeOpenRealm(config: any) {
  try {
    const Realm = await getRealmLib();
    if (!Realm) {
      console.error('safeOpenRealm: Realm library not available');
      return null;
    }
    const realm = await Realm.open(config);
    return realm;
  } catch (e) {
    console.error('safeOpenRealm failed:', diagnosticError(e instanceof Error ? e : 'Realm operation failed'));
    return null;
  }
}

export async function safeDeleteRealm(config: any) {
  try {
    const Realm = await getRealmLib();
    if (Realm && Realm.deleteFile) {
      await Realm.deleteFile(config);
      console.log('safeDeleteRealm deleted temporary database');
      return;
    }
  } catch (e) {
    console.error('safeDeleteRealm failed (deleteFile):', diagnosticError(e instanceof Error ? e : 'Realm operation failed'));
  }
  // Fallback to filesystem delete if available
  try {
    if (config && config.path) {
      await RNFS.unlink(config.path).catch((error: any) => {
        if (error?.code !== 'ENOENT') throw error;
      });
      console.log('safeDeleteRealm fallback completed');
    }
  } catch (e) {
    console.error('safeDeleteRealm fallback failed:', diagnosticError(e instanceof Error ? e : 'Realm operation failed'));
  }
}
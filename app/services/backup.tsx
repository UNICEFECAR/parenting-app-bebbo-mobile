import {logAnalyticsEvent} from './firebaseAnalytics';
import type {UpdateMode} from 'realm';
import {googleAuth} from './googleAuth';
import {googleDrive} from './googleDrive';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {userRealmCommon} from '../database/dbquery/userRealmCommon';
import {appConfig} from '../instances';
import {dataRealmCommon} from '../database/dbquery/dataRealmCommon';
import {ConfigSettingsEntity, ConfigSettingsSchema} from '../database/schema/ConfigSettingsSchema';
import {getAllChildren, setActiveChild} from './childCRUD';
import {safeOpenRealm, safeDeleteRealm} from '../redux/reducers/realmSafe';
import {ChildEntitySchema} from '../database/schema/ChildDataSchema';
import {setInfoModalOpened} from '../redux/reducers/utilsSlice';
import {encryptBackup, decryptBackup} from './backupCipher';
import {encryptionsIVKey, encryptionsKey} from 'react-native-dotenv';
import {getChild} from './Utils';
import {openBackupDocument, saveBackupDocument} from './backupDocuments';
import {parseBackupChildren, validateBackupChildren} from './backupFormat';

// Preserve the IV normalisation used by historical local-file exports.
const backupIV = encryptionsIVKey?.replace("//:completeSettings = none", "");
let nextImport = 0;
const asError = (error: unknown): Error =>
  error instanceof Error ? error : new Error('Backup operation failed');

class Backup {
  private static instance: Backup;
  private operationRunning = false;

  static getInstance(): Backup {
    if (!Backup.instance) Backup.instance = new Backup();
    return Backup.instance;
  }

  private async exclusive<T>(work: () => Promise<T>): Promise<T> {
    if (this.operationRunning) throw new Error('Backup operation is already running');
    this.operationRunning = true;
    try { return await work(); }
    finally { this.operationRunning = false; }
  }

  public encryptData = async (text: string, key: string): Promise<{cipher: string}> => ({
    cipher: await encryptBackup(text, key),
  });

  public decryptData = (text: string, key: string): Promise<string> =>
    decryptBackup(text, key, backupIV);

  private async encryptedUserData(): Promise<string> {
    if (!(await userRealmCommon.openRealm())) throw new Error('Cannot open user data');
    const data = await userRealmCommon.exportUserRealmDataToJson();
    validateBackupChildren(data);
    const {cipher} = await this.encryptData(JSON.stringify(data), encryptionsKey);
    if (!cipher) throw new Error('Backup encryption failed');
    return cipher;
  }

  public async exportToFile(): Promise<boolean> {
    return this.exclusive(async () => {
      const saved = await saveBackupDocument(await this.encryptedUserData());
      if (saved) void logAnalyticsEvent('backup_export_completed', {source: 'local_file'});
      return saved;
    });
  }

  public async export(): Promise<boolean> {
    if (this.operationRunning) return false;
    return this.exclusive(async () => {
      if (!(await googleAuth.ensureSignedIn())) return false;
      const cipher = await this.encryptedUserData();
      const previousFiles = await googleDrive.findBackupFiles();
      if (previousFiles instanceof Error) throw previousFiles;
      const folder = previousFiles[0]?.parents?.[0] || await googleDrive.safeCreateFolder({
        name: appConfig.backupGDriveFolderName, parentFolderId: 'root',
      });
      if (folder instanceof Error) throw folder;
      const uploaded = await googleDrive.createFileMultipart({
        name: appConfig.backupGDriveFileName, content: cipher, parentFolderId: folder, isBase64: false,
      });
      if (uploaded instanceof Error) throw uploaded;
      if (!uploaded) throw new Error('Backup upload was not confirmed');
      // Keep the previous copy until Drive confirms the replacement.
      for (const file of previousFiles.slice(0, 1)) {
        if (file.id === uploaded) continue;
        try {
          const deleted = await googleDrive.deleteFile(file.id);
          if (deleted instanceof Error) throw deleted;
        } catch (error) { console.warn('Previous Drive backup could not be removed', error); }
      }
      void logAnalyticsEvent('backup_export_completed', {source: 'drive'});
      return true;
    });
  }

  private async readBackupFile(path: string, name: string): Promise<any[]> {
    if (name.toLowerCase().endsWith('.json')) {
      const decrypted = await this.decryptData(await RNFS.readFile(path, 'utf8'), encryptionsKey);
      return parseBackupChildren(decrypted);
    }
    // Open only a private copy: file-format upgrades cannot alter the original.
    const temporaryRealm = await safeOpenRealm({path});
    if (!temporaryRealm) throw new Error('Backup Realm could not be opened');
    try {
      return validateBackupChildren(JSON.parse(JSON.stringify(temporaryRealm.objects('ChildEntity'))));
    } finally { temporaryRealm.close(); }
  }

  /** Select and detach data; onboarding must not erase anything on preview. */
  public async readLocalBackup(): Promise<any[] | null> {
    return this.exclusive(async () => {
      const document = await openBackupDocument();
      if (!document) return null;
      if (document.name.toLowerCase().endsWith('.json')) {
        return parseBackupChildren(await this.decryptData(document.data, encryptionsKey));
      }
      const path = RNFS.CachesDirectoryPath + '/bebbo-import-' + Date.now() + '-' + ++nextImport + '.realm';
      try {
        await RNFS.writeFile(path, document.data, 'base64');
        return await this.readBackupFile(path, document.name);
      } finally { await safeDeleteRealm({path}); }
    });
  }

  private async readDriveBackup(): Promise<any[]> {
    if (!(await googleAuth.ensureSignedIn())) throw new Error('loginCanceled');
    const files = await googleDrive.findBackupFiles();
    if (files instanceof Error) throw files;
    if (!files.length) throw new Error('No accessible Drive backup was found');
    const path = RNFS.CachesDirectoryPath + '/drive-backup-' + Date.now() + '-' + ++nextImport + '.realm';
    try {
      const download = await googleDrive.downloadAndReadFile({fileId: files[0].id, filePath: path});
      if (download?.statusCode !== 200) throw new Error('Backup download failed');
      return await this.readBackupFile(path, files[0].name);
    } finally { await safeDeleteRealm({path}); }
  }

  public async import1(_navigation: any, _langCode: any, _dispatch: any, _childAge: any, _genders: any): Promise<any[] | Error> {
    try { return await this.exclusive(() => this.readDriveBackup()); }
    catch (error) { return asError(error); }
  }

  private async replaceChildren(data: unknown, genders: any): Promise<any[]> {
    // Detach before the legacy converter mutates records. Convert every child
    // before the transaction; a conversion failure cannot affect live data.
    const detached = JSON.parse(JSON.stringify(validateBackupChildren(data)));
    const children = await Promise.all(detached.map((child: any) => getChild({
      ...child, measures: child.measures ?? [], reminders: child.reminders ?? [],
    }, genders)));
    for (const child of children) {
      for (const field of ['createdAt', 'updatedAt', 'birthDate', 'plannedTermDate']) {
        if (child[field] != null) {
          child[field] = new Date(child[field]);
          if (!Number.isFinite(child[field].getTime())) throw new Error('Invalid backup date');
        }
      }
    }
    const realm = await userRealmCommon.openRealm();
    if (!realm) throw new Error('Cannot open user data');
    // A bad nested record rolls back the deletion and preceding insertions.
    realm.write(() => {
      realm.deleteAll();
      children.forEach(child => realm.create(ChildEntitySchema.name, child, 'modified' as UpdateMode));
    });
    void logAnalyticsEvent('backup_restore_completed', {restored_count: children.length});
    return children;
  }

  /** Atomic replacement shared by onboarding, local documents and Drive. */
  public async restoreChildren(data: unknown, genders: any): Promise<any[]> {
    return this.exclusive(() => this.replaceChildren(data, genders));
  }

  private async finishRestore(navigation: any, langCode: any, dispatch: any, childAge: any, taxonomyIds?: any): Promise<'Imported'> {
    const allChildren = await getAllChildren(dispatch, childAge, 1);
    if (!allChildren?.length) throw new Error('Restored children could not be loaded');
    const settings = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(
      ConfigSettingsSchema, "key='currentActiveChildId'",
    );
    const previousId = settings?.[0]?.value;
    const childId = allChildren.some((child: any) => child.uuid === previousId) ? previousId : '';
    await setActiveChild(langCode, childId, dispatch, childAge, false, taxonomyIds?.boyChildGender);
    dispatch(setInfoModalOpened({key: 'generateNotifications', value: true}));
    navigation.navigate('LoadingScreen', {apiJsonData: [], prevPage: 'ImportScreen'});
    return 'Imported';
  }

  public async importFromFile(data: unknown, navigation: any, genders: any, dispatch: any,
    childAge: any, langCode: any, taxonomyIds?: any): Promise<'Imported' | Error> {
    try {
      return await this.exclusive(async () => {
        await this.replaceChildren(data, genders);
        return this.finishRestore(navigation, langCode, dispatch, childAge, taxonomyIds);
      });
    } catch (error) { return asError(error); }
  }

  public async import(navigation: any, langCode: any, dispatch: any, childAge: any,
    genders: any, taxonomyIds?: any): Promise<'Imported' | Error> {
    try {
      return await this.exclusive(async () => {
        await this.replaceChildren(await this.readDriveBackup(), genders);
        return this.finishRestore(navigation, langCode, dispatch, childAge, taxonomyIds);
      });
    } catch (error) { return asError(error); }
  }
}

export const backup = Backup.getInstance();

import { errorCodes, isErrorWithCode, keepLocalCopy, pick, saveDocuments, types } from '@react-native-documents/picker';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { Platform } from 'react-native';
import Share from 'react-native-share';

let nextFile = 0;
const uniqueName = () => `backup-${Date.now()}-${++nextFile}`;
const wasCancelled = (error: unknown) => isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED;

// Providers (including Drive) can return content:// URIs. Read a private local
// copy so both encrypted JSON and legacy binary backups use the same selection.
export async function openBackupDocument(): Promise<{ name: string; data: string } | null> {
  let localUri: string | undefined;
  try {
    const [document] = await pick({ type: [types.allFiles], allowMultiSelection: false, mode: 'import' });
    if (!document.uri || !document.name) throw new Error('Backup file metadata is unavailable');
    const isJson = document.name.toLowerCase().endsWith('.json');
    const [copy] = await keepLocalCopy({
      files: [{ uri: document.uri, fileName: `${uniqueName()}.${isJson ? 'json' : 'realm'}` }],
      destination: 'cachesDirectory',
    });
    if (copy.status !== 'success') throw new Error(copy.copyError);
    localUri = copy.localUri;
    const info = await RNFS.stat(localUri);
    if (!info.isFile() || Number(info.size) > 128*1024*1024) throw new Error('Backup exceeds the supported size');
    const data = await RNFS.readFile(localUri, isJson ? 'utf8' : 'base64');
    return { name: document.name, data };
  } catch (error) {
    if (wasCancelled(error)) return null;
    throw error;
  } finally {
    if (localUri) await RNFS.unlink(localUri).catch(() => {});
  }
}

export async function saveBackupDocument(encryptedData: string): Promise<boolean> {
  const path = `${RNFS.CachesDirectoryPath}/${uniqueName()}.json`;
  try {
    // Retain the original Android backup bytes, including JSON string quoting.
    await RNFS.writeFile(path, Platform.OS === 'android' ? JSON.stringify(encryptedData) : encryptedData, 'utf8');
    if (Platform.OS === 'ios') {
      const result = await Share.open({
        title: 'Backup File', url: `file://${path}`, saveToFiles: true, failOnCancel: false,
      });
      return result.success === true;
    }
    const [saved] = await saveDocuments({
      sourceUris: [`file://${path}`], mimeType: 'application/json', fileName: 'mybackup.json',
    });
    if (!saved.uri || saved.error) throw new Error(saved.error || 'Backup file was not saved');
    return true;
  } catch (error) {
    if (wasCancelled(error) || (error as any)?.code === 'ECANCELLED500' ||
      (error as any)?.error?.code === 'ECANCELLED500') return false;
    throw error;
  } finally {
    // saveDocuments resolves after the native copy, not just after choosing a destination.
    await RNFS.unlink(path).catch(() => {});
  }
}

jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn().mockResolvedValue(undefined)}));
import {Platform} from 'react-native';
import Share from 'react-native-share';
import {normaliseBackupCiphertext, parseBackupChildren} from '../backupFormat';
import { backup } from '../backup';
import { openBackupDocument, saveBackupDocument } from '../backupDocuments';
import { pick, keepLocalCopy, saveDocuments } from '@react-native-documents/picker';
import { googleAuth } from '../googleAuth';
import { googleDrive } from '../googleDrive';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { safeOpenRealm } from '../../redux/reducers/realmSafe';
import { getChild } from '../Utils';
import * as RNFS from '@dr.pogodin/react-native-fs';
import AesCrypto from 'react-native-aes-crypto';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { getAllChildren, setActiveChild } from '../childCRUD';

jest.mock('react-native-share', () => ({open: jest.fn()}));
jest.mock('../googleAuth', () => ({ googleAuth: { ensureSignedIn: jest.fn() } }));
jest.mock('../googleDrive', () => ({ googleDrive: {
  findBackupFiles: jest.fn(), safeCreateFolder: jest.fn(), createFileMultipart: jest.fn(),
  deleteFile: jest.fn(), downloadAndReadFile: jest.fn(),
} }));
jest.mock('../../instances', () => ({ appConfig: { backupGDriveFolderName: 'ParentBuddy', backupGDriveFileName: 'mybackup.json' } }));
jest.mock('@dr.pogodin/react-native-fs', () => ({
  DocumentDirectoryPath: '/documents', CachesDirectoryPath: '/cache',
  readFile: jest.fn(), writeFile: jest.fn(), unlink: jest.fn(),
}));
jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(), keepLocalCopy: jest.fn(), saveDocuments: jest.fn(),
  types: { allFiles: '*/*' }, errorCodes: { OPERATION_CANCELED: 'OPERATION_CANCELED' },
  isErrorWithCode: (error: any) => error != null && typeof error === 'object' && 'code' in error,
}));
jest.mock('react-native-aes-crypto', () => ({ encrypt: jest.fn(), decrypt: jest.fn(), randomKey: jest.fn().mockResolvedValue('1'.repeat(32)), hmac256: jest.fn().mockResolvedValue('2'.repeat(64)) }));
jest.mock('../../database/dbquery/userRealmCommon', () => ({ userRealmCommon: { openRealm: jest.fn(), exportUserRealmDataToJson: jest.fn() } }));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({ dataRealmCommon: { getFilteredData: jest.fn().mockResolvedValue([]) } }));
jest.mock('../childCRUD', () => ({ getAllChildren: jest.fn().mockResolvedValue([{ uuid: 'child' }]), setActiveChild: jest.fn() }));
jest.mock('../../redux/reducers/realmSafe', () => ({ safeOpenRealm: jest.fn(), safeDeleteRealm: jest.fn() }));
jest.mock('../Utils', () => ({ getChild: jest.fn() }));
jest.mock('../../redux/reducers/utilsSlice', () => ({ setInfoModalOpened: jest.fn() }));

const child = { uuid: 'child', birthDate: '2024-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' };
const auth = jest.mocked(googleAuth);
const drive = jest.mocked(googleDrive);
const userData = jest.mocked(userRealmCommon);
const crypto = jest.mocked(AesCrypto);
let realm: any;
let navigation: any;
const restore = () => backup.import(navigation, 'en', jest.fn(), [], [], {});

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(Platform, "OS", {value: "android", configurable: true});
  realm = { write: jest.fn((callback: () => void) => callback()), deleteAll: jest.fn(), create: jest.fn() };
  navigation = { navigate: jest.fn() };
  auth.ensureSignedIn.mockResolvedValue(true);
  userData.openRealm.mockResolvedValue(realm);
  userData.exportUserRealmDataToJson.mockResolvedValue([child]);
  crypto.encrypt.mockResolvedValue('encrypted');
  crypto.decrypt.mockResolvedValue(JSON.stringify([child]));
  drive.findBackupFiles.mockResolvedValue([{ id: 'old', name: 'mybackup.json', parents: ['folder'] }] as any);
  drive.safeCreateFolder.mockResolvedValue('folder');
  drive.createFileMultipart.mockResolvedValue('new');
  drive.deleteFile.mockResolvedValue(true);
  drive.downloadAndReadFile.mockResolvedValue({ statusCode: 200 });
  jest.mocked(RNFS.readFile).mockResolvedValue('encrypted');
  jest.mocked(getChild).mockImplementation(async item => ({ ...item }));
});

test('does not report success or delete the previous backup until upload resolves', async () => {
  let complete!: (id: string) => void;
  drive.createFileMultipart.mockImplementation(() => new Promise(resolve => { complete = resolve; }));
  let finished = false;
  const exporting = backup.export().then(result => { finished = true; return result; });
  // Wait for the mocked upload to start without using timers.
  for (let index = 0; index < 20 && !complete; index++) await Promise.resolve();
  expect(complete).toBeDefined();
  expect(finished).toBe(false);
  expect(drive.deleteFile).not.toHaveBeenCalled();
  await expect(backup.export()).resolves.toBe(false);
  expect(await restore()).toEqual(new Error('Backup operation is already running'));
  expect(drive.createFileMultipart).toHaveBeenCalledTimes(1);
  complete('new');
  await expect(exporting).resolves.toBe(true);
  expect(drive.deleteFile).toHaveBeenCalledWith('old');
});

test('keeps the previous backup when upload fails and releases its operation lock', async () => {
  drive.createFileMultipart.mockResolvedValueOnce(new Error('upload failed'));
  await expect(backup.export()).rejects.toThrow('upload failed');
  expect(drive.deleteFile).not.toHaveBeenCalled();
  await expect(backup.export()).resolves.toBe(true);
});

test('creates a folder only for a new backup', async () => {
  drive.findBackupFiles.mockResolvedValue([]);
  await expect(backup.export()).resolves.toBe(true);
  expect(drive.safeCreateFolder).toHaveBeenCalledTimes(1);
});

test('a cleanup failure retains the confirmed new upload as a successful backup', async () => {
  drive.deleteFile.mockRejectedValueOnce(new Error('cleanup failed'));
  await expect(backup.export()).resolves.toBe(true);
  expect(drive.createFileMultipart).toHaveBeenCalledTimes(1);
});

test('does not turn a listing error into a new backup', async () => {
  drive.findBackupFiles.mockResolvedValue(new Error('permission denied'));
  await expect(backup.export()).rejects.toThrow('permission denied');
  expect(drive.createFileMultipart).not.toHaveBeenCalled();
});

test('does no Drive work after sign-in cancellation', async () => {
  auth.ensureSignedIn.mockResolvedValue(false);
  await expect(backup.export()).resolves.toBe(false);
  const result = await restore();
  expect(result).toEqual(new Error('loginCanceled'));
  expect(drive.findBackupFiles).not.toHaveBeenCalled();
});

test('authorization failure leaves Drive untouched and permits a later backup attempt', async () => {
  auth.ensureSignedIn.mockRejectedValueOnce(new Error('Drive permission denied'));
  await expect(backup.export()).rejects.toThrow('Drive permission denied');
  expect(drive.findBackupFiles).not.toHaveBeenCalled();
  expect(drive.createFileMultipart).not.toHaveBeenCalled();
  expect(drive.deleteFile).not.toHaveBeenCalled();
  await expect(backup.export()).resolves.toBe(true);
});

test('missing backup is a returned error and never creates a restore folder', async () => {
  drive.findBackupFiles.mockResolvedValue([]);
  expect(await restore()).toBeInstanceOf(Error);
  expect(drive.safeCreateFolder).not.toHaveBeenCalled();
  expect(realm.deleteAll).not.toHaveBeenCalled();
});

test.each(['HTTP failure', 'download exception', 'decryption failure', 'invalid JSON', 'invalid children', 'conversion failure'])(
  'leaves local data untouched after %s', async failure => {
    if (failure === 'HTTP failure') drive.downloadAndReadFile.mockResolvedValue({ statusCode: 403 });
    if (failure === 'download exception') drive.downloadAndReadFile.mockRejectedValueOnce(new Error('offline'));
    if (failure === 'decryption failure') crypto.decrypt.mockRejectedValueOnce(new Error('wrong key'));
    if (failure === 'invalid JSON') crypto.decrypt.mockResolvedValueOnce('broken');
    if (failure === 'invalid children') crypto.decrypt.mockResolvedValueOnce('[{}]');
    if (failure === 'conversion failure') jest.mocked(getChild).mockRejectedValueOnce(new Error('bad child'));
    expect(await restore()).toBeInstanceOf(Error);
    expect(realm.write).not.toHaveBeenCalled();
    expect(realm.deleteAll).not.toHaveBeenCalled();
    expect(navigation.navigate).not.toHaveBeenCalled();
  },
);

test('restores all children within one transaction and reports completion', async () => {
  await expect(restore()).resolves.toBe('Imported');
  expect(realm.write).toHaveBeenCalledTimes(1);
  expect(realm.deleteAll).toHaveBeenCalledTimes(1);
  expect(realm.create).toHaveBeenCalledWith('ChildEntity', expect.objectContaining({ birthDate: expect.any(Date) }), 'modified');
  expect(navigation.navigate).toHaveBeenCalledWith('LoadingScreen', { apiJsonData: [], prevPage: 'ImportScreen' });
});

test('returns an insertion failure to the caller instead of navigating as success', async () => {
  realm.create.mockImplementation(() => { throw new Error('schema mismatch'); });
  expect(await restore()).toEqual(new Error('schema mismatch'));
  expect(navigation.navigate).not.toHaveBeenCalled();
});

test('onboarding returns detached children without closing or clearing the live Realm', async () => {
  const data = await backup.import1(navigation, 'en', jest.fn(), [], []);
  expect(data).toEqual([child]);
  expect(realm.deleteAll).not.toHaveBeenCalled();
  expect(userData.openRealm).not.toHaveBeenCalled();
});

test('legacy Realm backups are detached and closed without changing live data', async () => {
  drive.findBackupFiles.mockResolvedValue([{ id: 'old', name: 'mybackup.json.realm' }] as any);
  const close = jest.fn();
  jest.mocked(safeOpenRealm).mockResolvedValue({ objects: () => [child], close } as any);
  expect(await backup.import1(navigation, 'en', jest.fn(), [], [])).toEqual([child]);
  expect(close).toHaveBeenCalledTimes(1);
  expect(realm.deleteAll).not.toHaveBeenCalled();
});

test('replaces only the selected previous backup, retaining other matching copies', async () => {
  drive.findBackupFiles.mockResolvedValue([
    { id: 'newest-old', name: 'mybackup.json', parents: ['folder'] },
    { id: 'other-copy', name: 'mybackup.json', parents: ['other-folder'] },
  ] as any);
  await expect(backup.export()).resolves.toBe(true);
  expect(drive.deleteFile).toHaveBeenCalledTimes(1);
  expect(drive.deleteFile).toHaveBeenCalledWith('newest-old');
});

test('reads older decrypted JSON with control characters, as before', async () => {
  crypto.decrypt.mockResolvedValueOnce('\u0000\n' + JSON.stringify([child]) + '\u0000\u007f');
  expect(await backup.import1(navigation, 'en', jest.fn(), [], [])).toEqual([child]);
});

const completeChild = {
  ...child, childName: 'Child', gender: 1, photoUri: 'photo.jpg',
  measures: [{ uuid: 'measurement', weight: '12', height: '85', didChildGetVaccines: true, vaccineIds: '1,2' }],
  reminders: [{ uuid: 'reminder', reminderType: 'vaccine', reminderDate: 123 }],
  checkedMilestones: [10, 20], favoriteadvices: [100], favoritegames: [200],
  comment: 'Doctor comment', isPremature: 'true', autoChild: 'false',
};

test('exports the same complete child payload to encrypted JSON', async () => {
  userData.exportUserRealmDataToJson.mockResolvedValueOnce([completeChild]);
  await expect(backup.export()).resolves.toBe(true);
  expect(crypto.encrypt.mock.calls[0][0]).toBe(JSON.stringify([completeChild]));
  expect(crypto.encrypt.mock.calls[0][3]).toBe('aes-256-cbc');
  expect(drive.createFileMultipart).toHaveBeenCalledWith(expect.objectContaining({ name: 'mybackup.json', content: expect.stringContaining('\"version\":2'), parentFolderId: 'folder' }));
});

test('retains expected children and nested data when reading an onboarding backup', async () => {
  const expected = { ...child, uuid: 'expected-child', birthDate: '2050-01-01T00:00:00Z', isExpected: 'true' };
  crypto.decrypt.mockResolvedValueOnce(JSON.stringify([completeChild, expected]));
  expect(await backup.import1(navigation, 'en', jest.fn(), [], [])).toEqual([completeChild, expected]);
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(realm.write).not.toHaveBeenCalled();
});

test('passes the same nested data through the existing child converter for Settings restore', async () => {
  crypto.decrypt.mockResolvedValueOnce(JSON.stringify([completeChild]));
  await expect(restore()).resolves.toBe('Imported');
  expect(getChild).toHaveBeenCalledWith(completeChild, []);
  expect(realm.create).toHaveBeenCalledWith('ChildEntity', expect.objectContaining({
    measures: completeChild.measures, reminders: completeChild.reminders,
    checkedMilestones: completeChild.checkedMilestones, favoriteadvices: [100], favoritegames: [200],
  }), 'modified');
});

test.each([true, false])('preserves active-child selection/fallback after restore (existing child: %s)', async exists => {
  jest.mocked(dataRealmCommon.getFilteredData).mockResolvedValueOnce([{ value: exists ? 'child' : 'missing' }] as any);
  await expect(restore()).resolves.toBe('Imported');
  expect(setActiveChild).toHaveBeenCalledWith('en', exists ? 'child' : '', expect.any(Function), [], false, undefined);
});

test('Settings also restores the older Realm format through the existing child converter', async () => {
  drive.findBackupFiles.mockResolvedValueOnce([{ id: 'old', name: 'mybackup.json.realm' }] as any);
  const close = jest.fn();
  jest.mocked(safeOpenRealm).mockResolvedValueOnce({ objects: () => [completeChild], close } as any);
  await expect(restore()).resolves.toBe('Imported');
  expect(getChild).toHaveBeenCalledWith(completeChild, []);
  expect(close).toHaveBeenCalledTimes(1);
  expect(getAllChildren).toHaveBeenCalled();
});


describe('local backup document selection and saving', () => {
  beforeEach(() => {
    jest.mocked(pick).mockResolvedValue([{ uri: 'content://provider/backup', name: 'mybackup.json' }] as any);
    jest.mocked(keepLocalCopy).mockResolvedValue([{ status: 'success', sourceUri: 'content://provider/backup', localUri: 'file:///cache/import.json' }]);
    jest.mocked(saveDocuments).mockResolvedValue([{ uri: 'content://provider/saved', name: 'mybackup.json', error: null }]);
    jest.mocked(RNFS.writeFile).mockResolvedValue(undefined);
    jest.mocked(RNFS.unlink).mockResolvedValue(undefined);
  });

  test('reads encrypted JSON unchanged and removes only the temporary local copy', async () => {
    jest.mocked(RNFS.readFile).mockResolvedValue('"encrypted"');
    await expect(openBackupDocument()).resolves.toEqual({ name: 'mybackup.json', data: '"encrypted"' });
    expect(RNFS.readFile).toHaveBeenCalledWith('file:///cache/import.json', 'utf8');
    expect(RNFS.unlink).toHaveBeenCalledWith('file:///cache/import.json');
    expect(pick).toHaveBeenCalledTimes(1);
  });

  test('legacy binary imports use base64 from the same selection, never a second picker', async () => {
    jest.mocked(pick).mockResolvedValue([{ uri: 'content://provider/realm', name: 'backup.realm' }] as any);
    jest.mocked(RNFS.readFile).mockResolvedValue('AAECAw==');
    await expect(openBackupDocument()).resolves.toEqual({ name: 'backup.realm', data: 'AAECAw==' });
    expect(RNFS.readFile).toHaveBeenCalledWith('file:///cache/import.json', 'base64');
    expect(pick).toHaveBeenCalledTimes(1);
  });

  test('uppercase JSON extensions still read as UTF-8', async () => {
    jest.mocked(pick).mockResolvedValue([{ uri: 'content://provider/json', name: 'BACKUP.JSON' }] as any);
    await openBackupDocument();
    expect(RNFS.readFile).toHaveBeenCalledWith(expect.any(String), 'utf8');
  });

  test('cancelling selection is a neutral result and never reads files', async () => {
    jest.mocked(pick).mockRejectedValueOnce({ code: 'OPERATION_CANCELED' });
    await expect(openBackupDocument()).resolves.toBeNull();
    expect(RNFS.readFile).not.toHaveBeenCalled();
    expect(userData.openRealm).not.toHaveBeenCalled();
  });

  test('provider copy failures stop before reading or touching Realm', async () => {
    jest.mocked(keepLocalCopy).mockResolvedValueOnce([{ status: 'error', sourceUri: 'content://provider/backup', copyError: 'Provider offline' }]);
    await expect(openBackupDocument()).rejects.toThrow('Provider offline');
    expect(RNFS.readFile).not.toHaveBeenCalled();
    expect(userData.openRealm).not.toHaveBeenCalled();
  });

  test('read failures still clean the local copy without deleting the original document', async () => {
    jest.mocked(RNFS.readFile).mockRejectedValueOnce(new Error('Read failed'));
    await expect(openBackupDocument()).rejects.toThrow('Read failed');
    expect(RNFS.unlink).toHaveBeenCalledTimes(1);
    expect(RNFS.unlink).toHaveBeenCalledWith('file:///cache/import.json');
  });

  test('Save As preserves the previous Android JSON-quoted ciphertext and filename', async () => {
    await expect(saveBackupDocument('encrypted')).resolves.toBe(true);
    expect(RNFS.writeFile).toHaveBeenCalledWith(expect.any(String), '"encrypted"', 'utf8');
    expect(saveDocuments).toHaveBeenCalledWith({ sourceUris: [expect.stringMatching(/^file:\/\/\/cache\//)], mimeType: 'application/json', fileName: 'mybackup.json' });
    expect(RNFS.unlink).toHaveBeenCalledWith(jest.mocked(RNFS.writeFile).mock.calls[0][0]);
  });

  test('does not clean the export source or report success before the native copy finishes', async () => {
    let finish!: (value: any) => void;
    jest.mocked(saveDocuments).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const result = saveBackupDocument('encrypted');
    for (let index = 0; index < 10 && !finish; index++) await Promise.resolve();
    expect(RNFS.unlink).not.toHaveBeenCalled();
    finish([{ uri: 'content://saved', name: 'mybackup.json', error: null }]);
    await expect(result).resolves.toBe(true);
    expect(RNFS.unlink).toHaveBeenCalledTimes(1);
  });

  test('save cancellation cleans the temporary file and does not report success', async () => {
    jest.mocked(saveDocuments).mockRejectedValueOnce({ code: 'OPERATION_CANCELED' });
    await expect(saveBackupDocument('encrypted')).resolves.toBe(false);
    expect(RNFS.unlink).toHaveBeenCalledTimes(1);
  });

  test('a native write error is a failure even when the provider returned a target URI', async () => {
    jest.mocked(saveDocuments).mockResolvedValueOnce([{ uri: 'content://saved', name: 'mybackup.json', error: 'No space' }]);
    await expect(saveBackupDocument('encrypted')).rejects.toThrow('No space');
    expect(RNFS.unlink).toHaveBeenCalledTimes(1);
  });
});

test.each(['ciphertext', '"ciphertext"', '\uFEFF  "ciphertext"\n'])(
  'accepts historical raw or JSON-quoted ciphertext: %s', input => {
    expect(normaliseBackupCiphertext(input)).toBe('ciphertext');
  },
);

test.each(['', '""', '"unterminated'])('rejects damaged ciphertext without decrypting: %s', input => {
  expect(() => normaliseBackupCiphertext(input)).toThrow();
});

test.each([[child, child], [{...child, birthDate: 'bad date'}], [], {}].map(data => ({data})))(
  'rejects invalid or duplicate child records before opening the live Realm', async ({data}) => {
    await expect(backup.restoreChildren(data, [])).rejects.toThrow();
    expect(userData.openRealm).not.toHaveBeenCalled();
    expect(realm.write).not.toHaveBeenCalled();
  },
);

test('a failure inserting the second child rolls back deletion and earlier insertions', async () => {
  const previous = [{uuid: 'existing-child'}];
  let contents: any[] = [...previous];
  realm.write.mockImplementation((write: () => void) => {
    const snapshot = [...contents];
    try {write();} catch (error) {contents = snapshot; throw error;}
  });
  realm.deleteAll.mockImplementation(() => {contents = [];});
  realm.create.mockImplementation((_schema: string, value: any) => {
    if (value.uuid === 'broken-child') throw new Error('Invalid nested measurement');
    contents.push(value);
  });
  const result = await backup.importFromFile([child, {...child, uuid: 'broken-child'}], navigation, [], jest.fn(), [], 'en');
  expect(result).toEqual(new Error('Invalid nested measurement'));
  expect(contents).toEqual(previous);
  expect(realm.write).toHaveBeenCalledTimes(1);
  expect(navigation.navigate).not.toHaveBeenCalled();
});

test('local imports use the same atomic restore and return success to the caller', async () => {
  await expect(backup.importFromFile([completeChild], navigation, [], jest.fn(), [], 'en')).resolves.toBe('Imported');
  expect(realm.write).toHaveBeenCalledTimes(1);
  expect(realm.create).toHaveBeenCalledTimes(1);
  expect(navigation.navigate).toHaveBeenCalledTimes(1);
});

test('conversion does not mutate the selected backup or erase live data if it fails', async () => {
  jest.mocked(getChild).mockImplementationOnce(async item => {
    item.childName = 'mutated';
    throw new Error('conversion failed');
  });
  const source = {...completeChild};
  await expect(backup.restoreChildren([source], [])).rejects.toThrow('conversion failed');
  expect(source.childName).toBe('Child');
  expect(realm.write).not.toHaveBeenCalled();
});

test('local preview accepts Android quoted JSON and never changes the live Realm', async () => {
  jest.mocked(pick).mockResolvedValueOnce([{uri: 'content://backup', name: 'BACKUP.JSON'}] as any);
  jest.mocked(keepLocalCopy).mockResolvedValueOnce([{status: 'success', sourceUri: 'content://backup', localUri: 'file:///cache/selected'}]);
  jest.mocked(RNFS.readFile).mockResolvedValueOnce('"ciphertext"');
  await expect(backup.readLocalBackup()).resolves.toEqual([child]);
  expect(crypto.decrypt.mock.calls[0][0]).toBe('ciphertext');
  expect(crypto.decrypt.mock.calls[0][3]).toBe('aes-256-cbc');
  expect(userData.openRealm).not.toHaveBeenCalled();
});

test('legacy binary local preview closes its private Realm when validation fails', async () => {
  jest.mocked(pick).mockResolvedValueOnce([{uri: 'content://backup', name: 'backup.realm'}] as any);
  jest.mocked(keepLocalCopy).mockResolvedValueOnce([{status: 'success', sourceUri: 'content://backup', localUri: 'file:///cache/selected'}]);
  const close = jest.fn();
  jest.mocked(safeOpenRealm).mockResolvedValueOnce({objects: () => [{uuid: 'invalid'}], close} as any);
  await expect(backup.readLocalBackup()).rejects.toThrow('invalid child data');
  expect(close).toHaveBeenCalledTimes(1);
  expect(userData.openRealm).not.toHaveBeenCalled();
});

test('cancelled local selection does not open or replace the live database', async () => {
  jest.mocked(pick).mockRejectedValueOnce({code: 'OPERATION_CANCELED'});
  await expect(backup.readLocalBackup()).resolves.toBeNull();
  expect(userData.openRealm).not.toHaveBeenCalled();
  expect(realm.deleteAll).not.toHaveBeenCalled();
});

test('iOS exports the authenticated envelope and awaits the share operation before cleanup', async () => {
  Object.defineProperty(Platform, 'OS', {value: 'ios', configurable: true});
  let finish!: (value: any) => void;
  jest.mocked(Share.open).mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
  const result = backup.exportToFile();
  for (let index = 0; index < 30 && !finish; index++) await Promise.resolve();
  expect(finish).toBeDefined();
  expect(RNFS.writeFile).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('\"version\":2'), 'utf8');
  expect(RNFS.unlink).not.toHaveBeenCalled();
  finish({success: true});
  await expect(result).resolves.toBe(true);
  expect(RNFS.unlink).toHaveBeenCalledTimes(1);
  expect(saveDocuments).not.toHaveBeenCalled();
});

test('cancelled iOS share cleans its temporary export and releases the operation lock', async () => {
  Object.defineProperty(Platform, 'OS', {value: 'ios', configurable: true});
  jest.mocked(Share.open).mockRejectedValueOnce({error: {code: 'ECANCELLED500'}});
  await expect(backup.exportToFile()).resolves.toBe(false);
  expect(RNFS.unlink).toHaveBeenCalledTimes(1);
  jest.mocked(Share.open).mockResolvedValueOnce({success: true, message: ''});
  await expect(backup.exportToFile()).resolves.toBe(true);
});


test('each completed restore reports imported records without reporting new profiles', async () => {
  const log = require('../firebaseAnalytics').logAnalyticsEvent;
  await backup.restoreChildren([child], []);
  await backup.restoreChildren([child], []);
  expect(log.mock.calls).toEqual([
    ['backup_restore_completed', {restored_count: 1}], ['backup_restore_completed', {restored_count: 1}],
  ]);
});
test('a failed restore never reports imported records', async () => {
  realm.create.mockImplementationOnce(() => {throw new Error('disk full');});
  await expect(backup.restoreChildren([child], [])).rejects.toThrow('disk full');
  expect(require('../firebaseAnalytics').logAnalyticsEvent).not.toHaveBeenCalled();
});


test.each([
  {...child, uuid: "child' OR TRUEPREDICATE"},
  {...child, measures: {bad: true}},
  {...child, reminders: 'not JSON'},
  {...child, reminders: [{uuid: 'same'}, {uuid: 'same'}]},
  {...child, favoritegames: ['12']},
])('rejects malformed nested records or unsafe profile identifiers before live writes', async value => {
  await expect(backup.restoreChildren([value], [])).rejects.toThrow();
  expect(userData.openRealm).not.toHaveBeenCalled();
});
test('invalid control bytes inside text are rejected rather than silently changing records', () => {
  const invalid = JSON.stringify([{...child, childName: 'A B'}]).replace('A B', 'A' + String.fromCharCode(1) + 'B');
  expect(() => parseBackupChildren(invalid)).toThrow();
  expect(parseBackupChildren(JSON.stringify([{...child, comment: 'line 1\nline 2'}]))[0].comment).toBe('line 1\nline 2');
});
test('a large multilingual multi-profile import retains all nested records and is repeatable without duplicates', async () => {
  const data = Array.from({length: 500}, (_, index) => ({...completeChild, uuid: `child-${index}`,
    childName: index % 2 ? 'عائشَہ' : 'فاطِمة', isExpected: index % 2 ? 'true' : 'false'}));
  let saved: any[] = [];
  realm.deleteAll.mockImplementation(() => {saved = [];});
  realm.create.mockImplementation((_schema: string, value: any) => saved.push(JSON.parse(JSON.stringify(value))));
  for (let repeat = 0; repeat < 2; repeat++) {
    await backup.restoreChildren(data, []);
    expect(saved).toHaveLength(500);
    expect(new Set(saved.map(value => value.uuid)).size).toBe(500);
    expect(saved[42].measures).toEqual(data[42].measures);
    expect(saved[43].reminders).toEqual(data[43].reminders);
    expect(saved[43].childName).toBe('عائشَہ');
    expect(saved[43].checkedMilestones).toEqual(data[43].checkedMilestones);
    expect(saved[43].favoriteadvices).toEqual(data[43].favoriteadvices);
  }
});

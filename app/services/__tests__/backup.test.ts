import { backup } from '../backup';
import { googleAuth } from '../googleAuth';
import { googleDrive } from '../googleDrive';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { safeOpenRealm } from '../../redux/reducers/realmSafe';
import { getChild } from '../Utils';
import RNFS from 'react-native-fs';
import AesCrypto from 'react-native-aes-crypto';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { getAllChildren, setActiveChild } from '../childCRUD';

jest.mock('../googleAuth', () => ({ googleAuth: { ensureSignedIn: jest.fn() } }));
jest.mock('../googleDrive', () => ({ googleDrive: {
  findBackupFiles: jest.fn(), safeCreateFolder: jest.fn(), createFileMultipart: jest.fn(),
  deleteFile: jest.fn(), downloadAndReadFile: jest.fn(),
} }));
jest.mock('../../instances', () => ({ appConfig: { backupGDriveFolderName: 'ParentBuddy', backupGDriveFileName: 'mybackup.json' } }));
jest.mock('react-native-fs', () => ({ DocumentDirectoryPath: '/documents', readFile: jest.fn() }));
jest.mock('react-native-aes-crypto', () => ({ encrypt: jest.fn(), decrypt: jest.fn() }));
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
  expect(drive.createFileMultipart).toHaveBeenCalledWith(expect.objectContaining({ name: 'mybackup.json', content: 'encrypted', parentFolderId: 'folder' }));
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

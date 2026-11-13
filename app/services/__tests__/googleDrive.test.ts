import { googleDrive } from '../googleDrive';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { googleAuth } from '../googleAuth';

jest.mock('@robinbobin/react-native-google-drive-api-wrapper', () => ({
  GDrive: jest.fn().mockImplementation(() => ({ files: { list: jest.fn(), newMetadataOnlyUploader: jest.fn() } })),
  MIME_TYPES: { application: { vndGoogleAppsFolder: 'folder' } },
}));
jest.mock('../googleAuth', () => ({ googleAuth: {
  getTokens: jest.fn().mockResolvedValue({ accessToken: 'access' }),
  clearCachedAccessToken: jest.fn().mockResolvedValue(undefined),
} }));
jest.mock('../../instances', () => ({ appConfig: { backupGDriveFolderName: 'ParentBuddy', backupGDriveFileName: 'mybackup.json' } }));
jest.mock('@dr.pogodin/react-native-fs', () => ({ downloadFile: jest.fn() }));
jest.mock('../../android/sharedAndroid.android', () => ({ PermissionsAndroidLocal: {} }));
const drive = (GDrive as jest.Mock).mock.results[0].value;
beforeEach(() => { jest.clearAllMocks(); });

test('returns an empty listing as no matches, not an API error', async () => {
  drive.files.list.mockResolvedValueOnce({ files: [] });
  await expect(googleDrive.list()).resolves.toEqual([]);
  // The installed wrapper calls toString() on every supplied query parameter.
  // An explicit pageToken: undefined crashes before it can reach Drive.
  expect(drive.files.list.mock.calls[0][0]).not.toHaveProperty('pageToken');
  expect(Object.values(drive.files.list.mock.calls[0][0])).not.toContain(undefined);
});
test('reads all pages', async () => {
  drive.files.list.mockResolvedValueOnce({ files: [{ id: '1' }], nextPageToken: 'next' }).mockResolvedValueOnce({ files: [{ id: '2' }] });
  await expect(googleDrive.list()).resolves.toEqual([{ id: '1' }, { id: '2' }]);
  expect(drive.files.list.mock.calls[1][0].pageToken).toBe('next');
});
test('preserves permission errors', async () => {
  drive.files.list.mockRejectedValueOnce(new Error('403 insufficient permission'));
  await expect(googleDrive.list()).resolves.toEqual(new Error('403 insufficient permission'));
});
test('clears a rejected token without retrying the Drive operation', async () => {
  const failure = Object.assign(new Error('401 unauthorized'), { response: { status: 401 } });
  drive.files.list.mockRejectedValueOnce(failure);
  await expect(googleDrive.list()).resolves.toBe(failure);
  expect(googleAuth.clearCachedAccessToken).toHaveBeenCalledWith('access');
  expect(drive.files.list).toHaveBeenCalledTimes(1);
});
test('searches duplicate folders and returns the newest backup first', async () => {
  drive.files.list.mockResolvedValueOnce({ files: [{ id: 'empty' }, { id: 'older' }, { id: 'newer' }] })
    .mockResolvedValueOnce({ files: [] })
    .mockResolvedValueOnce({ files: [{ id: 'old', modifiedTime: '2025-01-01' }] })
    .mockResolvedValueOnce({ files: [{ id: 'new', modifiedTime: '2026-01-01' }] });
  const result = await googleDrive.findBackupFiles();
  expect(result).toEqual([{ id: 'new', modifiedTime: '2026-01-01' }, { id: 'old', modifiedTime: '2025-01-01' }]);
  expect(drive.files.newMetadataOnlyUploader).not.toHaveBeenCalled();
});
test('reuses a matching folder even when duplicates exist', async () => {
  drive.files.list.mockResolvedValueOnce({ files: [{ id: 'existing' }, { id: 'duplicate' }] });
  await expect(googleDrive.safeCreateFolder({ name: 'ParentBuddy', parentFolderId: 'root' })).resolves.toBe('existing');
  expect(drive.files.newMetadataOnlyUploader).not.toHaveBeenCalled();
});
test('creates the first backup folder with the requested name and parent', async () => {
  drive.files.list.mockResolvedValueOnce({ files: [] });
  const uploader = { setRequestBody: jest.fn().mockReturnThis(), execute: jest.fn().mockResolvedValue({ id: 'new-folder' }) };
  drive.files.newMetadataOnlyUploader.mockReturnValueOnce(uploader);
  await expect(googleDrive.safeCreateFolder({ name: 'Backup', parentFolderId: 'root' })).resolves.toBe('new-folder');
  expect(uploader.setRequestBody).toHaveBeenCalledWith({ name: 'Backup', mimeType: 'folder', parents: ['root'] });
});
test('rejects failed downloads and uses a fresh access token', async () => {
  jest.mocked(RNFS.downloadFile).mockReturnValue({ promise: Promise.resolve({ statusCode: 401 }), jobId: 1 } as any);
  await expect(googleDrive.downloadAndReadFile({ fileId: 'backup', filePath: '/temp' })).rejects.toThrow('401');
  expect(RNFS.downloadFile).toHaveBeenCalledWith(expect.objectContaining({ headers: { Authorization: 'Bearer access' } }));
});

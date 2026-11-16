import * as RNFS from '@dr.pogodin/react-native-fs';
import {cleanupAbandonedBackupFiles} from '../backupCacheCleanup';
jest.mock('@dr.pogodin/react-native-fs', () => ({CachesDirectoryPath:'/private/cache', readDir:jest.fn(), unlink:jest.fn()}));
const file = (name:string, directory=false) => ({name, path:'/untrusted/provider/path', isFile:()=>!directory, isDirectory:()=>directory});
beforeEach(() => jest.resetAllMocks());
test('removes abandoned generated copies, exports and Realm sidecars after a killed import', async () => {
  const names = ['backup-123-1.json', 'backup-123-2.realm', 'bebbo-import-123-3.realm', 'drive-backup-123-4.realm', 'bebbo-import-123-3.realm.lock', 'bebbo-import-123-3.realm.note', 'bebbo-import-123-3.realm.management'];
  (RNFS.readDir as jest.Mock).mockResolvedValue(names.map(name=>file(name,name.endsWith('.management'))));
  (RNFS.unlink as jest.Mock).mockResolvedValue(undefined);
  await expect(cleanupAbandonedBackupFiles()).resolves.toEqual({removed:names.length,failed:0});
  expect(RNFS.unlink).toHaveBeenCalledTimes(names.length);
  for (const name of names) expect(RNFS.unlink).toHaveBeenCalledWith('/private/cache/'+name);
});
test('never removes live data, photos, user-named backups, nested paths or unrelated directories', async () => {
  (RNFS.readDir as jest.Mock).mockResolvedValue([
    ...['user.realm','data.realm','mybackup.json','backup-latest.json','child-photo.jpg','../backup-1-2.realm','backup-1-2.realm/child','backup-1-2.realm.other'].map(name=>file(name)),
    file('backup-1-2.realm',true), file('backup-1-2.json',true),
  ]);
  await expect(cleanupAbandonedBackupFiles()).resolves.toEqual({removed:0,failed:0});
  expect(RNFS.unlink).not.toHaveBeenCalled();
});
test('continues after a failed removal and reports only counts, without private paths', async () => {
  (RNFS.readDir as jest.Mock).mockResolvedValue([file('backup-1-1.realm'),file('backup-1-2.json')]);
  (RNFS.unlink as jest.Mock).mockRejectedValueOnce(new Error('private path')).mockResolvedValueOnce(undefined);
  await expect(cleanupAbandonedBackupFiles()).resolves.toEqual({removed:1,failed:1});
  expect(RNFS.unlink).toHaveBeenCalledTimes(2);
});
test('a directory read failure does not trigger any deletion', async () => {
  (RNFS.readDir as jest.Mock).mockRejectedValueOnce(new Error('unavailable'));
  await expect(cleanupAbandonedBackupFiles()).rejects.toThrow('unavailable');
  expect(RNFS.unlink).not.toHaveBeenCalled();
});

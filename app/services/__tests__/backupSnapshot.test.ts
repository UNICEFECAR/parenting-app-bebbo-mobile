import {createSnapshot,stagePhotos,validateSnapshot,photoPath,cleanupRestorePhotos} from '../backupSnapshot';
import * as FS from '@dr.pogodin/react-native-fs';
const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9ioAAAAASUVORK5CYII=';
jest.mock('@dr.pogodin/react-native-fs',()=>({DocumentDirectoryPath:'/documents',stat:jest.fn(),readFile:jest.fn(),mkdir:jest.fn(),writeFile:jest.fn(),exists:jest.fn(),unlink:jest.fn(),readDir:jest.fn()}));
jest.mock('react-native-aes-crypto',()=>({randomKey:jest.fn(async()=>require('node:crypto').randomBytes(16).toString('hex'))}));
const context={flavour:'bebbo',country:'1',language:'en'},flags={growthEnabled:true,developmentEnabled:false,vchcEnabled:true};
const child={uuid:'one',birthDate:'2024-01-01',photoUri:'/original.jpg',favoriteadvices:[1],checkedMilestones:[2],reminders:[],measures:[]};
beforeEach(()=>{jest.clearAllMocks();jest.mocked(FS.stat).mockResolvedValue({size:68,isFile:()=>true} as any);jest.mocked(FS.readFile).mockResolvedValue(png);jest.mocked(FS.exists).mockResolvedValue(false);jest.mocked(FS.writeFile).mockResolvedValue(undefined);jest.mocked(FS.unlink).mockResolvedValue(undefined);jest.mocked(FS.readDir).mockResolvedValue([]);});
test('captures profile bytes, ownership and preferences without mutating live records',async()=>{
 const s=await createSnapshot([child],{userName:'عائشہ'},flags,context);expect(s.children[0].photoUri).toBe('attached');expect(s.photos.one).toBe(png);expect(child.photoUri).toBe('/original.jpg');expect(s.children[0].favoriteadvices).toEqual([1]);
 const staged=await stagePhotos(s);expect(staged.children[0].photoUri).toMatch(/^\/restore-photo-/);expect(FS.writeFile).toHaveBeenCalledWith(staged.paths[0],png,'base64');expect(FS.writeFile).not.toHaveBeenCalledWith('/documents/children/original.jpg',expect.anything(),expect.anything());
});
test.each(['../secret','/../../secret','file:///private/file','a/b.jpg'])('rejects unsafe photo path %s',uri=>{expect(()=>photoPath(uri)).toThrow();});
test('rejects cross-country/flavour restores but permits another UI language in the same country',async()=>{
 const s=await createSnapshot([child],{},flags,context);expect(()=>validateSnapshot(s,{...context,country:'2'})).toThrow('same app and country');expect(()=>validateSnapshot(s,{...context,flavour:'other'})).toThrow();expect(validateSnapshot(s,{...context,language:'ar'})).toBe(s);
});
test('rejects missing attachments, unknown owners and injected settings',async()=>{
 const s=await createSnapshot([child],{},flags,context);expect(()=>validateSnapshot({...s,photos:{}},context)).toThrow('missing');expect(()=>validateSnapshot({...s,photos:{other:png}},context)).toThrow();expect(()=>validateSnapshot({...s,settings:{__backup_restore_v1:'injected'}},context)).toThrow();
});
test('rejects a decompression-sized image header before native decoding',async()=>{
 const s=await createSnapshot([child],{},flags,context),bytes=Buffer.from(png,'base64');bytes.writeUInt32BE(90000,16);expect(()=>validateSnapshot({...s,photos:{one:bytes.toString('base64')}},context)).toThrow('4096');
});
test('failed photo staging cleans only newly created files and leaves original photos alone',async()=>{
 const s=await createSnapshot([child],{},flags,context);jest.mocked(FS.writeFile).mockRejectedValueOnce(new Error('disk full'));await expect(stagePhotos(s)).rejects.toThrow('disk full');expect(FS.unlink).toHaveBeenCalledTimes(1);expect(FS.unlink).not.toHaveBeenCalledWith('/documents/children/original.jpg');
});
test('orphan cleanup removes only generated, unreferenced restore photos',async()=>{
 const a='restore-photo-'+'a'.repeat(32)+'.jpg',b='restore-photo-'+'b'.repeat(32)+'.jpg';jest.mocked(FS.exists).mockResolvedValue(true);jest.mocked(FS.readDir).mockResolvedValue([a,b,'original.jpg'].map(name=>({name,isFile:()=>true})) as any);await cleanupRestorePhotos([{photoUri:'/'+a}]);expect(FS.unlink).toHaveBeenCalledWith('/documents/children/'+b);expect(FS.unlink).toHaveBeenCalledTimes(1);
});

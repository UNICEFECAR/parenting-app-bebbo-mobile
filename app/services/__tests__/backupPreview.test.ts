import {getBackupPreview,holdBackupPreview,clearBackupPreviews} from '../backupPreview';
afterEach(()=>{clearBackupPreviews();jest.restoreAllMocks();});
test('navigation handle contains no child data and only the current preview can be read',()=>{
 const data={children:[{name:'Synthetic private name'}],photos:{one:'private bytes'}};const first=holdBackupPreview(data);expect(first).not.toContain('Synthetic');expect(getBackupPreview(first)).toBe(data);holdBackupPreview([]);expect(()=>getBackupPreview(first)).toThrow('expired');
});
test('expired or explicitly cleared previews cannot restore anything',()=>{
 jest.spyOn(Date,'now').mockReturnValue(0);const id=holdBackupPreview([]);jest.mocked(Date.now).mockReturnValue(31*60*1000);expect(()=>getBackupPreview(id)).toThrow('expired');const fresh=holdBackupPreview([]);clearBackupPreviews();expect(()=>getBackupPreview(fresh)).toThrow('expired');
});
test('an obsolete navigation handle cannot discard a newer valid preview',()=>{
 const stale=holdBackupPreview(['old']),current=holdBackupPreview(['current']);
 expect(()=>getBackupPreview(stale)).toThrow('expired');
 expect(getBackupPreview(current)).toEqual(['current']);
});

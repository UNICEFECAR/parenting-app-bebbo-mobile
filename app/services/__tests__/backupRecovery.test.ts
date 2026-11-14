jest.mock('react-native-aes-crypto',()=>({randomKey:jest.fn()}));
jest.mock('../../database/dbquery/userRealmCommon',()=>({userRealmCommon:{openRealm:jest.fn()}}));
jest.mock('../../database/dbquery/dataRealmCommon',()=>({dataRealmCommon:{openRealm:jest.fn()}}));
jest.mock('@dr.pogodin/react-native-fs',()=>({DocumentDirectoryPath:'/documents',exists:jest.fn().mockResolvedValue(true),readDir:jest.fn().mockResolvedValue([]),unlink:jest.fn()}));
import {commitPortableRestore,recoverPendingBackup} from '../backupRecovery';
import {installBackupRuntime} from '../backupRuntime';
import {userRealmCommon} from '../../database/dbquery/userRealmCommon';
import {dataRealmCommon} from '../../database/dbquery/dataRealmCommon';
const profile=(id:string)=>({uuid:id,birthDate:'2024-01-01',createdAt:'2024-01-01',updatedAt:'2024-01-01',photoUri:'',measures:[],reminders:[],favoriteadvices:[],favoritegames:[]});
const oldFlags={growthEnabled:true,developmentEnabled:false,vchcEnabled:true}, newFlags={growthEnabled:false,developmentEnabled:true,vchcEnabled:false};
let children:any[],settings:any[],failInsert=false,failSettings=false,failFlags=false,runtime:any,release:()=>void;
const journal=()=>settings.find(x=>x.key==='__backup_restore_v1');
beforeEach(()=>{
 children=[profile('old')];settings=[{key:'userName',value:'Previous caregiver'},{key:'otherCountrySetting',value:'untouched'}];failInsert=false;failSettings=false;failFlags=false;
 const user={objects:()=>children,deleteAll:()=>{children=[];},create:(_s:string,c:any)=>{if(failInsert&&c.uuid==='two')throw new Error('insert failed');children.push({...c});},write:(work:()=>void)=>{const before=children;children=[...children];try{work();}catch(e){children=before;throw e;}}};
 const data={objects:()=>({filtered:(_q:string,key:string)=>settings.filter(x=>x.key===key)}),delete:(rows:any[])=>{settings=settings.filter(x=>!rows.includes(x));},create:(_s:string,x:any)=>{if(failSettings&&x.key==='userName')throw new Error('settings failed');settings.push({...x});},write:(work:()=>void)=>{const before=settings;settings=[...settings];try{work();}catch(e){settings=before;throw e;}}};
 jest.mocked(userRealmCommon.openRealm).mockResolvedValue(user as any);jest.mocked(dataRealmCommon.openRealm).mockResolvedValue(data as any);
 runtime={context:()=>({flavour:'bebbo',country:'1',language:'en'}),flags:()=>({...oldFlags}),applyFlags:jest.fn(async()=>{if(failFlags)throw new Error('persistence failed');}),recoveryRequired:jest.fn()};release=installBackupRuntime(runtime);
});
afterEach(()=>release());
test('commits profiles and portable preferences, preserving unrelated country settings',async()=>{
 await commitPortableRestore([profile('one'),profile('two')],{userName:'Restored caregiver',currentActiveChildId:'two'},newFlags);
 expect(children.map(c=>c.uuid)).toEqual(['one','two']);expect(settings).toEqual(expect.arrayContaining([expect.objectContaining({key:'userName',value:'Restored caregiver'}),{key:'otherCountrySetting',value:'untouched'}]));expect(journal()).toBeUndefined();expect(runtime.applyFlags).toHaveBeenCalledWith(newFlags);
});
test('failed second insertion leaves original profiles and a durable retry journal',async()=>{
 failInsert=true;await expect(commitPortableRestore([profile('one'),profile('two')],{userName:'New'},newFlags)).rejects.toThrow('Restore interrupted');
 expect(children.map(c=>c.uuid)).toEqual(['old']);expect(journal()).toBeDefined();expect(runtime.recoveryRequired).toHaveBeenCalled();
 failInsert=false;await recoverPendingBackup();expect(children.map(c=>c.uuid)).toEqual(['one','two']);expect(journal()).toBeUndefined();
});
test.each(['settings','redux'])('a %s failure is recoverable and never clears the journal early',async(where)=>{
 failSettings=where==='settings';failFlags=where==='redux';await expect(commitPortableRestore([profile('one')],{userName:'New'},newFlags)).rejects.toThrow('Restore interrupted');
 expect(journal()).toBeDefined();expect(settings.find(x=>x.key==='userName').value).toBe('Previous caregiver');
 failSettings=false;failFlags=false;await recoverPendingBackup();expect(journal()).toBeUndefined();expect(settings.find(x=>x.key==='userName').value).toBe('New');expect(children).toHaveLength(1);
});
test('explicit rollback restores the complete previous dataset and flags after post-commit failure',async()=>{
 failFlags=true;await expect(commitPortableRestore([profile('one')],{userName:'New'},newFlags)).rejects.toThrow();failFlags=false;
 await recoverPendingBackup(true);expect(children.map(c=>c.uuid)).toEqual(['old']);expect(settings.find(x=>x.key==='userName').value).toBe('Previous caregiver');expect(runtime.applyFlags).toHaveBeenLastCalledWith(oldFlags);expect(journal()).toBeUndefined();
});
test('rollback direction is durable when rollback itself is interrupted',async()=>{
 failFlags=true;await expect(commitPortableRestore([profile('one')],{userName:'New'},newFlags)).rejects.toThrow();await expect(recoverPendingBackup(true)).rejects.toThrow();expect(JSON.parse(journal().value).direction).toBe('rollback');
 failFlags=false;await recoverPendingBackup();expect(children.map(c=>c.uuid)).toEqual(['old']);expect(journal()).toBeUndefined();
});
test('repeated recovery after success never appends duplicate profiles',async()=>{
 await commitPortableRestore([profile('one')],{},newFlags);await recoverPendingBackup();await recoverPendingBackup();expect(children.map(c=>c.uuid)).toEqual(['one']);
});
test('corrupt recovery metadata is rejected without altering live data',async()=>{
 settings.push({key:'__backup_restore_v1',value:'{"version":99}'});await expect(recoverPendingBackup()).rejects.toThrow('invalid');expect(children.map(c=>c.uuid)).toEqual(['old']);expect(journal()).toBeDefined();
});

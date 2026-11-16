import {createRealmPersistStorage, fragmentString} from '../../redux/reducers/realmPersistor';
import {getRealmLib, safeOpenRealm} from '../../redux/reducers/realmSafe';
jest.mock('../../redux/reducers/realmSafe', () => ({getRealmLib:jest.fn(),safeOpenRealm:jest.fn()}));
beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(getRealmLib).mockResolvedValue({Object:class {},UpdateMode:{Modified:'modified'}});
  jest.mocked(safeOpenRealm).mockResolvedValue({write:(fn:any)=>fn(),create:jest.fn()} as any);
});
test('registers the existing schema-0 migration with the current Realm API and preserves its data', async () => {
  await createRealmPersistStorage({path:'fixture.realm'}).setItem('persist:utilsData','{}');
  const config=jest.mocked(safeOpenRealm).mock.calls[0][0];
  expect(config.schemaVersion).toBe(1);
  expect(config.migration).toBeUndefined();
  expect(config.onMigration).toBeInstanceOf(Function);
  const old=[{content:'فاطِمة / عائشَہ 😀'},{content:''}];
  const next=[{fragments:[] as string[]},{fragments:[] as string[]}];
  config.onMigration({schemaVersion:0,objects:()=>old},{objects:()=>next});
  expect(next.map(row=>row.fragments.join(''))).toEqual(old.map(row=>row.content));
});
test('does not rewrite data from an already-current schema', async () => {
  await createRealmPersistStorage({path:'fixture.realm'}).setItem('key','{}');
  const config=jest.mocked(safeOpenRealm).mock.calls[0][0];
  const objects=jest.fn();config.onMigration({schemaVersion:1,objects},{objects});
  expect(objects).not.toHaveBeenCalled();
});
test('large non-Latin cache fragments stay below the native byte limit', () => {
  const text='अ'.repeat(6000000);
  const fragments=fragmentString(text);
  expect(fragments.join('')).toBe(text);
  expect(fragments.every(value=>Buffer.byteLength(value,'utf8')<=16000000)).toBe(true);
});
test('a surrogate pair crossing a fragment boundary remains valid after native UTF-8 conversion', () => {
  const text='a'+'😀'.repeat(2000000);
  const fragments=fragmentString(text);
  expect(fragments).toHaveLength(2);
  expect(fragments.map(value=>Buffer.from(value,'utf8').toString('utf8')).join('')).toBe(text);
});
test('empty persisted strings remain empty and non-string values fail explicitly', () => {
  expect(fragmentString('')).toEqual([]);
  expect(()=>fragmentString(undefined as any)).toThrow('must be a string');
});

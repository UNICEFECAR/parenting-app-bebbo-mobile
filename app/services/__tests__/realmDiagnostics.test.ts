import Realm from 'realm';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {diagnosticError} from '../diagnostics';
// Jest's VM does not implement the native dynamic-import boundary. Compile the
// actual helper with only that boundary redirected to the mocked Realm module;
// its error handling and filesystem fallback remain the production source.
const fs = require('node:fs'), path = require('node:path'), babel = require('@babel/core');
const filename = path.resolve(__dirname, '../../redux/reducers/realmSafe.ts');
const compiled = babel.transformSync(fs.readFileSync(filename, 'utf8'), {filename,
  plugins: [({types}: any) => ({visitor: {CallExpression(p: any) {
    if (p.node.callee.type === 'Import') p.replaceWith(types.callExpression(types.identifier('require'), p.node.arguments));
  }}})],
}).code;
const loaded = {exports: {}};
new Function('require', 'module', 'exports', compiled)((name: string) => {
  if (name === 'realm') return {__esModule:true,default:Realm};
  if (name === '@dr.pogodin/react-native-fs') return RNFS;
  if (name.endsWith('/diagnostics')) return {diagnosticError};
  return require(name);
}, loaded, loaded.exports);
const {safeOpenRealm, safeDeleteRealm, getRealmLib} = loaded.exports as typeof import('../../redux/reducers/realmSafe');
jest.mock('realm', () => ({__esModule:true,default:{open:jest.fn(),deleteFile:jest.fn()}}));
jest.mock('@dr.pogodin/react-native-fs', () => ({unlink:jest.fn()}));
const privatePath = '/private/children/Fatima-2024-01-01.realm';
function loggedValues(): string {
  return [console.error].flatMap(fn => (fn as jest.Mock).mock.calls.flat())
    .map(value => value instanceof Error ? value.message+' '+value.stack : String(value)).join('\n');
}
beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console,'error').mockImplementation(()=>{});
});
afterEach(() => jest.restoreAllMocks());
test('opening errors keep a failure signal without leaking child data or database paths', async () => {
  (Realm.open as jest.Mock).mockRejectedValueOnce(new Error('Invalid child Fatima, born 2024-01-01 in '+privatePath));
  await expect(safeOpenRealm({path:privatePath})).resolves.toBeNull();
  expect(Realm.open).toHaveBeenCalledWith({path:privatePath});
  expect(console.error).toHaveBeenCalled();
  expect(loggedValues()).toContain('Application operation failed');
  expect(loggedValues()).not.toMatch(/Fatima|2024-01-01|private\/children/);
});
test('native deletion failures recover through the existing filesystem fallback without logging payloads', async () => {
  (Realm.deleteFile as jest.Mock).mockRejectedValueOnce(new Error('Cannot delete '+privatePath));
  (RNFS.unlink as jest.Mock).mockResolvedValueOnce(undefined);
  await safeDeleteRealm({path:privatePath});
  expect(RNFS.unlink).toHaveBeenCalledWith(privatePath);
  expect(console.error).toHaveBeenCalled();
  expect(loggedValues()).not.toMatch(/Fatima|2024-01-01|private\/children/);
});
test('successful cleanup logs no private path and keeps the existing native deletion behaviour', async () => {
  expect(await getRealmLib()).toBe(Realm);
  (Realm.deleteFile as jest.Mock).mockResolvedValueOnce(undefined);
  await safeDeleteRealm({path:privatePath});
  expect(Realm.deleteFile).toHaveBeenCalledWith({path:privatePath});
  expect(RNFS.unlink).not.toHaveBeenCalled();
  expect(loggedValues()).not.toContain(privatePath);
});

test('failed filesystem cleanup emits a scrubbed failure rather than a success log', async () => {
  (Realm.deleteFile as jest.Mock).mockRejectedValueOnce(new Error('Cannot delete '+privatePath));
  (RNFS.unlink as jest.Mock).mockRejectedValueOnce(new Error('Permission denied '+privatePath));
  await safeDeleteRealm({path:privatePath});
  expect(console.error).toHaveBeenCalledTimes(2);
  expect(loggedValues()).not.toMatch(/Fatima|2024-01-01|private\/children/);
});
test('already absent temporary files are a completed cleanup, not an unexpected I/O failure', async () => {
  (Realm.deleteFile as jest.Mock).mockRejectedValueOnce(new Error('Native cleanup unavailable'));
  (RNFS.unlink as jest.Mock).mockRejectedValueOnce(Object.assign(new Error('Missing '+privatePath),{code:'ENOENT'}));
  await safeDeleteRealm({path:privatePath});
  expect(console.error).toHaveBeenCalledTimes(1);
  expect(loggedValues()).not.toContain(privatePath);
});

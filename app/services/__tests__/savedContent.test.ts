import {userRealmCommon} from '../../database/dbquery/userRealmCommon';
import {dataRealmCommon} from '../../database/dbquery/dataRealmCommon';
import {openUserRealm} from '../../database/config/dbConfig';
jest.mock('../childCRUD', () => ({getDiffinDays: jest.fn()}));
jest.mock('../../database/config/dbConfig', () => ({openUserRealm: jest.fn(), deleteUserRealm: jest.fn()}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {openRealm: jest.fn()}}));

test('content refresh never inserts a synthetic bookmark or drops saved IDs missing from a partial offline cache', async () => {
  const children = [{favoriteadvices: [10, 999], favoritegames: []}, {favoriteadvices: [], favoritegames: [12, 888]}];
  const saved = JSON.parse(JSON.stringify(children));
  const realm = {objects: () => children, write: (work: () => void) => work()};
  userRealmCommon.realm = null;
  jest.mocked(openUserRealm).mockResolvedValue(realm as any);
  jest.mocked(dataRealmCommon.openRealm).mockResolvedValue({objects: () => ({filtered: () => [{id: 10}, {id: 12}, {id: 1234}]})} as any);
  await userRealmCommon.verifyFavorites();
  expect(children).toEqual(saved);
});

test('profile update returns confirmed records after the synchronous transaction', async () => {
  const records = [{uuid: 'child', childName: 'Name'}];
  const create = jest.fn();
  userRealmCommon.realm = {write: (work: () => void) => work(), create} as any;
  await expect(userRealmCommon.updateChild({name: 'ChildEntity'} as any, records)).resolves.toBe(records);
  expect(create).toHaveBeenCalledTimes(1);
  userRealmCommon.realm = {write: () => {throw new Error('disk full');}} as any;
  await expect(userRealmCommon.updateChild({name: 'ChildEntity'} as any, records)).resolves.toEqual([]);
});

import {getUserRealmConfig} from '../../database/config/dbConfig';
import {migrateConfigSettings} from '../../database/migration/init';
jest.mock('../../redux/reducers/realmSafe', () => ({getRealmLib: jest.fn().mockResolvedValue({}), safeOpenRealm: jest.fn(), safeDeleteRealm: jest.fn()}));

test('older installed profiles receive the missing autoChild flag without losing fields', async () => {
  const {config} = await getUserRealmConfig();
  const children = [{uuid: 'saved', childName: 'Existing child', autoChild: ''}, {uuid: 'default', autoChild: 'true'}];
  config.onMigration({schemaVersion: 3, objects: () => children}, {schemaVersion: 4, objects: () => children});
  expect(children).toEqual([{uuid: 'saved', childName: 'Existing child', autoChild: 'false'}, {uuid: 'default', autoChild: 'true'}]);
  expect(config.schemaVersion).toBe(4);
});

test('existing schema-4 flags are preserved', async () => {
  const {config} = await getUserRealmConfig();
  const children = [{uuid: 'saved', autoChild: 'true'}];
  config.onMigration({schemaVersion: 4}, {schemaVersion: 4, objects: () => children});
  expect(children[0].autoChild).toBe('true');
});

test('configuration migration copies all historical caregiver settings synchronously', () => {
  const rows = [{key: 'userName', value: 'Parent'}, {key: 'currentActiveChildId', value: 'saved'}];
  const create = jest.fn();
  expect(migrateConfigSettings({objects: () => ({filtered: () => rows})}, {create})).toBeUndefined();
  expect(create).toHaveBeenCalledTimes(2);
  expect(create).toHaveBeenCalledWith('ConfigSettings', expect.objectContaining({key: 'currentActiveChildId', value: 'saved'}));
});

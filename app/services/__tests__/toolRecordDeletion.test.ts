import type {ObjectSchema} from 'realm';
import {userRealmCommon} from '../../database/dbquery/userRealmCommon';

jest.mock('../childCRUD', () => ({}));
jest.mock('../../database/config/dbConfig', () => ({}));
const schema: ObjectSchema = {name: 'ChildEntity', properties: {}};
const condition = "uuid = 'first-child'";

type RecordEntry = {uuid: string; reminderDate?: number; reminderTime?: number};
function storage(measures: RecordEntry[], reminders: RecordEntry[]) {
  const child = {measures, reminders};
  const filtered = jest.fn((filter: string) => filter === condition ? [child] : []);
  const realm = {objects: () => ({filtered}), write: (change: () => void) => change()};
  jest.spyOn(userRealmCommon, 'openRealm').mockResolvedValue(realm as any);
  return child;
}
afterEach(() => jest.restoreAllMocks());

test.each(['measures', 'reminders'] as const)('deleting an absent %s UUID never removes another record', async kind => {
  const rows = [{uuid: 'one'}, {uuid: 'two'}, {uuid: 'three'}];
  const child = storage(kind === 'measures' ? rows : [], kind === 'reminders' ? rows : []);
  const remove = (uuid: string) => kind === 'measures'
    ? userRealmCommon.deleteChildMeasures(schema, {uuid}, condition)
    : userRealmCommon.deleteChildReminders(schema, {uuid}, condition);
  await remove('missing');
  expect(child[kind].map(item => item.uuid)).toEqual(['one', 'two', 'three']);
  await remove('two');
  await remove('two');
  expect(child[kind].map(item => item.uuid)).toEqual(['one', 'three']);
});

test('birth-date edit removes all expired appointments and preserves future and exact-cutoff reminders', async () => {
  const day = new Date(2026, 10, 18, 0, 0).getTime();
  const at = (hour: number) => new Date(2026, 10, 1, hour, 0).getTime();
  const reminders = [['later', 16], ['past1', 8], ['past2', 9], ['boundary', 12]] as const;
  const child = storage([], reminders.map(([uuid, hour]) => ({uuid, reminderDate: day, reminderTime: at(hour)})));
  const cutoff = new Date(2026, 10, 18, 12, 0).getTime();
  await userRealmCommon.deleteNestedReminders(schema, cutoff, condition);
  await userRealmCommon.deleteNestedReminders(schema, cutoff, condition);
  expect(child.reminders.map(item => item.uuid)).toEqual(['later', 'boundary']);
});

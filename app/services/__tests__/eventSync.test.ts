import {logEvent, synchronizeEvents} from '../EventSyncService';
import {tryLogAnalyticsEvent} from '../firebaseAnalytics';
import {dataRealmCommon} from '../../database/dbquery/dataRealmCommon';
import {logAnalyticsEvent} from '../firebaseAnalytics';

jest.mock('../firebaseAnalytics', () => ({
  logAnalyticsEvent: jest.fn().mockResolvedValue(undefined),
  tryLogAnalyticsEvent: jest.fn(),
}));
jest.mock('../../database/dbquery/dataRealmCommon', () => ({dataRealmCommon: {openRealm: jest.fn()}}));

let rows: any[];
let realm: any;
const submit = jest.mocked(tryLogAnalyticsEvent);
beforeEach(() => {
  jest.clearAllMocks();
  rows = [];
  // Realm.Results is live: marking a row synced changes the next iteration.
  const results = {[Symbol.iterator]: function* () {
    for (let index = 0; index < rows.filter(row => !row.isSynchronized).length; index++)
      yield rows.filter(row => !row.isSynchronized)[index];
  }, get length() {return rows.filter(row => !row.isSynchronized).length;}};
  realm = {delete: jest.fn(target => {const deleting = typeof target[Symbol.iterator] === 'function' ? Array.from(target) : [target]; rows = rows.filter(row => !deleting.includes(row));}), write: jest.fn(fn => fn()), create: jest.fn((_type, row) => {rows.push(row); return row;}), objects: () => ({filtered: (query: string) => query.includes('true') ? rows.filter(row => row.isSynchronized) : results})};
  jest.mocked(dataRealmCommon.openRealm).mockResolvedValue(realm);
  submit.mockResolvedValue(true);

});

test.each([true, false, undefined])('passes events directly to the durable native SDK regardless of connectivity (%s)', async connected => {
  await logEvent({name: 'child_added', params: {count: 2}}, connected);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('child_added', {count: 2});
  expect(rows).toHaveLength(0);
});

test('SDK failure does not mark an offline event as synchronized', async () => {
  rows.push({name: 'offline-event', params: '{"count":1}', isSynchronized: false});
  submit.mockResolvedValue(false);
  await synchronizeEvents(true);
  expect(rows[0].isSynchronized).toBe(false);
});

test('all rows in a live Realm result are sent without skipping the middle row', async () => {
  for (const name of ['first', 'second', 'third']) rows.push({name, params: '{}', isSynchronized: false});
  await synchronizeEvents(true);
  expect(submit.mock.calls.map(call => call[0])).toEqual(['first', 'second', 'third']);
  expect(rows.every(row => row.isSynchronized)).toBe(true);
});

test('overlapping flush calls submit each queued record only once', async () => {
  rows.push({name: 'once', params: '{}', isSynchronized: false});
  let finish!: (value: boolean) => void;
  submit.mockImplementationOnce(() => new Promise(resolve => {finish = resolve;}));
  const first = synchronizeEvents(true);
  const second = synchronizeEvents(true);
  for (let i = 0; i < 20 && !finish; i++) await Promise.resolve();
  expect(finish).toBeDefined();
  expect(submit).toHaveBeenCalledTimes(1);
  finish(true);
  await Promise.all([first, second]);
  expect(submit).toHaveBeenCalledTimes(1);
});

test('unknown connectivity and unavailable storage do not reject a caregiver action', async () => {
  jest.mocked(dataRealmCommon.openRealm).mockResolvedValue(null);
  await expect(logEvent({name: 'offline'}, undefined as any)).resolves.toBeUndefined();
});

test('successful online events are not duplicated into the offline queue', async () => {
  await logEvent({name: 'online', params: {count: 1}}, true);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('online', {count: 1});
  expect(rows).toHaveLength(0);
});

test('an individual failed event does not prevent a later valid event from syncing', async () => {
  rows.push({name: 'retry', params: '{}', isSynchronized: false}, {name: 'ok', params: '{}', isSynchronized: false});
  submit.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  await synchronizeEvents(true);
  expect(rows.map(row => row.name)).toEqual(['retry']);
});

import {DateTime} from 'luxon';
import {createAllLocalNotificatoins, getVCNotis} from '../notificationService';

jest.mock('../../instances', () => ({appConfig: {oneMonthDays: 30, threeeMonthDays: 90, twoMonthDays: 60, afterDays: 1, beforeDays: 5, maxPeriodDays: 3650}}));
jest.mock('uuid', () => ({v4: () => 'uuid'}));
jest.mock('../childCRUD', () => ({
  isFutureDateTime: (value: any) => Number(new Date(value)) > Date.now(),
  isFutureDate: (value: any) => Number(new Date(value)) > Date.now(),
  getCurrentChildAgeInDays: () => 0,
}));
const ages = [{id: 900, days_from: 0, days_to: 30, name: 'first'}, {id: 100, days_from: 31, days_to: 60, name: 'next'}];
const child = {uuid: 'saved', childName: 'Child', birthDate: '2025-01-01T00:00:00Z', plannedTermDate: '2025-01-01T00:00:00Z', taxonomyData: {id: 900}, measures: []};
const generate = (record: any = child, groups: any = [], ageData: any = ages, vaccines = false) =>
  createAllLocalNotificatoins(record, ageData, true, false, vaccines, (key: string) => key, [], [], [], [], groups).data;
beforeEach(() => {jest.useFakeTimers(); jest.setSystemTime(new Date('2025-01-01T00:00:00Z'));});
afterEach(() => {jest.useRealTimers(); jest.restoreAllMocks();});

test('future developmental periods follow chronological age, not Drupal ID order', () => {
  expect(generate().length).toBe(4);
});

test('notification planning does not mutate shared taxonomy order', () => {
  const input = Object.freeze([...ages].reverse());
  expect(() => generate(child, [], input)).not.toThrow();
});

test('corrected developmental dates use the planned date, not the premature taxonomy ID', () => {
  const record = {...child, plannedTermDate: '2025-01-21T00:00:00Z', taxonomyData: {id: 900, prematureTaxonomyId: 900}};
  const notifications = generate(record);
  expect(notifications.length).toBe(4);
  expect(notifications[0].notiDate.toISODate()).toBe('2025-01-23');
});

test('profiles without a planned-term date still get developmental reminders', () => {
  expect(generate({...child, plannedTermDate: undefined}).length).toBe(4);
});

test('IDs are unique within the newly generated batch', () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  const notifications = generate();
  expect(new Set(notifications.map((item: any) => item.notiid)).size).toBe(notifications.length);
});

test('a collision with an existing notification returns a valid replacement ID', () => {
  jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValue(0.1);
  const notifications = generate(child, [{key: 'other-child', data: [{notiid: '10000000'}]}]);
  expect(notifications.every((item: any) => Number.isInteger(item.notiid))).toBe(true);
  expect(notifications.some((item: any) => item.notiid === 10000000)).toBe(false);
});

test('empty vaccine catalogues remain a valid notification planning state', () => {
  expect(getVCNotis([], [], child)).toEqual([]);
  expect(() => generate(child, [], ages, true)).not.toThrow();
});

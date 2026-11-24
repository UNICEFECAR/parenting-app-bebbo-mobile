/** @jest-environment-options {"customExportConditions":["node","node-addons"]} */
import {DateTime} from 'luxon';
import {getChildReminderNotifications} from '../notificationService';
import notificationReducer, {removeReminderNotifications, setAllNotificationData} from '../../redux/reducers/notificationSlice';

jest.mock('../../instances', () => ({appConfig: {}}));
jest.mock('uuid', () => ({v4: jest.fn(() => String(Math.random()))}));
jest.mock('../childCRUD', () => ({
  isFutureDateTime: (value: any) => Number(new Date(value)) > Date.now(),
}));

const time = (hour: number, minute = 0) => DateTime.local(2026, 11, 24, hour, minute).toMillis();
const makeReminder = (reminderType: string) => ({
  uuid: 'reminder-1', reminderType,
  reminderDate: time(0), reminderTime: time(12),
  reminderDateDefined: time(0), reminderTimeDefined: time(11),
});
const generate = (reminder: any, history: any[] = [], enabled = true) =>
  getChildReminderNotifications({birthDate: '2023-11-06', reminders: reminder ? [reminder] : []}, history, enabled);
const visible = (rows: any[]) => rows.filter(row => Number(new Date(row.notificationDate)) <= Date.now() && !row.isDeleted);

beforeEach(() => {jest.useFakeTimers(); jest.setSystemTime(time(10));});
afterEach(() => jest.useRealTimers());

describe.each(['healthCheckup', 'vaccine'])('%s reminder history', type => {
  test('keeps the three main-branch messages and their original timing', () => {
    const rows = generate(makeReminder(type));
    expect(rows.map((row: any) => row.subtype)).toEqual(['start', 'reminder', 'scheduled']);
    expect(visible(rows)).toHaveLength(1);
    jest.setSystemTime(time(11));
    expect(visible(rows)).toHaveLength(2);
    jest.setSystemTime(time(12));
    expect(visible(rows)).toHaveLength(3);
  });

  test('refresh and restart preserve IDs, read state and deleted state', () => {
    const reminder = makeReminder(type);
    const history = generate(reminder).map((row: any) => ({...row, isRead: true, isDeleted: true}));
    const persisted = JSON.parse(JSON.stringify(history));
    const next = generate(reminder, persisted);
    expect(next).toEqual(persisted);
  });

  test('editing only the appointment does not duplicate the unchanged reminder-set message', () => {
    const reminder = makeReminder(type);
    const history = generate(reminder);
    const next = generate({...reminder, reminderTime: time(13)}, history);
    expect(next.filter((row: any) => row.subtype === 'start')).toHaveLength(1);
    expect(next.find((row: any) => row.subtype === 'scheduled').growth_period).toBe(time(13));
  });

  test('hidden date-picker seconds do not create another identical message', () => {
    const reminder = makeReminder(type);
    const next = generate({...reminder, reminderDateDefined: time(0) + 1234, reminderTimeDefined: time(11) + 5678}, generate(reminder));
    expect(next.filter((row: any) => row.subtype === 'start')).toHaveLength(1);
  });

  test('a changed reminder time produces one new confirmation and stays stable on refresh', () => {
    const reminder = makeReminder(type);
    const changed = {...reminder, reminderTimeDefined: time(11, 30)};
    const history = generate(reminder);
    jest.setSystemTime(time(10, 1));
    const next = generate(changed, history);
    expect(next.filter((row: any) => row.subtype === 'start')).toHaveLength(2);
    expect(generate(changed, next)).toEqual(next);
    expect(generate(changed, [...next].reverse())).toEqual(next);
  });

  test('repairs already duplicated confirmations without resurrecting deleted/read messages', () => {
    const reminder = makeReminder(type);
    const history = generate(reminder);
    const duplicate = {...history[0], subtypeid: 'duplicate', isRead: true, isDeleted: true, notificationDate: DateTime.fromMillis(time(10, 1))};
    jest.setSystemTime(time(10, 2));
    const next = generate(reminder, [...history, duplicate]);
    const starts = next.filter((row: any) => row.subtype === 'start');
    expect(starts).toHaveLength(1);
    expect(starts[0]).toMatchObject({isRead: true, isDeleted: true});
  });

  test('automatic expiry drops future rows but retains past history', () => {
    expect(generate(null, generate(makeReminder(type))).map((row: any) => row.subtype)).toEqual(['start']);
  });

  test('explicit deletion removes every associated message only for that child and reminder', () => {
    const reminder = makeReminder(type);
    const history = generate(reminder);
    const otherHistory = generate({...reminder, uuid: 'other-reminder'});
    const initial = notificationReducer(undefined, setAllNotificationData([
      {childuuid: 'child-1', reminderNotis: [...history, ...otherHistory], gwcdnotis: [{type: 'cd'}]},
      {childuuid: 'child-2', reminderNotis: history},
    ]));
    const next = notificationReducer(initial, removeReminderNotifications({
      childUuid: 'child-1', reminderUuid: reminder.uuid,
    }));
    expect(next.notifications[0].reminderNotis).toEqual(otherHistory);
    expect(next.notifications[0].gwcdnotis).toEqual(initial.notifications[0].gwcdnotis);
    expect(next.notifications[1]).toEqual(initial.notifications[1]);
    const restarted = JSON.parse(JSON.stringify(next));
    const refreshed = generate({...reminder, uuid: 'other-reminder'}, restarted.notifications[0].reminderNotis);
    expect(refreshed.some((row: any) => row.uuid === reminder.uuid)).toBe(false);
    expect(refreshed).toHaveLength(3);
  });

  test('deleting the last reminder leaves no confirmation after regeneration', () => {
    const reminder = makeReminder(type);
    const initial = notificationReducer(undefined, setAllNotificationData([
      {childuuid: 'child-1', reminderNotis: generate(reminder)},
    ]));
    const action = removeReminderNotifications({childUuid: 'child-1', reminderUuid: reminder.uuid});
    const next = notificationReducer(initial, action);
    expect(next.notifications[0].reminderNotis).toEqual([]);
    expect(generate(null, next.notifications[0].reminderNotis)).toEqual([]);
    expect(notificationReducer(next, action)).toEqual(next);
  });

  test('rescheduling an elapsed appointment creates its new future alerts', () => {
    const reminder = makeReminder(type);
    const history = generate(reminder);
    jest.setSystemTime(time(12, 30));
    const changed = {...reminder, reminderTime: time(14), reminderTimeDefined: time(13)};
    const next = generate(changed, history);
    expect(next.filter((row: any) => Number(new Date(row.notificationDate)) > Date.now())).toHaveLength(2);
    expect(generate(changed, next)).toEqual(next);
  });

  test('alert time matches the timestamp used to schedule and cancel the device reminder', () => {
    const reminder = {...makeReminder(type), reminderTimeDefined: time(11) + 23000};
    const next = generate(reminder);
    expect(Number(new Date(next.find((row: any) => row.subtype === 'reminder').notificationDate))).toBe(time(11) + 23000);
  });

  test('partial imported history does not crash regeneration', () => {
    const reminder = makeReminder(type);
    const history = generate(reminder).filter((row: any) => row.subtype === 'reminder');
    expect(() => generate(reminder, history)).not.toThrow();
  });

  test('disabled reminders stay hidden', () => {
    const reminder = makeReminder(type);
    expect(visible(generate(reminder, [], false))).toHaveLength(0);
  });

  test('distinct reminders with the same time stay separate', () => {
    const reminder = makeReminder(type);
    const next = getChildReminderNotifications({birthDate: '2023-11-06', reminders: [reminder, {...reminder, uuid: 'reminder-2'}]}, [], true);
    expect(next).toHaveLength(6);
  });
});

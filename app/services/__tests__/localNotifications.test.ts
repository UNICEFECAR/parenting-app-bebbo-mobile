/* Scheduling, upgrade migration and tap delivery share one regression suite. */
export {};
jest.mock('react-native-notify-kit', () => ({
  __esModule: true,
  default: Object.fromEntries([
    'setNotificationConfig', 'createChannel', 'getTriggerNotifications', 'createTriggerNotification',
    'cancelTriggerNotification', 'cancelTriggerNotifications', 'cancelNotification',
    'cancelDisplayedNotifications', 'getDisplayedNotifications', 'requestPermission',
    'setBadgeCount', 'getInitialNotification', 'onBackgroundEvent', 'onForegroundEvent',
  ].map(name => [name, jest.fn()])),
  AlarmType: { SET_EXACT_AND_ALLOW_WHILE_IDLE: 3 }, AndroidImportance: { HIGH: 4 },
  TriggerType: { TIMESTAMP: 0 }, EventType: { PRESS: 1, ACTION_PRESS: 2, DELIVERED: 3 },
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true, default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));
jest.mock('../../specs/NativeLegacyNotifications', () => ({
  __esModule: true, default: { getPendingNotifications: jest.fn(), completeMigration: jest.fn(), getNotificationColor: jest.fn() },
}));

let local: any, api: any, legacy: any, storage: Map<string, string>, pending: Map<string, any>;
const future = () => Date.now() + 600000;
const oldReminder = () => ({ id: '123', timestamp: future(), title: 'Reminder', body: 'Visit',
  data: { notitype: 'vcr', uuid: 'child-1' } });
beforeEach(() => {
  jest.resetModules();
  Object.defineProperty(require('react-native').Platform, 'OS', { configurable: true, value: 'android' });
  api = require('react-native-notify-kit').default;
  legacy = require('../../specs/NativeLegacyNotifications').default;
  storage = new Map(); pending = new Map();
  const asyncStorage = require('@react-native-async-storage/async-storage').default;
  asyncStorage.getItem.mockImplementation(async (key: string) => storage.get(key) ?? null);
  asyncStorage.setItem.mockImplementation(async (key: string, value: string) => storage.set(key, value));
  asyncStorage.removeItem.mockImplementation(async (key: string) => storage.delete(key));
  legacy.getPendingNotifications.mockResolvedValue('[]');
  legacy.getNotificationColor.mockResolvedValue('#2B2F84');
  api.getTriggerNotifications.mockImplementation(async () => [...pending.values()]);
  api.createTriggerNotification.mockImplementation(async (notification: any, trigger: any) => {
    pending.set(notification.id, { notification, trigger }); return notification.id;
  });
  api.cancelNotification.mockImplementation(async (id: string) => pending.delete(id));
  api.cancelTriggerNotification.mockImplementation(async (id: string) => pending.delete(id));
  api.cancelTriggerNotifications.mockImplementation(async () => pending.clear());
  local = require('../LocalNotifications').default;
});

test('migrates old reminders before deleting legacy alarms and only once', async () => {
  legacy.getPendingNotifications.mockResolvedValue(JSON.stringify([oldReminder()]));
  await local.getAllScheduledLocalNotifications();
  expect(pending.get('123').notification.data).toMatchObject({ notitype: 'vcr', uuid: 'child-1' });
  expect(legacy.completeMigration).toHaveBeenCalledWith('["123"]');
  expect(legacy.completeMigration.mock.invocationCallOrder[0])
    .toBeGreaterThan(api.createTriggerNotification.mock.invocationCallOrder[0]);
  await local.getAllScheduledLocalNotifications();
  expect(legacy.getPendingNotifications).toHaveBeenCalledTimes(1);
  expect(storage.get('local-reminders-migrated-v2')).toBe('1');
  expect(api.setNotificationConfig).toHaveBeenCalledWith({ ios: { handleRemoteNotifications: false } });
});

test('failed replacement preserves legacy alarms and retries on the next operation', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  legacy.getPendingNotifications.mockResolvedValue(JSON.stringify([oldReminder()]));
  api.createTriggerNotification.mockRejectedValueOnce(new Error('native failure'));
  await local.getAllScheduledLocalNotifications();
  expect(legacy.completeMigration).not.toHaveBeenCalled();
  expect(storage.has('local-reminders-migrated-v2')).toBe(false);
  await local.getAllScheduledLocalNotifications();
  expect(legacy.completeMigration).toHaveBeenCalledTimes(1);
  warn.mockRestore();
});

test('retains last-nine-digit IDs, the reminders channel and routing data', async () => {
  await local.schduleNotification(new Date(future()), 'Title', 'Body', '1234567890123', 'hcr', 'child');
  const item = pending.get('567890123');
  expect(item.notification).toMatchObject({ title: 'Title', body: 'Body',
    data: { notitype: 'hcr', uuid: 'child' }, android: { channelId: 'reminders', smallIcon: 'ic_notification' } });
});

test('ignores invalid and past dates', async () => {
  for (const date of [null, new Date(NaN), new Date(0), 'tomorrow'])
    await local.schduleNotification(date, '', '', '1', 'gw', 'child');
  expect(api.createTriggerNotification).not.toHaveBeenCalled();
});

test('serializes schedule, cancel-all, schedule and individual cancellation', async () => {
  const tasks = [local.schduleNotification(new Date(future()), '', '', '1', 'gw', 'a'),
    local.cancelAllReminderLocalNotification(),
    local.schduleNotification(new Date(future()), '', '', '2', 'cd', 'b')];
  await Promise.all(tasks);
  expect([...pending.keys()]).toEqual(['2']);
  await local.cancelReminderLocalNotification('2');
  expect(pending.size).toBe(0);
  expect(JSON.parse(storage.get('local-reminders-v2')!)).toEqual({});
});

test('updates an existing reminder without creating duplicate IDs', async () => {
  const date = new Date(future());
  await local.schduleNotification(date, 'Before', '', '1', 'gw', 'a');
  await local.schduleNotification(date, 'After', '', '1', 'gw', 'a');
  expect(pending.size).toBe(1);
  expect(pending.get('1').notification.title).toBe('After');
});

test('clearing delivered notifications clears the iOS badge and leaves future reminders intact', async () => {
  Object.defineProperty(require('react-native').Platform, 'OS', { configurable: true, value: 'ios' });
  await local.schduleNotification(new Date(future()), '', '', '1', 'gw', 'a');
  await local.removeAllDeliveredLocalNotifications();
  expect(api.cancelDisplayedNotifications).toHaveBeenCalled();
  expect(api.setBadgeCount).toHaveBeenCalledWith(0);
  expect(pending.size).toBe(1);
});

test('buffers a cold-start press until navigation is ready, then deduplicates it', async () => {
  const notification = { id: '123', data: { notitype: 'cd', uuid: 'child' } };
  await local.rememberPress(notification);
  const listener = jest.fn().mockReturnValue(false);
  local.subscribeToPress(listener);
  await local.flushPendingPress();
  expect(storage.has('local-reminder-pending-press-v2')).toBe(true);
  listener.mockReturnValue(true); listener.mockClear();
  await local.flushPendingPress();
  await local.rememberPress(notification);
  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith({ data: notification.data, userInteraction: true });
  expect(storage.has('local-reminder-pending-press-v2')).toBe(false);
});

test('delivery and remote messages do not navigate', async () => {
  const listener = jest.fn(); local.subscribeToPress(listener);
  await local.handleEvent({ type: 3, detail: { notification: oldReminder() } });
  await local.rememberPress({ id: 'fcm', data: { type: 'articles', id: '12' } });
  expect(listener).not.toHaveBeenCalled();
});

test('iOS queues only 64 nearest requests and retains overflow for a later resume', async () => {
  Object.defineProperty(require('react-native').Platform, 'OS', { configurable: true, value: 'ios' });
  const reminders = Array.from({ length: 66 }, (_, index) => ({
    ...oldReminder(), id: String(index), timestamp: future() + index * 60000,
  }));
  legacy.getPendingNotifications.mockResolvedValue(JSON.stringify(reminders));
  await local.getAllScheduledLocalNotifications();
  expect(pending.size).toBe(64);
  expect(Object.keys(JSON.parse(storage.get('local-reminders-v2')!))).toHaveLength(66);
  await local.cancelReminderLocalNotification('0');
  expect(pending.has('64')).toBe(true);
});

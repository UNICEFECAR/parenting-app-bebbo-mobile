import notifications, { AlarmType, AndroidImportance, EventType, TriggerType } from 'react-native-notify-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import legacyNotifications from '../specs/NativeLegacyNotifications';

const REMINDERS_KEY = 'local-reminders-v2';
const MIGRATION_KEY = 'local-reminders-migrated-v2';
const PRESS_KEY = 'local-reminder-pending-press-v2';
const CONSUMED_PRESS_KEY = 'local-reminder-consumed-press-v2';
const normalizeId = id => String(id).slice(-9);

class LocalNotifications {
  constructor() {
    this.queue = Promise.resolve();
    this.pressQueue = Promise.resolve();
    this.reminders = {};
    this.initializing = null;
    this.pressListener = null;
    this.started = false;
  }

  // Existing callers schedule/cancel in loops without awaiting. Preserve their order.
  enqueue(work) {
    this.scheduleGroup = null; // A read/cancellation is an ordering barrier.
    const result = this.queue.then(async () => {
      await this.initialize();
      return work();
    });
    this.queue = result.catch(error => console.warn('Local notifications:', error));
    return this.queue;
  }

  initialize() {
    if (!this.initializing) {
      this.initializing = this.initializeReminders().catch(error => {
        this.initializing = null;
        throw error;
      });
    }
    return this.initializing;
  }

  async initializeReminders() {
    // Firebase continues to own remote messages and remote notification taps.
    await notifications.setNotificationConfig({ ios: { handleRemoteNotifications: false } });
    if (Platform.OS === 'android') {
      this.androidColor = await legacyNotifications.getNotificationColor();
    }
    await notifications.createChannel({
      id: 'reminders', name: 'Task reminder notifications',
      description: 'Reminder for any tasks', importance: AndroidImportance.HIGH,
    });
    const saved = await AsyncStorage.getItem(REMINDERS_KEY);
    this.reminders = saved ? JSON.parse(saved) : {};
    const migrated = await AsyncStorage.getItem(MIGRATION_KEY);
    const legacy = migrated ? [] : JSON.parse(await legacyNotifications.getPendingNotifications());
    for (const reminder of legacy) {
      const id = normalizeId(reminder.id);
      if (reminder.timestamp > Date.now() && reminder.data?.notitype && !this.reminders[id]) {
        this.reminders[id] = { ...reminder, id };
      }
    }
    // Save first; never discard old alarms until replacement scheduling succeeds.
    await this.persist();
    await this.reconcile();
    if (!migrated) {
      await legacyNotifications.completeMigration(JSON.stringify(legacy.map(item => item.id)));
      await this.reconcile();
      await AsyncStorage.setItem(MIGRATION_KEY, '1');
    }
  }

  start() {
    if (this.started) return;
    this.started = true;
    notifications.onBackgroundEvent(event => this.handleEvent(event));
    notifications.onForegroundEvent(event => {
      this.handleEvent(event).catch(error => console.warn('Notification event:', error));
    });
    AppState.addEventListener('change', state => {
      if (state === 'active') {
        this.enqueue(() => this.reconcile());
        this.flushPendingPress();
      }
    });
    this.enqueue(async () => {
      if (Platform.OS === 'android') {
        const initial = await notifications.getInitialNotification();
        if (initial) await this.rememberPress(initial.notification);
      }
    });
  }

  async persist() {
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(this.reminders));
  }

  async reconcile() {
    const future = Object.values(this.reminders)
      .filter(item => item.timestamp > Date.now())
      .sort((a, b) => a.timestamp - b.timestamp);
    // iOS permits 64 pending requests. Keep overflow and refill when the app resumes.
    // Android uses AlarmManager, preserving the 55 automatic + manual reminders.
    const active = Platform.OS === 'ios' ? future.slice(0, 64) : future;
    const wanted = new Map(active.map(item => [item.id, item]));
    const pending = await notifications.getTriggerNotifications();
    const existing = new Map(pending.filter(item => item.notification?.data?.bebboReminder === '1')
      .map(item => [item.notification.id, item]));
    for (const [id] of existing) {
      if (!wanted.has(id)) await notifications.cancelTriggerNotification(id);
    }
    for (const reminder of active) {
      const old = existing.get(reminder.id);
      if (old?.notification.data?.revision !== JSON.stringify(reminder)) {
        await notifications.createTriggerNotification({
          id: reminder.id, title: reminder.title, body: reminder.body,
          data: {
            notitype: String(reminder.data?.notitype ?? ''),
            uuid: String(reminder.data?.uuid ?? ''),
            bebboReminder: '1', revision: JSON.stringify(reminder),
          },
          android: {
            channelId: 'reminders', smallIcon: 'ic_notification', color: this.androidColor,
            pressAction: { id: 'default', launchActivity: 'default' },
          },
          ios: { badgeCount: 1, sound: 'default' },
        }, {
          type: TriggerType.TIMESTAMP, timestamp: reminder.timestamp,
          ...(Platform.OS === 'android' ? {
            alarmManager: { type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE },
          } : {}),
        });
      }
    }
    this.reminders = Object.fromEntries(future.map(item => [item.id, item]));
    await this.persist();
  }

  // Keep the original spelling: all reminder screens already use this method.
  schduleNotification(date, title, message, notiId, notitype, uuid) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
      return Promise.resolve();
    }
    const reminder = {
      id: normalizeId(notiId), timestamp: date.getTime(),
      title: String(title ?? ''), body: String(message ?? ''), data: { notitype, uuid },
    };
    if (this.scheduleGroup && !this.scheduleGroup.started) {
      this.scheduleGroup.items.push(reminder);
      return this.scheduleGroup.promise;
    }
    const group = {items: [reminder], started: false};
    group.promise = this.enqueue(async () => {
      group.started = true;
      for (const item of group.items) this.reminders[item.id] = item;
      // Persist the whole desired set before touching native scheduling. Never
      // coalesce across cancellation/read operations or an in-flight batch.
      await this.persist();
      await this.reconcile();
    });
    this.scheduleGroup = group;
    return group.promise;
  }

  cancelReminderLocalNotification(notiId) {
    return this.enqueue(async () => {
      const id = normalizeId(notiId);
      delete this.reminders[id];
      await this.persist();
      await notifications.cancelNotification(id);
      await this.reconcile();
    });
  }

  cancelAllReminderLocalNotification() {
    return this.enqueue(async () => {
      this.reminders = {};
      await this.persist();
      await notifications.cancelTriggerNotifications();
    });
  }

  removeAllDeliveredLocalNotifications() {
    return this.enqueue(async () => {
      await notifications.cancelDisplayedNotifications();
      if (Platform.OS === 'ios') await notifications.setBadgeCount(0);
    });
  }

  getAllScheduledLocalNotifications() {
    return this.enqueue(() => notifications.getTriggerNotifications());
  }

  getDeliveredNotifications() {
    return this.enqueue(() => notifications.getDisplayedNotifications());
  }

  requestPermissions() {
    return notifications.requestPermission().catch(error => console.warn('Notification permission:', error));
  }

  async handleEvent({ type, detail }) {
    if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
      await this.rememberPress(detail.notification);
    } else if (type === EventType.DELIVERED) {
      // Receiving a reminder must not navigate; only a press opens a screen.
      await this.enqueue(() => this.reconcile());
    }
  }

  rememberPress(notification) {
    if (!notification?.data?.notitype) return Promise.resolve();
    const result = this.pressQueue.then(async () => {
      const key = `${notification.id}:${notification.data.revision ?? ''}`;
      const consumed = JSON.parse(await AsyncStorage.getItem(CONSUMED_PRESS_KEY) || 'null');
      if (consumed?.key === key && Date.now() - consumed.time < 60000) return;
      await AsyncStorage.setItem(PRESS_KEY, JSON.stringify({ key, notification }));
      await this.deliverPendingPress();
    });
    this.pressQueue = result.catch(error => console.warn('Notification press:', error));
    return this.pressQueue;
  }

  async deliverPendingPress() {
    if (!this.pressListener) return;
    const pending = JSON.parse(await AsyncStorage.getItem(PRESS_KEY) || 'null');
    if (!pending) return;
    const accepted = this.pressListener({ data: pending.notification.data, userInteraction: true });
    if (accepted === false) return; // Retry once navigation/onboarding is ready.
    await AsyncStorage.setItem(CONSUMED_PRESS_KEY, JSON.stringify({ key: pending.key, time: Date.now() }));
    await AsyncStorage.removeItem(PRESS_KEY);
    if (Platform.OS === 'ios') await notifications.setBadgeCount(0);
  }

  flushPendingPress() {
    const result = this.pressQueue.then(() => this.deliverPendingPress());
    this.pressQueue = result.catch(error => console.warn('Notification press:', error));
    return this.pressQueue;
  }

  subscribeToPress(listener) {
    this.pressListener = listener;
    this.flushPendingPress();
    return () => {
      if (this.pressListener === listener) this.pressListener = null;
    };
  }
}

export default new LocalNotifications();

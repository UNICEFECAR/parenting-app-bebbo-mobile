import {DateTime} from 'luxon';
import {userRealmCommon} from '../database/dbquery/userRealmCommon';
import {ChildEntitySchema} from '../database/schema/ChildDataSchema';
import LocalNotifications from './LocalNotifications';
import {logAnalyticsEvent, recordError} from './firebaseAnalytics';
const deleting = new Set<string>();

/** Deletion failure must preserve the profile's reminders and visible selection. */
export async function deleteProfileRecord(schema: string, id: unknown, condition: string): Promise<boolean> {
  const key = `${schema}:${String(id)}`;
  if (deleting.has(key)) return false;
  deleting.add(key);
  try {
    let reminders: any[], placeholder: boolean;
    try {
      const rows = await userRealmCommon.getFilteredData<any>(ChildEntitySchema, condition);
      if (!rows?.[0]) return false;
      placeholder = rows[0].autoChild === 'true';
      // Detach before deleting the owning Realm object and its embedded records.
      reminders = Array.from(rows[0].reminders ?? [], (row: any) => ({
        date: row.reminderDateDefined, time: row.reminderTimeDefined,
      }));
      if (await userRealmCommon.delete(schema, id, condition) !== 'success') return false;
    } catch { return false; }
    void logAnalyticsEvent('profile_deleted', {
      source: 'manage_profile', profile_type: placeholder ? 'placeholder' : 'caregiver_entered',
    });
    // Cancellation is post-commit cleanup. A rejected cancellation cannot undo a
    // confirmed profile deletion; normal reconciliation can retry stale requests.
    const cleanup = await Promise.allSettled(reminders.map(async reminder => {
      const date = new Date(reminder.date), time = new Date(reminder.time);
      if (!Number.isFinite(date.getTime()) || !Number.isFinite(time.getTime())) return;
      date.setHours(time.getHours(), time.getMinutes());
      await LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(date).toMillis());
    }));
    if (cleanup.some(result => result.status === 'rejected')) void recordError(new Error('Profile reminder cleanup deferred'));
    return true;
  } finally { deleting.delete(key); }
}

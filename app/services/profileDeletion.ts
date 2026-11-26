import {PROFILE_DELETED} from '../assets/data/firebaseEvents';
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
    let placeholder: boolean;
    try {
      const rows = await userRealmCommon.getFilteredData<any>(ChildEntitySchema, condition);
      if (!rows?.[0]) return false;
      placeholder = rows[0].autoChild === 'true';
      if (await userRealmCommon.delete(schema, id, condition) !== 'success') return false;
    } catch { return false; }
    void logAnalyticsEvent(PROFILE_DELETED, {
      source: 'manage_profile', profile_type: placeholder ? 'placeholder' : 'caregiver_entered',
    });
    // Cancellation is post-commit cleanup. A rejected cancellation cannot undo a
    // confirmed profile deletion; normal reconciliation can retry stale requests.
    try {
      await LocalNotifications.cancelChildReminderNotifications(id);
    } catch {
      void recordError(new Error('Profile reminder cleanup deferred'));
    }
    return true;
  } finally { deleting.delete(key); }
}

import {dataRealmCommon} from '../database/dbquery/dataRealmCommon';
import {logAnalyticsEvent, tryLogAnalyticsEvent} from './firebaseAnalytics';
export {storeUnsyncedEvent} from './analyticsOutbox';

export const markEventAsSynchronized = async (realm: any, event: any): Promise<void> => {
  if (realm.isClosed || (event.isValid && !event.isValid())) return;
  realm.write(() => {event.isSynchronized = true;});
};

// The native SDK queues offline events with their original session/time and
// persists them across restarts. NetInfo is not a delivery acknowledgement.
export const logEvent = async (eventData: any, _netInfo?: boolean | null): Promise<void> => {
  if (eventData?.name) await logAnalyticsEvent(eventData.name, eventData.params);
};

async function flushEvents(): Promise<void> {
  const realm = await dataRealmCommon.openRealm();
  if (!realm || realm.isClosed) return;
  // Realm filtered results are live. Snapshot before changing membership.
  // Previous releases retained acknowledged records indefinitely.
  realm.write(() => realm.delete(realm.objects('Event').filtered('isSynchronized = true')));
  const events = Array.from(realm.objects('Event').filtered('isSynchronized = false')) as any[];
  for (const event of events) {
    if (!event?.name || realm.isClosed || (event.isValid && !event.isValid())) continue;
    try {
      let params: Record<string, any> = {};
      try {
        const decoded = event.params ? JSON.parse(event.params) : {};
        if (decoded && typeof decoded === 'object' && !Array.isArray(decoded)) params = decoded;
      } catch { /* Historical malformed params must not block the rest of the queue. */ }
      if (await tryLogAnalyticsEvent(event.name, {...params, is_offline_event: true})) {
        realm.write(() => realm.delete(event));
      }
    } catch (error) {
      console.warn('Analytics retry remains pending');
    }
  }
}

// Serialise flushes: startup, reconnect and foreground callbacks can overlap.
// A later request still gets a pass, including events queued during the first.
let synchronization: Promise<void> = Promise.resolve();
export const synchronizeEvents = (netInfo?: boolean | null): Promise<void> => {
  if (netInfo !== true) return Promise.resolve();
  synchronization = synchronization.then(flushEvents).catch(error => {
    console.warn('Analytics queue sync failed');
  });
  return synchronization;
};

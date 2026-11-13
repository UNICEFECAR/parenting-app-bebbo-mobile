import {dataRealmCommon} from '../database/dbquery/dataRealmCommon';
import {tryLogAnalyticsEvent} from './firebaseAnalytics';
import NetInfo from '@react-native-community/netinfo';

export const markEventAsSynchronized = async (realm: any, event: any): Promise<void> => {
  if (realm.isClosed || (event.isValid && !event.isValid())) return;
  realm.write(() => {event.isSynchronized = true;});
};

export const storeUnsyncedEvent = async (realm: any, eventData: any): Promise<void> => {
  if (!realm || realm.isClosed) throw new Error('Event storage is unavailable');
  realm.write(() => {
    realm.create('Event', {
      name: eventData.name,
      params: eventData.params ? JSON.stringify(eventData.params) : null,
      isSynchronized: false,
    });
  });
};

export const logEvent = async (eventData: any, netInfo?: boolean | null): Promise<void> => {
  if (!eventData?.name) return;
  let connected = netInfo;
  if (connected == null) {
    try {connected = (await NetInfo.fetch()).isConnected;}
    catch {connected = false;}
  }
  // An online flag does not guarantee that the SDK accepted the event.
  if (connected === true && await tryLogAnalyticsEvent(eventData.name, eventData.params)) return;
  try {
    await storeUnsyncedEvent(await dataRealmCommon.openRealm(), eventData);
  } catch (error) {
    // Telemetry failure must not reject a caregiver's form/navigation action.
    console.warn('Could not save the analytics retry', error);
  }
};

async function flushEvents(): Promise<void> {
  const realm = await dataRealmCommon.openRealm();
  if (!realm || realm.isClosed) return;
  // Realm filtered results are live. Snapshot before changing membership.
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
        await markEventAsSynchronized(realm, event);
      }
    } catch (error) {
      console.warn('Analytics retry remains pending', error);
    }
  }
}

// Serialise flushes: startup, reconnect and foreground callbacks can overlap.
// A later request still gets a pass, including events queued during the first.
let synchronization: Promise<void> = Promise.resolve();
export const synchronizeEvents = (netInfo?: boolean | null): Promise<void> => {
  if (netInfo !== true) return Promise.resolve();
  synchronization = synchronization.then(flushEvents).catch(error => {
    console.warn('Analytics queue sync failed', error);
  });
  return synchronization;
};

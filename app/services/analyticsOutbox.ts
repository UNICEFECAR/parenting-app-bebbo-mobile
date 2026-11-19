import {dataRealmCommon} from '../database/dbquery/dataRealmCommon';

export async function storeUnsyncedEvent(realm: any, event: any, sdkRetry = false): Promise<void> {
  if (!realm || realm.isClosed) throw new Error('Event storage is unavailable');
  realm.write(() => realm.create('Event', {
    name: event.name, params: event.params ? JSON.stringify(event.params) : null, isSynchronized: false, sdkRetry,
  }));
}
export async function saveAnalyticsRetry(event: any, sdkRetry = false): Promise<void> {
  await storeUnsyncedEvent(await dataRealmCommon.openRealm(), event, sdkRetry);
}

import { dataRealmCommon } from './../database/dbquery/dataRealmCommon';
import analytics from '@react-native-firebase/analytics';

//A method to log events to Firebase Analytics
export const logEventToFirebase = async (analyticsInstance: any, event: any): Promise<void> => {
  if (event.params != undefined) {
    analyticsInstance.logEvent(event.name, event.params);
  } else {
    analyticsInstance.logEvent(event.name)
  }
}
// A method mark event as synchronized after sync with firebase
export const markEventAsSynchronized = async (realm: any, event: any): Promise<void> => {
  realm.write(() => {
    event.isSynchronized = true;
  });

}
//A method storing unsynchronized events in a local database Realm
export const storeUnsyncedEvent = async (realm: any, eventData: any): Promise<any> => {
  realm.write(() => {
    const unsyncedEvent = realm.create('Event', {
      ...eventData,
      isSynchronized: false,
    });
  });
}

//A method to log events to Firebase analytics or realm database.
export const logEvent = async (eventData: any, netInfo: boolean): Promise<any> => {
  const realm = await dataRealmCommon.openRealm();

  if (netInfo == true) {
    const analyticsInstance = analytics();
    logEventToFirebase(analyticsInstance, eventData);
  } else {
    storeUnsyncedEvent(realm, eventData);
  }
}
//A method synchronizing events when the device is online.
export const synchronizeEvents = async (netInfo: boolean): Promise<any> => {
  const realm = await dataRealmCommon.openRealm();

  if (realm != null) {
    const unsynchronizedEvents = realm.objects('Event').filtered('isSynchronized = false');
    console.log('unsynchronizedEvents events', unsynchronizedEvents)
    console.log('unsynchronizedEvents length', unsynchronizedEvents.length)
    if (!unsynchronizedEvents.length) {
      return;
    }

    if (netInfo == true) {
      const analyticsInstance = analytics();

      unsynchronizedEvents.forEach(async (event: any) => {
        if (typeof event !== 'undefined' && event !== null) {
          logEventToFirebase(analyticsInstance, event);
          markEventAsSynchronized(realm, event);
        }
      });
    } else {
      console.log('Device is offline. Events not synced.');
    }
  }
}

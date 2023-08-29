import { dataRealmCommon } from './../database/dbquery/dataRealmCommon';
import analytics from '@react-native-firebase/analytics';


export const logEventToFirebase = async (analyticsInstance: any, event: any): Promise<void> => {
  if(event.params!=undefined){
  analyticsInstance.logEvent(event.name, event.params);
  }else{
    analyticsInstance.logEvent(event.name)
  }
}

export const markEventAsSynchronized = async (realm: any, event: any): Promise<void> => {
  if (!dataRealmCommon.isRealmClosed()) {
    realm = await dataRealmCommon.openRealm();
  }
  realm.write(() => {
    event.isSynchronized = true;
  });

}

export const storeUnsyncedEvent = async (realm: any, eventData: any): Promise<any> => {
  realm.write(() => {
    const unsyncedEvent = realm.create('Event', {
      ...eventData,
      isSynchronized: false,
    });
    console.log('EventClick unsyncedEvent for category', unsyncedEvent);
  });
}

export const logEvent = async (eventData: any, netInfo: boolean): Promise<any> => {
  let realm: any;
  if (!dataRealmCommon.isRealmClosed()) {
    realm = await dataRealmCommon.openRealm();
  }
  if (netInfo == true) {
    const analyticsInstance = analytics();
    logEventToFirebase(analyticsInstance, eventData);
  } else {
    storeUnsyncedEvent(realm, eventData);
  }
}

export const synchronizeEvents = async (netInfo: boolean): Promise<any> => {
  let realm: any;
  if (!dataRealmCommon.isRealmClosed()) {
    realm = await dataRealmCommon.openRealm();
  }
  if (realm != null) {
    const unsynchronizedEvents = realm.objects('Event').filtered('isSynchronized = false');
    if (!unsynchronizedEvents.length) {
      return;
    }

    if (netInfo == true) {
      const analyticsInstance = analytics();

      unsynchronizedEvents.forEach(async (event: any) => {
        logEventToFirebase(analyticsInstance, event);
        markEventAsSynchronized(realm, event);
      });
    } else {
      console.log('Device is offline. Events not synced.');
    }
  }
}

import { dataRealmCommon } from './../database/dbquery/dataRealmCommon';
import analytics from '@react-native-firebase/analytics';


export const logEventToFirebase = async (analyticsInstance: any, event: any): Promise<void> => {
  console.log('EventClick for name', event.name);
  console.log('EventClick for params', event.params);
  if(event.params!=undefined){
  analyticsInstance.logEvent(event.name, event.params);
  }else{
  console.log('EventClick for name1', event.name)
    analyticsInstance.logEvent(event.name)
  }
}

export const markEventAsSynchronized = async (realm: any, event: any): Promise<void> => {
  console.log('relm is realm',dataRealmCommon.isRealmClosed())
  console.log('relm is event',event)
  if (!dataRealmCommon.isRealmClosed()) {
    realm = await dataRealmCommon.openRealm();
  }
  realm.write(() => {
    event.isSynchronized = true;
  });

}

export const storeUnsyncedEvent = async (realm: any, eventData: any): Promise<any> => {
  console.log('offline store', eventData);
  console.log('database store', dataRealmCommon.isRealmClosed());
  realm.write(() => {
    const unsyncedEvent = realm.create('Event', {
      ...eventData,
      isSynchronized: false,
    });
    console.log('EventClick unsyncedEvent for category', unsyncedEvent);
  });
  //dataRealmCommon.closeRealm();
}

export const logEvent = async (eventData: any, netInfo: boolean): Promise<any> => {
  console.log('EventClick for category online..............', netInfo);
  let realm: any;
  console.log('EventClick for category online', dataRealmCommon.isRealmClosed());
  if (!dataRealmCommon.isRealmClosed()) {
    realm = await dataRealmCommon.openRealm();
  }
  if (netInfo == true) {
    const analyticsInstance = analytics();
    logEventToFirebase(analyticsInstance, eventData);
    console.log('EventClick for category online');
    console.log('EventClick for category eventData', eventData);
  } else {
    storeUnsyncedEvent(realm, eventData);
  }
}

export const synchronizeEvents = async (netInfo: boolean): Promise<any> => {
  console.log('check for user online......',dataRealmCommon.isRealmClosed())
  let realm: any;
  if (!dataRealmCommon.isRealmClosed()) {
    realm = await dataRealmCommon.openRealm();
  }
  if (realm != null) {
    const unsynchronizedEvents = realm.objects('Event').filtered('isSynchronized = false');
    console.log('unsynchronizedEvents', unsynchronizedEvents)
    console.log('unsynchronizedEvents length', unsynchronizedEvents.length)
    if (!unsynchronizedEvents.length) {
      console.log('No unsynchronized events to sync.');
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
  }else{
    console.log('This is Error....')
  }
}

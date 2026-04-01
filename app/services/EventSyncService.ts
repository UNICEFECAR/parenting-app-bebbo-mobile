import { dataRealmCommon } from './../database/dbquery/dataRealmCommon';
import { logAnalyticsEvent } from './firebaseAnalytics';
import NetInfo from "@react-native-community/netinfo";

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
  console.log(eventData,"eventData--", JSON.stringify(eventData));
  realm.write(() => {
    const unsyncedEvent = realm.create('Event', {
      name: eventData.name,
      params: eventData.params ? JSON.stringify(eventData.params) : null,
      isSynchronized: false,
    });
  });
}

//A method to log events to Firebase analytics or realm database.
export const logEvent = async (eventData: any, netInfo: boolean): Promise<any> => {
  let resolvedIsConnected : any = netInfo;
  // If hook value is not ready yet, ask NetInfo directly once
  if (resolvedIsConnected == null) {
    try {
      const latestNetState = await NetInfo.fetch();
      resolvedIsConnected = latestNetState.isConnected;
      console.log(
        "NetInfo was null, fetched latest state =>",
        resolvedIsConnected
      );
    } catch (e) {
      console.warn("Failed to fetch latest network state", e);
    }
  }

  console.log(resolvedIsConnected, "logevent called--", eventData);
  const realm = await dataRealmCommon.openRealm();

  if (resolvedIsConnected === true) {
    await logAnalyticsEvent(eventData.name, eventData.params);
  } else if (resolvedIsConnected === false) {
    await storeUnsyncedEvent(realm, eventData);
  } else {
    // Still unknown after fetch; safest fallback is store offline
    console.log("Network state still unknown, storing event offline");
    await storeUnsyncedEvent(realm, eventData);
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
      // const analyticsInstance = analytics();

      // unsynchronizedEvents.forEach(async (event: any) => {
      //   if (typeof event !== 'undefined' && event !== null) {
      //     // logEventToFirebase(analyticsInstance, event);
      //     const paramsWithOfflineFlag = {
      //       ...(event.params || {}),
      //       is_offline_event: true,
      //     };
      //     await logAnalyticsEvent(event.name, paramsWithOfflineFlag); 
      //     markEventAsSynchronized(realm, event);
      //   }
      // });

      for (const event of unsynchronizedEvents as any) {
        console.log("event is--",event)
        if (!event?.name) continue;
      
        let parsedParams = {};
        try {
          parsedParams = event.params ? JSON.parse(event.params) : {};
        } catch (e) {
          console.warn('Failed to parse event params:', e);
        }
        const paramsWithOfflineFlag = {
          ...parsedParams,
          is_offline_event: true,
        };
        console.log(event.name,"paramsWithOfflineFlag--",paramsWithOfflineFlag)
        await logAnalyticsEvent(event.name, paramsWithOfflineFlag);
        await markEventAsSynchronized(realm, event);
      }
    } else {
      console.log('Device is offline. Events not synced.');
    }
  }
}

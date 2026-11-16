import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {AppEventsLogger, Settings} from 'react-native-fbsdk-next';
let initializedEvent = false;
let inFlight: Promise<void> | undefined;
async function configure(): Promise<void> {
  let allowed = false;
  try {
    if (Platform.OS === 'ios') {
      let status = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (status === RESULTS.DENIED) status = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      allowed = status === RESULTS.GRANTED;
      await Settings.setAdvertiserTrackingEnabled(allowed);
    }
    // Android has no ATT-equivalent grant in this app. Do not infer permission
    // to collect its advertising ID from connectivity or terms acceptance.
    Settings.setAdvertiserIDCollectionEnabled(allowed);
    Settings.initializeSDK();
    if (!initializedEvent && (allowed || Platform.OS === 'android')) {
      AppEventsLogger.logEvent('fb_sdk_initialized');
      initializedEvent = true;
    }
  } catch {
    try { Settings.setAdvertiserIDCollectionEnabled(false); } catch { /* SDK unavailable. */ }
    console.warn('Advertising SDK permission configuration failed');
  }
}
export function configureAdvertisingConsent(): Promise<void> {
  if (!inFlight) inFlight = configure().finally(() => {inFlight = undefined;});
  return inFlight;
}

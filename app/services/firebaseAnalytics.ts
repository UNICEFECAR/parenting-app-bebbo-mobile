import {diagnosticError, diagnosticBreadcrumb} from './diagnostics';
// firebaseAnalytics.ts
import { getApp } from '@react-native-firebase/app';
import {
    getAnalytics,
    getAppInstanceId,
    logEvent as firebaseLogEvent,
    setUserProperties as firebaseSetUserProperties,
} from '@react-native-firebase/analytics';
import { getCrashlytics, log as firebaseLog, recordError as firebaseRecordError } from '@react-native-firebase/crashlytics';

import {saveAnalyticsRetry} from './analyticsOutbox';

// Resolve SDKs inside guarded operations: a bad flavour configuration must not
// crash while importing this module, before the app's error boundary mounts.
const analytics = () => getAnalytics(getApp());
const crashlytics = () => getCrashlytics();

export const logCrashlyticsMessage = (message: string): void => {
    try {
        firebaseLog(crashlytics(), diagnosticBreadcrumb(message));
    } catch  {
        console.warn('Crashlytics breadcrumb submission failed');
    }
};
/**
 * Logs a Firebase analytics event with optional parameters
 */
/** Returns true only after the native SDK accepts the event. */
export const tryLogAnalyticsEvent = async (
    eventName: string,
    params?: Record<string, any>
): Promise<boolean> => {
    try {
        await firebaseLogEvent(analytics(), eventName, params);
        return true;
    } catch  {
        console.warn('Analytics SDK submission failed');
        return false;
    }
};

// Preserve the non-throwing void API used by UI callers.
export const logAnalyticsEvent = async (
    eventName: string,
    params?: Record<string, any>
): Promise<void> => {
    if (await tryLogAnalyticsEvent(eventName, params)) return;
    try {
        // A denied analytics-storage consent returns null. Never build a second
        // collection channel around a native opt-out (or an unavailable SDK).
        if (await getAppInstanceId(analytics()) == null) return;
        await saveAnalyticsRetry({name: eventName, params});
    } catch { console.warn('Analytics retry storage unavailable'); }
};

// Offline events follow the historical Realm replay path when storage is available.
export async function queueOfflineAnalyticsEvent(event: {name: string; params?: Record<string, any>}): Promise<void> {
    try {
        if (await getAppInstanceId(analytics()) == null) return;
        await saveAnalyticsRetry(event);
    } catch {
        // If the local queue is unavailable, the SDK still enforces native consent.
        await tryLogAnalyticsEvent(event.name, {...event.params, is_offline_event: true});
    }
}

export const setUserProperties = async (
    properties: Record<string, string | null | undefined>
): Promise<void> => {
    try {
        const definedProperties: Record<string, string | null> = {};
        for (const [key, value] of Object.entries(properties)) {
            if (value !== undefined) definedProperties[key] = value;
        }
        await firebaseSetUserProperties(analytics(), definedProperties);
    } catch  {
        console.warn('Analytics user property update failed');
    }
};

/** 🔹 Crashlytics: Record an error */
export const recordError = async (
    error: Error | string
  ): Promise<void> => {
    try {
      const err = diagnosticError(error);
      await firebaseRecordError(crashlytics(), err);
    } catch  {
      console.warn('Crashlytics nonfatal submission failed');
    }
  };


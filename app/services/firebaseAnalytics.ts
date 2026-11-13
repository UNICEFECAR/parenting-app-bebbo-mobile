// firebaseAnalytics.ts
import { getApp } from '@react-native-firebase/app';
import {
    getAnalytics,
    getAppInstanceId,
    logEvent as firebaseLogEvent,
    setUserProperties as firebaseSetUserProperties,
} from '@react-native-firebase/analytics';
import { getCrashlytics, log as firebaseLog, recordError as firebaseRecordError } from '@react-native-firebase/crashlytics';

import {prepareAnalyticsEvent, legacyProfileProperties} from './analyticsPolicy';
import {saveAnalyticsRetry} from './analyticsOutbox';

// Resolve SDKs inside guarded operations: a bad flavour configuration must not
// crash while importing this module, before the app's error boundary mounts.
const analytics = () => getAnalytics(getApp());
const crashlytics = () => getCrashlytics();

export const logCrashlyticsMessage = (message: string): void => {
    try {
        firebaseLog(crashlytics(), message);
    } catch (error) {
        console.warn('Crashlytics log failed:', error);
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
    const event = prepareAnalyticsEvent(eventName, params);
    if (!event) return true; // Invalid legacy data is terminal, not a permanent retry.
    try {
        await firebaseLogEvent(analytics(), event.name, event.params);
        return true;
    } catch (error) {
        console.warn('Analytics SDK submission failed');
        return false;
    }
};

// Preserve the non-throwing void API used by UI callers.
export const logAnalyticsEvent = async (
    eventName: string,
    params?: Record<string, any>
): Promise<void> => {
    const event = prepareAnalyticsEvent(eventName, params);
    if (!event || await tryLogAnalyticsEvent(event.name, event.params)) return;
    try {
        // A denied analytics-storage consent returns null. Never build a second
        // collection channel around a native opt-out (or an unavailable SDK).
        if (await getAppInstanceId(analytics()) == null) return;
        await saveAnalyticsRetry({...event, params: {...event.params, captured_at_ms: Date.now()}});
    } catch { console.warn('Analytics retry storage unavailable'); }
};

export const setUserProperties = async (
    properties: Record<string, string | null | undefined>
): Promise<void> => {
    try {
        const definedProperties: Record<string, string | null> = {};
        for (const [key, value] of Object.entries(properties)) {
            if (legacyProfileProperties.includes(key)) definedProperties[key] = null;
            else if (value !== undefined && ['country', 'language', 'relationship'].includes(key)) definedProperties[key] = value == null ? null : value.slice(0, 36);
        }
        await firebaseSetUserProperties(analytics(), definedProperties);
    } catch (error) {
        console.warn('Analytics user property update failed');
    }
};

/** 🔹 Crashlytics: Record an error */
export const recordError = async (
    error: Error | string
  ): Promise<void> => {
    try {
      const err = typeof error === 'string' ? new Error(error) : error;
      await firebaseRecordError(crashlytics(), err);
    } catch (e) {
      console.warn('recordError failed:', e);
    }
  };

/** Clear attributes written by older releases; selecting a child is not a census. */
export const clearLegacyProfileAnalytics = (): Promise<void> =>
    setUserProperties(Object.fromEntries(legacyProfileProperties.map(key => [key, null])));

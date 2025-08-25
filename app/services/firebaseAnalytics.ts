// firebaseAnalytics.ts
import { getApp } from '@react-native-firebase/app';
import {
    getAnalytics,
    logEvent as firebaseLogEvent,
    setUserProperties as firebaseSetUserProperties,
} from '@react-native-firebase/analytics';
import { getCrashlytics, recordError as firebaseRecordError } from '@react-native-firebase/crashlytics';

const app = getApp();
const analytics = getAnalytics(app);
const crashlytics = getCrashlytics();
/**
 * Logs a Firebase analytics event with optional parameters
 */
export const logAnalyticsEvent = async (
    eventName: string,
    params?: Record<string, any>
): Promise<void> => {
    try {
        await firebaseLogEvent(analytics, eventName, params);
    } catch (error) {
        console.warn('logEvent error:', error);
    }
};

export const setUserProperties = async (
    properties: Record<string, string | null | undefined>
): Promise<void> => {
    try {
        await firebaseSetUserProperties(analytics, properties);
    } catch (error) {
        console.warn('setUserProperties error:', error);
    }
};

/** 🔹 Crashlytics: Record an error */
export const recordError = async (
    error: Error | string
  ): Promise<void> => {
    try {
      const err = typeof error === 'string' ? new Error(error) : error;
      await firebaseRecordError(crashlytics, err);
    } catch (e) {
      console.warn('recordError failed:', e);
    }
  };

import {Linking} from 'react-native';
import {logAnalyticsEvent} from './firebaseAnalytics';
/** A successful handoff proves opening, never submission, email delivery or payment. */
export async function openMeasuredLink(url: unknown, event: string): Promise<boolean> {
  if (typeof url !== 'string' || !/^(https?:\/\/|mailto:)/i.test(url) || /[\x00-\x1F]/.test(url)) return false;
  try {
    await Linking.openURL(url);
    await logAnalyticsEvent(event);
    return true;
  } catch { return false; }
}

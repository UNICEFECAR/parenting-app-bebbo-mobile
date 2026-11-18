import {openExternalLink} from './externalLink';
import {logAnalyticsEvent} from './firebaseAnalytics';

// These historical dashboard events count a confirmed tap, including a failed OS handoff.
export async function openMeasuredLink(url: unknown, event: string, connected?: boolean | null): Promise<boolean> {
  void logAnalyticsEvent(event, connected === false ? {is_offline_event: true} : undefined);
  return openExternalLink(url, {allowEmail: true});
}

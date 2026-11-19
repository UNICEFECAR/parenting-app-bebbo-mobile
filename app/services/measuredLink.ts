import {openExternalLink} from './externalLink';
import {logEvent} from './EventSyncService';
import {logAnalyticsEvent} from './firebaseAnalytics';

// These historical dashboard events count a confirmed tap, including a failed OS handoff.
export async function openMeasuredLink(url: unknown, event: string, connected?: boolean | null): Promise<boolean> {
  if (arguments.length === 3) void logEvent({name:event}, connected);
  else void logAnalyticsEvent(event);
  return openExternalLink(url, {allowEmail: true});
}

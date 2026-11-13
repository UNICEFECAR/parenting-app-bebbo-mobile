import {openExternalLink} from './externalLink';
import {logAnalyticsEvent} from './firebaseAnalytics';
/** A successful handoff proves opening, never submission, email delivery or payment. */
export async function openMeasuredLink(url: unknown, event: string): Promise<boolean> {
  if (!(await openExternalLink(url, {allowEmail: true}))) return false;
  try {
    await logAnalyticsEvent(event);
    return true;
  } catch { return false; }
}

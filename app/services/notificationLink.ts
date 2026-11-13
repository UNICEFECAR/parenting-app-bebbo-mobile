import {SURVEY_SUBMIT} from '../assets/data/firebaseEvents';
import {openExternalLink} from './externalLink';
import {logAnalyticsEvent} from './firebaseAnalytics';

/** A notification survey click is the same observed handoff as a home-screen click. */
export async function openNotificationLink(url: unknown, type: 'survey' | 'hyperlink'): Promise<boolean> {
  if (!(await openExternalLink(url))) return false;
  if (type === 'survey') await logAnalyticsEvent(SURVEY_SUBMIT);
  return true;
}

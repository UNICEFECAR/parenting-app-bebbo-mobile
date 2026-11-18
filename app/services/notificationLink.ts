import {openExternalLink} from './externalLink';

// A notification link did not count as a home-screen survey submission.
export function openNotificationLink(url: unknown): Promise<boolean> {
  return openExternalLink(url);
}

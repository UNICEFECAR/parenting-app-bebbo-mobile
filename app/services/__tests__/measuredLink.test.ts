import {Linking} from 'react-native';
import {openMeasuredLink} from '../measuredLink';
import {logAnalyticsEvent} from '../firebaseAnalytics';
jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn().mockResolvedValue(undefined)}));
beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());
test('preserves the historic tap before the OS handoff finishes', async () => {
  let complete!: () => void;
  jest.spyOn(Linking, 'openURL').mockImplementation(() => new Promise(resolve => {complete = () => resolve(undefined);}));
  const opening = openMeasuredLink('https://example.test/form', 'survey_submitted');
  expect(logAnalyticsEvent).toHaveBeenCalledTimes(1);
  complete();
  await expect(opening).resolves.toBe(true);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('survey_submitted', undefined);
});
test('offline email taps retain their legacy name and flag even if the OS has no handler', async () => {
  jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('no handler'));
  await expect(openMeasuredLink('mailto:contact@example.test', 'email_sent', false)).resolves.toBe(false);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('email_sent', {is_offline_event: true});
});
test.each(['javascript:alert(1)', 'file:///private/secret', 'intent://example', null, 'https://example.test\ninvalid'])('rejects unsupported untrusted links: %s', async url => {
  const open = jest.spyOn(Linking, 'openURL');
  await expect(openMeasuredLink(url, 'test')).resolves.toBe(false);
  expect(open).not.toHaveBeenCalled();
});

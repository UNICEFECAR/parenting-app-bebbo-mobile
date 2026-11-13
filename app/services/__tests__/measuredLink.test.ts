import {Linking} from 'react-native';
import {openMeasuredLink} from '../measuredLink';
import {logAnalyticsEvent} from '../firebaseAnalytics';
jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn().mockResolvedValue(undefined)}));
beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());
test('only reports a link opening after the native handoff succeeds', async () => {
  let complete!: () => void;
  jest.spyOn(Linking, 'openURL').mockImplementation(() => new Promise(resolve => {complete = () => resolve(undefined);}));
  const opening = openMeasuredLink('https://example.test/form', 'survey_link_opened');
  expect(logAnalyticsEvent).not.toHaveBeenCalled();
  complete();
  await expect(opening).resolves.toBe(true);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('survey_link_opened');
});
test('a missing external app or failed URL does not produce a completion event or unhandled rejection', async () => {
  jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('no handler'));
  await expect(openMeasuredLink('mailto:contact@example.test', 'email_composer_opened')).resolves.toBe(false);
  expect(logAnalyticsEvent).not.toHaveBeenCalled();
});
test.each(['javascript:alert(1)', 'file:///private/secret', 'intent://example', null, 'https://example.test\ninvalid'])('rejects unsupported untrusted links: %s', async url => {
  const open = jest.spyOn(Linking, 'openURL');
  await expect(openMeasuredLink(url, 'test')).resolves.toBe(false);
  expect(open).not.toHaveBeenCalled();
});

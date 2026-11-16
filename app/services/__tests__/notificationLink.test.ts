import {Linking} from 'react-native';
import {openNotificationLink} from '../notificationLink';
import {logAnalyticsEvent} from '../firebaseAnalytics';
jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn().mockResolvedValue(undefined)}));
beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());
test('notification survey counts only a successful handoff, never a completed survey', async () => {
  let complete!: () => void;
  jest.spyOn(Linking, 'openURL').mockImplementation(() => new Promise(resolve => {complete = () => resolve(undefined);}));
  const opening = openNotificationLink('https://example.test/survey', 'survey');
  expect(logAnalyticsEvent).not.toHaveBeenCalled();
  complete();
  await expect(opening).resolves.toBe(true);
  expect(logAnalyticsEvent).toHaveBeenCalledTimes(1);
  expect(logAnalyticsEvent).toHaveBeenCalledWith('survey_link_opened');
});
test('generic links are not counted as surveys', async () => {
  jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  await expect(openNotificationLink('https://example.test/help', 'hyperlink')).resolves.toBe(true);
  expect(logAnalyticsEvent).not.toHaveBeenCalled();
});
test.each(['intent://launch', 'mailto:x@example.test', null])('untrusted notification links cannot launch native handlers or count surveys', async url => {
  const open = jest.spyOn(Linking, 'openURL');
  await expect(openNotificationLink(url, 'survey')).resolves.toBe(false);
  expect(open).not.toHaveBeenCalled();
  expect(logAnalyticsEvent).not.toHaveBeenCalled();
});
test('native handoff failure is recovered without a false survey count', async () => {
  jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('No handler'));
  await expect(openNotificationLink('https://example.test/survey', 'survey')).resolves.toBe(false);
  expect(logAnalyticsEvent).not.toHaveBeenCalled();
});

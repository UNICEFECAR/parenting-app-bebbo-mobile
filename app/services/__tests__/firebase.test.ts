jest.mock('../analyticsOutbox', () => ({saveAnalyticsRetry: jest.fn()}));
jest.mock('@react-native-firebase/app', () => ({ getApp: jest.fn(() => 'app') }));
jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(() => 'analytics'),
  getAppInstanceId: jest.fn().mockResolvedValue('permitted-instance'),
  logEvent: jest.fn(),
  setUserProperties: jest.fn(),
}));
jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(() => 'crashlytics'),
  log: jest.fn(),
  recordError: jest.fn(),
}));

import * as analytics from '@react-native-firebase/analytics';
import * as crashlytics from '@react-native-firebase/crashlytics';
import { logAnalyticsEvent, logCrashlyticsMessage, recordError, setUserProperties } from '../firebaseAnalytics';

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());

test('preserves child-count event names and parameters through the modular API', async () => {
  const params = { child_count: 2 };
  await logAnalyticsEvent('no_of_childsetup_onboarding', params);
  expect(analytics.logEvent).toHaveBeenCalledWith('analytics', 'no_of_childsetup_onboarding', params);
  await logAnalyticsEvent('child_added_from_manage_profile');
  expect(analytics.logEvent).toHaveBeenLastCalledWith('analytics', 'child_added_from_manage_profile', undefined);
});

test('omits undefined user properties while retaining null to clear a saved property', async () => {
  const properties = { country: 'test', relationship: null, unused: undefined };
  await setUserProperties(properties);
  expect(analytics.setUserProperties).toHaveBeenCalledWith('analytics', { country: 'test', relationship: null });
  expect(properties).toHaveProperty('unused', undefined);
});

test('records Crashlytics breadcrumbs and nonfatal errors through modular functions', async () => {
  const error = new Error('test nonfatal');
  logCrashlyticsMessage('test breadcrumb');
  await recordError(error);
  expect(crashlytics.log).toHaveBeenCalledWith('crashlytics', 'test breadcrumb');
  expect(crashlytics.recordError).toHaveBeenCalledWith('crashlytics', expect.objectContaining({message: 'Application operation failed'}));
  await recordError('test string error');
  expect(crashlytics.recordError).toHaveBeenLastCalledWith('crashlytics', expect.any(Error));
});

test('telemetry failures do not interrupt the user operation', async () => {
  jest.mocked(analytics.logEvent).mockImplementationOnce(() => { throw new Error('unavailable'); });
  jest.mocked(analytics.setUserProperties).mockRejectedValueOnce(new Error('unavailable'));
  jest.mocked(crashlytics.log).mockImplementationOnce(() => { throw new Error('unavailable'); });
  jest.mocked(crashlytics.recordError).mockImplementationOnce(() => { throw new Error('unavailable'); });
  await expect(logAnalyticsEvent('test_event')).resolves.toBeUndefined();
  await expect(setUserProperties({ country: 'test' })).resolves.toBeUndefined();
  expect(() => logCrashlyticsMessage('test')).not.toThrow();
  await expect(recordError('test')).resolves.toBeUndefined();
});

test('retry callers can distinguish SDK acceptance from rejected submissions', async () => {
  const {tryLogAnalyticsEvent} = require('../firebaseAnalytics');
  jest.mocked(analytics.logEvent).mockImplementationOnce(() => undefined);
  await expect(tryLogAnalyticsEvent('accepted')).resolves.toBe(true);
  jest.mocked(analytics.logEvent).mockImplementationOnce(() => {throw new Error('native failure');});
  await expect(tryLogAnalyticsEvent('retry')).resolves.toBe(false);
});


test('does not bypass denied consent with the retry store', async () => {
  jest.mocked(analytics.logEvent).mockImplementationOnce(() => {throw new Error('SDK failed');});
  jest.mocked(analytics.getAppInstanceId).mockResolvedValueOnce(null);
  await logAnalyticsEvent('safe_event');
  expect(require('../analyticsOutbox').saveAnalyticsRetry).not.toHaveBeenCalled();
});
test('stores only sanitised retry parameters when native submission fails and storage is permitted', async () => {
  jest.mocked(analytics.logEvent).mockImplementationOnce(() => {throw new Error('SDK failed');});
  await logAnalyticsEvent('article_searched', {article_searched: 'private text'});
  expect(require('../analyticsOutbox').saveAnalyticsRetry).toHaveBeenCalledWith({name: 'article_searched',
    params: {query_length: 12, captured_at_ms: expect.any(Number)}});
});
test('initialisation failure is contained within the telemetry operation', async () => {
  jest.mocked(require('@react-native-firebase/app').getApp).mockImplementationOnce(() => {throw new Error('missing configuration');});
  const {tryLogAnalyticsEvent} = require('../firebaseAnalytics');
  await expect(tryLogAnalyticsEvent('test_event')).resolves.toBe(false);
});


test('the first custom event waits for removal of legacy child attributes', async () => {
  jest.resetModules();
  const sdk = require('@react-native-firebase/analytics');
  let finish!: () => void;
  sdk.setUserProperties.mockImplementationOnce(() => new Promise<void>(resolve => {finish = resolve;}));
  const transport = require('../firebaseAnalytics');
  const sending = transport.logAnalyticsEvent('screen_view', {screen_name: 'Welcome'});
  expect(finish).toBeDefined();
  expect(sdk.setUserProperties).toHaveBeenCalledWith('analytics', expect.objectContaining({ageid: null, is_premature: null, child_gender: null}));
  expect(sdk.logEvent).not.toHaveBeenCalled();
  finish();
  await sending;
  expect(sdk.logEvent).toHaveBeenCalledTimes(1);
  await transport.logAnalyticsEvent('second_screen');
  expect(sdk.setUserProperties).toHaveBeenCalledTimes(1);
});

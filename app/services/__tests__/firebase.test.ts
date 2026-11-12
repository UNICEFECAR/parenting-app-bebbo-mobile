jest.mock('@react-native-firebase/app', () => ({ getApp: jest.fn(() => 'app') }));
jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(() => 'analytics'),
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
  expect(crashlytics.recordError).toHaveBeenCalledWith('crashlytics', error);
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

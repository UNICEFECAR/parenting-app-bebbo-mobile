// Exercise the installed RNFirebase JS implementation up to its native bridge.
const mockBridge = {setUserProperties: jest.fn(), logEvent: jest.fn()};
jest.mock('@react-native-firebase/app/dist/module/internal', () => ({
  FirebaseModule: class {native = mockBridge;},
  getOrCreateModularInstance: (Module: new () => unknown) => new Module(),
}));
jest.mock('@react-native-firebase/app/dist/module/internal/nativeModule', () => ({setReactNativeModule: jest.fn()}));
jest.mock('@react-native-firebase/app', () => ({getApp: () => ({})}));
jest.mock('@react-native-firebase/crashlytics', () => ({}));
jest.mock('../analyticsOutbox', () => ({saveAnalyticsRetry: jest.fn()}));

import {setUserProperties, tryLogAnalyticsEvent} from '../firebaseAnalytics';

test('RNFirebase forwards the dashboard properties, including clears, to its native module', async () => {
  const original = {platform: 'Android', distribution_channel: 'direct_apk', distribution_country: 'test',
    country: 'test', language: 'test', ageid: '42', is_premature: 'false', child_gender: 'Boy',
    relationship_with_child: 'mother', parent_gender: null, auto_child: 'false'};
  await setUserProperties(original);
  expect(mockBridge.setUserProperties).toHaveBeenCalledWith(original);
});

test('RNFirebase accepts the historical screen and detail event names and parameters', async () => {
  const calls = [
    ['screen_view', {screen_name: 'DetailsScreen', screen_class: 'DetailsScreen'}],
    ['DetailsScreen_opened', {}],
    ['advise_details_opened', {advise_id: 1, advice_catergory_id: 2}],
    ['game_details_opened', {game_id: 3, game_category_id: 4}],
  ] as const;
  for (const [name, params] of calls) {
    await expect(tryLogAnalyticsEvent(name, params)).resolves.toBe(true);
  }
  expect(mockBridge.logEvent.mock.calls).toEqual(calls);
});

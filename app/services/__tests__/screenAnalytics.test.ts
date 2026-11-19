jest.mock('../EventSyncService', () => ({logEvent: jest.fn()}));
jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn()}));
import {logAnalyticsEvent} from '../firebaseAnalytics';
import {logEvent} from '../EventSyncService';
import {trackScreen} from '../screenAnalytics';

test('ready, nested leaf changes, back and revisits preserve the historical pair', () => {
  let previous: string | undefined = 'Home'; // onReady seeds the active leaf
  for (const [key, name] of ['Home','Tools','DetailsScreen','DetailsScreen','Tools','Home','Tools'].entries()) {
    previous = trackScreen({name, key: String(key)}, previous, false);
  }
  const changes = ['Tools','DetailsScreen','Tools','Home','Tools'];
  expect(jest.mocked(logAnalyticsEvent).mock.calls).toEqual(changes.map(name =>
    ['screen_view', {screen_name:name, screen_class:name}]));
  expect(jest.mocked(logEvent).mock.calls).toEqual(changes.map(name => [{name:name + '_opened'},false]));
});

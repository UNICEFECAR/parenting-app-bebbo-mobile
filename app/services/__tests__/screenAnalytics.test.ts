jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn()}));
import {logAnalyticsEvent} from '../firebaseAnalytics';
import {trackScreen} from '../screenAnalytics';
test('one screen view and historical opened event per changed route name', () => {
  let previous = 'Home';
  for (const route of [{name:'Home'}, {name:'Tools',key:'a'}, {name:'Tools',key:'b'}]) {
    previous = trackScreen(route, previous)!;
  }
  expect(jest.mocked(logAnalyticsEvent).mock.calls).toEqual([
    ['screen_view',{screen_name:'Tools',screen_class:'Tools'}], ['Tools_opened'],
  ]);
});

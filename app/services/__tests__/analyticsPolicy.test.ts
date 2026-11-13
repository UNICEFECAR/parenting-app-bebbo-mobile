import {prepareAnalyticsEvent} from '../analyticsPolicy';
jest.mock('../firebaseAnalytics', () => ({logAnalyticsEvent: jest.fn().mockResolvedValue(undefined)}));
import {logAnalyticsEvent} from '../firebaseAnalytics';
import {trackScreen} from '../screenAnalytics';

test('does not collect search text, child health data, identifiers or unknown fields', () => {
  const params = {article_searched: 'رقم هاتف 12345', uuid: 'child', weight: 14, is_premature: true,
    vaccine_id: ['1'], age_id: 2, child_count: 2, advise_id: '12', arbitrary: 'text'};
  expect(prepareAnalyticsEvent('article_searched', params)).toEqual({name: 'article_searched',
    params: {child_count: 2, advise_id: 12, query_length: [...params.article_searched].length}});
  expect(params.article_searched).toBe('رقم هاتف 12345');
});
test('turns dynamic category impressions into one stable event with a public content ID', () => {
  expect(prepareAnalyticsEvent('advice_category_selected_42')).toEqual({name: 'advice_category_viewed', params: {category_id: 42}});
});
test.each(['bad-name', 'a'.repeat(41), 'ga_event', 'firebase_error', 'google_event', 123])('rejects invalid or reserved names %s', name => {
  expect(prepareAnalyticsEvent(name)).toBeNull();
});
test('normalises primitive parameters, rejecting arrays, nonfinite numbers and text in ID fields', () => {
  expect(prepareAnalyticsEvent('test', {is_offline_event: true, advise_id: 'name', child_count: Infinity,
    category_id: [1], screen_name: 'DetailsScreen'})).toEqual({name: 'test', params: {is_offline_event: 1, screen_name: 'DetailsScreen'}});
});
test('records the first screen and a new instance, but not duplicate navigation callbacks', () => {
  jest.mocked(logAnalyticsEvent).mockClear();
  let previous = trackScreen({name: 'DetailsScreen', key: 'first'});
  previous = trackScreen({name: 'DetailsScreen', key: 'first'}, previous);
  trackScreen({name: 'DetailsScreen', key: 'second'}, previous);
  expect(jest.mocked(logAnalyticsEvent).mock.calls.filter(call => call[0] === 'screen_view')).toHaveLength(2);
  expect(trackScreen(undefined, 'second')).toBe('second');
});

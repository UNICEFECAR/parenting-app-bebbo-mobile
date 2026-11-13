import {getCurrentChildAgeInMonths, getNotificationDateInString} from '../ageLabels';
const t = (key: string, values?: {ageStr: string}) => key === 'notiTimeAgoTxt' ? `${values?.ageStr} ago` : key;
beforeEach(() => {jest.useFakeTimers(); jest.setSystemTime(new Date('2026-01-10T12:00:00Z'));});
afterEach(() => jest.useRealTimers());

test.each(['2026-01-11', '2026-01-17', '2026-02-10', '2027-01-10'])('future date %s is recognised as unborn', date => {
  expect(getCurrentChildAgeInMonths(t, date, false)).toBe('noBorn');
  expect(getNotificationDateInString(t, date, false)).toBe('noBorn');
});
test('calendar dates accept Realm Date and exported milliseconds', () => {
  for (const value of ['2026-01-09', new Date('2026-01-09T12:00:00Z'), Date.parse('2026-01-09T12:00:00Z')]) {
    expect(getCurrentChildAgeInMonths(t, value, false)).toBe('1 daytag');
    expect(getNotificationDateInString(t, value, false)).toBe('1 daytag ago');
  }
});
test('today retains its original labels', () => {
  expect(getCurrentChildAgeInMonths(t, '2026-01-10', false)).toBe('noday');
  expect(getNotificationDateInString(t, '2026-01-10', false)).toBe('todayTxt');
});
test('invalid dates cannot silently produce a newborn or today label', () => {
  expect(getCurrentChildAgeInMonths(t, 'invalid', false)).toBe('');
  expect(getNotificationDateInString(t, 'invalid', false)).toBe('');
});
test('existing days and years/months pluralisation is preserved', () => {
  expect(getCurrentChildAgeInMonths(t, '2025-12-20', true)).toBe('21 daytag');
  expect(getCurrentChildAgeInMonths(t, '2024-11-10', false)).toBe('1 yeartag childInfoAndText 2 monthstag');
});

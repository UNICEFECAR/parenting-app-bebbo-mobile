import {localisedDigits} from '../localisedDigits';
test.each([
  ['ar-EG','١٢.٥'],['GRarb','١٢.٥'],['ur-PK','۱۲.۵'],['urd','۱۲.۵'],['bn','১২.৫'],
  ['hi-IN','१२.५'],['hin','१२.५'],['tr-TR','12.5'],['unknown','12.5'],[null,'12.5'],
])('formats digits with the registered/BCP47 locale %s without reversing number order', (locale, expected) => {
  expect(localisedDigits(12.5,locale)).toBe(expected);
});
test('preserves signs, units, mixed text and existing script digits', () => {
  expect(localisedDigits('-12 cm / ۰', 'ur_PK')).toBe('-۱۲ cm / ۰');
  expect(localisedDigits(undefined,'ar')).toBe('');
  expect(localisedDigits(0,'ar')).toBe('٠');
});

import {initialLanguage} from '../initialLanguage';
const first = Object.freeze({languageCode: 'en', luxonLocale: 'en-ZW'}),
  second = Object.freeze({languageCode: 'nd', luxonLocale: 'nd-ZW'});
const languages = Object.freeze([first, second]);
test('device match returns a record rather than a one-element array', () => {
  expect(initialLanguage(undefined, languages, 'nd-ZW', undefined)).toBe(
    second,
  );
  expect(initialLanguage(undefined, languages, undefined, 'nd')).toBe(second);
});
test('explicit and historical wrapped choices are retained', () => {
  expect(initialLanguage(second, languages, 'en-ZW', 'en')).toBe(second);
  expect(initialLanguage([second], languages, 'en-ZW', 'en')).toBe(second);
});
test('the country-specific first-language rule is retained and invalid metadata is safe', () => {
  expect(initialLanguage(undefined, languages, 'nd-ZW', 'nd', true)).toBe(
    first,
  );
  expect(initialLanguage(undefined, languages, 'xx', 'xx')).toBe(first);
  expect(
    initialLanguage(undefined, undefined, undefined, undefined),
  ).toBeUndefined();
  expect(initialLanguage(undefined, [null, first], undefined, undefined)).toBe(
    first,
  );
});

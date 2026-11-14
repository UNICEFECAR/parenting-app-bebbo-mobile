import {getHtmlOfflineImageSource, getImagePathPartsFromUrl, resolveImageSource} from '../imageResolver';
jest.mock('@d11/react-native-fast-image', () => ({priority: {high: 'high'}, cacheControl: {immutable: 'immutable', cacheOnly: 'cache-only'}}));
jest.mock('../../instances', () => ({appConfig: {baseUrl: 'https://cms.example.test', offlineImageMap: {'2026-01/photo name.jpg': 42}}}));

test.each([null, undefined, 123, {}, []])('malformed CMS image metadata falls back safely: %s', value => {
  expect(resolveImageSource({imageUrl: value as any, defaultImage: 7})).toMatchObject({onlineSource: null, bundledSource: null, defaultSource: 7});
  expect(getHtmlOfflineImageSource(value as any, {})).toBeNull();
});
test.each(['https://cms.example.test/2026-01/%E0%A4.jpg', 'https://cms.example.test/2026-01/100%.jpg'])('malformed percent escapes do not crash article rendering: %s', value => {
  expect(getHtmlOfflineImageSource(value, {})).toBeNull();
  expect(() => getImagePathPartsFromUrl(value)).not.toThrow();
});
test.each(['http', 'https'])('bundled image lookup is independent of the network scheme: %s', scheme => {
  const url = `${scheme}://cms.example.test/sites/default/files/2026-01/photo%20name.jpg?itok=1`;
  expect(resolveImageSource({imageUrl: url, defaultImage: 7}).bundledSource).toBe(42);
  expect(getHtmlOfflineImageSource(url, {'2026-01/photo name.jpg': 42})).toBe(42);
});

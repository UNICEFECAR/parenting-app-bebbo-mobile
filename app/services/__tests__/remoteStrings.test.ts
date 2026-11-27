import i18next from 'i18next';
import {createRemoteStrings, parseRemoteStrings} from '../../localization/remoteStrings';

const bundled = {
  en: {translation: {title: 'Bundled English', greeting: 'Hello {{name}}', untouched: 'English only'}},
  ALsq: {translation: {title: 'Titulli lokal', greeting: 'Përshëndetje {{name}}'}},
};
const row = (field_unique_name: string, name: string, status = '1') => ({field_unique_name, name, status});
const response = (langcode = 'al-sq', data = [row('title', 'Titulli nga CMS')]) => ({status: 200, langcode, data});
let cache: Map<string, string>;
let storage: {getItem: jest.Mock; setItem: jest.Mock};
beforeEach(() => {
  cache = new Map();
  storage = {
    getItem: jest.fn(async key => cache.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {cache.set(key, value);}),
  };
});
async function setup(fetchStrings = jest.fn().mockResolvedValue(response()), scope = 'bebbo:server', locale = 'ALsq') {
  const i18n = i18next.createInstance();
  await i18n.init({lng: locale, fallbackLng: false, load: 'currentOnly', cleanCode: false,
    resources: JSON.parse(JSON.stringify(bundled))});
  const cacheService = createRemoteStrings({i18n, bundled, storage, scope});
  // Simulate the API saga handing an accepted response to the cache service.
  const service = {...cacheService, refresh: async (locale: string, code: string) => {
    try { await cacheService.acceptResponse(locale, code, await fetchStrings(code)); return true; }
    catch { return false; }
  }};
  return {i18n, service, fetchStrings};
}
test('CMS text updates immediately, preserves same-language bundle gaps and survives offline restart', async () => {
  const first = await setup();
  expect(first.i18n.t('title')).toBe('Titulli lokal');
  const updated = jest.fn();
  first.i18n.store.on('added', updated);
  expect(await first.service.refresh('ALsq', 'al-sq')).toBe(true);
  expect(first.i18n.t('title')).toBe('Titulli nga CMS');
  expect(first.i18n.t('greeting', {name: 'Ana'})).toBe('Përshëndetje Ana');
  expect(first.i18n.t('untouched')).toBe('untouched');
  expect(updated).toHaveBeenCalled();
  expect(bundled.ALsq.translation.title).toBe('Titulli lokal');
  const offline = await setup(jest.fn().mockRejectedValue(new Error('Offline')));
  await offline.service.hydrate('ALsq');
  await offline.service.refresh('ALsq', 'al-sq');
  expect(offline.i18n.t('title')).toBe('Titulli nga CMS');
});
test('later snapshots remove missing or unpublished overrides and restore the bundle', async () => {
  const {service, i18n, fetchStrings} = await setup();
  await service.refresh('ALsq', 'al-sq');
  fetchStrings.mockResolvedValue(response('al-sq', [row('title', 'Inactive', '0')]));
  await service.refresh('ALsq', 'al-sq');
  expect(i18n.t('title')).toBe('Titulli lokal');
});
test('invalid rows, unknown keys and broken placeholders cannot replace bundled messages', () => {
  expect(parseRemoteStrings(response('al-sq', [
    row('title', '  '), row('greeting', 'Missing token'), row('__proto__', 'bad'),
    row('constructor', 'bad'), row('unknown', 'value'), null as any,
  ]), 'al-sq', bundled.ALsq.translation)).toEqual({});
  expect(parseRemoteStrings(response('al-sq', [row('greeting', 'Mirë se erdhe {{name}}')]),
    'al-sq', bundled.ALsq.translation).greeting).toContain('{{name}}');
});
test.each([{status: 500}, {status: 200, langcode: 'en', data: []}, {status: 200, langcode: 'al-sq', data: {}}])(
  'bad response keeps the last saved strings: %j', async payload => {
    const {service, i18n, fetchStrings} = await setup();
    await service.refresh('ALsq', 'al-sq');
    fetchStrings.mockResolvedValue(payload);
    expect(await service.refresh('ALsq', 'al-sq')).toBe(false);
    expect(i18n.t('title')).toBe('Titulli nga CMS');
  },
);
test('storage failure keeps the saved version and corrupt caches use bundled text', async () => {
  const first = await setup();
  storage.setItem.mockRejectedValue(new Error('Full'));
  expect(await first.service.refresh('ALsq', 'al-sq')).toBe(false);
  expect(first.i18n.t('title')).toBe('Titulli lokal');
  storage.getItem.mockResolvedValue('{bad JSON');
  const second = await setup();
  await second.service.hydrate('ALsq');
  expect(second.i18n.t('title')).toBe('Titulli lokal');
});
test('cache is isolated between flavours, servers and languages', async () => {
  const first = await setup();
  await first.service.refresh('ALsq', 'al-sq');
  for (const scope of ['babuni:server', 'bebbo:another-server']) {
    const other = await setup(undefined, scope);
    await other.service.hydrate('ALsq');
    expect(other.i18n.t('title')).toBe('Titulli lokal');
  }
  const english = await setup(undefined, 'bebbo:server', 'en');
  await english.service.hydrate('en');
  expect(english.i18n.t('title')).toBe('Bundled English');
});
test('a late response updates only its requested locale', async () => {
  let finish!: (value: unknown) => void;
  const reply = new Promise(resolve => {finish = resolve;});
  const fetchStrings = jest.fn(() => reply);
  const {service, i18n} = await setup(fetchStrings);
  const pending = service.refresh('ALsq', 'al-sq');
  await i18n.changeLanguage('en');
  finish(response());
  await pending;
  expect(fetchStrings).toHaveBeenCalledTimes(1);
  expect(i18n.language).toBe('en');
  expect(i18n.t('title')).toBe('Bundled English');
  await i18n.changeLanguage('ALsq');
  expect(i18n.t('title')).toBe('Titulli nga CMS');
});

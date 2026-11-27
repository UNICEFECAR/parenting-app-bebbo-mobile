import type {i18n} from 'i18next';

type Strings = Record<string, string>;
type Resources = Record<string, {translation: Strings}>;
type Storage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
};
type Options = {
  i18n: i18n;
  bundled: Resources;
  storage: Storage;
  scope: string;
};

const has = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);
const tokens = (text: string) => [...new Set(text.match(/\{\{[^{}]+\}\}/g) ?? [])].sort().join('|');

function validString(key: string, value: unknown, bundled: Strings): value is string {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype' &&
    has(bundled, key) && typeof value === 'string' && value.trim().length > 0 &&
    tokens(value) === tokens(bundled[key]);
}

/** A successful response is a full snapshot. Missing/unpublished keys use the bundle. */
export function parseRemoteStrings(payload: any, languageCode: string, bundled: Strings): Strings {
  if (!payload || payload.status !== 200 || payload.langcode !== languageCode || !Array.isArray(payload.data)) {
    throw new Error('Invalid strings response');
  }
  const result: Strings = {};
  for (const item of payload.data) {
    if (item && (item.status === '1' || item.status === 1) &&
      typeof item.field_unique_name === 'string' && validString(item.field_unique_name, item.name, bundled)) {
      result[item.field_unique_name] = item.name;
    }
  }
  return result;
}

export function createRemoteStrings(options: Options) {
  const {i18n, bundled, storage, scope} = options;
  const loaded = new Map<string, Promise<void>>();
  const cacheKey = (locale: string) => `cms-strings:v1:${encodeURIComponent(scope)}:${encodeURIComponent(locale)}`;
  const apply = (locale: string, overrides: Strings) => {
    // Always rebuild from the untouched bundle so removed CMS values cannot linger.
    i18n.addResourceBundle(locale, 'translation', {...bundled[locale].translation, ...overrides}, false, true);
  };
  const hydrate = (locale: string): Promise<void> => {
    if (!has(bundled, locale)) return Promise.resolve();
    const existing = loaded.get(locale);
    if (existing) return existing;
    const task = (async () => {
      try {
        const raw = await storage.getItem(cacheKey(locale));
        if (!raw) return;
        const cached = JSON.parse(raw);
        if (cached.version !== 1 || !cached.strings || typeof cached.strings !== 'object' || Array.isArray(cached.strings)) return;
        const strings: Strings = {};
        for (const [key, value] of Object.entries(cached.strings)) {
          if (validString(key, value, bundled[locale].translation)) strings[key] = value;
        }
        apply(locale, strings);
      } catch {
        // Corrupt/unavailable cache must not prevent offline startup.
      }
    })();
    loaded.set(locale, task);
    return task;
  };
  // Downloads and retries belong to the shared API saga. This service only stores text.
  const acceptResponse = async (locale: string, languageCode: string, payload: unknown): Promise<void> => {
    if (!has(bundled, locale) || !languageCode) throw new Error('Unsupported strings locale');
    await hydrate(locale);
    const strings = parseRemoteStrings(payload, languageCode, bundled[locale].translation);
    // Persist before publishing, so a failed write keeps the last saved snapshot.
    await storage.setItem(cacheKey(locale), JSON.stringify({version: 1, strings}));
    apply(locale, strings);
  };
  return {hydrate, acceptResponse};
}

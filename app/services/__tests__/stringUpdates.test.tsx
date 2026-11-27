import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Text} from 'react-native';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import axiosService from '../axiosService';
import {remoteStrings} from '../../localization/stringResources';
import '../../localization/initI18next';

jest.mock('../../../App', () => ({
  store: {dispatch: jest.fn()},
  useAppSelector: (select: any) => select({selectedCountry: {locale: 'ALsq', languageCode: 'al-sq'}}),
}));
jest.mock('../../redux/reducers/localizationSlice', () => ({
  onLocalizationSelect: (payload: unknown) => ({type: 'localization/select', payload}),
}));
jest.mock('../../instances', () => ({
  backupFlavor: 'test',
  AVAILABLE_LANGUAGES: {
    ALsq: {translation: {title: 'Nga skedari', bundledOnly: 'Vetëm lokalisht'}},
    en: {translation: {title: 'Bundled English'}},
  },
  localization: [{countryId: 1, languages: [
    {locale: 'ALsq', languageCode: 'al-sq', luxonLocale: 'sq-AL'},
    {locale: 'en', languageCode: 'en', luxonLocale: 'en-US'},
  ]}],
}));
jest.mock('react-native-localize', () => ({findBestLanguageTag: () => ({languageTag: 'sq-AL'})}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async key => key === 'APP_LANG' ? 'ALsq' : key.endsWith(':ALsq')
      ? JSON.stringify({version: 1, strings: {title: 'Nga ruajtja'}}) : null),
    setItem: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../axiosService', () => ({__esModule: true, default: {get: jest.fn()}}));
function Label() {
  const {t} = useTranslation();
  return <Text>{t('title')}</Text>;
}
const flush = () => new Promise<void>(resolve => setImmediate(resolve));

test('startup and offline language switches load cached text without an API request; accepted batch text refreshes the screen', async () => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  if (!i18n.isInitialized) await new Promise<void>(resolve => i18n.on('initialized', () => resolve()));
  expect(i18n.language).toBe('ALsq');
  expect(i18n.t('title')).toBe('Nga ruajtja');
  expect(i18n.t('bundledOnly')).toBe('Vetëm lokalisht');
  expect(i18n.options.fallbackLng).toBe(false);
  let renderer!: TestRenderer.ReactTestRenderer;
  try {
    await act(async () => {renderer = TestRenderer.create(<Label />); await flush();});
    expect(renderer.root.findByType(Text).props.children).toBe('Nga ruajtja');
    await act(async () => {
      await remoteStrings.acceptResponse('ALsq', 'al-sq', {status: 200, langcode: 'al-sq',
        data: [{field_unique_name: 'title', name: 'Nga CMS', status: '1'}]});
      await flush();
    });
    expect(renderer.root.findByType(Text).props.children).toBe('Nga CMS');
    await act(async () => {await i18n.changeLanguage('en'); await flush();});
    expect(renderer.root.findByType(Text).props.children).toBe('Bundled English');
    await act(async () => {await i18n.changeLanguage('ALsq'); await flush();});
    expect(renderer.root.findByType(Text).props.children).toBe('Nga CMS');
    expect(axiosService.get).not.toHaveBeenCalled();
  } finally {
    act(() => renderer?.unmount());
  }
});

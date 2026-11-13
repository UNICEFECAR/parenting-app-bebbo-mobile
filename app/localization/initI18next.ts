import i18n, {
  LanguageDetectorAsyncModule,
  Services,
  InitOptions,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { store } from '../../App';
import { onLocalizationSelect } from '../redux/reducers/localizationSlice';
import { localization, AVAILABLE_LANGUAGES } from '../instances/index';

const localisationnew = [...localization];
const findAllByKey: any = (obj: object | null, keyToFind: string) => {
  if (obj) {
    return Object.entries(obj)
      .reduce((acc, [key, value]) => (key === keyToFind)
        ? acc.concat(value)
        : (typeof value === 'object')
          ? acc.concat(findAllByKey(value, keyToFind))
          : acc
        , [])
  }
}

const findLangCode = (languageTag: string | undefined): any => {
  const obj = localisationnew.reduce((prev, product): any => prev || product.languages.find((item: any) => item.luxonLocale === languageTag && item.locale != 'RSen'), undefined);
  const obj2 = obj ? obj.locale : obj;
  return obj2;
}
const AVALAILABLE_LANG_CODES: any = findAllByKey(localisationnew, 'luxonLocale');
const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  callbackApi: false,
  init: (
    _services: Services,
    _detectorOptions: object,
    _i18nextOptions: InitOptions,
  ) => {
    /* use services and options */
  },
  detect: async () => {
    let lng: string | null = null;
    try {
      lng = await AsyncStorage.getItem('APP_LANG');
    } catch (error) {
      console.log('Unable to read saved app language:', error);
    }
    if (lng) {
      return lng;
    }

    // Keep the existing device-language/default-country selection on missing data or read failure.
    const bestLng = RNLocalize.findBestLanguageTag(AVALAILABLE_LANG_CODES);
    const langCodeNew = findLangCode(bestLng?.languageTag);
    const lang2 = langCodeNew ? langCodeNew : localization[localization.length - 1]?.languages[0]?.locale;
    const country = localization.find((x: any) => x.languages.some((item: any) => item.locale === lang2));
    const language = localization.reduce((prev: any, product: any) => prev || product.languages.find((item: any) => item.locale === lang2), undefined);
    store.dispatch(onLocalizationSelect({ country, language }));
    return langCodeNew ?? localization[localization.length - 1]?.languages[0]?.locale;
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('APP_LANG', lng);
    } catch (error) {
      console.log('Unable to save app language:', error);
    }
  },
};
const trimwhiteSpace = (str:any):any => {
  return str.length ? str.trim(): str
}
i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use({
    type: 'postProcessor',
    name: 'trimwhitespace',
    process: function (value: any) {
      return trimwhiteSpace(value);
    }
  })
  .init({
    // Preserve pre-v27 locale casing, empty translations and fallback behaviour.
    cleanCode: false,
    returnEmptyString: true,
    fallbackLng: ['dev'],
    resources: AVAILABLE_LANGUAGES,
  //   load: 'currentOnly',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    postProcess: ["trimwhitespace"]
  });

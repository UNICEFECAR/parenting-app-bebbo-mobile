import i18n, {
    LanguageDetectorAsyncModule,
    Services,
    InitOptions,
  } from 'i18next';
  import {initReactI18next} from 'react-i18next';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import * as RNLocalize from 'react-native-localize';
  import en from '../assets/translations/en';
  import RSsr from '../assets/translations/RSsr';
  import MEcnr from '../assets/translations/MEcnr';
  import ALsq from '../assets/translations/ALsq';
  import BGbg from '../assets/translations/BGbg';
  import GRel from '../assets/translations/GRel';
  import KGky from '../assets/translations/KGky';
  import KGru from '../assets/translations/KGru';
  import MKmk from '../assets/translations/MKmk';
  import MKsq from '../assets/translations/MKsq';
  import TJru from '../assets/translations/TJru';
  import TJtg from '../assets/translations/TJtg';
  import UZru from '../assets/translations/UZru';
  import UZuz from '../assets/translations/UZuz';
  import XKsq from '../assets/translations/XKsq';
  import XKrs from '../assets/translations/XKrs';
  import RSen from '../assets/translations/RSen';
  // import BYbe from '../assets/translations/BYbe';
  // import BYru from '../assets/translations/BYru';

  export const AVAILABLE_LANGUAGES = {
    en,
    RSsr,
    MEcnr,
    ALsq,
    BGbg,
    GRel,
    KGky,
    KGru,
    MKmk,
    MKsq,
    TJru,
    TJtg,
    UZru,
    UZuz,
    XKsq,
    XKrs,
    RSen,
    // BYbe,
    // BYru
  };
  console.log(AVAILABLE_LANGUAGES,"----");
  const AVALAILABLE_LANG_CODES = Object.keys(AVAILABLE_LANGUAGES);
  
  const languageDetector: LanguageDetectorAsyncModule = {
    type: 'languageDetector',
    // If this is set to true, your detect function receives a callback function that you should call with your language,
    //useful to retrieve your language stored in AsyncStorage for example
    async: true,
    init: (
      _services: Services,
      _detectorOptions: object,
      _i18nextOptions: InitOptions,
    ) => {
      /* use services and options */
    },
    detect: (callback: (lng: string) => void) => {
      AsyncStorage.getItem('APP_LANG', (err, lng) => {
        // Error fetching stored data or no language was stored
        if (err || !lng) {
          if (err) {
            console.log('Error fetching "APP_LANG" from async store', err);
          } else {
            console.log(
              'No language is set, choosing the best available or English as fallback',
            );
          }
          const bestLng = RNLocalize.findBestAvailableLanguage(AVALAILABLE_LANG_CODES);
          console.log(bestLng,"--bestLng--- ");
          callback(bestLng?.languageTag ?? 'en');
          return;
        }
        callback(lng);
      });
    },
    cacheUserLanguage: (lng: string) => {
      console.log("lng---cache ",lng);
      AsyncStorage.setItem('APP_LANG', lng);
    },
  };
  
  i18n
    .use(languageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: AVAILABLE_LANGUAGES,
    //   load: 'currentOnly',
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
    });
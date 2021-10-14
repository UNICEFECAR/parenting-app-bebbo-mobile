import i18n, {
    LanguageDetectorAsyncModule,
    Services,
    InitOptions,
  } from 'i18next';
  import {initReactI18next} from 'react-i18next';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import * as RNLocalize from 'react-native-localize';
  import en from '@assets/translations/appConstants/en';
  import RSsr from '@assets/translations/appConstants/RSsr';
  import MEcnr from '@assets/translations/appConstants/MEcnr';
  import ALsq from '@assets/translations/appConstants/ALsq';
  import BGbg from '@assets/translations/appConstants/BGbg';
  import GRel from '@assets/translations/appConstants/GRel';
  import KGky from '@assets/translations/appConstants/KGky';
  import KGru from '@assets/translations/appConstants/KGru';
  import MKmk from '@assets/translations/appConstants/MKmk';
  import MKsq from '@assets/translations/appConstants/MKsq';
  import TJru from '@assets/translations/appConstants/TJru';
  import TJtg from '@assets/translations/appConstants/TJtg';
  import UZru from '@assets/translations/appConstants/UZru';
  import UZuz from '@assets/translations/appConstants/UZuz';
  import XKsq from '@assets/translations/appConstants/XKsq';
  import XKrs from '@assets/translations/appConstants/XKrs';
  import RSen from '@assets/translations/appConstants/RSen';
  import BYbe from '@assets/translations/appConstants/BYbe';
  import BYru from '@assets/translations/appConstants/BYru';
  import { localization } from '@assets/data/localization';
  import { Alert } from 'react-native';
  import { store } from '../../App';
  import { onLocalizationSelect } from '../redux/reducers/localizationSlice';

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
    BYbe,
    BYru
  };
  const newArr: any[] = [];
  const localisationnew = [...localization];
  // const localisationnew = arrCopy.filter(o=>o.languages = o.languages.filter(x=> x.languageCode != 'rs-en'))
  console.log(localisationnew,"--localisationnew");
  const findAllByKey:any = (obj: object | null, keyToFind: string) => {
    return Object.entries(obj)
      .reduce((acc, [key, value]) => (key === keyToFind)
        ? acc.concat(value)
        : (typeof value === 'object')
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc
      , [])
  }

  const findLangCode = (languageTag: string | undefined) => {
    const obj = localisationnew.reduce((prev, product):any => prev || product.languages.find(item => item.luxonLocale === languageTag && item.locale != 'RSen'), undefined);
    console.log("obj---",obj)
    const obj2 = obj ? obj.locale : obj;
    console.log("obj2--",obj2);
    return obj2;
  }
 // console.log(AVAILABLE_LANGUAGES,"----");
  // const AVALAILABLE_LANG_CODES = Object.keys(AVAILABLE_LANGUAGES);
  const AVALAILABLE_LANG_CODES = findAllByKey(localisationnew,'luxonLocale');
  console.log(AVALAILABLE_LANG_CODES,"AVALAILABLE_LANG_CODES34");
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
      // console.log("2233333");
    },
    detect: (callback: (lng: string) => void) => {
      AsyncStorage.getItem('APP_LANG', (err, lng) => {
        //Alert.alert("getitem async called",lng);
        // Error fetching stored data or no language was stored
        if (err || !lng) {
          if (err) {
          //  console.log('Error fetching "APP_LANG" from async store', err);
          } else {
            // console.log(
            //   'No language is set, choosing the best available or English as fallback',
            // );
          }
          const bestLng = RNLocalize.findBestAvailableLanguage(AVALAILABLE_LANG_CODES);
         // console.log(bestLng,"--bestLng--- ");
         console.log(bestLng,"--bestLng--- ",AVALAILABLE_LANG_CODES);
         const langCodeNew = findLangCode(bestLng?.languageTag);
         console.log("langCodeNew---",langCodeNew);
         let lang2 = langCodeNew ?langCodeNew : 'en';
         const country = localization.find(x => x.languages.some(item => item.locale === lang2));
        const language = localization.reduce((prev, product):any => prev || product.languages.find(item => item.locale === lang2), undefined);
        console.log(country,"--country--",language);
        store.dispatch(onLocalizationSelect({country,language}))
          callback(langCodeNew ?? 'en');
          //callback(bestLng?.languageTag ?? 'en');
          return;
        }
        callback(lng);
      });
    },
    cacheUserLanguage: (lng: string) => {
    //  console.log("lng---cache ",lng);
      AsyncStorage.setItem('APP_LANG', lng);
    },
  };
  const trimwhiteSpace = (str:any) => {
    return str.length ? str.trim(): str
  }
  i18n
    .use(languageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .use({
      type: 'postProcessor',
      name: 'trimwhitespace',
      process: function (value: any, key: any, options: any, translator: any) {
        return trimwhiteSpace(value);
      }
    })
    .init({
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
// import { localization } from '@dynamicImportsClass/dynamicImports';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { act } from 'react-test-renderer';

interface SelectedLocalizationType {
  countryId: number;
  countrySelectedId: number;
  languageCode: string;
  luxonLocale: string;
  locale: string;
  selectedLocale: string;
  pluralShow: boolean;
  sponsors: Array<any>;
  countries: string;
  restartOnLangChange: string;
  AppLayoutDirection: string;
  AppLayoutDirectionScreen: string;
  AppLayoutDirectionParams: any;
}
const initialState: SelectedLocalizationType = {
  countryId: 126,
  languageCode: 'en',
  luxonLocale: 'en',
  locale: 'en',
  pluralShow: false,
  sponsors: [],
  countries: '',
  restartOnLangChange: 'no',
  AppLayoutDirection: 'ltr',
  AppLayoutDirectionScreen: 'LanguageSelection',
  AppLayoutDirectionParams: {},
  countrySelectedId: 0,
  selectedLocale: ''
};

export const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    onLocalizationSelect: (state, action: PayloadAction<any>): any => {
      console.log('LanguageCode is', action.payload)
      if (action?.payload?.language?.languageCode != undefined) {
        state.countryId = action.payload.country.countryId;
        state.languageCode = action.payload.language.languageCode;
        state.luxonLocale = action.payload.language.luxonLocale;
        state.locale = action.payload.language.locale;
        state.pluralShow = action.payload.language.pluralShow;
      } else {
        console.log('country default is', action.payload)
        state.countryId = action.payload.countryId;
        state.countrySelectedId = action.payload.countryId;
        state.languageCode = action.payload.languages[0].languageCode;
        state.luxonLocale = action.payload.languages[0].luxonLocale;
        state.locale = action.payload.languages[0].locale;
        state.selectedLocale = action.payload.languages[0].locale;
        state.pluralShow = action.payload.languages[0].pluralShow;
      }
    },
    oncountrtIdChange: (state, action: PayloadAction<any>): any => {
      state.countryId = action.payload;
    },

    setSponsorStore: (
      state,
      action: PayloadAction<any>,
    ): any => {
      state.sponsors = action.payload;
    },
    setCountriesStore: (
      state,
      action: PayloadAction<any>,
    ): any => {
      (typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : null;
       state.countries = action.payload;
      //(typeof action.payload == 'object') ? (action.payload = JSON.stringify(action.payload)) : action.payload = action.payload;
      //  console.log('type of data', action.payload)
    },
    setChildStore: (
      state,
      action: PayloadAction<any>,
    ): any => {
      console.log(action.payload, "--", state);
    },
    setrestartOnLangChange: (
      state,
      action: PayloadAction<any>,
    ): any => {
      state.restartOnLangChange = action.payload;
    },
    setAppLayoutDirection: (
      state,
      action: PayloadAction<any>,
    ): any => {
      state.AppLayoutDirection = action.payload;
    },
    setAppLayoutDirectionScreen: (
      state,
      action: PayloadAction<any>,
    ): any => {
      state.AppLayoutDirectionScreen = action.payload;
    },
    setAppLayoutDirectionParams: (
      state,
      action: PayloadAction<any>,
    ): any => {
      state.AppLayoutDirectionParams = action.payload;
    },
  },
});

export const { onLocalizationSelect, setCountriesStore, setChildStore, setSponsorStore, oncountrtIdChange, setrestartOnLangChange, setAppLayoutDirection, setAppLayoutDirectionScreen, setAppLayoutDirectionParams } = localizationSlice.actions;

export default localizationSlice.reducer;

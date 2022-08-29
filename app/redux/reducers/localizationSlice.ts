import {localization} from '@dynamicImportsClass/dynamicImports';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedLocalizationType {
  countryId: number;
  languageCode: string;
  luxonLocale:string;
  locale: string;
  pluralShow:boolean;
  sponsors:Array<any>;
  restartOnLangChange:string;
  AppLayoutDirection:string;
  AppLayoutDirectionScreen:string;
  AppLayoutDirectionParams:any;
}
const initialState: SelectedLocalizationType = {
  countryId: localization[localization.length-1].countryId, //126
  languageCode: localization[localization.length-1].languages[0].languageCode, //'en'
  luxonLocale: localization[localization.length-1].languages[0].luxonLocale, //'en'
  locale:  localization[localization.length-1]?.languages[0]?.locale, //'en'
  pluralShow:localization[localization.length-1]?.languages[0]?.pluralShow,//false
  sponsors:[],
  restartOnLangChange:'no',
  AppLayoutDirection:'ltr',
  AppLayoutDirectionScreen:'LanguageSelection',
  AppLayoutDirectionParams:{}
};

export const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    onLocalizationSelect: (state, action: PayloadAction<any>):any => {
      state.countryId = action.payload.country.countryId;
      state.languageCode = action.payload.language.languageCode;
      state.luxonLocale = action.payload.language.luxonLocale;
      state.locale = action.payload.language.locale;
      state.pluralShow = action.payload.language.pluralShow;
    },
    oncountrtIdChange: (state, action: PayloadAction<any>):any => {
      state.countryId = action.payload;      
    },
    setSponsorStore: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.sponsors = action.payload;
    },
    setChildStore: (
      state,
      action: PayloadAction<any>,
    ):any => {
        console.log(action.payload,"--",state);
    },
    setrestartOnLangChange: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.restartOnLangChange = action.payload;
    },
    setAppLayoutDirection: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.AppLayoutDirection = action.payload;
    },
    setAppLayoutDirectionScreen: (
      state,
      action: PayloadAction<any>,
    ):any => {
      state.AppLayoutDirectionScreen = action.payload;
    },
    setAppLayoutDirectionParams: (
      state,
      action: PayloadAction<any>,
    ):any => {
      console.log(action.payload);
      state.AppLayoutDirectionParams = action.payload;
    },
  },
});

export const {onLocalizationSelect,setChildStore,setSponsorStore,oncountrtIdChange, setrestartOnLangChange, setAppLayoutDirection, setAppLayoutDirectionScreen, setAppLayoutDirectionParams} = localizationSlice.actions;

export default localizationSlice.reducer;

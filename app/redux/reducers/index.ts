import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/lib/persistReducer';
import {sagaSlice} from '../sagaMiddleware/sagaSlice';
import {childSlice} from './childSlice';
import { articlesSlice } from './articlesSlice';
import {localizationSlice} from './localizationSlice';
import { utilsSlice } from './utilsSlice';
import { variableSlice } from './variableSlice';

// import {createRealmPersistStorage} from '@bankify/redux-persist-realm';

const countryConfig = {
  key: 'country',
  storage: AsyncStorage,
  // blacklist: ['countryTheme'],
  // stateReconciler: autoMergeLevel2,
};
const failedApiConfig = {
  key: 'onLoadFailedApis',
  storage: AsyncStorage,
  // blacklist: ['countryTheme'],
  // stateReconciler: autoMergeLevel2,
};
const utilConfig = {
  key: 'utilsData',
  storage: AsyncStorage,
};
const childConfig = {
  key: 'childData',
  storage: AsyncStorage
};
const articleConfig = {
  key: 'articlesData',
  storage: AsyncStorage,
};
const variableConfig = {
  key: 'variableData',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  // theme: themeSlice.reducer,
  selectedCountry: persistReducer(countryConfig, localizationSlice.reducer),
  // sagaReducer:sagaSlice.reducer,
  failedOnloadApiObjReducer:persistReducer(failedApiConfig,sagaSlice.reducer),
  childData:persistReducer(childConfig,childSlice.reducer),
  utilsData:persistReducer(utilConfig,utilsSlice.reducer),
  articlesData:persistReducer(articleConfig,articlesSlice.reducer),
  variableData:persistReducer(variableConfig,variableSlice.reducer),
});
export default rootReducer;

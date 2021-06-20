import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/lib/persistReducer';
import {sagaSlice} from '../sagaMiddleware/sagaSlice';
import {childSlice} from './childSlice';
import {localizationSlice} from './localizationSlice';
import { utilsSlice } from './utilsSlice';

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
const UtilConfig = {
  key: 'utilsData',
  storage: AsyncStorage,
};
const ChildConfig = {
  key: 'childData',
  storage: AsyncStorage
};
const rootReducer = combineReducers({
  // theme: themeSlice.reducer,
  selectedCountry: persistReducer(countryConfig, localizationSlice.reducer),
  // sagaReducer:sagaSlice.reducer,
  failedOnloadApiObjReducer:persistReducer(failedApiConfig,sagaSlice.reducer),
  utilsData:persistReducer(UtilConfig,utilsSlice.reducer),
  childData:persistReducer(ChildConfig,childSlice.reducer),
});
export default rootReducer;

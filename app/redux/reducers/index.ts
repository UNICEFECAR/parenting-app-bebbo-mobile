import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/lib/persistReducer';
import {sagaSlice} from '../sagaMiddleware/sagaSlice';
import {childSlice} from './childSlice';
import { articlesSlice } from './articlesSlice';
import {localizationSlice} from './localizationSlice';
import { utilsSlice } from './utilsSlice';
import { variableSlice } from './variableSlice';
import { createRealmPersistStorage } from './realmPersistor';
import {notificationSlice} from './notificationSlice';
import { createMigrate } from 'redux-persist';

// import {createRealmPersistStorage} from '@bankify/redux-persist-realm';
const migrations = {  
  0: (state: any) => {    
      return {      ...
    state,      
    childDataSet: {        ...
      state.childDataSet,        
      bufferAgeBracket:[]
    }    
  }  
  }
}
const countryConfig = {
  key: 'country',
  storage: createRealmPersistStorage(),
  // blacklist: ['countryTheme'],
  // stateReconciler: autoMergeLevel2,
};
const failedApiConfig = {
  key: 'onLoadFailedApis',
  storage: createRealmPersistStorage(),
  // blacklist: ['countryTheme'],
  // stateReconciler: autoMergeLevel2,
};
const utilConfig = {
  key: 'utilsData',
  storage: createRealmPersistStorage(),
};
const childConfig = {
  key: 'childData',
  storage: createRealmPersistStorage(),
  version: 0,
  debug: true,
  migrate: createMigrate(migrations, { debug: true }) 
};
const articleConfig = {
  key: 'articlesData',
  storage: createRealmPersistStorage(),
};
const variableConfig = {
  key: 'variableData',
  storage: createRealmPersistStorage(),
};
const notificationConfig = {
  key: 'notificationData',
  storage: createRealmPersistStorage(),
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
  notificationData:persistReducer(notificationConfig,notificationSlice.reducer),
});
export default rootReducer;

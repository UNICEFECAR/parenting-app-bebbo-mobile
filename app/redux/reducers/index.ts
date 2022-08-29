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
import { bandWidthSlice } from './bandwidthSlice';

const migrations = {  
  0: (state: any):any => {    
      return {      
        ...state,      
        childDataSet: {       
          ...state.childDataSet,        
          favoriteadvices:[],
          favoritegames:[],
          chatBotData:''
        }
      }  
  }
}
const migrationsnotification = {  
  0: (state: any):any => {    
      return {      
        ...state,      
        localNotifications: [],
        scheduledlocalNotifications: [],
        localNotificationGenerateType: {
          generateFlag: true,
          generateType: 'add',
          childuuid: 'all'
        }
      }  
  },

}
const migrationsutils = {  
  0: (state: any):any => {    
      return {      
        ...state,
        faqsData:'',
      }  
  },
  1: (state: any):any => {    
      return {      
        ...state,
        incrementalSyncDT:{
          articlesDatetime: '',
          videoArticlesDatetime: '',
          activitiesDatetime: '',
          faqPinnedContentDatetime: '',
          faqsDatetime: '',
          faqUpdatedPinnedContentDatetime: '',
          archiveDatetime: ''
        },
        allDataDownloadFlag:false
      }  
  }
}
const migrationslocalization = {
  0: (state: any):any => {    
      return {      
        ...state,      
        restartOnLangChange:'no',
        AppLayoutDirection:'ltr',
        AppLayoutDirectionScreen:'LanguageSelection',
        AppLayoutDirectionParams:{}
      }  
  },
  1: (state: any):any => {    
    return {      
      ...state,      
      pluralShow:false,
    }  
}
}
const countryConfig = {
  key: 'country',
  storage: createRealmPersistStorage(),
  version: 1,
  debug: true,
  migrate: createMigrate(migrationslocalization, { debug: true }) 
};
const failedApiConfig = {
  key: 'onLoadFailedApis',
  storage: createRealmPersistStorage(),
};
const utilConfig = {
  key: 'utilsData',
  storage: createRealmPersistStorage(),
  version: 1,
  debug: true,
  migrate: createMigrate(migrationsutils, { debug: true }) 
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
  version: 0,
  debug: true,
  migrate: createMigrate(migrationsnotification, { debug: true })
};
const bandWidthConfig = {
  key: 'bandWidthData',
  storage: createRealmPersistStorage(),
};
const rootReducer = combineReducers({
  selectedCountry: persistReducer(countryConfig, localizationSlice.reducer),
  failedOnloadApiObjReducer:persistReducer(failedApiConfig,sagaSlice.reducer),
  childData:persistReducer(childConfig,childSlice.reducer),
  utilsData:persistReducer(utilConfig,utilsSlice.reducer),
  articlesData:persistReducer(articleConfig,articlesSlice.reducer),
  variableData:persistReducer(variableConfig,variableSlice.reducer),
  notificationData:persistReducer(notificationConfig,notificationSlice.reducer),
  bandWidthData:persistReducer(bandWidthConfig,bandWidthSlice.reducer),
});
export default rootReducer;

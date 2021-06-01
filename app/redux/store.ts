import {configureStore} from '@reduxjs/toolkit';
import {FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';

import rootReducer from './reducers';

import {reduxBatch} from '@manaflair/redux-batch';

const {createLogger} = require('redux-logger');
const loggerMiddleware = createLogger({
  // predicate: (getState, action) => false,
  collapsed: true,
  duration: true,
});
const allMiddlewares:any[] =[];
if (process.env.NODE_ENV !== 'production' ){
allMiddlewares.push(loggerMiddleware);
}

export default function configureAppStore() {
  // export const store = configureStore({
  // reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }).concat(loggerMiddleware),
  // devTools: process.env.NODE_ENV !== 'production',
  // // preloadedState,
  // enhancers: [reduxBatch],
  // });
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(allMiddlewares),
    devTools: process.env.NODE_ENV !== 'production',
    // preloadedState,
    enhancers: [reduxBatch],
  });

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./redux/reducers', () =>
  //     store.replaceReducer(rootReducer),
  //   );
  // }

  return store;
}

// if (process.env.NODE_ENV !== 'production' && module.hot) {
//   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
// }

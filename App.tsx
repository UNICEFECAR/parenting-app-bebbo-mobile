/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// declare const global: {HermesInternal: null | {}};

import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView} from 'react-native';
import AppNavigation from './app/navigation/AppNavigation';
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import configureAppStore from './app/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {ActivityIndicator} from 'react-native';
import {Action, ThunkAction} from '@reduxjs/toolkit';
import persistStore from 'redux-persist/lib/persistStore';

const store = configureAppStore();
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate
          loading={<ActivityIndicator size="large" color="#0000ff" />}
          persistor={persistor}>
          <AppNavigation />
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
};

export default App;

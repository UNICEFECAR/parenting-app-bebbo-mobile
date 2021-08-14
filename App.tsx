/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// declare const global: {HermesInternal: null | {}};

import { Action, ThunkAction } from '@reduxjs/toolkit';
import React from 'react';
import { Dimensions } from 'react-native';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { MenuProvider } from 'react-native-popup-menu';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector
} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/lib/persistStore';
import { ThemeProvider } from 'styled-components/native';
import './app/localization/initI18next';
import AppNavigation from './app/navigation/AppNavigation';
import configureAppStore from './app/redux/store';
import { appTheme } from './app/styles/theme';

export const store = configureAppStore();
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
enableScreens();
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const CustomFallback = (props: {error: Error; resetError: Function}) => (
  <View>
    <Text>Something happened!</Text>
    <Text>{props.error.toString()}</Text>
    <Pressable
      onPress={() => {
        props.resetError;
      }}>
      <Text>{'Try again'} </Text>
    </Pressable>
  </View>
);

const App = () => {
  React.useEffect(() => {
    Orientation.lockToPortrait();
    SplashScreen.hide();
  });
  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <ThemeProvider theme={appTheme}>
        <MenuProvider>
          <Provider store={store}>
            <PersistGate
              loading={<><ActivityIndicator size="large" color="#0000ff" /></>}
              persistor={persistor}>
              <SafeAreaView style={{flex: 1}}>
                <AppNavigation />
              </SafeAreaView>
            </PersistGate>
          </Provider>
        </MenuProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

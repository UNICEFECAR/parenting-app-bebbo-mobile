/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// declare const global: {HermesInternal: null | {}};

import 'react-native-gesture-handler';
import React from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
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
import './app/localization/initI18next';

import {ThemeProvider} from 'styled-components/native';
import {appTheme} from './app/styles/theme';
import ErrorBoundary from 'react-native-error-boundary'
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
import { enableScreens } from 'react-native-screens';
import ImageStorage from './app/downloadImages/ImageStorage';
import { useNetInfo } from '@react-native-community/netinfo';
import SplashScreen from 'react-native-splash-screen';
enableScreens();
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const CustomFallback = (props: { error: Error, resetError: Function }) => (
  <View>
    <Text>Something happened!</Text>
    <Text>{props.error.toString()}</Text>
    <Pressable onPress={()=>{props.resetError}} ><Text>{'Try again'} </Text></Pressable>
  </View>
)

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
    <ThemeProvider theme={appTheme}>
   
      <Provider store={store}>
        <PersistGate
          loading={<ActivityIndicator size="large" color="#0000ff" />}
          persistor={persistor}>
          <SafeAreaView style={{flex: 1}}>
          <AppNavigation />
          </SafeAreaView>
        </PersistGate>
      </Provider>
   
    </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
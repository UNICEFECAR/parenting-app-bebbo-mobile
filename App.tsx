/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// declare const global: {HermesInternal: null | {}};
import 'react-native-gesture-handler';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import crashlytics from '@react-native-firebase/crashlytics';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import React from 'react';
import {
  ActivityIndicator, StyleSheet, Text,
  View
} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import Orientation from 'react-native-orientation-locker';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
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
import { googleAuth } from './app/services/googleAuth';
import { appTheme } from './app/styles/theme';
import { EventProvider } from 'react-native-outside-press';
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
const styles = StyleSheet.create({
  flex1: { flex: 1 }
})
const CustomFallback = (props: { error: Error; resetError: Function }) => {
  crashlytics().recordError(props.error);
  return (
    <View>
      <Text>Something happened!</Text>
      <Text>{props.error.toString()}</Text>
      <ButtonPrimary
        onPress={() => {
          props.resetError();
        }}>
        <ButtonText>{('Try again')}</ButtonText>
      </ButtonPrimary>
    </View>
  );
}

const App = () => {
  React.useEffect(() => {
    Orientation.lockToPortrait();
    // SplashScreen.hide();
    googleAuth.configure();
  });
  return (
    <EventProvider>
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThemeProvider theme={appTheme}>
          <MenuProvider>
            <Provider store={store}>
              <PersistGate
                loading={<><ActivityIndicator size="large" color="#0000ff" /></>}
                persistor={persistor}>
                <SafeAreaProvider style={styles.flex1}>
                  <AppNavigation />
                </SafeAreaProvider>
              </PersistGate>
            </Provider>
          </MenuProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </EventProvider>

  );
};

export default App;

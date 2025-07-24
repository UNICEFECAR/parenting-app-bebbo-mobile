/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import "react-native-gesture-handler";
import crashlytics from "@react-native-firebase/crashlytics";
import { Action, ThunkAction } from "@reduxjs/toolkit";
import React from "react";
import i18n from "i18next";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import "react-native-gesture-handler";
import Orientation from "react-native-orientation-locker";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/lib/persistStore";
import { ThemeProvider } from "styled-components/native";
import AppNavigation from "./app/navigation/AppNavigation";
import "./app/localization/initI18next";
import configureAppStore from "./app/redux/store";
import { googleAuth } from "./app/services/googleAuth";
import { EventProvider } from "react-native-outside-press";
import RNRestart from "react-native-restart";
import { setTaxonomyIds } from "./app/redux/reducers/utilsSlice";
import { recordError } from "./app/services/firebaseAnalytics";
const flavor = process.env.FLAVOR || "bebbo";
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
  flex1: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2B2F84",
  },
  message: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2B2F84",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
const { appTheme } = require(`./app/instances/${flavor}/styles/theme`);

const CustomFallback = (props: { error: Error; resetError: Function }) => {
  recordError(props.error);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("generalError")}</Text>
      <Text style={styles.message}>{props.error?.toString()}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          props.resetError();
          RNRestart.Restart();
        }}
      >
        <Text style={styles.buttonText}>{i18n.t("tryText")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  React.useEffect(() => {
    Orientation.lockToPortrait();
    // SplashScreen.hide();
    googleAuth.configure();
  });

  const onBeforeLift = () => {
    const taxonomyAllData = store.getState().utilsData.taxonomy.allTaxonomyData
      ? JSON.parse(store.getState().utilsData.taxonomy.allTaxonomyData)
      : [];
    if (taxonomyAllData?.relationship_to_parent) {
      store.dispatch(setTaxonomyIds(taxonomyAllData));
    }
  };

  return (
    <EventProvider>
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThemeProvider theme={appTheme}>
          <MenuProvider>
            <Provider store={store}>
              <PersistGate
                loading={
                  <>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </>
                }
                persistor={persistor}
                onBeforeLift={onBeforeLift}
              >
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

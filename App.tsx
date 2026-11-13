import {cleanupAbandonedBackupFiles} from './app/services/backupCacheCleanup';
import {recoverTaxonomySnapshot} from './app/services/taxonomyRecovery';
/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import "react-native-gesture-handler";
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
import Orientation from "react-native-orientation-locker";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
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
import { setAllTaxonomyData, setTaxonomyIds } from "./app/redux/reducers/utilsSlice";
import { recordError } from "./app/services/firebaseAnalytics";
import {applyLanguageDirection, configureLayoutDirection} from "./app/localization/layoutDirection";
import { primaryColor } from "@styles/style";
const flavor = process.env.FLAVOR || "bebbo";
export const store = configureAppStore();
// export const persistor = persistStore(store);
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
    color: primaryColor,
  },
  message: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: primaryColor,
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
  React.useEffect(() => { void recordError(props.error); }, [props.error]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("generalError")}</Text>
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
  const [persistor, setPersistor] = React.useState<any>(null);
  const [directionError, setDirectionError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    const p = persistStore(store);
    configureLayoutDirection({dispatch: store.dispatch, flush: () => p.flush()});
    setPersistor(p);
    Orientation.lockToPortrait();
    // SplashScreen.hide();
    googleAuth.configure();
  },[]);
  if (directionError) return <CustomFallback error={directionError} resetError={() => setDirectionError(null)} />;
  if (!persistor) return <ActivityIndicator size="large" color="#0000ff" />;
  const onBeforeLift = async () => {
    try {
      const cleanup = await cleanupAbandonedBackupFiles();
      if (cleanup.failed) void recordError('Temporary backup cleanup incomplete');
    } catch {
      // Do not prevent caregivers reaching their committed data if cache storage
      // is temporarily unavailable. Retry cleanup on the next cold launch.
      void recordError('Temporary backup cache unavailable');
    }
    try {
      if (await applyLanguageDirection(store.getState().selectedCountry)) {
        // Keep the old-direction navigator off screen while the native restart runs.
        await new Promise<void>(() => {});
      }
    } catch (error) {
      setDirectionError(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    const snapshot = store.getState().utilsData.taxonomy.allTaxonomyData;
    if (!snapshot) return;
    try {
      const languageCode = store.getState().selectedCountry.languageCode;
      const restored = await recoverTaxonomySnapshot(snapshot, async () => {
        // Redux's cached JSON can be truncated independently of Realm. Read only
        // this language's metadata; never reset caregiver profiles/preferences.
        const {dataRealmCommon} = await import('./app/database/dbquery/dataRealmCommon');
        const realm = await dataRealmCommon.openRealm();
        const cached = realm?.objects('Taxonomy').filtered('langCode == $0', languageCode)[0] as any;
        if (cached?.allData) {
          try {const parsed = JSON.parse(cached.allData); if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;} catch { /* Try the existing bundled content. */ }
        }
        const {taxonomydata} = await import('./app/instances');
        return taxonomydata[languageCode]?.[0]?.allData;
      });
      if (restored.recovered) {
        store.dispatch(setAllTaxonomyData([{langCode: languageCode, allData: restored.data}]));
        void recordError('Recovered invalid persisted taxonomy cache');
      }
      if (restored.data.relationship_to_parent) store.dispatch(setTaxonomyIds(restored.data));
    } catch (error) {
      // PersistGate does not catch rejected async callbacks. Show the existing
      // retry screen instead of leaving the app indefinitely behind its loader.
      setDirectionError(error instanceof Error ? error : new Error('Taxonomy recovery failed'));
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
                  <KeyboardProvider preload={false}>
                    <AppNavigation />
                  </KeyboardProvider>
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

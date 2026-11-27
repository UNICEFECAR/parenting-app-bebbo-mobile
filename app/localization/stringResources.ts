import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {apiUrlDevelop} from 'react-native-dotenv';
import {AVAILABLE_LANGUAGES, backupFlavor} from '../instances';
import {createRemoteStrings} from './remoteStrings';

// i18next mutates its resource store. Keep the bundled text independent of it.
export const bundledStringResources = Object.fromEntries(
  Object.entries(AVAILABLE_LANGUAGES).map(([locale, resource]: [string, any]) =>
    [locale, {translation: {...resource.translation}}]),
);

export const remoteStrings = createRemoteStrings({
  i18n,
  bundled: bundledStringResources,
  storage: AsyncStorage,
  scope: `${backupFlavor}:${apiUrlDevelop}`,
});

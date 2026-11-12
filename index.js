/**
 * @format
 */

// Install polyfills before importing modules that use URLs or generate UUIDs.
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import LocalNotifications from './app/services/LocalNotifications';
import App from './App';
import { name as appName } from './app.json';
import React from 'react';
import { Text,LogBox } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

LocalNotifications.start();

// Register before mounting navigation, including Android headless launches.
// Background delivery remains handled by the native notification integration.
setBackgroundMessageHandler(getMessaging(), async () => {});

LogBox.ignoreAllLogs()
// Settings.setGraphAPIVersion("v17.0");
AppRegistry.registerComponent(appName, () => () => <App />);
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

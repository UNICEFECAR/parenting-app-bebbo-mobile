/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import { Text}  from'react-native';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values'
AppRegistry.registerComponent(appName, () => () => <App />);
if (Text.defaultProps == null) {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
}

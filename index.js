/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import { Text}  from'react-native';
// import 'intl';
// import 'intl/locale-data/jsonp/en';
if (Text.defaultProps == null) {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
}
AppRegistry.registerComponent(appName, () => () => <App />);

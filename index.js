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
 import 'intl';
 
 import 'intl/locale-data/jsonp/sq-AL';
 import 'intl/locale-data/jsonp/be-BY';
 import 'intl/locale-data/jsonp/ru-BY';
 import 'intl/locale-data/jsonp/bg-BG';
 import 'intl/locale-data/jsonp/el-GR';
 import 'intl/locale-data/jsonp/sq-XK';
 import 'intl/locale-data/jsonp/sr-Latn-XK';
 import 'intl/locale-data/jsonp/ky-KG';
 import 'intl/locale-data/jsonp/ru-KG';
 import 'intl/locale-data/jsonp/sr-Cyrl-ME';//montenegrin code to be verified
 import 'intl/locale-data/jsonp/mk-MK';
 import 'intl/locale-data/jsonp/sq-MK';
 import 'intl/locale-data/jsonp/sr-Latn-RS';
 import 'intl/locale-data/jsonp/uz-Latn-UZ';
 import 'intl/locale-data/jsonp/ru-RU';
 // import 'intl/locale-data/jsonp/be';
 // import 'intl/locale-data/jsonp/be';
 //sq,ru
 AppRegistry.registerComponent(appName, () => () => <App />);
 if (Text.defaultProps == null) {
     Text.defaultProps = {};
     Text.defaultProps.allowFontScaling = false;
 }
 
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LocalizationStackParamList} from './types';
import CountrySelection from '../screens/localization/CountrySelection';
import LanguageSelection from '../screens/localization/LanguageSelection';
import CountryLanguageConfirmation from '../screens/localization/CountryLanguageConfirmation';

const LocalizationStack = createStackNavigator<LocalizationStackParamList>();
export default () => {
  return (
    <LocalizationStack.Navigator initialRouteName="CountrySelection">
      <LocalizationStack.Screen
        name="CountrySelection"
        component={CountrySelection}
        options={{headerShown: false}}
      />
      <LocalizationStack.Screen
        name="LanguageSelection"
        component={LanguageSelection}
        options={{headerShown: false}}
      />
      <LocalizationStack.Screen
        name="CountryLanguageConfirmation"
        component={CountryLanguageConfirmation}
        options={{headerShown: false}}
      />
    </LocalizationStack.Navigator>
  );
};

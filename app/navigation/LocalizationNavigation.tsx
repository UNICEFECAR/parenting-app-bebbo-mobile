import { createStackNavigator } from '@react-navigation/stack';
import CountryLanguageConfirmation from '@screens/localization/CountryLanguageConfirmation';
import CountrySelection from '@screens/localization/CountrySelection';
import LanguageSelection from '@screens/localization/LanguageSelection';
import React from 'react';
import { Platform } from 'react-native';
import { LocalizationStackParamList } from './types';

const LocalizationStack = createStackNavigator<LocalizationStackParamList>();
export default () => {
  return (
    <LocalizationStack.Navigator initialRouteName="CountrySelection"   screenOptions={{ gestureEnabled:Platform.OS == 'ios' ? false : true}}>
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

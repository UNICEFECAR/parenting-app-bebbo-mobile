import { createStackNavigator } from '@react-navigation/stack';
import CountryLanguageConfirmation from '@screens/localization/CountryLanguageConfirmation';
import CountrySelection from '@screens/localization/CountrySelection';
import LanguageSelection from '@screens/localization/LanguageSelection';
import React from 'react';
import { Platform } from 'react-native';
import { useAppSelector } from '../../App';
import { LocalizationStackParamList } from './types';

const LocalizationStack = createStackNavigator<LocalizationStackParamList>();
export default () => {
  const restartOnLangChange = useAppSelector(
    (state: any) => state.selectedCountry.restartOnLangChange,
  );
  const AppLayoutDirectionScreen = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionScreen,
  );
  const AppLayoutDirectionParams = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionParams,
  );
  console.log(restartOnLangChange,"AppLayoutDirectionScreen appnav--", AppLayoutDirectionScreen);
  return (
    <LocalizationStack.Navigator 
      // initialRouteName="CountrySelection"
      initialRouteName= {restartOnLangChange != 'yes' ? "CountrySelection" : AppLayoutDirectionScreen}
    >
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
        initialParams={AppLayoutDirectionParams}
      />
    </LocalizationStack.Navigator>
  );
};

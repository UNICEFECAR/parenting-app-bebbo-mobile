import  {localization}  from '../instance';
import { createStackNavigator } from '@react-navigation/stack';
import CountryLanguageConfirmation from '@screens/localization/CountryLanguageConfirmation';
import CountrySelection from '@screens/localization/CountrySelection';
import LanguageSelection from '@screens/localization/LanguageSelection';
import React from 'react';
import { useAppSelector } from '../../App';
import { LocalizationStackParamList } from './types';

const LocalizationStack = createStackNavigator<LocalizationStackParamList>();
export default ():any => {
  const restartOnLangChange = useAppSelector(
    (state: any) => state.selectedCountry.restartOnLangChange,
  );
  const AppLayoutDirectionScreen = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionScreen,
  );
  const AppLayoutDirectionParams = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionParams,
  );
  return (
    <LocalizationStack.Navigator 
      initialRouteName= {"CountryLanguageConfirmation"}
    >
       <LocalizationStack.Screen
        name="CountryLanguageConfirmation"
        component={CountryLanguageConfirmation}
        options={{headerShown: false}}
        initialParams={AppLayoutDirectionParams}
      />
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
     
    </LocalizationStack.Navigator>
  );
};

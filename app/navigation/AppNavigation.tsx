import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChildSetup from '../screens/ChildSetup';
import Terms from '../screens/Terms';
import {RootStackParamList} from './types';
import LocalizationNavigation from './LocalizationNavigation';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import Walkthrough from '../screens/Walkthrough';
import {useAppSelector} from '../../App';
import PrivacyPolicy from '../screens/PrivacyPolicy';
// import {ThemeProvider} from 'styled-components/native';
// import {useSelector} from 'react-redux';
const RootStack = createStackNavigator<RootStackParamList>();
export default () => {
  // const callingCode = useAppSelector(
  //   (state: any) => state.selectedCountry.callingCode,
  // );
  return (
    // <ThemeProvider theme={theme}>
    <NavigationContainer>
      <RootStack.Navigator
        // initialRouteName={callingCode ? 'Walkthrough' : 'Localization'}>
        initialRouteName={'Terms'}>
        <RootStack.Screen
          name="Localization"
          component={LocalizationNavigation}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Walkthrough"
          component={Walkthrough}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Terms"
          component={Terms}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{headerShown: false}}
        />
        <RootStack.Screen name="ChildSetup" component={ChildSetup}  options={{headerShown: false}}/>
        <RootStack.Screen
          name="HomeDrawerNavigator"
          options={{headerShown: false}}
          component={HomeDrawerNavigator}
          // initialParams={{navigation}}
          // options={({navigation}) => ({
          //   title: 'ParentBuddy',
          //   headerLeft: () => (
          //     <TouchableOpacity
          //       onPress={() =>
          //         navigation.dispatch(DrawerActions.toggleDrawer())
          //       }>
          //       <Text>Toggle</Text>
          //     </TouchableOpacity>
          //   ),
          //   headerLeftContainerStyle: {paddingLeft: 10},
          // })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
    // </ThemeProvider>
  );
};

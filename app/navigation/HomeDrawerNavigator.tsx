import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '@screens/CustomDrawerContent';
import Aboutus from '@screens/home/Aboutus';
import Favourites from '@screens/home/Favourites';
import Notifications from '@screens/home/Notifications';
import SettingScreen from '@screens/home/SettingScreen';
import SupportChat from '@screens/home/SupportChat';
import UserGuide from '@screens/home/UserGuide';
import React from 'react';
import DashboardTabNavigator from './DashboardTabNavigator';
import { HomeDrawerNavigatorStackParamList } from './types';
const HomeDrawerNavigator =
  createDrawerNavigator<HomeDrawerNavigatorStackParamList>();
export default ():any => {
  return (
    <HomeDrawerNavigator.Navigator
    screenOptions={{
      unmountOnBlur:true
    }}
   lazy
   detachInactiveScreens={true}
    backBehavior={'initialRoute'}
      drawerContent={(props):any => <CustomDrawerContent {...props} />}>
      <HomeDrawerNavigator.Screen
        name="Home"
        component={DashboardTabNavigator}
      />

      <HomeDrawerNavigator.Screen
        name="NotificationsScreen"
        component={Notifications}
      />
      <HomeDrawerNavigator.Screen
        name="AboutusScreen"
        component={Aboutus}
      />
      <HomeDrawerNavigator.Screen name="SupportChat" component={SupportChat}/>
      <HomeDrawerNavigator.Screen
        name="SettingsScreen"
        component={SettingScreen}
      />      
      <HomeDrawerNavigator.Screen name="UserGuide" component={UserGuide}/>
      <HomeDrawerNavigator.Screen name="Favourites" component={Favourites}
        initialParams={{tabIndex: 0,backClicked:'no'}}
      />
    </HomeDrawerNavigator.Navigator>
  );
};

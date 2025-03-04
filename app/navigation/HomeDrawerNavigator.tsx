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
export default (): any => {
  return (
    <HomeDrawerNavigator.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
      }}
      detachInactiveScreens={true}
      backBehavior={'initialRoute'}
      drawerContent={(props): any => <CustomDrawerContent {...props} />
      }>
      <HomeDrawerNavigator.Screen
        options={{ headerShown: false }}
        name="Home"
        component={DashboardTabNavigator}
      />

      <HomeDrawerNavigator.Screen
        name="NotificationsScreen"
        options={{ headerShown: false }}
        component={Notifications}
      />
      <HomeDrawerNavigator.Screen
        name="AboutusScreen"
        options={{ headerShown: false }}
        component={Aboutus}
      />
      <HomeDrawerNavigator.Screen
        options={{ headerShown: false }}
        name="SupportChat" component={SupportChat} />
      <HomeDrawerNavigator.Screen
        name="SettingsScreen"
        options={{ headerShown: false }}
        component={SettingScreen}
      />
      <HomeDrawerNavigator.Screen
        options={{ headerShown: false }}
        name="UserGuide" component={UserGuide} />
      <HomeDrawerNavigator.Screen
        options={{ headerShown: false }}
        name="Favourites" component={Favourites}
        initialParams={{ tabIndex: 0, backClicked: 'no' }}
      />
    </HomeDrawerNavigator.Navigator >
  );
};

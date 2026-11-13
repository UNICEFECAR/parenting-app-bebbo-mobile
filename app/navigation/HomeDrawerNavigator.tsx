import UnmountInactiveScreen from './UnmountInactiveScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '@screens/CustomDrawerContent';
import Aboutus from '@screens/home/Aboutus';
import Favourites from '@screens/home/Favourites';
import Notifications from '@screens/home/Notifications';
import SettingScreen from '@screens/home/SettingScreen';
import SupportChat from '@screens/home/SupportChat';
import UserGuide from '@screens/home/UserGuide';
import React from 'react';
import { I18nManager, Platform, useWindowDimensions } from 'react-native';
import DashboardTabNavigator from './DashboardTabNavigator';
import { HomeDrawerNavigatorStackParamList } from './types';
const HomeDrawerNavigator =
  createDrawerNavigator<HomeDrawerNavigatorStackParamList>();
export default (): any => {
  const { width, height } = useWindowDimensions();
  // Preserve React Navigation 6 sizing instead of the newer 360dp default.
  const smallerAxisSize = Math.min(width, height);
  const appBarHeight = Platform.OS === 'ios' ? (width > height ? 32 : 44) : 56;
  const drawerWidth = Math.max(0, Math.min(
    smallerAxisSize - appBarHeight,
    smallerAxisSize >= 600 ? 320 : 280,
  ));
  return (
    <HomeDrawerNavigator.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        drawerStyle: { width: drawerWidth },
      }}
      screenLayout={({ children }) => <UnmountInactiveScreen>{children}</UnmountInactiveScreen>}
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

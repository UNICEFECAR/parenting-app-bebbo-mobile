import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeDrawerNavigatorStackParamList} from './types';
import Notifications from '../screens/home/Notifications';
import Childgrowth from '../screens/home/Childgrowth';
import ChildDevelopment from '../screens/home/ChildDevelopment';
import Vaccination from '../screens/home/Vaccination';
import HealthCheckups from '../screens/home/HealthCheckups';
import DashboardTabNavigator from './DashboardTabNavigator';
import CustomDrawerContent from '../screens/CustomDrawerContent';
import SettingScreen from '../screens/home/SettingScreen';
import Aboutus from '../screens/home/Aboutus';
import ChildProfile from '../screens/home/ChildProfile';
const HomeDrawerNavigator =
  createDrawerNavigator<HomeDrawerNavigatorStackParamList>();
export default () => {
  return (
    <HomeDrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
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
      <HomeDrawerNavigator.Screen
        name="ChildProfileScreen"
        component={ChildProfile}
      />
      <HomeDrawerNavigator.Screen
        name="ChildgrowthScreen"
        component={Childgrowth}
      />
      <HomeDrawerNavigator.Screen
        name="ChildDevelopmentScreen"
        component={ChildDevelopment}
      />
      <HomeDrawerNavigator.Screen
        name="VaccinationScreen"
        component={Vaccination}
      />
      <HomeDrawerNavigator.Screen
        name="HealthCheckupsScreen"
        component={HealthCheckups}
      />
      <HomeDrawerNavigator.Screen
        name="SettingsScreen"
        component={SettingScreen}
      />
    </HomeDrawerNavigator.Navigator>
  );
};

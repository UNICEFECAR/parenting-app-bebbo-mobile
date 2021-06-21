import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '@screens/CustomDrawerContent';
import Aboutus from '@screens/home/Aboutus';
import ActivityDetails from '@screens/home/ActivityDetails';
import ArticleDetails from '@screens/home/ArticleDetails';
import ChildDevelopment from '@screens/home/ChildDevelopment';
import Childgrowth from '@screens/home/Childgrowth';
import ChildProfile from '@screens/home/ChildProfile';
import Favourites from '@screens/home/Favourites';
import HealthCheckups from '@screens/home/HealthCheckups';
import Notifications from '@screens/home/Notifications';
import SettingScreen from '@screens/home/SettingScreen';
import UserGuide from '@screens/home/UserGuide';
import Vaccination from '@screens/home/Vaccination';
import React, { useEffect } from 'react';
import DashboardTabNavigator from './DashboardTabNavigator';
import { HomeDrawerNavigatorStackParamList } from './types';
import { ArticleEntity, ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { useAppDispatch, useAppSelector } from '../../App';
import { articledata } from '@assets/translations/appOfflineData/article';
import useToGetOfflineData from '@assets/translations/appOfflineData/useToGetOfflineData';
import { setAllArticleData } from '../redux/reducers/articlesSlice';
const HomeDrawerNavigator =
  createDrawerNavigator<HomeDrawerNavigatorStackParamList>();
export default () => {
  // const languageCode = useAppSelector(
  //   (state: any) => state.selectedCountry.languageCode,
  // );
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   let Entity:any;
  //   // Entity = Entity as TaxonomyEntity
  //   const artData = useToGetOfflineData(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData);
  //   console.log("artData--",artData);
  // },[languageCode]);
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
      <HomeDrawerNavigator.Screen name="ArticleDetails" component={ArticleDetails}/>
      <HomeDrawerNavigator.Screen name="ActivityDetails" component={ActivityDetails}/>
      <HomeDrawerNavigator.Screen name="UserGuide" component={UserGuide}/>
      <HomeDrawerNavigator.Screen name="Favourites" component={Favourites}/>

    </HomeDrawerNavigator.Navigator>
  );
};

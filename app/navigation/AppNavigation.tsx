import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddExpectingChildProfile from '@screens/AddExpectingChildProfile';
import AddSiblingData from '@screens/AddSiblingData';
import ChildSetup from '@screens/ChildSetup';
import ChildImportSetup from '@screens/ChildImportSetup';
import ChildSetupList from '@screens/ChildSetupList';
import EditParentDetails from '@screens/EditParentDetails';
import AddNewChildgrowth from '@screens/growth/AddNewChildgrowth';
import AddNewChildHeight from '@screens/growth/AddNewChildHeight';
import AddNewChildWeight from '@screens/growth/AddNewChildWeight';
import AllChildgrowthMeasures from '@screens/growth/AllChildgrowthMeasures';
import { ChartFullScreen } from '@screens/growth/ChartFullScreen';
import AddChildHealthCheckup from '@screens/healthCheckup/AddChildHealthCheckup';
import ChildProfile from '@screens/home/ChildProfile';
import DetailsScreen from '@screens/home/DetailsScreen';
import EditChildProfile from '@screens/home/EditChildProfile';
import LoadingScreen from '@screens/LoadingScreen';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import Terms from '@screens/Terms';
import AddChildVaccination from '@screens/vaccination/AddChildVaccination';
import AddReminder from '@screens/vaccination/AddReminder';
import Walkthrough from '@screens/Walkthrough';
import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AppState, Platform } from 'react-native';
import SplashScreen from "react-native-lottie-splash-screen";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../App';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { onNetworkStateChange } from '../redux/reducers/bandwidthSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getAllChildren, setActiveChild } from '../services/childCRUD';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import LocalizationNavigation from './LocalizationNavigation';
import { RootStackParamList } from './types';
import { retryAlert1 } from '../services/commonApiService';
import { setchatBotData } from '../redux/reducers/childSlice';
import { restOfTheWorldCountryId } from '@assets/translations/appOfflineData/apiConstants';
import { oncountrtIdChange } from '../redux/reducers/localizationSlice';
import { useDeepLinkURL } from '../services/DeepLinking';
import { ThemeContext } from 'styled-components';
import messaging from '@react-native-firebase/messaging';
import { Settings } from 'react-native-fbsdk-next';
import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import { setAllLocalNotificationGenerateType } from '../redux/reducers/notificationSlice';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
const RootStack = createStackNavigator<RootStackParamList>();
export default ():any => {
  const [profileLoading, setProfileLoading] = React.useState(false);
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );

  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const restartOnLangChange = useAppSelector(
    (state: any) => state.selectedCountry.restartOnLangChange,
  );
  const AppLayoutDirectionScreen = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionScreen,
  );
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const [netState, setNetState] = React.useState('');
  const dispatch = useAppDispatch();
  const netInfoval = useNetInfoHook();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const { linkedURL, resetURL } = useDeepLinkURL();
  const navigationRef = React.useRef<any>();

  const callUrl = (url: any):any => {
    if (url) {
      const initialUrlnew: any = url;
      if (initialUrlnew === null) {
        return;
      }
      if (initialUrlnew && initialUrlnew.includes('/article/')) {
        const initialUrlnewId: any = initialUrlnew.split("/").pop();
        const initialUrlnewId1: any = parseInt(initialUrlnewId);
        console.log("rerenew2", userIsOnboarded);
        if (userIsOnboarded == true) {
          if (navigationRef) {
            navigationRef.current?.navigate('DetailsScreen',
              {
                fromScreen: "HomeArt",
                headerColor: '',
                backgroundColor: '',
                detailData: initialUrlnewId1,
                listCategoryArray: []
              });

          }
        }

      }
      else if (initialUrlnew && initialUrlnew.includes('/activity/')) {
        const initialUrlnewId: any = initialUrlnew.split("/").pop();
        const initialUrlnewId1: any = parseInt(initialUrlnewId);
        console.log("initialUrlnewId1 activity", initialUrlnewId1);
        if (userIsOnboarded == true) {
          if (navigationRef) {
            navigationRef.current?.navigate('DetailsScreen',
              {
                fromScreen: "HomeAct",
                headerColor: headerColor,
                backgroundColor: backgroundColor,
                detailData: initialUrlnewId1,
                listCategoryArray: []
              });
          }
        }
      }
      resetURL();
    }
  }
  useEffect(() => {
    // ... handle deep link
    callUrl(linkedURL);
  }, [linkedURL, resetURL, userIsOnboarded])
 

  useEffect(() => {
    const initPixel = async ():Promise<any> => {
      if (Platform.OS === 'ios') {
        const ATT_CHECK = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        console.log(ATT_CHECK, "..ATT_CHECK..");
        if (ATT_CHECK === RESULTS.DENIED) {
          try {
            const ATT = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
            if (ATT === RESULTS.GRANTED) {
              console.log(ATT, "..ATT..");
              Settings.setAdvertiserTrackingEnabled(true).then(() => {
                Settings.initializeSDK();
              });
            }
          } catch (error) {
            console.log(error,"error");
            throw error;
          } finally {
            Settings.initializeSDK();
          }
          Settings.initializeSDK();
          Settings.setAdvertiserTrackingEnabled(true);
        }
      } else {
        Settings.initializeSDK();
        Settings.setAdvertiserTrackingEnabled(true);
      }
    }
    const updateTrackingStatus = (status: any):any => {
      console.log(status, "..status")
      if (status === 'active') {
        initPixel();
      }
    }

    // Ready to check the permission now
    if (AppState.currentState === 'active') {
      updateTrackingStatus(AppState.currentState)
    } else {
      // Need to wait until the app is ready before checking the permission
      AppState.addEventListener('change', updateTrackingStatus)

      return ():any => {
        AppState.removeEventListener('change', updateTrackingStatus)
      }
    }
  }, [AppState.currentState])
  useEffect(() => {


    async function requestUserPermission():Promise<any> {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log(enabled, "..enabled..", authStatus, "..authStatus..");
      if (enabled) {
        console.log(enabled, "..inif..");
      }
      else {
        console.log(enabled, "..inelse..");
      }


    }
    if (Platform.OS == "ios") {
      requestUserPermission();
    }

  }, []);
  const redirectLocation = (notification: any):any => {
    const screenName = navigationRef.current.getCurrentRoute().name;
    console.log(activeChild, "..activeChild..");
    console.log(notification.data.uuid, "..notification.data.uuid..");

    if (notification && notification.data && notification.data.notitype) {
      if (notification.data.notitype == 'vc' || notification.data.notitype == 'vcr') {
        if (screenName == "NotificationsScreen") {
          console.log("..NotificationsScreen..", screenName);
          navigationRef.current?.navigate('Home', {
            screen: 'Tools',
            params: {
              screen: 'VaccinationTab',
              params: {
                fromNotificationScreen: true,
              }
            },
          })
        }
        else if (screenName == "Home" || screenName == "VaccinationTab" || screenName == "ChildDevelopment" || screenName == "Activities" || screenName == "Articles" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
          navigationRef.current?.navigate("Tools", { screen: 'VaccinationTab' })
        }
        else {
          console.log("..nohomenew..", screenName);
          navigationRef.current?.navigate('Home', {
            screen: 'Tools',
            params: {
              screen: 'VaccinationTab',
            },
          });
        }

      }
      else if (notification.data.notitype == 'hc' || notification.data.notitype == 'hcr') {
        if (screenName == "NotificationsScreen") {
          navigationRef.current?.navigate('Home', {
            screen: 'Tools',
            params: {
              screen: 'HealthCheckupsTab',
              params: {
                fromNotificationScreen: true,
              }
            },
          })
        }
        else if (screenName == "Home" || screenName == "VaccinationTab" || screenName == "ChildDevelopment" || screenName == "Activities" || screenName == "Articles" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
          navigationRef.current?.navigate("Tools", { screen: 'HealthCheckupsTab' })
        }
        else {
          navigationRef.current?.navigate('Home', {
            screen: 'Tools',
            params: {
              screen: 'HealthCheckupsTab',
            },
          });
        }


      }
      else if (notification.data.notitype == 'cd') {
        if (screenName == "NotificationsScreen") {
          navigationRef.current?.navigate('Home', {
            screen: 'ChildDevelopment', params: {
              fromNotificationScreen: true,
            }
          })
        }
        else if (screenName == "Home" || screenName == "ChildDevelopment" || screenName == "Activities" || screenName == "Articles" || screenName == "VaccinationTab" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
          navigationRef.current?.navigate('ChildDevelopment');
        }
        else {
          navigationRef.current?.navigate('Home', { screen: 'ChildDevelopment' })
        }
      }
      else if (notification.data.notitype == 'gw') {
        if (screenName == "NotificationsScreen") {
          navigationRef.current?.navigate('AddNewChildgrowth', {
            headerTitle: t('growthScreenaddNewBtntxt'),
            fromNotificationScreen: true,
          })
        }
        else if (screenName == "Home" || screenName == "ChildDevelopment" || screenName == "Activities" || screenName == "Articles" || screenName == "VaccinationTab" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
          navigationRef.current?.navigate('AddNewChildgrowth', {
            headerTitle: t('growthScreenaddNewBtntxt'),
          });
        }
        else {
          navigationRef.current?.navigate('AddNewChildgrowth', {
            headerTitle: t('growthScreenaddNewBtntxt'),
          });
        }
      }
    }
    setProfileLoading(true);
    setTimeout(async () => {
      const setData = await setActiveChild(languageCode, notification.data.uuid, dispatch, child_age, true);
      if (setData == "activeset") {
        setProfileLoading(false);
      }
    }, 0);

  }
  const handleNotification = (notification: any):any => {  
    let executed = false;
    if (!executed) {
      executed = true;
      if(Platform.OS=="ios"){
        PushNotificationIOS.getApplicationIconBadgeNumber((num)=>{ // get current number
          console.log(num,"...num...")
          if(num >= 1){
              PushNotificationIOS.setApplicationIconBadgeNumber(0) //set number to 0
          }
         });
      }
      
      if (notification && notification.userInteraction == true) {
        if (notification && notification.data && notification.data.notitype != '' && notification.data.notitype != null && notification.data.notitype != undefined && userIsOnboarded) {

          redirectLocation(notification);
        }
      } else { ///////**APP IS CLOSED!!!**

        if (notification && notification.foreground == false) {
          if (notification && notification.data && notification.data.notitype != '' && notification.data.notitype != null && notification.data.notitype != undefined && userIsOnboarded) {
            redirectLocation(notification);
          }
        }
      }

    }

  }
  const createLocalNotificationListeners = async ():Promise<any> => {
    try {
      PushNotification.configure({
        // this will listen to your local push notifications on clicked 
        onNotification: (notification: any) => {
          handleNotification(notification);
          if (Platform.OS == "ios") {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
           
          }
        },
        popInitialNotification: true,
        requestPermissions: true,
      });
      PushNotification.popInitialNotification((notification: any) => {
        handleNotification(notification);
        // this will listen to your local push notifications on opening app from background state

      })

    } catch (e) {
      console.log("error")
    }
  }
 
  
  useEffect(() => {
    if( userIsOnboarded == true){
    createLocalNotificationListeners();
    }
  }, [userIsOnboarded]);
  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage && remoteMessage.notification && remoteMessage.notification.body && remoteMessage.notification.title) {
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
          { text: t('forceUpdateOkBtn') }
        ]);
      }
    });
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    
    return unsubscribe;
  }, []);

  useMemo(() => {
    async function fetchNetInfo():Promise<any> {
      if (netInfoval && netInfoval.isConnected != null) {
        if (netInfoval.isConnected == true) {
          if (Platform.OS == 'android') {
            if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other" || netInfoval.netValue.type == "bluetooth" || netInfoval.netValue.type == "vpn")) {
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "2g") {

              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "3g") {
              setNetState('Lowbandwidth');


            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "4g") {
              setNetState('Highbandwidth');


            }
            else {
              setNetState('Highbandwidth');
            }
          }
          else if (Platform.OS == 'ios') {
            if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other")) {
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "2g") {
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "3g") {
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "4g") {
              setNetState('Highbandwidth');

            }
            else {
              setNetState('Highbandwidth');
            }
          }
        }
        else {
          setNetState('NoConnection');
        }

      }
    }
    fetchNetInfo();
    return {};
  }, [netInfoval.isConnected, netInfoval.netType, netInfoval.netValue?.details?.cellularGeneration]);
  useEffect(() => {
    console.log("linkedURL3---", linkedURL);
  }, [linkedURL]);

  useEffect(() => {
    if (userIsOnboarded == true) {
      const obj = { key: 'showDownloadPopup', value: true };
      dispatch(setInfoModalOpened(obj));
      const localnotiFlagObj = { generateFlag: true, generateType: 'onAppStart', childuuid: 'all' };
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
      getAllChildren(dispatch, child_age, 0);
    }
    dispatch(setchatBotData([]));
    if (countryId == 1) {
      dispatch(oncountrtIdChange(restOfTheWorldCountryId));
    }
    const notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    //add notification condition in else if required 1st time as well
  }, []);

  useEffect(() => {
    async function fetchNetInfoSet():Promise<any> {
      if (netState == "Highbandwidth" && toggleSwitchVal == true) {

        const confirmation = await retryAlert1(0, 0);
        if (confirmation == "yes" && toggleSwitchVal == true) {
          dispatch(onNetworkStateChange(false));
        }
      }
      else if (netState == "Lowbandwidth" && toggleSwitchVal == false) {
        const confirmation = await retryAlert1(1, 1);
        if (confirmation == "yes" && toggleSwitchVal == false) {
          dispatch(onNetworkStateChange(true));
        }
      }
    }
    fetchNetInfoSet();
  }, [netState]);
  const routeNameRef = React.useRef<any>();
 
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={():any => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async ():Promise<any> => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
            analytics().logEvent(currentRouteName + "_opened");
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <RootStack.Navigator
          initialRouteName={
            restartOnLangChange != 'yes' ?
              userIsOnboarded == true ? 'HomeDrawerNavigator' : 'Localization'
              : AppLayoutDirectionScreen
          }
          screenOptions={{ animationEnabled: Platform.OS == 'ios' ? true : false }}
        >
          <RootStack.Screen
            name="Localization"
            component={LocalizationNavigation}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Walkthrough"
            component={Walkthrough}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Terms"
            component={Terms}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ChildSetup"
            component={ChildSetup}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ChildImportSetup"
            component={ChildImportSetup}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <RootStack.Screen
            name="ChildSetupList"
            component={ChildSetupList}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <RootStack.Screen
            name="AddSiblingDataScreen"
            component={AddSiblingData}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <RootStack.Screen
            name="HomeDrawerNavigator"
            options={{ headerShown: false }}
            component={HomeDrawerNavigator}
          />
          <RootStack.Screen
            name="EditChildProfile"
            options={{ headerShown: false }}
            component={EditChildProfile}
          />
          <RootStack.Screen
            name="AddExpectingChildProfile"
            options={{ headerShown: false }}
            component={AddExpectingChildProfile}
          />
          <RootStack.Screen
            name="EditParentDetails"
            options={{ headerShown: false }}
            component={EditParentDetails}
          />
          <RootStack.Screen
            name="AddNewChildgrowth"
            options={{ headerShown: false }}
            component={AddNewChildgrowth}
          />
          <RootStack.Screen
            name="AddNewChildWeight"
            options={{ headerShown: false }}
            component={AddNewChildWeight}
          />
          <RootStack.Screen
            name="AddNewChildHeight"
            options={{ headerShown: false }}
            component={AddNewChildHeight}
          />
          <RootStack.Screen
            name="AllChildgrowthMeasures"
            options={{ headerShown: false }}
            component={AllChildgrowthMeasures}
          />
          <RootStack.Screen
            name="ChartFullScreen"
            options={{ headerShown: false, gestureEnabled: true }}
            component={ChartFullScreen}
          />
          <RootStack.Screen
            name="DetailsScreen"
            options={{ headerShown: false }}
            component={DetailsScreen}
          />
          <RootStack.Screen
            name="ChildProfileScreen"
            options={{ headerShown: false }}
            component={ChildProfile}
          />
          <RootStack.Screen
            name="AddChildVaccination"
            options={{ headerShown: false }}
            component={AddChildVaccination}
          />
          <RootStack.Screen
            name="AddReminder"
            options={{ headerShown: false }}
            component={AddReminder}
          />
          <RootStack.Screen
            name="AddChildHealthCheckup"
            options={{ headerShown: false }}
            component={AddChildHealthCheckup}
          />
        </RootStack.Navigator>
      </NavigationContainer>
      <OverlayLoadingComponent loading={profileLoading} />
    </SafeAreaProvider>
  );
};

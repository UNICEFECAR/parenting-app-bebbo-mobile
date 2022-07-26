import analytics from '@react-native-firebase/analytics';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
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
import { Alert, AppState, DeviceEventEmitter, I18nManager, Platform, ToastAndroid } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retryAlert1 } from '../services/commonApiService';
import { setchatBotData } from '../redux/reducers/childSlice';
import { restOfTheWorldCountryId } from '@assets/translations/appOfflineData/apiConstants';
import { oncountrtIdChange } from '../redux/reducers/localizationSlice';
import { useDeepLinkURL } from '../services/DeepLinking';
import { ThemeContext } from 'styled-components';
import messaging from '@react-native-firebase/messaging';
import { AppEventsLogger, Settings } from 'react-native-fbsdk-next';
import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import { setAllLocalNotificationGenerateType } from '../redux/reducers/notificationSlice';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
// import {ThemeProvider} from 'styled-components/native';
// import {useSelector} from 'react-redux';
const RootStack = createStackNavigator<RootStackParamList>();
const PERSISTENCE_KEY = 'NAVIGATION_STATE';
export default () => {
  // const countryId = useAppSelector(
  //   (state: any) => state.selectedCountry.countryId,
  // );

  // const childList = useAppSelector((state: any) =>
  //   state.childData.childDataSet.allChild != ''
  //     ? JSON.parse(state.childData.childDataSet.allChild)
  //     : state.childData.childDataSet.allChild,
  // );
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
  // console.log(restartOnLangChange,"AppLayoutDirectionScreen appnav--", AppLayoutDirectionScreen);
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  // const languageCode = useAppSelector(
  //   (state: any) => state.selectedCountry.languageCode,
  // );
  // console.log("userIsOnboarded appnav--", userIsOnboarded);
  // console.log("userIsOnboarded appnav--", userIsOnboarded);
  // const [isReady, setIsReady] = React.useState(false);
  // const [isReady, setIsReady] = React.useState(__DEV__ ? false : true);
  const [netState, setNetState] = React.useState('');
  // console.log("callRealmListener--",callRealmListener);
  const dispatch = useAppDispatch();
  const netInfoval = useNetInfoHook();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const currentActiveChild = activeChild.uuid;
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const { linkedURL, resetURL } = useDeepLinkURL();
  useEffect(() => {
    // ... handle deep link
    callUrl(linkedURL);
  }, [linkedURL, resetURL, userIsOnboarded])
  const callUrl = (url: any) => {
    // console.log(url, "..callurl initialUrl..");
    if (url) {
      const initialUrlnew: any = url;
      if (initialUrlnew === null) {
        return;
      }
      if (initialUrlnew && initialUrlnew.includes('/article/')) {
        let initialUrlnewId: any = initialUrlnew.split("/").pop();
        const initialUrlnewId1: any = parseInt(initialUrlnewId);
        console.log("rerenew2", userIsOnboarded);
        if (userIsOnboarded == true) {
          if (navigationRef) {
            //   let obj = { key: 'showDownloadPopup', value: false };
            // dispatch(setInfoModalOpened(obj));
            navigationRef.current?.navigate('DetailsScreen',
              {
                fromScreen: "HomeArt",
                headerColor: '',
                backgroundColor: '',
                detailData: initialUrlnewId1,
                listCategoryArray: []
                // setFilteredArticleData: setFilteredArticleData
              });

          }
        }

      }
      else if (initialUrlnew && initialUrlnew.includes('/activity/')) {
        let initialUrlnewId: any = initialUrlnew.split("/").pop();
        const initialUrlnewId1: any = parseInt(initialUrlnewId);
        console.log("initialUrlnewId1 activity", initialUrlnewId1);
        if (userIsOnboarded == true) {
          if (navigationRef) {
            //   let obj = { key: 'showDownloadPopup', value: false };
            // dispatch(setInfoModalOpened(obj));
            navigationRef.current?.navigate('DetailsScreen',
              {
                fromScreen: "HomeAct",
                headerColor: headerColor,
                backgroundColor: backgroundColor,
                detailData: initialUrlnewId1,
                listCategoryArray: []
                // setFilteredArticleData: setFilteredArticleData
              });
          }
        }
      }
      resetURL();
    }
  }

  useEffect(() => {
    const initPixel = async () => {
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
            throw error;
          } finally {
            Settings.initializeSDK();
          }
          Settings.initializeSDK();
          Settings.setAdvertiserTrackingEnabled(true);
          // Settings.FacebookAutoLogAppEventsEnabled(true);
        }
      } else {
        Settings.initializeSDK();
        Settings.setAdvertiserTrackingEnabled(true);
      }
    }
    const updateTrackingStatus = (status: any) => {
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

      return () => {
        AppState.removeEventListener('change', updateTrackingStatus)
      }
    }
  }, [AppState.currentState])
  useEffect(() => {


    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log(enabled, "..enabled..", authStatus, "..authStatus..");
      if (enabled) {
        console.log(enabled, "..inif..");
        // initPixel();
      }
      else {
        console.log(enabled, "..inelse..");
        //initPixel();
      }


    }
    if (Platform.OS == "ios") {
      requestUserPermission();
    }


    // setTimeout(() => {

    // }, 6000);
  }, []);
  const createLocalNotificationListeners = async () => {
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
      // alert(e)
      console.log("error")
    }
  }
  const redirectLocation = (notification: any) => {
    // const routeNameRef = React.useRef();
    // const previousRouteName = routeNameRef.current;
    const screenName = navigationRef.current.getCurrentRoute().name;
    console.log(activeChild, "..activeChild..");
    console.log(notification.data.uuid, "..notification.data.uuid..");
    //console.log(screenName,previousRouteName); 

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
        else if (screenName == "Home" || screenName == "VaccinationTab" || screenName == "ChildDevelopment" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
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
        // navigationRef.current?.navigate("Tools", { screen: 'HealthCheckupsTab' })
        if (screenName == "NotificationsScreen") {
          console.log("..NotificationsScreen..", screenName);
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
        else if (screenName == "Home" || screenName == "VaccinationTab" || screenName == "ChildDevelopment" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
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
        // navigationRef.current?.navigate('ChildDevelopment');
        if (screenName == "NotificationsScreen") {
          console.log("..NotificationsScreen..", screenName);
          navigationRef.current?.navigate('Home', {
            screen: 'ChildDevelopment', params: {
              fromNotificationScreen: true,
            }
          })
        }
        else if (screenName == "Home" || screenName == "ChildDevelopment" || screenName == "VaccinationTab" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
          navigationRef.current?.navigate('ChildDevelopment');
        }
        else {
          console.log("..nohomenew..", screenName);
          navigationRef.current?.navigate('Home', { screen: 'ChildDevelopment' })
        }
      }
      else if (notification.data.notitype == 'gw') {
        if (screenName == "NotificationsScreen") {
          console.log("..NotificationsScreen..", screenName);
          // navigationRef.current?.navigate('Home', {
          //   screen: 'Tools',
          //   params: {
          //     screen: 'ChildgrowthTab',
          //     params: {
          //       fromNotificationScreen: true,
          //     }
          //   },
          // })
          navigationRef.current?.navigate('AddNewChildgrowth', {
            headerTitle: t('growthScreenaddNewBtntxt'),
            fromNotificationScreen: true,
          })
        }
        else if (screenName == "Home" || screenName == "ChildDevelopment" || screenName == "VaccinationTab" || screenName == "HealthCheckupsTab" || screenName == "ChildgrowthTab") {
          navigationRef.current?.navigate('AddNewChildgrowth', {
            headerTitle: t('growthScreenaddNewBtntxt'),
          });
        }
        else {
          console.log("..nohomenew..", screenName)
          // navigationRef.current?.navigate('Home', {
          //   screen: 'Tools',
          //   params: {
          //     screen: 'ChildgrowthTab',
          //   },
          // });
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
  const handleNotification = (notification: any) => {
    const screenName = navigationRef.current.getCurrentRoute().name;
    console.log(screenName, "..screenName..")

    var executed = false;
    if (!executed) {
      executed = true;
      // const routes =  navigationRef.current?.dangerouslyGetState()?.routes;
      //Alert.alert(usePreviousRouteName(), "in callSagaApi navigation history--");

      //// **APP IS OPEN**
      //Alert.alert(JSON.stringify(notification),"..notification.foreground true..");
      if (notification && notification.userInteraction == true) {
        ToastAndroid.showWithGravityAndOffset(
          currentActiveChild + "," + screenName + "," + notification.userInteraction + "," + notification.data.notitype + "," + notification.data.uuid,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

        if (notification && notification.data && notification.data.notitype != '' && notification.data.notitype != null && notification.data.notitype != undefined && userIsOnboarded) {
          // if(activeChilduuid!=notification.data.uuid){

          // }
          redirectLocation(notification);
        }
      } else { ///////**APP IS CLOSED!!!**

        if (notification && notification.foreground == false) {
          ToastAndroid.showWithGravityAndOffset(
            currentActiveChild + "," + screenName + "," + notification.foreground + "," + notification.data.notitype + "," + notification.data.uuid,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
          if (notification && notification.data && notification.data.notitype != '' && notification.data.notitype != null && notification.data.notitype != undefined && userIsOnboarded) {
            //Alert.alert(JSON.stringify(notification),"..notification.foreground false..");
            //navigationRef.current?.navigate("Tools", { screen: 'HealthCheckupsTab' })
            redirectLocation(notification);
          }
        }
      }

    }

  }
  useEffect(() => {
    // let notiListener=null;
    createLocalNotificationListeners();
    // return () => {
    //   notiListener=null;
    // }
  }, []);
  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log("msg----",remoteMessage);
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
    // if (userIsOnboarded == true) {
    fetchNetInfo();
    // } 

    async function fetchNetInfo() {
      if (netInfoval && netInfoval.isConnected != null) {
        // Alert.alert(netInfoval.netValue.type, "--234navnetInfoval--");
        // console.log("use effect net connected call");
        // console.log(toggleSwitchVal, "..hometoggleSwitchVal")
        if (netInfoval.isConnected == true) {
          if (Platform.OS == 'android') {
            if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other" || netInfoval.netValue.type == "bluetooth" || netInfoval.netValue.type == "vpn")) {
              // Alert.alert("66"+toggleSwitchVal+typeof(toggleSwitchVal));
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "2g") {
              // Alert.alert("55"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);

              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "3g") {
              // Alert.alert("44"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
              setNetState('Lowbandwidth');


            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "4g") {
              // Alert.alert("44"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
              setNetState('Highbandwidth');


            }
            // else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == null) {
            //   //Alert.alert("33"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
            //   setNetState('Lowbandwidth');


            // }
            else {
              // Alert.alert("11111");
              //Alert.alert("11"+toggleSwitchVal+typeof(toggleSwitchVal));
              setNetState('Highbandwidth');

            }
          }
          else if (Platform.OS == 'ios') {
            if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other")) {
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "2g") {
              // Alert.alert("11",netInfoval.netValue.details.cellularGeneration);
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "3g") {
              // Alert.alert("33",netInfoval.netValue.details.cellularGeneration);
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "4g") {
              // Alert.alert("44"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
              setNetState('Highbandwidth');

            }
            // else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == null) {
            //   setNetState('Lowbandwidth');
            // }
            else {
              // Alert.alert("22",netInfoval.netValue.type);
              setNetState('Highbandwidth');
            }
          }
        }
        else {
          setNetState('NoConnection');
          //  Alert.alert(t('noInternet'));
        }

      }
    }
    return {};
  }, [netInfoval.isConnected, netInfoval.netType, netInfoval.netValue?.details?.cellularGeneration]);
  useEffect(() => {
    console.log("linkedURL3---", linkedURL);
  }, [linkedURL]);

  useEffect(() => {
    let unsubscribe: any = null;
    // async function createLocalNotification(){
    //  unsubscribe  = createLocalNotificationListeners().then(r => console.log("local push notification listeners created"));
    // }
    // createLocalNotification();
    // return () => {
    // unsubscribe=null;
    // }
  }, []);
  useEffect(() => {
    if (userIsOnboarded == true) {
      // console.log("calculated");
      // console.log("calculated");
      //call forceupdate api and check with asyncstorage
      // dispatch(fetchAPI(apiJsonData,prevPage,dispatch,navigation,languageCode,activeChild,apiJsonData,netInfoval.isConnected))
      //if force update is being done the set showDownloadPopup to false
      // if(linkedURL) {
      //   let obj = { key: 'showDownloadPopup', value: false };
      //   dispatch(setInfoModalOpened(obj));
      // }else {
      let obj = { key: 'showDownloadPopup', value: true };
      dispatch(setInfoModalOpened(obj));
      let localnotiFlagObj = { generateFlag: true, generateType: 'onAppStart', childuuid: 'all' };
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
      // }
      getAllChildren(dispatch, child_age, 0);
    }
    dispatch(setchatBotData([]));
    if (countryId == 1) {
      dispatch(oncountrtIdChange(restOfTheWorldCountryId));
    }
    let notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    //add notification condition in else if required 1st time as well
  }, []);

  useEffect(() => {
    //Alert.alert(netState,"..netState")

    async function fetchNetInfoSet() {
      if (netState == "Highbandwidth" && toggleSwitchVal == true) {

        let confirmation = await retryAlert1(0, 0);
        // console.log(toggleSwitchVal, "..21hometoggleSwitchVal")
        //console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
        if (confirmation == "yes" && toggleSwitchVal == true) {
          dispatch(onNetworkStateChange(false));
        }
      }
      else if (netState == "Lowbandwidth" && toggleSwitchVal == false) {
        let confirmation = await retryAlert1(1, 1);
        //console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
        if (confirmation == "yes" && toggleSwitchVal == false) {
          //console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
          dispatch(onNetworkStateChange(true));
        }
      }
    }
    // console.log(netState,"..netState")
    fetchNetInfoSet();
  }, [netState]);
  const routeNameRef = React.useRef<any>();
  const navigationRef = React.useRef<any>();
  // console.log(routeNameRef.current, "callRealmListener12--", I18nManager.isRTL);

  return (
    // <ThemeProvider theme={theme}>
    <SafeAreaProvider>
      {/* <Text>{JSON.stringify(netInfoval.netValue)}Hiiiii</Text>
      <Text>Bandwidth-{netState}</Text> */}
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
            analytics().logEvent(currentRouteName + "_opened");
            // console.log(currentRouteName,"currentRouteName")
            // if(currentRouteName =="ChartFullScreen"){
            //   Orientation.lockToLandscape();
            // }else{
            //   Orientation.lockToPortrait();
            // }
            //  await analytics().logEvent('product_view', {
            //   id: '1234',
            // });
          }
          routeNameRef.current = currentRouteName;
        }}
      // initialState={initialState}
      // onStateChange={(state) =>
      //   AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      // }
      >
        <RootStack.Navigator
          initialRouteName={
            restartOnLangChange != 'yes' ?
              userIsOnboarded == true ? 'HomeDrawerNavigator' : 'Localization'
              : AppLayoutDirectionScreen
          }
          // initialRouteName={
          //   'Localization'
          // }
          screenOptions={{ animationEnabled: Platform.OS == 'ios' ? true : false }}
        >
          {/* initialRouteName={'Localization'}> */}
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
    // </ThemeProvider>
  );
};

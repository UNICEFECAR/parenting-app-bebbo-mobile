import * as AuditFS from '@dr.pogodin/react-native-fs';
import {store as auditStore} from '../../App';
import {selectArticleDataAll, selectActivitiesDataAll, selectPinnedChildDevData} from '../services/selectors';
import AuditRestart from 'react-native-restart';
import {I18nManager} from "react-native";
import {setrestartOnLangChange, setAppLayoutDirectionParams} from "../redux/reducers/localizationSlice";
import { scheduleIdleTask } from "../services/scheduleIdleTask";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddExpectingChildProfile from "@screens/AddExpectingChildProfile";
import AddSiblingData from "@screens/AddSiblingData";
import ChildSetup from "@screens/ChildSetup";
import ChildImportSetup from "@screens/ChildImportSetup";
import ChildSetupList from "@screens/ChildSetupList";
import ServiceProviderInfoSetup from "@screens/ServiceProviderInfoSetup";
import EditParentDetails from "@screens/EditParentDetails";
import AddNewChildgrowth from "@screens/growth/AddNewChildgrowth";
import AddNewChildHeight from "@screens/growth/AddNewChildHeight";
import AddNewChildWeight from "@screens/growth/AddNewChildWeight";
import AllChildgrowthMeasures from "@screens/growth/AllChildgrowthMeasures";
import { ChartFullScreen } from "@screens/growth/ChartFullScreen";
import AddChildHealthCheckup from "@screens/healthCheckup/AddChildHealthCheckup";
import ChildProfile from "@screens/home/ChildProfile";
import DetailsScreen from "@screens/home/DetailsScreen";
import EditChildProfile from "@screens/home/EditChildProfile";
import LoadingScreen from "@screens/LoadingScreen";
import PrivacyPolicy from "@screens/PrivacyPolicy";
import Terms from "@screens/Terms";
import AddChildVaccination from "@screens/vaccination/AddChildVaccination";
import AddReminder from "@screens/vaccination/AddReminder";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AppState, BackHandler, Linking, NativeModules, Platform } from "react-native";
import SplashScreen from "@attarchi/react-native-lottie-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../App";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import { onNetworkStateChange } from "../redux/reducers/bandwidthSlice";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
import { getAllChildren, setActiveChild } from "../services/childCRUD";
import HomeDrawerNavigator from "./HomeDrawerNavigator";
import LocalizationNavigation from "./LocalizationNavigation";
import { RootStackParamList } from "./types";
import { retryAlert1 } from "../services/commonApiService";
import { setchatBotData } from "../redux/reducers/childSlice";
import { appConfig, countryData } from "../instances";
import { oncountrtIdChange } from "../redux/reducers/localizationSlice";
import { useDeepLinkURL } from "../services/DeepLinking";
import { ThemeContext } from "styled-components";
import { getMessaging, getInitialNotification, onMessage, onNotificationOpenedApp } from "@react-native-firebase/messaging";
import { AppEventsLogger, Settings } from "react-native-fbsdk-next";
import { PERMISSIONS, RESULTS, request, check } from "react-native-permissions";
import LocalNotifications from "../services/LocalNotifications";
import { setAllLocalNotificationGenerateType } from "../redux/reducers/notificationSlice";
import { trimWhiteSpacePayload } from "../services/Utils";
import TermsPage from "@screens/TermsPage";
import { logEvent, synchronizeEvents } from "../services/EventSyncService";
import AddChildSetup from "@screens/AddChildSetup";
import { fetchAPI } from "../redux/sagaMiddleware/sagaActions";
import { ToastAndroidLocal } from "../android/sharedAndroid.android";
import { getApp } from "@react-native-firebase/app";
import { logAnalyticsEvent, setUserProperties, logCrashlyticsMessage, recordError } from "../services/firebaseAnalytics";
import { selectActiveChild, selectAllCountries, selectChildAge, selectSurveyData } from "../services/selectors";
import { BebboDistributionChannel, BebboDistributionCountry } from "react-native-dotenv";

const RootStack = createStackNavigator<RootStackParamList>();
export default (): any => {
  const [profileLoading, setProfileLoading] = React.useState(false);
  const userIsOnboarded = useAppSelector(
    (state: any) => state.utilsData.userIsOnboarded
  );
  const userIsFirstTime = useAppSelector(
    (state: any) => state.utilsData.userIsFirstTime
  );
  const child_age = useAppSelector(selectChildAge);
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );

  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const restartOnLangChange = useAppSelector(
    (state: any) => state.selectedCountry.restartOnLangChange
  );
  const AppLayoutDirectionParams = useAppSelector((state: any) => state.selectedCountry.AppLayoutDirectionParams);
  const AppLayoutDirectionScreen = useAppSelector(
    (state: any) => state.selectedCountry.AppLayoutDirectionScreen
  );
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId
  );
  const [netState, setNetState] = React.useState("");
  const dispatch = useAppDispatch();
  const netInfo = useNetInfoHook();
  const activeChild = useAppSelector(selectActiveChild);
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext?.colors.ACTIVITIES_TINTCOLOR;
  const { linkedURL, resetURL } = useDeepLinkURL();
  const navigationRef = React.useRef<any>(null);
  const routesLength = navigationRef?.current?.getRootState()?.routes?.length;
  useEffect(() => {
    let last = '';
    let busy = false;
    const base = Platform.OS === 'android' ? AuditFS.ExternalDirectoryPath : AuditFS.DocumentDirectoryPath;
    const timer = setInterval(async () => {
      if (busy || !navigationRef.current?.isReady()) return;
      busy = true;
      try {
        const cmd = JSON.parse(await AuditFS.readFile(base + '/visual-audit.json', 'utf8'));
        if (cmd.id === last) return;
        last = cmd.id;
        if (cmd.direction) {
          I18nManager.allowRTL(cmd.direction === 'rtl');
          I18nManager.forceRTL(cmd.direction === 'rtl');
          await AuditFS.writeFile(base + '/visual-audit-status.json', JSON.stringify({id:cmd.id,restarting:true}), 'utf8');
          AuditRestart.Restart();
          return;
        }
        if (cmd.scroll) {
          const views = Array.from((globalThis as any).__auditScrolls.values()).filter((x:any)=>!x.props.horizontal && x.ref?.scrollToEnd) as any[];
          const target=views[views.length-1];
          if(cmd.scroll==='end') target?.ref.scrollToEnd({animated:false});
          else target?.ref.scrollTo({y:0,animated:false});
        } else if (cmd.text !== undefined) {
          const inputs = Array.from((globalThis as any).__auditInputs.values()).filter((x:any)=>x.props.editable!==false && x.props.onChangeText) as any[];
          const target=inputs[cmd.inputIndex || 0];
          target?.ref?.focus();target?.props.onChangeText(cmd.text);
        } else if (cmd.press) {
          const controls = Array.from((globalThis as any).__auditControls.values()) as any[];
          const match = controls.filter(x => x.label.toLowerCase().includes(cmd.press.toLowerCase()) && !x.disabled && typeof x.onPress === 'function')[cmd.match || 0];
          if (match) match.onPress?.({stopPropagation(){},persist(){},nativeEvent:{}});
          else throw new Error('No control: '+cmd.press);
        } else {
          let params = cmd.params || {};
          if (cmd.detail) {
            const state = auditStore.getState();
            const pool = cmd.detail === 'activity' ? selectActivitiesDataAll(state) : cmd.detail === 'video' ? selectPinnedChildDevData(state) : selectArticleDataAll(state);
            const data = cmd.idOfArticle ? pool.find((x:any)=>x.id===cmd.idOfArticle) : pool.find((x:any)=>x.body || x.summary || x.title);
            params = {fromScreen:cmd.detail==='activity'?'Activities':'Articles', detailData:data, listCategoryArray:[], selectedChildActivitiesData:[], currentSelectedChildId:activeChild?.uuid, queryText:[],...params};
          }
          if (cmd.editChild) params = {...params,childData:activeChild};
          let target:any = {name:cmd.route, params};
          if (cmd.tab) target = {name:'HomeDrawerNavigator',params:{screen:'Home',params:{screen:cmd.tab}}};
          if (cmd.drawer) target = {name:'HomeDrawerNavigator',params:{screen:cmd.drawer,params}};
          if (cmd.localization) target = {name:'Localization',params:{screen:cmd.localization,params}};
          navigationRef.current.resetRoot({index:target.name==='HomeDrawerNavigator'?0:1,routes:target.name==='HomeDrawerNavigator'?[target]:[{name:'HomeDrawerNavigator'},target]});
        }
        setTimeout(async () => {
          const controls = Array.from((globalThis as any).__auditControls.values()).map((x:any)=>({label:x.label,disabled:x.disabled}));
          await AuditFS.writeFile(base + '/visual-audit-status.json', JSON.stringify({id:cmd.id,route:navigationRef.current?.getCurrentRoute(),rtl:I18nManager.isRTL,controls}), 'utf8');
        },1000);
      } catch(e) {
        if (last) await AuditFS.writeFile(base + '/visual-audit-error.json', String(e), 'utf8').catch(()=>{});
      } finally {busy=false;}
    },500);
    return () => clearInterval(timer);
  }, [activeChild]);

  const apiData = useAppSelector(
    (state) => state.failedOnloadApiObjReducer.data
  );
  const surveyData = useAppSelector(selectSurveyData);
  const allCountries = useAppSelector(selectAllCountries);
  const hasLoggedEvent = useRef(false);
  let currentCount = 0;
  const messaging = React.useMemo(() => getMessaging(getApp()), []);
  // messaging.getToken().then(token => {
  //   console.log('FCM Token:', token);
  // });
  const getDistributionChannel = () => {
    if (BebboDistributionChannel === 'direct_apk') {
      return 'direct_apk';
    }
  
    return Platform.OS === 'android'
      ? 'google_play'
      : 'app_store';
  };
  const setDistributionAnalytics = async () => {
    try {
      const platform =
        Platform.OS === 'android' ? 'Android' : 'iOS';
  
      const distributionChannel = getDistributionChannel();
  
      await setUserProperties({
        platform,
        distribution_channel: distributionChannel,
  
        ...(distributionChannel === 'direct_apk'
          ? {
              distribution_country: BebboDistributionCountry,
            }
          : {}),
      });
    } catch (error) {
      console.log(
        'Failed to set distribution analytics properties:',
        error
      );
    }
  };
  useEffect(() => {
    setDistributionAnalytics();
  }, []);
  const callUrl = (url: any): any => {
    if (url) {
      //Alert.alert("in deep link",url);
      const initialUrlnew: any = url;
      if (initialUrlnew === null) {
        return;
      }
      if (initialUrlnew && initialUrlnew.includes("/article/")) {
        const initialUrlnewId: any = initialUrlnew.split("/").pop();
        const initialUrlnewId1: any = parseInt(initialUrlnewId);
        console.log("rerenew2", userIsOnboarded);
        if (userIsOnboarded == true) {
          if (navigationRef) {
            navigationRef.current?.navigate("DetailsScreen", {
              fromScreen: "HomeArt",
              headerColor: "",
              backgroundColor: "",
              detailData: initialUrlnewId1,
              listCategoryArray: [],
            });
          }
        }
      } else if (initialUrlnew && initialUrlnew.includes("/activity/")) {
        const initialUrlnewId: any = initialUrlnew.split("/").pop();
        const initialUrlnewId1: any = parseInt(initialUrlnewId);
        console.log("initialUrlnewId1 activity", initialUrlnewId1);
        if (userIsOnboarded == true) {
          if (navigationRef) {
            navigationRef.current?.navigate("DetailsScreen", {
              fromScreen: "HomeAct",
              headerColor: headerColor,
              backgroundColor: backgroundColor,
              detailData: initialUrlnewId1,
              listCategoryArray: [],
            });
          }
        }
      }
      resetURL();
    }
  };
  const apiJsonData = [
    {
      apiEndpoint: appConfig.apiConfig.countryGroups,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.taxonomies,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
        dispatch(
          fetchAPI(
            apiJsonData,
            "",
            dispatch,
            navigationRef.current,
            languageCode || 'en',
            activeChild,
            apiJsonData,
            netInfo.isConnected
          )
        );
    },1000);

    return () => clearTimeout(timeout);
  }, [dispatch,languageCode, netInfo.isConnected]);

  const onBackPress = (): any => {
    if (routesLength === 1 && userIsOnboarded == false) {
        if (currentCount === 0) {
          currentCount++;
          if (Platform.OS === "android") {
            ToastAndroidLocal.show(t("backPressText"), 6000);
            setTimeout(() => {
              currentCount = 0;
            }, 2000);
            return true;
          } else {
            Alert.alert(t("backPressText"));
            setTimeout(() => {
              currentCount = 0;
            }, 2000);
            return true;
          }
        } else {
          // exit the app here using
            BackHandler.exitApp();
        }
      }
    };
    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      navigationRef.current?.addListener("gestureEnd", onBackPress);
      return (): any => {
        navigationRef.current?.removeListener("gestureEnd", onBackPress);
        backHandler.remove();
      };
    }, [routesLength,userIsOnboarded]);

  useEffect(() => {
    const task = scheduleIdleTask(() => {
      // ... handle deep link
      callUrl(linkedURL);
    });
    
    return () => task.cancel();
  }, [linkedURL, resetURL, userIsOnboarded]);

  useEffect(() => {
    const logFacebookEvent = (): void => {
      if (!hasLoggedEvent.current) {
        AppEventsLogger.logEvent('fb_sdk_initialized'); // Custom event
        hasLoggedEvent.current = true;
      }
    };
    const initPixel = async (): Promise<any> => {
      if (Platform.OS === "ios") {
        const ATT_CHECK = await check(
          PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
        );
        console.log(ATT_CHECK, "..ATT_CHECK..");
        if (ATT_CHECK === RESULTS.DENIED) {
          try {
            const ATT = await request(
              PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
            );
            if (ATT === RESULTS.GRANTED) {
              console.log(ATT, "..ATT..");
              Settings.setAdvertiserTrackingEnabled(true).then(() => {
                Settings.initializeSDK();
                logFacebookEvent();
              });
            }
          } catch (error) {
            console.log(error, "error");
            throw error;
          } finally {
            Settings.initializeSDK();
            logFacebookEvent();
          }
          Settings.initializeSDK();
          logFacebookEvent();
          Settings.setAdvertiserTrackingEnabled(true);
        }
      } else {
        Settings.initializeSDK();
        logFacebookEvent();
        Settings.setAdvertiserTrackingEnabled(true);
      }
    };
    const updateTrackingStatus = (status: any): any => {
      console.log(status, "..status");
      if (status === "active") {
        initPixel();
      }
    };

    // Ready to check the permission now
    if (AppState.currentState === "active") {
      updateTrackingStatus(AppState.currentState);
    } else {
      // Need to wait until the app is ready before checking the permission
      const eventListener = AppState.addEventListener(
        "change",
        updateTrackingStatus
      );

      return (): any => {
        eventListener.remove();
        // AppState.removeEventListener('change', updateTrackingStatus)
      };
    }
  }, [AppState.currentState]);
  const getSearchParamFromURL = (urlNew: any, paramNew: any): any => {
    const url = new URL(urlNew);
    const params = new URLSearchParams(url.search);
    const param = params.get(paramNew);
    console.log(param, params);
    return param;
  };

  const redirectLocation = (notification: any): any => {
    const screenName = navigationRef.current.getCurrentRoute().name;
    console.log(activeChild, "..activeChild..");
    console.log(notification.data.uuid, "..notification.data.uuid..");
    scheduleIdleTask(async () => {
      try {
      if (notification && notification.data && notification.data.notitype) {
        if (
          notification.data.notitype == "vc" ||
          notification.data.notitype == "vcr"
        ) {
          if (screenName == "NotificationsScreen") {
            console.log("..NotificationsScreen..", screenName);
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "VaccinationTab",
                params: {
                  fromNotificationScreen: true,
                },
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "VaccinationTab" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("Tools", {
              screen: "VaccinationTab",
            });
          } else {
            console.log("..nohomenew..", screenName);
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "VaccinationTab",
              },
            });
          }
        } else if (
          notification.data.notitype == "hc" ||
          notification.data.notitype == "hcr"
        ) {
          if (screenName == "NotificationsScreen") {
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "HealthCheckupsTab",
                params: {
                  fromNotificationScreen: true,
                },
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "VaccinationTab" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("Tools", {
              screen: "HealthCheckupsTab",
            });
          } else {
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "HealthCheckupsTab",
              },
            });
          }
        } else if (notification.data.notitype == "cd") {
          if (screenName == "NotificationsScreen") {
            navigationRef.current?.navigate("Home", {
              screen: "ChildDevelopment",
              params: {
                fromNotificationScreen: true,
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "VaccinationTab" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("ChildDevelopment");
          } else {
            navigationRef.current?.navigate("Home", {
              screen: "ChildDevelopment",
            });
          }
        } else if (notification.data.notitype == "gw") {
          if (screenName == "NotificationsScreen") {
            navigationRef.current?.navigate("AddNewChildgrowth", {
              headerTitle: t("growthScreenaddNewBtntxt"),
              fromNotificationScreen: true,
            });
          } else if (
            screenName == "Home" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "VaccinationTab" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("AddNewChildgrowth", {
              headerTitle: t("growthScreenaddNewBtntxt"),
            });
          } else {
            navigationRef.current?.navigate("AddNewChildgrowth", {
              headerTitle: t("growthScreenaddNewBtntxt"),
            });
          }
        }
      }
      setProfileLoading(true);
        const start = Date.now();      
        logCrashlyticsMessage(
          'NOTI: setActiveChild start'
        );
        const setData = await setActiveChild(
          languageCode,
          notification.data.uuid,
          dispatch,
          child_age,
          true
        );
        logCrashlyticsMessage(
          `NOTI: setActiveChild end ${
            Date.now() - start
          }ms`
        );
        if (setData == "activeset") {
          setProfileLoading(false);
        }
    } catch (error) {
      recordError(error as any);
      setProfileLoading(false);
    }
  });
  };
  const localNotificationHandler = useRef<(notification: any) => boolean>(() => false);
  localNotificationHandler.current = (notification: any): boolean => {
    if (!userIsOnboarded || !navigationRef.current?.isReady()) return false;
    if (notification?.data?.notitype) redirectLocation(notification);
    return true;
  };
  useEffect(() => {
    if (!userIsOnboarded) return;
    return LocalNotifications.subscribeToPress((notification: any) =>
      localNotificationHandler.current(notification)
    );
  }, [userIsOnboarded]);

  const redirectPayload = (remoteMessage: any): any => {
    logCrashlyticsMessage(
      `NOTI: redirectPayload type=${remoteMessage?.data?.type}`
    );
    if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "articles"
    ) {
      if (navigationRef) {
        if (
          remoteMessage.data.id &&
          remoteMessage.data.id != "" &&
          remoteMessage.data.id != null &&
          remoteMessage.data.id != undefined &&
          !isNaN(trimWhiteSpacePayload(remoteMessage.data.id))
        ) {
          navigationRef.current?.navigate("DetailsScreen", {
            fromScreen: "FirebaseArticles",
            headerColor: "",
            backgroundColor: "",
            detailData: Number(trimWhiteSpacePayload(remoteMessage.data.id)),
            listCategoryArray: [],
          });
        } else {
          const screenName = navigationRef.current.getCurrentRoute().name;
          if (screenName == "NotificationsScreen") {
            navigationRef.current?.navigate("Home", {
              screen: "Articles",
              params: {
                fromNotificationScreen: true,
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "VaccinationTab" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("Articles");
          } else {
            navigationRef.current?.navigate("Home", { screen: "Articles" });
          }
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "activities"
    ) {
      if (navigationRef) {
        if (
          remoteMessage.data.id &&
          remoteMessage.data.id != "" &&
          remoteMessage.data.id != null &&
          remoteMessage.data.id != undefined &&
          !isNaN(trimWhiteSpacePayload(remoteMessage.data.id))
        ) {
          console.log(
            Number(remoteMessage.data.id),
            "Number(remoteMessage.data.id)"
          );
          navigationRef.current?.navigate("DetailsScreen", {
            fromScreen: "FirebaseActivities",
            headerColor: headerColor,
            backgroundColor: backgroundColor,
            detailData: Number(trimWhiteSpacePayload(remoteMessage.data.id)),
            listCategoryArray: [],
          });
        } else {
          const screenName = navigationRef.current.getCurrentRoute().name;
          if (screenName == "NotificationsScreen") {
            navigationRef.current?.navigate("Home", {
              screen: "Activities",
              params: {
                fromNotificationScreen: true,
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "VaccinationTab" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("Activities");
          } else {
            navigationRef.current?.navigate("Home", { screen: "Activities" });
          }
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "vaccination"
    ) {
      if (navigationRef) {
        if (
          remoteMessage.data.id &&
          remoteMessage.data.id != "" &&
          remoteMessage.data.id != null &&
          remoteMessage.data.id != undefined &&
          !isNaN(trimWhiteSpacePayload(remoteMessage.data.id))
        ) {
          navigationRef.current?.navigate("DetailsScreen", {
            fromScreen: "FirebaseVaccinationTab",
            headerColor: headerColor,
            backgroundColor: backgroundColor,
            detailData: Number(trimWhiteSpacePayload(remoteMessage.data.id)),
            listCategoryArray: [],
          });
        } else {
          const screenName = navigationRef.current.getCurrentRoute().name;
          if (screenName == "NotificationsScreen") {
            console.log("..NotificationsScreen..", screenName);
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "VaccinationTab",
                params: {
                  fromNotificationScreen: true,
                },
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "VaccinationTab" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("Tools", {
              screen: "VaccinationTab",
            });
          } else {
            console.log("..nohomenew..", screenName);
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "VaccinationTab",
              },
            });
          }
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "checkup"
    ) {
      if (navigationRef) {
        if (
          remoteMessage.data.id &&
          remoteMessage.data.id != "" &&
          remoteMessage.data.id != null &&
          remoteMessage.data.id != undefined &&
          !isNaN(trimWhiteSpacePayload(remoteMessage.data.id))
        ) {
          navigationRef.current?.navigate("DetailsScreen", {
            fromScreen: "FirebaseHealthCheckupsTab",
            headerColor: headerColor,
            backgroundColor: backgroundColor,
            detailData: Number(trimWhiteSpacePayload(remoteMessage.data.id)),
            listCategoryArray: [],
          });
        } else {
          const screenName = navigationRef.current.getCurrentRoute().name;
          if (screenName == "NotificationsScreen") {
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "HealthCheckupsTab",
                params: {
                  fromNotificationScreen: true,
                },
              },
            });
          } else if (
            screenName == "Home" ||
            screenName == "VaccinationTab" ||
            screenName == "ChildDevelopment" ||
            screenName == "Activities" ||
            screenName == "Articles" ||
            screenName == "HealthCheckupsTab" ||
            screenName == "ChildgrowthTab"
          ) {
            navigationRef.current?.navigate("Tools", {
              screen: "HealthCheckupsTab",
            });
          } else {
            navigationRef.current?.navigate("Home", {
              screen: "Tools",
              params: {
                screen: "HealthCheckupsTab",
              },
            });
          }
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "growth"
    ) {
      if (navigationRef) {
        const screenName = navigationRef.current.getCurrentRoute().name;
        if (screenName == "NotificationsScreen") {
          navigationRef.current?.navigate("Home", {
            screen: "Tools",
            params: {
              screen: "ChildgrowthTab",
              params: {
                fromNotificationScreen: true,
              },
            },
          });
        } else if (
          screenName == "Home" ||
          screenName == "ChildDevelopment" ||
          screenName == "Activities" ||
          screenName == "Articles" ||
          screenName == "VaccinationTab" ||
          screenName == "HealthCheckupsTab" ||
          screenName == "ChildgrowthTab"
        ) {
          navigationRef.current?.navigate("Tools", {
            screen: "ChildgrowthTab",
          });
        } else {
          navigationRef.current?.navigate("Home", {
            screen: "Tools",
            params: {
              screen: "ChildgrowthTab",
            },
          });
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "development"
    ) {
      if (navigationRef) {
        const screenName = navigationRef.current.getCurrentRoute().name;
        if (screenName == "NotificationsScreen") {
          navigationRef.current?.navigate("Home", {
            screen: "ChildDevelopment",
            params: {
              fromNotificationScreen: true,
            },
          });
        } else if (
          screenName == "Home" ||
          screenName == "ChildDevelopment" ||
          screenName == "Activities" ||
          screenName == "Articles" ||
          screenName == "VaccinationTab" ||
          screenName == "HealthCheckupsTab" ||
          screenName == "ChildgrowthTab"
        ) {
          navigationRef.current?.navigate("ChildDevelopment");
        } else {
          navigationRef.current?.navigate("Home", {
            screen: "ChildDevelopment",
          });
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "notifications"
    ) {
      if (navigationRef) {
        navigationRef.current?.navigate("NotificationsScreen");
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "chat"
    ) {
      if (navigationRef) {
        navigationRef.current?.navigate("SupportChat");
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "user_survey"
    ) {
      if (navigationRef) {
        if (
          remoteMessage.data.URL &&
          trimWhiteSpacePayload(remoteMessage.data.URL) != "" &&
          trimWhiteSpacePayload(remoteMessage.data.URL) != null &&
          trimWhiteSpacePayload(remoteMessage.data.URL) != undefined
        ) {
          Linking.openURL(trimWhiteSpacePayload(remoteMessage.data.URL));
        } else {
          if (Platform.OS == "ios") {
            setTimeout(() => {
              const surveyItem = surveyData.find(
                (item: any) => item.type == "survey"
              );
              if (surveyItem && surveyItem.survey_feedback_link) {
                Linking.openURL(trimWhiteSpacePayload(surveyItem.survey_feedback_link));
              }
            }, 100);
          } else {
            const surveyItem = surveyData.find(
              (item: any) => item.type == "survey"
            );
            if (surveyItem && surveyItem.survey_feedback_link) {
              Linking.openURL(trimWhiteSpacePayload(surveyItem.survey_feedback_link));
            }
          }
        }
      }
    } else if (
      remoteMessage &&
      remoteMessage.data &&
      remoteMessage.data.type &&
      trimWhiteSpacePayload(remoteMessage.data.type) === "hyperlink"
    ) {
      if (navigationRef) {
        if (
          remoteMessage.data.URL &&
          trimWhiteSpacePayload(remoteMessage.data.URL) != "" &&
          trimWhiteSpacePayload(remoteMessage.data.URL) != null &&
          trimWhiteSpacePayload(remoteMessage.data.URL) != undefined
        ) {
          Linking.openURL(trimWhiteSpacePayload(remoteMessage.data.URL));
        }
      }
    } else {
      if (
        remoteMessage &&
        remoteMessage.notification &&
        remoteMessage.notification.body &&
        remoteMessage.notification.title
      ) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          [{ text: t("forceUpdateOkBtn") }]
        );
      }
    }
  };
  useEffect(() => {
    const splashTimer = setTimeout(() => SplashScreen.hide(), 2000);
    let active = true;
    let unsubscribeOpened: (() => void) | undefined;
    let unsubscribeMessage: (() => void) | undefined;
    const redirects = new Set<ReturnType<typeof scheduleIdleTask>>();
    const queueRedirect = (remoteMessage: any, message: string): void => {
      const redirect = scheduleIdleTask(() => {
        redirects.delete(redirect);
        if (!active) return;
        logCrashlyticsMessage(message);
        redirectPayload(remoteMessage);
      });
      redirects.add(redirect);
    };
    const task = userIsOnboarded ? scheduleIdleTask(() => {
      unsubscribeOpened = onNotificationOpenedApp(messaging, (remoteMessage) => {
        if (remoteMessage && active) {
          queueRedirect(remoteMessage, 'NOTI: executing redirectPayload');
        }
      });
      // Preserve the destination when launching from a notification.
      getInitialNotification(messaging)
        .then((remoteMessage) => {
          if (!active) return;
          logCrashlyticsMessage('NOTI: getInitialNotification start');
          if (remoteMessage) {
            logCrashlyticsMessage(`NOTI: opened app type=${remoteMessage?.data?.type}`);
            queueRedirect(remoteMessage, 'NOTI: executing redirectPayload2');
          }
        })
        .catch((error) => { if (active) void recordError(error); });

      unsubscribeMessage = onMessage(messaging, async (remoteMessage) => {
        if (active && remoteMessage?.notification?.body && remoteMessage.notification.title) {
          Alert.alert(
            remoteMessage.notification.title,
            remoteMessage.notification.body,
            [{ text: t("forceUpdateOkBtn") }]
          );
        }
      });
    }) : undefined;
    return () => {
      active = false;
      clearTimeout(splashTimer);
      task?.cancel();
      unsubscribeOpened?.();
      unsubscribeMessage?.();
      redirects.forEach((redirect) => redirect.cancel());
      redirects.clear();
    };
  }, [userIsOnboarded]);

  useMemo(() => {
    async function fetchNetInfo(): Promise<any> {
      if (netInfo && netInfo.isConnected != null) {
        if (netInfo.isConnected == true) {
          synchronizeEvents(netInfo.isConnected);
          if (Platform.OS == "android") {
            if (
              netInfo.netValue.type == "unknown" ||
              netInfo.netValue.type == "other" ||
              netInfo.netValue.type == "bluetooth" ||
              netInfo.netValue.type == "vpn"
            ) {
              setNetState("Lowbandwidth");
            } else if (
              netInfo.netValue.type == "cellular" &&
              netInfo.netValue.details.cellularGeneration == "2g"
            ) {
              setNetState("Lowbandwidth");
            } else if (
              netInfo.netValue.type == "cellular" &&
              netInfo.netValue.details.cellularGeneration == "3g"
            ) {
              setNetState("Lowbandwidth");
            } else if (
              netInfo.netValue.type == "cellular" &&
              netInfo.netValue.details.cellularGeneration == "4g"
            ) {
              setNetState("Highbandwidth");
            } else {
              setNetState("Highbandwidth");
            }
          } else if (Platform.OS == "ios") {
            if (
              netInfo.netValue.type == "unknown" ||
              netInfo.netValue.type == "other"
            ) {
              setNetState("Lowbandwidth");
            } else if (
              netInfo.netValue.type == "cellular" &&
              netInfo.netValue.details.cellularGeneration == "2g"
            ) {
              setNetState("Lowbandwidth");
            } else if (
              netInfo.netValue.type == "cellular" &&
              netInfo.netValue.details.cellularGeneration == "3g"
            ) {
              setNetState("Lowbandwidth");
            } else if (
              netInfo.netValue.type == "cellular" &&
              netInfo.netValue.details.cellularGeneration == "4g"
            ) {
              setNetState("Highbandwidth");
            } else {
              setNetState("Highbandwidth");
            }
          }
        } else {
          setNetState("NoConnection");
        }
      }
    }
    const task = scheduleIdleTask(() => {
      fetchNetInfo();
    });

    return () => task.cancel();
  }, [
    netInfo.isConnected,
    netInfo.netType,
    netInfo.netValue?.details?.cellularGeneration,
  ]);
  useEffect(() => {
    console.log("linkedURL3---", linkedURL);
  }, [linkedURL]);

  useEffect(() => {
    if (!userIsOnboarded) return;
    const timeout = setTimeout(() => {
      if (userIsOnboarded == true) {
        const obj = { key: "showDownloadPopup", value: true };
        dispatch(setInfoModalOpened(obj));
        const localnotiFlagObj = {
          generateFlag: true,
          generateType: "onAppStart",
          childuuid: "all",
        };
        dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
        const start = Date.now();
        getAllChildren(dispatch, child_age, 0);
        logCrashlyticsMessage(
          `STARTUP: getAllChildren ${
            Date.now() - start
          }ms`
        );
      }
    },1000);

    return () => clearTimeout(timeout);
  }, [userIsOnboarded]);
  useEffect(() => {
    if (!allCountries.length) return;
    const timeout = setTimeout(() => {
      dispatch(setchatBotData([]));
      if (countryId == 1 && !allCountries.some((c: { CountryID: any; }) => Number(c.CountryID) === 1)) {
        dispatch(oncountrtIdChange(appConfig.restOfTheWorldCountryId));
      }
      const notiFlagObj = { key: "generateNotifications", value: true };
      dispatch(setInfoModalOpened(notiFlagObj));
      //add notification condition in else if required 1st time as well
    },1000);

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    async function fetchNetInfoSet(): Promise<any> {
      if (netState == "Highbandwidth" && toggleSwitchVal == true) {
        const confirmation = await retryAlert1(0, 0);
        if (confirmation == "yes" && toggleSwitchVal == true) {
          dispatch(onNetworkStateChange(false));
        }
      } else if (netState == "Lowbandwidth" && toggleSwitchVal == false) {
        const confirmation = await retryAlert1(1, 1);
        if (confirmation == "yes" && toggleSwitchVal == false) {
          dispatch(onNetworkStateChange(true));
        }
      }
    }
    const timeout = setTimeout(() => {
      fetchNetInfoSet();
    },1000);

    return () => clearTimeout(timeout);
  }, [netState]);
  const routeNameRef = React.useRef<any>(null);

  const apiJsonDataLoading = [
    {
      apiEndpoint: appConfig.apiConfig.taxonomies,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.apiConfig.basicPages,
      method: "get",
      postdata: {},
      saveinDB: true,
    },
  ];
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };
  const offlineCountryGroups: any[] =
  Object.values(countryData || {}).find((val) => Array.isArray(val)) || [];
  const hasSingleCountryLanguageOffline =
    offlineCountryGroups.length === 1 &&
    Array.isArray(offlineCountryGroups[0]?.languages) &&
    offlineCountryGroups[0].languages.length === 1;

  const hasSingleCountryLanguageOnline =
    allCountries?.length === 1 &&
    Array.isArray(allCountries[0]?.languages) &&
    allCountries[0].languages.length === 1;
  const startupHasSingleCountryLanguage = netInfo.isConnected
    ? hasSingleCountryLanguageOnline
    : hasSingleCountryLanguageOffline;

  const shouldShowNavigator =
    (netInfo.isConnected && apiData) ||
    (!netInfo.isConnected && offlineCountryGroups.length > 0);
  return (
    <SafeAreaProvider>
      {shouldShowNavigator && (
        <NavigationContainer
          direction={I18nManager.isRTL ? "rtl" : "ltr"}
          navigationInChildEnabled
          ref={navigationRef}
          onReady={(): any => {
            if (restartOnLangChange === "yes") {
              dispatch(setrestartOnLangChange("no"));
              dispatch(setAppLayoutDirectionParams({}));
            }
            LocalNotifications.flushPendingPress();
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            // SplashScreen.hide();
          }}
          onStateChange={(): any => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName =
              navigationRef.current.getCurrentRoute().name;
            console.log(`Previous route: ${previousRouteName}`);
            console.log(`Current route: ${currentRouteName}`);
            if (previousRouteName !== currentRouteName) {
              logAnalyticsEvent('screen_view', {
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              }).catch(() => {});
              const eventData = { name: currentRouteName + "_opened" };
              logEvent(eventData, netInfo.isConnected);
            }
            routeNameRef.current = currentRouteName;
          }}
          theme={navTheme}
        >
          <RootStack.Navigator
            initialRouteName={
              restartOnLangChange != "yes"
                ? userIsOnboarded == true
                  ? "HomeDrawerNavigator"
                  : startupHasSingleCountryLanguage
                  ? "LoadingScreen"
                  : "Localization"
                : AppLayoutDirectionScreen
            }
            screenOptions={{
              animation: Platform.OS == "ios" ? "default" : "none",
              headerShown: false,
            }}
          >
            <RootStack.Screen
              name="Localization"
              component={LocalizationNavigation}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="Terms"
              component={Terms}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name="TermsPage"
              component={TermsPage}
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
              name="AddChildSetup"
              component={AddChildSetup}
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
              name="ServiceProviderInfoSetup"
              component={ServiceProviderInfoSetup}
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
              initialParams={restartOnLangChange === "yes" && AppLayoutDirectionScreen === "LoadingScreen"
                ? AppLayoutDirectionParams
                : {
                    apiJsonData: apiJsonDataLoading,
                    prevPage: "CountryLanguageSelection",
                    isFirst: true,
                  }}
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
      )}
    </SafeAreaProvider>
  );
};

import { NavigationContainer } from "@react-navigation/native";
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
import { appConfig } from "../instances";
import { oncountrtIdChange } from "../redux/reducers/localizationSlice";
import { useDeepLinkURL } from "../services/DeepLinking";
import { ThemeContext } from "styled-components";
import { getMessaging, getInitialNotification, onMessage, onNotificationOpenedApp, setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import { AppEventsLogger, Settings } from "react-native-fbsdk-next";
import { PERMISSIONS, RESULTS, request, check } from "react-native-permissions";
import PushNotification from "react-native-push-notification";
import { setAllLocalNotificationGenerateType } from "../redux/reducers/notificationSlice";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { trimWhiteSpacePayload } from "../services/Utils";
import TermsPage from "@screens/TermsPage";
import { logEvent, synchronizeEvents } from "../services/EventSyncService";
import AddChildSetup from "@screens/AddChildSetup";
import { fetchAPI } from "../redux/sagaMiddleware/sagaActions";
import { ToastAndroidLocal } from "../android/sharedAndroid.android";
import { getApp } from "@react-native-firebase/app";
import { logAnalyticsEvent } from "../services/firebaseAnalytics";
import { selectActiveChild, selectAllCountries, selectChildAge, selectSurveyData } from "../services/selectors";
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
  const navigationRef = React.useRef<any>();
  const routesLength = navigationRef?.current?.getRootState()?.routes?.length;
  const apiData = useAppSelector(
    (state) => state.failedOnloadApiObjReducer.data
  );
  const surveyData = useAppSelector(selectSurveyData);
  const allCountries = useAppSelector(selectAllCountries);
  const hasLoggedEvent = useRef(false);
  let currentCount = 0;
  const messaging = getMessaging(getApp());
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
    if (!userIsFirstTime) {
      dispatch(
        fetchAPI(
          apiJsonData,
          "",
          dispatch,
          navigationRef.current,
          languageCode,
          activeChild,
          apiJsonData,
          netInfo.isConnected
        )
      );
    }
  }, [dispatch]);

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
    // ... handle deep link
    callUrl(linkedURL);
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
    setTimeout(async () => {
      const setData = await setActiveChild(
        languageCode,
        notification.data.uuid,
        dispatch,
        child_age,
        true
      );
      if (setData == "activeset") {
        setProfileLoading(false);
      }
    }, 0);
  };
  const handleNotification = (notification: any): any => {
    let executed = false;
    if (!executed) {
      executed = true;
      if (Platform.OS == "ios") {
        PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
          // get current number
          console.log(num, "...num...");
          if (num >= 1) {
            PushNotificationIOS.setApplicationIconBadgeNumber(0); //set number to 0
          }
        });
      }

      if (notification && notification.userInteraction == true) {
        if (
          notification &&
          notification.data &&
          notification.data.notitype != "" &&
          notification.data.notitype != null &&
          notification.data.notitype != undefined &&
          userIsOnboarded
        ) {
          redirectLocation(notification);
        }
      } else {
        ///////**APP IS CLOSED!!!**

        if (notification && notification.foreground == false) {
          if (
            notification &&
            notification.data &&
            notification.data.notitype != "" &&
            notification.data.notitype != null &&
            notification.data.notitype != undefined &&
            userIsOnboarded
          ) {
            redirectLocation(notification);
          }
        }
      }
    }
  };
  const createLocalNotificationListeners = async (): Promise<any> => {
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
        requestPermissions: false,
      });
      PushNotification.popInitialNotification((notification: any) => {
        handleNotification(notification);
        // this will listen to your local push notifications on opening app from background state
      });
    } catch (e) {
      console.log("error");
    }
  };

  useEffect(() => {
    if (userIsOnboarded == true) {
      createLocalNotificationListeners();
    }
  }, [userIsOnboarded]);

  const redirectPayload = (remoteMessage: any): any => {
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
          Linking.openURL(remoteMessage.data.URL);
        } else {
          if (Platform.OS == "ios") {
            setTimeout(() => {
              const surveyItem = surveyData.find(
                (item: any) => item.type == "survey"
              );
              if (surveyItem && surveyItem.survey_feedback_link) {
                Linking.openURL(surveyItem.survey_feedback_link);
              }
            }, 100);
          } else {
            const surveyItem = surveyData.find(
              (item: any) => item.type == "survey"
            );
            if (surveyItem && surveyItem.survey_feedback_link) {
              Linking.openURL(surveyItem.survey_feedback_link);
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
          Linking.openURL(remoteMessage.data.URL);
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
    onNotificationOpenedApp(messaging, (remoteMessage) => {
      if (remoteMessage) {
        // background click noti
        if (userIsOnboarded == true) {
          redirectPayload(remoteMessage);
        }
      }
    });
    // Check whether an initial notification is available
    getInitialNotification(messaging)
      .then((remoteMessage) => {
        if (remoteMessage) {
          // after kill and restart application
          if (userIsOnboarded == true) {
            redirectPayload(remoteMessage);
          }
        }
      });

    // let hideDelay = 2000;
    // if (userIsOnboarded) {
    //   hideDelay = Platform.OS === 'android' ? 0 : 500;
    // }
    // if (Platform.OS === 'ios') {
    //   NativeModules.RNSplashScreen.setAnimationFinished(true);
    // }
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);

    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
      try {
        // console.log('Remote notification', JSON.stringify(remoteMessage))
      } catch (err) {
        console.log(err);
      }
    });
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      //type article/activities
      //foreground call
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
    });
    return unsubscribe;
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
    fetchNetInfo();
    return {};
  }, [
    netInfo.isConnected,
    netInfo.netType,
    netInfo.netValue?.details?.cellularGeneration,
  ]);
  useEffect(() => {
    console.log("linkedURL3---", linkedURL);
  }, [linkedURL]);

  useEffect(() => {
    if (userIsOnboarded == true) {
      const obj = { key: "showDownloadPopup", value: true };
      dispatch(setInfoModalOpened(obj));
      const localnotiFlagObj = {
        generateFlag: true,
        generateType: "onAppStart",
        childuuid: "all",
      };
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
      getAllChildren(dispatch, child_age, 0);
    }
  }, [userIsOnboarded]);
  useEffect(() => {
    dispatch(setchatBotData([]));
    if (countryId == 1) {
      dispatch(oncountrtIdChange(appConfig.restOfTheWorldCountryId));
    }
    const notiFlagObj = { key: "generateNotifications", value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    //add notification condition in else if required 1st time as well
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
    fetchNetInfoSet();
  }, [netState]);
  const routeNameRef = React.useRef<any>();

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

  return (
    <SafeAreaProvider>
      {apiData && (
        <NavigationContainer
          ref={navigationRef}
          onReady={(): any => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          }}
          onStateChange={async (): Promise<any> => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName =
              navigationRef.current.getCurrentRoute().name;
            console.log(`Previous route: ${previousRouteName}`);
            console.log(`Current route: ${currentRouteName}`);
            if (previousRouteName !== currentRouteName) {
              await logAnalyticsEvent('screen_view', {
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
              const eventData = { name: currentRouteName + "_opened" };
              logEvent(eventData, netInfo.isConnected);
            }
            routeNameRef.current = currentRouteName;
          }}
        >
          <RootStack.Navigator
            initialRouteName={
              restartOnLangChange != "yes"
                ? userIsOnboarded == true
                  ? "HomeDrawerNavigator"
                  : allCountries?.length === 1 &&
                    allCountries[0]?.languages?.length === 1
                  ? "LoadingScreen"
                  : "Localization"
                : AppLayoutDirectionScreen
            }
            screenOptions={{
              animationEnabled: Platform.OS == "ios" ? true : false,
              headerShown: false,
              presentation: 'transparentModal'
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
              initialParams={{
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

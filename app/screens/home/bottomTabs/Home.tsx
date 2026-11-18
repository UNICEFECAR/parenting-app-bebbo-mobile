import {useCommittedRef} from "../../../customHooks/useCommittedRef";
import {useNavigationBackHandler} from "../../../customHooks/useNavigationBackHandler";
import {openMeasuredLink} from "../../../services/measuredLink";
import { scheduleIdleTask } from "../../../services/scheduleIdleTask";
import { SURVEY_SUBMIT } from "@assets/data/firebaseEvents";
import { appConfig } from "../../../instances";
import { getDataToStore } from "@assets/translations/appOfflineData/getDataToStore";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import AdviceAndArticles from "@components/homeScreen/AdviceAndArticles";
import BabyNotification from "@components/homeScreen/BabyNotification";
import ChildInfo from "@components/homeScreen/ChildInfo";
import ChildMilestones from "@components/homeScreen/ChildMilestones";
import DailyHomeNotification from "@components/homeScreen/DailyHomeNotification";
import DailyReads from "@components/homeScreen/DailyReads";
import PlayingTogether from "@components/homeScreen/PlayingTogether";
import Tools from "@components/homeScreen/Tools";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ButtonModal,
  ButtonTertiary,
  ButtonText,
  ButtonTextTheme,
} from "@components/shared/ButtonGlobal";
import { MainContainer } from "@components/shared/Container";
import { FDirRow, FlexCol, FlexDirRow } from "@components/shared/FlexBoxStyle";
import {
  FeatureDivideArea,
  HomeSurveyBox,
  OfflineBar,
} from "@components/shared/HomeScreenStyle";
import Icon, { OuterIconLeft, OuterIconRow } from "@components/shared/Icon";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import TabScreenHeader from "@components/TabScreenHeader";
import { articledata, VideoArticleData } from "../../../instances";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Heading1Centerr,
  Heading3Centerr,
  Heading3Regular,
  Heading4Center,
  ShiftFromTop10,
  ShiftFromTop20,
  ShiftFromTopBottom10,
  SideSpacing25,
} from "@styles/typography";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import HTML from "react-native-render-html";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../../App";
import useNetInfoHook from "../../../customHooks/useNetInfoHook";
import {
  VideoArticleEntity,
  VideoArticleEntitySchema,
} from "../../../database/schema/VideoArticleSchema";
import { setAllNotificationData } from "../../../redux/reducers/notificationSlice";
import {
  setAllVideoArticlesData,
  setAppVersion,
  setInfoModalOpened,
  setSyncDate,
  setuserIsOnboarded,
} from "../../../redux/reducers/utilsSlice";
import { fetchAPI } from "../../../redux/sagaMiddleware/sagaActions";
import { apiJsonDataGet } from "../../../services/childCRUD";
import commonApiService from "../../../services/commonApiService";
import { useAllPeriodicSyncData } from "../../../services/periodicSync";
import { addSpaceToHtml } from "../../../services/Utils";
import VersionInfo from "react-native-version-info";
import {
  ArticleEntity,
  ArticleEntitySchema,
} from "../../../database/schema/ArticleSchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { bgcolorWhite2 } from "@styles/style";
import { ToastAndroidLocal } from "../../../android/sharedAndroid.android";
import {synchronizeEvents} from '../../../services/EventSyncService';
import {
  selectLocale,
  selectUserIsOnboarded,
  selectErrorObj,
  selectShowDownloadPopup,
  selectLanguageCode,
  selectSurveyItem,
  selectIncrementalSyncDT,
  selectBufferAgeBracket,
  selectActiveChild,
  selectAppVersion,
} from "../../../services/selectors";
import QuickLinksRow from "@components/homeScreen/QuickLinksRow";
import CountryAppBanner from "@components/shared/CountryAppBanner";
const styles = StyleSheet.create({
  flexShrink1: { flexShrink: 1 },
  pressablePadding: {
    paddingLeft: 15,
    paddingVertical: 15,
  },
  scrollView: { backgroundColor: bgcolorWhite2, flex: 5 },
});

const Home = ({ route: _route, navigation }: any): any => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const headerTextColor = themeContext?.colors.PRIMARY_BLUE_TEXTCOLOR;
  const headerColorChildInfo = themeContext?.colors.CHILDDEVELOPMENT_COLOR;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [date1, setdate1] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [date2, setdate2] = useState<Date | null>(null);
  const [show2, setShow2] = useState(false);
  const { width } = useWindowDimensions();

  const dispatch = useAppDispatch();

  const locale = useAppSelector(selectLocale);
  const userIsOnboarded = useAppSelector(selectUserIsOnboarded);
  const appVersion = useAppSelector(selectAppVersion);
  const errorObj = useAppSelector(selectErrorObj);
  const showDownloadPopup = useAppSelector(selectShowDownloadPopup);
  const languageCode = useAppSelector(selectLanguageCode);
  const surveyItem = useAppSelector(selectSurveyItem);
  const incrementalSyncDT = useAppSelector(selectIncrementalSyncDT);
  const bufferAgeBracket = useAppSelector(selectBufferAgeBracket);
  const activeChild = useAppSelector(selectActiveChild);
  const flavor = process.env.FLAVOR || "bebbo";
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId
  );
  const hcuModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsHCUModalOpened
  );
  const vaccineModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsVaccineModalOpened
  );
  const backgroundColorChildInfo =
    themeContext?.colors.CHILDDEVELOPMENT_TINTCOLOR;

  const netInfo = useNetInfoHook();
  const lastBackPress = React.useRef(0);

  const {
    downloadWeeklyData,
    downloadMonthlyData,
    apiJsonData,
    downloadBufferData,
    ageBrackets,
  } = useAllPeriodicSyncData();
  const onBackPress = (): any => {
    const now = Date.now();
    if (now - lastBackPress.current < 2000) {
      lastBackPress.current = 0;
      BackHandler.exitApp();
    } else {
      lastBackPress.current = now;
      if (Platform.OS === "android") ToastAndroidLocal.show(t("backPressText"), 6000);
      else Alert.alert(t("backPressText"));
    }
    return true;
  };
  useNavigationBackHandler(navigation, onBackPress);
  const [profileLoading, setProfileLoading] = React.useState(false);

  const forceUpdateApis = (forceupdatetime: any): any => {
    navigation.navigate("LoadingScreen", {
      apiJsonData: appConfig.allApisObject(true, incrementalSyncDT),
      prevPage: "ForceUpdate",
      forceupdatetime: forceupdatetime,
    });
  };
  const downloadApis = (): any => {
    navigation.navigate("LoadingScreen", {
      apiJsonData: apiJsonData,
      prevPage: "PeriodicSync",
      downloadWeeklyData: downloadWeeklyData,
      downloadMonthlyData: downloadMonthlyData,
      downloadBufferData: downloadBufferData,
      ageBrackets: ageBrackets,
    });
  };
  const callFailedApis = (): any => {
    if (errorObj && errorObj.length > 0) {
      navigation.navigate("LoadingScreen", {
        apiJsonData: errorObj,
        prevPage: "Home",
      });
    }
  };
  // useEffect(() => {
  //   const start = Date.now();
  //   return () => {
  //     console.log(`${"Home"} mounted in ${Date.now() - start}ms`);
  //   };
  // }, []);

  const onNoForceUpdate = (): any => {
    if (
      netInfo.isConnected &&
      showDownloadPopup &&
      (downloadBufferData == true ||
        downloadWeeklyData == true ||
        downloadMonthlyData == true)
    ) {
      setTimeout(() => {
        Alert.alert(t("SyncOnLoadPopupTitle"), t("SyncOnLoadPopupText"), [
          {
            text: t("SyncOnLoadCancelPopUpBtn"),
            onPress: (): any => {
              dispatch(
                setInfoModalOpened({ key: "showDownloadPopup", value: false })
              );
            },
            style: "cancel",
          },
          { text: t("SyncOnLoadRetryBtn"), onPress: (): any => downloadApis() },
        ]);
      }, 2500);
    } else if (
      netInfo.isConnected &&
      showDownloadPopup &&
      errorObj.length > 0
    ) {
      setTimeout(() => {
        Alert.alert(
          t("downloadOnLoadPopupTitle"),
          t("downloadOnLoadPopupText"),
          [
            {
              text: t("downloadOnLoadCancelPopUpBtn"),
              onPress: (): any => {
                dispatch(
                  setInfoModalOpened({ key: "showDownloadPopup", value: false })
                );
              },
              style: "cancel",
            },
            {
              text: t("downloadOnLoadRetryBtn"),
              onPress: (): any => callFailedApis(),
            },
          ]
        );
      }, 2500);
    }
  };

  const forceUpdateData = [
    {
      apiEndpoint: appConfig.apiConfig.checkUpdate,
      method: "get",
      postdata: {},
      saveinDB: false,
    },
  ];
  const bebbodev = "1.4.4";
  const bebboprod = "1.1.4";
  const folejadev = "0.1.7";
  const folejaprod = "1.0.1";
  const relbebbodev = "1.4.10";
  const relbebboprod = "1.1.5";
  const relfolejadev = "0.2.0";
  const relfolejaprod = "1.1.0";

  // Run the mount-time version check once; state updates must not reopen its dialog.
  const startupHomeInputs = useCommittedRef(() => ({countryId, dispatch, flavor, hcuModalOpened, updateContentOnAppVersionChange, vaccineModalOpened}));
  useEffect(() => {
    const {countryId: inputCountryId, dispatch: inputDispatch, flavor: inputFlavor, hcuModalOpened: inputHcuModalOpened, updateContentOnAppVersionChange: inputUpdateContentOnAppVersionChange, vaccineModalOpened: inputVaccineModalOpened} = startupHomeInputs.current();

    const task = scheduleIdleTask(() => {
      inputUpdateContentOnAppVersionChange();

      const firstModalVisible = inputFlavor !== "bebbo" ? true : (inputCountryId == appConfig.restOfTheWorldCountryId) ? true : false
      console.log("home firstModalVisible--",firstModalVisible)
      if(inputVaccineModalOpened == true && firstModalVisible == false) {
        const obj = { key: "IsVaccineModalOpened", value: false };
        inputDispatch(setInfoModalOpened(obj));
      }
      if(inputHcuModalOpened == true && firstModalVisible == false) {
        const obj = { key: "IsHCUModalOpened", value: false };
        inputDispatch(setInfoModalOpened(obj));
      }
    });

    return () => task.cancel();
  }, [startupHomeInputs]);

  const updateContentOnAppVersionChange = async () => {
    if (VersionInfo.appVersion > appVersion || appVersion === "") {
      const apiresponse = await commonApiService(
        forceUpdateData[0].apiEndpoint,
        forceUpdateData[0].method,
        forceUpdateData[0].postdata
      );
      const forceUpdateTime =
        apiresponse && apiresponse.data && apiresponse.data.updated_at
          ? apiresponse.data.updated_at
          : "0";
      AsyncStorage.setItem("forceUpdateTime", forceUpdateTime);
      Alert.alert(t("forceUpdatePopupTitle"), t("forceUpdatePopupText"), [
        {
          text: t("forceUpdateOkBtn"),
          onPress: (): any => {
            dispatch(setAppVersion(VersionInfo.appVersion));
            navigation.navigate("LoadingScreen", {
              apiJsonData: appConfig.allApisObject(false, incrementalSyncDT),
              prevPage: "CountryLangChange",
            });
          },
        },
      ]);
    }
  };

  const initialSyncConnection = useCommittedRef(() => netInfo.isConnected);
  // AppNavigation handles reconnects; this is only the existing Home mount flush.
  useLayoutEffect(() => {
    const task = scheduleIdleTask(() => {
      const connected = initialSyncConnection.current();
      if (connected) synchronizeEvents(connected);
    });
    return () => task.cancel();
  }, [initialSyncConnection]);
  // Only existing refresh triggers start this check; profile/telemetry writes are not downloads.
  const downloadInputs = useCommittedRef(() => ({activeChild, bufferAgeBracket, dispatch, forceUpdateApis, forceUpdateData, incrementalSyncDT, languageCode, navigation, onNoForceUpdate, showDownloadPopup, t, userIsOnboarded}));
  useEffect(() => {
    const {activeChild: inputActiveChild, bufferAgeBracket: inputBufferAgeBracket, dispatch: inputDispatch, forceUpdateApis: inputForceUpdateApis, forceUpdateData: inputForceUpdateData, incrementalSyncDT: inputIncrementalSyncDT, languageCode: inputLanguageCode, navigation: inputNavigation, onNoForceUpdate: inputOnNoForceUpdate, showDownloadPopup: inputShowDownloadPopup, t: inputT, userIsOnboarded: inputUserIsOnboarded} = downloadInputs.current();

    // setModalVisible(false);
    async function fetchNetInfo(): Promise<any> {
      console.log(inputBufferAgeBracket, "---userIsOnboarded----", inputUserIsOnboarded);
      console.log(
        VersionInfo.appVersion,
        "--appVersion",
        VersionInfo.buildVersion,
        VersionInfo.bundleIdentifier
      );
      if (inputUserIsOnboarded == false) {
        console.log("--in iffffff--");
        inputDispatch(setuserIsOnboarded(true));
        const currentDate = DateTime.now().toMillis();
        inputDispatch(setSyncDate({ key: "userOnboardedDate", value: currentDate }));
        inputDispatch(
          setSyncDate({ key: "weeklyDownloadDate", value: currentDate })
        );
        inputDispatch(
          setSyncDate({ key: "monthlyDownloadDate", value: currentDate })
        );
        const obj = { key: "showDownloadPopup", value: false };
        inputDispatch(setInfoModalOpened(obj));
        const apiresponse = await commonApiService(
          inputForceUpdateData[0].apiEndpoint,
          inputForceUpdateData[0].method,
          inputForceUpdateData[0].postdata
        );
        const forceUpdateTime =
          apiresponse && apiresponse.data && apiresponse.data.updated_at
            ? apiresponse.data.updated_at
            : "0";
        AsyncStorage.setItem("forceUpdateTime", forceUpdateTime);
      } else {
        const isVideoArticleUpdateReq = await AsyncStorage.getItem(
          "isVideoArticleUpdateReq"
        );
        const isRelatedVideoArticleUpdateReq = await AsyncStorage.getItem(
          "isRelatedVideoArticleUpdateReq"
        );
        if (netInfo.isConnected && inputShowDownloadPopup) {
          if (
            isVideoArticleUpdateReq == null ||
            isVideoArticleUpdateReq == undefined ||
            isVideoArticleUpdateReq == "true"
          ) {
            const apiJsonDatavideoart = [
              {
                apiEndpoint: appConfig.apiConfig.videoArticles,
                method: "get",
                postdata: {},
                saveinDB: true,
              },
            ];
            console.log(
              "in if isVideoArticleUpdateReq---",
              isVideoArticleUpdateReq
            );
            if (
              VersionInfo.appVersion > bebbodev &&
              VersionInfo.bundleIdentifier == "com.datamatics.bebbo"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            } else if (
              VersionInfo.appVersion > bebboprod &&
              VersionInfo.bundleIdentifier == "org.unicef.ecar.bebbo"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            } else if (
              VersionInfo.appVersion > folejadev &&
              VersionInfo.bundleIdentifier == "com.datamatics.foleja"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            } else if (
              VersionInfo.appVersion > folejaprod &&
              VersionInfo.bundleIdentifier == "org.unicef.kosovo.foleja"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            }
          }

          if (
            isRelatedVideoArticleUpdateReq == null ||
            isRelatedVideoArticleUpdateReq == undefined ||
            isRelatedVideoArticleUpdateReq == "true"
          ) {
            const apiJsonDatarelatedvideoart = [];
            const apiJsonDataarticleall = apiJsonDataGet("all");
            if (apiJsonDataarticleall.length > 0) {
              apiJsonDatarelatedvideoart.push(apiJsonDataarticleall[0]);
            }
            console.log(
              apiJsonDatarelatedvideoart,
              "in if isRelatedVideoArticleUpdateReq---",
              isRelatedVideoArticleUpdateReq
            );
            if (
              VersionInfo.appVersion > relbebbodev &&
              VersionInfo.bundleIdentifier == "com.datamatics.bebbo"
            ) {
              console.log("in if");
              inputDispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              inputDispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              inputDispatch(setInfoModalOpened(notiFlagObj));
            } else if (
              VersionInfo.appVersion > relbebboprod &&
              VersionInfo.bundleIdentifier == "org.unicef.ecar.bebbo"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              inputDispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              inputDispatch(setInfoModalOpened(notiFlagObj));
            } else if (
              VersionInfo.appVersion > relfolejadev &&
              VersionInfo.bundleIdentifier == "com.datamatics.foleja"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              inputDispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              inputDispatch(setInfoModalOpened(notiFlagObj));
            } else if (
              VersionInfo.appVersion > relfolejaprod &&
              VersionInfo.bundleIdentifier == "org.unicef.kosovo.foleja"
            ) {
              inputDispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  inputDispatch,
                  inputNavigation,
                  inputLanguageCode,
                  inputActiveChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              inputDispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              inputDispatch(setInfoModalOpened(notiFlagObj));
            }
          }
        } else {
          console.log(
            isRelatedVideoArticleUpdateReq,
            "in else isVideoArticleUpdateReq---",
            isVideoArticleUpdateReq
          );
          if (
            inputShowDownloadPopup &&
            (isVideoArticleUpdateReq == null ||
              isVideoArticleUpdateReq == undefined ||
              isVideoArticleUpdateReq == "true")
          ) {
            let Entity: any;
            await getDataToStore(
              inputLanguageCode,
              inputDispatch,
              VideoArticleEntitySchema,
              Entity as VideoArticleEntity,
              VideoArticleData,
              setAllVideoArticlesData
            );
          }
          if (
            inputShowDownloadPopup &&
            (isRelatedVideoArticleUpdateReq == null ||
              isRelatedVideoArticleUpdateReq == undefined ||
              isRelatedVideoArticleUpdateReq == "true")
          ) {
            let Entity: any;
            const currentChildData = {
              gender: inputActiveChild.gender,
              parent_gender: inputActiveChild.parent_gender,
              taxonomyData: inputActiveChild.taxonomyData,
            };
            await getDataToStore(
              inputLanguageCode,
              inputDispatch,
              ArticleEntitySchema,
              Entity as ArticleEntity,
              articledata,
              setAllArticleData,
              "",
              currentChildData
            );
          }
        }

        if (netInfo.isConnected && inputShowDownloadPopup) {
          const apiJsonDatasurvey = [
            {
              apiEndpoint: appConfig.apiConfig.surveys,
              method: "get",
              postdata: {},
              saveinDB: true,
            },
          ];
          inputDispatch(
            fetchAPI(
              apiJsonDatasurvey,
              "Survey",
              inputDispatch,
              inputNavigation,
              inputLanguageCode,
              inputActiveChild,
              apiJsonDatasurvey,
              netInfo.isConnected
            )
          );
          const forceUpdateTime = await AsyncStorage.getItem("forceUpdateTime");
          if (forceUpdateTime == null || forceUpdateTime == undefined) {
            inputDispatch(
              setInfoModalOpened({ key: "showDownloadPopup", value: false })
            );
            Alert.alert(inputT("forceUpdatePopupTitle"), inputT("forceUpdatePopupText"), [
              {
                text: inputT("forceUpdateOkBtn"),
                onPress: (): any => {
                  inputNavigation.navigate("LoadingScreen", {
                    apiJsonData: appConfig.allApisObject(
                      false,
                      inputIncrementalSyncDT
                    ),
                    prevPage: "CountryLangChange",
                  });
                },
              },
            ]);
          } else {
            const apiresponse = await commonApiService(
              inputForceUpdateData[0].apiEndpoint,
              inputForceUpdateData[0].method,
              inputForceUpdateData[0].postdata
            );
            let forceUpdateTime = await AsyncStorage.getItem("forceUpdateTime");
            forceUpdateTime = forceUpdateTime ? forceUpdateTime : "0";
            if (apiresponse.data.status == 200) {
              if (apiresponse.data.flag == 1) {
                if (
                  parseInt(apiresponse.data.updated_at) >
                  parseInt(forceUpdateTime)
                ) {
                  Alert.alert(
                    inputT("forceUpdatePopupTitle"),
                    inputT("forceUpdatePopupText"),
                    [
                      {
                        text: inputT("forceUpdateOkBtn"),
                        onPress: (): any => {
                          inputDispatch(
                            setInfoModalOpened({
                              key: "showDownloadPopup",
                              value: false,
                            })
                          );
                          inputForceUpdateApis(apiresponse.data.updated_at);
                        },
                      },
                    ]
                  );
                } else {
                  inputOnNoForceUpdate();
                }
              } else {
                inputOnNoForceUpdate();
              }
            } else {
              inputOnNoForceUpdate();
            }
          }
        }
      }
    }
    const task = scheduleIdleTask(() => {
      if (Platform.OS == "ios") {
        if (netInfo.isConnected != null) {
          fetchNetInfo();
        }
      } else {
        fetchNetInfo();
      }
    });

    return () => task.cancel();
  }, [netInfo.isConnected, downloadInputs]);
  const ondobChange = (event: any, selectedDate: any): any => {
    setShow(Platform.OS === "ios");
    setdate1(selectedDate);
    dispatch(
      setSyncDate({
        key: "weeklyDownloadDate",
        value: DateTime.fromJSDate(new Date(selectedDate)).toMillis(),
      })
    );
  };
  const ondobChange2 = (event: any, selectedDate: any): any => {
    setShow2(Platform.OS === "ios");
    setdate2(selectedDate);

    dispatch(
      setSyncDate({
        key: "monthlyDownloadDate",
        value: DateTime.fromJSDate(new Date(selectedDate)).toMillis(),
      })
    );
  };

  return (
    <>
      <>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <TabScreenHeader
          title={t("homeScreenheaderTitle")}
          headerColor={headerColor}
          textColor={headerTextColor}
          setProfileLoading={setProfileLoading}
        />
        <CountryAppBanner countryId={countryId} />
        {netInfo && netInfo.isConnected == false ? (
          <OfflineBar>
            <Heading3Centerr>{t("noInternet")}</Heading3Centerr>
          </OfflineBar>
        ) : null}
        <ScrollView style={styles.scrollView}>
          <FlexCol>
            <BabyNotification />

            {show && (
              <DateTimePicker
                testID="dobdatePicker"
                dateFormat={"day month year"}
                value={date1 != null || date1 != undefined ? date1 : new Date()}
                locale={locale}
                mode={"date"}
                display="spinner"
                onChange={ondobChange}
              />
            )}

            {show2 && (
              <DateTimePicker
                testID="dobdatePicker"
                dateFormat={"day month year"}
                value={date2 != null || date2 != undefined ? date2 : new Date()}
                locale={locale}
                mode={"date"}
                display="spinner"
                onChange={ondobChange2}
              />
            )}
            <DailyReads />
            <FeatureDivideArea>
              <DailyHomeNotification />
            </FeatureDivideArea>
            <ShiftFromTop10>
              <ChildInfo
                headerColor={headerColorChildInfo}
                backgroundColor={backgroundColorChildInfo}
              />
            </ShiftFromTop10>
            <QuickLinksRow />
            <ChildMilestones />
            <PlayingTogether />
            <AdviceAndArticles />
            <Tools />
            <FlexCol>
              <MainContainer>
                <ShiftFromTopBottom10>
                  <HomeSurveyBox>
                    <FlexDirRow>
                      <OuterIconRow>
                        <OuterIconLeft>
                          <Icon name="ic_survey" size={24} color="#000" />
                        </OuterIconLeft>
                      </OuterIconRow>
                      <Heading3Regular style={styles.flexShrink1}>
                        {t("homeScreenexpText")}
                      </Heading3Regular>
                    </FlexDirRow>
                    <ShiftFromTop20>
                      <SideSpacing25>
                        <ButtonTertiary
                          onPress={(): any => {
                            setModalVisible(true);
                          }}
                        >
                          <ButtonText numberOfLines={2}>
                            {t("homeScreenexpBtnText")}
                          </ButtonText>
                        </ButtonTertiary>
                      </SideSpacing25>
                    </ShiftFromTop20>
                  </HomeSurveyBox>
                </ShiftFromTopBottom10>
              </MainContainer>
            </FlexCol>
          </FlexCol>
        </ScrollView>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={(): any => {
            setModalVisible(false);
          }}
          onDismiss={(): any => {
            setModalVisible(false);
          }}
        >
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={(): any => {
                    setModalVisible(false);
                  }}
                >
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              {surveyItem ? (
                <>
                  <ModalPopupContent>
                    <Heading1Centerr>{surveyItem?.title}</Heading1Centerr>

                    {surveyItem && surveyItem?.body ? (
                      <HTML
                        contentWidth={width}
                        source={{ html: addSpaceToHtml(surveyItem?.body) }}
                        ignoredStyles={["color", "fontSize", "fontFamily"]}
                      />
                    ) : null}
                  </ModalPopupContent>
                  <FDirRow>
                    <ButtonModal
                      onPress={async (): Promise<void> => {
                        setModalVisible(false);
                        if (!(await openMeasuredLink(surveyItem?.survey_feedback_link, SURVEY_SUBMIT))) Alert.alert("", t("generalError"));
                      }}
                    >
                      <ButtonTextTheme numberOfLines={2}>
                        {t("continueInModal")}
                      </ButtonTextTheme>
                    </ButtonModal>
                  </FDirRow>
                </>
              ) : (
                <Heading4Center>{t("noDataTxt")}</Heading4Center>
              )}
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        <OverlayLoadingComponent loading={profileLoading} />
      </>
    </>
  );
};
export default React.memo(Home);

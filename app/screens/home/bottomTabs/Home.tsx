import { SURVEY_SUBMIT } from "@assets/data/firebaseEvents";
import { appConfig } from "../../../instance";
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
import { articledata, VideoArticleData } from "../../../instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Heading1Centerr,
  Heading3Centerr,
  Heading3Regular,
  Heading4Center,
  ShiftFromTop20,
  ShiftFromTop25,
  ShiftFromTopBottom10,
  SideSpacing25,
} from "@styles/typography";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { InteractionManager } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
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
  setInfoModalOpened,
  setSyncDate,
  setuserIsOnboarded,
} from "../../../redux/reducers/utilsSlice";
import { fetchAPI } from "../../../redux/sagaMiddleware/sagaActions";
import {
  apiJsonDataGet,
  getAllChildren,
  getAllConfigData,
  setActiveChild,
} from "../../../services/childCRUD";
import commonApiService from "../../../services/commonApiService";
import { getAllPeriodicSyncData } from "../../../services/periodicSync";
import { addSpaceToHtml, getLanguageCode } from "../../../services/Utils";
import VersionInfo from "react-native-version-info";
import {
  ArticleEntity,
  ArticleEntitySchema,
} from "../../../database/schema/ArticleSchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { bgcolorWhite2 } from "@styles/style";
import { ToastAndroidLocal } from "../../../android/sharedAndroid.android";
import {
  logEvent,
  synchronizeEvents,
} from "../../../services/EventSyncService";
import { useIsFocused } from "@react-navigation/native";

const styles = StyleSheet.create({
  flexShrink1: { flexShrink: 1 },
  pressablePadding: {
    paddingLeft: 15,
    paddingVertical: 15,
  },
  scrollView: { backgroundColor: bgcolorWhite2, flex: 5 },
});
import {
  selectLocale,
  selectTaxonomyIds,
  selectUserIsOnboarded,
  selectErrorObj,
  selectShowDownloadPopup,
  selectLanguageCode,
  selectSurveyItem,
  selectIncrementalSyncDT,
  selectBufferAgeBracket,
  selectActiveChild,
} from "../../../services/selectors";
const Home = ({ route, navigation }: any): any => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const headerColorChildInfo = themeContext?.colors.CHILDDEVELOPMENT_COLOR;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [date1, setdate1] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [date2, setdate2] = useState<Date | null>(null);
  const [show2, setShow2] = useState(false);

  // const childAge = useAppSelector((state: any) =>
  //   state.utilsData.taxonomy.allTaxonomyData != ""
  //     ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
  //     : []
  // );
  // const allCountries = useAppSelector((state: any) => {
  //   try {
  //     return state.selectedCountry?.countries !== ""
  //       ? JSON.parse(state.selectedCountry?.countries)
  //       : [];
  //   } catch (error) {
  //     console.error("Failed to parse countries JSON:", error);
  //     return [];
  //   }
  // });
  const dispatch = useAppDispatch();

  const locale = useAppSelector(selectLocale);
  const taxonomyIds = useAppSelector(selectTaxonomyIds);
  const userIsOnboarded = useAppSelector(selectUserIsOnboarded);
  const errorObj = useAppSelector(selectErrorObj);
  const showDownloadPopup = useAppSelector(selectShowDownloadPopup);
  const languageCode = useAppSelector(selectLanguageCode);
  const surveyItem = useAppSelector(selectSurveyItem);
  const incrementalSyncDT = useAppSelector(selectIncrementalSyncDT);
  const bufferAgeBracket = useAppSelector(selectBufferAgeBracket);
  const activeChild = useAppSelector(selectActiveChild);

  const backgroundColorChildInfo =
    themeContext?.colors.CHILDDEVELOPMENT_TINTCOLOR;

  const netInfo = useNetInfoHook();
  let currentCount = 0;
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  const {
    downloadWeeklyData,
    downloadMonthlyData,
    apiJsonData,
    downloadBufferData,
    ageBrackets,
  } = getAllPeriodicSyncData();
  const onBackPress = (): any => {
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
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    navigation.addListener("gestureEnd", onBackPress);
    return (): any => {
      navigation.removeListener("gestureEnd", onBackPress);
      backHandler.remove();
    };
  }, []);
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
  useEffect(() => {
    // setActiveChild(
    //   languageCode,
    //   activeChild.uuid,
    //   dispatch,
    //   childAge,
    //   true,
    //   taxonomyIds?.boyChildGender
    // );
    // getAllChildren(dispatch, childAge, 0);
    // getAllConfigData(dispatch);
  }, []);

  useLayoutEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (netInfo.isConnected) {
          synchronizeEvents(netInfo.isConnected);
        }

        // Expensive task
      });

      return () => task.cancel();
    }, [])
  );
  useEffect(() => {
    // setModalVisible(false);
    async function fetchNetInfo(): Promise<any> {
      console.log(bufferAgeBracket, "---userIsOnboarded----", userIsOnboarded);
      console.log(
        VersionInfo.appVersion,
        "--appVersion",
        VersionInfo.buildVersion,
        VersionInfo.bundleIdentifier
      );
      if (userIsOnboarded == false) {
        console.log("--in iffffff--");
        dispatch(setuserIsOnboarded(true));
        const currentDate = DateTime.now().toMillis();
        dispatch(setSyncDate({ key: "userOnboardedDate", value: currentDate }));
        dispatch(
          setSyncDate({ key: "weeklyDownloadDate", value: currentDate })
        );
        dispatch(
          setSyncDate({ key: "monthlyDownloadDate", value: currentDate })
        );
        const obj = { key: "showDownloadPopup", value: false };
        dispatch(setInfoModalOpened(obj));
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
        console.log(forceUpdateTime, "forceupdate apiresponse2", apiresponse);
      } else {
        const isVideoArticleUpdateReq = await AsyncStorage.getItem(
          "isVideoArticleUpdateReq"
        );
        const isRelatedVideoArticleUpdateReq = await AsyncStorage.getItem(
          "isRelatedVideoArticleUpdateReq"
        );
        if (netInfo.isConnected && showDownloadPopup) {
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
              dispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            } else if (
              VersionInfo.appVersion > bebboprod &&
              VersionInfo.bundleIdentifier == "org.unicef.ecar.bebbo"
            ) {
              dispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            } else if (
              VersionInfo.appVersion > folejadev &&
              VersionInfo.bundleIdentifier == "com.datamatics.foleja"
            ) {
              dispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatavideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isVideoArticleUpdateReq", "false");
            } else if (
              VersionInfo.appVersion > folejaprod &&
              VersionInfo.bundleIdentifier == "org.unicef.kosovo.foleja"
            ) {
              dispatch(
                fetchAPI(
                  apiJsonDatavideoart,
                  "VideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
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
              dispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              dispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              dispatch(setInfoModalOpened(notiFlagObj));
            } else if (
              VersionInfo.appVersion > relbebboprod &&
              VersionInfo.bundleIdentifier == "org.unicef.ecar.bebbo"
            ) {
              dispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              dispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              dispatch(setInfoModalOpened(notiFlagObj));
            } else if (
              VersionInfo.appVersion > relfolejadev &&
              VersionInfo.bundleIdentifier == "com.datamatics.foleja"
            ) {
              dispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              dispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              dispatch(setInfoModalOpened(notiFlagObj));
            } else if (
              VersionInfo.appVersion > relfolejaprod &&
              VersionInfo.bundleIdentifier == "org.unicef.kosovo.foleja"
            ) {
              dispatch(
                fetchAPI(
                  apiJsonDatarelatedvideoart,
                  "RelatedVideoArticle",
                  dispatch,
                  navigation,
                  languageCode,
                  activeChild,
                  apiJsonDatarelatedvideoart,
                  netInfo.isConnected
                )
              );
              AsyncStorage.setItem("isRelatedVideoArticleUpdateReq", "false");
              dispatch(setAllNotificationData([]));
              const notiFlagObj = { key: "generateNotifications", value: true };
              dispatch(setInfoModalOpened(notiFlagObj));
            }
          }
        } else {
          console.log(
            isRelatedVideoArticleUpdateReq,
            "in else isVideoArticleUpdateReq---",
            isVideoArticleUpdateReq
          );
          if (
            showDownloadPopup &&
            (isVideoArticleUpdateReq == null ||
              isVideoArticleUpdateReq == undefined ||
              isVideoArticleUpdateReq == "true")
          ) {
            let Entity: any;
            await getDataToStore(
              languageCode,
              dispatch,
              VideoArticleEntitySchema,
              Entity as VideoArticleEntity,
              VideoArticleData,
              setAllVideoArticlesData
            );
          }
          if (
            showDownloadPopup &&
            (isRelatedVideoArticleUpdateReq == null ||
              isRelatedVideoArticleUpdateReq == undefined ||
              isRelatedVideoArticleUpdateReq == "true")
          ) {
            let Entity: any;
            const currentChildData = {
              gender: activeChild.gender,
              parent_gender: activeChild.parent_gender,
              taxonomyData: activeChild.taxonomyData,
            };
            await getDataToStore(
              languageCode,
              dispatch,
              ArticleEntitySchema,
              Entity as ArticleEntity,
              articledata,
              setAllArticleData,
              "",
              currentChildData
            );
          }
        }

        if (netInfo.isConnected && showDownloadPopup) {
          const apiJsonDatasurvey = [
            {
              apiEndpoint: appConfig.apiConfig.surveys,
              method: "get",
              postdata: {},
              saveinDB: true,
            },
          ];
          dispatch(
            fetchAPI(
              apiJsonDatasurvey,
              "Survey",
              dispatch,
              navigation,
              languageCode,
              activeChild,
              apiJsonDatasurvey,
              netInfo.isConnected
            )
          );
          const forceUpdateTime = await AsyncStorage.getItem("forceUpdateTime");
          if (forceUpdateTime == null || forceUpdateTime == undefined) {
            dispatch(
              setInfoModalOpened({ key: "showDownloadPopup", value: false })
            );
            Alert.alert(t("forceUpdatePopupTitle"), t("forceUpdatePopupText"), [
              {
                text: t("forceUpdateOkBtn"),
                onPress: (): any => {
                  navigation.navigate("LoadingScreen", {
                    apiJsonData: appConfig.allApisObject(
                      false,
                      incrementalSyncDT
                    ),
                    prevPage: "CountryLangChange",
                  });
                },
              },
            ]);
          } else {
            const apiresponse = await commonApiService(
              forceUpdateData[0].apiEndpoint,
              forceUpdateData[0].method,
              forceUpdateData[0].postdata
            );
            console.log("forceupdate apiresponse2", apiresponse);
            let forceUpdateTime = await AsyncStorage.getItem("forceUpdateTime");
            forceUpdateTime = forceUpdateTime ? forceUpdateTime : "0";
            //Alert.alert("--forceUpdateTime--",String(forceUpdateTime));
            if (apiresponse.data.status == 200) {
              if (apiresponse.data.flag == 1) {
                if (
                  parseInt(apiresponse.data.updated_at) >
                  parseInt(forceUpdateTime)
                ) {
                  Alert.alert(
                    t("forceUpdatePopupTitle"),
                    t("forceUpdatePopupText"),
                    [
                      {
                        text: t("forceUpdateOkBtn"),
                        onPress: (): any => {
                          dispatch(
                            setInfoModalOpened({
                              key: "showDownloadPopup",
                              value: false,
                            })
                          );
                          forceUpdateApis(apiresponse.data.updated_at);
                        },
                      },
                    ]
                  );
                } else {
                  onNoForceUpdate();
                }
              } else {
                onNoForceUpdate();
              }
            } else {
              onNoForceUpdate();
            }
          }
        }
      }
    }
    if (Platform.OS == "ios") {
      if (netInfo.isConnected != null) {
        fetchNetInfo();
      }
    } else {
      fetchNetInfo();
    }
  }, [netInfo.isConnected]);
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
          textColor="#FFF"
          setProfileLoading={setProfileLoading}
        />

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
            <ShiftFromTop25>
              <ChildInfo
                headerColor={headerColorChildInfo}
                backgroundColor={backgroundColorChildInfo}
              />
            </ShiftFromTop25>
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
                        source={{ html: addSpaceToHtml(surveyItem?.body) }}
                        ignoredStyles={["color", "fontSize", "fontFamily"]}
                      />
                    ) : null}
                  </ModalPopupContent>
                  <FDirRow>
                    <ButtonModal
                      onPress={(): any => {
                        setModalVisible(false);
                        logEvent({ name: SURVEY_SUBMIT }, netInfo.isConnected);

                        Linking.openURL(surveyItem?.survey_feedback_link);
                      }}
                    >
                      <ButtonText numberOfLines={2}>
                        {t("continueInModal")}
                      </ButtonText>
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
export default Home;

import {
  DEVELOPMENT_NOTIFICATION_OFF,
  DEVELOPMENT_NOTIFICATION_ON,
  GROWTH_NOTIFICATION_OFF,
  GROWTH_NOTIFICATION_ON,
  VACCINE_HEALTHCHECKUP_NOTIFICATION_OFF,
  VACCINE_HEALTHCHECKUP_NOTIFICATION_ON,
} from "@assets/data/firebaseEvents";
// import { allApisObject, appConfig, tempbackUpPath, tempRealmFile } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from "../../instances";

import AlertModal from "@components/AlertModal";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ButtonModal,
  ButtonPrimary,
  ButtonText,
  ButtonTextTheme,
} from "@components/shared/ButtonGlobal";
import Checkbox, {
  CheckboxActive,
  CheckboxItem,
} from "@components/shared/CheckboxStyle";
import { FormOuterCheckbox } from "@components/shared/ChildSetupStyle";
import { BannerContainer, MainContainer } from "@components/shared/Container";
import {
  FDirRow,
  FDirRowStart,
  Flex2,
  Flex3,
  FlexDirRowSpace,
} from "@components/shared/FlexBoxStyle";
import Icon, { IconAreaPress } from "@components/shared/Icon";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import {
  SettingHeading,
  SettingOptions,
  SettingShareData,
  ToggleLabelText,
  ToggleLabelText1,
} from "@components/shared/SettingsStyle";
import TabScreenHeader from "@components/TabScreenHeader";
import { HomeDrawerNavigatorStackParamList } from "@navigation/types";
import {
  DrawerActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading1,
  Heading3,
  Heading3Regular,
  Heading4,
  Heading4Centerr,
  Heading4Regular,
  Heading6,
  ShiftFromBottom10,
  ShiftFromTop10,
  ShiftFromTopBottom10,
  ShiftFromTopBottom5,
  SideSpacing10,
} from "@styles/typography";
import { DateTime } from "luxon";
import React, {
  createRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import DocumentPicker, { isErrorWithCode, errorCodes, pick } from "@react-native-documents/picker";
import RNFS from "react-native-fs";
import { Switch } from "react-native-gesture-handler";
import VectorImage from "react-native-vector-image";
import { ThemeContext } from "styled-components/native";
import { store, useAppDispatch, useAppSelector } from "../../../App";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { userRealmCommon } from "../../database/dbquery/userRealmCommon";
import { onNetworkStateChange } from "../../redux/reducers/bandwidthSlice";
import {
  setAllLocalNotificationGenerateType,
  setAllNotificationData,
  setAllScheduledLocalNotificationData,
  toggleNotificationFlags,
} from "../../redux/reducers/notificationSlice";
import { backup } from "../../services/backup";
import {
  getAllChildren,
  isFutureDate,
  isFutureDateTime,
} from "../../services/childCRUD";
import { formatStringDate, formatStringTime } from "../../services/Utils";
import * as ScopedStorage from "react-native-scoped-storage";
import Share from "react-native-share";
import LocalNotifications from "../../services/LocalNotifications";
import { bgcolorWhite2, settingThumbFalseColor, settingTrackFalseColor, settingTrackTrueColor } from "@styles/style";
import { logEvent } from "../../services/EventSyncService";
import AesCrypto from "react-native-aes-crypto";
import { encryptionsIVKey, encryptionsKey } from "react-native-dotenv";
import { fetchAPI } from "../../redux/sagaMiddleware/sagaActions";
import {
  selectActiveChild,
  selectAllCountries,
  selectAllDataDownloadFlag,
  selectChildAge,
  selectChildGenders,
  selectCountryId,
  selectDevelopmentEnabledFlag,
  selectGrowthEnabledFlag,
  selectIncrementalSyncDT,
  selectLanguageCode,
  selectLocalNotifications,
  selectLowBandwidth,
  selectMonthlyDownloadDate,
  selectScheduledLocalNotifications,
  selectTaxonomyIds,
  selectVchcEnabledFlag,
  selectWeeklyDownloadDate,
} from "../../services/selectors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};
type localizationType = {
  name: string;
  displayName: string;
  countryId: number;
  languages: {
    name: string;
    displayName: string;
    languageCode: string;
    locale: string;
  };
};
const styles = StyleSheet.create({
  bgColorWhite: { backgroundColor: bgcolorWhite2 },
  borderWidth1: { borderWidth: 1 },
  flex1: { flex: 1 },
});
const SettingScreen = (props: any): any => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext?.colors?.PRIMARY_COLOR;
  const trackTrueColor = settingTrackTrueColor;
  const headerTextColor = themeContext?.colors.PRIMARY_BLUE_TEXTCOLOR;
  const trackFalseColor = settingTrackFalseColor;
  const thumbTrueColor = primaryColor;
  const thumbFalseColor = settingThumbFalseColor;
  const dispatch = useAppDispatch();
  const growthEnabledFlag = useAppSelector(selectGrowthEnabledFlag);
  const developmentEnabledFlag = useAppSelector(selectDevelopmentEnabledFlag);
  const vchcEnabledFlag = useAppSelector(selectVchcEnabledFlag);
  const genders = useAppSelector(selectChildGenders);
  const toggleSwitchVal = useAppSelector(selectLowBandwidth);
  const activeChild = useAppSelector(selectActiveChild);
  const taxonomyIds = useAppSelector(selectTaxonomyIds);

  const allDataDownloadFlag = useAppSelector(selectAllDataDownloadFlag);
  const localNotifications = useAppSelector(selectLocalNotifications);
  const scheduledlocalNotifications = useAppSelector(
    selectScheduledLocalNotifications
  );
  const countryId = useAppSelector(selectCountryId);
  const allCountries = useAppSelector(selectAllCountries);
  const weeklyDownloadDate = useAppSelector(selectWeeklyDownloadDate);
  const monthlyDownloadDate = useAppSelector(selectMonthlyDownloadDate);
  const incrementalSyncDT = useAppSelector(selectIncrementalSyncDT);
  const childAge = useAppSelector(selectChildAge);
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isImportRunning, setIsImportRunning] = useState(false);
  const [isExportAlertVisible, setExportAlertVisible] = useState(false);
  const [isImportAlertVisible, setImportAlertVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState<any>("");
  const [language, setlanguage] = useState<any>("");
  const navigation = useNavigation<any>();
  const actionSheetRef = createRef<any>();
  const actionSheetRefImport = createRef<any>();

  const [profileLoading, setProfileLoading] = React.useState(false);
  const languageCode = useAppSelector(selectLanguageCode);

  const netInfo = useNetInfoHook();
  const insets = useSafeAreaInsets();
  const lastUpdatedDate =
    weeklyDownloadDate < monthlyDownloadDate
      ? weeklyDownloadDate
      : monthlyDownloadDate;

  useLayoutEffect(() => {
    navigation.closeDrawer();
  }, []);

  const importAllData = async (): Promise<any> => {
    setIsImportRunning(true);
    await backup.import(
      props.navigation,
      languageCode,
      dispatch,
      childAge,
      genders,
      taxonomyIds
    );
    setIsImportRunning(false);
    actionSheetRefImport.current?.setModalVisible(false);
  };

  const encryptData = (text: string, key: any): any => {
    console.log(
      text,
      "..text,key,encryptionsIVKey..",
      encryptionsIVKey.replace("//:completeSettings = none", "")
    );
    return AesCrypto.encrypt(
      text,
      key,
      encryptionsIVKey.replace("//:completeSettings = none", ""),
      "aes-256-cbc"
    )
      .then((cipher: any) => ({
        cipher,
      }))
      .catch((error: any) => {
        console.log(error, "..error..");
        setIsExportRunning(false);
      });
  };
  const decryptData = (text: string, key: any): any => {
    console.log(encryptionsIVKey);
    return AesCrypto.decrypt(
      text,
      key,
      encryptionsIVKey.replace("//:completeSettings = none", ""),
      "aes-256-cbc"
    ).catch((error: any) => {
      console.log(error, "..error..");
      setIsImportRunning(false);
    });
  };
  const exportDataAndroid = async (cipher: string): Promise<any> => {
    // const file = await ScopedStorage.openDocumentTree(true);
    const uri: any = await ScopedStorage.getPersistedUriPermissions();
    try {
      // const fileDownload: any = await ScopedStorage.writeFile(file.uri,JSON.stringify(cipher), "mybackup.json", "*/*", 'utf8', false);
      const fileDownload: any = await ScopedStorage.createDocument(
        "mybackup",
        "application/json",
        JSON.stringify(cipher),
        "utf8"
      );
      const uri1: any = await ScopedStorage.getPersistedUriPermissions();

      if (
        fileDownload != "" &&
        fileDownload != null &&
        fileDownload != undefined
      ) {
        Alert.alert("", t("settingExportSuccess"));
        setIsExportRunning(false);
      } else {
        Alert.alert("", t("settingExportError"));
        setIsExportRunning(false);
      }
    } catch (e: any) {
      console.log("", e.message);
      setIsExportRunning(false);
    }
  };
  const exportDataIOS = async (cipher: string): Promise<any> => {
    console.log("exportDataIOS", cipher);

    RNFS.writeFile(appConfig.tempbackUpPath, cipher, "utf8")
      .then(async (res: any) => {
        console.log(res, "..res..");
        const shareOptions = {
          title: "Backup File",
          url: appConfig.tempbackUpPath,
          saveToFiles: true,
          failOnCancel: false,
        };
        try {
          const ShareResponse = await Share.open(shareOptions);
          setIsExportRunning(false);
          if (ShareResponse && ShareResponse.success) {
            Alert.alert("", t("settingExportSuccess"));
            await RNFS.exists(appConfig.tempbackUpPath).then((exists) => {
              console.log(String(exists), "..exists..");
              if (exists) {
                RNFS.unlink(appConfig.tempbackUpPath).then(() => {
                  //RNFS.scanFile(tempbackUpPath);
                });
              }
            });
          } else {
            Alert.alert("", t("settingExportError"));
          }
        } catch (error: any) {
          setIsExportRunning(false);
          if (error.error && error.error.code === "ECANCELLED500") {
            console.log("canceled");
          } else {
            Alert.alert("", t("settingExportError"));
          }
        }
      })
      .catch((e) => {
        console.log(e);
        setIsExportRunning(false);
        Alert.alert("", t("settingExportError"));
      });
  };

  const exportFile = async (): Promise<any> => {
    //need to add code.
    setIsExportRunning(true);
    try {
      userRealmCommon
        .exportUserRealmDataToJson()
        .then(async (jsonData: any) => {
          encryptData(JSON.stringify(jsonData), encryptionsKey).then(
            async (cipher: any) => {
              if (Platform.OS === "android") {
                exportDataAndroid(cipher.cipher);
              } else {
                console.log("cipher is", cipher.cipher);
                exportDataIOS(cipher.cipher);
              }
            }
          );
        })
        .catch((error) => {
          console.log("Error exporting data:", error);
          setIsExportRunning(false);
          Alert.alert("", t("settingExportError"));
        });
    } catch (err) {
      console.log("Error", err);
    }
  };
  const onExportCancel = (): any => {
    setExportAlertVisible(false);
  };
  const onImportCancel = (): any => {
    setImportAlertVisible(false);
  };
  const exportToDrive = async (): Promise<any> => {
    setIsExportRunning(true);
    const exportIsSuccess = await backup.export();
    setIsExportRunning(false);
    if (!exportIsSuccess) {
      Alert.alert("", t("settingExportError"));
    } else {
      Alert.alert("", t("settingExportSuccess"));
    }
    actionSheetRef.current?.setModalVisible(false);
  };
  const handleExportAlertConfirm = (): any => {
    setExportAlertVisible(false);
    exportToDrive();
  };
  const handleImportAlertConfirm = async (): Promise<any> => {
    setImportAlertVisible(false);
    importAllData();
  };
  const exportAllData = async (): Promise<any> => {
    actionSheetRef.current?.setModalVisible(true);
  };
  const toggleSwitch = (): any => {
    if (
      vchcEnabledFlag == true ||
      growthEnabledFlag == true ||
      developmentEnabledFlag == true
    ) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  };

  const toggleGrowthFutureNotiData = async (
    callCreateLocalNoti: boolean
  ): Promise<any> => {
    //toggle isDeleted flag from gwcdnotis where type = 'gw'
    let currscheduledlocalNotifications = [...scheduledlocalNotifications];
    const childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    const allnotis = [...storedata.notificationData.notifications];
    childList?.map((child: any) => {
      const currentChildNotis = {
        ...allnotis.find((item) => item.childuuid == child.uuid),
      };
      const currentChildIndex = allnotis.findIndex(
        (item) => item.childuuid == child.uuid
      );
      const notiExist = allnotis.find(
        (item) => String(item.childuuid) == String(child.uuid)
      );
      if (notiExist) {
        if (currentChildNotis.gwcdnotis.length > 0) {
          currentChildNotis.gwcdnotis = [...currentChildNotis.gwcdnotis]?.map(
            (item) => {
              if (item.type == "gw") {
                const difftoToday = Math.round(
                  DateTime.fromJSDate(new Date(item.notificationDate)).diff(
                    DateTime.fromJSDate(new Date()),
                    "days"
                  ).days
                );
                // growthEnabledFlag == false checked because state update of growthEnabledFlag istaking time
                if (isFutureDate(item.notificationDate)) {
                  return {
                    ...item,
                    isDeleted: growthEnabledFlag == false ? false : true,
                  };
                } else if (difftoToday == 0) {
                  if (growthEnabledFlag == false) {
                    return { ...item, isDeleted: false };
                  } else {
                    return { ...item };
                  }
                } else {
                  return { ...item };
                }
              } else {
                return { ...item };
              }
            }
          );
        }
      }
      localNotifications.map((y: any) => {
        // growthEnabledFlag == true checked because state update of growthEnabledFlag istaking time
        if (growthEnabledFlag == true) {
          const notiToDelete = y.data.filter((o: any) => o.type == "gw");
          notiToDelete.map((n: any) => {
            if (
              currscheduledlocalNotifications.findIndex(
                (m: any) => m.notiid == n.notiid
              ) > -1
            ) {
              LocalNotifications.cancelReminderLocalNotification(n.notiid);
              currscheduledlocalNotifications =
                currscheduledlocalNotifications.filter(
                  (m: any) => m.notiid != n.notiid
                );
              console.log("removed noti1---", currscheduledlocalNotifications);
            }
          });
        }
      });

      allnotis[currentChildIndex] = currentChildNotis;
    });
    dispatch(
      setAllScheduledLocalNotificationData(currscheduledlocalNotifications)
    );
    dispatch(setAllNotificationData(allnotis));
    if (callCreateLocalNoti == true) {
      const localnotiFlagObj = {
        generateFlag: true,
        generateType: "add",
        childuuid: "all",
      };
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    }
  };
  const togglecdFutureNotiData = async (
    callCreateLocalNoti: boolean
  ): Promise<any> => {
    //toggle isDeleted flag from gwcdnotis where type = 'cd'
    let currscheduledlocalNotifications = [...scheduledlocalNotifications];
    const childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    const allnotis = [...storedata.notificationData.notifications];
    childList?.map((child: any) => {
      const currentChildNotis = {
        ...allnotis.find((item) => item.childuuid == child.uuid),
      };
      const currentChildIndex = allnotis.findIndex(
        (item) => item.childuuid == child.uuid
      );
      const notiExist = allnotis.find(
        (item) => String(item.childuuid) == String(child.uuid)
      );
      if (notiExist) {
        if (currentChildNotis.gwcdnotis.length > 0) {
          currentChildNotis.gwcdnotis = [...currentChildNotis.gwcdnotis]?.map(
            (item) => {
              if (item.type == "cd") {
                const difftoToday = Math.round(
                  DateTime.fromJSDate(new Date(item.notificationDate)).diff(
                    DateTime.fromJSDate(new Date()),
                    "days"
                  ).days
                );
                // developmentEnabledFlag == false checked because state update of developmentEnabledFlag istaking time
                if (isFutureDate(new Date(item.notificationDate))) {
                  return {
                    ...item,
                    isDeleted: developmentEnabledFlag == false ? false : true,
                  };
                } else if (difftoToday == 0) {
                  if (developmentEnabledFlag == false) {
                    return { ...item, isDeleted: false };
                  } else {
                    return { ...item };
                  }
                } else {
                  return { ...item };
                }
              } else {
                return { ...item };
              }
            }
          );
        }
      }
      localNotifications.map((y: any) => {
        // developmentEnabledFlag == true checked because state update of developmentEnabledFlag istaking time
        if (developmentEnabledFlag == true) {
          const notiToDelete = y.data.filter((o: any) => o.type == "cd");
          notiToDelete.map((n: any) => {
            if (
              currscheduledlocalNotifications.findIndex(
                (m: any) => m.notiid == n.notiid
              ) > -1
            ) {
              LocalNotifications.cancelReminderLocalNotification(n.notiid);
              currscheduledlocalNotifications =
                currscheduledlocalNotifications.filter(
                  (m: any) => m.notiid != n.notiid
                );
              console.log("removed noti---", currscheduledlocalNotifications);
            }
          });
        }
      });

      allnotis[currentChildIndex] = currentChildNotis;
    });
    dispatch(
      setAllScheduledLocalNotificationData(currscheduledlocalNotifications)
    );
    dispatch(setAllNotificationData(allnotis));
    if (callCreateLocalNoti == true) {
      const localnotiFlagObj = {
        generateFlag: true,
        generateType: "add",
        childuuid: "all",
      };
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    }
  };
  const toggleVCHCVCRHCRFutureNotiData = async (
    callCreateLocalNoti: boolean
  ): Promise<any> => {
    //toggle isDeleted flag from reminderNotis,hcnotis,vchcnotis
    let currscheduledlocalNotifications = [...scheduledlocalNotifications];
    const childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    const allnotis = [...storedata.notificationData.notifications];
    childList?.map((child: any) => {
      const currentChildNotis = {
        ...allnotis.find((item) => item.childuuid == child.uuid),
      };
      const currentChildIndex = allnotis.findIndex(
        (item) => item.childuuid == child.uuid
      );
      const notiExist = allnotis.find(
        (item) => String(item.childuuid) == String(child.uuid)
      );
      if (notiExist) {
        if (currentChildNotis.vcnotis.length > 0) {
          currentChildNotis.vcnotis = [...currentChildNotis.vcnotis]?.map(
            (item) => {
              const difftoToday = Math.round(
                DateTime.fromJSDate(new Date(item.notificationDate)).diff(
                  DateTime.fromJSDate(new Date()),
                  "days"
                ).days
              );
              // vchcEnabledFlag == false checked because state update of vchcEnabledFlag istaking time
              if (isFutureDate(new Date(item.notificationDate))) {
                return {
                  ...item,
                  isDeleted: vchcEnabledFlag == false ? false : true,
                };
              } else if (difftoToday == 0) {
                if (vchcEnabledFlag == false) {
                  return { ...item, isDeleted: false };
                } else {
                  return { ...item };
                }
              } else {
                return { ...item };
              }
            }
          );
        }
        if (notiExist.hcnotis.length > 0) {
          currentChildNotis.hcnotis = [...currentChildNotis.hcnotis]?.map(
            (item) => {
              const difftoToday = Math.round(
                DateTime.fromJSDate(new Date(item.notificationDate)).diff(
                  DateTime.fromJSDate(new Date()),
                  "days"
                ).days
              );
              // vchcEnabledFlag == false checked because state update of vchcEnabledFlag istaking time
              if (isFutureDate(new Date(item.notificationDate))) {
                return {
                  ...item,
                  isDeleted: vchcEnabledFlag == false ? false : true,
                };
              } else if (difftoToday == 0) {
                if (vchcEnabledFlag == false) {
                  return { ...item, isDeleted: false };
                } else {
                  return { ...item };
                }
              } else {
                return { ...item };
              }
            }
          );
        }
        if (notiExist.reminderNotis.length > 0) {
          if (vchcEnabledFlag == true) {
            //cancel all local notifications
            LocalNotifications.cancelAllReminderLocalNotification();
          }
          currentChildNotis.reminderNotis = [
            ...currentChildNotis.reminderNotis,
          ]?.map((item) => {
            console.log(vchcEnabledFlag, "----vchcEnabledFlag");
            // vchcEnabledFlag == false checked because state update of vchcEnabledFlag istaking time
            if (vchcEnabledFlag == false) {
              //enable future notifications
              console.log(
                item,
                "---isfuture date4 ---",
                isFutureDateTime(new Date(item.notificationDate))
              );
              if (
                item.subtype == "reminder" &&
                isFutureDateTime(new Date(item.notificationDate))
              ) {
                const titlevcr = t("vcrNoti2", {
                  reminderDateTime:
                    formatStringDate(item.periodName) +
                    "," +
                    formatStringTime(item.growth_period),
                });
                const titlehcr = t("hcrNoti2", {
                  reminderDateTime:
                    formatStringDate(item.periodName) +
                    "," +
                    formatStringTime(item.growth_period),
                });
                const message = item.type == "vaccine" ? titlevcr : titlehcr;
                LocalNotifications.schduleNotification(
                  new Date(item.notificationDate),
                  t("remindersAlertTitle"),
                  message,
                  DateTime.fromJSDate(
                    new Date(item.notificationDate)
                  ).toMillis(),
                  item.type == "vaccine" ? "vcr" : "hcr",
                  child.uuid
                );
              }
            }
            if (isFutureDateTime(new Date(item.notificationDate))) {
              return {
                ...item,
                isDeleted: vchcEnabledFlag == false ? false : true,
              };
            } else {
              return { ...item };
            }
          });
        }
        localNotifications.map((y: any) => {
          // vchcEnabledFlag == true checked because state update of vchcEnabledFlag istaking time
          if (vchcEnabledFlag == true) {
            const notiToDelete = y.data.filter(
              (o: any) => o.type == "vc" || o.type == "hc"
            );
            notiToDelete.map((n: any) => {
              if (
                currscheduledlocalNotifications.findIndex(
                  (m: any) => m.notiid == n.notiid
                ) > -1
              ) {
                LocalNotifications.cancelReminderLocalNotification(n.notiid);
                currscheduledlocalNotifications =
                  currscheduledlocalNotifications.filter(
                    (m: any) => m.notiid != n.notiid
                  );
                console.log("removed noti---", currscheduledlocalNotifications);
              }
            });
          }
        });
      }
      allnotis[currentChildIndex] = currentChildNotis;
    });
    dispatch(
      setAllScheduledLocalNotificationData(currscheduledlocalNotifications)
    );
    dispatch(setAllNotificationData(allnotis));
    if (callCreateLocalNoti == true) {
      const localnotiFlagObj = {
        generateFlag: true,
        generateType: "add",
        childuuid: "all",
      };
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    }
  };

  useEffect(() => {
    const apiJsonData = [
      {
        apiEndpoint: appConfig.apiConfig.countryGroups,
        method: "get",
        postdata: {},
        saveinDB: true,
      },
    ];
    dispatch(
      fetchAPI(
        apiJsonData,
        "",
        dispatch,
        navigation,
        languageCode,
        activeChild,
        apiJsonData,
        netInfo.isConnected
      )
    );
  }, [dispatch, navigation]);
  const toggleAllNotis = (): any => {
    if (isEnabled == true) {
      const obj = { key: "growthEnabled", value: false };
      dispatch(toggleNotificationFlags(obj));
      const obj1 = { key: "developmentEnabled", value: false };
      dispatch(toggleNotificationFlags(obj1));
      const obj2 = { key: "vchcEnabled", value: false };
      dispatch(toggleNotificationFlags(obj2));
      setIsEnabled(false);
      logEvent({ name: GROWTH_NOTIFICATION_OFF }, netInfo.isConnected);
      logEvent({ name: DEVELOPMENT_NOTIFICATION_OFF }, netInfo.isConnected);
      logEvent(
        { name: VACCINE_HEALTHCHECKUP_NOTIFICATION_OFF },
        netInfo.isConnected
      );
    } else {
      const obj = { key: "growthEnabled", value: true };
      dispatch(toggleNotificationFlags(obj));
      const obj1 = { key: "developmentEnabled", value: true };
      dispatch(toggleNotificationFlags(obj1));
      const obj2 = { key: "vchcEnabled", value: true };
      dispatch(toggleNotificationFlags(obj2));
      setIsEnabled(true);
      logEvent({ name: GROWTH_NOTIFICATION_ON }, netInfo.isConnected);
      logEvent({ name: DEVELOPMENT_NOTIFICATION_ON }, netInfo.isConnected);
      logEvent(
        { name: VACCINE_HEALTHCHECKUP_NOTIFICATION_ON },
        netInfo.isConnected
      );
    }
    toggleGrowthFutureNotiData(false);
    togglecdFutureNotiData(false);
    toggleVCHCVCRHCRFutureNotiData(false);
    const localnotiFlagObj = {
      generateFlag: true,
      generateType: "add",
      childuuid: "all",
    };
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
  };
  const toggleDataSaverSwitch = (): any => {
    dispatch(onNetworkStateChange(!toggleSwitchVal));
  };

  const downloadUpdatedData = (): any => {
    Alert.alert(t("downloadUpdatePopupTitle"), t("downloadUpdatePopupText"), [
      {
        text: t("downloadUpdateCancelPopUpBtn"),
        onPress: (): any => {
          console.log("on pressed");
        },
        style: "cancel",
      },
      {
        text: t("downloadUpdateContinueBtn"),
        onPress: async (): Promise<any> => {
          props.navigation.navigate("LoadingScreen", {
            apiJsonData: appConfig.allApisObject(true, incrementalSyncDT),
            prevPage: "DownloadUpdate",
          });
        },
      },
    ]);
  };

  const downloadAllData = (): any => {
    Alert.alert(t("downloadAllPopupTitle"), t("downloadAllPopupText"), [
      {
        text: t("downloadAllCancelPopUpBtn"),
        onPress: (): any => {
          console.log("on pressed");
        },
        style: "cancel",
      },
      {
        text: t("downloadAllContinueBtn"),
        onPress: async (): Promise<any> => {
          props.navigation.navigate("LoadingScreen", {
            apiJsonData:
              allDataDownloadFlag == false
                ? appConfig.allApisObject(false, incrementalSyncDT)
                : appConfig.allApisObject(true, incrementalSyncDT),
            prevPage: "DownloadAllData",
          });
        },
      },
    ]);
  };

  useEffect(() => {
    if (allCountries?.length > 0 && (!country || !language)) {
      if (
        allCountries.length === 1 &&
        allCountries[0]?.languages?.length === 1
      ) {
        setCountry(allCountries[0]);
        setlanguage(allCountries[0]?.languages[0]);
      } else {
        console.log("Selected country for countryId is", countryId);
        const selectedCountry = allCountries.find(
          (c: any) => c?.CountryID == countryId
        );
        console.log(allCountries, "Selected country is", selectedCountry);

        if (selectedCountry) {
          setCountry(selectedCountry);
          const selectedLanguage = selectedCountry.languages?.find(
            (lang: any) => lang.languageCode == languageCode
          );
          setlanguage(selectedLanguage);
        }
      }
      toggleSwitch();
    }
  }, [allCountries]);

  useEffect(() => {
    if (isFocused) {
      toggleSwitch();
    }
  }, [isFocused, developmentEnabledFlag, growthEnabledFlag, vchcEnabledFlag]);

  const handleError = (err: any): any => {
    console.log(err, "..err");

    // if (DocumentPicker.isCancel(err)) {
    //   console.log("cancelled");
    //   // User cancelled the picker, exit any dialogs or menus and move on
    // } else if (isInProgress(err)) {
    //   console.log(
    //     "multiple pickers were opened, only the last will be considered"
    //   );
    // } else {
    //   throw err;
    // }

    if (isErrorWithCode(err)) {
      switch (err.code) {
        case errorCodes.IN_PROGRESS:
          console.warn('user attempted to present a picker, but a previous one was already presented')
          break
        case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
          console.log('unable to open file type')
          break
        case errorCodes.OPERATION_CANCELED:
          // ignore
          break
        default:
          console.error(err)
      }
    } else {
      throw err;
    }
  };
  const importDataAndroid = async (): Promise<any> => {
    const dataset = await ScopedStorage.openDocument(true, "utf8");
    let oldChildrenData: any = [];
    if (
      dataset &&
      dataset.data != "" &&
      dataset.data != null &&
      dataset.data != undefined
    ) {
      if (dataset.name.endsWith(".json")) {
        const decryptedData = decryptData(dataset.data, encryptionsKey)
          .then((text: any) => {
            console.log("decryptData", text);
            return text.replace(/[\x00-\x1F\x7F]/g, "");
          })
          .catch((error: any) => {
            console.log("Decrypted error", error);
            Alert.alert(error, t("generalErrorTitle"));
            throw error;
          });

        await RNFS.writeFile(
          appConfig.tempRealmFile,
          JSON.stringify(decryptedData),
          "utf8"
        );
        const importedJsonData = JSON.parse(await decryptedData);
        oldChildrenData = importedJsonData;
      } else {
        const base64Dataset = await ScopedStorage.openDocument(true, "base64");
        await RNFS.writeFile(
          appConfig.tempRealmFile,
          base64Dataset.data,
          "base64"
        );
        let importedrealm = await new Realm({ path: "user1.realm" });
        if (importedrealm) {
          importedrealm.close();
        }
        importedrealm = await new Realm({ path: "user1.realm" });
        const user1Path = importedrealm.path;
        console.log(user1Path, "..user1Path");
        oldChildrenData = importedrealm.objects("ChildEntity");
      }

      console.log(oldChildrenData, "..newoldChildrenData..");
      setIsImportRunning(true);
      if (oldChildrenData.length > 0) {
        await userRealmCommon.openRealm();
        await userRealmCommon.deleteAllAtOnce();
        try {
          console.log("oldchildrenresponse", oldChildrenData);
          const importResponse = await backup.importFromFile(
            oldChildrenData,
            props.navigation,
            genders,
            dispatch,
            childAge,
            languageCode,
            taxonomyIds
          );

          console.log(importResponse, "..importResponse");
        } catch (error) {
          console.error("importResponse error", error);
        }
      }
      setIsImportRunning(false);
      actionSheetRefImport.current?.setModalVisible(false);
    }
  };
  const importDataIOS = async (): Promise<any> => {
    console.log("<<<<<importDataIOS>>>>>>");
    pick({
      allowMultiSelection: false,
      allowedTypes: ['*/*'],
    })
      .then(async (res: any) => {
        console.log("<<<<<importDataIOS>>>>>>", res);
        let oldChildrenData: any = [];
        if (res.length > 0 && res[0].uri) {
          if (res[0].name.endsWith(".json")) {
            const decryptFileContent: any = await RNFS.readFile(
              decodeURIComponent(res[0].uri),
              "utf8"
            )
              .then((edata: any) => {
                return decryptData(edata, encryptionsKey)
                  .then((text: any) => {
                    //console.log('decryptData',text)
                    return text.replace(/[\x00-\x1F\x7F]/g, "");
                  })
                  .catch((error: any) => {
                    //console.log("Decrypted error", error);
                    throw error;
                    Alert.alert("", t("generalErrorTitle"));
                  });
              })
              .catch((error) => {
                //console.error('Error:', error);
                Alert.alert("", t("generalErrorTitle"));
                throw error;
              });
            //console.log('ios data is',decryptFileContent)
            const importedJsonData = JSON.parse(decryptFileContent);
            console.log("importedJsonData data is", importedJsonData);
            oldChildrenData = importedJsonData;
            console.log("oldChildrenData-if", oldChildrenData);
            try {
              //console.log("tempRealmFile", tempRealmFile);

              await RNFS.writeFile(
                appConfig.tempRealmFile,
                JSON.stringify(importedJsonData),
                "utf8"
              );
            } catch (error) {
              console.log("In Write file", error);
            }
          } else {
            const exportedFileContent: any = await RNFS.readFile(
              decodeURIComponent(res[0].uri),
              "base64"
            );
            await RNFS.writeFile(
              appConfig.tempRealmFile,
              exportedFileContent,
              "base64"
            );
            let importedrealm = await new Realm({ path: "user1.realm" });
            if (importedrealm) {
              //console.log( "importedrealm")
              importedrealm.close();
            }
            importedrealm = await new Realm({ path: "user1.realm" });
            const user1Path = importedrealm.path;
            //console.log(user1Path, "..user1Path")
            oldChildrenData = importedrealm.objects("ChildEntity");
          }

          console.log(oldChildrenData, "..newoldChildrenData..");
          setIsImportRunning(true);
          if (oldChildrenData.length > 0) {
            try {
              console.log("..importResponse");
              await userRealmCommon.openRealm();
              await userRealmCommon.deleteAllAtOnce();
              const importResponse = await backup.importFromFile(
                oldChildrenData,
                props.navigation,
                genders,
                dispatch,
                childAge,
                languageCode,
                taxonomyIds
              );
            } catch (error) {
              console.error(error, "..importResponse error");
            }
          }
          setIsImportRunning(false);
          actionSheetRefImport.current?.setModalVisible(false);
        }
      })
      .catch(handleError);
  };
  const importFromSettingsFile = async (): Promise<any> => {
    if (Platform.OS == "android") {
      importDataAndroid();
    } else {
      importDataIOS();
    }
  };

  return (
    <>
      <View style={[styles.flex1, { paddingBottom: insets.bottom }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <OverlayLoadingComponent
              loading={isExportRunning || isImportRunning ? true : false}
            />
        <TabScreenHeader
          title={t("settingScreenheaderTitle")}
          headerColor={primaryColor}
          textColor={headerTextColor}
          setProfileLoading={setProfileLoading}
        />

        <ScrollView
          scrollIndicatorInsets={{ right: 1 }}
          style={[styles.flex1, styles.bgColorWhite]}
        >
          <MainContainer>
            <SettingHeading>
              <Heading1>{t("settingScreennotiHeaderText")}</Heading1>
            </SettingHeading>
            <ShiftFromBottom10>
              <FDirRowStart>
                <Switch
                  trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleAllNotis}
                  value={isEnabled}
                />
                <ToggleLabelText>
                  <Heading4Regular>
                    {t("settingScreennotiType1")}
                  </Heading4Regular>
                </ToggleLabelText>
              </FDirRowStart>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={(): any => {
                      const obj = {
                        key: "growthEnabled",
                        value: growthEnabledFlag == true ? false : true,
                      };
                      dispatch(toggleNotificationFlags(obj));
                      toggleGrowthFutureNotiData(true);
                      if (
                        vchcEnabledFlag == false &&
                        growthEnabledFlag == true &&
                        developmentEnabledFlag == false
                      ) {
                        setIsEnabled(false);
                      } else {
                        setIsEnabled(true);
                      }
                      if (growthEnabledFlag == true) {
                        logEvent(
                          { name: GROWTH_NOTIFICATION_ON },
                          netInfo.isConnected
                        );
                      } else {
                        logEvent(
                          { name: GROWTH_NOTIFICATION_OFF },
                          netInfo.isConnected
                        );
                      }
                    }}
                  >
                    <CheckboxItem>
                      <View>
                        {growthEnabledFlag ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={styles.borderWidth1}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  <ToggleLabelText1>
                    <Heading4Regular>
                      {t("settingScreennotiType2")}
                    </Heading4Regular>
                  </ToggleLabelText1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={(): any => {
                      const obj = {
                        key: "developmentEnabled",
                        value: developmentEnabledFlag == true ? false : true,
                      };
                      dispatch(toggleNotificationFlags(obj));
                      togglecdFutureNotiData(true);
                      if (
                        vchcEnabledFlag == false &&
                        growthEnabledFlag == false &&
                        developmentEnabledFlag == true
                      ) {
                        setIsEnabled(false);
                      } else {
                        setIsEnabled(true);
                      }
                      if (developmentEnabledFlag == true) {
                        logEvent(
                          { name: DEVELOPMENT_NOTIFICATION_ON },
                          netInfo.isConnected
                        );
                      } else {
                        logEvent(
                          { name: DEVELOPMENT_NOTIFICATION_OFF },
                          netInfo.isConnected
                        );
                      }
                    }}
                  >
                    <CheckboxItem>
                      <View>
                        {developmentEnabledFlag ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={styles.borderWidth1}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  <ToggleLabelText1>
                    <Heading4Regular>
                      {t("settingScreennotiType3")}
                    </Heading4Regular>
                  </ToggleLabelText1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={(): any => {
                      const obj = {
                        key: "vchcEnabled",
                        value: vchcEnabledFlag == true ? false : true,
                      };
                      dispatch(toggleNotificationFlags(obj));
                      toggleVCHCVCRHCRFutureNotiData(true);
                      if (
                        vchcEnabledFlag == true &&
                        growthEnabledFlag == false &&
                        developmentEnabledFlag == false
                      ) {
                        setIsEnabled(false);
                      } else {
                        setIsEnabled(true);
                      }
                      if (vchcEnabledFlag == true) {
                        logEvent(
                          { name: VACCINE_HEALTHCHECKUP_NOTIFICATION_ON },
                          netInfo.isConnected
                        );
                      } else {
                        logEvent(
                          { name: VACCINE_HEALTHCHECKUP_NOTIFICATION_OFF },
                          netInfo.isConnected
                        );
                      }
                    }}
                  >
                    <CheckboxItem>
                      <View>
                        {vchcEnabledFlag ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={styles.borderWidth1}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  <ToggleLabelText1>
                    <Heading4Regular>
                      {t("settingScreennotiType4")}
                    </Heading4Regular>
                  </ToggleLabelText1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <View>
              <Heading4Regular>{t("settingScreennotiInfo")}</Heading4Regular>
            </View>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t("settingScreendataSaverHeaderText")}</Heading1>
            </SettingHeading>

            <ShiftFromBottom10>
              <FDirRowStart>
                <Switch
                  trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                  thumbColor={
                    toggleSwitchVal ? thumbTrueColor : thumbFalseColor
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDataSaverSwitch}
                  value={toggleSwitchVal}
                />
                <ToggleLabelText>
                  <Heading4Regular>
                    {t("settingScreendataSaverSubText")}
                  </Heading4Regular>
                </ToggleLabelText>
              </FDirRowStart>
            </ShiftFromBottom10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t("settingScreendownldHeaderText")}</Heading1>
            </SettingHeading>
            <Heading4>{t("settingScreendownldSubHeaderText")}</Heading4>
            <Heading6>
              {t("settingScreendownldlast", {
                downloadDate: formatStringDate(new Date(lastUpdatedDate)),
              })}
            </Heading6>
            <ShiftFromTop10>
              {/* <ButtonPrimary onPress={() => { downloadUpdatedData() }}> */}
              <ButtonPrimary
                onPress={(): any => {
                  if (netInfo && netInfo.isConnected == true) {
                    downloadUpdatedData();
                  } else {
                    Alert.alert("", t("noInternet"));
                  }
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("settingScreendownldupdateBtn")}
                </ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
            <ShiftFromTop10>
              <Heading4>{t("settingScreendownldSubHeader2Text")}</Heading4>
              <Heading6>{t("settingScreendownldSubHeader3Text")}</Heading6>
            </ShiftFromTop10>
            <ShiftFromTop10>
              <ButtonPrimary
                onPress={(): any => {
                  if (netInfo && netInfo.isConnected == true) {
                    downloadAllData();
                  } else {
                    Alert.alert("", t("noInternet"));
                  }
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("settingScreendownldallBtn")}
                </ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <FlexDirRowSpace>
                <Heading1>{t("settingScreenlocalizationHeader")}</Heading1>
                {allCountries?.length >= 1 &&
                  allCountries.some((c: any) => c.languages.length > 1) && (
                    <IconAreaPress
                      onPress={(): any => {
                        setModalVisible(true);
                      }}
                    >
                      <Icon name="ic_edit" size={16} color="#000" />
                    </IconAreaPress>
                  )}
              </FlexDirRowSpace>
            </SettingHeading>
            <ShiftFromTopBottom5>
              <FDirRow>
                <Flex2>
                  <Heading3Regular>{t("country")}</Heading3Regular>
                </Flex2>
                <Flex3>
                  <Heading3>{country?.name}</Heading3>
                </Flex3>
              </FDirRow>
            </ShiftFromTopBottom5>
            <ShiftFromTopBottom5>
              <FDirRow>
                <Flex2>
                  <Heading3Regular>{t("language")}</Heading3Regular>
                </Flex2>
                <Flex3>
                  <Heading3>{language?.displayName}</Heading3>
                </Flex3>
              </FDirRow>
            </ShiftFromTopBottom5>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t("settingScreenieHeader")}</Heading1>
            </SettingHeading>
            <ShiftFromTopBottom10>
              <ButtonPrimary
                disabled={isExportRunning || isImportRunning}
                onPress={(): any => {
                  exportAllData();
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("settingScreenexportBtnText")}
                </ButtonText>
              </ButtonPrimary>
            </ShiftFromTopBottom10>
            <ShiftFromTopBottom10>
              <ButtonPrimary
                disabled={isExportRunning || isImportRunning}
                onPress={(): any => {
                  actionSheetRefImport.current?.setModalVisible(true);
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("settingScreenimportBtnText")}
                </ButtonText>
              </ButtonPrimary>
            </ShiftFromTopBottom10>
            {/* <OverlayLoadingComponent
              loading={isExportRunning || isImportRunning ? true : false}
            /> */}
          </MainContainer>

          <ActionSheet ref={actionSheetRef}>
            <BannerContainer>
              <SettingHeading>
                <Heading1>{t("settingScreenexportOptionHeader")}</Heading1>
              </SettingHeading>
              <SettingShareData>
                <FDirRow>
                  <SettingOptions>
                    <Pressable
                      onPress={async (): Promise<any> => {
                        console.log("icon clicked");
                        try {
                          if (Platform.OS === "android") {
                            console.log("1233");

                            console.log("You can write");
                            actionSheetRef.current?.setModalVisible(false);
                            exportFile();
                          } else {
                            actionSheetRef.current?.setModalVisible(false);
                            setTimeout(() => {
                              exportFile();
                            }, 350);
                          }
                        } catch (err) {
                          console.warn(err);
                        }
                      }}
                    >
                      <VectorImage source={require("@images/ic_file.svg")} />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t("settingScreenshareBtntxt")}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                  <SettingOptions>
                    <Pressable
                      onPress={(): any => {
                        actionSheetRef.current?.setModalVisible(false);
                        if (netInfo && netInfo.isConnected == true) {
                          Platform.OS == "ios"
                            ? setTimeout(() => {
                                setExportAlertVisible(true);
                              }, 350)
                            : setExportAlertVisible(true);
                        } else {
                          Alert.alert("", t("noInternet"));
                        }
                      }}
                    >
                      <VectorImage source={require("@images/ic_gdrive.svg")} />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t("settingScreengdriveBtntxt")}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                </FDirRow>
              </SettingShareData>
            </BannerContainer>
          </ActionSheet>
          <ActionSheet ref={actionSheetRefImport}>
            <BannerContainer>
              <SettingHeading>
                <Heading1>{t("settingScreenimportOptionHeader")}</Heading1>
              </SettingHeading>
              <SettingShareData>
                <FDirRow>
                  <SettingOptions>
                    <Pressable
                      onPress={(): any => {
                        console.log("icon clicked");
                        actionSheetRefImport.current?.setModalVisible(false);
                        setTimeout(async () => {
                          try {
                            //import
                            if (Platform.OS === "android") {
                              console.log("1233");
                              importFromSettingsFile();
                            } else {
                              importFromSettingsFile();
                            }
                          } catch (err) {
                            if (DocumentPicker.isCancel(err)) {
                              // User cancelled the picker, exit any dialogs or menus and move on
                            } else {
                              throw err;
                            }
                          }
                        }, 350);
                      }}
                    >
                      <VectorImage source={require("@images/ic_file.svg")} />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>{t("importBtntxt")}</Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                  <SettingOptions>
                    <Pressable
                      onPress={(): any => {
                        actionSheetRefImport.current?.setModalVisible(false);
                        if (netInfo && netInfo.isConnected == true) {
                          Platform.OS == "ios"
                            ? setTimeout(() => {
                                setImportAlertVisible(true);
                              }, 350)
                            : setImportAlertVisible(true);
                        } else {
                          Alert.alert("", t("noInternet"));
                        }
                      }}
                    >
                      <VectorImage source={require("@images/ic_gdrive.svg")} />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t("settingScreengdriveBtntxt")}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                </FDirRow>
              </SettingShareData>
            </BannerContainer>
          </ActionSheet>
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
              <ModalPopupContent>
                <Heading4Centerr>
                  {t("localizationChangeModalText")}
                </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
                <ButtonModal
                  onPress={(): any => {
                    setModalVisible(false);
                    props.navigation.navigate("Localization", {
                      screen:
                        allCountries.length == 1
                          ? "LanguageSelection"
                          : "CountrySelection",
                      params: {
                        isSetting: true,
                        country: allCountries.length == 1 ? country : null,
                        language: allCountries.length == 1 ? language : null,
                      },
                    });
                  }}
                >
                  <ButtonTextTheme numberOfLines={2}>
                    {t("continueInModal")}
                  </ButtonTextTheme>
                </ButtonModal>
              </FDirRow>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        <AlertModal
          loading={isExportAlertVisible}
          disabled={isExportRunning || isImportRunning}
          message={t("dataConsistency")}
          title={t("exportText")}
          cancelText={t("retryCancelPopUpBtn")}
          onConfirm={handleExportAlertConfirm}
          onCancel={onExportCancel}
        ></AlertModal>
        <AlertModal
          loading={isImportAlertVisible}
          disabled={isExportRunning || isImportRunning}
          message={t("dataConsistency")}
          title={t("importText")}
          cancelText={t("retryCancelPopUpBtn")}
          onConfirm={handleImportAlertConfirm}
          onCancel={onImportCancel}
        ></AlertModal>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};

export default SettingScreen;

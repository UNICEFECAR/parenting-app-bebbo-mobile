

import { DEVELOPMENT_NOTIFICATION_OFF, DEVELOPMENT_NOTIFICATION_ON, GROWTH_NOTIFICATION_OFF, GROWTH_NOTIFICATION_ON, VACCINE_HEALTHCHECKUP_NOTIFICATION_OFF, VACCINE_HEALTHCHECKUP_NOTIFICATION_ON } from '@assets/data/firebaseEvents';
import { allApisObject, tempbackUpPath, tempRealmFile } from '@assets/translations/appOfflineData/apiConstants';
import AlertModal from '@components/AlertModal';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonModal,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import Checkbox, {
  CheckboxActive,
  CheckboxItem
} from '@components/shared/CheckboxStyle';
import { FormOuterCheckbox } from '@components/shared/ChildSetupStyle';
import {
  BannerContainer,
  MainContainer
} from '@components/shared/Container';
import {
  FDirRow,
  FDirRowStart, Flex2,
  Flex3,
  FlexDirRowSpace
} from '@components/shared/FlexBoxStyle';
import Icon, { IconAreaPress } from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  SettingHeading,
  SettingOptions,
  SettingShareData,
  ToggleLabelText,
  ToggleLabelText1
} from '@components/shared/SettingsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading1,
  Heading3,
  Heading3Regular,
  Heading4,
  Heading4Centerr,
  Heading4Regular,
  Heading6,
  ShiftFromBottom10,
  ShiftFromTop10, ShiftFromTopBottom10,
  ShiftFromTopBottom5,
  SideSpacing10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import DocumentPicker, { isInProgress } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { store, useAppDispatch, useAppSelector } from '../../../App';
import  {localization}  from '@dynamicImportsClass/dynamicImports';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { onNetworkStateChange } from '../../redux/reducers/bandwidthSlice';
import { setAllLocalNotificationGenerateType, setAllNotificationData, setAllScheduledLocalNotificationData, toggleNotificationFlags } from '../../redux/reducers/notificationSlice';
import { backup } from '../../services/backup';
import { getAllChildren, isFutureDate, isFutureDateTime } from '../../services/childCRUD';
import { formatStringDate, formatStringTime } from '../../services/Utils';
import * as ScopedStorage from "react-native-scoped-storage";
import Share from 'react-native-share';
import LocalNotifications from '../../services/LocalNotifications';
import { bgcolorWhite2 } from '@styles/style';
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
const styles=StyleSheet.create({
bgColorWhite:{ backgroundColor:bgcolorWhite2},
borderWidth1:{ borderWidth: 1 },
flex1:{flex:1}
})
const SettingScreen = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const trackTrueColor = primaryTintColor;
  const trackFalseColor = '#C8D6EE';
  const thumbTrueColor = primaryColor;
  const thumbFalseColor = '#9598BE';
  const dispatch = useAppDispatch();
  const growthEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.growthEnabled),
  );
  const developmentEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.developmentEnabled),
  );
  const vchcEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.vchcEnabled),
  );
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const allDataDownloadFlag = useAppSelector((state: any) =>
  (state.utilsData.allDataDownloadFlag),
);
  const localNotifications = useAppSelector((state: any) => state.notificationData.localNotifications);
  const scheduledlocalNotifications = useAppSelector((state: any) => state.notificationData.scheduledlocalNotifications);

  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isImportRunning, setIsImportRunning] = useState(false);
  const [isExportAlertVisible, setExportAlertVisible] = useState(false);
  const [isImportAlertVisible, setImportAlertVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState<any>('');
  const [language, setlanguage] = useState<any>('');
  const actionSheetRef = createRef<any>();
  const actionSheetRefImport = createRef<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const [profileLoading,setProfileLoading] = React.useState(false);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const netInfoval = useNetInfoHook();
  const weeklyDownloadDate = useAppSelector(
    (state: any) => state.utilsData.weeklyDownloadDate,
  );
  const monthlyDownloadDate = useAppSelector(
    (state: any) => state.utilsData.monthlyDownloadDate,
  );
  const incrementalSyncDT = useAppSelector((state: any) =>
      (state.utilsData.incrementalSyncDT),
    );

  const lastUpdatedDate = weeklyDownloadDate < monthlyDownloadDate ? weeklyDownloadDate : monthlyDownloadDate;

  const importAllData = async () => {
    setIsImportRunning(true);
    await backup.import(props.navigation, languageCode, dispatch, child_age, genders);
    setIsImportRunning(false);
    actionSheetRefImport.current?.setModalVisible(false);
  }

  const exportFile = async () => {
    //need to add code.
    setIsExportRunning(true);
    const userRealmPath = userRealmCommon.realm?.path;
    if (!userRealmPath) return false;
    const realmContent = await RNFS.readFile(userRealmPath, 'base64');
    // export via file system
    if (Platform.OS === "android") {
       const file = await ScopedStorage.openDocumentTree(true);
       const uri: any = await ScopedStorage.getPersistedUriPermissions();
       console.log(uri,"..uri");
      try{
      const fileDownload: any = await ScopedStorage.writeFile(file.uri,"my.backup","*/*",realmContent,'base64',false);
      const uri1: any = await ScopedStorage.getPersistedUriPermissions();
      console.log(uri1, "..uri..");
      console.log(fileDownload.split(/[#?]/)[0].split('.').pop().trim(), "..fileDownload..");
      if (fileDownload!=""  && fileDownload!=null && fileDownload!=undefined) {
        Alert.alert('', t('settingExportSuccess'));
        setIsExportRunning(false);
      }
      else {
        Alert.alert('', t('settingExportError'));
        setIsExportRunning(false);
      }
    }
    catch(e:any){
       console.log('', e.message);
       setIsExportRunning(false);
    }
    }
    else {
        RNFS.writeFile(tempbackUpPath, realmContent, 'base64').then(async (res:any)=>{
          console.log(res,"..res..")
          const shareOptions = {
            title: 'Backup File',
            url: tempbackUpPath,
            saveToFiles:true,
            failOnCancel:false
          };
          try {
          const ShareResponse = await Share.open(shareOptions);
          setIsExportRunning(false);
          if(ShareResponse && ShareResponse.success){
          Alert.alert('', t('settingExportSuccess'));
          await RNFS.exists(tempbackUpPath).then((exists) => {
           console.log(String(exists),"..exists..")
            if (exists) {
                RNFS.unlink(tempbackUpPath).then(() => {
                   //RNFS.scanFile(tempbackUpPath);
                })
             }
          });
          }
          else{
            Alert.alert('', t('settingExportError'));
          }
        } catch (error:any) {
          setIsExportRunning(false);
          if (error.error && error.error.code === "ECANCELLED500") {
            console.log("canceled");
        } else {
          Alert.alert('', t('settingExportError'));
        }
        }
          }).catch((e)=>{
            console.log(e)
            setIsExportRunning(false);
            Alert.alert('', t('settingExportError'));
          });
  
    
    }
  }
  const onExportCancel = () => {
    setExportAlertVisible(false);
  }
  const onImportCancel = () => {
    setImportAlertVisible(false);
  }
  const exportToDrive = async () => {
    setIsExportRunning(true);
    const exportIsSuccess = await backup.export();
    setIsExportRunning(false);
    if (!exportIsSuccess) {
      Alert.alert('', t('settingExportError'));
    } else {
      Alert.alert('', t('settingExportSuccess'));
    }
    actionSheetRef.current?.setModalVisible(false);
  }
  const handleExportAlertConfirm = () => {
    setExportAlertVisible(false);
    exportToDrive();
  };
  const handleImportAlertConfirm = async () => {
    setImportAlertVisible(false);
    importAllData()
  };
  const exportAllData = async () => {

    actionSheetRef.current?.setModalVisible();

  };
  const toggleSwitch = () => {
    if (vchcEnabledFlag == true || growthEnabledFlag == true || developmentEnabledFlag == true) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const toggleGrowthFutureNotiData = async (callCreateLocalNoti:boolean) => {
    //toggle isDeleted flag from gwcdnotis where type = 'gw'
    let currscheduledlocalNotifications = [...scheduledlocalNotifications];
    const childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    const allnotis = [...storedata.notificationData.notifications];
    childList?.map((child: any) => {
      const currentChildNotis = { ...allnotis.find((item) => item.childuuid == child.uuid) }
      const currentChildIndex = allnotis.findIndex((item) => item.childuuid == child.uuid)
      const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
      if (notiExist) {
        if (currentChildNotis.gwcdnotis.length > 0) {
          currentChildNotis.gwcdnotis = [...currentChildNotis.gwcdnotis]?.map((item) => {
            if (item.type == 'gw') {
              const difftoToday = Math.round(DateTime.fromJSDate(new Date(item.notificationDate)).diff(DateTime.fromJSDate(new Date()), 'days').days);
              // growthEnabledFlag == false checked because state update of growthEnabledFlag istaking time
              if (isFutureDate((item.notificationDate))) {
                return { ...item, isDeleted: growthEnabledFlag == false ? false : true };
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
          })
        }
      }
      localNotifications.map((y:any)=>{
        // growthEnabledFlag == true checked because state update of growthEnabledFlag istaking time
        if(growthEnabledFlag == true) {
          const notiToDelete = y.data.filter((o:any)=>o.type=='gw');
          notiToDelete.map((n:any)=>{
            if((currscheduledlocalNotifications.findIndex((m:any)=> m.notiid == n.notiid)) > -1)
            {
              LocalNotifications.cancelReminderLocalNotification(n.notiid);
              currscheduledlocalNotifications = currscheduledlocalNotifications.filter((m:any)=> m.notiid != n.notiid);
              console.log("removed noti1---",currscheduledlocalNotifications);
            }
          })
        }
      })

      allnotis[currentChildIndex] = currentChildNotis
    });
    dispatch(setAllScheduledLocalNotificationData(currscheduledlocalNotifications));
    dispatch(setAllNotificationData(allnotis));
    if(callCreateLocalNoti == true) {
      const localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: 'all'};
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    }
  }
  const togglecdFutureNotiData = async (callCreateLocalNoti:boolean) => {
    //toggle isDeleted flag from gwcdnotis where type = 'cd'
    let currscheduledlocalNotifications = [...scheduledlocalNotifications];
    const childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    const allnotis = [...storedata.notificationData.notifications];
    childList?.map((child: any) => {
      const currentChildNotis = { ...allnotis.find((item) => item.childuuid == child.uuid) }
      const currentChildIndex = allnotis.findIndex((item) => item.childuuid == child.uuid)
      const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
      if (notiExist) {
        if (currentChildNotis.gwcdnotis.length > 0) {
          currentChildNotis.gwcdnotis = [...currentChildNotis.gwcdnotis]?.map((item) => {
            if (item.type == 'cd') {
              const difftoToday = Math.round(DateTime.fromJSDate(new Date(item.notificationDate)).diff(DateTime.fromJSDate(new Date()), 'days').days);
              // developmentEnabledFlag == false checked because state update of developmentEnabledFlag istaking time
              if (isFutureDate(new Date(item.notificationDate))) {
                return { ...item, isDeleted: developmentEnabledFlag == false ? false : true };
              } else if (difftoToday == 0) {
                if (developmentEnabledFlag == false) {
                  return { ...item, isDeleted: false };
                } else {
                  return { ...item };
                }
              }
              else {
                return { ...item };
              }
            } else {
              return { ...item };
            }
          })
        }
      }
      localNotifications.map((y:any)=>{
        // developmentEnabledFlag == true checked because state update of developmentEnabledFlag istaking time
        if(developmentEnabledFlag == true) {
          const notiToDelete = y.data.filter((o:any)=>o.type=='cd');
          notiToDelete.map((n:any)=>{
            if((currscheduledlocalNotifications.findIndex((m:any)=> m.notiid == n.notiid)) > -1)
            {
              LocalNotifications.cancelReminderLocalNotification(n.notiid);
              currscheduledlocalNotifications = currscheduledlocalNotifications.filter((m:any)=> m.notiid != n.notiid);
              console.log("removed noti---",currscheduledlocalNotifications);
            }
          })
        }
      })

      allnotis[currentChildIndex] = currentChildNotis
    });
    dispatch(setAllScheduledLocalNotificationData(currscheduledlocalNotifications));
    dispatch(setAllNotificationData(allnotis));
    if(callCreateLocalNoti == true) {
      const localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: 'all'};
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    }
  }
  const toggleVCHCVCRHCRFutureNotiData = async (callCreateLocalNoti:boolean) => {
    //toggle isDeleted flag from reminderNotis,hcnotis,vchcnotis
    let currscheduledlocalNotifications = [...scheduledlocalNotifications];
    const childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    const allnotis = [...storedata.notificationData.notifications];
    childList?.map((child: any) => {
      const currentChildNotis = { ...allnotis.find((item) => item.childuuid == child.uuid) }
      const currentChildIndex = allnotis.findIndex((item) => item.childuuid == child.uuid)
      const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
      if (notiExist) {
        if (currentChildNotis.vcnotis.length > 0) {
          currentChildNotis.vcnotis = [...currentChildNotis.vcnotis]?.map((item) => {
            const difftoToday = Math.round(DateTime.fromJSDate(new Date(item.notificationDate)).diff(DateTime.fromJSDate(new Date()), 'days').days);
            // vchcEnabledFlag == false checked because state update of vchcEnabledFlag istaking time
            if (isFutureDate(new Date(item.notificationDate))) {
              return { ...item, isDeleted: vchcEnabledFlag == false ? false : true };
            }

            else if (difftoToday == 0) {
              if (vchcEnabledFlag == false) {
                return { ...item, isDeleted: false };
              } else {
                return { ...item };
              }
            } else {
              return { ...item };
            }
          })
        }
        if (notiExist.hcnotis.length > 0) {
          currentChildNotis.hcnotis = [...currentChildNotis.hcnotis]?.map((item) => {
            const difftoToday = Math.round(DateTime.fromJSDate(new Date(item.notificationDate)).diff(DateTime.fromJSDate(new Date()), 'days').days);
            // vchcEnabledFlag == false checked because state update of vchcEnabledFlag istaking time
            if (isFutureDate(new Date(item.notificationDate))) {
              return { ...item, isDeleted: vchcEnabledFlag == false ? false : true };
            } else if (difftoToday == 0) {
              if (vchcEnabledFlag == false) {
                return { ...item, isDeleted: false };
              } else {
                return { ...item };
              }
            } else {
              return { ...item };
            }
          })
        }
        if (notiExist.reminderNotis.length > 0) {
          if(vchcEnabledFlag == true) {
            //cancel all local notifications
            LocalNotifications.cancelAllReminderLocalNotification();
          }
          currentChildNotis.reminderNotis = [...currentChildNotis.reminderNotis]?.map((item) => {
            console.log(vchcEnabledFlag,"----vchcEnabledFlag");
            // vchcEnabledFlag == false checked because state update of vchcEnabledFlag istaking time
            if(vchcEnabledFlag == false) {
              //enable future notifications
              console.log(item,'---isfuture date4 ---',isFutureDateTime(new Date(item.notificationDate)));
              if(item.subtype == 'reminder' && isFutureDateTime(new Date(item.notificationDate)))
              {
                const titlevcr = t('vcrNoti2', {reminderDateTime: formatStringDate(item.periodName) + "," + formatStringTime(item.growth_period)});
                const titlehcr = t('hcrNoti2', {reminderDateTime: formatStringDate(item.periodName) + "," + formatStringTime(item.growth_period)});
                const message = item.type == 'vaccine' ? titlevcr : titlehcr;
                LocalNotifications.schduleNotification(new Date(item.notificationDate),t('remindersAlertTitle'),message,DateTime.fromJSDate(new Date(item.notificationDate)).toMillis(),item.type == 'vaccine' ? 'vcr' : 'hcr',child.uuid);
              }
            }
            if (isFutureDateTime(new Date(item.notificationDate))) {
              return { ...item, isDeleted: vchcEnabledFlag == false ? false : true };
            } 
            else {
              return { ...item };
            }
          })
        }
        localNotifications.map((y:any)=>{
          // vchcEnabledFlag == true checked because state update of vchcEnabledFlag istaking time
          if(vchcEnabledFlag == true) {
            const notiToDelete = y.data.filter((o:any)=>o.type=='vc' || o.type=='hc');
            notiToDelete.map((n:any)=>{
              if((currscheduledlocalNotifications.findIndex((m:any)=> m.notiid == n.notiid)) > -1)
              {
                LocalNotifications.cancelReminderLocalNotification(n.notiid);
                currscheduledlocalNotifications = currscheduledlocalNotifications.filter((m:any)=> m.notiid != n.notiid);
                console.log("removed noti---",currscheduledlocalNotifications);
              }
            })
          }
        })
      }
      allnotis[currentChildIndex] = currentChildNotis
    });
    dispatch(setAllScheduledLocalNotificationData(currscheduledlocalNotifications));
    dispatch(setAllNotificationData(allnotis));
    if(callCreateLocalNoti == true) {
      const localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: 'all'};
      dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
    }
  }
  const toggleAllNotis = () => {
    if (isEnabled == true) {
      const obj = { key: 'growthEnabled', value: false };
      dispatch(toggleNotificationFlags(obj));
      const obj1 = { key: 'developmentEnabled', value: false };
      dispatch(toggleNotificationFlags(obj1));
      const obj2 = { key: 'vchcEnabled', value: false };
      dispatch(toggleNotificationFlags(obj2));
      setIsEnabled(false);
      analytics().logEvent(GROWTH_NOTIFICATION_OFF)
      analytics().logEvent(DEVELOPMENT_NOTIFICATION_OFF)
      analytics().logEvent(VACCINE_HEALTHCHECKUP_NOTIFICATION_OFF)
    } else {
      const obj = { key: 'growthEnabled', value: true };
      dispatch(toggleNotificationFlags(obj));
      const obj1 = { key: 'developmentEnabled', value: true };
      dispatch(toggleNotificationFlags(obj1));
      const obj2 = { key: 'vchcEnabled', value: true };
      dispatch(toggleNotificationFlags(obj2));
      setIsEnabled(true);
      analytics().logEvent(GROWTH_NOTIFICATION_ON)
      analytics().logEvent(DEVELOPMENT_NOTIFICATION_ON)
      analytics().logEvent(VACCINE_HEALTHCHECKUP_NOTIFICATION_ON)
    }
    toggleGrowthFutureNotiData(false);
    togglecdFutureNotiData(false);
    toggleVCHCVCRHCRFutureNotiData(false);
    const localnotiFlagObj = { generateFlag: true,generateType: 'add',childuuid: 'all'};
    dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
  }
  const toggleDataSaverSwitch = () => {
    dispatch(onNetworkStateChange(!toggleSwitchVal));
  }

  const downloadUpdatedData = () => {
    Alert.alert(t('downloadUpdatePopupTitle'), t('downloadUpdatePopupText'),
      [
        {
          text: t('downloadUpdateCancelPopUpBtn'),
          onPress: () => {
          console.log("on pressed")
          },
          style: "cancel"
        },
        {
          text: t('downloadUpdateContinueBtn'), onPress: async () => {
            props.navigation.navigate('LoadingScreen', {
              apiJsonData: allApisObject(true,incrementalSyncDT),
              prevPage: 'DownloadUpdate'
            });
          }
        }
      ]
    );
  }

  const downloadAllData = () => {
    Alert.alert(t('downloadAllPopupTitle'), t('downloadAllPopupText'),
      [
        {
          text: t('downloadAllCancelPopUpBtn'),
          onPress: () => {
            console.log("on pressed")
          },
          style: "cancel"
        },
        {
          text: t('downloadAllContinueBtn'), onPress: async () => {
            props.navigation.navigate('LoadingScreen', {
              apiJsonData: allDataDownloadFlag == false ? allApisObject(false,incrementalSyncDT) : allApisObject(true,incrementalSyncDT),
              prevPage: 'DownloadAllData'
            });
          }
        }
      ]
    );
  }

 
  useEffect(() => {
    const selectedCountry: any = localization.find(
      (country:any) => country.countryId === countryId,
    );
    setCountry(selectedCountry);
    const selectedLanguage: any = selectedCountry.languages.find(
      (language: any) => language.languageCode === languageCode,
    );
    setlanguage(selectedLanguage);
    toggleSwitch();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      toggleSwitch();
    }, [developmentEnabledFlag, growthEnabledFlag, vchcEnabledFlag])
  );
  const handleError = (err: any) => {
    console.log(err,"..err")
    
    if (DocumentPicker.isCancel(err)) {
      console.log('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.log('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  };
  const importFromSettingsFile =async() => {
    if(Platform.OS=="android"){
    const dataset=await ScopedStorage.openDocument(true,'base64');
    console.log(dataset,"..dataset");
    if (dataset && dataset.data!="" && dataset.data!=null && dataset.data!=undefined) {
      const exportedFileContentRealm: any = await RNFS.writeFile(tempRealmFile,  dataset.data, "base64");
      let importedrealm=await new Realm({ path:'user1.realm' });
      if(importedrealm){
        importedrealm.close();
      }
      importedrealm=await new Realm({ path:'user1.realm' });
      const user1Path = importedrealm.path;
      console.log(user1Path, "..user1Path")
      const oldChildrenData = importedrealm.objects('ChildEntity');
      console.log(exportedFileContentRealm, "..exportedFileContentRealm..")
      console.log(oldChildrenData, "..newoldChildrenData..")
      setIsImportRunning(true);
      if(oldChildrenData.length>0){
        await userRealmCommon.openRealm();
        await userRealmCommon.deleteAllAtOnce();
        const importResponse = await backup.importFromFile(oldChildrenData, props.navigation, genders, dispatch, child_age, languageCode);
        console.log(importResponse, "..importResponse");
      }
      setIsImportRunning(false);
      actionSheetRefImport.current?.setModalVisible(false);

    }
    }
    else{
      DocumentPicker.pick({
        allowMultiSelection: false,
        type: DocumentPicker.types.allFiles,
      })
        .then(async (res:any)=>{
          
          if (res.length > 0 && res[0].uri) {
            const exportedFileContent: any = await RNFS.readFile(decodeURIComponent(res[0].uri), 'base64');
            const exportedFileContentRealm: any = await RNFS.writeFile(tempRealmFile, exportedFileContent, "base64");
            console.log(exportedFileContentRealm, "..exportedFileContentRealm..");
            let importedrealm=await new Realm({ path:'user1.realm' });
            if(importedrealm){
              importedrealm.close();
            }
            importedrealm=await new Realm({ path:'user1.realm' });
            const user1Path = importedrealm.path;
            console.log(user1Path, "..user1Path")
            const oldChildrenData = importedrealm.objects('ChildEntity');
            console.log(oldChildrenData, "..newoldChildrenData..")
            setIsImportRunning(true);
            if(oldChildrenData.length>0){
            await userRealmCommon.openRealm();
            await userRealmCommon.deleteAllAtOnce();
            const importResponse = await backup.importFromFile(oldChildrenData, props.navigation, genders, dispatch, child_age, languageCode);
            console.log(importResponse, "..importResponse");
            }
            setIsImportRunning(false);
            actionSheetRefImport.current?.setModalVisible(false);
          }
        })
        .catch(handleError);
    }
   
  }
  return (
    <>
      <View style={[styles.flex1,{backgroundColor: primaryColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <TabScreenHeader
          title={t('settingScreenheaderTitle')}
          headerColor={primaryColor}
          textColor="#FFF"
          setProfileLoading={setProfileLoading}
        />

        <ScrollView style={[styles.flex1,styles.bgColorWhite]}>
          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreennotiHeaderText')}</Heading1>
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
                    {t('settingScreennotiType1')}
                  </Heading4Regular>
                </ToggleLabelText>
              </FDirRowStart>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      const obj = { key: 'growthEnabled', value: growthEnabledFlag == true ? false : true };
                      dispatch(toggleNotificationFlags(obj));
                      toggleGrowthFutureNotiData(true);
                      if (vchcEnabledFlag == false && growthEnabledFlag == true && developmentEnabledFlag == false) {
                        setIsEnabled(false);
                      } else {
                        setIsEnabled(true);
                      }
                      if (growthEnabledFlag == true) {
                        analytics().logEvent(GROWTH_NOTIFICATION_ON)
                      } else {
                        analytics().logEvent(GROWTH_NOTIFICATION_OFF)
                      }
                    }}>
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
                  <ToggleLabelText1 >
                    <Heading4Regular>
                      {t('settingScreennotiType2')}
                    </Heading4Regular>
                  </ToggleLabelText1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      const obj = { key: 'developmentEnabled', value: developmentEnabledFlag == true ? false : true };
                      dispatch(toggleNotificationFlags(obj));
                      togglecdFutureNotiData(true);
                      if (vchcEnabledFlag == false && growthEnabledFlag == false && developmentEnabledFlag == true) {
                        setIsEnabled(false);
                      } else {
                        setIsEnabled(true);
                      }
                      if (developmentEnabledFlag == true) {
                        analytics().logEvent(DEVELOPMENT_NOTIFICATION_ON)
                      } else {
                        analytics().logEvent(DEVELOPMENT_NOTIFICATION_OFF)
                      }

                    }}>
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
                      {t('settingScreennotiType3')}
                    </Heading4Regular>
                  </ToggleLabelText1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      const obj = { key: 'vchcEnabled', value: vchcEnabledFlag == true ? false : true };
                      dispatch(toggleNotificationFlags(obj));
                      toggleVCHCVCRHCRFutureNotiData(true);
                      if (vchcEnabledFlag == true && growthEnabledFlag == false && developmentEnabledFlag == false) {
                        setIsEnabled(false);
                      } else {
                        setIsEnabled(true);
                      }
                      if (vchcEnabledFlag == true) {
                        analytics().logEvent(VACCINE_HEALTHCHECKUP_NOTIFICATION_ON)
                      } else {
                        analytics().logEvent(VACCINE_HEALTHCHECKUP_NOTIFICATION_OFF)
                      }
                    }}>
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
                      {t('settingScreennotiType4')}
                    </Heading4Regular>
                  </ToggleLabelText1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <View>
              <Heading4Regular>{t('settingScreennotiInfo')}</Heading4Regular>
            </View>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreendataSaverHeaderText')}</Heading1>
            </SettingHeading>

            <ShiftFromBottom10>
              <FDirRowStart>
                <Switch
                  trackColor={{ false: trackFalseColor, true: trackTrueColor }}
                  thumbColor={toggleSwitchVal ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleDataSaverSwitch}
                  value={toggleSwitchVal}
                />
                <ToggleLabelText>
                  <Heading4Regular>
                    {t('settingScreendataSaverSubText')}
                  </Heading4Regular>
                </ToggleLabelText>
              </FDirRowStart>
            </ShiftFromBottom10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreendownldHeaderText')}</Heading1>
            </SettingHeading>
            <Heading4>{t('settingScreendownldSubHeaderText')}</Heading4>
            <Heading6>
              {t('settingScreendownldlast', {
                downloadDate: formatStringDate(new Date(lastUpdatedDate)),
              })}
            </Heading6>
            <ShiftFromTop10>
              {/* <ButtonPrimary onPress={() => { downloadUpdatedData() }}> */}
              <ButtonPrimary onPress={() => {
                if (netInfoval && netInfoval.isConnected == true) {
                  downloadUpdatedData()
                }
                else {
                  Alert.alert('', t('noInternet'));
                }
              }}>
                <ButtonText numberOfLines={2}>{t('settingScreendownldupdateBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
            <ShiftFromTop10>
              <Heading4>{t('settingScreendownldSubHeader2Text')}</Heading4>
              <Heading6>{t('settingScreendownldSubHeader3Text')}</Heading6>
            </ShiftFromTop10>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => { if (netInfoval && netInfoval.isConnected == true) {
                    downloadAllData()
                  }
                  else {
                    Alert.alert('', t('noInternet'));
                  }
                }}>
                <ButtonText numberOfLines={2}>{t('settingScreendownldallBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <FlexDirRowSpace>
                <Heading1>{t('settingScreenlocalizationHeader')}</Heading1>
                <IconAreaPress onPress={() => {
                  setModalVisible(true)
                }}>
                  <Icon name="ic_edit" size={16} color="#000" />
                </IconAreaPress>
              </FlexDirRowSpace>
            </SettingHeading>
            <ShiftFromTopBottom5>
              <FDirRow>
                <Flex2>
                  <Heading3Regular>{t('country')}</Heading3Regular>
                </Flex2>
                <Flex3>
                  <Heading3>{country.displayName}</Heading3>
                </Flex3>
              </FDirRow>
            </ShiftFromTopBottom5>
            <ShiftFromTopBottom5>
              <FDirRow>
                <Flex2>
                  <Heading3Regular>{t('language')}</Heading3Regular>
                </Flex2>
                <Flex3>
                  <Heading3>{language.displayName}</Heading3>
                </Flex3>
              </FDirRow>
            </ShiftFromTopBottom5>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <Heading1>{t('settingScreenieHeader')}</Heading1>
            </SettingHeading>
            <ShiftFromTopBottom10>
              <ButtonPrimary
                disabled={isExportRunning || isImportRunning}
                onPress={() => { exportAllData(); }}>
                <ButtonText numberOfLines={2}>{t('settingScreenexportBtnText')}</ButtonText>
              </ButtonPrimary>

            </ShiftFromTopBottom10>
            <ShiftFromTopBottom10>
              <ButtonPrimary disabled={isExportRunning || isImportRunning} onPress={() => {
                actionSheetRefImport.current?.setModalVisible(true);
              }}>
                <ButtonText numberOfLines={2}>{t('settingScreenimportBtnText')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTopBottom10>
            <OverlayLoadingComponent loading={(isExportRunning || isImportRunning) ? true : false} />
          </MainContainer>

          <ActionSheet ref={actionSheetRef}>
            <BannerContainer>
              <SettingHeading>
                <Heading1>{t('settingScreenexportOptionHeader')}</Heading1>
              </SettingHeading>
              <SettingShareData>
                <FDirRow>
                  <SettingOptions>
                    <Pressable onPress={async () => {
                      console.log("icon clicked");
                      try {
                        if (Platform.OS === "android") {
                          console.log("1233");
                          
                            console.log("You can write");
                            actionSheetRef.current?.setModalVisible(false);
                            exportFile();
                        }
                        else {
                          actionSheetRef.current?.setModalVisible(false);
                         setTimeout(()=>{
                            exportFile();
                          },350)
                        }

                      } catch (err) {
                        console.warn(err);
                      }
                    }}>
                     <VectorImage source={require('@assets/svg/ic_file.svg')} />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('settingScreenshareBtntxt')}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                  <SettingOptions>
                    <Pressable onPress={() => {
                      actionSheetRef.current?.setModalVisible(false);
                      if (netInfoval && netInfoval.isConnected == true) {
                        Platform.OS=='ios'? setTimeout(()=>{
                          setExportAlertVisible(true);
                        },350) : setExportAlertVisible(true);
                      }
                      else {
                        Alert.alert('', t('noInternet'));
                      }

                    }}>
                      <VectorImage
                        source={require('@assets/svg/ic_gdrive.svg')}
                      />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('settingScreengdriveBtntxt')}
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
                <Heading1>{t('settingScreenimportOptionHeader')}</Heading1>
              </SettingHeading>
              <SettingShareData>
                <FDirRow>
                  <SettingOptions>
                    <Pressable onPress={() => {
                      console.log("icon clicked");
                      actionSheetRefImport.current?.setModalVisible(false);
                      setTimeout(async () => {

                        try {
                          //import
                          if (Platform.OS === "android") {
                            console.log("1233");
                              importFromSettingsFile();
                          }
                          else {
                            importFromSettingsFile();
                          }


                        } catch (err) {
                          if (DocumentPicker.isCancel(err)) {
                            // User cancelled the picker, exit any dialogs or menus and move on
                          } else {
                            throw err
                          }
                        }
                      }, 350);

                    }}>
                     
                      <VectorImage source={require('@assets/svg/ic_file.svg')} />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('importBtntxt')}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                  <SettingOptions>
                    <Pressable onPress={() => {
                      actionSheetRefImport.current?.setModalVisible(false);
                      if (netInfoval && netInfoval.isConnected == true) {

                        Platform.OS=='ios'? setTimeout(()=>{
                        setImportAlertVisible(true);
                      },350) : setImportAlertVisible(true);
                     
                      }
                      else {
                        Alert.alert('', t('noInternet'));
                      }

                    }}>
                      <VectorImage
                        source={require('@assets/svg/ic_gdrive.svg')}
                      />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('settingScreengdriveBtntxt')}
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
          onRequestClose={() => {
            setModalVisible(false);
          }}
          onDismiss={() => {
            setModalVisible(false);
          }}>
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              <ModalPopupContent>
                <Heading4Centerr>
                  {t('localizationChangeModalText')}
                </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
                <ButtonModal
                  onPress={() => {
                    setModalVisible(false);
                    props.navigation.navigate('Localization',
                      {
                        screen: localization.length == 1 ? 'LanguageSelection' : 'CountrySelection',
                        params: { country: null, language: null }
                      });
                  }}>
                  <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                </ButtonModal>
              </FDirRow>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        <AlertModal loading={isExportAlertVisible} disabled={isExportRunning || isImportRunning} message={t("dataConsistency")} title={t('exportText')} cancelText={t("retryCancelPopUpBtn")} onConfirm={handleExportAlertConfirm} onCancel={onExportCancel}></AlertModal>
        <AlertModal loading={isImportAlertVisible} disabled={isExportRunning || isImportRunning} message={t("dataConsistency")} title={t('importText')} cancelText={t("retryCancelPopUpBtn")} onConfirm={handleImportAlertConfirm} onCancel={onImportCancel}></AlertModal>
        <OverlayLoadingComponent loading={profileLoading}/>
      </View>
    </>
  );
};

export default SettingScreen;

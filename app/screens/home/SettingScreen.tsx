import { DEVELOPMENT_NOTIFICATION, GROWTH_NOTIFICATION, VACCINE_HEALTHCHECKUP_NOTIFICATION } from '@assets/data/firebaseEvents';
import { appConfig } from '@assets/translations/appOfflineData/apiConstants';
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
  MainContainer,
  SafeAreaContainer
} from '@components/shared/Container';
import {
  FDirRow,
  FDirRowStart,
  Flex1,
  Flex2,
  Flex3,
  FlexDirRowSpace
} from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  SettingHeading,
  SettingOptions,
  SettingShareData
} from '@components/shared/SettingsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import analytics from '@react-native-firebase/analytics';
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
  ShiftFromTop10,
  ShiftFromTop20,
  ShiftFromTopBottom10,
  ShiftFromTopBottom5,
  SideSpacing10
} from '@styles/typography';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, Pressable, ScrollView, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import RNFS from 'react-native-fs';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { store, useAppDispatch, useAppSelector } from '../../../App';
import { localization } from '../../assets/data/localization';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { onNetworkStateChange } from '../../redux/reducers/bandwidthSlice';
import { setAllNotificationData, toggleNotificationFlags } from '../../redux/reducers/notificationSlice';
import { backup } from '../../services/backup';
import { getAllChildren, isFutureDate } from '../../services/childCRUD';
import { formatStringDate } from '../../services/Utils';
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
  console.log(toggleSwitchVal, "..toggleSwitchVal..");
  const { t, i18n } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDataSaverEnabled, setIsDataSaverEnabled] = useState(false);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isImportRunning, setIsImportRunning] = useState(false);
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
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

  const lastUpdatedDate = weeklyDownloadDate < monthlyDownloadDate ? weeklyDownloadDate : monthlyDownloadDate;
  const apiJsonData = [
    {
      apiEndpoint: appConfig.sponsors,
      method: 'get',
      postdata: {},
      saveinDB: false,
    },
    {
      apiEndpoint: appConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.basicPages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.videoArticles,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.dailyMessages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.activities,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.surveys,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestones,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childDevelopmentData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinations,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthCheckupData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinePinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childGrowthPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childdevGirlPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childdevBoyPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthcheckupPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestoneRelatedArticle,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.standardDeviation,
      method: 'get',
      postdata: {},
      saveinDB: true,
    }
  ];
  const importAllData = async () => {
    Alert.alert(t('importText'), t("dataConsistency"),
      [
        {
          text: t("retryCancelPopUpBtn"),
          onPress: () => {

          },
          style: "cancel"
        },
        {
          text: t('continueCountryLang'), onPress: async () => {
            console.log(userRealmCommon.realm?.path, "..path")
            // this.setState({ isImportRunning: true, });
            setIsImportRunning(true);
            const importResponse = await backup.import(props.navigation, languageCode, dispatch, child_age, genders);
            console.log(importResponse, "..importResponse");
            // this.setState({ isImportRunning: false, });
            setIsImportRunning(false);
          }
        }
      ]
    );
  }

  const exportFile = async () => {
    //need to add code.
    // Alert.alert('Coming Soon');
    setIsExportRunning(true);
    var path = RNFS.DocumentDirectoryPath + '/my.backup';
    const userRealmPath = userRealmCommon.realm?.path;
    console.log(userRealmPath, "..userRealmPath")
    if (!userRealmPath) return false;

    // Get realmContent
    const realmContent = await RNFS.readFile(userRealmPath, 'base64');
    console.log(realmContent, "..11realmContent")

    // write the file
    RNFS.writeFile(path, realmContent, 'base64')
      .then((success) => {
        setIsExportRunning(false);
        Alert.alert('', t('settingExportSuccess'));
      })
      .catch((err) => {
        setIsExportRunning(false);
        Alert.alert('', t('settingExportError'))
      });
  }
  const exportToDrive = async () => {
    Alert.alert(t('exportText'), t("dataConsistency"),
      [
        {
          text: t("retryCancelPopUpBtn"),
          onPress: () => {

          },
          style: "cancel"
        },
        {
          text: t('continueCountryLang'), onPress: async () => {
            setIsExportRunning(true);
            const exportIsSuccess = await backup.export();
            setIsExportRunning(false);
            if (!exportIsSuccess) {
              Alert.alert('', t('settingExportError'))
              // ToastAndroid.show(t('settingExportError'), 6000);
            } else {
              Alert.alert('', t('settingExportSuccess'));

            };
          }
        }
      ]
    );
    // actionSheetRef.current?.setModalVisible(false); 
  }
  const exportAllData = async () => {

    actionSheetRef.current?.setModalVisible();

  };
  const toggleSwitch = () => {
    // console.log(growthEnabledFlag, "..growthEnabledFlag")
    // console.log(developmentEnabledFlag, "..developmentEnabledFlag")
    // console.log(vchcEnabledFlag, "..vchcEnabledFlag")
    if (vchcEnabledFlag == true && growthEnabledFlag == true && developmentEnabledFlag == true) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }
  let childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  // let allnotifications = useAppSelector((state: any) => state.notificationData.notifications);
  const toggleGrowthFutureNotiData = async () => {
    //toggle isDeleted flag from gwcdnotis where type = 'gw'
    let childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    let allnotis = [...storedata.notificationData.notifications];
    console.log(allnotis, "..childListallnotis..")
    childList.map((child: any) => {
    let currentChildNotis = { ...allnotis.find((item) => item.childuuid == child.uuid) }
    let currentChildIndex = allnotis.findIndex((item) => item.childuuid == child.uuid)
      let notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
      if (notiExist) {
        if (currentChildNotis.gwcdnotis.length > 0) {
          currentChildNotis.gwcdnotis = [...currentChildNotis.gwcdnotis]?.map((item) => {
            if (item.type == 'gw') {
              // console.log(isFutureDate(new Date(item.notificationDate)),"isFutureDate")
              if(isFutureDate((item.notificationDate))){
                return { ...item, isDeleted: item.isDeleted == true ? false : true };
              }else{
                return {...item};
              }
            }else{
              return {...item};
            }
          })
        }
      }
      // currentChildNotis.gwcdnotis = currentChildNotis.gwcdnotis;
      allnotis[currentChildIndex] = currentChildNotis
      console.log(allnotis, "allNotifications>toggleGrowthFutureNotiData");
    });
    dispatch(setAllNotificationData(allnotis));
  }
  const togglecdFutureNotiData = async () => {
    //toggle isDeleted flag from gwcdnotis where type = 'cd'

    let childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    let allnotis = [...storedata.notificationData.notifications];
    // console.log(childList, "..childList..")
    childList.map((child: any) => {
      let currentChildNotis = { ...allnotis.find((item) => item.childuuid == child.uuid) }
      let currentChildIndex = allnotis.findIndex((item) => item.childuuid == child.uuid)
      const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
      if (notiExist) {
        if (currentChildNotis.gwcdnotis.length > 0) {
          currentChildNotis.gwcdnotis =  [...currentChildNotis.gwcdnotis]?.map((item) => {
            if (item.type == 'cd') {
              if(isFutureDate(new Date(item.notificationDate))){
                return { ...item, isDeleted: item.isDeleted == true ? false : true };
              }else{
                return {...item};
              }
            }else{
              return {...item};
            }
          })
        }
      }
      allnotis[currentChildIndex] = currentChildNotis
      console.log(allnotis, "allNotifications>togglecdFutureNotiData");
    });
    dispatch(setAllNotificationData(allnotis));
  }
  const toggleVCHCVCRHCRFutureNotiData = async () => {
    //toggle isDeleted flag from reminderNotis,hcnotis,vchcnotis
    let childList = await getAllChildren(dispatch, childAge, 1);
    const storedata = store.getState();
    let allnotis = [...storedata.notificationData.notifications];
    console.log(childList, "..childList..")
    childList.map((child: any) => {
      let currentChildNotis = { ...allnotis.find((item) => item.childuuid == child.uuid) }
      let currentChildIndex = allnotis.findIndex((item) => item.childuuid == child.uuid)
      const notiExist = allnotis.find((item) => String(item.childuuid) == String(child.uuid))
      if (notiExist) {
        if (currentChildNotis.vcnotis.length > 0) {
          currentChildNotis.vcnotis = [...currentChildNotis.vcnotis]?.map((item) => {
              if(isFutureDate(new Date(item.notificationDate))){
                return { ...item, isDeleted: item.isDeleted == true ? false : true };
              }else{
                return {...item};
              }
          })
        }
        if (notiExist.hcnotis.length > 0) {
          currentChildNotis.hcnotis = [...currentChildNotis.hcnotis]?.map((item) => {
              if(isFutureDate(new Date(item.notificationDate))){
                return { ...item, isDeleted: item.isDeleted == true ? false : true };
              }else{
                return {...item};
              }
          })
        }
        if (notiExist.reminderNotis.length > 0) {
          currentChildNotis.reminderNotis = [...currentChildNotis.reminderNotis]?.map((item) => {
              if(isFutureDate(new Date(item.notificationDate))){
                return { ...item, isDeleted: item.isDeleted == true ? false : true };
              }
              else{
                return {...item};
              }
          })
        }
      }
      allnotis[currentChildIndex] = currentChildNotis
      console.log(allnotis, "allNotifications>toggleVCHCVCRHCRFutureNotiData");
    });
    dispatch(setAllNotificationData(allnotis));
  }
  const toggleAllNotis = () => {
    if (isEnabled == true) {
      let obj = { key: 'growthEnabled', value: false };
      dispatch(toggleNotificationFlags(obj));
      let obj1 = { key: 'developmentEnabled', value: false };
      dispatch(toggleNotificationFlags(obj1));
      let obj2 = { key: 'vchcEnabled', value: false };
      dispatch(toggleNotificationFlags(obj2));
      setIsEnabled(false);
    } else {
      let obj = { key: 'growthEnabled', value: true };
      dispatch(toggleNotificationFlags(obj));
      let obj1 = { key: 'developmentEnabled', value: true };
      dispatch(toggleNotificationFlags(obj1));
      let obj2 = { key: 'vchcEnabled', value: true };
      dispatch(toggleNotificationFlags(obj2));
      setIsEnabled(true);
    }
    toggleGrowthFutureNotiData();
    togglecdFutureNotiData();
    toggleVCHCVCRHCRFutureNotiData();
  }
  const toggleDataSaverSwitch = () => {
    dispatch(onNetworkStateChange(!toggleSwitchVal));
    // console.log(isDataSaverEnabled,"..22isDataSaverEnabled");
    // if(isDataSaverEnabled==false){
    //   console.log(isDataSaverEnabled,"..22isDataSaverEnabled");
    //   setIsDataSaverEnabled(true);
    //   dispatch(onNetworkStateChange(true));
    // }
    // else{
    //   console.log(isDataSaverEnabled,"..22333isDataSaverEnabled");
    //   setIsDataSaverEnabled(false);
    //   dispatch(onNetworkStateChange(false));
    // }
    // console.log(toggleSwitchVal,"..toggleSwitchVal on dispatch..")
    // //  analytics().logEvent(DEVELOPMENT_NOTIFICATION) //GROWTH_NOTIFICATION //VACCINE_HEALTHCHECKUP_NOTIFICATION

  }

  const downloadUpdatedData = () => {
    Alert.alert(t('downloadUpdatePopupTitle'), t('downloadUpdatePopupText'),
      [
        {
          text: t('downloadUpdateCancelPopUpBtn'),
          onPress: () => {

          },
          style: "cancel"
        },
        {
          text: t('downloadUpdateContinueBtn'), onPress: async () => {
            props.navigation.navigate('LoadingScreen', {
              apiJsonData: apiJsonData,
              prevPage: 'DownloadUpdate'
            });
          }
        }
      ]
    );
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [country, setCountry] = useState<any>('');
  const [language, setlanguage] = useState<any>('');
  const actionSheetRef = createRef<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  useEffect(() => {
    const selectedCountry: any = localization.find(
      (country) => country.countryId === countryId,
    );
    setCountry(selectedCountry);
    const selectedLanguage: any = selectedCountry.languages.find(
      (language: any) => language.languageCode === languageCode,
    );
    setlanguage(selectedLanguage);
    console.log(toggleSwitchVal, "..useeffect..");
    toggleSwitch();
    // setIsDataSaverEnabled(toggleSwitchVal);
    // console.log(selectedCountry,selectedLanguage);
  }, []);
  return (
    <>
      <SafeAreaContainer>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <TabScreenHeader
          title={t('settingScreenheaderTitle')}
          headerColor={primaryColor}
          textColor="#FFF"
        />

        <ScrollView style={{ flex: 1 }}>
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
                <Flex1>
                  <Heading4Regular>
                    {t('settingScreennotiType1')}
                  </Heading4Regular>
                </Flex1>
              </FDirRowStart>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      let obj = { key: 'growthEnabled', value: growthEnabledFlag == true ? false : true };
                      dispatch(toggleNotificationFlags(obj));
                      toggleGrowthFutureNotiData();
                      if (vchcEnabledFlag == true && (growthEnabledFlag == true ? false : true) == true && developmentEnabledFlag == true) {
                        setIsEnabled(true);
                      } else {
                        setIsEnabled(false);
                      }
                      // toggleSwitch();
                      analytics().logEvent(GROWTH_NOTIFICATION)
                      // setIsEnabled(!isEnabled);
                    }}>
                    <CheckboxItem>
                      <View>
                        {growthEnabledFlag ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={{ borderWidth: 1 }}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  {/* <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                /> */}
                  <Flex1>
                    <Heading4Regular>
                      {t('settingScreennotiType2')}
                    </Heading4Regular>
                  </Flex1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      let obj = { key: 'developmentEnabled', value: developmentEnabledFlag == true ? false : true };
                      dispatch(toggleNotificationFlags(obj));
                      togglecdFutureNotiData();
                      if (vchcEnabledFlag == true && (growthEnabledFlag) == true && (developmentEnabledFlag == true ? false : true) == true) {
                        setIsEnabled(true);
                      } else {
                        setIsEnabled(false);
                      }
                      // toggleSwitch();
                      analytics().logEvent(DEVELOPMENT_NOTIFICATION)
                      // setIsEnabled(!isEnabled);
                    }}>
                    <CheckboxItem>
                      <View>
                        {developmentEnabledFlag ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={{ borderWidth: 1 }}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  {/* <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                /> */}
                  <Flex1>
                    <Heading4Regular>
                      {t('settingScreennotiType3')}
                    </Heading4Regular>
                  </Flex1>
                </FDirRowStart>
              </SideSpacing10>
            </ShiftFromBottom10>

            <ShiftFromBottom10>
              <SideSpacing10>
                <FDirRowStart>
                  <FormOuterCheckbox
                    onPress={() => {
                      let obj = { key: 'vchcEnabled', value: vchcEnabledFlag == true ? false : true };
                      dispatch(toggleNotificationFlags(obj));
                      toggleVCHCVCRHCRFutureNotiData();
                      if ((vchcEnabledFlag == true ? false : true) == true && (growthEnabledFlag) == true && (developmentEnabledFlag) == true) {
                        setIsEnabled(true);
                      } else {
                        setIsEnabled(false);
                      }
                      // toggleSwitch();
                      analytics().logEvent(VACCINE_HEALTHCHECKUP_NOTIFICATION)
                      // setIsEnabled(!isEnabled);
                    }}>
                    <CheckboxItem>
                      <View>
                        {vchcEnabledFlag ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={{ borderWidth: 1 }}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                  {/* <Switch
                  trackColor={{false: trackFalseColor, true: trackTrueColor}}
                  thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                /> */}
                  <Flex1>
                    <Heading4Regular>
                      {t('settingScreennotiType4')}
                    </Heading4Regular>
                  </Flex1>
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
                <Flex1>
                  <Heading4Regular>
                    {t('settingScreendataSaverSubText')}
                  </Heading4Regular>
                </Flex1>
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
                downloadDate: formatStringDate(new Date(lastUpdatedDate), luxonLocale),
              })}
            </Heading6>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => { downloadUpdatedData() }}>
                <ButtonText numberOfLines={2}>{t('settingScreendownldupdateBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
            <ShiftFromTop20>
              <Heading4>{t('settingScreendownldSubHeader2Text')}</Heading4>
              <Heading6>{t('settingScreendownldSubHeader3Text')}</Heading6>
            </ShiftFromTop20>
            <ShiftFromTop10>
              <ButtonPrimary onPress={() => { }}>
                <ButtonText numberOfLines={2}>{t('settingScreendownldallBtn')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </MainContainer>

          <MainContainer>
            <SettingHeading>
              <FlexDirRowSpace>
                <Heading1>{t('settingScreenlocalizationHeader')}</Heading1>
                <Pressable disabled={!netInfoval.isConnected} onPress={() => {
                  console.log("icon clicked");
                  setModalVisible(true)
                }}>
                  <Icon name="ic_edit" size={16} color="#000" />
                </Pressable>
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
              {/* {isExportRunning && (
                                        <ActivityIndicator animating={true} />
                                    )} */}

            </ShiftFromTopBottom10>
            <ShiftFromTopBottom10>
              <ButtonPrimary disabled={isExportRunning || isImportRunning} onPress={() => {
                if (netInfoval && netInfoval.isConnected == true) {
                  importAllData()
                }
                else {
                  Alert.alert('', t('noInternet'));
                }
              }}>
                <ButtonText numberOfLines={2}>{t('settingScreenimportBtnText')}</ButtonText>
              </ButtonPrimary>
              {/* {isImportRunning && (
              <ActivityIndicator animating={true}/>
              )} */}
              {/* <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'center' }}>
                                    <UserRealmConsumer>
                                        {(userRealmContext: UserRealmContextValue) => (
                                            <RoundedButton
                                                text={'Import Button New'}
                                                iconName="file-import"
                                                disabled={isExportRunning || isImportRunning}
                                                onPress={() => { importAllData(userRealmContext) }}
                                                style={{ flex: 1 }}
                                            />
                                        )}
                                    </UserRealmConsumer>

                                    
                                </View> */}
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
                    <Pressable onPress={() => {
                      console.log("icon clicked");
                      //if(netInfoval && netInfoval.isConnected==true){
                      exportFile()
                      // }
                      // else{
                      //   Alert.alert('',t('noInternet'));
                      // }
                    }}>
                      <Icon name="ic_sb_shareapp" size={30} color="#000" />
                      <ShiftFromTopBottom5>
                        <Heading4Regular>
                          {t('settingScreenshareBtntxt')}
                        </Heading4Regular>
                      </ShiftFromTopBottom5>
                    </Pressable>
                  </SettingOptions>
                  <SettingOptions>
                    <Pressable onPress={() => {
                      console.log("icon clicked");
                      actionSheetRef.current?.setModalVisible(false);
                      if (netInfoval && netInfoval.isConnected == true) {
                        exportToDrive();
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
            // Alert.alert('Modal has been closed.');
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
                    console.log('close');
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
                  // disabled={netInfoval.isConnected}
                  onPress={() => {
                    console.log('close');
                    setModalVisible(false);
                    // props.navigation.reset({
                    //   index: 0,
                    //   routes: [{name: 'Localization'}],
                    // });
                    props.navigation.navigate('Localization',
                      {
                        screen: 'CountrySelection',
                        params: { country: null, language: null }
                      });
                    // props.navigation.navigate('Localization')
                  }}>
                  <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                </ButtonModal>
              </FDirRow>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaContainer>
    </>
  );
};

export default SettingScreen;

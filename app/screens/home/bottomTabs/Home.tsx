import { SURVEY_SUBMIT } from '@assets/data/firebaseEvents';
import { allApisObject, appConfig } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import AdviceAndArticles from '@components/homeScreen/AdviceAndArticles';
import BabyNotification from '@components/homeScreen/BabyNotification';
import ChildInfo from '@components/homeScreen/ChildInfo';
import ChildMilestones from '@components/homeScreen/ChildMilestones';
import DailyHomeNotification from '@components/homeScreen/DailyHomeNotification';
import DailyReads from '@components/homeScreen/DailyReads';
import PlayingTogether from '@components/homeScreen/PlayingTogether';
import Tools from '@components/homeScreen/Tools';
import {
  ButtonModal,
  ButtonTertiary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexCol, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { FeatureBox, FeatureDivideArea, HomeSurveyBox, OfflineBar } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading1Centerr, Heading3Centerr, Heading3Regular, Heading4Center, ShiftFromTop20,
  ShiftFromTopBottom10,
  SideSpacing25
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect,useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  AppState,
  BackHandler, Button, Linking, Modal,
  Platform,
  ScrollView, Text, ToastAndroid, View
} from 'react-native';
// import Orientation from 'react-native-orientation-locker';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setAllNotificationData } from '../../../redux/reducers/notificationSlice';
import { setInfoModalOpened, setSyncDate, setuserIsOnboarded } from '../../../redux/reducers/utilsSlice';
import { fetchAPI } from '../../../redux/sagaMiddleware/sagaActions';
import { getAllChildren, isFutureDate } from '../../../services/childCRUD';
import commonApiService from '../../../services/commonApiService';
import { getChildNotification, getChildReminderNotifications, getNextChildNotification, isPeriodsMovedAhead } from '../../../services/notificationService';
import { getAllPeriodicSyncData } from '../../../services/periodicSync';
import { getStatusBarHeight } from '../../../services/StatusBarHeight';
import { addSpaceToHtml } from '../../../services/Utils';

type HomeNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route: any;
  navigation: HomeNavigationProp;
};
const Home = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  // console.log(route.params,"home params")
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const backgroundColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const headerColorChildInfo = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [initialUrl, setInitialUrl] = React.useState(false);
  const [date1, setdate1] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [date2, setdate2] = useState<Date | null>(null);
  const [show2, setShow2] = useState(false);


  const backgroundColorChildInfo =
    themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  //   const dailyMessages = useAppSelector((state: any) =>
  //   state.childData.childDataSet.allChild != ''
  //     ? JSON.parse(state.childData.childDataSet.allChild)
  //     : state.childData.childDataSet.allChild,
  // );
  // const navigation = useNavigation()
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     // The screen is focused
  //     // Call any action
  //     Orientation.unlockAllOrientations();
  //     Orientation.lockToPortrait();
  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [navigation]);
  const dispatch = useAppDispatch();

  const userIsOnboarded = useAppSelector(
    (state: any) => state.utilsData.userIsOnboarded,
  );
  const errorObj = useAppSelector(
    (state: any) =>
      state.failedOnloadApiObjReducer.errorObj
  );
  const showDownloadPopup = useAppSelector((state: any) =>
    (state.utilsData.showDownloadPopup),
  );
  const generateNotificationsFlag = useAppSelector((state: any) =>
    (state.utilsData.generateNotifications),
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const netInfoval = useNetInfoHook();
  //console.log(netInfoval.isConnected, '--31home focuseffect--', userIsOnboarded);
  const surveyItem = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)?.find(item => item.type == "survey")
      : state.utilsData.surveryData,
  );
 
  let currentCount = 0;
  let { downloadWeeklyData, downloadMonthlyData, apiJsonData, downloadBufferData, ageBrackets } = getAllPeriodicSyncData();
  const onBackPress = () => {
    // console.log(currentCount,0);
    if (currentCount === 0) {
      currentCount++;
      // console.log(currentCount,1);
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('backPressText'), 6000);
        //console.log("in condition", currentCount);
        setTimeout(() => {
          //console.log("in settimeout", currentCount);
          currentCount = 0;
          // console.log(currentCount,5);
        }, 2000);
        return true;
      } else {
        Alert.alert(t('backPressText'));
        setTimeout(() => {
          //console.log("in settimeout", currentCount);
          currentCount = 0;
          // console.log(currentCount,5);
        }, 2000);
        return true;
      }
    } else {
      // console.log(currentCount,3);
      // exit the app here using
      BackHandler.exitApp();
    }

  };
  useEffect(() => {
    // const currentDate = DateTime.now().plus({days:-8}).toMillis();
    // dispatch(setSyncDate({key: 'userOnboardedDate', value: currentDate}));
    // dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
    // dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    navigation.addListener('gestureEnd', onBackPress);
    return () => {
      navigation.removeListener('gestureEnd', onBackPress);
      backHandler.remove()};
  }, []);
  let childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  // console.log(childAge, "homechildAge")
  let allHealthCheckupsData = useAppSelector(
    (state: any) =>
      state.utilsData.healthCheckupsData != '' ? JSON.parse(state.utilsData.healthCheckupsData) : [],
  );
  const taxonomy = useAppSelector(
    (state: any) =>
      (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  );
  // let genders = useAppSelector(
  //   (state: any) =>
  //     state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  // );
  const growthEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.growthEnabled),
  );
  const developmentEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.developmentEnabled),
  );
  const vchcEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.vchcEnabled),
  );
  let allGrowthPeriods = taxonomy?.growth_period;
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      state.utilsData.vaccineData != '' ? JSON.parse(state.utilsData.vaccineData) : [],
  );
  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  // console.log(allGrowthPeriods, "allGrowthPeriods")
  // console.log(allVaccinePeriods, "allVaccinePeriods")
  // console.log(allHealthCheckupsData, "allHealthCheckupsData")
  // const childList = useAppSelector((state: any) =>
  //   state.childData.childDataSet.allChild != ''
  //     ? JSON.parse(state.childData.childDataSet.allChild)
  //     : state.childData.childDataSet.allChild,
  // );

  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  let allnotis = useAppSelector((state: any) => state.notificationData.notifications);
  const forceUpdateData = [
    {
      apiEndpoint: appConfig.checkUpdate,
      method: 'get',
      postdata: {},
      saveinDB: false,
    }
  ];
  useEffect(() => {
    // const uniqueId=getUniqueNameId(genders,'girl');
    // console.log(uniqueId,"..uniqueId");
    setModalVisible(false);
    async function fetchNetInfo() {
      console.log("userIsOnboarded----",userIsOnboarded);
      // if(netInfoval.isConnected) {
        if (userIsOnboarded == false) {
          console.log("--in iffffff--");
          dispatch(setuserIsOnboarded(true));
          const currentDate = DateTime.now().toMillis();
          dispatch(setSyncDate({ key: 'userOnboardedDate', value: currentDate }));
          dispatch(setSyncDate({ key: 'weeklyDownloadDate', value: currentDate }));
          dispatch(setSyncDate({ key: 'monthlyDownloadDate', value: currentDate }));
          let obj = { key: 'showDownloadPopup', value: false };
          dispatch(setInfoModalOpened(obj));
          // if(netInfoval.isConnected) {
              const apiresponse = await commonApiService(forceUpdateData[0].apiEndpoint,forceUpdateData[0].method,forceUpdateData[0].postdata);
              let forceUpdateTime = apiresponse && apiresponse.data && apiresponse.data.updated_at ? apiresponse.data.updated_at : '0';
              AsyncStorage.setItem('forceUpdateTime',forceUpdateTime);
              console.log(forceUpdateTime,"forceupdate apiresponse2",apiresponse);
          // }
        }else {
          if(netInfoval.isConnected && showDownloadPopup)
          {

            const apiJsonDatasurvey = [
              {
                apiEndpoint: appConfig.surveys,
                method: 'get',
                postdata: {},
                saveinDB: true,
              }
            ];
            dispatch(fetchAPI(apiJsonData,'Survey',dispatch,navigation,languageCode,activeChild,apiJsonDatasurvey,netInfoval.isConnected));
            let forceUpdateTime = await AsyncStorage.getItem('forceUpdateTime');
            if(forceUpdateTime == null || forceUpdateTime == undefined) {
              dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false }));
              Alert.alert(t('forceUpdatePopupTitle'), t('forceUpdatePopupText'),
                  [
                    { text: t('forceUpdateOkBtn'), onPress: () => {
                        
                        navigation.navigate('LoadingScreen', {
                          apiJsonData: allApisObject, 
                          prevPage: 'CountryLangChange'
                        });
                      } 
                    }
                  ]
                );
            }else {
                const apiresponse = await commonApiService(forceUpdateData[0].apiEndpoint,forceUpdateData[0].method,forceUpdateData[0].postdata);
                console.log("forceupdate apiresponse2",apiresponse);
                let forceUpdateTime = await AsyncStorage.getItem('forceUpdateTime');
                forceUpdateTime = forceUpdateTime ? forceUpdateTime : '0';
                console.log("--forceUpdateTime--",forceUpdateTime);
                if(apiresponse.data.status == 200) {
                  if(apiresponse.data.flag == 1) {
                  if(parseInt(apiresponse.data.updated_at) > parseInt(forceUpdateTime)){
                    Alert.alert(t('forceUpdatePopupTitle'), t('forceUpdatePopupText'),
                      [
                        { text: t('forceUpdateOkBtn'), onPress: () => {
                            dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false }));
                            //AsyncStorage.setItem('forceUpdateTime',apiresponse.data.updated_at);
                            forceUpdateApis(apiresponse.data.updated_at)
                          } 
                        }
                      ]
                    );
                  }else {
                    onNoForceUpdate();
                  }
                  }else {
                    onNoForceUpdate();
                  }
                }else {
                  onNoForceUpdate();
                }
              }
          }
        }
        
      console.log(netInfoval, "--netInfoval--", apiJsonData);
      console.log(showDownloadPopup, "--errorObj.length--", errorObj.length);
      console.log(downloadWeeklyData, "--downloadWeeklyData-- and month", downloadMonthlyData);
      // }
      // if(netInfoval.isConnected && showDownloadPopup)
      // {
      //   const apiresponse = await commonApiService(forceUpdateData[0].apiEndpoint,forceUpdateData[0].method,forceUpdateData[0].postdata);
      //   console.log("forceupdate apiresponse2",apiresponse);
      //   let forceUpdateTime = await AsyncStorage.getItem('forceUpdateTime');
      //   forceUpdateTime = forceUpdateTime ? forceUpdateTime : '0';
      //   console.log("--forceUpdateTime--",forceUpdateTime);
      //   if(apiresponse.data.status == 200) {
      //     if(apiresponse.data.flag == 1) {
      //     if(parseInt(apiresponse.data.updated_at) > parseInt(forceUpdateTime)){
      //       Alert.alert(t('forceUpdatePopupTitle'), t('forceUpdatePopupText'),
      //         [
      //           { text: t('forceUpdateOkBtn'), onPress: () => {
      //               dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false }));
      //               //AsyncStorage.setItem('forceUpdateTime',apiresponse.data.updated_at);
      //               forceUpdateApis(apiresponse.data.updated_at)
      //             } 
      //           }
      //         ]
      //       );
      //     }else {
      //       onNoForceUpdate();
      //     }
      //     }else {
      //       onNoForceUpdate();
      //     }
      //   }else {
      //     onNoForceUpdate();
      //   }
      // }
    }
    fetchNetInfo()
    // return {};
  }, [netInfoval.isConnected]);
  // }, [netInfoval.isConnected]);
  const onNoForceUpdate = () => {
    if (netInfoval.isConnected && showDownloadPopup && (downloadBufferData == true || downloadWeeklyData == true || downloadMonthlyData == true)) {
      let flagtext = 'downloadBufferData ' + downloadBufferData + ' downloadWeeklyData ' + downloadWeeklyData + ' downloadMonthlyData ' + downloadMonthlyData;
      setTimeout(() => {
      Alert.alert(t('SyncOnLoadPopupTitle'), t('SyncOnLoadPopupText'),
        [
          {
            text: t('SyncOnLoadCancelPopUpBtn'),
            onPress: () => { dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false })) },
            style: "cancel"
          },
          { text: t('SyncOnLoadRetryBtn'), onPress: () => downloadApis() }
        ]
      );
    }, 2500);
    }
    else if (netInfoval.isConnected && showDownloadPopup && errorObj.length > 0) {
      // Alert.alert('Download Data', "All content is not downloaded.Please download data.",
      setTimeout(() => {
      Alert.alert(t('downloadOnLoadPopupTitle'), t('downloadOnLoadPopupText'),
        [
          {
            text: t('downloadOnLoadCancelPopUpBtn'),
            onPress: () => { dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false })) },
            style: "cancel"
          },
          { text: t('downloadOnLoadRetryBtn'), onPress: () => callFailedApis() }
        ]
      );
      },2500);
    }
  }
  const forceUpdateApis = (forceupdatetime: any) => {
    navigation.navigate('LoadingScreen', {
      apiJsonData: allApisObject,
      prevPage: 'ForceUpdate',
      forceupdatetime: forceupdatetime
    });
  }
  const downloadApis = () => {
   // console.log("Download Pressed", apiJsonData);
    // if(apiJsonData && apiJsonData.length > 0)
    // {
    navigation.navigate('LoadingScreen', {
      apiJsonData: apiJsonData,
      prevPage: 'PeriodicSync',
      downloadWeeklyData: downloadWeeklyData,
      downloadMonthlyData: downloadMonthlyData,
      downloadBufferData: downloadBufferData,
      ageBrackets: ageBrackets,
    });
    // }
  }
  const callFailedApis = () => {
    //console.log("Download Pressed", errorObj);
    if (errorObj && errorObj.length > 0) {
      navigation.navigate('LoadingScreen', {
        apiJsonData: errorObj,
        prevPage: 'Home'
      });
    }
  }
  const ondobChange = (event: any, selectedDate: any) => {
    setShow(Platform.OS === 'ios');
    setdate1(selectedDate);
    // setShow(false);
    dispatch(setSyncDate({ key: 'weeklyDownloadDate', value: DateTime.fromJSDate(new Date(selectedDate)).toMillis() }));
  }
  const ondobChange2 = (event: any, selectedDate: any) => {
    setShow2(Platform.OS === 'ios');
    setdate2(selectedDate);
    // setShow2(false);

    dispatch(setSyncDate({ key: 'monthlyDownloadDate', value: DateTime.fromJSDate(new Date(selectedDate)).toMillis() }));
  }

  // let userIsOnboarded = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userIsOnboarded","true");
  return (
    <>
      <>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <TabScreenHeader
          title={t('homeScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#FFF"
        />

        {
          (netInfoval && netInfoval.isConnected == false) ?
            <OfflineBar><Heading3Centerr style={{}}>{t('noInternet')}</Heading3Centerr></OfflineBar> : null
        }
        <ScrollView style={{ flex: 5, backgroundColor: '#FFF' }}>
          <FlexCol>
            <BabyNotification />
            <ChildInfo
              headerColor={headerColorChildInfo}
              backgroundColor={backgroundColorChildInfo}
            />
            {/* <View>
              <Button onPress={() => setShow(true)} title={"Weekly " + date1} />
            </View> */}
            {show && (
              <DateTimePicker
                testID="dobdatePicker"
                dateFormat={'day month year'}
                value={
                  date1 != null || date1 != undefined ? date1 : new Date()
                }
                mode={'date'}
                display="default"
                onChange={ondobChange}
              />
            )}
            {/* <View>
              <Button onPress={() => setShow2(true)} title={"Monthly " + date2} />
            </View> */}
            {show2 && (
              <DateTimePicker
                testID="dobdatePicker"
                dateFormat={'day month year'}
                value={
                  date2 != null || date2 != undefined ? date2 : new Date()
                }
                mode={'date'}
                display="default"
                onChange={ondobChange2}
              />
            )}
            {/* <Text> {getStatusBarHeight(0)}</Text> */}
            <DailyReads />
            <FeatureDivideArea>
            <DailyHomeNotification />
            </FeatureDivideArea>
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
                      <Heading3Regular style={{flexShrink:1}}>
                        {t('homeScreenexpText')}
                      </Heading3Regular>
                    </FlexDirRow>
                    <ShiftFromTop20>
                      <SideSpacing25>
                        <ButtonTertiary
                          onPress={() => {
                            setModalVisible(true);
                          }}>
                          <ButtonText numberOfLines={2}>{t('homeScreenexpBtnText')}</ButtonText>
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
          visible={modalVisible === true}
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
                    setModalVisible(false);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              {surveyItem ?
                <>
                  <ModalPopupContent>
                    <Heading1Centerr>{surveyItem?.title}</Heading1Centerr>

                    {surveyItem && surveyItem?.body ?
                      <HTML
                        source={{ html: addSpaceToHtml(surveyItem?.body)}}
                        ignoredStyles={['color', 'font-size', 'font-family']}
                      />
                      : null
                    }

                  </ModalPopupContent>
                  <FDirRow>
                    <ButtonModal
                      onPress={() => {
                        setModalVisible(false);

                        analytics().logEvent(SURVEY_SUBMIT)

                        Linking.openURL(surveyItem?.survey_feedback_link)
                      }}>
                      <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                    </ButtonModal>
                  </FDirRow></>
                : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </>
    </>
  );
};
export default Home;
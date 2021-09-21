import { SURVEY_SUBMIT } from '@assets/data/firebaseEvents';
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
import { HomeSurveyBox, OfflineBar } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import analytics from '@react-native-firebase/analytics';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading1Centerr,
  Heading3Regular, Heading3Centerr, Heading4Center, ShiftFromTop20,
  ShiftFromTopBottom10,
  SideSpacing25
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler, Button, Linking, Modal,
  Platform,
  ScrollView, ToastAndroid,
  View
} from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setAllNotificationData } from '../../../redux/reducers/notificationSlice';
import { setInfoModalOpened, setSyncDate, setuserIsOnboarded } from '../../../redux/reducers/utilsSlice';
import { getAllChildren, isFutureDate } from '../../../services/childCRUD';
import { getChildNotification, getChildReminderNotifications, getNextChildNotification, isPeriodsMovedAhead } from '../../../services/notificationService';
import { getAllPeriodicSyncData } from '../../../services/periodicSync';

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
  console.log(netInfoval.isConnected, '--31home focuseffect--', userIsOnboarded);
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData,
  );
  const surveryItem = surveryData?.find(item => item.type == "survey");
  let currentCount = 0;
  let { downloadWeeklyData, downloadMonthlyData, apiJsonData, downloadBufferData, ageBrackets } = getAllPeriodicSyncData();
  const onBackPress = () => {
    // console.log(currentCount,0);
    if (currentCount === 0) {
      currentCount++;
      // console.log(currentCount,1);
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('backPressText'), 6000);
        console.log("in condition", currentCount);
        setTimeout(() => {
          console.log("in settimeout", currentCount);
          currentCount = 0;
          // console.log(currentCount,5);
        }, 2000);
        return true;
      } else {
        Alert.alert(t('backPressText'));
        setTimeout(() => {
          console.log("in settimeout", currentCount);
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
    return () => backHandler.remove();
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
  let allGrowthPeriods = taxonomy?.growth_period;
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      state.utilsData.vaccineData != '' ? JSON.parse(state.utilsData.vaccineData) : [],
  );
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
  const findIfNotisExistForChild = (child) => {
    return allnotis.find((item) => String(item.childuuid) == String(child.uuid))
  }
  useEffect(() => {
    // const uniqueId=getUniqueNameId(genders,'girl');
    // console.log(uniqueId,"..uniqueId");
    setModalVisible(false);

    if (userIsOnboarded == false) {
      dispatch(setuserIsOnboarded(true));
      const currentDate = DateTime.now().toMillis();
      dispatch(setSyncDate({ key: 'userOnboardedDate', value: currentDate }));
      dispatch(setSyncDate({ key: 'weeklyDownloadDate', value: currentDate }));
      dispatch(setSyncDate({ key: 'monthlyDownloadDate', value: currentDate }));
      let obj = { key: 'showDownloadPopup', value: false };
      dispatch(setInfoModalOpened(obj));
    }
    if (generateNotificationsFlag == true) {
      const fetchData = async () => {
        let childList = await getAllChildren(dispatch, childAge, 1);
        let allchildNotis: any[] = [];
        console.log(childList, "..childList..")
        childList.map((child: any) => {
          const notiExist = findIfNotisExistForChild(child);
          console.log("notiExist", notiExist);
          if (notiExist != undefined) {
            // notiExist.gwcdnotis?.forEach((item) => {
            //   allgwcdnotis.push(item)
            // })
            //remove reminder notis
            // dispatch(setAllNotificationData(notiExist))
            if (isFutureDate(child?.birthDate)) {
              // do not calculate for expecting child
              //empty childNotis // find and remove child from notification slice
              console.log("CHILD_ISEXPECTING_REMOVEALLNOTIREQUIRED")
            } else {
              let reminderNotis = getChildReminderNotifications(child, notiExist.reminderNotis);
              const checkIfNewCalcRequired = isPeriodsMovedAhead(childAge, notiExist, child, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData)
              console.log(checkIfNewCalcRequired, "checkIfNewCalcRequired")
              if (checkIfNewCalcRequired) {
                console.log("NEWCALCREQUIRED")
                console.log(notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis, "EXISTINGNOTI");
                const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getNextChildNotification(notiExist.lastgwperiodid, notiExist.lastvcperiodid, notiExist.lasthcperiodid, child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods);

                console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "NEWNOTI2");

                ////  append new notifications for child 
                let allgwcdnotis: any = [];
                let allvcnotis: any = [];
                let allhcnotis: any = [];
                gwcdnotis.reverse().forEach((item) => {
                  allgwcdnotis.push(item)
                })
                if (notiExist.gwcdnotis) {
                  notiExist.gwcdnotis?.forEach((item) => {
                    allgwcdnotis.push(item)
                  })
                }
                vcnotis.reverse().forEach((item) => {
                  allvcnotis.push(item)
                })
                if (notiExist.vcnotis) {
                  notiExist.vcnotis?.forEach((item) => {
                    allvcnotis.push(item)
                  })
                }
                hcnotis.reverse().forEach((item) => {
                  allhcnotis.push(item)
                })
                if (notiExist.hcnotis) {
                  notiExist.hcnotis?.forEach((item) => {
                    allhcnotis.push(item)
                  })
                }
                let allreminderNotis: any = []
                if (notiExist.reminderNotis) {
                  notiExist.reminderNotis?.forEach((item) => {
                    allreminderNotis.push(item)
                  })
                }
                reminderNotis.reverse().forEach((item) => {
                  allreminderNotis.push(item)
                })
                // remove duplicates by key of growth_period,periodName from reminderNotis
                console.log(allhcnotis, allvcnotis, allgwcdnotis, allreminderNotis, "ONLYnewnoti");
                allchildNotis.push({ childuuid: notiExist.childuuid, lastgwperiodid: lastgwperiodid, lastvcperiodid: lastvcperiodid, lasthcperiodid: lasthcperiodid, gwcdnotis: allgwcdnotis, vcnotis: allvcnotis, hcnotis: allhcnotis, reminderNotis: allreminderNotis })

              } else {

                //for child dob taken from 2years to 3 months, calculate new notifications from 3 months onwards
                //find and remove child from notification slice
                //clear notification which are already generated, 
                //generate for new notifications
                // const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getChildNotification(child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods);

                // console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "childNotis")
                let allreminderNotis: any = []
                let reminderNotis = getChildReminderNotifications(activeChild, notiExist.reminderNotis);
                if (notiExist.reminderNotis) {
                  notiExist.reminderNotis?.forEach((item) => {
                    allreminderNotis.push(item)
                  })
                }
                reminderNotis.reverse().forEach((item) => {
                  allreminderNotis.push(item)
                })
                allchildNotis.push({ childuuid: notiExist.childuuid, lastgwperiodid: notiExist.lastgwperiodid, lastvcperiodid: notiExist.lastvcperiodid, lasthcperiodid: notiExist.lasthcperiodid, gwcdnotis: notiExist.gwcdnotis, vcnotis: notiExist.vcnotis, hcnotis: notiExist.hcnotis, reminderNotis: allreminderNotis })
              }
            }
          } else {
            console.log("noti does not exist for child")
            // create notification for that child first time
            if (!isFutureDate(child?.birthDate)) {
              const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getChildNotification(child, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods);
              console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, "childNotis")
              let reminderNotis = getChildReminderNotifications(child, []);
              console.log(reminderNotis, "childNotis")
              console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "childNotis")
              allchildNotis.push({ childuuid: child.uuid, lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis: gwcdnotis, vcnotis: vcnotis, hcnotis: hcnotis, reminderNotis: reminderNotis })
            } else {
              //for expecting child no notifications
            }
          }

        })
        // console.log(allchildNotis,"allchildNotis")
        dispatch(setAllNotificationData(allchildNotis))
        //generate notifications for all childs 
        //get all notifications for all childfrom slice, if [],then generate as per their DOB/createdate,
        //if already exist, then for each module get last period, and generate afterwards period's notifications
        //after generating notifications make it false
        let notiFlagObj = { key: 'generateNotifications', value: false };
        dispatch(setInfoModalOpened(notiFlagObj));
      }
      fetchData()
    }




    console.log(netInfoval, "--netInfoval--", apiJsonData);
    console.log(showDownloadPopup, "--errorObj.length--", errorObj.length);
    console.log(downloadWeeklyData, "--downloadWeeklyData-- and month", downloadMonthlyData);
    if (netInfoval.isConnected && showDownloadPopup && (downloadBufferData == true || downloadWeeklyData == true || downloadMonthlyData == true)) {
      let flagtext = 'downloadBufferData ' + downloadBufferData + ' downloadWeeklyData ' + downloadWeeklyData + ' downloadMonthlyData ' + downloadMonthlyData;
      Alert.alert(t('SyncOnLoadPopupTitle'), t('SyncOnLoadPopupText') + ' ' + flagtext,
        [
          {
            text: t('SyncOnLoadCancelPopUpBtn'),
            onPress: () => { dispatch(setInfoModalOpened({ key: 'showDownloadPopup', value: false })) },
            style: "cancel"
          },
          { text: t('SyncOnLoadRetryBtn'), onPress: () => downloadApis() }
        ]
      );
    }
    else if (netInfoval.isConnected && showDownloadPopup && errorObj.length > 0) {
      // Alert.alert('Download Data', "All content is not downloaded.Please download data.",
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
    }
    // return {};
  }, [netInfoval.isConnected]);
  // }, [netInfoval.isConnected]);
  const downloadApis = () => {
    console.log("Download Pressed", apiJsonData);
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
    console.log("Download Pressed", errorObj);
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
      <SafeAreaView style={{ flex: 1 }}>
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
        <ScrollView style={{ flex: 4, backgroundColor: '#FFF' }}>
          <FlexCol> 
            <BabyNotification />
            <ChildInfo
              headerColor={headerColorChildInfo}
              backgroundColor={backgroundColorChildInfo}
            />
            <View>
              <Button onPress={() => setShow(true)} title={"Weekly " + date1} />
            </View>
            {show && (
              <DateTimePicker
                testID="dobdatePicker"
                dateFormat={'day month year'}
                value={
                  date1 != null ? date1 : new Date()
                }
                mode={'date'}
                display="default"
                onChange={ondobChange}
              />
            )}
            <View>
              <Button onPress={() => setShow2(true)} title={"Monthly " + date2} />
            </View>
            {show2 && (
              <DateTimePicker
                testID="dobdatePicker"
                dateFormat={'day month year'}
                value={
                  date2 != null ? date2 : new Date()
                }
                mode={'date'}
                display="default"
                onChange={ondobChange2}
              />
            )}
            <DailyReads />
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
                      <Heading3Regular>
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
              <DailyHomeNotification />
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
              {surveryItem ?
                <>
                  <ModalPopupContent>
                    <Heading1Centerr>{surveryItem?.title}</Heading1Centerr>

                    {surveryItem && surveryItem?.body ?
                      <HTML
                        source={{ html: surveryItem?.body }}
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

                        Linking.openURL(surveryItem?.survey_feedback_link)
                      }}>
                      <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                    </ButtonModal>
                  </FDirRow></>
                : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaView>
    </>
  );
};
export default Home;

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
import analytics from '@react-native-firebase/analytics';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexCol, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HomeSurveyBox } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading1Centerr,
  Heading3Regular, ShiftFromTop20,
  ShiftFromTopBottom10,
  SideSpacing25
} from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler, Linking, Modal,
  Platform,
  ScrollView,
  Text,
  ToastAndroid
} from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { setInfoModalOpened, setSyncDate, setuserIsOnboarded } from '../../../redux/reducers/utilsSlice';
import { SURVEY_SUBMIT } from '@assets/data/firebaseEvents';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { DateTime } from 'luxon';
import { getAllPeriodicSyncData } from '../../../services/periodicSync';

type HomeNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route:any;
  navigation: HomeNavigationProp;
};
const Home = ({route,navigation}: Props) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const backgroundColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const headerColorChildInfo = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const [modalVisible, setModalVisible] = useState<boolean>(true);
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
  const netInfoval = useNetInfoHook();
  console.log(netInfoval,'--home focuseffect--', userIsOnboarded);
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData,
  );
  let currentCount = 0;
  let { downloadWeeklyData, downloadMonthlyData, apiJsonData, downloadBufferData, ageBrackets} = getAllPeriodicSyncData();
  const onBackPress = () => {
    // console.log(currentCount,0);
    if (currentCount === 0) {
      currentCount++;
      // console.log(currentCount,1);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press again to close!', 6000);
        console.log("in condition",currentCount);
        setTimeout(() => {
          console.log("in settimeout",currentCount);
          currentCount = 0;
          // console.log(currentCount,5);
        }, 2000);
        return true;
      } else {
        Alert.alert('Press again to close!');
        setTimeout(() => {
          console.log("in settimeout",currentCount);
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
  },[]);
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      if (userIsOnboarded == false) {
        dispatch(setuserIsOnboarded(true));
        const currentDate = DateTime.now().toMillis();
        dispatch(setSyncDate({key: 'userOnboardedDate', value: currentDate}));
        dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
        dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
      }
      console.log(netInfoval,"--netInfoval--",apiJsonData);
      console.log(showDownloadPopup,"--errorObj.length--",errorObj.length);
      console.log(downloadWeeklyData,"--downloadWeeklyData-- and month",downloadMonthlyData);
      if(netInfoval && showDownloadPopup && (downloadBufferData == true || downloadWeeklyData == true || downloadMonthlyData == true))
      {
        let flagtext = 'downloadBufferData '+downloadBufferData+' downloadWeeklyData '+downloadWeeklyData+' downloadMonthlyData '+downloadMonthlyData;
        Alert.alert(t('SyncOnLoadPopupTitle'), t('SyncOnLoadPopupText') + ' '+flagtext ,
          [
            {
              text: t('SyncOnLoadCancelPopUpBtn'),
              onPress: () => {dispatch(setInfoModalOpened({key:'showDownloadPopup', value: false}))},
              style: "cancel"
            },
            { text: t('SyncOnLoadRetryBtn'), onPress: () => downloadApis() }
          ]
        );
      }
      else if(netInfoval && showDownloadPopup && errorObj.length > 0)
      {
        // Alert.alert('Download Data', "All content is not downloaded.Please download data.",
          Alert.alert(t('downloadOnLoadPopupTitle'), t('downloadOnLoadPopupText'),
            [
              {
                text: t('downloadOnLoadCancelPopUpBtn'),
                onPress: () => {dispatch(setInfoModalOpened({key:'showDownloadPopup', value: false}))},
                style: "cancel"
              },
              { text: t('downloadOnLoadRetryBtn'), onPress: () => callFailedApis() }
            ]
          );
      }
    }, [netInfoval]),
  );
  const downloadApis = () => {
    console.log("Download Pressed",apiJsonData);
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
    console.log("Download Pressed",errorObj);
    if(errorObj && errorObj.length > 0)
    {
      navigation.navigate('LoadingScreen', {
        apiJsonData: errorObj, 
        prevPage: 'Home'
      });
    }
  }
  // let userIsOnboarded = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userIsOnboarded","true");
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <TabScreenHeader
          title={t('homeScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#FFF"
        />
        <ScrollView style={{flex: 4, backgroundColor: '#FFF'}}>
          <FlexCol>
            <BabyNotification />
            <ChildInfo
              headerColor={headerColorChildInfo}
              backgroundColor={backgroundColorChildInfo}
            />
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
              <ModalPopupContent>
                <Heading1Centerr>{surveryData[0].title}</Heading1Centerr>
              
                {surveryData[0] && surveryData[0].body ?
                    <HTML
                      source={{html: surveryData[0].body}}
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
                    
                    Linking.openURL(surveryData[0].survey_link)
                  }}>
                  <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                </ButtonModal>
              </FDirRow>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaView>
    </>
  );
};
export default Home;

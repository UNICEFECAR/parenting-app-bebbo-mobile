import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import PreviousHealthCheckup from '@components/healthChekup/PreviousHealthCheckup';
import UpcomingHealthCheckup from '@components/healthChekup/UpcomingHealthCheckup';
import {
  ButtonContainerAuto,
  ButtonHealth,
  ButtonText,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { Flex1,FlexCol } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { ToolsBgContainer } from '@components/shared/ToolsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2Center,
  Heading4Center,
  Heading4Centerr,
  ShiftFromBottom20,
  ShiftFromTopBottom10
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { getAllHealthCheckupPeriods } from '../../services/healthCheckupService';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import Icon from '@components/shared/Icon';
import { ButtonModal } from '@components/shared/ButtonGlobal';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import { isFutureDate } from '../../services/childCRUD';
type HealthCheckupsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
};
const HealthCheckups = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext.colors.HEALTHCHECKUP_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const {t} = useTranslation();
  let {
    upcomingPeriods,
    previousPeriods,
    childAgeIndays,
    sortedGroupsForPeriods,
    totalPreviousVaccines,
    totalUpcomingVaccines,
    currentPeriod,
  } = getAllHealthCheckupPeriods();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  const [modalVisible, setModalVisible] = React.useState(true);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
  const hcuModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsHCUModalOpened),
    );
   useFocusEffect(()=>{
    // console.log('vaccineModalOpened',vaccineModalOpened);
    // pass true to make modal visible every time & reload
    setModalVisible(hcuModalOpened)
   })
  let reminders = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild).reminders
      : [],
  );
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // console.log(reminders,"UpcomingHealthCheckup-reminders");
  const healthCheckupReminder = reminders.filter(
    (item) => item.reminderType == 'healthCheckup',
  )[0];
  // console.log(healthCheckupReminder,"healthCheckupReminder",);
  const renderItem = (index: number) => {
    if (index === 0) {
      return (
        <FlexCol>
          {upcomingPeriods.length > 0 ? (
            upcomingPeriods?.map((item, itemindex) => {
              return (
                <UpcomingHealthCheckup
                  item={item}
                  childAgeIndays={childAgeIndays}
                  currentPeriodId={currentPeriod?.id}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
              );
            })
          ) : (
            <Heading4Center>{t('noDataTxt')}</Heading4Center>
          )}
        </FlexCol>
      );
    } else if (index === 1) {
      return (
        <FlexCol>
          {previousPeriods.length > 0 ? (
            previousPeriods?.map((item, itemindex) => {
              return (
                <View style={{flex:1,flexDirection:'column'}} key={itemindex}>
                <PreviousHealthCheckup
                  item={item}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
                </View>
              );
            })
          ) : (
            <Heading4Center>{t('noDataTxt')}</Heading4Center>
          )}
        </FlexCol>
      );
    }
  };
  const getVaccinationPeriod = () => {

    if(upcomingPeriods[0]?.vaccination_opens <= childAgeIndays && upcomingPeriods[0]?.vaccination_ends > childAgeIndays)
    {
     return upcomingPeriods[0]
    }else{
     const prevPeriod = previousPeriods.find(item =>item.vaccination_opens <= childAgeIndays && item.vaccination_ends > childAgeIndays)
    //  console.log(prevPeriod,"prevPeriod");
     return prevPeriod;
    }


  }
  return (
    <>
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
                  setModalVisible(false);
                  setIsModalOpened('IsHCUModalOpened');
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('hcModalText')}
              </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
              <ButtonModal
                onPress={() => {
                  setIsModalOpened('IsHCUModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>
            
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <SafeAreaView style={{flex: 1,backgroundColor:headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ToolsBgContainer>
          <TabScreenHeader
            title={t('hcHeader')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4}}>
            <MainContainer style={{backgroundColor: backgroundColor}}>
              <ShiftFromBottom20>
                <Heading2Center>{t('hcSummaryHeader')}</Heading2Center>
              </ShiftFromBottom20>

              {
              isFutureDate(activeChild?.birthDate) ? (null) :
              healthCheckupReminder ? null : 
                (<Pressable
                  onPress={() => {
                    navigation.navigate('AddReminder', {
                      reminderType: 'healthCheckup', // from remiderType
                      headerTitle: t('vcReminderHeading'),
                      buttonTitle: t('hcReminderAddBtn'),
                      titleTxt: t('hcReminderText'),
                      warningTxt: t('hcReminderDeleteWarning'),
                      headerColor: headerColor,
                    });
                  }}>
                  <ButtonTextSmLine numberOfLines={2}>{t('hcReminderbtn')}</ButtonTextSmLine>
                </Pressable>)
              }
              <ButtonContainerAuto>
                <ButtonHealth
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    navigation.navigate('AddChildHealthCheckup', {
                      headerTitle: t('hcNewHeaderTitle'),
                      vcPeriod: getVaccinationPeriod(),
                    })
                  }>
                  <ButtonText numberOfLines={2}>{t('hcNewBtn')}</ButtonText>
                </ButtonHealth>
              </ButtonContainerAuto>
            </MainContainer>

            <TabBarContainer>
              {data.map((item, itemindex) => {
                return (
                  <Pressable
                    key={itemindex}
                    style={{flex: 1}}
                    onPress={() => {
                      setSelectedIndex(itemindex);
                    }}>
                    <TabBarDefault 
                      style={[
                        {
                          backgroundColor:
                            itemindex == selectedIndex
                              ? headerColor
                              : backgroundColor,
                        },
                      ]}>
                      <Heading4Center numberOfLines={2}>{item.title}</Heading4Center>
                    </TabBarDefault>
                  </Pressable>
                );
              })}
            </TabBarContainer>
            <ShiftFromTopBottom10>
              <FlexCol>{renderItem(selectedIndex)}</FlexCol>
            </ShiftFromTopBottom10>
          </ScrollView>
        </ToolsBgContainer>
      </SafeAreaView>
    </>
  );
};

export default HealthCheckups;

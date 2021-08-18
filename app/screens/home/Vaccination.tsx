import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { MainContainer } from '@components/shared/Container';
import { Flex1 } from '@components/shared/FlexBoxStyle';
import { TabBarContainer, TabBarDefault } from '@components/shared/TabBarStyle';
import { ToolsBgContainer, VacSummaryBox,VacSummaryPress } from '@components/shared/ToolsStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import PreviousVaccines from '@components/vaccination/tabs/PreviousVaccines';
import UpcomingVaccines from '@components/vaccination/tabs/UpcomingVaccines';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading4Center,
  Heading4Centerr,
  Heading4Regular,
  ShiftFromTopBottom10,
  ShiftFromTopBottom5
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { getAllVaccinePeriods } from '../../services/vacccineService';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import Icon from '@components/shared/Icon';
import { ButtonModal, ButtonText } from '@components/shared/ButtonGlobal';
import { FDirRow } from '@components/shared/FlexBoxStyle';
type VaccinationNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: VaccinationNavigationProp;
};
const Vaccination = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const [childageInDays, setChildageInDays] = React.useState<number>(0);
  const {t} = useTranslation();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [modalVisible, setModalVisible] = React.useState(true);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
  const vaccineModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsVaccineModalOpened),
    );
   useFocusEffect(()=>{
    // console.log('vaccineModalOpened',vaccineModalOpened);
    // pass true to make modal visible every time & reload
    setModalVisible(vaccineModalOpened)
   })
  const data = [{title: t('vcTab1')}, {title: t('vcTab2')}];
  let {
    upcomingPeriods,
    previousPeriods,
    sortedGroupsForPeriods,
    totalPreviousVaccines,
    totalUpcomingVaccines,
    currentPeriod,
    overDuePreviousVCcount,
    doneVCcount,
  } = getAllVaccinePeriods();
  console.log(totalUpcomingVaccines,"totalUpcomingVaccines");
  const renderItem = (index: number) => {
    if (index === 0) {
      return (
        <View>
          {upcomingPeriods.length > 0 ? upcomingPeriods.map((item, itemindex) => {
            return (
              <UpcomingVaccines
                item={item}
                currentPeriodId={currentPeriod?.periodID}
                key={itemindex}
                currentIndex={itemindex}
                headerColor={headerColor}
                backgroundColor={backgroundColor}
              />
            );
          }) :  (<Heading4Center>{t('noDataTxt')}</Heading4Center>)}
        </View>
      );
    } else if (index === 1) {
      // if (previousPeriods.length > 0) {
        return (
          <View>
            {previousPeriods.length > 0 ? previousPeriods.map((item, itemindex) => {
              return (
                <PreviousVaccines
                  item={item}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
              );
            }) : (<Heading4Center>{t('noDataTxt')}</Heading4Center>)}
          </View>
        );
      // }else{
      //   return (<Text></Text>)
      // }
    }
  };
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
                  setIsModalOpened('IsVaccineModalOpened');
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('vaccineModalText')}
              </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
              <ButtonModal
                onPress={() => {
                  setIsModalOpened('IsVaccineModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>
            
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ToolsBgContainer>
          <TabScreenHeader
            title={t('drawerMenuvcTxt')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView style={{flex: 4}}>
            <MainContainer style={{backgroundColor: backgroundColor}}>
              <ShiftFromTopBottom5>
                <Heading3>{t('vcSummaryHeader')}</Heading3>
              </ShiftFromTopBottom5>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <VacSummaryPress onPress={() => setSelectedIndex(0)}>
                  <VacSummaryBox>
                    <Heading2>
                      {totalUpcomingVaccines ? totalUpcomingVaccines : 0}
                    </Heading2>
                    {/* added 1 for current period */}
                    <Heading4Regular>{t('vcStatus1')}</Heading4Regular>
                  </VacSummaryBox>
                </VacSummaryPress>
                <VacSummaryPress onPress={() => setSelectedIndex(1)}>
                  <VacSummaryBox>
                    <Heading2>
                      {overDuePreviousVCcount ? overDuePreviousVCcount : 0}
                    </Heading2>
                    <Heading4Regular>{t('vcStatus2')}</Heading4Regular>
                  </VacSummaryBox>
                </VacSummaryPress>
                <VacSummaryPress onPress={() => setSelectedIndex(1)}>
                  <VacSummaryBox>
                    <Heading2>{doneVCcount ? doneVCcount : 0}</Heading2>
                    <Heading4Regular>{t('vcStatus3')}</Heading4Regular>
                  </VacSummaryBox>
                </VacSummaryPress>
              </View>
            </MainContainer>
            <TabBarContainer
              style={{
                maxHeight: 50,
              }}>
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
              <Flex1>{renderItem(selectedIndex)}</Flex1>
            </ShiftFromTopBottom10>
          </ScrollView>
        </ToolsBgContainer>
      </SafeAreaView>
    </>
  );
};

export default Vaccination;

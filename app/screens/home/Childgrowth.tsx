import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import ChartHeightForAge from '@components/growth/ChartHeightForAge';
import ChartWeightForHeight from '@components/growth/ChartWeightForHeight';
import GrowthIntroductory from '@components/growth/GrowthIntroductory';
import LastChildMeasure from '@components/growth/LastChildMeasure';
import BabyNotification from '@components/homeScreen/BabyNotification';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import {
  BgContainer,
  MainContainer,
} from '@components/shared/Container';
import { FlexCol, FlexDirCol } from '@components/shared/FlexBoxStyle';
import {
  TabBarContainerBrd,
  TabBarDefault
} from '@components/shared/TabBarStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading3,
  Heading3Centerr,
  Heading4,
  Heading4Center,
  Heading4Centerr,
  ShiftFromBottom5,
  ShiftFromTop10,
  ShiftFromTopBottom20,
  SideSpacing10
} from '@styles/typography';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, Pressable, ScrollView, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { getCurrentChildAgeInMonths, isFutureDate } from '../../services/childCRUD';
import Icon from '@components/shared/Icon';
import { ButtonModal } from '@components/shared/ButtonGlobal';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTime } from 'luxon';
import { MeasuresEntity } from '../../database/schema/ChildDataSchema';
import { formatStringDate } from '../../services/Utils';
type ChildgrowthNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildgrowthNavigationProp;
  AddNewChildgrowth: any;
};
const Childgrowth = ({navigation,route}: Props) => {
  const {t} = useTranslation();
  const data = [
    {title: t('growthScreenweightForHeight')},
    {title: t('growthScreenheightForAge')},
  ];
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const headerColorWhite = themeContext.colors.SECONDARY_TEXTCOLOR;
  const [modalVisible, setModalVisible] = React.useState(true);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
  const growthModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsGrowthModalOpened),
    );
    const luxonLocale = useAppSelector(
      (state: any) => state.selectedCountry.luxonLocale,
    );
   useFocusEffect(()=>{
    // console.log('growthModalOpened',growthModalOpened);
    // pass true to make modal visible every time & reload
    setModalVisible(growthModalOpened)
   })
  
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // console.log(activeChild,"..activeChild..")
  // const measures = activeChild.measures.filter((item) => item.isChildMeasured == true);
  let measures:any=[];
  let days = 0;
  if(activeChild?.measures.length>0){
     measures = activeChild.measures.filter((item) => item.isChildMeasured == true);
    }
//Code for Growth text hiding condition starts here
  if(measures.length > 0){
      let measurementDate: DateTime = DateTime.local();
      const timeNow = DateTime.local();
      let childmeasures = measures.map((item: MeasuresEntity) => {
        if (item.measurementDate) {
          measurementDate = DateTime.fromJSDate(new Date(item.measurementDate));
        }

        let month: number = 0;

        if (activeChild?.birthDate) {
          let birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
          month = Math.round(measurementDate.diff(birthDay, 'month').months);
        }
        return {
          uuid:item.uuid,
          weight: item.weight ? parseFloat(item.weight) : 0,
          height: item.height ? parseFloat(item.height) : 0,
          measurementDate: formatStringDate(item?.measurementDate, luxonLocale),
          dateToMilis: measurementDate.toMillis(),
          isChildMeasured:item.isChildMeasured,
          titleDateInMonth: month,
          measurementPlace:item.measurementPlace,
          doctorComment:item.doctorComment,
          didChildGetVaccines:item.didChildGetVaccines,
          vaccineIds:item.vaccineIds,
        };
      });

      childmeasures = childmeasures.sort(
        (a: any, b: any) => a.dateToMilis - b.dateToMilis,
      );
        let lastmeasurementDate =  DateTime.fromMillis(childmeasures[
          childmeasures.length - 1
        ]?.dateToMilis)
        let date = DateTime.fromISO(activeChild.birthDate);
        // console.log(date,"DOB");
        let convertInDays = lastmeasurementDate.diff(date, "days").days;
        if (convertInDays !== undefined) {days = Math.round(convertInDays)};
      }
    //Code for Growth text hiding condition ends here
  // const standardDevData = useAppSelector((state: any) =>
  //   JSON.parse(state.utilsData.taxonomy.standardDevData),
  // );
  // console.log(standardDevData,"statestandardDevData")
const {width,height}= Dimensions.get('window');
  const renderDummyChart = () => {
    return (
      <>
        <View
          style={{
            backgroundColor: '#FFF',
            borderRadius: 4,
            alignItems: 'center',
            margin: 15,
            padding: 15,
          }}>
          <VectorImage source={require('@assets/svg/chart.svg')} />
        </View>
      </>
    );
  };
  return (
    <>
    <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          // setModalVisible(false);
        }}
        onDismiss={() => {
          // setModalVisible(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  setModalVisible(false);
                  setIsModalOpened('IsGrowthModalOpened');
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('growthModalText')}
              </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
              <ButtonModal
                onPress={() => {
                  setIsModalOpened('IsGrowthModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>
            
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <View style={{backgroundColor:headerColor,width:width,height:height,flex:1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexCol>
          <TabScreenHeader
            title={t('growthScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          <ScrollView
            style={{
              flex: 9,
              backgroundColor: backgroundColor,
              maxHeight: '100%',
            }}>
           {(activeChild?.gender == '') ?  <BabyNotification /> : null}
            {measures.length == 0 ? (
              <>
                <FlexDirCol>
                  <ShiftFromBottom5>
                    <Heading3 style={{marginTop: 15}}>                  
                      { activeChild.birthDate != null && activeChild.birthDate != undefined && !isFutureDate(activeChild.birthDate) ? 
                      t('babyNotificationbyAge', {
                        childName:
                          activeChild.childName != null &&
                          activeChild.childName != '' &&
                          activeChild.childName != undefined
                            ? activeChild.childName
                            : '',
                        ageInMonth:
                          activeChild.birthDate != null &&
                          activeChild.birthDate != '' &&
                          activeChild.birthDate != undefined
                            ? getCurrentChildAgeInMonths(
                                t,
                                activeChild.birthDate,
                              )
                            : '',
                      }):t('expectedChildDobLabel')
                      }

                      {/* {t('growthScreengrowthDataTitle', {childAge: 3})} */}
                    </Heading3>
                  </ShiftFromBottom5>

                  {measures.length == 0 ? (
                    <Heading3Centerr>
                      {t('growthScreennoGrowthData')}
                    </Heading3Centerr>
                  ) : null}
                  <ShiftFromTopBottom20>
                    <Heading4>{t('growthScreennoGrowthDataHelpText')}</Heading4>
                  </ShiftFromTopBottom20>
                </FlexDirCol>
                {renderDummyChart()}
              </>
            ) : width<height ?(
              <MainContainer>
                <GrowthIntroductory activeChild={activeChild} />

                <LastChildMeasure />

                <> 
                <FlexCol>
                  <BgContainer>
                    <FlexCol>
                    <TabBarContainerBrd
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
                    </TabBarContainerBrd>
                    </FlexCol>
                    <FlexCol>
                    <SideSpacing10>
                      <FlexCol>
                      {selectedIndex == 0 ? <ChartWeightForHeight days={days} /> : null}
                      {selectedIndex == 1 ? <ChartHeightForAge days={days} /> : null}
                      </FlexCol>
                    </SideSpacing10>
                    </FlexCol>
                  </BgContainer>
                  </FlexCol>
                </>

               
              </MainContainer>
            ) : null}
          </ScrollView>
          <ButtonContainer style={{backgroundColor: backgroundColor}}>
            <ShiftFromTop10>
              <ButtonPrimary
                disabled={isFutureDate(activeChild?.birthDate)}
                style={{backgroundColor: headerColor}}
                onPress={() => {
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreenaddNewBtntxt'),
                  });
                }}>
                <ButtonText numberOfLines={2}>{t('growthScreenaddNewBtntxt')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </ButtonContainer>
        </FlexCol>
      </View>
    </>
  );
};

export default Childgrowth;

import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import ChartHeightForAge from '@components/growth/ChartHeightForAge';
import ChartWeightForHeight from '@components/growth/ChartWeightForHeight';
import GrowthIntroductory from '@components/growth/GrowthIntroductory';
import LastChildMeasure from '@components/growth/LastChildMeasure';
import BabyNotification from '@components/homeScreen/BabyNotification';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonContainer,
  ButtonPrimary,
  ButtonText,
  ButtonModal
} from '@components/shared/ButtonGlobal';
import {
  BgContainer,
  MainContainer,
} from '@components/shared/Container';
import { FDirRow, FlexCol, FlexDirCol } from '@components/shared/FlexBoxStyle';
import {
  TabBarContainerBrd,
  TabBarDefault
} from '@components/shared/TabBarStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { useFocusEffect } from '@react-navigation/native';
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
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { getCurrentChildAgeInMonths, isFutureDate } from '../../services/childCRUD';
import Icon from '@components/shared/Icon';
import { DateTime } from 'luxon';
import { MeasuresEntity } from '../../database/schema/ChildDataSchema';
import { formatStringDate } from '../../services/Utils';
import { bgcolorWhite2 } from '@styles/style';

const styles= StyleSheet.create({
  flex1:{flex:1},
  marginTop15:{marginTop: 15},
  maxHeight:{
    maxHeight: 50,
  },
  scrollView:{
    flex: 9,
    maxHeight: '100%'
  },
  vectorImageView:{
    alignItems: 'center',
    backgroundColor: bgcolorWhite2,
    borderRadius: 4,
    margin: 15,
    padding: 15,
  }
})
const Childgrowth = ({navigation}: any):any => {
  const {t} = useTranslation();
  const data = [
    {title: t('growthScreenweightForHeight')},
    {title: t('growthScreenheightForAge')},
  ];
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext?.colors.CHILDGROWTH_TINTCOLOR;
  const tabBackgroundColor = themeContext?.colors.SECONDARY_TEXTCOLOR;
  const [modalVisible, setModalVisible] = React.useState(true);
  const [profileLoading,setProfileLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any):Promise<any> => {
    const obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
  const growthModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsGrowthModalOpened),
    );
    
    const pluralShow = useAppSelector(
      (state: any) => state.selectedCountry.pluralShow,
    );

    useEffect(()=>{
      setModalVisible(growthModalOpened)
    },[growthModalOpened]);
    
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  let measures:any=[];
  let days = 0;
  if(activeChild?.measures.length>0){
     measures = activeChild.measures.filter((item: any) => item.isChildMeasured == true);
    }
//Code for Growth text hiding condition starts here
  if(measures.length > 0){
      let measurementDate: DateTime = DateTime.local();
      let childmeasures = measures.map((item: MeasuresEntity) => {
        if (item.measurementDate) {
          measurementDate = DateTime.fromJSDate(new Date(item.measurementDate));
        }

        let month: any = 0;

        if (activeChild?.birthDate) {
          const birthDay = DateTime.fromJSDate(new Date(activeChild?.birthDate));
          month = Math.round(measurementDate.diff(birthDay, 'month').months);
        }
        return {
          uuid:item.uuid,
          weight: item.weight ? parseFloat(item.weight) : 0,
          height: item.height ? parseFloat(item.height) : 0,
          measurementDate: formatStringDate(item?.measurementDate),
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
        const lastmeasurementDate =  DateTime.fromMillis(childmeasures[
          childmeasures.length - 1
        ]?.dateToMilis)
        const date = DateTime.fromISO(activeChild.birthDate);
        const convertInDays = lastmeasurementDate.diff(date, "days").days;
        if (convertInDays !== undefined) {days = Math.round(convertInDays)}
      }
    //Code for Growth text hiding condition ends here
const {width,height}= Dimensions.get('window');
  const renderDummyChart = ():any => {
    return (
      <>
        <View
          style={styles.vectorImageView}>
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
        onRequestClose={():any => {
          console.log("in onRequestClose");
        }}
        onDismiss={():any => {
          console.log("in onDismiss");
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={():any => {
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
                onPress={():any => {
                  setIsModalOpened('IsGrowthModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>
            
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <View style={[styles.flex1,{backgroundColor:headerColor,width:width,height:height}]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexCol>
          <TabScreenHeader
            title={t('growthScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
            setProfileLoading={setProfileLoading}
          />
          <ScrollView
            style={[styles.scrollView,{
              backgroundColor: backgroundColor        
            }]}>
            {measures.length == 0 ? (
              <>
                <FlexDirCol>
                  <ShiftFromBottom5>
                    <Heading3 style={styles.marginTop15}>                  
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
                                DateTime.fromJSDate(new Date(activeChild.birthDate)),
                                pluralShow
                              )
                            : '',
                      }):t('expectedChildDobLabel')
                      }

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
                      style={styles.maxHeight}>
                      {data.map((item, itemindex) => {
                        return (
                          <Pressable
                          key={itemindex}
                          style={[styles.flex1, {
                            backgroundColor:
                              itemindex == selectedIndex
                                ? tabBackgroundColor
                                : backgroundColor,
                          }]}
                          onPress={(): any => {
                            setSelectedIndex(itemindex);
                          }}>
                          <TabBarDefault
                            style={[
                              {
                                backgroundColor:
                                  itemindex == selectedIndex
                                    ? tabBackgroundColor
                                    : headerColor,
                              },
                            ]}>
                            {itemindex == selectedIndex ? <Heading4Centerr numberOfLines={2}>{item.title}</Heading4Centerr>
                              : <Heading4Center numberOfLines={2}>{item.title}</Heading4Center>}
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
                onPress={():any => {
                  navigation.navigate('AddNewChildgrowth', {
                    headerTitle: t('growthScreenaddNewBtntxt'),
                  });
                }}>
                <ButtonText numberOfLines={2}>{t('growthScreenaddNewBtntxt')}</ButtonText>
              </ButtonPrimary>
            </ShiftFromTop10>
          </ButtonContainer>
        </FlexCol>
        <OverlayLoadingComponent loading={profileLoading}/>
      </View>
    </>
  );
};

export default Childgrowth;
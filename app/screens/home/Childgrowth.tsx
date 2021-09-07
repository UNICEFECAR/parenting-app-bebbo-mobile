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
  SafeAreaContainer
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
import { Modal, Pressable, ScrollView, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { getCurrentChildAgeInMonths, isFutureDate } from '../../services/childCRUD';
import Icon from '@components/shared/Icon';
import { ButtonModal } from '@components/shared/ButtonGlobal';
import { FDirRow } from '@components/shared/FlexBoxStyle';
type ChildgrowthNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildgrowthNavigationProp;
  AddNewChildgrowth;
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
  console.log(activeChild,"..activeChild..")
  // const measures = activeChild.measures.filter((item) => item.isChildMeasured == true);
  let measures:any=[];
  if(activeChild?.measures.length>0){
     measures = activeChild.measures.filter((item) => item.isChildMeasured == true);
    }
  // const standardDevData = useAppSelector((state: any) =>
  //   JSON.parse(state.utilsData.taxonomy.standardDevData),
  // );
  // console.log(standardDevData,"statestandardDevData")

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
      <SafeAreaContainer>
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
            ) : (
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
                      {selectedIndex == 0 ? <ChartWeightForHeight /> : null}
                      {selectedIndex == 1 ? <ChartHeightForAge /> : null}
                      </FlexCol>
                    </SideSpacing10>
                    </FlexCol>
                  </BgContainer>
                  </FlexCol>
                </>

               
              </MainContainer>
            )}
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
      </SafeAreaContainer>
    </>
  );
};

export default Childgrowth;

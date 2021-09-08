import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Ruler from '@components/Ruler';
import { ButtonContainer, ButtonModal, ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexCol } from '@components/shared/FlexBoxStyle';
import { HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1Center, Heading2, Heading4Centerr, ShiftFromTopBottom20 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, Pressable, SafeAreaView, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildHeight = ({navigation,route}: Props) => {
  const {t} = useTranslation();
  const [headerColor,setHeaderColor] = useState();
  const [tintColor,setTintColor] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  const screenPadding = 10;
  const secondScalePrefix =0.01;
  const {width} = Dimensions.get('screen');
  const [height, setheight] = useState<number>(0);
  const [height1, setheight1] = useState<number>(0.0);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
  const heightModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsHeightModalOpened),
    );
   useFocusEffect(()=>{
    // console.log('heightModalOpened',heightModalOpened);
    // pass true to make modal visible every time & reload
    setModalVisible(heightModalOpened)
   })
   const [prevRoute,setPrevRoute] = useState<any>();
   React.useEffect(() => {
    if (route.params?.prevRoute) {
      // console.log(route.params?.prevRoute);
      setPrevRoute(route.params?.prevRoute);
    }
    if (route.params?.headerColor) {
      // console.log(route.params?.headerColor);
      setHeaderColor(route.params?.headerColor);
    }
    if (route.params?.backgroundColor) {
      // console.log(route.params?.backgroundColor);
      setTintColor(route.params?.backgroundColor);
    }
    if(route.params?.heightValue){
      console.log(route.params?.heightValue);
      (route.params?.heightValue.height != NaN)?setheight(route.params?.heightValue.height):setheight(0);
      (route.params?.heightValue.height1 != NaN)?setheight1(route.params?.heightValue.height1):setheight1(0.0);
      // setInitialValues(route.params?.weightValue)
    }
  }, [route.params?.prevRoute,route.params?.headerColor,route.params?.backgroundColor,route.params?.heightValue]);

  const getHeightValue = () => {
    const h =
      (height != NaN ? height : 0) + (height1 != NaN ? 0.01 * height1 : 0);
    // console.log(h);
    return h;
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
                  setIsModalOpened('IsHeightModalOpened');
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('heightModalText')}
              </Heading4Centerr>
              </ModalPopupContent>
              <FDirRow>
              <ButtonModal
                onPress={() => {
                  setIsModalOpened('IsHeightModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>
            
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
          <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2>{t('growthScreenaddHeight')}</Heading2>
          </HeaderTitleView>
          
        </HeaderRowView>
        <FlexCol>
        <MainContainer>
          <View style={{backgroundColor: tintColor,borderRadius:4}}>
        <View style={{ overflow:'hidden'}}>
          <ShiftFromTopBottom20>
            <Heading1Center>
            { getHeightValue() } { t('growthScreencmText') }
          </Heading1Center>
          </ShiftFromTopBottom20>
          <Ruler
            style={{elevation: 3}}
            width={width - (screenPadding*2)}
            height={100}
            vertical={false}
            initialValue={route.params?.heightValue.height}
            onChangeValue={(value) => setheight(value)}
            minimum={0}
            maximum={125}
            segmentWidth={2}
            segmentSpacing={20}
            indicatorColor={headerColor}
            indicatorWidth={100}
            indicatorHeight={100}
            indicatorBottom={0}
            step={10}
            stepPreFix={1}
            stepColor="#333333"
            stepHeight={40}
            normalColor="#999999"
            normalHeight={20}
            backgroundColor={'#FFF'}
          />
          <View style={{marginBottom: 20}}></View>
          <Ruler
            style={{elevation: 3}}
            width={width - screenPadding- screenPadding}
            height={100}
            vertical={false}
            initialValue={route.params?.heightValue.height1}
            onChangeValue={(value) => setheight1(value)}
            minimum={0}
            maximum={100}
            segmentWidth={2}
            segmentSpacing={20}
            indicatorColor={headerColor}
            indicatorWidth={100}
            indicatorHeight={100}
            indicatorBottom={0}
            step={10}
            stepPreFix={secondScalePrefix}
            stepColor="#333333"
            stepHeight={40}
            normalColor="#999999"
            normalHeight={20}
            backgroundColor={tintColor}
          />
        </View>
        </View>
        </MainContainer>
        
        <ButtonContainer>
          <ButtonPrimary
           style={{backgroundColor: '#FFF'}}
            onPress={() => {
              navigation.navigate({
                name: prevRoute,
                params: {height:getHeightValue()},
                merge: true,
              });
              // route.params.onReturn({height:(heightVal + 0.01 * height1).toFixed(2)});
              // navigation.goBack();
            }}>
            <ButtonText numberOfLines={2}>{t('growthScreensaveMeasuresDetails')}</ButtonText>
          </ButtonPrimary>
          </ButtonContainer>
      
      </FlexCol>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildHeight;

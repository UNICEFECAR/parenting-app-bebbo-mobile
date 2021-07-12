import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Ruler from '@components/Ruler';
import { ButtonContainer, ButtonModal, ButtonTertiary, ButtonText } from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1Center, Heading2w, Heading4Centerr, ShiftFromTopBottom20 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, Pressable, SafeAreaView, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildWeight = ({navigation, route}: Props) => {
  const {t} = useTranslation();
  const [headerColor,setHeaderColor] = useState();
  const [tintColor,setTintColor] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  const screenPadding = 10;
  const secondScalePrefix =0.01;
  const {height, width} = Dimensions.get('screen');
  const [weight, setweight] = useState<any>(0);
  const [weight1, setweight1] = useState<any>(0.0);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = {key: varkey, value: !modalVisible};
    dispatch(setInfoModalOpened(obj));
  };
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
    if(route.params?.weightValue){
      setInitialValues(route.params?.weightValue)
    }
  }, [route.params?.prevRoute,route.params?.headerColor,route.params?.backgroundColor,route.params?.weightValue, ]);
// console.log(weight,"<Weight></Weight>")
const setInitialValues = (weightValue:any)=>{
  console.log(weightValue)
  let w = (weightValue + "").split(".");
  setweight(Number(w[0]));
  if(w[1].length==1){
    setweight1(Number(w[1])*10)
  } else {
    setweight1(Number(w[1]))
  }
  // console.log(weight,weight1)
}
  const weightModalOpened = useAppSelector((state: any) =>
      (state.utilsData.IsWeightModalOpened),
    );
   useFocusEffect(()=>{
    //  console.log('weightModalOpened',weightModalOpened);
      // pass true to make modal visible every time & reload
    setModalVisible(weightModalOpened)
   })
    return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        onDismiss={() => {
          setModalVisible(!modalVisible);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>

            <View>
              <Heading4Centerr>
                {t('weightModalText')}
              </Heading4Centerr>
              <FDirRow>
              <ButtonModal
                onPress={() => {
                  setIsModalOpened('IsWeightModalOpened');
                }}>
                <ButtonText>{t('continueInModal')}</ButtonText>
              </ButtonModal>
              </FDirRow>
            </View>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 8, padding: 7}}>
              <Heading2w style={{color: '#000'}}>
                {t('growthScreenaddWeight')}
              </Heading2w>
            </View>
          </View>
        </View>
        <MainContainer>
          <View style={{backgroundColor: tintColor,borderRadius:4}}>
        <View style={{padding: screenPadding, overflow:'hidden'}}>
          <ShiftFromTopBottom20>
          <Heading1Center>
            {(weight + 0.01 * weight1).toFixed(2)} {t('growthScreenkgText')}
          </Heading1Center>
          </ShiftFromTopBottom20>
          <Ruler
            style={{elevation: 3}}
            width={width - (screenPadding*2)}
            height={100}
            vertical={false}
            initialValue={weight} //set value on edit
            onChangeValue={(value) => setweight(value)}
            minimum={0}
            maximum={20}
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
            width={width - screenPadding - screenPadding}
            height={100}
            vertical={false}
            initialValue={weight1}
            onChangeValue={(value) => setweight1(value)}
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
        </View></View>
        </MainContainer>
        <ButtonContainer>
          <ButtonTertiary
            onPress={() => {
              navigation.navigate({
                name: prevRoute,
                params: {weight:(weight + 0.01 * weight1).toFixed(2)},
                merge: true,
              });
              // route.params.onReturn({weight:(weight + 0.01 * weight1).toFixed(2)});
              // navigation.goBack();
            }}>
            <ButtonText>{t('growthScreensaveMeasuresDetails')}</ButtonText>
          </ButtonTertiary>
        </ButtonContainer>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildWeight;

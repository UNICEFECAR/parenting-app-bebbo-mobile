import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Ruler from '@components/Ruler';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1, Heading2w, Heading4Centerr } from '@styles/typography';
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
  const [heightVal, setheight] = useState<number>(9);
  const [height1, setheight1] = useState<number>(0.41);
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
  }, [route.params?.prevRoute,route.params?.headerColor,route.params?.backgroundColor ]);


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
                {t('heightModalText')}
              </Heading4Centerr>
              <ButtonPrimary
                onPress={() => {
                  setIsModalOpened('IsHeightModalOpened');
                }}>
                <ButtonText>{t('continueInModal')}</ButtonText>
              </ButtonPrimary>
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
              <Heading2w style={{color: '#000'}}>{t('growthScreenaddHeight')}</Heading2w>
            </View>
          </View>
        </View>
        <View style={{padding: screenPadding,backgroundColor:tintColor}}>
          <Heading1 style={{textAlign: 'center'}}>
            {(heightVal + 0.01 * height1).toFixed(2)} {t('growthScreencmText')}
          </Heading1>
          <Ruler
            style={{elevation: 3}}
            width={width - (screenPadding*2)}
            height={100}
            vertical={false}
            initialValue={heightVal}
            onChangeValue={(value) => setheight(value)}
            minimum={0}
            maximum={200}
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
            initialValue={height1/secondScalePrefix}
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

        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
           style={{backgroundColor: '#FFF'}}
            onPress={() => {
              navigation.navigate({
                name: prevRoute,
                params: {height:(heightVal + 0.01 * height1).toFixed(2)},
                merge: true,
              });
              // route.params.onReturn({height:(heightVal + 0.01 * height1).toFixed(2)});
              // navigation.goBack();
            }}>
            <ButtonText>{t('growthScreensaveMeasuresDetails')}</ButtonText>
          </ButtonPrimary>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildHeight;

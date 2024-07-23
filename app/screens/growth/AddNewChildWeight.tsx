import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Ruler from '@components/Ruler';
import {
  ButtonContainer,
  ButtonModal,
  ButtonTertiary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexCol } from '@components/shared/FlexBoxStyle';
import { HeaderIconPress, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { IconML } from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1Center, Heading2, Heading4Centerr, ShiftFromTopBottom20 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import useDigitConverter from '../../customHooks/useDigitConvert';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
  route:any;
};
const styles=StyleSheet.create({
  borderRadius4:{borderRadius: 4},
  elevation3:{ elevation: 3 },
  flex1:{flex:1},
  maxHeight:{maxHeight: 50},
  overflowHidden:{overflow:'hidden'}
})
const AddNewChildWeight = ({ navigation, route }: Props):any => {
  const { t } = useTranslation();
  const {convertDigits} = useDigitConverter()
  const locale = useAppSelector((state: any) =>
  state.selectedCountry?.locale,
);
  const [headerColor, setHeaderColor] = useState();
  const [tintColor, setTintColor] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  const screenPadding = 10;
  const secondScalePrefix = 0.01;
  const { width } = Dimensions.get('screen');
  const [weight, setweight] = useState<any>(0);
  const [weight1, setweight1] = useState<any>(0.0);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any):Promise<any> => {
    const obj = { key: varkey, value: !modalVisible };
    dispatch(setInfoModalOpened(obj));
  };
  const [prevRoute, setPrevRoute] = useState<any>();

  React.useEffect(() => {
    if (route.params?.prevRoute) {
      setPrevRoute(route.params?.prevRoute);
    }
    if (route.params?.headerColor) {
      setHeaderColor(route.params?.headerColor);
    }
    if (route.params?.backgroundColor) {
      setTintColor(route.params?.backgroundColor);
    }
    if (route.params?.weightValue) {
      !isNaN(route.params?.weightValue.weight)
        ? setweight(route.params?.weightValue.weight)
        : setweight(0);
      !isNaN(route.params?.weightValue.weight1)
        ? setweight1(route.params?.weightValue.weight1)
        : setweight1(0.0);
    }
  }, [
    route.params?.prevRoute,
    route.params?.headerColor,
    route.params?.backgroundColor,
    route.params?.weightValue,
  ]);

  const weightModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsWeightModalOpened,
  );
  useFocusEffect(() => {
    // pass true to make modal visible every time & reload
    setModalVisible(weightModalOpened);
  });
  const getWeightValue = ():any => {
    const w =
      (!isNaN(weight) ? weight : 0) + (!isNaN(weight1) ? 0.01 * weight1 : 0);
      return convertDigits(w.toFixed(2));
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
                  setIsModalOpened('IsWeightModalOpened');
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>

            <ModalPopupContent>
              <Heading4Centerr>
                {t('weightModalText')}
              </Heading4Centerr>
            </ModalPopupContent>
            <FDirRow>
              <ButtonModal
                onPress={():any => {
                  setIsModalOpened('IsWeightModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
            </FDirRow>

          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <View style={[styles.flex1,{backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={[styles.maxHeight,{
            backgroundColor: headerColor
          }]}>
          <HeaderIconView>
            <HeaderIconPress
              onPress={():any => {
                navigation.goBack();
              }}>
              <IconML name={'ic_back'} color="#000" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2>{t('growthScreenaddWeight')}</Heading2>
          </HeaderTitleView>

        </HeaderRowView>
        <FlexCol>
          <MainContainer>
            <View style={[{ backgroundColor: tintColor }]}>
              <View style={styles.overflowHidden}>
                <ShiftFromTopBottom20>
                  <Heading1Center>
                    {getWeightValue()} {t('growthScreenkgText')}
                  </Heading1Center>
                </ShiftFromTopBottom20>
                <Ruler
                  style={styles.elevation3}
                  width={width - screenPadding * 2}
                  height={100}
                  vertical={false}
                  initialValue={route.params?.weightValue.weight} //set value on edit
                  onChangeValue={(value:any):any => setweight(value)}
                  minimum={0}
                  maximum={32}
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
                  locale={locale}
                  backgroundColor={'#FFF'}
                />
                <Ruler
                  style={styles.elevation3}
                  width={width - screenPadding - screenPadding}
                  height={100}
                  vertical={false}
                  initialValue={route.params?.weightValue.weight1}
                  onChangeValue={(value:any):any => setweight1(value)}
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
                  locale={locale}
                  backgroundColor={tintColor}
                />
              </View>
            </View>
          </MainContainer>
          <ButtonContainer>
            <ButtonTertiary
             disabled={getWeightValue()<=0?true:false}
              onPress={():any => {
                navigation.navigate({
                  name: prevRoute,
                  params: { weight: getWeightValue() },
                  merge: true,
                });
              }}>
              <ButtonText numberOfLines={2}>{t('growthScreensaveMeasuresDetails')}</ButtonText>
            </ButtonTertiary>
          </ButtonContainer>
        </FlexCol>
      </View>
    </>
  );
};

export default AddNewChildWeight;

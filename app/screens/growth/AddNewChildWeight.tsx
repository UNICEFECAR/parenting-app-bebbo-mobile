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
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1Center, Heading2, Heading4Centerr, ShiftFromTopBottom20 } from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
  route:any;
};

const AddNewChildWeight = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const [headerColor, setHeaderColor] = useState();
  const [tintColor, setTintColor] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  const screenPadding = 10;
  const secondScalePrefix = 0.01;
  const { width } = Dimensions.get('screen');
  const [weight, setweight] = useState<any>(0);
  const [weight1, setweight1] = useState<any>(0.0);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any) => {
    let obj = { key: varkey, value: !modalVisible };
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
      route.params?.weightValue.weight != NaN
        ? setweight(route.params?.weightValue.weight)
        : setweight(0);
      route.params?.weightValue.weight1 != NaN
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
  const getWeightValue = () => {
    const w =
      (weight != NaN ? weight : 0) + (weight1 != NaN ? 0.01 * weight1 : 0);
    return w.toFixed(2);
  };
  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("in onRequestClose");
        }}
        onDismiss={() => {
          console.log("in onDismiss");
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
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
                onPress={() => {
                  setIsModalOpened('IsWeightModalOpened');
                }}>
                <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
              </ButtonModal>
            </FDirRow>

          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <View style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
            <HeaderIconPress
              onPress={() => {
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
            <View style={{ backgroundColor: tintColor, borderRadius: 4 }}>
              <View style={{ overflow: 'hidden' }}>
                <ShiftFromTopBottom20>
                  <Heading1Center>
                    {getWeightValue()} {t('growthScreenkgText')}
                  </Heading1Center>
                </ShiftFromTopBottom20>
                <Ruler
                  style={{ elevation: 3 }}
                  width={width - screenPadding * 2}
                  height={100}
                  vertical={false}
                  initialValue={route.params?.weightValue.weight} //set value on edit
                  onChangeValue={(value:any) => setweight(value)}
                  minimum={0}
                  maximum={28}
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
                {/* <View style={{marginBottom: 20}}></View> */}
                <Ruler
                  style={{ elevation: 3 }}
                  width={width - screenPadding - screenPadding}
                  height={100}
                  vertical={false}
                  initialValue={route.params?.weightValue.weight1}
                  onChangeValue={(value:any) => setweight1(value)}
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
            <ButtonTertiary
             disabled={getWeightValue()<=0?true:false}
              onPress={() => {
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

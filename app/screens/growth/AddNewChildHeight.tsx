import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import Ruler from "@components/Ruler";
import {
  ButtonContainer,
  ButtonModal,
  ButtonTertiary,
  ButtonText,
} from "@components/shared/ButtonGlobal";
import { MainContainer } from "@components/shared/Container";
import { FDirRow, FlexCol } from "@components/shared/FlexBoxStyle";
import {
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView,
} from "@components/shared/HeaderContainerStyle";
import Icon, { IconML } from "@components/shared/Icon";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import { RootStackParamList } from "@navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading1Center,
  Heading2,
  Heading4Centerr,
  ShiftFromTopBottom20,
} from "../../instances/bebbo/styles/typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Modal, StyleSheet, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../App";
import useDigitConverter from "../../customHooks/useDigitConvert";
import { setInfoModalOpened } from "../../redux/reducers/utilsSlice";

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;
const styles = StyleSheet.create({
  borderRadius4: { borderRadius: 4 },
  elevation3: { elevation: 3 },
  flex1: { flex: 1 },
  marginBottom20: { marginBottom: 20 },
  maxHeight: { maxHeight: 50 },
  overflowHidden: { overflow: "hidden" },
});
type Props = {
  navigation: ChildSetupNavigationProp;
  route: any;
};

const AddNewChildHeight = ({ navigation, route }: Props): any => {
  const { t } = useTranslation();
  const { convertDigits } = useDigitConverter();
  const locale = useAppSelector((state: any) => state.selectedCountry?.locale);
  const [headerColor, setHeaderColor] = useState();
  const [tintColor, setTintColor] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  const screenPadding = 10;
  const secondScalePrefix = 0.01;
  const { width } = Dimensions.get("screen");
  const [height, setheight] = useState<number>(0);
  const [height1, setheight1] = useState<number>(0.0);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    setModalVisible(false);
    const obj = { key: varkey, value: !modalVisible };
    dispatch(setInfoModalOpened(obj));
  };
  const heightModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsHeightModalOpened
  );

  useFocusEffect(() => {
    // pass true to make modal visible every time & reload
    setModalVisible(heightModalOpened);
  });
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
    if (route.params?.heightValue) {
      !isNaN(route.params?.heightValue.height)
        ? setheight(route.params?.heightValue.height)
        : setheight(0);
      !isNaN(route.params?.heightValue.height1)
        ? setheight1(route.params?.heightValue.height1)
        : setheight1(0.0);
    }
  }, [
    route.params?.prevRoute,
    route.params?.headerColor,
    route.params?.backgroundColor,
    route.params?.heightValue,
  ]);

  const getHeightValue = (): any => {
    const h =
      (!isNaN(height) ? height : 0) + (!isNaN(height1) ? 0.01 * height1 : 0);
    return h.toFixed(2);
  };
  return (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={(): any => {
          console.log("in onRequestClose");
        }}
        onDismiss={(): any => {
          console.log("in onDismiss");
        }}
      >
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={(): any => {
                  setIsModalOpened("IsHeightModalOpened");
                }}
              >
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>{t("heightModalText")}</Heading4Centerr>
            </ModalPopupContent>
            <FDirRow>
              <ButtonModal
                onPress={(): any => {
                  setIsModalOpened("IsHeightModalOpened");
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("continueInModal")}
                </ButtonText>
              </ButtonModal>
            </FDirRow>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={[
            styles.maxHeight,
            {
              backgroundColor: headerColor,
            },
          ]}
        >
          <HeaderIconView>
            <HeaderIconPress
              onPress={(): any => {
                navigation.goBack();
              }}
            >
              <IconML name={"ic_back"} color="#000" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2>{t("growthScreenaddHeight")}</Heading2>
          </HeaderTitleView>
        </HeaderRowView>
        <FlexCol>
          <MainContainer>
            <View style={[{ backgroundColor: tintColor }]}>
              <View style={styles.overflowHidden}>
                <ShiftFromTopBottom20>
                  <Heading1Center>
                    {convertDigits(getHeightValue())} {t("growthScreencmText")}
                  </Heading1Center>
                </ShiftFromTopBottom20>
                <Ruler
                  style={styles.elevation3}
                  width={width - screenPadding * 2}
                  height={100}
                  vertical={false}
                  initialValue={route.params?.heightValue.height}
                  onChangeValue={(value: any): any => setheight(value)}
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
                  locale={locale}
                  backgroundColor={"#FFF"}
                />
                <View style={styles.marginBottom20}></View>
                <Ruler
                  style={styles.elevation3}
                  width={width - screenPadding - screenPadding}
                  height={100}
                  vertical={false}
                  initialValue={route.params?.heightValue.height1}
                  onChangeValue={(value: any): any => setheight1(value)}
                  minimum={0}
                  maximum={100}
                  segmentWidth={2}
                  segmentSpacing={20}
                  indicatorColor={headerColor}
                  indicatorWidth={100}
                  indicatorHeight={100}
                  indicatorBottom={0}
                  step={10}
                  locale={locale}
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
              disabled={getHeightValue() <= 0 ? true : false}
              onPress={(): any => {
                navigation.navigate({
                  name: prevRoute,
                  params: { height: getHeightValue() },
                  merge: true,
                });
              }}
            >
              <ButtonText numberOfLines={2}>
                {t("growthScreensaveMeasures")}
              </ButtonText>
            </ButtonTertiary>
          </ButtonContainer>
        </FlexCol>
      </View>
    </>
  );
};

export default AddNewChildHeight;

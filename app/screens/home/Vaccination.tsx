import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import { MainContainer } from "@components/shared/Container";
import { Flex1, FDirRow } from "@components/shared/FlexBoxStyle";
import { TabBarContainer, TabBarDefault } from "@components/shared/TabBarStyle";
import {
  ToolsBgContainer,
  VacSummaryBox,
  VacSummaryPress,
} from "@components/shared/ToolsStyle";
import TabScreenHeader from "@components/TabScreenHeader";
import PreviousVaccines from "@components/vaccination/tabs/PreviousVaccines";
import UpcomingVaccines from "@components/vaccination/tabs/UpcomingVaccines";
import { HomeDrawerNavigatorStackParamList } from "@navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading2,
  Heading3,
  Heading4Center,
  Heading4Centerr,
  Heading4Regular,
  ShiftFromTopBottom10,
  ShiftFromTopBottom5,
} from "@styles/typography";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../App";
import { setInfoModalOpened } from "../../redux/reducers/utilsSlice";
import { getAllVaccinePeriods } from "../../services/vacccineService";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import Icon from "@components/shared/Icon";
import { ButtonModal, ButtonText } from "@components/shared/ButtonGlobal";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import useDigitConverter from "../../customHooks/useDigitConvert";
type VaccinationNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: VaccinationNavigationProp;
  route: any;
};
const stylesLocal = StyleSheet.create({
  flex1: { flex: 1 },
  flex4: { flex: 4 },
  maxHeight50: {
    maxHeight: 50,
  },
  vacSummaryMainView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
const Vaccination = ({ navigation, route }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const { convertDigits } = useDigitConverter();
  const headerColor = themeContext?.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext?.colors.VACCINATION_TINTCOLOR;
  const tabBackgroundColor = themeContext.colors.SECONDARY_TEXTCOLOR;
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [modalVisible, setModalVisible] = React.useState(true);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    const obj = { key: varkey, value: !modalVisible };
    dispatch(setInfoModalOpened(obj));
  };
  const onBackPress = (): any => {
    if (route.params?.fromNotificationScreen == true) {
      navigation.navigate("NotificationsScreen");
      return true;
    } else {
      navigation.goBack();
      return true;
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    navigation.addListener("gestureEnd", onBackPress);
    return (): any => {
      navigation.removeListener("gestureEnd", onBackPress);
      backHandler.remove();
    };
  }, []);
  const vaccineModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsVaccineModalOpened
  );

  //  useFocusEffect(
  //   React.useCallback(() => {
  //       // pass true to make modal visible every time & reload
  //     setModalVisible(vaccineModalOpened)
  //   }, [vaccineModalOpened])
  //  );
  useEffect(() => {
    setModalVisible(vaccineModalOpened);
  }, [vaccineModalOpened]);
  const data = [{ title: t("vcTab1") }, { title: t("vcTab2") }];
  const {
    upcomingPeriods,
    previousPeriods,
    totalUpcomingVaccines,
    currentPeriod,
    overDuePreviousVCcount,
    doneVCcount,
  } = getAllVaccinePeriods();
  const upcomingPeriodsData = (): any => {
    const noVaccinesinAgePeriodInUpcoming = upcomingPeriods.every((el: any) => {
      const noVaccinesinAgePeriod = el.vaccines.every((v: any) => {
        console.log(v, "..vupco..");
        return v.old_calendar == 1 && v.isMeasured == false ? true : false;
      });
      console.log(noVaccinesinAgePeriod, "..noVaccinesinAgePeriod..");
      return noVaccinesinAgePeriod == true ? true : false;
    });
    console.log(
      noVaccinesinAgePeriodInUpcoming,
      "..noVaccinesinAgePeriodInUpcoming.."
    );
    return noVaccinesinAgePeriodInUpcoming;
  };
  const previousPeriodsData = (): any => {
    const noVaccinesinAgePeriodInPrevious = previousPeriods.every((el: any) => {
      const noVaccinesinAgePeriod = el.vaccines.every((v: any) => {
        console.log(v, "..vprev..");
        return v.old_calendar == 1 && v.isMeasured == false ? true : false;
      });
      console.log(noVaccinesinAgePeriod, "..previousnoVaccinesinAgePeriod..");
      return noVaccinesinAgePeriod == true ? true : false;
    });
    console.log(
      noVaccinesinAgePeriodInPrevious,
      "..noVaccinesinAgePeriodInPrevious.."
    );
    return noVaccinesinAgePeriodInPrevious;
  };
  const renderItem = (index: number): any => {
    if (index === 0) {
      return (
        <View>
          {upcomingPeriods.length > 0 && upcomingPeriodsData() == false ? (
            upcomingPeriods.map((item: any, itemindex: any) => {
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
            })
          ) : (
            <Heading4Center>{t("noDataTxt")}</Heading4Center>
          )}
        </View>
      );
    } else if (index === 1) {
      return (
        <View>
          {previousPeriods.length > 0 && previousPeriodsData() == false ? (
            previousPeriods.map((item: any, itemindex: any) => {
              return (
                <PreviousVaccines
                  item={item}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
              );
            })
          ) : (
            <Heading4Center>{t("noDataTxt")}</Heading4Center>
          )}
        </View>
      );
    }
  };
  console.log(upcomingPeriods, previousPeriods);
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
                  setModalVisible(false);
                  setIsModalOpened("IsVaccineModalOpened");
                }}
              >
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>{t("vaccineModalText")}</Heading4Centerr>
            </ModalPopupContent>
            <FDirRow>
              <ButtonModal
                onPress={(): any => {
                  setIsModalOpened("IsVaccineModalOpened");
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
      <View style={[stylesLocal.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ToolsBgContainer>
          <TabScreenHeader
            title={t("drawerMenuvcTxt")}
            headerColor={headerColor}
            textColor="#000"
            setProfileLoading={setProfileLoading}
          />
          <ScrollView style={stylesLocal.flex4}>
            <MainContainer style={{ backgroundColor: backgroundColor }}>
              <ShiftFromTopBottom5>
                <Heading3>{t("vcSummaryHeader")}</Heading3>
              </ShiftFromTopBottom5>
              <View style={stylesLocal.vacSummaryMainView}>
                <VacSummaryPress onPress={(): any => setSelectedIndex(0)}>
                  <VacSummaryBox>
                    <Heading2>
                      {totalUpcomingVaccines
                        ? convertDigits(totalUpcomingVaccines)
                        : convertDigits("0")}
                    </Heading2>
                    {/* added 1 for current period */}
                    <Heading4Center>
                      <Heading4Regular>{t("vcStatus1")}</Heading4Regular>
                    </Heading4Center>
                  </VacSummaryBox>
                </VacSummaryPress>
                <VacSummaryPress onPress={(): any => setSelectedIndex(1)}>
                  <VacSummaryBox>
                    <Heading2>
                      {overDuePreviousVCcount
                        ? convertDigits(overDuePreviousVCcount)
                        : convertDigits("0")}
                    </Heading2>
                    <Heading4Center>
                      <Heading4Regular>{t("vcStatus2")}</Heading4Regular>
                    </Heading4Center>
                  </VacSummaryBox>
                </VacSummaryPress>
                <VacSummaryPress onPress={(): any => setSelectedIndex(1)}>
                  <VacSummaryBox>
                    <Heading2>
                      {doneVCcount
                        ? convertDigits(doneVCcount)
                        : convertDigits("0")}
                    </Heading2>
                    <Heading4Center>
                      <Heading4Regular>{t("vcStatus3")}</Heading4Regular>
                    </Heading4Center>
                  </VacSummaryBox>
                </VacSummaryPress>
              </View>
            </MainContainer>
            <TabBarContainer style={stylesLocal.maxHeight50}>
              {data.map((item, itemindex) => {
                return (
                  <Pressable
                    key={itemindex}
                    style={[
                      stylesLocal.flex1,
                      {
                        backgroundColor:
                          itemindex == selectedIndex
                            ? tabBackgroundColor
                            : backgroundColor,
                      },
                    ]}
                    onPress={(): any => {
                      setSelectedIndex(itemindex);
                    }}
                  >
                    <TabBarDefault
                      style={[
                        {
                          backgroundColor:
                            itemindex == selectedIndex
                              ? tabBackgroundColor
                              : headerColor,
                        },
                      ]}
                    >
                      {itemindex == selectedIndex ? (
                        <Heading4Centerr numberOfLines={2}>
                          {item.title}
                        </Heading4Centerr>
                      ) : (
                        <Heading4Center numberOfLines={2}>
                          {item.title}
                        </Heading4Center>
                      )}
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
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};

export default Vaccination;

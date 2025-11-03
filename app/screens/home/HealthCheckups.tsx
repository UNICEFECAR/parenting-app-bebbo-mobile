import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import PreviousHealthCheckup from "@components/healthChekup/PreviousHealthCheckup";
import UpcomingHealthCheckup from "@components/healthChekup/UpcomingHealthCheckup";
import {
  ButtonContainerAuto,
  ButtonHealth,
  ButtonText,
  ButtonTextSmLine,
  ButtonModal,
  ButtonTextTheme,
} from "@components/shared/ButtonGlobal";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import { FlexCol, FDirRow } from "@components/shared/FlexBoxStyle";
import { TabBarContainer, TabBarDefault } from "@components/shared/TabBarStyle";
import { ToolsBgContainer } from "@components/shared/ToolsStyle";
import TabScreenHeader from "@components/TabScreenHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading2Center,
  Heading4Center,
  Heading4Centerr,
  ShiftFromBottom20,
  ShiftFromTopBottom10,
} from "../../instances/bebbo/styles/typography";
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
import { getAllHealthCheckupPeriods } from "../../services/healthCheckupService";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import Icon from "@components/shared/Icon";
import { MainContainer } from "@components/shared/Container";
import { isFutureDate } from "../../services/childCRUD";
import { selectActiveChild, selectActiveChildReminders } from "../../services/selectors";
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flex4: { flex: 4 },
  previousPeriodsView: { flex: 1, flexDirection: "column" },
});
type HealthCheckupsNavigationProp = StackNavigationProp<any>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
  route: any;
};

const HealthCheckups = ({ navigation, route }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext?.colors.HEALTHCHECKUP_TINTCOLOR;
  const tabBackgroundColor = themeContext.colors.SECONDARY_TEXTCOLOR;
  const headerTextColor = themeContext?.colors.HEALTHCHECKUP_TEXTCOLOR;
  const backgroundColorList = themeContext?.colors.ARTICLES_LIST_BACKGROUND;
  const { t } = useTranslation();
  const { upcomingPeriods, previousPeriods, childAgeIndays, currentPeriod } =
    getAllHealthCheckupPeriods();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const data = [{ title: t("vcTab1") }, { title: t("vcTab2") }];
  const [modalVisible, setModalVisible] = React.useState(true);
  const dispatch = useAppDispatch();
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    setModalVisible(false);
    const obj = { key: varkey, value: !modalVisible };
    dispatch(setInfoModalOpened(obj));
  };
  const [profileLoading, setProfileLoading] = React.useState(false);
  const hcuModalOpened = useAppSelector(
    (state: any) => state.utilsData.IsHCUModalOpened
  );
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // whatever
  //     setModalVisible(hcuModalOpened)
  //   }, [hcuModalOpened])
  //  );
  useEffect(() => {
    setModalVisible(hcuModalOpened);
  }, [hcuModalOpened]);

  const reminders = useAppSelector(selectActiveChildReminders);
  const activeChild = useAppSelector(selectActiveChild);
  const healthCheckupReminder = reminders.filter(
    (item: any) => item.reminderType == "healthCheckup"
  )[0];
  const renderItem = (index: number): any => {
    if (index === 0) {
      return (
        <FlexCol>
          {upcomingPeriods.length > 0 ? (
            upcomingPeriods?.map((item: any, itemindex: any) => {
              return (
                <UpcomingHealthCheckup
                  item={item}
                  childAgeIndays={childAgeIndays}
                  currentPeriodId={currentPeriod?.id}
                  key={itemindex}
                  headerColor={headerColor}
                  backgroundColor={backgroundColor}
                />
              );
            })
          ) : (
            <Heading4Center>{t("noDataTxt")}</Heading4Center>
          )}
        </FlexCol>
      );
    } else if (index === 1) {
      return (
        <FlexCol>
          {previousPeriods.length > 0 ? (
            previousPeriods?.map((item: any, itemindex: any) => {
              return (
                <View style={styles.previousPeriodsView} key={itemindex}>
                  <PreviousHealthCheckup
                    item={item}
                    key={itemindex}
                    headerColor={headerColor}
                    backgroundColor={backgroundColor}
                  />
                </View>
              );
            })
          ) : (
            <Heading4Center>{t("noDataTxt")}</Heading4Center>
          )}
        </FlexCol>
      );
    }
  };
  const getVaccinationPeriod = (): any => {
    if (
      upcomingPeriods[0]?.vaccination_opens <= childAgeIndays &&
      upcomingPeriods[0]?.vaccination_ends > childAgeIndays
    ) {
      return upcomingPeriods[0];
    } else {
      const prevPeriod = previousPeriods.find(
        (item: any) =>
          item.vaccination_opens <= childAgeIndays &&
          item.vaccination_ends > childAgeIndays
      );
      return prevPeriod;
    }
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

  console.log(upcomingPeriods);
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
                  setIsModalOpened("IsHCUModalOpened");
                }}
              >
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>{t("hcModalText")}</Heading4Centerr>
            </ModalPopupContent>
            <FDirRow>
              <ButtonModal
                onPress={(): any => {
                  setIsModalOpened("IsHCUModalOpened");
                }}
              >
                <ButtonTextTheme numberOfLines={2}>
                  {t("continueInModal")}
                </ButtonTextTheme>
              </ButtonModal>
            </FDirRow>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ToolsBgContainer>
          <TabScreenHeader
            title={t("hcHeader")}
            headerColor={headerColor}
            textColor={headerTextColor}
            setProfileLoading={setProfileLoading}
          />
          <ScrollView
            style={[styles.flex4, { backgroundColor: backgroundColorList }]}
          >
            <MainContainer style={{ backgroundColor: backgroundColor }}>
              <ShiftFromBottom20>
                <Heading2Center>{t("hcSummaryHeader")}</Heading2Center>
              </ShiftFromBottom20>

              {isFutureDate(
                activeChild?.birthDate
              ) ? null : healthCheckupReminder ? null : (
                <Pressable
                  onPress={(): any => {
                    navigation.navigate("AddReminder", {
                      reminderType: "healthCheckup", // from remiderType
                      headerTitle: t("vcReminderHeading"),
                      buttonTitle: t("hcReminderAddBtn"),
                      titleTxt: t("hcReminderText"),
                      titleTxt2: t("hcDefinedReminderText"),
                      warningTxt: t("hcReminderDeleteWarning"),
                      headerColor: headerColor,
                    });
                  }}
                >
                  <ButtonTextSmLine numberOfLines={2}>
                    {t("hcReminderbtn")}
                  </ButtonTextSmLine>
                </Pressable>
              )}
              <ButtonContainerAuto>
                <ButtonHealth
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={(): any =>
                    navigation.navigate("AddChildHealthCheckup", {
                      headerTitle: t("hcNewHeaderTitle"),
                      vcPeriod: getVaccinationPeriod(),
                    })
                  }
                >
                  <ButtonText numberOfLines={2}>{t("hcNewBtn")}</ButtonText>
                </ButtonHealth>
              </ButtonContainerAuto>
            </MainContainer>

            <TabBarContainer>
              {data.map((item, itemindex) => {
                return (
                  <Pressable
                    key={itemindex}
                    style={[
                      styles.flex1,
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
              <FlexCol>{renderItem(selectedIndex)}</FlexCol>
            </ShiftFromTopBottom10>
          </ScrollView>
        </ToolsBgContainer>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};

export default HealthCheckups;

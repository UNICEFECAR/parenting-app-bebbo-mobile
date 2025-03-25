import {
  APP_SHARE,
  DONATE_OPENED,
  EMAIL_SENT,
  FEEDBACK_SUBMIT,
} from "@assets/data/firebaseEvents";
import { appConfig } from "../instance";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  BgDevelopment,
  BgGrowth,
  BgHealth,
  BgVaccination,
} from "@components/shared/BackgroundColors";
import { ButtonModal, ButtonText } from "@components/shared/ButtonGlobal";
import {
  FDirCol,
  FDirRow,
  Flex1,
  FlexDirRow,
} from "@components/shared/FlexBoxStyle";
import {
  HeaderActionView,
  HeaderRowView,
  HeaderTitleView,
} from "@components/shared/HeaderContainerStyle";
import Icon, {
  IconML,
  OuterIconLeft15,
  OuterIconRow,
} from "@components/shared/Icon";
import { ImageIcon } from "@components/shared/Image";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import {
  BubbleContainer,
  BubbleView,
  DrawerHeadContainer,
  DrawerLinkView,
  NavIconSpacing,
  NavIconSpacingAbout,
  SubDrawerHead,
  SubDrawerLinkView,
} from "@components/shared/NavigationDrawer";
import analytics from "@react-native-firebase/analytics";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { bgcolorWhite2, lightShadeColor, secondaryColor } from "@styles/style";
import {
  Heading1Centerr,
  Heading3,
  Heading4,
  Heading4Center,
  Heading5,
} from "@styles/typography";
import { CHILDREN_PATH } from "@types/types";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import HTML from "react-native-render-html";
import { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../App";
import { isFutureDate } from "../services/childCRUD";
import { getVaccinesForPeriodCount } from "../services/notificationService";
import { formatDate, addSpaceToHtml } from "../services/Utils";
import { logEvent } from "../services/EventSyncService";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import useDigitConverter from "../customHooks/useDigitConvert";

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: secondaryColor,
    flex: 1,
  },
  headingFlexShrink: {
    flexShrink: 1,
  },
  iconStyle: {
    alignSelf: "center",
    flex: 1,
    textAlign: "right",
  },
  padding2: {
    paddingLeft: 2,
  },
  scrollViewStyle: {
    backgroundColor: bgcolorWhite2,
    flex: 1,
  },
  textStyle: {
    fontSize: 12,
    fontWeight: "normal",
  },
  touchableLeft: {
    marginLeft: 2,
    padding: 8,
  },
  touchableRight: {
    marginRight: 2,
    padding: 8,
  },
});
const CustomDrawerContent = ({ navigation }: any): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const { convertDigits } = useDigitConverter();
  const [accordvalue, onChangeaccordvalue] = React.useState(false);
  const [aboutAccordValue, onChangeAboutAccordValue] = React.useState(false);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ""
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : []
  );
  const allVaccineData = useAppSelector((state: any) =>
    JSON.parse(state.utilsData.vaccineData)
  );
  const allnotis = useAppSelector(
    (state: any) => state.notificationData.notifications
  );
  const [notifications, setNotifications] = useState<any[]>([]);
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ""
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData
  );
  const allCountries = useAppSelector((state: any) =>
    state.selectedCountry.countries != ""
      ? JSON.parse(state.selectedCountry.countries)
      : []
  );
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId
  );
  const [countryEmail, setCountryEmail] = React.useState("");

  const feedbackItem = surveryData.find((item: any) => item.type == "feedback");
  const userGuideItem = surveryData.find(
    (item: any) => item.type == "user_guide"
  );
  const donateItem = surveryData.find((item: any) => item.type == "donate");
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData.childDataSet.favoriteadvices
      ? state.childData.childDataSet.favoriteadvices
      : []
  );
  const favoritegames = useAppSelector((state: any) =>
    state.childData.childDataSet.favoritegames
      ? state.childData.childDataSet.favoritegames
      : []
  );
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const [favoritescount, setfavoritescount] = useState(0);
  const isOpen = useDrawerStatus() === "open";
  useFocusEffect(
    React.useCallback(() => {
      if (isOpen) {
        let favadvices, favgames;
        if (favoriteadvices && favoriteadvices.length > 0) {
          favadvices = favoriteadvices.length;
        } else {
          favadvices = 0;
        }
        if (favoritegames && favoritegames.length > 0) {
          favgames = favoritegames.length;
        } else {
          favgames = 0;
        }
        setfavoritescount(favadvices + favgames);
      }
    }, [isOpen, activeChild.uuid, favoriteadvices, favoritegames])
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const locale = useAppSelector((state: any) => state.selectedCountry.locale);
  const genders = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ""
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender
      : []
  );
  const [activeChildGenderData, setActiveChildGenderData] =
    React.useState<any>();
  useEffect(() => {
    const selectedCountry = allCountries.find(
      (country: any) => country.CountryID === countryId.toString()
    );
    setCountryEmail(selectedCountry?.country_email);
  }, []);
  useEffect(() => {
    const gender = genders.find((g: any) => g.id === activeChild?.gender);
    setActiveChildGenderData(gender);
  }, [activeChild?.gender]);
  useFocusEffect(
    React.useCallback(() => {
      if (isOpen) {
        // Your dismiss logic here

        if (allnotis.length > 0) {
          const currentChildNotis = allnotis?.find(
            (item: any) => item.childuuid == activeChild.uuid
          );
          if (!isFutureDate(activeChild?.birthDate)) {
            if (currentChildNotis) {
              const currentChildallnoti: any = [];
              if (currentChildNotis.gwcdnotis) {
                currentChildNotis.gwcdnotis.forEach((item: any) => {
                  currentChildallnoti.push(item);
                });
              }
              if (currentChildNotis.hcnotis) {
                currentChildNotis.hcnotis.forEach((item: any) => {
                  currentChildallnoti.push(item);
                });
              }
              if (currentChildNotis.vcnotis) {
                currentChildNotis.vcnotis.forEach((item: any) => {
                  if (item.title == "vcNoti1") {
                    const vcNotisExists = getVaccinesForPeriodCount(
                      allVaccineData,
                      item.growth_period
                    );
                    console.log(vcNotisExists, "..vcNotisExists..");
                    if (
                      vcNotisExists != "" &&
                      vcNotisExists != null &&
                      vcNotisExists != undefined
                    ) {
                      currentChildallnoti.push(item);
                    }
                  } else {
                    currentChildallnoti.push(item);
                  }
                });
              }
              if (currentChildNotis.reminderNotis) {
                currentChildNotis.reminderNotis.forEach((item: any) => {
                  currentChildallnoti.push(item);
                });
              }
              const childBirthDate = DateTime.fromJSDate(
                new Date(activeChild.birthDate)
              ).toMillis();
              const toDay = DateTime.fromJSDate(new Date()).toMillis();

              const combinedNotis = currentChildallnoti
                .sort(
                  (a: any, b: any) =>
                    new Date(a.notificationDate) - new Date(b.notificationDate)
                )
                .filter((item: any) => {
                  return (
                    item.isRead == false &&
                    item.isDeleted == false &&
                    toDay >=
                      DateTime.fromJSDate(
                        new Date(item.notificationDate)
                      ).toMillis() &&
                    childBirthDate <=
                      DateTime.fromJSDate(
                        new Date(item.notificationDate)
                      ).toMillis()
                  );
                });
              setNotifications(
                currentChildallnoti.length > 0 ? combinedNotis : []
              );
            }
          } else {
            setNotifications([]);
          }
        }
      }
    }, [isOpen, activeChild.uuid, allnotis])
  );
  const onShare = async (): Promise<any> => {
    const localeData =
      String(appConfig.buildFor) != appConfig.buildForBebbo ? languageCode : "";
    const messageData = t("appShareText") + appConfig.shareText + localeData;
    console.log(messageData, "..messageData..");
    try {
      const result = await Share.share({
        // message: t('appShareText')+'\nhttps://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
        message: messageData,
        //message:'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
      });
      if (result.action === Share.sharedAction) {
        analytics().logEvent(APP_SHARE);
      }
    } catch (error: any) {
      Alert.alert(t("generalError"));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
    }, [isOpen, activeChild.uuid, allnotis])
  );

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.SECONDARY_COLOR;
  return (
    <>
      <FocusAwareStatusBar
        animated={true}
        backgroundColor={Platform.OS == "ios" ? headerColor : null}
      />
      <View style={styles.containerView}>
        <ScrollView style={styles.scrollViewStyle}>
          <Flex1>
            <Pressable
              onPress={(): any => {
                navigation.navigate("ChildProfileScreen");
                navigation.closeDrawer();
              }}
              style={{
                backgroundColor: headerColor,
              }}
            >
              <DrawerHeadContainer>
                <HeaderRowView>
                  <HeaderTitleView>
                    <FlexDirRow>
                      <OuterIconRow>
                        <OuterIconLeft15>
                          {activeChild.photoUri ? (
                            <ImageIcon
                              source={{
                                uri:
                                  "file://" +
                                  CHILDREN_PATH +
                                  activeChild.photoUri,
                              }}
                            ></ImageIcon>
                          ) : (
                            <Icon
                              name={
                                activeChildGenderData &&
                                genders.find(
                                  (g: any) => g.id === activeChild?.gender
                                )?.unique_name === taxonomyIds?.boyChildGender
                                  ? "ic_baby"
                                  : "ic_baby_girl"
                              }
                              size={36}
                              color="#000"
                            />
                          )}
                        </OuterIconLeft15>
                      </OuterIconRow>
                      <FDirCol>
                        <Heading3>
                          {activeChild.childName != ""
                            ? activeChild.childName
                            : ""}
                        </Heading3>
                        <Heading5>
                          {activeChild.birthDate != "" &&
                          activeChild.birthDate != null &&
                          activeChild.birthDate != undefined &&
                          !isFutureDate(activeChild.birthDate)
                            ? t("drawerMenuchildInfo", {
                                childdob:
                                  activeChild.birthDate != "" &&
                                  activeChild.birthDate != null &&
                                  activeChild.birthDate != undefined
                                    ? formatDate(activeChild.birthDate)
                                    : "",
                              })
                            : t("expectedChildDobLabel")}
                        </Heading5>
                      </FDirCol>
                    </FlexDirRow>
                  </HeaderTitleView>
                  <HeaderActionView>
                    <IconML name="ic_angle_right" size={16} color="#000" />
                  </HeaderActionView>
                </HeaderRowView>
              </DrawerHeadContainer>
            </Pressable>
          </Flex1>

          <DrawerLinkView
            onPress={(): any => {
              navigation.navigate("Home", { screen: "Home" });
              navigation.closeDrawer();
            }}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_home" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenuhomeTxt")}
            </Heading4>
          </DrawerLinkView>

          <DrawerLinkView
            onPress={(): any => {
              navigation.navigate("NotificationsScreen");
              navigation.closeDrawer();
            }}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_notification" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenunotiTxt")}
            </Heading4>
            {notifications.length > 0 ? (
              <BubbleContainer>
                <BubbleView>
                  <Heading5>{convertDigits(notifications.length)}</Heading5>
                </BubbleView>
              </BubbleContainer>
            ) : null}
          </DrawerLinkView>

          <DrawerLinkView
            style={{
              backgroundColor: accordvalue ? lightShadeColor : bgcolorWhite2,
            }}
            onPress={(): any => onChangeaccordvalue(!accordvalue)}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_tools" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenutoolsTxt")}
            </Heading4>
            <Icon
              style={styles.iconStyle}
              name={accordvalue ? "ic_angle_up" : "ic_angle_down"}
              size={10}
              color="#000"
            />
          </DrawerLinkView>

          {accordvalue ? (
            <>
              <SubDrawerLinkView
                onPress={(): any => {
                  navigation.navigate("Home", { screen: "ChildDevelopment" });
                  navigation.closeDrawer();
                }}
              >
                <FDirRow>
                  <BgDevelopment>
                    <NavIconSpacing>
                      <Icon name="ic_milestone" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgDevelopment>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={styles.headingFlexShrink}>
                      {t("drawerMenucdTxt")}
                    </Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={(): any => {
                  navigation.navigate("Home", {
                    screen: "Tools",
                    params: {
                      screen: "VaccinationTab",
                    },
                  });
                  navigation.closeDrawer();
                }}
              >
                <FDirRow>
                  <BgVaccination>
                    <NavIconSpacing>
                      <Icon name="ic_vaccination" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgVaccination>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={styles.headingFlexShrink}>
                      {t("drawerMenuvcTxt")}
                    </Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={(): any => {
                  navigation.navigate("Home", {
                    screen: "Tools",
                    params: {
                      screen: "HealthCheckupsTab",
                    },
                  });
                  navigation.closeDrawer();
                }}
              >
                <FDirRow>
                  <BgHealth>
                    <NavIconSpacing>
                      <Icon name="ic_doctor_chk_up" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgHealth>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={styles.headingFlexShrink}>
                      {t("drawerMenuhcTxt")}
                    </Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={(): any => {
                  navigation.navigate("Home", {
                    screen: "Tools",
                    params: {
                      screen: "ChildgrowthTab",
                    },
                  });
                  navigation.closeDrawer();
                }}
              >
                <FDirRow>
                  <BgGrowth>
                    <NavIconSpacing>
                      <Icon name="ic_growth" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgGrowth>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={styles.headingFlexShrink}>
                      {t("drawerMenucgTxt")}
                    </Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
            </>
          ) : null}
          <DrawerLinkView
            onPress={(): any => {
              navigation.navigate("SupportChat", {
                tabIndex: 0,
                backClicked: "no",
              });
              navigation.closeDrawer();
            }}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_chat" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenuchatTxt")}
            </Heading4>
          </DrawerLinkView>
          <DrawerLinkView
            onPress={(): any => {
              navigation.navigate("Favourites", {
                tabIndex: 0,
                backClicked: "no",
              });
              navigation.closeDrawer();
            }}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_favorites" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenufavTxt")}
            </Heading4>
            {favoritescount > 0 ? (
              <BubbleContainer>
                <BubbleView>
                  <Heading5>{convertDigits(favoritescount)}</Heading5>
                </BubbleView>
              </BubbleContainer>
            ) : null}
          </DrawerLinkView>
          <DrawerLinkView
            onPress={(): any => {
              navigation.navigate("SettingsScreen");
              navigation.closeDrawer();
            }}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_settings" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenusetTxt")}
            </Heading4>
          </DrawerLinkView>

          <DrawerLinkView onPress={(): any => onShare()}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_shareapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>
              {t("drawerMenushareTxt")}
            </Heading4>
          </DrawerLinkView>
          {userGuideItem &&
          userGuideItem != {} &&
          userGuideItem != "" &&
          userGuideItem?.survey_feedback_link &&
          userGuideItem?.survey_feedback_link != "" &&
          userGuideItem?.survey_feedback_link != null ? (
            <DrawerLinkView
              onPress={(): any => {
                Linking.openURL(userGuideItem?.survey_feedback_link);
                // navigation.navigate('UserGuide')
              }}
            >
              <OuterIconRow>
                <OuterIconLeft15>
                  <Icon name="ic_sb_userguide" size={25} color="#000" />
                </OuterIconLeft15>
              </OuterIconRow>

              <Heading4 style={styles.headingFlexShrink}>
                {t("drawerMenuugTxt")}
              </Heading4>
            </DrawerLinkView>
          ) : null}
          {/* <DrawerLinkView onPress={():any => navigation.navigate('AboutusScreen')}> */}
          <DrawerLinkView
            style={{
              backgroundColor: aboutAccordValue
                ? lightShadeColor
                : bgcolorWhite2,
            }}
            onPress={(): any => onChangeAboutAccordValue(!aboutAccordValue)}
          >
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_about" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <>
              <Heading4 style={styles.headingFlexShrink}>
                {t("aboutBebboDrawerMenu", {
                  appName: t("homeScreenheaderTitle"),
                })}
              </Heading4>
            </>
            <Icon
              style={styles.iconStyle}
              name={aboutAccordValue ? "ic_angle_up" : "ic_angle_down"}
              size={10}
              color="#000"
            />
          </DrawerLinkView>
          {aboutAccordValue ? (
            <>
              <DrawerLinkView
                onPress={(): any => {
                  navigation.navigate("AboutusScreen");
                  navigation.closeDrawer();
                }}
              >
                <OuterIconRow>
                  <OuterIconLeft15>
                    <Icon name="ic_sb_about" size={25} color="#000" />
                  </OuterIconLeft15>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("drawerMenuabtTxt")}
                </Heading4>
              </DrawerLinkView>
              <DrawerLinkView
                onPress={(): any => {
                  const eventData = { name: EMAIL_SENT };
                  logEvent(eventData, netInfo.isConnected);
                  console.log("Country email is", countryEmail);
                  Linking.openURL(`mailto:${countryEmail}`);
                }}
              >
                <OuterIconRow>
                  <OuterIconLeft15>
                    <Icon name="ic_contact" size={25} color="#000" />
                  </OuterIconLeft15>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("contactUs")}
                </Heading4>
              </DrawerLinkView>
              <DrawerLinkView onPress={(): any => setModalVisible(true)}>
                <OuterIconRow>
                  <OuterIconLeft15>
                    <Icon name="ic_sb_feedback" size={25} color="#000" />
                  </OuterIconLeft15>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("drawerMenufeedbackTxt")}
                </Heading4>
              </DrawerLinkView>
              <DrawerLinkView
                onPress={(): any => {
                  if (Platform.OS === "android") {
                    if (String(appConfig.buildFor) == "bebbo") {
                      Linking.openURL(
                        "https://play.google.com/store/apps/details?id=org.unicef.ecar.bebbo"
                      );
                    } else if (String(appConfig.buildFor) == "babuni") {
                      Linking.openURL(
                        "https://play.google.com/store/apps/details?id=org.unicef.bangladesh.babuni"
                      );
                    } else {
                      Linking.openURL(
                        "https://play.google.com/store/apps/details?id=org.unicef.kosovo.foleja"
                      );
                    }
                  } else {
                    if (String(appConfig.buildFor) == "bebbo") {
                      Linking.openURL(
                        "itms://itunes.apple.com/in/app/apple-store/id1588918146?action=write-review"
                      );
                    } else if (String(appConfig.buildFor) == "babuni") {
                      Linking.openURL(
                        "itms://itunes.apple.com/bangla/app/apple-store/id6504746888?action=write-review"
                      );
                    } else {
                      Linking.openURL(
                        "itms://itunes.apple.com/xk/app/apple-store/id1607980150?action=write-review"
                      );
                    }
                  }
                }}
              >
                <OuterIconRow>
                  <OuterIconLeft15>
                    <Icon name="ic_sb_loveapp" size={25} color="#000" />
                  </OuterIconLeft15>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("drawerMenurateTxt")}
                </Heading4>
              </DrawerLinkView>
              <DrawerLinkView
                onPress={(): any => {
                  navigation.navigate("PrivacyPolicy");
                  navigation.closeDrawer();
                }}
              >
                <OuterIconRow>
                  <OuterIconLeft15>
                    <Icon name="ic_sb_privacy" size={25} color="#000" />
                  </OuterIconLeft15>
                </OuterIconRow>
                <Heading4 style={styles.headingFlexShrink}>
                  {t("drawerMenuPrivacyTxt")}
                </Heading4>
              </DrawerLinkView>
            </>
          ) : null}
          {donateItem &&
          donateItem != {} &&
          donateItem != "" &&
          donateItem?.survey_feedback_link &&
          donateItem?.survey_feedback_link != "" &&
          donateItem?.survey_feedback_link != null ? (
            <DrawerLinkView
              onPress={(): any => {
                analytics().logEvent(DONATE_OPENED);
                Linking.openURL(donateItem?.survey_feedback_link);
              }}
            >
              <OuterIconRow>
                <OuterIconLeft15>
                  <Icon
                    name="ic_donate"
                    size={20}
                    color="#000"
                    style={styles.padding2}
                  />
                </OuterIconLeft15>
              </OuterIconRow>
              <Heading4 style={styles.headingFlexShrink}>
                {t("donateButton")}
              </Heading4>
            </DrawerLinkView>
          ) : null}
        </ScrollView>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible === true}
        onRequestClose={(): any => {
          setModalVisible(false);
        }}
        onDismiss={(): any => {
          setModalVisible(false);
        }}
      >
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={(): any => {
                  setModalVisible(false);
                }}
              >
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            {feedbackItem ? (
              <>
                <ModalPopupContent>
                  <Heading1Centerr>{feedbackItem?.title}</Heading1Centerr>

                  {feedbackItem && feedbackItem?.body ? (
                    <HTML
                      source={{ html: addSpaceToHtml(feedbackItem?.body) }}
                      ignoredStyles={["color", "fontSize", "fontFamily"]}
                    />
                  ) : null}
                </ModalPopupContent>
                <FDirRow>
                  <ButtonModal
                    onPress={(): any => {
                      setModalVisible(false);
                      analytics().logEvent(FEEDBACK_SUBMIT);
                      Linking.openURL(feedbackItem?.survey_feedback_link);
                    }}
                  >
                    <ButtonText numberOfLines={2}>
                      {t("continueInModal")}
                    </ButtonText>
                  </ButtonModal>
                </FDirRow>
              </>
            ) : (
              <Heading4Center>{t("noDataTxt")}</Heading4Center>
            )}
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};

export default React.memo(CustomDrawerContent);

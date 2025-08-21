import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  ButtonLinkPress,
  ButtonTextLg,
  ButtonWithBorder,
} from "@components/shared/ButtonGlobal";
import { AreaContainer } from "@components/shared/Container";
import { FDirRow, FlexColEnd, FlexCol } from "@components/shared/FlexBoxStyle";
import {
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView,
  HeaderIconPress,
} from "@components/shared/HeaderContainerStyle";
import Icon, {
  IconML,
  OuterIconRight,
  OuterIconRow,
  TickView1,
  TickView4,
  TickView7,
} from "@components/shared/Icon";
import { ImageIcon } from "@components/shared/Image";
import {
  ParentData,
  ParentLabel,
  ParentListView,
  ParentRowView,
  ParentSection,
  ProfileActionView,
  ProfileContentView,
  ProfileIconView,
  ProfileListDefault,
  ProfileListInner,
  ProfileListViewSelected1,
  ProfileSectionView,
  ProfileTextView,
} from "@components/shared/ProfileListingStyle";
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import {
  Heading2w,
  Heading3,
  Heading5,
  ShiftFromTop30,
} from "@styles/typography";
import { CHILDREN_PATH } from "@types/types";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Dimensions,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../../App";
import {
  getAllChildren,
  getAllConfigData,
  setActiveChild,
} from "../../services/childCRUD";
import { formatDate } from "../../services/Utils";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import { bgcolorWhite, bgcolorWhite2, secondaryBtnColor } from "@styles/style";
import { StackNavigationProp } from "@react-navigation/stack";
import { setAllChildData } from "../../redux/reducers/childSlice";
import { selectActiveChild, selectAllConfigData, selectChildAge, selectChildGenders, selectChildList, selectParentGender, selectRelationshipToParent } from "../../services/selectors";

const styles = StyleSheet.create({
  alignItemsStart: { alignItems: "flex-start" },
  areaContainerInnerView: { flexDirection: "column" },
  autoHeight: { height: "auto" },
  buttonLinkPress: { justifyContent: "flex-end", width: 50 },
  flex1: { flex: 1 },
  flexCol: { backgroundColor: bgcolorWhite2 },
  flexShrink1: { flexShrink: 1 },
  fontText: { fontSize: 12, fontWeight: "normal" },
  headerTitleText: {
    color: bgcolorWhite,
  },
  headingText1: { fontSize: 12, fontWeight: "normal" },
  imageIcon: { borderRadius: 20, height: 40, width: 40 },
  marginLeft15: { marginLeft: 15 },
  maxHeight50: { maxHeight: 50 },
  paddingLeft30: { paddingLeft: 30 },
  plusBtnColor: {
    color: secondaryBtnColor,
    textTransform: "uppercase",
  },
  profileActionView: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  profileListDefault: { flexDirection: "column", flex: 1 },
  profileTextView: { paddingRight: 5 },
  textDecorationNone: { textDecorationLine: "none" },
});
type NotificationsNavigationProp = StackNavigationProp<any>;

type Props = {
  navigation: NotificationsNavigationProp;
};
const ChildProfile = ({ navigation }: Props): any => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [parentViewHeight, setParentViewheight] = useState(0);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [isChildSwitch, setISChildSwitch] = React.useState(false);
  const [profileViewHeight, setProfileViewheight] = useState(0);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const secopndaryTintColor = themeContext?.colors.SECONDARY_TINTCOLOR;
  const genders = useAppSelector(selectChildGenders);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const dispatch = useAppDispatch();
  const childAge = useAppSelector(selectChildAge);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        getAllChildren(dispatch, childAge, 0);
        getAllConfigData(dispatch);
      });
      setTimeout(() => {
        navigation.dispatch((state: any) => {
          // Remove the home route from the stack
          const routes = state.routes.filter(
            (r: any) =>
              r.name !== "LoadingScreen" &&
              r.name !== "EditChildProfile" &&
              r.name !== "AddExpectingChildProfile"
          );

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 50);
      return () => task.cancel();
    }, [])
  );

  const childList = useAppSelector(selectChildList);
  const activeChild = useAppSelector(selectActiveChild);

  useEffect(() => {
    const backAction = (): any => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    navigation.addListener("gestureEnd", backAction);

    return (): any => {
      navigation.removeListener("gestureEnd", backAction);
      backHandler.remove();
    };
  }, [navigation, isFocused]);
  const isFutureDate = (date: Date): any => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  const onLayout = (event: any): any => {
    setParentViewheight(event.nativeEvent.layout.height);
  };
  const currentActiveChild = activeChild.uuid;

  const allConfigData = useAppSelector(selectAllConfigData);
  const userParentalRoleData =
    allConfigData?.length > 0
      ? allConfigData.filter((item: any) => item.key === "userParentalRole")
      : [];
  const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item: any) => item.key === "userName")
      : [];
  const relationshipToParentGlobal = useAppSelector(selectRelationshipToParent);
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const userRelationToParent =
    allConfigData?.length > 0
      ? allConfigData.filter((item: any) => item.key === "userRelationToParent")
      : [];
  const relationshipData = useAppSelector(selectParentGender);

  const relationshipValue =
    relationshipData.length > 0 && userParentalRoleData.length > 0
      ? relationshipData.find(
          (o: any) => String(o.unique_name) === userParentalRoleData[0].value
        )
      : "";
  const relationshipToParent =
    relationshipToParentGlobal.length > 0 && userRelationToParent.length > 0
      ? relationshipToParentGlobal.find(
          (o: any) => String(o.unique_name) === userRelationToParent[0].value
        )
      : "";
  const windowHeight = Dimensions.get("window").height;

  const SortedchildList = [...childList].sort((a: any, b: any): any => {
    if (a.uuid == currentActiveChild) return -1;
  });
  useEffect(() => {
    if (isChildSwitch) {
      dispatch(setAllChildData(SortedchildList));
      setISChildSwitch(false);
    }
  }, [SortedchildList, isChildSwitch]);
  const renderChildProfile = (
    dispatch: any,
    data: any,
    index: number,
    genderName: any,
    navigationCustom: any
  ): any => (
    <View key={data.uuid}>
      {currentActiveChild != "" &&
      currentActiveChild != null &&
      currentActiveChild != undefined &&
      currentActiveChild == data.uuid ? (
        <ProfileListViewSelected1>
          <ProfileIconView>
            {data.photoUri ? (
              <ImageIcon
                source={{ uri: `file://${CHILDREN_PATH}${data.photoUri}` }}
                style={styles.imageIcon}
              />
            ) : (
              <Icon
                name={
                  genderName?.unique_name === taxonomyIds?.boyChildGender
                    ? "ic_baby"
                    : "ic_baby_girl"
                }
                size={40}
                color="#000"
              />
            )}
          </ProfileIconView>
          <ProfileTextView style={styles.profileTextView}>
            <ProfileSectionView>
              <Heading3 style={styles.flexShrink1}>
                {data.childName}
                {genderName != "" &&
                genderName != null &&
                genderName != undefined ? (
                  <Text style={styles.headingText1}>
                    {", " + genderName?.name}
                  </Text>
                ) : (
                  <Text style={styles.headingText1}>
                    {", " + t("chilGender2")}
                  </Text>
                )}
              </Heading3>
            </ProfileSectionView>
            <Heading5>
              {data.birthDate != "" &&
              data.birthDate != null &&
              data.birthDate != undefined &&
              !isFutureDate(data.birthDate)
                ? t("childProfileBornOn", {
                    childdob:
                      data.birthDate != null ? formatDate(data.birthDate) : "",
                  })
                : t("expectedChildDobLabel")}
            </Heading5>
          </ProfileTextView>

          <ProfileActionView style={styles.profileActionView}>
            <FlexColEnd>
              <FDirRow>
                <OuterIconRow>
                  <OuterIconRight>
                    <TickView7>
                      <Icon name="ic_activate_tag" size={11} color="#009B00" />
                    </TickView7>
                  </OuterIconRight>
                  <OuterIconRight>
                    <Pressable
                      onPress={(): any => {
                        data.index = index;
                        navigationCustom.navigate("EditChildProfile", {
                          childData: data,
                        });
                        // if (isFutureDate(data.birthDate)) {
                        //   navigationCustom.navigate(
                        //     "AddExpectingChildProfile",
                        //     { childData: data }
                        //   );
                        // } else {
                        //   navigationCustom.navigate("EditChildProfile", {
                        //     childData: data,
                        //   });
                        // }
                      }}
                    >
                      <TickView1>
                        <Icon name="ic_edit" size={16} color="#000" />
                      </TickView1>
                    </Pressable>
                  </OuterIconRight>
                </OuterIconRow>
              </FDirRow>
            </FlexColEnd>
          </ProfileActionView>
        </ProfileListViewSelected1>
      ) : (
        <ProfileListDefault
          style={[
            styles.profileListDefault,
            {
              backgroundColor: secopndaryTintColor,
            },
          ]}
        >
          <ProfileListInner>
            <ProfileIconView>
              {data.photoUri ? (
                <ImageIcon
                  source={{ uri: `file://${CHILDREN_PATH}${data.photoUri}` }}
                  style={styles.imageIcon}
                />
              ) : (
                <Icon
                  name={
                    genderName?.unique_name === taxonomyIds?.boyChildGender
                      ? "ic_baby"
                      : "ic_baby_girl"
                  }
                  size={40}
                  color="#000"
                />
              )}
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView style={styles.alignItemsStart}>
                <Heading3>
                  {data.childName}
                  {genderName != "" &&
                  genderName != null &&
                  genderName != undefined ? (
                    <Text style={styles.fontText}>
                      {", " + genderName?.name}
                    </Text>
                  ) : null}
                </Heading3>
              </ProfileSectionView>
              <Heading5>
                {data.birthDate != "" &&
                data.birthDate != null &&
                data.birthDate != undefined &&
                !isFutureDate(data.birthDate)
                  ? t("childProfileBornOn", {
                      childdob:
                        data.birthDate != null
                          ? formatDate(data.birthDate)
                          : "",
                    })
                  : t("expectedChildDobLabel")}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView style={styles.profileActionView}>
              <FlexColEnd>
                <FDirRow>
                  <OuterIconRow>
                    <Pressable
                      onPress={(): any => {
                        setProfileLoading(true);
                        setTimeout(async () => {
                          const setData = await setActiveChild(
                            languageCode,
                            data.uuid,
                            dispatch,
                            childAge,
                            true,
                            taxonomyIds?.boyChildGender
                          );

                          getAllChildren(dispatch, childAge, 0);
                          if (setData == "activeset") {
                            setProfileLoading(false);
                            setISChildSwitch(true);
                          }
                        }, 0);
                      }}
                    >
                      <OuterIconRight style={styles.paddingLeft30}>
                        <TickView4>
                          {/* <Icon name="ic_tick" size={11} color="#000000" /> */}
                        </TickView4>
                      </OuterIconRight>
                    </Pressable>
                    <OuterIconRight>
                      <Pressable
                        onPress={(): any => {
                          navigationCustom.navigate("EditChildProfile", {
                            childData: data,
                          });
                          data.index = index;
                          // if (isFutureDate(data.birthDate)) {
                          //   navigationCustom.navigate(
                          //     "AddExpectingChildProfile",
                          //     { childData: data }
                          //   );
                          // } else {
                          //   navigationCustom.navigate("EditChildProfile", {
                          //     childData: data,
                          //   });
                          // }
                        }}
                      >
                        <TickView1>
                          <Icon name="ic_edit" size={16} color="#000" />
                        </TickView1>
                      </Pressable>
                    </OuterIconRight>
                  </OuterIconRow>
                </FDirRow>
              </FlexColEnd>
            </ProfileActionView>
          </ProfileListInner>
        </ProfileListDefault>
      )}
    </View>
  );

  return (
    <>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <HeaderRowView
          style={[
            styles.maxHeight50,
            {
              backgroundColor: headerColor,
            },
          ]}
        >
          <HeaderIconView>
            <HeaderIconPress
              onPress={(e): any => {
                e.stopPropagation();
                navigation.goBack();
              }}
            >
              <IconML name={"ic_back"} color="#FFF" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2w style={styles.headerTitleText} numberOfLines={1}>
              {t("childProfileHeader")}
            </Heading2w>
          </HeaderTitleView>
        </HeaderRowView>
        <FlexCol style={styles.flexCol}>
          <AreaContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.areaContainerInnerView}>
                <ScrollView
                  style={[
                    styles.autoHeight,
                    {
                      maxHeight:
                        windowHeight -
                        parentViewHeight -
                        profileViewHeight -
                        140,
                    },
                  ]}
                  nestedScrollEnabled={true}
                >
                  {SortedchildList.length > 0
                    ? SortedchildList.map((item: any, index: number) => {
                        let genderLocal =
                          genders?.length > 0 && item.gender != ""
                            ? genders.find(
                                (genderset: any) =>
                                  genderset.id == parseInt(item.gender)
                              )
                            : "";

                        if (genderLocal == "" && genderLocal == undefined) {
                          genderLocal = t("chilGender2");
                        }
                        return renderChildProfile(
                          dispatch,
                          item,
                          index,
                          genderLocal,
                          navigation
                        );
                      })
                    : null}
                </ScrollView>

                <ParentListView
                  style={{ backgroundColor: secopndaryTintColor }}
                  onLayout={onLayout}
                >
                  <ProfileContentView>
                    <ProfileTextView>
                      <Heading3>{t("parentDetailsTxt")}</Heading3>
                    </ProfileTextView>
                    <ProfileActionView>
                      <ButtonLinkPress
                        style={styles.buttonLinkPress}
                        onPress={(): any => {
                          navigation.navigate("EditParentDetails", {
                            userParentalRoleData:
                              relationshipToParent != undefined &&
                              relationshipToParent != null
                                ? relationshipToParent?.id
                                : "",
                            parentEditName:
                              userNameData?.length > 0
                                ? userNameData[0].value
                                : "",
                            userRelationToParentEdit:
                              relationshipValue != undefined &&
                              relationshipValue != null
                                ? relationshipValue.id
                                : "",
                          });
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={styles.textDecorationNone}
                        >
                          {" "}
                          <Icon name="ic_edit" size={16} color="#000" />
                        </Text>
                      </ButtonLinkPress>
                    </ProfileActionView>
                  </ProfileContentView>

                  <ProfileContentView>
                    <ParentRowView>
                      <ParentSection>
                        <ParentLabel>
                          <Text>{t("childSetuprelationSelectTitle")}</Text>
                        </ParentLabel>
                        <ParentData>
                          <Text style={styles.marginLeft15}>
                            {userRelationToParent?.length > 0
                              ? relationshipToParent?.name
                              : ""}
                          </Text>
                        </ParentData>
                      </ParentSection>
                      <ParentSection>
                        <ParentLabel>
                          <Text>{t("parentGender")}</Text>
                        </ParentLabel>
                        <ParentData>
                          <Text style={styles.marginLeft15}>
                            {userParentalRoleData?.length > 0
                              ? relationshipValue?.name
                              : ""}
                          </Text>
                        </ParentData>
                      </ParentSection>
                      <ParentSection>
                        <ParentLabel>
                          <Text>{t("parentNameLabel")}</Text>
                        </ParentLabel>
                        <ParentData>
                          <Text style={styles.marginLeft15}>
                            {userNameData?.length > 0
                              ? userNameData[0].value
                              : ""}
                          </Text>
                        </ParentData>
                      </ParentSection>
                    </ParentRowView>
                  </ProfileContentView>
                </ParentListView>

                <ShiftFromTop30>
                  <ButtonWithBorder
                    onPress={(): any => {
                      navigation.navigate("EditChildProfile", {
                        childData: null,
                      });
                    }}
                  >
                    <OuterIconRow>
                      <ButtonTextLg style={styles.plusBtnColor}>
                        {t("childSetupListaddSiblingBtn")}
                      </ButtonTextLg>
                    </OuterIconRow>
                  </ButtonWithBorder>

                  <ButtonWithBorder
                    onPress={(): any => {
                      navigation.navigate("AddExpectingChildProfile", {
                        childData: null,
                      });
                    }}
                  >
                    <OuterIconRow>
                      <ButtonTextLg style={styles.plusBtnColor}>
                        {t("expectChildAddTxt")}
                      </ButtonTextLg>
                    </OuterIconRow>
                  </ButtonWithBorder>
                </ShiftFromTop30>
              </View>
            </ScrollView>
          </AreaContainer>
        </FlexCol>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};

export default ChildProfile;

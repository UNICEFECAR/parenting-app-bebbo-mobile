import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import { backup } from "../services/backup";
import { ONBOARDING_CHILD_COUNT } from "@assets/data/firebaseEvents";
import { appConfig } from "../instances";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  ButtonPrimary,
  ButtonRow,
  ButtonUpperCaseText,
} from "@components/shared/ButtonGlobal";
import {
  ChildContentArea,
  ChildRelationList,
  ChildSection,
  FormContainer1,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
} from "@components/shared/ChildSetupStyle";
import Icon from "@components/shared/Icon";
import OnboardingContainer from "@components/shared/OnboardingContainer";
import ToggleRadios from "@components/ToggleRadios";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import React, { useRef, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  BackHandler,
  Alert,
  StyleSheet,
} from "react-native";
import ActionSheet, {type AppActionSheetRef} from "@components/shared/AppActionSheet";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../App";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import {
  ConfigSettingsEntity,
  ConfigSettingsSchema,
} from "../database/schema/ConfigSettingsSchema";
import { setInfoModalOpened } from "../redux/reducers/utilsSlice";
import {
  apiJsonDataGet,
  getAllChildren,
  setActiveChild,
} from "../services/childCRUD";
import { notiPermissionUtil } from "../services/Utils";
import {
  Heading1Centerw,
  Heading3,
  SideSpacing25,
  ShiftFromTop50,
  Heading3Centerw,
  ShiftFromTopBottom20,
  ShiftFromTop10,
  ShiftFromTop20,
} from "@styles/typography";
import { setAllLocalNotificationGenerateType } from "../redux/reducers/notificationSlice";
import { bgcolorWhite } from "@styles/style";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import { logEvent } from "../services/EventSyncService";
import TextInputML from "@components/shared/TextInputML";
import { selectChildAge, selectChildGenders, selectParentGender, selectRelationshipToParent } from "../services/selectors";
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: bgcolorWhite,
    flex: 1,
  },
  headingStyle1: {
    fontWeight: "bold",
    textAlign: "center",
  },
  headingStyle2: {
    textAlign: "center",
  },
  scrollViewStyle: {
    padding: 0,
    paddingTop: 0,
  },
  textInputStyle: {
    width: "100%",
  },
});
const ChildImportSetup = (props: any): any => {
  const netInfo = useNetInfoHook();
  const { importResponse } = props.route.params;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [relationship, setRelationship] = useState("");
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState("");
  const [name, setName] = React.useState("");
  const actionSheetRef = useRef<AppActionSheetRef>(null);
  const themeContext = useContext(ThemeContext);
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const genders = useAppSelector(selectChildGenders);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const childAge = useAppSelector(selectChildAge);
  let relationshipData = useAppSelector(selectParentGender);
  relationshipData = relationshipData
    .map((v: any) => ({ ...v, title: v.name }))
    .filter(function (e: any) {
      return e.unique_name != taxonomyIds?.bothParentGender;
    });

  const relationshipToParent = useAppSelector(selectRelationshipToParent);
  useEffect(() => {
    const backAction = (): any => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribeGesture = props.navigation.addListener("gestureEnd", backAction);
    return (): any => {
      unsubscribeGesture();
      backHandler.remove();
    };
  }, [props.navigation]);

  useEffect(() => {
    const propsData = props?.route?.params;
    setRelationship(propsData?.relationData);
    setRelationshipName(propsData?.relationshipNameData);
    setUserRelationToParent(propsData?.userRelationToParentData);
    setName(propsData?.parentName);
  }, [props?.route?.params]);

  const getCheckedParentItem = (checkedItem: any): any => {
    if (
      typeof checkedItem.id === "string" ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.unique_name);
    } else {
      setRelationship(checkedItem.unique_name);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      notiPermissionUtil();
      props.navigation.dispatch((state: any) => {
        // Remove the home route from the stack
        const routes = state.routes.filter(
          (r: any) => r.name !== "LoadingScreen"
        );

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    }, [props.navigation])
  );

  const restoreRunning = useRef(false);
  const [restoring, setRestoring] = useState(false);
  const completeImport = async (): Promise<void> => {
    if (restoreRunning.current) return;
    restoreRunning.current = true;
    setRestoring(true);
    try {
      const data = typeof importResponse === "string" ? JSON.parse(importResponse) : importResponse;
      const children = await backup.restoreChildren(data, genders);
      for (const [key, value] of [
        ["userParentalRole", relationship],
        ["userRelationToParent", String(userRelationToParent)],
        ["userEnteredChildData", "true"],
        ["userName", name],
      ]) {
        await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, key, value);
      }
      const settings = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(
        ConfigSettingsSchema, "key='currentActiveChildId'"
      );
      const previousId = settings?.[0]?.value;
      await setActiveChild(languageCode,
        children.some((child: any) => child.uuid === previousId) ? previousId : "",
        dispatch, childAge, false, taxonomyIds?.boyChildGender);
      const childList = await getAllChildren(dispatch, childAge, 1);
      dispatch(setInfoModalOpened({key: "generateNotifications", value: true}));
      dispatch(setAllLocalNotificationGenerateType({generateFlag: true, generateType: "add", childuuid: "all"}));
      props.navigation.reset({index: 0, routes: [{name: "LoadingScreen", params: {
        apiJsonData: apiJsonDataGet("all"), prevPage: "ChildSetup",
      }}]});
    } catch (error) {
      console.error("Backup restore failed", error);
      Alert.alert("", t("generalError"));
    } finally {
      restoreRunning.current = false;
      setRestoring(false);
    }
  };

  return (
    <>
      <OverlayLoadingComponent loading={restoring} />
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <OnboardingContainer>
            <ChildContentArea>
              <ChildSection>
                <View>
                  <ShiftFromTop50>
                    <Heading1Centerw style={styles.headingStyle1}>
                      {t("successOnboardingImport")}
                    </Heading1Centerw>
                  </ShiftFromTop50>
                  <ShiftFromTop10>
                    <Text></Text>
                  </ShiftFromTop10>
                  <ShiftFromTopBottom20>
                    <Heading3Centerw style={styles.headingStyle2}>
                      {t("updateImportText")}
                    </Heading3Centerw>
                  </ShiftFromTopBottom20>
                  <ShiftFromTop20>
                    <LabelText>{t("parentNameText")}</LabelText>
                    <FormInputBox>
                      <TextInputML
                        style={styles.textInputStyle}
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={30}
                        onChangeText={(value: any): any => {
                          if (value.replace(/\s/g, "") == "") {
                            setName(value.replace(/\s/g, ""));
                          } else {
                            setName(
                              value.replace(
                                appConfig.regexpEmojiPresentation,
                                ""
                              )
                            );
                          }
                        }}
                        value={name}
                        //placeholder={t('parentNamePlaceTxt')}
                        //placeholderTextColor={"#77777779"}
                        allowFontScaling={false}
                      />
                    </FormInputBox>
                  </ShiftFromTop20>
                  <ShiftFromTop20>
                    <FormInputGroup
                      onPress={(): any => {
                        actionSheetRef.current?.show();
                      }}
                    >
                      <LabelText>
                        {t("childSetuprelationSelectTitle")}
                      </LabelText>
                      <FormInputBox>
                        <FormDateText>
                          <Text>
                            {relationshipname
                              ? relationshipname
                              : t("childSetuprelationSelectText")}
                          </Text>
                        </FormDateText>
                        <FormDateAction>
                          <Icon name="ic_angle_down" size={10} color="#000" />
                        </FormDateAction>
                      </FormInputBox>
                    </FormInputGroup>
                    <View>
                      {userRelationToParent != null &&
                      userRelationToParent != undefined &&
                      userRelationToParent !=
                        taxonomyIds.relationShipMotherId &&
                      userRelationToParent !=
                        taxonomyIds?.relationShipFatherId ? (
                        <FormContainer1>
                          <LabelText>{t("parentGender")}</LabelText>
                          <ToggleRadios
                            options={relationshipData}
                            tickbgColor={headerColor}
                            tickColor={"#FFF"}
                            getCheckedItem={getCheckedParentItem}
                          />
                        </FormContainer1>
                      ) : null}
                    </View>
                  </ShiftFromTop20>
                </View>
              </ChildSection>
            </ChildContentArea>
          </OnboardingContainer>
        </ScrollView>

        <ActionSheet ref={actionSheetRef}>
          <View style={{ marginBottom: 20 }}>
            {relationshipToParent.map((item: any, index: any) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={(): any => {
                      setUserRelationToParent(item.unique_name);
                      if (
                        item.unique_name == taxonomyIds?.relationShipMotherId
                      ) {
                        if (
                          typeof taxonomyIds?.femaleData.unique_name ===
                            "string" ||
                          taxonomyIds?.femaleData.unique_name instanceof String
                        ) {
                          setRelationship(taxonomyIds?.femaleData?.unique_name);
                        } else {
                          setRelationship(
                            String(taxonomyIds?.femaleData?.unique_name)
                          );
                        }
                      } else if (
                        item.unique_name == taxonomyIds?.relationShipFatherId
                      ) {
                        if (
                          typeof taxonomyIds?.maleData.unique_name ===
                            "string" ||
                          taxonomyIds?.maleData.unique_name instanceof String
                        ) {
                          setRelationship(taxonomyIds?.maleData.unique_name);
                        } else {
                          setRelationship(
                            String(taxonomyIds?.maleData.unique_name)
                          );
                        }
                      } else {
                        if (
                          userRelationToParent ==
                            taxonomyIds?.relationShipMotherId ||
                          userRelationToParent ==
                            taxonomyIds?.relationShipFatherId
                        ) {
                          setRelationship("");
                        }
                      }
                      console.log("relationship name", item.name);
                      setRelationshipName(item.name);
                      actionSheetRef.current?.hide();
                    }}
                  >
                    <Heading3>
                      {console.log(item.name)}
                      {item.name}
                    </Heading3>
                  </Pressable>
                </ChildRelationList>
              );
            })}
          </View>
        </ActionSheet>
        <SideSpacing25>
          <ButtonRow>
            <ButtonPrimary
              disabled={
                restoring || relationship == null ||
                relationship == "" ||
                relationship == undefined ||
                userRelationToParent == undefined
                  ? true
                  : false
              }
              onPress={completeImport}
            >
              <ButtonUpperCaseText>
                {t("childSetupcontinueBtnText")}
              </ButtonUpperCaseText>
            </ButtonPrimary>
          </ButtonRow>
        </SideSpacing25>
      </View>
    </>
  );
};

export default ChildImportSetup;

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
import React, { createRef, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  BackHandler,
  StyleSheet,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../App";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../database/schema/ChildDataSchema";
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
import { getChild, notiPermissionUtil } from "../services/Utils";
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
  let { importResponse } = props.route.params;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [relationship, setRelationship] = useState("");
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState("");
  const [name, setName] = React.useState("");
  const actionSheetRef = createRef<any>();
  const themeContext = useContext(ThemeContext);
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const genders = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ""
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender
      : []
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const childAge = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ""
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : []
  );
  let relationshipData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender
  );
  relationshipData = relationshipData
    .map((v: any) => ({ ...v, title: v.name }))
    .filter(function (e: any) {
      return e.unique_name != taxonomyIds?.bothParentGender;
    });

  const relationshipToParent = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData)
        .relationship_to_parent
  );
  useEffect(() => {
    const backAction = (): any => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    props.navigation.addListener("gestureEnd", backAction);
    return (): any => {
      props.navigation.removeListener("gestureEnd", backAction);
      backHandler.remove();
    };
  }, []);

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
    }, [])
  );

  return (
    <>
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
                        clearButtonMode="always"
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
                        actionSheetRef.current?.setModalVisible(true);
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
                      actionSheetRef.current?.setModalVisible(false);
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
                relationship == null ||
                relationship == "" ||
                relationship == undefined ||
                userRelationToParent == undefined
                  ? true
                  : false
              }
              onPress={async (e: any): Promise<any> => {
                e.stopPropagation();
                if (importResponse) {
                  importResponse = JSON.parse(importResponse);
                }
                let counter: any = 0;
                if (importResponse?.length > 0) {
                  const resolvedPromises = importResponse.map(
                    async (item: any) => {
                      if (
                        item.birthDate != null &&
                        item.birthDate != undefined
                      ) {
                        const itemnew = await getChild(item, genders);
                        const childData: any = [];
                        childData.push(itemnew);
                        await userRealmCommon.create<ChildEntity>(
                          ChildEntitySchema,
                          childData
                        );
                        let childId =
                          await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(
                            ConfigSettingsSchema,
                            "key='currentActiveChildId'"
                          );
                        await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
                          ConfigSettingsSchema,
                          "userParentalRole",
                          relationship
                        );
                        await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
                          ConfigSettingsSchema,
                          "userRelationToParent",
                          String(userRelationToParent)
                        );
                        await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
                          ConfigSettingsSchema,
                          "userEnteredChildData",
                          "true"
                        );
                        await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
                          ConfigSettingsSchema,
                          "userName",
                          name
                        );
                        if (counter == 0) {
                          if (childId?.length > 0) {
                            childId = childId[0].value;
                            const activeChildData = importResponse.filter(
                              (x: any) => x.uuid == childId
                            );
                            if (activeChildData.length > 0) {
                              await setActiveChild(
                                languageCode,
                                childId,
                                dispatch,
                                childAge,
                                false,
                                taxonomyIds?.boyChildGender
                              );
                            } else {
                              await setActiveChild(
                                languageCode,
                                "",
                                dispatch,
                                childAge,
                                false,
                                taxonomyIds?.boyChildGender
                              );
                            }
                          } else {
                            await setActiveChild(
                              languageCode,
                              "",
                              dispatch,
                              childAge,
                              false,
                              taxonomyIds?.boyChildGender
                            );
                          }
                          counter++;
                        }
                      }
                    }
                  );
                  const notiFlagObj = {
                    key: "generateNotifications",
                    value: true,
                  };
                  dispatch(setInfoModalOpened(notiFlagObj));
                  const localnotiFlagObj = {
                    generateFlag: true,
                    generateType: "add",
                    childuuid: "all",
                  };
                  dispatch(
                    setAllLocalNotificationGenerateType(localnotiFlagObj)
                  );
                  await Promise.all(resolvedPromises).then(async (item) => {
                    console.log("item--", item);
                    if (importResponse.length > 0) {
                      const childList = await getAllChildren(
                        dispatch,
                        childAge,
                        1
                      );
                      // const Ages = await getAge(childList, childAge);
                      // let apiJsonData;
                      // if (Ages?.length > 0) {
                      //   apiJsonData = apiJsonDataGet(String(Ages), "all")
                      // }
                      // else {
                      //   apiJsonData = apiJsonDataGet("all", "all")
                      // }
                      const apiJsonData = apiJsonDataGet("all");
                      const eventData = {
                        name: ONBOARDING_CHILD_COUNT,
                        params: { child_count: childList?.length },
                      };
                      logEvent(eventData, netInfo.isConnected);
                      // await logAnalyticsEvent(ONBOARDING_CHILD_COUNT, { child_count: childList?.length })

                      props.navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: "LoadingScreen",
                            params: {
                              apiJsonData: apiJsonData,
                              prevPage: "ChildSetup",
                            },
                          },
                        ],
                      });
                    } else {
                      // BackHandler.exitApp();
                    }
                  });
                }
              }}
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

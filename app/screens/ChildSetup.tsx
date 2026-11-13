import { appConfig } from "../instances";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ButtonPrimary,
  ButtonUpperCaseText,
} from "@components/shared/ButtonGlobal";
import {
  ChildCenterView,
  ChildRelationList,
  ChildSetupDivider,
  FormContainer1,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
  OrHeadingView,
  ParentSetUpDivider,
} from "@components/shared/ChildSetupStyle";
import Icon from "@components/shared/Icon";
import OnboardingContainer from "@components/shared/OnboardingContainer";
import {
  FlexCol,
  FlexRow,
  Flex1,
  Flex2,
  FDirRow,
} from "@components/shared/FlexBoxStyle";
import OnboardingHeading from "@components/shared/OnboardingHeading";
import ToggleRadios from "@components/ToggleRadios";
import { RootStackParamList } from "@navigation/types";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import ActionSheet, {type AppActionSheetRef} from "@components/shared/AppActionSheet";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../App";
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../database/schema/ChildDataSchema";
import { backup } from "../services/backup";
import { addChild, getNewChild } from "../services/childCRUD";
import { validateParentsForm } from "../services/Utils";
import {
  Heading1Centerw,
  Heading3,
  ShiftFromTop20,
  Heading1,
  Heading4Regular,
  ShiftFromTopBottom5,
  Heading3w,
  ShiftFromTop50,
  Heading3BoldCenterrw,
  ShiftFromTop25,
  Heading4Centerrw,
} from "@styles/typography";
import AlertModal from "@components/AlertModal";
import { BannerContainer } from "@components/shared/Container";
import {
  SettingHeading,
  SettingShareData,
  SettingOptions,
} from "@components/shared/SettingsStyle";
import VectorImage from "react-native-vector-image";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import TextInputML from "@components/shared/TextInputML";
import { bgcolorWhite2, secondaryBtnColor } from "@styles/style";
import { selectChildAge, selectChildGenders, selectParentGender, selectRelationshipToParent } from "../services/selectors";

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChildSetupList"
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: bgcolorWhite2,
    flex: 1,
  },
  flex2Style: {
    alignItems: "center",
    marginVertical: 20,
  },
  flexRow1: {
    marginTop: 10,
  },
  scrollViewStyle: {
    padding: 0,
    paddingTop: 0,
  },
  textInputStyle: {
    width: "100%",
  },
  textParentInfoStyle: {
    textAlign: "center",
  },
  importTextStyle: {
    fontWeight: "700",
  },
  uploadTextStyle: {
    color: secondaryBtnColor,
  },
  orDividerStyle: {
    width: 172,
    alignSelf: "center",
  },
  dividerStyle: {
    marginEnd: 20,
  },
});
const ChildSetup = ({ navigation }: Props): any => {
  const { t } = useTranslation();
  const [relationship, setRelationship] = useState("");
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState("");
  const [relationshipUniqueName, setRelationshipUniqueName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isImportRunning, setIsImportRunning] = useState(false);
  const [isPremature, setIsPremature] = useState<string>("false");
  const [isExpected, setIsExpected] = useState<string>("false");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [isImportAlertVisible, setImportAlertVisible] = useState(false);
  const actionSheetRefImport = useRef<AppActionSheetRef>(null);
  const netInfo = useNetInfoHook();
  let relationshipData =
    useAppSelector(selectParentGender) || [];

  let relationshipToParent = useAppSelector(selectRelationshipToParent);
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const relationShipMotherId = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds.relationShipMotherId
  );
  const relationShipFatherId = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds.relationShipFatherId
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const childAge = useAppSelector(selectChildAge);
  const actionSheetRef = useRef<AppActionSheetRef>(null);
  const [gender, setGender] = React.useState(0);
  const dispatch = useAppDispatch();
  const sendData = (data: any): any => {
    // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    const myString = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  let genders = useAppSelector(selectChildGenders);

  genders = genders
    ?.map((v: any) => ({ ...v, title: v.name }))
    .filter(function (e: any) {
      return e.unique_name != taxonomyIds?.bothChildGender;
    });
  relationshipData = relationshipData
    ?.map((v: any) => ({ ...v, title: v.name }))
    .filter(function (e: any) {
      return e.unique_name != taxonomyIds?.bothParentGender;
    });
  const onImportCancel = (): any => {
    setImportAlertVisible(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log("relationshipToParent is", relationshipToParent);
      setTimeout(() => {
        navigation.dispatch((state) => {
          // Remove the home route from the stack
          const routes = state.routes.filter((r) => r.name !== "LoadingScreen");

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 500);
    }, [])
  );
  const getCheckedItem = (checkedItem: (typeof genders)[0]): any => {
    setGender(checkedItem.id);
  };
  const getCheckedParentItem = (checkedItem: any): any => {
    if (
      typeof checkedItem.unique_name === "string" ||
      checkedItem.unique_name instanceof String
    ) {
      setRelationship(checkedItem.unique_name);
    } else {
      setRelationship(String(checkedItem.unique_name));
    }
  };
  const importRunning = useRef(false);
  const runImport = async (read: () => Promise<any>): Promise<void> => {
    if (importRunning.current) return;
    importRunning.current = true;
    setImportAlertVisible(false);
    setLoading(true);
    setIsImportRunning(true);
    try {
      const data = await read();
      if (data instanceof Error) throw data;
      if (data === null) return;
      navigation.navigate("ChildImportSetup", {
        importResponse: JSON.stringify(data),
        parentName: name,
        relationData: relationship,
        relationshipNameData: relationshipname,
        userRelationToParentData: userRelationToParent,
      });
    } catch (error) {
      if (!(error instanceof Error && error.message === "loginCanceled")) {
        console.error("Backup import failed", error);
        Alert.alert("", t("generalError"));
      }
    } finally {
      importRunning.current = false;
      setLoading(false);
      setIsImportRunning(false);
    }
  };
  const importFromFile = (): Promise<void> => runImport(() => backup.readLocalBackup());
  const importAllData = (): Promise<void> => runImport(() =>
    backup.import1(navigation, languageCode, dispatch, childAge, genders)
  );
  const AddChild = async (isDefaultChild: boolean): Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let defaultName;
    if (isDefaultChild) {
      defaultName = t("childInfoBabyText");
    } else {
      defaultName = name;
    }
    const insertData: any = await getNewChild(
      "",
      "true",
      isExpected,
      plannedTermDate,
      isPremature,
      birthDate,
      defaultName,
      "",
      gender,
      null
    );
    const childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(
      languageCode,
      false,
      0,
      childSet,
      dispatch,
      navigation,
      childAge,
      relationship,
      userRelationToParent,
      netInfo,
      isDefaultChild,
      false,
      name
    );
  };

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  return (
    <>
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <OnboardingContainer>
            <OverlayLoadingComponent loading={loading} />
            <OrHeadingView>
              <ParentSetUpDivider
                style={styles.dividerStyle}
              ></ParentSetUpDivider>
              <ChildSetupDivider></ChildSetupDivider>
            </OrHeadingView>
            <OnboardingHeading>
              <ChildCenterView>
                <Heading1Centerw>{t("childSetupheader")}</Heading1Centerw>
              </ChildCenterView>
            </OnboardingHeading>

            <FlexCol>
              <Heading3w style={styles.textParentInfoStyle}>
                {t("addBasicParentsInfo")}
              </Heading3w>
              {/* <ChildDate sendData={sendData} dobMax={dobMax} prevScreen="Onboarding" /> */}
              <ShiftFromTop50>
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
                          value.replace(appConfig.regexpEmojiPresentation, "")
                        );
                      }
                    }}
                    value={name}
                    //placeholder={t('parentNamePlaceTxt')}
                    //placeholderTextColor={"#77777779"}
                    allowFontScaling={false}
                  />
                </FormInputBox>
              </ShiftFromTop50>

              {/* {
              birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ?
                <FormContainer1>
                  <LabelText>{t('genderLabel')}</LabelText>
                  <ToggleRadios
                    options={genders}
                    tickbgColor={headerColor}
                    tickColor={'#FFF'}
                    getCheckedItem={getCheckedItem}
                  />
                </FormContainer1>
                : null
            } */}

              <ShiftFromTop20>
                <FormInputGroup
                  onPress={(): any => {
                    console.log(
                      "actionsheet visiblity",
                      actionSheetRef.current
                    );
                    actionSheetRef.current?.show();
                  }}
                >
                  <LabelText>{t("childSetuprelationSelectTitle")}</LabelText>
                  <FormInputBox>
                    <FormDateText>
                      {/*  <Text>{relationshipname ? relationshipname : t('childSetuprelationSelectText')}</Text> */}
                      <Text>{relationshipname ? relationshipname : ""}</Text>
                    </FormDateText>
                    <FormDateAction>
                      <Icon name="ic_angle_down" size={10} color="#000" />
                    </FormDateAction>
                  </FormInputBox>
                </FormInputGroup>
              </ShiftFromTop20>

              <View>
                {userRelationToParent != null &&
                  userRelationToParent != undefined &&
                  userRelationToParent != relationShipMotherId &&
                  userRelationToParent != relationShipFatherId ? (
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
            </FlexCol>
            <ShiftFromTop25>
              <ButtonPrimary
                disabled={!validateParentsForm(0, relationship, name)}
                onPress={(e: any): any => {
                  e.stopPropagation();
                  setLoading(true);
                  let validated: any = false;
                  validated = validateParentsForm(0, relationship, name);

                  if (validated == true) {
                    setTimeout(() => {
                      setLoading(false);
                      if (relationshipname == relationshipToParent[3].name) {
                        AddChild(true);
                      } else {
                        navigation.navigate("AddChildSetup", {
                          birthDate: birthDate,
                          relationship: relationship,
                          relationshipname: relationshipname,
                          userRelationToParent: userRelationToParent,
                          parentName: name,
                        });
                      }
                    }, 0);
                  } else {
                    console.log("in else");
                  }
                }}
              >
                <ButtonUpperCaseText>
                  {t("childSetupcontinueBtnText")}
                </ButtonUpperCaseText>
              </ButtonPrimary>
            </ShiftFromTop25>

            <FlexCol>
              {/* <FlexRow>
              <Flex1>
                <OrView>
                  <OrDivider><Text></Text></OrDivider>
                  <OrHeadingView>
                    <Heading3Centerw>{t('ORkeyText')}</Heading3Centerw>
                  </OrHeadingView>

                </OrView>
              </Flex1>
            </FlexRow> */}
              <FlexRow>
                <Flex2 style={styles.flex2Style}>
                  <Heading4Centerrw style={styles.importTextStyle}>
                    {t("importOnboardingText")}
                  </Heading4Centerrw>
                  <Heading4Centerrw>
                    {t("importOnboardingText1")}
                  </Heading4Centerrw>
                </Flex2>
              </FlexRow>
              <FlexCol>
                <ShiftFromTop20>
                  <ParentSetUpDivider
                    style={styles.orDividerStyle}
                  ></ParentSetUpDivider>
                  <Heading3BoldCenterrw style={styles.flex2Style}>
                    {t("ORkeyText")}
                  </Heading3BoldCenterrw>
                </ShiftFromTop20>
              </FlexCol>
              <Pressable
                onPress={(e: any): any => {
                  e.stopPropagation();
                  actionSheetRefImport.current?.show();
                }}
              >
                <Heading3BoldCenterrw style={styles.uploadTextStyle}>
                  {t("OnboardingImportButton")}
                </Heading3BoldCenterrw>
              </Pressable>
              <Flex2 style={styles.flex2Style}>
                <Heading4Centerrw>
                  {t("importOnboardingText2")}
                </Heading4Centerrw>
              </Flex2>
            </FlexCol>
          </OnboardingContainer>
        </ScrollView>
        <ActionSheet ref={actionSheetRef}>
          <View style={{ marginBottom: 20 }}>
            {relationshipToParent?.map((item: any, index: any) => {
              return (
                <ChildRelationList key={index}>
                  <Pressable
                    onPress={(): any => {
                      setUserRelationToParent(item.unique_name);
                      if (
                        item.unique_name == taxonomyIds?.relationShipMotherId
                      ) {
                        if (
                          typeof taxonomyIds?.femaleData?.unique_name ===
                          "string" ||
                          taxonomyIds?.femaleData?.unique_name instanceof String
                        ) {
                          setRelationship(taxonomyIds?.femaleData.unique_name);
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
                      setRelationshipUniqueName(item.unique_name);
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
        <ActionSheet ref={actionSheetRefImport}>
          <BannerContainer>
            <SettingHeading>
              <Heading1>{t("settingScreenimportOptionHeader")}</Heading1>
            </SettingHeading>
            <SettingShareData>
              <FDirRow>
                <SettingOptions>
                  <Pressable
                    onPress={async (): Promise<void> => {
                      if (!(await actionSheetRefImport.current?.hideAndWait())) return;
                      await importFromFile();
                    }}
                  >
                    <VectorImage source={require("@images/ic_file.svg")} />
                    <ShiftFromTopBottom5>
                      <Heading4Regular>{t("importBtntxt")}</Heading4Regular>
                    </ShiftFromTopBottom5>
                  </Pressable>
                </SettingOptions>
                <SettingOptions>
                  <Pressable
                    onPress={async (): Promise<void> => {
                      if (!(await actionSheetRefImport.current?.hideAndWait())) return;
                      if (netInfo && netInfo.isConnected === true) {
                        setImportAlertVisible(true);
                      } else {
                        Alert.alert("", t("noInternet"));
                      }
                    }}
                  >
                    <VectorImage source={require("@images/ic_gdrive.svg")} />
                    <ShiftFromTopBottom5>
                      <Heading4Regular>
                        {t("settingScreengdriveBtntxt")}
                      </Heading4Regular>
                    </ShiftFromTopBottom5>
                  </Pressable>
                </SettingOptions>
              </FDirRow>
            </SettingShareData>
          </BannerContainer>
        </ActionSheet>
        <AlertModal
          loading={isImportAlertVisible}
          disabled={isImportRunning}
          message={t("dataConsistency")}
          title={t("importText")}
          cancelText={t("retryCancelPopUpBtn")}
          onConfirm={importAllData}
          onCancel={onImportCancel}
        ></AlertModal>
      </View>
    </>
  );
};

export default ChildSetup;

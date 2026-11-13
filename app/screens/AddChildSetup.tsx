import { appConfig } from "../instances";
import ChildDate from "@components/ChildDate";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import {
  ButtonPrimary,
  ButtonRow,
  ButtonUpperCaseText,
} from "@components/shared/ButtonGlobal";
import {
  ChildCenterView,
  ChildSetupDivider,
  FormContainer1,
  FormInputBox,
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
import { dobMax } from "../types/types";
import React, { useRef, createRef, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Alert,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { ThemeContext } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../../App";
import { userRealmCommon } from "../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../database/schema/ChildDataSchema";
import { backup } from "../services/backup";
import {
  addChild,
  apiJsonDataGet,
  getAge,
  getNewChild,
  isFutureDate,
  setActiveChild,
} from "../services/childCRUD";
import { notiPermissionUtil, validateForm } from "../services/Utils";
import {
  Heading1Centerw,
  Heading3,
  Heading4Regularw,
  ShiftFromTop20,
  Heading3w,
  ShiftFromTop25,
  Heading2Centerw,
  Heading3BoldCenterrw,
  Heading4Centerrw,
  ShiftFromTopBottom20,
} from "@styles/typography";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import TextInputML from "@components/shared/TextInputML";
import { bgcolorWhite2, primaryColor, secondaryBtnColor } from "@styles/style";
import BackgroundColors from "@components/shared/BackgroundColors";
import { logEvent } from "../services/EventSyncService";
import {
  EXPECTED_CHILD_ENTERED,
  ONBOARDING_SKIPPED,
} from "@assets/data/firebaseEvents";
import { dataRealmCommon } from "../database/dbquery/dataRealmCommon";
import {
  ConfigSettingsEntity,
  ConfigSettingsSchema,
} from "../database/schema/ConfigSettingsSchema";
import { setAllLocalNotificationGenerateType } from "../redux/reducers/notificationSlice";
import { selectChildAge, selectChildGenders, selectParentGender, selectRelationshipToParent } from "../services/selectors";

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChildSetupList"
>;

type Props = {
  route: { params: { birthDate?: Date; relationship?: string; relationshipname?: string; userRelationToParent?: any; parentName?: string } };
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: bgcolorWhite2,
    flex: 1,
  },
  flex2Style: {
    alignItems: "flex-start",
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
  dividerStyle: {
    marginEnd: 20,
  },
  orDividerStyle: {
    width: 172,
    alignSelf: "center",
  },
  uploadTextStyle: {
    color: secondaryBtnColor,
  },
});
const AddChildSetup = ({ route, navigation }: Props): any => {
  const { t } = useTranslation();
  const [relationship, setRelationship] = useState("");
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipName, setRelationshipName] = useState("");
  const [parentName, setParentName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isImportRunning, setIsImportRunning] = useState(false);
  const [isPremature, setIsPremature] = useState<string>("false");
  const [isExpected, setIsExpected] = useState<string>("false");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [isImportAlertVisible, setImportAlertVisible] = useState(false);
  const actionSheetRefImport = createRef<any>();
  const netInfo = useNetInfoHook();
  let relationshipData = useAppSelector(selectParentGender);
  const taxonomyIds = useAppSelector(
    (state: any) => state.utilsData.taxonomyIds
  );
  const relationshipToParent = useAppSelector(selectRelationshipToParent);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const childAge = useAppSelector(selectChildAge);
  const actionSheetRef = createRef<any>();
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
    .map((v: any) => ({ ...v, title: v.name }))
    .filter(function (e: any) {
      return e.unique_name != taxonomyIds?.bothChildGender;
    });
  relationshipData = relationshipData
    .map((v: any) => ({ ...v, title: v.name }))
    .filter(function (e: any) {
      return e.unique_name != taxonomyIds?.bothParentGender;
    });
  const onImportCancel = (): any => {
    setImportAlertVisible(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log("taxonomyData is", relationshipToParent);
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
  useEffect(() => {
    setRelationship(route?.params.relationship ?? "");
    setRelationshipName(route?.params.relationshipname ?? "");
    console.log("Setuser relationship to parent", route?.params.parentName);
    setUserRelationToParent(route?.params.userRelationToParent);
    setParentName(route?.params.parentName ?? "");
  }, [route?.params]);
  const getCheckedItem = (checkedItem: (typeof genders)[0]): any => {
    setGender(checkedItem.id);
  };
  const getCheckedParentItem = (checkedItem: any): any => {
    if (
      typeof checkedItem.id === "string" ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
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
        parentName,
        relationData: relationship,
        relationshipNameData: relationshipName,
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
  const AddChild = async (
    isDefaultChild: boolean,
    isDefaultName: boolean
  ): Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let defaultName;
    if (isDefaultName) {
      defaultName = t("childInfoBabyText");
    } else {
      defaultName = name;
    }
    let insertData: any = null;
    const isDefault = isDefaultChild ? "true" : "false";
    insertData = await getNewChild(
      "",
      isDefault,
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
    if (isDefaultChild) {
      if (childSet[0].isExpected == true || childSet[0].isExpected == "true") {
        const eventData = { name: EXPECTED_CHILD_ENTERED };
        logEvent(eventData, netInfo.isConnected);
      }
      const eventData = { name: ONBOARDING_SKIPPED };
      logEvent(eventData, netInfo.isConnected);
      await userRealmCommon.create<ChildEntity>(ChildEntitySchema, childSet);

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
        "currentActiveChildId",
        childSet[0].uuid
      );
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
        ConfigSettingsSchema,
        "userEnteredChildData",
        "true"
      );
      await dataRealmCommon.updateSettings<ConfigSettingsEntity>(
        ConfigSettingsSchema,
        "userName",
        parentName
      );
      await setActiveChild(
        languageCode,
        childSet[0].uuid,
        dispatch,
        childAge,
        false,
        taxonomyIds?.boyChildGender
      );
      const localnotiFlagObj = {
        generateFlag: true,
        generateType: "add",
        childuuid: "all",
      };
      await dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
      notiPermissionUtil();
      console.log("childAge is", childAge, childSet);
      let apiJsonData;
      apiJsonData = apiJsonDataGet("all", "all");
      console.log("child API json data is ", apiJsonData);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "LoadingScreen",
            params: { apiJsonData: apiJsonData, prevPage: "ChildSetup" },
          },
        ],
      });
    } else {
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
        parentName
      );
    }
  };

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  return (
    <>
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OverlayLoadingComponent loading={loading} />
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <OnboardingContainer>
            <FlexRow>
              <ShiftFromTop25>
                <Pressable
                  onPress={(e: any): any => {
                    navigation.navigate("ChildSetup");
                  }}
                >
                  <Icon name={"ic_back"} size={12} color="#2D2926" />
                </Pressable>
              </ShiftFromTop25>
              <OrHeadingView>
                <ChildSetupDivider
                  style={styles.dividerStyle}
                ></ChildSetupDivider>
                <ParentSetUpDivider></ParentSetUpDivider>
              </OrHeadingView>
            </FlexRow>

            <OnboardingHeading>
              <ChildCenterView>
                <Heading1Centerw>{t("childSetupheader")}</Heading1Centerw>
              </ChildCenterView>
            </OnboardingHeading>

            <FlexCol>
              <Heading3w style={styles.textParentInfoStyle}>
                {t("addBasicChildInfo")}
              </Heading3w>
              <ChildDate
                sendData={sendData}
                dobMax={dobMax}
                prevScreen="Onboarding"
              />
              <ShiftFromTop20>
                <LabelText>{t("childNameTxt")}</LabelText>
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
                    //placeholder={t('childNamePlaceTxt')}
                    // placeholderTextColor={"#77777779"}
                    allowFontScaling={false}
                  />
                </FormInputBox>
              </ShiftFromTop20>
              <View>
                {birthDate != null &&
                  birthDate != undefined &&
                  !isFutureDate(birthDate) ? (
                  <FormContainer1>
                    <LabelText>{t("genderLabel")}</LabelText>
                    <ToggleRadios
                      options={genders}
                      tickbgColor={headerColor}
                      tickColor={"#FFF"}
                      getCheckedItem={getCheckedItem}
                    />
                  </FormContainer1>
                ) : null}
              </View>

              <ButtonRow>
                <ButtonPrimary
                  disabled={
                    birthDate != null &&
                      birthDate != undefined &&
                      !isFutureDate(birthDate)
                      ? !validateForm(
                        0,
                        birthDate,
                        isPremature,
                        relationship,
                        plannedTermDate,
                        name,
                        gender
                      )
                      : !validateForm(
                        3,
                        birthDate,
                        isPremature,
                        relationship,
                        plannedTermDate,
                        name,
                        gender
                      )
                  }
                  onPress={(e: any): any => {
                    e.stopPropagation();
                    setLoading(true);
                    let validated: any = false;
                    if (
                      birthDate != null &&
                      birthDate != undefined &&
                      !isFutureDate(birthDate)
                    ) {
                      validated = validateForm(
                        0,
                        birthDate,
                        isPremature,
                        relationship,
                        plannedTermDate,
                        name,
                        gender
                      );
                    } else if (
                      birthDate != null &&
                      birthDate != undefined &&
                      isFutureDate(birthDate)
                    ) {
                      validated = validateForm(
                        3,
                        birthDate,
                        isPremature,
                        relationship,
                        plannedTermDate,
                        name,
                        gender
                      );
                    }
                    if (validated == true) {
                      setTimeout(() => {
                        setLoading(false);
                        AddChild(false, false);
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
              </ButtonRow>

              <FlexCol>
                <ParentSetUpDivider
                  style={styles.orDividerStyle}
                ></ParentSetUpDivider>

                <ShiftFromTop20>
                  <Heading2Centerw>{t("ORkeyText")}</Heading2Centerw>
                </ShiftFromTop20>

                <ShiftFromTop20>
                  <Pressable
                    onPress={(e: any): any => {
                      e.stopPropagation();
                      setTimeout(() => {
                        console.log(
                          "Relationship name",
                          relationshipName,
                          relationship
                        );
                        if (relationshipName == "service provider") {
                          AddChild(false, true);
                        } else {
                          console.log("Child is created here");
                          // const currentDate = new Date();
                          // setBirthDate(currentDate)
                          AddChild(true, true);
                        }
                        //setLoading(true);
                        // AddChild();
                      }, 0);
                    }}
                  >
                    <Heading3BoldCenterrw style={styles.uploadTextStyle}>
                      {t("walkthroughButtonSkip")}
                    </Heading3BoldCenterrw>
                  </Pressable>
                </ShiftFromTop20>

                <ShiftFromTopBottom20>
                  <Flex2>
                    <Heading4Centerrw>
                      {t("childProfileSkipText")}
                    </Heading4Centerrw>
                  </Flex2>
                </ShiftFromTopBottom20>
              </FlexCol>
            </FlexCol>
          </OnboardingContainer>
        </ScrollView>
      </View>
    </>
  );
};

export default AddChildSetup;

import { GROWTH_MEASUREMENT_ADDED } from "@assets/data/firebaseEvents";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonPrimary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
} from "@components/shared/ButtonGlobal";
import {
  FormContainer,
  FormDateAction,
  FormDateText,
  FormInputBoxWithoutLine,
  FormInputGroup,
  FormInputText,
  TextAreaBox,
} from "@components/shared/ChildSetupStyle";
import { MainContainer } from "@components/shared/Container";
import {
  FDirRow,
  FlexCol,
  FlexFDirRowSpace,
} from "@components/shared/FlexBoxStyle";
import {
  HeaderActionView,
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
import {
  RadioBoxContainer,
  RadioInnerBox,
  RadioOuter,
} from "@components/shared/radio";
import ToggleRadiosBgColor from "@components/ToggleRadiosBgColor";
import { RootStackParamList } from "@navigation/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading2,
  Heading3,
  Heading3Center,
  Heading4Regular,
  ShiftFromTopBottom10,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemeContext } from "styled-components/native";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../App";
// import {
//   maxCharForRemarks,
//   measurementPlaces
// } from '../../assets/translations/appOfflineData/apiConstants';
import { appConfig } from "../../instances";
import { userRealmCommon } from "../../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../../database/schema/ChildDataSchema";
import { setActiveChildData } from "../../redux/reducers/childSlice";
import {
  setInitialHeightValues,
  setInitialWeightValues,
} from "../../services/growthService";
import {
  getMeasuresForDate,
  isAnyMeasureExistForDate,
  isGrowthMeasureExistForDate,
  isVaccineMeasureExistForDate,
} from "../../services/measureUtils";
import {
  convertDigits,
  formatStringDate,
  getLanguageCode,
} from "../../services/Utils";
import TextInputML from "@components/shared/TextInputML";
import { setAllLocalNotificationGenerateType } from "../../redux/reducers/notificationSlice";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { logEvent } from "../../services/EventSyncService";
import useDigitConverter from "../../customHooks/useDigitConvert";
import { selectActiveChild } from "../../services/selectors";

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  maxHeight: { maxHeight: 50 },
  padding0: { padding: 0 },
  pressableView: { paddingLeft: 10, paddingRight: 10 },
  textInputMl: { flex: 1, padding: 10, textAlignVertical: "top" },
});
const AddNewChildgrowth = ({ route, navigation }: any): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const { convertDigits } = useDigitConverter();
  const { editMeasurementDate } = route.params;
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] =
    useState(false);
  const [showmeasureDate, setmeasureDateShow] = useState<boolean>(false);
  const [dateTouched, setDateTouched] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext?.colors.CHILDGROWTH_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editMeasurementDate ? editMeasurementDate : null
  );
  const [clicked, setClicked] = useState(false);
  const measurePlaces = appConfig.measurementPlaces([
    t("growthScreendoctorMeasurePlace"),
    t("growthScreenhomeMeasurePlace"),
  ]);
  const [weightValue, setWeightValue] = useState(0);
  const [heightValue, setHeightValue] = useState(0);
  const [remarkTxt, handleDoctorRemark] = useState<string>("");
  const [measurePlace, setMeasurePlace] = useState<number>();
  const [defaultMeasurePlace, setDefaultMeasurePlace] = useState<any>(null);

  const locale = useAppSelector((state: any) =>
    getLanguageCode(state.selectedCountry?.languageCode)
  );
  const getCheckedGrowthPlace = (checkedItem: any): any => {
    setMeasurePlace(checkedItem.id);
  };
  const activeChild = useAppSelector(selectActiveChild);
  const dispatch = useAppDispatch();

  const onmeasureDateChange = (event: any, selectedDate: any): any => {
    setmeasureDateShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(selectedDate));
      setDateTouched(true);
      if (editMeasurementDate) {
        setShowDelete(true);
        if (
          isGrowthMeasureExistForDate(
            DateTime.fromJSDate(selectedDate),
            activeChild
          )
        ) {
          //data already exist, reset measuredate it to edit measures’ date,
          //Dont allow to select date for which measures already exist
          Alert.alert(
            t("alertForModifyMeasures"),
            t("alertForExistingMeasuresTitle"),
            [
              {
                text: t("alertForModifyMeasuresOk"),
                onPress: (): any => {
                  setmeasureDate(editMeasurementDate);
                },
                style: "cancel",
              },
            ],
            {
              cancelable: false,
              // onDismiss: () =>
              //   Alert.alert(
              //     "This alert was dismissed by tapping outside of the alert dialog."
              //   ),
            }
          );
        } else {
          // allow date to modify for this measure
          if (
            isVaccineMeasureExistForDate(
              DateTime.fromJSDate(selectedDate),
              activeChild
            )
          ) {
            //  add measure where only vacccines were added.
            // allow adding growth values for that vaccine measure
          } else {
            // add new measure
          }
        }
      } else {
        if (
          isGrowthMeasureExistForDate(
            DateTime.fromJSDate(selectedDate),
            activeChild
          )
        ) {
          Alert.alert(
            t("alertForModifyMeasures"),
            t("alertForModifyMeasuresTitle"),
            [
              {
                text: t("alertForModifyMeasuresOk"),
                onPress: (): any => {
                  const existingMeasure = getMeasuresForDate(
                    DateTime.fromJSDate(selectedDate),
                    activeChild
                  );
                  setWeightValue(existingMeasure.weight);
                  setHeightValue(existingMeasure.height);
                  handleDoctorRemark(existingMeasure.doctorComment);
                  setMeasurePlace(existingMeasure.measurementPlace);
                  setDefaultMeasurePlace(
                    measurePlaces[existingMeasure.measurementPlace]
                  );
                  setShowDelete(true);
                },
                style: "cancel",
              },
            ],
            {
              cancelable: false,
            }
          );
        } else {
          // measure do not exist for a date
          // allow changing date for already measured measure
        }
      }
    }
  };
  const handleMeasureConfirm = (event: any): any => {
    const date = event;
    onmeasureDateChange(event, date);
    setMeasureDatePickerVisibility(false);
  };

  useEffect(() => {
    // find growthmeasures for date, if exist show growthmeasures with delete enabled.
    if (editMeasurementDate) {
      setShowDelete(true);
      const existingMeasure = getMeasuresForDate(
        DateTime.fromJSDate(new Date(editMeasurementDate)),
        activeChild
      );
      setmeasureDate(DateTime.fromJSDate(new Date(editMeasurementDate)));
      setWeightValue(existingMeasure?.weight);
      setHeightValue(existingMeasure?.height);
      handleDoctorRemark(existingMeasure?.doctorComment);
      setDefaultMeasurePlace(measurePlaces[existingMeasure.measurementPlace]);
      setMeasurePlace(existingMeasure.measurementPlace);
    }
  }, [editMeasurementDate]);

  //set initvalue here for edit
  const isFormFilled = (): any => {
    if (measureDate) {
      if (measurePlace != null) {
        if (measurePlace == 0) {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
        } else {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
          // doctor remark not required for measurement at home
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const minChildGrwothDate =
    activeChild.birthDate != "" &&
    activeChild.birthDate != null &&
    activeChild.birthDate != undefined
      ? activeChild.birthDate
      : new Date();
  React.useEffect(() => {
    if (route.params?.weight) {
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      setHeightValue(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
  const deleteGrowth = async (): Promise<any> => {
    // delete measure at measurementdate got from param
    const measurementDateParam = editMeasurementDate
      ? dateTouched
        ? measureDate?.toMillis()
        : editMeasurementDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editMeasurementDate
      ? dateTouched
        ? measureDate.toFormat("MM")
        : measureDate.toFormat("MM")
      : measureDate.toFormat("MM");
    if (editMeasurementDate) {
      //
      // console.log("in delete main if");
      const existingMeasure = getMeasuresForDate(
        DateTime.fromJSDate(new Date(editMeasurementDate)),
        activeChild
      );

      if (
        isVaccineMeasureExistForDate(
          DateTime.fromJSDate(new Date(editMeasurementDate)),
          activeChild
        )
      ) {
        //  update measure where only vacccines were added.
        // allow adding growth values for that vaccine measure
        // console.log("in delete if if");
        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: false,
          weight: "",
          height: "",
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: "",
          measurementPlace: existingMeasure.measurementPlace,
        };
        const updateresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          const localnotiFlagObj = {
            generateFlag: true,
            generateType: "add",
            childuuid: activeChild.uuid,
          };
          dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
          setModalVisible(false);
        }
        navigation.goBack();
      } else {
        // delete measure
        //delete measure obj
        // console.log("in delete if else");
        const deleteresult =
          await userRealmCommon.deleteChildMeasures<ChildEntity>(
            ChildEntitySchema,
            existingMeasure,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (deleteresult) {
          activeChild.measures = deleteresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();
      }
    } else {
      // console.log("in delete main else");
      const existingMeasure = getMeasuresForDate(
        DateTime.fromJSDate(new Date(measureDate?.toMillis())),
        activeChild
      );

      if (
        isVaccineMeasureExistForDate(
          DateTime.fromJSDate(new Date(measureDate?.toMillis())),
          activeChild
        )
      ) {
        //  update measure where only vacccines were added.
        // allow adding growth values for that vaccine measure
        // console.log("in delete else if");
        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: false,
          weight: "",
          height: "",
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: "",
          measurementPlace: existingMeasure.measurementPlace,
        };
        const updateresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          const localnotiFlagObj = {
            generateFlag: true,
            generateType: "add",
            childuuid: activeChild.uuid,
          };
          dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
          setModalVisible(false);
        }
        navigation.goBack();
      } else {
        // delete measure
        //delete measure obj
        // console.log("in delete else else");
        const deleteresult =
          await userRealmCommon.deleteChildMeasures<ChildEntity>(
            ChildEntitySchema,
            existingMeasure,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (deleteresult) {
          activeChild.measures = deleteresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();
      }
    }
  };
  const disableSave = (): any => {
    if (clicked == true && isFormFilled() == true) {
      return true;
    } else if (isFormFilled() == true && clicked == false) {
      return true;
    } else if (isFormFilled() == false && clicked == true) {
      return true;
    } else if (isFormFilled() == false && clicked == false) {
      return false;
    } else {
      return false;
    }
  };
  const saveChildMeasures = async (): Promise<any> => {
    console.log(measureDate);
    const measurementDateParam = editMeasurementDate
      ? dateTouched
        ? measureDate?.toMillis()
        : editMeasurementDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editMeasurementDate
      ? dateTouched
        ? measureDate.toFormat("MM")
        : editMeasurementDate
      : measureDate.toFormat("MM");
    if (editMeasurementDate) {
      const existingMeasure = getMeasuresForDate(
        DateTime.fromJSDate(new Date(editMeasurementDate)),
        activeChild
      );
      // if editMeasurementDate is not existingMeasure.mesurementDate , then remove growth from existingMeasure and add it to newMeasure
      if (
        editMeasurementDate != measureDate.toMillis() &&
        existingMeasure.didChildGetVaccines == true
      ) {
        const growthValues = {
          uuid: uuidv4(),
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: false,
          vaccineIds: "",
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        const updateresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        const growthValuesForVaccineMeasured = {
          uuid: existingMeasure.uuid,
          isChildMeasured: false,
          weight: "",
          height: "",
          measurementDate: existingMeasure.measurementDate,
          titleDateInMonth: existingMeasure.titleDateInMonth,
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: existingMeasure.doctorComment,
          measurementPlace: existingMeasure.measurementPlace,
        };
        const createresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValuesForVaccineMeasured,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
        }
        const localnotiFlagObj = {
          generateFlag: true,
          generateType: "add",
          childuuid: activeChild.uuid,
        };
        dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
        setClicked(false);
        navigation.goBack();
      } else {
        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        const createresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
          const localnotiFlagObj = {
            generateFlag: true,
            generateType: "add",
            childuuid: activeChild.uuid,
          };
          dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
        }
        setClicked(false);
        navigation.goBack();
      }
    } else {
      if (
        isAnyMeasureExistForDate(
          DateTime.fromJSDate(new Date(measureDate?.toMillis())),
          activeChild
        )
      ) {
        const existingMeasure = getMeasuresForDate(
          DateTime.fromJSDate(new Date(measureDate?.toMillis())),
          activeChild
        );

        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        const createresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
          const localnotiFlagObj = {
            generateFlag: true,
            generateType: "add",
            childuuid: activeChild.uuid,
          };
          dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
        }
        setClicked(false);
        navigation.goBack();
      } else {
        // check if blank healthcheckup is done or not?// is there entry exists for that date update or else add?
        const growthValues = {
          uuid: uuidv4(),
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: false,
          vaccineIds: "",
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        const createresult =
          await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
          const localnotiFlagObj = {
            generateFlag: true,
            generateType: "add",
            childuuid: activeChild.uuid,
          };
          dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
          const eventData = {
            name: GROWTH_MEASUREMENT_ADDED,
            params: {
              age_id: activeChild?.taxonomyData?.id,
              measured_at: measurePlace == 0 ? "doctor" : "home",
            },
          };
          logEvent(eventData, netInfo.isConnected);
        }
        setClicked(false);
        navigation.goBack();
      }
    }
  };
  const onBackPress = (): any => {
    navigation.goBack();
    return true;
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
  return (
    <>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps={"always"}
        >
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
              <Heading2 numberOfLines={1}>
                {showDelete
                  ? t("growthScreeneditNewBtntxt")
                  : t("growthScreenaddNewBtntxt")}
              </Heading2>
            </HeaderTitleView>
            {showDelete ? (
              <HeaderActionView style={styles.padding0}>
                <Pressable
                  style={styles.pressableView}
                  onPress={(): any => setModalVisible(true)}
                >
                  <Icon name={"ic_trash"} size={20} color="#000" />
                </Pressable>
              </HeaderActionView>
            ) : null}
          </HeaderRowView>
          <FlexCol>
            <KeyboardAwareScrollView
              bounces={false}
              keyboardShouldPersistTaps={"always"}
            >
              <MainContainer>
                <FormInputGroup
                  onPress={(): any => {
                    setmeasureDateShow(true);
                    if (Platform.OS == "ios") {
                      setMeasureDatePickerVisibility(true);
                    }
                  }}
                >
                  <FormInputText>
                    {t("growthScreendateMeasurementText")}
                  </FormInputText>
                  {Platform.OS != "ios" ? (
                    <FormInputBoxWithoutLine>
                      <FormDateText>
                        <Text>
                          {" "}
                          {measureDate
                            ? formatStringDate(measureDate)
                            : t("growthScreenenterDateMeasurementText")}
                        </Text>
                        {showmeasureDate && (
                          <DateTimePicker
                            testID="measureDatePicker"
                            value={
                              editMeasurementDate
                                ? new Date(editMeasurementDate)
                                : new Date()
                            }
                            mode={"date"}
                            locale={locale}
                            display="spinner"
                            maximumDate={new Date()}
                            minimumDate={new Date(minChildGrwothDate)}
                            onChange={onmeasureDateChange}
                          />
                        )}
                      </FormDateText>
                      <FormDateAction>
                        <Icon name="ic_calendar" size={20} color="#000" />
                      </FormDateAction>
                    </FormInputBoxWithoutLine>
                  ) : (
                    <FormInputBoxWithoutLine>
                      <FormDateText>
                        <Text>
                          {" "}
                          {measureDate
                            ? formatStringDate(measureDate)
                            : t("growthScreenenterDateMeasurementText")}
                        </Text>

                        <DateTimePickerModal
                          isVisible={isMeasureDatePickerVisible}
                          mode="date"
                          locale={locale}
                          onConfirm={handleMeasureConfirm}
                          date={
                            editMeasurementDate
                              ? new Date(editMeasurementDate)
                              : new Date()
                          }
                          onCancel={(): any => {
                            setMeasureDatePickerVisibility(false);
                          }}
                          maximumDate={new Date()}
                          minimumDate={new Date(minChildGrwothDate)}
                        />
                      </FormDateText>

                      <FormDateAction>
                        <Icon name="ic_calendar" size={20} color="#000" />
                      </FormDateAction>
                    </FormInputBoxWithoutLine>
                  )}
                </FormInputGroup>
                <View></View>
                <FormContainer>
                  <FormInputText>
                    <Heading3>{t("growthScreenwhereMeasured")}</Heading3>
                  </FormInputText>

                  <ToggleRadiosBgColor
                    options={measurePlaces}
                    defaultValue={defaultMeasurePlace}
                    tickbgColor={headerColor}
                    tickColor={"#000"}
                    getCheckedItem={getCheckedGrowthPlace}
                  />
                </FormContainer>

                <FormContainer>
                  <FormInputText>
                    {t("growthScreenenterMeasuresText")}
                  </FormInputText>
                  <RadioBoxContainer>
                    <FDirRow>
                      <RadioOuter>
                        <RadioInnerBox
                          onPress={(): any => {
                            navigation.navigate("AddNewChildWeight", {
                              prevRoute: "AddNewChildgrowth",
                              headerColor,
                              backgroundColor,
                              weightValue: setInitialWeightValues(weightValue),
                            });
                          }}
                        >
                          <FlexFDirRowSpace>
                            <Heading3>
                              {weightValue
                                ? convertDigits(weightValue)
                                : t("growthScreenwText")}
                            </Heading3>
                            <Heading4Regular>
                              {t("growthScreenkgText")}
                            </Heading4Regular>
                          </FlexFDirRowSpace>
                        </RadioInnerBox>
                      </RadioOuter>
                      <RadioOuter>
                        <RadioInnerBox
                          onPress={(): any => {
                            navigation.navigate("AddNewChildHeight", {
                              prevRoute: "AddNewChildgrowth",
                              headerColor,
                              backgroundColor,
                              heightValue: setInitialHeightValues(heightValue),
                            });
                          }}
                        >
                          <FlexFDirRowSpace>
                            <Heading3>
                              {heightValue
                                ? convertDigits(heightValue)
                                : t("growthScreenhText")}
                            </Heading3>
                            <Heading4Regular>
                              {t("growthScreencmText")}
                            </Heading4Regular>
                          </FlexFDirRowSpace>
                        </RadioInnerBox>
                      </RadioOuter>
                    </FDirRow>
                  </RadioBoxContainer>
                </FormContainer>

                <FormContainer>
                  <FormInputText>
                    {t("growthScreenenterDoctorRemarkText")}
                  </FormInputText>

                  <TextAreaBox>
                    <TextInputML
                      style={styles.textInputMl}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={appConfig.maxCharForRemarks}
                      clearButtonMode="always"
                      defaultValue={remarkTxt}
                      multiline={true}
                      onChangeText={(text: any): any =>
                        handleDoctorRemark(text)
                      }
                      placeholder={t(
                        "growthScreenenterDoctorRemarkTextPlaceHolder"
                      )}
                      blurOnSubmit={true}
                      placeholderTextColor={"#77777779"}
                      allowFontScaling={false}
                    />
                  </TextAreaBox>
                </FormContainer>

                <ShiftFromTopBottom10>
                  <Text>{t("growthScreennewGrowthBottomText")}</Text>
                </ShiftFromTopBottom10>
              </MainContainer>
              <ButtonContainer>
                <ButtonTertiary
                  disabled={disableSave()}
                  onPress={(e: any): any => {
                    e.stopPropagation();
                    setClicked(true);
                    setTimeout(() => {
                      saveChildMeasures().then(() => {
                        console.log("saveChildMeasures");
                      });
                    }, 0);
                  }}
                >
                  <ButtonText numberOfLines={2}>
                    {t("growthScreensaveMeasures")}
                  </ButtonText>
                </ButtonTertiary>
              </ButtonContainer>
            </KeyboardAwareScrollView>
          </FlexCol>

          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
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
                <ShiftFromTopBottom10>
                  <ModalPopupContent>
                    <Heading3Center>{t("growthDeleteWarning")}</Heading3Center>
                  </ModalPopupContent>
                </ShiftFromTopBottom10>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint
                      onPress={(): any => {
                        setModalVisible(false);
                      }}
                    >
                      <ButtonText numberOfLines={2}>
                        {t("growthDeleteOption1")}
                      </ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonPrimary
                      onPress={(): any => {
                        deleteGrowth();
                      }}
                    >
                      <ButtonText>{t("growthDeleteOption2")}</ButtonText>
                    </ButtonPrimary>
                  </ButtonColTwo>
                </ButtonContainerTwo>
              </ModalPopupContainer>
            </PopupOverlay>
          </Modal>
        </ScrollView>
      </View>
    </>
  );
};

export default AddNewChildgrowth;

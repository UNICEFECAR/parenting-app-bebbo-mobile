import {
  HEALTH_CHECKUP_REMINDER_SET,
  VACCINE_REMINDER_SET,
} from "@assets/data/firebaseEvents";
// import { fiveYearFromNow } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from "../../instances";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import {
  ButtonColTwo,
  ButtonContainerTwo,
  ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
} from "@components/shared/ButtonGlobal";
import {
  FormDateAction,
  FormDateText,
  FormInputBoxWithoutLine,
  FormInputGroup,
} from "@components/shared/ChildSetupStyle";
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView,
} from "@components/shared/HeaderContainerStyle";
import Icon, { IconML, IconViewBorder } from "@components/shared/Icon";
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import { RootStackParamList } from "@navigation/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Heading2,
  Heading3Center,
  Heading4Regular,
  ShiftFromBottom10,
  ShiftFromBottom20,
  ShiftFromTop20,
  ShiftFromTop30,
  ShiftFromTopBottom10,
} from "../../instances/bebbo/styles/typography";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../App";
import { userRealmCommon } from "../../database/dbquery/userRealmCommon";
import {
  ChildEntity,
  ChildEntitySchema,
} from "../../database/schema/ChildDataSchema";
import { setActiveChildData } from "../../redux/reducers/childSlice";
import { setInfoModalOpened } from "../../redux/reducers/utilsSlice";
import LocalNotifications from "../../services/LocalNotifications";
import {
  formatStringDate,
  formatStringTime,
  getLanguageCode,
} from "../../services/Utils";
import * as RNLocalize from "react-native-localize";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { logEvent } from "../../services/EventSyncService";
import { selectActiveChild } from "../../services/selectors";
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  headerActionStyle: {
    padding: 0,
  },
  headerRowHeight: {
    maxHeight: 50,
  },
  pressableStyle: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  scrollViewStyle: {
    flex: 7,
    padding: 15,
  },
});
const AddReminder = ({ route, navigation }: Props): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const {
    headerTitle,
    buttonTitle,
    titleTxt,
    titleTxt2,
    warningTxt,
    headerColor,
    reminderType,
    editReminderItem,
  } = route.params;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editReminderItem ? editReminderItem.reminderDate : null
  );
  const [showmeasure, setmeasureShow] = useState<boolean>(false);
  const [clicked, setClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [measureTime, setmeasureTime] = useState<any>(
    editReminderItem ? editReminderItem.reminderTime : null
  );
  const [minmeasureTime, setminmeasureTime] = useState<any>(
    editReminderItem ? new Date(editReminderItem.reminderDate) : new Date()
  );
  const [minmeasureTimeDefined, setminmeasureTimeDefined] = useState<any>(
    editReminderItem
      ? new Date(editReminderItem.reminderDateDefined)
      : new Date()
  );
  const [showmeasureTime, setmeasureShowTime] = useState<boolean>(false);
  const [dateTouched, setDateTouched] = useState<boolean>(false);
  const [timeTouched, setTimeTouched] = useState<boolean>(false);
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] =
    useState(false);
  const [isMeasureTimePickerVisible, setMeasureTimePickerVisibility] =
    useState(false);

  const [measureDateDefined, setmeasureDateDefined] = useState<DateTime>(
    editReminderItem ? editReminderItem.reminderDateDefined : null
  );
  const [showmeasureDefined, setmeasureShowDefined] = useState<boolean>(false);
  const [measureTimeDefined, setmeasureTimeDefined] = useState<any>(
    editReminderItem ? editReminderItem.reminderTimeDefined : null
  );

  const [showmeasureTimeDefined, setmeasureShowTimeDefined] =
    useState<boolean>(false);
  const [dateTouchedDefined, setDateTouchedDefined] = useState<boolean>(false);
  const [timeTouchedDefined, setTimeTouchedDefined] = useState<boolean>(false);
  const [
    isMeasureDatePickerVisibleDefined,
    setMeasureDatePickerVisibilityDefined,
  ] = useState(false);
  const [
    isMeasureTimePickerVisibleDefined,
    setMeasureTimePickerVisibilityDefined,
  ] = useState(false);
  const dispatch = useAppDispatch();
  const activeChild = useAppSelector(selectActiveChild);
  const vchcEnabledFlag = useAppSelector(
    (state: any) => state.notificationData.vchcEnabled
  );
  const locale = useAppSelector((state: any) =>
    getLanguageCode(state.selectedCountry?.languageCode)
  );

  //if measureDate is luxon today, then set measureTime to hours,minutes,seconds

  const onmeasureChange = (event: any, selectedDate: any): any => {
    const currentDate = selectedDate || measureDate;
    const localCurrentDate = DateTime.fromJSDate(currentDate).setZone(
      RNLocalize.getTimeZone()
    );
    setmeasureShow(false);
    if (selectedDate) {
      setmeasureDate(localCurrentDate);
      setDateTouched(true);
      if (localCurrentDate.toISODate() == DateTime.local().toISODate()) {
        setminmeasureTime(new Date());
        setmeasureTime(
          localCurrentDate.set({
            minute:
              localCurrentDate.minute < 59 ? localCurrentDate.minute + 1 : 0,
          })
        );

        //new Date(currentDate).setMinutes(new Date().getMinutes() < 59 ? new Date().getMinutes() + 1 : 0)
      } else {
        // // const currentDatenew = new Date(new Date(currentDate).setHours(0, 0, 0, 0))
        // // setminmeasureTime(new Date(currentDatenew));
        //setminmeasureTime(new Date());
        setminmeasureTime(new Date(new Date(currentDate).setHours(0, 0, 0, 0)));
      }
    }
  };
  const onmeasureChangeDefined = (event: any, selectedDate: any): any => {
    const currentDate = selectedDate || measureDateDefined;
    const localCurrentDate = DateTime.fromJSDate(currentDate).setZone(
      RNLocalize.getTimeZone()
    );

    console.log("This is your date format", localCurrentDate);
    setmeasureShowDefined(false);
    if (selectedDate) {
      setmeasureDateDefined(localCurrentDate);
      setDateTouchedDefined(true);
      if (localCurrentDate.toISODate() == DateTime.local().toISODate()) {
        setmeasureTimeDefined(
          localCurrentDate.set({
            minute:
              localCurrentDate.minute < 59 ? localCurrentDate.minute + 1 : 0,
          })
        );
        setminmeasureTimeDefined(new Date());
        //new Date(currentDate).setMinutes(new Date().getMinutes() < 59 ? new Date().getMinutes() + 1 : 0)
      } else {
        setminmeasureTimeDefined(
          new Date(new Date(currentDate).setHours(0, 0, 0, 0))
        );
      }
    }
  };
  const showmeasureDatepicker = (): any => {
    setmeasureShow(true);
    if (Platform.OS == "ios") {
      setMeasureDatePickerVisibility(true);
    }
  };
  const showmeasureDatepickerDefined = (): any => {
    setmeasureShowDefined(true);
    if (Platform.OS == "ios") {
      setMeasureDatePickerVisibilityDefined(true);
    }
  };
  const handleMeasureDateConfirm = (event: any): any => {
    const date = event;
    onmeasureChange(event, date);
    setMeasureDatePickerVisibility(false);
  };
  const handleMeasureDateConfirmDefined = (event: any): any => {
    const date = event;
    onmeasureChangeDefined(event, date);
    setMeasureDatePickerVisibilityDefined(false);
  };
  const onmeasureTimeChange = (event: any, selectedTime: any): any => {
    const currentTime = selectedTime || measureTime;
    const localCurrentDate = DateTime.fromJSDate(currentTime).setZone(
      RNLocalize.getTimeZone()
    );

    console.log("This is your date format", localCurrentDate);
    setmeasureShowTime(false);
    if (selectedTime) {
      setmeasureTime(localCurrentDate);
      setTimeTouched(true);
    }
  };
  const onmeasureTimeChangeDefined = (event: any, selectedTime: any): any => {
    const currentTime = selectedTime || measureTimeDefined;
    const localCurrentDate = DateTime.fromJSDate(currentTime).setZone(
      RNLocalize.getTimeZone()
    );

    console.log("This is your date format", localCurrentDate);

    setmeasureShowTimeDefined(false);
    if (selectedTime) {
      setmeasureTimeDefined(localCurrentDate);
      setTimeTouchedDefined(true);
    }
  };
  const handleMeasureTimeConfirm = (event: any): any => {
    const time = event;
    onmeasureTimeChange(event, time);
    setMeasureTimePickerVisibility(false);
  };
  const handleMeasureTimeConfirmDefined = (event: any): any => {
    const time = event;
    onmeasureTimeChangeDefined(event, time);
    setMeasureTimePickerVisibilityDefined(false);
  };
  const showmeasureTimepicker = (): any => {
    setmeasureShowTime(true);
    if (Platform.OS == "ios") {
      setMeasureTimePickerVisibility(true);
    }
  };
  const showmeasureTimepickerDefined = (): any => {
    setmeasureShowTimeDefined(true);
    if (Platform.OS == "ios") {
      setMeasureTimePickerVisibilityDefined(true);
    }
  };
  const isFormDisabled = (): any => {
    if (
      measureDate &&
      measureTime &&
      measureDateDefined &&
      measureTimeDefined &&
      !clicked
    ) {
      return false;
    } else {
      return true;
    }
  };
  const deleteReminder = async (): Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    const createresult =
      await userRealmCommon.deleteChildReminders<ChildEntity>(
        ChildEntitySchema,
        editReminderItem,
        'uuid ="' + activeChild.uuid + '"'
      );
    if (createresult) {
      if (editReminderItem) {
        let previousDTDefined;
        const onlyDateDefined = new Date(editReminderItem.reminderDateDefined);
        previousDTDefined = onlyDateDefined.setHours(
          new Date(editReminderItem.reminderTimeDefined).getHours()
        );
        previousDTDefined = new Date(
          onlyDateDefined.setMinutes(
            new Date(editReminderItem.reminderTimeDefined).getMinutes()
          )
        );
        LocalNotifications.cancelReminderLocalNotification(
          DateTime.fromJSDate(new Date(previousDTDefined)).toMillis()
        );
      }
      activeChild.reminders = createresult;
      const notiFlagObj = { key: "generateNotifications", value: true };
      dispatch(setInfoModalOpened(notiFlagObj));
      dispatch(setActiveChildData(activeChild));
    }
  };
  const saveReminder = async (): Promise<any> => {
    // check if reminderdate and time are less than current time show error alert
    // else allow saving

    let measureTimeNew, measureTimeNewDefined;
    if (typeof measureTime === "number" || measureTime instanceof Number) {
      measureTimeNew = measureTime;
    } else {
      measureTimeNew = measureTime.toMillis();
    }

    if (
      typeof measureTimeDefined === "number" ||
      measureTimeDefined instanceof Number
    ) {
      measureTimeNewDefined = measureTimeDefined;
    } else {
      measureTimeNewDefined = measureTimeDefined.toMillis();
    }
    const hours = new Date(
      editReminderItem
        ? timeTouched
          ? measureTimeNew
          : measureTimeNew
        : measureTimeNew
    ).getHours();
    const mins = new Date(
      editReminderItem
        ? timeTouched
          ? measureTimeNew
          : measureTimeNew
        : measureTimeNew
    ).getMinutes();
    const finalReminderDate = new Date(
      editReminderItem
        ? dateTouched
          ? measureDate?.toMillis()
          : measureDate
        : measureDate?.toMillis()
    );
    finalReminderDate.setHours(hours);
    finalReminderDate.setMinutes(mins);

    const hoursDefined = new Date(
      editReminderItem
        ? timeTouchedDefined
          ? measureTimeNewDefined
          : measureTimeNewDefined
        : measureTimeNewDefined
    ).getHours();
    const minsDefined = new Date(
      editReminderItem
        ? timeTouchedDefined
          ? measureTimeNewDefined
          : measureTimeNewDefined
        : measureTimeNewDefined
    ).getMinutes();
    const finalReminderDateDefined = new Date(
      editReminderItem
        ? dateTouchedDefined
          ? measureDateDefined?.toMillis()
          : measureDateDefined
        : measureDateDefined?.toMillis()
    );
    finalReminderDateDefined.setHours(hoursDefined);
    finalReminderDateDefined.setMinutes(minsDefined);
    // console.log(finalReminderDate,"--finalReminderDate--",finalReminderDateDefined);
    // Alert.alert(finalReminderDate.toString(),"..finalReminderDate.")
    // Alert.alert(finalReminderDateDefined.toString(),"..finalReminderDateDefined.")
    // console.log(DateTime.fromJSDate(new Date()).toMillis(),"new date--",DateTime.fromJSDate(new Date()));
    if (
      DateTime.fromJSDate(finalReminderDate).toMillis() >
      DateTime.fromJSDate(new Date()).toMillis()
    ) {
      if (
        DateTime.fromJSDate(finalReminderDateDefined).toMillis() >
          DateTime.fromJSDate(new Date()).toMillis() &&
        DateTime.fromJSDate(finalReminderDateDefined).toMillis() <
          DateTime.fromJSDate(finalReminderDate).toMillis()
      ) {
        const reminderValues = {
          uuid: editReminderItem ? editReminderItem.uuid : uuid(),
          reminderType: reminderType,
          reminderDate: editReminderItem
            ? dateTouched
              ? measureDate?.toMillis()
              : measureDate
            : measureDate?.toMillis(),
          reminderTime: editReminderItem
            ? timeTouched
              ? measureTimeNew
              : measureTimeNew
            : measureTimeNew,
          reminderDateDefined: editReminderItem
            ? dateTouchedDefined
              ? measureDateDefined?.toMillis()
              : measureDateDefined
            : measureDateDefined?.toMillis(),
          reminderTimeDefined: editReminderItem
            ? timeTouchedDefined
              ? measureTimeNewDefined
              : measureTimeNewDefined
            : measureTimeNewDefined,
        };
        const createresult =
          await userRealmCommon.updateChildReminders<ChildEntity>(
            ChildEntitySchema,
            reminderValues,
            'uuid ="' + activeChild.uuid + '"'
          );
        if (createresult?.length > 0) {
          activeChild.reminders = createresult;
          const titlevcr = t("vcrNoti2", {
            reminderDateTime:
              formatStringDate(measureDate) +
              "," +
              formatStringTime(measureTimeNew),
          });
          const titlehcr = t("hcrNoti2", {
            reminderDateTime:
              formatStringDate(measureDate) +
              "," +
              formatStringTime(measureTimeNew),
          });
          const message = reminderType == "vaccine" ? titlevcr : titlehcr;
          if (editReminderItem) {
            let previousDTDefined;
            const onlyDateDefined = new Date(
              editReminderItem.reminderDateDefined
            );
            previousDTDefined = onlyDateDefined.setHours(
              new Date(editReminderItem.reminderTimeDefined).getHours()
            );
            previousDTDefined = new Date(
              onlyDateDefined.setMinutes(
                new Date(editReminderItem.reminderTimeDefined).getMinutes()
              )
            );
            LocalNotifications.cancelReminderLocalNotification(
              DateTime.fromJSDate(new Date(previousDTDefined)).toMillis()
            );
          }
          if (vchcEnabledFlag == true) {
            //needs to test noti click once
            console.log(
              "finalReminderDateDefined for noti---",
              finalReminderDateDefined
            );
            LocalNotifications.schduleNotification(
              finalReminderDateDefined,
              t("remindersAlertTitle"),
              message,
              DateTime.fromJSDate(
                new Date(finalReminderDateDefined)
              ).toMillis(),
              reminderType == "vaccine" ? "vcr" : "hcr",
              activeChild.uuid
            );
          }
          dispatch(setActiveChildData(activeChild));
          const notiFlagObj = { key: "generateNotifications", value: true };
          dispatch(setInfoModalOpened(notiFlagObj));
          navigation.goBack();
          if (reminderType == "vaccine") {
            const eventData = { name: VACCINE_REMINDER_SET };
            logEvent(eventData, netInfo.isConnected);
          } else {
            const eventData = { name: HEALTH_CHECKUP_REMINDER_SET };
            logEvent(eventData, netInfo.isConnected);
          }
        } else {
          setClicked(false);
        }
      } else {
        setClicked(false);
        Alert.alert("", t("reminderalertTextDefined"));
      }
    } else {
      setClicked(false);
      Alert.alert("", t("reminderalertText"));
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
      <View style={[styles.containerView, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={[styles.headerRowHeight, { backgroundColor: headerColor }]}
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
            <Heading2 numberOfLines={1}>{headerTitle}</Heading2>
          </HeaderTitleView>
          {editReminderItem ? (
            <HeaderActionView style={styles.headerActionStyle}>
              <Pressable
                style={styles.pressableStyle}
                onPress={(): any => setModalVisible(true)}
              >
                <Icon name={"ic_trash"} size={20} color="#000" />
              </Pressable>
            </HeaderActionView>
          ) : null}
        </HeaderRowView>

        <ScrollView style={styles.scrollViewStyle}>
          <ShiftFromBottom10>
            <Heading4Regular>{titleTxt}</Heading4Regular>
          </ShiftFromBottom10>
          <FormInputGroup onPress={showmeasureDatepicker}>
            {Platform.OS != "ios" ? (
              <FormInputBoxWithoutLine>
                <FormDateText>
                  <Text>
                    {measureDate
                      ? formatStringDate(measureDate)
                      : t("vcReminderDate")}
                  </Text>
                  {showmeasure && (
                    <DateTimePicker
                      testID="measuredatePicker"
                      value={
                        editReminderItem ? new Date(measureDate) : new Date()
                      }
                      locale={locale}
                      mode={"date"}
                      display="spinner"
                      minimumDate={new Date()}
                      maximumDate={appConfig.fiveYearFromNow}
                      onChange={onmeasureChange}
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
                    {measureDate
                      ? formatStringDate(measureDate)
                      : t("vcReminderDate")}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isMeasureDatePickerVisible}
                    mode="date"
                    locale={locale}
                    onConfirm={handleMeasureDateConfirm}
                    date={editReminderItem ? new Date(measureDate) : new Date()}
                    onCancel={(): any => {
                      setMeasureDatePickerVisibility(false);
                    }}
                    minimumDate={new Date()}
                    maximumDate={appConfig.fiveYearFromNow}
                  />
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBoxWithoutLine>
            )}
          </FormInputGroup>
          <ShiftFromTop20>
            <FormInputGroup onPress={showmeasureTimepicker}>
              {Platform.OS != "ios" ? (
                <FormInputBoxWithoutLine>
                  <FormDateText>
                    <Text>
                      {measureTime
                        ? formatStringTime(measureTime)
                        : t("vcReminderTime")}
                    </Text>
                    {showmeasureTime && (
                      <DateTimePicker
                        testID="measuretimePicker"
                        value={
                          editReminderItem ? new Date(measureTime) : new Date()
                        }
                        mode={"time"}
                        locale={locale}
                        display="spinner"
                        is24Hour={false}
                        minimumDate={minmeasureTime}
                        onChange={onmeasureTimeChange}
                      />
                    )}
                  </FormDateText>
                  <FormDateAction>
                    <IconViewBorder>
                      <Icon name="ic_time" size={20} color="#000" />
                    </IconViewBorder>
                  </FormDateAction>
                </FormInputBoxWithoutLine>
              ) : (
                <FormInputBoxWithoutLine>
                  <FormDateText>
                    <Text>
                      {measureTime
                        ? formatStringTime(measureTime)
                        : t("vcReminderTime")}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isMeasureTimePickerVisible}
                      mode="time"
                      locale={locale}
                      onConfirm={handleMeasureTimeConfirm}
                      date={
                        editReminderItem ? new Date(measureTime) : new Date()
                      }
                      onCancel={(): any => {
                        setMeasureTimePickerVisibility(false);
                      }}
                      minimumDate={minmeasureTime}
                    />
                  </FormDateText>

                  <FormDateAction>
                    <IconViewBorder>
                      <Icon name="ic_time" size={20} color="#000" />
                    </IconViewBorder>
                  </FormDateAction>
                </FormInputBoxWithoutLine>
              )}
            </FormInputGroup>
          </ShiftFromTop20>

          <ShiftFromBottom20></ShiftFromBottom20>
          <ShiftFromBottom10>
            <Heading4Regular>{titleTxt2}</Heading4Regular>
          </ShiftFromBottom10>
          <FormInputGroup onPress={showmeasureDatepickerDefined}>
            {Platform.OS != "ios" ? (
              <FormInputBoxWithoutLine>
                <FormDateText>
                  <Text>
                    {measureDateDefined
                      ? formatStringDate(measureDateDefined)
                      : t("vcReminderDate")}
                  </Text>
                  {showmeasureDefined && (
                    <DateTimePicker
                      testID="measuredatePickerDefined"
                      value={
                        editReminderItem
                          ? new Date(measureDateDefined)
                          : new Date()
                      }
                      mode={"date"}
                      display="spinner"
                      locale={locale}
                      minimumDate={new Date()}
                      maximumDate={new Date(measureDate)}
                      onChange={onmeasureChangeDefined}
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
                    {measureDateDefined
                      ? formatStringDate(measureDateDefined)
                      : t("vcReminderDate")}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isMeasureDatePickerVisibleDefined}
                    mode="date"
                    locale={locale}
                    onConfirm={handleMeasureDateConfirmDefined}
                    date={
                      editReminderItem
                        ? new Date(measureDateDefined)
                        : new Date()
                    }
                    onCancel={(): any => {
                      setMeasureDatePickerVisibilityDefined(false);
                    }}
                    minimumDate={new Date()}
                    maximumDate={new Date(measureDate)}
                  />
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBoxWithoutLine>
            )}
          </FormInputGroup>
          <ShiftFromTop20>
            <FormInputGroup onPress={showmeasureTimepickerDefined}>
              {Platform.OS != "ios" ? (
                <FormInputBoxWithoutLine>
                  <FormDateText>
                    <Text>
                      {measureTimeDefined
                        ? formatStringTime(measureTimeDefined)
                        : t("vcReminderTime")}
                    </Text>
                    {showmeasureTimeDefined && (
                      <DateTimePicker
                        testID="measuretimePickerDefined"
                        value={
                          editReminderItem
                            ? new Date(measureTimeDefined)
                            : new Date()
                        }
                        mode={"time"}
                        display="spinner"
                        locale={locale}
                        is24Hour={false}
                        minimumDate={
                          new Date(
                            DateTime.local().plus({ minutes: +1 }).toISODate()
                          )
                        }
                        maximumDate={
                          measureTime
                            ? new Date(measureTime)
                            : new Date(
                                DateTime.local()
                                  .plus({ minutes: +1 })
                                  .toISODate()
                              )
                        }
                        onChange={onmeasureTimeChangeDefined}
                      />
                    )}
                  </FormDateText>
                  <FormDateAction>
                    <IconViewBorder>
                      <Icon name="ic_time" size={20} color="#000" />
                    </IconViewBorder>
                  </FormDateAction>
                </FormInputBoxWithoutLine>
              ) : (
                <FormInputBoxWithoutLine>
                  <FormDateText>
                    <Text>
                      {measureTimeDefined
                        ? formatStringTime(measureTimeDefined)
                        : t("vcReminderTime")}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isMeasureTimePickerVisibleDefined}
                      mode="time"
                      locale={locale}
                      onConfirm={handleMeasureTimeConfirmDefined}
                      date={
                        editReminderItem
                          ? new Date(measureTimeDefined)
                          : new Date()
                      }
                      onCancel={(): any => {
                        setMeasureTimePickerVisibilityDefined(false);
                      }}
                      minimumDate={minmeasureTimeDefined}
                      //minimumDate={new Date(DateTime.local().plus({ minutes: +1 }).toISODate())}
                      maximumDate={
                        measureTime
                          ? new Date(measureTime)
                          : new Date(
                              DateTime.local().plus({ minutes: +1 }).toISODate()
                            )
                      }
                    />
                  </FormDateText>
                  <FormDateAction>
                    <IconViewBorder>
                      <Icon name="ic_time" size={20} color="#000" />
                    </IconViewBorder>
                  </FormDateAction>
                </FormInputBoxWithoutLine>
              )}
            </FormInputGroup>
          </ShiftFromTop20>

          <ShiftFromTop30>
            <ButtonTertiary
              disabled={isFormDisabled()}
              onPress={(): any => {
                setClicked(true);
                setTimeout(() => {
                  saveReminder().then(() => {
                    console.log("in then");
                  });
                }, 100);
              }}
            >
              <ButtonText numberOfLines={2}>{buttonTitle}</ButtonText>
            </ButtonTertiary>
          </ShiftFromTop30>
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
                  <Heading3Center>{warningTxt}</Heading3Center>
                </ShiftFromTopBottom10>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint
                      onPress={(): any => setModalVisible(false)}
                    >
                      <ButtonText numberOfLines={2}>
                        {t("growthDeleteOption1")}
                      </ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonSecondary
                      onPress={(): any => {
                        deleteReminder().then(() => {
                          setModalVisible(false);
                          navigation.goBack();
                        });
                      }}
                    >
                      <ButtonText numberOfLines={2}>
                        {t("growthDeleteOption2")}
                      </ButtonText>
                    </ButtonSecondary>
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

export default AddReminder;

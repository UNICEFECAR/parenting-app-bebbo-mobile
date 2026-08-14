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
  ModalPopupContent,
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
  getDatePickerLocale,
} from "../../services/Utils";
import * as RNLocalize from "react-native-localize";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { logEvent } from "../../services/EventSyncService";
import { selectActiveChild } from "../../services/selectors";
import DatePickerField from "./DatePickerField";
import TimePickerField from "./TimePickerField";
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

  const dispatch = useAppDispatch();

  const activeChild = useAppSelector(selectActiveChild);

  const vchcEnabledFlag = useAppSelector(
    (state: any) => state.notificationData.vchcEnabled
  );

  const locale = useAppSelector((state: any) =>
    getDatePickerLocale(state.selectedCountry?.languageCode)
  );

  const timeZone = RNLocalize.getTimeZone();

  /**
   * ------------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------------
   */

  const toDateTime = (
    value: number | Date | DateTime | null | undefined
  ): DateTime | null => {
    if (!value) return null;

    if (DateTime.isDateTime(value)) {
      return value.setZone(timeZone);
    }

    if (typeof value === "number") {
      return DateTime.fromMillis(value).setZone(timeZone);
    }

    return DateTime.fromJSDate(value).setZone(timeZone);
  };
  /**
   * ------------------------------------------------------------------------
   * Appointment
   * ------------------------------------------------------------------------
   */
  const now = DateTime.local();
  const defaultAppointment = now.plus({ minutes: 30 });
  const defaultReminder = now.plus({ minutes: 1 });

  const [measureDate, setmeasureDate] =
    useState<DateTime>(
      editReminderItem
        ? toDateTime(editReminderItem.reminderDate)!
        : defaultAppointment
    );

  const [measureTime, setmeasureTime] =
    useState<DateTime>(
      editReminderItem
        ? toDateTime(editReminderItem.reminderTime)!
        : defaultAppointment
    );

  /**
   * ------------------------------------------------------------------------
   * Reminder
   * ------------------------------------------------------------------------
   */

  const [measureDateDefined, setmeasureDateDefined] =
    useState<DateTime>(
      editReminderItem
        ? toDateTime(editReminderItem.reminderDateDefined)!
        : defaultReminder
    );

  const [measureTimeDefined, setmeasureTimeDefined] =
    useState<DateTime>(
      editReminderItem
        ? toDateTime(editReminderItem.reminderTimeDefined)!
        : defaultReminder
    );

  /**
   * ------------------------------------------------------------------------
   * Picker State
   * ------------------------------------------------------------------------
   */

  const [showmeasure, setmeasureShow] = useState(false);
  const [showmeasureDefined, setmeasureShowDefined] = useState(false);

  const [showmeasureTime, setmeasureShowTime] = useState(false);
  const [showmeasureTimeDefined, setmeasureShowTimeDefined] =
    useState(false);

  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] =
    useState(false);

  const [
    isMeasureDatePickerVisibleDefined,
    setMeasureDatePickerVisibilityDefined,
  ] = useState(false);

  const [isMeasureTimePickerVisible, setMeasureTimePickerVisibility] =
    useState(false);

  const [
    isMeasureTimePickerVisibleDefined,
    setMeasureTimePickerVisibilityDefined,
  ] = useState(false);

  /**
   * ------------------------------------------------------------------------
   * Misc State
   * ------------------------------------------------------------------------
   */

  const [clicked, setClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [dateTouched, setDateTouched] = useState(false);
  const [timeTouched, setTimeTouched] = useState(false);

  const [dateTouchedDefined, setDateTouchedDefined] =
    useState(false);

  const [timeTouchedDefined, setTimeTouchedDefined] =
    useState(false);

  const [minmeasureTime, setminmeasureTime] = useState<Date>(
    editReminderItem
      ? new Date(editReminderItem.reminderDate)
      : new Date()
  );

  const [minmeasureTimeDefined, setminmeasureTimeDefined] =
    useState<Date>(
      editReminderItem
        ? new Date(editReminderItem.reminderDateDefined)
        : new Date()
    );

  /**
   * ------------------------------------------------------------------------
   * Appointment Date
   * ------------------------------------------------------------------------
   */

  const onmeasureChange = (
    _event: any,
    selectedDate?: Date
  ) => {
    setmeasureShow(false);

    if (!selectedDate) {
      return;
    }

    const selected = DateTime.fromJSDate(selectedDate).setZone(timeZone);

    if (!measureDate || !selected.hasSame(measureDate, "day")) {
      setmeasureDate(
        selected.set({
          hour: measureTime.hour,
          minute: measureTime.minute,
          second: measureTime.second,
          millisecond: 0,
        })
      );
      setDateTouched(true);

      if (selected.hasSame(DateTime.local(), "day")) {
        setminmeasureTime(new Date());

        setmeasureTime(
          selected.set({
            minute: selected.minute < 59 ? selected.minute + 1 : 0,
          })
        );
      } else {
        setminmeasureTime(selected.startOf("day").toJSDate());
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Reminder Date
   * ------------------------------------------------------------------------
   */

  const onmeasureChangeDefined = (
    _event: any,
    selectedDate?: Date
  ) => {
    setmeasureShowDefined(false);

    if (!selectedDate) {
      return;
    }

    const selected = DateTime.fromJSDate(selectedDate).setZone(timeZone);

    if (
      !measureDateDefined ||
      !selected.hasSame(measureDateDefined, "day")
    ) {
      // setmeasureDateDefined(selected);
      setmeasureDateDefined(
        selected.set({
          hour: measureTimeDefined.hour,
          minute: measureTimeDefined.minute,
          second: measureTimeDefined.second,
          millisecond: 0,
        })
      );
      setDateTouchedDefined(true);

      if (selected.hasSame(DateTime.local(), "day")) {
        setmeasureTimeDefined(
          selected.set({
            minute: selected.minute < 59 ? selected.minute + 1 : 0,
          })
        );

        setminmeasureTimeDefined(new Date());
      } else {
        setminmeasureTimeDefined(selected.startOf("day").toJSDate());
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Appointment Time
   * ------------------------------------------------------------------------
   */

  const onmeasureTimeChange = (
    _event: any,
    selectedTime?: Date
  ) => {
    setmeasureShowTime(false);

    if (!selectedTime) return;

    setmeasureTime(
      DateTime.fromJSDate(selectedTime).setZone(timeZone)
    );

    setTimeTouched(true);
  };

  /**
   * ------------------------------------------------------------------------
   * Reminder Time
   * ------------------------------------------------------------------------
   */

  const onmeasureTimeChangeDefined = (
    _event: any,
    selectedTime?: Date
  ) => {
    setmeasureShowTimeDefined(false);

    if (!selectedTime) return;

    setmeasureTimeDefined(
      DateTime.fromJSDate(selectedTime).setZone(timeZone)
    );

    setTimeTouchedDefined(true);
  };

  /**
   * ------------------------------------------------------------------------
   * Picker Helpers
   * ------------------------------------------------------------------------
   */

  const showmeasureDatepicker = () => {
    setmeasureShow(true);

    if (Platform.OS === "ios") {
      setMeasureDatePickerVisibility(true);
    }
  };

  const showmeasureDatepickerDefined = () => {
    setmeasureShowDefined(true);

    if (Platform.OS === "ios") {
      setMeasureDatePickerVisibilityDefined(true);
    }
  };

  const handleMeasureDateConfirm = (date: Date) => {
    onmeasureChange(null, date);
    setMeasureDatePickerVisibility(false);
  };

  const handleMeasureDateConfirmDefined = (date: Date) => {
    onmeasureChangeDefined(null, date);
    setMeasureDatePickerVisibilityDefined(false);
  };

  const showmeasureTimepicker = () => {
    setmeasureShowTime(true);

    if (Platform.OS === "ios") {
      setMeasureTimePickerVisibility(true);
    }
  };

  const showmeasureTimepickerDefined = () => {
    setmeasureShowTimeDefined(true);

    if (Platform.OS === "ios") {
      setMeasureTimePickerVisibilityDefined(true);
    }
  };

  const handleMeasureTimeConfirm = (time: Date) => {
    onmeasureTimeChange(null, time);
    setMeasureTimePickerVisibility(false);
  };

  const handleMeasureTimeConfirmDefined = (time: Date) => {
    onmeasureTimeChangeDefined(null, time);
    setMeasureTimePickerVisibilityDefined(false);
  };

  /**
   * ------------------------------------------------------------------------
   * Form
   * ------------------------------------------------------------------------
   */

  const isFormDisabled = () =>
    !(
      measureDate &&
      measureTime &&
      measureDateDefined &&
      measureTimeDefined &&
      !clicked
    );
  const getReminderNotificationDateTime = (
    reminderDate: number,
    reminderTime: number
  ): DateTime => {
    const date = DateTime.fromMillis(reminderDate);
    const time = DateTime.fromMillis(reminderTime);

    return date.set({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      millisecond: 0,
    });
  };
  const deleteReminder = async (): Promise<void> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);

    const result = await userRealmCommon.deleteChildReminders<ChildEntity>(
      ChildEntitySchema,
      editReminderItem,
      `uuid ="${activeChild.uuid}"`
    );

    if (!result) {
      return;
    }

    if (editReminderItem) {
      const previousReminder =
        getReminderNotificationDateTime(
          editReminderItem.reminderDateDefined,
          editReminderItem.reminderTimeDefined
        );

      LocalNotifications.cancelReminderLocalNotification(
        previousReminder.toMillis()
      );
    }

    activeChild.reminders = result;

    dispatch(
      setInfoModalOpened({
        key: "generateNotifications",
        value: true,
      })
    );

    dispatch(setActiveChildData(activeChild));
  };
  const saveReminder = async (): Promise<void> => {
    if (
      !measureDate ||
      !measureTime ||
      !measureDateDefined ||
      !measureTimeDefined
    ) {
      return;
    }

    setClicked(true);

    const appointmentDateTime = measureDate.set({
      hour: measureTime.hour,
      minute: measureTime.minute,
      second: measureTime.second,
      millisecond: 0,
    });

    const reminderDateTime = measureDateDefined.set({
      hour: measureTimeDefined.hour,
      minute: measureTimeDefined.minute,
      second: measureTimeDefined.second,
      millisecond: 0,
    });

    const now = DateTime.now();

    if (appointmentDateTime <= now) {
      setClicked(false);
      Alert.alert("", t("reminderalertText"));
      return;
    }

    if (
      reminderDateTime <= now ||
      reminderDateTime >= appointmentDateTime
    ) {
      setClicked(false);
      Alert.alert("", t("reminderalertTextDefined"));
      return;
    }

    const reminderValues = {
      uuid: editReminderItem ? editReminderItem.uuid : uuid(),

      reminderType,

      reminderDate: measureDate.toMillis(),

      reminderTime: measureTime.toMillis(),

      reminderDateDefined: measureDateDefined.toMillis(),

      reminderTimeDefined: measureTimeDefined.toMillis(),
    };

    const result =
      await userRealmCommon.updateChildReminders<ChildEntity>(
        ChildEntitySchema,
        reminderValues,
        `uuid ="${activeChild.uuid}"`
      );

    if (!result?.length) {
      setClicked(false);
      return;
    }

    activeChild.reminders = result;

    const reminderDateTimeText =
      `${formatStringDate(measureDate)},${formatStringTime(
        measureTime.toMillis()
      )}`;

    const message =
      reminderType === "vaccine"
        ? t("vcrNoti2", {
          reminderDateTime: reminderDateTimeText,
        })
        : t("hcrNoti2", {
          reminderDateTime: reminderDateTimeText,
        });

    if (editReminderItem) {
      const previousReminder =
        getReminderNotificationDateTime(
          editReminderItem.reminderDateDefined,
          editReminderItem.reminderTimeDefined
        );

      LocalNotifications.cancelReminderLocalNotification(
        previousReminder.toMillis()
      );
    }

    if (vchcEnabledFlag) {
      LocalNotifications.schduleNotification(
        reminderDateTime.toJSDate(),
        t("remindersAlertTitle"),
        message,
        reminderDateTime.toMillis(),
        reminderType === "vaccine" ? "vcr" : "hcr",
        activeChild.uuid
      );
    }

    dispatch(setActiveChildData(activeChild));

    dispatch(
      setInfoModalOpened({
        key: "generateNotifications",
        value: true,
      })
    );

    navigation.goBack();

    logEvent(
      {
        name:
          reminderType === "vaccine"
            ? VACCINE_REMINDER_SET
            : HEALTH_CHECKUP_REMINDER_SET,
      },
      netInfo.isConnected
    );
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
  const todayStart = React.useMemo(
    () => DateTime.local().startOf("day").toJSDate(),
    []
  );
  return (
    <View
      style={[
        styles.containerView,
        {
          backgroundColor: headerColor,
        },
      ]}
    >
      <FocusAwareStatusBar
        animated
        backgroundColor={headerColor}
      />

      {/* Header */}

      <HeaderRowView
        style={[
          styles.headerRowHeight,
          {
            backgroundColor: headerColor,
          },
        ]}
      >
        <HeaderIconView>
          <HeaderIconPress onPress={navigation.goBack}>
            <IconML
              name="ic_back"
              color="#000"
              size={15}
            />
          </HeaderIconPress>
        </HeaderIconView>

        <HeaderTitleView>
          <Heading2 numberOfLines={1}>
            {headerTitle}
          </Heading2>
        </HeaderTitleView>

        {editReminderItem && (
          <HeaderActionView
            style={styles.headerActionStyle}
          >
            <Pressable
              style={styles.pressableStyle}
              onPress={() => setModalVisible(true)}
            >
              <Icon
                name="ic_trash"
                size={20}
                color="#000"
              />
            </Pressable>
          </HeaderActionView>
        )}
      </HeaderRowView>

      <ScrollView style={styles.scrollViewStyle}>
        {/* Appointment */}

        <ShiftFromBottom10>
          <Heading4Regular>{titleTxt}</Heading4Regular>
        </ShiftFromBottom10>

        <DatePickerField
          value={measureDate}
          placeholder={t("vcReminderDate")}
          locale={locale}
          minimumDate={todayStart}
          maximumDate={appConfig.fiveYearFromNow}
          showPicker={showmeasure}
          iosVisible={isMeasureDatePickerVisible}
          onPress={showmeasureDatepicker}
          onAndroidChange={onmeasureChange}
          onIOSConfirm={handleMeasureDateConfirm}
          onIOSCancel={() =>
            setMeasureDatePickerVisibility(false)
          }
        />

        <ShiftFromTop20>
          <TimePickerField
            value={measureTime}
            placeholder={t("vcReminderTime")}
            locale={locale}
            minimumDate={minmeasureTime}
            showPicker={showmeasureTime}
            iosVisible={isMeasureTimePickerVisible}
            onPress={showmeasureTimepicker}
            onAndroidChange={onmeasureTimeChange}
            onIOSConfirm={handleMeasureTimeConfirm}
            onIOSCancel={() =>
              setMeasureTimePickerVisibility(false)
            }
          />
        </ShiftFromTop20>

        <ShiftFromBottom20 />

        {/* Reminder */}

        <ShiftFromBottom10>
          <Heading4Regular>
            {titleTxt2}
          </Heading4Regular>
        </ShiftFromBottom10>

        <DatePickerField
          value={measureDateDefined}
          placeholder={t("vcReminderDate")}
          locale={locale}
          minimumDate={todayStart}
          maximumDate={
            measureDate
              ? measureDate.toJSDate()
              : appConfig.fiveYearFromNow
          }
          showPicker={showmeasureDefined}
          iosVisible={
            isMeasureDatePickerVisibleDefined
          }
          onPress={showmeasureDatepickerDefined}
          onAndroidChange={onmeasureChangeDefined}
          onIOSConfirm={
            handleMeasureDateConfirmDefined
          }
          onIOSCancel={() =>
            setMeasureDatePickerVisibilityDefined(
              false
            )
          }
        />

        <ShiftFromTop20>
          <TimePickerField
            value={measureTimeDefined}
            placeholder={t("vcReminderTime")}
            locale={locale}
            minimumDate={
              measureDateDefined &&
                measureDateDefined.toISODate() === DateTime.local().toISODate()
                ? new Date()
                : measureDateDefined
                  ? measureDateDefined.startOf("day").toJSDate()
                  : undefined
            }
            maximumDate={
              measureDate && measureTime
                ? measureDate
                  .set({
                    hour: measureTime.hour,
                    minute: measureTime.minute,
                    second: measureTime.second,
                    millisecond: 0,
                  })
                  .toJSDate()
                : undefined
            }
            showPicker={showmeasureTimeDefined}
            iosVisible={
              isMeasureTimePickerVisibleDefined
            }
            onPress={showmeasureTimepickerDefined}
            onAndroidChange={
              onmeasureTimeChangeDefined
            }
            onIOSConfirm={
              handleMeasureTimeConfirmDefined
            }
            onIOSCancel={() =>
              setMeasureTimePickerVisibilityDefined(
                false
              )
            }
          />
        </ShiftFromTop20>

        <ShiftFromTop30>
          <ButtonTertiary
            disabled={isFormDisabled()}
            onPress={saveReminder}
          >
            <ButtonText numberOfLines={2}>
              {buttonTitle}
            </ButtonText>
          </ButtonTertiary>
        </ShiftFromTop30>

        <Modal
          transparent
          animationType="none"
          visible={modalVisible}
          onRequestClose={() =>
            setModalVisible(false)
          }
          onDismiss={() =>
            setModalVisible(false)
          }
        >
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={() =>
                    setModalVisible(false)
                  }
                >
                  <Icon
                    name="ic_close"
                    size={16}
                    color="#000"
                  />
                </PopupClose>
              </PopupCloseContainer>

              <ShiftFromTopBottom10>
                <ModalPopupContent>
                  <Heading3Center>
                    {warningTxt}
                  </Heading3Center>
                </ModalPopupContent>
              </ShiftFromTopBottom10>

              <ButtonContainerTwo>
                <ButtonColTwo>
                  <ButtonSecondaryTint
                    onPress={() =>
                      setModalVisible(false)
                    }
                  >
                    <ButtonText numberOfLines={2}>
                      {t("growthDeleteOption1")}
                    </ButtonText>
                  </ButtonSecondaryTint>
                </ButtonColTwo>

                <ButtonColTwo>
                  <ButtonSecondary
                    onPress={async () => {
                      await deleteReminder();
                      setModalVisible(false);
                      navigation.goBack();
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
  );
};

export default AddReminder;

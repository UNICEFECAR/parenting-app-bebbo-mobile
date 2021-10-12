import { HEALTH_CHECKUP_REMINDER_SET, VACCINE_REMINDER_SET } from '@assets/data/firebaseEvents';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainerTwo, ButtonDelPress, ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup
} from '@components/shared/ChildSetupStyle';
import {
  HeaderActionView,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconViewBorder } from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import analytics from '@react-native-firebase/analytics';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3Center,
  Paragraph,
  ShiftFromTop20,
  ShiftFromTop30,
  ShiftFromTopBottom10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert, Modal,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import { formatStringDate, formatStringTime } from '../../services/Utils';

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
//  reminder.periodId === doctorVisitPeriod.uuid
const AddReminder = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const {
    headerTitle,
    buttonTitle,
    titleTxt,
    warningTxt,
    headerColor,
    reminderType,
    editReminderItem,
  } = route.params;
  // console.log(editReminderItem,"editReminderItem");
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editReminderItem ? editReminderItem.reminderDate : null,
  );
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [measureTime, setmeasureTime] = useState<DateTime>(
    editReminderItem ? editReminderItem.reminderTime : null,
  );
  const [minmeasureTime, setminmeasureTime] = useState<any>(
    editReminderItem ? new Date(editReminderItem.reminderDate) : new Date(),
  );
  const [showmeasureTime, setmeasureShowTime] = useState<Boolean>(false);
  const [dateTouched, setDateTouched] = useState<Boolean>(false);
  const [timeTouched, setTimeTouched] = useState<Boolean>(false);
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] = useState(false);
  const [isMeasureTimePickerVisible, setMeasureTimePickerVisibility] = useState(false);

  // const defaultDatePickerValue = new Date();
  // const defaulttimePickerValue = new Date();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const child_age = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ''
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  // const defaultTimePickerMinValue = ()=>{
  //   var minTime  = new Date();
  //   minTime.getHours()
  //   minTime.getMinutes()
  //   minTime.getSeconds()
  //   return new Date().setHours(new Date().getHours()).setMinutes(new Date().getMinutes())
  // }

  //if measureDate is luxon today, then set measureTime to hours,minutes,seconds
  // var maxTime = new Date();
  // maxTime.setHours(22);
  // maxTime.setMinutes(0);
  // maxTime.setMilliseconds(0);
  const onmeasureChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    console.log(selectedDate, "..selectedDate..")
    console.log(currentDate, "..currentDate..")
    setmeasureShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(currentDate));
      setDateTouched(true);
      console.log(new Date(selectedDate).toDateString(), "/", new Date().toDateString());
      if (new Date(selectedDate).toDateString() == new Date().toDateString()) {
        setminmeasureTime(new Date(currentDate));
        console.log(currentDate, "..11currentDatenew",)
        setmeasureTime(new Date(currentDate).setMinutes(new Date().getMinutes() < 59 ? new Date().getMinutes() + 1 : 0))
        // .setMinutes(new Date().getMinutes()<60?new Date().getMinutes()+1:00)
      }
      else {
        // console.log(currentDate,"..currentDatenew");
        // console.log(new Date(new Date(currentDate).setHours(0, 0, 0, 0)))
        const currentDatenew = new Date(new Date(currentDate).setHours(0, 0, 0, 0))
        console.log(currentDatenew, "..currentDatenew")
        setminmeasureTime(new Date(currentDatenew));
        //setminmeasureTime(DateTime.fromJSDate(currentDate));
      }

    }

  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
    if (Platform.OS == 'ios') {
      setMeasureDatePickerVisibility(true);
    }
  };
  const handleMeasureDateConfirm = (event: any) => {
    const date = event;
    console.log("A date has been picked: ", date);
    onmeasureChange(event, date);
    setMeasureDatePickerVisibility(false);
  };
  const handleMeasureTimeConfirm = (event: any) => {
    const time = event;
    console.log("A date has been picked: ", time);
    onmeasureTimeChange(event, time);
    setMeasureTimePickerVisibility(false);
  };

  const onmeasureTimeChange = (event: any, selectedTime: any) => {
    // console.log(selectedTime,"selectedTime");
    const currentTime = selectedTime || measureTime;
    // console.log(currentTime,"currentTime");
    setmeasureShowTime(false);
    if (selectedTime) {
      setmeasureTime(DateTime.fromJSDate(currentTime));
      setTimeTouched(true);
    }
    // console.log(reminderType, measureDate, measureTime);
  };
  const showmeasureTimepicker = () => {
    setmeasureShowTime(true);
    if (Platform.OS == 'ios') {
      setMeasureTimePickerVisibility(true);
    }
  };
  const isFormDisabled = () => {
    if (measureDate && measureTime) {
      return false;
    } else {
      return true;
    }
  };
  const deleteReminder = async () => {
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(
      ChildEntitySchema,
    );
    console.log(allJsonDatanew?.length, 'allJsonDatanew');
    let createresult = await userRealmCommon.deleteChildReminders<ChildEntity>(
      ChildEntitySchema,
      editReminderItem,
      'uuid ="' + activeChild.uuid + '"',
    );
    console.log(createresult?.length, 'ReminderDeleted');
    if (createresult) {
      activeChild.reminders = createresult;
      let notiFlagObj = { key: 'generateNotifications', value: true };
      dispatch(setInfoModalOpened(notiFlagObj));
      dispatch(setActiveChildData(activeChild));
    }
    // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
  };
  const saveReminder = async () => {
    // check if reminderdate and time are less than current time show error alert
    // else allow saving

    let measureTimeNew;
    if (typeof measureTime === 'number' || measureTime instanceof Number) {
      measureTimeNew = measureTime;
    }
    else {
      measureTimeNew = measureTime.toMillis();
    }
    const hours = new Date(editReminderItem
      ? timeTouched
        ? measureTimeNew
        : measureTimeNew
      : measureTimeNew).getHours();
    const mins = new Date(editReminderItem
      ? timeTouched
        ? measureTimeNew
        : measureTimeNew
      : measureTimeNew).getMinutes()
    let finalReminderDate = new Date(editReminderItem
      ? dateTouched
        ? measureDate?.toMillis()
        : measureDate
      : measureDate?.toMillis())
    finalReminderDate.setHours(hours);
    finalReminderDate.setMinutes(mins);
    if (DateTime.fromJSDate(finalReminderDate).toMillis() > DateTime.fromJSDate(new Date()).toMillis()) {
      const reminderValues = {
        uuid: editReminderItem ? editReminderItem.uuid : uuidv4(),
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
      };
      let createresult = await userRealmCommon.updateChildReminders<ChildEntity>(
        ChildEntitySchema,
        reminderValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      // console.log(createresult);
      if (createresult?.length > 0) {
        activeChild.reminders = createresult;
        dispatch(setActiveChildData(activeChild));
        let notiFlagObj = { key: 'generateNotifications', value: true };
        dispatch(setInfoModalOpened(notiFlagObj));
        navigation.goBack();
        if (reminderType == 'vaccine') {
          analytics().logEvent(VACCINE_REMINDER_SET)
        } else {
          analytics().logEvent(HEALTH_CHECKUP_REMINDER_SET)
        }
      }
    } else {
      Alert.alert(t('reminderalertText'))
    }

    // reminderalertText:"Reminder Date is before current Date Time"
    // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
  };
  let fiveYearFromNow = new Date();
  fiveYearFromNow.setFullYear(fiveYearFromNow.getFullYear() + 5);
  return (
    <>
      <View style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#000" size={15} />
            </Pressable>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2 numberOfLines={1}>{headerTitle}</Heading2>
          </HeaderTitleView>
          {editReminderItem ? (
            <HeaderActionView>
              <ButtonDelPress
                onPress={() => {
                  setModalVisible(true);
                }}>
                <ButtonTextSmLine>{t('growthScreendeletebtnText')}</ButtonTextSmLine>
              </ButtonDelPress>
            </HeaderActionView>
          ) : null}
        </HeaderRowView>

        <ScrollView style={{ padding: 15, flex: 7 }}>
          <Paragraph>{titleTxt}</Paragraph>
          <FormInputGroup onPress={showmeasureDatepicker}>
            {Platform.OS != 'ios' ? (
              <FormInputBox>
                <FormDateText>
                  <Text>
                    {measureDate
                      ?
                      // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                      //     'dd/MM/yyyy',
                      //   )
                      formatStringDate(measureDate, luxonLocale)
                      : t('vcReminderDate')}
                  </Text>
                  {showmeasure && (
                    <DateTimePicker
                      testID="measuredatePicker"
                      value={
                        editReminderItem ? new Date(measureDate) : new Date()
                      }
                      mode={'date'}
                      display="default"
                      minimumDate={new Date()}
                      maximumDate={fiveYearFromNow}
                      onChange={onmeasureChange}
                    />
                  )}
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            ) : (
              <FormInputBox>
                <FormDateText>
                  <Text>
                    {measureDate
                      ?
                      // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                      //     'dd/MM/yyyy',
                      //   )
                      formatStringDate(measureDate, luxonLocale)
                      : t('vcReminderDate')}
                  </Text>
                  {/* <DateTimePicker
                  testID="measuredatePicker"
                  value={editReminderItem ? new Date(measureDate) : new Date()}
                  mode={'date'}
                  display="default"
                  minimumDate={new Date()}
                  // maximumDate => childDOB +72 weeks
                  onChange={onmeasureChange}
                  style={{backgroundColor: 'white', flex: 1}}
                /> */}
                  <DateTimePickerModal
                    isVisible={isMeasureDatePickerVisible}
                    mode="date"
                    onConfirm={handleMeasureDateConfirm}
                    date={editReminderItem ? new Date(measureDate) : new Date()}
                    onCancel={() => {
                      // Alert.alert('Modal has been closed.');
                      setMeasureDatePickerVisibility(false);
                    }}
                    minimumDate={new Date()}
                    maximumDate={fiveYearFromNow}
                  />

                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            )}
          </FormInputGroup>
          <ShiftFromTop20>
            <FormInputGroup onPress={showmeasureTimepicker}>
              {Platform.OS != 'ios' ? (
                <FormInputBox>
                  <FormDateText>
                    <Text>
                      {measureTime
                        ?
                        // DateTime.fromJSDate(new Date(measureTime)).toFormat(
                        //     'hh:mm a',
                        //   )
                        formatStringTime(measureTime, luxonLocale)
                        : t('vcReminderTime')}
                    </Text>
                    {showmeasureTime && (
                      <DateTimePicker
                        testID="measuretimePicker"
                        value={
                          editReminderItem ? new Date(measureTime) : new Date()
                        }
                        mode={'time'}
                        display="default"
                        is24Hour={true}
                        minimumDate={minmeasureTime}
                        onChange={onmeasureTimeChange}
                      />
                    )}
                  </FormDateText>
                  <FormDateAction>
                    <IconViewBorder>
                      <Icon
                        name="ic_time"
                        size={20}
                        color="#000"
                      />
                    </IconViewBorder>
                  </FormDateAction>
                </FormInputBox>
              ) : (
                <FormInputBox>
                  <FormDateText>
                    <Text>
                      {measureTime
                        ?
                        // DateTime.fromJSDate(new Date(measureTime)).toFormat(
                        //     'hh:mm a',
                        //   )
                        formatStringTime(measureTime, luxonLocale)
                        : t('vcReminderTime')}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isMeasureTimePickerVisible}
                      mode="time"
                      onConfirm={handleMeasureTimeConfirm}
                      date={editReminderItem ? new Date(measureTime) : new Date()}
                      onCancel={() => {
                        // Alert.alert('Modal has been closed.');
                        setMeasureTimePickerVisibility(false);
                      }}
                      minimumDate={minmeasureTime}
                    />

                  </FormDateText>
                  {/* <FormDateAction>
                    <Icon
                      name="ic_time"
                      size={20}
                      color="#000"
                      style={{borderWidth: 1, borderRadius: 50}}
                    />
                  </FormDateAction> */}
                  <FormDateAction>
                    <IconViewBorder>
                      <Icon
                        name="ic_time"
                        size={20}
                        color="#000"
                      />
                    </IconViewBorder>
                  </FormDateAction>
                </FormInputBox>
              )}
            </FormInputGroup>
          </ShiftFromTop20>
          <View></View>

          <View></View>

          <ShiftFromTop30>
            <ButtonTertiary
              disabled={isFormDisabled()}
              onPress={() => {
                saveReminder().then(() => {

                });
                // navigation.goBack();
              }}>
              <ButtonText numberOfLines={2}>{buttonTitle}</ButtonText>
            </ButtonTertiary>
          </ShiftFromTop30>
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(false);
            }}
            onDismiss={() => {
              setModalVisible(false);
            }}>
            <PopupOverlay>
              <ModalPopupContainer>
                <PopupCloseContainer>
                  <PopupClose
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Icon name="ic_close" size={16} color="#000" />
                  </PopupClose>
                </PopupCloseContainer>
                <ShiftFromTopBottom10>
                  <Heading3Center>{warningTxt}</Heading3Center>
                </ShiftFromTopBottom10>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint
                      onPress={() => setModalVisible(false)}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonSecondary
                      onPress={() => {
                        deleteReminder().then(() => {
                          setModalVisible(false);
                          navigation.goBack();
                        });
                      }}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption2')}</ButtonText>
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

import { HEALTH_CHECKUP_REMINDER_SET, VACCINE_REMINDER_SET } from '@assets/data/firebaseEvents';
import { fiveYearFromNow } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainerTwo,
  ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
} from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup
} from '@components/shared/ChildSetupStyle';
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconML, IconViewBorder } from '@components/shared/Icon';
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
  Heading4Regular,
  ShiftFromBottom10,
  ShiftFromBottom20,
  ShiftFromTop20,
  ShiftFromTop30,
  ShiftFromTopBottom10,
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert, BackHandler, Modal,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import { setInfoModalOpened } from '../../redux/reducers/utilsSlice';
import LocalNotifications from '../../services/LocalNotifications';
import { formatStringDate, formatStringTime } from '../../services/Utils';

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
  route: any
};
const AddReminder = ({ route, navigation }: Props) => {
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
    editReminderItem ? editReminderItem.reminderDate : null,
  );
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [clicked, setClicked] = useState(false);
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

  const [measureDateDefined, setmeasureDateDefined] = useState<DateTime>(
    editReminderItem ? editReminderItem.reminderDateDefined : null,
  );
  const [showmeasureDefined, setmeasureShowDefined] = useState<Boolean>(false);
  const [measureTimeDefined, setmeasureTimeDefined] = useState<DateTime>(
    editReminderItem ? editReminderItem.reminderTimeDefined : null,
  );
 
  const [showmeasureTimeDefined, setmeasureShowTimeDefined] = useState<Boolean>(false);
  const [dateTouchedDefined, setDateTouchedDefined] = useState<Boolean>(false);
  const [timeTouchedDefined, setTimeTouchedDefined] = useState<Boolean>(false);
  const [isMeasureDatePickerVisibleDefined, setMeasureDatePickerVisibilityDefined] = useState(false);
  const [isMeasureTimePickerVisibleDefined, setMeasureTimePickerVisibilityDefined] = useState(false);
  const dispatch = useAppDispatch();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const vchcEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.vchcEnabled),
  );

  //if measureDate is luxon today, then set measureTime to hours,minutes,seconds
  
  const onmeasureChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    setmeasureShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(currentDate));
      setDateTouched(true);
      if (new Date(selectedDate).toDateString() == new Date().toDateString()) {
        setminmeasureTime(new Date(currentDate));
        setmeasureTime(new Date(currentDate).setMinutes(new Date().getMinutes() < 59 ? new Date().getMinutes() + 1 : 0))
      }
      else {
        const currentDatenew = new Date(new Date(currentDate).setHours(0, 0, 0, 0))
        setminmeasureTime(new Date(currentDatenew));
      }

    }

  };
  const onmeasureChangeDefined = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDateDefined;
    setmeasureShowDefined(false);
    if (selectedDate) {
      setmeasureDateDefined(DateTime.fromJSDate(currentDate));
      setDateTouchedDefined(true);
      if (new Date(selectedDate).toDateString() == new Date().toDateString()) {
        setmeasureTimeDefined(new Date(currentDate).setMinutes(new Date().getMinutes() < 59 ? new Date().getMinutes() + 1 : 0))
      }
      else {
        const currentDatenew = new Date(new Date(currentDate).setHours(0, 0, 0, 0))
      }

    }

  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
    if (Platform.OS == 'ios') {
      setMeasureDatePickerVisibility(true);
    }
  };
  const showmeasureDatepickerDefined = () => {
    setmeasureShowDefined(true);
    if (Platform.OS == 'ios') {
      setMeasureDatePickerVisibilityDefined(true);
    }
  };
  const handleMeasureDateConfirm = (event: any) => {
    const date = event;
    onmeasureChange(event, date);
    setMeasureDatePickerVisibility(false);
  };
  const handleMeasureDateConfirmDefined = (event: any) => {
    const date = event;
    onmeasureChangeDefined(event, date);
    setMeasureDatePickerVisibilityDefined(false);
  };
  const handleMeasureTimeConfirm = (event: any) => {
    const time = event;
    onmeasureTimeChange(event, time);
    setMeasureTimePickerVisibility(false);
  };
  const handleMeasureTimeConfirmDefined = (event: any) => {
    const time = event;
    onmeasureTimeChangeDefined(event, time);
    setMeasureTimePickerVisibilityDefined(false);
  };

  const onmeasureTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || measureTime;
    setmeasureShowTime(false);
    if (selectedTime) {
      setmeasureTime(DateTime.fromJSDate(currentTime));
      setTimeTouched(true);
    }
  };
  const onmeasureTimeChangeDefined = (event: any, selectedTime: any) => {
    const currentTime = selectedTime || measureTimeDefined;
    setmeasureShowTimeDefined(false);
    if (selectedTime) {
      setmeasureTimeDefined(DateTime.fromJSDate(currentTime));
      setTimeTouchedDefined(true);
    }
  };
  const showmeasureTimepicker = () => {
    setmeasureShowTime(true);
    if (Platform.OS == 'ios') {
      setMeasureTimePickerVisibility(true);
    }
  };
  const showmeasureTimepickerDefined = () => {
    setmeasureShowTimeDefined(true);
    if (Platform.OS == 'ios') {
      setMeasureTimePickerVisibilityDefined(true);
    }
  };
  const isFormDisabled = () => {
    if (measureDate && measureTime && measureDateDefined && measureTimeDefined && !clicked) {
      return false;
    } else {
      return true;
    }
  };
  const deleteReminder = async () => {
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(
      ChildEntitySchema,
    );
    let createresult = await userRealmCommon.deleteChildReminders<ChildEntity>(
      ChildEntitySchema,
      editReminderItem,
      'uuid ="' + activeChild.uuid + '"',
    );
    if (createresult) {
      if(editReminderItem) {
        let previousDTDefined;
        const onlyDateDefined = new Date(editReminderItem.reminderDateDefined);
        previousDTDefined = onlyDateDefined.setHours(new Date(editReminderItem.reminderTimeDefined).getHours());
        previousDTDefined = new Date(onlyDateDefined.setMinutes(new Date(editReminderItem.reminderTimeDefined).getMinutes()));
        LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(new Date(previousDTDefined)).toMillis());
      }
      activeChild.reminders = createresult;
      let notiFlagObj = { key: 'generateNotifications', value: true };
      dispatch(setInfoModalOpened(notiFlagObj));
      dispatch(setActiveChildData(activeChild));
    }
  };
  const saveReminder = async () => {
    // check if reminderdate and time are less than current time show error alert
    // else allow saving

    let measureTimeNew,measureTimeNewDefined;
    if (typeof measureTime === 'number' || measureTime instanceof Number) {
      measureTimeNew = measureTime;
    }
    else {
      measureTimeNew = measureTime.toMillis();
    }
    if (typeof measureTimeDefined === 'number' || measureTimeDefined instanceof Number) {
      measureTimeNewDefined = measureTimeDefined;
    }
    else {
      measureTimeNewDefined = measureTimeDefined.toMillis();
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
    
    const hoursDefined = new Date(editReminderItem
      ? timeTouchedDefined
        ? measureTimeNewDefined
        : measureTimeNewDefined
      : measureTimeNewDefined).getHours();
    const minsDefined = new Date(editReminderItem
      ? timeTouchedDefined
        ? measureTimeNewDefined
        : measureTimeNewDefined
      : measureTimeNewDefined).getMinutes()
    let finalReminderDateDefined = new Date(editReminderItem
      ? dateTouchedDefined
        ? measureDateDefined?.toMillis()
        : measureDateDefined
      : measureDateDefined?.toMillis())
    finalReminderDateDefined.setHours(hoursDefined);
    finalReminderDateDefined.setMinutes(minsDefined);
    if (DateTime.fromJSDate(finalReminderDate).toMillis() > DateTime.fromJSDate(new Date()).toMillis()) {
      if((DateTime.fromJSDate(finalReminderDateDefined).toMillis() > DateTime.fromJSDate(new Date()).toMillis()) 
      && (DateTime.fromJSDate(finalReminderDateDefined).toMillis() < DateTime.fromJSDate(finalReminderDate).toMillis())) {
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
          let createresult = await userRealmCommon.updateChildReminders<ChildEntity>(
            ChildEntitySchema,
            reminderValues,
            'uuid ="' + activeChild.uuid + '"',
          );
          if (createresult?.length > 0) {
            activeChild.reminders = createresult;
            const titlevcr = t('vcrNoti2', {reminderDateTime: formatStringDate(measureDate, luxonLocale) + "," + formatStringTime(measureTimeNew, luxonLocale)});
            const titlehcr = t('hcrNoti2', {reminderDateTime: formatStringDate(measureDate, luxonLocale) + "," + formatStringTime(measureTimeNew, luxonLocale)});
            const message = reminderType == 'vaccine' ? titlevcr : titlehcr;
            if(editReminderItem) {
              let previousDTDefined;
              const onlyDateDefined = new Date(editReminderItem.reminderDateDefined);
              previousDTDefined = onlyDateDefined.setHours(new Date(editReminderItem.reminderTimeDefined).getHours());
              previousDTDefined = new Date(onlyDateDefined.setMinutes(new Date(editReminderItem.reminderTimeDefined).getMinutes()));
              LocalNotifications.cancelReminderLocalNotification(DateTime.fromJSDate(new Date(previousDTDefined)).toMillis());
            }
            if(vchcEnabledFlag == true) {
              //needs to test noti click once 
             LocalNotifications.schduleNotification(finalReminderDateDefined,t('remindersAlertTitle'),message,DateTime.fromJSDate(new Date(finalReminderDateDefined)).toMillis(),reminderType == 'vaccine' ? 'vcr' : 'hcr',activeChild.uuid);
            }
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
      }else {
        setClicked(false);
        Alert.alert('', t('reminderalertTextDefined'));
      }
    } else {
      setClicked(false);
      Alert.alert('', t('reminderalertText')); 
    }
  };
const onBackPress = () => {
    navigation.goBack();  
    return true;
}
useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    onBackPress,
  );
  navigation.addListener('gestureEnd', onBackPress);
  return () => {
    navigation.removeListener('gestureEnd', onBackPress);
    backHandler.remove()};
}, []);
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
            <HeaderIconPress
              onPress={() => {
                navigation.goBack();
              }}>
              <IconML name={'ic_back'} color="#000" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2 numberOfLines={1}>{headerTitle}</Heading2>
          </HeaderTitleView>
          {editReminderItem ? (
               <HeaderActionView style={{padding:0}}>
               <Pressable  style={{paddingLeft:10,paddingRight:10}}  onPress={() =>
                   setModalVisible(true)
                 }>
                 <Icon name={'ic_trash'} size={20} color="#000" />
                   </Pressable>
             </HeaderActionView>
          ) : null}
        </HeaderRowView>

        <ScrollView style={{ padding: 15, flex: 7 }}>
          <ShiftFromBottom10>
          <Heading4Regular>{titleTxt}</Heading4Regular>
          </ShiftFromBottom10>
          <FormInputGroup onPress={showmeasureDatepicker}>
            {Platform.OS != 'ios' ? (
              <FormInputBox>
                <FormDateText>
                  <Text>
                    {measureDate
                      ?
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
                      formatStringDate(measureDate, luxonLocale)
                      : t('vcReminderDate')}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isMeasureDatePickerVisible}
                    mode="date"
                    onConfirm={handleMeasureDateConfirm}
                    date={editReminderItem ? new Date(measureDate) : new Date()}
                    onCancel={() => {
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
                        formatStringTime(measureTime, luxonLocale)
                        : t('vcReminderTime')}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isMeasureTimePickerVisible}
                      mode="time"
                      onConfirm={handleMeasureTimeConfirm}
                      date={editReminderItem ? new Date(measureTime) : new Date()}
                      onCancel={() => {
                        setMeasureTimePickerVisibility(false);
                      }}
                      minimumDate={minmeasureTime}
                    />

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
              )}
            </FormInputGroup>
          </ShiftFromTop20>
          
          <ShiftFromBottom20></ShiftFromBottom20>
          <ShiftFromBottom10>
          <Heading4Regular>{titleTxt2}</Heading4Regular>
          </ShiftFromBottom10>
          <FormInputGroup onPress={showmeasureDatepickerDefined}>
            {Platform.OS != 'ios' ? (
              <FormInputBox>
                <FormDateText>
                  <Text>
                    {measureDateDefined
                      ?
                      formatStringDate(measureDateDefined, luxonLocale)
                      : t('vcReminderDate')}
                  </Text>
                  {showmeasureDefined && (
                    <DateTimePicker
                      testID="measuredatePickerDefined"
                      value={
                        editReminderItem ? new Date(measureDateDefined) : new Date()
                      }
                      mode={'date'}
                      display="default"
                      minimumDate={new Date()}
                      maximumDate={new Date(measureDate)}
                      onChange={onmeasureChangeDefined}
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
                    {measureDateDefined
                      ?
                      formatStringDate(measureDateDefined, luxonLocale)
                      : t('vcReminderDate')}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isMeasureDatePickerVisibleDefined}
                    mode="date"
                    onConfirm={handleMeasureDateConfirmDefined}
                    date={editReminderItem ? new Date(measureDateDefined) : new Date()}
                    onCancel={() => {
                      setMeasureDatePickerVisibilityDefined(false);
                    }}
                    minimumDate={new Date()}
                    maximumDate={new Date(measureDate)}
                  />

                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            )}
          </FormInputGroup>
          <ShiftFromTop20>
            <FormInputGroup onPress={showmeasureTimepickerDefined}>
              {Platform.OS != 'ios' ? (
                <FormInputBox>
                  <FormDateText>
                    <Text>
                      {measureTimeDefined
                        ?
                        formatStringTime(measureTimeDefined, luxonLocale)
                        : t('vcReminderTime')}
                    </Text>
                    {showmeasureTimeDefined && (
                      <DateTimePicker
                        testID="measuretimePickerDefined"
                        value={
                          editReminderItem ? new Date(measureTimeDefined) : new Date()
                        }
                        mode={'time'}
                        display="default"
                        is24Hour={true}
                        minimumDate={new Date(DateTime.local().plus({ minutes: +1 }).toISODate())}
                        maximumDate={measureTime ? new Date(measureTime) : new Date(DateTime.local().plus({ minutes: +1 }).toISODate())}
                        onChange={onmeasureTimeChangeDefined}
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
                      {measureTimeDefined
                        ?
                        formatStringTime(measureTimeDefined, luxonLocale)
                        : t('vcReminderTime')}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isMeasureTimePickerVisibleDefined}
                      mode="time"
                      onConfirm={handleMeasureTimeConfirmDefined}
                      date={editReminderItem ? new Date(measureTimeDefined) : new Date()}
                      onCancel={() => {
                        setMeasureTimePickerVisibilityDefined(false);
                      }}
                      minimumDate={new Date(DateTime.local().plus({ minutes: +1 }).toISODate())}
                      maximumDate={measureTime ? new Date(measureTime) : new Date(DateTime.local().plus({ minutes: +1 }).toISODate())}
                    />

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
              )}
            </FormInputGroup>
          </ShiftFromTop20>

          <ShiftFromTop30>
            <ButtonTertiary
              disabled={isFormDisabled()}
              onPress={() => {
                setClicked(true);
                setTimeout(()=>{
                  saveReminder().then(() => {
                  });
                },0)
              }}>
              <ButtonText numberOfLines={2}>{buttonTitle}</ButtonText>
            </ButtonTertiary>
          </ShiftFromTop30>
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
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

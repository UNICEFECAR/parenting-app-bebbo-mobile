import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainerTwo,
  ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText
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
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { Modal, Pressable, SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};
//  reminder.periodId === doctorVisitPeriod.uuid
const AddReminder = ({route, navigation}: any) => {
  const {t} = useTranslation();
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
  const [measureDate, setmeasureDate] = useState<DateTime>( editReminderItem ? editReminderItem.reminderDate : null,);
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [measureTime, setmeasureTime] = useState<DateTime>(editReminderItem ? editReminderItem.reminderTime : null,);
  const [showmeasureTime, setmeasureShowTime] = useState<Boolean>(false);
  const [dateTouched, setDateTouched] = useState<Boolean>(false);
  const [timeTouched, setTimeTouched] = useState<Boolean>(false);
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
    setmeasureShow(false);
    if (selectedDate) {
    setmeasureDate(DateTime.fromJSDate(currentDate));
    setDateTouched(true);
    }
  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
  };

  const onmeasureTimeChange = (event: any, selectedTime: any) => {
    // console.log(selectedTime,"selectedTime");
    const currentTime = selectedTime || measureTime;
    // console.log(currentTime,"currentTime");
    setmeasureShowTime(false);
    if(selectedTime) {
    setmeasureTime(DateTime.fromJSDate(currentTime));
    setTimeTouched(true)
    }
    // console.log(reminderType, measureDate, measureTime);
  };
  const showmeasureTimepicker = () => {
    setmeasureShowTime(true);
  };
  const isFormDisabled = () => {
    if (measureDate && measureTime) {
      return false;
    } else{
      return true;
    }

  }
  const deleteReminder =  async () => {
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    console.log(allJsonDatanew?.length,"allJsonDatanew");
    let createresult = await userRealmCommon.deleteChildReminders<ChildEntity>(
      ChildEntitySchema,
      editReminderItem,
      'uuid ="' + activeChild.uuid + '"',
    );
    console.log(createresult?.length,"ReminderDeleted");
    if(createresult){
      activeChild.reminders=createresult;
      dispatch(setActiveChildData(activeChild));
      }
    // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
   
  }
  const saveReminder = async() => {
    console.log(reminderType, measureDate, measureTime);
    const reminderValues = {
      uuid: editReminderItem ? editReminderItem.uuid : uuidv4(),
      reminderType: reminderType,
      reminderDate: editReminderItem ? ((dateTouched) ? measureDate?.toMillis() : measureDate):measureDate?.toMillis(),
      reminderTime: editReminderItem ? ((timeTouched) ? measureTime?.toMillis() : measureTime):measureTime?.toMillis(),
    };
    let createresult = await userRealmCommon.updateChildReminders<ChildEntity>(
      ChildEntitySchema,
      reminderValues,
      'uuid ="' + activeChild.uuid + '"',
    );
    // console.log(createresult);
    if(createresult?.length>0){
      activeChild.reminders=createresult;
      dispatch(setActiveChildData(activeChild));
      }
    // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
    
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
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
            <Heading2>{headerTitle}</Heading2>
          </HeaderTitleView>
         {editReminderItem ? <HeaderActionView>
            <Pressable
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text>{t('growthScreendeletebtnText')}</Text>
            </Pressable>
          </HeaderActionView> : null}
        </HeaderRowView>

        <ScrollView style={{padding: 15, flex: 7}}>
          <Paragraph>{titleTxt}</Paragraph>
          <FormInputGroup onPress={showmeasureDatepicker}>
            <FormInputBox>
              <FormDateText>
                <Text>
                  {measureDate
                    ? DateTime.fromJSDate(new Date(measureDate)).toFormat(
                      'dd/MM/yyyy',
                    )
                    : t('vcReminderDate')}
                </Text>
              </FormDateText>
              <FormDateAction>
                <Icon name="ic_calendar" size={20} color="#000" />
              </FormDateAction>
            </FormInputBox>
          </FormInputGroup>
          <ShiftFromTop20>
            <FormInputGroup onPress={showmeasureTimepicker}>
              <FormInputBox>
                <FormDateText>
                  <Text>{measureTime ? DateTime.fromJSDate(new Date(measureTime)).toFormat(
                      'hh:mm') : t('vcReminderTime')}</Text>
                </FormDateText>
                <FormDateAction>
                  <Icon
                    name="ic_time"
                    size={20}
                    color="#000"
                    style={{borderWidth: 1, borderRadius: 50}}
                  />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
          </ShiftFromTop20>
          <View>
            {showmeasure && (
              <DateTimePicker
                testID="measuredatePicker"
                value={editReminderItem ? new Date(measureDate) : new Date()}
                mode={'date'}
                display="default"
                minimumDate={new Date()}
                // maximumDate => childDOB +72 weeks
                onChange={onmeasureChange}
              />
            )}
          </View>

          <View>
            {showmeasureTime && (
              <DateTimePicker
                testID="measuretimePicker"
                value={editReminderItem ? new Date(measureTime) : new Date()}
                mode={'time'}
                display="default"
                is24Hour={true}
                minimumDate={new Date()}
                onChange={onmeasureTimeChange}
              />
            )}
          </View>

          <ShiftFromTop30>
            <ButtonTertiary
              disabled={isFormDisabled()}
              onPress={() => {
                saveReminder().then(()=>{ navigation.goBack();});
                // navigation.goBack();
              }}>
              <ButtonText>{buttonTitle}</ButtonText>
            </ButtonTertiary>
          </ShiftFromTop30>
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
            onDismiss={() => {
              setModalVisible(!modalVisible);
            }}>
            <PopupOverlay>
              <ModalPopupContainer>
                <PopupCloseContainer>
                  <PopupClose
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Icon name="ic_close" size={16} color="#000" />
                  </PopupClose>
                </PopupCloseContainer>
                <ShiftFromTopBottom10>
                  <Heading3Center>{warningTxt}</Heading3Center>
                </ShiftFromTopBottom10>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint onPress={()=> setModalVisible(!modalVisible)}>
                      <ButtonText>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonSecondary onPress={()=> {setModalVisible(!modalVisible);deleteReminder().then(()=>{ navigation.goBack();});}}>
                      <ButtonText>{t('growthDeleteOption2')}</ButtonText>
                    </ButtonSecondary>
                  </ButtonColTwo>
                </ButtonContainerTwo>
              </ModalPopupContainer>
            </PopupOverlay>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddReminder;

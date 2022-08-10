import Icon from '@components/shared/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { Heading4Centerr, ShiftFromTop15 } from '@styles/typography';
import { dobMin, maxDue, minDue } from '@types/types';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../App';
import { formatStringDate } from '../services/Utils';
import Checkbox, {
  CheckboxActive,
  CheckboxItem,
  FormOuterCheckbox
} from './shared/CheckboxStyle';
import {
  FormDateAction,
  FormDateContainer,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText
} from './shared/ChildSetupStyle';
import FormPrematureContainer, {
  FormInfoLabel,FormInfoPress
} from './shared/FormPrematureContainer';
import { FlexFDirRowSpace } from './shared/FlexBoxStyle';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from './shared/ModalPopupStyle';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { greyCode } from '@styles/style';
const styles = StyleSheet.create({
  disabledCheckBox: {
    backgroundColor: greyCode,
    opacity: 0.5,
  },
  formDateText:{flex:1,flexDirection:"row"}
});
const ChildDate = (props: any) => {
  const {dobMax,prevScreen} = props;
  let birthDate: any,
    isPremature: any,
    plannedTermDate: any = null;
  const {childData} = props;
  const [isDobDatePickerVisible, setDobDatePickerVisibility] = useState(false);
  const [isDueDatePickerVisible, setDueDatePickerVisibility] = useState(false);
  const [dueDate, setdueDate] = useState<Date | null>(null);
  const [showdue, setdueShow] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
 
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  const {t} = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isExpected, setIsExpected] = useState(false);
  const [doborExpectedDate, setdoborExpectedDate] = useState<Date | null>(null);
  const [showdob, setdobShow] = useState<boolean>(false);
  const [disablePrematureCheck, setdisablePrematureCheck] =useState<boolean>(false);
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  useFocusEffect(
    React.useCallback(() => {
     
     if (birthDate == '' || birthDate == null || birthDate == undefined) {
        setdisablePrematureCheck(true);
      }
      if (childData != null) {
        birthDate = childData.birthDate;
        isPremature = childData.isPremature;
        plannedTermDate = childData.plannedTermDate;
        const inFuture = isFutureDate(birthDate);
        setdisablePrematureCheck(inFuture);
        if (inFuture) {
          setIsExpected(true);
        } else {
          setIsExpected(false);
        }
        setToggleCheckBox(
          isPremature != null ? JSON.parse(isPremature) : false,
        );
       setdoborExpectedDate(
          birthDate != null ? new Date(birthDate) : new Date(),
        );
        setdueDate(plannedTermDate != null ? new Date(plannedTermDate) : null);
      }
    }, []),
  );
  
  const ondueDateChange = (event:any,selectedDate: any) => {
    const currentDate = selectedDate;
    setdueShow(Platform.OS === 'ios');
    setdueDate(currentDate);
    props.sendData({
      birthDate: doborExpectedDate,
      plannedTermDate: currentDate,
      isPremature: toggleCheckBox,
      isExpected: isExpected,
    });
  };
  const ondobChange = (event:any,selectedDate: any) => {
    if(new Date(selectedDate) < new Date(dobMin)){
      selectedDate = new Date(dobMin);
    }
    const currentDate = selectedDate || doborExpectedDate;
    setdobShow(Platform.OS === 'ios');
    const inFuture = isFutureDate(currentDate);
    setdisablePrematureCheck(inFuture);
    setdoborExpectedDate(currentDate);
    setdueDate(null);
    if (inFuture) {
      setIsExpected(true);
      setToggleCheckBox(false);
      props.sendData({
        birthDate: currentDate,
        plannedTermDate: null,
        isPremature: toggleCheckBox,
        isExpected: true,
      });
    } else {
      setIsExpected(false);
      props.sendData({
        birthDate: currentDate,
        plannedTermDate: null,
        isPremature: toggleCheckBox,
        isExpected: false,
      });
    }
  };
  const handleDobConfirm = (event:any) => {
    const date=event;
    ondobChange(event,date);
    setDobDatePickerVisibility(false);
  };
  const handleDueConfirm = (event:any) => {
    const date=event;
    ondueDateChange(event,date);
    setDueDatePickerVisibility(false);
  };
 
  const showdobDatepicker = () => {
    setdobShow(true);
    if(Platform.OS == 'ios'){
    setDobDatePickerVisibility(true);
    }
  };
 
  const showdueDatepicker = () => {
    setdueShow(true);
    if(Platform.OS == 'ios'){
      setDueDatePickerVisibility(true);
    }
  };
  return (
    <>
      <FormDateContainer>
        {Platform.OS != 'ios' ? (
          <FormInputGroup onPress={showdobDatepicker}>
            <LabelText>{prevScreen=='EditScreen'? t('editChildDobLabel'):t('childSetupdobLabel')}</LabelText>
            <FormInputBox>
            <FlexFDirRowSpace>
                <Text>
                  {doborExpectedDate
                    ? formatStringDate(doborExpectedDate,luxonLocale)
                    : prevScreen=='EditScreen'?  t('childSetupdobText'):t('childSetupdobSelector')}
                </Text>
                {showdob && (
                  <DateTimePicker
                    testID="dobdatePicker"
                    dateFormat={'day month year'}
                    minimumDate={new Date(dobMin)}
                    maximumDate={new Date(dobMax)}
                    value={
                      doborExpectedDate != null ? doborExpectedDate : new Date()
                    }
                    mode={'date'}
                    display="default"
                    onChange={ondobChange}
                  />
                )}
              </FlexFDirRowSpace>
              <FormDateAction>
                <Icon name="ic_calendar" size={20} color="#000" />
              </FormDateAction>
            </FormInputBox>
          </FormInputGroup>
        ) : (
          <FormInputGroup onPress={showdobDatepicker}>
          <LabelText>{prevScreen=='EditScreen'? t('editChildDobLabel'):t('childSetupdobLabel')}</LabelText>
          <FormInputBox>
          <FlexFDirRowSpace>
              <Text>
                {doborExpectedDate
                  ? formatStringDate(doborExpectedDate,luxonLocale)
                 : prevScreen=='EditScreen'?t('childSetupdobText'):t('childSetupdobSelector')}
              </Text>
              {showdob && (
                <DateTimePickerModal
                isVisible={isDobDatePickerVisible}
                mode="date"
                date={
                    doborExpectedDate != null ? doborExpectedDate : new Date()
                }
                onConfirm={handleDobConfirm}
                onCancel={() => {
                   setDobDatePickerVisibility(false);
                }}
                minimumDate={new Date(dobMin)}
                maximumDate={new Date(dobMax)}
                />
              )}
            </FlexFDirRowSpace>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>
       )}

        <FormPrematureContainer>
          <FormOuterCheckbox
            onPress={() => {
             if (!disablePrematureCheck) {
                props.sendData({
                  birthDate: doborExpectedDate,
                  plannedTermDate: null,
                  isPremature: !toggleCheckBox,
                  isExpected: isExpected,
                });
                setToggleCheckBox(!toggleCheckBox);
                setdueDate(null);
              }
            }}>
            <CheckboxItem>
              <View>
                {toggleCheckBox ? (
                  <CheckboxActive
                    style={
                      disablePrematureCheck ? styles.disabledCheckBox : null
                    }>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelText>{t('childSetupprematureLabel')}</LabelText>
          </FormOuterCheckbox>

          <FormInfoLabel>
            <FormInfoPress onPress={() => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#FFF" />
            </FormInfoPress>
          </FormInfoLabel>
        </FormPrematureContainer>

        {toggleCheckBox && !disablePrematureCheck ? (
          <>
            <ShiftFromTop15>
              {Platform.OS != 'ios' ? (
                <FormInputGroup onPress={showdueDatepicker}>
                  <LabelText>{t('childSetupdueLabel')}</LabelText>
                  <FormInputBox>
                    <FormDateText  style={styles.formDateText}>
                      <Text>
                        {' '}
                        {dueDate
                          ? formatStringDate(dueDate,luxonLocale)
                          : t('childSetupdueSelector')}
                      </Text>
                      {showdue && (
                        <DateTimePicker
                          testID="duedatePicker"
                          value={dueDate != null ? dueDate : new Date()}
                          mode={'date'}
                          display="default"
                          minimumDate={
                            new Date(
                              DateTime.fromJSDate(doborExpectedDate as Date)
                                .plus({weeks: minDue})
                                .toISODate(),
                            )
                          }
                          maximumDate={
                            new Date(
                              DateTime.fromJSDate(doborExpectedDate as Date)
                                .plus({months: maxDue})
                                .toISODate(),
                            )
                          }
                          // minimumDate={{}}
                          // maximumDate={{}}
                          onChange={ondueDateChange}
                        />
                      )}
                    </FormDateText>
                    <FormDateAction>
                      <Icon name="ic_calendar" size={20} color="#000" />
                    </FormDateAction>
                  </FormInputBox>
                </FormInputGroup>
              ) : (
                <FormInputGroup onPress={showdueDatepicker}>
                <LabelText>{t('childSetupdueLabel')}</LabelText>
                <FormInputBox>
                  <FormDateText style={styles.formDateText}>
                    <Text>
                      {' '}
                      {dueDate
                        ? formatStringDate(dueDate,luxonLocale)
                        : t('childSetupdueSelector')}
                    </Text>
                    {showdue && (
                     <DateTimePickerModal
                      isVisible={isDueDatePickerVisible}
                      mode="date"
                      date={dueDate != null ? dueDate : new Date(
                        DateTime.fromJSDate(doborExpectedDate as Date)
                          .plus({weeks: minDue})
                          .toISODate(),
                      )}
                      onConfirm={handleDueConfirm}
                      onCancel={() => {
                        setDueDatePickerVisibility(false);
                      }}
                      minimumDate={
                        new Date(
                          DateTime.fromJSDate(doborExpectedDate as Date)
                            .plus({weeks: minDue})
                            .toISODate(),
                        )
                      }
                      maximumDate={
                        new Date(
                          DateTime.fromJSDate(doborExpectedDate as Date)
                            .plus({months: maxDue})
                            .toISODate(),
                        )
                      }
                    />
                    )}
                  </FormDateText>
                  <FormDateAction>
                    <Icon name="ic_calendar" size={20} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              </FormInputGroup>
     
              )}
            </ShiftFromTop15>
          </>
        ) : null}
      </FormDateContainer>
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
            <ModalPopupContent>
              <Heading4Centerr>
                {t('childSetupprematureMessage')}
              </Heading4Centerr>
            </ModalPopupContent>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};
export default ChildDate;

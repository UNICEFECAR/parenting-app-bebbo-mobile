import Icon from '@components/shared/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { Heading4Centerr, ShiftFromTop15 } from '@styles/typography';
import { dobMin, maxDue, minDue } from '@types/types';
import { DateTime, Settings } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
  FormInfoLabel
} from './shared/FormPrematureContainer';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from './shared/ModalPopupStyle';

const ChildDate = (props: any) => {
  const {dobMax,prevScreen} = props;
  const [dateFormat, setDateFormat] = useState('day month year');
  let birthDate: any,
    isPremature: any,
    plannedTermDate: any = null;
  const {childData} = props;
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };

  //console.log(birthDate,"..birthDate..");
  const {t} = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isExpected, setIsExpected] = useState(false);
  const [doborExpectedDate, setdoborExpectedDate] = useState<Date | null>(null);
  const [showdob, setdobShow] = useState<Boolean>(false);
  const [disablePrematureCheck, setdisablePrematureCheck] =useState<Boolean>(false);
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  useFocusEffect(
    React.useCallback(() => {
     
     if (birthDate == '' || birthDate == null || birthDate == undefined) {
        setdisablePrematureCheck(true);
      }
      console.log(childData, '..childData..');
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
        // console.log(disablePrematureCheck,"..disablePrematureCheck..");
      }
    }, []),
  );
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || doborExpectedDate;
    setdobShow(Platform.OS === 'ios');
    const inFuture = isFutureDate(currentDate);
    setdisablePrematureCheck(inFuture);
    setdoborExpectedDate(currentDate);
    if (inFuture) {
      setIsExpected(true);
      setToggleCheckBox(false);
      props.sendData({
        birthDate: currentDate,
        plannedTermDate: dueDate,
        isPremature: false,
        isExpected: true,
      });
    } else {
      setIsExpected(false);
      props.sendData({
        birthDate: currentDate,
        plannedTermDate: dueDate,
        isPremature: false,
        isExpected: false,
      });
    }
  };
  const showdobDatepicker = () => {
    //console.log(birthDate,"..birthDate..");
    setdobShow(true);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDate, setdueDate] = useState<Date | null>(null);
  const [showdue, setdueShow] = useState<Boolean>(false);
  const ondueDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    //console.log(currentDate,"..currentDate..")
    setdueShow(Platform.OS === 'ios');
    setdueDate(currentDate);
    props.sendData({
      birthDate: doborExpectedDate,
      plannedTermDate: currentDate,
      isPremature: toggleCheckBox,
      isExpected: isExpected,
    });
  };
  const showdueDatepicker = () => {
    setdueShow(true);
  };
  
  return (
    <>
      <FormDateContainer>
        {Platform.OS != 'ios' ? (
          <FormInputGroup onPress={showdobDatepicker}>
            <LabelText>{prevScreen=='EditScreen'? t('editChildDobLabel'):t('childSetupdobLabel')}</LabelText>
            <FormInputBox>
              <FormDateText style={{flexDirection: 'row'}}>
                <Text>
                  {doborExpectedDate
                    ? formatStringDate(doborExpectedDate,luxonLocale)
                    : t('childSetupdobSelector')}
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
              </FormDateText>
              <FormDateAction>
                <Icon name="ic_calendar" size={20} color="#000" />
              </FormDateAction>
            </FormInputBox>
          </FormInputGroup>
        ) : (
          <FormInputGroup onPress={showdobDatepicker}>
            <LabelText> {t('childSetupdobLabel')}</LabelText>
            <FormInputBox>
              {/* <FormDateText style={{flexDirection: 'row'}}></FormDateText> */}
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
                style={{backgroundColor: 'white', flex: 1}}
              />
              <FormDateAction>
                <Icon name="ic_calendar" size={20} color="#000" />
              </FormDateAction>
            </FormInputBox>
          </FormInputGroup>
        )}

        <FormPrematureContainer>
          <FormOuterCheckbox
            // disabled={disablePrematureCheck}
            onPress={() => {
              //console.log(disablePrematureCheck,"..click disablePrematureCheck...")
              // if(!disablePrematureCheck){

              // }
              // else{
              //   console.log(dueDate,"..dueDate..");
              //   // props.sendData({ birthDate: doborExpectedDate, dueDate: dueDate, isPremature: toggleCheckBox });

              // }
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
            <Pressable onPress={() => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#FFF" />
            </Pressable>
          </FormInfoLabel>
        </FormPrematureContainer>

        {toggleCheckBox && !disablePrematureCheck ? (
          <>
            <ShiftFromTop15>
              {Platform.OS != 'ios' ? (
                <FormInputGroup onPress={showdueDatepicker}>
                  <LabelText>{t('childSetupdueLabel')}</LabelText>
                  <FormInputBox>
                    <FormDateText>
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
                      onChange={ondueDateChange}
                      style={{backgroundColor: 'white', flex: 1}}
                    />
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
const styles = StyleSheet.create({
  disabledCheckBox: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
});

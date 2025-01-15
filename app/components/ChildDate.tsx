import Icon from '@components/shared/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { Heading4Centerr, ShiftFromTop10, ShiftFromTop15 } from '@styles/typography';
import { dobMin, maxDue, minDue } from '@types/types';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatStringDate, getLanguageCode } from '../services/Utils';
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
  LabelChildText,
  LabelDatePlaceHolderText,
  LabelText,
  LabelText1,
  LabelTextTerms
} from './shared/ChildSetupStyle';
import FormPrematureContainer, {
  FormDobInfoPress,
  FormInfoLabel, FormInfoPress
} from './shared/FormPrematureContainer';
import { FlexFDirRowSpace, FlexRow } from './shared/FlexBoxStyle';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from './shared/ModalPopupStyle';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { greyCode } from '@styles/style';
import { useAppSelector } from '../../App';
const styles = StyleSheet.create({
  disabledCheckBox: {
    backgroundColor: greyCode,
    opacity: 0.5,
  },
  flexRow: { flexDirection: "row" },
  formDateText: { flex: 1, flexDirection: "row" }
});
const ChildDate = (props: any): any => {
  const { dobMax, prevScreen } = props;
  let birthDate: any,
    isPremature: any,
    plannedTermDate: any = null;
  const { childData } = props;
  const [isDobDatePickerVisible, setDobDatePickerVisibility] = useState(false);
  const [isDueDatePickerVisible, setDueDatePickerVisibility] = useState(false);
  const [dueDate, setdueDate] = useState<Date | null>(null);
  const [showdue, setdueShow] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const locale = useAppSelector((state: any) => getLanguageCode(state.selectedCountry?.languageCode));
  const isFutureDate = (date: Date): any => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  const { t } = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isExpected, setIsExpected] = useState(false);
  const [doborExpectedDate, setdoborExpectedDate] = useState<Date | null>(null);
  const [showdob, setdobShow] = useState<boolean>(false);
  const [disablePrematureCheck, setdisablePrematureCheck] = useState<boolean>(false);
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

  const ondueDateChange = (event: any, selectedDate: any): any => {
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
  const ondobChange = (event: any, selectedDate: any): any => {
    if (new Date(selectedDate) < new Date(dobMin)) {
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
  const handleDobConfirm = (event: any): any => {
    const date = event;
    ondobChange(event, date);
    setDobDatePickerVisibility(false);
  };
  const handleDueConfirm = (event: any): any => {
    const date = event;
    ondueDateChange(event, date);
    setDueDatePickerVisibility(false);
  };

  const showdobDatepicker = (): any => {
    setdobShow(true);
    if (Platform.OS == 'ios') {
      setDobDatePickerVisibility(true);
    }
  };

  const showdueDatepicker = (): any => {
    setdueShow(true);
    if (Platform.OS == 'ios') {
      setDueDatePickerVisibility(true);
    }
  };
  return (
    <>
      <FormDateContainer>
        {Platform.OS != 'ios' ? (
          <FormInputGroup>
            <FormPrematureContainer>
              <LabelText>{prevScreen == 'EditScreen' ? t('addAnotherChildSetupDobLabel') : t('childSetupdobLabel')}</LabelText>
              <FormInfoLabel><FormInfoPress onPress={(): any => setDobModalVisible(true)}>
                <Icon name="ic_info" size={15} color="#070707" onPress={(): any => setDobModalVisible(true)} />
              </FormInfoPress></FormInfoLabel>
            </FormPrematureContainer>
            <Pressable onPress={showdobDatepicker}>
              <FormInputBox>
                <FlexFDirRowSpace>
                  {doborExpectedDate ?
                    <LabelTextTerms>
                      {formatStringDate(doborExpectedDate)}
                    </LabelTextTerms> :
                    ''}
                  {showdob && (
                    <DateTimePicker
                      testID="dobdatePicker"
                      dateFormat={'day month year'}
                      minimumDate={new Date(dobMin)}
                      maximumDate={new Date(dobMax)}
                      value={
                        doborExpectedDate != null ? doborExpectedDate : new Date()
                      }
                      locale={locale}
                      mode={'date'}
                      display="spinner"
                      onChange={ondobChange}
                    />
                  )}
                </FlexFDirRowSpace>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </Pressable>
          </FormInputGroup>
        ) : (
          <FormInputGroup>
            <FormPrematureContainer>
              <LabelText>{prevScreen == 'EditScreen' ? t('addAnotherChildSetupDobLabel') : t('childSetupdobLabel')}</LabelText>
              <FormInfoLabel><FormInfoPress onPress={(): any => setDobModalVisible(true)}>
                <Icon name="ic_info" size={15} color="#070707" onPress={(): any => setDobModalVisible(true)} />
              </FormInfoPress></FormInfoLabel>
            </FormPrematureContainer>
            <Pressable onPress={showdobDatepicker}>
              <View style={{ marginTop: -10 }}>
                <FormInputBox>
                  <FlexFDirRowSpace>
                    {doborExpectedDate ?
                      <LabelTextTerms>
                        {formatStringDate(doborExpectedDate)}
                      </LabelTextTerms> :
                      ''}
                    {showdob && (
                      <DateTimePickerModal
                        isVisible={isDobDatePickerVisible}
                        mode="date"
                        date={doborExpectedDate != null ? doborExpectedDate : new Date()}
                        onConfirm={handleDobConfirm}
                        onCancel={(): any => {
                          setDobDatePickerVisibility(false);
                        }}
                        locale={locale}
                        minimumDate={new Date(dobMin)}
                        maximumDate={new Date(dobMax)} />
                    )}
                  </FlexFDirRowSpace>
                  <FormDateAction>
                    <Icon name="ic_calendar" size={20} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              </View>

            </Pressable>
          </FormInputGroup>
        )}

        <FormPrematureContainer>
          <Pressable
            style={{ flexDirection: 'row' }}
            onPress={(): any => {
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
                    <Icon name="ic_tick" size={12} color="#fff" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelChildText>{t('childSetupprematureLabel')}</LabelChildText>
          </Pressable>
          <FormInfoLabel>
            <FormInfoPress onPress={(): any => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#070707" />
            </FormInfoPress>
          </FormInfoLabel>
        </FormPrematureContainer>


        {toggleCheckBox && !disablePrematureCheck ? (
          <>
            <ShiftFromTop15>
              {Platform.OS != 'ios' ? (
                <FormInputGroup onPress={showdueDatepicker}>
                  <LabelText>{t('childSetupdueLabel')}</LabelText>
                  <ShiftFromTop10>
                    <FormInputBox>
                      <FormDateText style={styles.formDateText}>
                        {dueDate ?
                          <LabelTextTerms>
                            {formatStringDate(dueDate)}
                          </LabelTextTerms> :
                          ''}
                        {showdue && (
                          <DateTimePicker
                            testID="duedatePicker"
                            value={dueDate != null ? dueDate : new Date()}
                            mode={'date'}
                            display="spinner"
                            minimumDate={
                              new Date(
                                DateTime.fromJSDate(doborExpectedDate as Date)
                                  .plus({ weeks: minDue })
                                  .toISODate(),
                              )
                            }
                            maximumDate={
                              new Date(
                                DateTime.fromJSDate(doborExpectedDate as Date)
                                  .plus({ months: maxDue })
                                  .toISODate(),
                              )
                            }
                            locale={locale}
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
                  </ShiftFromTop10>

                </FormInputGroup>
              ) : (
                <FormInputGroup onPress={showdueDatepicker}>
                  <LabelText>{t('childSetupdueLabel')}</LabelText>
                  <FormInputBox>
                    <FormDateText style={styles.formDateText}>
                      {dueDate ?
                        <LabelTextTerms>
                          {formatStringDate(dueDate)}
                        </LabelTextTerms> :
                        ''}
                      {showdue && (
                        <DateTimePickerModal
                          isVisible={isDueDatePickerVisible}
                          mode="date"
                          date={dueDate != null ? dueDate : new Date(
                            DateTime.fromJSDate(doborExpectedDate as Date)
                              .plus({ weeks: minDue })
                              .toISODate(),
                          )}
                          onConfirm={handleDueConfirm}
                          onCancel={(): any => {
                            setDueDatePickerVisibility(false);
                          }}
                          minimumDate={
                            new Date(
                              DateTime.fromJSDate(doborExpectedDate as Date)
                                .plus({ weeks: minDue })
                                .toISODate(),
                            )
                          }
                          locale={locale}
                          maximumDate={
                            new Date(
                              DateTime.fromJSDate(doborExpectedDate as Date)
                                .plus({ months: maxDue })
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
        onRequestClose={(): any => {
          setModalVisible(false);
        }}
        onDismiss={(): any => {
          setModalVisible(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={(): any => {
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
      <Modal
        animationType="none"
        transparent={true}
        visible={dobModalVisible}
        onRequestClose={(): any => {
          setDobModalVisible(false);
        }}
        onDismiss={(): any => {
          setDobModalVisible(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={(): any => {
                  setDobModalVisible(false);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('upto6YearsMsg')}
              </Heading4Centerr>
            </ModalPopupContent>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};
export default ChildDate;

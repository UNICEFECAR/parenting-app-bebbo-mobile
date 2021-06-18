import Icon from '@components/shared/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Heading4Centerr, ShiftFromBottom30 } from '@styles/typography';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from './shared/ModalPopupStyle';

const ChildDate = () => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [dobDate, setdobDate] = useState<Date>();
  const [showdob, setdobShow] = useState<Boolean>(false);

  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdobShow(Platform.OS === 'ios');
    setdobDate(currentDate);
  };

  const showdobDatepicker = () => {
    setdobShow(true);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDate, setdueDate] = useState<Date>();
  const [showdue, setdueShow] = useState<Boolean>(false);
  const ondueDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdueShow(Platform.OS === 'ios');
    setdueDate(currentDate);
  };
  const [checkbox, setCheckbox] = useState<Boolean>(false);
  // const isActive = item === currentItem ? true : false;
  const showdueDatepicker = () => {
    setdueShow(true);
  };
  return (
    <>
      <FormDateContainer>
        <FormInputGroup onPress={showdobDatepicker}>
          <LabelText>Child Date of Birth / Expected due date</LabelText>
          <FormInputBox>
            <FormDateText>
              <Text> {dobDate ? dobDate.toDateString() : null}</Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>

        <FormPrematureContainer>
          <FormOuterCheckbox
            onPress={() => {
              //  console.log(item);
              setToggleCheckBox(!toggleCheckBox);
            }}>
            <CheckboxItem>
              <View>
                {toggleCheckBox ? (
                  <CheckboxActive>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelText>Baby Born Prematurely</LabelText>
          </FormOuterCheckbox>

          <FormInfoLabel>
            <Pressable onPress={() => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#FFF" />
            </Pressable>
          </FormInfoLabel>
        </FormPrematureContainer>

        <View>
          {showdob && (
            <DateTimePicker
              testID="dobdatePicker"
              value={new Date()}
              mode={'date'}
              display="default"
              onChange={ondobChange}
            />
          )}
        </View>

        {toggleCheckBox ? (
          <>
            <ShiftFromBottom30>
              <FormInputGroup onPress={showdueDatepicker}>
                <LabelText>Original due date</LabelText>
                <FormInputBox>
                  <FormDateText>
                    <Text> {dueDate ? dueDate.toDateString() : null}</Text>
                  </FormDateText>
                  <FormDateAction>
                    <Icon name="ic_calendar" size={20} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              </FormInputGroup>
            </ShiftFromBottom30>
            <View>
              {showdue && (
                <DateTimePicker
                  testID="duedatePicker"
                  value={new Date()}
                  mode={'date'}
                  display="default"
                  // minimumDate={{}}
                  // maximumDate={{}}
                  onChange={ondueDateChange}
                />
              )}
            </View>
          </>
        ) : null}
      </FormDateContainer>
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
            <Heading4Centerr>
              A baby born before 37 weeks of Pregnanacy is considered premature
              or born too early
            </Heading4Centerr>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};
export default ChildDate;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // paddingTop: headerHeight,
    padding: 20,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 30,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

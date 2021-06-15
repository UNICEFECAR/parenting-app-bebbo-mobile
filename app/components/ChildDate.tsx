import React, { useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Platform,
  Pressable,
  Text,
  Alert,
  Modal,
} from 'react-native';
import Icon from '@components/shared/Icon';
import styled from 'styled-components/native';
import CheckBox from '@react-native-community/checkbox';

import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FormDateContainer, FormDateAction,FormDateText, LabelText,FormInputBox, FormInputGroup } from './shared/ChildSetupStyle';
import FormPrematureContainer, { FormOuterCheckbox,FormCheckboxLabel } from './shared/FormPrematureContainer';
import { ShiftFromBottom30 } from '../styles/typography';

const ChildDate = () => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [dobDate, setdobDate] = useState();
  const [showdob, setdobShow] = useState(false);
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdobShow(Platform.OS === 'ios');
    setdobDate(currentDate);
  };

  const showdobDatepicker = () => {
    setdobShow(true);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDate, setdueDate] = useState();
  const [showdue, setdueShow] = useState(false);
  const ondueDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdueShow(Platform.OS === 'ios');
    setdueDate(currentDate);
  };

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
          <FormOuterCheckbox>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              tintColors={
                { true: '#FFF', false: '#FFF' }
              }
              boxType={'square'}
              tintColor={'#FFF'}
              onCheckColor={'#000'}
              onFillColor={'#FFF'}
              onTintColor={'#000'}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
          </FormOuterCheckbox>
          <FormCheckboxLabel>
          <LabelText>Baby Born Prematurely</LabelText>
          <Pressable onPress={() => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#FFF" />
            </Pressable>
          </FormCheckboxLabel>
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
        </>) : null}
       
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
        <Pressable onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity onPress={() => console.log('do nothing')}
            activeOpacity={1}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text>close</Text>
            </Pressable>
            <Text>A baby born before 37 weeks of Pregnanacy is considered premature or born too early</Text>

          </TouchableOpacity>
        </Pressable>
      </Modal>
    </>
  );
};
export default ChildDate;



// const styles = StyleSheet.create({
//   title: {
  
    
//     // paddingVertical: 8,
//     // paddingHorizontal:8,
//     // borderWidth: 4,
//     // borderColor: '#20232a',
//     // borderRadius: 6,
//     alignItems: 'center',
//     // backgroundColor: '#FFF',
//     color: '#20232a',
//     textAlign: 'center',
//     fontSize: 14,
//     // fontWeight: 'bold',
//   },

  
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)'
//     // paddingTop: headerHeight,
//   },
//   modalView: {
//     // margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 30,
//     alignItems: 'center'
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//     alignItems: 'flex-end'
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
// });


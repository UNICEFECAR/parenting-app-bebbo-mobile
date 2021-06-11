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
import { Header3Text } from '../styles/style';
import CheckBox from '@react-native-community/checkbox';

import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LabelText } from './shared/ChildSetupStyle';

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
      <View style={{width:'100%', marginTop:10 }}>
        <LabelText>Child Date of Birth / Expected due date</LabelText>

        <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', marginBottom:10,}}>
          <View style={{ flex: 4,}}>
            <Text style={styles.title}> {dobDate ? dobDate.toDateString() : null}</Text>
          </View>
          <View style={{ flex: 1,justifyContent:'center',flexDirection:'row', }}>
            <Pressable style={styles.title} onPress={showdobDatepicker}>
              <Icon name="ic_calendar" size={20} color="#000" />
            </Pressable>
          </View>
        </View>
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

        <View style={{  flexDirection: 'row', minHeight: 50 }}>
          <View style={{ flex: 1, alignItems: 'flex-start' }} >
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
          </View>
          <View style={{ flex: 6,alignContent:'center',justifyContent:'flex-start', alignItems: 'center', flexDirection: 'row',height:40, }} >
            <LabelText>Baby Born Prematurely</LabelText>
            <Pressable style={[styles.title,{marginLeft:10,marginTop:8}]} onPress={() => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#FFF" />
            </Pressable>
          </View>
        </View>
        <LabelText>Original due date</LabelText>

        <View style={{ flexDirection: 'row', backgroundColor: '#ffffff' }}>
          <View style={{ flex: 4, }}>
            <Text style={styles.title}> {dueDate ? dueDate.toDateString() : null}</Text>
          </View>
          <View style={{ flex: 1,justifyContent:'center',flexDirection:'row', }}>
            <Pressable style={styles.title} onPress={showdueDatepicker}>
              <Icon name="ic_calendar" size={20} color="#000" />
            </Pressable>
          </View>
        </View>
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
      </View>

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
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity
            style={styles.modalView}
            onPress={() => console.log('do nothing')}
            activeOpacity={1}>
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
            <Text style={styles.modalText}>A baby born before 37 weeks of Pregnanacy is considered premature or born too early</Text>

          </TouchableOpacity>
        </Pressable>
      </Modal>
    </>
  );
};
export default ChildDate;
const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 16,
    
    // paddingVertical: 8,
    // paddingHorizontal:8,
    // borderWidth: 4,
    // borderColor: '#20232a',
    // borderRadius: 6,
    alignItems: 'center',
    // backgroundColor: '#FFF',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 14,
    // fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
    // paddingTop: headerHeight,
  },
  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: 'flex-end'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});


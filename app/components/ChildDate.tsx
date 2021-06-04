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
import { Header3Text } from '../styles/style';
import CheckBox from '@react-native-community/checkbox';

import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
      <View>
        <Header3Text>Child Date of Birth / Expected due date</Header3Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, backgroundColor: 'gray' }}>
            <Header3Text> {dobDate ? dobDate.toDateString() : null}</Header3Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'green' }}>
            <Pressable style={styles.title} onPress={showdobDatepicker}>
              <Header3Text>Select DOBDate</Header3Text>
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

        <View style={{ flex: 1, flexDirection: 'row',minHeight:50 }}>
          <View style={{ flex: 1, backgroundColor: "red",alignItems:'flex-end' }} >
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
          </View>
          <View style={{ flex: 5, backgroundColor: "darkorange" ,alignItems:'flex-start'}} >
            <Header3Text>Baby Born Prematurely</Header3Text>
          </View>
          <View style={{ flex: 1, backgroundColor: "green" ,alignItems:'flex-start'}} >
            <Pressable onPress={() => setModalVisible(true)}><Text>Info</Text></Pressable>
          </View>
        </View>



        {/* <CheckBox label="Baby Born Prematurely" checkedValue={false} /> */}
        <Header3Text>Original due date</Header3Text>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3, backgroundColor: 'gray' }}>
            <Header3Text> {dueDate ? dueDate.toDateString() : null}</Header3Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'darkorange' }}>
            <Pressable style={styles.title} onPress={showdueDatepicker}>
              <Header3Text>{'Select Due Date'}</Header3Text>
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
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#FFF',
    color: '#20232a',
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 'bold',
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


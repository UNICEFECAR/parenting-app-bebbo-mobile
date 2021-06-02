import React, {useState} from 'react';
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Platform,
  Pressable,
  Text,
} from 'react-native';
import {Header3Text} from '../styles/style';
import CheckBox from './Checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';

const ChildDate = () => {
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
    <View>
      <Header3Text>Child Date of Birth / Expected due date</Header3Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 3, backgroundColor: 'red'}}>
          <Header3Text> {dobDate ? dobDate.toDateString() : null}</Header3Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'green'}}>
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
      <CheckBox label="Baby Born Prematurely" checkedValue={false} />
      <Header3Text>Original due date</Header3Text>

      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 3, backgroundColor: 'red'}}>
          <Header3Text> {dueDate ? dueDate.toDateString() : null}</Header3Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'darkorange'}}>
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
            onChange={ondueDateChange}
          />
        )}
      </View>
    </View>
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
});
